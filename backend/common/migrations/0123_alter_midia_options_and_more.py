# Generated by Django 4.1.13 on 2024-02-22 19:47

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0122_alter_recebimentoitem_situacao"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="midia",
            options={
                "managed": True,
                "verbose_name": "Mídia",
                "verbose_name_plural": "Mídias",
            },
        ),
        migrations.RenameField(
            model_name="recebimentoitem",
            old_name="sequenciaetiqueta",
            new_name="serial",
        ),
        migrations.AlterModelTable(
            name="midia",
            table="midia",
        ),
    ]
