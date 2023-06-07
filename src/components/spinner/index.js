import React, { Component } from 'react'
import { Spinner } from 'react-bootstrap'
import './styles.scss'

class LoadingSpinner extends Component {
	render() {
		return (
			<div className='spinnerContainer'>
				<Spinner animation='grow' />
			</div>
		)
	}
}

export default LoadingSpinner
