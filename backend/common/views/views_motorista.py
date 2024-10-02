import math
from datetime import date

from django.db import transaction

from common import helpers
from common.enums import (
    DistribuicaoEnum,
    EstoqueEnum,
    RecebimentoEnum,
    SolicitacaoEnum,
)
from common.exceptions import Conflict
from common.models import (
    Cliente,
    ColetaEntregaModel,
    Distribuicao,
    Estoque,
    Itemdistribuicao,
    Recebimento,
    Sequenciaetiqueta,
    SolicitacaoEsterilizacaoItemModel,
    SolicitacaoEsterilizacaoModel,
    Usuario,
)
from common.serializers import ColetaEntregaSerializer
from rest_framework import status, viewsets
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.response import Response


class RotaMotoristaIniciaColetaClienteViewSet(viewsets.ViewSet):
    @transaction.atomic
    def partial_update(self, request, *args, **kwargs):
        try:
            verificar_profissional_vinculado_usuario(request)
            id_coleta = kwargs.get("pk")
            em_transporte = None

            if request.user.is_motorista:
                coleta = buscar_coleta(id_coleta)
                verificar_vinculo_motorista_coleta(request, coleta)
                em_transporte = self.valida_coleta_cliente(coleta)
            if (
                request.user.is_lider_motorista()
                or request.user.is_supervisor_logistica()
                or request.user.is_supervisor()
            ):
                coleta = buscar_coleta(id_coleta)
                em_transporte = self.valida_coleta_cliente(coleta)

        except ColetaEntregaModel.DoesNotExist as exc:
            raise NotFound(
                "Coleta não encontrada: " + str(id_coleta),
                status.HTTP_404_NOT_FOUND,
            ) from exc

        return Response(
            {
                "status": "success",
                "data": {
                    "coleta": {
                        "id": id_coleta,
                        "situacao": em_transporte,
                    }
                },
            },
            status=status.HTTP_200_OK,
        )

    def valida_coleta_cliente(self, coleta):
        solicitacao = buscar_coleta_por_solicitacao(coleta)
        em_transporte = dict(SolicitacaoEsterilizacaoModel.STATUS_CHOICES).get(
            SolicitacaoEnum.TRANSPORTE.value
        )

        if not solicitacao.is_pendente:
            raise Conflict(
                "Solicitação não está pendente de coleta, "
                "portanto não pode ser coletada",
                "solicitacao_nao_pendente",
            )

        solicitacao.situacao = SolicitacaoEnum.TRANSPORTE.value
        solicitacao.save()
        return em_transporte


class RotaMotoristaEntregaColetaExpurgoViewSet(viewsets.ViewSet):
    @transaction.atomic
    def partial_update(self, request, *args, **kwargs):
        try:
            verificar_profissional_vinculado_usuario(request)
            id_coleta = kwargs.get("pk")
            if request.user.is_motorista:
                coleta = buscar_coleta(id_coleta)
                verificar_vinculo_motorista_coleta(request, coleta)
                processando = self.valida_entrega_coleta_expurgo(coleta)
            if (
                request.user.is_lider_motorista()
                or request.user.is_supervisor_logistica()
                or request.user.is_supervisor()
            ):
                coleta = buscar_coleta(id_coleta)
                processando = self.valida_entrega_coleta_expurgo(coleta)

        except ColetaEntregaModel.DoesNotExist as exc:
            raise NotFound(
                "Coleta não encontrada: " + str(id_coleta),
                status.HTTP_404_NOT_FOUND,
            ) from exc

        return Response(
            {
                "status": "success",
                "data": {
                    "coleta": {
                        "id": id_coleta,
                        "situacao": processando,
                    }
                },
            },
            status=status.HTTP_200_OK,
        )

    def valida_entrega_coleta_expurgo(self, coleta):
        solicitacao = buscar_coleta_por_solicitacao(coleta)
        processando = dict(SolicitacaoEsterilizacaoModel.STATUS_CHOICES).get(
            SolicitacaoEnum.PROCESSANDO.value
        )

        is_coleta_em_transporte = (
            solicitacao.situacao == SolicitacaoEnum.TRANSPORTE.value
            and not coleta.retorno
        )

        if not is_coleta_em_transporte:
            raise Conflict(
                "Solicitação não está em rota de coleta, "
                "portanto não pode ser entregue.",
                "rota_nao_coleta",
            )

        solicitacao.situacao = SolicitacaoEnum.PROCESSANDO.value
        solicitacao.save()
        criar_recebimento(solicitacao, self)

        return processando


