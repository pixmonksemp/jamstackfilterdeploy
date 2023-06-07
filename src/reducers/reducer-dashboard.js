import {
    GET_SEARCH_DASHBOARD,
    GET_SEARCH_DASHBOARD_SUCCESS,
    GET_SEARCH_DASHBOARD_FAILURE,

    GET_SHAREOFSEARCH_DASHBOARD,
    GET_SHAREOFSEARCH_DASHBOARD_SUCCESS,
    GET_SHAREOFSEARCH_DASHBOARD_FAILURE,

    GET_STOCK_AVAILABILITY_DASHBOARD,
    GET_STOCK_AVAILABILITY_DASHBOARD_SUCCESS,
    GET_STOCK_AVAILABILITY_DASHBOARD_FAILURE,

    GET_ACTIVIATION_DASHBOARD,
    GET_ACTIVIATION_DASHBOARD_SUCCESS,
    GET_ACTIVIATION_DASHBOARD_FAILURE,

    GET_SENTIMENT_DASHBOARD,
    GET_SENTIMENT_DASHBOARD_SUCCESS,
    GET_SENTIMENT_DASHBOARD_FAILURE,

    GET_SALES_PLANNING_DASHBOARD,
    GET_SALES_PLANNING_DASHBOARD_SUCCESS,
    GET_SALES_PLANNING_DASHBOARD_FAILURE,

    GET_RETAILER_AVAILABILITY,
    GET_RETAILER_AVAILABILITY_SUCCESS,
    GET_RETAILER_AVAILABILITY_FAILURE,

    CLEAR_REDUCER_DASHBOARD,

    GET_AVAILABILITY_PERCENTAGE_DASHBOARD,
    GET_AVAILABILITY_PERCENTAGE_DASHBOARD_SUCCESS,
    GET_AVAILABILITY_PERCENTAGE_DASHBOARD_FAILURE,

    GET_PRICINGCOMPLIANCE_DASHBOARD,
    GET_PRICINGCOMPLIANCE_DASHBOARD_SUCCESS,
    GET_PRICINGCOMPLIANCE_DASHBOARD_FAILURE,

    GET_SHAREOFSEARCH_PERCENTAGE_DASHBOARD,
    GET_SHAREOFSEARCH_PERCENTAGE_DASHBOARD_SUCCESS,
    GET_SHAREOFSEARCH_PERCENTAGE_DASHBOARD_FAILURE,

    GET_CONTENT_PERCENTAGE_DASHBOARD,
    GET_CONTENT_PERCENTAGE_DASHBOARD_SUCCESS,
    GET_CONTENT_PERCENTAGE_DASHBOARD_FAILURE,

    GET_RATING_PERCENTAGE_DASHBOARD,
    GET_RATING_PERCENTAGE_DASHBOARD_SUCCESS,
    GET_RATING_PERCENTAGE_DASHBOARD_FAILURE,

    GET_PRICING_PERCENTAGE_DASHBOARD,
    GET_PRICING_PERCENTAGE_DASHBOARD_SUCCESS,
    GET_PRICING_PERCENTAGE_DASHBOARD_FAILURE,

    GET_SHAREOFSEARCH_RETAILER_DASHBOARD,
    GET_SHAREOFSEARCH_RETAILER_DASHBOARD_SUCCESS,
    GET_SHAREOFSEARCH_RETAILER_DASHBOARD_FAILURE,

    GET_AVAILABILITY_RETAILER_DASHBOARD,
    GET_AVAILABILITY_RETAILER_DASHBOARD_SUCCESS,
    GET_AVAILABILITY_RETAILER_DASHBOARD_FAILURE
} from '../actions/action-dashboard'


