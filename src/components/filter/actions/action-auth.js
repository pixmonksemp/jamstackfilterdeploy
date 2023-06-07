/** @format */

import axios from 'axios'
import { COMMON_URL } from '../common/common-api-constants'
import store from '../../store/index'

export const POST_LOGIN_DETAILS = 'POST_LOGIN_DETAILS'
export const POST_LOGIN_DETAILS_SUCCESS = 'POST_LOGIN_DETAILS_SUCCESS'
export const POST_LOGIN_DETAILS_FAILURE = 'POST_LOGIN_DETAILS_FAILURE'

export const POST_CHANGE_PASSWORD = 'POST_CHANGE_PASSWORD'
export const POST_CHANGE_PASSWORD_SUCCESS = 'POST_CHANGE_PASSWORD_SUCCESS'
export const POST_CHANGE_PASSWORD_FAILURE = 'POST_CHANGE_PASSWORD_FAILURE'

export const POST_LOGOUT_DETAILS = 'POST_LOGOUT_DETAILS'
export const POST_LOGOUT_DETAILS_SUCCESS = 'POST_LOGOUT_DETAILS_SUCCESS'
export const POST_LOGOUT_DETAILS_FAILURE = 'POST_LOGOUT_DETAILS_FAILURE'

export const POST_FORGOT_PASSWORD = 'POST_FORGOT_PASSWORD'
export const POST_FORGOT_PASSWORD_SUCCESS = 'POST_FORGOT_PASSWORD_SUCCESS'
export const POST_FORGOT_PASSWORD_FAILURE = 'POST_FORGOT_PASSWORD_FAILURE'

export const GET_ORGANIZATION_DETAILS = 'GET_ORGANIZATION_DETAILS'
export const GET_ORGANIZATION_DETAILS_SUCCESS =
	'GET_ORGANIZATION_DETAILS_SUCCESS'
export const GET_ORGANIZATION_DETAILS_FAILURE =
	'GET_ORGANIZATION_DETAILS_FAILURE'

export const POST_RESET_PASSWORD = 'POST_RESET_PASSWORD'
export const POST_RESET_PASSWORD_SUCCESS = 'POST_RESET_PASSWORD_SUCCESS'
export const POST_RESET_PASSWORD_FAILURE = 'POST_RESET_PASSWORD_FAILURE'

export const GET_FEATURES_DETAILS = 'GET_FEATURES_DETAILS'
export const GET_FEATURES_SUCCESS = 'GET_FEATURES_SUCCESS'
export const GET_FEATURES_FAILURE = 'GET_FEATURES_FAILURE'

export const GET_PROFILE_DETAILS = 'GET_PROFILE_DETAILS'
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS'
export const GET_PROFILE_FAILURE = 'GET_PROFILE_FAILURE'

export const POST_UPDATE_USER_DETAILS = 'POST_UPDATE_USER_DETAILS'
export const POST_UPDATE_USER_SUCCESS = 'POST_UPDATE_USER_SUCCESS'
export const POST_UPDATE_USER_FAILURE = 'POST_UPDATE_USER_FAILURE'

export const POST_CREATE_PROFILE_DETAILS = 'POST_CREATE_PROFILE_DETAILS'
export const POST_CREATE_PROFILE_SUCCESS = 'POST_CREATE_PROFILE_SUCCESS'
export const POST_CREATE_PROFILE_FAILURE = 'POST_CREATE_PROFILE_FAILURE'

let errorMessage = []
let serverError = 1

//LOGIN
export function postLoginDetails(postLoginData) {
	const request = axios({
		method: 'post',
		data: postLoginData,
		url: COMMON_URL + 'user/login'
	})

	return {
		type: POST_LOGIN_DETAILS,
		payload: request
	}
}

export function postLoginDetailsSuccess(data) {
	data.userName = store.getState().userContext.userData.data.loginid
	data.loginstatus = 'Login_Success'
	data.token_value = {
		Authorization: `${data.token_type} ${data.access_token}`
	}
	sessionStorage.setItem('loginUserDetails', JSON.stringify(data))
	return {
		type: POST_LOGIN_DETAILS_SUCCESS,
		payload: data
	}
}

export function postLoginDetailsFailure(error) {
	// if (!error.payload.response) {
	//   error.loginstatus = 'We`ve encountered a problem with the connection, Please try again later.'
	// }
	if (error.payload.message.includes('Network Error')) {
		error.loginstatus = 'Network Error !'
	} else {
		error.loginstatus = 'Login_Fail'
	}
	return {
		type: POST_LOGIN_DETAILS_FAILURE,
		payload: error
	}
}

//LOGOUT
export function postLogoutDetails(param) {
	const request = axios({
		method: 'post',
		url: COMMON_URL + 'user/logout',
		headers: { Authorization: `${param.token_type} ${param.access_token}` }
	})

	return {
		type: POST_LOGOUT_DETAILS,
		payload: request
	}
}

export function postLogoutDetailsSuccess(data) {
	sessionStorage.clear('loginUserDetails')
	axios.defaults.headers.common['Authorization'] = null

	return {
		type: POST_LOGOUT_DETAILS_SUCCESS,
		payload: data
	}
}

export function postLogoutDetailsFailure(error) {
	return {
		type: POST_LOGOUT_DETAILS_FAILURE,
		payload: error
	}
}

