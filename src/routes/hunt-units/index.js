import services from './services.js'

export default async function (fastify, opts) {
  fastify.register(services)

  fastify.route({
    method: 'GET',
    url: '/:name',
    handler: getHuntUnitByName
  })
}

async function getHuntUnitByName (req, reply) {
  const { name } = req.params
  const data = await this.huntUnits.getByName({ name })
  return data
}
