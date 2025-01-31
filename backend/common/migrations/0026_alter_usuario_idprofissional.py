# Generated by Django 4.1.11 on 2023-09-14 20:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0025_merge_20230914_1648"),
    ]

    operations = [
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
