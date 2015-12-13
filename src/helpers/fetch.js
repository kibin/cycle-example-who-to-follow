import { prop, propOr } from 'ramda'

import {
  firstKey, firstVal, eqToProp
} from './common'

export function getJSON(by, request$) {
  return getJSONHTTP(by, request$)
}

function getJSONHTTP(by, request$) {
  return request$
    .filter(eqToProp([`request`, firstKey(by)], firstVal(by)))
    .mergeAll()
    .map(prop(`body`))
}

function getJSONFetch(by, request$) {
  const type = capitalize(firstKey(by))

  return requests$
    [`by${type}`](firstVal(by))
    .mergeAll()
    .flatMap(res => res.json())
}
