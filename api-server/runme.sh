docker stop api-server

docker build -t api-server .


docker run -p 5555:5555 -it -d --rm --name api-server api-server