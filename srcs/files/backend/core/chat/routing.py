from django.urls import re_path
from . import consumers
from matchmaking.views import Matchmaking
from game import consumers as game_consumers

websocket_urlpatterns = [
	re_path(r'ws/chat/(?P<room_name>\w+)/', consumers.ChatConsummer.as_asgi()),
	re_path(r'ws/tournament/(?P<room_name>\w+)/', Matchmaking.as_asgi()),
	re_path(r'ws/game/(?P<room_name>\w+)/', game_consumers.GameConsumer.as_asgi()),
]