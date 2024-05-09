from django.contrib import admin
from django.urls import include, path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import Signup, login, verify, Logout, UserList, get_2fa_preference
from matchmaking.views import choice
from middle.views import AsgiValidateTokenView

urlpatterns = [
    path('get_2fa_preference/', get_2fa_preference, name='get_2fa_preference'),
    path('signup/', Signup.as_view(), name="signup"),
	path('list/', UserList.as_view(), name="users_list"),
    path("login/", login, name="login"),
	path("verify/", verify, name="verify"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
	path('logout/', Logout.as_view(), name='logout'),
	path('choice/', choice, name='choice'),
	# path("auth_for_ws_connection/", AsgiValidateTokenView.as_view()),

]
