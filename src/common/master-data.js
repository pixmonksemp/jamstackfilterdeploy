export const getApiRequestObject = {
  pageStart: 0,
  pageEnd: 10,
  sortField: "attrName",
  sortType: "DESC",
  organizationId: "",
  attrGrpName: "%%",
}

export const getAttributeGroupObject = {
  pageStart: 0,
  pageEnd: 3000,
  sortField: "attrGrpName",
  sortType: "ASC",
  organizationId: "",
  attrGrpName: "%%",
}

export const getSearchObject = {
  pageStart: 0,
  pageEnd: 100,
  sortField: "id",
  sortType: "DESC",
  organizationId: "",
  attrGrpName: "",
}

export const getRetailersCategoryData = {
  retailerId: 0,
  organizationId: 0
}

export const getAssetRequestObject = {
  ids: [],
  pageStart: 0,
  pageEnd: 15,
  sortField: "id",
  sortType: "Asc",
  searchKey: "",
  organizationId: "",
}

export const updateAssetsRequestObject = {
    pimerceOrgId: "",
    id: null,
    version: 0,
    assetType: "",
    assetName: "",
    assetSize: 0,
    locale: "",
    assetSource:"",
    assetBaseUrl: "",
    organizationId: null,
    assetBaseUrl: "",
    uploadedUrl: "",
    metaTags: [],
    timeZone : "",
    assetExtension : "",

}

export const getAssetHierarchyObject = {
  ids: [],
  localeId: null,
  pageStart: 0,
  pageEnd: 1000,
  sortField: "id",
  sortType: "DESC",
  baseFilterVO:{ 
    organizationId: "a535a47e-23b3-11ed-861d-0242ac120002",
    toDate:"2022-09-21",
    moduleName: 'Pricing Insights',
    columnName: 'filter',
    optionsList: ["Category","Brand"],
    superCategoryList: [],
    childSuperCategoryList: [],
    categoryList: [],
    childCategoryList: [],
    subCategoryList: [],
    childSubCategoryList: [],
    brandList: [],
    subFamilyList: [],
    subBrandList: [],
    }
}

export const insertApiRequestObject = {
  attrGrpName: "",
  attrName: "",
  attrType: "",
  attrDescription: "",
  attrGrpDescription: "",
  locale: "en",
  attrGrpId: "",
  organizationId: "",
  timeZone: "",
  isMandatory: false,
}

export const updateApiRequestObject = {
  id: "",
  attrGrpName: "",
  attrGrpId: "",
  attrName: "",
  attrType: "",
  attrDescription: "",
  attrGrpDescription: "",
  version: "",
  locale: "en",
  organizationId: "",
  timeZone: "",
  isMandatory: false,
}

export const AssetFilterSearch = {
  ids: [],
  pageStart: 0,
  pageSize: 10,
  sortField: "id",
  sortType: "Asc",
  organizationId: null,
  searchKey:"",
  extentions:[],
  metaTags:[],
  sizeStart:0,
  sizeEnd: 0,
}

export const deleteApiRequestObject = {
  deleteByIds: [],
}

export const exportApiRequestObject = {
  ids: [],
  organizationId: "",
}

export const postImportedFileRequest = {
  orgId: "",
  fileName: "",
  userId: 0,
  fileSize: "",
  fileSource: "",
  fileType: "",
  fileLink: "",
  locale: "EN",
  userName: "",
  guid: "",
  aborted: false,
  timeZone: "",
  origin: ""
}

export const getImportAuditApiRequestObject = {
  pageStart: 0,
  pageEnd: 10,
  sortField: "id",
  sortType: "DESC",
  organization_id: "",
}

export const getProductSkuAttributesApiRequestObject = {
  id: 1,
  organizationId: 1,
}

export const getCloneProductSkuAttributesApiRequestObject = {
  productSkuId:5,
  retailerId:1
}

