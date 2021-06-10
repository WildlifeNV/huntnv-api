import { join } from 'desm'
import { loadQueryFiles, rewriteNullAsObj } from '../../utils/pgpUtils.js'

const FeatureRepo = ({ db, pgp }) => {
  const qf = loadQueryFiles(join(import.meta.url, './sql'))

  const getFeaturesList = async () => {
    return await db.many(qf.getFeaturesList)
  }

  const getGeojson = async ({ table }) => {
    const rows = await db.one(qf.getGeojson, { table }, rewriteNullAsObj)
    return rows.geojson
  }

  const getGeojsonById = async ({ table, id }) => {
    const rows = await db.one(qf.getGeojsonById, { table, id }, rewriteNullAsObj)
    return rows.geojson
  }

  const getGeobuf = async ({ table }) => {
    const rows = await db.one(qf.getGeobuf, { table })
    return rows.geobuf
  }

  const getGeobufById = async ({ table, id }) => {
    const rows = await db.one(qf.getGeobufById, { table, id })
    return rows.geobuf
  }

  const getMvt = async ({ table, z, x, y }) => {
    const rows = await db.one(qf.getMvt, { table, z, x, y })
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
