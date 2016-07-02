import { prop } from 'ramda'

import { firstKey, firstVal, eqToProp } from './common'

export function getJSON(by, HTTP) {
  return HTTP
    .select(by)
    .mergeAll()
    .map(prop(`body`))
}

function getJSONHTTP(by, request$) {
  return request$
    .filter(eqToProp([`request`, firstKey(by)], firstVal(by)))
    .mergeAll()
    .map(prop(`body`))
}

// use it with cycle fetch driver
function getJSONFetch(by, request$) {
  const type = capitalize(firstKey(by))

  return requests$
    [`by${type}`](firstVal(by))
    .mergeAll()
    .flatMap(res => res.json())
}
