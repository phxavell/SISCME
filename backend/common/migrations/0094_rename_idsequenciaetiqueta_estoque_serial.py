# Generated by Django 4.1.13 on 2023-11-15 01:23

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0093_alter_estoque_id"),
    ]

    operations = [
        migrations.RenameField(
            model_name="estoque",
            old_name="idsequenciaetiqueta",
            new_name="serial",
        ),
    ]
