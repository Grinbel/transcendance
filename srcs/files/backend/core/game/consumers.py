import json
from django.db import models
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from users.helper import listUsers
from users.models import User
class GameConsumer(WebsocketConsumer):
	async def connect(self):
		print('connected to game consumer')
		#print('connected to game consumer')
		self.room_name = self.scope['url_route']['kwargs']['room_name']
		#print('user POOOPA',self.scope['user'], room_name)
		self.room_group_name = f"pong_{self.room_name}"

		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)
		await self.accept()

	async def disconnect(self, close_code):
		print('deco to game consumer')

		await self.channel_layer.group_discard(
			self.room_group_name,
			self.channel_name
		)

	async def receive(self, text_data):
		print('connected to game consumer')

		data = json.loads(text_data)
		message = data['message']
		#print('received message',data)
		#print(' real message :',message)
		await self.channel_layer.group_send(
			self.room_group_name,
			{
				'type': 'game_message',
				'message': data,
			}
		)
	
	async def game_message(self, event):

		message = event['message']
		await self.send(text_data=json.dumps(message))

