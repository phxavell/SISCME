# Generated by Django 4.1.13 on 2023-12-05 05:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0108_merge_20231205_0110"),
    ]

    operations = [
        migrations.AlterField(
            model_name="itenstermodesinfeccao",
            name="idtermodesinfeccao",
            field=models.ForeignKey(
                db_column="idtermodesinfeccao",
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="itens",
                to="common.termodesinfeccao",
            ),
        ),
    ]
