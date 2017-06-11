FROM node:8.1.0
WORKDIR "/app"
ENTRYPOINT ["node","client"]
EXPOSE 8888