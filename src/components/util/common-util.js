import { DATE_FORMAT, DISPLAY_DATE_FORMAT } from '../../common/common-constants'
import moment from 'moment'


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

//Convert color in Hex(#) format to RGBA for opacity in color code
export const convertHexToRgbA = (hex, a) => {
	let r = parseInt(hex.substring(1, 3), 16),
		g = parseInt(hex.substring(3, 5), 16),
		b = parseInt(hex.substring(5, 7), 16)
	return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')'
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
			maxValue = maxValue + 5
		} else {
			maxValue
		}
	} else {
		maxValue = maxValue + 5
	}

	return maxValue
}

export const nullCheckForRequestList = (requestList) => {
	let requestListArray = []
	if (requestList && requestList.length) {
		requestListArray = requestList
	}
	return requestListArray
}

export const getOrgSpecificColorCode = (getFilterDataValue, modulesName) => {
	let colorCodeArray = []
	if (getFilterDataValue && getFilterDataValue.organization && getFilterDataValue.organization.colorcodeset) {
		getFilterDataValue.organization.colorcodeset.map((i) => {
			if (modulesName && modulesName == i.modulename) {
				i.thresholdset && i.thresholdset.length &&
					i.thresholdset.map((colorObj) => {
						colorCodeArray = colorObj.colorcode.split(',')
					})
			}
		})
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

export const removeArrayObjectDuplicates = (data, key) => {
	if (data && data.length && data[0] !== undefined && key) {
		return data.filter(
			(obj, index, self) =>
				index === self.findIndex((el) => el[key] === obj[key])
		)
	} else {
		return data
	}
}

// Common-Methods

/**
 * Dataview key iteration value to create new object method
 * @param {*} props 
 * @returns 
 */
export const dataViewMatchColumns = (props) =>{
	let result, matchAndFilterColumns
	if(props.data.length > 0 && props.columns && props.columns.length > 0){
	  const column = props && props.data.length > 0 && Object.keys(props && props.data[0])
	  matchAndFilterColumns = 
	  props.data && props.data.map((data)=>{
	  return props.columns && props.columns.map((propCol) => {
		return column && column.map((col) => {
		  if (propCol.field == col) { 
			  return {
				[propCol.match] : data[col]
			  }
			}
		})
	  })})
	  result = matchAndFilterColumns && matchAndFilterColumns.map((i)=>{
		  return Object.assign({}, ...i && i.flat());
		})  
	 }
	 return result
}

/**
 *  Convert Image to Blob
 */
export const toDataURL = (url) =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );