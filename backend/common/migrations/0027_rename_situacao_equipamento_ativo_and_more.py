# Generated by Django 4.1.11 on 2023-09-14 22:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0026_merge_20230914_1833"),
    ]

    operations = [
        migrations.RenameField(
            model_name="equipamento",
            old_name="situacao",
            new_name="ativo",
        ),
        migrations.AlterField(
            model_name="cliente",
            name="ativo",
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name="usuario",
            name="idprofissional",
            field=models.ForeignKey(
                db_column="idprofissional",
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="usuarios",
                to="common.profissional",
            ),
        ),
    ]
