import { prop } from 'ramda'
import { div, button, span, img, a } from '@cycle/dom'

import { getJSON } from 'helpers/fetch'

const init = {
  headers: { Authorization: `Basic a2liaW46MjhlZWQ5MmYyODM1NzYwNTY2MGQyNTc2MWJiMjMyOTVlYzk4Y2ZlNw==` }
}

const intent = DOM => ({
  close$: DOM.select(`.user-close`).events(`click`),
})

const request = ({ close$ }, props$) => close$
  .map((_, idx) => idx)
  .withLatestFrom(props$, (idx, users) => users[idx])
  .map(({ url }) => ({
    url,
    key: `user`,
    init,
  }))

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
  const state$ = model(HTTP)
  const actions = intent(DOM)

  return {
    state$,
    DOM: view(state$),
    HTTP: request(actions, props$),
  }
}
