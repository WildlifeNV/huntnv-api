import fp from 'fastify-plugin'
import FeatureRepo from './repo.js'

export default fp(async (fastify, opts, next) => {
  const features = FeatureRepo(fastify)

  const getFeaturesList = async () => await features.getFeaturesList()

  const getFeatures = async ({ table, format, query }) => {
    let qs

    if (Object.keys(query).length > 0) {
      const values = query.hunt_units.split(',')
      qs = { display_name: values }
    }

    if (format === 'geojson') {
      return await features.getGeojson({ table, query: qs })
    }
    if (format === 'geobuf' || format === 'pbf') {
      return await features.getGeobuf({ table, query: qs })
    }
    return {}
  }

  const getFeature = async ({ table, format, id }) => {
    if (format === 'geojson') {
      return await features.getGeojsonById({ table, id })
    }
    if (format === 'geobuf' || format === 'pbf') {
      return await features.getGeobufById({ table, id })
    }
    return {}
  }

  const getMvt = async ({ table, z, x, y }) => await features.getMvt({ table, z, x, y })

  fastify.decorate('features', {
    getFeaturesList,
    getFeatures,
    getFeature,
    getMvt
  })
  next()
})
