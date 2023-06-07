import React, { Component } from "react"
import EnhancedContentContainer from '../../../container/pim-module-container/enhanced-content-container/enhanced-content-container'
import { connect } from "react-redux"

class enhancedContentPage extends Component {
  render() {
    return <EnhancedContentContainer {...this.props} />
  }
}

export default connect(null, null)(enhancedContentPage)