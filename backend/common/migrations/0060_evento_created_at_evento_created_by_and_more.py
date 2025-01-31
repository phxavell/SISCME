# Generated by Django 4.1.13 on 2023-11-03 13:11

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("common", "0059_merge_20231030_1546"),
    ]

    operations = [
        migrations.AddField(
            model_name="evento",
            name="created_at",
            field=model_utils.fields.AutoCreatedField(
                db_index=True,
                default=django.utils.timezone.now,
                editable=False,
                null=True,
                verbose_name="created_at",
            ),
        ),
        migrations.AddField(
            model_name="evento",
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
            model_name="evento",
            name="updated_at",
            field=model_utils.fields.AutoLastModifiedField(
                db_index=True,
                default=django.utils.timezone.now,
                editable=False,
                null=True,
                verbose_name="updated_at",
            ),
        ),
        migrations.AddField(
            model_name="evento",
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
        migrations.AlterField(
            model_name="evento",
            name="idevento",
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
    ]
