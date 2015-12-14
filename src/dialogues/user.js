import { prop, drop, propOr, length } from 'ramda'
import { div, button, span, img, a } from '@cycle/dom'
import { Observable } from 'rx'

import { getJSON } from 'helpers/fetch'
import { handleView } from 'helpers/loader'
import auth from 'helpers/auth'

const checkForNewUser = (prev, next) => {
  if (!length(propOr([], `users`, next))) return null

  return prev.user.id != next.user.id
    ? next
    : { user: { id: null } }
}

const request = (actions, props$) => actions.close$
  .map((_, idx) => idx)
  .withLatestFrom(props$, (idx, { users }) => users[idx])
  .map(user => user ? {
    url: user.url,
    key: `user`,
    headers: auth
  } : {})

const intent = DOM => ({
  close$: DOM.select(`.user-close`).events(`click`)
    .startWith(`initial`),
})

const model = (actions, HTTP, props$) =>
  Observable.combineLatest(
    getJSON({ key: `user` }, HTTP),
    props$.map(props => props.users),
    actions.close$.map((_, idx) => idx),
    (user, users, much) => ({
      user,
      users: drop(much, users),
    }),
  )
  .scan(checkForNewUser)
  .map(propOr(null, `user`))

const view = state$ => state$
  .map(handleView(
    user => user ? !!user.id : null,
    div(`.user-loader`, `Loading...`),
    user =>
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
  ))

export function User({ DOM, HTTP, props$ }) {
  const actions = intent(DOM)
  const state$ = model(actions, HTTP, props$)

  return {
    state$,
    DOM: view(state$),
    HTTP: request(actions, props$),
  }
}
