FROM python:3.11.4-slim-buster


ENV PYTHONUNBUFFERED 1
RUN echo "VIRTUAL ENVIRONMENT INITIALIZATION AND PIP UPGRADE =====>> "
RUN sh -c "python3 -m venv /venv && . /venv/bin/activate"

RUN apt-get update && apt-get install -y netcat
RUN    pip install --upgrade pip
RUN pip install channels

# Copy and install the requirements.txt file into the working directory
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN echo "REQUIREMENTS INSTALLED SUCCESSFULLY =====>> "
WORKDIR /app
# Set the working directory to /backend

#create a new django project called app
RUN django-admin startproject project .

RUN echo "Apply database migrations"
COPY ./core/launcher.sh .
RUN chmod 777 ./launcher.sh
RUN ls -la

# Run the django app on port 8000 on every interface
ENTRYPOINT [ "sh",  "./launcher.sh" ]