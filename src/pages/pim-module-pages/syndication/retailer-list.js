import React from "react"
import RetailerListContainer from "../../../container/pim-module-container/syndication-container/retailer-list/retailer-list-container"
import { connect } from "react-redux"

function RetailerListPage(props) {
    return <RetailerListContainer {...props} />
}

export default connect(null, null)(RetailerListPage)