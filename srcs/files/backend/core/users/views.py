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
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
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
from tournament.models import Tournament
from .models import User
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from .helper import authenticate
import random
import os
import logging
 
##remember to check USER_ID_FIELD and USER_ID_CLAIM in jwt settings in case picking the email adress as the user id


# a  view that updates user data partially first approach
# @api_view(['PATCH'])
# def updateUser(request):
# 	#print("updateUser function")
# 	# check authentication
# 	if 'Authorization' in request.headers and len(request.headers['Authorization'].split(' ')) > 1:
# 		token = request.headers.get('Authorization').split(' ')[1]
# 		try:
# 			untyped_token = UntypedToken(token)
# 		except (InvalidToken, TokenError) as e:
# 			#print('updateUser Invalid token')
# 			return Response({'detail': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
# 		# #print('updateUser untyped_token', untyped_token)
# 		id = untyped_token['user_id']
# 		newpassword = request.data.get('password')
# 		newusername = request.data.get('username')
# 		newemail = request.data.get('email')
# 		newalias = request.data.get('alias')

# 		try:
# 			user = User.objects.get(id=id)
# 			if (newpassword is not None):
# 				user.is_active = True
# 				user.set_password(newpassword)
# 			user.username = newusername
# 			user.email = newemail
# 			user.alias = newalias
# 			user.save()
# 			return Response({'detail': 'User updated successfully.'}, status=status.HTTP_200_OK)
# 		except User.DoesNotExist:
# 			return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
# 		except Exception as e:
# 			#print(f'Error updating user data: {e}')
# 			return Response({'detail': 'An error occurred while updating user data.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
def updateUser(request, pk):
    #print('userUpdate function request DATA ////// >>>>>:', request.data)
    try:
        user = User.objects.get(pk=pk)
        #print('user found with his id in updateUser', user)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check for email uniqueness if email is being updated
    if 'email' in request.data:
        email = request.data['email']
        if User.objects.filter(email=email).exclude(pk=pk).exists():
            return Response({'email': 'Email is already in use.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        #print('serializer is valid, saving data:', serializer.validated_data)
        serializer.save()
        #print('user updated successfully: >>', serializer.data)
        return Response(serializer.data)
    
    #print('user not updated successfully: >>', serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def generate_random_digits(n=6):
	return "".join(map(str, random.sample(range(0, 10), n)))

@api_view(['GET'])
def getProfile(request):
	#print('getProfile function request ')
	# return Response({'detail': 'Invalid token format'}, status=status.HTTP_401_UNAUTHORIZED)

	if 'Authorization' in request.headers and len(request.headers['Authorization'].split(' ')) > 1:
		token = request.headers.get('Authorization').split(' ')[1]
		try:
			untyped_token = UntypedToken(token)
		except (InvalidToken, TokenError) as e:
			return Response({'detail': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
		id = untyped_token['user_id']
		user = User.objects.get(id=id)
		# Now you have the user instance and can return the necessary information
		user_data = UserSerializer(user).data
		#print('getprofile user_data', user_data)
		return Response(user_data)
	return Response({'detail': 'Invalid token format'}, status=status.HTTP_401_UNAUTHORIZED)

# a  view that receives and sets  the 2FA preference of a user
@api_view(['POST'])
def set2FA(request):
	#print("set 2FA")
	# check authentication
	if 'Authorization' in request.headers and len(request.headers['Authorization'].split(' ')) > 1:
		token = request.headers.get('Authorization').split(' ')[1]
		try:
			untyped_token = UntypedToken(token)
		except (InvalidToken, TokenError) as e:
			return Response({'detail': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
		id = untyped_token['user_id']
		two_factor = request.data.get('two_factor')
		if	two_factor is None:
			return Response({'detail': 'two_factor field are required.'}, status=status.HTTP_400_BAD_REQUEST)
		if not isinstance(two_factor, bool):
			return Response({'detail': 'Invalid value for two_factor. It must be a boolean.'}, status=status.HTTP_400_BAD_REQUEST)
		try:
			user = User.objects.get(id=id)
			user.two_factor = two_factor
			user.save()
			return Response({'detail': '2FA preference updated successfully.'}, status=status.HTTP_200_OK)
		except User.DoesNotExist:
			return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			return Response({'detail': 'An error occurred while updating 2FA preference.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
	# #print('user black list : ',user.blacklist.all())
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
	#print('login function')
	email = request.data.get('email')
	username = request.data.get('username')
	password = request.data.get('password')

	#print('request.data', request.data)
	user = authenticate(request, username=username, password=password)
	#print for me all the users available and their passwords unhashed
	#print('user is', user)
	#####
	if user is not None:
	# User credentials are valid, proceed with code generation and email sending
		user_obj = User.objects.get(id=user.id)

		data = {'username': user_obj.username, 'password': password}
		token_serializer = MyTokenObtainPairSerializer(data=data)
		if user_obj.two_factor == False:
			#print('token_serializer without 2FA', token_serializer)
			try:
				if (token_serializer.is_valid(raise_exception=True)):
					#print('validated_data ok without 2FA', token_serializer.validated_data)
					user_obj.status = 'available'
					user_obj.save()
					return Response(token_serializer.validated_data, status=status.HTTP_200_OK)
				else:
					return Response(token_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
			except Exception as e:
				raise APIException("Internal server error. Please try again later.")
			

		###### 2FA implementation ######
		# Generate a 6-digit code and set the expiry time to 1 hour from now
		verification_code = generate_random_digits(6)
		#print('verification_code', verification_code)
		user_obj.otp = verification_code
		user_obj.otp_expiry_time = timezone.now() + timedelta(hours=1)
		#print('user_obj.otp_expiry_time', user_obj.otp_expiry_time)
		user_obj.save()
		# Send the code via email (use Django's send_mail function)
		#print('distant email', user_obj.email)
		#print('os.environ.get(MAIL_USER): ', os.environ.get('MAIL_USER'))
		send_mail(
			'Verification Code',
			f'Your verification code is: {user_obj.otp}',
			os.environ.get('MAIL_USER'),
			[user_obj.email],
			fail_silently=False,
		)
		#print('email sent')

		return Response({'detail': 'Verification code sent successfully.', 'two_factor': user_obj.two_factor}, status=status.HTTP_200_OK)
	return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify(request):
	#print('verify function')
	username = request.data.get('username')
	password = request.data.get('password')
	received_otp = request.data.get('otp')

	user_profile = User.objects.get(username=username)
	#print('user_profile', user_profile)
	#print('user_profile.otp', user_profile.otp)
	#print('received_otp', received_otp)
	#print('user_profile.otp_expiry_time', user_profile.otp_expiry_time)
	#print('timezone.now()', timezone.now())
	if (user_profile.status != 'away'):
			return Response({'detail': 'User is not available'}, status=status.HTTP_401_UNAUTHORIZED)
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
		#print('token_serializer', token_serializer)
		try:
			#print('verify tryblock')
			if (token_serializer.is_valid(raise_exception=True)):
				#print('token_serializer.validated_data', token_serializer.validated_data)
				# Reset verification otp_code and expiry time
				user_profile.otp = ''
				user_profile.otp_expiry_time = None
				user_profile.status = 'available'
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
		#print('request.data', request.data)
		
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
		
		#print("username ", request.data)

		try:
			refresh_token = request.data["refresh_token"]
			token = RefreshToken(refresh_token) # create a RefreshToken instance from the refresh token obtained to access the Class methods as blacklist()
			token.blacklist()
			user_id = token['user_id']  # Get the user ID from the token
			user = User.objects.get(id=user_id)  # Get the user from the user ID
			user.status = 'away'
			channel_layer = get_channel_layer()
			async_to_sync(channel_layer.group_send)(
				'general',
				{
					'type': 'logoutWeb',
					'username': user.username,
				}
			)
			tournaments = Tournament.objects.all()
			for tournament in tournaments:
				if (tournament.players.filter(id=user.id).exists()):
					tournament.removeUser(user)
					tournament.save()
					if (tournament.players.count() <= 0):
						tournament.players.clear()
						tournament.delete()
					tournament.save()
			user.save()

			#remove user from tournament
			if (Tournament.objects.filter(players=user).exists()):
				tournament = Tournament.objects.get(players=user)
				tournament.removeUser(user)
				tournament.save()
				
				if (tournament.players.count() <= 0):
					tournament.delete()
			user.save()
			return Response(status=status.HTTP_205_RESET_CONTENT)
		except Exception as e:
			#print('Exception', e)
			return Response(status=status.HTTP_400_BAD_REQUEST)
	
class UserList(APIView):
	permission_classes = [AllowAny]
	def get(self, request, format=None):
		#print('UserList get function')
		users = User.objects.all()
		#print('users', users)
		serializer = UserSerializer(users, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)
	
@api_view(['POST'])
def language(request):
	
	username = request.data.get('username')
	language = request.data.get('language')
	user = User.objects.get(username=username)
	user.language = language
	user.save()
	return Response({'detail': 'Language updated successfully.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def avatar(request):
	print('avatar function')
	username = request.data.get('username')
	avatar = request.data.get('avatar')
	user = User.objects.get(username=username)
	user.avatar = avatar
	user.save()
	return Response({'detail': 'Avatar updated successfully.'}, status=status.HTTP_200_OK)
