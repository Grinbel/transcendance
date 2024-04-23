from django.urls import re_path

from .views import Tournament

urlpatterns = [
	re_path(r'ws/tournament/', Tournament.as_asgi()),
]