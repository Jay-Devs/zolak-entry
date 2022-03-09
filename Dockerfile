#FROM node:lts-alpine as builder
FROM alpine:3.15

# update packages, to reduce risk of vulnerabilities
#RUN apk update && apk upgrade
# RUN apk cache clean
RUN apk add yarn

# set a non privileged user to use when running this image
RUN addgroup -S zolak --gid 501 && adduser -S zolak --uid 500 -G zolak
USER zolak
# set right (secure) folder permissions
RUN mkdir -p /home/zolak/app/node_modules && chown -R zolak:zolak /home/zolak/app

WORKDIR /home/zolak/app

# set default node env
# to be able to run tests (for example in CI), do not set production as environment
ENV NODE_ENV=production

ENV NPM_CONFIG_LOGLEVEL=warn

# copy project definition/dependencies files, for better reuse of layers
COPY --chown=zolak:zolak package*.json ./

# install dependencies here, for better reuse of layers
#RUN npm install
#RUN npm cache clean --force
RUN yarn

# copy all sources in the container (exclusions in .dockerignore file)
COPY --chown=zolak:zolak . .

EXPOSE 3001

# ENTRYPOINT [ "npm" ]
CMD [ "yarn", "start" ]
