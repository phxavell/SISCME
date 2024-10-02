from django.db import transaction

from common.models import (
    Estoque,
    Evento,
    Itemproducao,
    Producao,
    Sequenciaetiqueta,
)
from rest_framework.exceptions import NotFound, ValidationError


class EstoqueService:
    @transaction.atomic
    def adicionar_ao_estoque(self, seriais):
        try:
            if not isinstance(seriais, list):
                seriais = [seriais]

            for serial in seriais:
                sequenciaetiqueta = Sequenciaetiqueta.objects.get(
                    idsequenciaetiqueta=serial
                )
                ultima_producao = (
                    Itemproducao.objects.filter(
                        idsequenciaetiqueta=sequenciaetiqueta
                    )
                    .latest("idproducao")
                    .idproducao
                )

                if sequenciaetiqueta.esta_esterilizado:
                    sequenciaetiqueta.alterar_situacao_para_em_estoque()

                # TODO: Futuramente, adicionar else para jogar exceção caso não esteja esterilizado
                Estoque.objects.adiciona_ao_estoque(
                    sequenciaetiqueta, ultima_producao.datavalidade
                )
        except Sequenciaetiqueta.DoesNotExist as exc:
            raise NotFound("Serial não encontrado") from exc

        except Producao.DoesNotExist as exc:
            raise NotFound("Serial não encontrado na produção") from exc

        except Exception as exc:
            raise ValidationError("Erro ao adicionar ao estoque.") from exc

    @transaction.atomic
    def retirar_do_estoque(self, seriais):
        try:
            if not isinstance(seriais, list):
                seriais = [seriais]

            for serial in seriais:
                sequenciaetiqueta = Sequenciaetiqueta.objects.get(
                    idsequenciaetiqueta=serial
                )

                ultimo_evento = Evento.objects.ultimo_evento(serial)

                if (
                    not ultimo_evento
                    or not ultimo_evento.status == "ESTERILIZACAO_FIM"
                ):
                    raise ValidationError(f"Caixa {serial} não esterilizada.")

                if sequenciaetiqueta.esta_em_estoque:
                    sequenciaetiqueta.alterar_situacao_para_distribuido()

                Estoque.objects.retira_do_estoque(sequenciaetiqueta)
        except Sequenciaetiqueta.DoesNotExist as exc:
            raise NotFound("Serial não encontrado.") from exc

        except Estoque.DoesNotExist as exc:
            raise NotFound("Serial não encontrado no estoque.") from exc

        except Exception as exc:
            raise ValidationError("Erro ao retirar do estoque.") from exc
