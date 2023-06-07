import React from "react"
import PublishedHistoryContainer from "../../../container/pim-module-container/syndication-container/retailer-list/published-history-container"
import { connect } from "react-redux"

function PublishedHistory(props) {
    return <PublishedHistoryContainer {...props} />
}

export default connect(null, null)(PublishedHistory)