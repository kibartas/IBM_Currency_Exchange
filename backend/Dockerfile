FROM node:latest

RUN mkdir -p /backend

WORKDIR /backend

COPY yarn.lock package.json /backend/

RUN yarn

COPY . /backend/

EXPOSE 8080

CMD ["yarn", "start"]
