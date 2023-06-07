/** @format */

import axios from 'axios'
import extend from 'extend'
import { COMMON_URL } from '../common/common-api-constants'

export const DOWNLOAD_EXCEL = 'DOWNLOAD_EXCEL'
export const DOWNLOAD_EXCEL_SUCCESS = 'DOWNLOAD_EXCEL_SUCCESS'
export const DOWNLOAD_EXCEL_FAILURE = 'DOWNLOAD_EXCEL_FAILURE'

export function downloadExcel(data) {
	let prepareExportRequests = extend(true, {}, data)
	prepareExportRequests.status = 'CREATED'
	const request = axios({
		method: 'post',
		data: prepareExportRequests,
		url: COMMON_URL + 'v1/insertReport'
	})
		.then(response => {
			return response
		})
		.catch(err => {
			return err
		})

	return {
		type: DOWNLOAD_EXCEL,
		payload: request
	}
}
