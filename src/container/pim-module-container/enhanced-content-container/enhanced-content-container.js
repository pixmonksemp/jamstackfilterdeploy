import EnhancedContent from '../../../components/pim-module-component/enhanced-content/enhanced-content'
import ApiConnector from '../../../common/hoc/api-connector'
import { resources } from '../../../common/common-api-constants'
import React, { useEffect } from 'react'
import { PIM_API } from "../../../common/common-constants";

function EnhancedContentContainer(props){
	useEffect(()=>{  window.scroll(0, 0);
	},[])
	  return <EnhancedContent {...props} />;
  }
  

export default ApiConnector(EnhancedContentContainer, {
	methods: {
		updateGetProductSkuData: {
			type: resources.httpMethod.POST,
			url: PIM_API+'/getUpdateProductskus'
		},
		cloneupdateGetProductSkuData:{
			type: resources.httpMethod.POST,
			url: PIM_API+'/getCloneProductSkuByRetailerId'
		},
		cloneProductSkuData:{
			type: resources.httpMethod.POST,
			url: PIM_API+'/cloneProductSkus'
		},
		updateProductSkuData:{
			type: resources.httpMethod.PUT,
			url: PIM_API+'/updateProductsku'
		},
		getAllRetailerData:{
			type:resources.httpMethod.POST,
			url:PIM_API +'/getAllOrgSkuRetailers'
		},
		dropdownvalueData:{
			type:resources.httpMethod.POST,
			url:PIM_API+'/getAttributeGroupsandAttributes'
		},
		createProductSkuData:{
			type:resources.httpMethod.POST,
			url:PIM_API+'/createProductsku'
		},
		getLocaleByOrganizationId: {
			type: resources.httpMethod.POST,
			url: PIM_API + "/locale",
		  },
		getSuperCategories: {
		  type: resources.httpMethod.POST,
		  url: PIM_API + "/getSuperCategoryListForFilter",
		},
		getOrganizationDetails: {
		  type: resources.httpMethod.GET,
		  url: PIM_API + "/organizations",
		},
		getChildSuperCategories: {
		  type: resources.httpMethod.POST,
		  url: PIM_API + "/getChildSuperCategoryListForFilter",
		},
		getCategories: {
		  type: resources.httpMethod.POST,
		  url: PIM_API + "/getCategoryListForFilter",
		},
		getChildCategories: {
		  type: resources.httpMethod.POST,
		  url: PIM_API + "/getChildCategoryListForFilter",
		},
		getSubCategories: {
		  type: resources.httpMethod.POST,
		  url: PIM_API + "/getSubCategoryListForFilter",
		},
		getChildSubCategories: {
		  type: resources.httpMethod.POST,
		  url: PIM_API + "/getChildSubCategoryListForFilter",
		},
		getBrands: {
		  type: resources.httpMethod.POST,
		  url: PIM_API + "/getBrandListForFilter",
		},
		getChildBrands: {
		  type: resources.httpMethod.POST,
		  url: PIM_API + "/getChildBrandListForFilter",
		},
		getSubBrands: {
		  type: resources.httpMethod.POST,
		  url: PIM_API + "/getSubBrandListForFilter",
		}
	},
})