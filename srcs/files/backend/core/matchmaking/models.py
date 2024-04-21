from django.db import models

# Create your models here.
class room(models.Model):
	name = models.CharField(max_length=255)
	max_capacity = models.IntegerField(default=2)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	users = models.ManyToManyField('users.User', related_name='room', blank=True)

	def __str__(self):
		return f"room name = {self.name} \n max capacity = {self.max_capacity}"