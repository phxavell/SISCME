# pylint di

from collections import defaultdict
from datetime import datetime

from django.db.models import Count, F, Max, Min, Q, Sum

from common.filters import (
    RelatorioClassificacaoMaterialFilter,
    RelatorioEficienciaAutoclavagemFilter,
    RelatorioEficienciaTermodesinfeccaoFilter,
    RelatorioFilter,
    RelatorioOcorrenciaFilter,
    RelatorioProdutividadeFilter,
    RelatorioRegistroManutencoesFilter,
)
from common.models import RegistroManutencao
from common.models.legacy import (
    Autoclavagem,
    Cliente,
    Diario,
    Equipamento,
    Etiqueta,
    Evento,
    Produto,
    Termodesinfeccao,
)
from common.serializers import (
    CicloEsterilizacaoReportResponseSerializer,
    CicloTermodesinfeccaoResponseSerializer,
    ClassificacaoDeMaterialSerializer,
    DiarioSerializer,
    EventoSerializer,
    RegistroManutencaoSerializer,
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.exceptions import APIException
from rest_framework.response import Response


class RelatoriosAPIView(generics.ListAPIView):
    filter_backends = [DjangoFilterBackend]
    filterset_class = RelatorioFilter


class RelatorioPaginadoAPIView(RelatoriosAPIView):
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response({"status": "success", "data": serializer.data})
        except Exception as e:
            raise APIException(str(e)) from e


class RelTiposOcorrenciaAPIView(RelatoriosAPIView):
    queryset = Diario.objects.all()
    serializer_class = DiarioSerializer
    filterset_class = RelatorioOcorrenciaFilter

    def list(self, request, *args, **kwargs):
        filter_instance = self.filterset_class(
            request.query_params, queryset=self.get_queryset(), request=request
        )
        queryset = filter_instance.qs

        lista_quantidade_ocorrencia_por_tipo = (
            queryset.values("idindicador")
            .annotate(
                quantidade=Count("idindicador__descricao"),
                tipo=F("idindicador__descricao"),
            )
            .order_by("-quantidade")
        )

        lista_quantidade_ocorrencia_tipo_para_cada_cliente = (
            queryset.values("idcli", "idindicador")
            .annotate(
                quantidade=Count("idindicador__descricao"),
                tipo=F("idindicador__descricao"),
                cliente=F("idcli__nomecli"),
            )
            .order_by("-quantidade")
        )

        clientes_ocorrencias = {}
        for item in lista_quantidade_ocorrencia_tipo_para_cada_cliente:
            cliente = item["cliente"]
            tipo = item["tipo"]
            quantidade = item["quantidade"]

            if cliente not in clientes_ocorrencias:
                clientes_ocorrencias[cliente] = {
                    "total_ocorrencias": 0,
                    "tipos": {},
                }

            clientes_ocorrencias[cliente]["tipos"][tipo] = quantidade
            clientes_ocorrencias[cliente]["total_ocorrencias"] += quantidade

        response_data = {
            "status": "success",
            "data": {
                "total": queryset.count(),
                "tipos": lista_quantidade_ocorrencia_por_tipo,
                "clientes": clientes_ocorrencias,
            },
        }
        return Response(response_data)


class RelEficienciaAutoclaveAPIView(RelatoriosAPIView):
    queryset = Autoclavagem.objects.order_by("-id")
    serializer_class = CicloEsterilizacaoReportResponseSerializer
    filterset_class = RelatorioEficienciaAutoclavagemFilter

    # pylint: disable=too-many-locals
    def list(self, request, *args, **kwargs):
        filter_instance = self.filterset_class(
            request.query_params,
            queryset=self.get_queryset(),
            request=request,
        )
        queryset = filter_instance.qs

        equipamento_data = Equipamento.objects.all()
        equipamento_data = {
            equipamento.idequipamento: equipamento
            for equipamento in equipamento_data
        }

        aproveitamento = queryset.filter(datafim__isnull=False).count()
        if queryset.count() > 0:
            aproveitamento = round(
                queryset.filter(datafim__isnull=False).count()
                / queryset.count()
                * 100,
                2,
            )

        queryset_validation = queryset.aggregate(Sum("duracao"))
        if queryset_validation["duracao__sum"]:
            tempo_total = queryset_validation["duracao__sum"]
        else:
            tempo_total = 0

        total = {
            "ciclos": queryset.count(),
            "ciclos_finalizados": queryset.filter(
                datafim__isnull=False
            ).count(),
            "ciclos_em_andamento": queryset.filter(
                datafim__isnull=True, dataabortado__isnull=True
            ).count(),
            "ciclos_abortados": queryset.filter(
                datafim__isnull=True, dataabortado__isnull=False
            ).count(),
            "aproveitamento": aproveitamento,
            "tempo_total": tempo_total,
        }

        por_equipamento = (
            queryset.values("equipamento")
            .annotate(
                ciclos=Count("equipamento"),
                ciclos_finalizados=Count("datafim"),
                ciclos_em_andamento=Count(
                    "datainicio",
                    filter=Q(datafim__isnull=True, dataabortado__isnull=True),
                ),
                ciclos_abortados=Count("dataabortado"),
                tempo_total=Sum("duracao"),
            )
            .order_by("-ciclos")
        )

        tempo_parado_total = 0

        for item in por_equipamento:
            equipamento_id = item["equipamento"]
            equipamento = equipamento_data[equipamento_id]
            item["equipamento"] = {
                "id": equipamento.idequipamento,
                "nome": equipamento.descricao,
            }

            equipamento_range = queryset.filter(
                equipamento=equipamento_id
            ).aggregate(
                primeiro_registro=Min("created_at"),
                ultimo_registro=Max("updated_at"),
            )

            if (
                equipamento_range["primeiro_registro"]
                and equipamento_range["ultimo_registro"]
            ):
                primeiro_registro_date = datetime.strptime(
                    str(equipamento_range["primeiro_registro"]),
                    "%Y-%m-%d %H:%M:%S.%f%z",
                )
                ultimo_registro_date = datetime.strptime(
                    str(equipamento_range["ultimo_registro"]),
                    "%Y-%m-%d %H:%M:%S.%f%z",
                )

                primeiro_registro_date_inicio_do_dia = (
                    primeiro_registro_date.replace(
                        hour=0, minute=0, second=0, microsecond=0
                    )
                )
                ultimo_registro_date_fim_do_dia = ultimo_registro_date.replace(
                    hour=23, minute=59, second=59, microsecond=999999
                )

                diferenca_total_segundos = (
                    ultimo_registro_date_fim_do_dia
                    - primeiro_registro_date_inicio_do_dia
                ).total_seconds()

                tempo_total_operacional_segundos = item.get("duracao", 0)

                tempo_parado_segundos = max(
                    0,
                    diferenca_total_segundos
                    - tempo_total_operacional_segundos,
                )

                item["tempo_parado"] = round(tempo_parado_segundos)

                tempo_parado_total += tempo_parado_segundos
            else:
                item["tempo_parado"] = 0

        total["tempo_parado_total"] = round(tempo_parado_total)

        response_data = {
            "status": "success",
            "data": {
                "total": total,
                "por_equipamento": por_equipamento,
            },
        }

        return Response(response_data)


class RelEficienciaTermoDesinfeccaoAPIView(RelatoriosAPIView):
    queryset = Termodesinfeccao.objects.order_by("-id")
    serializer_class = CicloTermodesinfeccaoResponseSerializer
    filterset_class = RelatorioEficienciaTermodesinfeccaoFilter

    # pylint: disable=too-many-locals
    def list(self, request, *args, **kwargs):
        filter_instance = self.filterset_class(
            request.query_params,
            queryset=self.get_queryset(),
            request=request,
        )
        queryset = filter_instance.qs

        equipamento_data = Equipamento.objects.all()
        equipamento_data = {
            equipamento.idequipamento: equipamento
            for equipamento in equipamento_data
        }

        aproveitamento = queryset.filter(datafim__isnull=False).count()
        if queryset.count() > 0:
            aproveitamento = round(
                queryset.filter(datafim__isnull=False).count()
                / queryset.count()
                * 100,
                2,
            )

        queryset_validation = queryset.aggregate(Sum("duracao"))
        if queryset_validation["duracao__sum"]:
            tempo_total = queryset_validation["duracao__sum"]
        else:
            tempo_total = 0

        total = {
            "ciclos": queryset.count(),
            "ciclos_finalizados": queryset.filter(
                datafim__isnull=False
            ).count(),
            "ciclos_em_andamento": queryset.filter(
                datafim__isnull=True, dataabortado__isnull=True
            ).count(),
            "ciclos_abortados": queryset.filter(
                datafim__isnull=True, dataabortado__isnull=False
            ).count(),
            "aproveitamento": aproveitamento,
            "tempo_total": tempo_total,
        }

        por_equipamento = (
            queryset.values("equipamento")
            .annotate(
                ciclos=Count("equipamento"),
                ciclos_finalizados=Count("datafim"),
                ciclos_em_andamento=Count(
                    "datainicio",
                    filter=Q(datafim__isnull=True, dataabortado__isnull=True),
                ),
                ciclos_abortados=Count("dataabortado"),
                tempo_total=Sum("duracao"),
            )
            .order_by("-ciclos")
        )

        tempo_parado_total = 0

        for item in por_equipamento:
            equipamento_id = item["equipamento"]
            equipamento = equipamento_data[equipamento_id]
            item["equipamento"] = {
                "id": equipamento.idequipamento,
                "nome": equipamento.descricao,
            }

            equipamento_range = queryset.filter(
                equipamento=equipamento_id
            ).aggregate(
                primeiro_registro=Min("created_at"),
                ultimo_registro=Max("updated_at"),
            )

            if (
                equipamento_range["primeiro_registro"]
                and equipamento_range["ultimo_registro"]
            ):
                primeiro_registro_date = datetime.strptime(
                    str(equipamento_range["primeiro_registro"]),
                    "%Y-%m-%d %H:%M:%S.%f%z",
                )
                ultimo_registro_date = datetime.strptime(
                    str(equipamento_range["ultimo_registro"]),
                    "%Y-%m-%d %H:%M:%S.%f%z",
                )

                primeiro_registro_date_inicio_do_dia = (
                    primeiro_registro_date.replace(
                        hour=0, minute=0, second=0, microsecond=0
                    )
                )
                ultimo_registro_date_fim_do_dia = ultimo_registro_date.replace(
                    hour=23, minute=59, second=59, microsecond=999999
                )

                diferenca_total_segundos = (
                    ultimo_registro_date_fim_do_dia
                    - primeiro_registro_date_inicio_do_dia
                ).total_seconds()

                tempo_total_operacional_segundos = item.get("duracao", 0)

                tempo_parado_segundos = max(
                    0,
                    diferenca_total_segundos
                    - tempo_total_operacional_segundos,
                )

                item["tempo_parado"] = round(tempo_parado_segundos)

                tempo_parado_total += tempo_parado_segundos
            else:
                item["tempo_parado"] = 0

        total["tempo_parado_total"] = round(tempo_parado_total)

        response_data = {
            "status": "success",
            "data": {
                "total": total,
                "por_equipamento": por_equipamento,
            },
        }

        return Response(response_data)


class RelProdutividadeAPIView(RelatoriosAPIView):
    queryset = Evento.objects.filter(
        (Q(idrecebimento__isnull=False) | Q(iddistribuicao__isnull=False))
        & ~Q(cliente=None)
    ).order_by("-idevento")
    serializer_class = EventoSerializer
    filterset_class = RelatorioProdutividadeFilter

    # pylint: disable=too-many-locals
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())

            total_recebimento = queryset.filter(
                idrecebimento__isnull=False
            ).count()
            total_distribuicao = queryset.filter(
                iddistribuicao__isnull=False
            ).count()
            aproveitamento = 0
            if total_recebimento > 0:
                aproveitamento = round(
                    (total_distribuicao / total_recebimento) * 100, 2
                )

            total_recebimento_diurno = queryset.filter(
                turno="DIURNO", idrecebimento__isnull=False
            ).count()
            total_distribuicao_diurno = queryset.filter(
                turno="DIURNO", iddistribuicao__isnull=False
            ).count()
            total_recebimento_noturno = queryset.filter(
                turno="NOTURNO", idrecebimento__isnull=False
            ).count()
            total_distribuicao_noturno = queryset.filter(
                turno="NOTURNO", iddistribuicao__isnull=False
            ).count()

            aproveitamento_diurno = 0
            aproveitamento_noturno = 0
            if total_recebimento_diurno > 0:
                aproveitamento_diurno = round(
                    (total_distribuicao_diurno / total_recebimento_diurno)
                    * 100,
                    2,
                )
            if total_recebimento_noturno > 0:
                aproveitamento_noturno = round(
                    (total_distribuicao_noturno / total_recebimento_noturno)
                    * 100,
                    2,
                )

            todos_clientes = Cliente.objects.all()

            por_cliente_dict = defaultdict(dict)

            for cliente in todos_clientes:
                cliente_idcli = cliente.idcli
                por_cliente_dict[cliente_idcli]["cliente"] = {
                    "id": cliente_idcli,
                    "nome": cliente.nome_exibicao,
                }
                por_cliente_dict[cliente_idcli]["qtd_recebimento"] = 0
                por_cliente_dict[cliente_idcli]["qtd_distribuicao"] = 0
                por_cliente_dict[cliente_idcli]["aproveitamento"] = 0.0
                por_cliente_dict[cliente_idcli]["diurno"] = {
                    "qtd_recebimento": 0,
                    "qtd_distribuicao": 0,
                    "aproveitamento": 0.0,
                }
                por_cliente_dict[cliente_idcli]["noturno"] = {
                    "qtd_recebimento": 0,
                    "qtd_distribuicao": 0,
                    "aproveitamento": 0.0,
                }

            for evento in queryset:
                cliente_idcli = evento.cliente.idcli
                por_cliente_dict[cliente_idcli]["qtd_recebimento"] += (
                    1 if evento.idrecebimento else 0
                )
                por_cliente_dict[cliente_idcli]["qtd_distribuicao"] += (
                    1 if evento.iddistribuicao else 0
                )
                if evento.turno == "DIURNO":
                    por_cliente_dict[cliente_idcli]["diurno"][
                        "qtd_recebimento"
                    ] += (1 if evento.idrecebimento else 0)
                    por_cliente_dict[cliente_idcli]["diurno"][
                        "qtd_distribuicao"
                    ] += (1 if evento.iddistribuicao else 0)
                else:
                    por_cliente_dict[cliente_idcli]["noturno"][
                        "qtd_recebimento"
                    ] += (1 if evento.idrecebimento else 0)
                    por_cliente_dict[cliente_idcli]["noturno"][
                        "qtd_distribuicao"
                    ] += (1 if evento.iddistribuicao else 0)

            for cliente_data in por_cliente_dict.values():
                cliente_data["aproveitamento"] = (
                    round(
                        (
                            cliente_data["qtd_distribuicao"]
                            / cliente_data["qtd_recebimento"]
                        )
                        * 100,
                        2,
                    )
                    if cliente_data["qtd_recebimento"] > 0
                    else 0
                )
                cliente_data["diurno"]["aproveitamento"] = (
                    round(
                        (
                            cliente_data["diurno"]["qtd_distribuicao"]
                            / cliente_data["diurno"]["qtd_recebimento"]
                        )
                        * 100,
                        2,
                    )
                    if cliente_data["diurno"]["qtd_recebimento"] > 0
                    else 0
                )
                cliente_data["noturno"]["aproveitamento"] = (
                    round(
                        (
                            cliente_data["noturno"]["qtd_distribuicao"]
                            / cliente_data["noturno"]["qtd_recebimento"]
                        )
                        * 100,
                        2,
                    )
                    if cliente_data["noturno"]["qtd_recebimento"] > 0
                    else 0
                )

            return Response(
                {
                    "status": "success",
                    "data": {
                        "total": {
                            "recebimento": total_recebimento,
                            "distribuicao": total_distribuicao,
                            "aproveitamento": aproveitamento,
                            "diurno": {
                                "recebimento": total_recebimento_diurno,
                                "distribuicao": total_distribuicao_diurno,
                                "aproveitamento": aproveitamento_diurno,
                            },
                            "noturno": {
                                "recebimento": total_recebimento_noturno,
                                "distribuicao": total_distribuicao_noturno,
                                "aproveitamento": aproveitamento_noturno,
                            },
                        },
                        "por_cliente": list(por_cliente_dict.values()),
                    },
                }
            )

        except Exception as e:
            raise APIException(str(e)) from e


