FROM alpine:3.15
RUN apk add yarn
WORKDIR /app
COPY . ./
RUN yarn
CMD [ "yarn", "start" ]
