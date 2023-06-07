import React from "react"
import ReadinessHistoryContainer from "../../../container/pim-module-container/syndication-container/retailer-list/readiness-history-container"
import { connect } from "react-redux"

function ReadinessHistory(props) {
    return <ReadinessHistoryContainer {...props} />
}

export default connect(null, null)(ReadinessHistory)