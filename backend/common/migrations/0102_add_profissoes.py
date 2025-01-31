# Generated by Django 4.1.13 on 2023-11-23 17:54

from django.db import migrations
from common.models import Profissao


class Migration(migrations.Migration):
    def forwards_func(apps, schema_editor):
        # Profissao = apps.get_model("common", "Profissao")

        profissoes_names = [
            "ANALISTA DE SISTEMAS",
            "TECNICO ENFERMAGEM",
            "ENFERMEIRA",
            "ADMINISTRATIVO",
            "MOTORISTA",
        ]

        for profissao_name in profissoes_names:
            Profissao.objects.get_or_create(descricao=profissao_name)

    def backwards_func(apps, schema_editor):
        Profissao = apps.get_model("common", "Profissao")

        profissoes_names = [
            "TECNICORECEBIMENTO",
            "TECNICOTERMO",
            "TECNICOEMBALAGEM",
            "TECNICOESTERILIZACAO",
            "TECNICODISTRIBUICAO",
            "ENFERMAGEM",
            "ADMINISTRATIVO",
            "SUPERVISAOENFERMAGEM",
            "TECNICOENFERMAGEM",
            "ADMINISTRADORES",
            "LIDER_MOTORISTA",
            "SUPERVISOR_LOGISTICA",
        ]

        for profissao_name in profissoes_names:
            try:
                profissao = Profissao.objects.get(descricao=profissao_name)
                profissao.delete()
            except Profissao.DoesNotExist:
                pass

    dependencies = [
        ("common", "0100_remove_solicitacaoesterilizacaomodel_automatica"),
    ]

    operations = [
        migrations.RunPython(forwards_func, backwards_func),
    ]
