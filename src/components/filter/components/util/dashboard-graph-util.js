/** @format */
// import {
// 	font_sm,
// 	font_lg,
// 	barlow_regular,
// 	barlow_bold,
// 	vulcan_color,
// 	night_rider_color
// } from "../../styling/scss/_variables.scss";

export function dashboardPricingGraphOption(
	xaxisData,
	maxValue,
	isPricingHorizontal
) {
	return {
		colors: ['#2c82be', '#76ddfb', '#53a8e2', 'transparent'],
		chart: {
			stacked: true,
			zoom: {
				enabled: false
			}
		},
		legend: {
			showForSingleSeries: true,
			position: 'bottom',
			horizontalAlign: 'left',
			offsetX: 0,
			itemMargin: {
				horizontal: 5,
				vertical: 10
			},
			onItemClick: {
				toggleDataSeries: true
			},
			onItemHover: {
				highlightDataSeries: true
			},
			markers: {
				radius: 12,
				fillColors: ['#2c82be', '#76ddfb', '#53a8e2', 'transparent']
			}
		},
		tooltip: {
			enabled: true,
			shared: true,
			followCursor: true,
			onDatasetHover: {
				highlightDataSeries: true
			}
		},
		grid: {
			show: false
		},
		responsive: [
			{
				breakpoint: 480,
				options: {
					legend: {
						position: 'bottom',
						horizontalAlign: 'left',
						offsetX: -10,
						offsetY: 0
					}
				}
			}
		],
		plotOptions: {
			bar: {
				horizontal: isPricingHorizontal
			}
		},
		title: {
			text: 'Pricing Compliance',
			align: 'left',
			style: {
				fontFamily: barlow_bold,
				fontSize: font_lg,
				fontStretch: 'normal',
				fontStyle: 'normal',
				lineHeight: 1.25,
				letterSpacing: '-0.05px',
				color: vulcan_color
			}
		},
		yaxis: [
			{
				axisTicks: {
					show: false
				},
				tickAmount: 5,
				min: 0,
				max: maxValue,
				axisBorder: {
					show: true,
					color: '#ececec'
				},
				labels: {
					style: {
						color: '#008FFB'
					}
				}
			}
		],
		dataLabels: {
			enabled: false,
			hideOverflowingLabels: false,
			style: {
				colors: ['#fff', '#fff', '#fff', '#fff']
			}
		},
		stroke: {
			show: false,
			width: [1, 1, 1, 0],
			colors: ['#fff', '#fff', '#fff', '#fff']
		},
		xaxis: {
			categories: xaxisData
		}
	}
}

export function dashboardPricingGraphSeries(
	compliantData,
	noncompliantData,
	totalSku,
	isPricingHorizontal
) {
	if (isPricingHorizontal) {
		return [
			{
				name: 'Compliant',
				data: compliantData
			},
			{
				name: 'Non Compliant',
				data: noncompliantData
			}
		]
	} else {
		return [
			{
				name: 'Compliant',
				type: 'column',
				data: compliantData
			},
			{
				name: 'Non Compliant',
				type: 'column',
				data: noncompliantData
			},
			{
				name: 'Total SKUs',
				type: 'column',
				data: totalSku
			},
			{
				name: '',
				type: 'line',
				data: []
			}
		]
	}
}

export function dashboardAvailabilityGraphOption(
	xaxisData,
	isAvailabilityHorizontal,
	availabilityTotalSku
) {
	return {
		colors: ['#2c82be', '#dbecf8', '#ff6c40'],
		chart: {
			stacked: true,
			zoom: {
				enabled: false
			}
		},
		plotOptions: {
			bar: {
				horizontal: isAvailabilityHorizontal
			}
		},
		dataLabels: {
			enabled: false,
			hideOverflowingLabels: false,
			style: {
				colors: ['#fff']
			}
		},
		stroke: {
			width: [1, 1, 2]
		},
		title: {
			text: 'Retailer Availability',
			align: 'left',
			style: {
				fontFamily: barlow_bold,
				fontSize: font_lg,
				fontStretch: 'normal',
				fontStyle: 'normal',
				lineHeight: 1.25,
				letterSpacing: '-0.05px',
				color: vulcan_color
			}
		},
		xaxis: {
			categories: xaxisData,
			labels: {
				style: {
					colors: night_rider_color
				}
			},
			title: {
				text: isAvailabilityHorizontal ? 'Number of SKU' : '',
				style: {
					fontFamily: barlow_regular,
					fontSize: font_sm,
					fontWeight: 'normal',
					color: '#959595'
				}
			}
		},
		grid: {
			show: false
		},
		yaxis: [
			{
				seriesName: 'SKU Availability %',
				opposite: false,
				tickAmount: 5,
				min: 0,
				max: availabilityTotalSku,
				axisTicks: {
					show: false
				},
				axisBorder: {
					show: true,
					color: '#ececec'
				},
				labels: {
					style: {
						colors: night_rider_color
					}
				},
				title: {
					text: isAvailabilityHorizontal ? '' : 'Number of SKU',
					style: {
						fontFamily: barlow_regular,
						fontSize: font_sm,
						fontWeight: 'normal',
						color: '#959595'
					}
				}
			}
		],
		legend: {
			showForSingleSeries: true,
			position: 'bottom',
			horizontalAlign: 'left',
			offsetX: 0,
			itemMargin: {
				horizontal: 5,
				vertical: 10
			},
			onItemClick: {
				toggleDataSeries: true
			},
			onItemHover: {
				highlightDataSeries: true
			},
			markers: {
				radius: 12
			}
		}
	}
}

export function dashboardAvailabilityGraphSeries(
	inStockData,
	outStocktData,
	availabilityPercentage,
	isAvailabilityHorizontal
) {
	if (isAvailabilityHorizontal) {
		return [
			{
				name: 'In Stock',
				type: 'column',
				data: inStockData
			},
			{
				name: 'Out of Stock',
				type: 'column',
				data: outStocktData
			}
		]
	} else {
		return [
			{
				name: 'In Stock',
				type: 'column',
				data: inStockData
			},
			{
				name: 'Out of Stock',
				type: 'column',
				data: outStocktData
			},
			{
				name: 'SKU Availability %',
				type: 'line',
				data: availabilityPercentage
			}
		]
	}
}
