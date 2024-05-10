import json
from django.db import models
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from users.helper import listUsers
from users.models import User
class GameConsumer(WebsocketConsumer):
	def connect(self):
		print('connected to game consumer')
		room_name = self.scope['url_route']['kwargs']['room_name']
		
		self.accept()

	def disconnect(self, close_code):
		pass

	def receive(self, text_data):
		text_data_json = json.loads(text_data)
		# message = text_data_json['message']
		print('received message',text_data_json)
		# self.send(text_data=json.dumps({
		#     'message': message
		# }))
