# pylint: disable=too-many-lines
# TODO: Dividir em vários arquivos futuramente.
import uuid
from datetime import time

from django.apps import apps
from django.core.validators import FileExtensionValidator, RegexValidator
from django.db import models, transaction
from django.db.models import Max

from common import helpers
from common.enums import (
    ProgramacaEquipamentoEnum,
    RecebimentoEnum,
    SerialSituacaoEnum,
    TipoEquipamentoEnum,
    TipoIntegradorEnum,
)
from common.managers import (
    AutoclavagemManager,
    ClienteManager,
    ComplementoManager,
    EquipamentoManager,
    EstoqueManager,
    EventoManager,
    ItemAutoclavagemManager,
    ItemcaixaManager,
    SequenciaetiquetaManager,
    TermodesinfeccaoManager,
)
from common.mixins.autoincrement import AutoIncrementMixin
from common.mixins.mixins import HasRelationMixin, TrackableMixin
from dateutil.relativedelta import relativedelta
from rest_framework.exceptions import ValidationError
from simple_history.models import HistoricalRecords


class Autoclavagem(AutoIncrementMixin, TrackableMixin):
    class Status(models.TextChoices):
        INICIADO = "ESTERILIZACAO_INICIO", "Iniciado"
        FINALIZADO = "ESTERILIZACAO_FIM", "Finalizado"
        ABORTADO = "ABORTADO", "Abortado"

    id = models.BigAutoField(primary_key=True, db_column="idautoclavagem")
    ciclo = models.IntegerField(blank=True, null=True)
    datafim = models.DateTimeField(blank=True, null=True)
    datainicio = models.DateTimeField()
    statusfim = models.CharField(max_length=20, blank=True, null=True)
    statusinicio = models.CharField(max_length=20)
    programacao = models.CharField(
        max_length=99,
        choices=ProgramacaEquipamentoEnum.choices,
        blank=True,
        null=True,
        default=None,
        db_column="tipolimpeza",
    )
    equipamento = models.ForeignKey(
        "Equipamento", models.DO_NOTHING, db_column="idequipamento"
    )
    idusu = models.ForeignKey(
        "Usuario", models.DO_NOTHING, db_column="idusu", blank=True, null=True
    )
    idusuariosecundario = models.ForeignKey(
        "Usuariosecundario",
        models.DO_NOTHING,
        db_column="idusuariosecundario",
        blank=True,
        null=True,
    )
    dataabortado = models.DateTimeField(blank=True, null=True)
    statusabortado = models.CharField(max_length=20, blank=True, null=True)
    indicador = models.ForeignKey(
        "IndicadoresEsterilizacao", models.DO_NOTHING, blank=True, null=True
    )

    objects = AutoclavagemManager()
    duracao = models.IntegerField(blank=True, null=True)

    @property
    def situacao_atual(self):
        if self.statusabortado:
            return self.statusabortado

        if self.statusfim:
            return self.statusfim

        return self.statusinicio

    @property
    def data_fim(self):
        """Retorna data de fim da autoclavagem (datafim ou dataabortado)"""
        return self.datafim if self.datafim else self.dataabortado

    class Meta:
        managed = True
        db_table = "autoclavagem"
        verbose_name = "Ciclo de Autoclavagem"
        verbose_name_plural = "Ciclos de Autoclavagem"


class AutoclavagemAud(models.Model):
    idautoclavagem = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "autoclavagem_aud"
        unique_together = (("idautoclavagem", "rev"),)


class Caixa(AutoIncrementMixin, TrackableMixin):
    """
    Modelo referente à tabela "caixa", representando
    os modelos de caixa de kits de esterilização.

    Campos:
    - `id`: Identificador único.
    - `nome`: Nome descritivo, deve ser único. Regra de abreviação do nome.
    - `codigo_modelo`: Código único do modelo.
    - `validade`: Validade em meses.
    - `temperatura`: Temperatura de esterilização na autoclave (em Celsius).
    - `embalagem`: Tipo de embalagem (ver tabela "caixavalor").
    - `cliente`: Cliente usuário.
    - `tipo_caixa`: Tipo de caixa (ver tabela "tipocaixa").
    - `criticidade`: Nível de contato com o paciente.
    - `descricao`: Descrição geral.
    - `instrucoes_uso`: Instruções para esterilização,
        armazenamento, uso e transporte. Opcional.
    - `situacao`: Situação atual (ativo, inativo, em revisão).
    - `imagem`: Imagem representativa (opcional).
    - `prioridade`: Prioridade de uso. Informativo.
    - `categoria_uso`: Categoria de uso."""

    class Situacao(models.IntegerChoices):
        ATIVO = 1, "Ativo"
        INATIVO = 2, "Inativo"
        REVISAO = 3, "Em Revisão"

    class CategoriaUso(models.IntegerChoices):
        CIRURGIA_CARDIACA = 1, "Cirurgia Cardíaca"
        CIRURGIA_VASCULAR = 2, "Cirurgia Vascular"
        CIRURGIA_GERAL = 3, "Cirurgia Geral"
        CIRURGIA_NEUROLOGICA = 4, "Cirurgia Neurológica"
        CIRURGIA_ORTOPEDICA = 5, "Cirurgia Ortopédica"
        CIRURGIA_PLASTICA = 6, "Cirurgia Plástica"
        EMERGENCIA = 7, "Emergência"
        OUTROS = 8, "Outros"

    class Prioridade(models.IntegerChoices):
        URGENTE = 1, "Urgente"
        ALTA = 2, "Alta"
        MEDIA = 3, "Média"
        BAIXA = 4, "Baixa"

    class Criticidade(models.IntegerChoices):
        NAO_CRITICO = 1, "Não Crítico"
        SEMICRITICO = 2, "Semicrítico"
        CRITICO = 3, "Crítico"

    class Temperatura(models.TextChoices):
        TEMPERATURA_121 = "121", "121°C"
        TEMPERATURA_134 = "134", "134°C"

    nome_validator = RegexValidator(
        regex=r"^[A-Z0-9 º°]+$",
        message="O nome só pode conter letras maiúsculas, números e espaços.",
    )

    id = models.BigAutoField(primary_key=True, db_column="idcaixa")
    nome = models.CharField(
        unique=True,
        null=False,
        blank=False,
        max_length=90,
        db_column="descricao",
        validators=[nome_validator],
        help_text="Nome descritivo, deve ser único.",
    )
    codigo_modelo = models.CharField(
        unique=True,
        max_length=20,
        db_column="descricaoabreviado",
        help_text="Código único do modelo, gerado automaticamente a partir do "
        "nome e não pode ser alterado. "
        "É utilizado como prefixo para a numeração das etiquetas.",
    )
    validade = models.PositiveSmallIntegerField(
        db_column="mes",
        help_text="Validade do modelo de caixa em meses. Indique quantos meses"
        " o kit de esterilização permanece válido após ser preparado.",
    )
    temperatura = models.CharField(
        max_length=20,
        help_text="Temperatura padrão de esterilização do modelo de caixa "
        "na autoclave (em graus Celsius).",
        choices=Temperatura.choices,
    )
    embalagem = models.ForeignKey(
        "Caixavalor",
        models.DO_NOTHING,
        db_column="idcaixavalor",
        blank=True,
        null=True,
    )
    cliente = models.ForeignKey(
        "Cliente", models.DO_NOTHING, db_column="idcli"
    )
    tipo_caixa = models.ForeignKey(
        "Tipocaixa", models.DO_NOTHING, db_column="idtipocaixa"
    )
    # Novos campos:
    criticidade = models.IntegerField(
        choices=Criticidade.choices,
        null=True,
        help_text="Nível de contato com o paciente.",
    )
    descricao = models.CharField(
        max_length=255, blank=True, null=True, db_column="desc", default=""
    )
    instrucoes_uso = models.TextField(
        blank=True,
        null=True,
        help_text="Instruções para esterilização, "
        "armazenamento, uso e transporte.",
    )
    situacao = models.IntegerField(
        choices=Situacao.choices, default=Situacao.ATIVO, null=True
    )
    imagem = models.ImageField(
        upload_to="caixas",
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(
                ["png", "jpg", "jpeg"],
                message="Formato de imagem inválido. Utilize PNG ou JPG/JPEG.",
            )
        ],
    )
    prioridade = models.IntegerField(
        choices=Prioridade.choices,
        default=Prioridade.MEDIA,
        null=True,
        help_text="Prioridade de esterilização. Apenas informativo.",
    )
    categoria_uso = models.IntegerField(
        choices=CategoriaUso.choices, default=CategoriaUso.OUTROS, null=True
    )

    def __str__(self):
        return self.nome

    def __repr__(self):
        return f"<Caixa: {self.nome} (ID: {self.id})>"

    def _gerar_codigo_modelo(self, nome):
        codigo = "".join([palavra[0] for palavra in nome.split() if palavra])
        return codigo.upper()

    @property
    def lista_de_caixas(self):
        return self.caixas.all()

    @property
    def lista_de_itens(self):
        return self.itens.all()

    @property
    def lista_ids_produtos_dos_itens(self):
        return self.itens.values_list("produto", flat=True)

    @property
    def quantidade_itens(self):
        return self.itens.count()

    def save(self, *args, **kwargs):
        """Sobrescreve método para autogerar código do modelo de caixa."""
        if not self.pk:
            self.codigo_modelo = self._gerar_codigo_modelo(self.nome)

            sufixo = 1
            while Caixa.objects.filter(
                codigo_modelo=self.codigo_modelo
            ).exists():
                self.codigo_modelo = (
                    f"{self._gerar_codigo_modelo(self.nome)}{sufixo}"
                )
                sufixo += 1

        if self.cliente.ativo is False:
            raise ValidationError(
                detail="Não é possível criar um modelo de caixa para um cliente desativado.",
                code="cliente_desativado",
            )

        super().save(*args, **kwargs)

    def clean(self):
        """
        Validação do campo `codigo_modelo` (não pode alterar após criação).
        """
        if self.pk:
            original = Caixa.objects.get(pk=self.pk)
            if original.codigo_modelo != self.codigo_modelo:
                raise ValidationError(
                    "O campo 'Código do Modelo' não "
                    "pode ser alterado após a criação."
                )

        super().clean()

    def gerar_seriais(self, quantidade: int) -> list["Sequenciaetiqueta"]:
        """Gera uma lista de seriais para a caixa.

        Args:
            quantidade (int): Quantidade de seriais a serem gerados.

        Returns:
            list[Sequenciaetiqueta]: Lista de objetos Sequenciaetiqueta gerados.
        """
        if quantidade <= 0:
            raise ValueError("A quantidade deve ser maior que zero.")

        seriais_gerados = []

        ultimo_serial = (
            Sequenciaetiqueta.objects.filter(idcaixa=self)
            .aggregate(Max("idsequenciaetiqueta"))
            .get("idsequenciaetiqueta__max")
        )

        prefixo = self.codigo_modelo

        if ultimo_serial:
            parte_numerica = ultimo_serial[len(prefixo) :]  # noqa
            ultimo_numero = (
                int(parte_numerica) if parte_numerica.isdigit() else 0
            )
        else:
            ultimo_numero = 0

        with transaction.atomic():
            for i in range(1, quantidade + 1):
                novo_numero = ultimo_numero + i
                novo_serial = f"{prefixo}{novo_numero:03d}"
                serial_obj = Sequenciaetiqueta.objects.create(
                    idsequenciaetiqueta=novo_serial,
                    idcaixa=self,
                )
                seriais_gerados.append(serial_obj)

        return seriais_gerados

    class Meta:
        managed = True
        db_table = "caixa"
        verbose_name = "Modelo de Caixa"
        verbose_name_plural = "Modelos de Caixa"


