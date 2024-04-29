from django.urls import re_path

from .views import Tournamen

urlpatterns = [
	re_path(r'ws/tournament/', Tournamen.as_asgi()),
]