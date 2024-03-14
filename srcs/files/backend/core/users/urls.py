from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from users.views import UserViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import MyObtainTokenPairView
 
router = routers.DefaultRouter()
router.register("users", UserViewSet)
 
urlpatterns = [
    path("api/", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("token/", MyObtainTokenPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
