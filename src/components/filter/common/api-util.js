/** @format */

import axios from 'axios'
import { COMMON_URL, resources } from '../common/common-api-constants'
import {
	status,
	statusMessage
} from '../common/common-language-jsons/error-message-en.json'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import extend from 'extend'

let errorMessage = []
let tokenError = 1
let tokenErrorCheck = 0
const serverError = 1

export default class ApiUtil {
	static executeSession(options) {
		let userDetails = JSON.parse(sessionStorage.getItem('loginUserDetails'))

		let overallOptions = extend(true, {}, options)
		let overallOptionsData = extend(true, {}, overallOptions.data)
		overallOptionsData.userName = userDetails.username
		overallOptionsData.userType = userDetails.usertype
		overallOptions.data = overallOptionsData

		axios.defaults.headers.common[
			'Authorization'
		] = `${userDetails.token_value.Authorization}`
		axios.defaults.headers.common[
			'X-Organization-Id'
		] = `${userDetails.organizationid}`
		axios.defaults.headers.post['Content-Type'] =
			'application/x-www-form-urlencoded'
		axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
		axios.defaults.timeout = 50000
		axios.interceptors.response.use(
			response => {
				return response
			},
			error => {
				axios.defaults.headers.common[
					'Authorization'
				] = `${userDetails.token_value.Authorization}`
				axios.defaults.headers.common[
					'X-Organization-Id'
				] = `${userDetails.organizationid}`
				axios.defaults.headers.post['Content-Type'] =
					'application/x-www-form-urlencoded'
				axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
				axios.defaults.timeout = 50000
				axios.interceptors.response.use(
					response => {
						return response
					},
					error => {
						return error.response
					}
				)
			}
		)
		return axios(overallOptions).then(res => {
			return res
		})
	}

	static getApiPath(urlExt, params) {
		let apiPath = COMMON_URL
		let apiUrl = `${apiPath}${urlExt}`
		apiUrl = params ? `${apiUrl}/${params}` : apiUrl
		return apiUrl
	}

	static get(url, data, params) {
		let apiUrl = ApiUtil.getApiPath(url, params)
		const options = {
			method: resources.httpMethod.GET,
			params: data,
			url: apiUrl
		}

		return ApiUtil.executeSession(options)
	}

	static post(url, data, params) {
		const apiUrl = ApiUtil.getApiPath(url, params)
		const options = {
			data: data,
			method: resources.httpMethod.POST,
			url: apiUrl
		}

		return ApiUtil.executeSession(options)
	}

	static put(url, data, params) {
		const apiUrl = ApiUtil.getApiPath(url, params)
		const options = {
			data: data,
			method: resources.httpMethod.PUT,
			url: apiUrl
		}
		return ApiUtil.executeSession(options)
	}

	static delete(url, data, params) {
		const apiUrl = ApiUtil.getApiPath(url, params)
		const options = {
			data: data,
			method: resources.httpMethod.DELETE,
			url: apiUrl
		}
		return ApiUtil.executeSession(options)
	}
}
