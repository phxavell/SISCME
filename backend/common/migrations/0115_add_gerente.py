# Generated by Django 4.1.13 on 2024-01-24 20:38

from django.db import migrations


class Migration(migrations.Migration):
    def forwards_func(apps, schema_editor):
        Profissao = apps.get_model("common", "Profissao")

        Profissao.objects.get_or_create(descricao="GERENTE")

    dependencies = [
        ("common", "0114_merge_20231215_1336"),
    ]

    operations = [
        migrations.RunPython(forwards_func),
    ]
