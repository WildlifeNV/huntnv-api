import fp from 'fastify-plugin'
import { IS_DEV } from '../utils/isDev.js'

export default fp((fastify, opts, next) => {
  fastify.register(import('fastify-swagger'), {
    routePrefix: '_documentation',
    openapi: {
      info: {
        title: 'HuntNV REST API',
        description: 'An API to serve data from the HuntNV database.',
        version: '0.0.1'
      },
      externalDocs: {
        url: 'https:/swagger.io',
        description: 'Find more info here'
      },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    },
    exposeRoute: IS_DEV
  })

  next()
}, { name: 'swagger' })
