import React, { Component } from 'react'
import { resources } from '../../common/common-api-constants'
import FilterComponent from '../../components/filter-component/filter-component'
import PropTypes from 'prop-types'
import ApiConnector from '../../../../common/hoc/api-connector'
import { PIM_API } from '../../../../common/common-constants'

class FilterContainer extends Component {
	static propTypes = {
		getRetailerMaster: PropTypes.func.isRequired,
		getRetailerMasterResult: PropTypes.object,
		getSuperCategoryMaster: PropTypes.func.isRequired,
		getSuperCategoryMasterResult: PropTypes.object,
		getChildSuperCategoryMaster: PropTypes.func.isRequired,
		getChildSuperCategoryMasterResult: PropTypes.object,
		getCategoryMaster: PropTypes.func.isRequired,
		getCategoryMasterResult: PropTypes.object,
		getChildCategoryMaster: PropTypes.func.isRequired,
		getChildCategoryMasterResult: PropTypes.object,
		getSubCategoryMaster: PropTypes.func.isRequired,
		getSubCategoryMasterResult: PropTypes.object,
		getChildSubCategoryMaster: PropTypes.func.isRequired,
		getChildSubCategoryMasterResult: PropTypes.object,
		getBrandMaster: PropTypes.func.isRequired,
		getBrandMasterResult: PropTypes.object,
		getSubFamilyMaster: PropTypes.func.isRequired,
		getSubFamilyMasterResult: PropTypes.object,
		getSubBrandMaster: PropTypes.func.isRequired,
		getSubBrandMasterResult: PropTypes.object,
		getKeywordCategoryMaster: PropTypes.func.isRequired,
		getKeywordCategoryMasterResult: PropTypes.object,
		getKeywordsMaster: PropTypes.func.isRequired,
		getKeywordsMasterResult: PropTypes.object,
		getCityPincodeStoreMaster: PropTypes.func.isRequired,
		getCityPincodeStoreMasterResult: PropTypes.object,
		getRetailerCategoryMaster: PropTypes.func.isRequired,
		getRetailerCategoryMasterResult: PropTypes.object,
		getSkuMaster: PropTypes.func.isRequired,
		getSkuMasterResult: PropTypes.object,
		getKeywordTypeMaster: PropTypes.func.isRequired,
		getKeywordTypeMasterResult: PropTypes.object,
        getKeywordTagMaster:PropTypes.func.isRequired,
		getKeywordTagMasterResult: PropTypes.object,
	}

	render() {
		return <FilterComponent {...this.props} />
	}
}

export default ApiConnector(FilterContainer, {
	methods: {
		getRetailerMaster: {
			type: resources.httpMethod.POST,
			url: PIM_API+'/localeList',
		},
		getSuperCategoryMaster: {
			type: resources.httpMethod.POST,
			url:  PIM_API+'/getSuperCategoryListForFilter',
		},
		getChildSuperCategoryMaster: {
			type: resources.httpMethod.POST,
			url: PIM_API+'/getChildSuperCategoryListForFilter',
		},
		getCategoryMaster: {
			type: resources.httpMethod.POST,
			url: PIM_API+'/getCategoryListForFilter',
		},
		getChildCategoryMaster: {
			type: resources.httpMethod.POST,
			url: PIM_API+'/getChildCategoryListForFilter',
		},
		getSubCategoryMaster: {
			type: resources.httpMethod.POST,
			url: PIM_API+'/getSubCategoryListForFilter',
		},
		getChildSubCategoryMaster: {
			type: resources.httpMethod.POST,
			url: PIM_API+'/getChildSubCategoryListForFilter',
		},
		getBrandMaster: {
			type: resources.httpMethod.POST,
			url: PIM_API+'/getBrandListForFilter',
		},
		getSubFamilyMaster: {
			type: resources.httpMethod.POST,
			url: PIM_API+'/getChildBrandListForFilter',
		},
		getSubBrandMaster: {
			type: resources.httpMethod.POST,
			url: PIM_API+'/getSubBrandListForFilter',
		},
		getKeywordCategoryMaster: {
			type: resources.httpMethod.POST,
			url: 'v1/getMasterKeywordCategory',
		},
		getKeywordsMaster: {
			type: resources.httpMethod.POST,
			url: 'v1/getMasterKeywords',
		},
		getCityPincodeStoreMaster: {
			type: resources.httpMethod.POST,
			url: 'v1/getMasterCityPincodeStore',
		},
		getRetailerCategoryMaster: {
			type: resources.httpMethod.POST,
			url: 'v1/getMasterRetailerCategory',
		},
		getSkuMaster: {
			type: resources.httpMethod.POST,
			url: 'v1/getMasterSkus',
		},
		getKeywordTypeMaster:{
			type:resources.httpMethod.POST,
			url:'v1/getMasterKeywordTypeList',
		},
		getKeywordTagMaster:{
			type:resources.httpMethod.POST,
			url:'v1/getKeywordTagMasterList',
		},
	},
})
