from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator, RegexValidator
from django.db import models, transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

from common.enums import (
    ColetaEntregaSituacaoEnum,
    Operacao,
    RecebimentoItemEnum,
    TipoManutencaoEnum,
)
from common.exceptions import Conflict
from common.managers import ColetaEntregaManager, ColetaManager, EntregaManager
from common.mixins.mixins import TrackableMixin
from common.models.legacy import (
    Equipamento,
    Produto,
    Recebimento,
    Sequenciaetiqueta,
)
from users.models import User


class SolicitacaoEsterilizacaoModel(TrackableMixin):
    STATUS_CHOICES = [
        ("PENDENTE", _("Aguardando Coleta")),
        ("PROCESSANDO", _("Processando")),
        ("PRONTO", _("Em Arsenal")),
        ("ENTREGUE", _("Entregue")),
        ("CANCELADO", _("Cancelado")),
        ("TRANSPORTE", _("Em Transporte")),
    ]

    cliente = models.ForeignKey(
        "common.Cliente",
        models.DO_NOTHING,
        db_column="cliente_id",
        null=False,
        blank=False,
    )
    observacao = models.TextField(null=True, blank=True, default=None)
    situacao = models.CharField(
        max_length=255,
        null=False,
        blank=False,
        choices=STATUS_CHOICES,
        default="PENDENTE",
    )

    class Meta:
        db_table = "solicitacao_esterilizacao"
        verbose_name = "Solicitação de Esterilização"
        verbose_name_plural = "Solicitações de Esterilização"

    @receiver(post_save, sender="common.SolicitacaoEsterilizacaoModel")
    def create_historico(sender, instance, created, **kwargs):  # noqa
        if created:
            HistoricoSolicitacaoEsterilizacaoModel.objects.create(
                solicitacao_esterilizacao=instance,
                status=instance.situacao,
                data=instance.created_at,
                observacao=instance.observacao,
            )
        else:
            # Lógica para a atualização de histórico
            HistoricoSolicitacaoEsterilizacaoModel.objects.create(
                solicitacao_esterilizacao=instance,
                status=instance.situacao,
                data=instance.updated_at,
                observacao=instance.observacao,
            )

    @property
    def em_andamento(self):
        return self.situacao in [
            "PENDENTE",
            "PROCESSANDO",
            "PRONTO",
            "TRANSPORTE",
        ]

    @property
    def is_cancelada(self):
        return self.situacao == "CANCELADO"

    @property
    def is_entregue(self):
        return self.situacao == "ENTREGUE"

    @property
    def is_pendente(self):
        return self.situacao == "PENDENTE"

    @property
    def is_processando(self):
        return self.situacao == "PROCESSANDO"

    @property
    def em_arsenal(self):
        """Status da solicitação é 'PRONTO'."""
        return self.situacao == "PRONTO"

    @property
    def em_transporte(self):
        return self.situacao == "TRANSPORTE"

    @property
    def current_recebimento(self):
        """Retorna o recebimento atual para esta solicitação,
        considerando os status 'AGUARDANDO_CONFERENCIA' ou 'EM_CONFERENCIA'.

        Returns:
            Recebimento: Retorna o primeiro recebimento com os
            status especificados ou None se nenhum for encontrado.
        """
        return (
            self.recebimentos.filter(
                statusrecebimento__in=[
                    "AGUARDANDO_CONFERENCIA",
                    "EM_CONFERENCIA",
                ]
            )
            .order_by("-idrecebimento")
            .first()
        )

    @property
    def pode_ser_cancelada(self):
        """Checa todos os critérios que definem
        se uma solicitação pode ser cancelada ou não.

        Returns:
            bool: True se solicitação pode ser cancelada, False caso contrário.
        """
        return (
            self.is_pendente and not self.is_cancelada and not self.is_entregue
        )

    def alterar_status(self, novo_status):
        """Altera o status da solicitação.

        Args:
            novo_status (str): Novo status da solicitação.
        """
        if novo_status not in [status[0] for status in self.STATUS_CHOICES]:
            raise ValidationError(
                "Status inválido.", "status_solicitacao_invalido"
            )

        self.situacao = novo_status
        self.save()

    def cancelar(self):
        """Cancela a solicitação."""
        if not self.pode_ser_cancelada:
            raise ValidationError(
                "Solicitação não pode ser cancelada.",
                "solicitacao_nao_cancelavel",
            )
        self.alterar_status("CANCELADO")

    def iniciar_transporte(self):
        """Inicia o transporte da solicitação."""
        self.alterar_status("TRANSPORTE")

    def iniciar_processamento(self):
        """Inicia o processamento da solicitação."""
        self.alterar_status("PROCESSANDO")

    def finalizar_processamento(self):
        """Finaliza o processamento da solicitação."""
        self.alterar_status("PRONTO")

    def finalizar_entrega(self):
        """Finaliza a entrega da solicitação."""
        self.alterar_status("ENTREGUE")


