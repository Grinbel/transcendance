"""
ASGI config for project project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application

django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from middle.middleware import JwtAuthMiddlewareStack
import chat.routing



os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')

application = ProtocolTypeRouter(
	{
		'https': django_asgi_app,
		'websocket':JwtAuthMiddlewareStack(
			URLRouter(
				chat.routing.websocket_urlpatterns
			)
		)
	}
)