export const cloneCurrentProductSku = {
  organizationId:1,
  productSkusList:[],
  retailerIdsList:[],
  isfoundation:true
}

export const getProductSkuApiRequestObject = {
  pageStart: 0,
  pageEnd: 10,
  sortField: "id",
  sortType: "DESC",
  organizationId: "",
}

export const productSkuUpdateSaveApiRequestObject = {
  id: 5,
  Locale: "en",
  productName: "",
  uniqueColumns: '{}',
  mandatoryColumns: '{"productName":"pixmonks"}',
  timeZone: "Asia/Calcutta",
  isdelete: "false",
  version: 0,
  organizationId: 1,
  superCategoryId: null,
  childSuperCategoryId: null,
  categoryId: null,
  childCategoryId: null,
  subCategoryId: null,
  childSubCategoryId: null,
  brandId: null,
  childBrandId: null,
  subBrandId: null,
  localeId: null,
  productSkuAttr: "",
  productSkuId: 5,
  retailerId: 1,
  cloneRetailerIdList:[],
  mainImageUrl:"",
  uniqueIdentifier:"",
  assetIds:"",
  productNameSearch:"",
  productStatus:""
  // productSkuAttributes: [
  //   {
  //     isdelete: false,
  //     timeZone: "Asia/Calcutta",
  //     version: 0,
  //     productSkuAttr: "",
  //   },
  // ],
}

export const getProductSkuSearch = {
  ids: [],
  pageStart: 0,
  pageEnd: 15,
  sortField: "updated_date",
  sortType: "DESC",
  organizationId: "",
  searchKey: "",
}

export const assetSettingList = [
  { label: "Upload assets from Local", value: "Upload assets from Local" },
  { label: "Upload assets from Cloud", value: "Upload assets from Cloud" },
  { label: "Selected Asset download", value: "Selected Asset download" },
  { label: "Bulk Asset Download", value: "Bulk Asset Download" },
  { label: "Delete", value: "Delete" },
]

export const bulkDownloadRequest = {
  ids: [],
  organizationId: null,
  downloadType: "ALL",
  toEmailId: "",
}
export const getRolesApiRequestObject = {
  pageStart: 0,
  pageEnd: 10,
  sortField: "updatedDate",
  isSuperAdmin: false,
  sortType: "DESC",
  organizationId: "",
}

export const roleCreateApiRequest = {
  roleName: "",
  isDeleted: false,
  organizationid: "",
  isSuperAdmin: false,
  locale: "en",
  roleDescription: "",
  featureAccesses: [],
  isApprover: false,
}

export const userCreateApiRequest = {
  userName: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  activeFlag: true,
  accountNonExpired: true,
  accountNonLocked: true,
  credentialsNonExpired: true,
  firstTimeUser: true,
  emailID: "",
  password: "",
  dataAccess: "{access:true}",
  displayName: "",
  organizationId: "",
  userType: "Admin",
  isDeleted: false,
  versionId: 1,
  rolesId: null,
}

export const assetSearchRequest = {
  pimerceOrgId: "",
  ids: [],
  organizationId: null,
  fromIndex: 0,
  size: 15,
  sortField: "updated_date",
  sortType: "Desc",
  searchKey:"",
  extentions:[],
  metaTags:[],
  sizeStart:null,
  sizeEnd: null,
  baseFilterVO : {},
}

export const getUserListApiRequestObject = {
  pageStart: 0,
  pageEnd: 10,
  sortField: "updatedDate",
  sortType: "DESC",
  organizationId: "",
  userName: "",
}

export const hierarchyDropdownObject = {
  locale: "",
  superCategory: "",
  childSuperCategory: "",
  category: "",
  childCategory: "",
  subCategory: "",
  childSubCategory: "",
  brand: "",
  childBrand: "",
  subBrand: "",
}

