# backend/common/tests/factories.py
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from django.db import transaction
from django.utils import timezone

import factory
from common.enums import (
    ProgramacaEquipamentoEnum,
    SerialSituacaoEnum,
    TipoEquipamentoEnum,
    TipoIntegradorEnum,
)
from common.models import (
    Autoclavagem,
    AutoclavagemItem,
    Caixa,
    Caixavalor,
    Cliente,
    Coleta,
    ColetaEntregaModel,
    Complemento,
    Diario,
    Entrega,
    Equipamento,
    Estoque,
    Etiqueta,
    Evento,
    HistoricoSolicitacaoEsterilizacaoModel,
    IndicadoresEsterilizacao,
    Itemcaixa,
    Itemrecebimento,
    Lote,
    Origem,
    Plantao,
    Producao,
    Produto,
    Profissao,
    Profissional,
    Recebimento,
    Sequenciaetiqueta,
    Setor,
    SolicitacaoEsterilizacaoItemModel,
    SolicitacaoEsterilizacaoModel,
    Subtipoproduto,
    Termodesinfeccao,
    Tipocaixa,
    TipoOcorrencia,
    Tipopacote,
    Usuario,
    Veiculo,
)
from users.models import Motorista, User


class VeiculoFactory(factory.django.DjangoModelFactory):
    descricao = factory.Faker("text", max_nb_chars=100)
    placa = factory.Sequence(lambda n: f"ABC{n:03d}")
    marca = factory.Faker("company")
    modelo = factory.Faker("word")
    foto = factory.django.ImageField(filename="veiculo.png")
    motorista_atual = None

    class Meta:
        model = Veiculo


class SetorFactory(factory.django.DjangoModelFactory):
    descricao = factory.Sequence(lambda n: f"Setor {n:03d}")

    class Meta:
        model = Setor


class ProfissaoFactory(factory.django.DjangoModelFactory):
    descricao = factory.Sequence(lambda n: f"Profissao {n:03d}")

    class Meta:
        model = Profissao


class ClienteFactory(factory.django.DjangoModelFactory):
    idcli = factory.Sequence(lambda n: f"0{n:02d}")
    datacadastrocli = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    horacadastrocli = factory.Faker("time")
    nomeabreviado = factory.Sequence(lambda n: f"Nome abreviado {n:02d}")
    nomecli = factory.Sequence(lambda n: f"Nome Cliente {n:02d}")

    # opcionais
    bairrocli = factory.Faker("city")
    cepcli = factory.Faker("text", max_nb_chars=10)
    cidadecli = factory.Faker("city")
    cnpjcli = factory.Faker("ssn")
    codigocli = factory.Faker("text", max_nb_chars=15)
    contatocli = factory.Faker("text", max_nb_chars=14)

    emailcli = factory.Faker("email")
    inscricaoestadualcli = factory.Faker("text", max_nb_chars=11)
    inscricaomunicipalcli = factory.Faker("text", max_nb_chars=11)
    nomefantasiacli = factory.Sequence(lambda n: f"Fantasia {n:02d}")
    numerocli = factory.Sequence(lambda n: f"2{n:02d}")

    ruacli = factory.Faker("street_name")
    telefonecli = factory.Faker("text", max_nb_chars=14)
    ufcli = factory.Faker("city")
    ativo = True
    foto = factory.Faker("file_name", extension="jpg")

    class Meta:
        model = Cliente


class ProfissionalFactory(factory.django.DjangoModelFactory):
    cpf = factory.Sequence(lambda n: f"0000000000{n:02d}")
    nome = factory.Faker("name")
    status = "ADMITIDO"
    dtadmissao = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    dtcadastro = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    dtnascimento = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    idprofissao = factory.SubFactory(ProfissaoFactory)

    # campos opcionais
    email = factory.Faker("email")
    coren = factory.Faker("text", max_nb_chars=10)
    matricula = factory.Sequence(lambda n: f"0000000000{n:02d}")
    cliente = factory.SubFactory(ClienteFactory)
    contato = factory.Faker("text", max_nb_chars=14)

    class Meta:
        model = Profissional


