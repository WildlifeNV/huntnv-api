const getFeaturesQuerystring = {
  type: 'object',
  properties: {
    hunt_units: {
      type: 'string',
      description: 'The name(s) of hunt units to return. Can be a comma separated list or a single value. Must units < 100 with a 0 (e.g. 032).'
    }
  }
}

export default {
  getFeaturesQuerystring
}
