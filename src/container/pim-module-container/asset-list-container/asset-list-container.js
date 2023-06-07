import React, { Component, useEffect } from "react"
import AssetListing from "../../../components/pim-module-component/asset-listing/asset-listing"
import ApiConnector from "../../../common/hoc/api-connector"
import { resources } from "../../../common/common-api-constants"
import { PIM_API } from "../../../common/common-constants"

function assetListContainer(props) {
  useEffect(() => {
    window.scroll(0, 0)
  }, [])
  return <AssetListing {...props} />
}

export default ApiConnector(assetListContainer, {
  methods: {
    getAssetList: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/getAssetsList",
    },
    getOrganizationDetails: {
      type: resources.httpMethod.GET,
      url: PIM_API + "/organizations",
    },
    assetSearch: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/assetsSearch",
    },
    assetNameSearch: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/assetsSearch",
    },
    assetBulkDownloads: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/assetsBulkDownload",
    },
    deleteAssets: {
      type: resources.httpMethod.DELETE,
			url: PIM_API+'/removeAssets',
    },
    abortImportedFile: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/isProcessAborted",
    },
    getMasterTags:{
      type: resources.httpMethod.POST,
      url: PIM_API + "/masterTags"
    },
    updateAssetMetaTags:{
      type: resources.httpMethod.POST,
      url: PIM_API + "/updateAssets"
    },
    getAssetById: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/getAssetById",
    },
  },
})
