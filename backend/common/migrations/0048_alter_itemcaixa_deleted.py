# Generated by Django 4.1.12 on 2023-10-09 13:03

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0047_itemcaixa_deleted"),
    ]

    operations = [
        migrations.AlterField(
            model_name="itemcaixa",
            name="deleted",
            field=models.BooleanField(default=False, null=True),
        ),
    ]
