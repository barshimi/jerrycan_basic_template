
import ReduxThunk from 'redux-thunk'
import { routerMiddleware, routerReducer as router } from 'react-router-redux'
import { applyMiddleware, createStore, combineReducers } from 'redux'

const thirdPartyReducers = {
  routing: router
  // Combine core third-party reducers here
}

/**
 * create store with middleware and reducers
 * @param  {class} reducerRegistry  [reducer registry class]
 * @param  {object} history         [html 5 history]
 */
export default async function configureStore (reduxElements, history) {
  const middleware = applyMiddleware(
    ...reduxElements.appMiddleware,
    ReduxThunk,
    routerMiddleware(history)
    // add middlewares here
  )
  const initialCoreReducers = combineReducers(Object.assign(reduxElements.reducerRegistry.getReducers(), thirdPartyReducers))

  let store = middleware(createStore)(initialCoreReducers)

  reduxElements.reducerRegistry.setChangeListener((reducers) => {
    store.replaceReducer(combineReducers(reducers))
  })

  return store
}
