/** @format */

import moment from 'moment'

const date = new Date()
const y = date.getFullYear()

export const dateStringValue = date => {
	if (!date) {
		return undefined
	}
	date = moment(date).format('YYYY MM DD')
	const dateSplit = date.split(' ')
	date = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], 12, 0, 0)
	return date
}

export const dateToLocalString = date => {
	if (!date) {
		return ''
	}
	return moment(date).format('DD MMM YYYY')
}

export const dateToString = date => {
	if (!date) {
		return ''
	}
	return moment(date).format('DD MMM')
}

export const dateRangeValue = date => {
	if (!date) {
		return ''
	}
	return moment(date).format('YYYY, M, D')
}

export const getDateOfWeek = w => {
	var d = 1 + (w - 1) * 7
	return new Date(y, 0, d)
}
