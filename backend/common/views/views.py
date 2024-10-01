# pylint: disable=too-many-lines, protected-access, too-many-locals
# import re
# import unicodedata
from datetime import date, datetime

from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import IntegrityError, transaction
from django.db.models import Avg, Count, F, Q
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.views import generic

import bcrypt
from common import serializers
from common.exceptions import Conflict
from common.filters import ClienteFilter
from common.mixins.mixins import TrackUserMixin
from common.models import (
    Cliente,
    ColetaEntregaModel,
    Plantao,
    Profissao,
    Profissional,
    Sequenciaetiqueta,
    SolicitacaoEsterilizacaoItemModel,
    SolicitacaoEsterilizacaoModel,
    Usuario,
    Veiculo,
)
from common.permissions import GroupPermission
from common.responses import SuccessResponse
from common.serializers import (
    BadRequestErrorSerializer,
    ForbiddenErrorSerializer,
    NotFoundErrorSerializer,
    SerializacaoCadastroUsuarioProfissional,
    VeiculoSerializer,
)
from common.services import GestaoLogisticaService
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import filters
from rest_framework import serializers as rest_serializers
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import (
    APIException,
    NotFound,
    PermissionDenied,
    ValidationError,
)
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.views import TokenObtainPairView
from users.models import Motorista, User


class IndexView(generic.TemplateView):
    template_name = "common/index.html"


class CustomPagination(PageNumberPagination):
    page_size = 10

    def get_paginated_response(self, data):
        paginator = self.page.paginator
        original_dict = data[0]

        meta_data = {
            "currentPage": int(self.request.query_params.get("page", 1)),
            "totalItems": paginator.count,
            "itemsPerPage": paginator.per_page,
            "totalPages": paginator.num_pages,
        }

        result = dict(original_dict)
        result["meta"] = meta_data

        return Response(result, status=status.HTTP_200_OK)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = serializers.CustomTokenObtainPairSerializer


class RestViewSet(viewsets.ViewSet):
    @action(
        detail=False,
        methods=["get"],
        # TODO rever essa permissão
        permission_classes=[AllowAny],
        url_path="rest-check",
    )
    def rest_check(self, request):
        return Response(
            {"result": "If you're seeing this, the REST API is working!"},
            status=status.HTTP_200_OK,
        )


# pylint: disable=too-many-ancestors
class ClienteViewSet(TrackUserMixin, ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = serializers.ClienteSerializer
    permission_classes_by_action = {
        "list": [IsAuthenticated],
        "default": [GroupPermission("ADMINISTRATIVO")],
    }
    filter_backends = [DjangoFilterBackend]
    filterset_class = ClienteFilter

    def get_queryset_status(self):
        queryset = super().get_queryset().order_by("-idcli")
        return queryset

    def get_queryset(self):
        queryset = super().get_queryset().order_by("-idcli")
        search = self.request.query_params.get("search", None)
        status_param = self.request.query_params.get("status", None)

        if status_param:
            status_mapping = {
                "ativo": Cliente.objects.clientes_ativos(),
                "inativo": Cliente.objects.clientes_inativos(),
                "ambos": Cliente.objects.todos_clientes(),
            }

            queryset = status_mapping.get(
                status_param.lower(), Cliente.objects.clientes_ativos()
            )

            if search is not None and search != "":
                queryset = queryset.filter(
                    Q(nomecli__icontains=search)
                    | Q(nomeabreviado__icontains=search)
                    | Q(nomefantasiacli__icontains=search)
                    | Q(cnpjcli__icontains=search)
                )
        else:
            queryset = Cliente.objects.clientes_ativos()

        return queryset

    def list(self, request, *args, **kwargs):
        """Lista todos os clientes cadastrados, com paginação.

        Args:
            request (_type_): Dados da requisição.

        Raises:
            NotFound: Quando queryset esta vazia.
            APIException: Qualquer outra exceção.

        Returns:
            Response: Retorna uma lista de clientes com paginação.
        """
        paginator = CustomPagination()
        paginated_queryset = paginator.paginate_queryset(
            self.get_queryset(), request
        )
        if not paginated_queryset:
            return SuccessResponse(data=[], status_code=status.HTTP_200_OK)

        serializer = self.serializer_class(
            paginated_queryset, many=True, context={"request": request}
        )

        contagem_por_cliente = (
            Profissional.objects.values("cliente")
            .annotate(badge=Count("idprofissional"))
            .order_by("cliente")
        )
        clientes_dicionarios = serializer.data
        for item in contagem_por_cliente:
            cliente_id = item["cliente"]
            total_profissionais = item["badge"]

            for cliente_dict in clientes_dicionarios:
                if cliente_dict["idcli"] == cliente_id:
                    cliente_dict["badge"] = total_profissionais
                    break

        sorted_data = sorted(
            clientes_dicionarios, key=lambda x: x["idcli"], reverse=True
        )

        response_data = (
            {
                "status": "success",
                "data": sorted_data,
            },
        )

        return paginator.get_paginated_response(
            response_data,
        )

    def create(self, request, *args, **kwargs):
        """Cria um novo cliente com base nos dados enviados na requisição.

        Args:
            request (_type_): Dados da requisição.

        Raises:
            ValidationError: Em caso de erro de integridade no banco de dados.
            ValidationError: Em caso de erro inesperado (catch-all).

        Returns:
            _type_: Retorna o cliente criado.
        """
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_201_CREATED,
                headers=headers,
            )
        except IntegrityError as e:
            raise rest_serializers.ValidationError(
                f"Erro ao criar cliente: {str(e)}"
            ) from e

    def retrieve(self, request, *args, **kwargs):
        """Retorna um cliente específico.

        Args:
            request (_type_): Dados da requisição.

        Raises:
            NotFound: Quando o cliente não é encontrado.

        Returns:
            _type_: Retorna o cliente encontrado.
        """
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
        except Http404 as exc:
            raise NotFound(
                detail="Cliente não encontrado.", code="cliente_nao_encontrado"
            ) from exc
        return Response({"status": "success", "data": serializer.data})

    def update(self, request, *args, **kwargs):
        """Atualiza um cliente específico.

        Args:
            request (_type_): Dados da requisição.

        Returns:
            Response: Retorna o cliente atualizado.
        """
        try:
            partial = kwargs.pop("partial", False)
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=partial
            )
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            if getattr(instance, "_prefetched_objects_cache", None):
                instance._prefetched_objects_cache = {}

            return Response({"status": "success", "data": serializer.data})
        except Http404 as exc:
            raise NotFound(
                detail="Cliente não encontrado.", code="cliente_nao_encontrado"
            ) from exc

    def destroy(self, request, *args, **kwargs):
        """Deleta um cliente específico.


        Args:
            request (_type_): Dados da requisição.
            pk (_type_): ID do cliente.


        Raises:
            NotFound: Quando o cliente não é encontrado.
            ValidationError: Quando o cliente possui relacionamentos.

        Returns:
            Response: Retorna uma mensagem de sucesso.
        """
        try:
            client_instance = self.get_object()

            for related_object in client_instance._meta.related_objects:
                if related_object.field.is_relation:
                    related_model = related_object.related_model
                    # model_verbose_name = Cliente._meta.get_field(
                    #     "idcli"
                    # ).verbose_name
                    # normalize_property = (
                    #     unicodedata.normalize("NFKD", model_verbose_name)
                    #     .encode("ASCII", "ignore")
                    #     .decode("utf-8")
                    # )
                    # regular_property = re.sub(
                    #     r"[^\w\s]", "", normalize_property
                    # )
                    has_relation = related_model.objects.filter(
                        **{related_object.field.name: client_instance}
                    ).exists()
                    if has_relation:
                        raise ValidationError(
                            "Este cliente está vinculado a um usuário e não pode ser excluído."
                        )
            client_instance.delete()
            return Response("Cliente excluído")

        except Http404 as exc:
            raise NotFound(
                detail="Cliente não encontrado.", code="cliente_nao_encontrado"
            ) from exc

        except DjangoValidationError as e:
            raise ValidationError(str(e.message), e.code) from e

    def ativar(self, request, cliente_id):
        """Ativa um cliente específico."""
        try:
            cliente = get_object_or_404(
                self.get_queryset_status(), pk=cliente_id
            )
            if cliente.ativo:
                raise Conflict("Cliente já está ativo.", "cliente_ja_ativo")

            cliente = Cliente.objects.get(pk=cliente_id)

            if cliente.ativo:
                raise Conflict("Cliente já está ativo.", "cliente_ja_ativo")

            cliente.ativar()

            return Response(
                {
                    "status": "success",
                    "data": [],
                    "message": "Cliente ativado com sucesso.",
                },
                status=status.HTTP_200_OK,
            )
        except Http404 as exc:
            raise NotFound(
                f"Cliente {cliente_id} não encontrado.",
                "cliente_nao_encontrado",
            ) from exc

    def desativar(self, request, cliente_id):
        try:
            cliente = get_object_or_404(self.get_queryset(), pk=cliente_id)

            if not cliente.ativo:
                raise Conflict(
                    "Cliente já está desativado.", "cliente_ja_desativado"
                )

            if cliente.diario_ocorrencias_ativo:
                raise ValidationError(
                    "Cliente possui ocorrências em aberto, feche-as antes de desativar.",
                    "cliente_ocorrencias_pendentes",
                )

            cliente.desativar()
            return Response(
                {
                    "status": "success",
                    "data": [],
                    "message": "Cliente desativado com sucesso.",
                },
                status=status.HTTP_200_OK,
            )
        except Http404 as exc:
            raise NotFound(
                f"Cliente {cliente_id} não encontrado.",
                "cliente_nao_encontrado",
            ) from exc

        except DjangoValidationError as exc:
            raise ValidationError(exc) from exc


