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
	user = checkuser(request)
	if user == None:
		print('Invalid Token')
		return Response({'Error':'Invalid Token'}, status=status.HTTP_401_UNAUTHORIZED)
	print('user:',user)
	username = request.data.get('username')
	user = User.objects.filter(username=username).first()
	if (not user):
		return Response({'Error':'username'})
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
		return Response({'detail': 'Invalid parameter'}, status=status.HTTP_401_UNAUTHORIZED)
	
	# Tournament.objects.all().delete()
	tournaments = Tournament.objects.all()
	for tournament in tournaments:
		print('tournament:',tournament.name)
		usernames = tournament.getAllUsername()
		if (usernames == []):
			tournament.delete()

	if (join and tournamentId == ''):
		name = Tournament.getNextTournament(alias=alias,name=user.username)
		tournament = Tournament.objects.filter(name=name).first()
		if (tournament != None ):
			players = tournament.players.all()
			if (alias in [player.alias for player in players]):
				return Response({'Error':'alias'})
		user.alias = alias
		user.save()

		return Response({'room_name': name})
	elif (join is False):
		name = Tournament.createRoomName()
		tournament = Tournament.create(name=name,max_capacity=playerCount,ball_starting_speed=speed,score=score,easyMode=isEasy,skin=skin)
		return Response({'room_name': name})
	else:
		tournament = Tournament.objects.filter(name=tournamentId).first()
		if (tournament is None):
			return Response({'Error':'invalid'})
		players = tournament.players.all()
		if ((alias in [player.alias for player in players])):
			return Response({'Error':'alias'})
		user.alias = alias
		user.save()
		if tournament.checkAddUser(user) is False:
			return Response({'Error':'full'})
		elif (tournament.status == 'inprogress'):
			return Response({'Error':'progress'})
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
		return Response({'Error':'invalid'})
	if (user != None and user.username not in tournament.getAllUsername()):
		return Response({'Error':'Not in game'}, status=status.HTTP_401_UNAUTHORIZED)
	return Response({'texture_ball': tournament.texture_ball,'ball_starting_speed':tournament.ball_starting_speed,'score':tournament.score,'easyMode':tournament.easyMode,'skin':tournament.skin})

@api_view(['POST'])
def EndOfGame(request):
	user = checkuser(request)
	if (user == None):
		print('Invalid Token')
		return Response({'Error':'Invalid Token'}, status=status.HTTP_401_UNAUTHORIZED)
	winner = request.data.get('winner')
	room = request.data.get('room')
	tournament =Tournament.objects.filter(name=room).first()
	if (tournament is None):
		return Response({'Error':'invalid'})
	if (user != None and user.username != tournament.creator):
		print('Not creator')
		return Response({'Error':'Not in game'}, status=status.HTTP_401_UNAUTHORIZED)
	channel_layer = get_channel_layer()
	async_to_sync(channel_layer.group_send)(
		room,
		{
			'type': 'end_of_game',
			'winner':winner,
			'room':room,
		}
	)
	return HttpResponse('Player Ready!')

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
		self.scope['user'].tournament_name = room_name
		self.scope['user'].save()
		user = self.scope['user']
		players = tournament.players.all()

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
		name = text_data_json['tournament']
		alias = text_data_json['alias']

		if (alias == '' or alias is None):
			alias = self.scope['user'].username
		if (len(alias) > 10 or not alias.isalpha()
	  	or len(name) > 6):
			return
		user = self.scope['user']
		tournament = Tournament.objects.filter(name=name).first()
		if (tournament is None or user is None):
			return
		username = user.username
		# tournament = Tournament.objects.get(name=name)
		tournament.addUser(user)
		tournament.save()
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
