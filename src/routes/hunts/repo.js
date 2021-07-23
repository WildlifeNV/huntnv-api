import { join } from 'desm'
import { loadQueryFiles, rewriteNullAsObj } from '../../utils/pgpUtils.js'

const HuntRepo = ({ db, pgp }) => {
  const qf = loadQueryFiles(join(import.meta.url, './sql'))
  const format = pgp.as.format

  const getAll = async ({ query }) => {
    const where = queryToWhere(query, format)
    return await db.manyOrNone(qf.getAll, { where })
  }

  const huntFeed = async ({ query }) => {
    const whereStr = query
      .map((filter) =>
        format('$<column:name> $<operator:raw> $<condition>', filter)
      )
      .join(' and ')
    const where = !whereStr ? '' : `where ${whereStr}`

    return await db.manyOrNone(qf.huntsFeed, { where })
  }

  const getById = async ({ id }) => {
    return await db.oneOrNone(qf.getById, { id }, rewriteNullAsObj)
  }

  return {
    huntFeed,
    getAll,
    getById
  }
}

export default HuntRepo

function queryToWhere (query, format) {
  const whereStr = query
    .map((filter) =>
      format('$<column:name> $<operator:raw> $<condition>', filter)
    )
    .join(' and ')

  return !whereStr ? '' : `where ${whereStr}`
}
