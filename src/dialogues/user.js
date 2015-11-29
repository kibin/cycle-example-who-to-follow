import { prop } from 'ramda'
import { div, button, span, img, a } from '@cycle/dom'

import { getJSON } from 'helpers/fetch'

const intent = DOM => ({
  close$: DOM.select(`.user-close`).events(`click`),
})

const request = props$ => props$
  .map({ url } => ({
    url,
    key: `user`,
  })

const model = HTTP =>
  getJSON({ key: `user` }, HTTP)

const view = state$ => state$
  .map(user =>
    div(`.user`, [
      a(`.user-content`, { href: prop(`html_url`, user) }, [
        img(`.user-pic`, { src: prop(`avatar_url`, user) }),

        span(`.user-description`, [
          span(`.user-name`, prop(`name`, user)),
          span(`.user-nick`, `@` + prop(`login`, user)),
        ]),
      ]),

      button(`.user-close`, `✕`),
    ]),

export function user({ DOM, HTTP, props$ }) {
  const state$ = model(HTTP)

  return {
    state$,
    DOM: view(state$),
    HTTP: request(props$),
  }
}
