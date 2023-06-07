/** @format */

import React from 'react'
import PropTypes from 'prop-types'
import Chart from 'react-apexcharts'
import { Container, Card, Row, Col, Spinner } from 'react-bootstrap'
import {
	getGraphAxisValueFormatter
} from '../util/graph-axis-util'
import './style.scss'
import DataNotAvailable from '../../components/data-not-available-component/data-not-available'
import { singleDecimal } from '../top-menu/util'
import ToolTip from '../../components/tooltip/tooltip'
import Info_Icon from '../../assets/Info.png'
import { getOrgSpecificColorCode } from '../util/common-util'
import { GENERIC_COLOR_CODES } from '../../common/common-constants'
// import { connect } from 'react-redux'

let isCharacterPresent = false,
	filteredSeries = []

// const mapStateToProps = (state) => {
// 	return {
// 		getFilterDataValue: state.stateData.getFilterdata
// 	}
// }
class ChartComponent extends React.Component {
	static propTypes = {
		series: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
		type: PropTypes.string,
		xAxisData: PropTypes.array,
		stokes: PropTypes.number,
		stokesType: PropTypes.string,
		tooltipShow: PropTypes.bool,
		label: PropTypes.string,
		chartTitle: PropTypes.string,
		chartSubTitle:PropTypes.string,
		chartTitleFontCommon: PropTypes.bool,
		chartHeight: PropTypes.number,
		className: PropTypes.string,
		legendMsgShow: PropTypes.bool,
		colors: PropTypes.array,
		curve: PropTypes.string,
		isSlantAxisLabel: PropTypes.bool,
		isShowPercentageTooltip: PropTypes.bool,
		showDecimal: PropTypes.bool,
		isStacked: PropTypes.bool,
		tickAmount: PropTypes.bool,
		maxValue: PropTypes.number,
		isShowGrid: PropTypes.bool,
		isHorizontal: PropTypes.bool,
		columnWidth: PropTypes.string,
		isShowMarker: PropTypes.bool,
		isPriceAxis: PropTypes.bool,
		yAxisLabel: PropTypes.string,
		yAxisLabelAlign: PropTypes.string,
		barStartingShape: PropTypes.string,
		barEndingShape: PropTypes.string,
		iszeroIndicator: PropTypes.bool,
		//VERTICA-LINE
		isVerticalLine: PropTypes.bool,
		//TOGGLE TITLE
		toggleTitleLeft: PropTypes.string,
		toggleTitleRight: PropTypes.string,
		onSubmit: PropTypes.func,
		xAxisLabelShow: PropTypes.bool,
		dataLabelPosition: PropTypes.string,
		dataLabelMaxLimit: PropTypes.number,
		dataLabelDirection: PropTypes.string,
		distributed: PropTypes.bool,
		showDataLabel: PropTypes.bool,
		showLegend: PropTypes.bool,
		xAxisBorder: PropTypes.bool,
		chartAnimation: PropTypes.bool,
		rowColor: PropTypes.array,
		columnColor: PropTypes.array,
		dataLabelUnit: PropTypes.string,
		dataLabelOffsetX: PropTypes.number,
		dataLabelOffsetY: PropTypes.number,
		//CUSTOM TOOLTIP
		isCustomToolTip: PropTypes.bool,
		customToolTipHeader: PropTypes.string,
		tooltipShared: PropTypes.bool,
		//NO DATA MESSAGE
		noDataMessage: PropTypes.string,
		noDataClassName: PropTypes.string,
		exclamationIconClassName: PropTypes.string,
		messageClassName: PropTypes.string,
		//BUTTON
		isButton: PropTypes.bool,
		buttonTitle: PropTypes.string,
		onSubmitted: PropTypes.func,
		buttonWidth: PropTypes.string,
		barBackgroundColor: PropTypes.array,
		strokeColor: PropTypes.array,
		//GRAPH MAIN CONTAINER
		graphClassName: PropTypes.string,
		//LOADING
		graphLoading: PropTypes.bool,
		//SPINNER CLASSNAME
		graphSpinnerClassName: PropTypes.string,
		//DATA LABEL
		dataLabelColor: PropTypes.array,
		//GRAPH HEADER CLASS NAME
		graphHeaderClassName: PropTypes.string,
		//HEADER
		isHeaderPresent: PropTypes.bool,
		chartClassStyle: PropTypes.string,
		//IS CLOSE ICON
		isCloseIcon: PropTypes.bool,
		//TOOLBAR
		showToolBar: PropTypes.bool,
		toggleHeaderChecked: PropTypes.bool,
		//
		tooltipIntersect: PropTypes.bool,
		//INFO ICON
		infoZeroValueModuleName: PropTypes.string,
		chartInfoIconClass: PropTypes.string,
		infoIconRowClass: PropTypes.object,
		stokesColor: PropTypes.array,
		textAnchorDataLabel: PropTypes.string,
		//STATIC LEGEND
		legendDetails: PropTypes.array,
		staticLegendStyle: PropTypes.string,
		isStaticLegendPresent: PropTypes.bool,
		staticLegend: PropTypes.func,
		//HEADING
		chartHeadingStyle: PropTypes.string,
		chartHeadingName: PropTypes.string,
		//ANNOTATIONS
		annotationsPosition: PropTypes.string,
		annotationsYAxisValue: PropTypes.number,
		annotationsYAxistrokeDashArray: PropTypes.number,
		annotationsYAxisBorderColor: PropTypes.string,
		annotationsYAxisFillColor: PropTypes.string,
		annotationsYAxisWidth: PropTypes.string,
		//TREEMAP PLOT OPTIONS
		enableShadesForTreemap: PropTypes.bool,
		enableFillColorForTreemap: PropTypes.bool,
		//STATES FOR CLICK OR HOVER TO CHANGE COLOR OF GRAPH
		normalStatesFilterType: PropTypes.string,
		normalStatesFilterValue: PropTypes.number,
		hoverStatesFilterType: PropTypes.string,
		hoverStatesFilterValue: PropTypes.number,
		activeStatesFilterType: PropTypes.string,
		activeStatesFilterValue: PropTypes.number,
		isInfoIcon: PropTypes.bool,
		//line chart width
		lineChartWidth: PropTypes.string,
		legendMsg: PropTypes.string,
		isInfoMsgPresent: PropTypes.bool,
		isInfoMsgRequired: PropTypes.bool,
		infoMsg: PropTypes.string,
		tooltipView: PropTypes.bool,
		orgBasedColorCodes: PropTypes.string
	}

