import { div, span } from '@cycle/dom'
import { head } from 'ramda'

export function handleView(handler, loader, dom) {
  const defaultLoader = div(`.loader`, `Loading...`)

  return (...data) => {
    const result = handler(...data)

    if (result === null) return span()

    if (result === false) return loader || defaultLoader

    return dom(...data)
  }
}
