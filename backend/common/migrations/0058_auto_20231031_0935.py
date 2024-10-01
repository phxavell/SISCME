from django.db import migrations
from django.db.models import F
from datetime import datetime


def calculate_duration_plantao(apps, schema_editor):
    Plantao = apps.get_model("common", "Plantao")
    for plantao in Plantao.objects.filter(status="FECHADO"):
        data_hora_inicio = datetime.combine(
            plantao.datacadastro, plantao.horacadastro
        )
        data_hora_fim = datetime.combine(
            plantao.datafechamento, plantao.horafechamento
        )
        plantao.duracao = data_hora_fim - data_hora_inicio
        plantao.save()


def undo_calculate_duration_plantao(apps, schema_editor):
    Plantao = apps.get_model("common", "Plantao")
    Plantao.objects.update(duracao=None)


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0057_plantao_duracao"),
    ]

    operations = [
        migrations.RunPython(
            calculate_duration_plantao, undo_calculate_duration_plantao
        ),
    ]
