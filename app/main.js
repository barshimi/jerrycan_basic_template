/**
 * system entry point
 */
import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Router, useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import configureStore from './store'
import './globalStyle/_globals.scss'
import jerrycan from 'jerrycan'

async function initialApp (env) {
  const reduxElements = await jerrycan.init(env)
  const browserHistory = useRouterHistory(createBrowserHistory)()
  const store = await configureStore(reduxElements, browserHistory)
  const history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState: (state) => state.routing
  })
  if (env !== 'production') {
    if (module.hot) {
      module.hot.accept(['jerrycan'], () => {
        const {reducersCreator} = require('jerrycan')
        reduxElements.reducerRegistry.register(reducersCreator())
      })
    }
  }

  const wraperStyle = {height: '100%'}
  return ReactDOM.render(
    process.env.NODE_ENV !== 'production' && module.hot
      ? (<AppContainer>
        <Provider store={store}>
          <div style={wraperStyle}>
            <Router history={history} routes={reduxElements.routes} />
          </div>
        </Provider>
      </AppContainer>)
      : (<Provider store={store}>
        <div style={wraperStyle}>
          <Router history={history} routes={reduxElements.routes} />
        </div>
      </Provider>), document.getElementById('root'))
}

initialApp(process.env.NODE_ENV || 'development')
