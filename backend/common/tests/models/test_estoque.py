from django.test import TestCase

from common.models import Estoque
from common.tests.factories import (
    CaixaFactory,
    ClienteFactory,
    EstoqueFactory,
    SequenciaetiquetaFactory,
)


class EstoqueManagerTestCase(TestCase):
    def setUp(self):
        self.estoque = EstoqueFactory()
        self.cliente = ClienteFactory()
        self.caixa = CaixaFactory(cliente=self.cliente)
        self.serial = SequenciaetiquetaFactory(idcaixa=self.caixa)
        self.estoque.serial = self.serial

        self.estoque_2 = EstoqueFactory()
        self.serial_2 = SequenciaetiquetaFactory(idcaixa=self.caixa)
        self.estoque_2.serial = self.serial_2

    def test_em_estoque(self):
        self.estoque.status = "ARMAZENADO"
        self.estoque.save()
        self.estoque_2.status = "ARMAZENADO"
        self.estoque_2.save()
        self.assertEqual(Estoque.objects.em_estoque().count(), 2)

    def test_distribuidos(self):
        self.estoque.status = "DISTRIBUIDO"
        self.estoque.save()
        self.estoque_2.status = "DISTRIBUIDO"
        self.estoque_2.save()
        self.assertEqual(Estoque.objects.distribuidos().count(), 2)

    def test_adiciona_ao_estoque(self):
        self.estoque.status = "DISTRIBUIDO"
        self.estoque.save()
        self.estoque_2.status = "DISTRIBUIDO"
        self.estoque_2.save()
        self.assertEqual(Estoque.objects.em_estoque().count(), 0)
        Estoque.objects.adiciona_ao_estoque(self.serial, "2020-01-01")
        self.assertEqual(Estoque.objects.em_estoque().count(), 1)

    def test_retira_do_estoque(self):
        self.estoque.status = "ARMAZENADO"
        self.estoque.save()
        self.estoque_2.status = "ARMAZENADO"
        self.estoque_2.save()
        Estoque.objects.retira_do_estoque(self.serial)
        Estoque.objects.retira_do_estoque(self.serial_2)
        self.assertEqual(Estoque.objects.em_estoque().count(), 0)

    def test_modelos_por_cliente(self):
        self.estoque.status = "ARMAZENADO"
        self.estoque.save()
        itens_estoque = {}
        itens_estoque["cliente"] = self.caixa.id
        itens_estoque["nome_cliente"] = self.cliente.nomefantasiacli
        itens_estoque["itens"] = [
            {
                "modelo": self.caixa.codigo_modelo,
                "idcaixa": self.caixa.id,
                "nome": self.caixa.nome,
                "estoque": 1,
            }
        ]
        list_modelos = Estoque.objects.modelos_por_cliente(self.cliente.idcli)
        self.assertEqual(list(list_modelos), itens_estoque["itens"])

    def sequenciais_por_cliente_estoque_um(self) -> list:
        itens_estoque: dict = {
            "id": self.caixa.id,
            "nome": self.cliente.nomefantasiacli,
            "itens": [
                {
                    "idcaixa": self.caixa.id,
                    "descricao_caixa": self.caixa.descricao,
                    "sequencial": self.serial.idsequenciaetiqueta,
                    "modelo": self.caixa.codigo_modelo,
                    "cliente": self.cliente.idcli,
                    "validade": None,
                    "data_producao": self.serial.data_ultima_situacao,
                    "nome_fantasia_cliente": self.cliente.nomefantasiacli,
                }
            ],
        }
        return [itens_estoque]

    def sequenciais_por_cliente_estoque_dois(self) -> list:
        itens_estoque: dict = {
            "id": self.caixa.id,
            "nome": self.cliente.nomefantasiacli,
            "itens": [
                {
                    "idcaixa": self.caixa.id,
                    "descricao_caixa": self.caixa.descricao,
                    "sequencial": self.serial.idsequenciaetiqueta,
                    "modelo": self.caixa.codigo_modelo,
                    "cliente": self.cliente.idcli,
                    "validade": None,
                    "data_producao": self.serial.data_ultima_situacao,
                    "nome_fantasia_cliente": self.cliente.nomefantasiacli,
                },
                {
                    "idcaixa": self.caixa.id,
                    "descricao_caixa": self.caixa.descricao,
                    "sequencial": self.serial_2.idsequenciaetiqueta,
                    "modelo": self.caixa.codigo_modelo,
                    "cliente": self.cliente.idcli,
                    "validade": None,
                    "data_producao": self.serial_2.data_ultima_situacao,
                    "nome_fantasia_cliente": self.cliente.nomefantasiacli,
                },
            ],
        }
        return [itens_estoque]

    def test_sequenciais_por_cliente(self) -> None:
        self.estoque.status = "ARMAZENADO"
        self.estoque.save()
        itens_estoque_um = self.sequenciais_por_cliente_estoque_um()
        list_sequenciais = Estoque.objects.sequenciais_por_cliente(
            cliente=self.cliente, modelo=self.caixa.codigo_modelo
        )
        self.assertEqual(list_sequenciais, itens_estoque_um)

        self.estoque_2.status = "ARMAZENADO"
        self.estoque_2.save()
        itens_estoque_dois = self.sequenciais_por_cliente_estoque_dois()
        list_sequenciais = Estoque.objects.sequenciais_por_cliente(
            cliente=self.cliente, modelo=self.caixa.codigo_modelo
        )
        self.assertEqual(list_sequenciais, itens_estoque_dois)
