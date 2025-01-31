# Generated by Django 4.1.9 on 2023-06-27 15:36

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0003_solicitacaoesterilizacaomodel_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Veiculo",
            fields=[
                (
                    "idveiculo",
                    models.BigAutoField(primary_key=True, serialize=False),
                ),
                (
                    "descricao",
                    models.CharField(blank=True, max_length=150, null=True),
                ),
                ("placa", models.CharField(max_length=10, unique=True)),
                ("marca", models.CharField(max_length=150)),
                ("modelo", models.CharField(max_length=150)),
                ("foto", models.ImageField(upload_to="")),
            ],
            options={
                "db_table": "veiculo",
                "managed": True,
            },
        ),
    ]
