# Generated by Django 4.1.12 on 2023-11-06 23:01

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0007_alter_user_idprofissional"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="user",
            options={
                "verbose_name": "Usuário",
                "verbose_name_plural": "Usuários",
            },
        ),
    ]
