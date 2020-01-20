FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

RUN rm -rf ./node_modules

RUN npm install

EXPOSE 10009

CMD [ "npm", "start" ]