class RotaMotoristaEntregaColetaClienteViewSet(viewsets.ViewSet):
    @transaction.atomic
    def partial_update(self, request, *args, **kwargs):
        try:
            verificar_profissional_vinculado_usuario(request)
            id_coleta = kwargs.get("pk")
            coleta = buscar_coleta(id_coleta)

            if request.user.is_motorista:
                verificar_vinculo_motorista_coleta(request, coleta)
                entregue = self.valida_entrega_coleta_cliente(request, coleta)
            elif request.user.is_cliente:
                entregue = self.valida_entrega_coleta_cliente(request, coleta)
            elif (
                request.user.is_lider_motorista()
                or request.user.is_supervisor_logistica()
                or request.user.is_supervisor()
            ):
                entregue = self.valida_entrega_coleta_cliente(request, coleta)
            else:
                raise PermissionDenied(
                    "Você não tem o perfil de acesso para essa rotina."
                )

        except ColetaEntregaModel.DoesNotExist as exc:
            raise NotFound(
                "Coleta não encontrada:" + str(id_coleta),
                status.HTTP_404_NOT_FOUND,
            ) from exc
        return Response(
            {
                "status": "success",
                "data": {
                    "coleta": {
                        "id": id_coleta,
                        "situacao": entregue,
                    }
                },
            },
            status=status.HTTP_200_OK,
        )

    def valida_entrega_coleta_cliente(self, request, coleta):
        solicitacao = buscar_coleta_por_solicitacao(coleta)
        entregue = dict(SolicitacaoEsterilizacaoModel.STATUS_CHOICES).get(
            SolicitacaoEnum.ENTREGUE.value
        )

        is_entrega = (
            solicitacao.situacao == SolicitacaoEnum.TRANSPORTE.value
            and coleta.retorno
        )

        if not is_entrega:
            raise Conflict(
                "Solicitação não está em rota de entrega, portanto não pode ser entregue.",
                "rota_nao_entrega",
            )

        solicitacao.situacao = SolicitacaoEnum.ENTREGUE.value
        solicitacao.save()
        criar_distribuicao_e_atualizar_estoque(solicitacao, request)

        return entregue


def criar_distribuicao_e_atualizar_estoque(solicitacao, request):
    usuario = Usuario.objects.get(apelidousu=request.user.username)
    # TODO: Revisar
    distribuicao_salva = Distribuicao(
        datacancelamentodistribuicao=None,
        datadistribuicao=helpers.datahora_local_atual(),
        dtdistribuicao=helpers.data_local_atual(),
        numerocautela=None,
        status=DistribuicaoEnum.DISTRIBUIDO.value,
        idusu=usuario,
        solicitacao_esterilizacao_id=solicitacao,
    )
    distribuicao_salva.save()

    itens_solicitacao = SolicitacaoEsterilizacaoItemModel.objects.filter(
        solicitacao_esterilizacao=solicitacao.id
    )
    cliente = Cliente.objects.get(idcli=solicitacao.cliente.idcli)
    for item_solicitacao in itens_solicitacao:
        serial = Sequenciaetiqueta.objects.get(
            idsequenciaetiqueta=item_solicitacao.caixa.idsequenciaetiqueta
        )
        estoque = Estoque.objects.filter(
            serial=serial,
            status=EstoqueEnum.ARMAZENADO.value,
        )
        if estoque.exists():
            estoque.update(
                quantidade=0, status=DistribuicaoEnum.DISTRIBUIDO.value
            )
        Itemdistribuicao(
            idcli=cliente,
            iddistribuicao=distribuicao_salva,
            idsequenciaetiqueta=serial,
        ).save()


def criar_recebimento(solicitacao, self):
    usuario = Usuario.objects.get(apelidousu=self.request.user.username)
    recebimento_salva = Recebimento(
        datacancelamento=None,
        datarecebimento=date.today(),
        observacao=None,
        statusrecebimento=RecebimentoEnum.AGUARDANDO_CONFERENCIA.value,
        idorigem=None,
        idusu=usuario,
        solicitacao_esterilizacao_id=solicitacao,
    )
    recebimento_salva.save()
    id_sequencia_solicitacao = (
        SolicitacaoEsterilizacaoItemModel.objects.filter(
            solicitacao_esterilizacao_id=solicitacao.id
        ).values_list("caixa", flat=True)
    )
    for ids in id_sequencia_solicitacao:
        instancia_sequencia = Sequenciaetiqueta.objects.get(
            idsequenciaetiqueta=ids
        )
        instancia_sequencia.recebimento.add(recebimento_salva.idrecebimento)


def verificar_profissional_vinculado_usuario(request):
    if request.user.idprofissional is None:
        raise NotFound(
            "Usuário não tem profissional vinculado", status.HTTP_404_NOT_FOUND
        )


