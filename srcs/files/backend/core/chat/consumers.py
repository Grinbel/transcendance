import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class ChatConsummer(WebsocketConsumer):
	def connect(self):
		print('user : ',self.scope['user'])
		print('ip : ',self.scope['client'][0])
		print('port : ',self.scope['client'][1])

		self.room_name = 'test'

		async_to_sync(self.channel_layer.group_add)(
			self.room_name,
			self.channel_name
		)
		self.accept()
		self.send(text_data=json.dumps({
			'message': 'Welcome ' + self.scope['user'].username + ' to the room ' + self.room_name + '!',
			'type': 'chat'
		}))
		print('Connected')
	
	def disconnect(self, close_code):
		print('Disconnected')
		self.send(text_data=json.dumps({
			'message': 'Disconnected',
			'type': 'disconnection'
		}))

	def receive(self, text_data):
		text_data_json = json.loads(text_data)
		message = text_data_json['message']
		print('In receive')
		async_to_sync(self.channel_layer.group_send)(
			self.room_name,
			{
				'type':'chat_message',
				'message':message
			}
		)

	def chat_message(self, event):
		message = event['message']
		print('In chat_message')

		self.send(text_data=json.dumps({
			'type':'chat',
			'message':message
		}))