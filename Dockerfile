FROM --platform=linux/arm64 node:18-alpine
WORKDIR /app 

USER root

COPY --chown=node:node package*.json ./

ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ARG DB_HOST
ARG DB_PORT

ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_NAME=${DB_NAME}
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
RUN npm install

COPY --chown=node:node . ./


RUN npm run build 

RUN chmod +x /app/start.sh

USER node
EXPOSE 9001

ENTRYPOINT ["/app/start.sh"]


