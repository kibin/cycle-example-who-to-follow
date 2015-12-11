import {
  __,
  adjust,
  compose,
  curry,
  equals,
  head,
  join,
  keys,
  length,
  map,
  nth,
  path,
  times,
  toUpper,
  values,
} from 'ramda'

export const firstKey = compose(head, keys)
export const firstVal = compose(head, values)
export const capitalize = compose(join(``), adjust(toUpper, 0))
export const rand = (max, min = 0) =>
  Math.floor(Math.random() * max) + min
export const randVals = curry((amount, list) => {
  const len = length(list);
  const ids = times(x => rand(len), amount);

  return map(nth(__, list), ids);
})
export const eqToProp = (pathname, to) =>
  compose(equals(to), path(pathname))
