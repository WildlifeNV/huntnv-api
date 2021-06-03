import fp from 'fastify-plugin'
import pgPromise from 'pg-promise'

export default fp(async (fastify, opts, next) => {
  const logger = fastify.log.child({ name: 'pg-promise' })

  const initOptions = {
    capSQL: true,
    query (event) {
      logger.info(event.query)
    },
    error (err, { query }) {
      logger.error({
        type: err.type,
        message: err.message
      }, err.message)
    }
  }
  const pgp = pgPromise(initOptions)
  const db = pgp(fastify.config.DBURI)

  fastify
    .decorate('db', db)
    .addHook('onClose', async (instance, done) => {
      await db.$pool.end()
      done()
    })

  fastify.decorate('pgp', pgp)

  next()
}, { name: 'db' })
