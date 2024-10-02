from django.db import transaction

from common import helpers
from common.enums import RecebimentoEnum
from common.models import (
    Cliente,
    Coleta,
    ColetaEntregaModel,
    Distribuicao,
    Entrega,
    Evento,
    Itemdistribuicao,
    Recebimento,
    Sequenciaetiqueta,
    Setor,
    SolicitacaoEsterilizacaoModel,
    Veiculo,
)
from rest_framework.exceptions import ValidationError
from users.models import Motorista, User

from .base_service import BaseService


class GestaoLogisticaService(BaseService):
    def __init__(self, usuario: User):
        self.usuario = usuario
        self.distribuicao = None

    @staticmethod
    def alterar_motorista(
        coleta_entrega: ColetaEntregaModel, motorista: Motorista
    ) -> ColetaEntregaModel:
        coleta_entrega.motorista = motorista
        coleta_entrega.save()
        return coleta_entrega

    @staticmethod
    def alterar_veiculo(
        coleta_entrega: ColetaEntregaModel, veiculo: Veiculo
    ) -> ColetaEntregaModel:
        coleta_entrega.veiculo = veiculo
        coleta_entrega.motorista = veiculo.motorista_atual
        coleta_entrega.save()
        return coleta_entrega

    @staticmethod
    @transaction.atomic
    def preparar_coleta(
        solicitacao_esterilizacao: SolicitacaoEsterilizacaoModel,
        motorista: Motorista,
    ) -> Coleta:
        """Adiciona uma solicitação à lista a ser coletada,
        atribuindo, portanto, motorista e o veículo que será utilizado.

        Args:
            solicitacao_esterilizacao (SolicitacaoEsterilizacaoModel):
                Solicitação a ser coletada
            motorista (Motorista): Motorista que fará a coleta
            veiculo (Veiculo): Veículo que será utilizado na coleta

        Returns:
            Coleta: Coleta criada
        """

        if not motorista.veiculo_atual:
            raise ValidationError(
                detail="Motorista não está alocado a um veículo.",
                code="motorista_sem_veiculo",
            )

        if not solicitacao_esterilizacao.is_pendente:
            raise ValidationError(
                detail="Solicitação não está aguardando coleta.",
                code="solicitacao_nao_pendente",
            )

        solicitacao_esterilizacao.iniciar_transporte()

        coleta = Coleta.objects.create(
            solicitacao_esterilizacao=solicitacao_esterilizacao,
            motorista=motorista,
            veiculo=motorista.veiculo_atual,
        )

        return coleta

    @staticmethod
    @transaction.atomic
    def iniciar_coleta(solicitacao: SolicitacaoEsterilizacaoModel) -> Coleta:
        coleta = solicitacao.coleta
        coleta.iniciar()

        coleta.solicitacao_esterilizacao.iniciar_transporte()

        return coleta

    @staticmethod
    @transaction.atomic
    def finalizar_coleta(coleta: Coleta) -> Coleta:
        coleta.finalizar()

        coleta.solicitacao_esterilizacao.iniciar_processamento()

        return coleta

    @staticmethod
    @transaction.atomic
    def iniciar_entrega(entrega: Entrega) -> Entrega:
        entrega.iniciar()

        entrega.solicitacao_esterilizacao.iniciar_transporte()

        return entrega

    @staticmethod
    @transaction.atomic
    def finalizar_entrega(entrega: Entrega) -> Entrega:
        entrega.finalizar()

        entrega.solicitacao_esterilizacao.finalizar_entrega()

        return entrega

    @transaction.atomic
    # pylint: disable=too-many-arguments
    def distribuir_caixas(
        self,
        cliente: Cliente,
        setor: Setor,
        cautela,
        solicitacao_esterilizacao: SolicitacaoEsterilizacaoModel | None,
        lista_seriais: list[Sequenciaetiqueta],
    ) -> Distribuicao:
        """Registra uma distribuição de caixas com foco no cenário de
        CME intrahospitalar:
            - Cria uma Distribuição
            - Cria os Itens da Distribuição
            - Cria um recebimento, para que o item já possa ser recebido novamente

        Returns:
            Distribuicao: Distribuição criada
        """
        # TODO: Refatorar para não autorizar em caso de ser uma caixa com solicitação
        if solicitacao_esterilizacao:
            for serial in lista_seriais:
                if not solicitacao_esterilizacao.itens.filter(
                    caixa=serial
                ).exists():
                    raise ValidationError(
                        detail=f"Caixa {serial} não faz parte da solicitação.",
                        code="caixa_naopertence_solicitacao",
                    )

        self.distribuicao = Distribuicao.objects.create(
            setor=setor,
            numerocautela=cautela,
            solicitacao_esterilizacao_id=solicitacao_esterilizacao,
            datadistribuicao=helpers.datahora_local_atual(),
            dtdistribuicao=helpers.data_local_atual(),
            idusu=self.usuario.usuario_legado,
            created_by=self.usuario,
            updated_by=self.usuario,
        )

        for serial in lista_seriais:
            Itemdistribuicao.objects.create(
                idcli=cliente,
                iddistribuicao=self.distribuicao,
                idsequenciaetiqueta=serial,
            )
            Evento.objects.registra_distribuicao(serial, self.distribuicao)

        recebimento = Recebimento.objects.create(
            datarecebimento=helpers.datahora_local_atual(),
            statusrecebimento=RecebimentoEnum.AGUARDANDO_CONFERENCIA.value,
            idusu=self.usuario.usuario_legado,
            solicitacao_esterilizacao_id=solicitacao_esterilizacao,
            idorigem=None,
        )

        for serial in lista_seriais:
            serial.recebimento.add(recebimento.idrecebimento)
            serial.alterar_situacao_para_aguardando_conferencia()

        return self.distribuicao
