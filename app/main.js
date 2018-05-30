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

function initialApp (env) {
  const reduxElements = jerrycan.init(env)
  const browserHistory = useRouterHistory(createBrowserHistory)()
  configureStore(reduxElements, browserHistory).then(store => {
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
    ReactDOM.render(
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
  })
  // const reduxElements = jerrycan.init(env)
  // const browserHistory = useRouterHistory(createBrowserHistory)()
  // const store = configureStore(reduxElements, browserHistory)
  // console.log(store)
  // const history = syncHistoryWithStore(browserHistory, store, {
  //   selectLocationState: (state) => state.routing
  // })
  // if (env !== 'production') {
  //   if (module.hot) {
  //     module.hot.accept(['jerrycan'], () => {
  //       const {reducersCreator} = require('jerrycan')
  //       reduxElements.reducerRegistry.register(reducersCreator())
  //     })
  //   }
  // }
  // const wraperStyle = {height: '100%'}
  // ReactDOM.render(
  //   process.env.NODE_ENV !== 'production' && module.hot
  //     ? (<AppContainer>
  //       <Provider store={store}>
  //         <div style={wraperStyle}>
  //           <Router history={history} routes={reduxElements.routes} />
  //         </div>
  //       </Provider>
  //     </AppContainer>)
  //     : (<Provider store={store}>
  //       <div style={wraperStyle}>
  //         <Router history={history} routes={reduxElements.routes} />
  //       </div>
  //     </Provider>), document.getElementById('root'))
  return reduxElements.actions
}

export default initialApp(process.env.NODE_ENV || 'development')
