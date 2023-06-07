import React, { createContext } from "react"

// Creating the context object and passing the default values.
const ProfileContext = createContext({
  ProductSkuDetails: "",
  ProductSkuMethodName: "",
  SelectedProductSkuImageName:"",
  IsImportButtonDock: false,
  IsAssetsBulkImportButtonDock: false,
  AssetsDockRenderData: false,
  importDockRenderDate: false,
})

export default ProfileContext