export const DataViewGridLoad = { 
  organizationId: "1",
  toDate:"2022-09-21",
  moduleName: "PIM Asset,PIM Manage Catalog",
  columnName: 'filter',
  optionsList: [ "Category",
  "Brand"],
  superCategoryList: [],
  childSuperCategoryList: [],
  categoryList: [],
  childCategoryList: [],
  subCategoryList: [],
  childSubCategoryList: [],
  brandList: [],
  subFamilyList: [],
  subBrandList: [],
  fromIndex: 0,
  size: 15,
  pimRetailerID: 0
  }

export const getMasterTags ={
      organizationId : null,
      pageStart : 0,
      pageEnd : 100,
      sortField : "tag",
      sortType : "ASC"   
}
 
export const UpdateAssetMetaTag = {
    pimerceOrgId: "",
    id: null,
    version: 0,
    assetType: "",
    assetName: "",
    assetSize: 0,
    locale: "",
    assetBaseUrl: "",
    organizationId: null,
    assetBaseUrl: "",
    uploadedUrl: "",
    metaTags: [],
    timeZone : "",
    assetExtension : "",
    assetSource: ""
  }

  export const getpublishHistory = {
    orgId : null,
    pageStart : 0,
    pageEnd : 10,
    sortField : "updatedDate",
    sortType:"DESC"
}

export const getReadinessHistoryRequest = {
  orgId : null,
  pageStart : 0,
  pageEnd : 10,
  sortField : "updatedDate",
  sortType:"DESC"
}

export const sortTypes = [
  { name: "By Date Asc", key: "A", iClass: "https://sgp1.digitaloceanspaces.com/pixmonksdevspace/pimcollections/organizationAssets/Vector%20%289%29.svg", iconSpan: "https://sgp1.digitaloceanspaces.com/pixmonksdevspace/pimcollections/organizationAssets/Vector%20%288%29.svg" },
  { name: "By Date Desc", key: "D", iClass: "https://sgp1.digitaloceanspaces.com/pixmonksdevspace/pimcollections/organizationAssets/Vector%20%2810%29.svg", iconSpan: "https://sgp1.digitaloceanspaces.com/pixmonksdevspace/pimcollections/organizationAssets/Vector%20%288%29.svg"},
  { name: "By Name (A-Z)", key: "A-Z", iClass: "", iconSpan: "https://sgp1.digitaloceanspaces.com/pixmonksdevspace/pimcollections/organizationAssets/Vector%20%286%29.svg" },
  { name: "By Name (Z-A)", key: "Z-A", iClass: "", iconSpan: "https://sgp1.digitaloceanspaces.com/pixmonksdevspace/pimcollections/organizationAssets/Vector%20%287%29.svg" },
]

export const stepList = ['Select Retailer','Select SKUs','Review Readiness']

export const statusTypeOfProudctSyndication = [
  {
      "id": "ACTIVE",
      "name": "ACTIVE",
      "label": "ACTIVE",
      "value": "ACTIVE",
  },
  {
    "id": "DELISTED",
    "name": "DELISTED",
    "label": "DELISTED",
    "value": "DELISTED",
  },
  {
    "id": "MARKEDFORDELISTING",
    "name": "MARKEDFORDELISTING",
    "label": "MARKEDFORDELISTING",
    "value": "MARKEDFORDELISTING",
  }
]

export const statusTypeOfProudct = [
  {
      "id": "ACTIVE",
      "name": "ACTIVE",
      "label": "ACTIVE",
      "value": "ACTIVE",
  },
  {
    "id": "MARKEDFORDELISTING",
    "name": "MARKEDFORDELISTING",
    "label": "MARKEDFORDELISTING",
    "value": "MARKEDFORDELISTING",
  }
]

