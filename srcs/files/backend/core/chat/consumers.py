import json
from django.db import models
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from users.helper import listUsers
from users.models import User
# from django.contrib.auth.models import Group
from .models import Group, Messages



class ChatConsummer(WebsocketConsumer):
	messages = []

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.messages = []
	

	def connect(self):
		print('user : ',self.scope['user'])
		print('ip : ',self.scope['client'][0])
		print('port : ',self.scope['client'][1])
		print('auth : ',self.scope['user'].is_authenticated)
		room_name = self.scope['url_route']['kwargs']['room_name']
		print('room_name : ',room_name)
		group, created = Group.objects.get_or_create(groupName=room_name)
		# self.groups.append(group)
		self.room_name = room_name
		self.room_group_name = 'chat_%s' % room_name
		print('room_group_name : ', self.room_group_name)
		async_to_sync(self.channel_layer.group_add)(
			self.room_name,
			self.channel_name
		)
		self.accept()
		#send las 10 messages of the group
		print('get MESSAGES')
		messages = Group.last_10_messages(room_name)
		if (messages is None):
			return
		# print('Messages : ', messages)
		# return 
		for message in messages:
			# print('message : ',message.date.strftime('%H:%M'))
			self.send(text_data=json.dumps({
				'type':'chat',
				'message':message.message,
				'date': message.date.strftime('%H:%M'),
				'username': message.username,
			}))
		print('Connected')
	
	def disconnect(self, close_code):
		print('Disconnected')
		async_to_sync(self.channel_layer.group_discard)(
			self.room_group_name, self.channel_name
		)

	def receive(self, text_data):
		text_data_json = json.loads(text_data)
		print(text_data_json)
		print("room name receive: " + self.room_name)
		message = text_data_json['message']
		date = text_data_json['date']
		username = text_data_json['username']
		
		# group = Group.objects.get(groupName=self.room_name)
		# group.addMessage(text_data_json=text_data_json)
		data = Messages.objects.create(
			message=message,
			# date=date,
			username=username,
			parent_group=Group.objects.get(groupName=self.room_name)
		)
		# print("data :" + data.date)
		async_to_sync(self.channel_layer.group_send)(
			self.room_name,
			{
				'type':'chat_message',
				'message':message,
				'date': date,
				'username': username,
			}
		)

	def chat_message(self, event):
		message = event['message']
		username = event['username']
		date = event['date']
		print('in chat message')
		self.send(text_data=json.dumps({
			'type':'chat',
			'message':message,
			'date': date,
			'username': username,

		}))