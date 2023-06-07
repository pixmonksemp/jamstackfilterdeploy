import { connect } from "react-redux";
import React, { Component } from "react"
import OrgRetailerContainer from "../../../container/pim-module-container/org-retailer/OrgRetailerContainer";

function OrgRetailerPage(props){
    return (
        <OrgRetailerContainer {...props} />
    )
}

export default connect(null, null)(OrgRetailerPage)