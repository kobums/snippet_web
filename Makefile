tag=latest

all: run

run:
	npm run dev

build:
	npm run build

docker: build
	docker buildx build --platform linux/amd64 -t kobums/snippet_web:$(tag) --load .

push: build
	docker buildx build --platform linux/amd64 -t kobums/snippet_web:$(tag) --push .

dummy: