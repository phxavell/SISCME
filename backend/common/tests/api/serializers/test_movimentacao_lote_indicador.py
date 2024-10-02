from django.test import TestCase

from common.models import MovimentacaoEstoque
from common.serializers import MovimentacaoLoteSerializer
from common.tests.factories import LoteFactory
from rest_framework.validators import ValidationError


class TestMovimentacaoLoteSerializer(TestCase):
    def setUp(self) -> None:
        self.lote = LoteFactory()

    def test_validate_payload_valido(self) -> None:
        data: dict = {
            "lote": self.lote.id,
            "operacao": "ENTRADA",
            "quantidade": 10,
        }

        serializer = MovimentacaoLoteSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_create_instance(self) -> None:
        data: dict = {
            "lote": self.lote.id,
            "operacao": "ENTRADA",
            "quantidade": 10,
        }

        serializer = MovimentacaoLoteSerializer(data=data)
        self.assertTrue(serializer.is_valid())

        instance: MovimentacaoEstoque = serializer.save()
        self.assertIsInstance(instance, MovimentacaoEstoque)

    def test_create_movimentacao_com_operacao_invalida(self) -> None:
        try:
            data: dict = {
                "lote": self.lote.id,
                "operacao": "asdasdasd",
                "quantidade": 10,
            }

            serializer = MovimentacaoLoteSerializer(data=data)
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            self.assertEqual(
                f'"{data["operacao"]}" não é um escolha válido.',
                str(e.detail["operacao"][0]),
            )

    def test_create_movimentacao_com_quantidade_negativa(self) -> None:
        try:
            data: dict = {
                "lote": self.lote.id,
                "operacao": "ENTRADA",
                "quantidade": -10,
            }

            serializer = MovimentacaoLoteSerializer(data=data)
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            self.assertEqual(
                "Quantidade deve ser um número inteiro positivo",
                str(e.detail["quantidade"][0]),
            )