class CaixaAud(models.Model):
    idcaixa = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "caixa_aud"
        unique_together = (("idcaixa", "rev"),)


class Caixavalor(AutoIncrementMixin, TrackableMixin):
    id = models.BigAutoField(primary_key=True, db_column="idcaixavalor")
    descricao = models.CharField(max_length=90)
    valorcaixa = models.DecimalField(
        unique=True, max_digits=19, decimal_places=2
    )

    def __str__(self):
        return self.descricao

    class Meta:
        managed = True
        db_table = "caixavalor"
        verbose_name = "Embalagem"
        verbose_name_plural = "Embalagens"


class CaixavalorAud(models.Model):
    idcaixavalor = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "caixavalor_aud"
        unique_together = (("idcaixavalor", "rev"),)


class Cautela(models.Model):
    idcautela = models.BigIntegerField(primary_key=True)
    arquivo = models.TextField(
        blank=True, null=True
    )  # This field type is a guess.
    dataabertura = models.DateField(blank=True, null=True)
    datafechado = models.DateField(blank=True, null=True)
    descricaoaberto = models.TextField()
    descricaofechamento = models.TextField(blank=True, null=True)
    fator = models.IntegerField(blank=True, null=True)
    horaabertura = models.TimeField(blank=True, null=True)
    horadatafechado = models.TimeField(blank=True, null=True)
    numero = models.CharField(max_length=30)
    status = models.CharField(max_length=30)
    titulo = models.CharField(max_length=100)
    idcliente = models.ForeignKey(
        "Cliente", models.DO_NOTHING, db_column="idcliente"
    )
    idprofissional = models.ForeignKey(
        "Profissional",
        models.DO_NOTHING,
        db_column="idprofissional",
        default="",
    )
    idsetor = models.ForeignKey(
        "Setor", models.DO_NOTHING, db_column="idsetor"
    )

    class Meta:
        managed = True
        db_table = "cautela"
        verbose_name = "Cautela"
        verbose_name_plural = "Cautelas"


class CautelaAud(models.Model):
    idcautela = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)
    arquivo = models.TextField(
        blank=True, null=True
    )  # This field type is a guess.
    dataabertura = models.DateField(blank=True, null=True)
    datafechado = models.DateField(blank=True, null=True)
    fator = models.IntegerField(blank=True, null=True)
    horaabertura = models.TimeField(blank=True, null=True)
    horadatafechado = models.TimeField(blank=True, null=True)
    numero = models.CharField(max_length=30, blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    titulo = models.CharField(max_length=100, blank=True, null=True)
    idcliente = models.BigIntegerField(blank=True, null=True)
    idprofissional = models.BigIntegerField(blank=True, null=True)
    idsetor = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "cautela_aud"
        unique_together = (("idcautela", "rev"),)


class Cliente(AutoIncrementMixin, TrackableMixin):
    objects = ClienteManager()

    idcli = models.BigIntegerField(primary_key=True)
    bairrocli = models.CharField(
        max_length=90, blank=True, null=True, verbose_name="Bairro"
    )
    cepcli = models.CharField(
        max_length=10, blank=True, null=True, verbose_name="CEP"
    )
    cidadecli = models.CharField(
        max_length=90, blank=True, null=True, verbose_name="Cidade"
    )
    cnpjcli = models.CharField(
        max_length=20, blank=True, null=True, verbose_name="CNPJ"
    )
    codigocli = models.CharField(
        max_length=15, blank=True, null=True, verbose_name="Código"
    )
    contatocli = models.CharField(max_length=14, blank=True, null=True)
    datacadastrocli = models.DateField()
    emailcli = models.CharField(
        max_length=60, blank=True, null=True, verbose_name="E-mail"
    )
    horacadastrocli = models.TimeField()
    inscricaoestadualcli = models.CharField(
        max_length=11, blank=True, null=True, verbose_name="Inscrição Estadual"
    )
    inscricaomunicipalcli = models.CharField(
        max_length=11, blank=True, null=True
    )
    nomeabreviado = models.CharField(
        unique=True, max_length=90, verbose_name="Sigla"
    )
    nomecli = models.CharField(
        unique=True, max_length=90, verbose_name="Razão Social"
    )
    nomefantasiacli = models.CharField(
        max_length=90, blank=True, null=True, verbose_name="Nome Fantasia"
    )
    numerocli = models.CharField(
        max_length=10, blank=True, null=True, verbose_name="Nº"
    )
    ruacli = models.CharField(
        max_length=90, blank=True, null=True, verbose_name="Rua"
    )
    telefonecli = models.CharField(
        max_length=14, blank=True, null=True, verbose_name="Telefone"
    )
    ufcli = models.CharField(
        max_length=50, blank=True, null=True, verbose_name="UF"
    )
    ativo = models.BooleanField(default=True, null=True)
    foto = models.ImageField(
        null=True,
        blank=True,
        validators=[
            FileExtensionValidator(
                ["png", "jpg", "jpeg"],
                message="Formato de imagem inválido. Utilize PNG, JPG/JPEG.",
            )
        ],
        upload_to="clientes",
    )

    class Meta:
        managed = True
        db_table = "cliente"
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"

    def __str__(self):
        return self.nome_exibicao

    def __repr__(self):
        return self.nome_exibicao

    @property
    def nome_exibicao(self):
        return self.nomefantasiacli if self.nomefantasiacli else self.nomecli

    @property
    def caixas(self):
        caixas_ids = self.modelos_caixa.values_list("id", flat=True)
        return Sequenciaetiqueta.objects.filter(idcaixa__in=caixas_ids)

    @property
    def modelos_caixa(self):
        return Caixa.objects.filter(cliente=self.idcli)

    @property
    def usuarios(self):
        lista_ids_profissionais = Profissional.objects.filter(
            cliente=self.idcli
        ).values_list("idprofissional", flat=True)
        return apps.get_model("users", "User").objects.filter(
            idprofissional__in=lista_ids_profissionais
        )

    @property
    def diario_ocorrencias_ativo(self):
        return Diario.objects.filter(idcli=self.idcli, status="ATIVO").exists()

    def ativar(self):
        """Ativa o cliente mas não ativa os usuários associados a ele."""
        self.ativo = True
        self.save()

    @transaction.atomic
    def desativar(self):
        """Desativa o cliente e todos os usuários associados a ele."""
        self.ativo = False
        self.save()
        apps.get_model("users", "User").deactivate_list(self.usuarios)


class ClienteAud(models.Model):
    idcli = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "cliente_aud"
        unique_together = (("idcli", "rev"),)


class Complemento(AutoIncrementMixin, TrackableMixin):
    id = models.BigAutoField(primary_key=True, db_column="idcomplemento")
    descricao = models.CharField(
        unique=True,
        max_length=255,
        verbose_name="descrição",
        error_messages={
            "unique": "Já existe um %(model_name)s com esta %(field_label)s."
        },
    )
    status = models.CharField(max_length=15)

    objects = ComplementoManager()

    class Meta:
        managed = True
        db_table = "complemento"
        verbose_name = "Complemento"
        verbose_name_plural = "Complementos"


class ComplementoAud(models.Model):
    idcomplemento = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)
    descricao = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = "complemento_aud"
        unique_together = (("idcomplemento", "rev"),)


