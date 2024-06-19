#!/bin/bash

# Run the Django migrations command
echo "LAUNCHER CHECK VARIABLES .... ${DB_HOST} ${DB_PORT}"
while ! nc -z ${DB_HOST} ${DB_PORT}; do
  sleep 2
done
echo "Database server is reachable. Starting Django..."

#python3 manage.py makemigrations

# Apply the migrations
#python3 manage.py migrate
python manage.py collectstatic --noinput
daphne -e ssl:8443:privateKey=/etc/ssl/private/server.key:certKey=/etc/ssl/certs/server.crt project.asgi:application
# daphne -e ssl:443:privateKey=key.pem:certKey=crt.pem django_project.asgi:application