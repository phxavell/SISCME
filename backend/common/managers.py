# backend/common/managers.py

from datetime import datetime
from itertools import groupby

from django.db import models
from django.db.models import Count, F, Max, Q
from django.db.models.functions import ExtractDay
from django.db.models.query import QuerySet

from common import helpers
from dateutil.relativedelta import relativedelta

from .enums import (
    ColetaEntregaSituacaoEnum,
    SerialSituacaoEnum,
    TipoEquipamentoEnum,
)


class ItemcaixaManager(models.Manager):
    def get_queryset(self) -> QuerySet:
        return super().get_queryset().filter(deleted=False)

    def delete(self) -> tuple[int, dict[str, int]]:
        for item in self.get_queryset():
            item.delete()


class ColetaEntregaManager(models.Manager):
    def nao_iniciado(self) -> QuerySet:
        return (
            super()
            .get_queryset()
            .filter(situacao=ColetaEntregaSituacaoEnum.NAO_INICIADO)
        )

    def em_andamento(self) -> QuerySet:
        return (
            super()
            .get_queryset()
            .filter(situacao=ColetaEntregaSituacaoEnum.EM_ANDAMENTO)
        )

    def finalizado(self) -> QuerySet:
        return (
            super()
            .get_queryset()
            .filter(situacao=ColetaEntregaSituacaoEnum.FINALIZADO)
        )


class ColetaManager(ColetaEntregaManager):
    def get_queryset(self) -> QuerySet:
        return super().get_queryset().filter(retorno=False)


class EntregaManager(ColetaEntregaManager):
    def get_queryset(self) -> QuerySet:
        return super().get_queryset().filter(retorno=True)


