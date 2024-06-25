from django.shortcuts import render
from django.db import models
from django.http import JsonResponse
from game.models import Game
from users.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions
from tournament.models import Tournament
import threading
import random
import time
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core import serializers
from channels.layers import get_channel_layer
from django.http import HttpResponse
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework import status
from django.db.models.signals import pre_save
from django.dispatch import receiver
from datetime import timedelta
from django.utils import timezone


def checkuser(request):
	if 'Authorization' in request.headers and len(request.headers['Authorization'].split(' ')) > 1:
		token = request.headers.get('Authorization').split(' ')[1]
		try:
			untyped_token = UntypedToken(token)
		except (InvalidToken, TokenError) as e:
			# print('Invalid Token failed to decode')	
			return None
		id = untyped_token['user_id']
		user = User.objects.get(id=id)
		return user
	else:
		print("no token")
		return None

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def choice(request):
	# Tournament.objects.all().delete()
	user = checkuser(request)
	if user == None:
		print('Invalid Token')
		return Response({'Error':'Invalid Token'}, status=status.HTTP_401_UNAUTHORIZED)
	print('user:',user)
	username = request.data.get('username')
	user = User.objects.filter(username=username).first()
	if (not user):
		return Response({'Error':'username'}, status=status.HTTP_200_OK)
	join = request.data.get('join')
	alias = request.data.get('alias')
	score = request.data.get('score')
	speed = request.data.get('speed')
	isEasy = request.data.get('isEasy')
	skin = request.data.get('skin')
	playerCount = request.data.get('playerCount')
	tournamentId = request.data.get('tournamentId')


	# print('alias:',alias)
	# print('score:',score)
	# print('speed:',speed)
	# print('isEasy:',isEasy)
	# print('skin:',skin)
	# print('playerCount:',playerCount)
	# print('tournamentId:',tournamentId)
	# print('join:',join)
	# print('\n\nJoin:',join not in [True,False])
	# print('alias.isalphat',not alias.isalnum(),'len(alias):',len(alias) > 10 or len(alias) < 1)
	# print('score:',score < 1 or score > 25)
	# print('speed:',speed < 20 or speed > 200)
	# print('playerCount:',playerCount not in ['2','4','8']and playerCount not in [2,4,8])

	# print('isEasy:',isEasy not in [True,False])
	# print('skin:',skin not in ['1','2','3','4']and skin not in [1,2,3,4])
	# print('join:',join not in [True,False])
	# print('len(tournamentId):',len(tournamentId) > 6)
	if ((len(alias) > 10 or len(alias) < 1) or not alias.isalnum()
	 	or (score < 1 or score > 25)
		or (speed < 20 or speed > 200)
		or (playerCount not in ['2','4','8'] and playerCount not in [2,4,8])
		or isEasy not in [True,False]
		or (skin not in ['1','2','3','4'] and skin not in [1,2,3,4])
		or join not in [True,False]
		or len(tournamentId) > 6):
		print('Invalid parameter')
		return Response({'detail': 'Invalid parameter'}, status=status.HTTP_400_BAD_REQUEST)
	
	# Tournament.objects.all().delete()
	tournaments = Tournament.objects.all()
	for tournament in tournaments:
		print('tournament:',tournament.name)
		usernames = tournament.getAllUsername()
		if (usernames == []):
			tournament.delete()
		elif (tournament.checkExpiration() == True):
			print('delete tournament:',tournament.name)
			continue
		else:
			print('usernames:',usernames)

	if (join and tournamentId == ''):
		name = Tournament.getNextTournament(alias=alias,name=user.username)
		tournament = Tournament.objects.filter(name=name).first()
		if (tournament != None ):
			players = tournament.players.all()
			if (alias in [player.alias for player in players]):
				return Response({'Error':'alias'})
		user.alias = alias
		user.save()

		return Response({'room_name': name}, status=status.HTTP_200_OK)
	elif (join is False):
		name = Tournament.createRoomName()
		tournament = Tournament.create(name=name,max_capacity=playerCount,ball_starting_speed=speed,score=score,easyMode=isEasy,skin=skin)
		return Response({'room_name': name}, status=status.HTTP_200_OK)
	else:
		tournament = Tournament.objects.filter(name=tournamentId).first()
		if (tournament is None):
			return Response({'Error':'invalid'}, status=status.HTTP_200_OK)
		players = tournament.players.all()
		if ((alias in [player.alias for player in players])):
			return Response({'Error':'alias'}, status=status.HTTP_200_OK)
		user.alias = alias
		user.save()
		if tournament.checkAddUser(user) is False:
			return Response({'Error':'full'}, status=status.HTTP_200_OK)
		elif (tournament.status == 'inprogress'):
			return Response({'Error':'progress'}, status=status.HTTP_200_OK)
		else:
			return Response({'room_name': tournament.name})


