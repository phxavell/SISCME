# Generated by Django 4.1.10 on 2023-09-01 19:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0019_alter_recebimento_solicitacao_esterilizacao_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="distribuicao",
            name="solicitacao_esterilizacao_id",
            field=models.ForeignKey(
                blank=True,
                db_column="solicitacao_esterilizacao_id",
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="distribuicoes",
                to="common.solicitacaoesterilizacaomodel",
            ),
        ),
    ]
