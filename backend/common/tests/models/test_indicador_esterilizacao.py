from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from common.tests.factories import IndicadoresEsterilizacaoFactory


class IndicadorTestCase(TestCase):
    def test_criar_produto(self):
        indicador = IndicadoresEsterilizacaoFactory()

        atributos = [
            "id",
            "descricao",
            "dtcadastro",
            "embalagem",
            "situacao",
            "status",
            "idsubtipoproduto",
            "idtipopacote",
            "tipo",
            "saldo",
            "fabricante",
        ]

        for atributo in atributos:
            with self.subTest(atributo=atributo):
                self.assertIsNotNone(getattr(indicador, atributo))

    def test_upload_de_foto(self):
        image = SimpleUploadedFile(
            "test_image.jpg", b"file_content", content_type="image/jpeg"
        )
        indicador = IndicadoresEsterilizacaoFactory(foto=image)
        self.assertIsNotNone(indicador.foto)

    def test_descricao_unica(self):
        indicador = IndicadoresEsterilizacaoFactory()
        with self.assertRaises(Exception):
            IndicadoresEsterilizacaoFactory(descricao=indicador.descricao)

    def test_dtcadastro_nulo(self):
        with self.assertRaises(Exception):
            IndicadoresEsterilizacaoFactory(dtcadastro=None)

    def test_embalagem_max_length(self):
        embalagem_max_length = 15
        embalagem_excedente = "a" * (embalagem_max_length + 1)
        with self.assertRaises(Exception):
            IndicadoresEsterilizacaoFactory(embalagem=embalagem_excedente)

    def test_is_indicador(self):
        indicador = IndicadoresEsterilizacaoFactory()
        self.assertTrue(indicador.is_indicador)