class UserFactory(factory.django.DjangoModelFactory):
    username = factory.Faker("word")
    idprofissional = factory.SubFactory(ProfissionalFactory)
    email = factory.Faker("email")

    @factory.lazy_attribute
    def password(self):
        return make_password("test_password")

    class Meta:
        model = User


class GroupFactory(factory.django.DjangoModelFactory):
    name = factory.Faker("job")

    class Meta:
        model = Group


class MotoristaFactory(UserFactory):
    class Meta:
        model = Motorista


class UsuarioFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Usuario

    apelidousu = factory.Sequence(lambda n: f"Usuario {n:02d}")
    ativo = True
    datacadastrousu = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    idprofissional = factory.SubFactory(ProfissionalFactory)

    @factory.lazy_attribute
    def senhausu(self):
        return make_password("test_password")


class PlantaoFactory(factory.django.DjangoModelFactory):
    datacadastro = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    datafechamento = None
    descricaoaberto = factory.Faker("text")
    descricaofechamento = None
    grupousuario = ""
    horacadastro = "17:35:01"
    horafechamento = None
    status = "ABERTO"
    idprofissional = factory.SubFactory(ProfissionalFactory)

    class Meta:
        model = Plantao


class PlantaoFechadoFactory(factory.django.DjangoModelFactory):
    datacadastro = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    datafechamento = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    descricaoaberto = factory.Faker("text")
    descricaofechamento = factory.Faker("text")
    grupousuario = ""
    horacadastro = "17:35:01"
    horafechamento = "17:45:01"
    status = "FECHADO"
    idprofissional = factory.SubFactory(ProfissionalFactory)

    class Meta:
        model = Plantao


class TipoOcorrenciaFactory(factory.django.DjangoModelFactory):
    datalancamento = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    descricao = factory.Faker("text", max_nb_chars=50)
    status = factory.Faker("word")
    idusu = factory.SubFactory(UsuarioFactory)

    class Meta:
        model = TipoOcorrencia


class DiarioFactory(factory.django.DjangoModelFactory):
    arquivo = None
    dataabertura = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    datafechamento = None
    dataretroativa = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    descricao = factory.Faker("word")
    acao = factory.Faker("word")
    horaabertura = factory.Faker("time")
    horafechamento = None
    horaretroativa = factory.Faker("time")
    status = "ABERTO"
    statusdiariodeocorrencia = "ABERTO"
    tipodediariodeocorrencia = factory.Faker(
        "random_element", elements=["EXPEDIDA", "RECEBIDA"]
    )
    profissional_responsavel = factory.SubFactory(UserFactory)
    nome_profissional_responsavel = factory.SelfAttribute(
        "profissional_responsavel.username"
    )
    uuid = factory.Faker("uuid4")
    idcli = factory.SubFactory(ClienteFactory)
    idsetor = factory.SubFactory(SetorFactory)
    idusu = factory.SubFactory(UsuarioFactory)
    idindicador = factory.SubFactory(TipoOcorrenciaFactory)

    class Meta:
        model = Diario


class SubtipoprodutoFactory(factory.django.DjangoModelFactory):
    descricao = factory.Faker("sentence", nb_words=4)
    dtcadastro = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    situacao = True

    class Meta:
        model = Subtipoproduto


class TipopacoteFactory(factory.django.DjangoModelFactory):
    descricao = factory.Faker("sentence", nb_words=4)
    dtcadastro = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    situacao = True

    class Meta:
        model = Tipopacote


class ProdutoFactory(factory.django.DjangoModelFactory):
    descricao = factory.Faker("sentence", nb_words=4)
    dtcadastro = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    embalagem = factory.Faker("word")
    situacao = True
    foto = factory.django.ImageField(color="blue")
    status = factory.Faker("word")
    idsubtipoproduto = factory.SubFactory(SubtipoprodutoFactory)
    idtipopacote = factory.SubFactory(TipopacoteFactory)

    class Meta:
        model = Produto


class ProducaoFactory(factory.django.DjangoModelFactory):
    cautela = factory.Faker("pyint", min_value=1, max_value=1000)
    datacancelamento = None
    dataproducao = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    datavalidade = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    observacao = factory.Faker("text", max_nb_chars=255)
    statusproducao = "EMBALADO"
    idusu = factory.SubFactory(UsuarioFactory)

    class Meta:
        model = Producao


