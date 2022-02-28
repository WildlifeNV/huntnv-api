import fp from 'fastify-plugin'
import { pick, pickTruthy } from '../../utils/objMethods.js'
import { rewriteNullAsObj, queryArrToWhere, filters } from '../../utils/pgpUtils.js'

const HuntRepo = ({ db, qf, pgp }) => {
  const getHuntFeed = async (query) => {
    const gteKeys = [
      'harvest_rate',
      'maturity_value',
      'draw_difficulty_qtile',
      'draw_difficulty_rank',
      'median_bp_of_successful_applications'
    ]
    const eqKeys = ['species_class_id', 'draw_type', 'weapon']
    const ploKey = ['percent_public_land']
    const gteProps = pickTruthy(pick(query, gteKeys))
    const eqProps = pickTruthy(pick(query, eqKeys))
    const ploProps = pickTruthy(pick(query, ploKey))

    const huntDetailsQuery = filters(eqProps)
    Object.keys(gteProps).forEach(prop => {
      huntDetailsQuery.push({
        column: prop,
        operator: '>=',
        condition: gteProps[prop]
      })
    })
    if (query.hunt_unit) {
      huntDetailsQuery.push({
        column: 'hunt_units_arr',
        operator: '?',
        condition: query.hunt_unit
      })
    }
    const huntDetailsWhere = queryArrToWhere(huntDetailsQuery, { value: 'and' })

    const ploQuery = filters(ploProps)
    if (ploQuery.length) ploQuery[0].operator = '>='
    const ploWhere = queryArrToWhere(ploQuery)

    const data = await db.oneOrNone(qf.huntsFeed, {
      huntDetails: huntDetailsWhere,
      huntFeed: ploWhere
    })

    return data
  }

  const getById = async ({ id }) => {
    return await db.oneOrNone(qf.getById, { id }, rewriteNullAsObj)
  }

  return {
    getHuntFeed,
    getById
  }
}

export default fp(async (fastify) => {
  fastify.decorateRequest('huntRepo', null)
  fastify.addHook('preHandler', async (request) => {
    request.huntRepo = await HuntRepo(fastify)
  })
})
