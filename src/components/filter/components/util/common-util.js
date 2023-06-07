import { DATE_FORMAT, DISPLAY_DATE_FORMAT } from '../../common/common-constants'
import moment from 'moment'
import { sortArrayOfObjectValues } from '../filter-component/filterdata-constant'
import { graphLegendMarkerColorsPalette } from './graph-axis-util'
import React, { Component } from 'react'
import ReloadComponent from "../../components/reload-component/reload-component"

export const getScrapDate = (
	scrapDateRetailerwiseResult,
	callInitialRequest
) => {
	let scrapDateList = [],
		scrapDateForFilter = [],
		scrapdatedata,
		scrapDisplayDate
	if (
		scrapDateRetailerwiseResult &&
		scrapDateRetailerwiseResult.content &&
		scrapDateRetailerwiseResult.content.data &&
		scrapDateRetailerwiseResult.content.data.scrapDate &&
		!callInitialRequest
	) {
		scrapDateForFilter = scrapDateRetailerwiseResult.content.data.scrapDate
		if (scrapDateRetailerwiseResult.content.data.scrapDate.length) {
			const isAllScarpeDateNull = scrapDateForFilter.every(
				(item) => item.scrapdate == null
			)

			if (isAllScarpeDateNull) {
				scrapDateList.push(new Date())
			} else {
				scrapDateRetailerwiseResult.content.data.scrapDate.map(
					(item) => {
						let changeDateFormat
						changeDateFormat = new Date(item.scrapdate)
						changeDateFormat = moment(changeDateFormat).format(
							DATE_FORMAT
						)
						scrapDateList.push(new Date(changeDateFormat))
					}
				)
				const maxDate = (dates) => new Date(Math.max(...dates))
				scrapdatedata = new Date(maxDate(scrapDateList))
				scrapdatedata = moment(scrapdatedata).format(DATE_FORMAT)
				scrapDisplayDate = moment(scrapdatedata).format(
					DISPLAY_DATE_FORMAT
				)
			}
		}
	} else {
		scrapdatedata = new Date()
		scrapdatedata = moment(scrapdatedata).format(DATE_FORMAT)
		scrapDisplayDate = moment(scrapdatedata).format(DISPLAY_DATE_FORMAT)
	}

	return [scrapDateForFilter, scrapdatedata, scrapDisplayDate]
}

export const initialRetailerTypes = (
	getFilterDataValue,
	selectedRetailerList,
	typesOfRetailersNeeded
) => {
	let retailerTypesSort = [],
		retailerTypes = []
	getFilterDataValue &&
		getFilterDataValue.retailer &&
		getFilterDataValue.retailer.length &&
		getFilterDataValue.retailer.map((item) => {
			if (selectedRetailerList && selectedRetailerList.length) {
				selectedRetailerList.map((selectedRetailer) => {
					if (selectedRetailer.id === item.id) {
						if (
							typesOfRetailersNeeded === 'National' &&
							item.retailertype == 'marketplace'
						) {
							retailerTypesSort.push('1National Retailers')
						} else if (
							(typesOfRetailersNeeded === 'National' ||
								typesOfRetailersNeeded === 'Location') &&
							item.retailertype == 'onlineretailer'
						) {
							retailerTypesSort.push('2Location based Retailers')
						} else if (
							(typesOfRetailersNeeded === 'National' ||
								typesOfRetailersNeeded === 'Location' ||
								typesOfRetailersNeeded === 'Store') &&
							item.retailertype == 'hyperlocal'
						) {
							retailerTypesSort.push('3Store based Retailers')
						}
					}
				})
			}
		})
	retailerTypesSort.sort()
	retailerTypesSort = [...new Set(retailerTypesSort)]
	retailerTypesSort &&
		retailerTypesSort.length &&
		retailerTypesSort.map((item) => {
			let values = item.slice(1)
			retailerTypes.push(values)
		})
	retailerTypes = [...new Set(retailerTypes)]

	return retailerTypes
}

export const initialRetailerTypesByRetailer = (
	getFilterDataValue,
	selectedRetailerNames
) => {
	let retailerTypesSort = [],
		retailerTypes = []
	getFilterDataValue &&
		getFilterDataValue.retailer &&
		getFilterDataValue.retailer.length &&
		getFilterDataValue.retailer.map((item) => {
			if (selectedRetailerNames && selectedRetailerNames.length) {
				if (selectedRetailerNames.includes(item.name)) {
					let tabNames = ''
					if (item.retailertype == 'marketplace')
						tabNames = '1National Retailers'
					else if (item.retailertype == 'onlineretailer')
						tabNames = '2Location based Retailers'
					else if (item.retailertype == 'hyperlocal')
						tabNames = '3Store based Retailers'
					retailerTypesSort.push(tabNames)
				}
			}
		})
	retailerTypesSort.sort()
	retailerTypesSort = [...new Set(retailerTypesSort)]
	retailerTypesSort &&
		retailerTypesSort.length &&
		retailerTypesSort.map((item) => {
			let values = item.slice(1)
			retailerTypes.push(values)
		})
	retailerTypes = [...new Set(retailerTypes)]

	return retailerTypes
}