def verificar_vinculo_motorista_coleta(request, coleta):
    if request.user != coleta.motorista:
        raise NotFound(
            f"Motorista {request.user.nome} não vinculado à coleta.",
            status.HTTP_404_NOT_FOUND,
        )


def buscar_coleta_por_solicitacao(coleta):
    solicitacao = SolicitacaoEsterilizacaoModel.objects.get(
        id=coleta.solicitacao_esterilizacao_id
    )
    return solicitacao


def buscar_coleta(id_coleta):
    coleta = ColetaEntregaModel.objects.get(id=id_coleta)
    return coleta


# pylint: disable=too-many-ancestors
class RotasViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ColetaEntregaSerializer

    def get_queryset(self):
        queryset = None
        if self.request.user.is_motorista:
            id_profissional = self.request.user.idprofissional.idprofissional
            filter_conditions = {
                "solicitacao_esterilizacao__situacao__in": [
                    SolicitacaoEnum.PENDENTE.value,
                    SolicitacaoEnum.TRANSPORTE.value,
                ],
                "motorista__idprofissional": id_profissional,
            }
            return ColetaEntregaModel.objects.filter(**filter_conditions)
        return queryset or ColetaEntregaModel.objects.none()

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        data = response.data.get("results", [])
        sorted_data = sorted(data, key=lambda x: not x["retorno"])
        resultado = erase_dict(sorted_data)
        resultado_processado = processar_resultado(resultado)
        (
            coleta_list,
            entrega_list,
        ) = self.retorna_coletas_formatada_perfil_motorista(
            resultado_processado
        )

        return Response(
            {
                "status": "success",
                "data": {"coletas": coleta_list, "entregas": entrega_list},
                "meta": {
                    "currentPage": request.GET.get("page", 1),
                    "totalItems": response.data.get("count", 0),
                    "itemsPerPage": len(data),
                    "totalPages": math.ceil(
                        response.data.get("count", 0) / len(data)
                    )
                    if len(data) > 0
                    else 0,
                },
            }
        )

    def retorna_coletas_formatada_perfil_motorista(self, resultado):
        keys_to_remove = ["retorno"]
        solicitacao_keys_to_keep = ["situacao", "cliente", "observacao"]
        coleta_list = [
            {
                k: v
                if k != "solicitacao_esterilizacao"
                else {
                    sk: sv
                    for sk, sv in item[k].items()
                    if sk in solicitacao_keys_to_keep
                }
                for k, v in item.items()
                if k not in keys_to_remove
            }
            for item in resultado
            if not item.get("retorno", False)
        ]
        entrega_list = [
            {
                k: v
                if k != "solicitacao_esterilizacao"
                else {
                    sk: sv
                    for sk, sv in item[k].items()
                    if sk in solicitacao_keys_to_keep
                }
                for k, v in item.items()
                if k not in keys_to_remove
            }
            for item in resultado
            if item.get("retorno", False)
        ]

        return coleta_list, entrega_list


