# backend/common/tests/models/test_veiculo.py

from django.core.exceptions import ValidationError
from django.test import TestCase

from common.models import Veiculo
from common.tests.factories import (
    ColetaEntregaFactory,
    MotoristaFactory,
    VeiculoFactory,
)


class VeiculoTestCase(TestCase):
    def setUp(self) -> None:
        self.veiculo = VeiculoFactory()
        self.motorista = MotoristaFactory()

    def test_veiculo_creation(self):
        self.assertIsInstance(self.veiculo, Veiculo)

    def test_veiculo_str_representation(self):
        self.assertEqual(
            str(self.veiculo),
            f"{self.veiculo.placa} - {self.veiculo.marca} "
            f"{self.veiculo.modelo}",
        )

    def test_veiculo_placa_format(self):
        with self.assertRaises(ValidationError):
            VeiculoFactory(placa="1234ABC").full_clean()

    def test_veiculo_pode_ser_excluido(self):
        self.veiculo.delete()
        self.assertFalse(Veiculo.objects.filter(id=self.veiculo.id).exists())

    def test_veiculo_nao_pode_ser_excluido_se_ja_foi_usado(self):
        ColetaEntregaFactory(veiculo=self.veiculo)
        with self.assertRaises(ValidationError) as context:
            self.veiculo.delete()
        expected_error_message = (
            "['Este veículo não pode ser excluído "
            "pois já foi utilizado em coleta(s)/entrega(s).']"
        )
        self.assertEqual(str(context.exception), expected_error_message)

    def test_veiculo_esta_disponivel(self):
        self.assertTrue(self.veiculo.is_disponivel)

    def test_alocar_motorista_ao_veiculo(self):
        self.veiculo.alocar(self.motorista)
        self.assertEqual(self.veiculo.motorista_atual, self.motorista)

    def test_veiculo_se_torna_indisponivel_ao_alocar_motorista(self):
        self.veiculo.alocar(self.motorista)
        self.assertFalse(self.veiculo.is_disponivel)

    def test_veiculo_se_torna_disponivel_ao_desalocar_motorista(self):
        self.veiculo.alocar(self.motorista)
        self.veiculo.desalocar()
        self.assertTrue(self.veiculo.is_disponivel)

    def test_veiculo_nao_pode_ser_alocado_se_nao_estiver_disponivel(self):
        self.veiculo.alocar(self.motorista)
        with self.assertRaises(Exception):
            self.veiculo.alocar(MotoristaFactory())

    def test_veiculo_nao_pode_ser_desalocado_se_nao_estiver_alocado(self):
        with self.assertRaises(Exception):
            self.veiculo.desalocar()

    def test_veiculo_nao_pode_ser_alocado_se_nao_houver_motorista(self):
        with self.assertRaises(Exception):
            self.veiculo.alocar(None)

    def test_get_veiculo_existente(self):
        veiculo = Veiculo.get_veiculo(self.veiculo.id)
        self.assertEqual(veiculo, self.veiculo)

    def test_get_veiculo_nao_existente(self):
        with self.assertRaises(ValidationError):
            Veiculo.get_veiculo(999999999)
