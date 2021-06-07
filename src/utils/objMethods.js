export const pick = (obj, props) =>
  Object.assign({}, ...props.map((prop) => ({ [prop]: obj[prop] })))

export const pickTruthy = (obj) =>
  Object.keys(obj).reduce(
    (acc, key) => (!obj[key] ? { ...acc } : { ...acc, [key]: obj[key] }),
    {}
  )

export const pickFalsy = (obj) =>
  Object.keys(obj).reduce(
    (acc, key) => (obj[key] ? { ...acc } : { ...acc, [key]: obj[key] }),
    {}
  )

export const omit = (obj, props) =>
  Object.keys(obj).reduce(
    (acc, key) => props.includes(key) ? { ...acc } : { ...acc, [key]: obj[key] },
    {}
  )
