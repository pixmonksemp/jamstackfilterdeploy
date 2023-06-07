/** @format */

import axios from 'axios'
import { COMMON_URL } from '../common/common-api-constants'
import store from '../../store/index'
import { ToastContainer, toast } from 'react-toastify'

export const SCRAP_DATE = 'SCRAP_DATE'
export const SCRAP_DATE_SUCCESS = ' SCRAP_DATE_SUCCESS'
export const SCRAP_DATE_FAILURE = 'SCRAP_DATE_FAILURE'

export const DASHBOARD_SCRAP_DATE = 'DASHBOARD_SCRAP_DATE'
export const DASHBOARD_SCRAP_DATE_SUCCESS = ' DASHBOARD_SCRAP_DATE_SUCCESS'
export const DASHBOARD_SCRAP_DATE_FAILURE = 'DASHBOARD_SCRAP_DATE_FAILURE'

export const RETAILERWISE_SCRAP_DATE = 'RETAILERWISE_SCRAP_DATE'
export const RETAILERWISE_SCRAP_SUCCESS = ' RETAILERWISE_SCRAP_SUCCESS'
export const RETAILERWISE_SCRAP_FAILURE = 'RETAILERWISE_SCRAP_FAILURE'

export const CLEAR_REDUCER_DATA = 'CLEAR_REDUCER_DATA'

export function clearReducerData() {
	return {
		type: CLEAR_REDUCER_DATA,
		payload: []
	}
}

export function scrapDate(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'getscrapdateandtime'
	})

	return {
		type: SCRAP_DATE,
		payload: request
	}
}

export function scrapDateSuccess(data) {
	return {
		type: SCRAP_DATE_SUCCESS,
		payload: data
	}
}

export function scrapDateFailure(error) {
	return {
		type: SCRAP_DATE_FAILURE,
		payload: error
	}
}

export function scrapDateForDashboard(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'v1/getscrapdateforalljob'
	})

	return {
		type: DASHBOARD_SCRAP_DATE,
		payload: request
	}
}

export function scrapDateForDashboardSuccess(data) {
	return {
		type: DASHBOARD_SCRAP_DATE_SUCCESS,
		payload: data
	}
}

export function scrapDateForDashboardFailure(error) {
	return {
		type: DASHBOARD_SCRAP_DATE_FAILURE,
		payload: error
	}
}

export function scrapDateRetailerwise(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'v1/getScrapdateRetailerwise'
	})

	return {
		type: RETAILERWISE_SCRAP_DATE,
		payload: request
	}
}

export function scrapDateRetailerwiseSuccess(data) {
	return {
		type: RETAILERWISE_SCRAP_SUCCESS,
		payload: data
	}
}

export function scrapDateRetailerwiseFailure(error) {
	return {
		type: RETAILERWISE_SCRAP_FAILURE,
		payload: error
	}
}