# pylint: disable=too-many-ancestors
class RotasSupervisaoMotoristaViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ColetaEntregaSerializer

    def get_queryset(self):
        queryset = None
        if (
            self.request.user.is_lider_motorista()
            or self.request.user.is_supervisor_logistica()
            or self.request.user.is_supervisor()
        ):
            return ColetaEntregaModel.objects.filter(
                solicitacao_esterilizacao__situacao__in=[
                    SolicitacaoEnum.PENDENTE.value,
                    SolicitacaoEnum.TRANSPORTE.value,
                ]
            )
        return (
            queryset
            if queryset is not None
            else ColetaEntregaModel.objects.none()
        )

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        data = response.data.get("results", [])
        sorted_data = sorted(data, key=lambda x: not x["retorno"])
        resultado = erase_dict(sorted_data)
        resultado_processado = processar_resultado(resultado)

        (
            coleta_list,
            entrega_list,
        ) = self.retorna_coletas_formatada_perfil_lider_logistica_motorista(
            resultado_processado
        )
        data = self.agrupar_por_profissional(coleta_list, entrega_list)

        return Response(
            {
                "status": "success",
                "data": data,
                "meta": {
                    "currentPage": request.GET.get("page", 1),
                    "totalItems": response.data.get("count", 0),
                    "itemsPerPage": len(data),
                    "totalPages": math.ceil(
                        response.data.get("count", 0) / len(data)
                    )
                    if len(data) > 0
                    else 0,
                },
            }
        )

    def get_total_caixas(self, solicitacao):
        return SolicitacaoEsterilizacaoItemModel.objects.filter(
            solicitacao_esterilizacao=solicitacao
        ).count()

    def agrupar_por_profissional(self, coleta_list, entrega_list):
        profissional_por_coletas = {}
        for item in entrega_list:
            profissional_id = item["profissional"]["id"]
            if profissional_id not in profissional_por_coletas:
                profissional_por_coletas[profissional_id] = {
                    "profissional": item["profissional"],
                    "coletas": [],
                    "entregas": [],
                }

            profissional_por_coletas[profissional_id]["entregas"].append(item)

        for item in coleta_list:
            profissional_id = item["profissional"]["id"]
            if profissional_id not in profissional_por_coletas:
                profissional_por_coletas[profissional_id] = {
                    "profissional": item["profissional"],
                    "coletas": [],
                    "entregas": [],
                }
            profissional_por_coletas[profissional_id]["coletas"].append(item)

        data = list(profissional_por_coletas.values())
        return data

    def retorna_coletas_formatada_perfil_lider_logistica_motorista(
        self, resultado
    ):
        coleta_list = [
            {
                k: v if k != "solicitacao_esterilizacao"
                # pylint: disable=unnecessary-comprehension
                else {sk: sv for sk, sv in item[k].items()}
                for k, v in item.items()
            }
            for item in resultado
            if not item.get("retorno", False)
        ]
        entrega_list = [
            {
                k: v if k != "solicitacao_esterilizacao"
                # pylint: disable=unnecessary-comprehension
                else {sk: sv for sk, sv in item[k].items()}
                for k, v in item.items()
            }
            for item in resultado
            if item.get("retorno", False)
        ]

        for item in entrega_list:
            id_solicitacao = item["solicitacao_esterilizacao"]["id"]
            item["id_coleta"] = item["id"]
            id_coleta = item["id"]
            item["id_solicitacao"] = id_solicitacao
            item["situacao"] = item["solicitacao_esterilizacao"]["situacao"]
            item["cliente"] = item["solicitacao_esterilizacao"]["cliente"]
            total_caixas = self.get_total_caixas(id_solicitacao)
            item["total_caixas"] = total_caixas

            coleta = ColetaEntregaModel.objects.get(id=id_coleta)
            item["profissional"] = {
                "id": coleta.motorista.idprofissional.idprofissional,
                "nome": coleta.motorista.nome,
            }
            del item["solicitacao_esterilizacao"]
            del item["id"]

        for item in coleta_list:
            id_solicitacao = item["solicitacao_esterilizacao"]["id"]
            item["id_coleta"] = item["id"]
            id_coleta = item["id"]
            item["id_solicitacao"] = id_solicitacao
            item["situacao"] = item["solicitacao_esterilizacao"]["situacao"]
            item["cliente"] = item["solicitacao_esterilizacao"]["cliente"]
            total_caixas = self.get_total_caixas(id_solicitacao)
            item["total_caixas"] = total_caixas

            coleta = ColetaEntregaModel.objects.get(id=id_coleta)
            item["profissional"] = {
                "id": coleta.motorista.idprofissional.idprofissional,
                "nome": coleta.motorista.nome,
            }
            del item["solicitacao_esterilizacao"]
            del item["id"]

        return coleta_list, entrega_list


def erase_dict(data):
    ids_ja_encontrados = set()
    dicionarios_mantidos = []
    for dicionario in data:
        solicitacao = dicionario["solicitacao_esterilizacao"]
        id_solicitacao = solicitacao["id"]
        retorno = dicionario["retorno"]
        if id_solicitacao in ids_ja_encontrados and not retorno:
            continue

        ids_ja_encontrados.add(id_solicitacao)
        dicionarios_mantidos.append(dicionario)

    return dicionarios_mantidos


def processar_resultado(resultado):
    coletas = []
    entregas = []
    for item in resultado:
        if item["retorno"] is True:
            entregas.append(item["solicitacao_esterilizacao"]["id"])
        else:
            coletas.append(item["solicitacao_esterilizacao"]["id"])

    if coletas:
        for id_coleta in coletas:
            result = (
                ColetaEntregaModel.objects.filter(
                    solicitacao_esterilizacao_id=id_coleta, retorno=True
                ).exists()
                and ColetaEntregaModel.objects.filter(
                    solicitacao_esterilizacao_id=id_coleta, retorno=False
                ).exists()
            )
            if result:
                for dicionario in resultado:
                    if (
                        dicionario.get("solicitacao_esterilizacao", {}).get(
                            "id"
                        )
                        == id_coleta
                    ):
                        resultado.remove(dicionario)

    return resultado
