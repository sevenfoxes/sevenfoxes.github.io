// @flow
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ReduxToastr from 'react-redux-toastr'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { createHistory } from 'history/createBrowserHistory'
import { Router } from 'react-router'
import AppContainer from 'react-hot-loader'
import reducers from './reducers/reducersIndex'
import thunk from 'redux-thunk'

// store setup
const initialState = {}
const store = createStore(reducers, applyMiddleware(thunk))

// render things
const generalRender = (EntryComponent, startingNode) => {
  ReactDOM.render(
    <Provider store={store}>
      <EntryComponent />
    </Provider>,
    startingNode)
}
const renderContent = () => {
  const ContentContainer = require('./components/ContentContainer').default
  generalRender(ContentContainer, document.getElementById('react-entry'))
}

renderContent()

