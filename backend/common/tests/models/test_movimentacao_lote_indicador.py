from django.test import TestCase

from common import models
from common.services.movimentacao_indicadores_service import (
    MovimentacaoIndicadoresService,
)
from common.tests.factories import LoteFactory, UserFactory
from rest_framework.validators import ValidationError


class TestMovimentacaoLoteIndicador(TestCase):
    def setUp(self):
        self.lote = LoteFactory()
        self.user = UserFactory()
        self.movimentacao_service = None

    def test_add_on_lote(self):
        """
        Valida o cenário de adição de saldo em um lote
        """
        data: dict = {
            "lote": self.lote,
            "operacao": "ENTRADA",
            "quantidade": 10,
        }
        self.movimentacao_service = MovimentacaoIndicadoresService(
            lote=data["lote"],
            operacao=data["operacao"],
            quantidade=data["quantidade"],
            user=self.user,
        )
        last_saldo: int = self.lote.saldo

        output: models.MovimentacaoEstoque = self.movimentacao_service.main()
        self.assertEqual(last_saldo + 10, output.lote.saldo)

    def test_remove_on_lote(self):
        """
        Valida o cenário de remoção de saldo em um lote
        """
        data: dict = {"lote": self.lote, "operacao": "SAIDA", "quantidade": 10}
        self.movimentacao_service = MovimentacaoIndicadoresService(
            lote=data["lote"],
            operacao=data["operacao"],
            quantidade=data["quantidade"],
            user=self.user,
        )
        last_saldo: int = self.lote.saldo

        output: models.MovimentacaoEstoque = self.movimentacao_service.main()
        self.assertEqual(last_saldo - 10, output.lote.saldo)

    def test_movimentacao_invalida(self):
        """
        Valida o cenário de tentativa de movimentação com uma operação inválida
        - OBS
            OPERAÇÕES VÁLIDAS: ENTRADA || SAÍDA
        """
        try:
            data: dict = {
                "lote": self.lote,
                "operacao": "invalida",
                "quantidade": 10,
            }
            self.movimentacao_service = MovimentacaoIndicadoresService(
                lote=data["lote"],
                operacao=data["operacao"],
                quantidade=data["quantidade"],
                user=self.user,
            )
            self.movimentacao_service.main()
        except ValidationError as e:
            self.assertEqual(str(e.detail[0]), "Operação Inválida")

    def test_movimentacao_quantidade_negativa(self):
        """
        Valida o cenário de tentativa de movimentação com uma quantidade menor
        ou igual a zero
        """
        try:
            data: dict = {
                "lote": self.lote,
                "operacao": "ENTRADA",
                "quantidade": -10,
            }
            self.movimentacao_service = MovimentacaoIndicadoresService(
                lote=data["lote"],
                operacao=data["operacao"],
                quantidade=data["quantidade"],
                user=self.user,
            )
            self.movimentacao_service.main()
        except ValidationError as e:
            self.assertEqual(
                str(e.detail[0]),
                "Quantidade dever ser um número inteiro positivo maior que zero",
            )
