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
}
