import { splitEvery, map, length, prop, compose, identity } from 'ramda'
import { div, button } from '@cycle/dom'
import { Observable } from 'rx'
import isolate from '@cycle/isolate'

import { getJSON } from 'helpers/fetch'
import { rand } from 'helpers/common'
import { loaderWrapper } from 'helpers/loader'
import { User } from './user'

const init = {
  headers: { Authorization: `Basic a2liaW46MjhlZWQ5MmYyODM1NzYwNTY2MGQyNTc2MWJiMjMyOTVlYzk4Y2ZlNw==` }
}

const USERS_COUNT = 3
const getHTTPObservables = compose( map(prop(`HTTP`), prop(`users`)))

const intent = DOM => ({
  refresh$: DOM.select(`.refresh`).events(`click`).startWith(`initial`),
})

const request = ({ refresh$ }) => refresh$
  .map(_ => ({
    url: `https://api.github.com/users?since=${rand(500)}`,
    key: `users`,
    init,
  }))

const model = HTTP =>
  getJSON({ key: `users` }, HTTP)
    .map(users => splitEvery(Math.ceil(length(users) / USERS_COUNT), users))

const view = state$ => state$
  .map(loaderWrapper(({ users }) =>
    div(`.content`, [console.log(users),
      div(`.header`, [
        `Who to follow`,
        ` · `,
        button(`.refresh`, `Refresh`),
      ]),

      div(`.usrs`, `LOL~`)
    ]),
  ))

const usersState = (DOM, HTTP) =>
  usersChunks => ({
    users: usersChunks.map(users =>
      isolate(User)({ DOM, HTTP, props$: Observable.just(users) })
    ),
  })

export function Box({ DOM, HTTP }) {
  const state$ = model(HTTP)
  const actions = intent(DOM)
  const newState$ = state$.map(usersState(DOM, HTTP))
  const requests$ = newState$
    .map(users => Observable.from(getHTTPObservables(users)))
    .flatMap(identity)
    .tap(a => console.log(a))

  return {
    state$,
    DOM: view(newState$),
    HTTP: request(actions).merge(requests$),
  }
}
