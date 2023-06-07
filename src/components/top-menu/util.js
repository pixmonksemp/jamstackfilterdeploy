export function hasChildren(item) {
	const { items: children } = item
	if (children === undefined) {
		return false
	}
	if (children.constructor !== Array) {
		return false
	}
	if (children.length === 0) {
		return false
	}
	return true
}

// This function is used for round up the values of decimal values into two decimal
export function singleDecimal(value, fixed) { //This function is used for round up the values of decimal values into two decimal 
	value = value != null && value != 'NaN' && value != undefined ? value : 'NA'
	value = value.toString()
	let getNumber,
		position,
		decimalValue,
		finalValue
	//This condition is used for slicing values thats in before and after the dot(.)
	if (value != 'NA' && value.includes('.')) {
		position = value.indexOf('.')
		getNumber = value.slice(0, position)
		decimalValue = value.slice(position)
		//If the values after the dot have more than three index(including dot) it will slice the decimal value into two
		decimalValue = decimalValue.length < 4 ? decimalValue : decimalValue.slice(0, 3)
		finalValue = getNumber.concat(decimalValue) //concating the number and sliced decimal values
	}
	//it will check whether the value is not a decimal number
	else if (value != 'NA' && !value.includes('.')) {
		finalValue = value
	}
	//it will check whether value is 'NA'
	else {
		finalValue = value
	}
	return finalValue
}

// This function is used for slice the text which overflowing across the container
export function renderTextTrim(value, num) {
	let n = value != null && value.length
	let ellipsedTextValue = ''
	if (n > num) {
		ellipsedTextValue = value.slice(0, num)
		ellipsedTextValue = ellipsedTextValue.concat('..')
	} else {
		ellipsedTextValue = value
	}
	return ellipsedTextValue
}

// This function is used for slice the zero values of graphSeries for line graph
export function chartSeries(dataa) {
	let finalSeries = []
	let zeroArr = []
	dataa.length && dataa.map(i => {
		for (let j = 0; j < i.data.length; j++) {
			if (i.data[j] != 0) {
				zeroArr.push(j == 0 ? j : j - 1)
				break
			}
		}
	})
	dataa.length && dataa.map(i => {
		if (zeroArr.length != 0) {
			let value = {
				name: i.name,
				data: i.data.slice(Math.min(...zeroArr))
			}
			finalSeries.push(value)
		}
	})
	return finalSeries
}

// This function is used for slice the Xaxis data which has zero values in line graph
export function chartXAxis(dataa, xaxiss) {
	let zeroArr = []
	dataa.length && dataa.map(i => {
		for (let j = 0; j < i.data.length; j++) {
			if (i.data[j] != 0) {
				zeroArr.push(j == 0 ? j : j - 1)
				break
			}
		}
	})
	return xaxiss.slice(Math.min(...zeroArr))
}

// Used to set initial filter request as id = id  and name = id
// For Example : id = PI-PH-UNL-RET-LZD  and name = PI-PH-UNL-RET-LZD
export const getIdFormattedObject = (data) => {
	let arrayObject = []
	if (data && data.length && data[0] !== undefined) {
		data.map(item => {
			let values = { id: item.id, name: item.id }
			arrayObject.push(values)
		})
	}
	return arrayObject
}

// Used to set initial filter request as id = id  and name = name
// For Example : id = PI-PH-UNL-RET-LZD  and name = Lazada
export const getIdNameFormattedObject = (data) => {
	let arrayObject = []
	if (data && data.length && data[0] !== undefined) {
		data.map(item => {
			let values = { id: item.id, name: item.value }
			arrayObject.push(values)
		})
	}
	return arrayObject
}

export const requestParamsDropdownOptions = (data, overallOptions) => {
	let names = [], finalArray = []
	if (data && data.length) {
		data.map((item) => {
			if (item !== undefined)
				names.push(item.value)
		})
	}
	if (overallOptions && overallOptions.length) {
		overallOptions.map((item) => {
			if (names.includes(item.value)) {
				finalArray.push(item)
			}
		})
	} else {
		finalArray = data
	}
	// When names is not present in overallOptions, directly setting data to finalArray
	if ((names && names.length >= 1) &&
		(overallOptions && overallOptions.length >= 1) &&
		(finalArray && finalArray.length == 0)
	) {
		finalArray = data
	}
	return finalArray
}