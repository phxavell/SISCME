from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from common.tests.factories import (
    ProdutoFactory,
    SubtipoprodutoFactory,
    TipopacoteFactory,
)


class ProdutoTestCase(TestCase):
    def test_criar_produto(self):
        produto = ProdutoFactory()

        atributos = [
            "id",
            "descricao",
            "dtcadastro",
            "embalagem",
            "situacao",
            "status",
            "idsubtipoproduto",
            "idtipopacote",
        ]

        for atributo in atributos:
            with self.subTest(atributo=atributo):
                self.assertIsNotNone(getattr(produto, atributo))

    def test_upload_de_foto(self):
        image = SimpleUploadedFile(
            "test_image.jpg", b"file_content", content_type="image/jpeg"
        )
        produto = ProdutoFactory(foto=image)
        self.assertIsNotNone(produto.foto)

    def test_descricao_unica(self):
        produto = ProdutoFactory()
        with self.assertRaises(Exception):
            ProdutoFactory(descricao=produto.descricao)

    def test_dtcadastro_nulo(self):
        with self.assertRaises(Exception):
            ProdutoFactory(dtcadastro=None)

    def test_embalagem_max_length(self):
        embalagem_max_length = 15
        embalagem_excedente = "a" * (embalagem_max_length + 1)
        with self.assertRaises(Exception):
            ProdutoFactory(embalagem=embalagem_excedente)

    def test_idsubtipoproduto_relacionamento(self):
        produto = ProdutoFactory()
        subtipoproduto = SubtipoprodutoFactory(descricao="ESTERILIZADO")
        produto.idsubtipoproduto = subtipoproduto
        self.assertEqual(
            produto.idsubtipoproduto,
            subtipoproduto,
            "A atribuição do subtipoproduto falhou.",
        )

    def test_validar_idtipopacote_relacionamento(self):
        produto = ProdutoFactory()
        tipopacote = TipopacoteFactory(descricao="INSUMO")
        produto.idtipopacote = tipopacote
        self.assertEqual(
            produto.idtipopacote,
            tipopacote,
            "A atribuição do tipopacote falhou.",
        )
