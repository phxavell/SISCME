# Generated by Django 4.1.12 on 2023-11-07 21:27

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0069_alter_itemproducao_iditemproducao_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="producao",
            name="statusproducao",
            field=models.CharField(default="EMBALADO", max_length=20),
        ),
    ]