class Diario(AutoIncrementMixin, TrackableMixin):
    id = models.BigAutoField(primary_key=True, db_column="iddiario")
    arquivo = models.FileField(
        null=True,
        validators=[
            FileExtensionValidator(
                ["pdf"],
                message="Formato de arquivo inválido. Utilize arquivo do tipo PDF .",
            )
        ],
        upload_to="ocorrencias",
    )
    dataabertura = models.DateField()  # usuario informa
    datafechamento = models.DateField(blank=True, null=True)  # automática
    dataretroativa = models.DateField(blank=True, null=True)  # usuario informa
    descricao = models.TextField(db_column="descricaoaberto")
    acao = models.TextField(
        blank=True, null=True, db_column="descricaoacaoocorrencia"
    )
    horaabertura = models.TimeField()
    horafechamento = models.TimeField(blank=True, null=True)
    horaretroativa = models.TimeField(blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    statusdiariodeocorrencia = models.CharField(max_length=30)
    tipodediariodeocorrencia = models.CharField(max_length=30)
    profissional_responsavel = models.ForeignKey(
        "users.User",
        models.DO_NOTHING,
        db_column="profissional_responsavel",
        blank=True,
        null=True,
    )
    nome_profissional_responsavel = models.CharField(
        max_length=100, db_column="titulo"
    )
    uuid = models.CharField(max_length=255, blank=True, null=True)
    idcli = models.ForeignKey(
        Cliente, models.DO_NOTHING, db_column="idcli", blank=True, null=True
    )
    idsetor = models.ForeignKey(
        "Setor", models.DO_NOTHING, db_column="idsetor"
    )
    idusu = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="idusu")
    idindicador = models.ForeignKey(
        "TipoOcorrencia",
        models.DO_NOTHING,
        db_column="idindicador",
        blank=True,
        null=True,
    )

    def __str__(self):
        return self.nome_profissional_responsavel

    def save(self, *args, **kwargs):
        cliente = Cliente.objects.get(pk=self.idcli.pk)
        if Diario.objects.filter(pk=self.pk).exists():
            diario = Diario.objects.get(pk=self.pk)
            if diario.status == "FECHADO":
                raise ValidationError(
                    detail="A ocorrência já está fechada, não pode ser editada.",
                    code="status_fechado",
                )

        if cliente.ativo is False:
            raise ValidationError(
                detail="Não é possível criar uma ocorrência para um cliente desativado.",
                code="cliente_desativado",
            )
        super().save(*args, **kwargs)

    class Meta:
        managed = True
        db_table = "diario"
        verbose_name = "Diário de Ocorrências"
        verbose_name_plural = "Diários de Ocorrências"


class DiarioAud(models.Model):
    iddiario = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)
    arquivo = models.TextField(
        blank=True, null=True
    )  # This field type is a guess.
    dataabertura = models.DateField(blank=True, null=True)
    datafechamento = models.DateField(blank=True, null=True)
    dataretroativa = models.DateField(blank=True, null=True)
    descricaoaberto = models.TextField(blank=True, null=True)
    descricaoacaoocorrencia = models.TextField(blank=True, null=True)
    horaabertura = models.TimeField(blank=True, null=True)
    horafechamento = models.TimeField(blank=True, null=True)
    horaretroativa = models.TimeField(blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    statusdiariodeocorrencia = models.CharField(
        max_length=30, blank=True, null=True
    )
    tipodediariodeocorrencia = models.CharField(
        max_length=30, blank=True, null=True
    )
    titulo = models.CharField(max_length=100, blank=True, null=True)
    uuid = models.CharField(max_length=255, blank=True, null=True)
    idcli = models.BigIntegerField(blank=True, null=True)
    idsetor = models.BigIntegerField(blank=True, null=True)
    idusu = models.BigIntegerField(blank=True, null=True)
    idindicador = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "diario_aud"
        unique_together = (("iddiario", "rev"),)


class Distribuicao(AutoIncrementMixin, TrackableMixin):
    iddistribuicao = models.BigAutoField(primary_key=True)
    setor = models.ForeignKey(
        "Setor", models.DO_NOTHING, blank=True, null=True
    )
    datacancelamentodistribuicao = models.DateTimeField(blank=True, null=True)
    datadistribuicao = models.DateTimeField()
    dtdistribuicao = models.DateField()
    numerocautela = models.CharField(max_length=10, blank=True, null=True)
    status = models.CharField(max_length=20)
    idusu = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="idusu")
    solicitacao_esterilizacao_id = models.ForeignKey(
        "SolicitacaoEsterilizacaoModel",
        models.DO_NOTHING,
        db_column="solicitacao_esterilizacao_id",
        blank=True,
        null=True,
        related_name="distribuicoes",
    )

    class Meta:
        managed = True
        db_table = "distribuicao"
        verbose_name = "Distribuição"
        verbose_name_plural = "Distribuições"


class DistribuicaoAud(models.Model):
    iddistribuicao = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "distribuicao_aud"
        unique_together = (("iddistribuicao", "rev"),)


class Equipamento(AutoIncrementMixin, TrackableMixin):
    idequipamento = models.BigIntegerField(primary_key=True)
    uuid = models.UUIDField(
        editable=False, unique=True, null=True, blank=True, default=uuid.uuid4
    )
    descricao = models.CharField(unique=True, max_length=90)
    numero_serie = models.CharField(max_length=30, null=True, blank=True)
    data_fabricacao = models.DateField(null=True, blank=True)
    registro_anvisa = models.CharField(max_length=20, null=True, blank=True)
    capacidade = models.CharField(max_length=30, null=True, blank=True)
    fabricante = models.CharField(max_length=30, null=True, blank=True)
    tipo = models.CharField(
        max_length=2,
        choices=TipoEquipamentoEnum.choices,
        default=TipoEquipamentoEnum.AUTOCLAVE,
    )
    ativo = models.BooleanField(default=True, null=True)
    ultima_manutencao = models.DateField(null=True, blank=True)
    proxima_manutencao = models.DateField(null=True, blank=True)
    disponivel = models.BooleanField(default=True, null=True)

    @transaction.atomic
    def alocar(self):
        if self.disponivel is False:
            raise ValidationError(
                detail="Este equipamento já se encontra em uso.",
                code="equipamento_em_uso",
            )
        self.disponivel = False
        self.save()
        return True

    def desalocar(self):
        self.disponivel = True
        self.save()
        return True

    objects = EquipamentoManager()

    def save(self, *args, **kwargs):
        if self.descricao:
            self.descricao = self.descricao.upper()
        super().save(*args, **kwargs)

    class Meta:
        managed = True
        db_table = "equipamento"
        verbose_name = "Equipamento"
        verbose_name_plural = "Equipamentos"


class EquipamentoAud(models.Model):
    idequipamento = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)
    descricao = models.CharField(max_length=90, blank=True, null=True)

    class Meta:
        managed = True
        db_table = "equipamento_aud"
        unique_together = (("idequipamento", "rev"),)


class Estoque(AutoIncrementMixin):
    id = models.BigAutoField(primary_key=True, db_column="idestoque")
    quantidade = models.IntegerField()
    status = models.CharField(max_length=20)
    serial = models.ForeignKey(
        "Sequenciaetiqueta", models.DO_NOTHING, db_column="idsequenciaetiqueta"
    )
    datavalidade = models.DateField(blank=True, null=True)

    objects = EstoqueManager()

    class Meta:
        managed = True
        db_table = "estoque"
        verbose_name = "Estoque"
        verbose_name_plural = "Estoques"


class EstoqueAud(models.Model):
    idestoque = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "estoque_aud"
        unique_together = (("idestoque", "rev"),)


