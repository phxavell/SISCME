from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.test import TestCase

from common.models import Etiqueta
from common.tests.factories import EtiquetaFactory


class EtiquetaTestCase(TestCase):
    def setUp(self):
        self.etiqueta = EtiquetaFactory()

    def test_create(self):
        """Testa a criação de uma etiqueta."""
        self.assertIsNotNone(self.etiqueta)

    def test_create_required_fields(self):
        """Testa se os campos obrigatórios foram preenchidos."""
        self.assertIsNotNone(self.etiqueta.id)
        self.assertIsNotNone(self.etiqueta.autoclave)
        self.assertIsNotNone(self.etiqueta.ciclo)
        self.assertIsNotNone(self.etiqueta.datafabricacao)
        self.assertIsNotNone(self.etiqueta.datalancamento)
        self.assertIsNotNone(self.etiqueta.datavalidade)
        self.assertIsNotNone(self.etiqueta.horalancamento)
        self.assertIsNotNone(self.etiqueta.cautela)
        self.assertIsNotNone(self.etiqueta.termodesinfectora)
        self.assertIsNotNone(self.etiqueta.qtd)
        self.assertIsNotNone(self.etiqueta.qtdimpressao)
        self.assertIsNotNone(self.etiqueta.seladora)
        self.assertIsNotNone(self.etiqueta.servico)
        self.assertIsNotNone(self.etiqueta.tipoetiqueta)
        self.assertIsNotNone(self.etiqueta.idcli)
        self.assertIsNotNone(self.etiqueta.idproduto)
        self.assertIsNotNone(self.etiqueta.idprofissional)

    def test_error_create_without_required_fields(self):
        """Testa erro se os campos obrigatórios não foram preenchidos."""
        with self.assertRaises(IntegrityError):
            EtiquetaFactory(
                id=None,
                autoclave=None,
                ciclo=None,
                datafabricacao=None,
                datalancamento=None,
                datavalidade=None,
                horalancamento=None,
                cautela=None,
                termodesinfectora=None,
                qtd=None,
                qtdimpressao=None,
                seladora=None,
                servico=None,
                tipoetiqueta=None,
                idcli=None,
                idproduto=None,
                idprofissional=None,
            )

    def test_successs_create_without_optional_fields(self):
        """Testa a criacao com sucesso se os campos
        obrigatórios não foram preenchidos."""
        etiqueta = EtiquetaFactory(
            biologico=None,
            obs=None,
            peso=None,
            status=None,
            temperatura=None,
            totalenvelopado=None,
            idcomplemento=None,
        )
        self.assertIsNotNone(etiqueta)

    def test_association_foreignkey_cliente(self):
        """Testa se o campo idcli foi relacionado corretamente ao Cliente."""
        self.assertEqual(self.etiqueta.idcli.__class__.__name__, "Cliente")

    def test_association_foreignkey_produto(self):
        """Testa se o campo idcli foi relacionado corretamente ao Produto."""
        self.assertEqual(self.etiqueta.idproduto.__class__.__name__, "Produto")

    def test_association_foreignkey_profissional(self):
        """Testa se o campo idcli foi relacionado corretamente ao Profissional."""
        self.assertEqual(
            self.etiqueta.idprofissional.__class__.__name__, "Profissional"
        )

    def test_association_foreignkey_complemento(self):
        """Testa se o campo idcli foi relacionado corretamente ao Complemento."""
        self.assertEqual(
            self.etiqueta.idcomplemento.__class__.__name__, "Complemento"
        )

    def test_choice_seladora_value(self):
        """Testa escolha de valor de seladora dentre os definidos."""
        etiqueta_a = EtiquetaFactory()
        etiqueta_b = EtiquetaFactory()
        etiqueta_c = EtiquetaFactory()

        self.assertIsNotNone(etiqueta_a)
        self.assertIsNotNone(etiqueta_b)
        self.assertIsNotNone(etiqueta_c)

    def test_choice_tipoetiqueta_value(self):
        """Testa escolha de valor de tipoetiqueta dentre os definidos."""
        etiqueta_a = EtiquetaFactory(tipoetiqueta=Etiqueta.TipoEtiqueta.INSUMO)
        etiqueta_b = EtiquetaFactory(
            tipoetiqueta=Etiqueta.TipoEtiqueta.ROUPARIA
        )
        etiqueta_c = EtiquetaFactory(
            tipoetiqueta=Etiqueta.TipoEtiqueta.RESPIRATORIO
        )

        self.assertIsNotNone(etiqueta_a)
        self.assertIsNotNone(etiqueta_b)
        self.assertIsNotNone(etiqueta_c)

    def test_choice_servico_value(self):
        """Testa escolha de valor de servico dentre os definidos."""
        etiqueta_a = EtiquetaFactory(servico=Etiqueta.Servico.OPT_1)
        etiqueta_b = EtiquetaFactory(servico=Etiqueta.Servico.OPT_2)
        etiqueta_c = EtiquetaFactory(servico=Etiqueta.Servico.OPT_3)

        self.assertIsNotNone(etiqueta_a)
        self.assertIsNotNone(etiqueta_b)
        self.assertIsNotNone(etiqueta_c)

    def test_choice_termo_value(self):
        """Testa escolha de valor de termodesinfectora dentre os definidos."""
        etiqueta_a = EtiquetaFactory()
        etiqueta_b = EtiquetaFactory()
        etiqueta_c = EtiquetaFactory()
        self.assertIsNotNone(etiqueta_a)
        self.assertIsNotNone(etiqueta_b)
        self.assertIsNotNone(etiqueta_c)

    def test_delete(self):
        """Testa se é possível excluir."""
        etiqueta = EtiquetaFactory()
        etiqueta.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Etiqueta.objects.get(id=etiqueta.id)
