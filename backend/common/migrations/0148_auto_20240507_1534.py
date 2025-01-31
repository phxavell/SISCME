# Generated by Django 4.1.13 on 2024-01-24 20:38

from django.db import migrations


class Migration(migrations.Migration):
    def forwards_func(apps, schema_editor):
        Group = apps.get_model("auth", "Group")
        Group.objects.get_or_create(name="GERENTE")

    def backwards_func(apps, schema_editor):
        Group = apps.get_model("auth", "Group")
        Grupo = apps.get_model("common", "Grupo")
        try:
            group = Group.objects.get(name="GERENTE")
            group.delete()
            grupo = Grupo.objects.get(name="GERENTE")
            grupo.delete()
        except Group.DoesNotExist:
            pass

    dependencies = [
        ("common", "0147_alter_complemento_descricao"),
    ]

    operations = [
        migrations.RunPython(forwards_func, backwards_func),
    ]
