# Generated by Django 4.1.13 on 2024-02-21 20:09

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0118_merge_20240208_1614"),
    ]

    operations = [
        migrations.AddField(
            model_name="equipamento",
            name="disponivel",
            field=models.BooleanField(default=True, null=True),
        ),
    ]
