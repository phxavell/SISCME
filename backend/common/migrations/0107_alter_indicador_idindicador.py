# Generated by Django 4.1.13 on 2023-12-07 15:39

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0106_alter_produto_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="indicador",
            name="idindicador",
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
    ]
