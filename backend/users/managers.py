from django.contrib.auth.models import BaseUserManager


class UserManager(BaseUserManager):
    def get_usuarios_ativos(self):
        return self.get_queryset().filter(is_active=True)

    def create_user(self, username, password=None, **kwargs):
        if not username:
            raise ValueError("O nome de usuário é obrigatório.")
        user = self.model(username=username, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, **kwargs):
        user = self.create_user(**kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

    def create_usermigrations(self, username, password=None, **kwargs):
        if not username:
            raise ValueError("O nome de usuário é obrigatório.")
        user = self.model(username=username, **kwargs)
        user.password = password
        user.save(using=self._db)
        return user


class MotoristaManager(BaseUserManager):
    def get_queryset(self):
        return super().get_queryset().filter(groups__name="MOTORISTA")
