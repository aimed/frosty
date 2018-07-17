FROM node:alpine

RUN mkdir /app
WORKDIR /app

COPY . /app

# App port | Debug port
EXPOSE 3000 5858

RUN cd /app/server
RUN yarn install

CMD ["yarn", "start"]