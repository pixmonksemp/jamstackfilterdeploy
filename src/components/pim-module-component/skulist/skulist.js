import React, { useEffect, useState, useContext,useRef } from "react"
import {
  SCROLL_HEIGHT,
  MEDIUM,
  SCROLL_WIDTH,
  ERROR_BG_COLOR,
  COLUMN_RESIZE_MODE,
  GRID_SIZE,
  CREATE,
  UPDATE,
  DELETE,
  VALID_BG_COLOR,
  IMAGE_EXT_VALIDATOR,
  PIM_API,
  PRODUCTNAME,
  GTIN,
  DELIST,
  TOTALPRODUCTS,
} from "../../../common/common-constants"
import i18n from "../../../translate/i18n"
import ModalComponent from "../../modal/index"
import {
  deleteApiRequestObject,
  getProductSkuSearch,
  statusTypeOfProudct,
  statusTypeOfProudctSyndication,
} from "../../../common/master-data"
import "./style.scss"
// import { Toolbar } from "primereact/toolbar"
// import { Button } from "primereact/button"
import ToastModal from "../../modal/ToastModal"
import PREVIEW from "../../../assets/no_preview.png"
import HeaderContext from "../../../common/header-context"
import PimerceAuth from "../../authorization-tag/PimerceAuth"
// import Autocomplete from "@pixmonks/auto-complete"
import Autocomplete from "./autocomplete"
import Plusicon from "../../../common/icons/plusicon"
import Deleteicon from "../../../common/icons/deleteicon"
import FilterAndAppliedFilter from "../../filter/components/filter-appliedfilter-combine-component/filter-appliedfilter-component"
import { connect } from "react-redux"
// import PimerceDataView from "../../data-view/dataview"
import "../asset-listing/style.scss"
import { Col, DropdownButton, Row, Spinner } from "react-bootstrap"
// import { Toast } from 'primereact/toast';
import { removeArrayObjectDuplicates } from "../../filter/components/filter-component/filterdata-constant"
import multiSelect from "../../../assets/multiSelect.svg"
import { COMMON_URL } from "../../../common/common-api-constants"
import axios from "axios"
import moment from 'moment'
import SearchableDropdown from "../../../components/filter/components/searchable-select/index";
// import { Tag } from 'primereact/tag';
import Catalog_Icon from "../../../common/icons/catalogicon";
// import BackPageComponent from "../../../components/back-page-component/back-page-component"

const mapStateToProps = (state) => {
  return {
    getFilterDataValue: state.stateData.getFilterdata,
    retainingData: state.dashboardValue.selectedFiltersforRetainingValues,
    getUserDetail: state.userDetail.getUsersObj.userCredentials,
  }
}

let numberOfPage,
  productSkuGridData = [],
  dataViewColumn = [
    {
      field: "id",
      match: "id"
    },
    {
      field: "productName",
      match: "content_name"
    },
    {
      field: "gtin",
      match: "content_desc"
    },
    {
      field: "productgroups_id",
      match: "content_image"
    },
    {
      field: "productType",
      match: "content_type"
    },
    {
      field: "productSkuDelisting",
      match: "contentTagItem"
    }
  ],
  toastHeading,
  toastContent,
  titleBackgroundColor,
  toastSize,
  deleteMessage = i18n.t("productSkuDialogText.deleteMessage"),
  record = i18n.t("productSkuDialogText.record"),
  records = i18n.t("productSkuDialogText.records"),
  addNewButtonLabel = i18n.t("productSkuDialogText.addNewButtonLabel"),
  deleteButtonLabel = i18n.t("productSkuDialogText.deleteButtonLabel"),
  updateButtonLabel = i18n.t("productSkuDialogText.updateButtonLabel"),
  gridHeader = i18n.t("productSkulist.gridtitle"),
  popupHeader = i18n.t("productSkulist.dialogtitle"),
  labelNo = i18n.t("datatable.no"),
  labelYes = i18n.t("datatable.yes"),
  changevalue = [{ name: "", value: "" }],
  toastObj = {
    toastHeading: "",
    toastContent: "",
    titleBackgroundColor: "",
    toastSize: "",
  },
  onTextValue,
  onSearchValue,
  FilterIds = [],
  storeHierarchyIds = [],
  SUGGESTION_OPTION = []

