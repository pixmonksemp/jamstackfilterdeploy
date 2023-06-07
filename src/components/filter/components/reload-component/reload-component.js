import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './reload-component.scss'

const mapStateToProps = (state) => {
	return {
		getFilterDataValue: state.stateData.getFilterdata
	}
}

let bundleHierarchy
class ReloadComponent extends React.Component {
	static propTypes = {
		requestValue: PropTypes.object,
		componentType: PropTypes.string,
		isReloadLoading: PropTypes.bool,
		cardReload: PropTypes.func,
		reloadStyle: PropTypes.string
	}
	componentWillMount() {
		const { getFilterDataValue } = this.props
		if (getFilterDataValue && getFilterDataValue.organization) {
			if (getFilterDataValue.organization.defaultoption) {
				bundleHierarchy = JSON.parse(
					getFilterDataValue.organization.defaultoption
						.StaticConstants
				)
			}
		}
	}

	static defaultProps = {
		reloadStyle: 'reload'
	}

	constructor(props) {
		super(props)
		this.state = {}
	}

	clickReload(value, type) {
		this.props.cardReload(value, type)
	}

	render() {
		const { requestValue, componentType, isReloadLoading, reloadStyle, message } =
			this.props

		return (
			<>
				<div
					className={reloadStyle}
					onClick={this.clickReload.bind(
						this,
						requestValue,
						componentType
					)}>
					<center>
						<div>{message ? message : bundleHierarchy.reload_title}</div>
						{isReloadLoading ? (
							<i class='fa fa-refresh reloadButton rotate'></i>
						) : (
							<i class='fa fa-refresh reloadButton'></i>
						)}
					</center>{' '}
				</div>
			</>
		)
	}
}

export default connect(mapStateToProps, null)(ReloadComponent)
