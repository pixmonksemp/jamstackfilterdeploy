import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col, Image, Card } from 'react-bootstrap'
import '../../components/filter-component/filter-style.scss'
import Placeholder from '../../assets/product-placeholder.png'
import ToolTip from '../tooltip/tooltip'
import '../applied-filter/applied-filter.scss'

const mapStateToProps = (state) => {
	return {
		getFilterDataValue: state.stateData.getFilterdata,
		retainingData: state.dashboardValue.selectedFiltersforRetainingValues
	}
}

let displayDropdownList, bundleHierarchy, filterDropdowns
class AppliedFilterCard extends Component {
	static propTypes = {
		hideDropdown: PropTypes.array,
		appliedImage: PropTypes.string,
		retailerCardImage: PropTypes.bool,
		displayKeywordName: PropTypes.string,
		isRetailerLogoClickable: PropTypes.bool,
		handleRetailerLogoClick: PropTypes.func,
		isRetailerLogoTooltipNeeded: PropTypes.bool,
		retailerLogoTooltipContent: PropTypes.string,
		retailerLogoTooltipPosition: PropTypes.string,
		contentNearRetailerLogo: PropTypes.string
	}

	static defaultProps = {
		retailerCardImage: false,
		isRetailerLogoClickable: false,
		isRetailerLogoTooltipNeeded: false,
		retailerLogoTooltipPosition: 'top'
	}

	constructor() {
		super()
		{
			this.state = {
				enabledDropdownList: []
			}
		}
	}

	componentWillMount() {
		const { getFilterDataValue } = this.props
		displayDropdownList = []
		if (getFilterDataValue && getFilterDataValue.organization) {
			if (getFilterDataValue.organization.defaultoption) {
				bundleHierarchy = JSON.parse(
					getFilterDataValue.organization.defaultoption
						.StaticConstants
				)
				filterDropdowns = JSON.parse(
					getFilterDataValue.organization.defaultoption
						.FilterDropdowns
				)
			}
		}

		this.state.enabledDropdownList =
			filterDropdowns.Filters_Enable_Disable_Dropdowns &&
			filterDropdowns.Filters_Enable_Disable_Dropdowns
				.appliedFiltersList &&
			filterDropdowns.Filters_Enable_Disable_Dropdowns.appliedFiltersList.split(
				', '
			)
	}

	trimText = (text) => {
		let trimmedText = text.split(' ')
		trimmedText.length = 5
		return trimmedText.filter(Boolean).join(' ').concat('...')
	}

	renderRetailerCard(appliedImage) {
		const { isRetailerLogoClickable, contentNearRetailerLogo } = this.props
		return (
			<>
				<Card
					className={
						isRetailerLogoClickable
							? 'applied-filter-retailer-card-clickable-style'
							: 'applied-filter-retailer-card-style'
					}
					onClick={
						isRetailerLogoClickable &&
						this.props.handleRetailerLogoClick()
					}>
					{!appliedImage ? (
						<Image
							src={Placeholder}
							className='retailerImageContainer'
						/>
					) : (
						<img
							src={appliedImage}
							className='retailerImageContainer'
						/>
					)}
				</Card>
				{contentNearRetailerLogo &&
				null != contentNearRetailerLogo &&
				contentNearRetailerLogo != undefined ? (
					<p className='compRetailerBased-category-title-style'>
						{contentNearRetailerLogo}
					</p>
				) : (
					''
				)}
			</>
		)
	}

	render() {
		const {
			hideDropdown,
			appliedImage,
			retailerCardImage,
			retainingData,
			displayKeywordName,
			isRetailerLogoTooltipNeeded,
			retailerLogoTooltipContent,
			retailerLogoTooltipPosition
		} = this.props

		// check whether dropdown is applicable for module
		if (
			hideDropdown &&
			hideDropdown !== this.state.enabledDropdownList &&
			this.state.enabledDropdownList != undefined
		) {
			displayDropdownList = this.state.enabledDropdownList.filter(
				(item) => !hideDropdown.includes(item)
			)
		}

		let appliedName
		if (retainingData) {
			appliedName =
				retainingData &&
				retainingData.skuName &&
				retainingData.skuName.length &&
				retainingData.skuName[0] &&
				retainingData.skuName[0].value
		}

		return (
			<>
				<>
					{appliedName &&
					displayDropdownList != undefined &&
					displayDropdownList.includes(bundleHierarchy.sku) ? (
						<Card className='cardSkuBackground'>
							<Card.Body className='applied-filter-cardBody-style'>
								<Row className='applied-filter-cardBody-row'>
									<Col
										md={3}
										sm={3}
										className='cardLeftImgBlock'>
										{!appliedImage ? (
											<Image
												src={Placeholder}
												className='skuImageContainer'
												id='applied-filter-placeholder'
											/>
										) : (
											<Image
												src={appliedImage}
												className='skuImageContainer'
											/>
										)}
									</Col>
									<Col md={8} sm={9}>
										<ToolTip
											content={appliedName}
											position='bottom'>
											<div className='skuText'>
												{this.trimText(appliedName)}
											</div>
										</ToolTip>
									</Col>
								</Row>
							</Card.Body>
						</Card>
					) : (
						''
					)}
					{retailerCardImage &&
					appliedImage &&
					displayDropdownList != undefined &&
					displayDropdownList.includes(bundleHierarchy.retailer) ? (
						isRetailerLogoTooltipNeeded ? (
							<ToolTip
								content={retailerLogoTooltipContent}
								position={retailerLogoTooltipPosition}>
								{this.renderRetailerCard(appliedImage)}
							</ToolTip>
						) : (
							this.renderRetailerCard(appliedImage)
						)
					) : (
						''
					)}
					{displayKeywordName &&
					displayDropdownList != undefined &&
					displayDropdownList.includes(bundleHierarchy.keyword) ? (
						<Row>
							{' '}
							<div className='keyword-data'>
								{' '}
								{`Keyword : ${displayKeywordName} `}{' '}
							</div>{' '}
						</Row>
					) : (
						''
					)}
				</>
			</>
		)
	}
}

export default connect(mapStateToProps, null)(AppliedFilterCard)
