# Generated by Django 4.1.13 on 2024-03-28 20:18

from django.db import migrations, connection


def preencher_fk_cliente(apps, schema_editor):
    print(
        "Preenchendo a coluna cliente da tabela evento. Isso pode demorar um pouco..."
    )
    with connection.cursor() as cursor:
        cursor.execute(
            """
            UPDATE evento
            SET cliente = (
                SELECT c.idcli
                FROM cliente AS c
                WHERE c.nomecli = evento.nomecliente
            )
            WHERE EXISTS (
                SELECT 1
                FROM cliente AS c
                WHERE c.nomecli = evento.nomecliente
            );
        """
        )


def desfazer_preencher_fk_cliente(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0144_criacao_tipos_ocorrencias"),
    ]

    operations = [
        migrations.RunPython(
            preencher_fk_cliente, desfazer_preencher_fk_cliente
        ),
    ]
