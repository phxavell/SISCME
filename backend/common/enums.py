from enum import Enum

from django.db import models
from django.utils.translation import gettext_lazy as _


class SolicitacaoEnum(Enum):
    PENDENTE = "PENDENTE"
    TRANSPORTE = "TRANSPORTE"
    PROCESSANDO = "PROCESSANDO"
    PRONTO = "PRONTO"
    ENTREGUE = "ENTREGUE"
    CANCELADO = "CANCELADO"


class RecebimentoEnum(Enum):
    AGUARDANDO_CONFERENCIA = "AGUARDANDO_CONFERENCIA"
    RECEBIDO = "RECEBIDO"
    TERMO = "TERMO_INICIO"


class RecebimentoItemEnum(models.IntegerChoices):
    AGUARDANDO_CONFERENCIA = 1, _("Aguardando conferência")
    RECEBIDO = 2, _("Recebido")


class DistribuicaoEnum(Enum):
    DISTRIBUIDO = "DISTRIBUIDO"


class EstoqueEnum(Enum):
    ARMAZENADO = "ARMAZENADO"


class ColetaEntregaSituacaoEnum(models.IntegerChoices):
    NAO_INICIADO = 0, _("Não Iniciado")
    EM_ANDAMENTO = 1, _("Em Andamento")
    FINALIZADO = 2, _("Finalizado")


class SerialSituacaoEnum(models.IntegerChoices):
    """
    Situação do serial

    Opções:
    - NAO_UTILIZADO: 0
    - AGUARDANDO_CONFERENCIA: 11
    - RECEBIDO: 1
    - MANUAL: 2
    - TERMO_INICIO: 3
    - TERMO_FIM: 4
    - EMBALADO: 5
    - ESTERILIZACAO_INICIO: 6
    - ESTERILIZACAO_FIM: 7
    - ESTOQUE: 8
    - ABORTADO_TERMO: 9
    - DISTRIBUIDO: 10
    - ABORTADO_ESTERILIZACAO: 12
    """

    NAO_UTILIZADO = 0, _("Não Utilizado")
    AGUARDANDO_CONFERENCIA = 11, _("Aguardando Conferência")
    RECEBIDO = 1, _("Recebido")
    MANUAL = 2, _("Manual")
    TERMO_INICIO = 3, _("Em termodesinfecção")
    TERMO_FIM = 4, _("Termodesinfecção concluída")
    EMBALADO = 5, _("Embalado")
    ESTERILIZACAO_INICIO = 6, _("Em esterilização")
    ESTERILIZACAO_FIM = 7, _("Esterilização concluída")
    ESTOQUE = 8, _("Em estoque")
    ABORTADO_TERMO = 9, _("Abortado em termodesinfecção")
    DISTRIBUIDO = 10, _("Distribuído")
    ABORTADO_ESTERILIZACAO = 12, _("Abortado em esterilização")


class SerialSituacaoStringEnum(models.TextChoices):
    """
    Situação do serial

    Opções:
    - NAO_UTILIZADO: "NAO_UTILIZADO"
    - AGUARDANDO_CONFERENCIA: "AGUARDANDO_CONFERENCIA"
    - RECEBIDO: "RECEBIDO
    - MANUAL: "MANUAL"
    - TERMO_INICIO: "TERMO_INICIO"
    - TERMO_FIM: "TERMO_FIM"
    - EMBALADO: "EMBALADO"
    - ESTERILIZACAO_INICIO: "ESTERILIZACAO_INICIO"
    - ESTERILIZACAO_FIM: "ESTERILIZACAO_FIM"
    - ESTOQUE: "ESTOQUE"
    - ABORTADO_TERMO: "ABORTADO_TERMO"
    - DISTRIBUIDO: "DISTRIBUIDO"
    - ABORTADO_ESTERILIZACAO: "ABORTADO_ESTERILIZACAO"
    """

    NAO_UTILIZADO = "NAO_UTILIZADO", _("Não Utilizado")
    AGUARDANDO_CONFERENCIA = "AGUARDANDO_CONFERENCIA", _(
        "Aguardando Conferência"
    )
    RECEBIDO = "RECEBIDO", _("Recebido")
    MANUAL = "MANUAL", _("Manual")
    TERMO_INICIO = "TERMO_INICIO", _("Em termodesinfecção")
    TERMO_FIM = "TERMO_FIM", _("Termodesinfecção concluída")
    EMBALADO = "EMBALADO", _("Embalado")
    ESTERILIZACAO_INICIO = "ESTERILIZACAO_INICIO", _("Em esterilização")
    ESTERILIZACAO_FIM = "ESTERILIZACAO_FIM", _("Esterilização concluída")
    ESTOQUE = "ESTOQUE", _("Em estoque")
    ABORTADO = "ABORTADO", _("Abortado")
    DISTRIBUIDO = "DISTRIBUIDO", _("Distribuído")


class ProgramacaEquipamentoEnum(models.TextChoices):
    P1 = "P1", _("P1")
    P2 = "P2", _("P2")
    P3 = "P3", _("P3")
    P4 = "P4", _("P4")
    P5 = "P5", _("P5")
    P6 = "P6", _("P6")
    P7 = "P7", _("P7")
    P8 = "P8", _("P8")
    P9 = "P9", _("P9")
    P10 = "P10", _("P10")
    P11 = "P11", _("P11")
    P12 = "P12", _("P12")


class TipoEquipamentoEnum(models.TextChoices):
    TERMODESINFECTORA = "TD", "Termodesinfectora"
    AUTOCLAVE = "AC", "Autoclave"
    LAVADORA_ULTRASSONICA = "LU", "Lavadora Ultrassônica"
    SECADORA = "SD", "Secadora"
    ESTERILIZADOR_GAS = "EG", "Esterilizador a Gás"
    ESTERILIZADOR_BAIXA_TEMP = "BT", "Esterilizador de Baixa Temperatura"
    CABINE_SEGURANCA_BIO = "CB", "Cabine de Segurança Biológica"
    SELADORA = "SL", "Seladora"
    DESINFECTORA_QUIMICA = "DQ", "Desinfectora Química"
    CARRINHO_TRANSPORTE = "CT", "Carrinho de Transporte"


class TipoIntegradorEnum(models.TextChoices):
    C2 = "Classe 02", "Teste de Bowie & Dick"
    C5 = "Classe 05", "Integrador Químico"


class Operacao(models.TextChoices):
    ENTRADA = "ENTRADA", _("ENTRADA")
    SAIDA = "SAIDA", _("SAIDA")


class TipoManutencaoEnum(models.TextChoices):
    CORRETIVA = "CR", "Corretiva"
    PREVENTIVA = "PR", "Preventiva"
    PREDITIVA = "PD", "Preditiva"


class TipoOcorrenciaEnum(models.TextChoices):
    BAIXA = "BA", "Baixa no Inventário de Instrumentais Cirúrgicos"
    DESCARTADOS = "DE", "Itens Descartados por Falha no Processo de Autoclave"
    SUJIDADE = "SU", "Material com Sujidade"
    BIOLOGICO = "BI", "Acidentes com Risco Biológico"
    NAO_CONFORMIDADE = (
        "NC",
        "Não Conformidade na Devolução de Materiais Consignados",
    )
    PROCESSAMENTO = "PR", "Processamento de Itens Sem Utilização"
    SUSPENSAO = (
        "SM",
        "Suspensão Cirúrgica Relacionada ao Processamento de Materiais",
    )
    FUNCIONALIDADE = "FU", "Problemas de Funcionalidade de Equipamentos"
    ATRASO = "AT", "Atraso de Cirurgia por Falta de Instrumental"