class SolicitacaoEsterilizacaoItemModel(models.Model):
    solicitacao_esterilizacao = models.ForeignKey(
        SolicitacaoEsterilizacaoModel,
        models.DO_NOTHING,
        db_column="solicitacao_esterilizacao_id",
        null=False,
        blank=False,
        related_name="itens",
    )
    caixa = models.ForeignKey(
        Sequenciaetiqueta,
        models.DO_NOTHING,
        db_column="sequenciaetiqueta_id",
        null=False,
        blank=False,
    )

    class Meta:
        db_table = "solicitacao_esterilizacao_item"
        verbose_name = "Item de Solicitação de Esterilização"
        verbose_name_plural = "Itens de Solicitação de Esterilização"


class HistoricoSolicitacaoEsterilizacaoModel(models.Model):
    STATUS_CHOICES = [
        ("PENDENTE", _("Aguardando Coleta")),
        ("PROCESSANDO", _("Processando")),
        ("PRONTO", _("Em Arsenal")),
        ("ENTREGUE", _("Entregue")),
        ("CANCELADO", _("Cancelado")),
        ("TRANSPORTE", _("Em Transporte")),
    ]

    solicitacao_esterilizacao = models.ForeignKey(
        SolicitacaoEsterilizacaoModel,
        models.DO_NOTHING,
        db_column="solicitacao_esterilizacao_id",
        null=False,
        blank=False,
        related_name="historico",
    )
    status = models.CharField(
        max_length=255,
        null=False,
        blank=False,
        choices=STATUS_CHOICES,
        default="PENDENTE",
    )
    data = models.DateTimeField(null=False, blank=False)
    observacao = models.TextField(null=True, blank=True, default=None)

    class Meta:
        db_table = "historico_solicitacao_esterilizacao"
        verbose_name = "Histórico de Solicitação de Esterilização"
        verbose_name_plural = "Históricos de Solicitação de Esterilização"


class Veiculo(TrackableMixin):
    """Modelo de veículo.

    Args:
        TrackableMixin (Model): Adiciona campos de auditoria ao modelo.
    """

    # pylint: disable=import-outside-toplevel
    from users.models import Motorista

    descricao = models.CharField(blank=True, null=True, max_length=150)
    placa = models.CharField(
        unique=True,
        max_length=7,
        null=False,
        validators=[
            RegexValidator(
                r"(^[a-zA-Z]{3}\d{4}$)|(^[a-zA-Z]{3}\d[a-zA-Z]\d{2}$)",
                message=(
                    "Placa em formato inválido. "
                    "Deve conter somente letras e números, "
                    "no formato antigo (ABC1234) ou novo (Mercosul - ABC1D23)."
                ),
            )
        ],
    )
    marca = models.CharField(max_length=150, null=False)
    modelo = models.CharField(max_length=150, null=False)
    foto = models.ImageField(
        null=False,
        validators=[
            FileExtensionValidator(
                ["png", "jpg", "jpeg"],
                message="Formato de imagem inválido. Utilize PNG ou JPG/JPEG.",
            )
        ],
        upload_to="veiculos",
    )
    motorista_atual = models.ForeignKey(
        "users.Motorista", models.DO_NOTHING, null=True, blank=True
    )

    class Meta:
        managed = True
        db_table = "veiculo"
        verbose_name = "Veículo"
        verbose_name_plural = "Veículos"

    @classmethod
    def get_veiculo(cls, veiculo_id: int):
        """Retorna um veículo pelo ID.

        Args:
            veiculo_id (int): ID do veículo.

        Returns:
            Veiculo: Veículo encontrado.
        """
        try:
            return cls.objects.get(id=veiculo_id)
        except cls.DoesNotExist as exc:
            raise ValidationError(
                "Veículo não encontrado.", "veiculo_nao_encontrado"
            ) from exc

    @property
    def is_disponivel(self):
        """Retorna True se o veículo estiver disponível,
        False caso contrário."""
        return self.motorista_atual is None

    @property
    def ja_utilizado(self):
        return ColetaEntregaModel.objects.filter(veiculo=self).exists()

    def esta_disponivel_para(self, motorista: Motorista):
        """Verifica se o veículo está disponível e lança exceção se não estiver
        (se já estiver alocado a outro motorista).

        Args:
            motorista (Motorista): Motorista que receberá o veículo.

        Raises:
            ValidationError: Se o veículo já estiver alocado a
            um motorista diferente do atual.
        """
        if not self.is_disponivel and self.motorista_atual != motorista:
            raise Conflict(
                f"Veículo já está alocado ao motorista {str(self.motorista_atual).upper()}.",
                "veiculo_nao_disponivel",
            )

        return True

    @transaction.atomic
    def alocar(self, motorista: Motorista):
        """Aloca o veículo para o motorista informado.

        Args:
            motorista (Motorista): Motorista que receberá o veículo.
        """
        if not motorista:
            raise ValidationError(
                "Motorista não informado.", "motorista_nao_informado"
            )
        if self.esta_disponivel_para(motorista):
            self.motorista_atual = motorista
            self.save()

        return True

    @transaction.atomic
    def desalocar(self):
        """Desaloca o veículo."""
        if self.is_disponivel:
            raise Conflict(
                "Veículo não está alocado a nenhum motorista.",
                "veiculo_nao_alocado",
            )

        self.motorista_atual = None
        self.save()

        return True

    def __str__(self):
        return f"{self.placa} - {self.marca} {self.modelo}"

    def can_be_deleted(self):
        """Checa todos os critérios que definem
        se um veículo pode ser excluído ou não.

        Returns:
            bool: True se o veículo pode ser excluído, False caso contrário.
        """
        return not self.ja_utilizado

    def delete(self, *args, **kwargs):
        if self.can_be_deleted():
            super().delete(*args, **kwargs)
        else:
            raise ValidationError(
                "Este veículo não pode ser excluído pois "
                "já foi utilizado em coleta(s)/entrega(s).",
                "veiculo_utilizado",
            )


