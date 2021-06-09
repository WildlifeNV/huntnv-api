import fp from 'fastify-plugin'
import FeatureRepo from './repo.js'

export default fp(async (fastify, opts, next) => {
  const features = FeatureRepo(fastify)

  const getFeaturesList = async () => await features.getFeaturesList()

  const getFeature = async ({ table, format }) => {
    if (format === 'geojson') {
      return await features.getGeojson({ table })
    }
    if (format === 'geobuf' || format === 'pbf') {
      const data = await features.getGeobuf({ table })
      return data
    }
    return {}
  }

  const getMvt = async ({ table, z, x, y }) => await features.getMvt({ table, z, x, y })

  fastify.decorate('features', {
    getFeaturesList,
    getFeature,
    getMvt
  })
  next()
})
