import re

from django.core.exceptions import ObjectDoesNotExist
from django.test import TestCase

from common.models import Recebimento
from common.tests.factories import RecebimentoFactory


class RecebimentoTestCase(TestCase):
    def setUp(self):
        self.recebimento = RecebimentoFactory()

    def test_create_with_required_fields(self):
        """Testa a criação de um Recebimento com os campos obrigatórios."""
        self.assertIsNotNone(self.recebimento.idrecebimento)
        self.assertIsNotNone(self.recebimento.statusrecebimento)
        self.assertIsNotNone(self.recebimento.idusu)

    def test_creat_without_optional_fields(self):
        """Testa a criação de um Recebimento sem os campos opcionais."""
        recebimento = RecebimentoFactory(
            datacancelamento=None,
            observacao=None,
            idorigem=None,
            solicitacao_esterilizacao_id=None,
        )
        self.assertIsNotNone(recebimento)

    def test_association_foreignkey_idorigem(self):
        """Testa se o campo idorigem foi relacionado corretamente ao
        model Origem."""
        self.assertEqual(
            self.recebimento.idorigem.__class__.__name__, "Origem"
        )

    def test_association_foreignkey_idusu(self):
        """Testa se o campo idusu foi relacionado corretamente ao
        model Usuario."""
        self.assertEqual(self.recebimento.idusu.__class__.__name__, "Usuario")

    def test_association_foreignkey_solicitacao_esterilizacao_id(self):
        """Testa se o campo solicitacao_esterilizacao_id foi relacionado corretamente ao
        model SolicitacaoEsterilizacaoModel."""
        self.assertEqual(
            self.recebimento.solicitacao_esterilizacao_id.__class__.__name__,
            "SolicitacaoEsterilizacaoModel",
        )

    def test_format_dates(self):
        """Testa o formato correto das datas no model."""
        self.assertTrue(
            re.match(
                r"\d{4}-\d{2}-\d{2}", str(self.recebimento.datarecebimento)
            )
        )
        self.assertTrue(
            re.match(
                r"\d{4}-\d{2}-\d{2}", str(self.recebimento.datacancelamento)
            )
        )

    def test_delete(self):
        """Testa se é possível excluir."""
        recebimento = RecebimentoFactory()
        recebimento.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Recebimento.objects.get(idrecebimento=recebimento.idrecebimento)

    def test_class_meta(self):
        """Verificar se o nome da tabela do banco de dados
        está configurado corretamente."""
        self.assertEqual(Recebimento._meta.db_table, "recebimento")
        self.assertEqual(Recebimento._meta.verbose_name, "Recebimento")
        self.assertEqual(Recebimento._meta.verbose_name_plural, "Recebimentos")
        self.assertEqual(Recebimento._meta.managed, True)
