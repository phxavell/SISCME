# Generated by Django 4.1.13 on 2023-12-12 17:36

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("common", "0108_alter_indicador_idindicador_and_more"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="Indicador",
            new_name="TipoOcorrencia",
        ),
    ]