class EventoManager(
    models.Manager
):  # disabled pylint: disable=too-many-public-methods
    def com_status_recebido(self):
        subquery = self.values("idsequenciaetiqueta").annotate(
            last_event_id=Max("idevento")
        )

        return self.filter(
            idsequenciaetiqueta__in=[
                item["idsequenciaetiqueta"] for item in subquery
            ],
            idevento__in=[item["last_event_id"] for item in subquery],
            status="RECEBIDO",
        ).order_by("-idevento")

    def com_status_termo_fim(self):
        subquery = self.values("idsequenciaetiqueta").annotate(
            last_event_id=Max("idevento")
        )

        return self.filter(
            idsequenciaetiqueta__in=[
                item["idsequenciaetiqueta"] for item in subquery
            ],
            idevento__in=[item["last_event_id"] for item in subquery],
            status="TERMO_FIM",
        ).order_by("-idevento")

    def com_status_embalado(self):
        subquery = self.values("idsequenciaetiqueta").annotate(
            last_event_id=Max("idevento")
        )

        return self.filter(
            idsequenciaetiqueta__in=[
                item["idsequenciaetiqueta"] for item in subquery
            ],
            idevento__in=[item["last_event_id"] for item in subquery],
            status="EMBALADO",
        ).order_by("-idevento")

    def com_status_embalado_ou_abortado(self):
        subquery = self.values("idsequenciaetiqueta").annotate(
            last_event_id=Max("idevento")
        )

        return (
            self.filter(
                idsequenciaetiqueta__in=[
                    item["idsequenciaetiqueta"] for item in subquery
                ],
                idevento__in=[item["last_event_id"] for item in subquery],
            )
            .filter(
                models.Q(status="EMBALADO")
                | models.Q(status="ABORTADO", idautoclavagem__isnull=False)
            )
            .order_by("-idevento")
        )

    def com_status_recebido_ou_abortado(self):
        subquery = self.values("idsequenciaetiqueta").annotate(
            last_event_id=Max("idevento")
        )

        return (
            self.filter(
                idsequenciaetiqueta__in=[
                    item["idsequenciaetiqueta"] for item in subquery
                ],
                idevento__in=[item["last_event_id"] for item in subquery],
            )
            .filter(
                models.Q(status="RECEBIDO")
                | models.Q(status="ABORTADO", idtermodesinfeccao__isnull=False)
            )
            .order_by("-idevento")
        )

    def com_status_termo_fim_ou_abortado(self):
        subquery = self.values("idsequenciaetiqueta").annotate(
            last_event_id=Max("idevento")
        )

        return (
            self.filter(
                idsequenciaetiqueta__in=[
                    item["idsequenciaetiqueta"] for item in subquery
                ],
                idevento__in=[item["last_event_id"] for item in subquery],
            )
            .filter(
                models.Q(status="TERMO_FIM")
                | models.Q(status="ABORTADO", idautoclavagem__isnull=False)
            )
            .order_by("-idevento")
        )

    def ultimo_com_status_termo_fim(self, serial):
        return self.filter(
            idsequenciaetiqueta=serial, status="TERMO_FIM"
        ).first()

    def com_status_esterilizacao_inicio_fim(self):
        subquery = self.values("idsequenciaetiqueta").annotate(
            last_event_id=Max("idevento")
        )

        return self.filter(
            idsequenciaetiqueta__in=[
                item["idsequenciaetiqueta"] for item in subquery
            ],
            idevento__in=[item["last_event_id"] for item in subquery],
            status__in=[
                SerialSituacaoEnum.ESTERILIZACAO_INICIO,
                SerialSituacaoEnum.ESTERILIZACAO_FIM,
            ],
        ).order_by("-idevento")

    def com_status_distribuido(self):
        subquery = self.values("iddistribuicao").annotate(
            last_event_id=Max("idevento")
        )

        return self.filter(
            iddistribuicao__in=[item["iddistribuicao"] for item in subquery],
            idevento__in=[item["last_event_id"] for item in subquery],
            status="DISTRIBUIDO",
        ).order_by("-idevento")

    def ultimo_evento(self, serial):
        return (
            self.filter(idsequenciaetiqueta=serial)
            .order_by("-idevento")
            .first()
        )

    def registra_evento(self, **kwargs):
        defaults = {
            "dataevento": helpers.data_local_atual(),
            "horaevento": helpers.hora_local_atual(),
        }

        defaults.update(kwargs)

        evento = self.create(**defaults)
        return evento

    def registra_preparo(self, serial, usuario, producao):
        return self.registra_evento(
            idsequenciaetiqueta=serial.idsequenciaetiqueta,
            status="EMBALADO",
            idusu=usuario.usuario_legado,
            preparo=producao,
            nomecliente=serial.idcaixa.cliente,
            cliente=serial.idcaixa.cliente,
            descricaocaixa=serial.idcaixa.nome,
            apelidousuarioprimario=usuario.username,
            dataproducao=helpers.datahora_local_atual(),
        )

    def registra_esterilizacao(
        self,
        serial,
        usuario,
        esterilizacao,
        status,
        data_inicio=None,
        data_fim=None,
    ):  # pylint: disable=too-many-arguments
        return self.registra_evento(
            idsequenciaetiqueta=serial.idsequenciaetiqueta,
            status=status,
            idusu=usuario.usuario_legado,
            idautoclavagem=esterilizacao,
            nomecliente=serial.idcaixa.cliente,
            cliente=serial.idcaixa.cliente,
            descricaocaixa=serial.idcaixa.nome,
            apelidousuarioprimario=usuario.username,
            ciclo=esterilizacao.ciclo,
            datainicioautoclavagem=data_inicio,
            datafimautoclavagem=data_fim,
        )

    def registra_esterilizacao_teste(
        self,
        usuario,
        esterilizacao,
        status,
        data_inicio=None,
        data_fim=None,
    ):  # pylint: disable=too-many-arguments
        return self.registra_evento(
            status=status,
            idusu=usuario.usuario_legado,
            idautoclavagem=esterilizacao,
            descricaocaixa="ESTERILIZAÇÃO TESTE",
            apelidousuarioprimario=usuario.username,
            ciclo=esterilizacao.ciclo,
            datainicioautoclavagem=data_inicio,
            datafimautoclavagem=data_fim,
        )

    def registra_termodesinfeccao(
        self,
        serial,
        usuario,
        termodesinfeccao,
        status,
        data_inicio=None,
        data_fim=None,
    ):  # pylint: disable=too-many-arguments
        return self.registra_evento(
            idsequenciaetiqueta=serial.idsequenciaetiqueta,
            status=status,
            idusu=usuario.usuario_legado,
            idtermodesinfeccao=termodesinfeccao,
            nomecliente=serial.idcaixa.cliente,
            cliente=serial.idcaixa.cliente,
            descricaocaixa=serial.idcaixa.nome,
            apelidousuarioprimario=usuario.username,
            ciclo=termodesinfeccao.ciclo,
            datainiciotermodesinfecao=data_inicio,
            datafimtermodesinfecao=data_fim,
        )

    def registra_esterilizacao_inicio(self, serial, usuario, esterilizacao):
        return self.registra_esterilizacao(
            serial,
            usuario,
            esterilizacao,
            "ESTERILIZACAO_INICIO",
            data_inicio=helpers.datahora_local_atual(),
        )

    def registra_esterilizacao_fim(self, serial, usuario, esterilizacao):
        return self.registra_esterilizacao(
            serial,
            usuario,
            esterilizacao,
            "ESTERILIZACAO_FIM",
            data_fim=helpers.datahora_local_atual(),
        )

    def registra_esterilizacao_teste_inicio(self, usuario, esterilizacao):
        return self.registra_esterilizacao_teste(
            usuario,
            esterilizacao,
            "ESTERILIZACAO_INICIO",
            data_inicio=helpers.datahora_local_atual(),
        )

    def registra_esterilizacao_teste_fim(self, usuario, esterilizacao):
        return self.registra_esterilizacao_teste(
            usuario,
            esterilizacao,
            "ESTERILIZACAO_FIM",
            data_fim=helpers.datahora_local_atual(),
        )

    def registra_termodesinfeccao_inicio(
        self, serial, usuario, termodesinfeccao
    ):
        return self.registra_termodesinfeccao(
            serial,
            usuario,
            termodesinfeccao,
            "TERMO_INICIO",
            data_inicio=helpers.datahora_local_atual(),
        )

    def registra_termodesinfeccao_fim(self, serial, usuario, termodesinfeccao):
        return self.registra_termodesinfeccao(
            serial,
            usuario,
            termodesinfeccao,
            "TERMO_FIM",
            data_fim=helpers.datahora_local_atual(),
        )

    def registra_processo_abortado(self, serial, usuario, instancia):
        from .models import (  # pylint: disable=import-outside-toplevel
            Autoclavagem,
            Termodesinfeccao,
        )

        if isinstance(instancia, Autoclavagem):
            return self.registra_evento(
                idsequenciaetiqueta=serial.idsequenciaetiqueta,
                status="ABORTADO",
                idusu=usuario.usuario_legado,
                idautoclavagem=instancia,
                nomecliente=serial.idcaixa.cliente,
                cliente=serial.idcaixa.cliente,
                descricaocaixa=serial.idcaixa.nome,
                apelidousuarioprimario=usuario.username,
            )

        if isinstance(instancia, Termodesinfeccao):
            return self.registra_evento(
                idsequenciaetiqueta=serial.idsequenciaetiqueta,
                status="ABORTADO",
                idusu=usuario.usuario_legado,
                idtermodesinfeccao=instancia,
                nomecliente=serial.idcaixa.cliente,
                cliente=serial.idcaixa.cliente,
                descricaocaixa=serial.idcaixa.nome,
                apelidousuarioprimario=usuario.username,
            )

        return None

    def registra_processo_teste_abortado(self, usuario, instancia):
        from .models import (  # pylint: disable=import-outside-toplevel
            Autoclavagem,
            Termodesinfeccao,
        )

        if isinstance(instancia, Autoclavagem):
            return self.registra_evento(
                status="ABORTADO",
                idusu=usuario.usuario_legado,
                idautoclavagem=instancia,
                apelidousuarioprimario=usuario.username,
            )

        if isinstance(instancia, Termodesinfeccao):
            return self.registra_evento(
                status="ABORTADO",
                idusu=usuario.usuario_legado,
                idtermodesinfeccao=instancia,
                apelidousuarioprimario=usuario.username,
            )

        return None

    def registra_distribuicao(self, serial, distribuicao):
        return self.registra_evento(
            idsequenciaetiqueta=serial.idsequenciaetiqueta,
            status="DISTRIBUIDO",
            idusu=distribuicao.idusu,
            nomecliente=serial.idcaixa.cliente,
            cliente=serial.idcaixa.cliente,
            descricaocaixa=serial.idcaixa.nome,
            apelidousuarioprimario=distribuicao.idusu.apelidousu,
            iddistribuicao=distribuicao,
            datadistribuicao=helpers.datahora_local_atual(),
        )


