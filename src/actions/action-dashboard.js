/** @format */

import axios from 'axios'
import { COMMON_URL } from '../common/common-api-constants'
import { ToastContainer, toast } from 'react-toastify'
import store from '../../store/index'

export const GET_SEARCH_DASHBOARD = 'GET_SEARCH_DASHBOARD'
export const GET_SEARCH_DASHBOARD_SUCCESS = ' GET_SEARCH_DASHBOARD_SUCCESS'
export const GET_SEARCH_DASHBOARD_FAILURE = 'GET_SEARCH_DASHBOARD_FAILURE'

export const GET_SHAREOFSEARCH_DASHBOARD = 'GET_SHAREOFSEARCH_DASHBOARD'
export const GET_SHAREOFSEARCH_DASHBOARD_SUCCESS =
	' GET_SHAREOFSEARCH_DASHBOARD_SUCCESS'
export const GET_SHAREOFSEARCH_DASHBOARD_FAILURE =
	'GET_SHAREOFSEARCH_DASHBOARD_FAILURE'

export const GET_STOCK_AVAILABILITY_DASHBOARD =
	'GET_STOCK_AVAILABILITY_DASHBOARD'
export const GET_STOCK_AVAILABILITY_DASHBOARD_SUCCESS =
	' GET_STOCK_AVAILABILITY_DASHBOARD_SUCCESS'
export const GET_STOCK_AVAILABILITY_DASHBOARD_FAILURE =
	'GET_STOCK_AVAILABILITY_DASHBOARD_FAILURE'

export const GET_ACTIVIATION_DASHBOARD = 'GET_ACTIVIATION_DASHBOARD'
export const GET_ACTIVIATION_DASHBOARD_SUCCESS =
	' GET_ACTIVIATION_DASHBOARD_SUCCESS'
export const GET_ACTIVIATION_DASHBOARD_FAILURE =
	'GET_ACTIVIATION_DASHBOARD_FAILURE'

export const GET_SENTIMENT_DASHBOARD = 'GET_SENTIMENT_DASHBOARD'
export const GET_SENTIMENT_DASHBOARD_SUCCESS =
	' GET_SENTIMENT_DASHBOARD_SUCCESS'
export const GET_SENTIMENT_DASHBOARD_FAILURE = 'GET_SENTIMENT_DASHBOARD_FAILURE'

export const GET_SALES_PLANNING_DASHBOARD = 'GET_SALES_PLANNING_DASHBOARD'
export const GET_SALES_PLANNING_DASHBOARD_SUCCESS =
	'GET_SALES_PLANNING_DASHBOARD_SUCCESS'
export const GET_SALES_PLANNING_DASHBOARD_FAILURE =
	'GET_SALES_PLANNING_DASHBOARD_FAILURE'

export const GET_RETAILER_AVAILABILITY = 'GET_RETAILER_AVAILABILITY'
export const GET_RETAILER_AVAILABILITY_SUCCESS =
	'GET_RETAILER_AVAILABILITY_SUCCESS'
export const GET_RETAILER_AVAILABILITY_FAILURE =
	'GET_RETAILER_AVAILABILITY_FAILURE'

export const CLEAR_REDUCER_DASHBOARD = 'CLEAR_REDUCER_DASHBOARD'

export const GET_AVAILABILITY_PERCENTAGE_DASHBOARD =
	'GET_AVAILABILITY_PERCENTAGE_DASHBOARD'
export const GET_AVAILABILITY_PERCENTAGE_DASHBOARD_SUCCESS =
	'GET_AVAILABILITY_PERCENTAGE_DASHBOARD_SUCCESS'
export const GET_AVAILABILITY_PERCENTAGE_DASHBOARD_FAILURE =
	'GET_AVAILABILITY_PERCENTAGE_DASHBOARD_FAILURE'

export const GET_SHAREOFSEARCH_PERCENTAGE_DASHBOARD =
	'GET_SHAREOFSEARCH_PERCENTAGE_DASHBOARD'