class RelRegistroManutencoesAPIView(RelatoriosAPIView):
    queryset = RegistroManutencao.objects.all()
    serializer_class = RegistroManutencaoSerializer
    filterset_class = RelatorioRegistroManutencoesFilter

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())

            total_manutencoes_realizadas = queryset.filter(
                inicio__isnull=False, fim__isnull=False
            ).count()
            total_manutencoes_previstas = queryset.filter(
                tipo__in=["PR", "PD"], fim__isnull=True
            ).count()

            equipamentos_em_manutencao = queryset.filter(
                inicio__isnull=False, fim__isnull=True
            ).count()

            tempo_total = 0
            for manutencao in queryset.filter(
                inicio__isnull=False, fim__isnull=False
            ):
                tempo_total += (
                    manutencao.fim - manutencao.inicio
                ).total_seconds()

            tempo_total = round(tempo_total)

            total_por_tipo = {
                "pr": queryset.filter(tipo="PR").count(),
                "pd": queryset.filter(tipo="PD").count(),
                "cr": queryset.filter(tipo="CR").count(),
            }

            equipamentos = Equipamento.objects.all()
            equipamentos_data = {}
            for equipamento in equipamentos:
                equipamentos_data[equipamento.idequipamento] = {
                    "equipamento_id": equipamento.idequipamento,
                    "nome": equipamento.descricao,
                    "manutencoes_previstas": 0,
                    "manutencoes_realizadas": 0,
                }

            for equipamento in equipamentos_data.values():
                equipamento["manutencoes_previstas"] = queryset.filter(
                    equipamento=equipamento["equipamento_id"],
                    tipo__in=["PR", "PD"],
                    fim__isnull=True,
                ).count()

                equipamento["manutencoes_realizadas"] = queryset.filter(
                    equipamento=equipamento["equipamento_id"],
                    inicio__isnull=False,
                    fim__isnull=False,
                ).count()

            return Response(
                {
                    "status": "success",
                    "data": {
                        "realizadas": total_manutencoes_realizadas,
                        "previstas": total_manutencoes_previstas,
                        "em_manutencao": equipamentos_em_manutencao,
                        "tempo_total": tempo_total,
                        "total_por_tipo": total_por_tipo,
                        "equipamentos": list(equipamentos_data.values()),
                    },
                }
            )

        except Exception as e:
            raise APIException(str(e)) from e


