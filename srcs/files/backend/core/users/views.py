# from rest_framework.response import Response
# from rest_framework.decorators import api_view
# from rest_framework.views import APIView
# from .models import User
# from .serializers import UserSerializer
# from
# from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from .serializers import UserSerializer
from .permissions import UserPermission
from .models import User
 
class UserViewSet(ModelViewSet):
 
    serializer_class = UserSerializer
    queryset = User.objects.all().order_by("-date_joined")
    permission_classes = [UserPermission,]

# class register(APIView):
# 	def post(self, request):
# 		serializer = UserSerializer(data=request.data)
# 		if serializer.is_valid():
# 			serializer.save()
# 			return Response(serializer.data, status=status.HTTP_201_CREATED)
# 		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET'])
# def get_users(request):
# 	if request.method == 'GET':
# 		profiles = Profile.objects.all()
# 		serializer = UserSerializer(profiles, many=True)
# 		return Response(serializer.data)
	
# @api_view(['GET'])
# def get_user(request, pk):
# 	try:
# 		profile = Profile.objects.get(pk=pk)
# 	except Profile.DoesNotExist:
# 		return Response(status=status.HTTP_404_NOT_FOUND)

# 	if request.method == 'GET':
# 		serializer = UserSerializer(profile)
# 		return Response(serializer.data)

# @api_view(['POST'])
# def create_profile(request):
# 	if request.method == 'POST':
# 		serializer = UserSerializer(data=request.data)
# 		if serializer.is_valid():
# 			serializer.save()
# 			return Response(serializer.data, status=status.HTTP_201_CREATED)
# 		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	
# @api_view(['PUT'])
# def update_profile(request, pk):
# 	try:
# 		profile = Profile.objects.get(pk=pk)
# 	except Profile.DoesNotExist:
# 		return Response(status=status.HTTP_404_NOT_FOUND)

# 	if request.method == 'PUT':
# 		serializer = UserSerializer(profile, data=request.data)
# 		if serializer.is_valid():
# 			serializer.save()
# 			return Response(serializer.data)
# 		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['DELETE'])
# def delete_profile(request, pk):
# 	try:
# 		profile = Profile.objects.get(pk=pk)
# 	except Profile.DoesNotExist:
# 		return Response(status=status.HTTP_404_NOT_FOUND)

# 	if request.method == 'DELETE':
# 		profile.delete()
# 		return Response(status=status.HTTP_204_NO_CONTENT)



# from django.shortcuts import render
# Create your views here.
# import json
# from django.http import JsonResponse
# from django.contrib.auth import authenticate, login, logout
# from django.views.decorators.csrf import ensure_csrf_cookie
# from django.views.decorators.http import require_POST

# from rest_framework.response import Response

# @require_POST
# def login_view(request):
# 	print('login_view')
# 	data = json.loads(request.body)
# 	username = data['username']
# 	password = data['password']
# 	user = authenticate(request, username=username, password=password)
# 	if user is not None:
# 		login(request, user)
# 		return JsonResponse({'message': 'You are logged in.'})
# 	return JsonResponse({'message': 'Invalid credentials.'}, status=401)

# def logout_view(request):
# 	if not request.user.is_authenticated:
# 		return JsonResponse({'you are not logged in.'}, status=401)
# 	logout(request)
# 	return JsonResponse({'message': 'You are logged out.'})

# @ensure_csrf_cookie
# def session_view(request):
# 	if not request.user.is_authenticated:
# 		return JsonResponse({'isauthenticated': False})
# 	return JsonResponse({'isauthenticated': True})

# def whoami_view(request):
# 	if not request.user.is_authenticated:
# 		return JsonResponse({'username': None})
# 	return JsonResponse({'username': request.user.username})