import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './stores'
import router from './routers'

render(
  <Provider store={store}>
    {router}
  </Provider>,
  document.getElementById('app')
)