	static defaultProps = {
		isInfoIcon: false,
		tooltipShow: true,
		stokes: 0,
		stokesType: 'straight',
		chartHeight: 335,
		showDecimal: false,
		isStacked: false,
		isShowGrid: true,
		graphFrequency: null,
		isHorizontal: false,
		columnWidth: '50%',
		isSlantAxisLabel: false,
		isShowMarker: true,
		isShowPercentageTooltip: false,
		isPriceAxis: false,
		iszeroIndicator: false,
		isVerticalLine: false,
		xAxisLabelShow: true,
		dataLabelPosition: 'center',
		dataLabelMaxLimit: 100,
		dataLabelMaxLimit: 'vertical',
		distributed: false,
		showDataLabel: false,
		showLegend: true,
		xAxisBorder: true,
		chartAnimation: false,
		rowColor: [],
		columnColor: [],
		dataLabelUnit: '',
		dataLabelOffsetX: 20,
		dataLabelOffsetY: 0,
		isCustomToolTip: false,
		isButton: false,
		barBackgroundColor: [],
		graphClassName: 'graphContainerStyle',
		tooltipShared: true,
		graphLoading: true,
		graphSpinnerClassName: 'dataGridSpinner',
		dataLabelColor: ['#ffffff'],
		graphHeaderClassName: 'graphComponentHeader',
		tooltipLabels: {},
		abbrevatedTooltip: false,
		isHeaderPresent: true,
		yAxisLabelAlign: 'right',
		barStartingShape: 'flat',
		barEndingShape: 'flat',
		isCloseIcon: false,
		showToolBar: false,
		toggleHeaderChecked: true,
		tickAmount: 5,
		tooltipIntersect: false,
		infoZeroValueModuleName: 'having zero values',
		chartInfoIconClass: 'chartInfoIconStyle',
		infoIconRowClass: { marginTop: '-22px' },
		textAnchorDataLabel: 'middle',
		staticLegendStyle: 'graph-staticLegendStyle',
		chartHeadingStyle: 'graph-HeadingStyle',
		chartHeadingName: '',
		annotationsPosition: 'front',
		annotationsYAxisValue: 100,
		annotationsYAxistrokeDashArray: 5,
		annotationsYAxisBorderColor: '#ff0000',
		annotationsYAxisFillColor: '#ff0000',
		annotationsYAxisWidth: '0%',
		isStaticLegendPresent: false,
		enableShadesForTreemap: false,
		enableFillColorForTreemap: false,
		normalStatesFilterType: 'none',
		normalStatesFilterValue: 0,
		hoverStatesFilterType: 'none',
		hoverStatesFilterValue: 0,
		activeStatesFilterType: 'none',
		activeStatesFilterValue: 0,
		lineChartWidth: '90%',
		legendMsg: '',
		isInfoMsgPresent: false,
		isInfoMsgRequired: false,
		infoMsg: '',
		tooltipView: false,
		orgBasedColorCodes: GENERIC_COLOR_CODES
	}

