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
# 		@mkdir -p ${HOME}/abelhadi/data/wordpress_code/
# 		@mkdir -p ${HOME}/abelhadi/data/wordpress_db/
# 		@echo "${GREEN}directories created successfully for wordpress db/code ...${NC}"
		
# help:
# 		@make -pRrq  -f $(THIS_FILE) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'

push:
		@echo "${GREEN}pushing to docker hub ...${NC}"
		git add *
		git commit -m "pushing to docker hub" -a 
		git push 
		@echo "${GREEN}pushing finished.${NC}"

build:
		docker-compose -f ./srcs/docker-compose.yml build 
		@echo "${GREEN}build finished.${NC}"
build_nocash:
		docker-compose -f ./srcs/docker-compose.yml build --no-cache 
		@echo "${GREEN}build finished.${NC}"
up:		build
		docker-compose -f ./srcs/docker-compose.yml up  
		@echo "${GREEN}containers UP in -detach mode ...${NC}"
# nocash up
upnc:		build_nocash
		docker-compose -f ./srcs/docker-compose.yml up 
		@echo "${GREEN}containers UP in -detach mode ...${NC}"

start:
		docker-compose -f ./srcs/docker-compose.yml start 
down:
		docker-compose -f ./srcs/docker-compose.yml down 
		@echo "${RED}containers are down${NC}"
destroy:
		docker-compose -f ./srcs/docker-compose.yml down -v 
		@echo "${RED}destroying containers and volumes (not equivalent to delete- rules) ...${NC}"
stop:
		docker-compose -f ./srcs/docker-compose.yml stop 
# restart:
# 		docker-compose -f ./srcs/docker-compose.yml stop 
# 		docker-compose -f ./srcs/docker-compose.yml up -d 
# logs:
# 		docker-compose -f ./srcs/docker-compose.yml logs --tail=100 -f 
# logs-app:
# 		docker-compose -f ./srcs/docker-compose.yml logs --tail=100 -f ${APP}
# ps:
# 		docker-compose -f ./srcs/docker-compose.yml ps
# login-server:
# 		docker-compose -f ./srcs/docker-compose.yml exec ${SERVER} /bin/bash
# login-app:
# 		docker-compose -f ./srcs/docker-compose.yml exec ${APP} /bin/bash
# login-db:
# 		docker-compose -f ./srcs/docker-compose.yml exec ${DATABASE} /bin/bash
# mysql-db:
# 		docker-compose -f ./srcs/docker-compose.yml exec ${DATABASE} mysql --host=localhost

del_frontfiles:
		@rm -rf ./srcs/files/frontend/*
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