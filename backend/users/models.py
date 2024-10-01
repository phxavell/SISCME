from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _

from common.models import Profissional, Usuario
from model_utils.fields import AutoCreatedField, AutoLastModifiedField
from rest_framework.exceptions import (
    NotFound,
    PermissionDenied,
    ValidationError,
)

from .managers import MotoristaManager, UserManager


class IndexedTimeStampedModel(models.Model):
    created = AutoCreatedField(_("created"), db_index=True)
    modified = AutoLastModifiedField(_("modified"), db_index=True)

    class Meta:
        abstract = True


class User(AbstractBaseUser, PermissionsMixin, IndexedTimeStampedModel):
    """Modelo de usuário personalizado."""

    email = models.EmailField(max_length=255, null=True, blank=True)
    is_staff = models.BooleanField(
        default=False,
        help_text=_(
            "Designates whether the user can log into this admin site."
        ),
    )
    is_active = models.BooleanField(
        default=True,
        help_text=_(
            "Designates whether this user should be treated as "
            "active. Unselect this instead of deleting accounts."
        ),
    )
    username = models.CharField(max_length=60, unique=True, default="admin")
    idprofissional = models.ForeignKey(
        Profissional,
        models.DO_NOTHING,
        db_column="idprofissional",
        null=True,
        blank=True,
        related_name="usuario",
    )

    objects = UserManager()

    USERNAME_FIELD = "username"

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def __str__(self):
        return self.username

    @property
    def nome(self):
        return self.idprofissional.nome

    @property
    def usuario_legado(self):
        """Essa função retorna o usuário legado a partir do usuário atual.

        Returns:
            Usuario: O usuário legado.
        """
        return Usuario.objects.filter(
            idprofissional=self.idprofissional, apelidousu=self.username
        ).first()

    def activate(self):
        if self.is_active:
            raise ValidationError("Usuário já está ativo.", "usuario_ja_ativo")

        if self.is_cliente:
            if not self.idprofissional.cliente.ativo:
                raise ValidationError(
                    "Cliente inativo, portanto usuário não pode ser ativado.",
                    "cliente_inativo",
                )

        if self.idprofissional is None:
            raise ValidationError(
                "Usuário não possui um profissional vinculado.",
                "usuario_sem_profissional",
            )

        self.is_active = True
        self.save()

        if usuario_legado := self.usuario_legado:
            usuario_legado.ativo = True
            usuario_legado.save()

        return True

    def deactivate(self):
        if not self.is_active:
            return True

        self.is_active = False
        self.save()

        if usuario_legado := self.usuario_legado:
            usuario_legado.desativar()

        return True

    @classmethod
    def activate_list(cls, users):
        for user in users:
            user.activate()

    @classmethod
    def deactivate_list(cls, users):
        for user in users:
            user.deactivate()

    @property
    def is_administrador(self):
        """Essa função retorna se o usuário é administrador ou não.

        Returns:
            bool: True se o usuário for administrador, False caso contrário.
        """
        return self.groups.filter(name="ADMINISTRADORES").exists()

    @property
    def is_motorista(self):
        """Essa função retorna se o usuário é motorista ou não.

        Returns:
            bool: True se o usuário for motorista, False caso contrário.
        """
        return self.groups.filter(name="MOTORISTA").exists()

    def is_supervisor(self):
        """Essa função retorna se o usuário é Supervisor ou não.

        Returns:
            bool: True se o usuário for Supervisor.
        """
        return self.groups.filter(name="SUPERVISAOENFERMAGEM").exists()

    def is_lider_motorista(self):
        """Essa função retorna se o usuário é Lider dos motorista ou não.

        Returns:
            bool: True se o usuário for Lider de motorista.
        """
        return self.groups.filter(name="LIDER_MOTORISTA").exists()

    def is_supervisor_logistica(self):
        """Essa função retorna se o usuário é Supervisor de logistica ou não.

        Returns:
            bool: True se o usuário for Supervisor de Logistica.
        """
        return self.groups.filter(name="SUPERVISOR_LOGISTICA").exists()

    @property
    def is_cliente(self):
        """Essa função retorna se o usuário é cliente ou não.

        Return:
            bool: True se o usuário for cliente.
        """
        try:
            return (
                self.groups.filter(name="CLIENTE").exists()
                and self.idprofissional.cliente is not None
            )

        except AttributeError as exc:
            raise ValidationError(
                "Usuário não possui um profissional vinculado.",
                "usuario_sem_profissional",
            ) from exc

    @property
    def has_cliente(self):
        """Essa função retorna se o usuário tem cliente ou não.

        Return:
            bool: True se o usuário tiver cliente, False caso contrário.
        """
        try:
            if self.idprofissional.cliente is not None:
                return True
            return False

        except AttributeError:
            return False

    @property
    def has_coren(self):
        """Essa função retorna se o usuário possui COREN ou não.

        Returns:
            bool: True se o usuário possui COREN, False caso contrário.
        """
        return self.groups.filter(
            name__in=[
                "ENFERMAGEM",
                "SUPERVISAOENFERMAGEM",
                "TECNICOENFERMAGEM",
            ]
        ).exists()


class Motorista(User):
    """Proxy model para o usuário motorista, que é um tipo de usuário."""

    objects = MotoristaManager()

    @classmethod
    def get_motorista(cls, user_id):
        try:
            user = User.objects.get(id=user_id)
            if not user.is_motorista:
                raise PermissionDenied(
                    "O usuário informado não é um motorista.",
                    "usuario_nao_motorista",
                )
            return user
        except User.DoesNotExist as exc:
            raise NotFound(
                "Motorista não encontrado.", "motorista_nao_encontrado"
            ) from exc

    @property
    def is_motorista(self):
        return True

    @property
    def is_disponivel(self):
        """Retorna se o motorista está disponível ou não.

        Returns:
            bool: True se o motorista estiver disponível, False caso contrário.
        """
        # pylint: disable=import-outside-toplevel
        from common.models import Veiculo

        return not Veiculo.objects.filter(motorista_atual=self).exists()

    @property
    def veiculo_atual(self):
        """Retorna o veículo atual do motorista.

        Returns:
            Veiculo: O veículo atual do motorista.
        """
        # pylint: disable=import-outside-toplevel
        from common.models import Veiculo

        return Veiculo.objects.filter(motorista_atual=self).first()

    @property
    def minhas_coletas(self):
        """Retorna as coletas que o motorista está associado.

        Returns:
            QuerySet: As coletas associadas ao motorista.
        """
        # pylint: disable=import-outside-toplevel
        from common.models import Coleta

        return Coleta.objects.filter(motorista=self)

    @property
    def minhas_entregas(self):
        """Retorna as entregas que o motorista está associado.

        Returns:
            QuerySet: As entregas associadas ao motorista.
        """
        # pylint: disable=import-outside-toplevel
        from common.models import Entrega

        return Entrega.objects.filter(motorista=self)

    def esta_disponivel_para(self, veiculo):
        """Verifica se o motorista está disponível e
        lança exceção se não estiver.

        Raises:
            ValidationError: Se o motorista estiver alocado a um veículo.
        """

        veiculo_associado = self.veiculo_atual

        if not self.is_disponivel and veiculo_associado != veiculo:
            raise ValidationError(
                f"Motorista já está alocado ao veículo de placa {veiculo_associado.placa}.",
                "motorista_ja_alocado",
            )

        return True

    class Meta:
        proxy = True
        verbose_name = "Motorista"
        verbose_name_plural = "Motoristas"
