from django.db import migrations


def forwards_func(apps, schema_editor):
    Sequenciaetiqueta = apps.get_model("common", "Sequenciaetiqueta")
    RecebimentoItem = apps.get_model("common", "RecebimentoItem")

    for sequenciaetiqueta in Sequenciaetiqueta.objects.all():
        recebimentos = sequenciaetiqueta.recebimento.all()

        AGUARDANDO_CONFERENCIA = 1
        RECEBIDO = 2
        AGUARDANDO_CONFERENCIA_RECEBIMENTO = "AGUARDANDO_CONFERENCIA"

        for recebimento in recebimentos:
            situacao_recebimento = (
                AGUARDANDO_CONFERENCIA
                if recebimento.statusrecebimento
                == AGUARDANDO_CONFERENCIA_RECEBIMENTO
                else RECEBIDO
            )

            RecebimentoItem.objects.create(
                sequenciaetiqueta=sequenciaetiqueta,
                recebimento=recebimento,
                situacao=situacao_recebimento,
            )


def backwards_func(apps, schema_editor):
    Sequenciaetiqueta = apps.get_model("common", "Sequenciaetiqueta")
    RecebimentoItem = apps.get_model("common", "RecebimentoItem")
    Recebimento = apps.get_model("common", "Recebimento")

    for recebimento_item in RecebimentoItem.objects.all():
        sequenciaetiqueta = recebimento_item.sequenciaetiqueta
        recebimento = recebimento_item.recebimento

        if recebimento not in sequenciaetiqueta.recebimento.all():
            sequenciaetiqueta.recebimento.add(recebimento)

    RecebimentoItem.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0119_alter_sequenciaetiqueta_ultima_situacao_and_more"),
    ]

    operations = [
        migrations.RunPython(forwards_func, backwards_func),
    ]
