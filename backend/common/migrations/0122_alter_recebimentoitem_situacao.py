# Generated by Django 4.1.13 on 2024-02-22 19:36

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0121_merge_20240222_1536"),
    ]

    operations = [
        migrations.AlterField(
            model_name="recebimentoitem",
            name="situacao",
            field=models.IntegerField(
                choices=[(1, "Aguardando conferência"), (2, "Recebido")],
                default=1,
                null=True,
            ),
        ),
    ]