class Etiqueta(AutoIncrementMixin, TrackableMixin):
    id = models.BigAutoField(primary_key=True, db_column="idetiqueta")
    biologico = models.CharField(max_length=4, blank=True, null=True)
    ciclo = models.IntegerField(null=True, blank=True)
    ciclo_autoclave = models.CharField(max_length=20, null=True, blank=True)
    ciclo_termodesinfectora = models.CharField(
        max_length=20, null=True, blank=True
    )
    datafabricacao = models.DateField()
    datalancamento = models.DateField()
    datavalidade = models.DateField()
    horalancamento = models.TimeField()
    cautela = models.IntegerField(db_column="numero", blank=True, null=True)
    obs = models.CharField(max_length=255, blank=True, null=True)
    peso = models.CharField(max_length=10, blank=True, null=True)
    qtd = models.IntegerField()
    qtdimpressao = models.IntegerField(blank=True, null=True)
    servico = models.CharField(max_length=30)
    status = models.CharField(
        max_length=10, blank=True, null=True, default="VALIDO"
    )
    temperatura = models.IntegerField(blank=True, null=True)
    tipoetiqueta = models.CharField(max_length=20)
    totalenvelopado = models.IntegerField(blank=True, null=True)
    idcli = models.ForeignKey(Cliente, models.DO_NOTHING, db_column="idcli")
    idcomplemento = models.ForeignKey(
        Complemento,
        models.DO_NOTHING,
        db_column="idcomplemento",
        blank=True,
        null=True,
    )
    idproduto = models.ForeignKey(
        "Produto", models.DO_NOTHING, db_column="idproduto"
    )
    idprofissional = models.ForeignKey(
        "Profissional", models.DO_NOTHING, db_column="idprofissional"
    )
    setor = models.ForeignKey(
        "Setor", models.DO_NOTHING, db_column="setor", blank=True, null=True
    )
    autoclave = models.ForeignKey(
        Equipamento,
        models.DO_NOTHING,
        blank=True,
        null=True,
        related_name="autoclave_etiquetas",
    )
    termodesinfectora = models.ForeignKey(
        Equipamento,
        models.DO_NOTHING,
        blank=True,
        null=True,
        related_name="termodesinfectora_etiquetas",
    )
    seladora = models.ForeignKey(
        Equipamento,
        models.DO_NOTHING,
        blank=True,
        null=True,
        related_name="seladora_etiquetas",
    )
    historico = HistoricalRecords()

    class Seladora(models.TextChoices):
        SELADORA_1 = "SELADORA 1", "SELADORA 1"
        SELADORA_2 = "SELADORA 2", "SELADORA 2"
        SELADORA_3 = "SELADORA 3", "SELADORA 3"
        SELADORA_4 = "SELADORA 4", "SELADORA 4"
        SELADORA_5 = "SELADORA 5", "SELADORA 5"
        SELADORA_6 = "SELADORA 6", "SELADORA 6"
        SELADORA_7 = "SELADORA 7", "SELADORA 7"
        SELADORA_8 = "SELADORA 8", "SELADORA 8"
        SELADORA_9 = "SELADORA 9", "SELADORA 9"
        SELADORA_10 = "SELADORA 10", "SELADORA 10"
        SMS = "SMS", "SMS"
        SELADORA_DE_PLASTICO = "SELADORA DE PLÁSTICO", "SELADORA DE PLÁSTICO"
        CONTEINER = "CONTEINER", "CONTEINER"

    class TipoEtiqueta(models.TextChoices):
        INSUMO = "INSUMO", "INSUMO"
        ROUPARIA = "ROUPARIA", "ROUPARIA"
        RESPIRATORIO = "RESPIRATORIO", "RESPIRATORIO"
        INSTRUMENTAL_AVULSO = "INSTRUMENTAL AVULSO", "INSTRUMENTAL AVULSO"
        TERMODESINFECCAO = "TERMODESINFECCAO", "TERMODESINFECCAO"
        CONTEINER = "CONTEINER", "CONTEINER"

    class Servico(models.TextChoices):
        OPT_1 = "SIM,01 QTD", "SIM,01 QTD"
        OPT_2 = "SIM,02 QTD", "SIM,02 QTD"
        OPT_3 = "SIM,03 QTD", "SIM,03 QTD"
        OPT_4 = "NÃO", "NÃO"

    class Termo(models.IntegerChoices):
        TERMO_0 = 0, "TERMO 00"
        TERMO_1 = 1, "TERMO 01"
        TERMO_2 = 2, "TERMO 02"
        TERMO_3 = 3, "TERMO 03"
        TERMO_4 = 4, "TERMO 04"
        TERMO_5 = 5, "TERMO 05"
        TERMO_6 = 6, "TERMO 06"

    class Meta:
        managed = True
        db_table = "etiqueta"
        verbose_name = "Etiqueta"
        verbose_name_plural = "Etiquetas"


class EtiquetaAud(models.Model):
    idetiqueta = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)
    peso = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = True
        db_table = "etiqueta_aud"
        unique_together = (("idetiqueta", "rev"),)


class Evento(AutoIncrementMixin, TrackableMixin):
    idevento = models.BigAutoField(primary_key=True)
    apelidousuarioprimario = models.CharField(
        max_length=90, blank=True, null=True
    )
    ciclo = models.IntegerField(blank=True, null=True)
    datacancelamentodistribuicao = models.DateTimeField(blank=True, null=True)
    datacancelamentoproducao = models.DateTimeField(blank=True, null=True)
    datacancelamentorecebimento = models.DateTimeField(blank=True, null=True)
    datadistribuicao = models.DateTimeField(blank=True, null=True)
    dataevento = models.DateField()
    datafimautoclavagem = models.DateTimeField(blank=True, null=True)
    datafimtermodesinfecao = models.DateTimeField(blank=True, null=True)
    datainicioautoclavagem = models.DateTimeField(blank=True, null=True)
    datainiciotermodesinfecao = models.DateTimeField(blank=True, null=True)
    dataproducao = models.DateTimeField(blank=True, null=True)
    datarecebimento = models.DateTimeField(blank=True, null=True)
    descricaocaixa = models.CharField(max_length=90)
    horaevento = models.TimeField()
    idsequenciaetiqueta = models.CharField(
        max_length=255, blank=True, null=True
    )
    nomecliente = models.CharField(max_length=90)
    cliente = models.ForeignKey(
        Cliente, models.DO_NOTHING, db_column="cliente", blank=True, null=True
    )
    turno = models.CharField(
        max_length=10,
        choices=[("DIURNO", "Diurno"), ("NOTURNO", "Noturno")],
        blank=True,
        null=True,
    )
    status = models.CharField(max_length=90)
    idautoclavagem = models.ForeignKey(
        Autoclavagem,
        models.DO_NOTHING,
        db_column="idautoclavagem",
        blank=True,
        null=True,
    )
    iddistribuicao = models.ForeignKey(
        Distribuicao,
        models.DO_NOTHING,
        db_column="iddistribuicao",
        blank=True,
        null=True,
    )
    idlavagem = models.ForeignKey(
        "Lavagem",
        models.DO_NOTHING,
        db_column="idlavagem",
        blank=True,
        null=True,
    )
    preparo = models.ForeignKey(
        "Producao",
        models.DO_NOTHING,
        db_column="idproducao",
        blank=True,
        null=True,
    )
    idrecebimento = models.ForeignKey(
        "Recebimento",
        models.DO_NOTHING,
        db_column="idrecebimento",
        blank=True,
        null=True,
    )
    idtermodesinfeccao = models.ForeignKey(
        "Termodesinfeccao",
        models.DO_NOTHING,
        db_column="idtermodesinfeccao",
        blank=True,
        null=True,
    )
    idultrassonica = models.ForeignKey(
        "Ultrassonica",
        models.DO_NOTHING,
        db_column="idultrassonica",
        blank=True,
        null=True,
    )
    idusu = models.ForeignKey(
        "Usuario", models.DO_NOTHING, db_column="idusu", blank=True, null=True
    )
    idusuariosecundario = models.ForeignKey(
        "Usuariosecundario",
        models.DO_NOTHING,
        db_column="idusuariosecundario",
        blank=True,
        null=True,
    )
    datalancamento = models.DateTimeField(blank=True, null=True)

    objects = EventoManager()

    @property
    def ultimo_registro(self):
        return self.created_at

    def save(self, *args, **kwargs):
        if not self.turno:
            if time(6, 0, 0) <= self.created_at.time() <= time(17, 59, 59):
                self.turno = "DIURNO"
            else:
                self.turno = "NOTURNO"
        super().save(*args, **kwargs)

    class Meta:
        managed = True
        db_table = "evento"
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"


class EventoAud(models.Model):
    idevento = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)
    datalancamento = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "evento_aud"
        unique_together = (("idevento", "rev"),)


class Grupo(AutoIncrementMixin):
    idgrupo = models.BigAutoField(primary_key=True)
    descricao = models.CharField(unique=True, max_length=80)
    nome = models.CharField(unique=True, max_length=40)

    class Meta:
        managed = True
        db_table = "grupo"
        verbose_name = "Grupo"
        verbose_name_plural = "Grupos"


class GrupoAud(models.Model):
    idgrupo = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "grupo_aud"
        unique_together = (("idgrupo", "rev"),)


class TipoOcorrencia(AutoIncrementMixin, TrackableMixin):
    id = models.BigAutoField(primary_key=True, db_column="idindicador")
    datalancamento = models.DateField()
    descricao = models.CharField(max_length=90, blank=True, null=True)
    status = models.CharField(max_length=90)
    idusu = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="idusu")

    def save(self, *args, **kwargs):
        if TipoOcorrencia.objects.filter(descricao=self.descricao).exists():
            raise ValidationError(
                detail="Tipo de ocorrência com esta descrição já cadastrada.",
                code="descricao_existente",
            )
        self.status = self.descricao
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.descricao

    class Meta:
        managed = True
        db_table = "indicador"
        verbose_name = "Indicador"
        verbose_name_plural = "Indicadores"


class IndicadorAud(models.Model):
    idindicador = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)
    idusu = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "indicador_aud"
        unique_together = (("idindicador", "rev"),)


