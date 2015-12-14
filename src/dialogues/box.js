import { splitEvery, map, length, prop, compose, identity } from 'ramda'
import { div, button } from '@cycle/dom'
import { Observable } from 'rx'
import isolate from '@cycle/isolate'

import { getJSON } from 'helpers/fetch'
import { rand } from 'helpers/common'
import { loaderWrapper } from 'helpers/loader'
import { User } from './user'
import auth from 'helpers/auth'

const SUGGESTIONS_COUNT = 3
const getHTTPObservables = compose(Observable.merge, map(prop(`HTTP`)))
const splitUsers = users =>
  splitEvery(Math.ceil(length(users) / SUGGESTIONS_COUNT), users)

const request = actions => actions.refresh$
  .map(_ => ({
    url: `https://api.github.com/users?since=${rand(50000)}`,
    key: `users`,
    headers: auth
  }))

const usersState = (DOM, HTTP) =>
  users => length(users)
    ? map(users => isolate(User)({
      DOM,
      HTTP,
      props$: Observable.just({ users })
    }), splitUsers(users))
    : []

const intent = DOM => ({
  refresh$: DOM.select(`.refresh`).events(`click`).startWith(`initial`),
})

const model = (actions, HTTP) =>
  Observable.combineLatest(
    getJSON({ key: `users` }, HTTP),
    actions.refresh$,
    identity,
  )
  .scan((prev, next) => length(prev) && prev[0].id == next[0].id ? [] : next)

const view = state$ => state$
  .map(users =>
    div(`.content`, [
      div(`.header`, [
        `Who to follow`,
        ` · `,
        button(`.refresh`, `Refresh`),
      ]),

      length(users)
        ? div(`.users`, map(prop(`DOM`), users))
        : div(`.loader`, `Loading...`)
    ]),
  )

export function Box({ DOM, HTTP }) {
  const actions = intent(DOM)
  const state$ = model(actions, HTTP).map(usersState(DOM, HTTP)).shareReplay(1)
  const requests$ = state$.flatMapLatest(getHTTPObservables)

  return {
    state$,
    DOM: view(state$.startWith(null)),
    HTTP: request(actions).merge(requests$),
  }
}
