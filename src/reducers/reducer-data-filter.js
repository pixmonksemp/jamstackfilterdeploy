import { POST_CONTENT_ANALYSIS_DATA } from '../actions/action-data'
import { POST_FILTER_DATA, POST_SELLER_FILTER_DATA } from '../actions/action-data'
const INITIAL_STATE = {
  getContentAnalysisData: { getContentData: null },
  getFilterDataValue: { getFilterdata: null },
  getSellerDataValue: { getSellerData: null },
  getSkuValue: { getskuId: null },
  getSelectedFilterSummary: { getSelectedFilterSummarytoTrend: null },
  getInitialDataValue: { getInitialValue: null },
  getExcelExportDataValue: { getExcelValue: null },
  getSocScreenRequest: { getApiRequest: null, levelType: '', filterRetainRequest: null, screenName: '' },
  getRetilerSos: { getApiRequest: null, levelType: '', filterRetainRequest: null, screenName: '' },
  getBrandSos: { getApiRequest: null, levelType: '', filterRetainRequest: null, screenName: '' },
  getSearchCompetitorAnalysis: { getApiRequest: null, levelType: '', filterRetainRequest: null, screenName: '' },
  getGlobalFilterSelectedValue: { getRegionSelectedFilterdata: null , getMarketSelectedFilterdata: null ,
  getMarketSelectedOrgID:null},
  getorganizationDetails: { globalOrgid: null}
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case POST_CONTENT_ANALYSIS_DATA:
      return { ...state, getContentData: action.payload }
    case POST_FILTER_DATA:
      return { ...state, getFilterdata: action.payload }
    case POST_SELLER_FILTER_DATA:
      return { ...state, getSellerData: action.payload }
    default:
      return state
  }
}
