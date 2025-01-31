# Generated by Django 4.1.10 on 2023-09-01 17:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("common", "0019_alter_recebimento_solicitacao_esterilizacao_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="produto",
            name="created_at",
            field=model_utils.fields.AutoCreatedField(
                db_index=True,
                default=django.utils.timezone.now,
                editable=False,
                verbose_name="created_at",
            ),
        ),
        migrations.AddField(
            model_name="produto",
            name="created_by",
            field=models.ForeignKey(
                blank=True,
                db_column="created_by",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="created_%(class)s_set",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="produto",
            name="updated_at",
            field=model_utils.fields.AutoLastModifiedField(
                db_index=True,
                default=django.utils.timezone.now,
                editable=False,
                verbose_name="updated_at",
            ),
        ),
        migrations.AddField(
            model_name="produto",
            name="updated_by",
            field=models.ForeignKey(
                blank=True,
                db_column="updated_by",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="updated_%(class)s_set",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
