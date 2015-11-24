import { div } from '@cycle/dom'
import R from 'ramda'

export function loaderWrapper(domFn, handler=R.head) {
  const loader = div(`.loader`, `Loading...`);

  return (...dataArgs) =>
    handler(dataArgs) ? domFn(...dataArgs) : loader;
}
