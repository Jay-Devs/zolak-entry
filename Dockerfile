FROM alpine:3.15

RUN apk add yarn

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

CMD [ "yarn", "start" ]
