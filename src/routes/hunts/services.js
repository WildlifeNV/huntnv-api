import fp from 'fastify-plugin'
import HuntRepo from './repo.js'

export default fp(async (fastify, opts, next) => {
  const hunts = HuntRepo(fastify)

  const getAll = async () => {
    return await hunts.getAll()
  }

  const getById = async (params) => {
    return await hunts.getById({ id: params.id })
  }

  fastify.decorate('hunts', {
    getAll,
    getById
  })
  next()
})
