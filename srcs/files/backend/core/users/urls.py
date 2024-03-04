from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from users.views import UserViewSet
 
router = routers.DefaultRouter()
router.register("users", UserViewSet)
 
urlpatterns = [
    path("api/", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]