export const GET_SHAREOFSEARCH_PERCENTAGE_DASHBOARD_SUCCESS =
	'GET_SHAREOFSEARCH_PERCENTAGE_DASHBOARD_SUCCESS'
export const GET_SHAREOFSEARCH_PERCENTAGE_DASHBOARD_FAILURE =
	'GET_SHAREOFSEARCH_PERCENTAGE_DASHBOARD_FAILURE'

export const GET_CONTENT_PERCENTAGE_DASHBOARD =
	'GET_CONTENT_PERCENTAGE_DASHBOARD'
export const GET_CONTENT_PERCENTAGE_DASHBOARD_SUCCESS =
	'GET_CONTENT_PERCENTAGE_DASHBOARD_SUCCESS'
export const GET_CONTENT_PERCENTAGE_DASHBOARD_FAILURE =
	'GET_CONTENT_PERCENTAGE_DASHBOARD_FAILURE'

export const GET_RATING_PERCENTAGE_DASHBOARD = 'GET_RATING_PERCENTAGE_DASHBOARD'
export const GET_RATING_PERCENTAGE_DASHBOARD_SUCCESS =
	'GET_RATING_PERCENTAGE_DASHBOARD_SUCCESS'
export const GET_RATING_PERCENTAGE_DASHBOARD_FAILURE =
	'GET_RATING_PERCENTAGE_DASHBOARD_FAILURE'

export const GET_PRICING_PERCENTAGE_DASHBOARD =
	'GET_PRICING_PERCENTAGE_DASHBOARD'
export const GET_PRICING_PERCENTAGE_DASHBOARD_SUCCESS =
	'GET_PRICING_PERCENTAGE_DASHBOARD_SUCCESS'
export const GET_PRICING_PERCENTAGE_DASHBOARD_FAILURE =
	'GET_PRICING_PERCENTAGE_DASHBOARD_FAILURE'

export const GET_PRICINGCOMPLIANCE_DASHBOARD = 'GET_PRICINGCOMPLIANCE_DASHBOARD'
export const GET_PRICINGCOMPLIANCE_DASHBOARD_SUCCESS =
	'GET_PRICINGCOMPLIANCE_DASHBOARD_SUCCESS'
export const GET_PRICINGCOMPLIANCE_DASHBOARD_FAILURE =
	'GET_PRICINGCOMPLIANCE_DASHBOARD_FAILURE'

export const GET_SHAREOFSEARCH_RETAILER_DASHBOARD =
	'GET_SHAREOFSEARCH_RETAILER_DASHBOARD'
export const GET_SHAREOFSEARCH_RETAILER_DASHBOARD_SUCCESS =
	'GET_SHAREOFSEARCH_RETAILER_DASHBOARD_SUCCESS'
export const GET_SHAREOFSEARCH_RETAILER_DASHBOARD_FAILURE =
	'GET_SHAREOFSEARCH_RETAILER_DASHBOARD_FAILURE'

export const GET_AVAILABILITY_RETAILER_DASHBOARD =
	'GET_AVAILABILITY_RETAILER_DASHBOARD'
export const GET_AVAILABILITY_RETAILER_DASHBOARD_SUCCESS =
	'GET_AVAILABILITY_RETAILER_DASHBOARD_SUCCESS'
export const GET_AVAILABILITY_RETAILER_DASHBOARD_FAILURE =
	'GET_AVAILABILITY_RETAILER_DASHBOARD_FAILURE'

export function clearReducerForDashboard() {
	return {
		type: CLEAR_REDUCER_DASHBOARD,
		payload: []
	}
}

export function getSearchDashboard(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'shareofsearchdashboard'
	})

	return {
		type: GET_SEARCH_DASHBOARD,
		payload: request
	}
}

export function getSearchDashboardSuccess(data) {
	return {
		type: GET_SEARCH_DASHBOARD_SUCCESS,
		payload: data
	}
}

