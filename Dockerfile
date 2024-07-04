FROM node:iron-alpine3.18 
WORKDIR /app 

USER root

COPY --chown=node:node package*.json ./

ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB
ARG DB_HOST
ARG DB_PORT

ENV POSTGRES_USER=${DB_USER}
ENV POSTGRES_PASSWORD=${DB_PASSWORD}
ENV POSTGRES_DB=${DB_NAME}
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
RUN npm install

COPY --chown=node:node . ./


RUN npm run build 

RUN chmod +x /app/start.sh

USER node
EXPOSE 9001

ENTRYPOINT ["/app/start.sh"]


