import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from users.helper import listUsers
from users.models import User

class ChatConsummer(WebsocketConsumer):
	def connect(self):
		print('user : ',self.scope['user'])
		print('ip : ',self.scope['client'][0])
		print('port : ',self.scope['client'][1])
		print('auth : ',self.scope['user'].is_authenticated)
		self.room_name = 'test'

		async_to_sync(self.channel_layer.group_add)(
			self.room_name,
			self.channel_name
		)
		self.accept()
		# self.send(text_data=json.dumps({
		# 	'message': 'Welcome ' + self.scope['user'].username + ' to the room ' + self.room_name + '!',
		# 	'type': 'chat'
		# }))
		print('Connected')
	
	def disconnect(self, close_code):
		print('Disconnected')
		self.send(text_data=json.dumps({
			'message': 'Disconnected',
			'type': 'disconnection'
		}))

	def receive(self, text_data):
		
		# if (self.scope['user'].is_authenticated is False):
		# 	self.send(text_data=json.dumps({
		# 		'message': 'You are not logged in!',
		# 		'type': 'error'
		# 	}))
		# 	return
		text_data_json = json.loads(text_data)
		print(text_data_json)
		message = text_data_json['message']
		date = text_data_json['date']
		username = text_data_json['username']
		async_to_sync(self.channel_layer.group_send)(
			self.room_name,
			{
				'type':'chat_message',
				'message':message,
				'username':self.scope['user'].username,
				'date': date,
				'username': username,
			}
		)

	def chat_message(self, event):
		message = event['message']
		username = event['username']
		date = event['date']
		self.send(text_data=json.dumps({
			'type':'chat',
			'message':message,
			'date': date,
			'username': username,

		}))