import React, { useEffect } from "react";
import AttributeGroup from "../../../../components/pim-module-component/manage-attribute/attribute-group/attribute-group";
import ApiConnector from "../../../../common/hoc/api-connector";
import { resources } from "../../../../common/common-api-constants";
import { PIM_API } from "../../../../common/common-constants";

function AttributeGroupContainer(props){
  useEffect(()=>{
    window.scroll(0, 0);
  },[])
    return <AttributeGroup {...props} />;
}

export default ApiConnector(AttributeGroupContainer, {
  methods: {
    getManageAttributeGroup: {
			type: resources.httpMethod.POST,
			url: PIM_API+'/getAttributeGroups',
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
    getSearchAttributeGroup: {
			type: resources.httpMethod.POST,
			url: PIM_API+'/getAttributeGroups',
		}
  }
});
