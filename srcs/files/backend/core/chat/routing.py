from django.urls import re_path
from . import consumers
from matchmaking.views import Tournamen


websocket_urlpatterns = [
	re_path(r'ws/chat/(?P<room_name>\w+)/', consumers.ChatConsummer.as_asgi()),
	re_path(r'ws/tournament/', Tournamen.as_asgi()),

]