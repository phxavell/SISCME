# Generated by Django 4.1.13 on 2024-03-21 21:19

from django.db import migrations, transaction
import time


def insert_tipo_ocorrencia(apps, schema_editor):
    TipoOcorrencia = apps.get_model("common", "TipoOcorrencia")
    Usuario = apps.get_model("common", "Usuario")
    usuario = Usuario.objects.get(idusu=1)

    with transaction.atomic():
        last_id = TipoOcorrencia.objects.all().order_by("id").last()
        if last_id is not None:
            start_id = last_id.id + 1
        else:
            start_id = 1

        new_tipo_ocorrencias = []

        descriptions = [
            "Baixa no Inventário de Instrumentais Cirúrgicos",
            "Itens Descartados por Falha no Processo de Autoclave",
            "Material com Sujidade",
            "Acidentes com Risco Biológico",
            "Não Conformidade na Devolução de Materiais Consignados",
            "Processamento de Itens Sem Utilização",
            "Suspensão Cirúrgica Relacionada ao Processamento de Materiais",
            "Problemas de Funcionalidade de Equipamentos",
            "Atraso de Cirurgia por Falta de Instrumental",
        ]

        for desc in descriptions:
            new_tipo_ocorrencia = TipoOcorrencia(
                id=start_id,
                descricao=desc,
                idusu=usuario,
                datalancamento=time.strftime("%Y-%m-%d"),
                status=desc,
            )
            new_tipo_ocorrencias.append(new_tipo_ocorrencia)
            start_id += 1

        TipoOcorrencia.objects.bulk_create(new_tipo_ocorrencias)


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0143_rename_observacao_registromanutencao_descricao"),
    ]

    operations = [
        migrations.RunPython(insert_tipo_ocorrencia),
    ]
