from django.urls import path

from common.views import IndexView


app_name = "common"
urlpatterns = [
    path("", IndexView.as_view(), name="index"),
]
