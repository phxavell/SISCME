from django.core.exceptions import ObjectDoesNotExist
from django.db.transaction import TransactionManagementError
from django.db.utils import IntegrityError
from django.test import TestCase

from common.enums import SerialSituacaoEnum
from common.models import AutoclavagemItem
from common.tests.factories import (
    AutoclavagemFactory,
    AutoclavagemItemFactory,
    EventoFactory,
)


class AutoclavagemItemTestCase(TestCase):
    def setUp(self):
        self.autoclavagem = AutoclavagemFactory()
        self.item = AutoclavagemItemFactory(autoclavagem=self.autoclavagem)

    def test_create(self):
        """Testa a criação de uma caixa."""
        self.assertIsNotNone(self.item)

    def test_create_required_fields(self):
        """Testa se os campos obrigatórios foram preenchidos."""
        self.assertIsNotNone(self.item.autoclavagem)
        self.assertIsNotNone(self.item.serial)

    def test_error_create_without_required_fields(self):
        """Testa erro se os campos obrigatórios não foram preenchidos."""
        with self.assertRaises(IntegrityError):
            item = AutoclavagemItemFactory(autoclavagem=None)
            item.save()
        with self.assertRaises(TransactionManagementError):
            item = AutoclavagemItemFactory(serial=None)
            item.save()

    def test_association_foreignkeys(self):
        """Testa se os campos FK foi relacionado corretamente aos
        seus respectivos models."""
        self.assertEqual(
            self.item.autoclavagem.__class__.__name__, "Autoclavagem"
        )

    def test_delete(self):
        """Testa se é possível excluir."""
        item = AutoclavagemItemFactory()
        with self.assertRaises(ObjectDoesNotExist):
            item.delete()
            AutoclavagemItem.objects.get(id=item.id)


class AutoclavagemItemManagerManagerTesCase(TestCase):
    def setUp(self):
        self.autoclavagem_1 = AutoclavagemFactory()
        self.autoclavagem_2 = AutoclavagemFactory()
        self.item_1 = AutoclavagemItemFactory(autoclavagem=self.autoclavagem_1)
        self.item_2 = AutoclavagemItemFactory(autoclavagem=self.autoclavagem_2)
        self.evento_1 = EventoFactory(
            status=SerialSituacaoEnum.ESTERILIZACAO_INICIO,
            idautoclavagem=self.autoclavagem_1,
        )
        self.evento_2 = EventoFactory(
            status=SerialSituacaoEnum.ESTERILIZACAO_FIM,
            idautoclavagem=self.autoclavagem_2,
        )
        self.evento_1.save()
        self.evento_2.save()

    def test_caixas_recentes(self):
        """Testa a existencia de itens com status recentes."""
        self.assertEqual(AutoclavagemItem.objects.caixas_recentes().count(), 2)
