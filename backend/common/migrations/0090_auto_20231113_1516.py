from django.db import migrations


def update_equipamento_tipo(apps, schema_editor):
    Equipamento = apps.get_model("common", "Equipamento")
    for equipamento in Equipamento.objects.all():
        if "TERMO" in equipamento.descricao.upper():
            equipamento.tipo = "TD"  # Termodesinfectora
        else:
            equipamento.tipo = "AC"  # Autoclave ou outro tipo
        equipamento.save()


def undo_update_equipamento_tipo(apps, schema_editor):
    Equipamento = apps.get_model("common", "Equipamento")
    for equipamento in Equipamento.objects.all():
        equipamento.tipo = None
        equipamento.save()


class Migration(migrations.Migration):
    dependencies = [
        (
            "common",
            "0089_equipamento_proxima_manutencao_equipamento_tipo_and_more",
        ),
    ]

    operations = [
        migrations.RunPython(
            update_equipamento_tipo, undo_update_equipamento_tipo
        ),
    ]
