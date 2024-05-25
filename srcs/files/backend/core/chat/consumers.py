import json
from django.db import models
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from users.helper import listUsers
from users.models import User
# from django.contrib.auth.models import Group
from .models import Group, Messages
from django.utils import timezone
from datetime import datetime, timedelta
from django.contrib.auth import authenticate, login


def checkCommand(self, message, user):
	if (message[0] == '/'):
		print('commande :',message)

		split = message.split(' ')
		#check if splis size is bigger than 2
		if (len(split) < 2):
			return True
		elif (split[0] == '/whisper'):
			#send a private message
			print("whisper")
			if (User.objects.filter(username=split[1]).exists() == False):
				print('user not found')
				return True
			elif (user.blacklist.all().filter(username=split[1]).exists()):
				print('blocked')
				return True
			async_to_sync(self.channel_layer.group_send)(
				self.room_name,
				{
					'type': 'send_private_message',
					'other': split[1],
					'date': datetime.now().strftime('%H:%M'),
					'username':user.username,
					'message': ' '.join(split[2:]),
				}
			)
			return True
		return True
	return False

def sendPrivate(self, message, user,receiver):
	print("whisper")
	if (User.objects.filter(username=receiver).exists() == False):
		print('user not found')
		return
	receiver= User.objects.get(username=receiver)
	if (receiver.blacklist.all().filter(username=user.username).exists() == True):
		print('blocked')
		return
	print("receiver block: ",receiver.blacklist.all())
	print("user block: ",user.blacklist.all())

	async_to_sync(self.channel_layer.group_send)(
		self.room_name,
		{
			'type': 'send_private_message',
			'other': receiver.username,
			'date': datetime.now().strftime('%H:%M'),
			'username':user.username,
			'message': message,
		}
	)

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
		print(text_data_json)
		username = user.username

		tipe= text_data_json['type']
		if (tipe == 'connected'):
			room_name = self.room_name
			messages = Group.last_10_messages(room_name)
			if (messages is None):
				return
			for message in messages:
				# print('message : ',message.username)
				if (user.blacklist.all().filter(username=message.username).exists()):
					print('blocked')
					continue
				#want to add 2 hour to date
				date = message.date + timedelta(hours=2)
				self.send(text_data=json.dumps({
					'type':'chat',
					'message':message.message,
					'date': date.strftime('%H:%M'),
					'username': message.username,
				}))
			return
		elif(tipe == 'private'):
			print('private')
			sendPrivate(self,text_data_json['message'],user,text_data_json['receiver'])
			return
		elif (tipe =='chat'):
			message = text_data_json['message']


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
		# print('in chat message')
		user= self.scope['user']
		if (user.blacklist.all().filter(username=username).exists()):
			print('blocked')
			return
		self.send(text_data=json.dumps({
			'type':'chat',
			'message':message,
			'date': date,
			'username': username,

		}))
	

	def send_private_message(self, event):
		other = event['other']
		username = event['username']
		if (other != self.scope['user'].username and self.scope['user'].username != username):
			return
		print("username :", username)
		print("other :", other)
		message = event['message']
		date = event['date']
		self.send(text_data=json.dumps({
			'type': 'private_message',
			'message': message,
			'date': date,
			'username': username,
		}))