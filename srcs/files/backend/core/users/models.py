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
	alias = models.CharField(max_length=255, null=True, blank=True, default='unset')
	# tournament = models.ForeignKey('tournament.Tournament', on_delete=models.SET_NULL, null=True, blank=True)
	name = models.CharField(max_length=255, null=True, blank=True)
	friends = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='user_friends')
	blacklist = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='user_blacklist')

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
		other = User.objects.get(username=name)
		myself = User.objects.get(username=self.username)
		if (other):
			myself.blacklist.add(other)
			print("added")
		myself.save()
	
	def removeBlacklist(self, name):
		other = User.objects.get(username=name)
		myself = User.objects.get(username=self.username)
		if (other and other in myself.blacklist.all()):
			myself.blacklist.remove(other)
			print("removed")
		myself.save()
		
	def addFriend(self, name):
		user = User.objects.get(username=name)
		myself = User.objects.get(username=self.username)

		if (user):
			myself.friends.add(user)
		
	
	def removeFriend(self, name):
		user = User.objects.get(username=name)
		myself = User.objects.get(username=self.username)
		if (user and user in myself.friends.all()):
			myself.friends.remove(user)




	
	def changeUsername(self, name):
		if (User.objects.filter(username=name).exists()):
			return False
		self.username = name
		self.save()
		return True

	def __str__(self):
		return f"username = {self.username} \n email = {self.email}"