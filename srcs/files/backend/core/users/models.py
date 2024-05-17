from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
	STATUS_CHOICES = [
		('busy', 'Busy'),
		('away', 'Away'),
		('available', 'Available'),
	]
	status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='available')
	otp = models.CharField(max_length=6, blank=True)
	otp_expiry_time = models.DateTimeField(blank=True, null=True)
	two_factor = models.BooleanField(default=False)
	avatar = models.ImageField(upload_to='avatars/', default='yoshi.jpg')
	alias = models.CharField(max_length=255, null=True, blank=True)
	tournament = models.ForeignKey('tournament.Tournament', on_delete=models.SET_NULL, null=True, blank=True)
	friends = models.ManyToManyField('self', blank=True)
	name = models.CharField(max_length=255, null=True, blank=True)
	blacklist = models.ManyToManyField('self', blank=True)

	def log(self, name):
		print("username ", name)
		user = User.objects.get(username=name)
		user.name = name
		user.save()
		print("user ", user.name)
		self = user
		self.save()
		print("set username to", self.name)

	def addBlacklist(self, name):
		user = User.objects.get(username=name)
		if (user):
			self.blacklist.add(user)
			print("added")
		self.save()
	
	def removeBlacklist(self, name):
		user = User.objects.get(username=name)
		if (user and user in self.blacklist.all()):
			self.blacklist.remove(user)
			print("removed")
		self.save()
		
	def addFriend(self, name):
		user = User.objects.get(username=name)
		if (user):
			self.friends.add(user)
		self.save()
		
	
	def removeFriend(self, name):
		user = User.objects.get(username=name)
		if (user and user in self.friends.all()):
			self.friends.remove(user)
		self.save()
	
	def changeUsername(self, name):
		if (User.objects.filter(username=name).exists()):
			return False
		self.username = name
		self.save()
		return True

	def __str__(self):
		return f"username = {self.username} \n email = {self.email}"