//CHANGE PASSWORD
export function postChangePassword(params) {
	const request = axios({
		method: 'post',
		data: params,
		url: COMMON_URL + 'user/password/change'
	})

	return {
		type: POST_CHANGE_PASSWORD,
		payload: request
	}
}

export function postChangePasswordSuccess(data) {
	return {
		type: POST_CHANGE_PASSWORD_SUCCESS,
		payload: data
	}
}

export function postChangePasswordFailure(error) {
	return {
		type: POST_CHANGE_PASSWORD_FAILURE,
		payload: error
	}
}

//FORGOT PASSWORD
export function postForgotPassword(params) {
	const request = axios({
		method: 'post',
		data: params,
		url: COMMON_URL + 'user/password/forgot'
	})

	return {
		type: POST_FORGOT_PASSWORD,
		payload: request
	}
}

export function postForgotPasswordSuccess(data) {
	return {
		type: POST_FORGOT_PASSWORD_SUCCESS,
		payload: data
	}
}

export function postForgotPasswordFailure(error) {
	return {
		type: POST_FORGOT_PASSWORD_FAILURE,
		payload: error.payload.response.data
	}
}

//PREFERED RETAILERS
export function getPreferredRetailer(param) {
	const request = axios({
		headers: {
			Authorization: `${param.userCredentials.token_type} ${param.userCredentials.access_token}`
		},
		method: 'get',
		url:
			COMMON_URL +
			`getOrganizationDetailsByOrganizationId/${param.userCredentials.organizationid}`
	})

	return {
		type: GET_ORGANIZATION_DETAILS,
		payload: request
	}
}

export function getPreferredRetailerSuccess(data) {
	const userData = store.getState().userContext.getUsersObj.userCredentials
	userData.preferredRetailer = data.preferredretailer
	userData.module = data.module
	userData.frequency = data.frequency
	userData.defaultOption = data.defaultoption
	userData.version = data.version
	userData.colorCodeSet = data.colorcodeset
	userData.pimercecdn = data.pimercecdn
	sessionStorage.setItem('loginUserDetails', JSON.stringify(userData))

	return {
		type: GET_ORGANIZATION_DETAILS_SUCCESS,
		payload: data
	}
}

export function getPreferredRetailerFailure(error) {
	return {
		type: GET_ORGANIZATION_DETAILS_FAILURE,
		payload: error
	}
}

//FEATURES DETAILS
export function getFeatures(param) {
	const request = axios({
		headers: { Authorization: `${param.userCredentials.token_type} ${param.userCredentials.access_token}` },
		method: 'get',
		url: COMMON_URL + 'features'
	})
	return {
		type: GET_FEATURES_DETAILS,
		payload: request
	}
}
export function getFeaturesSuccess(data) {
	sessionStorage.setItem('authorization', JSON.stringify(data))
	return {
		type: GET_FEATURES_SUCCESS,
		payload: data
	}
}
export function getFeaturesFailure(error) {
	return {
		type: GET_FEATURES_FAILURE,
		payload: error
	}
}

//RESET PASSWORD
export function postResetPassword(params) {
	const request = axios({
		method: 'post',
		data: params,
		url: COMMON_URL + 'user/password/reset'
	})

	return {
		type: POST_RESET_PASSWORD,
		payload: request
	}
}

export function postResetPasswordSuccess(data) {
	return {
		type: POST_RESET_PASSWORD_SUCCESS,
		payload: data
	}
}

export function postResetPasswordFailure(error) {
	return {
		type: POST_RESET_PASSWORD_FAILURE,
		payload: error.payload.response.data
	}
}

//PROFILE DETAILS
export function getProfile(param) {
	const request = axios({
		headers: { Authorization: `${param.token_type} ${param.access_token}` },
		method: 'get',
		url: COMMON_URL + 'user/profile'
	})
	return {
		type: GET_PROFILE_DETAILS,
		payload: request
	}
}
export function getProfileSuccess(data) {
	return {
		type: GET_PROFILE_SUCCESS,
		payload: data
	}
}
export function getProfileFailure(error) {
	return {
		type: GET_PROFILE_FAILURE,
		payload: error
	}
}

//UPDATE USER DETAILS
export function postUpdateUserDetail(params) {
	const request = axios({
		method: 'post',
		data: params,
		url: COMMON_URL + 'user/disable'
	})

	return {
		type: POST_UPDATE_USER_DETAILS,
		payload: request
	}
}

export function postUpdateUserDetailSuccess(data) {
	return {
		type: POST_UPDATE_USER_SUCCESS,
		payload: data
	}
}

export function postUpdateUserDetailFailure(error) {
	return {
		type: POST_UPDATE_USER_FAILURE,
		payload: error.payload.response.data
	}
}

//CREATE PROFILE DETAILS
export function postCreateProfileDetail(params) {
	const request = axios({
		method: 'post',
		data: params,
		url: COMMON_URL + 'user/create/profile'
	})

	return {
		type: POST_CREATE_PROFILE_DETAILS,
		payload: request
	}
}

export function postCreateProfileDetailSuccess(data) {
	return {
		type: POST_CREATE_PROFILE_SUCCESS,
		payload: data
	}
}

export function postCreateProfileDetailFailure(error) {
	return {
		type: POST_CREATE_PROFILE_FAILURE,
		payload: error.payload.response.data
	}
}