export function getSearchDashboardFailure(error) {
	// toast.error(error.payload.message , {
	//   position: toast.POSITION.TOP_CENTER,
	//   autoClose: true
	// });
	return {
		type: GET_SEARCH_DASHBOARD_FAILURE,
		payload: error
	}
}
//////////////////////////////////////////////////////////////////
export function getShareOfSearchDashboard(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'shareofsearchweekwise'
	})

	return {
		type: GET_SHAREOFSEARCH_DASHBOARD,
		payload: request
	}
}

export function getShareOfSearchDashboardSuccess(data) {
	return {
		type: GET_SHAREOFSEARCH_DASHBOARD_SUCCESS,
		payload: data
	}
}

export function getShareOfSearchDashboardFailure(error) {
	// toast.error(error.payload.message , {
	//   position: toast.POSITION.TOP_CENTER,
	//   autoClose: true
	// });
	return {
		type: GET_SHAREOFSEARCH_DASHBOARD_FAILURE,
		payload: error
	}
}

//////////////////////////////////////////////////////////////
export function getStockAvailabilityDashboard(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'stockavailabilitydashboard'
	})

	return {
		type: GET_STOCK_AVAILABILITY_DASHBOARD,
		payload: request
	}
}

export function getStockAvailabilityDashboardSuccess(data) {
	return {
		type: GET_STOCK_AVAILABILITY_DASHBOARD_SUCCESS,
		payload: data
	}
}

export function getStockAvailabilityDashboardFailure(error) {
	return {
		type: GET_STOCK_AVAILABILITY_DASHBOARD_FAILURE,
		payload: error
	}
}
/////////////////////////////////////////////////////////////////
export function getActivationDashboard(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'getactivationsdashboard'
	})

	return {
		type: GET_ACTIVIATION_DASHBOARD,
		payload: request
	}
}

export function getActivationDashboardSuccess(data) {
	return {
		type: GET_ACTIVIATION_DASHBOARD_SUCCESS,
		payload: data
	}
}

export function getActivationDashboardFailure(error) {
	return {
		type: GET_ACTIVIATION_DASHBOARD_FAILURE,
		payload: error
	}
}

/////////////////////////////////////////////////////////////////
export function getSentimentDashboard(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'sentimentsdashboard'
	})

	return {
		type: GET_SENTIMENT_DASHBOARD,
		payload: request
	}
}

export function getSentimentDashboardSuccess(data) {
	return {
		type: GET_SENTIMENT_DASHBOARD_SUCCESS,
		payload: data
	}
}

export function getSentimentDashboardFailure(error) {
	return {
		type: GET_SENTIMENT_DASHBOARD_FAILURE,
		payload: error
	}
}

/////////////////////////////////////////////////////////////////
export function getSalesplanningdashboard(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'getsalesplanningdashboard'
	})

	return {
		type: GET_SALES_PLANNING_DASHBOARD,
		payload: request
	}
}

export function getSalesplanningdashboardSuccess(data) {
	return {
		type: GET_SALES_PLANNING_DASHBOARD_SUCCESS,
		payload: data
	}
}

export function getSalesplanningdashboardFailure(error) {
	return {
		type: GET_SALES_PLANNING_DASHBOARD_FAILURE,
		payload: error
	}
}

export function getRetailerAvailability(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'stockavailabilityaggregations'
	})

	return {
		type: GET_RETAILER_AVAILABILITY,
		payload: request
	}
}

export function getRetailerAvailabilitySuccess(data) {
	return {
		type: GET_RETAILER_AVAILABILITY_SUCCESS,
		payload: data
	}
}

export function getRetailerAvailabilityFailure(error) {
	return {
		type: GET_RETAILER_AVAILABILITY_FAILURE,
		payload: error
	}
}

export function getAvailabilityPercentage(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'getAvailabilityPercentage'
	})

	return {
		type: GET_AVAILABILITY_PERCENTAGE_DASHBOARD,
		payload: request
	}
}

export function getAvailabilityPercentageSuccess(data) {
	return {
		type: GET_AVAILABILITY_PERCENTAGE_DASHBOARD_SUCCESS,
		payload: data
	}
}

