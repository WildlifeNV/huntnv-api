const querystring = {
  species_class_id: {
    type: 'integer',
    description: 'The ID of a species x class to filter hunts. Example: 4 = elk - antlered.'
  },
  draw_type: {
    type: 'string',
    description: 'Filter hunts by residency status. Either resident or non-resident.',
    enum: [
      'resident',
      'non-resident'
    ]
  },
  weapon: {
    type: 'string',
    description: 'Filter hunts by weapon type.',
    enum: [
      'archery',
      'muzzleloader',
      'any legal weapon'
    ]
  },
  percent_public_land: {
    type: 'number',
    description: 'Return hunts where the percentage of public land is greater than or equal to (>=) the number provided.',
    minimum: 0,
    maximum: 100
  },
  harvest_rate: {
    type: 'number',
    description: 'Return hunts with a harvest success rate greater than or equal to (>=) the number provided.',
    minimum: 0,
    maximum: 1
  },
  maturity_value: {
    type: 'number',
    description: '',
    minimum: 0,
    maximum: 1
  },
  draw_difficulty_qtile: {
    type: 'integer',
    description: 'Return hunts with a draw difficulty ranked between the number provided and 5 (the maximum).',
    minimum: 0,
    maximum: 5
  },
  draw_difficulty_rank: {
    type: 'integer',
    description: 'Return hunts with a draw rank betweein the number provided and 30 (the maximum).',
    minimum: 0,
    maximum: 30
  },
  median_bp_of_successful_applications: {
    type: 'number',
    description: 'Return hunts where the median bonus points of successful applications are greater than or equal to (>=) the number provided.',
    minimum: 0,
    maximum: 29
  }
}

const schema = {
  description: 'Return all hunts, grouped by hunt geometry, species class.',
  tags: ['hunts'],
  querystring
}

const handler = async ({ query, huntRepo }) => {
  const data = await huntRepo.getHuntFeed(query)
  return data
}

export default async function routes(fastify) {
  fastify.route({
    method: 'GET',
    url: '/feed',
    schema,
    handler
  })
}
