import React, { Component, useEffect } from "react"
import WorkflowHistory from "../../../components/pim-module-component/workflow-history/workflow-history"
import ApiConnector from "../../../common/hoc/api-connector"
import { resources } from "../../../common/common-api-constants"
import { PIM_API } from "../../../common/common-constants"

function workflowHistoryContainer(props) {
  useEffect(() => {
    window.scroll(0, 0)
  }, [])
  return <WorkflowHistory {...props} />
}

export default ApiConnector(workflowHistoryContainer, {
  methods: {
    getPendingApprovalSku: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/getWorkflowSkus",
    }
  },
})
