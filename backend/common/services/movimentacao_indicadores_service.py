from django.db.models import Sum

from common import models
from rest_framework.exceptions import ValidationError


class MovimentacaoIndicadoresService:
    def __init__(
        self,
        lote: "models.Lote",
        operacao: str,
        quantidade: int,
        user: "models.User",
    ) -> None:
        self.lote = lote
        self.operacao = operacao
        self.quantidade = quantidade
        self.user = user
        self.operacaoes_validas = ["ENTRADA", "SAIDA"]
        self.validate_inputs()

    def calculate_saldo_indicador(self, indicador_id: int) -> int:
        return models.Lote.objects.filter(indicador=indicador_id).aggregate(
            Sum("saldo")
        )["saldo__sum"]

    def add_quantidade_on_lote(self) -> "models.MovimentacaoEstoque":
        self.lote.saldo += self.quantidade
        self.lote.save()

        saldo = self.calculate_saldo_indicador(self.lote.indicador.id)
        self.lote.indicador.saldo = saldo
        self.lote.indicador.save()

        return self.create_movimentacao()

    def remove_quantidade_on_lote(self) -> "models.MovimentacaoEstoque":
        saldo = self.lote.saldo - self.quantidade
        if saldo < 0:
            raise ValidationError(
                f"Não é possível remover {self.quantidade} pois o saldo é {self.lote.saldo}"
            )

        self.lote.saldo -= self.quantidade
        self.lote.save()

        saldo = self.calculate_saldo_indicador(self.lote.indicador.id)
        self.lote.indicador.saldo = saldo
        self.lote.indicador.save()

        return self.create_movimentacao()

    def create_movimentacao(self) -> "models.MovimentacaoEstoque":
        movimentacao = models.MovimentacaoEstoque(
            lote=self.lote,
            operacao=self.operacao,
            quantidade=self.quantidade,
            created_by=self.user,
        )
        movimentacao.save()
        return movimentacao

    def validate_inputs(self) -> None:
        if self.operacao not in self.operacaoes_validas:
            raise ValidationError("Operação Inválida")

        if self.quantidade <= 0:
            raise ValidationError(
                "Quantidade dever ser um número inteiro positivo maior que zero"
            )

    def main(self) -> "models.MovimentacaoEstoque":
        if self.operacao == "ENTRADA":
            movimentacao = self.add_quantidade_on_lote()
            return movimentacao

        movimentacao = self.remove_quantidade_on_lote()
        return movimentacao
