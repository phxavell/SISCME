from django.test import TestCase

from common.tests.factories import MotoristaFactory, VeiculoFactory
from rest_framework.exceptions import (
    NotFound,
    PermissionDenied,
    ValidationError,
)


class MotoristaTestCase(TestCase):
    TEST_USERNAME = "testusername"

    def setUp(self):
        self.motorista = MotoristaFactory(
            username=self.TEST_USERNAME,
        )

        self.veiculo = VeiculoFactory()
        self.motorista.groups.add(1)
        self.veiculo.alocar(self.motorista)

        self.motorista_2 = MotoristaFactory(
            username="testusername2",
        )
        self.motorista_2.groups.add(2)

    def test_user_is_motorista(self):
        """Testa se um usuário é motorista"""
        self.assertTrue(self.motorista.get_motorista)
        self.assertEqual(
            self.motorista.get_motorista(self.motorista.id), self.motorista
        )

    def test_user_is_not_motorista(self):
        """Testa se um usuário não é motorista"""
        with self.assertRaises(PermissionDenied):
            self.motorista.get_motorista(self.motorista_2.id)

    def test_user_is_not_founded(self):
        """Testa um usuário que não existe"""
        with self.assertRaises(NotFound):
            self.motorista.get_motorista(950)

    def test_is_motorista(self):
        """Testa se um usuário é motorista dentro da Model"""
        self.assertTrue(self.motorista.is_motorista)

    def test_motorista_is_disponivel(self):
        """Testa se um motorista está disponível"""
        self.assertFalse(self.motorista.is_disponivel)
        self.assertTrue(self.motorista_2.is_disponivel)

    def test_esta_disponivel(self):
        """Usa a função esta_disponivel_para para testar se o motorista está disponível"""
        self.assertTrue(self.motorista.esta_disponivel_para)

    def test_nao_esta_disponivel(self):
        """Testa se o motorista não está disponível"""
        with self.assertRaises(ValidationError):
            self.motorista.esta_disponivel_para(self.motorista)

    def test_esta_disponivel_para(self):
        """Testa se o motorista está disponível para um veículo"""
        self.assertTrue(self.motorista_2.esta_disponivel_para(self.veiculo))

    def test_veiculo_atual(self):
        """Testa se um veículo está disponível"""
        self.assertIsNotNone(self.motorista.veiculo_atual)
        self.assertIsNone(self.motorista_2.veiculo_atual)

    def test_minhas_coletas(self):
        """Retorna as coletas de um motorista"""
        self.assertEqual(self.motorista.minhas_coletas.count(), 0)

    def test_minhas_entregas(self):
        """Testa as entregas de um motorista"""
        self.assertEqual(self.motorista.minhas_entregas.count(), 0)
