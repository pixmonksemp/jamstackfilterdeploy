export const POST_CONTENT_ANALYSIS_DATA = 'POST_CONTENT_ANALYSIS_DATA'
export const POST_FILTER_DATA = 'POST_FILTER_DATA'
export const POST_SELLER_FILTER_DATA = 'POST_SELLER_FILTER_DATA'
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS'
export const LOGIN_DETAILS_SUCCESS = 'LOGIN_DETAILS_SUCCESS'

export const loginDetails=(data)=> {
	return {
		type: LOGIN_DETAILS_SUCCESS,
		payload: data
	}
}

export const getProfileDetails=(data)=> {
    return {
        type: GET_PROFILE_SUCCESS,
        payload: data
    }
}