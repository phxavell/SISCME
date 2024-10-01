# Generated by Django 4.1.13 on 2024-02-22 23:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0129_alter_recebimentoitem_serial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="recebimentoitem",
            name="recebimento",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="recebimento_seriais",
                to="common.recebimento",
            ),
        ),
        migrations.AlterField(
            model_name="recebimentoitem",
            name="serial",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="serial_recebimentos",
                to="common.sequenciaetiqueta",
            ),
        ),
    ]
