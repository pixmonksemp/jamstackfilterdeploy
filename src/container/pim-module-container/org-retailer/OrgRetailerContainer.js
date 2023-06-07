import React, { Component } from "react"
import { resources } from "../../../common/common-api-constants";
import { PIM_API } from "../../../common/common-constants";
import ApiConnector from "../../../common/hoc/api-connector";
import OrgRetailer from "../../../components/org-retailer/OrgRetailer";

function OrgRetailerContainer(props){
    return(
        <OrgRetailer {...props} />
    )
}

export default ApiConnector(OrgRetailerContainer,{
    methods: {
        getAllRetailerData: {
            type: resources.httpMethod.POST,
            url: PIM_API + '/getAllOrgSkuRetailers'
        },
        getAllRetailers: {
            type: resources.httpMethod.GET,
            url: PIM_API+'/getAllRetailers',
        },
        getRetailerCategories: {
            type: resources.httpMethod.GET,
            url: PIM_API+'/getorgretailercategories'
        }
    }
})