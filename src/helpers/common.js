import R from 'ramda'

export const firstKey = R.compose(R.head, R.keys)
export const firstVal = R.compose(R.head, R.values)
export const capitalize = R.compose(R.join(``), R.adjust(R.toUpper, 0))
export const rand = (max, min = 0) =>
  Math.floor(Math.random() * max) + min
export const randVals = R.curry((amount, list) => {
  const len = R.length(list);
  const ids = R.times(x => rand(len), amount);

  return R.map(R.nth(R.__, list), ids);
});
