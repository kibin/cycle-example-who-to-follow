import { prop } from 'ramda'
import { div, button, span, img, a } from '@cycle/dom'
import { Observable } from 'rx'

import { getJSON } from 'helpers/fetch'

const intent = DOM => ({
  close$: DOM.select(`.user-close`).events(`click`)
    .startWith(`initial`),
})

const request = ({ close$ }, props$) => close$
  .map((_, idx) => idx)
  .withLatestFrom(props$, (idx, users) => users[idx] || {})
  .map(({ url }) => url ? {
    url,
    key: `user`,
    headers: { Authorization: `Basic a2liaW46MjhlZWQ5MmYyODM1NzYwNTY2MGQyNTc2MWJiMjMyOTVlYzk4Y2ZlNw==` }
  } : {})

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
    ])
  )

export function User({ DOM, HTTP, props$ }) {
  const actions = intent(DOM)
  const state$ = model(HTTP)

  return {
    state$,
    DOM: view(state$),
    HTTP: request(actions, props$),
  }
}
