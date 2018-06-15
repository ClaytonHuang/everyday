docker network create everyday
docker pull redis:3.2
docker run -d --net "everyday" --name everyday-redis -p 6379:6379 redis:3.2
docker run -d -p 3030:3030 --net "everyday" everyday-server
docker run --rm -it -p 3030:3030 --net "everyday" everyday-server