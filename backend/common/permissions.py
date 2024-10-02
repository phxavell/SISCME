from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission


class GroupPermission(BasePermission):
    def __init__(self, required_group: list):
        if not isinstance(required_group, list):
            required_group = [required_group]
        self.required_group = required_group

    def __call__(self, *args, **kwargs):
        return self

    def has_permission(self, request, view):
        """Verifica se o usuário tem o perfil necessário para acessar a rotina.

        Args:
            request (_type_): Dados da requisição.
            view (_type_): Dados da view.

        Raises:
            PermissionDenied: Quando o usuário não tem o perfil necessário.

        Returns:
            bool: Retorna True se o usuário tem o
            perfil necessário para acessar a rotina.
        """
        user = request.user

        if user.is_anonymous:
            raise PermissionDenied(
                "Você não está autenticado para acessar essa rotina.",
                "usuario_anonimo",
            )

        if self.required_group:
            user_groups = set(user.groups.values_list("name", flat=True))
            allowed_groups = set(self.required_group)

            if not user_groups.intersection(allowed_groups) and not (
                user.is_superuser
                and not user.is_staff
                and not user.is_administrador
            ):
                raise PermissionDenied(
                    "Você não tem permissão para acessar essa rotina.",
                    "perfil_nao_autorizado",
                )

        return True


class ClientePermission(BasePermission):
    def has_permission(self, request, view):
        """Verifica se usuário tem cliente associado, para acessar a rotina.

        Args:
            request (_type_): Dados da requisição.
            view (_type_): Dados da view.

        Raises:
            PermissionDenied: Quando o usuário não tem o
            perfil necessário para acessar a rotina.

        Returns:
            bool: Retorna True se o usuário tem o perfil
            necessário para acessar a rotina.
        """
        user = request.user
        if not user.has_cliente:
            raise PermissionDenied(
                "Você não está vinculado a um cliente, "
                "portanto não pode acessar essa rotina.",
                "usuario_sem_cliente",
            )

        return True
