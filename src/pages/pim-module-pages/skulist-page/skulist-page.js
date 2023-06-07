import React, { Component } from "react"
import SkuListContainer from "../../../container/pim-module-container/skulist-container/skulist-container"
import { connect } from "react-redux"

class SkuListPage extends Component {
  render() {
    return <SkuListContainer {...this.props} />
  }
}

export default connect(null, null)(SkuListPage)