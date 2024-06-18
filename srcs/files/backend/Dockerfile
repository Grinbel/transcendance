FROM python:3.11.4-slim-buster


ENV PYTHONUNBUFFERED 1
RUN echo "VIRTUAL ENVIRONMENT INITIALIZATION AND PIP UPGRADE =====>> "
RUN sh -c "python3 -m venv /venv && . /venv/bin/activate"

RUN apt-get update && apt-get install -y netcat openssl
RUN    pip install --upgrade pip


# to generate the SSL certificates:
# openssl genrsa -out ./files/ssl/private/server.key 2048
# openssl req -new -key ./files/ssl/private/server.key -out ./files/ssl/private/server.csr -subj "/CN=transcendance"
# openssl x509 -req -days 365 -in ./files/ssl/private/server.csr -signkey ./files/ssl/private/server.key -out ./files/ssl/certs/server.crt

# Use the shared SSL certificates
RUN mkdir -p /etc/ssl/private /etc/ssl/certs
COPY ../ssl/private/server.key /etc/ssl/private/server.key
COPY ../ssl/certs/server.crt /etc/ssl/certs/server.crt

# Copy and install the requirements.txt file into the working directory
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN echo "REQUIREMENTS INSTALLED SUCCESSFULLY =====>> "
WORKDIR /app
# Set the working directory to /backend


RUN django-admin startproject project .
ENV DJANGO_SETTINGS_MODULE='project.settings'
ENV DJANGO_ALLOW_ASYNC_UNSAFE='true'

RUN echo "Apply database migrations"
COPY ./core/launcher.sh .
RUN chmod 777 ./launcher.sh
RUN ls -la

ENTRYPOINT [ "sh",  "./launcher.sh" ]