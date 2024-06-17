FROM python:3.11.4-slim-buster


ENV PYTHONUNBUFFERED 1
RUN echo "VIRTUAL ENVIRONMENT INITIALIZATION AND PIP UPGRADE =====>> "
RUN sh -c "python3 -m venv /venv && . /venv/bin/activate"

RUN apt-get update && apt-get install -y netcat openssl
RUN    pip install --upgrade pip

RUN echo "OPENSSL CERTIFS =====>> "
RUN openssl genrsa -out  ./etc/ssl/private/AAAserver.key 2048
RUN openssl req -new -key ./etc/ssl/private/AAAserver.key -out AAAserver.csr -subj '/CN=transcendance'
RUN openssl x509 -req -days 365 -in AAAserver.csr -signkey ./etc/ssl/private/AAAserver.key -out ./etc/ssl/certs/AAAserver.crt

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