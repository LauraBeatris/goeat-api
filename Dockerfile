FROM node:12

COPY ./ /app

WORKDIR /app

RUN yarn install

CMD ["yarn", "start"]

EXPOSE 3000