	constructor(props) {
		super(props)
		this.state = {
			toggleHeaderChecked: true
		}
	}

	clickToggleTitle(value) {
		const { toggleTitleLeft } = this.props
		this.setState({
			toggleHeaderChecked: value === toggleTitleLeft ? true : false
		})
		this.props.onSubmit(value)
	}

	buttonOnClick(value) {
		this.props.onSubmitted(value)
	}

	infoZeroValue(value) {
		const {
			infoZeroValueModuleName,
			chartInfoIconClass,
			infoIconRowClass,
			isInfoMsgRequired,
			infoMsg
		} = this.props

		//This iteration used to check all values in array are zero
		let infoNames = [], zeroCheckForInfo = false
		value && value.length && value.map((seriesItem) => {
			zeroCheckForInfo = false
			zeroCheckForInfo = seriesItem.data && seriesItem.data.length && seriesItem.data.every((dataItem) =>
				dataItem == 0
			)
			zeroCheckForInfo && infoNames.push(seriesItem.name)
		})
		infoNames = [...new Set(infoNames)]

		//This iteration used to add 'and' in the tooltip content
		let arrayValues = [],
			tooltipContent = ''
		infoNames &&
			infoNames.length &&
			infoNames.map((item, index) => {
				if (infoNames.length - 2 >= index) {
					arrayValues.push(item)
				} else if (infoNames.length - 2 <= index) {
					tooltipContent =
						infoNames.length !== 1
							? arrayValues
								.join(', ')
								.concat(' and ')
								.concat(item)
							: item
				}
			})

		return (
			<>
				{isInfoMsgRequired || (infoNames && infoNames.length !== 0) ? (
					<Row>
						<Col className={chartInfoIconClass}>
							<ToolTip
								content={isInfoMsgRequired ? infoMsg
									: tooltipContent.concat(
										` - ${infoNames.length == 1 ? 'Is' : 'Are'
										} ${infoZeroValueModuleName}`
									)}
								position='left'
								style={infoIconRowClass}
							>
								<img src={Info_Icon} />
							</ToolTip>
						</Col>
					</Row>
				) : (
					''
				)}
			</>
		)
	}

