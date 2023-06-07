/** @format */

import { combineReducers } from 'redux'
import reducerUserDetails from './reducer-data'
import stateDataStore from './reducer-data-filter'
import reducerDashboard from './reducer-dashboard'


const rootReducer = combineReducers({
	dashboardValue: reducerDashboard,
	userDetail: reducerUserDetails,
	stateData: stateDataStore
})

export default rootReducer
