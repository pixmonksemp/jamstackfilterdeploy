import React from "react"
import AttributeGroupContainer from "../../../../container/pim-module-container/manage-attributes-container/attribute-group/attribute-group-container"
import { connect } from "react-redux"

function AttributeGroupPage(props) {
    return <AttributeGroupContainer {...props} />
}

export default connect(null, null)(AttributeGroupPage)