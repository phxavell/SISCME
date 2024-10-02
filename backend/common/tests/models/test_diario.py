import re

from django.db.utils import IntegrityError
from django.test import TestCase

from common.tests.factories import (
    ClienteFactory,
    DiarioFactory,
    SetorFactory,
    TipoOcorrenciaFactory,
    UserFactory,
)
from rest_framework.exceptions import ValidationError


class DiarioTestCase(TestCase):
    def setUp(self):
        self.diario = DiarioFactory()

    def test_create_diario(self):
        """Testa a criação de uma ocorrência."""

        self.assertIsNotNone(self.diario)
        self.assertIsNotNone(self.diario.status == "ABERTO")
        self.assertIsNotNone(self.diario.statusdiariodeocorrencia == "ABERTO")
        self.assertIsNotNone(self.diario.acao is None)

    def test_association_foreignkey_profissional_responsavel(self):
        """Testa os campos do profissional envolvido na ocorrência."""
        self.assertEqual(
            self.diario.profissional_responsavel.__class__.__name__, "User"
        )
        self.assertIsNotNone(
            self.diario.nome_profissional_responsavel
            == self.diario.profissional_responsavel.username
        )

    def test_association_foreignkey_usuario(self):
        """Testa se o usuário que está criando a
        ocorrência tem um perfil de Usuário."""
        self.assertEqual(self.diario.idusu.__class__.__name__, "Usuario")

    def test_association_foreignkey_setor(self):
        """Testa se o setor selecionado pertence à tabela de Setores."""
        self.assertEqual(self.diario.idsetor.__class__.__name__, "Setor")

    def test_association_foreignkey_cliente(self):
        """Testa se o cliente informado pertence à tabela de Clientes."""
        self.assertEqual(self.diario.idcli.__class__.__name__, "Cliente")

    def test_association_foreignkey_indicador(self):
        """Testa se o indicador informado pertence à tabela de Indicadores."""
        self.assertEqual(
            self.diario.idindicador.__class__.__name__, "TipoOcorrencia"
        )

    def test_format_date_status_aberto(self):
        """Testa o formato correto das datas na
        hora do cadastro da ocorrência."""
        self.assertTrue(
            re.match(r"\d{4}-\d{2}-\d{2}", str(self.diario.dataabertura))
        )
        self.assertTrue(
            re.match(r"\d{4}-\d{2}-\d{2}", str(self.diario.dataretroativa))
        )

    def test_format_hour_status_aberto(self):
        """Testa o formato correto das horas informadas
        na hora do cadastro da ocorrência."""
        self.assertTrue(
            re.match(r"\d{2}:\d{2}:\d{2}", str(self.diario.horaabertura))
        )
        self.assertTrue(
            re.match(r"\d{2}:\d{2}:\d{2}", str(self.diario.horaretroativa))
        )

    def test_type_of_ocorrencia(self):
        """Testa se o tipo de ocorrência é EXPEDIDA ou RECEBIDA."""
        self.assertTrue(
            self.diario.tipodediariodeocorrencia in ["EXPEDIDA", "RECEBIDA"]
        )

    def test_edit_ocorrencia_with_required_fields(self):
        """Testa a atualização dos campos da ocorrencia com status=ABERTO."""
        setor = SetorFactory()
        user = UserFactory()
        indicador = TipoOcorrenciaFactory()
        cliente = ClienteFactory()

        self.diario.descricao = "Outra descricao"
        self.diario.dataretroativa = "2010-10-10"
        self.diario.horaretroativa = "10:10:10"

        self.diario.idcli = cliente
        self.diario.profissional_responsavel = user
        self.diario.idindicador = indicador
        self.diario.idsetor = setor

        assert str(self.diario.descricao) == "Outra descricao"
        assert str(self.diario.dataretroativa) == "2010-10-10"
        assert str(self.diario.horaretroativa) == "10:10:10"

        self.assertEqual(self.diario.profissional_responsavel, user)
        self.assertEqual(self.diario.idcli, cliente)
        self.assertEqual(self.diario.idindicador, indicador)
        self.assertEqual(self.diario.idsetor, setor)

    def test_creation_ocorrencia_with_null_descricao_field(self):
        """Testa a criação de uma ocorrência com campo
        obrigatório 'descricao' nulo."""
        with self.assertRaises(IntegrityError):
            DiarioFactory(descricao=None)

    def test_creation_ocorrencia_with_null_nome_profissional_field(self):
        """Testa a criação de uma ocorrência com campo obrigatório
        'nome_profissional_responsavel' nulo."""
        with self.assertRaises(IntegrityError):
            DiarioFactory(nome_profissional_responsavel=None)

    def test_creation_ocorrencia_with_null_idsetor_field(self):
        """Testa a criação de uma ocorrência com campo
        obrigatório 'idsetor' nulo."""
        with self.assertRaises(IntegrityError):
            DiarioFactory(idsetor=None)

    def test_fechar_ocorrencia_correct(self):
        """Testa a possibilidade de fechar a ocorrência
        com os campos obrigatórios."""
        self.diario.acao = "Descricao da ação."
        self.diario.horafechamento = "20:20:20"
        self.diario.datafechamento = "2011-11-11"
        self.diario.status = "FECHADO"
        self.diario.statusdiariodeocorrencia = "FECHADO"

        self.assertEqual(self.diario.acao, "Descricao da ação.")
        self.assertEqual(self.diario.horafechamento, "20:20:20")
        self.assertEqual(self.diario.datafechamento, "2011-11-11")
        self.assertEqual(self.diario.status, "FECHADO")
        self.assertEqual(self.diario.statusdiariodeocorrencia, "FECHADO")

    def test_is_not_possible_to_edit_status_fechado(self):
        diario = DiarioFactory(status="FECHADO")
        with self.assertRaises(ValidationError):
            diario.descricao = "Tentando editar"
            diario.save()

    def test_str(self):
        """Testa se o método __str__ retorna o nome do cliente."""
        self.assertEqual(
            str(self.diario), self.diario.nome_profissional_responsavel
        )