class AutoclavagemManager(models.Manager):
    def ciclos_em_andamento(self):
        return (
            self.filter(statusfim__isnull=True, statusabortado__isnull=True)
            .prefetch_related("equipamento")
            .order_by("-id")
        )

    def todos_ciclos(self):
        return self.prefetch_related("equipamento").all().order_by("-id")

    def ciclos_finalizados(self):
        return (
            self.filter(statusfim__isnull=False)
            .prefetch_related("itens__serial__idcaixa__cliente", "equipamento")
            .order_by("-id")
        )


class ItemAutoclavagemManager(models.Manager):
    def caixas_recentes(self):
        from .models import Evento  # pylint: disable=import-outside-toplevel

        eventos_recentes = Evento.objects.com_status_esterilizacao_inicio_fim()
        ids_autoclavagem = eventos_recentes.values_list(
            "idautoclavagem", flat=True
        ).distinct()

        return self.filter(autoclavagem__in=ids_autoclavagem)


class EquipamentoManager(models.Manager):
    def termodesinfectoras(self, ambos=False):
        if ambos is False:
            return self.filter(
                tipo=TipoEquipamentoEnum.TERMODESINFECTORA, disponivel=True
            )
        return self.filter(tipo=TipoEquipamentoEnum.TERMODESINFECTORA)

    def autoclaves(self, ambos=False):
        if ambos is False:
            return self.filter(
                tipo=TipoEquipamentoEnum.AUTOCLAVE, disponivel=True
            )
        return self.filter(tipo=TipoEquipamentoEnum.AUTOCLAVE)

    def seladoras(self, ambos=False):
        if ambos is False:
            return self.filter(
                tipo=TipoEquipamentoEnum.SELADORA, disponivel=True
            )
        return self.filter(tipo=TipoEquipamentoEnum.SELADORA)


