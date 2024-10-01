from django.db import migrations


def forwards_func(apps, schema_editor):
    Autoclavagem = apps.get_model("common", "Autoclavagem")
    Termodesinfeccao = apps.get_model("common", "Termodesinfeccao")

    for autoclavagem in Autoclavagem.objects.all():
        if autoclavagem.datainicio and autoclavagem.datafim:
            duracao = (
                autoclavagem.datafim - autoclavagem.datainicio
            ).total_seconds()
            autoclavagem.duracao = duracao
            autoclavagem.save()

        if autoclavagem.datainicio and autoclavagem.dataabortado:
            duracao = (
                autoclavagem.dataabortado - autoclavagem.datainicio
            ).total_seconds()
            autoclavagem.duracao = duracao
            autoclavagem.save()

    for termodesinfeccao in Termodesinfeccao.objects.all():
        if termodesinfeccao.datainicio and termodesinfeccao.datafim:
            duracao = (
                termodesinfeccao.datafim - termodesinfeccao.datainicio
            ).total_seconds()
            termodesinfeccao.duracao = duracao
            termodesinfeccao.save()

        if termodesinfeccao.datainicio and termodesinfeccao.dataabortado:
            duracao = (
                termodesinfeccao.dataabortado - termodesinfeccao.datainicio
            ).total_seconds()
            termodesinfeccao.duracao = duracao
            termodesinfeccao.save()


def backwards_func(apps, schema_editor):
    Autoclavagem = apps.get_model("common", "Autoclavagem")
    Termodesinfeccao = apps.get_model("common", "Termodesinfeccao")

    for autoclavagem in Autoclavagem.objects.all():
        autoclavagem.duracao = None
        autoclavagem.save()

    for termodesinfeccao in Termodesinfeccao.objects.all():
        termodesinfeccao.duracao = None
        termodesinfeccao.save()


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0138_merge_20240312_0824"),
    ]

    operations = [
        migrations.RunPython(forwards_func, backwards_func),
    ]