const INITIAL_STATE = {
    ShareBySearchDashboard: { shareOfSearch: [], error: null, loading: false },
    getShareBySearchDashboard: { shareOfSearchDashboard: [], error: null, loading: false },
    getStockAvailabilityDashboard: { stockAvailabilityDashboard: [], error: null, loading: false },
    getActivationDashboard: { activationDashboard: [], error: null, loading: false },
    getSentimentDashboard: { sentimentDashboard: [], error: null, loading: false },
    getsalesplanningdashboard: { salesplanningdashboard: [], error: null, loading: false },
    retailerAvailability: { availability: [], error: null, loading: false },
    selectedFilters: {
        brandParams: [],
        categoryParams: [],
        retailerParams: [],
        keywordParams: [],
        pincodeParams: [],
        dashboardRetailerOption: [],
        dashboardCategoryOpion: [],
        dashboardBrandOption: [],
        dashboardKeywordOption: [],
        powerSku: false,
        retailerName: '',
        categoryName: '',
        brandName: '',
        clickStatus: false,
        apply: false,
    },
    selectedFiltersforRetainingValues: {
        isNavigation: false,
        retainingFromDate: '',
        retainingToDate: '',
        powerSku: false,
        pincodeStatus: false,
        retailerName: [],
        categoryName: [],
        childCategoryName: [],
        brandName: [],
        keywordCategoryName: [],
        keywordTypeName: [],
        keywordTagName: [],
        keywordName: [],
        positionNumber: [],
        dateValue: '',
        sellerName: [],
        skuName: [],
        cityName: [],
        pincodeNumber: [],
        clickStatus: false,
        applyStatus: false,
        resetClicked: false,
        applyClickedNavigation: false,
        citySetName: [],
        pincodeSetName: [],
        storeSetName: [],
        retailerCategoryName: [],
        superCategoryName: [],
        childSuperCategoryName: [],
        subCategoryName: [],
        childSubCategoryName: [],
        subFamilyName: [],
        subBrandName: []
    },

    selectedGraphFiltersforRetainingValues: {
        retainingGraphBrandParams: [],
        retainingGraphCategoryParams: [],
        retainingGraphRetailerParams: [],
        retainingGraphSkuParams: [],
        retainingGraphViewByParams: [],
        retainingGraphRetailerOption: [],
        retainingGraphCategoryOpion: [],
        retainingGraphBrandOption: [],
        retainingGraphSkuOption: [],
        retailerGraphName: '',
        categoryGraphName: '',
        brandGraphName: '',
        skuGraphName: '',
        viewByGraph: '',
        viewMonthChangeValue: '',
        clickGraphStatus: true,
        applyGraphStatus: false,
        retainingSellerParams: [],
        retainingSellerOption: [],
        sellerName: '',
        powerSku: false,
        clickStatus: true,
        applyStatus: false
    },
    defaultRenderFilter: [],
    selectedDataGraph: {
        brand: [],
        category: [],
        retailer: [],
        mustsellsku: false,
        apply: false,
        position: 10,
    },
    selectedDataForExcel: {
        brand: [],
        category: [],
        retailer: [],
        mustsellsku: true,
        apply: false,
        position: 10,
    },
    selectedData: {
        brand: [],
        category: [],
        retailer: [],
        mustsellsku: false,
        apply: false,
        position: 10,
    },
    allRetailerScrapStructure: {
        organizationname: '',
        retailer: [],
        scrapjobnameList: []
    },
    getAvailabilityPercentage: { avabilityPercentageDashboard: [], error: null, loading: false },
    getPricingCompliance: { pricingComplianceDashboard: [], error: null, loading: false },
    getShareofsearchPercentage: { shareofsearchPercentageDashboard: [], error: null, loading: false },
    getContentPercentage: { contentPercentageDashboard: [], error: null, loading: false },
    getRatingPercentage: { ratingPercentageDashboard: [], error: null, loading: false },
    getPricingPercentage: { pricingPercentageDashboard: [], error: null, loading: false },
    getShareofsearchRetailer: { shareofsearchRetailerDashboard: [], error: null, loading: false },
    getAvailabilityRetailer: { availabilityRetailerDashboard: [], error: null, loading: false },
    getKpiScrapDate: { allModulesLastScrapDate: {} }
}

