# pylint: disable=too-many-public-methods
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db.utils import IntegrityError
from django.test import TestCase

from common.models import Caixa
from common.tests.factories import CaixaFactory
from rest_framework.exceptions import ValidationError as DRFValidationError


class CaixaTestCase(TestCase):
    def setUp(self):
        self.caixa = CaixaFactory()
        self.seriais_gerados = self.caixa.gerar_seriais(1000)

        self.caixa_2 = CaixaFactory()
        self.seriais_gerados_2 = self.caixa_2.gerar_seriais(1)

    def test_create(self):
        """Testa a criação de uma caixa."""
        self.assertIsNotNone(self.caixa)

    def test_create_required_fields(self):
        """Testa se os campos obrigatórios foram preenchidos."""
        self.assertIsNotNone(self.caixa.codigo_modelo)
        self.assertIsNotNone(self.caixa.validade)
        self.assertIsNotNone(self.caixa.temperatura)
        self.assertIsNotNone(self.caixa.cliente)
        self.assertIsNotNone(self.caixa.tipo_caixa)

    def test_error_create_without_required_fields(self):
        """Testa erro se os campos obrigatórios não foram preenchidos."""
        with self.assertRaises(IntegrityError):
            CaixaFactory(
                codigo_modelo=None,
                validade=None,
                temperatura=None,
                tipo_caixa=None,
            )

    def test_successs_create_without_optional_fields(self):
        """Testa a criacao com sucesso se os campos
        obrigatórios não foram preenchidos."""
        caixa = CaixaFactory(
            embalagem=None,
            criticidade=None,
            instrucoes_uso=None,
            situacao=None,
            imagem=None,
            prioridade=None,
            categoria_uso=None,
        )
        self.assertIsNotNone(caixa)

    def test_unique_nome_constraint(self):
        """Testa erro ao criar duas caixas com o mesmo nome."""
        with self.assertRaises(IntegrityError):
            CaixaFactory(nome=self.caixa.nome)

    def test_invalid_nome_constraint(self):
        """Testa erro ao criar duas caixa com nome
        possuindo caracteres especiais."""
        caixa = CaixaFactory(nome="$!@###%&**)")
        with self.assertRaises(ValidationError):
            caixa.full_clean()

    def test_association_foreignkey_cliente(self):
        """Testa se o campo cliente foi relacionado corretamente ao Cliente."""
        self.assertEqual(self.caixa.cliente.__class__.__name__, "Cliente")

    def test_association_foreignkey_caixa_valor(self):
        """Testa se o campo embalagem foi relacionado corretamente a CaixaValor."""
        self.assertEqual(self.caixa.embalagem.__class__.__name__, "Caixavalor")

    def test_association_foreignkey_tipo_caixa(self):
        """Testa se o campo idsu tipo_caixa relacionado corretamente a TipoCaixa."""
        self.assertEqual(self.caixa.tipo_caixa.__class__.__name__, "Tipocaixa")

    def test_choice_temperatura_value(self):
        """Testa erro ao escolher um valor de temperatura
        dentre os definidos."""
        caixa_a = CaixaFactory(temperatura=Caixa.Temperatura.TEMPERATURA_121)
        caixa_b = CaixaFactory(temperatura=Caixa.Temperatura.TEMPERATURA_134)
        self.assertIsNotNone(caixa_a)
        self.assertIsNotNone(caixa_b)

    def test_choice_situacao_value(self):
        """Testa erro ao escolher um valor de situação
        dentre os definidos."""
        caixa_a = CaixaFactory(situacao=Caixa.Situacao.ATIVO)
        caixa_b = CaixaFactory(situacao=Caixa.Situacao.INATIVO)
        caixa_c = CaixaFactory(situacao=Caixa.Situacao.REVISAO)
        self.assertIsNotNone(caixa_a)
        self.assertIsNotNone(caixa_b)
        self.assertIsNotNone(caixa_c)

    def test_choice_categoria_uso_value(self):
        """Testa erro ao escolher um valor de categoriaUso
        dentre os definidos."""
        caixa_a = CaixaFactory(
            categoria_uso=Caixa.CategoriaUso.CIRURGIA_CARDIACA
        )
        caixa_b = CaixaFactory(
            categoria_uso=Caixa.CategoriaUso.CIRURGIA_VASCULAR
        )
        caixa_c = CaixaFactory(categoria_uso=Caixa.CategoriaUso.CIRURGIA_GERAL)
        caixa_c = CaixaFactory(
            categoria_uso=Caixa.CategoriaUso.CIRURGIA_NEUROLOGICA
        )
        caixa_d = CaixaFactory(
            categoria_uso=Caixa.CategoriaUso.CIRURGIA_ORTOPEDICA
        )
        caixa_e = CaixaFactory(
            categoria_uso=Caixa.CategoriaUso.CIRURGIA_PLASTICA
        )
        caixa_f = CaixaFactory(
            categoria_uso=Caixa.CategoriaUso.CIRURGIA_PLASTICA
        )
        caixa_g = CaixaFactory(categoria_uso=Caixa.CategoriaUso.EMERGENCIA)
        caixa_h = CaixaFactory(categoria_uso=Caixa.CategoriaUso.OUTROS)

        self.assertIsNotNone(caixa_a)
        self.assertIsNotNone(caixa_b)
        self.assertIsNotNone(caixa_c)
        self.assertIsNotNone(caixa_d)
        self.assertIsNotNone(caixa_e)
        self.assertIsNotNone(caixa_f)
        self.assertIsNotNone(caixa_g)
        self.assertIsNotNone(caixa_h)

    def test_choice_prioridade_value(self):
        """Testa erro ao escolher um valor de prioridade
        dentre os definidos."""
        caixa_a = CaixaFactory(prioridade=Caixa.Prioridade.URGENTE)
        caixa_b = CaixaFactory(prioridade=Caixa.Prioridade.ALTA)
        caixa_c = CaixaFactory(prioridade=Caixa.Prioridade.MEDIA)
        caixa_d = CaixaFactory(prioridade=Caixa.Prioridade.BAIXA)

        self.assertIsNotNone(caixa_a)
        self.assertIsNotNone(caixa_b)
        self.assertIsNotNone(caixa_c)
        self.assertIsNotNone(caixa_d)

    def test_choice_criticidade_value(self):
        """Testa erro ao escolher um valor de criticidade
        dentre os definidos."""
        caixa_a = CaixaFactory(criticidade=Caixa.Criticidade.NAO_CRITICO)
        caixa_b = CaixaFactory(criticidade=Caixa.Criticidade.SEMICRITICO)
        caixa_c = CaixaFactory(criticidade=Caixa.Criticidade.CRITICO)

        self.assertIsNotNone(caixa_a)
        self.assertIsNotNone(caixa_b)
        self.assertIsNotNone(caixa_c)

    def test_str_representation(self):
        """Testa representação em str da instancia."""
        self.assertEqual(str(self.caixa), self.caixa.nome)

    def test_representation_instance(self):
        """Testa representação da instancia."""
        self.assertEqual(
            repr(self.caixa),
            f"<Caixa: {self.caixa.nome} (ID: {self.caixa.id})>",
        )

    def test_delete(self):
        """Testa se é possível excluir."""
        caixa = CaixaFactory()
        caixa.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Caixa.objects.get(id=caixa.id)

    def test_lista_caixas(self):
        """Testa se é possível listar as caixas."""
        self.assertIsNotNone(self.caixa.lista_de_caixas)

    def test_lista_de_itens(self):
        """Testa se é possível listar os itens de uma caixa."""
        self.assertIsNotNone(self.caixa.lista_de_itens)

    def test_lista_ids_produtos_dos_itens(self):
        """Testa se é possível listar os ids dos produtos de uma caixa."""
        self.assertEqual(self.caixa.lista_ids_produtos_dos_itens.count(), 0)

    def test_quantidade_itens(self):
        """Testa se é possível contar os itens de uma caixa."""
        self.assertEqual(self.caixa.quantidade_itens, 0)

    def test_campo_codigo_modelo(self):
        """Testa se o campo codigo_modelo não foi alterado após a criação"""
        with self.assertRaises(DRFValidationError) as context:
            self.caixa.codigo_modelo = "teste"
            self.caixa.clean()

        self.assertEqual(
            context.exception.detail[0].capitalize(),
            "O campo 'código do modelo' não pode ser alterado após a criação.",
        )

    def test_geracao_seriais(self):
        """Testa se é possível gerar seriais para uma caixa."""
        with self.assertRaises(ValueError):
            self.caixa.gerar_seriais(0)

        self.assertIsNotNone(self.caixa_2.gerar_seriais(1))

        self.assertEqual(
            self.seriais_gerados[0].__class__.__name__, "Sequenciaetiqueta"
        )
