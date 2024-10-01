# Generated by Django 4.1.11 on 2023-09-14 14:11

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0034_alter_itemcaixa_quantidade"),
    ]

    operations = [
        migrations.AlterField(
            model_name="itemcaixa",
            name="quantidade",
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name="itemcaixa",
            name="valor_unitario",
            field=models.DecimalField(
                db_column="valorunitario",
                decimal_places=2,
                default=0,
                max_digits=10,
            ),
        ),
    ]
