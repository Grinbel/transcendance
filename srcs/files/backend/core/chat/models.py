from django.db import models
from users.models import User
from django.utils import timezone
from datetime import datetime

def get_sentinal_user():
	return get_user_model().objects.get_or_create(username="deleted")[0]


class Group(models.Model):
	groupName = models.CharField(max_length=255)
	# creater = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_groups")
	members = models.ManyToManyField(User, related_name="all_groups")
	current_member = models.IntegerField(default=0)

	def last_10_messages(name):
		try:
			group = Group.objects.get(groupName=name)
			return list(group.messages.order_by("date"))[-5:]
		except Group.DoesNotExist:
			return None
		# group = Group.objects.get(groupName=name)
		# return list(group.messages.order_by("date"))[-30:]


	def __str__(self):
		return self.groupName

class Messages(models.Model):
	
	message = models.CharField(max_length=255)
	#date = models.DateTimeField(default=datetime.now())
	date = models.DateTimeField(blank=True, null=True)
	username = models.CharField(max_length=255)
	# date_posted = models.DateTimeField(default=datetime.now)
	parent_group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="messages"
    )





# Create your models here.
