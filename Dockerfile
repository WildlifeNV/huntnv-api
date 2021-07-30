FROM node:16.5.0-alpine3.14
RUN apk add dumb-init

ENV NODE_ENV production
ENV DBURI postgres://localhost:5432/huntnv

WORKDIR /usr/src/app
COPY --chown=node:node . /usr/src/app

RUN npm ci --only=production
USER node
CMD ["dumb-init", "node", "src/server.js"]