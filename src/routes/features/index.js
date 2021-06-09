import services from './services.js'

export default async function (fastify, opts) {
  fastify.register(services)

  // route declarations
  fastify.route({
    method: 'GET',
    url: '/',
    handler: async (req, reply) => await fastify.features.getFeaturesList()
  })

  fastify.route({
    method: 'GET',
    url: '/:table/items.:format',
    handler: async (req, reply) => {
      const { table, format } = req.params
      const data = await fastify.features.getFeature({ table, format })

      if (format === 'geobug' || format === 'pbf') {
        reply
          .header('Content-Type', 'application/x-protobuf')
          .send(data)
      }

      return data
    }
  })

  fastify.route({
    method: 'GET',
    url: '/:table/:z/:x/:y',
    handler: async (req, reply) => {
      const { table, z, x, y } = req.params
      const mvt = await fastify.features.getMvt({ table, z, x, y })

      if (mvt.length === 0) { reply.code(204) }

      reply
        .header('Content-Type', 'application/x-protobuf')
        .send(mvt)
    }
  })
}
