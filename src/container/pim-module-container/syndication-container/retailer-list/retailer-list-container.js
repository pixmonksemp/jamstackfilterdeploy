import React, { useEffect } from "react";
import RetailerList from "../../../../components/pim-module-component/syndication/retailer-list/retailer-list";
import ApiConnector from "../../../../common/hoc/api-connector";
import { resources } from "../../../../common/common-api-constants";
import { PIM_API } from "../../../../common/common-constants";
function RetailerListContainer(props){
  useEffect(()=>{
    window.scroll(0, 0);
  },[])
    return <RetailerList {...props} />;
}
export default ApiConnector(RetailerListContainer, {
  methods: {
    getAllRetailers: {
            type: resources.httpMethod.GET,
            url: PIM_API+'/getAllRetailers',
        },
    insertAttributeGroupData: {
      type: resources.httpMethod.POST,
      url: PIM_API+'/createAttributeGroups',
    },
    updateAttributeGroupData: {
      type: resources.httpMethod.PUT,
      url: PIM_API+'/updateAttributeGroups',
    },
    deleteAttributeGroupData: {
      type: resources.httpMethod.DELETE,
      url: PIM_API+'/deleteAttributeGroups',
    },
    existsOrgRetailers:{
      type: resources.httpMethod.POST,
      url: PIM_API + "/existsOrgRetailers",
  },
  }
});