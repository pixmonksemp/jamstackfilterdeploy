/** @format */
import axios from 'axios'
import { COMMON_URL, resources } from '../common/common-api-constants'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import extend from 'extend'
import i18n from '../translate/i18n'
const serverError = 1

export default class ApiUtil {
	static executeSession(options) {
		let userDetails = JSON.parse(
			sessionStorage.getItem(i18n.t('commonMessage.loginUserDetails'))
		)

		let response = extend(true, {}, options)
		let userData = extend(true, {}, response.data)

		if (userDetails && userDetails.userName) {
			if(options.url != (COMMON_URL+"api/pimerce-users")&&options.method != resources.httpMethod.POST){
			userData.userName = userDetails.userName
			userData.userType = userDetails.usertype
		}
			response.data = userData

			axios.defaults.headers.common[
				'Authorization'
			] = `${userDetails.token_value.Authorization}`
			axios.defaults.headers.common['X-Organization-Id'] =
			`${userDetails.organizationid}`
		}
		axios.defaults.headers.post['Content-Type'] =
			'application/x-www-form-urlencoded'
		axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
		// axios.defaults.timeout = 30000
		axios.interceptors.response.use(
			(response) => {
				if((response.config.url!=`${COMMON_URL}api/login`)&&(response.status==401)){
				toast.error("You have been logged out. Please contact your system administrator for details.", {
					position: toast.POSITION.TOP_CENTER,
					autoClose: true,
					closeButton: true,
					progress: false,
					hideProgressBar:true,
					pauseOnHover: false,
					toastId: 1,
					preventDuplicates: true,
					preventOpenDuplicates:true,
					enableMultiContainer : false,
					theme: "colored"
				})
				setTimeout(()=>{
					window.location.reload()
				},4000)
			}
				else{
				return response
				}
			},
			(error) => {
					if (error.response) {
						return error.response
					} else if (error.request) {
						/*
						 * The request was made but no response was received, `error.request`
						 * is an instance of XMLHttpRequest in the browser and an instance
						 * of http.ClientRequest in Node.js
						 */
								toast.error(i18n.t('toastMessage.connectionFailedMessage'), {
									position: toast.POSITION.TOP_CENTER,
									autoClose: true,
									closeButton: true,
									progress: false,
									hideProgressBar:true,
									pauseOnHover: false,
									toastId: 1,
									preventDuplicates: true,
									preventOpenDuplicates:true,
									enableMultiContainer : false,
									theme: "colored"
								})
					} else {
						// Something happened in setting up the request and triggered an Error
						toast.error(
							i18n.t('toastMessage.connectionFailedMessage'),
							{
								position: toast.POSITION.TOP_CENTER,
								autoClose: false,
								closeButton: true,
								toastId: serverError
							}
						)
				}

			}
		)
		return axios(response).then((res) => {
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