@api_view(['POST'])
def options(request):
	user = checkuser(request)
	if (user == None):
		print('Invalid Token')
		return Response({'Error':'Invalid Token'}, status=status.HTTP_401_UNAUTHORIZED)
	
	name = request.data.get('room')
	tournament =Tournament.objects.filter(name=name).first()
	if (tournament is None):
		return Response({'Error':'invalid'}, status=status.HTTP_400_BAD_REQUEST)
	if (user != None and user.username not in tournament.getAllUsername() and user.username != tournament.creator):
		return Response({'Error':'Not in game'}, status=status.HTTP_400_BAD_REQUEST)
	return Response({'texture_ball': tournament.texture_ball,'ball_starting_speed':tournament.ball_starting_speed,'score':tournament.score,'easyMode':tournament.easyMode,'skin':tournament.skin}, status=status.HTTP_200_OK)

@api_view(['POST'])
def EndOfGame(request):
	user = checkuser(request)
	if (user == None):
		print('Invalid Token')
		return Response({'Error':'Invalid Token'}, status=status.HTTP_200_OK)
	winner = request.data.get('winner')
	room = request.data.get('room')
	tournament =Tournament.objects.filter(name=room).first()
	if (tournament is None):
		return Response({'Error':'invalid'}, status=status.HTTP_400_BAD_REQUEST)
	if (user != None and user.username != tournament.creator):
		return Response({'Error':'Not in game'}, status=status.HTTP_400_BAD_REQUEST)
	channel_layer = get_channel_layer()
	async_to_sync(channel_layer.group_send)(
		room,
		{
			'type': 'end_of_game',
			'winner':winner,
			'room':room,
		}
	)
	tournament.players.clear()
	tournament.delete()
	tournament.save()
	return Response({'End of game'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def numberPlayer(request):
	user = checkuser(request)
	if (user == None):
		print('Invalid Token')
		return Response({'Error':'Invalid Token'}, status=status.HTTP_401_UNAUTHORIZED)
	room = request.data.get('room')
	print('room:',room)
	print('All games name:', [game.name for game in Tournament.objects.all()])
	tournament =Tournament.objects.filter(name=room).first()
	if (tournament is None):
		return Response({'retour':False},status=status.HTTP_200_OK)
	return Response({'retour':True,'number':tournament.players.count(), 'max_capacity':tournament.max_capacity},status=status.HTTP_200_OK)

# @receiver(pre_save, sender=Tournament)
# def check_expiration(sender, instance, **kwargs):
# 	# if instance.creation_date + timedelta(minutes=1) < timezone.now():

# 	if instance.creation_date + timedelta(seconds=10) < timezone.now():
# 		async_to_sync(get_channel_layer().group_send)(
# 			instance.name,
# 			{
# 				'type':'quit_game',
# 			})
# 		instance.players.clear()
# 		instance.delete()
# 		instance.save()

class Matchmaking(WebsocketConsumer):
	def connect(self):
		room_name = self.scope['url_route']['kwargs']['room_name']
		self.room_name = room_name
		self.tournament_name = room_name
		tournament, created = Tournament.objects.get_or_create(name=room_name)
		# self.tournament = tournament

		async_to_sync(self.channel_layer.group_add)(
			self.room_name,
			self.channel_name
		)
		self.accept()
		if (tournament.checkExpiration() == True):
			return
		self.scope['user'].tournament_name = room_name
		self.scope['user'].save()
		user = self.scope['user']
		players = tournament.players.all()
		if (tournament.checkAddUser(user) is False):
			self.send(text_data=json.dumps({
				'type':'full',
			}))
			return
		else:
			tournament.addUser(user)
			tournament.save()
		# usernames = tournament.getAllUsername()
		for player in players:
			self.send(text_data=json.dumps({
				'type': 'username',
				'username': player.username,
				'name': room_name,
				'avatar': player.avatar.url,
				'max_capacity': tournament.max_capacity,
				'avatar': player.avatar.url,
				'alias': player.alias,
			}))
		friends_usernames = list(user.friends.all().values_list('username', flat=True))
		for friend in friends_usernames:
			self.send(text_data=json.dumps({
				'type':'friends',
				'friend': friend,
			}))
		
	
	def disconnect(self, close_code):
		# self.scope['user'].tournament_name = ''
		# self.scope['user'].save()
		async_to_sync(self.channel_layer.group_discard)(
			self.room_name,
			self.channel_name
		)
		
		tournament = Tournament.objects.filter(name=self.room_name).first()
		if (not tournament):
			return
		tournament.removeUser(self.scope['user'])
		tournament.save()
		if (tournament.players.count() <= 0):
			tournament.players.clear()
			tournament.delete()
		else:
			async_to_sync(self.channel_layer.group_send)(
				self.tournament_name,
				{
					'type':'disconnected',
					'username': 'all',
				}
			)

	def receive(self, text_data):
		# Tournament.objects.all().delete()
		text_data_json = json.loads(text_data)
		# tipe = text_data_json['type']

		name = text_data_json['tournament']
		alias = text_data_json['alias']
		if (alias == '' or alias is None):
			alias = self.scope['user'].username
		if (len(alias) > 10 and len(alias) < 1 or not alias.isalnum()
	  	or len(name) > 6):
			return
		
		user = self.scope['user']
		tournament = Tournament.objects.filter(name=name).first()
		if (tournament is None or user is None):
			return
		if (tournament.checkExpiration() == True):
			return
		username = user.username
		# tournament = Tournament.objects.get(name=name)
		async_to_sync(self.channel_layer.group_send)(
			self.tournament_name,
			{
				'type':'tournament',
				'username': username,
				'name': name,
				'max_capacity': tournament.max_capacity,
				'avatar': user.avatar.url,
				'alias': alias,
			}
		)
		if (tournament.max_capacity == tournament.players.count()):
			timer = 3
			players = tournament.getAllUsername()
			for player in players:
				tournament.creator = player
				break
			
			print('tournament name of host:',tournament.creator)
			async_to_sync(self.channel_layer.group_send)(
				self.tournament_name,
				{
					'type':'launch_tournament',
					'timer': timer,
					'name': name,
					'host': tournament.creator,
				}
			)
			tournament.status= 'inprogress'
			tournament.save()


	def tournament(self, event):
		self.send(text_data=json.dumps({
			'type':'username',
			'username': event['username'],
			'name': event['name'],
			'max_capacity': event['max_capacity'],
			'avatar': event['avatar'],
			'alias': event['alias'],
		}))
	
	def disconnected(self, event):
		self.send(text_data=json.dumps({
			'type': 'disconnected',
			'username': event['username'],
		}))
	
	def launch_tournament(self, event):
		self.send(text_data=json.dumps({
			'type': 'launch_tournament',
			'timer': event['timer'],
			'host': event['host'],
		}))
	
	def end_of_game(self,event):
		##print('end of game')
		self.send(text_data=json.dumps({
			'type':'end',
			'winner': event['winner'],
			'room': event['room'],
		}))
	
	def quit_game(self,event):
		self.send(text_data=json.dumps({
			'type':'quit_game',
		}))
