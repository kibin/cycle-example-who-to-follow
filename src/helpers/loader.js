import tags from 'helpers/dom'
import R from 'ramda'

const { div } = tags;

export function loaderWrapper(domFn, handler=R.head) {
  const loader = div(`.loader`, `Loading...`);

  return (...dataArgs) =>
    handler(dataArgs) ? domFn(...dataArgs) : loader;
}
