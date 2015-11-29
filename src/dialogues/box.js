import { splitEvery, map, length } from 'ramda'
import { div, button } from '@cycle/dom'

import { getJSON } from 'helpers/fetch'
import { rand } from 'helpers/common'
import { loaderWrapper } from 'helpers/loader'

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

const view = state$ => state$
  .map(loaderWrapper(users =>
    div(`.content`, [console.log(users),
      div(`.header`, [
        `Who to follow`,
        ` · `,
        button(`.refresh`, `Refresh`),
      ]),

      div(`.usrs`, map(usrs => div(JSON.stringify(map(x => x.login, usrs), null, `  `)),
                       splitEvery(Math.ceil(length(users) / 3), users))),
    ]),
  ))


export function Box({ DOM, HTTP }) {
  const state$ = model(HTTP)
  const actions = intent(DOM)
  // get a stream of three user dfcs
  // merge their requests to HTTP

  return {
    state$,
    DOM: view(state$),
    HTTP: request(actions),
  }
}
