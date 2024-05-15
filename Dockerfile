FROM node:iron-alpine3.18 
WORKDIR /app 

USER root

COPY --chown=node:node package*.json .   

ARG POSTGRES_USER
ARG POSTGRES_PASSWORD

ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

RUN npm install

COPY --chown=node:node *  .

USER node
EXPOSE 9001

ENTRYPOINT [ "npm", "run","start" ]


