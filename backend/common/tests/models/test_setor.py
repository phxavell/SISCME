from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.test import TestCase

from common.models import Setor
from common.tests.factories import SetorFactory


class SetorTestCase(TestCase):
    def setUp(self):
        self.setor = SetorFactory()

    def test_create_setor(self):
        """Testa a criação de um Setor."""
        self.setor = SetorFactory()
        self.assertIsNotNone(self.setor)

    def test_setor_str_representation(self):
        """Testa a representação em string de um setor."""
        setor = SetorFactory(descricao="teste_descrição")
        self.assertEqual(str(setor.descricao), "teste_descrição")

    def test_setor_desciption_str_atualization(self):
        """Testa a representação em string de um setor."""
        setor = SetorFactory(descricao="outra_descricao")
        self.assertEqual(str(setor.descricao), "outra_descricao")

    def test_setor_description_not_null(self):
        """Testa se a descrição do setor pode ser nulo."""
        with self.assertRaises(IntegrityError):
            SetorFactory(descricao=None)

    def test_setor_search_by_description(self):
        """Testa a busca de um setor pela descrição."""
        self.assertIsNotNone(Setor.objects.get(descricao=self.setor.descricao))

    def test_setor_can_be_deleted(self):
        """Testa se um setor pode ser excluído."""
        setor = SetorFactory()
        setor.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Setor.objects.get(id=setor.id)

    def test_str_method(self):
        """Testa o método __str__ da classe Setor."""
        self.assertEqual(str(self.setor), self.setor.descricao)
