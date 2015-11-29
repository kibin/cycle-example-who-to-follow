/* @flow */
import './index.styl'

import { run } from '@cycle/core'
import { makeDOMDriver } from '@cycle/dom'
import { makeFetchDriver } from '@cycle/fetch'

import { Box } from 'dialogues/box'

function main(sources) {
  const box = Box(sources)

  return {
    DOM: box.DOM,
    HTTP: box.HTTP,
  }
}

run(main, {
  DOM: makeDOMDriver(`#content`),
  HTTP: makeFetchDriver(),
})
