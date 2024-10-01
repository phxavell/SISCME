from django.db import migrations, models, connection


def add_field_if_not_exists(apps, schema_editor):
    with connection.cursor() as cursor:
        # Verifica se o campo já existe
        cursor.execute(
            """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'usuario_grupo' AND column_name = 'id'
        """
        )
        column_exists = cursor.fetchone()
        if not column_exists:
            # Se não existir, adicione o campo
            schema_editor.execute(
                """
                ALTER TABLE usuario_grupo
                ADD COLUMN id serial PRIMARY KEY;
            """
            )


def remove_field_if_exists(apps, schema_editor):
    with connection.cursor() as cursor:
        # Verifica se o campo existe
        cursor.execute(
            """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'usuario_grupo' AND column_name = 'id'
        """
        )
        column_exists = cursor.fetchone()
        if column_exists:
            # Se existir, remova o campo
            schema_editor.execute(
                """
                ALTER TABLE usuario_grupo
                DROP COLUMN id;
            """
            )


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0009_alter_sequenciaetiqueta_idcaixa"),
    ]

    operations = [
        migrations.RunPython(
            add_field_if_not_exists, reverse_code=remove_field_if_exists
        ),
    ]
