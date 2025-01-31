# Generated by Django 4.1.13 on 2024-02-26 23:00

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0131_merge_20240223_1511"),
    ]

    operations = [
        migrations.AddField(
            model_name="etiqueta",
            name="ciclo_autoclave",
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name="etiqueta",
            name="ciclo_termodesinfectora",
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name="etiqueta",
            name="autoclave",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="etiqueta",
            name="termodesinfectora",
            field=models.IntegerField(
                blank=True, db_column="numerofaltante", null=True
            ),
        ),
    ]
