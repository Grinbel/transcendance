# users/serializers.py
 
from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from django.core.cache import cache
from uuid import uuid4


def getUuid(id):
  print('id in getUuid', id)
  ticket_uuid = uuid4()
  print('ticket_uuid in getUuid', ticket_uuid)
  cache.set(ticket_uuid, id, 600)
  print('cache.get(ticket_uuid)', cache.get(str(ticket_uuid)))
  return str(ticket_uuid)
 
class UserSerializer(ModelSerializer):
	 
	class Meta:
		model = User
		fields = ['id',
		'otp',
		'otp_expiry_time',
		'username',
		'password',
		'email',
		'is_staff',
		'two_factor',
		'avatar',
		'is_active',
		'tournament_name',
		'language',
		'alias',]
		
		extra_kwargs = {"password": {"write_only": True}}

	def validate_email(self, value):
		print('value in validate_email', value)
		user_id = self.instance.id if self.instance else None
		if User.objects.filter(email=value).exclude(pk=user_id).exists():
			raise ValidationError("Email is already in use.")
		return value

	def create(self, validated_data):
		user = User(username=validated_data["username"],
			  		email=validated_data["email"])
		print('validated-data in serializerrrr', validated_data)
		password = validated_data.pop('password', None)
		user.email = validated_data.pop('email', None)
		
		if password is not None:
			print('password in serializer before hashing', password)
			user.is_active = True
			user.set_password(password)
		user.save()
		return user
	
	def update(self, instance, validated_data):
		print('instance in update', instance)
		# Ensure the email is validated and unique
		email = validated_data.get('email', instance.email)
		if User.objects.filter(email=email).exclude(pk=instance.pk).exists():
			raise ValidationError("Email is already in use.")
		instance.email = email

		# Handle password update if present
		password = validated_data.pop('password', None)
		if password:
			instance.set_password(password)

		# Update other fields
		for attr, value in validated_data.items():
			setattr(instance, attr, value)

		instance.save()
		return instance

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
	@classmethod
	def get_token(cls, user):
		token = super(MyTokenObtainPairSerializer, cls).get_token(user)
		print('User in get_token', user)
		uuid_ticket = 4

		# Add custom claims
		token['username'] = user.username
		token['email'] = user.email
		token['is_staff'] = user.is_staff
		token['two_factor'] = user.two_factor
		token['avatar'] = user.avatar.url if user.avatar else None
		token['is_active'] = user.is_active
		token['uuid'] = uuid_ticket
		token['alias'] = user.alias
		token['tournament'] = user.tournament_name
		token['language'] = user.language
		return token