class CaixaValorFactory(factory.django.DjangoModelFactory):
    descricao = factory.Faker("word")
    valorcaixa = factory.Faker("pydecimal", left_digits=4, right_digits=2)

    class Meta:
        model = Caixavalor


class TipoCaixaFactory(factory.django.DjangoModelFactory):
    descricao = factory.Sequence(lambda n: f"Caixa {n:03d}")

    class Meta:
        model = Tipocaixa


class CaixaFactory(factory.django.DjangoModelFactory):
    nome = factory.Sequence(lambda n: f"Caixa {n:03d}")

    validade = factory.Faker("random_int", min=1, max=24)
    temperatura = factory.Faker(
        "random_element",
        elements=[choice[0] for choice in Caixa.Temperatura.choices],
    )
    embalagem = factory.SubFactory(CaixaValorFactory)
    cliente = factory.SubFactory(ClienteFactory)
    tipo_caixa = factory.SubFactory(TipoCaixaFactory)
    criticidade = factory.Faker(
        "random_element",
        elements=[choice[0] for choice in Caixa.Criticidade.choices],
    )
    codigo_modelo = factory.Sequence(lambda n: f"Codigo {n:03d}")
    descricao = factory.Faker("sentence", nb_words=6)
    instrucoes_uso = factory.Faker("text")
    situacao = Caixa.Situacao.ATIVO
    imagem = factory.Faker("file_name", extension="jpg")
    prioridade = factory.Faker(
        "random_element",
        elements=[choice[0] for choice in Caixa.Prioridade.choices],
    )
    categoria_uso = factory.Faker(
        "random_element",
        elements=[choice[0] for choice in Caixa.CategoriaUso.choices],
    )

    class Meta:
        model = Caixa

    @classmethod
    def create_batch_with_serials(cls, size, **kwargs):
        """Cria uma lista de instâncias e gera seriais para cada caixa."""
        with transaction.atomic():
            caixas = cls.create_batch(size, **kwargs)
            for caixa in caixas:
                caixa.gerar_seriais(quantidade=5)
        return caixas


class SequenciaetiquetaFactory(factory.django.DjangoModelFactory):
    idsequenciaetiqueta = factory.Sequence(lambda n: f"SEQ{n:05d}")
    idcaixa = factory.SubFactory(CaixaFactory)
    ultima_situacao = SerialSituacaoEnum.NAO_UTILIZADO
    data_ultima_situacao = factory.LazyFunction(timezone.now)

    class Meta:
        model = Sequenciaetiqueta


class SolicitacaoEsterilizacaoFactory(factory.django.DjangoModelFactory):
    cliente = factory.SubFactory(ClienteFactory)
    observacao = factory.Faker("text", max_nb_chars=255)
    situacao = SolicitacaoEsterilizacaoModel.STATUS_CHOICES[0][0]

    class Meta:
        model = SolicitacaoEsterilizacaoModel


class SolicitacaoEsterilizacaoItemFactory(factory.django.DjangoModelFactory):
    solicitacao_esterilizacao = factory.SubFactory(
        SolicitacaoEsterilizacaoFactory
    )
    caixa = factory.SubFactory(SequenciaetiquetaFactory)

    class Meta:
        model = SolicitacaoEsterilizacaoItemModel


class ColetaEntregaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ColetaEntregaModel

    solicitacao_esterilizacao = factory.SubFactory(
        SolicitacaoEsterilizacaoFactory
    )
    motorista = factory.SubFactory(UserFactory)
    veiculo = factory.SubFactory(VeiculoFactory)
    retorno = False


class ColetaFactory(ColetaEntregaFactory):
    class Meta:
        model = Coleta

    retorno = False


class EntregaFactory(ColetaEntregaFactory):
    class Meta:
        model = Entrega

    retorno = True


class ComplementoFactory(factory.django.DjangoModelFactory):
    id = factory.Sequence(int)
    descricao = factory.Sequence(lambda n: f"Complemento {n}")
    status = "ATIVO"

    class Meta:
        model = Complemento