class ColetaEntregaModel(TrackableMixin):
    solicitacao_esterilizacao = models.ForeignKey(
        SolicitacaoEsterilizacaoModel,
        models.DO_NOTHING,
        db_column="solicitacao_esterilizacao_id",
        null=False,
        blank=False,
        related_name="coleta_entrega",
    )
    motorista = models.ForeignKey(
        "users.Motorista", models.DO_NOTHING, null=True
    )
    veiculo = models.ForeignKey(
        Veiculo,
        models.DO_NOTHING,
        null=False,
        blank=False,
        related_name="coletaentregas",
    )
    retorno = models.BooleanField(null=False, blank=False, default=False)
    situacao = models.IntegerField(
        null=False,
        blank=False,
        choices=ColetaEntregaSituacaoEnum.choices,
        default=ColetaEntregaSituacaoEnum.NAO_INICIADO,
        verbose_name="Situação",
    )

    objects = ColetaEntregaManager()

    class Meta:
        db_table = "coleta_entrega"
        verbose_name = "Coleta/Entrega"
        verbose_name_plural = "Coletas/Entregas"

    @property
    def is_pendente(self):
        return self.situacao == ColetaEntregaSituacaoEnum.NAO_INICIADO

    @property
    def is_iniciado(self):
        return self.situacao == ColetaEntregaSituacaoEnum.EM_ANDAMENTO

    @property
    def is_finalizado(self):
        return self.situacao == ColetaEntregaSituacaoEnum.FINALIZADO

    def alterar_status(self, novo_status: int) -> None:
        """Altera o status da coleta/entrega.

        Args:
            novo_status (int): Novo status da coleta/entrega.
        """
        if novo_status not in ColetaEntregaSituacaoEnum.values:
            raise ValidationError(
                f"Status {novo_status} é inválido. "
                f"Valores aceitáveis: {', '.join(map(str, ColetaEntregaSituacaoEnum.values))}.",
                "status_coletaentrega_invalido",
            )

        self.situacao = novo_status
        self.save()

    def iniciar(self):
        """Inicia a coleta/entrega."""
        if not self.is_pendente:
            raise ValidationError(
                f"{self._meta.verbose_name} já iniciada. Impossível iniciar novamente.",
                f"{self._meta.verbose_name.lower()}_ja_iniciada",
            )
        self.alterar_status(ColetaEntregaSituacaoEnum.EM_ANDAMENTO)

    def finalizar(self):
        """Finaliza a coleta/entrega."""
        if not self.is_iniciado:
            raise ValidationError(
                f"{self._meta.verbose_name} não iniciada. Impossível finalizar.",
                f"{self._meta.verbose_name.lower()}_nao_iniciada",
            )
        self.alterar_status(ColetaEntregaSituacaoEnum.FINALIZADO)


