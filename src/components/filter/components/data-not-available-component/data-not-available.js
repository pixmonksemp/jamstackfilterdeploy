import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { NO_DATA_FOR_SELECTED_FILTER, LOGIN_USER_DETAILS } from '../../common/common-constants'
import './style.scss'

let bundleHierarchy,
	isLoggedIn
class DataNotAvailable extends Component {
	static propTypes = {
		message: PropTypes.string,
		noDataCardStyle: PropTypes.string,
		exclamationIconStyle: PropTypes.string,
		messageStyle: PropTypes.string,
		isCloseIcon: PropTypes.bool,
		isInfoIcon: PropTypes.bool
	}

	static defaultProps = {
		message: NO_DATA_FOR_SELECTED_FILTER,
		noDataCardStyle: 'emptyContentContainer',
		exclamationIconStyle: 'emptyImageBlock',
		messageStyle: 'emptyMessageBlock',
		isCloseIcon: false,
		isInfoIcon: false
	}

	componentWillMount() {
		isLoggedIn = JSON.parse(sessionStorage.getItem(LOGIN_USER_DETAILS))
		this.setState({
			exclamation:
				isLoggedIn && isLoggedIn.pimercecdn && isLoggedIn.pimercecdn.pimerce_info_yellow_color_icon,
			Info_Icon:
				isLoggedIn && isLoggedIn.pimercecdn && isLoggedIn.pimercecdn.pimerce_info_orange_color_icon,
			close:
				isLoggedIn && isLoggedIn.pimercecdn && isLoggedIn.pimercecdn.pimerce_close_icon
		})
	}

	render() {
		const { message, noDataCardStyle, exclamationIconStyle, messageStyle, isCloseIcon, isInfoIcon } = this.props
		const { exclamation, Info_Icon, close } = this.state
		let icon
		if (isInfoIcon) {
			icon = Info_Icon
		}
		else if (isCloseIcon) {
			icon = close
		}
		else {
			icon = exclamation
		}
		return (
			<Card className={noDataCardStyle}>
				<Card.Body>
					<Card.Img src={icon} className={exclamationIconStyle} />
					<div className={messageStyle}>{message}</div>
				</Card.Body>
			</Card>
		)
	}
}

export default DataNotAvailable