class RelClassificacaoMaterialAPIView(RelatoriosAPIView):
    serializer_class = ClassificacaoDeMaterialSerializer
    filterset_class = RelatorioClassificacaoMaterialFilter
    queryset_etiqueta = Etiqueta.objects.all()
    queryset_produto = Produto.objects.all()

    def list(self, request, *args, **kwargs):
        try:
            etiquetas = self.queryset_etiqueta

            tipo_unico_por_produto_etiqueta = etiquetas.values(
                "tipoetiqueta"
            ).distinct()

            total_etiquetas = etiquetas.aggregate(Sum("qtd"))["qtd__sum"]

            etiqueta_por_tipo_etiqueta = etiquetas.values(
                "tipoetiqueta"
            ).annotate(
                quantidade=Count("tipoetiqueta"),
            )

            return Response(
                {
                    "status": "success",
                    "data": {
                        "tipos": tipo_unico_por_produto_etiqueta,
                        "total_etiquetas": total_etiquetas,
                        "etiquetas": etiquetas.count(),
                        "etiquetas_por_tipo_etiqueta": etiqueta_por_tipo_etiqueta,
                    },
                }
            )

        except Exception as e:
            raise APIException(str(e)) from e


class RelProducaoMensalPreparoAPIView(RelatoriosAPIView):
    serializer_class = EventoSerializer

    def list(self, request, *args, **kwargs):
        try:
            queryset = Evento.objects.filter(
                (Q(preparo_id__isnull=False))
            ).order_by("-idevento")

            preparos_por_cliente = (
                Evento.objects.filter(preparo_id__isnull=False)
                .values("cliente__nomecli")
                .annotate(quantidade=Count("cliente_id"))
                .order_by("cliente__nomecli")
            )

            return Response(
                {
                    "status": "success",
                    "data": {
                        "total": queryset.count(),
                        "preparos_por_cliente": preparos_por_cliente,
                    },
                }
            )

        except Exception as e:
            raise APIException(str(e)) from e
