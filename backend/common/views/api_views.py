import json

from django.contrib.auth.models import Group
from django.db import transaction

from common.enums import ProgramacaEquipamentoEnum, TipoEquipamentoEnum
from common.filters import LoteFilter
from common.models import (
    Autoclavagem,
    Caixa,
    Caixavalor,
    Equipamento,
    Etiqueta,
    IndicadoresEsterilizacao,
    Lote,
    Setor,
    Subtipoproduto,
    Termodesinfeccao,
    Tipocaixa,
    TipoOcorrencia,
    Tipopacote,
)
from common.responses import ErrorResponse, SuccessResponse
from common.serializers import (
    CaixavalorSerializer,
    CicloEsterilizacaoCriacaoSerializer,
    CicloEsterilizacaoCriacaoTesteSerializer,
    CicloEsterilizacaoResponseSerializer,
    CicloEsterilizacaoResponsetesteSerializer,
    CicloTermodesinfeccaoCriacaoSerializer,
    CicloTermodesinfeccaoResponseSerializer,
    DistribuicaoCreateSerializer,
    EquipamentoFormOptionsSerializer,
    EtiquetaEmbalagemPreparoSerializer,
    GroupFormOptionsSerializer,
    HistoricoEtiquetaSerializer,
    IndicadoresFormOption,
    ProcessoPreparoSerializer,
    SetorFormOptionsSerializer,
    SubTipoProdutoSerializer,
    TipocaixaSerializer,
    TipoOcorrenciaFormOptionsSerializer,
    TipoPacoteSerializer,
    UserFormOptionsSerializer,
)
from common.services import (
    EstoqueService,
    EtapaAutoclavagem,
    EtapaAutoclavagemTeste,
    EtapaPreparo,
    EtapaTermodesinfeccao,
    GestaoLogisticaService,
    MovimentacaoIndicadoresService,
    RastreabilidadeService,
)
from common.utils import enum_to_list
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from users.models import User


class FormOptionsView(APIView):
    def get(self, request, *args, **kwargs):
        """Recupera opções do formulário de cadastro de caixas.
        Retorna as opções de embalagens, tipos de caixa, temperaturas,
            categorias de uso, situações, prioridades e criticidades.
        """
        try:
            embalagens = Caixavalor.objects.all()
            tipos_caixa = Tipocaixa.objects.all()

            embalagens_serializer = CaixavalorSerializer(embalagens, many=True)
            tipos_caixa_serializer = TipocaixaSerializer(
                tipos_caixa, many=True
            )

            data = {
                "embalagens": embalagens_serializer.data,
                "tipos_caixa": tipos_caixa_serializer.data,
                "temperaturas": enum_to_list(Caixa.Temperatura),
                "categorias_uso": enum_to_list(Caixa.CategoriaUso),
                "situacoes": enum_to_list(Caixa.Situacao),
                "prioridades": enum_to_list(Caixa.Prioridade),
                "criticidades": enum_to_list(Caixa.Criticidade),
            }

            return SuccessResponse(data=data)

        except Exception as exc:
            raise APIException(
                code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao recuperar opções do formulário. {exc}",
            ) from exc


