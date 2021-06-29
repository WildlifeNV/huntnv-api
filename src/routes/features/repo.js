import { join } from 'desm'
import { loadQueryFiles, rewriteNullAsObj } from '../../utils/pgpUtils.js'

const FeatureRepo = ({ db, pgp }) => {
  const qf = loadQueryFiles(join(import.meta.url, './sql'))

  const getFeaturesList = async () => {
    return await db.many(qf.getFeaturesList)
  }

  const getGeojson = async ({ table, query }) => {
    const where = formatWhere(query, pgp.as.format)
    const rows = await db.one(qf.getGeojson, { table, where }, rewriteNullAsObj)
    return rows.geojson
  }

  const getGeojsonById = async ({ table, id }) => {
    const rows = await db.one(qf.getGeojsonById, { table, id }, rewriteNullAsObj)
    return rows.geojson
  }

  const getGeobuf = async ({ table, query }) => {
    const where = formatWhere(query, pgp.as.format)
    const rows = await db.one(qf.getGeobuf, { table, where })
    return rows.geobuf
  }

  const getGeobufById = async ({ table, id }) => {
    const rows = await db.one(qf.getGeobufById, { table, id })
    return rows.geobuf
  }

  const getMvt = async ({ table, columns, z, x, y }) => {
    const rows = await db.one(qf.getMvt, { table, columns, z, x, y })
    return rows.mvt
  }

  return {
    getFeaturesList,
    getGeojson,
    getGeojsonById,
    getGeobuf,
    getGeobufById,
    getMvt
  }
}

export default FeatureRepo

function formatWhere (query, format) {
  const where = query
    ? format('where display_name in ($<units:csv>)', {
      units: query.display_name
    })
    : ''

  return where
}
