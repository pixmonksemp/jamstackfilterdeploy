import React, { Component, useEffect } from 'react'
import ImportData from '../../../components/pim-module-component/importdata/importdata'
import ApiConnector from '../../../common/hoc/api-connector'
import { resources } from '../../../common/common-api-constants'
import { PIM_API } from '../../../common/common-constants'

function ImportdataCointainer(props) {
	useEffect(() => {
		window.scroll(0, 0)
	}, [])
	return (
  <ImportData {...props} />
  )
}

export default ApiConnector(ImportdataCointainer, {
  methods: {
    getSystemAttributes: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/getAttributes",
    },
    getImportAuditData: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/getImportAudit",
    },
    postImportedFile: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/fileReader",
    },
    abortImportedFile: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/isProcessAborted",
    },
    getImportProcessLogList: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/getImportProcessLog",
    },
    getOrganization:{
      type:resources.httpMethod.GET,
      url:PIM_API+'/organizations'
    }
  },
})
