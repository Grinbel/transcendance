from django.contrib import admin
from django.urls import include, path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import Signup, login, verify, Logout, UserList, getProfile, userlist
from matchmaking.views import choice
from middle.views import AsgiValidateTokenView
# from django_channels_jwt.views import AsgiValidateTokenView

urlpatterns = [
    path('getprofile/', getProfile, name='getProfile'),
    path('signup/', Signup.as_view(), name="signup"),
	path('list/', UserList.as_view(), name="users_list"),
    path("login/", login, name="login"),
	path("verify/", verify, name="verify"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
	path('logout/', Logout.as_view(), name='logout'),
	path('choice/', choice, name='choice'),
	path("api/", AsgiValidateTokenView.as_view()),
	path('userlist/', userlist, name='userlist'),

]
