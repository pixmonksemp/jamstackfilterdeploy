import React, { Component } from "react"
import { connect } from "react-redux"
import UserManagementContainer from "../../../container/pim-module-container/user-management-container/UserManagementContainer"

function UserManangementPage(props) {
  
    return <UserManagementContainer {...props} />
  
}

export default connect(null, null)(UserManangementPage)