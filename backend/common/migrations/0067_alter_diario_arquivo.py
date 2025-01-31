# Generated by Django 4.1.13 on 2023-11-10 19:51

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0066_merge_20231108_1552"),
    ]

    operations = [
        migrations.AlterField(
            model_name="diario",
            name="arquivo",
            field=models.FileField(
                null=True,
                upload_to="ocorrencias",
                validators=[
                    django.core.validators.FileExtensionValidator(
                        ["pdf"],
                        message="Formato de arquivo inválido. Utilize arquivo do tipo PDF .",
                    )
                ],
            ),
        ),
    ]
