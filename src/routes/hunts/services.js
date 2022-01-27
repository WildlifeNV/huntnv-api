import fp from 'fastify-plugin'
import HuntRepo from './repo.js'
import { filters } from '../../utils/pgpUtils.js'
import { sum } from '../../utils/helpers.js'
import { pick, omit, pickTruthy } from '../../utils/objMethods.js'

export default fp(async (fastify, opts, next) => {
  const hunts = HuntRepo(fastify)

  const huntFeed = async ({ query }) => {
    const props = ['success_rate', 'draw_rate']
    const gteProps = pickTruthy(pick(query, props))
    const queryProps = omit(query, props)

    const queryArr = filters(queryProps)

    const gteKeys = Object.keys(gteProps)
    if (gteKeys.length) {
      gteKeys.forEach(key => {
        queryArr.push({
          column: key,
          operator: '>=',
          condition: gteProps[key]
        })
      })
    }

    const data = await hunts.huntFeed({ query: queryArr })
    const totalHunts = sum(data.map(m => m.total_hunts))

    return {
      total_hunts: totalHunts,
      hunt_feed: data
    }
  }

  const getById = async (params) => {
    return await hunts.getById({ id: params.id })
  }

  fastify.decorate('hunts', {
    huntFeed,
    getById
  })
  next()
})
