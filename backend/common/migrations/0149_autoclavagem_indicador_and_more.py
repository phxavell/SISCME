# Generated by Django 4.1.13 on 2024-04-18 18:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0148_merge_20240417_0953"),
    ]

    operations = [
        migrations.AddField(
            model_name="autoclavagem",
            name="indicador",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                to="common.indicadoresesterilizacao",
            ),
        ),
        migrations.AlterField(
            model_name="evento",
            name="idsequenciaetiqueta",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
