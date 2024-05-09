import json
from django.db import models
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from users.helper import listUsers
from users.models import User
# from django.contrib.auth.models import Group
from .models import Group, Messages
from django.utils import timezone
from datetime import datetime
from django.contrib.auth import authenticate, login

class ChatConsummer(WebsocketConsumer):

	def connect(self):
		room_name = self.scope['url_route']['kwargs']['room_name']
		# print('user : ',self.scope['user'])
		print("User.scope :", self.scope['user'])

		group, created = Group.objects.get_or_create(groupName=room_name)
		#group = Group.objects.get_or_create(groupName=room_name
		# self.groups.append(group)
		self.room_name = room_name
		self.room_group_name = 'chat_%s' % room_name
		async_to_sync(self.channel_layer.group_add)(
			self.room_name,
			self.channel_name
		)
		self.accept()
		#send las 10 messages of the group
		
		print('Connected')
	
	def disconnect(self, close_code):
		print('Disconnected')
		user= self.scope['user']
		print('user:',user)
		async_to_sync(self.channel_layer.group_discard)(
			self.room_group_name, self.channel_name
		)

	def receive(self, text_data):
		text_data_json = json.loads(text_data)
		user= self.scope['user']
		print('user:',user)
		print('username:',user.username)

		print(text_data_json)
		username = text_data_json['username']
		if (username != 'default'):
			user = User.objects.get(username=username)

		# user.addBlacklist('bob')
		#remove every user in blacklist
		# user.blacklist.clear()

		tipe= text_data_json['type']
		if (tipe == 'connected'):
			room_name = self.room_name
			messages = Group.last_10_messages(room_name)
			if (messages is None):
				return
			for message in messages:
				# print('message : ',message.username)
				blacklist = None
				# if (username != 'default'):
				# 	blacklist = user.blacklist.all()
				# if (blacklist is None or username == 'default'):
				# 	self.send(text_data=json.dumps({
				# 		'type':'chat',
				# 		'message':message.message,
				# 		'date': message.date.strftime('%H:%M'),
				# 		'username': message.username,
				# 	}))
				# else :
				# 	for name in blacklist:
				# 		print('name : ',name.username)
						# if (message.username == name.username):
						# 	continue
				self.send(text_data=json.dumps({
					'type':'chat',
					'message':message.message,
					'date': message.date.strftime('%H:%M'),
					'username': message.username,
				}))
			return
		message = text_data_json['message']
		date = text_data_json['date']

		data = Messages.objects.create(
			message=message,
			date=datetime.now(),
			username=username,
			parent_group=Group.objects.get(groupName=self.room_name)
		)
		# print date
		data.save()
		print(data.date)
		async_to_sync(self.channel_layer.group_send)(
			self.room_name,
			{
				'type':'chat_message',
				'message':message,
				'date': data.date.strftime('%H:%M'),
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