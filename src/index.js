/* @flow */
import './index.styl'

import Rx from 'rx'
import R from 'ramda'
import { run } from '@cycle/core'
import { makeDOMDriver } from '@cycle/dom'
import { makeHistoryDriver } from '@cycle/history'
import { makeFetchDriver } from '@cycle/fetch'

import tags from 'helpers/dom'
import { getJSON } from 'helpers/fetch'
import { rand, randVals } from 'helpers/common'
import { loaderWrapper } from 'helpers/loader'

const { div, button, span, img, a } = tags;

function main({ DOM, HTTP, History }) {
  const users = `https://api.github.com/users`;

  const refresh$ = DOM.select(`.refresh`).events(`click`);

  const users$ = getJSON({ key: `users` }, HTTP);
  const user$ = getJSON({ key: `user` }, HTTP);

  const userRequest$ = users$
    .map(users => ({
      url: R.prop(`url`, R.head(users)),
      key: `user`,
    }))

  const usersRequest$ = refresh$
    .startWith(`initial`)
    .map(_ => ({
      url: `${users}?since=${rand(500)}`,
      key: `users`,
    }))

  const dom$ = user$
    .startWith(null)
    .map(loaderWrapper(user =>
      div(`.content`, [console.log(user),
        div(`.header`, [
          `Who to follow`,
          ` · `,
          button(`.refresh`, `Refresh`),
          ` · `,
          button(`.view-all`, `View all`),
        ]),

        div(`.users`, [
          div(`.user`, [
            a(`.user-content`, { href: R.prop(`html_url`, user) }, [
              img(`.user-pic`, { src: R.prop(`avatar_url`, user) }),

              span(`.user-description`, [
                span(`.user-name`, R.prop(`name`, user)),
                span(`.user-nick`, `@` + R.prop(`login`, user)),
              ]),
            ]),

            button(`.user-close`, `✕`),
          ]),
        ]),
      ]),
    ))

  return {
    DOM: dom$,
    HTTP: usersRequest$.merge(userRequest$),
  };
}

run(main, {
  DOM: makeDOMDriver(`#content`),
  HTTP: makeFetchDriver(),
  History: makeHistoryDriver(),
});
