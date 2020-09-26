FROM node:latest

RUN mkdir -p /backend

WORKDIR /backend

COPY yarn.lock package.json /backend/

RUN yarn

COPY . /backend/

ENV NODE_ENV=production

EXPOSE $PORT

CMD ["yarn", "start"]
