/** @format */

import axios from 'axios'
import { COMMON_URL } from '../common/common-api-constants'
import store from '../../store/index'
import { ToastContainer, toast } from 'react-toastify'

export const GET_RETAILER_DATA = 'GET_RETAILER_DATA'
export const GET_RETAILER_DATA_SUCCESS = 'GET_RETAILER_DATA_SUCCESS'
export const GET_RETAILER_DATA_FAILURE = 'GET_RETAILER_DATA_FAILURE'

export const GET_CATEGORY_DATA = 'GET_CATEGORY_DATA'
export const GET_CATEGORY_DATA_SUCCESS = 'GET_CATEGORY_DATA_SUCCESS'
export const GET_CATEGORY_DATA_FAILURE = 'GET_CATEGORY_DATA_FAILURE'

export const GET_BRAND_DATA = 'GET_BRAND_DATA'
export const GET_BRAND_DATA_SUCCESS = 'GET_BRAND_DATA_SUCCESS'
export const GET_BRAND_DATA_FAILURE = 'GET_BRAND_DATA_FAILURE'

export const GET_KEYWORD_DATA = 'GET_KEYWORD_DATA'
export const GET_KEYWORD_DATA_SUCCESS = 'GET_KEYWORD_DATA_SUCCESS'
export const GET_KEYWORD_DATA_FAILURE = 'GET_KEYWORD_DATA_FAILURE'

export const GET_SKULIST_DATA = 'GET_SKULIST_DATA'
export const GET_SKULIST_DATA_SUCCESS = 'GET_SKULIST_DATA_SUCCESS'
export const GET_SKULIST_DATA_FAILURE = 'GET_SKULIST_DATA_FAILURE'

export const CLEAR_REDUCER_DATA = 'CLEAR_REDUCER_DATA'
export const CLEAR_BRAND_REDUCER_DATA = 'CLEAR_BRAND_REDUCER_DATA'
export const CLEAR_SKU_REDUCER_DATA = 'CLEAR_SKU_REDUCER_DATA'

export function clearReducerData() {
	return {
		type: CLEAR_REDUCER_DATA,
		payload: []
	}
}
export function clearBrandReducerData() {
	return {
		type: CLEAR_BRAND_REDUCER_DATA,
		payload: []
	}
}
export function clearSkuReducerData() {
	return {
		type: CLEAR_SKU_REDUCER_DATA,
		payload: []
	}
}

export function getRetailerData(data) {
	const request = axios({
		method: 'get',
		url: COMMON_URL + `retailerByOrganization/${data}`
	})

	return {
		type: GET_RETAILER_DATA,
		payload: request
	}
}

export function getRetailerDataSuccess(data) {
	return {
		type: GET_RETAILER_DATA_SUCCESS,
		payload: data
	}
}

export function getRetailerDataFailure(error) {
	// toast.error(error.payload.message , {
	//     position: toast.POSITION.TOP_CENTER,
	//     autoClose: true
	//   });
	return {
		type: GET_RETAILER_DATA_FAILURE,
		payload: error
	}
}

export function getCategoryData(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + `category`
	})

	return {
		type: GET_CATEGORY_DATA,
		payload: request
	}
}

export function getCategoryDataSuccess(data) {
	return {
		type: GET_CATEGORY_DATA_SUCCESS,
		payload: data
	}
}

export function getCategoryDataFailure(error) {
	// toast.error(error.payload.message , {
	//     position: toast.POSITION.TOP_CENTER,
	//     autoClose: true
	//   });
	return {
		type: GET_CATEGORY_DATA_FAILURE,
		payload: error
	}
}

export function getBrandData(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'brand'
	})

	return {
		type: GET_BRAND_DATA,
		payload: request
	}
}

export function getBrandDataSuccess(data) {
	return {
		type: GET_BRAND_DATA_SUCCESS,
		payload: data
	}
}

export function getBrandDataFailure(error) {
	// toast.error(error.payload.message , {
	//     position: toast.POSITION.TOP_CENTER,
	//     autoClose: true
	//   });
	return {
		type: GET_BRAND_DATA_FAILURE,
		payload: error
	}
}

export function getKeywordData(data) {
	const request = axios({
		method: 'post',
		data: data,
		url: COMMON_URL + 'keyword'
	})

	return {
		type: GET_KEYWORD_DATA,
		payload: request
	}
}

export function getKeywordDataSuccess(data) {
	return {
		type: GET_KEYWORD_DATA_SUCCESS,
		payload: data
	}
}

export function getKeywordDataFailure(error) {
	// toast.error(error.payload.message , {
	//     position: toast.POSITION.TOP_CENTER,
	//     autoClose: true
	//   });
	return {
		type: GET_KEYWORD_DATA_FAILURE,
		payload: error
	}
}

export function getSkuData(data) {
	const request = axios({
		method: 'get',
		url: COMMON_URL + `skulist/${data}`
	})

	return {
		type: GET_SKULIST_DATA,
		payload: request
	}
}

export function getSkuDataSuccess(data) {
	return {
		type: GET_SKULIST_DATA_SUCCESS,
		payload: data
	}
}

export function getSkuDataFailure(error) {
	// toast.error(error.payload.message , {
	//     position: toast.POSITION.TOP_CENTER,
	//     autoClose: true
	//   });
	return {
		type: GET_SKULIST_DATA_FAILURE,
		payload: error
	}
}
