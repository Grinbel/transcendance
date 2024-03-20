from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from users.views import signup, UserList
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import MyObtainTokenPairView

 
urlpatterns = [
    path('signup/', signup.as_view(), name="signup"),
	path('list/', UserList.as_view(), name="users_list"),
    path("token/obtain/", MyObtainTokenPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
