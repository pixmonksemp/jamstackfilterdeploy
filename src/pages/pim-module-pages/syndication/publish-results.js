import React from "react"
import PublishResltsContainer from "../../../container/pim-module-container/syndication-container/retailer-list/publish-results-container"
import { connect } from "react-redux"

function PublishResultsPage(props) {
    return <PublishResltsContainer {...props} />
}

export default connect(null, null)(PublishResultsPage)