# Define variables for ANSI escape codes.
GREEN := \033[0;32m
RED   := \033[0;41m
NC := \033[0m

# Beginning of makefile variables.
.PHONY: help delete-image build up start down destroy stop restart logs logs-app ps login-server login-app login-db mysql-db del-frontfiles del_backfiles del_dbfiles del_images

THIS_FILE 	:= $(lastword $(MAKEFILE_LIST))
SERVER		=  nginx
APP			=  wordpress
DATABASE	=  db
YML_DIR		=  ./srcs


# Beginning of makefile rules.
# init: 
#  		@mkdir -p ./srcs/files/database
		
# 		@mkdir -p ${HOME}/abelhadi/data/wordpress_db/
# 		@echo "${GREEN}directories created successfully for wordpress db/code ...${NC}"
		
# help:
# 		@make -pRrq  -f $(THIS_FILE) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'

all	: up

# to reset database -- delete all data
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
		docker-compose -f ${YML_DIR}/docker-compose.yml build $(c)
		@echo "${GREEN}build finished.${NC}"
build_nocash:
		docker-compose -f ${YML_DIR}/docker-compose.yml build --no-cache $(c)
		@echo "${GREEN}build finished.${NC}"

up:		build
		@trap 'docker-compose -f ${YML_DIR}/docker-compose.yml down; exit 0' SIGINT; \
		docker-compose -f ${YML_DIR}/docker-compose.yml up --renew-anon-volumes $(c)
		@echo "${GREEN}containers UP in -detach mode ...${NC}"
# nocash up
nc:		build_nocash
		docker-compose -V ${YML_DIR}/docker-compose.yml up $(c)
		@echo "${GREEN}containers UP in -detach mode ...${NC}"

# for up only the backend and database
db:	build
		docker-compose -f ${YML_DIR}/docker-compose.yml up backend database
		@echo "${GREEN}containers UP in -detach mode ...${NC}"
# for starting only the backend and database		
startdb:
		docker-compose -f ${YML_DIR}/docker-compose.yml start backend database

start:
		docker-compose -f ${YML_DIR}/docker-compose.yml start $(c)
down:
		docker-compose -f ${YML_DIR}/docker-compose.yml down $(c)
		@echo "${RED}containers are down${NC}"
destroy:
		docker-compose -f ${YML_DIR}/docker-compose.yml down -v $(c)
		@echo "${RED}destroying containers and volumes (not equivalent to delete- rules) ...${NC}"
stop:
		docker-compose -f ${YML_DIR}/docker-compose.yml stop $(c)
# restart:
# 		docker-compose -f ${YML_DIR}/docker-compose.yml stop $(c)
# 		docker-compose -f ${YML_DIR}/docker-compose.yml up -d $(c)
# logs:
# 		docker-compose -f ${YML_DIR}/docker-compose.yml logs --tail=100 -f $(c)
# logs-app:
# 		docker-compose -f ${YML_DIR}/docker-compose.yml logs --tail=100 -f ${APP}
# ps:
# 		docker-compose -f ${YML_DIR}/docker-compose.yml ps
# login-server:
# 		docker-compose -f ${YML_DIR}/docker-compose.yml exec ${SERVER} /bin/bash
# login-app:
# 		docker-compose -f ${YML_DIR}/docker-compose.yml exec ${APP} /bin/bash
# login-db:
# 		docker-compose -f ${YML_DIR}/docker-compose.yml exec ${DATABASE} /bin/bash
# mysql-db:
# 		docker-compose -f ${YML_DIR}/docker-compose.yml exec ${DATABASE} mysql --host=localhost

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
del_all	:	del_backfiles del_dbfiles del_frontfiles
		
del_images: destroy
		docker rmi $$(docker images -q)
		@echo "${RED}images deleted ...${NC}"
