import autoload from 'fastify-autoload'
import printRoutes from 'fastify-print-routes'
import fastifyEnv from 'fastify-env'
import fastifyCors from 'fastify-cors'
import { join } from 'desm'
import { IS_DEV } from './utils/isDev.js'

const envOptions = {
  dotenv: true,
  schema: {
    type: 'object',
    required: ['DBURI'],
    properties: {
      DBURI: { type: 'string' },
      NODE_ENV: { type: 'string' }
    }
  }
}

export default async function (fastify, opts) {
  // dev only plugins
  if (IS_DEV) {
    fastify.register(printRoutes)
  }

  fastify.register(fastifyEnv, envOptions)
  fastify.register(fastifyCors, {
    origin: '*'
  })

  // loading local plugins
  fastify.register(autoload, {
    dir: join(import.meta.url, './plugins')
  })

  fastify.register(autoload, {
    dir: join(import.meta.url, './routes'),
    options: Object.assign({}, opts)
  })
}
