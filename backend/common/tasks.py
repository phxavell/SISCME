from datetime import datetime

from django.utils import timezone

from celery import shared_task

from .models import (
    Evento,
    SolicitacaoEsterilizacaoItemModel,
    SolicitacaoEsterilizacaoModel,
)


@shared_task
def monitorar_status_tabela():
    # Filtrar todas as solicitações com status igual a "transporte"
    solicitacoes_transporte = SolicitacaoEsterilizacaoModel.objects.filter(
        situacao="PROCESSANDO"
    )

    if len(solicitacoes_transporte) == 0:
        print("Nao existem solicitacoes em PROCESSAMENTO no momento")
    # Obter os IDs das solicitações filtradas
    ids = list(solicitacoes_transporte.values_list("id", "created_at"))

    for id_solicitacao, created_at in ids:
        caixas_id = list(
            SolicitacaoEsterilizacaoItemModel.objects.filter(
                solicitacao_esterilizacao_id=id_solicitacao
            ).values_list("caixa", flat=True)
        )
        print(f"para solicitacao {id_solicitacao}: tem as caixas {caixas_id}")
        registros = []
        for caixa in caixas_id:
            #  CXC-HMDR003
            data_referencia = formatarhora(created_at, "d")
            #  data_str = "2023,04,03"
            data_parts = data_referencia.split(",")
            ano = int(data_parts[0])
            mes = int(data_parts[1])
            dia = int(data_parts[2])

            print(f"caixa verificada: {caixa} na data {data_referencia}")

            eventos_encontrados = Evento.objects.filter(
                dataevento__gte=datetime(ano, mes, dia),
                status="DISTRIBUIDO",
                idsequenciaetiqueta=caixa,
            )

            if eventos_encontrados.exists():
                registros.append("DISTRIBUIDO")
                print(f"esse e o registro:{eventos_encontrados}")

            else:
                registros.append("OUTROS")
                print(
                    "Não existem registros com as condições especificadas. "
                    f"Data: {data_referencia}"
                )

        todos_iguais = all(item == "DISTRIBUIDO" for item in registros)
        if todos_iguais:
            print("####Todos os valores são DIST.####")
            solicitacao = SolicitacaoEsterilizacaoModel.objects.get(
                id=id_solicitacao
            )
            solicitacao.situacao = "PRONTO"
            solicitacao.save()
            print(
                f"###---### SOLICITACAO ID:{id_solicitacao} , ATUALIZADA.###---###"
            )
        else:
            print("#####Pelo menos um valor não é DIST.#####")


def formatarhora(horario, var):
    dt_local = horario.astimezone(timezone.get_current_timezone())
    if var == "d":
        dt_formatado = dt_local.strftime("%Y,%m,%d")
    elif var == "h":
        dt_formatado = dt_local.strftime("%H:%M:%S")
    return dt_formatado
