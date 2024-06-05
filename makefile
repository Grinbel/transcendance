# Define variables for ANSI escape codes.
GREEN := \033[0;32m
RED   := \033[0;41m
NC := \033[0m

# Beginning of makefile variables.
.PHONY: help delete-image build up start down destroy stop restart logs logs-app ps login-server login-app login-db mysql-db del-frontfiles del_backfiles del_dbfiles del_images

THIS_FILE  := $(lastword $(MAKEFILE_LIST))
SERVER     =  nginx
APP        =  wordpress
DATABASE   =  db
YML_DIR    =  ./srcs


# Beginning of makefile rules.
all: up

flush:
	echo "yes" | docker exec -i django python manage.py flush
	@echo "${RED}database flushed ...${NC}"

dbchmod: 
	docker exec -it database bash -c "chmod 777 -R /var/lib/postgresql/data && exit"

dbrevenge :
	docker run --rm -v "./srcs/files/database:/datas" -it debian:buster-slim /bin/bash

push: 
	@echo "${GREEN}pushing to docker hub ...${NC}"
	git add *
	git commit -m "pushing to docker hub" -a 
	git push 
	@echo "${GREEN}pushing finished.${NC}"

build:
	/bin/sh hostnames.sh
	docker compose -f ${YML_DIR}/docker-compose.yml build $(c)
	@echo "${GREEN}build finished.${NC}"

build_nocash:
	docker compose -f ${YML_DIR}/docker-compose.yml build --no-cache $(c)
	@echo "${GREEN}build finished.${NC}"

up: build
	./start_containers.sh
	@echo "${GREEN}containers UP in -detach mode ...${NC}"

nc: build_nocash
	docker compose -V ${YML_DIR}/docker-compose.yml up $(c)
	@echo "${GREEN}containers UP in -detach mode ...${NC}"

db: build
	docker compose -f ${YML_DIR}/docker-compose.yml up backend database
	@echo "${GREEN}containers UP in -detach mode ...${NC}"

startdb:
	docker compose -f ${YML_DIR}/docker-compose.yml start backend database

start:
	docker compose -f ${YML_DIR}/docker-compose.yml start $(c)

down:
	docker compose -f ${YML_DIR}/docker-compose.yml down $(c)
	@echo "${RED}containers are down${NC}"

destroy:
	docker compose -f ${YML_DIR}/docker-compose.yml down -v $(c)
	@echo "${RED}destroying containers and volumes (not equivalent to delete- rules) ...${NC}"

stop:
	docker compose -f ${YML_DIR}/docker-compose.yml stop $(c)

del_containers:
	@docker rm $$(docker ps -aq) -f
	@echo "${RED}containers deleted ...${NC}"

del_frontfiles:
	@rm -rf ./srcs/files/frontend/core/*
	@echo "${GREEN}frontend volume content deleted successfully ...${NC}"

del_backfiles:
	@rm -rf ./srcs/files/backend/core/*
	@echo "${GREEN}backend volume content deleted successfully ...${NC}"

del_dbfiles:
	@rm -rf ./srcs/files/database/*
	@echo "${GREEN}database volume content deleted successfully ...${NC}"

del_all: del_backfiles del_dbfiles del_frontfiles

del_images: destroy
	docker rmi $$(docker images -q)
	@echo "${RED}images deleted ...${NC}"
