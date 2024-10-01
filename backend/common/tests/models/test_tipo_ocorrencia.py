from datetime import datetime

from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.test import TestCase

from common.tests.factories import TipoOcorrenciaFactory


class TipoOcorrenciaTestCase(TestCase):
    def setUp(self):
        self.tipo_ocorrencia = TipoOcorrenciaFactory()

    def test_create_tipo_ocorrencia(self):
        """Testa a criação de um tipo de ocorrência."""

        self.assertIsNotNone(self.tipo_ocorrencia)
        self.assertIsNotNone(self.tipo_ocorrencia.descricao)

    def test_create_status_igual_descricao(self):
        """Testa se o status é igual à descrição ao criar um tipo de ocorrência."""
        self.assertEqual(
            self.tipo_ocorrencia.status, self.tipo_ocorrencia.descricao
        )

    def test_create_descricao_vazio(self):
        """Testa se ao criar um tipo de ocorrência com descrição vazio, retornar erro."""
        with self.assertRaises(IntegrityError):
            TipoOcorrenciaFactory(descricao=None)

    def test_association_foreignkey_usuario(self):
        """Testa se o usuário que está criando a
        ocorrência tem um perfil de Usuário."""
        self.assertEqual(
            self.tipo_ocorrencia.idusu.__class__.__name__, "Usuario"
        )

    def test_str_representation(self):
        """Testa representação em str da instancia."""
        self.assertEqual(
            str(self.tipo_ocorrencia), self.tipo_ocorrencia.descricao
        )

    def test_quantidade_caracteres_descricao(self):
        """Testa se a quantidade de caracteres da descrição é maior que 90."""
        with self.assertRaises(Exception):
            TipoOcorrenciaFactory(descricao="a" * 91)

    def test_save_method_sets_status_as_description(self):
        """Testa se o método save define o status igual à descrição."""
        tipo_ocorrencia = TipoOcorrenciaFactory(descricao="Teste", status=None)
        self.assertEqual(tipo_ocorrencia.status, tipo_ocorrencia.descricao)

    def test_datalancamento_field_behavior(self):
        """Testa o comportamento do campo datalancamento."""
        tipo_ocorrencia = TipoOcorrenciaFactory(datalancamento=datetime.now())
        tipo_ocorrencia.full_clean()
        with self.assertRaises(Exception):
            tipo_ocorrencia.datalancamento = "Data sem formato válido"
            tipo_ocorrencia.full_clean()

    def test_idusu_field_behavior(self):
        """Testa o comportamento do campo idusu."""
        tipo_ocorrencia = TipoOcorrenciaFactory()
        with self.assertRaises(ValueError):
            tipo_ocorrencia.idusu = "Não é um pk válido"
            tipo_ocorrencia.full_clean()

    def tes_delete_method(self):
        """Testa o método delete."""
        tipo_ocorrencia = TipoOcorrenciaFactory()
        tipo_ocorrencia.delete()
        with self.assertRaises(ObjectDoesNotExist):
            tipo_ocorrencia.get(id=tipo_ocorrencia.id)
