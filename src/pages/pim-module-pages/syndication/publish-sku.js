import React from "react"
import PublishSkuContainer from "../../../container/pim-module-container/syndication-container/retailer-list/publish-sku-container"
import { connect } from "react-redux"

function PublishSkuPage(props) {
    return <PublishSkuContainer {...props} />
}

export default connect(null, null)(PublishSkuPage) 