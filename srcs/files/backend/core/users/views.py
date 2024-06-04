# from rest_framework.response import Response
# from rest_framework.decorators import api_view
# from rest_framework.views import APIView
# from .models import User
# from .serializers import UserSerializer
# from
# from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail

from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import APIException

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import MyTokenObtainPairSerializer
from .serializers import UserSerializer
from .permissions import UserPermission
from .models import User
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from .helper import authenticate
import random
import os
 
##remember to check USER_ID_FIELD and USER_ID_CLAIM in jwt settings in case picking the email adress as the user id


# class Login(TokenObtainPairView):
#     permission_classes = [permissions.AllowAny]
#     serializer_class = MyTokenObtainPairSerializer

#     def post(self, request, *args, **kwargs):
#         print('request.data', request.data)
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         return Response(serializer.validated_data, status=status.HTTP_200_OK)

def generate_random_digits(n=6):
	return "".join(map(str, random.sample(range(0, 10), n)))

# give me a function that gets me user informations when receiving the correspondent token



@api_view(['GET'])
def getProfile(request):
	print('getProfile function request ')
	# return Response({'detail': 'Invalid token format'}, status=status.HTTP_401_UNAUTHORIZED)

	if 'Authorization' in request.headers and len(request.headers['Authorization'].split(' ')) > 1:
		token = request.headers.get('Authorization').split(' ')[1]
		print('token', token)
		try:
			untyped_token = UntypedToken(token)
			print('untyped_token', untyped_token)
		except (InvalidToken, TokenError) as e:
			print('Invalid token')
			return Response({'detail': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
		print('untyped_token', untyped_token)
		id = untyped_token['user_id']
		user = User.objects.get(id=id)
		# Now you have the user instance and can return the necessary information
		user_data = UserSerializer(user).data
		print('user_data', user_data)
		return Response(user_data)
	return Response({'detail': 'Invalid token format'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def userlist(request):
	otheruser = request.data.get('other')
	self = request.data.get('self')
	action = request.data.get('action')
	user = User.objects.get(username=self)
	other = User.objects.get(username=otheruser)
	if (other is None):
		return Response({'detail': 'Invalid user'})
	if (action == 'addfriend'):
		user.addFriend(otheruser)
	elif (action == 'unfriend'):
		user.removeFriend(otheruser)
	elif (action == 'block'):
		user.addBlacklist(otheruser)
	elif (action == 'unblock'):
		user.removeBlacklist(otheruser)
	# print('user black list : ',user.blacklist.all())
	return Response({'detail': 'Done'})


@api_view(['POST'])
def userFriendList(request):
	username = request.data.get('username')
	user = User.objects.get(username=username)
	friends = user.friends.all()
	usernames = [friend.username for friend in friends]
	return Response({'friends': usernames})



@api_view(['POST'])
def userExist(request):
	username = request.data.get('username')
	if User.objects.filter(username=username).exists():
		return Response({'detail': 'User exists'})
	return Response({'detail': 'User does not exist'})

@api_view(['POST'])
def userFriendBlock(request):
	friend = request.data.get('friend')
	self = request.data.get('self')

	# return Response({'detail': 'Invalid user'})
	user = User.objects.get(username=self)
	other = User.objects.get(username=friend)

	if (other is None or user is None):
		return Response({'detail': 'Invalid user','friend': 0, 'block': 0})
	elif (user == other):
		return Response({'detail': 'You cannot block yourself','friend': 0, 'block': 0})
	isFriend = user.friends.filter(username=friend).exists()
	isBlacklisted = user.blacklist.filter(username=friend).exists()
	return Response({'friend': isFriend, 'block': isBlacklisted})

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def login(request):
	print('login function')
	email = request.data.get('email')
	username = request.data.get('username')
	password = request.data.get('password')

	print('request.data', request.data)
	user = authenticate(request, username=username, password=password)
	#print for me all the users available and their passwords unhashed
	print('user is', user)
	#####
	if user is not None:
	# User credentials are valid, proceed with code generation and email sending
		user_obj = User.objects.get(id=user.id)
		data = {'username': user_obj.username, 'password': password}
		if user_obj.two_factor == False:
			token_serializer = MyTokenObtainPairSerializer(data=data)
			print('token_serializer without 2FA', token_serializer)
			try:
				if (token_serializer.is_valid(raise_exception=True)):
					print('validated_data ok without 2FA', token_serializer.validated_data)
					return Response(token_serializer.validated_data, status=status.HTTP_200_OK)
				else:
					return Response(token_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
			except Exception as e:
				raise APIException("Internal server error. Please try again later.")
			

	###### 2FA implementation ######
		
		# Generate a 6-digit code and set the expiry time to 1 hour from now
		verification_code = generate_random_digits(6)
		print('verification_code', verification_code)
		user_obj.otp = verification_code
		user_obj.otp_expiry_time = timezone.now() + timedelta(hours=1)
		print('user_obj.otp_expiry_time', user_obj.otp_expiry_time)
		user_obj.save()
		# Send the code via email (use Django's send_mail function)
		print('distant email', user_obj.email)
		print('os.environ.get(MAIL_USER): ', os.environ.get('MAIL_USER'))
		send_mail(
			'Verification Code',
			f'Your verification code is: {user_obj.otp}',
			os.environ.get('MAIL_USER'),
			[user_obj.email],
			fail_silently=False,
		)
		print('email sent')
		return Response({'detail': 'Verification code sent successfully.'}, status=status.HTTP_200_OK)

	return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify(request):
	print('verify function')
	username = request.data.get('username')
	password = request.data.get('password')
	received_otp = request.data.get('otp')

	user_profile = User.objects.get(username=username)
	print('user_profile', user_profile)
		# Check if the verification code is valid and not expired
	if (
		user_profile is not None and
		user_profile.otp == received_otp and
		user_profile.otp_expiry_time is not None and
		user_profile.otp_expiry_time > timezone.now()
	):
		# Verification successful, generate access and refresh tokens
		# django_login(request, user)
		# Implement your token generation logic here
		data = {'username': user_profile.username, 'password': password}
		token_serializer = MyTokenObtainPairSerializer(data=data)
		print('token_serializer', token_serializer)
		try:
			if (token_serializer.is_valid(raise_exception=True)):
				print('token_serializer.validated_data', token_serializer.validated_data)
				# Reset verification otp_code and expiry time
				user_profile.otp = ''
				user_profile.otp_expiry_time = None
				user_profile.save()
				return Response(token_serializer.validated_data, status=status.HTTP_200_OK)
		except Exception as e:
			print('Exception', e)
		# Use djangorestframework_simplejwt to generate tokens
		# refresh = RefreshToken.for_user(user)
		# access_token = str(refresh.access_token)
	return Response({'detail': 'Invalid verification code or credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
			

class Signup(APIView):
	permission_classes = [AllowAny]

	def post(self, request, format='json'):
		serializer_context = {
			'request': request,
		}
		print('request.data', request.data)
		
		serializer = UserSerializer(data=request.data, context=serializer_context)
		if serializer.is_valid():
			user = serializer.save()
			if user:
				json = serializer.data
				return Response(json, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	

class Logout(APIView):
	permission_classes = [AllowAny]

	def post(self, request, format='json'):
		try:
			refresh_token = request.data["refresh_token"]
			token = RefreshToken(refresh_token) # create a RefreshToken instance from the refresh token obtained to access the Class methods as blacklist()
			token.blacklist()
			return Response(status=status.HTTP_205_RESET_CONTENT)
		except Exception as e:
			print('Exception', e)
			return Response(status=status.HTTP_400_BAD_REQUEST)
	
class UserList(APIView):
	permission_classes = [AllowAny]
	def get(self, request, format=None):
		print('UserList get function')
		users = User.objects.all()
		print('users', users)
		serializer = UserSerializer(users, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)