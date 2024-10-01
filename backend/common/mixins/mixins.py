import re
import unicodedata

from django.db import models
from django.utils.translation import gettext_lazy as _

from model_utils.fields import AutoCreatedField, AutoLastModifiedField
from rest_framework.exceptions import ValidationError


class TrackableMixin(models.Model):
    created_at = AutoCreatedField(_("created_at"), db_index=True, null=True)
    updated_at = AutoLastModifiedField(
        _("updated_at"), db_index=True, null=True
    )
    created_by = models.ForeignKey(
        "users.User",
        db_column="created_by",
        related_name="created_%(class)s_set",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    updated_by = models.ForeignKey(
        "users.User",
        db_column="updated_by",
        related_name="updated_%(class)s_set",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )

    class Meta:
        abstract = True


class TrackUserMixin:
    def perform_create(self, serializer):
        user = self.request.user
        if user.is_authenticated:
            return serializer.save(created_by=user, updated_by=user)

        return serializer.save()

    def perform_update(self, serializer):
        user = self.request.user
        if user.is_authenticated:
            serializer.save(updated_by=user)
        else:
            serializer.save()


class HasRelationMixin:
    """Mixin para verificar se um objeto possui relacionamentos antes de ser
    excluído. Caso possua e o relacionamento seja válido,
    o objeto não pode ser excluído.
    Caso o relacionamento seja parte da lista de relacionamentos da lista,
    o objeto pode ser excluído.
    """

    def check_relations(self, instance, is_child=False):
        for related_object in instance._meta.related_objects:
            if related_object.field.is_relation:
                if (
                    hasattr(self, "relations_to_delete")
                    and related_object.related_model
                    in self.relations_to_delete
                ):
                    continue

                related_model = related_object.related_model

                normalize_property = (
                    unicodedata.normalize("NFKD", related_model.__name__)
                    .encode("ASCII", "ignore")
                    .decode("utf-8")
                )
                regular_property = re.sub(
                    r"[^\w\s]", "", normalize_property
                ).lower()

                has_relation = related_model.objects.filter(
                    **{related_object.field.name: instance}
                ).exists()

                if has_relation:
                    if is_child:
                        return instance

                    raise ValidationError(
                        f"Este(a) {instance._meta.verbose_name} está vinculado a"
                        f" um(a) {related_model._meta.verbose_name} e por isso "
                        f"não pode ser excluído.",
                        f"fk_{instance._meta.model_name}_{regular_property}",
                    )

        return None