export default function (state = INITIAL_STATE, action) {
    let error

    switch (action.type) {
        case CLEAR_REDUCER_DASHBOARD:
            return {
                ...state, ShareBySearchDashboard: { shareOfSearch: [], error: null, loading: false },
                getShareBySearchDashboard: { shareOfSearchDashboard: [], error: null, loading: false },
                getStockAvailabilityDashboard: { stockAvailabilityDashboard: [], error: null, loading: false },
                getActivationDashboard: { activationDashboard: [], error: null, loading: false },
                getSentimentDashboard: { sentimentDashboard: [], error: null, loading: false },
                getsalesplanningdashboard: { salesplanningdashboard: [], error: null, loading: false },
                retailerAvailability: { availability: [], error: null, loading: false },
                getAvailabilityPercentage: { avabilityPercentageDashboard: [], error: null, loading: false },
                getPricingCompliance: { pricingComplianceDashboard: [], error: null, loading: false },
                getShareofsearchPercentage: { shareofsearchPercentageDashboard: [], error: null, loading: false },
                getContentPercentage: { contentPercentageDashboard: [], error: null, loading: false },
                getRatingPercentage: { ratingPercentageDashboard: [], error: null, loading: false },
                getPricingPercentage: { pricingPercentageDashboard: [], error: null, loading: false },
                getShareofsearchRetailer: { shareofsearchRetailerDashboard: [], error: null, loading: false },
                getAvailabilityRetailer: { availabilityRetailerDashboard: [], error: null, loading: false }
            }


        case GET_SEARCH_DASHBOARD:
            return { ...state, getShareBySearchDashboard: { shareOfSearchDashboard: [], error: null, loading: false } }
        case GET_SEARCH_DASHBOARD_SUCCESS:
            return { ...state, getShareBySearchDashboard: { shareOfSearchDashboard: action.payload, error: null, loading: true } }
        case GET_SEARCH_DASHBOARD_FAILURE:
            error = action.payload || { message: action.payload.message }//2nd one is network or server down errors
            return { ...state, shareOfSearchDashboard: [], error: error, loading: true }

        case GET_SHAREOFSEARCH_DASHBOARD:
            return { ...state, ShareBySearchDashboard: { shareOfSearch: [], error: null, loading: false } }
        case GET_SHAREOFSEARCH_DASHBOARD_SUCCESS:
            return { ...state, ShareBySearchDashboard: { shareOfSearch: action.payload, error: null, loading: true } }
        case GET_SHAREOFSEARCH_DASHBOARD_FAILURE:
            error = action.payload || { message: action.payload.message }//2nd one is network or server down errors
            return { ...state, shareOfSearch: [], error: error, loading: true }


        case GET_STOCK_AVAILABILITY_DASHBOARD:
            return { ...state, getStockAvailabilityDashboard: { stockAvailabilityDashboard: [], error: null, loading: false } }
        case GET_STOCK_AVAILABILITY_DASHBOARD_SUCCESS:
            return { ...state, getStockAvailabilityDashboard: { stockAvailabilityDashboard: action.payload, error: null, loading: true } }
        case GET_STOCK_AVAILABILITY_DASHBOARD_FAILURE:
            error = action.payload || { message: action.payload.message }//2nd one is network or server down errors
            return { ...state, stockAvailabilityDashboard: [], error: error, loading: true }

        case GET_ACTIVIATION_DASHBOARD:
            return { ...state, getActivationDashboard: { activationDashboard: [], error: null, loading: false } }
        case GET_ACTIVIATION_DASHBOARD_SUCCESS:
            return { ...state, getActivationDashboard: { activationDashboard: action.payload, error: null, loading: true } }
        case GET_ACTIVIATION_DASHBOARD_FAILURE:
            error = action.payload || { message: action.payload.message }//2nd one is network or server down errors
            return { ...state, activationDashboard: [], error: error, loading: true }

        case GET_SENTIMENT_DASHBOARD:
            return { ...state, getSentimentDashboard: { sentimentDashboard: [], error: null, loading: false } }
        case GET_SENTIMENT_DASHBOARD_SUCCESS:
            return { ...state, getSentimentDashboard: { sentimentDashboard: action.payload, error: null, loading: true } }
        case GET_SENTIMENT_DASHBOARD_FAILURE:
            error = action.payload || { message: action.payload.message }//2nd one is network or server down errors
            return { ...state, sentimentDashboard: [], error: error, loading: true }

        case GET_SALES_PLANNING_DASHBOARD:
            return { ...state, getsalesplanningdashboard: { salesplanningdashboard: [], error: null, loading: false } }
        case GET_SALES_PLANNING_DASHBOARD_SUCCESS:
            return { ...state, getsalesplanningdashboard: { salesplanningdashboard: action.payload, error: null, loading: true } }
        case GET_SALES_PLANNING_DASHBOARD_FAILURE:
            error = action.payload || { message: action.payload.message }//2nd one is network or server down errors
            return { ...state, salesplanningdashboard: [], error: error, loading: true }

        case GET_RETAILER_AVAILABILITY:
            return { ...state, retailerAvailability: { availability: [], error: null, loading: false } }
        case GET_RETAILER_AVAILABILITY_SUCCESS:
            return { ...state, retailerAvailability: { availability: action.payload, error: null, loading: true } }
        case GET_RETAILER_AVAILABILITY_FAILURE:
            error = action.payload || { message: action.payload.message }//2nd one is network or server down errors
            return { ...state, availability: [], error: error, loading: true }

        case GET_AVAILABILITY_PERCENTAGE_DASHBOARD:
            return { ...state, getAvailabilityPercentage: { avabilityPercentageDashboard: [], error: null, loading: false } }
        case GET_AVAILABILITY_PERCENTAGE_DASHBOARD_SUCCESS:
            return { ...state, getAvailabilityPercentage: { avabilityPercentageDashboard: action.payload, error: null, loading: true } }
        case GET_AVAILABILITY_PERCENTAGE_DASHBOARD_FAILURE:
            error = action.payload || { message: action.payload.message }//2nd one is network or server down errors
            return { ...state, avabilityPercentageDashboard: [], error: error, loading: true }

        case GET_PRICINGCOMPLIANCE_DASHBOARD:
            return { ...state, getPricingCompliance: { pricingComplianceDashboard: [], error: null, loading: false } }
        case GET_PRICINGCOMPLIANCE_DASHBOARD_SUCCESS:
            return { ...state, getPricingCompliance: { pricingComplianceDashboard: action.payload, error: null, loading: true } }
        case GET_PRICINGCOMPLIANCE_DASHBOARD_FAILURE:
            error = action.payload || { message: action.payload.message }//2nd one is network or server down errors
            return { ...state, pricingComplianceDashboard: [], error: error, loading: true }


        case GET_SHAREOFSEARCH_PERCENTAGE_DASHBOARD:
            return { ...state, getShareofsearchPercentage: { shareofsearchPercentageDashboard: [], error: null, loading: false } }
        case GET_SHAREOFSEARCH_PERCENTAGE_DASHBOARD_SUCCESS:
            return { ...state, getShareofsearchPercentage: { shareofsearchPercentageDashboard: action.payload, error: null, loading: true } }
        case GET_SHAREOFSEARCH_PERCENTAGE_DASHBOARD_FAILURE:
            error = action.payload || { message: action.payload.message }//2nd one is network or server down errors
            return { ...state, shareofsearchPercentageDashboard: [], error: error, loading: true }

        case GET_CONTENT_PERCENTAGE_DASHBOARD:
            return { ...state, getContentPercentage: { contentPercentageDashboard: [], error: null, loading: false } }
        case GET_CONTENT_PERCENTAGE_DASHBOARD_SUCCESS:
            return { ...state, getContentPercentage: { contentPercentageDashboard: action.payload, error: null, loading: true } }
        case GET_CONTENT_PERCENTAGE_DASHBOARD_FAILURE:
            error = action.payload || { message: action.payload.message }//2nd one is network or server down errors
            return { ...state, contentPercentageDashboard: [], error: error, loading: true }

        case GET_RATING_PERCENTAGE_DASHBOARD:
            return { ...state, getRatingPercentage: { ratingPercentageDashboard: [], error: null, loading: false } }
        case GET_RATING_PERCENTAGE_DASHBOARD_SUCCESS:
            return { ...state, getRatingPercentage: { ratingPercentageDashboard: action.payload, error: null, loading: true } }
        case GET_RATING_PERCENTAGE_DASHBOARD_FAILURE:
            error = action.payload || { message: action.payload.message }//2nd one is network or server down errors
            return { ...state, ratingPercentageDashboard: [], error: error, loading: true }

        case GET_PRICING_PERCENTAGE_DASHBOARD:
            return { ...state, getPricingPercentage: { pricingPercentageDashboard: [], error: null, loading: false } }
        case GET_PRICING_PERCENTAGE_DASHBOARD_SUCCESS:
            return { ...state, getPricingPercentage: { pricingPercentageDashboard: action.payload, error: null, loading: true } }
        case GET_PRICING_PERCENTAGE_DASHBOARD_FAILURE:
            error = action.payload || { message: action.payload.message }//2nd one is network or server down errors
            return { ...state, pricingPercentageDashboard: [], error: error, loading: true }

        case GET_SHAREOFSEARCH_RETAILER_DASHBOARD:
            return { ...state, getShareofsearchRetailer: { shareofsearchRetailerDashboard: [], error: null, loading: false } }
        case GET_SHAREOFSEARCH_RETAILER_DASHBOARD_SUCCESS:
            return { ...state, getShareofsearchRetailer: { shareofsearchRetailerDashboard: action.payload, error: null, loading: true } }
        case GET_SHAREOFSEARCH_RETAILER_DASHBOARD_FAILURE:
            error = action.payload || { message: action.payload.message }//2nd one is network or server down errors
            return { ...state, shareofsearchRetailerDashboard: [], error: error, loading: true }

        case GET_AVAILABILITY_RETAILER_DASHBOARD:
            return { ...state, getAvailabilityRetailer: { availabilityRetailerDashboard: [], error: null, loading: false } }
        case GET_AVAILABILITY_RETAILER_DASHBOARD_SUCCESS:
            return { ...state, getAvailabilityRetailer: { availabilityRetailerDashboard: action.payload, error: null, loading: true } }
        case GET_AVAILABILITY_RETAILER_DASHBOARD_FAILURE:
            error = action.payload || { message: action.payload.message }//2nd one is network or server down errors
            return { ...state, availabilityRetailerDashboard: [], error: error, loading: true }

        default:
            return state
    }
}