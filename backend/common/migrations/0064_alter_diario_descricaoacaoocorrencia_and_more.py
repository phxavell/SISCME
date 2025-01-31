# Generated by Django 4.1.12 on 2023-11-07 20:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("common", "0063_indicador_created_at_indicador_created_by_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="diario",
            name="descricaoacaoocorrencia",
            field=models.TextField(
                blank=True, db_column="descricaoacaoocorrencia", null=True
            ),
        ),
        migrations.RenameField(
            model_name="diario",
            old_name="descricaoacaoocorrencia",
            new_name="acao",
        ),
        migrations.AlterField(
            model_name="diario",
            name="descricaoaberto",
            field=models.TextField(db_column="descricaoaberto"),
        ),
        migrations.RenameField(
            model_name="diario",
            old_name="descricaoaberto",
            new_name="descricao",
        ),
        migrations.AlterField(
            model_name="diario",
            name="iddiario",
            field=models.BigIntegerField(
                db_column="iddiario", primary_key=True, serialize=False
            ),
        ),
        migrations.RenameField(
            model_name="diario",
            old_name="iddiario",
            new_name="id",
        ),
        migrations.AlterField(
            model_name="diario",
            name="titulo",
            field=models.CharField(db_column="titulo", max_length=100),
        ),
        migrations.RenameField(
            model_name="diario",
            old_name="titulo",
            new_name="nome_profissional_responsavel",
        ),
        migrations.AddField(
            model_name="diario",
            name="profissional_responsavel",
            field=models.ForeignKey(
                blank=True,
                db_column="profissional_responsavel",
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