class Itemcaixa(AutoIncrementMixin, models.Model, HasRelationMixin):
    class Criticidade(models.IntegerChoices):
        NAO_CRITICO = 1, "Não Crítico"
        SEMICRITICO = 2, "Semicrítico"
        CRITICO = 3, "Crítico"

    id = models.BigAutoField(primary_key=True, db_column="iditemcaixa")
    criticidade = models.IntegerField(
        db_column="qtdcriticidade",
        choices=Criticidade.choices,
        default=Criticidade.NAO_CRITICO,
        help_text="Nível de contato com o paciente.",
    )
    quantidade = models.IntegerField(default=1)
    valor_unitario = models.DecimalField(
        max_digits=10, decimal_places=2, db_column="valorunitario", default=0
    )
    caixa = models.ForeignKey(
        Caixa, models.CASCADE, db_column="idcaixa", related_name="itens"
    )
    produto = models.ForeignKey(
        "Produto",
        models.DO_NOTHING,
        db_column="idproduto",
        related_name="itens",
    )
    deleted = models.BooleanField(default=False, null=True)

    objects = ItemcaixaManager()

    def delete(
        self, using=None, keep_parents: bool = ...
    ) -> tuple[int, dict[str, int]]:
        if self.itemrecebimento_set.exists() or self.itemproducao_set.exists():
            self.deleted = True
            return self.save()

        return super().delete(using=using, keep_parents=keep_parents)

    class Meta:
        managed = True
        db_table = "itemcaixa"
        verbose_name = "Item de Caixa"
        verbose_name_plural = "Itens de Caixa"
        """TODO: Ao migrar o legacy, garantir persistencia da linha abaixo
        (por enquanto ficará no serializer)"""
        # unique_together = (("produto", "caixa"),)


class ItemcaixaAud(models.Model):
    iditemcaixa = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "itemcaixa_aud"
        unique_together = (("iditemcaixa", "rev"),)


class Itemdistribuicao(AutoIncrementMixin):
    iditemdistribuicao = models.BigIntegerField(primary_key=True)
    idcli = models.ForeignKey(Cliente, models.DO_NOTHING, db_column="idcli")
    iddistribuicao = models.ForeignKey(
        Distribuicao, models.DO_NOTHING, db_column="iddistribuicao"
    )
    idsequenciaetiqueta = models.ForeignKey(
        "Sequenciaetiqueta", models.DO_NOTHING, db_column="idsequenciaetiqueta"
    )

    class Meta:
        managed = True
        db_table = "itemdistribuicao"
        verbose_name = "Item de Distribuição"
        verbose_name_plural = "Itens de Distribuição"


class ItemdistribuicaoAud(models.Model):
    iditemdistribuicao = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "itemdistribuicao_aud"
        unique_together = (("iditemdistribuicao", "rev"),)


class Itemproducao(AutoIncrementMixin):
    id = models.BigAutoField(primary_key=True, db_column="iditemproducao")
    dataproducaodistribuicaosequencial = models.DateField(
        blank=True, null=True
    )
    quantidade = models.IntegerField()
    statusproducaodistribuicaosequencial = models.BooleanField(default=False)
    iditemcaixa = models.ForeignKey(
        Itemcaixa, models.DO_NOTHING, db_column="iditemcaixa"
    )
    idproducao = models.ForeignKey(
        "Producao",
        models.DO_NOTHING,
        db_column="idproducao",
        related_name="itens",
    )
    idsequenciaetiqueta = models.ForeignKey(
        "Sequenciaetiqueta", models.DO_NOTHING, db_column="idsequenciaetiqueta"
    )

    class Meta:
        managed = True
        db_table = "itemproducao"
        verbose_name = "Item de Produção"
        verbose_name_plural = "Itens de Produção"


class ItemproducaoAud(models.Model):
    iditemproducao = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "itemproducao_aud"
        unique_together = (("iditemproducao", "rev"),)


class Itemrecebimento(AutoIncrementMixin):
    iditemrecebimento = models.BigAutoField(primary_key=True)
    quantidade = models.IntegerField()
    iditemcaixa = models.ForeignKey(
        Itemcaixa, models.DO_NOTHING, db_column="iditemcaixa"
    )
    idrecebimento = models.ForeignKey(
        "Recebimento",
        models.DO_NOTHING,
        db_column="idrecebimento",
        related_name="itens",
    )
    idsequenciaetiqueta = models.ForeignKey(
        "Sequenciaetiqueta", models.DO_NOTHING, db_column="idsequenciaetiqueta"
    )

    class Meta:
        managed = True
        db_table = "itemrecebimento"
        verbose_name = "Item de Recebimento"
        verbose_name_plural = "Itens de Recebimento"


class ItemrecebimentoAud(models.Model):
    iditemrecebimento = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "itemrecebimento_aud"
        unique_together = (("iditemrecebimento", "rev"),)


class Itemromaneio(models.Model):
    iditemromaneio = models.BigIntegerField(primary_key=True)
    idromaneio = models.ForeignKey(
        "Romaneio", models.DO_NOTHING, db_column="idromaneio"
    )
    idsequenciaetiqueta = models.ForeignKey(
        "Sequenciaetiqueta", models.DO_NOTHING, db_column="idsequenciaetiqueta"
    )

    class Meta:
        managed = True
        db_table = "itemromaneio"
        verbose_name = "Item de Romaneio"
        verbose_name_plural = "Itens de Romaneio"


class ItemromaneioAud(models.Model):
    iditemromaneio = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "itemromaneio_aud"
        unique_together = (("iditemromaneio", "rev"),)


class AutoclavagemItem(AutoIncrementMixin, TrackableMixin):
    id = models.BigAutoField(primary_key=True, db_column="iditensautoclavagem")
    autoclavagem = models.ForeignKey(
        Autoclavagem,
        models.DO_NOTHING,
        db_column="idautoclavagem",
        related_name="itens",
    )
    serial = models.ForeignKey(
        "Sequenciaetiqueta", models.DO_NOTHING, db_column="idsequenciaetiqueta"
    )
    objects = ItemAutoclavagemManager()

    class Meta:
        managed = True
        db_table = "itensautoclavagem"
        verbose_name = "Item de Autoclavagem"
        verbose_name_plural = "Itens de Autoclavagem"


class ItensautoclavagemAud(models.Model):
    iditensautoclavagem = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "itensautoclavagem_aud"
        unique_together = (("iditensautoclavagem", "rev"),)


class Itenslavagem(models.Model):
    iditenslavagem = models.BigIntegerField(primary_key=True)
    idlavagem = models.ForeignKey(
        "Lavagem", models.DO_NOTHING, db_column="idlavagem"
    )
    idsequenciaetiqueta = models.ForeignKey(
        "Sequenciaetiqueta", models.DO_NOTHING, db_column="idsequenciaetiqueta"
    )

    class Meta:
        managed = True
        db_table = "itenslavagem"
        verbose_name = "Item de Lavagem"
        verbose_name_plural = "Itens de Lavagem"


class ItenslavagemAud(models.Model):
    iditenslavagem = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "itenslavagem_aud"
        unique_together = (("iditenslavagem", "rev"),)


class Itenstermodesinfeccao(AutoIncrementMixin, TrackableMixin):
    id = models.BigAutoField(primary_key=True)
    serial = models.ForeignKey(
        "Sequenciaetiqueta", models.DO_NOTHING, db_column="idsequenciaetiqueta"
    )
    termodesinfeccao = models.ForeignKey(
        "Termodesinfeccao",
        models.DO_NOTHING,
        db_column="idtermodesinfeccao",
        related_name="itens",
    )

    class Meta:
        managed = True
        db_table = "itenstermodesinfeccao"
        verbose_name = "Item de Termodesinfecção"
        verbose_name_plural = "Itens de Termodesinfecção"


class ItenstermodesinfeccaoAud(models.Model):
    iditenstermodesinfeccao = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "itenstermodesinfeccao_aud"
        unique_together = (("iditenstermodesinfeccao", "rev"),)


class Itensultrassonica(models.Model):
    iditensultrassonica = models.BigIntegerField(primary_key=True)
    idsequenciaetiqueta = models.ForeignKey(
        "Sequenciaetiqueta", models.DO_NOTHING, db_column="idsequenciaetiqueta"
    )
    idultrassonica = models.ForeignKey(
        "Ultrassonica", models.DO_NOTHING, db_column="idultrassonica"
    )

    class Meta:
        managed = True
        db_table = "itensultrassonica"
        verbose_name = "Item de Ultrassônica"
        verbose_name_plural = "Itens de Ultrassônica"


class ItensultrassonicaAud(models.Model):
    iditensultrassonica = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "itensultrassonica_aud"
        unique_together = (("iditensultrassonica", "rev"),)


class Lavagem(models.Model):
    idlavagem = models.BigIntegerField(primary_key=True)
    datalavagem = models.DateTimeField()
    statuslavagem = models.CharField(max_length=20)
    idusu = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="idusu")

    class Meta:
        managed = True
        db_table = "lavagem"
        verbose_name = "Lavagem"
        verbose_name_plural = "Lavagens"


class LavagemAud(models.Model):
    idlavagem = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "lavagem_aud"
        unique_together = (("idlavagem", "rev"),)


