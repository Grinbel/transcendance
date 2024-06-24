import json
from django.db import models
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from users.helper import listUsers
from users.models import User
# from django.contrib.auth.models import Group
from .models import Group, Messages
from django.utils import timezone
from datetime import datetime, timedelta
from django.http import HttpResponse
from rest_framework.decorators import api_view
from tournament.models import Tournament
from matchmaking.views import checkuser
from rest_framework.response import Response
from rest_framework import status

def checkCommand(self, message, user):
	if (message[0] == '/'):
		##print('commande :',message)

		split = message.split(' ')
		#check if splis size is bigger than 2
		if (len(split) < 2):
			return True
		elif (split[0] == '/whisper'):
			#send a private message
			##print("whisper")
			if (User.objects.filter(username=split[1]).exists() == False):
				#print('user not found')
				return True
			elif (user.blacklist.all().filter(username=split[1]).exists()):
				#print('blocked')
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
	#print("whisper")
	if (User.objects.filter(username=receiver).exists() == False):
		#print('user not found')
		return
	receiver= User.objects.get(username=receiver)
	if (receiver.blacklist.all().filter(username=user.username).exists() == True):
		#print('blocked')
		return
	#print("receiver block: ",receiver.blacklist.all())
	#print("user block: ",user.blacklist.all())

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

@api_view(['POST'])
def sendInvite(request):
	user = checkuser(request)
	if user == None:
		print('Invalid Token')
		return Response({'Error':'Invalid Token'}, status=status.HTTP_401_UNAUTHORIZED)
	receiver = request.data.get('receiver')
	username = user.username
	room = request.data.get('room')
	receiver = User.objects.filter(username=receiver).first()
	# user = User.objects.filter(username=username).first()
	tournament = Tournament.objects.filter(name=room).first()
	if (receiver is None or user is None or tournament is None):
		# print('User not found')
		return Response({'Error':'User not found'}, status=status.HTTP_400_BAD_REQUEST)
	if (username not in tournament.getAllUsername()):
		return Response({'Error':'Not in game'}, status=status.HTTP_400_BAD_REQUEST)
	channel_layer = get_channel_layer()
	if (receiver is None or receiver.blacklist.all().filter(username=username).exists()):
		return Response({'Error':'Invalid you re blocked'}, status=status.HTTP_400_BAD_REQUEST)
	# print('send invite',username,receiver.username,room)
	async_to_sync(channel_layer.group_send)(
		'general',
		{
			'type': 'send_invite',
			'room':room,
			'self':username,
			'receiver':receiver.username,
		}
	)
	return Response({'Invite sent'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def NextGamePlayer(request):
	user = checkuser(request)
	if user == None:
		print('Invalid Token')
		return Response({'Error':'Invalid Token'}, status=status.HTTP_401_UNAUTHORIZED)
	p1 = request.data.get('p1')
	p2 = request.data.get('p2')
	room = request.data.get('room')
	tournament = Tournament.objects.filter(name=room).first()
	if (tournament is None):
		print('Invalid room')
		return Response({'Error':'Invalid Room'}, status=status.HTTP_400_BAD_REQUEST)
	if (user != None and user.username != tournament.creator):
		print('Not creator')
		return Response({'Error':'Not host'}, status=status.HTTP_400_BAD_REQUEST)
	channel_layer = get_channel_layer()
	print('next game player')
	async_to_sync(channel_layer.group_send)(
		'general',
		{
			'type': 'send_next_game_player',
			'p1':p1,
			'p2':p2,
			'room':room,
		}
	)
	# print('next game player')
	return Response({'Next game player sent'}, status=status.HTTP_200_OK)



class ChatConsummer(WebsocketConsumer):

	def connect(self):
		# print('Connected')
		room_name = self.scope['url_route']['kwargs']['room_name']

		# #print('user : ',self.scope['user'])
		#print("User.scope :", self.scope['user'])

		group, created = Group.objects.get_or_create(groupName=room_name)
		#group = Group.objects.get_or_create(groupName=room_name
		# self.groups.append(group)
		self.room_name = room_name
		#print("room name", room_name)
		self.room_group_name = room_name
		async_to_sync(self.channel_layer.group_add)(
			self.room_group_name,
			self.channel_name
		)
		self.accept()
		channel_layer = get_channel_layer()
		#print("channel layer ",channel_layer)
		#print('Connected')
	
	def disconnect(self, close_code):
		# print('Disconnected')
		user= self.scope['user']
		#print('user:',user)
		async_to_sync(self.channel_layer.group_discard)(
			self.room_name, self.channel_name
		)
	


	def receive(self, text_data):
		# Tournament.objects.all().delete()
		# print('Delete all tournament')
		# return
		# pop = ${SERVER_ADRESS}
		# #print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",${SERVER_ADRESS})
		text_data_json = json.loads(text_data)
		user= self.scope['user']
		

		username = user.username
		tipe= text_data_json['type']
		if (tipe != 'connected' and tipe != 'private' and tipe != 'chat'):
			return
		if (tipe == 'connected'):
			room_name = self.room_name
			messages = Group.last_10_messages(room_name)
			if (messages is None):
				return
			for message in messages:
				# #print('message : ',message.username)
				if (user.blacklist.all().filter(username=message.username).exists()):
					#print('blocked')
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
		message = text_data_json['message']
		if (message == '' or len(message) > 80): return
		

		if(tipe == 'private'):
			#print('private')
			receiver = text_data_json['receiver']
			if (User.objects.filter(username=receiver).exists() == False):
				#print('user not found')
				return
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
			#print(data.date)
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
		# #print('in chat message')
		user= self.scope['user']
		if (user.blacklist.all().filter(username=username).exists()):
			#print('blocked')
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

		message = event['message']
		date = event['date']
		self.send(text_data=json.dumps({
			'type': 'private_message',
			'message': message,
			'date': date,
			'username': username,
		}))
	
	def send_invite(self,event):
		other =event['receiver']
		# print('send invite!!!!',other,self.scope['user'].username)
		if (other != self.scope['user'].username):
			return
		# print('send invite to someone')
		
		message = event['self'] + " vous a invite a un tournoi "
		self.send(text_data=json.dumps({
			'type': 'send_invite',
			'message':message,
			'room':event['room'],
			'username':event['self'],
		}
	))
		
	def send_next_game_player(self,event):
		room =event['room']
		usernames = Tournament.objects.get(name=room).players.all()
		usernames = [user.username for user in usernames]
		username = self.scope['user'].username
		if ( username not in usernames):
			return
		message ="Le joueur "+event['p1']+" et le joueur "+event['p2']+" sont demande pour le prochain match"
		self.send(text_data=json.dumps({
			'type': 'next_game_player',
			'message':message,
			'room':event['room'],
			'p1':event['p1'],
			'p2':event['p2'],
		}
	))

	def logoutWeb(self,event):
		if (self.scope['user'].username != event['username']):
			return
		self.send(text_data=json.dumps({
			'type': 'logout',
			'message': 'logout!!!',
			'username': event['username'],
		}))