class EstoqueManager(models.Manager):
    def em_estoque(self):
        return self.filter(status="ARMAZENADO")

    def distribuidos(self):
        return self.filter(status="DISTRIBUIDO")

    def adiciona_ao_estoque(self, serial, validade):
        return self.create(
            quantidade=1,
            status="ARMAZENADO",
            serial=serial,
            datavalidade=validade,
        )

    def retira_do_estoque(self, serial):
        item_estoque = self.get(
            serial=serial,
            quantidade__gt=0,
            status="ARMAZENADO",
        )
        item_estoque.quantidade = 0
        item_estoque.status = "DISTRIBUIDO"
        item_estoque.save()

    def agrupa_itens_por_clientes(self, queryset):
        results = []
        for cliente_id, grupo in groupby(queryset, key=lambda x: x["cliente"]):
            lista_de_grupos = list(grupo)
            nome_cliente = None

            if lista_de_grupos:
                nome_cliente = (
                    lista_de_grupos[0]["nome_fantasia_cliente"]
                    if lista_de_grupos[0]["nome_fantasia_cliente"]
                    else lista_de_grupos[0]["nome_cliente"]
                )

            results.append(
                {
                    "cliente": cliente_id,
                    "nome_cliente": nome_cliente,
                    "itens": [
                        {
                            "modelo": item["modelo"],
                            "idcaixa": item["idcaixa"],
                            "nome": item["nome"],
                            "estoque": item["estoque"],
                        }
                        for item in lista_de_grupos
                    ],
                }
            )

        return results

    def modelos_por_cliente(self, cliente):
        return (
            self.filter(
                Q(status="ARMAZENADO", serial__idcaixa__cliente__idcli=cliente)
            )
            .select_related("serial__idcaixa__cliente")
            .values(
                modelo=F("serial__idcaixa__codigo_modelo"),
                idcaixa=F("serial__idcaixa__id"),
                nome=F("serial__idcaixa__nome"),
            )
            .annotate(estoque=Count("*"))
            .order_by("serial__idcaixa__cliente", "serial__idcaixa")
        )

    def sequenciais_por_cliente(self, cliente, modelo):
        filter_args = []

        if cliente:
            filter_args = {"serial__idcaixa__cliente": cliente}

        if modelo:
            filter_args = {"serial__idcaixa__codigo_modelo": modelo}

        queryset = (
            self.filter(status="ARMAZENADO", **filter_args)
            .values(
                idcaixa=F("serial__idcaixa__id"),
                descricao_caixa=F("serial__idcaixa__descricao"),
                sequencial=F("serial"),
                modelo=F("serial__idcaixa__codigo_modelo"),
                cliente=F("serial__idcaixa__cliente"),
                validade=F("datavalidade"),
                data_producao=F("serial__data_ultima_situacao"),
                nome_fantasia_cliente=F(
                    "serial__idcaixa__cliente__nomefantasiacli"
                ),
            )
            .order_by("serial__idcaixa__cliente")
        )
        return self.agrupa_sequenciais_por_cliente(queryset)

    def agrupa_sequenciais_por_cliente(self, queryset):
        lista = list(queryset)
        lista.sort(key=lambda x: x["cliente"])

        lista_de_grupos = groupby(lista, key=lambda x: x["cliente"])

        resultado_agrupamento = []

        for chave, grupo in lista_de_grupos:
            itens_do_grupo = list(grupo)

            if len(itens_do_grupo) == 1:
                item = itens_do_grupo[0]
                resultado_agrupamento.append(
                    {
                        "id": chave,
                        "nome": (
                            item["nome_fantasia_cliente"]
                            if item["nome_fantasia_cliente"]
                            else item["nome_cliente"]
                        ),
                        "itens": [item],
                    }
                )
            else:
                resultado_agrupamento.append(
                    {
                        "id": chave,
                        "nome": (
                            itens_do_grupo[0]["nome_fantasia_cliente"]
                            if itens_do_grupo[0]["nome_fantasia_cliente"]
                            else itens_do_grupo[0]["nome_cliente"]
                        ),
                        "itens": itens_do_grupo,
                    }
                )

        return resultado_agrupamento

    def check_caixas_criticas(self, cliente_id: int) -> dict:
        caixas_por_cliente = self.filter(
            status="ARMAZENADO", serial__idcaixa__cliente=cliente_id
        ).distinct("serial__idsequenciaetiqueta")

        prazo: datetime = datetime.now() - relativedelta(days=5)
        dias_parados = ExtractDay(
            datetime.now() - F("serial__data_ultima_situacao")
        )
        caixas_criticas = (
            caixas_por_cliente.filter(serial__data_ultima_situacao__lte=prazo)
            .annotate(dias_parados=dias_parados)
            .values(
                idcaixa=F("serial__idcaixa__id"),
                modelo=F("serial__idcaixa__codigo_modelo"),
                descricao=F("serial__idcaixa__nome"),
                produzido_em=F("serial__data_ultima_situacao"),
                sequencial=F("serial__idsequenciaetiqueta"),
                dias_parados=F("dias_parados"),
            )
        )

        return {
            "total_disponivel": caixas_por_cliente.count(),
            "total_critico": caixas_criticas.count(),
            "caixas_criticas": caixas_criticas,
        }

    def get_clientes_com_caixas_em_distribuicao(
        self, cliente_ids: list[int] = None
    ) -> list:
        clientes: QuerySet = (
            self.filter(
                status="ARMAZENADO", serial__idcaixa__cliente__ativo=True
            )
            .distinct("serial__idcaixa__cliente")
            .order_by("serial__idcaixa__cliente")
        )

        if cliente_ids:
            clientes = clientes.filter(
                Q(serial__idcaixa__cliente__idcli__in=cliente_ids)
            )

        data: list = []
        for i in clientes:
            client_id: int = i.serial.idcaixa.cliente.idcli
            estoque: dict = self.check_caixas_criticas(client_id)
            data.append(
                {
                    "cliente_id": client_id,
                    "nome": i.serial.idcaixa.cliente.nome_exibicao,
                    "estoque": estoque,
                }
            )
        return data

    def get_caixas_by_cliente_and_group_sequenciais(
        self, id_client: int, search: str
    ) -> QuerySet:
        caixas: QuerySet = (
            self.filter(
                status="ARMAZENADO", serial__idcaixa__cliente=id_client
            )
            .values(
                caixa_id=F("serial__idcaixa__id"),
                modelo=F("serial__idcaixa__codigo_modelo"),
                nome=F("serial__idcaixa__nome"),
                sequencial=F("serial__idsequenciaetiqueta"),
            )
            .distinct("serial__idsequenciaetiqueta")
        )

        if search is not None:
            caixas = caixas.filter(
                Q(serial__idsequenciaetiqueta__icontains=search)
                | Q(serial__idcaixa__codigo_modelo__icontains=search)
                | Q(serial__idcaixa__nome__icontains=search)
            )

        for i in caixas:
            estoque = self.filter(serial__idcaixa=i["caixa_id"])[0]
            i["validade"] = helpers.date_format(
                estoque.serial.validade_calculada, "D"
            )
            i["produzido_em"] = helpers.date_format(
                estoque.serial.data_ultima_situacao, "F"
            )

        return caixas


