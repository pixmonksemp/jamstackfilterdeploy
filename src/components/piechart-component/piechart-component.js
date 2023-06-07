/** @format */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Pie from 'react-apexcharts'
import { singleDecimal } from '../top-menu/util'
// import { connect } from 'react-redux'
import { GENERIC_COLOR_CODES } from '../../common/common-constants'
import { getOrgSpecificColorCode } from '../util/common-util'

// const mapStateToProps = (state) => {
// 	return {
// 		getFilterDataValue: state.stateData.getFilterdata
// 	}
// }

let mapUnit = '',
	legendDetails = []
	
class PieChart extends Component {
	static propTypes = {
		series: PropTypes.array,
		labels: PropTypes.array,
		isPercentage: PropTypes.bool,
		isLegends: PropTypes.bool,
		isDecimal: PropTypes.bool,
		decimalValue: PropTypes.number,
		xAxis: PropTypes.number,
		yAxis: PropTypes.number,
		pieSize: PropTypes.number,
		pieWidth: PropTypes.number,
		orgBasedColorCodes: PropTypes.string,
		type: PropTypes.string
	}
	static defaultProps = {
		isLegends: false,
		isPercentage: false,
		isDecimal: false,
		xAxis: 0,
		yAxis: 0,
		pieSize: 1,
		pieWidth: 350,
		orgBasedColorCodes: GENERIC_COLOR_CODES
	}
	constructor(props) {
		super(props)

		this.state = {}
	}
	componentWillMount() {
		const { getFilterDataValue } = this.props
		if (
			getFilterDataValue &&
			getFilterDataValue.organization &&
			getFilterDataValue.organization.colorcodeset
		) {
			getFilterDataValue.organization.colorcodeset.map((item) => {
				if (item.modulename == 'inventoryDonutThreshold') {
					legendDetails = item.thresholdset
				}
			})
		}
	}
	render() {
		const {
			series,
			type,
			labels,
			colorProps,
			isLegends,
			xAxis,
			yAxis,
			pieSize,
			pieWidth,
			isPercentage,
			isDecimal,
			decimalValue,
			orgBasedColorCodes,
			getFilterDataValue
		} = this.props
		if (isPercentage) {
			mapUnit = '%'
		}
		let pieValues = [],
		chartType=''
		isDecimal
			? series.length &&
			series.map((i) => {
				Math.round(i) == 100
					? pieValues.push(Math.round(i))
					: pieValues.push(
						parseFloat(i.toFixed(decimalValue))
					)
			})
			: (pieValues = series)
		let colors = []
		labels.map((label) => {
			legendDetails.map((item) => {
				if (
					item.variance.split().join().toUpperCase() ==
					label.split().join().toUpperCase()
				) {
					colors.push(item.colorcode)
				}
			})
		})
		const options = {
			legend: {
				show: isLegends,
				position: 'right',
				fontSize: '13px',
				itemMargin:{
					horizontal:10,
					vertical:5
				},
				// horizontalAlign: 'center',
				markers: {
					width: '10px',
					height: '10px',
					fillColors: [],
					radius: '20px'
				},
				formatter: function (seriesName, opts) {
					let value =
						opts.w.globals.series[opts.seriesIndex] != undefined
							? opts.w.globals.series[opts.seriesIndex]
							: 0
					return  seriesName
				}
			},
			tooltip: {
				enabled: false,
				custom: function (w) {
					return (
				// 		'<div style = "width:120px">' +
						labels[w.seriesIndex] +
						':' +
						w.series[w.seriesIndex] +
						mapUnit 
				// 		'</div>'
					)
				}
			},
			labels: labels,
			colors:colorProps?colorProps:[],
			fill:{
				colors:colorProps?colorProps:[]
			},
			markers:{
				colors:colorProps?colorProps:[]
			},
			dataLabels: {
				enabled: false,
				name: {
					fontSize: '20px'
				},
				value: {
					fontSize: '20px'
				},
				formatter: function (val, w) {
					return w.w.globals.series[w.seriesIndex] + mapUnit
				}
			},
			stroke:{width:0},
			plotOptions: {
				pie: {
					startAngle: 0,
					endAngle: 360,
					expandOnClick: false,
					offsetX: xAxis,
					offsetY: yAxis,
					customScale: pieSize,
					size: 200,
					dataLabels: {
						offset: 0,
						minAngleToShowLabel: 10
					},

					donut: {
						size: '65%',
						background: 'transparent',
						labels: {
							show: true,
							name: {
								show: false,
								fontSize: '22px',
								width: '50px',
								fontFamily: 'Barlow-Regular',
								style: {
									width: '50px'
								},
								fontWeight: 100,
								offsetY: 0,
								formatter: (val) => {
									return val
								}
							},
							value: {
								show: true,
								fontSize: '16px',
								// fontFamily: 'Barlow-Regular',
								fontWeight: 100,
								color: undefined,
								offsetY: 7,
								formatter: (val) => {
									return val + '%'
								}
							},
							total: {
								show: false
							}
						}
					}
				}
			}
		}
		return (
			<div className='app'>
				<Pie
					options={options}
					series={pieValues}
					stroke={0}
					width={pieWidth}
					type={type}
				/>
			</div>
		)
	}
}

// export default connect(mapStateToProps, null)(PieChart)
export default PieChart;