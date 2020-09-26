FROM node:latest

RUN mkdir -p /frontend

WORKDIR /frontend

COPY package.json yarn.lock /frontend/

RUN yarn

COPY . /frontend/

EXPOSE 3000

CMD ["yarn", "start"]
