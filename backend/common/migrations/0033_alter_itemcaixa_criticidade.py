# Generated by Django 4.1.11 on 2023-09-14 14:02

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0032_alter_itemcaixa_qtdcriticidade_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="itemcaixa",
            name="criticidade",
            field=models.IntegerField(
                choices=[
                    (1, "Não Crítico"),
                    (2, "Semicrítico"),
                    (3, "Crítico"),
                ],
                db_column="qtdcriticidade",
                default=1,
                help_text="Nível de contato com o paciente.",
            ),
        ),
    ]
