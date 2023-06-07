import React, { Component } from 'react'
import Dashboard from '../../../components/pim-module-component/dashboard/dashboard'
import PropTypes from 'prop-types'
import ApiConnector from '../../../common/hoc/api-connector'
import { resources } from '../../../common/common-api-constants'
import { connect } from 'react-redux'
import { setFilterData } from '../../../components/filter/actions/action-data'
import { PIM_API } from '../../../common/common-constants'

const mapStateToProps = (state) => {
	
	return {
		getFilterDataValue: state.stateData.getFilterdata
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setFilterData: (data) => dispatch(setFilterData(data))
	}
}
class DashboardContainer extends Component {
	static proptypes = {
		getRatingSkuLevelAnalysis: PropTypes.func.isRequired,
		getRatingSkuLevelAnalysisResult: PropTypes.object,
		getdropdownfilter:PropTypes.func
	}
	componentWillMount() {
		let userDetails = JSON.parse(sessionStorage.getItem("loginUserDetails"))
		// this.props.getOrganizationDetails(null, parseInt(userDetails.organizationid))
		
		window.scroll(0, 0)
	}

	componentWillReceiveProps(newProps){
		// const{getOrganizationDetailsResult,getFilterDataValue} = newProps
		// if(	getOrganizationDetailsResult&&
		// 	getOrganizationDetailsResult.content&&
		// 	getOrganizationDetailsResult.content.data){
		// 		let filterOptions=JSON.parse(getOrganizationDetailsResult.content.data.filterOptions)
		// 		const { setFilterData } = this.props
		// 		if(getFilterDataValue==undefined){
		// 		setFilterData(filterOptions)
		// 	}
		// 	}
	}

	render() {
		return <Dashboard {...this.props} />
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ApiConnector(DashboardContainer, {
	methods: {
		getRatingSkuLevelAnalysis: {
			type: resources.httpMethod.POST,
			url: 'v1/dashboard',
			//url:'v1/getInvSkuLevelAnalysis'
		},
		getOrganizationDetails: {
			type: resources.httpMethod.GET,
			url: PIM_API + "/organizations",
		  }
	},
}))