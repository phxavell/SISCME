import re

from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.test import TestCase

from common.enums import ProgramacaEquipamentoEnum
from common.models import Termodesinfeccao
from common.tests.factories import TermodesinfeccaoFactory


class TermodesinfeccaoTestCase(TestCase):
    def setUp(self):
        self.termo = TermodesinfeccaoFactory()

    def test_create_with_required_fields(self):
        """Testa a criação de um Termodesinfeccao com os campos obrigatórios."""
        self.assertIsNotNone(self.termo.id)
        self.assertIsNotNone(self.termo.datainicio)
        self.assertIsNotNone(self.termo.statusinicio)
        self.assertIsNotNone(self.termo.equipamento)
        self.assertIsNotNone(self.termo.idusu)

    def test_error_create_without_required_fields(self):
        """Testa erro se a criação do objeto Termodesinfeccao não tiver um dos
        campos obrigatórios."""
        with self.assertRaises(IntegrityError):
            TermodesinfeccaoFactory(
                datainicio=None,
                statusinicio=None,
                equipamento=None,
                idusu=None,
            )

    def test_creat_without_optional_fields(self):
        """Testa a criação de um Recebimento sem os campos opcionais."""
        termo = TermodesinfeccaoFactory(
            ciclo=None,
            datafim=None,
            statusfim=None,
            programacao=None,
            statusabortado=None,
            dataabortado=None,
        )
        self.assertIsNotNone(termo)

    def test_association_foreingkey(self):
        """Testa se o campo idorigem foi relacionado corretamente aos
        models Equipamento e Usuario."""
        self.assertEqual(
            self.termo.equipamento.__class__.__name__, "Equipamento"
        )
        self.assertEqual(self.termo.idusu.__class__.__name__, "Usuario")

    def test_format_dates(self):
        """Testa o formato correto das datas no model."""
        self.assertTrue(
            re.match(r"\d{4}-\d{2}-\d{2}", str(self.termo.datafim))
        )
        self.assertTrue(
            re.match(r"\d{4}-\d{2}-\d{2}", str(self.termo.datainicio))
        )

    def test_programacao_choices(self):
        """Testa se o campo 'tipo' contém um valor válido de ProgramacaEquipamentoEnum."""
        tipo_enum_values = [
            choice[0] for choice in ProgramacaEquipamentoEnum.choices
        ]
        self.assertIn(self.termo.programacao, tipo_enum_values)

    def test_metodo_data_fim(self):
        """Testa o método que retorna data de fim de
        termodesinfeccao (datafim ou dataabortado)."""
        self.assertEqual(self.termo.data_fim, self.termo.datafim)
        self.termo.datafim = None
        self.assertEqual(self.termo.data_fim, self.termo.dataabortado)

    def test_metodo_situacao_atual(self):
        """Testa os três possível retornos para o método situacao_atual."""
        self.assertEqual(self.termo.situacao_atual, self.termo.statusinicio)
        self.termo.statusfim = Termodesinfeccao.Status.FINALIZADO
        self.assertEqual(self.termo.situacao_atual, self.termo.statusfim)
        self.termo.statusfim = None
        self.termo.statusabortado = Termodesinfeccao.Status.ABORTADO
        self.assertEqual(self.termo.situacao_atual, self.termo.statusabortado)

    def test_delete(self):
        """Testa se é possível excluir."""
        termo = TermodesinfeccaoFactory()
        termo.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Termodesinfeccao.objects.get(id=termo.id)

    def test_class_meta(self):
        """Verificar se o nome da tabela do banco de dados
        está configurado corretamente."""
        self.assertEqual(Termodesinfeccao._meta.db_table, "termodesinfeccao")
        self.assertEqual(
            Termodesinfeccao._meta.verbose_name, "Termodesinfecção"
        )
        self.assertEqual(
            Termodesinfeccao._meta.verbose_name_plural, "Termodesinfecções"
        )
        self.assertEqual(Termodesinfeccao._meta.managed, True)


class TermodesinfeccaoManagerTestCase(TestCase):
    def setUp(self):
        self.termo = TermodesinfeccaoFactory()

    def test_ciclos_em_andamento(self):
        """Testa se existe uma instancia de Termodesinfeccao em andamento"""
        self.termo.statusfim = None
        self.termo.statusabortado = None
        self.termo.save()
        self.assertEqual(
            Termodesinfeccao.objects.ciclos_em_andamento().count(), 1
        )

    def test_todos_ciclos(self):
        """Testa se existe uma instancia de Termodesinfeccao"""
        self.assertEqual(Termodesinfeccao.objects.todos_ciclos().count(), 1)

    def test_ciclos_finalizados(self):
        self.termo.statusfim = Termodesinfeccao.Status.FINALIZADO
        self.termo.save()
        self.assertEqual(
            Termodesinfeccao.objects.ciclos_finalizados().count(), 1
        )