class Locacao(models.Model):
    idlocacao = models.BigIntegerField(primary_key=True)
    datafim = models.DateField()
    datainicio = models.DateField()
    statuslocacao = models.CharField(max_length=15)
    idsetor = models.ForeignKey(
        "Setor", models.DO_NOTHING, db_column="idsetor"
    )

    class Meta:
        managed = True
        db_table = "locacao"
        verbose_name = "Locação"
        verbose_name_plural = "Locações"


class LocacaoAud(models.Model):
    idlocacao = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)
    datafim = models.DateField(blank=True, null=True)
    datainicio = models.DateField(blank=True, null=True)
    statuslocacao = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        managed = True
        db_table = "locacao_aud"
        unique_together = (("idlocacao", "rev"),)


class Origem(models.Model):
    idorigem = models.BigIntegerField(primary_key=True)
    descricao = models.CharField(unique=True, max_length=90)

    class Meta:
        managed = True
        db_table = "origem"
        verbose_name = "Origem"
        verbose_name_plural = "Origens"


class OrigemAud(models.Model):
    idorigem = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "origem_aud"
        unique_together = (("idorigem", "rev"),)


class Parametrizacao(models.Model):
    idparametrizacao = models.BigIntegerField(primary_key=True)
    emaildestino = models.CharField(
        unique=True, max_length=60, blank=True, null=True
    )
    emailorigem = models.CharField(
        unique=True, max_length=60, blank=True, null=True
    )
    envia = models.CharField(unique=True, max_length=3, blank=True, null=True)
    ipdistribuicaos = models.CharField(max_length=20, blank=True, null=True)
    ipesterilizacao = models.CharField(max_length=20, blank=True, null=True)
    ipproducao = models.CharField(max_length=20, blank=True, null=True)
    iprecebimento = models.CharField(max_length=20, blank=True, null=True)
    iptermodesinfeccao = models.CharField(max_length=20, blank=True, null=True)
    senhaemailorigem = models.CharField(max_length=40, blank=True, null=True)
    ipesterilizacaofim = models.CharField(max_length=20, blank=True, null=True)
    iptermodesinfeccaofim = models.CharField(
        max_length=20, blank=True, null=True
    )
    hora = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "parametrizacao"
        verbose_name = "Parametrização"
        verbose_name_plural = "Parametrizações"


class ParametrizacaoAud(models.Model):
    idparametrizacao = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "parametrizacao_aud"
        unique_together = (("idparametrizacao", "rev"),)


class Plantao(AutoIncrementMixin, TrackableMixin):
    idplantao = models.BigAutoField(primary_key=True)
    datacadastro = models.DateField()
    datafechamento = models.DateField(blank=True, null=True)
    descricaoaberto = models.TextField()
    descricaofechamento = models.TextField(blank=True, null=True)
    grupousuario = models.CharField(max_length=60)
    horacadastro = models.TimeField()
    horafechamento = models.TimeField(blank=True, null=True)
    status = models.CharField(max_length=30)
    # TODO:remover apos migrar o legacy
    idprofissional = models.ForeignKey(
        "Profissional", models.DO_NOTHING, db_column="idprofissional"
    )
    duracao = models.DurationField(blank=True, null=True)

    @property
    def turno(self):
        if time(7, 0, 0) <= self.horacadastro <= time(18, 59, 59):
            return "DIURNO"
        return "NOTURNO"

    def save(self, *args, **kwargs):
        if Plantao.objects.filter(pk=self.pk).exists():
            plantao = Plantao.objects.get(pk=self.pk)
            if plantao:
                if plantao.status == "FECHADO":
                    raise ValidationError(
                        detail="O plantão já está fechado, não pode ser editado.",
                        code="status_fechado",
                    )
        super().save(*args, **kwargs)

    class Meta:
        managed = True
        db_table = "plantao"
        verbose_name = "Plantão"
        verbose_name_plural = "Plantões"


class PlantaoAud(models.Model):
    idplantao = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)
    datacadastro = models.DateField(blank=True, null=True)
    datafechamento = models.DateField(blank=True, null=True)
    grupousuario = models.CharField(max_length=60, blank=True, null=True)
    horacadastro = models.TimeField(blank=True, null=True)
    horafechamento = models.TimeField(blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    idprofissional = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "plantao_aud"
        unique_together = (("idplantao", "rev"),)


class Producao(AutoIncrementMixin, TrackableMixin):
    id = models.BigAutoField(primary_key=True, db_column="idproducao")
    cautela = models.IntegerField(blank=True, null=True, db_column="ciclo")
    datacancelamento = models.DateTimeField(blank=True, null=True)
    dataproducao = models.DateTimeField()
    datavalidade = models.DateField()
    observacao = models.CharField(max_length=255, blank=True, null=True)
    statusproducao = models.CharField(max_length=20, default="EMBALADO")
    idusu = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="idusu")
    indicador = models.ForeignKey(
        "IndicadoresEsterilizacao", models.DO_NOTHING, blank=True, null=True
    )

    class Meta:
        managed = True
        db_table = "producao"
        verbose_name = "Produção"

    verbose_name_plural = "Produções"


class ProducaoAud(models.Model):
    idproducao = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "producao_aud"
        unique_together = (("idproducao", "rev"),)


class Produto(TrackableMixin):
    id = models.BigAutoField(primary_key=True, db_column="idproduto")
    descricao = models.CharField(unique=True, max_length=90)
    dtcadastro = models.DateTimeField()
    embalagem = models.CharField(max_length=15)
    situacao = models.BooleanField(default=True, null=True)
    foto = models.ImageField(
        null=True,
        blank=True,
        validators=[
            FileExtensionValidator(
                ["png", "jpg", "jpeg"],
                message="Formato de imagem inválido. Utilize PNG ou JPG/JPEG.",
            )
        ],
        upload_to="produtos",
    )
    status = models.CharField(max_length=15)
    idsubtipoproduto = models.ForeignKey(
        "Subtipoproduto",
        models.DO_NOTHING,
        db_column="idsubtipoproduto",
        null=True,
        blank=True,
    )
    idtipopacote = models.ForeignKey(
        "Tipopacote",
        models.DO_NOTHING,
        db_column="idtipopacote",
        null=True,
        blank=True,
    )
    codigo = models.CharField(
        unique=True, max_length=15, null=True, blank=True
    )
    tipo = models.CharField(
        max_length=15,
        choices=TipoIntegradorEnum.choices,
        null=True,
        blank=True,
    )
    saldo = models.IntegerField(null=True, blank=True, default=0)
    fabricante = models.CharField(max_length=30, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.descricao:
            self.descricao = self.descricao.upper()
        super().save(*args, **kwargs)

    class Meta:
        managed = True
        db_table = "produto"
        verbose_name = "Produto"
        verbose_name_plural = "Produtos"


class ProdutoAud(models.Model):
    idproduto = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "produto_aud"
        unique_together = (("idproduto", "rev"),)


class Profissao(AutoIncrementMixin, TrackableMixin):
    id = models.BigAutoField(primary_key=True, db_column="idprofissao")
    descricao = models.CharField(unique=True, max_length=90)

    def __str__(self):
        return self.descricao

    class Meta:
        managed = True
        db_table = "profissao"
        verbose_name = "Profissão"
        verbose_name_plural = "Profissões"


class ProfissaoAud(models.Model):
    idprofissao = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "profissao_aud"
        unique_together = (("idprofissao", "rev"),)


class Profissional(models.Model):
    idprofissional = models.BigAutoField(primary_key=True)
    atrelado = models.CharField(max_length=1)
    contato = models.CharField(max_length=14, blank=True, null=True)
    coren = models.CharField(max_length=10, blank=True, null=True)
    cpf = models.CharField(unique=True, max_length=15)
    dtadmissao = models.DateField()
    dtcadastro = models.DateField()
    dtdesligamento = models.DateField(blank=True, null=True)
    dtnascimento = models.DateTimeField()
    email = models.CharField(max_length=60, blank=True, null=True)
    matricula = models.CharField(max_length=30, blank=True, null=True)
    nome = models.CharField(max_length=90)
    rt = models.CharField(max_length=1)
    sexo = models.CharField(max_length=2)
    status = models.CharField(max_length=30)
    idprofissao = models.ForeignKey(
        Profissao, models.DO_NOTHING, db_column="idprofissao"
    )
    cliente = models.ForeignKey(
        Cliente,
        models.DO_NOTHING,
        db_column="idcli",
        null=True,
        blank=True,
        related_name="clientes",
    )

    def __str__(self):
        return self.nome

    def is_motorista(self):
        """Essa função verifica se o profissional é motorista

        Returns:
            bool: True se for motorista, False se não for
        """
        if self.idprofissao and self.idprofissao.descricao:
            return (
                self.idprofissao.descricao.replace(" ", "").lower()
                == "motorista"
            )

        return False

    class Meta:
        managed = True
        db_table = "profissional"
        verbose_name = "Profissional"
        verbose_name_plural = "Profissionais"


class ProfissionalAud(models.Model):
    idprofissional = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "profissional_aud"
        unique_together = (("idprofissional", "rev"),)


class Profissionallocado(models.Model):
    idprofissionallocado = models.BigIntegerField(primary_key=True)
    idlocacao = models.ForeignKey(
        Locacao, models.DO_NOTHING, db_column="idlocacao"
    )
    idprofissional = models.ForeignKey(
        Profissional, models.DO_NOTHING, db_column="idprofissional"
    )

    class Meta:
        managed = True
        db_table = "profissionallocado"
        verbose_name = "Locação de Profissional"
        verbose_name_plural = "Locações de Profissionais"


class ProfissionallocadoAud(models.Model):
    idprofissionallocado = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)
    idlocacao = models.BigIntegerField(blank=True, null=True)
    idprofissional = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "profissionallocado_aud"
        unique_together = (("idprofissionallocado", "rev"),)


