import R from 'ramda'

import { firstKey, firstVal, capitalize } from './common'

export function getJSON(by, requests$) {
  const type = capitalize(firstKey(by));

  return requests$
    [`by${type}`](firstVal(by))
    .mergeAll()
    .flatMap(res => res.json());
}
