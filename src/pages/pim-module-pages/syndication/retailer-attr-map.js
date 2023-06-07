import React from "react"
import RetailerAttrMapContainer from "../../../container/pim-module-container/syndication-container/retailer-list/retailer-attr-map-container"
import { connect } from "react-redux"

function RetailerAttrMapPage(props) {
    return <RetailerAttrMapContainer {...props} />
}

export default connect(null, null)(RetailerAttrMapPage)