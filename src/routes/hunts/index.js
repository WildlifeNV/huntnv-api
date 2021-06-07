import services from './services.js'

export default async function (fastify, opts) {
  fastify.register(services)

  fastify.route({
    method: 'GET',
    url: '/',
    handler: getAllHunts
  })

  fastify.route({
    method: 'GET',
    url: '/:id',
    handler: getHuntById
  })
}

async function getAllHunts (req, reply) {
  const data = await this.hunts.getAll()
  return data
}

async function getHuntById (req, reply) {
  const { id } = req.params
  const data = await this.hunts.getById({ id })
  return data
}
