import fp from 'fastify-plugin'
import HuntUnitRepo from './repo.js'

export default fp(async (fastify, opts, next) => {
  const huntUnits = HuntUnitRepo(fastify)

  const getByName = async ({ name }) => {
    return await huntUnits.getByName({ name })
  }

  fastify.decorate('huntUnits', {
    getByName
  })
  next()
})
