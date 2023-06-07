import React, { Component } from 'react'
import ApiConnector from '../../common/hoc/api-connector'
import { resources } from '../../common/common-api-constants'
import ExportFilterComponent from '../../components/filter-component/export-filter-component'
import { setContentAnalysisData } from '../../actions/action-data'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class FilterContainer extends Component {
	static propTypes = {
		getRetailerMaster: PropTypes.func.isRequired,
		getRetailerMasterResult: PropTypes.object,
		getSuperCategoryMaster: PropTypes.func.isRequired,
		getSuperCategoryMasterResult: PropTypes.object,
		getCategoryMaster: PropTypes.func.isRequired,
		getCategoryMasterResult: PropTypes.object,
		getBrandMaster: PropTypes.func.isRequired,
		getBrandMasterResult: PropTypes.object,
		getKeywordsMaster: PropTypes.func.isRequired,
		getKeywordsMasterResult: PropTypes.object,
	}

	render() {
		return <ExportFilterComponent {...this.props} />
	}
}

export default ApiConnector(FilterContainer, {
	methods: {
		getRetailerMaster: {
			type: resources.httpMethod.POST,
			url: 'v1/getMasterRetailer',
		},
		getSuperCategoryMaster: {
			type: resources.httpMethod.POST,
			url: 'v1/getMasterSuperCategoryList',
		},
		getCategoryMaster: {
			type: resources.httpMethod.POST,
			url: 'v1/getMasterCategoryList',
		},
		getBrandMaster: {
			type: resources.httpMethod.POST,
			url: 'v1/getMasterBrandList',
		},
		getKeywordsMaster: {
			type: resources.httpMethod.POST,
			url: 'v1/getMasterKeywordsList',
		},
	},
})