class Coleta(ColetaEntregaModel):
    objects = ColetaManager()

    class Meta:
        proxy = True
        verbose_name = "Coleta"
        verbose_name_plural = "Coletas"


class Entrega(ColetaEntregaModel):
    objects = EntregaManager()

    class Meta:
        proxy = True
        verbose_name = "Entrega"
        verbose_name_plural = "Entregas"


class Midia(models.Model):
    foto = models.ImageField(upload_to="processo/")
    recebimento = models.ForeignKey(
        "Recebimento",
        models.DO_NOTHING,
        db_column="idrecebimento",
        blank=True,
        null=True,
    )
    producao = models.ForeignKey(
        "Producao",
        models.DO_NOTHING,
        db_column="idproducao",
        blank=True,
        null=True,
    )
    nome = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = "midia"
        verbose_name = "Mídia"
        verbose_name_plural = "Mídias"


class RecebimentoItem(models.Model):
    serial = models.ForeignKey(
        Sequenciaetiqueta,
        models.DO_NOTHING,
        related_name="serial_recebimentos",
    )
    recebimento = models.ForeignKey(
        Recebimento,
        models.DO_NOTHING,
        related_name="recebimento_seriais",
    )
    situacao = models.IntegerField(
        choices=RecebimentoItemEnum.choices,
        default=RecebimentoItemEnum.AGUARDANDO_CONFERENCIA,
        null=True,
    )

    class Meta:
        managed = True
        db_table = "recebimento_item"
        verbose_name = "Item do recebimento"
        verbose_name_plural = "Itens do recebimento"


class IndicadoresEsterilizacao(Produto):
    """Proxy model para o produto indicador, que é um tipo de produto."""

    @property
    def is_indicador(self):
        return True

    class Meta:
        proxy = True
        verbose_name = "Indicador"
        verbose_name_plural = "Indicadores"


class Lote(TrackableMixin):
    codigo = models.CharField(unique=True, max_length=15)
    saldo = models.IntegerField(default=0)
    fabricacao = models.DateField()
    vencimento = models.DateField()
    indicador = models.ForeignKey(
        IndicadoresEsterilizacao, models.DO_NOTHING, db_column="indicador_id"
    )

    @property
    def is_usado(self):
        return self.movimentacaoestoque_set.filter(
            operacao=Operacao.SAIDA
        ).exists()

    class Meta:
        managed = True
        db_table = "lote"
        verbose_name = "Lote"
        verbose_name_plural = "Lotes"
        unique_together = (("codigo", "indicador"),)


class MovimentacaoEstoque(TrackableMixin):
    lote = models.ForeignKey(Lote, models.DO_NOTHING, db_column="lote_id")
    operacao = models.CharField(max_length=10, choices=Operacao.choices)
    quantidade = models.IntegerField()

    class Meta:
        managed = True
        db_table = "movimentacao_estoque"
        verbose_name = "Movimentação do estoque"
        verbose_name_plural = "Movimentações do estoque"


class RegistroManutencao(TrackableMixin):
    """
    Modelo para registro de manutenção de equipamentos.
    """

    inicio = models.DateTimeField(null=True, blank=True)
    inicio_planejado = models.DateTimeField(null=True, blank=True)
    fim = models.DateTimeField(null=True, blank=True)
    fim_planejado = models.DateTimeField(null=True, blank=True)
    usuario = models.ForeignKey(
        User,
        models.DO_NOTHING,
        related_name="usuarios_manutencao",
    )
    equipamento = models.ForeignKey(
        Equipamento,
        models.DO_NOTHING,
        related_name="equipamentos_manutencao",
    )
    tipo = models.CharField(
        choices=TipoManutencaoEnum.choices,
        max_length=2,
        null=False,
        blank=False,
    )

    descricao = models.TextField(null=True, blank=True)

    @property
    def duracao(self):
        if self.fim:
            return (self.fim - self.inicio).seconds
        return 0

    def clean(self) -> None:
        if self.inicio and self.fim and self.inicio > self.fim:
            raise ValidationError(
                "Data de início não pode ser maior que a data de fim.",
                "data_inicio_maior_que_fim",
            )

        if (
            self.inicio_planejado
            and self.fim_planejado
            and self.inicio_planejado > self.fim_planejado
        ):
            raise ValidationError(
                "Data de início planejada não pode ser maior que a data de fim planejada.",
                "data_inicio_planejada_maior_que_fim_planejada",
            )

    class Meta:
        managed = True
        db_table = "registro_manutencao"
        verbose_name = "Registro de Manutenção"
        verbose_name_plural = "Registros de Manutenção"
