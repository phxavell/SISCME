from django.test import TestCase

from common.tests.factories import ProfissionalFactory


class ProfissionalTestCase(TestCase):
    def setUp(self):
        self.profissional = ProfissionalFactory()
        self.profissional_2 = ProfissionalFactory()
        self.profissional.idprofissao.descricao = None

    def test_create_profissional(self):
        """Testa a criação de um profissional."""
        self.assertIsNotNone(self.profissional)

    def test_create_required_fields(self):
        """Testa se os campos obrigatórios foram preenchidos."""
        self.assertIsNotNone(self.profissional.atrelado)
        self.assertIsNotNone(self.profissional.cpf)
        self.assertIsNotNone(self.profissional.dtadmissao)
        self.assertIsNotNone(self.profissional.dtcadastro)
        self.assertIsNotNone(self.profissional.nome)
        self.assertIsNotNone(self.profissional.rt)
        self.assertIsNotNone(self.profissional.sexo)
        self.assertIsNotNone(self.profissional.status)
        self.assertIsNotNone(self.profissional.idprofissao)

    def test_create_optional_fields(self):
        """Testa se os campos opcionais foram preenchidos."""
        self.assertIsNotNone(self.profissional.contato)
        self.assertIsNotNone(self.profissional.coren)
        self.assertIsNotNone(self.profissional.email)
        self.assertIsNotNone(self.profissional.matricula)
        self.assertIsNotNone(self.profissional.cliente)

    def test_association_foreignkey_cliente(self):
        """Testa se o campo cliente foi relacionado corretamente ao profissional."""
        self.assertEqual(
            self.profissional.cliente.__class__.__name__, "Cliente"
        )

    def test_str_method(self):
        """Testa o método __str__ da classe Profissional."""
        self.assertEqual(str(self.profissional), self.profissional.nome)

    def test_is_motorista(self):
        """Testa se o profissional é motorista."""
        self.assertFalse(self.profissional.is_motorista(), "motorista")

    def test_is_motorista_idprofissao_none(self):
        """Testa se o profissional é motorista."""
        self.assertFalse(self.profissional_2.is_motorista(), "motorista")
