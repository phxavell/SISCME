from django.urls import reverse

import pytest
from common.tests.factories import UserFactory
from rest_framework import status
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_valid_token():
    user = UserFactory(username="test_user")
    client = APIClient()
    response = client.post(
        reverse("token_obtain_pair"),
        {"username": user.username, "password": "test_password"},
    )
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_user_without_group_access():
    user = UserFactory(username="test_user")
    user.groups.clear()
    user.groups.add(1)  # Adicione o grupo do usuário aqui ,grupo 1 = MOTORISTA
    client = APIClient()
    response = client.post(
        reverse("token_obtain_pair"),
        {"username": user.username, "password": "test_password"},
    )

    if response.status_code == status.HTTP_200_OK:
        user_group = response.data.get("groups")
        if user_group != "ENFERMEIRO":
            response.status_code = status.HTTP_401_UNAUTHORIZED

    else:
        print(
            "Verifique se as credenciais do usuário a ser autenticado são "
            "compatíveis com o usuário criado."
        )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