class TermodesinfeccaoManager(models.Manager):
    def ciclos_em_andamento(self):
        return (
            self.filter(statusfim__isnull=True, statusabortado__isnull=True)
            .prefetch_related("equipamento")
            .order_by("-id")
        )

    def todos_ciclos(self):
        return self.prefetch_related("equipamento").all().order_by("-id")

    def ciclos_finalizados(self):
        return (
            self.filter(statusfim__isnull=False)
            .prefetch_related("itens__serial__idcaixa__cliente", "equipamento")
            .order_by("-id")
        )


class ClienteManager(models.Manager):
    def clientes_ativos(self) -> QuerySet:
        return super().get_queryset().filter(ativo=True)

    def todos_clientes(self) -> QuerySet:
        return super().get_queryset()

    def clientes_inativos(self) -> QuerySet:
        return super().get_queryset().filter(ativo=False)


class ComplementoManager(models.Manager):
    def complementos_ativos(self) -> QuerySet:
        return super().get_queryset().filter(status="ATIVO")

    def todos_complementos(self) -> QuerySet:
        return super().get_queryset()

    def complementos_inativos(self) -> QuerySet:
        return super().get_queryset().filter(status="INATIVO")


class SequenciaetiquetaManager(models.Manager):
    def caixas_aguardando_conferencia(self) -> models.QuerySet:
        queryset = self.get_queryset()
        queryset = queryset.select_related(
            "idcaixa__cliente",
        ).filter(
            Q(ultima_situacao=SerialSituacaoEnum.NAO_UTILIZADO)
            | Q(ultima_situacao=SerialSituacaoEnum.AGUARDANDO_CONFERENCIA)
        )

        return queryset
