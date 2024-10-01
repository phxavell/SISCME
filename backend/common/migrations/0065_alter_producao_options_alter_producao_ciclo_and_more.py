# Generated by Django 4.1.12 on 2023-11-07 19:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("common", "0064_merge_20231107_1622"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="producao",
            options={"managed": True, "verbose_name": "Produção"},
        ),
        migrations.AlterField(
            model_name="producao",
            name="ciclo",
            field=models.IntegerField(
                blank=True, db_column="ciclo", null=True
            ),
        ),
        migrations.RenameField(
            model_name="producao",
            old_name="ciclo",
            new_name="cautela",
        ),
        migrations.AlterField(
            model_name="producao",
            name="idproducao",
            field=models.BigIntegerField(
                db_column="idproducao", primary_key=True, serialize=False
            ),
        ),
        migrations.RenameField(
            model_name="producao",
            old_name="idproducao",
            new_name="id",
        ),
        migrations.AddField(
            model_name="producao",
            name="created_at",
            field=model_utils.fields.AutoCreatedField(
                db_index=True,
                default=django.utils.timezone.now,
                editable=False,
                null=True,
                verbose_name="created_at",
            ),
        ),
        migrations.AddField(
            model_name="producao",
            name="created_by",
            field=models.ForeignKey(
                blank=True,
                db_column="created_by",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="created_%(class)s_set",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="producao",
            name="updated_at",
            field=model_utils.fields.AutoLastModifiedField(
                db_index=True,
                default=django.utils.timezone.now,
                editable=False,
                null=True,
                verbose_name="updated_at",
            ),
        ),
        migrations.AddField(
            model_name="producao",
            name="updated_by",
            field=models.ForeignKey(
                blank=True,
                db_column="updated_by",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="updated_%(class)s_set",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="sequenciaetiqueta",
            name="data_ultima_situacao",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name="sequenciaetiqueta",
            name="ultima_situacao",
            field=models.IntegerField(
                choices=[
                    (0, "Não Utilizado"),
                    (1, "Recebido"),
                    (2, "Manual"),
                    (3, "Termodesinfecção Inicio"),
                    (4, "Termodesinfecção Fim"),
                    (5, "Embalado"),
                    (6, "Esterilização Inicio"),
                    (7, "Esterilização Fim"),
                    (8, "Abortado"),
                    (9, "Distribuído"),
                ],
                default=0,
            ),
        ),
    ]
