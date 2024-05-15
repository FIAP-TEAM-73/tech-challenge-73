FROM node:iron-alpine3.18 AS backend
WORKDIR /app 
COPY package.json . 
COPY package-lock.json . 

RUN npm ci 

COPY *  .


EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]