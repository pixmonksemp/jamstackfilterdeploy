import React, { Component, useEffect } from "react"
import ApprovalWorkflow from "../../../components/pim-module-component/approval-workflow/approval-workflow"
import ApiConnector from "../../../common/hoc/api-connector"
import { resources } from "../../../common/common-api-constants"
import { PIM_API } from "../../../common/common-constants"

function approvalWorkflowContainer(props) {
  useEffect(() => {
    window.scroll(0, 0)
  }, [])
  return <ApprovalWorkflow {...props} />
}

export default ApiConnector(approvalWorkflowContainer, {
  methods: {
    getPendingApprovalWorkflow: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/getPendingApprovalWorkflow",
    },
    getApprovalWorkflow: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/getPendingApprovalWorkflow",
    }
  },
})
