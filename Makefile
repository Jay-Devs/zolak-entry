ENV = docker
SERVICE_NAME = 
COMMAND = ""

up:
	docker compose \
		--env-file .env.$(ENV) \
		up $(SERVICE_NAME) \
		-d \
		--build \
		--pull always \
		--force-recreate \
		--remove-orphans

down:
	docker compose \
		--env-file .env.$(ENV) \
		down \
		--remove-orphans

restart: down up

clear:
	docker compose \
		--env-file .env.$(ENV) \
		down -v

clean-start: clear up

ps:
	docker compose \
		--env-file .env.$(ENV) \
		ps

stop:
	docker compose \
		--env-file .env.$(ENV) \
		stop $(SERVICE_NAME)


exec:
	docker compose \
		--env-file .env.$(ENV) \
		exec $(SERVICE_NAME) $(COMMAND)

logs:
	docker compose \
		--env-file .env.$(ENV) \
		logs -f --tail=300 $(SERVICE_NAME)

run:
	docker compose \
		--env-file .env.$(ENV) \
		run $(SERVICE_NAME) $(COMMAND)
