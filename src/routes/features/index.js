import services from './services.js'
import schema from './schemas.js'

export default async function (fastify, opts) {
  fastify.register(services)

  // route declarations
  fastify.route({
    method: 'GET',
    url: '/',
    handler: onGetFeaturesList
  })

  fastify.route({
    method: 'GET',
    url: '/:table/items.:format',
    schema: {
      querystring: schema.getFeaturesQuerystring
    },
    handler: onGetFeatures
  })

  fastify.route({
    method: 'GET',
    url: '/:table/items/:id(\\d+).:format',
    handler: onGetFeature
  })

  fastify.route({
    method: 'GET',
    url: '/:table/:z/:x/:y(\\d+).pbf',
    handler: onGetMvt
  })
}

async function onGetFeaturesList () {
  return await this.features.getFeaturesList()
}

async function onGetFeatures (req, reply) {
  const { table, format } = req.params
  const { query } = req
  const data = await this.features.getFeatures({ table, format, query })

  if (format === 'geobuf' || format === 'pbf') {
    reply
      .header('Content-Type', 'application/x-protobuf')
      .send(data)
  }

  return data
}

async function onGetFeature (req, reply) {
  const { table, format, id } = req.params
  const data = await this.features.getFeature({ table, format, id })

  if (format === 'geobuf' || format === 'pbf') {
    reply
      .header('Content-Type', 'application/x-protobuf')
      .send(data)
  }

  return data
}

async function onGetMvt (req, reply) {
  const { table, z, x, y } = req.params
  const mvt = await this.features.getMvt({ table, z, x, y })

  if (mvt.length === 0) { reply.code(204) }

  reply
    .header('Content-Type', 'application/x-protobuf')
    .send(mvt)
}
