# Generated by Django 4.1.13 on 2023-11-24 21:54

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0105_alter_produto_idproduto_rename_idproduto_produto_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="produto",
            name="id",
            field=models.BigAutoField(
                db_column="idproduto", primary_key=True, serialize=False
            ),
        ),
    ]