	render() {
		const {
			series,
			type,
			xAxisData,
			tooltipShow,
			label,
			chartTitle,
			chartSubTitle,
			chartTitleFontCommon,
			stokes,
			chartHeight,
			curve,
			isSlantAxisLabel,
			isShowPercentageTooltip,
			showDecimal,
			isStacked,
			maxValue,
			isShowGrid,
			isHorizontal,
			columnWidth,
			isShowMarker,
			colors,
			isPriceAxis,
			yAxisLabel,
			iszeroIndicator,
			toggleTitleLeft,
			toggleTitleRight,
			toggleOffClassName,
			toggleOnClassName,
			isVerticalLine,
			dataLabelPosition,
			dataLabelMaxLimit,
			dataLabelDirection,
			distributed,
			showDataLabel,
			showLegend,
			xAxisLabelShow,
			xAxisBorder,
			chartAnimation,
			rowColor,
			columnColor,
			dataLabelUnit,
			dataLabelOffsetX,
			dataLabelOffsetY,
			isCustomToolTip,
			tooltipLabels,
			abbrevatedTooltip,
			customToolTipHeader,
			noDataMessage,
			isButton,
			buttonTitle,
			buttonWidth,
			barBackgroundColor,
			strokeColor,
			noDataClassName,
			exclamationIconClassName,
			messageClassName,
			graphClassName,
			tooltipShared,
			graphLoading,
			graphSpinnerClassName,
			dataLabelColor,
			graphHeaderClassName,
			isHeaderPresent,
			yAxisLabelAlign,
			barStartingShape,
			barEndingShape,
			chartClassStyle,
			isCloseIcon,
			showToolBar,
			tickAmount,
			legendMsgShow,
			tooltipIntersect,
			stokesColor,
			stokesType,
			textAnchorDataLabel,
			legendDetails,
			staticLegendStyle,
			chartHeadingStyle,
			chartHeadingName,
			annotationsPosition,
			annotationsYAxisValue,
			annotationsYAxistrokeDashArray,
			annotationsYAxisBorderColor,
			annotationsYAxisFillColor,
			annotationsYAxisWidth,
			isStaticLegendPresent,
			staticLegend,
			enableShadesForTreemap,
			enableFillColorForTreemap,
			normalStatesFilterType,
			normalStatesFilterValue,
			hoverStatesFilterType,
			hoverStatesFilterValue,
			activeStatesFilterType,
			activeStatesFilterValue,
			lineChartWidth,
			legendMsg,
			isInfoMsgPresent,
			tooltipView,
			orgBasedColorCodes,
			getFilterDataValue
		} = this.props

		const { toggleHeaderChecked } = this.state
		let curves = curve && { curve: curve }
		let xAxisValues = []
		xAxisData && xAxisData.length && xAxisData.map((item) => {
			if (item && item.includes(' ') && item.length > 15) {

				xAxisValues.push(item.split(' '))

			}
			else {
				xAxisValues.push(item)
			}
		})

		//Condition to check the presence of numbers
		if (
			xAxisData &&
			!xAxisData.every(element => typeof element === 'number')
		)
			isCharacterPresent = true

		// This Itration used to indicate the Zero values at chart
		let zeroIndicate = []
		let count = 0
		series &&
			series.length &&
			series.map(item => {
				item.data &&
					item.data.length &&
					item.data.map((item, index) => {
						if (item == 0) {
							let indicator = {
								seriesIndex: count,
								dataPointIndex: index,
								fillColor: '#fa042d',
								strokeColor: '#ffffff',
								size: 5
							}
							zeroIndicate.push(indicator)
						}
					})
				count++
			})

		const yaxisValue = {
			labels: {
				//Depends upon the response value, Appending K/M in Y axis label
				formatter: value => {
					return isPriceAxis
						? getGraphAxisValueFormatter(
							isShowPercentageTooltip
								? value >= 100
									? 100
									: value
								: value
						)
						: isCharacterPresent && isHorizontal
							? isShowPercentageTooltip
								? value >= 100
									? 100
									: value
								: value
							: Math.round(
								isShowPercentageTooltip
									? value >= 100
										? 100
										: value
									: value
							)
				},
				style: {
					fontFamily: 'Barlow-Regular',
					fontSize: '12px',
					fontWeight: 500,
					color: '#353535'
				},
				align: yAxisLabelAlign
			},
			title: {
				text: yAxisLabel,
				style: {
					fontFamily: 'Barlow-Regular',
					fontSize: '12px',
					fontWeight: 'normal',
					color: '#979797'
				}
			},
			tickAmount: tickAmount,
			min: 0,
			max: maxValue
		}

		// need to do refactoring for xaxis value

		// let xAxisValue = []
		// xAxisData && xAxisData.map((item) => {
		// 	const splitItem = item.split(' ')
		// 	let splitItemArray = [`${splitItem[0]} ${splitItem[1]}`, splitItem[2]]
		// 	xAxisValue.push(splitItemArray)
		// })
		// let check1 = []
		// xAxisData && xAxisData.map((item) => {
		// 	const checkitem = item.split(' ')
		// 	let arr = []
		// 	arr = [`${checkitem[0]} ${checkitem[1]}`, checkitem[2]]
		// 	check1.push(arr)
		// })

		let options = {
			annotations: {
				position: annotationsPosition,
				yaxis: [{
					y: annotationsYAxisValue,
					y2: null,
					strokeDashArray: annotationsYAxistrokeDashArray,
					borderColor: annotationsYAxisBorderColor,
					fillColor: annotationsYAxisFillColor,
					width: annotationsYAxisWidth,
				}]
			},
			chart: {
				stacked: isStacked,
				height: 160,
				type: type,
				toolbar: {
					show: showToolBar
				},
				zoom: {
					enabled: false
				},
				animations: {
					enabled: chartAnimation
				}
			},
			markers: {
				size: isShowMarker ? 4 : 0,
				strokeWidth: 2,
				fillOpacity: 0,
				strokeOpacity: 1,
				hover: {
					size: isShowMarker ? 6 : 0
				},
				discrete: iszeroIndicator && zeroIndicate
			},
			plotOptions: {
				bar: {
					horizontal: isHorizontal,
					columnWidth: columnWidth,
					startingShape: barStartingShape,
					endingShape: barEndingShape,
					distributed: distributed,
					dataLabels: {
						position: dataLabelPosition,
						maxItems: dataLabelMaxLimit,
						hideOverflowingLabels: true,
						orientation: dataLabelDirection
					},
					colors: {
						backgroundBarColors: barBackgroundColor
					}
				},
				treemap: {
					enableShades: enableShadesForTreemap,
					useFillColorAsStroke: enableFillColorForTreemap,
				},
			},
			dataLabels: {
				enabled: showDataLabel,
				textAnchor: textAnchorDataLabel,
				formatter: function (value) {
					return type !== 'treemap'
						? isShowPercentageTooltip
							? Math.round(value) >= 100
								? '100' + dataLabelUnit
								: !showDecimal
									? Math.round(value) + dataLabelUnit
									: singleDecimal(value, 2) + dataLabelUnit
							: Math.round(value) + dataLabelUnit
						: value
				},
				offsetX: dataLabelOffsetX,
				offsetY: dataLabelOffsetY,
				style: {
					fontSize: '12px',
					fontFamily: 'Barlow-Regular',
					colors: dataLabelColor
				}
			},
			legend: {
				show: showLegend,
				fontSize: '12px',
				fontFamily: 'Barlow-Regular',
				showForSingleSeries: true,
				showForNullSeries: true,
				showForZeroSeries: true,
				position: 'bottom',
				height: series && series.length < 10 ? 0 : 80,
				horizontalAlign: 'left',
				offsetX: -35,
				itemMargin: {
					horizontal: 15,
					vertical: 10
				},
				onItemClick: {
					toggleDataSeries: true
				},
				onItemHover: {
					highlightDataSeries: true
				},
				markers: {
					width: '10px',
					height: '10px',
					fillColors: getOrgSpecificColorCode(getFilterDataValue, orgBasedColorCodes),
					radius: '15px'
				}
			},
			stroke: {
				width: stokes,
				curve: stokesType,
				colors: stokesColor ? stokesColor : getOrgSpecificColorCode(getFilterDataValue, orgBasedColorCodes)
			},
			grid: {
				show: isShowGrid,
				borderColor: '#e0e0e0',
				strokeDashArray: 4,
				row: {
					colors: rowColor,
					opacity: 0.5
				},
				column: {
					colors: columnColor,
					opacity: 0.2
				}
			},
			colors: colors ? colors : getOrgSpecificColorCode(getFilterDataValue, orgBasedColorCodes),
			xaxis: {
				categories: xAxisData && xAxisData.length && xAxisData.every(item => item != null && item.length < 10) ? xAxisValues : xAxisData,
				// Property to use for tooltip with formatting
				tooltip: {
					enabled: abbrevatedTooltip ? true : false,
					formatter: function (val, opts) {
						if (tooltipView) {
							var tooltip = opts.w.globals.dom.elWrap.querySelector('.apexcharts-tooltip');
							tooltip.classList.add('custom-apexchart-tooltip');
						}
						return tooltipLabels[val]
					}
				},
				labels: {
					show: xAxisLabelShow,
					trim: xAxisData && xAxisData.length && xAxisData.every(item => item != null && item.length < 7) ? false : true,
					rotate: xAxisData && xAxisData.length <= 10 ? -45 : -60,
					rotateAlways: isSlantAxisLabel,
					style: {
						fontFamily: 'Barlow-Regular',
						fontSize: '12px',
						fontWeight: 500,
						color: '#353535'
					}
				},
				title: {
					text: !isHorizontal ? '' : label,
					offsetX: 1,
					offsetY: 1,
					style: {
						fontFamily: 'Barlow-Regular',
						fontSize: '12px',
						fontWeight: 'normal',
						color: '#979797'
					}
				},
				axisBorder: {
					show: xAxisBorder
				},
				axisTicks: {
					show: false
				}
			},
			tooltip: isCustomToolTip
				? {
					custom: function ({
						series,
						seriesIndex,
						dataPointIndex,
						w
					}) {
						let name = [],
							value = [],
							toolTip = [],
							toolTipDetail = []
						const names = data => {
							return toolTipDetail.map(function (item) {
								return item[data]
							})
						}
						w.globals.initialSeries.map(i => {
							if (i.id == seriesIndex) {
								i.customTooltipDetails[dataPointIndex].map(
									i => {
										let toolTipObject = {
											name: i.name,
											value: i.value
										}
										toolTipDetail.push(toolTipObject)
									}
								)
								name = names('name')
								value = names('value')
								toolTip = name.map(
									(e, i) => e + ': ' + value[i]
								)
							}
						})

						return (
							'<div>' +
							'<div class="customToolTipHeader">' +
							customToolTipHeader +
							'</div>' +
							'<span class="customTooltip">' +
							toolTip.join(', ') +
							'</span>' +
							'</div>'
						)
					}
				}
				: {
					enabled: true,
					shared: tooltipShared,
					followCursor: true,
					intersect: tooltipIntersect,
					style: {
						fontSize: '12px',
						fontFamily: 'Barlow-Regular'
					},
					x: {
						show: tooltipShow
					},
					y: {
						formatter: val => {
							if (isShowPercentageTooltip) {
								return Math.round(val) >= 100
									? '100%'
									: !showDecimal
										? `${Math.round(val)}%`
										: `${singleDecimal(val, 2)}%`
							} else
								return (
									!showDecimal ?
										val >= 100 &&
											isShowPercentageTooltip
											? 100
											: val
										: singleDecimal(val, 2) + (isShowPercentageTooltip ? '%' : '')
								)
						}
					}
				},
			yaxis: yaxisValue,
			noData: {
				text: 'No data available',
				align: 'center',
				verticalAlign: 'middle',
				offsetX: 0,
				offsetY: 0,
				style: {
					color: '#e5712a',
					fontSize: '14px',
					fontFamily: 'Barlow-Bold'
				}
			},
			states: {
				normal: {
					filter: {
						type: normalStatesFilterType,
						value: normalStatesFilterValue,
					}
				},
				hover: {
					filter: {
						type: hoverStatesFilterType,
						value: hoverStatesFilterValue,
					}
				},
				active: {
					filter: {
						type: activeStatesFilterType,
						value: activeStatesFilterValue,
					}
				},
			}
		}
		let arrayValues = []
		filteredSeries = []
		series &&
			series.length &&
			series.map(i => {
				if (i && i.data != undefined) {
					i.data.map(item => {
						arrayValues.push(item)
					})
				}
			})
		series &&
			series.length &&
			series.map((i) => {
				if (i && i.data && !i.data.every(item => item === 0)) {
					filteredSeries.push(i)
				}
			})
		const isAllZero = arrayValues.every(item => item === 0 || item === '0' || item === 'NaN' || item === null)

		let graphLegend = (
			<>
				{/*Dynamically adding the legend with its respective title, which is passed from the page
				 */}
				{legendDetails &&
					legendDetails.length &&
					legendDetails.map((item) => (
						<>
						<div>
							<div
								class='doughnut'
								style={{ color: item.legendColor }}></div>
							<a className='gridLegendVariance'>{item.title}</a>
							</div>
						</>
					))}
				{isStaticLegendPresent && staticLegend}
			</>
		)

		return (
			<Card className={graphClassName}>
				<Card.Body>
					{/* {isHeaderPresent && !graphLoading && ( */}
					<div className={graphHeaderClassName}>
						<Row>
							<Col>
								<div
									className={
										chartTitleFontCommon
											? 'graphComponentRatingTitle'
											: 'graphComponentTitle'
									}>
									{chartTitle}
								</div>
								<div className='graphSubTitle'>
									{chartSubTitle}
								</div>
							</Col>

							{(series && series.length) != 0 && (
								<Col>
									<div className='graphToggle'>
										<a
											className={
												this.props
													.toggleHeaderChecked
													? toggleOnClassName
													: toggleOffClassName
											}
											onClick={this.clickToggleTitle.bind(
												this,
												toggleTitleLeft
											)}>
											{toggleTitleLeft}
										</a>

										{isVerticalLine && (
											<div className='verticalLine'></div>
										)}
										<a
											className={
												this.props
													.toggleHeaderChecked
													? toggleOffClassName
													: toggleOnClassName
											}
											onClick={this.clickToggleTitle.bind(
												this,
												toggleTitleRight
											)}>
											{toggleTitleRight}
										</a>
									</div>
								</Col>
							)}

							{isButton && (
								<Button
									className='applyButton'
									style={{ width: buttonWidth }}
									onClick={this.buttonOnClick.bind(
										this,
										buttonTitle
									)}>
									{buttonTitle}
								</Button>
							)}
						</Row>
					</div>
					{/* )} */}
					{!graphLoading ? (
						!(
							series &&
							series.length &&
							xAxisData &&
							xAxisData.length
						) ? (
							<DataNotAvailable
								message={noDataMessage}
								noDataCardStyle={noDataClassName}
								exclamationIconStyle={exclamationIconClassName}
								messageStyle={messageClassName}
								isCloseIcon={isCloseIcon}
							/>
						) : isAllZero ? (
							<DataNotAvailable
								message={noDataMessage}
								noDataCardStyle={noDataClassName}
								exclamationIconStyle={exclamationIconClassName}
								messageStyle={messageClassName}
								isCloseIcon={isCloseIcon}
							/>
						) : (
							<>
								<div className={chartClassStyle}>
									{chartHeadingName !== '' && (
										<p className={chartHeadingStyle}>{chartHeadingName}</p>
									)}
									<Chart
										options={options}
										series={type === 'bar' ? series : filteredSeries}
										type={type}
										height={chartHeight}
										width={type === 'line' ? lineChartWidth : '98%'}
									/>
									{isInfoMsgPresent && this.infoZeroValue(series)}
									{legendMsgShow ? (
										<div className='nationalLegendMsgText'>
											{legendMsg}
										</div>
									) : (
										''
									)}
								</div>
								{legendDetails && legendDetails.length && (
									<div className={staticLegendStyle}>{graphLegend}</div>
								)}
								{this.props.isInfoIcon && this.props.infoIconElement}
							</>
						)
					) : (
						<center>
							<Spinner
								animation='grow'
								className={graphSpinnerClassName}
							/>
						</center>
					)}

				</Card.Body>

			</Card>
		)
	}
}

// export default connect(mapStateToProps, null)(ChartComponent)
export default ChartComponent;