import repo from './repo.js'
import getHuntFeed from './getHuntFeed.js'
import getHunt from './getHunt.js'

export default async function (fastify, opts) {
  fastify.register(repo)
  fastify.register(getHuntFeed)
  fastify.register(getHunt)
}