class EquipamentoFactory(factory.django.DjangoModelFactory):
    idequipamento = factory.Sequence(int)
    descricao = factory.Sequence(lambda n: f"Equipamento {n}")
    tipo = factory.Faker(
        "random_element",
        elements=[choice[0] for choice in TipoEquipamentoEnum.choices],
    )
    # opcionais
    numero_serie = factory.Faker("text", max_nb_chars=30)
    data_fabricacao = factory.Faker("date")
    registro_anvisa = factory.Faker("text", max_nb_chars=20)
    capacidade = factory.Faker("word")
    fabricante = factory.Faker("text", max_nb_chars=30)

    ativo = factory.Faker("boolean")
    ultima_manutencao = factory.Faker("date")
    proxima_manutencao = factory.Faker("date")

    class Meta:
        model = Equipamento


class EtiquetaFactory(factory.django.DjangoModelFactory):
    id = factory.Sequence(int)
    ciclo = factory.Faker("random_int", min=1, max=10)
    horalancamento = factory.Faker("time")
    cautela = factory.Faker("random_int", min=1, max=100)
    qtd = factory.Faker("random_int", min=1, max=100)
    qtdimpressao = factory.Faker("random_int", min=1, max=100)
    idcli = factory.SubFactory(ClienteFactory)
    idproduto = factory.SubFactory(ProdutoFactory)
    idprofissional = factory.SubFactory(ProfissionalFactory)
    autoclave = factory.SubFactory(
        EquipamentoFactory, tipo=TipoEquipamentoEnum.AUTOCLAVE
    )
    termodesinfectora = factory.SubFactory(
        EquipamentoFactory, tipo=TipoEquipamentoEnum.TERMODESINFECTORA
    )
    seladora = factory.SubFactory(
        EquipamentoFactory, tipo=TipoEquipamentoEnum.SELADORA
    )
    datafabricacao = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    datalancamento = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    datavalidade = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    servico = factory.Faker(
        "random_element",
        elements=[choice[0] for choice in Etiqueta.Servico.choices],
    )
    tipoetiqueta = factory.Faker(
        "random_element",
        elements=[choice[0] for choice in Etiqueta.TipoEtiqueta.choices],
    )
    # campos opcionais
    idcomplemento = factory.SubFactory(ComplementoFactory)
    biologico = factory.Faker("random_element", elements=["SIM", "NAO"])
    obs = factory.Faker("text", max_nb_chars=255)
    peso = factory.Faker("pystr", max_chars=10)
    status = "VALIDO"
    temperatura = factory.Faker("random_element", elements=[121, 134])
    totalenvelopado = factory.Faker("random_int", min=1, max=100)

    class Meta:
        model = Etiqueta


class AutoclavagemFactory(factory.django.DjangoModelFactory):
    id = factory.Sequence(int)
    ciclo = factory.Faker("random_int", min=1, max=10)
    datainicio = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    statusinicio = Autoclavagem.Status.INICIADO
    equipamento = factory.SubFactory(EquipamentoFactory)

    class Meta:
        model = Autoclavagem


class AutoclavagemItemFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = AutoclavagemItem

    autoclavagem = factory.SubFactory(AutoclavagemFactory)
    serial = factory.SubFactory(SequenciaetiquetaFactory)


class EventoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Evento

    idevento = factory.Sequence(int)
    dataevento = factory.Faker("date_time_this_decade", tzinfo=None)
    descricaocaixa = factory.Faker("word")
    horaevento = factory.Faker("time")
    idsequenciaetiqueta = factory.Faker("word")
    nomecliente = factory.Faker("word")
    status = factory.Faker("word")


class ItemCaixaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Itemcaixa

    id = factory.Sequence(int)
    criticidade = factory.Faker(
        "random_element",
        elements=[choice[0] for choice in Itemcaixa.Criticidade.choices],
    )
    quantidade = factory.Faker("random_int", min=1, max=10)
    valor_unitario = factory.Faker("random_int", min=1, max=10)
    caixa = factory.SubFactory(CaixaFactory)
    produto = factory.SubFactory(ProdutoFactory)


