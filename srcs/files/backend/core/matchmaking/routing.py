from django.urls import re_path

from .views import Matchmaking

urlpatterns = [
	re_path(r'ws/tournament/', Matchmaking.as_asgi()),
]