import { connect } from "react-redux";
import React, { Component } from "react"
import RoleManagementContainer from "../../../container/pim-module-container/role-management-container/RoleManagementContainer";

function RoleManagementPage(props) {
    return (<RoleManagementContainer {...props}/>  );
}

export default connect(null, null)(RoleManagementPage)