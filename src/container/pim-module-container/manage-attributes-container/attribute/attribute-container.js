import React, { useEffect } from "react"
import Attribute from "../../../../components/pim-module-component/manage-attribute/attribute/attribute"
import ApiConnector from "../../../../common/hoc/api-connector"
import { resources } from "../../../../common/common-api-constants"
import { PIM_API } from "../../../../common/common-constants"

function AttributeContainer(props){
  useEffect(()=>{
    window.scroll(0, 0)
  },[])
    return <Attribute {...props} />
}

export default ApiConnector(AttributeContainer, {
  methods: {
    getManageAttribute: {
			type: resources.httpMethod.POST,
			url: PIM_API+'/getAttributes',
		},
    insertAttributeData: {
      type: resources.httpMethod.POST,
      url: PIM_API+"/createAttribute",
    },
    updateAttributeData: {
      type: resources.httpMethod.PUT,
      url: PIM_API+"/updateAttribute",
    },
    deleteAttributeData: {
      type: resources.httpMethod.DELETE,
      url: PIM_API+"/deleteAttributes",
    },
    getAttributeTypeData:{
      type: resources.httpMethod.GET,
      url: PIM_API+"/getAttributesType"
    },
    getAttributeGroupData:{
      type: resources.httpMethod.POST,
      url: PIM_API+'/getAttributeGroups'
    },
    updateAttributeGroup:{
      type: resources.httpMethod.POST,
      url: PIM_API+'/group-attributes'
    },
    searchAttributeGroup:{
      type: resources.httpMethod.POST,
      url: PIM_API+'/attributeSearch'
    },
    searchGridAttributeGroup:{
      type: resources.httpMethod.POST,
      url: PIM_API+'/attributeSearch'
    },
    abortImportedFile: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/isProcessAborted",
    },
  },
})
