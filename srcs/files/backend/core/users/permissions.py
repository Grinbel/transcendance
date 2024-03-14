from rest_framework import permissions
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from django.db import models
 
class UserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # For a 'list' action, the request method would be 'GET' and the URL would not include a pk
        if request.method == 'GET' and not view.kwargs.get('pk'):
            return True
            # return request.user.is_staff

        # For a 'create' action, the request method would be 'POST'
        if request.method == 'POST':
            return request.user.is_staff

        # For a 'retrieve', 'update', or 'partial_update' action, the request method would be 'GET', 'PUT', or 'PATCH' and the URL would include a pk
        if request.method in ['GET', 'PUT', 'PATCH'] and view.kwargs.get('pk'):
            return True

        # For a 'destroy' action, the request method would be 'DELETE'
        if request.method == 'DELETE':
            return request.user.is_staff

        return False