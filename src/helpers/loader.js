import { div } from '@cycle/dom'
import { head } from 'ramda'

export function loaderWrapper(domFn, handler = head) {
  const loader = div(`.loader`, `Loading...`);

  return (...dataArgs) =>
    handler(dataArgs) ? domFn(...dataArgs) : loader;
}
