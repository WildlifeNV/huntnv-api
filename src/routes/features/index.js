import services from './services.js'
import schema from './schemas.js'

export default async function (fastify, opts) {
  fastify.register(services)

  // fetch spatial table sources to get property values
  const spatialTableSources = await fastify.db.many('select * from spatial_table_sources')
  fastify.decorate('spatialTables', spatialTableSources)

  // route declarations
  fastify.route({
    method: 'GET',
    url: '/',
    handler: onGetFeaturesList
  })

  fastify.route({
    method: 'GET',
    url: '/:table(\\w+).:format',
    schema: {
      querystring: schema.getFeaturesQuerystring
    },
    handler: onGetFeatures
  })

  fastify.route({
    method: 'GET',
    url: '/:table/:id(\\d+).:format',
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
  const sourceTable = this.spatialTables.filter(item => item.table_name === table)
  const columns = Object.keys(sourceTable[0].properties)
  const mvt = await this.features.getMvt({ table, columns, z, x, y })

  if (mvt.length === 0) { reply.code(204) }

  reply
    .header('Content-Type', 'application/x-protobuf')
    .send(mvt)
}
