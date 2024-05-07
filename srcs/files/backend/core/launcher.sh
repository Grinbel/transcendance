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
python3 manage.py runserver 0.0.0.0:8000
