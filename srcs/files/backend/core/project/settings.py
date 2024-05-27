"""
Django settings for project project.


Generated by 'django-admin startproject' using Django 5.0.2.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from datetime import timedelta
from pathlib import Path
from users.permissions import UserPermission
import os

from dotenv import load_dotenv

load_dotenv()
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
ALLOWED_HOSTS = ['localhost', '0.0.0.0', '127.0.0.1','*']
AUTH_USER_MODEL = "users.User"
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-+f$6n=$1s3ol8jgaenlmo9cu=-byy2*x=5)!evng!+0iu-e9vj'
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
ASGI_APPLICATION = 'project.asgi.application'

CHANNEL_LAYERS = {
	'default': {
		'BACKEND': 'channels.layers.InMemoryChannelLayer'
	},
}

# CHANNEL_LAYERS = {
#     "default": {
#         "BACKEND": "channels_redis.core.RedisChannelLayer",
#         "CONFIG": {
#             "hosts": [("localhost", 8000)],
#         },
#     },
# }

# Application definition

INSTALLED_APPS = [
	'channels',
	'daphne',
    'tournament',
    'game',
    'chat',
	'corsheaders',
	'matchmaking',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework_simplejwt',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
	'users',
]

MIDDLEWARE = [
	'corsheaders.middleware.CorsMiddleware',

    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    # 'channels.middleware.AuthMiddlewareStack',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
]

ASGI_APPLICATION = 'project.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
    # 'DEFAULT_PERMISSION_CLASSES': (
    #     'users.permissions.UserPermission',
    # ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSIONS_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

ROOT_URLCONF = 'project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI_APPLICATION = 'project.wsgi.application'
APPEND_SLASH = False

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
DB_PASSWORD = os.environ.get('DB_PASSWORD')
if (DB_PASSWORD == None):
    print('No DB_PASSWORD found in .env file')

#print all env variables
print('DB_NAME:', os.environ.get('DB_NAME'))
print('DB_USER:', os.environ.get('DB_USER'))
print('DB_PASSWORD:', os.environ.get('DB_PASSWORD'))
print('DB_HOST:', os.environ.get('DB_HOST'))
print('DB_PORT:', os.environ.get('DB_PORT'))


DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DB_ENGINE', 'django.db.backends.postgresql'),
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST' ),
        'PORT': os.environ.get('DB_PORT'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/
# https://pypi.org/project/drf-simple-jwt-2fa/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Paris'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

#security settings
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True
# CORS_ALLOWED_ORIGINS = [
#     'http://0.0.0.0:5173',
#     'http://localhost:5173',
#     'http://0.0.0.0:8000',
# 	'*:5173',
# 	'*:8000',
# 	'*'
# 	'c1r2p6:5173',
# 	'c1r2p6:8000',

#     # 'http://your-production-url.com',
# ]
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]


CSRF_TRUSTED_ORIGINS = ['http://localhost:5173/',
                        'http://0.0.0.0:8000/',


]
CSRF_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SECURE = 'True'

# CSRF_COOKIE_HTTPONLY = False
# SESSION_COOKIE_HTTPONLY = True

#for production
#CSRF_COOKIE_HTTPONLY = True
#SESSION_COOKIE_HTTPONLY = True

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,

    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": "",
    "AUDIENCE": None,
    "ISSUER": None,
    "JSON_ENCODER": None,
    "JWK_URL": None,
    "LEEWAY": 0,

    "AUTH_HEADER_TYPES": ("Baerer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

    "JTI_CLAIM": "jti",

    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),

    # "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
    "TOKEN_OBTAIN_SERIALIZER": "users.serializers.MyTokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}


# Email backend
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# The hostname of your SMTP server
EMAIL_HOST = 'smtp.gmail.com'  # for example, if you're using Gmail's SMTP server

# The port your SMTP server is listening on
EMAIL_PORT = 587  # for example, if you're using Gmail's SMTP server

# Whether to use a secure TLS connection when connecting to the SMTP server
EMAIL_USE_TLS = True

# The username to use when authenticating with the SMTP server
EMAIL_HOST_USER = os.environ.get('MAIL_USER') # replace with your actual email

# The password to use when authenticating with the SMTP server
EMAIL_HOST_PASSWORD = os.environ.get('MAIL_PASS')  # replace with your actual email password