export const AppliedRetailerTypes = (
	getFilterDataValue,
	commonReducerName,
	typesOfRetailersNeeded
) => {
	let retailerTypesSort = [],
		retailerTypes = []
	getFilterDataValue &&
		getFilterDataValue.retailer &&
		getFilterDataValue.retailer.length &&
		getFilterDataValue.retailer.map((item) => {
			commonReducerName &&
				commonReducerName.retailer &&
				commonReducerName.retailer.length &&
				commonReducerName.retailer.map((value) => {
					if (value.name == item.name) {
						if (item.retailertype == 'marketplace') {
							retailerTypesSort.push('1National Retailers')
						} else if (item.retailertype == 'onlineretailer') {
							retailerTypesSort.push('2Location based Retailers')
						} else if (item.retailertype == 'hyperlocal') {
							retailerTypesSort.push('3Store based Retailers')
						}
					}
				})
		})
	retailerTypesSort.sort()
	retailerTypesSort = [...new Set(retailerTypesSort)]
	retailerTypesSort &&
		retailerTypesSort.length &&
		retailerTypesSort.map((item) => {
			let values = item.slice(1)
			retailerTypes.push(values)
		})
	retailerTypes = [...new Set(retailerTypes)]

	return retailerTypes
}

export const reloadForApiResult = (getApiResult) => {
	if (
		getApiResult &&
		getApiResult.content &&
		getApiResult.content.status &&
		getApiResult.content.status === 200
	) {
		return true
	} else if (getApiResult != undefined) {
		return false
	}
}

export const dynamicColorsForGridAndGraph = {
	//same three colors repeated...
	ourBrandsGraphColors: [
		'#42B4E6',
		'#E47F00',
		'#87d300',
		'#42B4E6',
		'#E47F00',
		'#87d300',
		'#42B4E6',
		'#E47F00',
		'#87d300',
		'#42B4E6',
		'#E47F00',
		'#87d300',
	],
	competitorBrandsGraphColors: [
		'#42B4E6',
		'#9edae5',
		'#c49c94',
		'#dbdb8d',
		'#9edae5',
		'#c49c94',
		'#dbdb8d',
		'#9edae5',
		'#c49c94',
		'#dbdb8d',
		'#9edae5',
		'#c49c94',
		'#dbdb8d',
	],
	competitorBrandsGridRowColors: [
		'#9edae5',
		'#c49c94',
		'#dbdb8d',
		'#9edae5',
		'#c49c94',
		'#dbdb8d',
		'#9edae5',
		'#c49c94',
		'#dbdb8d',
		'#9edae5',
		'#c49c94',
		'#dbdb8d',
	],
}

/**
 * Purpose: Convert color in Hex(#) format to RGBA for opacity in color code
 * @param {color} hex 
 * @param {opacity} a 
 * @returns RGBA
 */
export const convertHexToRgbA = (hex, opacity) => {
	if (hex && hex.substring) {
		let r = parseInt(hex.substring(1, 3), 16),
			g = parseInt(hex.substring(3, 5), 16),
			b = parseInt(hex.substring(5, 7), 16)
		return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')'
	}
}
export const maxValueForStackBar = series => {
	const extractData = arr => arr.map(item => item.data)
	const data = extractData(series)
	let max = 0
	if (data.length) {
		for (let i = 0; i < data[0].length; i++) {
			let sum = 0
			for (const value of data) {

				sum = sum + value[i]
			}
			if (max < sum) {
				max = sum
			}
		}
	}
	return max < 5 && max != 0 ? 5 : max
}

export const maxValueForGraphYAxis = (graphSeries, isPercentage = false) => {
	let maxValue = 0,
		firstTime = true
	graphSeries.map((item) => {
		let currentValue = Math.max(...item.data)
		if (firstTime) {
			maxValue = currentValue
			firstTime = false
		} else if (!firstTime && maxValue < currentValue) {
			maxValue = currentValue
		}
	})

	if (isPercentage) {
		if (maxValue < 80) {
			maxValue = maxValue + 4
		} else if (maxValue > 100) {
			maxValue = 100
		} else {
			maxValue
		}
	} else {
		maxValue = maxValue + 4
	}

	return maxValue
}

