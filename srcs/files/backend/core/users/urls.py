from django.contrib import admin
from django.urls import include, path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import Signup, Login, Logout, UserList

 
urlpatterns = [
    path('signup/', Signup.as_view(), name="signup"),
	path('list/', UserList.as_view(), name="users_list"),
    path("login/", Login.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
	path('logout/', Logout.as_view(), name='logout'),
]
