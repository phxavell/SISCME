from django.test import TestCase

from common import helpers
from common.models import RecebimentoEnum, SerialSituacaoEnum
from common.tests.factories import (
    CaixaFactory,
    RecebimentoFactory,
    SequenciaetiquetaFactory,
    SolicitacaoEsterilizacaoItemFactory,
)
from dateutil.relativedelta import relativedelta


class SequenciaetiquetaTestCase(TestCase):
    def setUp(self):
        self.meses_a_adicionar = 3
        self.caixa = CaixaFactory(validade=self.meses_a_adicionar)
        self.sequenciaetiqueta = SequenciaetiquetaFactory(idcaixa=self.caixa)
        self.sequenciaetiqueta_sem_solicitacao = SequenciaetiquetaFactory(
            idcaixa=self.caixa
        )
        self.recebimento = RecebimentoFactory()
        self.solicitacao_item = SolicitacaoEsterilizacaoItemFactory(
            caixa=self.sequenciaetiqueta
        )

    def test_str_representation(self):
        """Testa representação em string do modelo Sequenciaetiqueta"""
        self.assertEqual(
            str(self.sequenciaetiqueta),
            self.sequenciaetiqueta.idsequenciaetiqueta.upper(),
        )

    def test_current_solicitacao_esterilizacao(self):
        """Testa se a sequenciaetiqueta está vinculada a uma solicitacao_esterilizacao"""
        self.assertEqual(
            self.sequenciaetiqueta.current_solicitacao_esterilizacao,
            self.solicitacao_item.solicitacao_esterilizacao,
        )

    def test_cliente(self):
        """Testa se o cliente da sequenciaetiqueta é o mesmo da caixa que a originou"""
        self.assertEqual(self.sequenciaetiqueta.cliente, self.caixa.cliente)

    def test_situacao_cenarios(self):
        """Testa se a situação da sequenciaetiqueta em ambas as situações é a esperada"""
        self.assertEqual(self.sequenciaetiqueta.situacao, "Em uso")
        self.assertEqual(
            self.sequenciaetiqueta_sem_solicitacao.situacao, "Livre"
        )

        self.solicitacao_item.solicitacao_esterilizacao.finalizar_entrega()

        self.assertEqual(self.sequenciaetiqueta.situacao, "Livre")

    def test_validade_calculada(self):
        """Testa se a validade calculada é a esperada"""
        expected_validade = helpers.data_local_atual() + relativedelta(
            months=+self.meses_a_adicionar
        )

        self.assertEqual(
            self.sequenciaetiqueta.validade_calculada, expected_validade
        )

    def test_ultimo_recebimento(self):
        """Testa se o ultimo recebimento é o esperado"""

        self.assertFalse(self.sequenciaetiqueta.ultimo_recebimento)

        self.sequenciaetiqueta.recebimento.add(self.recebimento)

        self.assertEqual(
            self.sequenciaetiqueta.ultimo_recebimento, self.recebimento
        )

    def test_recebimento_pendente(self):
        """Testa se o recebimento pendente é o esperado"""
        self.recebimento.statusrecebimento = (
            RecebimentoEnum.AGUARDANDO_CONFERENCIA.value
        )
        self.recebimento.save()
        self.sequenciaetiqueta.recebimento.add(self.recebimento)
        self.assertEqual(
            self.sequenciaetiqueta.recebimento_pendente, self.recebimento
        )

    def test_alterar_situacao(self):
        """Testa se a alteração de situação está funcionando corretamente"""
        self.assertTrue(
            self.sequenciaetiqueta.alterar_situacao(
                SerialSituacaoEnum.RECEBIDO
            )
        )
        self.assertEqual(
            self.sequenciaetiqueta.ultima_situacao, SerialSituacaoEnum.RECEBIDO
        )

        self.assertFalse(self.sequenciaetiqueta.alterar_situacao(-1))

    def test_estados_do_serial(self):
        """Testa se todos os estados do serial estão funcionando corretamente"""
        self.sequenciaetiqueta.alterar_situacao_para_recebido()
        self.assertTrue(self.sequenciaetiqueta.esta_recebido)

        self.sequenciaetiqueta.alterar_situacao_para_preparado()
        self.assertTrue(self.sequenciaetiqueta.esta_preparado)

        self.sequenciaetiqueta.alterar_situacao_para_em_esterilizacao()
        self.assertTrue(self.sequenciaetiqueta.esta_em_esterilizacao)

        self.sequenciaetiqueta.alterar_situacao_para_esterilizado()
        self.assertTrue(self.sequenciaetiqueta.esta_esterilizado)

        self.sequenciaetiqueta.alterar_situacao_para_em_termodesinfeccao()
        self.assertTrue(self.sequenciaetiqueta.esta_em_termodesinfeccao)

        self.sequenciaetiqueta.alterar_situacao_para_termodesinfectado()
        self.assertTrue(self.sequenciaetiqueta.esta_termodesinfectado)

        self.sequenciaetiqueta.alterar_situacao_para_abortado_termodesinfeccao()
        self.assertTrue(self.sequenciaetiqueta.esta_abortado)

        self.sequenciaetiqueta.alterar_situacao_para_abortado_esterilizacao()
        self.assertTrue(self.sequenciaetiqueta.esta_abortado)

        self.sequenciaetiqueta.alterar_situacao_para_em_estoque()
        self.assertTrue(self.sequenciaetiqueta.esta_em_estoque)

        self.sequenciaetiqueta.alterar_situacao_para_distribuido()
        self.assertTrue(self.sequenciaetiqueta.esta_distribuido)
