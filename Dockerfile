# BUILD IMAGE -----------------------------------------------------------------
FROM node:16.5.0-alpine3.14 AS build
WORKDIR /usr/src/app
COPY package*.json /usr/src/app
RUN npm ci --only=production

# PRODUCTION IMAGE ------------------------------------------------------------
FROM node:16.5.0-alpine3.14
RUN apk add dumb-init

ENV NODE_ENV production
ENV DBURI postgres://localhost:5432/huntnv

USER node
WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app

EXPOSE 3000
CMD ["dumb-init", "node", "src/server.js"]