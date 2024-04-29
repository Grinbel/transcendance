from django.db import models
from users.models import User
import random
import string

# Create your models here.



# class Room(models.Model):
	# STATUS_CHOICES = [
	# 	('pending', 'Pending'),
	# 	('inprogress', 'In progress'),
	# 	('completed', 'Completed'),
	# 	('cancelled', 'Cancelled'),
	# ]
	# name = models.CharField(max_length=6, unique=True, blank=True)
	# status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='pending')
	# creation_date = models.DateTimeField(auto_now_add=True)
	# players = models.ManyToManyField('users.User', related_name='participant')
	# winner = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='winner', null=True, blank=True)
	# max_capacity = models.IntegerField(default=2)
	# # admin = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='admin', blank=True, null=True)
	
	# def save(self, *args, **kwargs):
	# 	if not self.name:
	# 		self.name = self.create_room()
	# 	super().save(*args, **kwargs)

	# @staticmethod
	# def createRoomName():
	# 	name = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
	# 	while Room.objects.filter(name=name).exists():
	# 		name = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
	# 	return name

	# @classmethod
	# def create(cls, max_capacity=8, user=None):
	# 	room = cls.objects.create(name=Room.createRoomName())
	# 	room.max_capacity = max_capacity
	# 	if user:
	# 		# room.admin = user
	# 		room.addUser (user)
	# 	return room
	
	# def addUser(self,user):
	# 	# if (user.tournament is not None):
	# 	# 	return False
	# 	if self.players.count() == self.max_capacity:
	# 		return False
	# 	else:
	# 		# user.tournament = self
	# 		print('user added to room ',self)
	# 		self.players.add(user)
	# 		return True

	# def removeUser(self,user):
	# 	if (user in self.players.all()):
	# 		self.players.remove(user)
	# 		return True
	# 	return False

	# def getUser(self,user):
	# 	return self.players.get(id=user.id)

	# def getAllUsername(self):
	# 	return [user.username for user in self.players.all()]

	# def __str__(self):
	# 	return self.name