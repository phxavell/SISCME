from django.test import TestCase

from common import helpers
from common.models import Autoclavagem
from common.tests.factories import AutoclavagemFactory, AutoclavagemItemFactory


class AutoclavagemTestCase(TestCase):
    def test_autoclavagem_creation(self):
        """Testa a criação de uma autoclavagem."""
        autoclavagem = AutoclavagemFactory.create()
        self.assertIsNotNone(autoclavagem.id)

    def test_autoclavagem_item_creation(self):
        """Testa a criação de um item de autoclavagem."""
        item = AutoclavagemItemFactory.create()
        self.assertIsNotNone(item.id)
        self.assertIsNotNone(item.autoclavagem)

    def test_autoclavagem_with_items(self):
        """Testa a criação de uma autoclavagem com itens."""
        autoclavagem = AutoclavagemFactory.create()
        AutoclavagemItemFactory.create_batch(5, autoclavagem=autoclavagem)
        self.assertEqual(autoclavagem.itens.count(), 5)

    def test_situacao_atual_all_scenarios(self):
        """Testa a propriedade situacao_atual do modelo Autoclavagem
        em todos os seus cenários (inicio, fim e aborto)."""
        autoclavagem_iniciada = AutoclavagemFactory.create(
            statusinicio=Autoclavagem.Status.INICIADO
        )
        self.assertEqual(
            autoclavagem_iniciada.situacao_atual, Autoclavagem.Status.INICIADO
        )

        autoclavagem_finalizado = AutoclavagemFactory.create(
            statusfim=Autoclavagem.Status.FINALIZADO
        )
        self.assertEqual(
            autoclavagem_finalizado.situacao_atual,
            Autoclavagem.Status.FINALIZADO,
        )

        autoclavagem_abortada = AutoclavagemFactory.create(
            statusabortado=Autoclavagem.Status.ABORTADO
        )
        self.assertEqual(
            autoclavagem_abortada.situacao_atual, Autoclavagem.Status.ABORTADO
        )

    def test_data_fim_property(self):
        """Testa a propriedade data_fim do modelo Autoclavagem."""
        autoclavagem = AutoclavagemFactory.create(
            datafim=helpers.datahora_local_atual()
        )
        self.assertIsNotNone(autoclavagem.data_fim)


class AutoClavagemManagerTestCase(TestCase):
    def setUp(self):
        self.autoclavagem = AutoclavagemFactory()
        self.itemauto = AutoclavagemItemFactory()

    def test_ciclos_em_andamento(self):
        self.autoclavagem.statusinicio = Autoclavagem.Status.INICIADO
        self.autoclavagem.save()

        self.assertEqual(Autoclavagem.objects.ciclos_em_andamento().count(), 2)

    def test_todos_ciclos(self):
        self.assertEqual(Autoclavagem.objects.todos_ciclos().count(), 2)

    def test_ciclos_finalizados(self):
        self.autoclavagem.statusfim = Autoclavagem.Status.FINALIZADO
        self.autoclavagem.save()

        self.assertEqual(Autoclavagem.objects.ciclos_finalizados().count(), 1)
