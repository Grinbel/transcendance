#!/bin/bash

# Run the Django migrations command
python3 manage.py makemigrations .

# Apply the migrations
python3 manage.py migrate