export const getCityListOptions = (result, singleSelect) => {
	let overallOptions = {
		cityOptions: [],
		pincodeOptions: [],
		storeOptions: [],
		defaultCity: [],
		defaultPincode: [],
		defaultStore: [],
		cityList: [],
		pincodeList: [],
		storeList: [],
		cityName: [],
		storeName: [],
		pincodeName: [],
	}

	if (
		result &&
		result.content &&
		result.content.data &&
		result.content.data.city
	) {
		overallOptions.cityOptions = result.content.data.city
		if (overallOptions.cityOptions && overallOptions.cityOptions.length) {
			overallOptions.cityOptions.sort(sortArrayOfObjectValues('label'))
		}

		if (overallOptions.cityOptions && overallOptions.cityOptions.length) {
			overallOptions.defaultCity = [overallOptions.cityOptions[0]]
		}

		overallOptions.cityList = result.content.data.city

		overallOptions.cityName = result.content.data.city

		if (singleSelect) {
			if (overallOptions.cityName && overallOptions.cityName.length) {
				overallOptions.cityName.sort(sortArrayOfObjectValues('id'))
			}
		}
	}

	if (
		result &&
		result.content &&
		result.content.data &&
		result.content.data.pincode
	) {
		overallOptions.pincodeOptions = result.content.data.pincode.length
			? result.content.data.pincode.map((item) => {
				let values = {
					id: item.id,
					label: `${item.name} - ${item.label}`,
					name: item.name,
					value: `${item.name} - ${item.label}`,
				}
				return values
			})
			: []
		if (
			overallOptions.pincodeOptions &&
			overallOptions.pincodeOptions.length
		) {
			overallOptions.pincodeOptions.sort(sortArrayOfObjectValues('label'))
		}

		if (
			overallOptions.pincodeOptions &&
			overallOptions.pincodeOptions.length
		) {
			overallOptions.defaultPincode = [overallOptions.pincodeOptions[0]]
		}

		overallOptions.pincodeList = result.content.data.pincode

		overallOptions.pincodeName = result.content.data.pincode

		if (singleSelect) {
			if (
				overallOptions.pincodeName &&
				overallOptions.pincodeName.length
			) {
				overallOptions.pincodeName.sort(sortArrayOfObjectValues('id'))
				overallOptions.pincodeList = overallOptions.pincodeName.map(
					(item) => {
						let values = {
							id: item.id,
							label: `${item.name} - ${item.label}`,
							name: item.name,
							value: `${item.name} - ${item.label}`,
						}
						return values
					}
				)
			}
		}
	}

	if (
		result &&
		result.content &&
		result.content.data &&
		result.content.data.store
	) {
		overallOptions.storeOptions = result.content.data.store
		if (overallOptions.storeOptions && overallOptions.storeOptions.length) {
			overallOptions.storeOptions.sort(sortArrayOfObjectValues('label'))
		}

		if (overallOptions.storeOptions && overallOptions.storeOptions.length) {
			overallOptions.defaultStore = [overallOptions.storeOptions[0]]
		}

		overallOptions.storeList = result.content.data.store

		overallOptions.storeName = result.content.data.store

		if (singleSelect) {
			if (overallOptions.storeName && overallOptions.storeName.length) {
				overallOptions.storeName.sort(sortArrayOfObjectValues('id'))
			}
		}
	}

	return overallOptions
}

export const nullCheckForRequestList = (requestList) => {
	let requestListArray = []
	if (requestList && requestList.length) {
		requestListArray = requestList
	}
	return requestListArray
}

export const getOrgSpecificColorCode = (getFilterDataValue, modulesName) => {
	let colorCodeArray = [], isModuleColorCodePresent = false
	if (getFilterDataValue && getFilterDataValue != undefined && getFilterDataValue.organization && getFilterDataValue.organization.colorcodeset) {
		getFilterDataValue.organization.colorcodeset.map((i) => {
			if (modulesName && modulesName == i.modulename) {
				isModuleColorCodePresent = true
				i.thresholdset && i.thresholdset.length &&
					i.thresholdset.map((colorObj) => {
						colorCodeArray = colorObj.colorcode.split(',')
					})
			}
		})
		if (!isModuleColorCodePresent) {
			colorCodeArray = graphLegendMarkerColorsPalette
		}
	}
	return colorCodeArray
}

export const getVarianceSpecificColorCode = (getFilterDataValue, modulesName, trendStatus) => {
	let colorCodeArray = []
	if (getFilterDataValue && getFilterDataValue.organization && getFilterDataValue.organization.colorcodeset) {
		getFilterDataValue.organization.colorcodeset.map((i) => {
			if (modulesName && modulesName == i.modulename) {
				i.thresholdset && i.thresholdset.length &&
					i.thresholdset.map((colorObj) => {
						if (trendStatus && trendStatus == colorObj.variance) {
							colorCodeArray = colorObj.colorcode.split(',')
						}
					})
			}
		})
	}
	return colorCodeArray
}

export const getPreviousScrapeDate = (scrapDatesList, selecteddate) => {
	scrapDatesList.sort()
	let scrapDatesIndex = scrapDatesList.indexOf(selecteddate)
	if (scrapDatesIndex > 0) {
		return scrapDatesList[scrapDatesIndex - 1]
	}
}
// Purpose : This method used to call 'ReloadComponent', when API call not done properlly
// (Example : when 500 - internel server error occures )
export const reload = (value, type, isReload, style, handleReloadClick) => {
	return (
		<ReloadComponent
			requestValue={value}
			componentType={type}
			isReloadLoading={isReload}
			cardReload={(data, type) => handleReloadClick(data, type)}
			reloadStyle={style}
		/>
	)
}
