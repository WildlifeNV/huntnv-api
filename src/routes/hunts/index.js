import services from './services.js'
import schema from './schemas.js'

export default async function (fastify, opts) {
  fastify.register(services)

  fastify.route({
    method: 'GET',
    url: '/feed',
    schema: schema.huntsFeed,
    handler: getHuntFeed
  })

  fastify.route({
    method: 'GET',
    url: '/:id',
    // schema: schema.huntsGetById,
    handler: getHuntById
  })
}

async function getHuntFeed (req, reply) {
  const data = await this.hunts.huntFeed({ query: req.query })
  return data
}

async function getHuntById (req, reply) {
  const { id } = req.params
  const data = await this.hunts.getById({ id })
  return data
}