export function getAvailabilityPercentageFailure(error) {
	return {
		type: GET_AVAILABILITY_PERCENTAGE_DASHBOARD_FAILURE,
		payload: error
	}
}
export function getPricingCompliance(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'getPricingComplainceByRetailer'
	})

	return {
		type: GET_PRICINGCOMPLIANCE_DASHBOARD,
		payload: request
	}
}

export function getPricingComplianceSuccess(data) {
	return {
		type: GET_PRICINGCOMPLIANCE_DASHBOARD_SUCCESS,
		payload: data
	}
}

export function getPricingComplianceFailure(error) {
	return {
		type: GET_PRICINGCOMPLIANCE_DASHBOARD_FAILURE,
		payload: error
	}
}

//sos percentage

export function getShareofsearchPercentage(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'getShareOfSearchPercentage'
	})

	return {
		type: GET_SHAREOFSEARCH_PERCENTAGE_DASHBOARD,
		payload: request
	}
}

export function getShareofsearchPercentageSuccess(data) {
	return {
		type: GET_SHAREOFSEARCH_PERCENTAGE_DASHBOARD_SUCCESS,
		payload: data
	}
}

export function getShareofsearchPercentageFailure(error) {
	return {
		type: GET_SHAREOFSEARCH_PERCENTAGE_DASHBOARD_FAILURE,
		payload: error
	}
}

//content

export function getContentPercentage(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'getContentQualityPercentage'
	})

	return {
		type: GET_CONTENT_PERCENTAGE_DASHBOARD,
		payload: request
	}
}

export function getContentPercentageSuccess(data) {
	return {
		type: GET_CONTENT_PERCENTAGE_DASHBOARD_SUCCESS,
		payload: data
	}
}

export function getContentPercentageFailure(error) {
	return {
		type: GET_CONTENT_PERCENTAGE_DASHBOARD_FAILURE,
		payload: error
	}
}

//rating

export function getRatingPercentage(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'getRatingsForDashboard'
	})

	return {
		type: GET_RATING_PERCENTAGE_DASHBOARD,
		payload: request
	}
}

export function getRatingPercentageSuccess(data) {
	return {
		type: GET_RATING_PERCENTAGE_DASHBOARD_SUCCESS,
		payload: data
	}
}

export function getRatingPercentageFailure(error) {
	return {
		type: GET_RATING_PERCENTAGE_DASHBOARD_FAILURE,
		payload: error
	}
}

//pricing percentage
export function getPricingPercentage(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'getPricingComplaincePercentage'
	})

	return {
		type: GET_PRICING_PERCENTAGE_DASHBOARD,
		payload: request
	}
}

export function getPricingPercentageSuccess(data) {
	return {
		type: GET_PRICING_PERCENTAGE_DASHBOARD_SUCCESS,
		payload: data
	}
}

export function getPricingPercentageFailure(error) {
	return {
		type: GET_PRICING_PERCENTAGE_DASHBOARD_FAILURE,
		payload: error
	}
}
//SOS retailer

export function getShareofsearchRetailer(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'getShareOfSearchByRetailer'
	})

	return {
		type: GET_SHAREOFSEARCH_RETAILER_DASHBOARD,
		payload: request
	}
}

export function getShareofsearchRetailerSuccess(data) {
	return {
		type: GET_SHAREOFSEARCH_RETAILER_DASHBOARD_SUCCESS,
		payload: data
	}
}

export function getShareofsearchRetailerFailure(error) {
	return {
		type: GET_SHAREOFSEARCH_RETAILER_DASHBOARD_FAILURE,
		payload: error
	}
}

//availability

export function getAvailabilityRetailer(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'getAvailablityByRetailer'
	})

	return {
		type: GET_AVAILABILITY_RETAILER_DASHBOARD,
		payload: request
	}
}

export function getAvailabilityRetailerSuccess(data) {
	return {
		type: GET_AVAILABILITY_RETAILER_DASHBOARD_SUCCESS,
		payload: data
	}
}

export function getAvailabilityRetailerFailure(error) {
	return {
		type: GET_AVAILABILITY_RETAILER_DASHBOARD_FAILURE,
		payload: error
	}
}
