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

#//! put permisiion in login
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def choice(request):

	print('value ' + str(request.data))
	username = request.data.get('username')
	join = request.data.get('join')
	alias = request.data.get('alias')
	score = request.data.get('score')
	speed = request.data.get('speed')
	isEasy = request.data.get('isEasy')
	skin = request.data.get('skin')


	user = User.objects.get(username=username)
	user.alias = alias
	user.save()
	if (join):
		name = Tournament.getNextTournament()
		return Response({'room_name': name})
	playerCount = request.data.get('playerCount')
	tournamentId = request.data.get('tournamentId')


	if (tournamentId == ''): #create a new room
		# user = User.objects.get(username=username)
		name = Tournament.createRoomName()
		tournament = Tournament.create(name=name,max_capacity=playerCount,ball_starting_speed=speed,score=score,easyMode=isEasy,skin=skin)
		return Response({'room_name': name})
	#check if tournamendid exist
	tournament = Tournament.objects.filter(name=tournamentId)
	tournament = tournament.first()
	if (tournament is None):
		return Response({'Error':'invalid'})
	elif tournament.checkAddUser(user) is False:
		return Response({'Error':'full'})
	elif (Tournament.objects.filter(players=user).exists()):
		return Response({'Error':'inside'})
	elif (tournament.status == 'inprogress'):
		return Response({'Error':'progress'})
	else:
		return Response({'room_name': tournament.name})

@api_view(['POST'])
def options(request):
	print("OPTIONSSSSSSSSSSSSSSSSs")
	name = request.data.get('room')
	print("name",name)
	tournament =Tournament.objects.filter(name=name).first()
	print("tournament",tournament)
	# texture_ball = tournament.texture_ball
	# print("texture_ball", texture_ball)
	# return Response('ok')
	return Response({'texture_ball': tournament.texture_ball,'ball_starting_speed':tournament.ball_starting_speed,'score':tournament.score,'easyMode':tournament.easyMode,'skin':tournament.skin})

@api_view(['POST'])
def EndOfGame(request):
	winner = request.data.get('winner')
	room = request.data.get('room')
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
		tournament = Tournament.objects.get(name=self.room_name)
		# return
		usernames = tournament.getAllUsername()
		if (tournament.players.count() <= 1):
			tournament.delete()
		else:
			tournament.removeUser(self.scope['user'])
			for username in usernames:
				tournament.removeUser(User.objects.get(username=username))

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
		tipe = text_data_json['type']
		name = text_data_json['tournament']
		username = text_data_json['username']
		alias = text_data_json['alias']
		user = User.objects.get(username=username)
		tournament = Tournament.objects.get(name=name)
		tournament.addUser(user)

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
			# return
			async_to_sync(self.channel_layer.group_send)(
				self.tournament_name,
				{
					'type':'launch_tournament',
					'timer': timer,
					'name': name,
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
		}))
	
	def end_of_game(self,event):
		print('end of game')
		self.send(text_data=json.dumps({
			'type':'end',
			'winner': event['winner'],
			'room': event['room'],
		}))
