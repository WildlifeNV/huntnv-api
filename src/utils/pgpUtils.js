import pgp from 'pg-promise'
import fs from 'fs'
import { isDev } from './isDev.js'
const { QueryFile } = pgp

export const rewriteNullAsObj = (result) => (!result ? {} : result)

export const loadQueryFiles = (dir) => {
  const files = fs.readdirSync(dir)

  return files.reduce((acc, file) => {
    const key = camelize(file.split('.')[0])
    const fullpath = `${dir}/${file}`
    const qf = new QueryFile(fullpath, {
      minify: !isDev,
      compress: !isDev
    })
    return Object.assign(acc, { [key]: qf })
  }, {})
}

function camelize(str) {
  // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
}

// parse parameters into conditions and where clause stuff
function lkpOperator(operator) {
  const operators = {
    eq: '=',
    gte: '>=',
    gt: '>',
    lte: '<=',
    lt: '<',
    neq: '!=',
    in: 'IN'
  }

  return operators[operator]
}

function parseQueryParameter(param) {
  const [column, value] = param

  const hasOperator = String(value).indexOf(':') !== -1
  const [operatorStr, conditionStr] = hasOperator
    ? value.split(':')
    : ['eq', value]

  const isNumber = !isNaN(conditionStr)
  const condition = isNumber ? Number(conditionStr) : conditionStr

  return { column, operator: lkpOperator(operatorStr), condition }
}

export const filters = (params) =>
  Object.entries(rmEmptyProps(params)).map(parseQueryParameter)

function rmEmptyProps(obj) {
  // https://stackoverflow.com/questions/25421233/javascript-removing-undefined-fields-from-an-object
  return Object.keys(obj).reduce(
    (acc, key) =>
      obj[key] === undefined ? { ...acc } : { ...acc, [key]: obj[key] },
    {}
  )
}
