import { div, button } from '@cycle/dom'

import { getJSON } from 'helpers/fetch'
import { rand } from 'helpers/common'
import { loaderWrapper } from 'helpers/loader'

export function Box({ DOM, HTTP }) {
  const intent = DOM => ({
    refresh$: DOM.select(`.refresh`).events(`click`).startWith(`initial`),
  })

  const request = ({ refresh$ }) => refresh$
    .map(_ => ({
      url: `https://api.github.com/users?since=${rand(500)}`,
      key: `users`,
    }))

  const model = HTTP =>
    getJSON({ key: `users` }, HTTP).startWith(null)

  const view = state$ =>
    state$.map(loaderWrapper(users =>
      div(`.content`, [console.log(users),
        div(`.header`, [
          `Who to follow`,
          ` · `,
          button(`.refresh`, `Refresh`),
        ]),

        div(`.users`, [
        ]),
      ]),
    ))

  const state$ = model(HTTP)

  return {
    state$,
    DOM: view(state$),
    HTTP: request(intent(DOM)),
  }
}
