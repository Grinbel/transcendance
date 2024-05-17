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
		print('user POOOPA',self.scope['user'], room_name)
		self.room_name = room_name
		self.room_group_name = 'chat_%s' % room_name
		async_to_sync(self.channel_layer.group_add)(
			self.room_name,
			self.channel_name
		)
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
		async_to_sync(self.channel_layer.group_send)(
			self.room_name,
			{
				'type':'game_message',
				'message':'pop',
				
			}
		)
	
	def game_message(self, event):
		message = event['message']
        self.send(text_data=json.dumps({
			'type': 'game_message',
            'message': message
        }))

