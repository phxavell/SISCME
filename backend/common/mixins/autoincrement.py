from django.db import connection, models
from django.db.models.signals import pre_save
from django.dispatch import receiver


class AutoIncrementMixin(models.Model):
    class Meta:
        abstract = True

    @receiver(pre_save)
    def set_autoincrement_value(sender, instance, **kwargs):  # noqa
        # pylint: disable=protected-access
        if instance._state.adding and issubclass(sender, AutoIncrementMixin):
            try:
                primary_key_field = next(
                    field
                    for field in instance._meta.fields
                    if isinstance(field, models.Field) and field.primary_key
                )
                last_instance = sender.objects.latest(primary_key_field.name)
                instance.pk = last_instance.pk + 1
                seq_field_name = (
                    primary_key_field.db_column or primary_key_field.name
                )
                with connection.cursor() as cursor:
                    cursor.execute(
                        "SELECT 1 FROM pg_sequences WHERE schemaname = "
                        f"'public' AND sequencename = '{instance._meta.model_name.lower()}_seq'"  # noqa
                    )
                    if cursor.fetchone():
                        cursor.execute(
                            f"SELECT setval('{instance._meta.model_name.lower()}_seq', {instance.pk});"  # noqa
                        )

                    sequence_name = f"{instance._meta.model_name.lower()}_{seq_field_name}_seq"  # noqa

                    cursor.execute(
                        "SELECT 1 FROM pg_sequences WHERE schemaname = "
                        f"'public' AND sequencename = '{sequence_name}'"
                    )
                    if cursor.fetchone():
                        cursor.execute(
                            f"SELECT setval('{instance._meta.model_name.lower()}_{seq_field_name}_seq', {instance.pk});"  # noqa
                        )

            except sender.DoesNotExist:
                instance.pk = 1
