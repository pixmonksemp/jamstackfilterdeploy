/** @format */

import React from 'react'
import { render } from 'react-dom'
import store from '../store/index'
import { Provider } from 'react-redux'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import App from "./common/context-navigation"
import './scss/styles.scss'
import './index.scss'

const history = createBrowserHistory()

window.onpopstate = function () {
	history.go(1)
}	

render(
	<Provider store={store}>
		<HashRouter history={history}>
		<App/>
		</HashRouter>
	</Provider>,
	document.getElementById('root')
)