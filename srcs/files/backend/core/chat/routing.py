from django.urls import re_path
from . import consumers
from matchmaking.views import Tournament
websocket_urlpatterns = [
	# re_path('http://localhost:8000/users/ws/chat/', consumers.ChatConsummer.as_asgi())
	re_path(r'ws/chat/', consumers.ChatConsummer.as_asgi()),
	re_path(r'ws/tournament/', Tournament.as_asgi()),

]