class ProcessoPreparoView(APIView):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        # pylint: disable=too-many-locals
        """Processa a etapa de preparo de caixas."""
        try:
            produtos_json = request.data.get("produtos", "[]")
            produtos = json.loads(produtos_json)

            serial = request.data.get("serial", "")
            serial = serial.strip('"')

            cautela = request.data.get("cautela", "")
            cautela = cautela.strip('"')

            lote = request.data.get("lote", None)

            indicador = None
            if lote:
                lote_obj = Lote.objects.get(id=lote)
                indicador = IndicadoresEsterilizacao.objects.get(
                    id=lote_obj.indicador.pk
                )
                movimentacao_service = MovimentacaoIndicadoresService(
                    lote=lote_obj,
                    operacao="SAIDA",
                    quantidade=1,
                    user=request.user,
                )
                movimentacao_service.main()

            if not cautela:
                cautela = ""

            data = {
                "caixa_completa": request.data.get("caixa_completa", ""),
                "produtos": produtos,
                "serial": serial,
                "cautela": cautela,
            }
            if indicador:
                data["indicador"] = indicador.pk

            serializer = ProcessoPreparoSerializer(data=data)
            if serializer.is_valid():
                rastreabilidade_service = RastreabilidadeService(
                    etapa=EtapaPreparo(
                        serializer.validated_data["serial"], request.user
                    ),
                )
                if producao := rastreabilidade_service.processar(
                    serializer.validated_data, fotos=request.data
                ):
                    response_data = EtiquetaEmbalagemPreparoSerializer(
                        producao
                    ).data
                    return SuccessResponse(data=response_data)

                return ErrorResponse(
                    error_code="erro_processamento_preparo",
                    error_message="Erro ao processar etapa de preparo.",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            return ErrorResponse(
                error_code="erro_validacao_dados",
                error_message="Erro de validação dos dados.",
                error_data=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError as exc:
            raise APIException(
                code=status.HTTP_400_BAD_REQUEST,
                detail=f"Erro de validação dos dados. {exc}",
            ) from exc


class FormOptionsEtiquetaView(APIView):
    def get(self, request, *args, **kwargs):
        """Recupera opções do formulário de cadastro de etiquetas."""
        try:
            seladoras = Equipamento.objects.seladoras(ambos=True)
            termodesinfectoras = Equipamento.objects.termodesinfectoras(
                ambos=True
            )
            autoclaves = Equipamento.objects.autoclaves(ambos=True)
            data = {
                "seladoras": EquipamentoFormOptionsSerializer(
                    seladoras, many=True
                ).data,
                "termodesinfectoras": EquipamentoFormOptionsSerializer(
                    termodesinfectoras, many=True
                ).data,
                "autoclaves": EquipamentoFormOptionsSerializer(
                    autoclaves, many=True
                ).data,
                "tipos_etiquetas": enum_to_list(Etiqueta.TipoEtiqueta),
                "servicos": enum_to_list(Etiqueta.Servico),
            }

            return SuccessResponse(data=data)

        except Exception as exc:
            raise APIException(
                code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao recuperar opções do formulário. {exc}",
            ) from exc


class FormOptionsDiarioView(APIView):
    def get(self, request, *args, **kwargs):
        """Recupera opções do formulário de cadastro de ocorrências.
        Retorna as opções de clientes, setores, usuarios e indicadores.
        """
        try:
            setores = Setor.objects.all()
            indicadores = TipoOcorrencia.objects.all()
            users = User.objects.get_usuarios_ativos()

            setores_serializer = SetorFormOptionsSerializer(setores, many=True)
            indicadores_serializer = TipoOcorrenciaFormOptionsSerializer(
                indicadores, many=True
            )
            users_serializer = UserFormOptionsSerializer(users, many=True)

            data = {
                "setores": setores_serializer.data,
                "indicadores": indicadores_serializer.data,
                "users": users_serializer.data,
            }

            return SuccessResponse(data=data)

        except Exception as exc:
            raise APIException(
                code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao recuperar opções do formulário. {exc}",
            ) from exc


class ProcessoAutoclavagemView(APIView):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        """Processa a etapa de autoclavagem das caixas (início)."""
        serializer = CicloEsterilizacaoCriacaoSerializer(data=request.data)
        if serializer.is_valid():
            rastreabilidade_service = RastreabilidadeService(
                etapa=EtapaAutoclavagem(
                    serializer.validated_data["itens"], request.user, "iniciar"
                ),
            )
            try:
                autoclavagem = rastreabilidade_service.processar(
                    serializer.validated_data
                )
                response_data = CicloEsterilizacaoResponseSerializer(
                    autoclavagem
                ).data
                equipamento = serializer.validated_data["equipamento"]
                equipamento.alocar()
                equipamento.save()
                return SuccessResponse(
                    data=response_data, status_code=status.HTTP_201_CREATED
                )

            except APIException as e:
                return ErrorResponse(
                    error_code=e.get_codes(),
                    error_message=str(e),
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

        return ErrorResponse(
            error_code="erro_validacao_dados",
            error_message="Erro de validação dos dados.",
            error_data=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST,
        )


class ProcessoAutoclavagemTesteView(APIView):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        """Processa a etapa de autoclavagem com teste Bowie & Dick."""
        if "lote" not in request.data:
            return ErrorResponse(
                error_code="inidicador_nao_informado",
                error_message="Informe o indicador.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        lote = Lote.objects.get(id=request.data["lote"])
        request.data["indicador"] = lote.indicador.pk
        serializer = CicloEsterilizacaoCriacaoTesteSerializer(
            data=request.data
        )
        if serializer.is_valid():
            rastreabilidade_service = RastreabilidadeService(
                etapa=EtapaAutoclavagemTeste(request.user, "iniciar"),
            )
            try:
                autoclavagem = rastreabilidade_service.processar(
                    serializer.validated_data
                )
                response_data = CicloEsterilizacaoResponsetesteSerializer(
                    autoclavagem
                ).data
                equipamento = serializer.validated_data["equipamento"]
                equipamento.alocar()
                equipamento.save()

                movimentacao_service = MovimentacaoIndicadoresService(
                    lote=lote,
                    operacao="SAIDA",
                    quantidade=1,
                    user=request.user,
                )
                movimentacao_service.main()

                return SuccessResponse(
                    data=response_data, status_code=status.HTTP_201_CREATED
                )

            except APIException as e:
                return ErrorResponse(
                    error_code=e.get_codes(),
                    error_message=str(e),
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
        return ErrorResponse(
            error_code="erro_validacao_dados",
            error_message="Erro de validação dos dados.",
            error_data=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST,
        )


class ProcessoTermodesinfeccaoView(APIView):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        """Processa a etapa de termodesinfeccao das caixas (início)."""
        serializer = CicloTermodesinfeccaoCriacaoSerializer(data=request.data)
        if serializer.is_valid():
            rastreabilidade_service = RastreabilidadeService(
                etapa=EtapaTermodesinfeccao(
                    serializer.validated_data["itens"], request.user, "iniciar"
                ),
            )

            try:
                termodesinfeccao = rastreabilidade_service.processar(
                    serializer.validated_data
                )
                response_data = CicloTermodesinfeccaoResponseSerializer(
                    termodesinfeccao
                ).data

                equipamento = serializer.validated_data["equipamento"]
                equipamento.alocar()
                equipamento.save()
                return SuccessResponse(
                    data=response_data, status_code=status.HTTP_201_CREATED
                )

            except APIException as e:
                return ErrorResponse(
                    error_code=e.get_codes(),
                    error_message=str(e),
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

        return ErrorResponse(
            error_code="erro_validacao_dados",
            error_message="Erro de validação dos dados.",
            error_data=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST,
        )


class ProcessoFormOptionsView(APIView):
    form_type = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.form_type:
            raise ValueError("form_type não definido.")

    def get(self, request, *args, **kwargs):
        """Recupera as informações de form-options tanto para
        termodesinfeccao quanto para esterilizacao."""
        try:
            if self.form_type == "termodesinfeccao":
                equipamento = Equipamento.objects.termodesinfectoras().filter(
                    ativo=True
                )
                data = {
                    "equipamentos": EquipamentoFormOptionsSerializer(
                        equipamento, many=True
                    ).data,
                    "programacoes": enum_to_list(ProgramacaEquipamentoEnum),
                    "status": enum_to_list(Termodesinfeccao.Status),
                }
            elif self.form_type == "esterilizacao":
                equipamento = Equipamento.objects.autoclaves().filter(
                    ativo=True
                )
                data = {
                    "programacoes": enum_to_list(ProgramacaEquipamentoEnum),
                    "equipamentos": EquipamentoFormOptionsSerializer(
                        equipamento, many=True
                    ).data,
                    "status": enum_to_list(Autoclavagem.Status),
                }
            else:
                raise APIException(
                    code=status.HTTP_400_BAD_REQUEST,
                    detail="Tipo de formulário inválido.",
                )

            return SuccessResponse(data=data)

        except Exception as exc:
            raise APIException(
                code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao recuperar opções do formulário. {exc}",
            ) from exc


class TermodesinfeccaoFormOptionsView(ProcessoFormOptionsView):
    form_type = "termodesinfeccao"


class EsterilizacaoFormOptionsView(ProcessoFormOptionsView):
    form_type = "esterilizacao"


class CriarDistribuicaoView(APIView):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            serializer = DistribuicaoCreateSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            dados_distribuicao = serializer.validated_data
            cliente = dados_distribuicao["cliente"]
            setor = dados_distribuicao["setor"]
            cautela = dados_distribuicao["cautela"]
            itens = dados_distribuicao["itens"]
            solicitacao_esterilizacao = (
                dados_distribuicao.get("solicitacao_esterilizacao") or None
            )

            estoque_service = EstoqueService()
            logistica_service = GestaoLogisticaService(usuario=request.user)

            # Retirar do estoque
            estoque_service.retirar_do_estoque(
                [item["serial"].idsequenciaetiqueta for item in itens]
            )

            # Distribuir caixas
            distribuicao = logistica_service.distribuir_caixas(
                cliente=cliente,
                setor=setor,
                cautela=cautela,
                solicitacao_esterilizacao=solicitacao_esterilizacao,
                lista_seriais=[item["serial"] for item in itens],
            )

            return SuccessResponse(
                data={"distribuicao": distribuicao.iddistribuicao},
                status_code=status.HTTP_201_CREATED,
            )
        except ValueError:
            return ErrorResponse(
                error_data=serializer.errors,
                error_message="Erro de validação dos dados.",
                error_code="erro_validacao_dados",
                status_code=status.HTTP_400_BAD_REQUEST,
            )


class EquipamentoFormOptionsView(APIView):
    def get(self, request, *args, **kwargs):
        """Recupera opções do formulário de cadastro de equipamentos.
        Retorna as opções de embalagens, tipos de caixa, temperaturas,
            categorias de uso, situações, prioridades e criticidades.
        """
        try:
            data = {
                "tipos": enum_to_list(TipoEquipamentoEnum),
            }

            return SuccessResponse(data=data)

        except Exception as exc:
            raise APIException(
                code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao recuperar opções do formulário. {exc}",
            ) from exc


class ProdutoFormOptionsView(APIView):
    def get(self, request, *args, **kwargs):
        """Recupera opções do formulário de produtos.
        Retorna as opções de embalagens, tipos e subtipos de caixas
        """
        try:
            embalagens = Caixavalor.objects.all()
            tipos = Tipopacote.objects.all()
            subtipos = Subtipoproduto.objects.all()

            embalagens_serializer = CaixavalorSerializer(embalagens, many=True)
            tipos_serializer = TipoPacoteSerializer(tipos, many=True)
            subtipos_serializer = SubTipoProdutoSerializer(subtipos, many=True)

            data = {
                "embalagens": embalagens_serializer.data,
                "tipos": tipos_serializer.data,
                "subtipos": subtipos_serializer.data,
            }

            return SuccessResponse(data=data)

        except Exception as exc:
            raise APIException(
                code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao recuperar opções do formulário. {exc}",
            ) from exc


class IndicadoresPorLoteFormOptions(ListAPIView):
    pagination_class = None
    queryset = Lote.objects.all().order_by("vencimento")
    serializer_class = IndicadoresFormOption
    filter_backends = [DjangoFilterBackend]
    filterset_class = LoteFilter

    def get(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return SuccessResponse(serializer.data)
        except Exception as exc:
            raise APIException(
                code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao recuperar opções do formulário. {exc}",
            ) from exc


class HistoricoEtiquetasAPIView(APIView):
    def get(self, request):
        etiqueta = Etiqueta.historico.all()
        serializer = HistoricoEtiquetaSerializer(etiqueta, many=True)
        return SuccessResponse(serializer.data)


class FormOptionsGruposView(APIView):
    def get(self, request, *args, **kwargs):
        """Recupera os grupos de permissões cadastrados no sistema."""
        try:
            grupos = Group.objects.all()
            serializer = GroupFormOptionsSerializer(grupos, many=True)

            data = {
                "grupos": serializer.data,
            }

            return SuccessResponse(data=data)

        except Exception as exc:
            raise APIException(
                code=status.HTTP_400_BAD_REQUEST,
                detail=f"Erro ao recuperar opções do formulário. {exc}",
            ) from exc