class UsuarioViewSet(viewsets.ViewSet):
    queryset = Usuario.objects.all()

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        return serializer_class(*args, **kwargs)

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.SerializacaoUsuario

        if self.action == "retrieve":
            return serializers.SerializacaoProfissional

        if self.action == "update":
            return serializers.SerializacaoProfissional

        if self.action == "alterar_senha":
            return serializers.SerializacaoUsuario

        return serializers.SerializacaoUsuario

    def retrieve(self, request):
        """Retorna dados de um usuário logado.

        Args:
            request (_type_): Dados da requisição.

        Raises:
            NotFound: Quando o usuário não é encontrado.

        Returns:
            _type_: Retorna o usuário encontrado.
        """
        try:
            user = request.user
            profissional = Profissional.objects.get(
                idprofissional=user.idprofissional_id
            )
            cliente = None

            if profissional.cliente:
                cliente = profissional.cliente.nomecli

            profissao = profissional.idprofissao

        except Profissional.DoesNotExist as exc:
            raise NotFound(
                "Usuário não encontrado.", "usuario_nao_encontrado"
            ) from exc

        response_data = {
            "infos": {
                "nome": profissional.nome,
                "contato": profissional.contato,
                "email": profissional.email,
                "sexo": profissional.sexo,
                "profissao": str(profissao),
                "dtnascimento": profissional.dtnascimento,
                "cpf": profissional.cpf,
                "cliente": cliente,
                "dtcadastro": profissional.dtcadastro,
                "dtadmissao": profissional.dtadmissao,
                "matricula": profissional.matricula,
                "responsável_tecnico": profissional.rt,
            },
            "conta": {
                "usuario": user.username,
                "grupos": list(user.groups.values_list("name", flat=True)),
                "staff": user.is_staff,
                "super_usuario": user.is_superuser,
            },
        }

        if user.has_coren:
            response_data["infos"]["coren"] = profissional.coren
            # TODO ver máscara do COREN

        return Response({"status": "success", "data": response_data})

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        try:
            user = request.user
            instance = Profissional.objects.get(
                idprofissional=user.idprofissional_id
            )
            serializer = self.get_serializer(
                instance, data=request.data, partial=True
            )

            if serializer.is_valid():
                if user.has_coren:
                    if "coren" in serializer.validated_data:
                        instance.coren = serializer.validated_data["coren"]

                instance.nome = serializer.validated_data.get(
                    "nome", instance.nome
                )
                instance.contato = serializer.validated_data.get(
                    "contato", instance.contato
                )
                instance.email = serializer.validated_data.get(
                    "email", instance.email
                )
                instance.sexo = serializer.validated_data.get(
                    "sexo", instance.sexo
                )
                instance.dtnascimento = serializer.validated_data.get(
                    "dtnascimento", instance.dtnascimento
                )

                instance.save()

                return Response(
                    {
                        "status": "success",
                        "message": "Usuário atualizado com sucesso.",
                    }
                )

            return Response(
                {"status": "error", "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Usuario.DoesNotExist:
            return Response(
                {"status": "error", "message": "Usuário não encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=True, methods=["PATCH"])
    def alterar_senha(self, request):
        try:
            senha_atual = request.data.get("senha_atual", None)
            nova_senha = request.data.get("nova_senha", None)

            if not nova_senha:
                return Response(
                    {
                        "status": "error",
                        "error": {
                            "code": "senha_nao_informada",
                            "message": "Informe a nova senha",
                        },
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = User.objects.get(pk=request.user.id)

            if not user.check_password(senha_atual):
                return Response(
                    {
                        "status": "error",
                        "error": {
                            "code": "senha_invalida",
                            "message": "Senha atual inválida.",
                        },
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.set_password(nova_senha)
            user.save()

            return Response(
                {
                    "status": "success",
                    "data": {
                        "code": "success",
                        "message": "Senha alterada com sucesso.",
                    },
                },
                status=200,
            )

        except User.DoesNotExist:
            return Response({"error": "Usuário não encontrado."}, status=404)

        except Exception as e:
            raise APIException(
                detail=str(e), code=status.HTTP_400_BAD_REQUEST
            ) from e


class CadastroUsuarioProfissionalViewSet(ModelViewSet):
    pagination_class = None

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.SerializacaoUser

        return serializers.SerializacaoProfissional

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())
        return serializer_class(*args, **kwargs)

    def get_querysetuser(self):
        queryset = User.objects.get(id=self.kwargs.get("pk"))
        return queryset

    def get_object(self):
        try:
            iduser = User.objects.get(id=self.kwargs.get("pk"))
            profissional = Profissional.objects.get(
                idprofissional=iduser.idprofissional.idprofissional
            )
            self.check_object_permissions(self.request, profissional)
            return profissional
        except Profissional.DoesNotExist as exc:
            raise APIException(
                detail="Profissional não encontrado",
                code=status.HTTP_404_NOT_FOUND,
            ) from exc

    def get_queryset(self):
        queryset = Profissional.objects.all().order_by("-idprofissional")
        nome = self.request.query_params.get("nome", None)
        cpf = self.request.query_params.get("cpf", None)

        if nome is not None and nome != "":
            queryset = queryset.filter(nome__icontains=nome)

        if cpf is not None and cpf != "":
            queryset = queryset.filter(cpf__icontains=cpf)

        return queryset

    def check_permission(self, user):
        """Verifica se o usuário tem permissão para editar."""
        if user.id == 1:
            raise ValidationError(
                "Este usuário não pode ser editado.",
                code="nao_permitido",
            )

    @extend_schema(
        summary="Busca por ID",
        request=SerializacaoCadastroUsuarioProfissional,
        responses={
            200: OpenApiResponse(
                response=serializers.SerializacaoProfissional,
                description="Ok",
            ),
            400: OpenApiResponse(
                response=BadRequestErrorSerializer,
                description="Bad request (something invalid)",
            ),
            403: OpenApiResponse(
                response=ForbiddenErrorSerializer,
                description="Forbidden",
            ),
            404: OpenApiResponse(
                response=NotFoundErrorSerializer,
                description="NotFound",
            ),
        },
    )
    def retrieve(self, request, *args, **kwargs):
        """
        # Retorna um usuário específico.

         # Parâmetros:
        # - Id: valor referente a posição do usuário no banco

        """
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)

        except Exception as e:
            raise NotFound(
                "Usuario não encontrado.", "usuario_nao_encontrado"
            ) from e

    @extend_schema(
        summary="Listagem",
        responses={
            200: OpenApiResponse(
                response=serializers.SerializacaoProfissional, description="Ok"
            ),
            400: OpenApiResponse(
                response=BadRequestErrorSerializer,
                description="Bad request (something invalid)",
            ),
            403: OpenApiResponse(
                response=ForbiddenErrorSerializer,
                description="Forbidden",
            ),
        },
    )
    def list(self, request, *args, **kwargs):
        """
        # Lista os profissionais da cme que estao cadastrados.
        """

        try:
            paginator = PageNumberPagination()
            paginated_queryset = paginator.paginate_queryset(
                self.get_queryset(), request
            )

            serializer = self.get_serializer(
                paginated_queryset, many=True, context={"request": request}
            )

            return Response(
                {
                    "status": "success",
                    "data": serializer.data,
                    "meta": {
                        "currentPage": request.query_params.get("page", 1),
                        "totalItems": paginator.page.paginator.count,
                        "itemsPerPage": paginator.page_size,
                        "totalPages": paginator.page.paginator.num_pages,
                    },
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:
            raise APIException(
                detail=str(exc), code=status.HTTP_400_BAD_REQUEST
            ) from exc

    @extend_schema(
        summary="Criacao",
        request=SerializacaoCadastroUsuarioProfissional,
        responses={
            201: OpenApiResponse(
                response=serializers.SerializacaoProfissional,
                description="Created",
            ),
            400: OpenApiResponse(
                response=BadRequestErrorSerializer,
                description="Bad request (something invalid)",
            ),
            403: OpenApiResponse(
                response=ForbiddenErrorSerializer,
                description="Forbidden",
            ),
        },
    )
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            profissional_data = request.data.get("Profissional")
            user_data = request.data.get("Usuario")
            grupos_data = user_data.get("grupos", [])

            profissional_data["status"] = "ADMITIDO"
            profissional_data["atrelado"] = "N"
            profissional_data["dtcadastro"] = datetime.now().date()
            email = profissional_data.get("email")
            if email is None:
                profissional_data["email"] = ""
            serializer_profissional = serializers.SerializacaoProfissional(
                data=profissional_data, context={"request": request}
            )
            serializer_profissional.is_valid(raise_exception=True)
            profissional = serializer_profissional.save()

            user_data["idprofissional"] = profissional.idprofissional
            user_data["password"] = make_password(
                f"Bringel@{datetime.now().year}"
            )
            user_data["email"] = profissional_data["email"]
            serializer_user = serializers.SerializacaoUser(data=user_data)
            serializer_user.is_valid(raise_exception=True)
            user_instance = serializer_user.save()
            grupos_existentes = Group.objects.filter(pk__in=grupos_data)
            user_instance.groups.add(*grupos_existentes)
            user_instance.save()

            usuario_data = {}
            usuario_data["apelidousu"] = user_data["username"]
            usuario_data["ativo"] = True
            usuario_data["datacadastrousu"] = profissional_data["dtcadastro"]
            usuario_data["senhausu"] = user_data["password"]
            usuario_data["idprofissional"] = user_data["idprofissional"]
            usuario_serializer = serializers.SerializacaoUsuario(
                data=usuario_data
            )
            usuario_serializer.is_valid(raise_exception=True)
            usuario_serializer.save()
            return Response(
                "Cadastro efetuado com sucesso.",
                status=status.HTTP_201_CREATED,
            )
        except IntegrityError as e:
            raise rest_serializers.ValidationError(
                f"Erro ao criar usuário: {str(e)}"
            ) from e

    # TODO: Remover esse disable:
    # pylint: disable=arguments-differ

    @extend_schema(
        summary="Atualização",
        request=SerializacaoCadastroUsuarioProfissional,
        responses={
            201: OpenApiResponse(
                response=serializers.SerializacaoProfissional,
                description="Created",
            ),
            400: OpenApiResponse(
                response=BadRequestErrorSerializer,
                description="Bad request (something invalid)",
            ),
            403: OpenApiResponse(
                response=ForbiddenErrorSerializer,
                description="Forbidden",
            ),
            404: OpenApiResponse(
                response=NotFoundErrorSerializer,
                description="NotFound",
            ),
        },
    )
    @transaction.atomic
    def update(self, request, pk=None):
        """
        # Atualiza todos os campos de um usuário específico.

         # Parâmetros:
        # - Id: valor referente a posição do usuário no banco
        """
        try:
            user = User.objects.get(id=pk)
            self.check_permission(user)
            profissional = Profissional.objects.get(
                idprofissional=user.idprofissional.idprofissional
            )
            serializer = serializers.SerializacaoProfissional(
                profissional,
                data=request.data,
                partial=True,
                context={"request": request},
            )
            if profissional.status != "ADMITIDO":
                raise ValidationError(
                    "Este profissional está desativado, não pode ser editado.",
                )
            grupos = request.data.get("grupos")
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                if grupos is not None:
                    user.groups.clear()
                    grupos_existentes = Group.objects.filter(pk__in=grupos)
                    user.groups.add(*grupos_existentes)
            user.save()

            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

        except User.DoesNotExist as exc:
            raise NotFound(
                "User não encontrado.",
                "user_nao_encontrado",
            ) from exc

        except Profissional.DoesNotExist as exc:
            raise NotFound(
                "Profissional não encontrado.", "profissional_nao_encontrado"
            ) from exc

        except Exception as exc:
            raise exc

    # TODO: Remover esse disable:
    # pylint: disable=arguments-differ

    @extend_schema(
        summary="Excluir",
        request=SerializacaoCadastroUsuarioProfissional,
        responses={
            200: OpenApiResponse(
                response=serializers.SerializacaoProfissional,
                description="OK",
            ),
            400: OpenApiResponse(
                response=BadRequestErrorSerializer,
                description="Bad request (something invalid)",
            ),
            403: OpenApiResponse(
                response=ForbiddenErrorSerializer,
                description="Forbidden",
            ),
            404: OpenApiResponse(
                response=NotFoundErrorSerializer,
                description="NotFound",
            ),
        },
    )
    def destroy(self, request, pk=None):
        """
        # Deleta um usuário específico.

        Raises:
                NotFound: Quando o motorista não é encontrado.

        Returns:
                Response: Retorna uma mensagem de sucesso.
        """
        try:
            user = User.objects.get(id=pk)
            self.check_permission(user)
            usuario = Usuario.objects.get(
                idprofissional=user.idprofissional.idprofissional
            )
            profissional = Profissional.objects.get(
                idprofissional=user.idprofissional.idprofissional
            )

            user.delete()
            usuario.delete()
            profissional.delete()

            return Response(
                {
                    "status": "success",
                    "data": {
                        "code": "excluido_sucesso",
                        "message": "Profissional excluído com sucesso!",
                    },
                }
            )

        except User.DoesNotExist as exc:
            raise NotFound(
                f"Usuário {pk} não encontrado.",
                "usuario_nao_encontrado",
            ) from exc

        except Usuario.DoesNotExist as exc:
            raise NotFound(
                f"Motorista {pk} não encontrado.",
                "usuariolegacy_nao_encontrado",
            ) from exc

        except Profissional.DoesNotExist as exc:
            raise NotFound(
                f"Profissional {pk} não encontrado.",
                "profissional_nao_encontrado",
            ) from exc

        except Exception as exc:
            raise exc

    @transaction.atomic
    @extend_schema(
        summary="Desativar",
        request=SerializacaoCadastroUsuarioProfissional,
        responses={
            200: OpenApiResponse(
                response=serializers.SerializacaoProfissional,
                description="OK",
            ),
            400: OpenApiResponse(
                response=BadRequestErrorSerializer,
                description="Bad request (something invalid)",
            ),
            403: OpenApiResponse(
                response=ForbiddenErrorSerializer,
                description="Forbidden",
            ),
            404: OpenApiResponse(
                response=NotFoundErrorSerializer,
                description="NotFound",
            ),
        },
    )
    @action(
        detail=True,
        methods=["patch"],
        url_path="desativar",
        url_name="desativar",
    )
    def desativar(self, request, *args, **kwargs):
        """
        # Desativa um usuário específico.

         # Parâmetros:
        # - Id: valor referente a posição do usuário no banco
        """
        try:
            user = self.get_querysetuser()
            self.check_permission(user)
            profissional = self.get_object()
            profissional.status = "DESATIVADO"
            profissional.save()
            user.deactivate()
            user.save()
            return Response(
                {
                    "status": "success",
                    "data": [],
                    "message": "Usuário desativado com sucesso.",
                },
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist as exc:
            raise NotFound("Usuario não encontrado.", "erro_usuario") from exc

        except Exception as exc:
            raise exc

    @extend_schema(
        summary="Ativar",
        request=SerializacaoCadastroUsuarioProfissional,
        responses={
            200: OpenApiResponse(
                response=serializers.SerializacaoProfissional,
                description="OK",
            ),
            400: OpenApiResponse(
                response=BadRequestErrorSerializer,
                description="Bad request (something invalid)",
            ),
            403: OpenApiResponse(
                response=ForbiddenErrorSerializer,
                description="Forbidden",
            ),
            404: OpenApiResponse(
                response=NotFoundErrorSerializer,
                description="NotFound",
            ),
        },
    )
    @transaction.atomic
    @action(
        detail=True,
        methods=["patch"],
        url_path="ativar",
        url_name="ativar",
    )
    def ativar(self, request, *args, **kwargs):
        """
        # Ativa um usuário específico.

         # Parâmetros:
        # - Id: valor referente a posição do usuário no banco
        """
        try:
            user = self.get_querysetuser()
            self.check_permission(user)
            profissional = self.get_object()
            profissional.status = "ADMITIDO"
            profissional.save()
            user.activate()
            return Response(
                {
                    "status": "success",
                    "data": [],
                    "message": "Usuário ativado com sucesso.",
                },
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist as exc:
            raise NotFound("Usuario não encontrado.", "erro_usuario") from exc

        except Exception as exc:
            raise exc

    @extend_schema(
        summary="Resetar",
        request=SerializacaoCadastroUsuarioProfissional,
        responses={
            200: OpenApiResponse(
                response=serializers.SerializacaoProfissional,
                description="OK",
            ),
            400: OpenApiResponse(
                response=BadRequestErrorSerializer,
                description="Bad request (something invalid)",
            ),
            403: OpenApiResponse(
                response=ForbiddenErrorSerializer,
                description="Forbidden",
            ),
            404: OpenApiResponse(
                response=NotFoundErrorSerializer,
                description="NotFound",
            ),
        },
    )
    @transaction.atomic
    @action(
        detail=True,
        methods=["patch"],
        url_path="resetar-senha",
        url_name="resetar_senha",
    )
    def resetar_senha(self, request, pk=None):
        """
        # Reseta a senha de um usuário específico.

         # Parâmetros:
        # - Id: valor referente a posição do usuário no banco
        """
        try:
            user = self.get_querysetuser()
            self.check_permission(user)
            senha_padrao = f"Bringel@{datetime.now().year}"
            user.password = make_password(senha_padrao)
            user.save()

            return Response(
                {
                    "status": "success",
                    "data": {
                        "code": "senha_resetada",
                        "message": "Senha resetada para valor padrão.",
                    },
                }
            )

        except User.DoesNotExist as exc:
            raise NotFound(
                f"Usuário {pk} não encontrado.",
                "usuario_nao_encontrado",
            ) from exc

        except PermissionDenied as e:
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_403_FORBIDDEN,
            )

        except Exception as exc:
            raise exc


@extend_schema(deprecated=True)
class BuscaClientePorCaixaVinculadaViewSet(viewsets.ViewSet):
    """Este endpoint foi descontinuado (deprecated), utilize o
    endpoint /api/cliente/lista-de-caixas a partir de agora."""

    def list(self, request):
        try:
            cliente = Cliente.objects.get(
                idcli=request.user.idprofissional.cliente.idcli
            )
            caixas = cliente.modelos_caixa
            custom_response = []
            for caixa in caixas:
                sequencia = Sequenciaetiqueta.objects.filter(idcaixa=caixa.id)
                serializer = serializers.CaixaSerialSerializer(
                    sequencia, many=True
                )
                if serializer.data:
                    for item in serializer.data:
                        item.pop("idcaixa")
                    custom_response.extend(serializer.data)
            if custom_response:
                return Response(custom_response)

            return Response("Nenhuma sequência encontrada.")

        except Cliente.DoesNotExist as exc:
            raise NotFound("Nenhuma sequência encontrada.") from exc


class VeiculoViewSet(TrackUserMixin, viewsets.ModelViewSet):
    """
    ViewSet para listar, criar, atualizar e deletar veículos
    """

    queryset = Veiculo.objects.all()
    serializer_class = VeiculoSerializer

    def list(self, request, *args, **kwargs):
        """Lista todos os veículos cadastrados com paginação.

        Args:
            request (_type_): Dados da requisição.

        Raises:
            NotFound: Quando queryset esta vazia.
            APIException: Qualquer outra exceção.

        Returns:
            Response: Retorna uma lista de veículos com paginação.
        """
        try:
            paginator = PageNumberPagination()
            paginated_queryset = paginator.paginate_queryset(
                self.get_queryset(), request
            )

            if not paginated_queryset:
                return SuccessResponse(data=[], status_code=status.HTTP_200_OK)

            serializer = self.serializer_class(
                paginated_queryset, many=True, context={"request": request}
            )

            return Response(
                {
                    "status": "success",
                    "data": serializer.data,
                    "meta": {
                        "currentPage": request.query_params.get("page", 1),
                        "totalItems": paginator.page.paginator.count,
                        "itemsPerPage": paginator.page_size,
                        "totalPages": paginator.page.paginator.num_pages,
                    },
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            raise APIException(str(e)) from e

    def create(self, request, *args, **kwargs):
        """Cria um novo veículo com base nos dados enviados na requisição.

        Args:
            request (_type_): Dados da requisição.

        Raises:
            ValidationError: Em caso de erro de integridade no banco de dados.
            ValidationError: Em caso de erro inesperado (catch-all).

        Returns:
            _type_: Retorna o veículo criado.
        """
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_201_CREATED,
                headers=headers,
            )
        except IntegrityError as e:
            raise rest_serializers.ValidationError(
                f"Erro ao criar veículo: {str(e)}"
            )

    def retrieve(self, request, *args, **kwargs):
        """Retorna um veículo específico.

        Args:
            request (_type_): Dados da requisição.

        Raises:
            NotFound: Quando o veículo não é encontrado.

        Returns:
            _type_: Retorna o veículo encontrado.
        """
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
        except Http404 as exc:
            raise NotFound("Veiculo não encontrado.") from exc
        return Response({"status": "success", "data": serializer.data})

    def update(self, request, *args, **kwargs):
        """Atualiza um veículo específico.

        Args:
            request (_type_): Dados da requisição.

        Returns:
            Response: Retorna o veículo atualizado.
        """
        try:
            partial = kwargs.pop("partial", False)
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=partial
            )
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            if getattr(instance, "_prefetched_objects_cache", None):
                instance._prefetched_objects_cache = {}

            return Response({"status": "success", "data": serializer.data})
        except Http404 as exc:
            raise NotFound("Veiculo não encontrado.") from exc

    def destroy(self, request, *args, **kwargs):
        """Deleta um veículo específico.

        Raises:
            NotFound: Quando o veículo não é encontrado.

        Returns:
            Response: Retorna uma mensagem de sucesso.
        """
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Http404 as e:
            raise NotFound("Veiculo não encontrado.") from e
        except DjangoValidationError as e:
            raise ValidationError(str(e.message), e.code) from e

    def perform_destroy(self, instance):
        """
        Overriding do metodo 'perform_destroy' para deletar a foto do veiculo
        """
        try:
            if instance.foto:
                instance.foto.delete()
        except FileNotFoundError:
            pass

        instance.delete()


class VeiculoBuscaPorParametroPlacaViewSet(viewsets.ViewSet):
    queryset = Veiculo.objects.all()
    serializer_class = serializers.VeiculoSerializer

    def busca_por_placa(self, request, placa=None):
        placa = request.query_params.get("placa", placa)
        veiculos = self.queryset.filter(placa__icontains=placa)
        serializer = self.serializer_class(veiculos, many=True)
        return Response(serializer.data)


class MotoristaViewSet(ModelViewSet):
    filter_backends = [filters.SearchFilter]
    search_fields = ["nome"]

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.SerializacaoUsuario

        if self.action == "list":
            return serializers.SerializacaoMotorista

        return serializers.SerializacaoProfissional

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs.setdefault("context", self.get_serializer_context())
        return serializer_class(*args, **kwargs)

    def get_queryset(self):
        queryset = Profissional.objects.filter(
            idprofissao__descricao="MOTORISTA"
        ).order_by(("idprofissional"))
        return queryset

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(
                self.get_queryset().order_by("-idprofissional")
            )
            paginator = PageNumberPagination()
            paginated_queryset = paginator.paginate_queryset(queryset, request)

            serializer = self.get_serializer(
                paginated_queryset, many=True, context={"request": request}
            )

            return Response(
                {
                    "status": "success",
                    "data": serializer.data,
                    "meta": {
                        "currentPage": request.query_params.get("page", 1),
                        "totalItems": paginator.page.paginator.count,
                        "itemsPerPage": paginator.page_size,
                        "totalPages": paginator.page.paginator.num_pages,
                    },
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:
            raise APIException(
                detail=str(exc), code=status.HTTP_400_BAD_REQUEST
            ) from exc

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        request.data["atrelado"] = "S"
        request.data["dtadmissao"] = date.today().strftime("%Y-%m-%d")
        request.data["dtcadastro"] = date.today().strftime("%Y-%m-%d")
        request.data["dtdesligamento"] = None
        request.data["rt"] = "N"
        request.data["status"] = "ADMITIDO"
        profissao = Profissao.objects.filter(
            Q(descricao__iexact="MOTORISTA")
        ).first()

        request.data["idprofissao"] = profissao.id

        serializer = serializers.SerializacaoProfissional(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid(raise_exception=True):
            matricula = serializer.validated_data.get("matricula", None)

            if matricula is not None:
                profissional_matricula = Profissional.objects.filter(
                    Q(matricula=matricula)
                ).first()

                if profissional_matricula is not None:
                    raise Conflict(
                        "Matricula já cadastrada", status.HTTP_409_CONFLICT
                    )
        serializer_profissional = serializers.SerializacaoProfissional(
            data=request.data, partial=True, context={"request": request}
        )

        serializer_profissional.is_valid(raise_exception=True)
        profissional = serializer_profissional.save()

        datauser = request.data
        senha_user = request.data["senhausu"]
        datauser["idprofissional"] = profissional.idprofissional
        datauser["ativo"] = True

        if request.data["senhausu"] is not None:
            senha_criptografada = bcrypt.hashpw(
                request.data["senhausu"].encode("utf-8"), bcrypt.gensalt()
            )
            datauser["senhausu"] = senha_criptografada.decode("utf-8")
            datauser["datacadastrousu"] = date.today().strftime("%Y-%m-%d")

        usuario = self.get_serializer(data=datauser, partial=True)
        usuario.is_valid(raise_exception=True)
        usuario.save()

        user = User.objects.create_user(
            password=senha_user,
            username=datauser["apelidousu"],
            idprofissional=Profissional.objects.get(
                idprofissional=profissional.idprofissional
            ),
        )
        grupo_motorista = Group.objects.filter(name="MOTORISTA").first()
        user.groups.add(grupo_motorista)
        user.save()

        response = {
            "nome": serializer_profissional.data["nome"],
            "cpf": serializer_profissional.data["cpf"],
            "email": serializer_profissional.data["email"],
            "matricula": serializer_profissional.data["matricula"],
            "contato": serializer_profissional.data["contato"],
            "sexo": serializer_profissional.data["sexo"],
            "status": serializer_profissional.data["status"],
        }

        return Response(
            {
                "status": "success",
                "data": response,
            },
            status=status.HTTP_201_CREATED,
        )

    # TODO: Remover esse disable:
    # pylint: disable=arguments-differ
    @transaction.atomic
    def update(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            profissional = Profissional.objects.get(
                idprofissional=user.idprofissional.idprofissional
            )
            serializer = self.get_serializer(
                profissional, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                response_data = {
                    "matricula": serializer.data["matricula"],
                    "cpf": serializer.data["cpf"],
                    "nome": serializer.data["nome"],
                    "contato": serializer.data["contato"],
                    "email": serializer.data["email"],
                    "sexo": serializer.data["sexo"],
                    "dtnascimento": serializer.data["dtnascimento"],
                }

            return Response(
                {"status": "success", "data": response_data},
                status=status.HTTP_200_OK,
            )

        except User.DoesNotExist as exc:
            raise NotFound(
                f"Usuário {pk} não encontrado.",
                "usuario_nao_encontrado",
            ) from exc

        except Exception as e:
            raise APIException(
                detail=str(e), code=status.HTTP_400_BAD_REQUEST
            ) from e

    # TODO: Remover esse disable:
    # pylint: disable=arguments-differ
    @transaction.atomic
    def destroy(self, request, pk=None):
        """Deleta um motorista específico.

        Raises:
                NotFound: Quando o motorista não é encontrado.

        Returns:
                Response: Retorna uma mensagem de sucesso.
        """
        try:
            user = Motorista.objects.get(pk=pk)
            usuario = user.usuario_legado
            profissional = Profissional.objects.get(
                idprofissional=user.idprofissional.idprofissional
            )
            if not user.is_disponivel:
                raise PermissionDenied(
                    detail="Você não pode deletar um motorista "
                    "que está alocado em um veículo.",
                    code="motorista_alocado_veiculo",
                )

            usuario.delete()
            user.delete()
            profissional.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Motorista.DoesNotExist as exc:
            raise NotFound(
                f"Usuário {pk} não encontrado.",
                "usuario_nao_encontrado",
            ) from exc
        except Exception as e:
            raise APIException(
                detail=str(e), code=status.HTTP_400_BAD_REQUEST
            ) from e

    def resetar_senha(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            if not user.is_motorista:
                return Response(
                    {
                        "status": "error",
                        "data": {
                            "code": "permissao_negada",
                            "message": "Você não tem permissão para "
                            "redefinir a senha deste usuário.",
                        },
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
            senha_padrao = f"Bringel@{datetime.now().year}"

            user.password = make_password(senha_padrao)
            user.save()

            return Response(
                {
                    "status": "success",
                    "data": {
                        "code": "senha_resetada",
                        "message": "Senha resetada para valor padrão.",
                    },
                }
            )

        except User.DoesNotExist as exc:
            raise NotFound(
                f"Usuário {pk} não encontrado.",
                "usuario_nao_encontrado",
            ) from exc

        except Exception as e:
            raise APIException(
                detail=str(e), code=status.HTTP_400_BAD_REQUEST
            ) from e


class UsuarioClienteViewSet(viewsets.ViewSet):
    serializer_class = serializers.SerializacaoUser

    def get_queryset(self):
        clientes_group = Group.objects.get(name="CLIENTE")
        users = clientes_group.user_set.filter(
            idprofissional__cliente__isnull=False,
        )
        return users.filter(
            Q(idprofissional__cliente__isnull=False)
            | Q(idprofissional__isnull=True)
        )

    def retrieve(self, request, pk=None):
        try:
            cliente = Cliente.objects.get(pk=pk)
            serializer = self.serializer_class(self.get_queryset(), many=True)
            usuarios = serializer.data
            usuarios_cliente = serializer.data
            for cliente_dict in usuarios_cliente:
                profissionaldata = Profissional.objects.get(
                    idprofissional=cliente_dict["profissional"]
                )
                profissional = (
                    {
                        "id": profissionaldata.idprofissional,
                        "cpf": profissionaldata.cpf,
                        "matricula": profissionaldata.matricula,
                        "nome": profissionaldata.nome,
                    },
                )
                cliente_dict["profissional"] = profissional[0]

            profissionaldata = Profissional.objects.filter(cliente=cliente.pk)
            ids_profissionais = [
                profissional.idprofissional
                for profissional in profissionaldata
            ]
            filtered_data = [
                item
                for item in serializer.data
                if item["profissional"]["id"] in ids_profissionais
            ]
            usuarios = filtered_data
            return Response(
                {
                    "status": "success",
                    "data": usuarios,
                },
                status=status.HTTP_200_OK,
            )

        except Cliente.DoesNotExist:
            return Response(
                {"status": "error", "detail": "Cliente não encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

    @transaction.atomic
    def create(self, request, pk=None):
        try:
            cliente = Cliente.objects.get(pk=pk)
            if cliente.ativo is False:
                raise ValidationError(
                    detail="Não é possível criar usuário para um cliente desativado.",
                    code="cliente_desativado",
                )
            request.data["atrelado"] = "S"
            request.data["dtadmissao"] = date.today().strftime("%Y-%m-%d")
            request.data["dtcadastro"] = date.today().strftime("%Y-%m-%d")
            request.data["dtdesligamento"] = None
            request.data["rt"] = "N"
            request.data["status"] = "ADMITIDO"
            request.data["idprofissao"] = 1
            request.data["cliente"] = cliente.pk

            serializer_profissional = serializers.SerializacaoProfissional(
                data=request.data, partial=True, context={"request": request}
            )
            serializer_profissional.is_valid(raise_exception=True)
            profissional = serializer_profissional.save()

            datauser = request.data
            senha_user = request.data["senhausu"]
            datauser["idprofissional"] = profissional.idprofissional
            datauser["ativo"] = True

            if request.data["senhausu"] is not None:
                senha_criptografada = bcrypt.hashpw(
                    request.data["senhausu"].encode("utf-8"), bcrypt.gensalt()
                )
                datauser["senhausu"] = senha_criptografada.decode("utf-8")
                datauser["datacadastrousu"] = date.today().strftime("%Y-%m-%d")

            usuario = serializers.SerializacaoUsuario(
                data=datauser, partial=True, context={"request": request}
            )
            usuario.is_valid(raise_exception=True)
            usuario.save()

            user = User.objects.create_user(
                password=senha_user,
                email=datauser["email"],
                username=datauser["apelidousu"],
                is_active=True,
                idprofissional=Profissional.objects.get(
                    idprofissional=profissional.idprofissional
                ),
            )
            group = Group.objects.get(name="CLIENTE")

            user.groups.add(group)
            user.save()

            group_names = list(user.groups.values_list("name", flat=True))

            response = {
                "id": user.id,
                "ultimo_login": user.last_login,
                "administrador": user.is_superuser,
                "criado_em": user.created,
                "atualizado_em": user.modified,
                "email": user.email,
                "ativo": user.is_active,
                "usuario": user.username,
                "profissional": {
                    "id": user.idprofissional.idprofissional,
                    "cpf": datauser["cpf"],
                    "matricula": datauser["matricula"],
                    "nome": datauser["nome"],
                },
                "grupos": group_names,
            }

            return Response(
                {
                    "status": "success",
                    "data": response,
                },
                status=status.HTTP_201_CREATED,
            )
        except Cliente.DoesNotExist as exc:
            raise NotFound(
                "Cliente não encontrado.", "cliente_nao_encontrado"
            ) from exc


@extend_schema(deprecated=True)
class ColetaEntregaViewSet(TrackUserMixin, ModelViewSet):
    """Este endpoint está sendo refatorado e será descontinuado em breve.
    Conversar com o time antes de usar."""

    queryset = ColetaEntregaModel.objects.all()
    serializer_class = serializers.SerializacaoColetaEntrega

    def _get_solicitacao(self, solicitacao_id):
        try:
            return SolicitacaoEsterilizacaoModel.objects.get(id=solicitacao_id)
        except SolicitacaoEsterilizacaoModel.DoesNotExist as exc:
            raise NotFound(
                "Solicitação não encontrada.", "solicitacao_nao_encontrada"
            ) from exc

    def _validate_solicitacao_status(
        self, solicitacao: SolicitacaoEsterilizacaoModel, retorno
    ):
        if retorno:
            if solicitacao.situacao != "PRONTO":
                raise Conflict(
                    "Não é possível realizar entrega, pois a "
                    "solicitação ainda não foi totalmente processada.",
                    status.HTTP_409_CONFLICT,
                )
        else:
            if not solicitacao.is_pendente:
                raise Conflict(
                    "Não é possível realizar coleta, pois a "
                    "solicitação não está pendente de entrega.",
                    status.HTTP_409_CONFLICT,
                )

        coletas = ColetaEntregaModel.objects.filter(
            solicitacao_esterilizacao=solicitacao.id
        )
        for coleta in coletas:
            if coleta.retorno is False and solicitacao.is_pendente:
                raise Conflict(
                    "Solicitação já vinculada ao motorista "
                    + str(coleta.motorista.nome),
                    status.HTTP_409_CONFLICT,
                )

            if coleta.retorno is True and solicitacao.em_transporte:
                raise Conflict(
                    "Solicitação já vinculada ao motorista "
                    + str(coleta.motorista.nome),
                    status.HTTP_409_CONFLICT,
                )

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            solicitacao = self._get_solicitacao(
                request.data.get("solicitacao_esterilizacao")
            )
            self._validate_solicitacao_status(
                solicitacao, request.data.get("retorno")
            )
            motorista = Motorista.get_motorista(request.data.get("motorista"))
            veiculo = Veiculo.get_veiculo(request.data.get("veiculo"))

            veiculo.alocar(motorista=motorista)

            if solicitacao.em_arsenal:
                solicitacao.iniciar_transporte()

            if request.data.get("retorno"):
                # cria entrega
                pass
            else:
                # cria coleta
                pass

            coleta = ColetaEntregaModel.objects.create(
                motorista=motorista,
                veiculo=veiculo,
                solicitacao_esterilizacao=solicitacao,
                retorno=request.data.get("retorno"),
            )

            return Response(
                {
                    "status": "success",
                    "message": "Motorista/Veículo vinculados à Solicitação.",
                    "data": {
                        "coleta": {
                            "id": coleta.id,
                            "situacao": solicitacao.situacao,
                            "retorno": coleta.retorno,
                        }
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        except DjangoValidationError as exc:
            raise ValidationError(exc) from exc

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        motorista = (
            Motorista.get_motorista(request.data.get("motorista"))
            if request.data.get("motorista")
            else None
        )
        veiculo = (
            Veiculo.get_veiculo(veiculo_id=request.data.get("veiculo")) or None
        )

        try:
            veiculo.desalocar()
            veiculo.alocar(motorista=motorista)

            entregas_associadas = ColetaEntregaModel.objects.filter(
                motorista=motorista
            )

            for entrega in entregas_associadas:
                if entrega.veiculo != veiculo:
                    veiculo_antigo = entrega.veiculo
                    veiculo_antigo.motorista_atual = None
                    veiculo_antigo.save()
                entrega.veiculo = veiculo
                entrega.save()

            coleta = ColetaEntregaModel.objects.get(id=kwargs.get("pk"))
            solicitacao = SolicitacaoEsterilizacaoModel.objects.get(
                id=coleta.solicitacao_esterilizacao.id
            )
            if solicitacao.em_transporte or solicitacao.is_pendente:
                coleta.motorista = motorista
                coleta.veiculo = veiculo
                coleta.save()

        except ColetaEntregaModel.DoesNotExist as exc:
            raise NotFound(
                "Alocação de veículo/motorista não encontrada.",
                "coleta_nao_encontrada",
            ) from exc

        except Veiculo.DoesNotExist as exc:
            raise NotFound(
                "Veiculo não encontrada.", "veiculo_nao_encontrado"
            ) from exc

        except DjangoValidationError as exc:
            raise ValidationError(exc) from exc

        return Response(
            {
                "status": "success",
                "message": "Motorista / Veiculo atualizado com sucesso",
                "data": {"coleta": {"id": kwargs.get("pk")}},
            },
            status=status.HTTP_200_OK,
        )

    def resetar_coleta(self, request, *args, **kwargs):
        """Remove o motorista/veiculo da coleta, resetando o seu status."""
        try:
            pk = self.kwargs.get("pk")
            coleta = ColetaEntregaModel.objects.get(id=pk)

            if coleta.solicitacao_esterilizacao.situacao == "CONCLUIDO":
                raise ValidationError(
                    "Não é possível limpar motorista/veículo.",
                    status.HTTP_409_CONFLICT,
                )

            veiculo = Veiculo.objects.get(id=coleta.veiculo.id)
            if (
                ColetaEntregaModel.objects.filter(
                    veiculo=coleta.veiculo
                ).count()
                == 1
            ):
                veiculo.motorista_atual = None
                veiculo.save()

            coleta.delete()

            return Response(
                {
                    "status": "success",
                    "data": {
                        "code": "coleta_resetada",
                        "message": "A solicitação foi atualizada e está agora"
                        " aguardando coleta.",
                    },
                }
            )

        except ColetaEntregaModel.DoesNotExist as exc:
            raise NotFound(
                "Coleta não encontrada", status.HTTP_404_NOT_FOUND
            ) from exc


class SolicitacaoViewSet(viewsets.ViewSet, TrackUserMixin):
    def get_object(self):
        queryset = self.get_queryset()
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(queryset, pk=pk)
        return obj

    def get_queryset(self):
        queryset = SolicitacaoEsterilizacaoModel.objects.all()
        return queryset

    def get_serializer_class(self):
        return serializers.SerializacaoSolicitacao

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        return serializer_class(*args, **kwargs)

    def get_querysetitem(self):
        queryset = SolicitacaoEsterilizacaoItemModel.objects.all()
        return queryset

    def get_object01(self):
        queryset = self.get_querysetitem()
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(queryset, pk=pk)
        return obj

    def list(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        if not serializer.data:
            response_null_data = {
                "status": "success",
                "data": [],
                "message": "Nenhum resultado encontrado.",
            }
            return Response(response_null_data)

        response_data = {
            "status": "success",
            "data": serializer.data,
        }
        return Response(response_data)

    def retrieve(self, request, pk=None):
        if not request.user.is_cliente:
            raise PermissionDenied(
                "Você não tem o perfil de cliente para acessar essa rotina.",
                "perfil_nao_cliente",
            )
        queryset = SolicitacaoEsterilizacaoModel.objects.all()
        solicitacao = get_object_or_404(queryset, pk=pk)
        serializer = serializers.SerializacaoSolicitacao(solicitacao)
        response_data = {
            "status": "success",
            "data": serializer.data,
        }
        return Response(response_data)

    def get_cliente(self, cliente_parametro, request):
        if cliente_parametro:
            return Cliente.objects.get(idcli=cliente_parametro)
        if request.user.is_cliente:
            return Cliente.objects.get(
                idcli=request.user.idprofissional.cliente.idcli
            )

        raise PermissionDenied(
            "Você não tem o perfil para acessar essa rotina.",
            "perfil_nao_cliente",
        )

    def fetch_codcaixa(self, id_solicitacao):
        return list(
            SolicitacaoEsterilizacaoItemModel.objects.filter(
                solicitacao_esterilizacao_id=id_solicitacao
            ).values_list("caixa", flat=True)
        )

    def fetch_solicitacao(self, solicitacoes, id_solicitacao):
        return get_object_or_404(solicitacoes, pk=id_solicitacao)

    def fetch_retorno(self, id_solicitacao):
        return ColetaEntregaModel.objects.filter(
            solicitacao_esterilizacao_id=id_solicitacao
        ).values_list("retorno", flat=True)

    def client_list_request(self, request, *args, **kwargs):
        cliente_parametro = self.kwargs.get("cliente_id")
        parametro = request.query_params.get("status")
        cliente = self.get_cliente(cliente_parametro, request)
        nome_cliente = cliente.nomecli
        solicitacoes = SolicitacaoEsterilizacaoModel.objects.filter(
            cliente_id=cliente
        )

        ids = list(solicitacoes.values_list("id", flat=True))
        ids.reverse()

        responses = []

        for id_solicitacao in ids:
            codcaixa = self.fetch_codcaixa(id_solicitacao)
            solicitacao = self.fetch_solicitacao(solicitacoes, id_solicitacao)
            retorno = self.fetch_retorno(id_solicitacao)
            has_coleta = False in retorno
            has_entrega = True in retorno
            coleta_data = None

            serializer = serializers.SerializacaoSolicitacao(solicitacao)
            response = serializer.data
            response["cliente"] = nome_cliente
            response["solicitacao:"] = id_solicitacao
            response["caixas"] = codcaixa
            response["quantidade"] = len(codcaixa)

            if has_coleta and not has_entrega and parametro == "PENDENTECME":
                instancia = ColetaEntregaModel.objects.get(
                    solicitacao_esterilizacao_id=id_solicitacao
                )
                if solicitacao.situacao == "PENDENTE":
                    response["situacao"] = "Atribuido ao Motorista"
                if solicitacao.situacao == "TRANSPORTE":
                    response["situacao"] = "Em Coleta"

                solicitacao_id = instancia.solicitacao_esterilizacao_id

                coleta_data = {
                    "created_at": instancia.created_at,
                    "updated_at": instancia.updated_at,
                    "created_by": instancia.created_by,
                    "updated_by": instancia.updated_by,
                    "solicitacao_esterilizacao": solicitacao_id,
                    "motorista": {
                        "id": instancia.motorista.id,
                        "nome": instancia.motorista.nome,
                    }
                    if instancia.motorista
                    else None,
                    "veiculo": {
                        "id": instancia.veiculo.id,
                        "modelo": instancia.veiculo.modelo,
                        "placa": instancia.veiculo.placa,
                    }
                    if instancia.veiculo
                    else None,
                    "retorno": instancia.retorno,
                    "idcoleta": instancia.id,
                }
                response["coleta"] = coleta_data

            if (
                has_coleta
                and has_entrega
                and (parametro == "ANDAMENTO" or parametro is None)
            ):
                instancia = ColetaEntregaModel.objects.get(
                    solicitacao_esterilizacao_id=id_solicitacao, retorno=True
                )

                if solicitacao.situacao == "TRANSPORTE":
                    response["situacao"] = "Em Transporte"
                elif solicitacao.situacao == "ENTREGUE":
                    response["situacao"] = "Entregue"

                solicitacao_id = instancia.solicitacao_esterilizacao_id

                entrega_data = {
                    "created_at": instancia.created_at,
                    "updated_at": instancia.updated_at,
                    "created_by": instancia.created_by,
                    "updated_by": instancia.updated_by,
                    "solicitacao_esterilizacao": solicitacao_id,
                    "motorista": {
                        "id": instancia.motorista.id,
                        "nome": instancia.motorista.nome,
                    }
                    if instancia.motorista
                    else None,
                    "veiculo": {
                        "id": instancia.veiculo.id,
                        "modelo": instancia.veiculo.modelo,
                        "placa": instancia.veiculo.placa,
                    }
                    if instancia.veiculo
                    else None,
                    "retorno": instancia.retorno,
                    "idcoleta": instancia.id,
                }
                response["coleta"] = entrega_data

            conditions = {
                "PENDENTE": solicitacao.situacao == "PENDENTE",
                "ANDAMENTO": solicitacao.situacao != "PENDENTE"
                and not (
                    solicitacao.situacao == "TRANSPORTE"
                    and has_coleta
                    and not has_entrega
                )
                and solicitacao.situacao != "ENTREGUE",
                "PRONTO": solicitacao.situacao == "PRONTO",
                "TRANSPORTECOLETA": solicitacao.situacao == "TRANSPORTE"
                and has_coleta
                and not has_entrega,
                "TRANSPORTEENTREGA": solicitacao.situacao != "ENTREGUE"
                and has_coleta
                and has_entrega,
                "ENTREGUE": solicitacao.situacao == "ENTREGUE",
                "PENDENTECME": solicitacao.situacao == "PENDENTE"
                or (has_coleta and solicitacao.situacao == "TRANSPORTE")
                and not has_entrega,
                None: True,
            }

            if parametro in conditions and conditions[parametro]:
                responses.append(response)

            has_coleta = None
            has_entrega = None

        response_data = {
            "status": "success",
            "data": responses,
        }
        if not responses:
            response_null_data = {
                "status": "success",
                "data": [],
                "message": "Nenhuma solicitação encontrada.",
            }
            return Response(response_null_data, status=status.HTTP_200_OK)

        return Response(response_data, status=status.HTTP_200_OK)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        all_data = request.data
        if request.user.is_cliente:
            all_data["cliente"] = request.user.idprofissional.cliente.idcli
        else:
            raise PermissionDenied(
                "Você não tem o perfil para acessar essa rotina.",
                "perfil_nao_cliente",
            )
        serializersolicitacao = serializers.SerializacaoSolicitacao(
            data=all_data, partial=True
        )
        dados = request.data
        id_box = []
        count = 0
        if not any(dados["caixas"]):
            raise ValidationError(
                "É necessário fornecer o codigo das caixas.",
                "caixa_nao_informada",
            )

        for box in dados["caixas"]:
            exists = (
                SolicitacaoEsterilizacaoItemModel.objects.filter(
                    caixa=box["id"]
                )
                .exclude(solicitacao_esterilizacao__situacao="ENTREGUE")
                .exists()
            )
            if exists:
                solicitacao_id = SolicitacaoEsterilizacaoItemModel.objects.get(
                    caixa=box["id"]
                ).solicitacao_esterilizacao_id
                raise ValidationError(
                    f"Caixa {box} já vinculada à Solicitação #{solicitacao_id}.",
                    "caixa_solicitacao_aberta",
                )
            id_box.append(box["id"])
            count += 1

        serializersolicitacao.is_valid(raise_exception=True)
        solit = self.perform_create(serializersolicitacao)
        dados["solicitacao_esterilizacao"] = solit.id
        for i in range(0, count):
            dados["caixa"] = id_box[i]
            serializeritem = serializers.SerializacaoSolicitacaoitem(
                data=dados, partial=True
            )
            serializeritem.is_valid(raise_exception=True)
            serializeritem.save()

        response_data = {
            "status": "success",
            "data": dict(serializers.SerializacaoSolicitacao(solit).data),
            "message": "Solicitação de Esterilização criada com sucesso.",
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

    def _get_solicitacao(self, solicitacao_id):
        try:
            return SolicitacaoEsterilizacaoModel.objects.get(id=solicitacao_id)
        except SolicitacaoEsterilizacaoModel.DoesNotExist as exc:
            raise NotFound(
                "Solicitação não encontrada.", "solicitacao_nao_encontrada"
            ) from exc

    def _get_motorista(self, motorista_id):
        try:
            return Motorista.objects.get(id=motorista_id)
        except Motorista.DoesNotExist as exc:
            raise NotFound(
                "Motorista não encontrado.", "motorista_nao_encontrado"
            ) from exc

    @transaction.atomic
    @action(methods=["post"], detail=True)
    def preparar_coleta(
        self, request, pk=None
    ):  # pylint: disable=unused-argument
        try:
            # solicitacao = self.get_object()
            solicitacao = self._get_solicitacao(
                request.data.get("solicitacao_esterilizacao")
            )
            motorista = self._get_motorista(request.data.get("motorista"))

            coleta = GestaoLogisticaService.preparar_coleta(
                solicitacao, motorista
            )

            if coleta:
                return Response(
                    {
                        "status": "success",
                        "data": {
                            "code": "coleta_preparada",
                            "message": "A solicitação foi atualizada e está agora"
                            " aguardando coleta.",
                        },
                    }
                )

            return Response(
                {
                    "status": "error",
                    "data": {
                        "code": "coleta_nao_preparada",
                        "message": "Não foi possível preparar a coleta.",
                    },
                }
            )
        except SolicitacaoEsterilizacaoModel.DoesNotExist as exc:
            raise NotFound(
                "Solicitação não encontrada.", "solicitacao_nao_encontrada"
            ) from exc


class SolicitacaoStatusProdutividadeViewSet(viewsets.ViewSet):
    def list(self, request):
        responses = []
        try:
            cliente_ids = SolicitacaoEsterilizacaoModel.objects.values_list(
                "cliente_id", flat=True
            ).distinct()

            for cliente_id in cliente_ids:
                nomecliente = Cliente.objects.filter(idcli=cliente_id)
                cliente_objeto = nomecliente.first()
                nome_cliente = (
                    cliente_objeto.nomefantasiacli if cliente_objeto else ""
                )
                quantidade_pendente = (
                    SolicitacaoEsterilizacaoModel.objects.filter(
                        cliente_id=cliente_id
                    )
                    .exclude(
                        situacao__in=["PROCESSANDO", "PRONTO", "ENTREGUE"]
                    )
                    .exclude(
                        Q(situacao="TRANSPORTE")
                        & Q(coleta_entrega__retorno=True)
                    )
                    .count()
                )

                quantidade_andamento = (
                    SolicitacaoEsterilizacaoModel.objects.filter(
                        cliente_id=cliente_id
                    )
                    .exclude(situacao__in=["PENDENTE", "ENTREGUE"])
                    .exclude(
                        Q(situacao="TRANSPORTE")
                        & Q(coleta_entrega__retorno=False)
                        & ~Q(coleta_entrega__retorno=True)
                    )
                    .count()
                )
                quantidade_finalizado = (
                    SolicitacaoEsterilizacaoModel.objects.filter(
                        cliente_id=cliente_id, situacao="ENTREGUE"
                    ).count()
                )
                response_data = {
                    "id_cliente": cliente_id,
                    "nome_cliente": nome_cliente,
                    "quantidade_pendente": quantidade_pendente,
                    "quantidade_andamento": quantidade_andamento,
                    "quantidade_finalizado": quantidade_finalizado,
                }

                responses.append(response_data)

            if not responses:
                response_null_data = {
                    "status": "success",
                    "responseCode": status.HTTP_204_NO_CONTENT,
                    "data": [],
                    "message": "Nenhum resultado encontrado.",
                }
                return Response(response_null_data)

            final_response = {
                "status": "success",
                "data": responses,
            }
            return Response(final_response)
        except SolicitacaoEsterilizacaoModel.DoesNotExist as exc:
            raise NotFound(
                "Não foram encontradas solicitações para o cliente informado.",
                "cliente_sem_solicitacoes",
            ) from exc


class SolicitacaoItemViewSet(viewsets.ViewSet):
    def get_queryset(self):
        queryset = SolicitacaoEsterilizacaoItemModel.objects.all()
        return queryset

    def get_serializer_class(self):
        return serializers.SerializacaoSolicitacaoitem

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        return serializer_class(*args, **kwargs)

    def list(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = serializers.SerializacaoSolicitacaoitem(
            data=request.data, partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            "caixa(s) salvas com sucesso", status=status.HTTP_201_CREATED
        )


class PlantaoMensalReportView(ModelViewSet):
    queryset = Plantao.objects.all()
    serializers_class = serializers.PlantaoSerializer
    permission_classes = [
        GroupPermission(["ADMINISTRATIVO", "SUPERVISAOENFERMAGEM"])
    ]
    http_method_names = ["get"]

    def get_queryset(self):
        queryset = super().get_queryset()
        mes = self.request.query_params.get("mes", None)
        ano = self.request.query_params.get("ano", None)
        if mes is not None and ano is not None:
            mes = int(mes)
            ano = int(ano)

            queryset = queryset.annotate(
                mes_da_data=F("datacadastro__month"),
                ano_da_data=F("datacadastro__year"),
            ).filter(mes_da_data=mes, ano_da_data=ano)
        else:
            raise ValidationError("Data não encontrada.")

        return queryset

    def get_queryset_mes_anterior(self):
        queryset = super().get_queryset()
        mes = self.request.query_params.get("mes", None)
        ano = self.request.query_params.get("ano", None)

        mes = int(mes)
        ano = int(ano)
        if mes == 1:
            mes = 12
            ano -= 1
        else:
            mes -= 1
        queryset = queryset.annotate(
            mes_da_data=F("datacadastro__month"),
            ano_da_data=F("datacadastro__year"),
        ).filter(mes_da_data=mes, ano_da_data=ano)

        return queryset

    def list(self, request, *args, **kwargs):
        try:
            mes = self.request.query_params.get("mes", None)
            ano = self.request.query_params.get("ano", None)
            mes_ano = str(f"{mes}/{ano}")

            plantoes_mes_atual = self.get_queryset().all()
            plantoes_abertos = self.get_queryset().filter(status="ABERTO")
            plantoes_fechados = self.get_queryset().filter(status="FECHADO")
            total_plantoes_mes_atual = plantoes_mes_atual.count()
            quantidade_abertos = plantoes_abertos.count()
            quantidade_fechados = plantoes_fechados.count()

            total_plantoes_mes_anterior = (
                self.get_queryset_mes_anterior().all()
            )
            total_plantoes_mes_anterior = total_plantoes_mes_anterior.count()

            enfermeiros = plantoes_mes_atual.values("idprofissional").annotate(
                nome=F("idprofissional__nome"),
                quantidade_abertos=Count(
                    "idplantao", filter=Q(status="ABERTO")
                ),
                quantidade_fechados=Count(
                    "idplantao", filter=Q(status="FECHADO")
                ),
                media_duracao=Avg("duracao", filter=Q(status="FECHADO")),
            )

            for enfermeiro in enfermeiros:
                media_timedelta = enfermeiro["media_duracao"]
                media_segundos = media_timedelta.total_seconds()
                horas, segundos = divmod(int(media_segundos), 3600)
                minutos, segundos = divmod(segundos, 60)
                enfermeiro[
                    "media_duracao"
                ] = f"{horas:02d}:{minutos:02d}:{segundos:02d}"
            if total_plantoes_mes_anterior != 0:
                resultado = round(
                    (
                        (
                            (
                                total_plantoes_mes_atual
                                - total_plantoes_mes_anterior
                            )
                            / total_plantoes_mes_anterior
                        )
                        * 100
                    ),
                    2,
                )
            else:
                resultado = 0

            return Response(
                {
                    "status": "success",
                    "data": [
                        {
                            "mes_ano": mes_ano,
                            "total_plantoes_mes": total_plantoes_mes_atual,
                            "total_plantoes_mes_anterior": total_plantoes_mes_anterior,
                            "total_plantoes_abertos": quantidade_abertos,
                            "total_plantoes_fechados": quantidade_fechados,
                            "comparacao_com_mes_anterior": resultado,
                            "media_por_enfermeira": list(enfermeiros),
                        }
                    ],
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            raise APIException(str(e)) from e


class InvalidURLView(APIView):
    def get(self, request, *args, **kwargs):
        return Response("URL não encontrada.", status.HTTP_404_NOT_FOUND)
