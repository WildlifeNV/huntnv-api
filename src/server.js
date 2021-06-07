import Fastify from 'fastify'
import app from './app.js'

const fastify = Fastify({
  logger: true
})

fastify.register(app)

const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: process.env.HOST || '0.0.0.0'
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
