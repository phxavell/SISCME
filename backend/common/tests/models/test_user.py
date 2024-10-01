# pylint: disable=too-many-public-methods
from django.contrib.auth.models import Group
from django.test import TestCase

from common.tests.factories import (
    ClienteFactory,
    ProfissionalFactory,
    UserFactory,
    UsuarioFactory,
)
from rest_framework.exceptions import ValidationError
from users.models import User


class UserTestCase(TestCase):
    TEST_USERNAME = "testusername"
    TEST_NOME = "Teste Nome"

    TEST_2_USERNAME = "testusername2"
    TEST_2_NOME = "Teste Nome 2"

    def setUp(self):
        self.profissional = ProfissionalFactory(nome=self.TEST_NOME)

        self.cliente = ClienteFactory()

        self.user = UserFactory(
            idprofissional=self.profissional, username=self.TEST_USERNAME
        )

        self.usuario = UsuarioFactory(
            idprofissional=self.profissional, apelidousu=self.TEST_2_USERNAME
        )

    def test_get_full_name(self):
        self.assertEqual(self.user.get_full_name(), self.TEST_USERNAME)

    def test_get_short_name(self):
        self.assertEqual(self.user.get_short_name(), self.TEST_USERNAME)

    def test_nome_property(self):
        self.assertEqual(self.user.nome, self.TEST_NOME)

    def test_ativa_usuario_ja_ativo(self):
        self.user.is_active = True
        self.user.save()
        with self.assertRaises(ValidationError):
            self.user.activate()

    def test_ativar_user_com_cliente_inativo(self):
        self.user.idprofissional.cliente = self.cliente
        self.user.idprofissional.cliente.ativo = False
        self.user.idprofissional.cliente.save()
        cliente_group = Group.objects.get(name="CLIENTE")
        self.user.groups.add(cliente_group)
        self.user.deactivate()
        with self.assertRaises(ValidationError):
            self.user.activate()

    def test_ativar_user_sem_profissional(self):
        self.user.idprofissional = None
        self.user.save()
        self.user.deactivate()
        with self.assertRaises(ValidationError):
            self.user.activate()

    def test_desativa_usuario_ja_desativado(self):
        self.user.is_active = False
        self.user.save()
        result = self.user.deactivate()
        self.assertTrue(result)

    def test_is_administrador(self):
        admin_group = Group.objects.get(name="ADMINISTRADORES")
        self.user.groups.add(admin_group)
        self.assertTrue(self.user.is_administrador)

    def test_is_motorista(self):
        motorista_group = Group.objects.get(name="MOTORISTA")
        self.user.groups.add(motorista_group)
        self.assertTrue(self.user.is_motorista)

    def test_is_cliente(self):
        cliente_group = Group.objects.get(name="CLIENTE")
        self.user.groups.add(cliente_group)
        self.user.idprofissional.cliente = self.cliente
        self.assertTrue(self.user.is_cliente)

    def test_is_cliente_user_sem_profissional_vinculado(self):
        """Dado um usuário do tipo cliente, se o mesmo não possuir um profissional
        vinculado, deve ser lançada uma exceção."""
        self.user.groups.add(Group.objects.get(name="CLIENTE"))
        self.user.idprofissional = None
        self.user.save()

        with self.assertRaises(ValidationError) as context:
            self.user.is_cliente  # pylint: disable=pointless-statement

        self.assertEqual(
            str(context.exception.detail[0].capitalize()),
            "Usuário não possui um profissional vinculado.",
        )
        self.assertEqual(
            context.exception.detail[0].code, "usuario_sem_profissional"
        )

    def test_is_supervisor(self):
        supervisor_group = Group.objects.get(name="SUPERVISAOENFERMAGEM")
        self.user.groups.add(supervisor_group)
        self.assertTrue(self.user.is_supervisor())

    def test_is_lider_motorista(self):
        lider_motorista_group = Group.objects.get(name="LIDER_MOTORISTA")
        self.user.groups.add(lider_motorista_group)
        self.assertTrue(self.user.is_lider_motorista())

    def test_is_supervisor_logistica(self):
        supervisor_logistica_group = Group.objects.get(
            name="SUPERVISOR_LOGISTICA"
        )
        self.user.groups.add(supervisor_logistica_group)
        self.assertTrue(self.user.is_supervisor_logistica())

    def test_has_cliente_com_cliente(self):
        self.user.idprofissional.cliente = self.cliente
        self.user.idprofissional.cliente.save()
        self.assertTrue(self.user.has_cliente)

    def test_has_cliente_sem_profissional(self):
        self.user.idprofissional = None
        self.user.save()
        self.assertFalse(self.user.has_cliente)

    def test_has_cliente_sem_cliente(self):
        self.user.idprofissional.cliente = None
        self.user.idprofissional.save()
        self.assertFalse(self.user.has_cliente)

    def test_has_coren(self):
        enfermagem_group = Group.objects.get(name="ENFERMAGEM")
        self.user.groups.add(enfermagem_group)
        self.assertTrue(self.user.has_coren)

    def test_activate_metodo(self):
        user2 = UserFactory(is_active=False)
        user3 = UserFactory(is_active=False)
        User.activate_list([user2, user3])
        user2.refresh_from_db()
        user3.refresh_from_db()
        self.assertTrue(user2.is_active)
        self.assertTrue(user3.is_active)

    def test_deactivate_metodo(self):
        user2 = UserFactory(is_active=True)
        user3 = UserFactory(is_active=True)
        User.deactivate_list([user2, user3])
        user2.refresh_from_db()
        user3.refresh_from_db()
        self.assertFalse(user2.is_active)
        self.assertFalse(user3.is_active)

    def test_activate_user_com_usuario_legado(self):
        """Dado um usuário com usuário legado vinculado, se o mesmo for ativado,
        o usuário legado também deve ser ativado."""
        usuario = UsuarioFactory(
            ativo=False,
            idprofissional=self.profissional,
            apelidousu=self.user.username,
        )
        self.user.deactivate()
        self.user.activate()

        usuario.refresh_from_db()
        self.user.refresh_from_db()
        self.assertTrue(usuario.ativo)

    def tearDown(self):
        pass

    def test_str_representation(self):
        """Testa o método __str__ da classe User."""
        self.assertEqual(str(self.usuario), self.TEST_2_USERNAME)

    def test_activate_user(self):
        """Testa o método activate da classe User."""
        self.usuario.ativo = False
        self.usuario.save()
        self.usuario.activate()
        self.assertTrue(self.usuario.ativo)
