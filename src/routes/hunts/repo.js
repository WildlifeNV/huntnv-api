import { join } from 'desm'
import { loadQueryFiles, rewriteNullAsObj } from '../../utils/pgpUtils.js'

const HuntRepo = ({ db, pgp }) => {
  const qf = loadQueryFiles(join(import.meta.url, './sql'))

  const getAll = async () => {
    const sql = 'select * from hunts'
    return await db.manyOrNone(sql)
  }

  const getById = async ({ id }) => {
    return await db.oneOrNone(qf.getById, { id }, rewriteNullAsObj)
  }

  return {
    getAll,
    getById
  }
}

export default HuntRepo
