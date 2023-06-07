import React, { Component, useEffect } from "react"
import ImageEditor from "../../../components/pim-module-component/asset-listing/image-editor"
import ApiConnector from "../../../common/hoc/api-connector"
import { resources } from "../../../common/common-api-constants"
import { PIM_API } from "../../../common/common-constants"

function imageEditorContainer(props) {
  useEffect(() => {
    window.scroll(0, 0)
  }, [])
  return <ImageEditor {...props} />
}

export default ApiConnector(imageEditorContainer, {
  methods: {
    updateAssets: {
        type: resources.httpMethod.POST,
        url: PIM_API+'/updateAssets',
    }
  },
})