class Recebimento(AutoIncrementMixin):
    idrecebimento = models.BigAutoField(primary_key=True)
    datacancelamento = models.DateTimeField(blank=True, null=True)
    datarecebimento = models.DateTimeField()
    observacao = models.CharField(max_length=255, blank=True, null=True)
    statusrecebimento = models.CharField(max_length=30)
    idorigem = models.ForeignKey(
        Origem, models.DO_NOTHING, db_column="idorigem", blank=True, null=True
    )
    idusu = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="idusu")
    solicitacao_esterilizacao_id = models.ForeignKey(
        "SolicitacaoEsterilizacaoModel",
        models.DO_NOTHING,
        db_column="solicitacao_esterilizacao_id",
        blank=True,
        null=True,
        related_name="recebimentos",
    )

    class Meta:
        managed = True
        db_table = "recebimento"
        verbose_name = "Recebimento"
        verbose_name_plural = "Recebimentos"


class RecebimentoAud(models.Model):
    idrecebimento = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey("Revinfo", models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "recebimento_aud"
        unique_together = (("idrecebimento", "rev"),)


class Revinfo(models.Model):
    id = models.IntegerField(primary_key=True)
    timestamp = models.BigIntegerField()
    dt_registro = models.DateField(blank=True, null=True)
    hr_registro = models.TimeField(blank=True, null=True)
    ip = models.CharField(max_length=255, blank=True, null=True)
    usuario = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = "revinfo"
        verbose_name = "Revinfo"
        verbose_name_plural = "Revinfos"


class Romaneio(models.Model):
    idromaneio = models.BigIntegerField(primary_key=True)
    data = models.DateField(blank=True, null=True)
    hora = models.TimeField(blank=True, null=True)
    numerocautela = models.CharField(max_length=10)
    status = models.CharField(max_length=20)
    idcli = models.ForeignKey(Cliente, models.DO_NOTHING, db_column="idcli")

    class Meta:
        managed = True
        db_table = "romaneio"
        verbose_name = "Romaneio"
        verbose_name_plural = "Romaneios"


class RomaneioAud(models.Model):
    idromaneio = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey(Revinfo, models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "romaneio_aud"
        unique_together = (("idromaneio", "rev"),)


class Sequenciaetiqueta(
    models.Model
):  # disabled pylint: disable=too-many-public-methods
    idsequenciaetiqueta = models.CharField(primary_key=True, max_length=255)
    idcaixa = models.ForeignKey(
        Caixa, models.DO_NOTHING, db_column="idcaixa", related_name="caixas"
    )
    recebimento = models.ManyToManyField(
        "Recebimento", through="RecebimentoItem", related_name="recebimentos"
    )
    ultima_situacao = models.IntegerField(
        choices=SerialSituacaoEnum.choices,
        default=SerialSituacaoEnum.NAO_UTILIZADO,
        null=True,
    )
    data_ultima_situacao = models.DateTimeField(auto_now=True, null=True)
    objects = SequenciaetiquetaManager()

    class Meta:
        managed = True
        db_table = "sequenciaetiqueta"
        verbose_name = "Serial"
        verbose_name_plural = "Seriais"

    def __str__(self):
        return self.idsequenciaetiqueta.replace(" ", "").upper()

    @property
    def current_solicitacao_esterilizacao(self):
        """Retorna a solicitação de esterilização atual da caixa,
        com base no serial informado.

        Returns:
            SolicitacaoEsterilizacaoModel | None: Solicitação de esterilização
            atual da caixa ou None se não encontrada.
        """
        # pylint: disable=import-outside-toplevel
        from .models import SolicitacaoEsterilizacaoItemModel

        solicitacao_item = (
            SolicitacaoEsterilizacaoItemModel.objects.filter(caixa=self)
            .order_by("-id")
            .first()
        )

        if solicitacao_item:
            return solicitacao_item.solicitacao_esterilizacao

        return None

    @property
    def cliente(self):
        """Retorna o cliente a qual a caixa pertence.

        Returns:
            Cliente | None: Cliente da caixa ou None se não encontrado.
        """
        return self.idcaixa.cliente if self.idcaixa else None

    @property
    def situacao(self):
        """Retorna a situação da caixa (em uso em alguma solicitação
            de esterilização que esteja em aberto ou não).

        Returns:
            str: Situação da caixa.
        """
        try:
            solicitacao_esterilizacao = self.current_solicitacao_esterilizacao

            if solicitacao_esterilizacao.em_andamento:
                return "Em uso"

            return "Livre"

        except AttributeError:
            return "Livre"

    @property
    def validade_calculada(self):
        """Retorna a data de validade calculada da caixa.

        Returns:
            date: Data de validade calculada da caixa.
        """

        meses_a_adicionar = self.idcaixa.validade or 0

        return helpers.data_local_atual() + relativedelta(
            months=+meses_a_adicionar
        )

    @property
    def ultimo_recebimento(self):
        """Retorna o último recebimento da caixa.

        Returns:
            Recebimento | None: Último recebimento da caixa ou None se não
            encontrado.
        """
        return self.recebimento.order_by("-idrecebimento").first()

    @property
    def recebimento_pendente(self):
        """Retorna o recebimento pendente da caixa.

        Returns:
            Recebimento | None: Recebimento pendente da caixa ou None se não
            encontrado.
        """
        return (
            self.recebimento.filter(
                statusrecebimento=RecebimentoEnum.AGUARDANDO_CONFERENCIA.value
            )
            .order_by("-idrecebimento")
            .first()
        )

    def alterar_situacao(self, situacao):
        """Altera a situação do serial.

        Args:
            situacao (int): Situação do serial.
        """
        if situacao in SerialSituacaoEnum.values:
            self.ultima_situacao = situacao
            self.data_ultima_situacao = helpers.datahora_local_atual()
            self.save()
            return True

        return False

    def alterar_situacao_para_recebido(self):
        """Altera a situação do serial para recebido."""
        return self.alterar_situacao(SerialSituacaoEnum.RECEBIDO)

    def alterar_situacao_para_preparado(self):
        """Altera a situação do serial para preparado."""
        return self.alterar_situacao(SerialSituacaoEnum.EMBALADO)

    def alterar_situacao_para_esterilizado(self):
        """Altera a situação do serial para esterilizado."""
        return self.alterar_situacao(SerialSituacaoEnum.ESTERILIZACAO_FIM)

    def alterar_situacao_para_em_esterilizacao(self):
        """Altera a situação do serial para em esterilização."""
        return self.alterar_situacao(SerialSituacaoEnum.ESTERILIZACAO_INICIO)

    def alterar_situacao_para_abortado_termodesinfeccao(self):
        """Altera a situação do serial para abortado em termodesinfeccao."""
        return self.alterar_situacao(SerialSituacaoEnum.ABORTADO_TERMO)

    def alterar_situacao_para_abortado_esterilizacao(self):
        """Altera a situação do serial para abortado em esterilizacao."""
        return self.alterar_situacao(SerialSituacaoEnum.ABORTADO_ESTERILIZACAO)

    def alterar_situacao_para_em_estoque(self):
        """Altera a situação do serial para em estoque."""
        return self.alterar_situacao(SerialSituacaoEnum.ESTOQUE)

    def alterar_situacao_para_distribuido(self):
        """Altera a situação do serial para distribuido."""
        return self.alterar_situacao(SerialSituacaoEnum.DISTRIBUIDO)

    def alterar_situacao_para_em_termodesinfeccao(self):
        """Altera a situação do serial para em termodesinfeccao."""
        return self.alterar_situacao(SerialSituacaoEnum.TERMO_INICIO)

    def alterar_situacao_para_termodesinfectado(self):
        """Altera a situação do serial para termodesinfectado."""
        return self.alterar_situacao(SerialSituacaoEnum.TERMO_FIM)

    def alterar_situacao_para_aguardando_conferencia(self):
        """Altera a situação do serial para aguardando conferência."""
        return self.alterar_situacao(SerialSituacaoEnum.AGUARDANDO_CONFERENCIA)

    @property
    def esta_recebido(self):
        """Verifica se o serial ja foi recebido.

        Returns:
            bool: True se estiver recebido, False se não estiver.
        """
        return self.ultima_situacao == SerialSituacaoEnum.RECEBIDO

    @property
    def esta_preparado(self):
        """Verifica se o serial está preparado para ser utilizado.

        Returns:
            bool: True se estiver preparado, False se não estiver.
        """
        return self.ultima_situacao == SerialSituacaoEnum.EMBALADO

    @property
    def esta_esterilizado(self):
        """Verifica se o serial está esterilizado.

        Returns:
            bool: True se estiver esterilizado, False se não estiver.
        """
        return self.ultima_situacao == SerialSituacaoEnum.ESTERILIZACAO_FIM

    @property
    def esta_em_estoque(self):
        """Verifica se o serial está em estoque.

        Returns:
            bool: True se estiver em estoque, False se não estiver.
        """
        return self.ultima_situacao == SerialSituacaoEnum.ESTOQUE

    @property
    def esta_em_esterilizacao(self):
        """Verifica se o serial está em esterilização.

        Returns:
            bool: True se estiver em esterilização, False se não estiver.
        """
        return self.ultima_situacao == SerialSituacaoEnum.ESTERILIZACAO_INICIO

    @property
    def esta_em_termodesinfeccao(self):
        """Verifica se o serial está em termodesinfeccao.

        Returns:
            bool: True se estiver em termodesinfeccao, False se não estiver.
        """
        return self.ultima_situacao == SerialSituacaoEnum.TERMO_INICIO

    @property
    def esta_termodesinfectado(self):
        """Verifica se o serial está termodesinfectado.

        Returns:
            bool: True se estiver termodesinfectado, False se não estiver.
        """
        return self.ultima_situacao == SerialSituacaoEnum.TERMO_FIM

    @property
    def esta_abortado(self):
        """Verifica se o serial está abortado.

        Returns:
            bool: True se estiver abortado, False se não estiver.
        """
        return self.ultima_situacao in (
            SerialSituacaoEnum.ABORTADO_TERMO,
            SerialSituacaoEnum.ABORTADO_ESTERILIZACAO,
        )

    @property
    def esta_distribuido(self):
        """Verifica se o serial está distribuido.

        Returns:
            bool: True se estiver distribuido, False se não estiver.
        """
        return self.ultima_situacao == SerialSituacaoEnum.DISTRIBUIDO

    @property
    def quantidade_por_cliente(self):
        """Retorna as quantidades totais e parciais de caixas por clientes."""

        queryset = Sequenciaetiqueta.objects.caixas_aguardando_conferencia()
        total = queryset.count()
        return total


class SequenciaetiquetaAud(models.Model):
    idsequenciaetiqueta = models.CharField(primary_key=True, max_length=255)
    rev = models.ForeignKey(Revinfo, models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "sequenciaetiqueta_aud"
        unique_together = (("idsequenciaetiqueta", "rev"),)


class Setor(AutoIncrementMixin, TrackableMixin):
    id = models.BigAutoField(primary_key=True, db_column="idsetor")
    descricao = models.CharField(unique=True, max_length=90)

    def __str__(self):
        return self.descricao

    class Meta:
        managed = True
        db_table = "setor"
        verbose_name = "Setor"
        verbose_name_plural = "Setores"


class SetorAud(models.Model):
    idsetor = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey(Revinfo, models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "setor_aud"
        unique_together = (("idsetor", "rev"),)


class Subtipoproduto(AutoIncrementMixin, TrackableMixin):
    idsubtipoproduto = models.BigIntegerField(primary_key=True)
    descricao = models.CharField(unique=True, max_length=90)
    dtcadastro = models.DateTimeField()
    situacao = models.BooleanField(default=True, null=True)

    class Meta:
        managed = True
        db_table = "subtipoproduto"
        verbose_name = "Subtipo de produto"
        verbose_name_plural = "Subtipos de produto"


class SubtipoprodutoAud(models.Model):
    idsubtipoproduto = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey(Revinfo, models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "subtipoproduto_aud"
        unique_together = (("idsubtipoproduto", "rev"),)


class Termodesinfeccao(AutoIncrementMixin, TrackableMixin):
    class Status(models.TextChoices):
        INICIADO = "TERMO_INICIO", "Iniciado"
        FINALIZADO = "TERMO_FIM", "Finalizado"
        ABORTADO = "ABORTADO", "Abortado"

    id = models.BigAutoField(primary_key=True)
    ciclo = models.IntegerField(blank=True, null=True)
    datafim = models.DateTimeField(blank=True, null=True)
    datainicio = models.DateTimeField()
    statusfim = models.CharField(max_length=20, blank=True, null=True)
    statusinicio = models.CharField(max_length=20)
    programacao = models.CharField(
        max_length=99,
        choices=ProgramacaEquipamentoEnum.choices,
        blank=True,
        null=True,
        default=None,
        db_column="tipolimpeza",
    )
    equipamento = models.ForeignKey(
        Equipamento, models.DO_NOTHING, db_column="idequipamento"
    )
    idusu = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="idusu")
    idusuariosecundario = models.ForeignKey(
        "Usuariosecundario",
        models.DO_NOTHING,
        db_column="idusuariosecundario",
        blank=True,
        null=True,
    )
    statusabortado = models.CharField(max_length=20, blank=True, null=True)
    dataabortado = models.DateTimeField(blank=True, null=True)
    duracao = models.IntegerField(blank=True, null=True)

    @property
    def data_fim(self):
        """Retorna data de fim da termodesinfeccao (datafim ou dataabortado)"""
        return self.datafim if self.datafim else self.dataabortado

    @property
    def situacao_atual(self):
        if self.statusabortado:
            return self.statusabortado

        if self.statusfim:
            return self.statusfim

        return self.statusinicio

    objects = TermodesinfeccaoManager()

    class Meta:
        managed = True
        db_table = "termodesinfeccao"
        verbose_name = "Termodesinfecção"
        verbose_name_plural = "Termodesinfecções"


class TermodesinfeccaoAud(models.Model):
    idtermodesinfeccao = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey(Revinfo, models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "termodesinfeccao_aud"
        unique_together = (("idtermodesinfeccao", "rev"),)


class Tipocaixa(AutoIncrementMixin, TrackableMixin):
    id = models.BigAutoField(primary_key=True, db_column="idtipocaixa")
    descricao = models.CharField(unique=True, max_length=90)

    def __str__(self):
        return self.descricao

    class Meta:
        managed = True
        db_table = "tipocaixa"
        verbose_name = "Tipo de caixa"
        verbose_name_plural = "Tipos de caixa"


class TipocaixaAud(models.Model):
    idtipocaixa = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey(Revinfo, models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "tipocaixa_aud"
        unique_together = (("idtipocaixa", "rev"),)


class Tipopacote(AutoIncrementMixin, TrackableMixin):
    idtipopacote = models.BigIntegerField(primary_key=True)
    descricao = models.CharField(unique=True, max_length=90)
    dtcadastro = models.DateTimeField(blank=True, null=True)
    situacao = models.BooleanField(default=True, null=True)

    class Meta:
        managed = True
        db_table = "tipopacote"
        verbose_name = "Tipo de pacote"
        verbose_name_plural = "Tipos de pacote"


class TipopacoteAud(models.Model):
    idtipopacote = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey(Revinfo, models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "tipopacote_aud"
        unique_together = (("idtipopacote", "rev"),)


class Ultrassonica(models.Model):
    idultrassonica = models.BigIntegerField(primary_key=True)
    ciclo = models.IntegerField(blank=True, null=True)
    dataultrassonica = models.DateTimeField()
    statusultrassonica = models.CharField(max_length=20)
    idusu = models.ForeignKey("Usuario", models.DO_NOTHING, db_column="idusu")

    class Meta:
        managed = True
        db_table = "ultrassonica"
        verbose_name = "Ultrassônica"
        verbose_name_plural = "Ultrassônicas"


class UltrassonicaAud(models.Model):
    idultrassonica = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey(Revinfo, models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "ultrassonica_aud"
        unique_together = (("idultrassonica", "rev"),)


class Usuario(models.Model):
    idusu = models.BigAutoField(primary_key=True)
    apelidousu = models.CharField(unique=True, max_length=31)
    ativo = models.BooleanField()
    datacadastrousu = models.DateTimeField()
    senhausu = models.CharField(max_length=90)
    idprofissional = models.ForeignKey(
        Profissional,
        models.DO_NOTHING,
        db_column="idprofissional",
        related_name="usuarios",
    )

    class Meta:
        managed = True
        db_table = "usuario"
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"

    def __str__(self):
        return self.apelidousu

    def activate(self):
        self.ativo = True
        self.save()

    def desativar(self):
        self.ativo = False
        self.save()


class UsuarioAud(models.Model):
    idusu = models.BigIntegerField(primary_key=True)
    rev = models.ForeignKey(Revinfo, models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "usuario_aud"
        unique_together = (("idusu", "rev"),)


class UsuarioGrupo(AutoIncrementMixin):
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(
        Usuario, models.DO_NOTHING, related_name="grupos"
    )
    grupo = models.ForeignKey(Grupo, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = "usuario_grupo"
        verbose_name = "Usuário vs Grupo"
        verbose_name_plural = "Usuários vs Grupos"


class Usuariosecundario(models.Model):
    idusuariosecundario = models.CharField(primary_key=True, max_length=30)

    class Meta:
        managed = True
        db_table = "usuariosecundario"
        verbose_name = "Usuário secundário"
        verbose_name_plural = "Usuários secundários"


class UsuariosecundarioAud(models.Model):
    idusuariosecundario = models.CharField(primary_key=True, max_length=30)
    rev = models.ForeignKey(Revinfo, models.DO_NOTHING, db_column="rev")
    revtype = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = "usuariosecundario_aud"
        unique_together = (("idusuariosecundario", "rev"),)
