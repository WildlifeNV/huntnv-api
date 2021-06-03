const schema = {
  description:
    'Healthcheck endpoint to determine if the services is up and running.',
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        timestamp: {
          type: 'string',
          format: 'date-time'
        }
      }
    }
  }
}

export default async function (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/',
    schema,
    handler: async (req, reply) => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString()
      }
    }
  })
}
