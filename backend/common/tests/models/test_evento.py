from django.db.utils import IntegrityError
from django.test import TestCase

from common.enums import SerialSituacaoEnum
from common.models import Evento
from common.tests.factories import (
    AutoclavagemFactory,
    EventoFactory,
    ProducaoFactory,
    SequenciaetiquetaFactory,
    UserFactory,
)


class EventoTestCase(TestCase):
    def setUp(self):
        self.evento = EventoFactory()

    def test_ultimo_registro(self):
        """Testa se o ultimo evento foi registrado."""
        self.assertEqual(self.evento.created_at, self.evento.ultimo_registro)

    def test_create(self):
        """Testa a criação de um evento."""
        self.assertIsNotNone(self.evento)

    def test_create_required_fields(self):
        """Testa se os campos obrigatórios foram preenchidos."""
        self.assertIsNotNone(self.evento.dataevento)
        self.assertIsNotNone(self.evento.descricaocaixa)
        self.assertIsNotNone(self.evento.horaevento)
        self.assertIsNotNone(self.evento.idsequenciaetiqueta)
        self.assertIsNotNone(self.evento.nomecliente)
        self.assertIsNotNone(self.evento.status)

    def test_error_create_without_required_fields(self):
        """Testa erro se os campos obrigatórios não foram preenchidos."""
        with self.assertRaises(IntegrityError):
            EventoFactory(
                dataevento=None,
                descricaocaixa=None,
                horaevento=None,
                idsequenciaetiqueta=None,
                nomecliente=None,
                status=None,
            )

    def test_update(self):
        """Testa a atualização de um evento."""
        self.evento.evento = "Evento 2"
        self.evento.save()
        self.assertEqual(self.evento.evento, "Evento 2")

    def test_delete(self):
        """Testa a exclusão de um evento."""
        self.evento.delete()
        self.assertIsNone(self.evento.pk)


class EventoManagerTestCase(TestCase):
    def setUp(self):
        self.evento = EventoFactory()
        self.autoclavagem = AutoclavagemFactory()
        self.sequeciaetiqueta = SequenciaetiquetaFactory()
        self.user = UserFactory()
        self.producao = ProducaoFactory()

    def test_com_status_recebido(self):
        """Testa se o evento foi recebido ."""
        self.evento.status = "RECEBIDO"
        self.evento.save()
        self.assertEqual(Evento.objects.com_status_recebido().count(), 1)

    def test_com_status_termo_fim(self):
        """Testa se o evento foi recebido ou abortado."""
        self.evento.status = "TERMO_FIM"
        self.evento.save()
        self.assertEqual(Evento.objects.com_status_termo_fim().count(), 1)

    def test_com_status_embalado(self):
        """Testa se o evento foi recebido ou abortado."""
        self.evento.status = "EMBALADO"
        self.evento.save()
        self.assertEqual(Evento.objects.com_status_embalado().count(), 1)

    def test_com_status_embalado_ou_abortado(self):
        """Testa se o evento foi recebido ou abortado."""
        self.evento.status = "EMBALADO"
        self.evento.save()
        self.assertEqual(
            Evento.objects.com_status_embalado_ou_abortado().count(), 1
        )

        self.evento.status = "ABORTADO"
        self.evento.idautoclavagem = self.autoclavagem
        self.evento.save()
        self.assertEqual(
            Evento.objects.com_status_embalado_ou_abortado().count(), 1
        )

    def test_com_status_esterilizacao_inicio_fim(self):
        self.evento.status = SerialSituacaoEnum.ESTERILIZACAO_INICIO
        self.evento.save()
        self.assertEqual(
            Evento.objects.com_status_esterilizacao_inicio_fim().count(), 1
        )

        self.evento.status = SerialSituacaoEnum.ESTERILIZACAO_FIM
        self.evento.save()
        self.assertEqual(
            Evento.objects.com_status_esterilizacao_inicio_fim().count(), 1
        )

    def test_com_status_distribuido(self):
        self.evento.status = "DISTRIBUIDO"
        self.evento.save()
        self.assertEqual(Evento.objects.com_status_distribuido().count(), 0)

    def test_ultimo_evento(self):
        self.evento.idsequenciaetiqueta = "123456"
        self.evento.save()
        self.assertEqual(
            Evento.objects.ultimo_evento(self.evento.idsequenciaetiqueta),
            self.evento,
        )

    def test_registra_evento(self):
        self.evento = Evento.objects.registra_evento()

        self.assertEqual(self.evento.__class__, Evento)

    def test_registra_preparo(self):
        self.evento = Evento.objects.registra_preparo(
            self.sequeciaetiqueta, self.user, self.producao
        )

        self.assertEqual(self.evento.__class__, Evento)

    def test_registra_esterilizacao(self):
        self.evento = Evento.objects.registra_esterilizacao(
            self.sequeciaetiqueta,
            self.user,
            self.autoclavagem,
            "ESTERILIZACAO_INICIO",
        )

        self.assertEqual(self.evento.__class__, Evento)

    def test_registra_esterilizacao_inicio(self):
        self.evento = Evento.objects.registra_esterilizacao_inicio(
            self.sequeciaetiqueta, self.user, self.autoclavagem
        )

        self.assertEqual(self.evento.__class__, Evento)

    def test_registra_esterilizacao_fim(self):
        self.evento = Evento.objects.registra_esterilizacao_fim(
            self.sequeciaetiqueta, self.user, self.autoclavagem
        )

        self.assertEqual(self.evento.__class__, Evento)

    def test_registra_processo_abortado(self):
        self.evento = Evento.objects.registra_processo_abortado(
            self.sequeciaetiqueta, self.user, self.autoclavagem
        )

        self.assertEqual(self.evento.idautoclavagem, self.autoclavagem)

        self.evento = Evento.objects.registra_processo_abortado(
            self.sequeciaetiqueta, self.user, None
        )

        self.assertEqual(self.evento, None)
