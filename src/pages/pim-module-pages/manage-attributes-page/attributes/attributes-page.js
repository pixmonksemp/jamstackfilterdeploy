import React from "react"
import AttributeContainer from "../../../../container/pim-module-container/manage-attributes-container/attribute/attribute-container"
import { connect } from "react-redux"

function AttributePage(props) {
    return <AttributeContainer {...props} />
}

export default connect(null, null)(AttributePage)