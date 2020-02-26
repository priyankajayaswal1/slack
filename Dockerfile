# getting base image
FROM node
WORKDIR /app
COPY package.json /app
COPY . /app
RUN sh script/bootstrap
RUN apt-get update &&  apt-get install -y redis-server postgresql postgresql-contrib postgresql-client
EXPOSE 3000
CMD [ "./run_services.sh"]
