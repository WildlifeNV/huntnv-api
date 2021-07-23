/* eslint-disable camelcase */

// JSON schema parts for /hunts/feed
const huntsFeedQueryStringProps = {
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
  success_rate: {
    type: 'number',
    description: 'Return hunts with a harvest success rate greater than or equal to (>=) the number provided.',
    minimum: 0,
    maximum: 1
  },
  draw_rate: {
    type: 'number',
    description: 'Return hunts with a harvest success rate greater than or equal to (>=) the number provided.',
    minimum: 0,
    maximum: 1
  }
}

const huntsFeed = {
  description: 'Return all big game hunts for the current hunt year grouped by unit group and species. Example: All hunts for 101 - 109 mule deer are grouped into an object.',
  tags: ['hunts'],
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: huntsFeedQueryStringProps
  }
}

// JSON schema parts for /hunts
const huntsGetAllQueryStringProps = {
  ...huntsFeedQueryStringProps,
  hunt_year: {
    type: 'integer',
    description: 'Return hunts equal to (=) the year provided. Must be >= 2018 and <= 2021.',
    minimum: 2018,
    maximum: 2021
  }
}

const huntsGetAll = {
  description: 'Return all hunts and hunt data starting from 2018 to the current year.',
  tags: ['hunts'],
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: huntsGetAllQueryStringProps
  },
  response: {
    200: {
      type: 'object',
      properties: {
        total_hunts: {
          type: 'integer',
          description: 'The total number of hunts returned by the query.'
        },
        hunts: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              id: { type: 'integer' },
              hunt_geometry_id: { type: 'integer' },
              species_class_id: { type: 'integer' },
              display_name: { type: 'string' },
              species: { type: 'string' },
              weapon: { type: 'string' },
              draw_type: { type: 'string' },
              unit_group: { type: 'string' },
              season_order_modifier: { type: 'string' },
              hunt_year: { type: 'integer' },
              season_dates: { type: 'string' },
              season_start_date: { type: 'string' },
              season_end_date: { type: 'string' },
              season_length: { type: 'integer' },
              quota: { type: 'integer' },
              applications: { type: 'integer' },
              hunters_afield: { type: 'integer' },
              draw_rate: { type: 'number' },
              success_rate: { type: 'number' },
              points_or_greater: { type: 'number' },
              length_or_greater: { type: 'number' }
            }
          }
        }
      }
    }
  }
}

// JSON schema parts for /hunts/:id
const relatedHuntsProps = {
  hunt_id: { type: 'integer' },
  display_name: { type: 'string' },
  species: { type: 'string' },
  draw_type: { type: 'string' },
  weapon: { type: 'string' },
  unit_group: { type: 'string' },
  season_dates: { type: 'string' },
  quota: { type: 'integer' }
}

const landownershipProps = {
  area: { type: 'number' },
  coverage: { type: 'number' },
  surface_mgmt_agency: { type: 'string' }
}

const huntStatsProps = {
  hunt_id: { type: 'integer' },
  hunt_year: { type: 'integer' },
  draw_type: { type: 'string' },
  display_name: { type: 'string' },
  unit_group: { type: 'string' },
  weapon: { type: 'string' },
  season_dates: { type: 'string' },
  season_order_modifier: { type: 'string' },
  quota: { type: 'integer' },
  applications: { type: 'integer' },
  hunters_afield: { type: 'number' },
  successful_hunters: { type: 'number' },
  draw_rate: { type: 'number' },
  success_rate: { type: 'number' },
  points_or_greater: { type: 'number' },
  length_or_greater: { type: 'number' },
  hunt_days: { type: 'number' },
  effort_days: { type: 'number' },
  hunter_satisfaction: { type: 'number' }
}

const huntsGetById = {
  description: 'Return a hunt by ID.',
  tags: ['hunts'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'integer',
        description: 'The ID number of a hunt.'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'integer' },
        hunt_geometry_id: { type: 'integer' },
        hunt_narrative_id: { type: 'integer' },
        display_name: { type: 'string' },
        weapon: { type: 'string' },
        draw_type: { type: 'string' },
        hunt_units_arr: {
          type: 'array',
          items: { type: 'string' }
        },
        season_order_modifier: { type: 'string' },
        area: { type: 'number' },
        public_land_pct: { type: 'number' },
        season_dates: { type: 'string' },
        season_start_date: { type: 'string' },
        season_end_date: { type: 'string' },
        season_length: { type: 'integer' },
        quota: { type: 'integer' },
        related_hunts: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: relatedHuntsProps
          }
        },
        landownership: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: landownershipProps
          }
        },
        hunt_stats: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: huntStatsProps
          }
        }
      }
    }
  }
}

export default {
  huntsFeed,
  huntsGetAll,
  huntsGetById
}
