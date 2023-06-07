import React, { useEffect } from 'react'
import { resources } from '../../../common/common-api-constants'
import RetailersCategoryMapper from '../../../components/pim-module-component/retailers-category-mapper-component/retailersCategoryMapperComponent'
import ApiConnector from '../../../common/hoc/api-connector'
import { PIM_API } from '../../../common/common-constants'

function RetailersCategoryMapperContainer(props) {
   useEffect(() => {
      window.scroll(0, 0)
   }, [])
   return <RetailersCategoryMapper {...props} />
}

export default ApiConnector(RetailersCategoryMapperContainer, {
   methods: {
      getMasterRetailerCategories: {
         type: resources.httpMethod.POST,
         url: PIM_API + '/getMasterRetailerCategories',
      },
      getOrUpdateMapperRetailerCategories: {
         type: resources.httpMethod.POST,
         url: PIM_API + '/getOrUpdateMapperRetailerCategories',
      },
      getOrgRetailerById: {
         type: resources.httpMethod.GET,
         url: PIM_API + '/getOrgRetailersById',
      },
   },
})