export const mockDataForPublish = [
  {
      "jwtToken": null,
      "pageStart": 0,
      "pageEnd": 0,
      "pageSize": 0,
      "version": 0,
      "totalCount": null,
      "totalElement": null,
      "sortType": null,
      "sortField": null,
      "localeId": null,
      "locale": null,
      "createdBy": "murugan@pixmonks.com",
      "updatedBy": "murugan@pixmonks.com",
      "createdDate": "2022-01-26T00:52:46",
      "updatedDate": "2022-01-26T00:52:46",
      "errorMsg": null,
      "errorCode": null,
      "id": 10,
      "attrName": "Biscuits",
      "attrType": "Belvita",
      "attrDescription": "72544",
      "attrDescription1": "Belvita Milk & Cereal Breakfast Biscuits 300 Gr",
      "attrDescription2": "SUCCESS",
      "timeZone": "Asia/Calcutta",
      "attrGrpId": 1,
      "attrGrpName": "https://pixmonksdevspace.sgp1.digitaloceanspaces.com/pimcollections/111222333/assets/belvita-milk-cereal-breakfast-biscuits-300-gr_111222333_en.jpeg",
      "organizationId": null,
      "isMandatory": true,
      "editIcons":true
  },
  {
      "jwtToken": null,
      "pageStart": 0,
      "pageEnd": 0,
      "pageSize": 0,
      "version": 0,
      "totalCount": null,
      "totalElement": null,
      "sortType": null,
      "sortField": null,
      "localeId": null,
      "locale": null,
      "createdBy": "murugan@pixmonks.com",
      "updatedBy": "murugan@pixmonks.com",
      "createdDate": "2022-01-26T00:52:46",
      "updatedDate": "2022-01-26T00:52:46",
      "errorMsg": null,
      "errorCode": null,
      "id": 11,
      "attrName": "Biscuits",
      "attrType": "Belvita",
      "attrDescription": "72544",
      "attrDescription1": "belVita Blueberry Breakfast Biscuits, 12 Packs (4 Biscuits Per Pack)",
      "attrDescription2": "FAILED",
      "timeZone": "Asia/Calcutta",
      "attrGrpId": 1,
      "attrGrpName": "https://pixmonksdevspace.sgp1.digitaloceanspaces.com/pimcollections/111222333/assets/81oZWW3yu4L._SL1500__111222333_en.jpeg",
      "organizationId": null,
      "isMandatory": true,
      "editIcons":true
  },
  {
      "jwtToken": null,
      "pageStart": 0,
      "pageEnd": 0,
      "pageSize": 0,
      "version": 0,
      "totalCount": null,
      "totalElement": null,
      "sortType": null,
      "sortField": null,
      "localeId": null,
      "locale": null,
      "createdBy": "murugan@pixmonks.com",
      "updatedBy": "murugan@pixmonks.com",
      "createdDate": "2022-01-26T00:52:46",
      "updatedDate": "2022-01-26T00:52:46",
      "errorMsg": null,
      "errorCode": null,
      "id": 12,
      "attrName": "Biscuits",
      "attrType": "Belvita",
      "attrDescription": "72544",
      "attrDescription1": "belVita Breakfast Biscuits Variety Pack, 4 Flavors, 6 Boxes of 5 Packs (4 Biscuits Per Pack)",
      "attrDescription2": "SUCCESS",
      "timeZone": "Asia/Calcutta",
      "attrGrpId": 1,
      "attrGrpName": "https://pixmonksdevspace.sgp1.digitaloceanspaces.com/pimcollections/111222333/assets/91JubIStUeL._SX569_PIbundle-6%2CTopRight%2C0%2C0_AA569SH20__111222333_en.jpeg",
      "organizationId": null,
      "isMandatory": true,
      "editIcons":true
  },
  {
      "jwtToken": null,
      "pageStart": 0,
      "pageEnd": 0,
      "pageSize": 0,
      "version": 0,
      "totalCount": null,
      "totalElement": null,
      "sortType": null,
      "sortField": null,
      "localeId": null,
      "locale": null,
      "createdBy": "murugan@pixmonks.com",
      "updatedBy": "murugan@pixmonks.com",
      "createdDate": "2022-01-26T00:52:46",
      "updatedDate": "2022-01-26T00:52:46",
      "errorMsg": null,
      "errorCode": null,
      "id": 14,
      "attrName": "Biscuits",
      "attrType": "Belvita",
      "attrDescription": "72544",
      "attrDescription1": "Belvita Rich in Fibre Breakfast Biscuits Box (Bran, 744g) - Set of 12",
      "attrDescription2": "SUCCESS",
      "timeZone": "Asia/Calcutta",
      "attrGrpId": 1,
      "attrGrpName": "https://pixmonksdevspace.sgp1.digitaloceanspaces.com/pimcollections/111222333/assets/61a7xIh4wwL._SX679__111222333_en.jpeg",
      "organizationId": null,
      "isMandatory": true,
      "editIcons":true
  },
  {
      "jwtToken": null,
      "pageStart": 0,
      "pageEnd": 0,
      "pageSize": 0,
      "version": 0,
      "totalCount": null,
      "totalElement": null,
      "sortType": null,
      "sortField": null,
      "localeId": null,
      "locale": null,
      "createdBy": "murugan@pixmonks.com",
      "updatedBy": "murugan@pixmonks.com",
      "createdDate": "2022-01-26T00:52:46",
      "updatedDate": "2022-01-26T00:52:46",
      "errorMsg": null,
      "errorCode": null,
      "id": 15,
      "attrName": "Biscuits",
      "attrType": "Belvita",
      "attrDescription": "72544",
      "attrDescription1": "Belvita Breakfast Biscuits (8.8 Oz) - Pack of 6",
      "attrDescription2": "SUCCESS",
      "timeZone": "Asia/Calcutta",
      "attrGrpId": 1,
      "attrGrpName": "https://pixmonksdevspace.sgp1.digitaloceanspaces.com/pimcollections/111222333/assets/81FcldTMRgL._SX569__111222333_en.jpeg",
      "organizationId": null,
      "isMandatory": true,
      "editIcons":true
  },
  {
      "jwtToken": null,
      "pageStart": 0,
      "pageEnd": 0,
      "pageSize": 0,
      "version": 0,
      "totalCount": null,
      "totalElement": null,
      "sortType": null,
      "sortField": null,
      "localeId": null,
      "locale": null,
      "createdBy": "murugan@pixmonks.com",
      "updatedBy": "murugan@pixmonks.com",
      "createdDate": "2022-01-26T00:52:46",
      "updatedDate": "2022-01-26T00:52:46",
      "errorMsg": null,
      "errorCode": null,
      "id": 17,
      "attrName": "Biscuits",
      "attrType": "Belvita",
      "attrDescription": "72544",
      "attrDescription1": "Belvita Blueberry Breakfast Biscuits, 8.8 Oz (Pack of 6)",
      "attrDescription2": "SUCCESS",
      "timeZone": "Asia/Calcutta",
      "attrGrpId": 1,
      "attrGrpName": "https://pixmonksdevspace.sgp1.digitaloceanspaces.com/pimcollections/111222333/assets/81FcldTMRgL._SL1500__111222333_en.jpeg",
      "organizationId": null,
      "isMandatory": true,
      "editIcons":true
  }
]


export const publishResultTabMenu = [
  {label: 'New Listings'},
  {label: 'Updated Products'},
  {label: 'Products to be de-listed'}
  // {label: 'Documentation', icon: 'pi pi-fw pi-file'},
  // {label: 'Settings', icon: 'pi pi-fw pi-cog'}
];


export const readinessResultTabMenu = [
  {label: 'New/Updated products'},
  {label: 'Products to be de-listed'}
];

export const getPendingApproval = {
  orgId: null,
  sortField: "updatedDate",
  pageStart: 0,
  pageEnd: 0,
  readinessReportStatus: null,
  sortType: "ASC",
  status: [],
  approveStatusList: [],
  approveStatus:"",
  ids:[]
}

export const workflowSubmission = {
  approverId: null,
  makerId: null,
  status : "",
  orgRetailerInfoDTO : null
}