function Skulist(props) {
  const { getFilterDataValue, getUserDetail } = props
  let userDetails = getUserDetail
  const toast = useRef(null)
  let filterOptions = getFilterDataValue
    ? JSON.parse(getFilterDataValue.organization.defaultoption.FilterDropdowns)
    : null
  let initialRequestCM = getFilterDataValue
    ? getFilterDataValue.initialRequest.Cataglog_Management
    : null
  let authJson = JSON.parse(sessionStorage.getItem("authJson")),
    toastObj = {
      toastHeading: "",
      toastContent: "",
      titleBackgroundColor: "",
      toastSize: "",
    }
  let requestParams = {
    superCategoryList: [],
    childSuperCategoryList: [],
    categoryList: [],
    childCategoryList: [],
    subCategoryList: [],
    childSubCategoryList: [],
    brandList: [],
    subFamilyList: [],
    subBrandList: [],
    optionsList: [],
    organizationId: getFilterDataValue.organization.id,
    size: 15,
    fromIndex: 0,
    searchKey: '',
    sortField: 'updated_date',
    sortType: 'DESC',
    moduleName: 'PIM Manage Catalog',
    toDate: new Date(),
    columnName: 'filter',
    productStatus : [],
    pimRetailerID: props.history.location.state ? props.history.location.state.orgRetailerId ? props.history.location.state.orgRetailerId : null : null
  }

  const [gridData, setGridData] = useState([])
  const [isSearchString, setIsSearchString] = useState(false)
  const [isLoader, setIsLoader] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  const [isSelectedRowCleared, setIsSelectedRowCleared] = useState(false)
  const [isGridDialog, setIsGridDialog] = useState(false)
  const [isDeleteRecordsDialog, setIsDeleteRecordsDialog] = useState(false)
  const [clickEvent, setClickEvent] = useState("")
  const [isDisableDeleteButton, setIsDisableDeleteButton] = useState(true)
  const [onSelected, setOnSelected] = useState([])
  const [isToastMsg, setIsToastMsg] = useState(false)
  const [isCleared, setIsCleared] = useState(false)
  const [pageData, setPageData] = useState(null)
  const [searchKey, setSearchKey] = useState("")
  const [searchBoxData, setSearchBoxData] = useState("")
  const [checkboxData, setCheckBoxData] = useState([])
  const [isAssociateClear, setIsAssociateClear] = useState(false)
  const [storeCheckValue, setStoreCheckValue] = useState(null)
  const [productSkuRequestObject, setProductSkuRequestObject] = useState(null)
  const [isAutoCompleteLoaderFlag, setIsAutoCompleteLoaderFlag] = useState(false)
  const [isDeleteConfrmBtndisabled, setIsDeleteConfrmBtndisabled] = useState(false)
  //Filter state
  const [filterCheck, setFilterCheck] = useState(false)
  const [pageDataReset, setPageDataReset] = useState(false)
  const [pageCheckCleared, setPageCheckCleared] = useState([])
  const [loading, setLoading] = useState(false)
  const [dropdownOptionList,setDropdownOptionList] = useState([])
  const [date,setDate] = useState(new Date())
  const [exportProductSkuIds, setExportProductSkuIds] = useState([])
  const [isExportProductSkuDisable, setIsExportProductSkuDisable] = useState(false)
  const [isProductSkuExportClicked, setIsProductSkuExportClicked] = useState(false)
  const [searchKeyChange, setSearchKeyChange] = useState("")
  const [productTypeStatus, setProductTypeStatus] = useState([])

  const hierarchyIdList = (data) => {
    let ids = []
    data.length > 0 &&
      data.map((obj) => {
        ids.push(obj.id)
      })
    return ids
  }

 
  let autoComplete = {
      optionClassName: "options",
      optionActiveClassName: "option-active",
      noOptionClassName: "no-options-dropdown",
      searchBoxPlaceholderClassName: "search-box-autocomplete",
      searchBarandIconClassName: "",
      searchBarBoxClassName: "search-bar-box search-bar-boxing",
      noOption: i18n.t("dataTableText.noOptions"),
    },
    autocompleteDropdown = (
      <Autocomplete
        options={SUGGESTION_OPTION}
        onSearch={(event) => onSearchBoxText(event)}
        placeholder={i18n.t("dataTableText.skuSearchBoxPlaceholder")}
        isCleared={isCleared}
        isLoader={isAutoCompleteLoaderFlag}
        autoComplete={autoComplete}
        onChangeValue={(e) => onChangeAutoComplete(e)}
      />
    )

  const {
    ProductSkuDetails: { ProductSkuContextValue, setProductSkuContextValue },
    // productSkuRedirection :{isproductSkuRedirection, setIsproductSkuRedirection},
    ProductSkuMethodName: {
      ProductMethodContextValue,
      setProductMethodContextValue,
    },
  } = useContext(HeaderContext)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    props.getOrganizationDetails(null, userDetails.organizationid)
    if(props.redirectType == undefined){
      setProductTypeStatus(statusTypeOfProudct)
    }else{
      setProductTypeStatus(statusTypeOfProudctSyndication)
    }
  }, [])

  const deleteProductSku = (status) => {
    let deleteRows
    if (onSelected && onSelected.length != null && status != "SINGLEDELETE") {
      deleteRows =
        onSelected &&
        onSelected.map((item) => {
          return item.id
        })
    } else if (checkboxData && checkboxData.length != null && status == "SINGLEDELETE") {
      deleteRows =
        checkboxData &&
        checkboxData.map((item) => {
          return item.id
        })
    }
    deleteApiRequestObject.deleteByIds = deleteRows
    props.deleteProductSkuData(deleteApiRequestObject)
    setIsDeleteConfrmBtndisabled(true)
    setLoading(true)
  }

  const prepareDeleteCount = () => {
    let selected = removeArrayObjectDuplicates(onSelected, 'content_desc')
    if (selected.length == 1 && selected != null && storeCheckValue != "SINGLEDELETE") {
      return selected != null && selected.length != 0
        ? ' " ' + selected[0].content_name + ' " ?'
        : null
    }
    if (selected != null && storeCheckValue != "SINGLEDELETE") {
      return " the selected " + selected.length + records
    }
    if (checkboxData != null && storeCheckValue == "SINGLEDELETE") {
      return checkboxData != null && checkboxData.length != 0
        ? ' " ' + checkboxData[0].content_name + ' " ?'
        : null
    }
  }

  useEffect(() => {
    const {productSkuNameSearchResult} = props
    if (
      productSkuNameSearchResult &&
      productSkuNameSearchResult.content &&
      productSkuNameSearchResult.content.data &&
      productSkuNameSearchResult.content.status == 200
    ) {
      setIsLoader(false)
      setExportProductSkuIds([])
      if (productSkuNameSearchResult.content.data.listOfValues && productSkuNameSearchResult.content.data.listOfValues.length > 0 && !isProductSkuExportClicked) {
        setIsExportProductSkuDisable(false)
        setExportProductSkuIds(productSkuNameSearchResult.content.data.listOfValues)
      } else {
        setIsExportProductSkuDisable(true)
      }
      productSkuGridData =
        productSkuNameSearchResult.content.data &&
          productSkuNameSearchResult.content.data.productSkuDTOList &&
          productSkuNameSearchResult.content.data.productSkuDTOList.length > 0 ?
          productSkuNameSearchResult.content.data.productSkuDTOList.map((productSku) => {
            const dataValue = {}
            Object.assign(dataValue, {
              id: productSku.id,
              gtin: productSku.uniqueIdentifier,
              productName: productSku.productName,
              productType: "IMAGE",
              productgroups_id: renderimage(productSku.mainImageUrl),
              productSkuDelisting : productSku.productStatus,
              isChecked: false,
            })
            return dataValue
          }) : []
      numberOfPage = productSkuNameSearchResult.content.data.productSkuDTOList &&
        productSkuNameSearchResult.content.data.productSkuDTOList.length
        ? productSkuNameSearchResult.content.data.productSkuDTOList[0].totalElement
        : 0
      // if (productSkuRequestObject.fromIndex != null && productSkuRequestObject.fromIndex > 0) {
      //   if (numberOfPage / 15 <= productSkuRequestObject.fromIndex / 15) {
      //     productSkuRequestObject.fromIndex = (pageData && pageData.page * 15) - 15
      //     props.productSkuNameSearch(productSkuRequestObject)
      //   }
      // }
      setTotalRecords(numberOfPage)
      setLoading(false)
      setIsLoader(false)
      setGridData(productSkuGridData)
    }
    if (
      productSkuNameSearchResult &&
      productSkuNameSearchResult.content &&
      productSkuNameSearchResult.content.data &&
      productSkuNameSearchResult.content.status != 200
    ) {
      SUGGESTION_OPTION = []
      setIsLoader(false)
      setIsLoader(false)
      setIsExportProductSkuDisable(true)
    }
  }, [props.productSkuNameSearchResult])

  useEffect(() => {
    const {
      deleteProductSkuDataResult,
    } = props
    productSkuDataResult(deleteProductSkuDataResult, DELETE)
  }, [props.deleteProductSkuDataResult])

  useEffect(() => {
    const {productSkuSearchResult} = props
    if (
      productSkuSearchResult &&
      productSkuSearchResult.content &&
      productSkuSearchResult.content.data &&
      productSkuSearchResult.content.status == 200
    ) {
      SUGGESTION_OPTION = []
      productSkuSearchResult.content.data &&
      productSkuSearchResult.content.data.productSkuDTOList &&
        productSkuSearchResult.content.data.productSkuDTOList.length > 0 &&
        productSkuSearchResult.content.data.productSkuDTOList.map((item) => {
          let productName = item.productName
          if (SUGGESTION_OPTION.indexOf(productName) === -1)
            SUGGESTION_OPTION.push(productName)
        })
      setIsAutoCompleteLoaderFlag(false)
      if (searchKeyChange == "") {
        SUGGESTION_OPTION = []
      }
    }
  }, [props.productSkuSearchResult])

  const onSortChange = (sortField, sortType) => {
    setIsSelectedRowCleared(false)
    setPageDataReset(true)
    // getProductSkuSearch.pageStart = pageData == null ? 0 : pageData.page
    // getProductSkuSearch.pageStart = 0
    // getProductSkuSearch.pageEnd = pageData == null ? 15 : pageData.rows
    // getProductSkuSearch.sortField = sortField
    // getProductSkuSearch.sortType = sortType
    // getProductSkuSearch.organizationId = userDetails.organizationid
    productSkuRequestObject.sortColumn = sortField
    productSkuRequestObject.sortOrder = sortType
    productSkuRequestObject.fromIndex = 0
    props.productSkuNameSearch(productSkuRequestObject)
  }

  const onChangeAutoComplete = (e) => {
    setIsCleared(false)
    // setSearchKey(e && e.trim())
    setSearchKeyChange(e && e.trim())
    setIsAutoCompleteLoaderFlag(true)
    if (e != "") {
      productSkuRequestObject.fromIndex = 0
      productSkuRequestObject.productName = e && e.trim().toLowerCase()
      props.productSkuSearch(productSkuRequestObject)
      SUGGESTION_OPTION = []
    }
  }

  /**
   * method use to search product sku after enter in the search text box
   * @param {*} event
   */
  const onSearchBoxText = (event) => {
    SUGGESTION_OPTION = []
    setIsAutoCompleteLoaderFlag(false)
    if (event != undefined) {
      // setSearchKey(event && event.trim())
      searchProductSku(event && event.trim())
    } else if (
      SUGGESTION_OPTION.length == 0 &&
      searchKey != "" &&
      event != undefined
    ) {
      setGridData([])
    } else {
      searchProductSku(searchKey)
    }
  }

  const searchProductSku = (searchKey) => {
    setSearchBoxData(searchKey)
    if (searchKey != ""){
      productSkuRequestObject.fromIndex = 0
      productSkuRequestObject.productName = searchKey ? searchKey.trim().toLowerCase() : ""
      props.productSkuNameSearch(productSkuRequestObject)
    }
    else{
      productSkuRequestObject.fromIndex = 0
      productSkuRequestObject.productName = ""
      props.productSkuNameSearch(productSkuRequestObject)
    }
    setIsLoader(false)
    setSearchBoxData(searchKey)
    setPageDataReset(true)
    setIsSelectedRowCleared(false)
  }

  const onPageChange = (pagedata) => {
    setLoading(true)
    setPageDataReset(false)
    setIsSelectedRowCleared(false)
    setPageData(pagedata)
    productSkuRequestObject.productName = searchBoxData ? searchBoxData.trim().toLowerCase() : "";
    productSkuRequestObject.fromIndex = pagedata.page * 15;
    productSkuRequestObject.size = pagedata.rows
    props.productSkuNameSearch(productSkuRequestObject)
  }

  const renderimage = (thumbnailImage) => {
    return (
      <img
        src={thumbnailImage == null ? PREVIEW : thumbnailImage}
        onError={(e) => (e.target.src = PREVIEW)}
        className="product-image"
        alt="No Image"
      />
    )
  }

  const productSkuDataResult = (result, type) => {
    if (result && result.content && result.content.status != 200) {
      setIsGridDialog(false)
      toastHeading = i18n.t("toastMessage.requestFailed")
      toastContent = i18n.t("toastMessage.requestFailedMessage")
      titleBackgroundColor = ERROR_BG_COLOR
      toastSize = MEDIUM
      setIsToastMsg(true)
      setLoading(false)
    }
    if (result && result.content && result.content.status == 200) {
      if (type == CREATE) {
        setIsGridDialog(false)
        props.productSkuNameSearch(productSkuRequestObject)
        toastHeading = i18n.t("toastMessage.createdToastHeading")
        toastContent = i18n.t("toastMessage.createdProductSkuContent")
        titleBackgroundColor = VALID_BG_COLOR
        toastSize = MEDIUM
        setIsToastMsg(true)
      }
      if (type == UPDATE) {
        setIsSelectedRowCleared(true)
        setIsGridDialog(false)
        props.productSkuNameSearch(productSkuRequestObject)
        toastHeading = i18n.t("toastMessage.updatedToastHeading")
        toastContent = i18n.t("toastMessage.updatedProductSkuContent")
        titleBackgroundColor = VALID_BG_COLOR
        toastSize = MEDIUM
        setIsToastMsg(true)
      }
      if (type == DELETE) {
        setTimeout(() => {          
        setIsDeleteConfrmBtndisabled(false)
        setIsDeleteRecordsDialog(false)
        setIsDisableDeleteButton(true)
        toastContent =
          onSelected.length > 1
            ? i18n.t("toastMessage.deletedProductSkuContentmultiple")
            : i18n.t("toastMessage.deletedProductSkuContentsignle")
        toastHeading = i18n.t("toastMessage.deleteProduct")
        titleBackgroundColor = VALID_BG_COLOR
        toastSize = MEDIUM
        setIsToastMsg(true)
        setOnSelected([])
        setPageCheckCleared([])
        setIsAssociateClear(true)
        setStoreCheckValue("")
        setCheckBoxData([])
        setIsSelectedRowCleared(true)
        setLoading(false)
        let numberOfPage = totalRecords - onSelected.length
        if (
          productSkuRequestObject.fromIndex != null &&
          productSkuRequestObject.fromIndex > 0
        ) {
          if (numberOfPage / 15 <= productSkuRequestObject.fromIndex / 15) {
            productSkuRequestObject.fromIndex =
              (pageData && pageData.page * 15) - (onSelected.length > 15 ? onSelected.length : 15) > 0
                ? (pageData && pageData.page * 15) - (onSelected.length > 15 ? onSelected.length : 15) : 0
            props.productSkuNameSearch(productSkuRequestObject)
          } else {
            props.productSkuNameSearch(productSkuRequestObject)
          }
        } else {
          props.productSkuNameSearch(productSkuRequestObject)
        }
        }, 4000);
            }
    }
  }

  const openDialog = (event, buttonName) => {
    if(authJson["7"].isEnabled){
    setIsGridDialog(true)
    if (buttonName == "UPDATE") {
      setProductSkuContextValue(JSON.stringify(event))
      // setIsproductSkuRedirection("")
      setProductMethodContextValue("UPDATE")
      // sethierarchyvalue(initialRequestCM)
    } else {
      setProductSkuContextValue("")
      // setIsproductSkuRedirection("")
      setProductMethodContextValue("CREATE")
    }
    const data = {
      key: "enhancedContent",
    }
    if(!props.redirectType){
    props.history.push("/enhancedContent")
    props.triggerPageLayout(data)
    }
    setClickEvent(event)
    }
  }

  const onHideMultipleDeleteDialog = () => {
    setStoreCheckValue("")
    setOnSelected([])
    setCheckBoxData([])
    setIsDeleteRecordsDialog(false)
  }
  const confirmDeleteSelected = () => {
    setIsDeleteRecordsDialog(true)
  }

  const selectedSingleRowDataTable = (selectedRow, status) => {
    if (selectedRow && selectedRow.length >= 1) {
      // deleteSingleProductSku(selectedRow)
      setIsDeleteRecordsDialog(true)
      setStoreCheckValue(status)
      setCheckBoxData(selectedRow)
    }
  }

  const selectedRowDataTable = (selectedRow) => {
    setIsDisableDeleteButton(false)
    if (selectedRow && selectedRow.length >= 1) {
      setIsDisableDeleteButton(false)
    } else {
      setIsDisableDeleteButton(true)
    }
    // setIsSelectedRowCleared(false)
    setOnSelected(selectedRow)
    props.selectedProducts && props.selectedProducts(selectedRow)
  }

  const initialRenderFilter = (data, status, enableOptionList) => {
    const {retainingData} = props
    retainingData.applyStatus = false
    if (status === "initial" || status === "reset" || status === "navigation") {
      setDate(new Date())
      setProductTypeStatus(statusTypeOfProudct)
      let request = getProductSkuSearch
      FilterIds = hierarchyIdList(initialRequestCM.subBrandList)
      request.ids = hierarchyIdList(initialRequestCM.subBrandList)
      request.organizationId = parseInt(userDetails.organizationid)
      request.pageStart = 0
      requestParams = {}
      requestParams.superCategoryList = getFilterDataValue.initialRequest.Cataglog_Management.superCategoryList
      requestParams.childSuperCategoryList = getFilterDataValue.initialRequest.Cataglog_Management.childSuperCategoryList
      requestParams.categoryList = getFilterDataValue.initialRequest.Cataglog_Management.categoryList
      requestParams.childCategoryList = getFilterDataValue.initialRequest.Cataglog_Management.childCategoryList
      requestParams.subCategoryList = getFilterDataValue.initialRequest.Cataglog_Management.subCategoryList
      requestParams.childSubCategoryList = getFilterDataValue.initialRequest.Cataglog_Management.childSubCategoryList
      requestParams.brandList = getFilterDataValue.initialRequest.Cataglog_Management.brandList
      requestParams.subFamilyList = getFilterDataValue.initialRequest.Cataglog_Management.subFamilyList
      requestParams.subBrandList = getFilterDataValue.initialRequest.Cataglog_Management.subBrandList
      requestParams.optionsList = enableOptionList
      setDropdownOptionList(enableOptionList)
      requestParams.organizationId = getFilterDataValue.organization.id
      requestParams.size = 15
      requestParams.fromIndex = 0
      requestParams.searchKey = ''
      requestParams.sortColumn = 'updated_date'
      requestParams.sortOrder = 'desc'
      requestParams.pimOrgId = userDetails.organizationid
      requestParams.productStatus = statusTypeOfProudct ? hierarchyIdList(statusTypeOfProudct) : []
      setProductSkuRequestObject(requestParams)
      requestParams.pimRetailerID= props.history.location.state?props.history.location.state.orgRetailerId?props.history.location.state.orgRetailerId:null:null
      // setSearchRequestObject(requestParams)
      props.productSkuNameSearch(requestParams, null)
      // props.productSkuNameSearch(request, null)
    }
  }

  const handleApplyFilter = (
    isRetailerStatus,
    applyStatus,
    commonReducerName,
    appliedData
  ) => {
    setFilterCheck(applyStatus)
    setIsLoader(true)
    setDate(new Date())
    if (commonReducerName&&commonReducerName != 'clear') {
      setIsCleared(true)
        setPageDataReset(true)
        requestParams = {}
        requestParams.superCategoryList = appliedData.superCategoryName
        requestParams.childSuperCategoryList = appliedData.childSuperCategoryName
        requestParams.categoryList = appliedData.categoryName
        requestParams.childCategoryList = appliedData.childCategoryName
        requestParams.subCategoryList = appliedData.subCategoryName
        requestParams.childSubCategoryList = appliedData.childSubCategoryName
        requestParams.brandList = appliedData.brandName
        requestParams.subFamilyList = appliedData.subFamilyName
        requestParams.subBrandList = appliedData.subBrandName
        requestParams.optionsList = dropdownOptionList
        requestParams.organizationId = getFilterDataValue.organization.id
        requestParams.size = 15
        requestParams.fromIndex = 0
        requestParams.searchKey = ''
        requestParams.sortColumn = 'updated_date'
        requestParams.sortOrder = 'desc'
        requestParams.pimOrgId = userDetails.organizationid
        setProductSkuRequestObject(requestParams)
        requestParams.pimRetailerID = props.history.location.state ? props.history.location.state.orgRetailerId ? props.history.location.state.orgRetailerId : null : null
        // setSearchRequestObject(requestParams)
        requestParams.productStatus = productTypeStatus ? hierarchyIdList(productTypeStatus) : []
        props.productSkuNameSearch(requestParams, null)
    }
  }

  const handleCloseFilter = (status) => {
    setFilterCheck(status)
  }

  const deleteAttrDialogue = (
    <React.Fragment>
      {/* <Button
        label={labelNo}
        // icon="pi pi-times"
        className="p-button-text custom-button cancel-button"
        onClick={() => onHideMultipleDeleteDialog()}
      />
      <Button
        label={labelYes}
        // icon="pi pi-check"
        disabled={isDeleteConfrmBtndisabled}
        className="p-button-text custom-button btn-yes"
        onClick={() => { deleteProductSku(storeCheckValue) }}
      /> */}
    </React.Fragment>
  )
  const buttonTemplate = () => {
    return (
      <React.Fragment>
        {/* <PimerceAuth
          componentId={"40"}
          componentType="button"
          component={
            // <Button
            //   label={"Add"}
            //   className="p-button-success btn-active-17 catalog-btn pimbtn p-mr-1"
            //   onClick={(event) => openDialog(event, "CREATE")}
            // >
            //   <Plusicon svgLeftSpace="10px" width="12px" height="12px"/>
            // </Button>
          }
        />
        <PimerceAuth
          componentId={"42"}
          componentType="button"
          component={
            // <Button
            //   label={"Delete"}
            //   className="p-button-danger btn-active-17  catalog-btn pimbtn"
            //   onClick={() => confirmDeleteSelected(DELETE)}
            //   disabled={isDisableDeleteButton}
            // >
            //   <Deleteicon svgLeftSpace="10px" width="12px" height="12px" />
            // </Button>
          }
        /> */}
        {/* <PimerceAuth
          componentId={"41"}
          componentType="button"
          component={
            <Button
              label={updateButtonLabel}
              // icon="fa fa-refresh fa-2x update-new-attr-type"
              // iconPos="right"
              className="p-button-danger pimbtn"
              onClick={(event) => openDialog(event, "UPDATE")}
              disabled={isDisableUpdateButton}
            >
              <Updateicon svgLeftSpace="20px" />
            </Button>
          }
        /> */}
      </React.Fragment>
    )
  }



  const buttonTemplateForSyndicate = () => {
    return (
      <React.Fragment>
            {/* <Button
              // label={deleteButtonLabel}
              className="p-button-danger btn-active-17  catalog-btn pimbtn"
              style={{ display: 'block' }}
              onClick={() => {
                props.productsSelected(exportProductSkuIds)
                // const data = {
                //   key:'readinessResults'
                // }
                // props.history.location.state = {
                //   retailerLogo:props.history.location.state.retailerLogo,
                //   retailerId:props.history.location.state.retailerId
                // }
                // props.history.push({pathname:"/readinessResults",state:{
                //   retailerLogo:props.history.location.state.retailerLogo,
                //   retailerId:props.history.location.state.retailerId
                // }})
                // props.triggerPageLayout(data)
              }}
              disabled={!exportProductSkuIds.length}
            >
             Validate Products
            </Button> */}
      </React.Fragment>
    )
  }


  const handleToastHide = () => {
    setIsToastMsg(false)
  }

  const setInstance = (e) => {
    stepWizard = e
  }

  const exportProductSku = () => {
    let productSkuIds = exportProductSkuIds
    if (onSelected && onSelected.length > 0) {
      productSkuIds = []
      onSelected.map((item) => {
        productSkuIds.push(item.id)
      })
    }
    let requestForExportProductSku = {
      ids: productSkuIds,
      organizationId: userDetails.organizationid,
      pimRetailerID:
        props.history.location.state
          ? props.history.location.state.orgRetailerId
            ? props.history.location.state.orgRetailerId
            : null
          : null
    }
    toastHeading = i18n.t("productSkulist.productDownloadHeaderContent")
    toastContent = i18n.t("productSkulist.productDownloadBodyContent")
    titleBackgroundColor = ERROR_BG_COLOR
    toastSize = MEDIUM
    setIsToastMsg(true)
    setIsExportProductSkuDisable(true)
    setIsProductSkuExportClicked(true)
    axios({
      url: `${COMMON_URL + PIM_API + '/productDownload'}`,
      method: "POST",
      data: requestForExportProductSku,
      responseType: "blob", // important
    }).then((exportResponse) => {
      setIsToastMsg(false)
      if (exportResponse && exportResponse.status != 200) {
        toastHeading = i18n.t("toastMessage.requestFailed")
        toastContent = i18n.t("toastMessage.requestFailedMessage")
        titleBackgroundColor = ERROR_BG_COLOR
        toastSize = MEDIUM
        setIsToastMsg(true)
        setIsExportProductSkuDisable(false)
        setIsProductSkuExportClicked(false)
      } else {
        const url = window.URL.createObjectURL(
          new Blob([exportResponse.data])
        )
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `Catalog Details ${moment(new Date()).format('DD-MM-YYYY')}.xlsx`) //or any other extension
        document.body.appendChild(link)
        link.click()
        setIsToastMsg(false)
        setIsExportProductSkuDisable(false)
        setIsProductSkuExportClicked(false)
      }
    })
    setOnSelected([])
  }

  const moreOptionsTemplate = () => {
    return (
      <>
        <div className="dataview-mulitsort mr-3 export-product-sku">
          <DropdownButton title={<img src={multiSelect} className="dataview-mulitsort-icon" />}>
            <div className="dataview-multisort-effect-attributes">
              {/* <Button
                type="button"
                label="Export Products"
                icon=""
                style={{ width: "max-content" }}
                className="p-button-icon asset-dataview btn-active-17 attr-pimbtn exportexcel"
                // onClick={() => { exportProductSku() }}
                disabled={isExportProductSkuDisable}
              /> */}
            </div>
          </DropdownButton>
        </div>
      </>
    )
  }

 const badgeTemplate = (status) => {
  const delistCheck =
  props.redirectType !== undefined
    ? status === DELIST || status === "DELISTED"
    : status === DELIST;
   return (
     <React.Fragment>
       {delistCheck ? (
         <div className="badge-container badge-flex-style">
           {/* <Tag value={status} severity={"danger"}/> */}
         </div>
       ) : null}
     </React.Fragment>
   )
 }

  const handleSelectChange = (e) =>{
    if(e.length > 0){
      setProductTypeStatus(e)
    }else{
      let defaultProductStatus = [];
      defaultProductStatus.push(statusTypeOfProudct[0])
      setProductTypeStatus(defaultProductStatus)
    }
  } 

  const additionalFilters = () =>{
    return(
      <>
      <div className="filter-dropdown-style">
      <p class="dropdownTitleStyle">{i18n.t("productSkulist.productStatus")}</p>
      <div class="" title={productTypeStatus} id="dropdownClose" data-id="productStatus">
            <SearchableDropdown
              value={productTypeStatus}                  
              options={props.redirectType != undefined ? statusTypeOfProudctSyndication : statusTypeOfProudct}
              isLoading={true}
              onChange={(e)=>{handleSelectChange(e)}}
              multiselect={true}
              placeholder={productTypeStatus.length < 0 ? "No Options" : "Loading..."}
              defalutSelectAll={true}
              defaultValuePassed={statusTypeOfProudct[0]}
              isFreeHandSelect={true}
              isMenuOptionLong={true}
            />
         <div class="filters-apply-button-col-border-style-right"></div>
      </div>
      </div>
      </>
    )
  }

  return (
    <div>
      {/* <Toast ref={toast} /> */}
      <ToastModal
        show={isToastMsg}
        title={toastHeading}
        titleBackgroundColor={titleBackgroundColor}
        content={toastContent}
        size={toastSize}
        onModalHide={handleToastHide}
      />
      {/* {!props.redirectType && <BackPageComponent props={props}/>} */}
      <div className={!props.redirectType ? "p-grid common-header-section" : "catalog-syndication-container"}>
        {!props.redirectType ? <h5 className="p-m-0 p-col-12 page-header"> <Catalog_Icon /> {"Catalog Management"} </h5> : null}
      </div>
      {/* 1 */}
      <Row className="m-0">
        <Col className="card pim-filter-component" xl={2} lg={2} md={2} sm={2} xs={2} style={{ marginTop: '-15px' }}>
          <React.Fragment>
 
            <FilterAndAppliedFilter
              latestScrapDate={date}
              handleApplyFilter={handleApplyFilter}
              appliedFilterHideDropdown={filterOptions.PIM_Manage_Catalog.applied_filter_hide_dropdown.split(
                ", "
              )
              }
              appliedFilterInitailLoadedValues={initialRequestCM}
              selectedValuesForFilter={{
                toDate: new Date(),
                fromDate: new Date(),
                retailerList: [],
                superCategoryList: [],
                childSuperCategoryList: [],
                categoryList: [],
                childCategoryList: [],
                subCategoryList: [],
                childSubCategoryList: [],
                brandList: [],
                subFamilyList: [],
                organizationId: getFilterDataValue && getFilterDataValue.organization ? getFilterDataValue.organization.id : ''
              }}
              initialRenderFilter={(data, status, enableOptionList) => {
                initialRenderFilter(data, status, enableOptionList)
              }}
              handleCloseFilter={handleCloseFilter}
              filterHideDropdown={filterOptions.PIM_Manage_Catalog.filter_hide_dropdown.split(
                ", "
              )
              }
              filterHideDropdownWithFunctionality={filterOptions.PIM_Manage_Catalog.filter_hide_dropdown_with_functionality.split(
                ", "
              )
              }
              isRetailerCardImagePresent={false}
              isFilterChecked={filterCheck}
              filterTarget={undefined}
              filterSingleSelectDropdown={filterOptions.PIM_Manage_Catalog.filter_single_select_dropdown.split(
                ", "
              )
              }
              moduleNameForFilter={'PIM Manage Catalog'}
            // isPreferredChildSuperCategoryForFilter={true}
            // isPreferredChildCategoryForFilter={true}
            // isPreferredBrandForFilter={true}
             additionalsearch={additionalFilters()}
            />

          </React.Fragment>
        </Col>
        {/* 1 */}
        <Col xl={10} lg={10} md={10} sm={10} xs={10} className="skulist grid-padding-size">
          {/* <PimerceDataView
            data={gridData}
            columns={dataViewColumn}
            totalRecords={totalRecords}
            removeHandCursor={props.removeHandCursor}
            handlePagination={onPageChange}
            onautoComplete={autocompleteDropdown}
            isCleared={isCleared}
            onSelectedRowDataTable={selectedRowDataTable}
            onDeletedRowDataTable={selectedSingleRowDataTable}
            isDeleteRecordsDialog={setIsDeleteRecordsDialog}
            updateProductSku={openDialog}
            isLoader={isLoader}
            isToolbar={true}  
            associtatedCheckData={setOnSelected}
            isHeaderButtonVisible={true}
            isMoreOptions={moreOptionsTemplate}
            layoutStyle={false}
            isHeaderSearch={true}
            isMultiSearch={true}
            isPaginator={true}
            isSelectedRowCleared={isSelectedRowCleared}
            setIsSelectedRowCleared={setIsSelectedRowCleared}
            isSingleSelectCheckbox={false}
            isCheckBoxEnabled={!authJson["7"].isEnabled ? false : true}
            isCardHoverCheckBoxEnabled={!authJson["7"].isEnabled ? false : true}
            isContentItemEnabled={true}
            isSorting={true}
            isZoomVisible={true}
            headerTitle={!authJson["7"].isEnabled ? "" : "Select All"}
            handleSorting={onSortChange}
            loading={loading}
            pageDataReset={pageDataReset}
            showTotalData={TOTALPRODUCTS}
            redirectedType={props.redirectType ? buttonTemplateForSyndicate : buttonTemplate}
            isRenderTagItem={true}
            redirectRenderTagItem={badgeTemplate}
            // headerButtonsGrb={props.redirectType?[]:headerButtonGroup}
            isCardToolEnabled={props.redirectType ? false : true}
            exportCallback={(e, i) => {
              if (onSelected && onSelected.length) {
                props.getAllRetailerData({ orgId: userDetails.organizationid })
              }
              // setIsShowCloneOverlay(true)
            }}
            // css flag
            imageStyle={false}
            imgContainerwidth={false}
            isBoxSizing={false}
            // props for dataview content 
            // contentName={PRODUCTNAME}
            contentDesc={GTIN}
          /> */}
        </Col>
      </Row>

      <ModalComponent
        isShowModal={isDeleteRecordsDialog}
        onHideModal={onHideMultipleDeleteDialog}
        modalTitle={i18n.t("productSkuPopupHeaders.deleteProductSku")}
        modalContent={
          <div className="confirmation-content">
            <i className="exclamation-triangle" style={{ fontSize: "2rem" }} />
            <span>
              {onSelected != null && onSelected.length > 1
                ? deleteMessage
                : i18n.t("deleteRecord")}
              {prepareDeleteCount()}
            </span>
          </div>
        }
        modalSize="md"
        modalDailogClassName="modalDailogContent smallDialog"
        modalFooter={deleteAttrDialogue}
      />

    </div>
  )
}

export default connect(mapStateToProps)(Skulist)
