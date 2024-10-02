import re

from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.test import TestCase

from common.enums import TipoEquipamentoEnum
from common.models import Equipamento
from common.tests.factories import EquipamentoFactory


class EquipamentoTestCase(TestCase):
    def setUp(self):
        self.equipamento = EquipamentoFactory()

    def test_create(self):
        """Testa a criação de um caixa valor."""
        self.assertIsNotNone(self.equipamento)

    def test_create_required_fields(self):
        """Testa se os campos obrigatórios foram preenchidos."""
        self.assertIsNotNone(self.equipamento.idequipamento)
        self.assertIsNotNone(self.equipamento.descricao)
        self.assertIsNotNone(self.equipamento.tipo)

    def test_error_create_without_required_fields(self):
        """Testa erro se os campos obrigatórios não foram preenchidos."""
        with self.assertRaises(IntegrityError):
            EquipamentoFactory(descricao=None)

    def test_unique_descricao(self):
        with self.assertRaises(IntegrityError):
            EquipamentoFactory(descricao=self.equipamento.descricao)

    def test_format_datefield(self):
        """Testa o formato correto do campo data_fabricacao, ultima_manutencao
        e proxima_manutencao."""
        self.assertTrue(
            re.match(
                r"\d{4}-\d{2}-\d{2}", str(self.equipamento.data_fabricacao)
            )
        )
        self.assertTrue(
            re.match(
                r"\d{4}-\d{2}-\d{2}", str(self.equipamento.ultima_manutencao)
            )
        )
        self.assertTrue(
            re.match(
                r"\d{4}-\d{2}-\d{2}", str(self.equipamento.proxima_manutencao)
            )
        )

    def test_choices_tipo(self):
        """Testa se o campo 'tipo' contém um valor válido de TipoEquipamentoEnum."""
        tipo_enum_values = [
            choice[0] for choice in TipoEquipamentoEnum.choices
        ]
        self.assertIn(self.equipamento.tipo, tipo_enum_values)

    def test_choices_boolean_ativo(self):
        self.assertIn(self.equipamento.ativo, [True, False])

    def test_delete(self):
        """Testa se é possível excluir um equipamento."""
        equipamento = EquipamentoFactory()
        equipamento.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Equipamento.objects.get(idequipamento=equipamento.idequipamento)


class EquipamentoManagerTestCase(TestCase):
    def setUp(self):
        self.equipamento = EquipamentoFactory()

    def test_termodesinfectoras(self):
        """Testa se existe um equipamento do tipo TERMODESINFECTORA"""
        self.equipamento.tipo = TipoEquipamentoEnum.TERMODESINFECTORA
        self.equipamento.save()
        self.assertEqual(Equipamento.objects.termodesinfectoras().count(), 1)

    def test_autoclaves(self):
        """Testa se existe um equipamento do tipo AUTOCLAVE"""
        self.equipamento.tipo = TipoEquipamentoEnum.AUTOCLAVE
        self.equipamento.save()
        self.assertEqual(Equipamento.objects.autoclaves().count(), 1)
