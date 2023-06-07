import React, { Component, useEffect } from "react"
import PendingApproval from "../../../components/pim-module-component/pending-approval/pending-approval"
import ApiConnector from "../../../common/hoc/api-connector"
import { resources } from "../../../common/common-api-constants"
import { PIM_API } from "../../../common/common-constants"

function pendingApprovalContainer(props) {
  useEffect(() => {
    window.scroll(0, 0)
  }, [])
  return <PendingApproval {...props} />
}

export default ApiConnector(pendingApprovalContainer, {
  methods: {
    getPendingApprovalSku: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/getWorkflowSkus",
    }
  },
})
