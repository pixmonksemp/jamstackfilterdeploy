/** @format */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Card, Overlay, Row } from 'react-bootstrap'
import './global-filter-style.scss'

const mapStateToProps = (state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {}
}

class GlobalFilterComponent extends Component {
	static propTypes = {
		filterClick: PropTypes.bool,
		targetRef: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object,
			PropTypes.number,
			PropTypes.array,
		]),
		globalDropDownData: PropTypes.object,
		globalFilterPlacement: PropTypes.string,
		handleRegionNavigation: PropTypes.func,
		handleMarketNavigation: PropTypes.func,
		selectedMarket: PropTypes.string,
		selectedRegion: PropTypes.string,
	}

	static defaultProps = {
		globalFilterPlacement: 'bottom-end',
		filterClick: false,
	}

	constructor(props) {
		super(props)
		{
			this.state = {
				selectedRegionInFilter: null,
				selectedMarketInFilter: null,
			}
		}
	}

	componentWillMount() {
		const { selectedRegion } = this.props
		this.setState({
			selectedRegionInFilter: selectedRegion ? selectedRegion : null,
		})
	}

	handleRegionBtnClick(regionValue, overallFilterValue) {
		this.setState({ selectedRegionInFilter: regionValue })
		this.props.handleRegionNavigation(overallFilterValue)
	}

	handleMarketBtnClick(marketList, regionValue) {
		this.setState({
			selectedMarketInFilter: marketList.market,
			selectedRegionInFilter: null,
		})
		this.props.handleMarketNavigation(marketList, regionValue)
	}

	renderFilterCard = () => {
		const { globalDropDownData, selectedRegion } = this.props
		const { selectedRegionInFilter } = this.state

		return (
			<div className='dashboardFilter-container'>
				<Card className={'dashboardFilter-card'}>
					<Card.Body>
						<Row>
							{globalDropDownData && globalDropDownData.length
								? globalDropDownData.map((overallItems) => {
									this.state.selectedRegionInFilter = selectedRegion
									let regionBtnClassname =
										(this.state
											.selectedRegionInFilter == null
											? selectedRegion
											: selectedRegionInFilter) ==
											overallItems.region
											? 'region-Button-active'
											: 'region-Button'
									let regionGrpahImage =
										overallItems &&
										overallItems.regionLogo

									return (
										overallItems != 'region' && (
											<div
												style={{ padding: '10px' }}
											>
												<Button
													className={
														regionBtnClassname
													}
													onClick={this.handleRegionBtnClick.bind(
														this,
														overallItems.region,
														overallItems
													)}
												>
													<img
														src={
															regionGrpahImage
														}
														style={{
															float: 'left',
														}}
													/>
													<label className='btn-label'>
														{
															overallItems.region
														}
													</label>
												</Button>
												<div
													style={{
														margin: '12px 1px',
													}}
												>
													{overallItems.marketList &&
														overallItems
															.marketList
															.length > 0 &&
														overallItems.marketList.map(
															(items) => {
																let marketsLabelBtn =
																	(this
																		.state
																		.selectedMarketInFilter ==
																		null
																		? this
																			.props
																			.selectedMarket
																		: this
																			.state
																			.selectedMarketInFilter) ==
																		items.market
																		? 'market-labels-active'
																		: 'market-labels'
																return (
																	<div
																		className={
																			marketsLabelBtn
																		}
																		onClick={this.handleMarketBtnClick.bind(
																			this,
																			items,
																			overallItems.region
																		)}
																	>
																		{
																			items.market
																		}
																	</div>
																)
															}
														)}
												</div>
											</div>
										)
									)
								})
								: ''}
						</Row>
					</Card.Body>
				</Card>
			</div>
		)
	}

	render() {
		let filterOverLayOpen = this.props.filterClick
		const { targetRef, globalFilterPlacement } = this.props
		return (
			<div>
				<Overlay
					className='filterOverlay'
					placement={globalFilterPlacement}
					show={filterOverLayOpen}
					target={targetRef}
				>
					<div>{this.renderFilterCard()}</div>
				</Overlay>
			</div>
		)
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(GlobalFilterComponent)
)