class HistoricoSolicitacaoFactory(factory.django.DjangoModelFactory):
    solicitacao_esterilizacao = factory.SubFactory(
        SolicitacaoEsterilizacaoFactory
    )
    status = factory.Faker(
        "random_element",
        elements=[
            choice[0]
            for choice in HistoricoSolicitacaoEsterilizacaoModel.STATUS_CHOICES
        ],
    )
    data = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    observacao = None

    class Meta:
        model = HistoricoSolicitacaoEsterilizacaoModel


class OrigemFactory(factory.django.DjangoModelFactory):
    idorigem = factory.Sequence(lambda n: n)
    descricao = factory.Sequence(lambda n: f"Origem {n:03d}")

    class Meta:
        model = Origem


class RecebimentoFactory(factory.django.DjangoModelFactory):
    idrecebimento = factory.Sequence(lambda n: n)
    datarecebimento = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    datacancelamento = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    observacao = factory.Faker("text", max_nb_chars=255)
    statusrecebimento = factory.Faker("text", max_nb_chars=30)
    idorigem = factory.SubFactory(OrigemFactory)
    idusu = factory.SubFactory(UsuarioFactory)
    solicitacao_esterilizacao_id = factory.SubFactory(
        SolicitacaoEsterilizacaoFactory
    )

    class Meta:
        model = Recebimento


class ItemrecebimentoFactory(factory.django.DjangoModelFactory):
    iditemrecebimento = factory.Sequence(lambda n: n)
    quantidade = factory.Faker("random_int", min=1, max=24)
    iditemcaixa = factory.SubFactory(ItemCaixaFactory)
    idrecebimento = factory.SubFactory(RecebimentoFactory)
    idsequenciaetiqueta = factory.SubFactory(SequenciaetiquetaFactory)

    class Meta:
        model = Itemrecebimento


class EstoqueFactory(factory.django.DjangoModelFactory):
    quantidade = factory.Faker("random_int", min=1, max=24)
    status = factory.Faker(
        "random_element", elements=["ARMAZENADO", "DISTRIBUIDO"]
    )
    serial = factory.SubFactory(SequenciaetiquetaFactory)

    class Meta:
        model = Estoque


class TermodesinfeccaoFactory(factory.django.DjangoModelFactory):
    id = factory.Sequence(int)
    datainicio = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    equipamento = factory.SubFactory(EquipamentoFactory)
    idusu = factory.SubFactory(UsuarioFactory)
    # opcionais
    ciclo = factory.Faker("random_int", min=1, max=10)
    datafim = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    statusfim = None
    statusinicio = str(Termodesinfeccao.Status.choices[0][1])
    programacao = factory.Faker(
        "random_element",
        elements=[choice[0] for choice in ProgramacaEquipamentoEnum.choices],
    )
    idusuariosecundario = None
    statusabortado = None
    dataabortado = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )

    class Meta:
        model = Termodesinfeccao


class EventoRecebimentoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Evento

    idevento = factory.Sequence(int)
    dataevento = factory.Faker("date_time_this_decade", tzinfo=None)
    descricaocaixa = factory.Faker("word")
    horaevento = factory.Faker("time")
    idsequenciaetiqueta = factory.Faker("word")
    nomecliente = factory.Faker("word")
    idrecebimento = factory.SubFactory(RecebimentoFactory)


class IndicadoresEsterilizacaoFactory(ProdutoFactory):
    tipo = TipoIntegradorEnum.C5
    saldo = factory.Faker("pyint", min_value=1, max_value=1000)
    fabricante = factory.Faker("company")

    class Meta:
        model = IndicadoresEsterilizacao


class LoteFactory(factory.django.DjangoModelFactory):
    codigo = factory.Sequence(lambda n: f"Codigo {n:03d}")
    saldo = factory.Faker("pyint", min_value=1, max_value=1000)
    fabricacao = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    vencimento = factory.Faker(
        "date_time_this_decade", tzinfo=timezone.get_current_timezone()
    )
    indicador = factory.SubFactory(IndicadoresEsterilizacaoFactory)

    class Meta:
        model = Lote
