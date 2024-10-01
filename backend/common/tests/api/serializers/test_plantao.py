from django.test import TestCase
from django.urls import reverse

from common.tests.factories import UserFactory
from common.views import PlantaoViewSet
from rest_framework.test import APIRequestFactory, force_authenticate


class PlantaoSerializerTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.usuario = UserFactory()
        self.usuario.groups.add(1)

    def test_create(self):
        data = {
            "descricaoaberto": "Teste",
        }

        url = reverse("plantao-list")
        request = APIRequestFactory().post(url, data)
        force_authenticate(request, user=self.usuario)
        response = PlantaoViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, 201)
