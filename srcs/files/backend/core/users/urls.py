from django.contrib import admin
from django.urls import include, path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import Signup, login, verify, Logout, UserList, getProfile

 
urlpatterns = [
    path('getprofile/', getProfile, name='getProfile'),
    path('signup/', Signup.as_view(), name="signup"),
	path('list/', UserList.as_view(), name="users_list"),
    path("login/", login, name="login"),
	path("verify/", verify, name="verify"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
	path('logout/', Logout.as_view(), name='logout'),
]
