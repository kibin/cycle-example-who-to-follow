import {
  adjust,
  compose,
  equals,
  head,
  join,
  keys,
  path,
  toUpper,
  values,
} from 'ramda'

export const firstKey = compose(head, keys)
export const firstVal = compose(head, values)
export const capitalize = compose(join(``), adjust(toUpper, 0))
export const rand = (max, min = 0) =>
  Math.floor(Math.random() * max) + min
export const eqToProp = (pathname, to) =>
  compose(equals(to), path(pathname))
