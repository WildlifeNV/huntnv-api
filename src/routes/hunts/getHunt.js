const handler = async ({ params, huntRepo }) => {
  return huntRepo.getById({ id: params.id })
}

export default async function routes(fastify) {
  fastify.route({
    method: 'GET',
    url: '/:id',
    handler
  })
}
