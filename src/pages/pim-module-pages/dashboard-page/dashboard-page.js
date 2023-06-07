import React, { Component } from "react"
import DashboardContainer from "../../../container/pim-module-container/dashboard-container/dashboard-container"
import { connect } from "react-redux"

class DashboardPage extends Component {
  render() {
    return <DashboardContainer {...this.props} />
  }
}

export default connect(null, null)(DashboardPage)