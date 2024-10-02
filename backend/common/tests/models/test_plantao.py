import re
from datetime import time

from django.test import TestCase

from common.tests.factories import PlantaoFactory, PlantaoFechadoFactory
from rest_framework.exceptions import ValidationError


class PlantaoTestCase(TestCase):
    def test_create_plantao(self):
        """Testa a criação de uma plantao."""
        plantao = PlantaoFactory()
        self.assertIsNotNone(plantao)

    def test_datacadastro_format(self):
        """Testa o formato correto da data de criação do plantao."""
        plantao = PlantaoFactory()
        self.assertTrue(
            re.match(r"\d{4}-\d{2}-\d{2}", str(plantao.datacadastro))
        )

    def test_associated_profissional(self):
        """Testa a associação do plantão a um profissional."""
        plantao = PlantaoFactory()
        self.assertIsNotNone(plantao.idprofissional)
        self.assertEqual(
            plantao.idprofissional.__class__.__name__, "Profissional"
        )

    def test_status_aberto(self):
        """Testa o status do plantao == ABERTO."""
        plantao = PlantaoFactory()
        self.assertIn(plantao.status, "ABERTO")

    def test_status_fechado(self):
        """Testa os campos do plantão quando o status é == FECHADO."""
        plantao = PlantaoFechadoFactory()

        self.assertIn(plantao.status, "FECHADO")
        self.assertTrue(
            re.match(r"\d{4}-\d{2}-\d{2}", str(plantao.datafechamento))
        )
        self.assertTrue(
            re.match(r"\d{2}:\d{2}:\d{2}", str(plantao.horafechamento))
        )

    def test_fechar_com_status_fechado(self):
        """Testa a possibilidade de fechar o plantão quando o status é FECHADO."""
        plantao = PlantaoFechadoFactory()
        with self.assertRaises(ValidationError):
            plantao.status = "FECHADO"
            plantao.save()

    def test_turno_property(self):
        """Testa a propriedade turno do plantão."""
        plantao = PlantaoFactory(horacadastro=time(7, 0, 0))
        self.assertEqual(plantao.turno, "DIURNO")

        plantao_noturno = PlantaoFactory(horacadastro=time(19, 0, 0))
        self.assertEqual(plantao_noturno.turno, "NOTURNO")
