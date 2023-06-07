export const POST_CONTENT_ANALYSIS_DATA = 'POST_CONTENT_ANALYSIS_DATA'
export const POST_FILTER_DATA = 'POST_FILTER_DATA'
export const POST_SELLER_FILTER_DATA = 'POST_SELLER_FILTER_DATA'

export const setContentAnalysisData = (data) => dispatch => {
    dispatch({
        type: POST_CONTENT_ANALYSIS_DATA,
        payload: data
    })
}

export const setFilterData = (data) => dispatch => {
    dispatch({
        type: POST_FILTER_DATA,
        payload: data
    })
}

export const setSellerData = (data) => dispatch => {
    dispatch({
        type: POST_SELLER_FILTER_DATA,
        payload: data
    })
}