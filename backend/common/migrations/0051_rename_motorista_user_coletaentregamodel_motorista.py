# Generated by Django 4.1.11 on 2023-09-22 21:43

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0050_remove_coletaentregamodel_motorista"),
    ]

    operations = [
        migrations.RenameField(
            model_name="coletaentregamodel",
            old_name="motorista_user",
            new_name="motorista",
        ),
    ]
