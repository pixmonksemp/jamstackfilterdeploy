import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

const NAV_RELOAD = 1

class ProtectedRoute extends Component {
	render() {
		const { component: Component, ...props } = this.props

		if (performance.navigation.type === NAV_RELOAD) {
			// sessionStorage.clear('loginUserDetails')
			return (
				<Switch>
					<Redirect to='/' />
				</Switch>
			)
		}

		return <Route {...props} render={(props) => <Component {...props} />} />
	}
}

export default connect(null, null)(ProtectedRoute)
