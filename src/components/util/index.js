/** @format */

export const monthNameData = [
	{ label: 'January', value: 'January' },
	{ label: 'February', value: 'February' },
	{ label: 'March', value: 'March' },
	{ label: 'April', value: 'April' },
	{ label: 'May', value: 'May' },
	{ label: 'June', value: 'June' },
	{ label: 'July', value: 'July' },
	{ label: 'August', value: 'August' },
	{ label: 'September', value: 'September' },
	{ label: 'October', value: 'October' },
	{ label: 'November', value: 'November' },
	{ label: 'December', value: 'December' }
]

export default class UtilService {
	static safeLog(message) {
		/* eslint-disable no-console */
		/* eslint-enable no-console */
	}

	static chunkString(sourceString, chunkSize, fromRight) {
		const source = 'string' === typeof sourceString ? sourceString : ''

		const count = Math.ceil(source.length / chunkSize)
		const chunks = []
		let offset = 0
		let size = chunkSize
		if (fromRight) {
			size = source.length % chunkSize
			if (!size) {
				size = chunkSize
			}
		}

		for (let i = 0; i < count; ++i) {
			chunks.push(source.substr(offset, size))
			offset += size
			if (fromRight && !i) {
				size = chunkSize
			}
		}

		return chunks
	}

	static getRouteParts(route) {
		return route.split('/').filter(p => p)
	}

	static regexEscape(string) {
		return typeof string === 'string'
			? string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
			: ''
	}

	static getUniqueValuesFromArray(arr) {
		return arr.filter((value, index, self) => {
			return value && self.indexOf(value) === index
		})
	}

	static getFileExtension(fileName) {
		const matches = fileName.match(/\.[^\.]+$/)
		return matches && matches.length ? matches[0].substr(1) : null
	}

	static getCurrentDate() {
		const now = new Date()
		now.setHours(0, 0, 0, 0)
		return now
	}

	static ucaseFirstLetter(str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}

    // Util to convert date string to common format
	static formatDate(date) {
		var year = date.getFullYear().toString()
		var month = (date.getMonth() + 101).toString().substring(1)
		var day = (date.getDate() + 100).toString().substring(1)
		return year + '-' + month + '-' + day
	}
}
