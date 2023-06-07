import React, { useEffect } from "react";
import RetailerAttrMap from "../../../../components/pim-module-component/syndication/retailer-list/map-attribute";
import ApiConnector from "../../../../common/hoc/api-connector";
import { resources } from "../../../../common/common-api-constants";
import { PIM_API } from "../../../../common/common-constants";

function RetailerAttrMapContainer(props) {
    useEffect(() => {
        window.scroll(0, 0);
    }, [])
    return <RetailerAttrMap {...props} />;
}

export default ApiConnector(RetailerAttrMapContainer, {
    methods: {
        getAllRetailers: {
            type: resources.httpMethod.GET,
            url: PIM_API + '/getAllRetailers',
        },
        getSystemAttributes: {
            type: resources.httpMethod.POST,
            url: PIM_API + "/getAttributes",
        },
        getOrgSystemAttributes: {
            type: resources.httpMethod.POST,
            url: PIM_API + "/getAttributes",
          },
        createOrgRetailers:{
            type: resources.httpMethod.POST,
            url: PIM_API + "/orgRetailers",
        },
        updateOrgRetailers:{
            type: resources.httpMethod.PUT,
            url: PIM_API + "/updateOrgRetailers",
        },
        existsOrgRetailers:{
            type: resources.httpMethod.POST,
            url: PIM_API + "/existsOrgRetailers",
        },
        updateAttributeGroupData: {
            type: resources.httpMethod.PUT,
            url: PIM_API + '/updateAttributeGroups',
        },
        deleteAttributeGroupData: {
            type: resources.httpMethod.DELETE,
            url: PIM_API + '/deleteAttributeGroups',
        },
        getAllRetailerData: {
            type: resources.httpMethod.POST,
            url: PIM_API + '/getAllOrgSkuRetailers'
        },
        getRetailerCategories: {
            type: resources.httpMethod.GET,
            url: PIM_API+'/getorgretailercategories'
        },
        updateMappedAttribute:{
            type:resources.httpMethod.POST,
            url: PIM_API+"/updateMappedAttributes"
        },
        updateRetailerMappedAttributes:{
            type:resources.httpMethod.POST,
            url: PIM_API+"/updateRetailerMappedAttributes"
        }
    }
});
