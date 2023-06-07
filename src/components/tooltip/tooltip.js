/** @format */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import './style.scss'

export default class ToolTip extends Component {
	static propTypes = {
		content: PropTypes.string.isRequired,
		position: PropTypes.string.isRequired,
		style: PropTypes.object
	}

	static defaultProps = {
		content: 'No Data',
		position: 'left'
	}

	render() {
		const { content, position, children, style } = this.props
		return (
			<OverlayTrigger
				defaultShow={false}
				placement={position}
				overlay={
					<Tooltip id={`tooltip-${position}`}>{content}</Tooltip>
				}>
				<span style={style}>{children}</span>
			</OverlayTrigger>
		)
	}
}
