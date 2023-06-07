import React, { useEffect, useState ,useContext} from "react"
import { connect } from "react-redux"
import { Row, Col, Card, Spinner, Popover, ProgressBar } from "react-bootstrap";
import PieChart from "../../../piechart-component/piechart-component";
import DashboardJson from '../../dashboard/dasboard-mockJSON.json'
import PimerceDataTable from "../../../data-table/data-table"
import {
  EXPORT_EXCEL_URL,
  PIM_API,
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
  ATTR_TYPE,
  ATTR_NAME,
  ATTR_GRP_NAME,
  ATTR_DESCRIPTION,
  ERROR_DROPDOWN_CLASSNAME,
  GROUP,
  GROUPED,
  VALUE_COLOR_ATTRIBUTE
} from "../../../../common/common-constants"
import i18n from "../../../../translate/i18n"
import ModalComponent from "../../../modal/index"
import {
  getApiRequestObject,
  getAttributeGroupObject,
  deleteApiRequestObject,
  exportApiRequestObject,
  mockDataForPublish,
  stepList,
  publishResultTabMenu,
} from "../../../../common/master-data"
import "./style.scss"
import axios from "axios"
import HeaderContext from "../../../../common/header-context"
import { Toolbar } from "primereact/toolbar"
import { COMMON_URL } from "../../../../common/common-api-constants"
import ToastModal from "../../../modal/ToastModal"
import { updateApiRequestObject } from "../../../../common/master-data"
import { ErrorMessage, Field, Formik } from "formik"
import { Form } from "react-bootstrap"
import { ERROR_FIELD_CLASSNAME } from "../../../../common/common-constants"
import Select from "react-select"
import Autocomplete from "@pixmonks/auto-complete"
import {
  SELECT_COLOR,
  FOCUS_COLOR,
  DROPDOWN_FONTSIZE,
  DROPDOWN_BORDERADIUS,
  BACKGROUND_COLOR,
  BORDER_STYLE,
  VALUE_COLOR,
  TEXTBOX_BOX_SHADOW
} from "../../../../common/common-constants"
import Nav from "../../importdata/nav";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import EventSource from "eventsource";
import { TabMenu } from 'primereact/tabmenu'; 
// import Backpagecomponent from "../../../back-page-component/back-page-component";
import PublishResultIcon from "../../../../common/icons/publishResulticon";

let numberOfPage,
  element,
  attributeGridData = [],
  attributeSearchGridData = [],
  gridColumn = [
    {
      field: "attrGrpName",
      header: "",
      filter: false,
      sortable: false,
      width:"150px"
    },
    {
      field: "attrName",
      header: "Product Line",
      filter: false,
      sortable: false,
      width:"20%"
    },
    {
      field: "attrType",
      header: "Brand",
      sortable: false,
      width:"15%"
    },
    // {
    //   field: "attrDescription",
    //   header: "Product Id",
    //   sortable: false,
    // },
    {
      field: "attrDescription1",
      header: "Product Name",
      sortable: false,
      width:"20%"
    },
    {
      field:"uniqueIdentifier",
      header:"Unique Identifier",
      sortable:false,
      width:"15%"
    },
    {
      field: "attrDescription2",
      header: "Result",
      sortable: false,
      width:"10%"
    },
    {
      field:"editIcons",
      header: "",
      sortable: false,
      width:"155px"
    }
  ],
  toastHeading,
  toastContent,
  titleBackgroundColor,
  toastSize,setFieldsValue,
  headerButtonGroup = [
    {
      authId: "10",
      ButtonName: "",
      class: "exportexcel",
      type: "attributes",
      iconpos: "right",
    },
  ],
  deleteMessage = i18n.t("attributeDialogText.deleteMessage"),
  record = i18n.t("attributeDialogText.record"),
  records = i18n.t("attributeDialogText.records"),
  deleteButtonLabel = i18n.t("attributeDialogText.deleteButtonLabel"),
  gridHeader = i18n.t("attribute.gridtitle"),
  popupHeader = i18n.t("attribute.dialogtitle"),
  labelNo = i18n.t("datatable.no"),
  labelYes = i18n.t("datatable.yes"),
  autoComplete = {
    optionClassName: "options",
    optionActiveClassName: "option-active",
    noOptionClassName: "no-options-dropdown",
    searchBoxPlaceholderClassName: "attr-search-box-autocomplete",
    searchBarandIconClassName: "",
    searchBarBoxClassName: "search-bar-box search-bar-boxing",
    noOption: i18n.t("dataTableText.noOptions"),
  },
  progressValue

const mapStateToProps = (state) => {
  return {
    getUserDetail: state.userDetail.getUsersObj.userCredentials
  }
}




function PublishSku(props) {
  // let retailerLogo = props.history.location.state.retailerLogo
  const { getUserDetail } = props
  let authJson = JSON.parse(sessionStorage.getItem("authJson"))
  let userDetails = getUserDetail
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const [createGridData, setCreateGridData] = useState([])
  const [isSearchString, setIsSearchString] = useState(false)
  const [isLoader, setIsLoader] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  const [isSelectedRowCleared, setIsSelectedRowCleared] = useState(false)
  const [attributeTypeData, setAttributeTypeData] = useState()
  const [attrGrpDataObj, setAttrGrpDataObj] = useState([])
  const [isGridDialog, setIsGridDialog] = useState(false)
  const [isDeleteRecordsDialog, setIsDeleteRecordsDialog] = useState(false)
  const [clickEvent, setClickEvent] = useState("")
  const [isDisableUpdateButton, setIsDisableUpdateButton] = useState(true)
  const [isDisableDeleteButton, setIsDisableDeleteButton] = useState(true)
  const [onSelected, setOnSelected] = useState(null)
  const [isToastMsg, setIsToastMsg] = useState(false)
  const [validationError, setValidationError] = useState({})
  const [isGridCheckBox, setIsGridCheckBox] = useState(false)
  const [pageDataReset, setPageDataReset] = useState(false);
  const [isCleared, setIsCleared] = useState(false)
  const [searchResult, setSearchResult] = useState([])
  const [searchKey, setSearchKey] = useState("")
  const [pageData, setPageData] = useState(null)
  const [pieChartSeries,setPieChartSeries] = useState([0,0])
  const [modalGridData, setModalGridData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [retailerLogo,setRetailerLogo] = useState(null)
  const [retailerCategory,setRetailerCategory] = useState(null)
  const [orgRetailerId,setorgRetailerId] = useState(null)
  const [retailerId,setretailerId] = useState(null)
  const [retailerCategoryId,setretailerCategoryId] = useState(null)
  const [guiId,setGuiId] = useState(null)
  const [productIds,setProductIds] = useState([])
  const [isValidateModal,setIsvalidateModal] = useState(false)
  const [orgRetailerName,setOrgRetailerName] = useState("")
  const [updateGridData, setUpdateGridData] = useState([])
  const [delsitGridData, setDelistGridData] = useState([])
  // TabMenu Props  
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    ProductSkuDetails: { ProductSkuContextValue, setProductSkuContextValue },
    // productSkuRedirection :{isproductSkuRedirection, setIsproductSkuRedirection},
    ProductSkuMethodName: {
      ProductMethodContextValue,
      setProductMethodContextValue,
    },
  } = useContext(HeaderContext)

  let autocompleteDropdown = (
    <Autocomplete
      options={searchResult}
      onSearch={(event) => onSearchBoxText(event)}
      placeholder={i18n.t("dataTableText.skuSearchBoxPlaceholderAttr")}
      isCleared={isCleared}
      autoComplete={autoComplete}
      onChangeValue={(e) => onChangeAutoComplete(e)}
    />
  )

  const addAttribute = () => {
    return (
      <>
        {/* <AttributeForm
            hideDialog={hideDialog}
            event={CREATE}
            insertAttributeData={props.insertAttributeData}
            attributeTypeData={attributeTypeData}
          /> */}
      </>
    )
  }

  const groupAttribute = () => {
    return (
      <>
        {/* <UpdateAttributeGroup
            hideDialog={hideDialog}
            attrGrpDataObj={attrGrpDataObj}
            attributeData={onSelected}
            changeAttrGroup={changeAttrGroup}
            event={GROUP}
          /> */}
      </>
    )
  }

  const deleteAttribute = () => {
    if (onSelected != null) {
      const deleteRows = onSelected.map((item) => {
        return item.id
      })
      deleteApiRequestObject.deleteByIds = deleteRows
      props.deleteAttributeData(deleteApiRequestObject)
    }
  }

  const prepareDeleteCount = () => {
    if (onSelected != null && onSelected.length > 1) {
      return onSelected.length + records
    }
    return onSelected != null && onSelected.length != 0 ? ' " ' + onSelected[0].attrName + ' " ?' : null
  }

  const renderImage = (img) => {
    return (
      <img src={img} width="85px" height="59px" />
    )
  }

  const renderResult = (result, issues) => {
    let element;
    if (result == "SUCCESS") {
      element = <span style={{ color: '#7ede21' }}>{result}</span>;
    } else {
      element = <span onClick={() => { rowColumnClick(issues) }} style={{ color: '#fa042d', textDecoration: 'underline', cursor: 'pointer' }}>{result}</span>;
    }
    return (
      element
      // <p style={{ color: '#0E90E1', cursor: 'pointer' }} onClick={() => {
      //   const data = {
      //     key: 'skulist'
      //   }
      //   this.props.history.push('/skulist')
      //   this.props.triggerPageLayout(data)
      // }}>{result}</p>
    )
  }

  const confirmHome = (event) => {
    const data = {
      key: "retailerList",
    }
    props.history.push("/retailerList")
    props.triggerPageLayout(data)
    setClickEvent(event)
  }

  const editProduct = (rowData) => {
    let value = []
    value.push(rowData)
    setProductSkuContextValue(JSON.stringify(value))
      setProductMethodContextValue("UPDATE")
      const data = {
        key: "enhancedContent",
      }
      props.history.location.state = {
        retailerId:orgRetailerId,
        guid: guiId,
        path:"publishResults",
        retailerName:orgRetailerName
      }
      props.history.push({
        pathname: "/enhancedContent", state: {
          retailerId:orgRetailerId,
          guid: guiId,
          path:"publishResults",
          retailerName:orgRetailerName
        }
      })
    props.triggerPageLayout(data)
    //setClickEvent(event)
}

// const confirmDeleteProduct = (product) => {
//     setProduct(product);
//     setDeleteProductDialog(true);
// }

  const actionBodyTemplate = (rowData) => {
    return (
        <div className="publishResult">
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success pim-edit-btns mr-2" onClick={() => editProduct(rowData)} />
            {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning pim-edit-btns" onClick={() => confirmDeleteProduct(rowData)} /> */}
        </div>
    );
}

const onTabsChange = (e) =>{
  setActiveIndex(e.index)
}

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  useEffect(() => {
    let guid = props.history.location.state.guid
    props.getPublishedHistoryByGuid(null,guid)
  }, [])

  useEffect(()=>{
    const {getPublishedHistoryByGuidResult} = props
    if(getPublishedHistoryByGuidResult&&
      getPublishedHistoryByGuidResult.content&&
      getPublishedHistoryByGuidResult.content.status==200&&
      getPublishedHistoryByGuidResult.content.data){
        let total = getPublishedHistoryByGuidResult.content.data.totalSKUs
        let passed = (getPublishedHistoryByGuidResult.content.data.passedSKUs/total)*100
        let failed = (getPublishedHistoryByGuidResult.content.data.failedSKUs/total)*100
        let series = []
        series.push(passed)
        series.push(failed)
        setOrgRetailerName(getPublishedHistoryByGuidResult.content.data.retailerName)
        setretailerCategoryId(getPublishedHistoryByGuidResult.content.data.retailerCategoryId)
        setretailerId(getPublishedHistoryByGuidResult.content.data.retailerId)
        setorgRetailerId(getPublishedHistoryByGuidResult.content.data.orgRetailerId)
        setRetailerLogo(getPublishedHistoryByGuidResult.content.data.retailerLogo)
        setGuiId(getPublishedHistoryByGuidResult.content.data.guid)
        setRetailerCategory(getPublishedHistoryByGuidResult.content.data.retailerCategory)
        setPieChartSeries(series)
        props.getPublishDetailsByHistory(null,getPublishedHistoryByGuidResult.content.data.id)
      }
  },[props.getPublishedHistoryByGuidResult])

  useEffect(()=>{
    const {getPublishDetailsByHistoryResult} = props
    if(getPublishDetailsByHistoryResult&&
      getPublishDetailsByHistoryResult.content&&
      getPublishDetailsByHistoryResult.content.status==200&&
      getPublishDetailsByHistoryResult.content.data){
        let createData = []
        let updateData = []
        let delistData = []
        let ids = []
        getPublishDetailsByHistoryResult.content.data.map((i)=>{
          let value = {
            id: i.id,
                attrGrpName: renderImage(i.thumbnail),
                attrName: i.category,
                attrType: i.brand,
                attrDescription: i.attrDescription,
                attrDescription1: i.name,
                issues:i.issues,
                uniqueIdentifier:i.uniqueIdentifier,
                attrDescription2: renderResult(i.status,i.issues),
                editIcons: i.isDelete=="true"?"(Product is deleted)":i.status== "SUCCESS"?null:authJson["46"].isEnabled?actionBodyTemplate(i):null
          }
          if (i.mode == "CREATE") {
            createData.push(value)
          } else if (i.mode == "UPDATE") {
            updateData.push(value)
          } else if (i.mode == "DELIST") {
            delistData.push(value)
          }
          if (i.status != "SUCCESS") {
            if (i.isDelete == "false") {
              ids.push(i.id)
            }
          }
        })
        if(createData.length>0){
          setActiveIndex(0)
        }else if(updateData.length>0){
          setActiveIndex(1)
        }else if(delistData.length>0){
          setActiveIndex(2)
        }
        setProductIds(ids)
        setCreateGridData(createData)
        setUpdateGridData(updateData)
        setDelistGridData(delistData)
        setIsLoader(false)
      }

  },[props.getPublishDetailsByHistoryResult])

  const rowColumnClick = (issues) => {

    let data = []
    issues.map((i) => {
      let value = {
        issues: i
      }
      data.push(value)
    })
    setModalGridData(data)
    setIsModalOpen(true)
  }

  useEffect(() => {
    const {
      insertAttributeDataResult,
      updateAttributeDataResult,
      deleteAttributeDataResult,
      getManageAttributeResult,
      getAttributeGroupDataResult,
      updateAttributeGroupResult,
    } = props
    attributeDataResult(getManageAttributeResult)
    attributeDataResult(insertAttributeDataResult, CREATE)
    attributeDataResult(updateAttributeDataResult, UPDATE)
    attributeDataResult(deleteAttributeDataResult, DELETE)
    attributeDataResult(updateAttributeGroupResult, GROUPED)
    if (
      getManageAttributeResult &&
      getManageAttributeResult.content &&
      getManageAttributeResult.content.data
    ) {
      setIsLoader(false)
      if (
        getManageAttributeResult &&
        getManageAttributeResult.content &&
        getManageAttributeResult.content.data &&
        getManageAttributeResult.content.data.attributes
      ) {
        attributeGridData =
          mockDataForPublish.map((item) => {
            const dataValue = {}
            Object.assign(dataValue, {
              id: item.id,
              attrGrpName: renderImage(item.attrGrpName),
              attrName: item.attrName,
              attrType: item.attrType,
              attrDescription: item.attrDescription,
              attrDescription1: item.attrDescription1,
              attrDescription2: renderResult(item.attrDescription2),
              version: item.version,
              attrGrpId: item.attrGrpId,
              organizationId: item.organizationId,
              isMandatory: item.isMandatory,
              editIcons:i.status== "SUCCESS"?null:actionBodyTemplate(i)
            })
            return dataValue
          })
      }
      numberOfPage = getManageAttributeResult.content.data.totalElement
      if (getApiRequestObject.pageStart != null) {
        if (numberOfPage / 10 <= getApiRequestObject.pageStart) {
          getApiRequestObject.pageStart = getApiRequestObject.pageStart - 1
          props.getManageAttribute(getApiRequestObject)
        }
      }
      setCreateGridData(attributeGridData)
      setTotalRecords(numberOfPage)
    }

    if (
      getAttributeGroupDataResult &&
      getAttributeGroupDataResult.content &&
      getAttributeGroupDataResult.content.data &&
      getAttributeGroupDataResult.content.data.attributeGroups
    ) {
      let AttributeGroupData =
        getAttributeGroupDataResult.content.data.attributeGroups.map((item) => {
          let value = {
            id: item.id,
            name: item.attrGrpName,
            value: item.id,
            label: item.attrGrpName,
          }
          return value
        })

      setAttrGrpDataObj(AttributeGroupData)
    }
  }, [props])

  useEffect(() => {
    if (
      props.searchAttributeGroupResult &&
      props.searchAttributeGroupResult.content &&
      props.searchAttributeGroupResult.content.status == "200"
    ) {
      let suggestionOption = []
      props.searchAttributeGroupResult &&
        props.searchAttributeGroupResult.content &&
        props.searchAttributeGroupResult.content.data.attributes.map((i) => {
          if (suggestionOption.indexOf(i.attrName) === -1) {
            suggestionOption.push(i.attrName)
          }
        })
      setSearchResult(suggestionOption)
    }
  }, [props.searchAttributeGroupResult])

  useEffect(() => {
    if (
      props.searchGridAttributeGroupResult &&
      props.searchGridAttributeGroupResult.content &&
      props.searchGridAttributeGroupResult.content.status == "200"
    ) {
      setIsLoader(false)
      if (
        props.searchGridAttributeGroupResult &&
        props.searchGridAttributeGroupResult &&
        props.searchGridAttributeGroupResult.content.data &&
        props.searchGridAttributeGroupResult.content.data.attributes
      ) {
        // props.searchGridAttributeGroupResult.content.data.attributes = mockDataForPublish
        attributeSearchGridData =
          mockDataForPublish.map(
            (item) => {
              const dataValue = {}
              Object.assign(dataValue, {
                id: item.id,
                attrGrpName: item.attrGrpName,
                attrName: item.attrName,
                attrType: item.attrType,
                attrDescription: item.attrDescription,
                version: item.version,
                attrGrpId: item.attrGrpId,
                organizationId: item.organizationId,
                isMandatory: item.isMandatory,
                editIcons:actionBodyTemplate(item)
              })
              return dataValue
            }
          )
      }
      numberOfPage = props.searchGridAttributeGroupResult.content.data.totalElement
      setCreateGridData(attributeSearchGridData)
      setTotalRecords(numberOfPage)
    }
  }, [props.searchGridAttributeGroupResult])

  const onPageChange = (pagedata) => {
    setPageData(pagedata)
    setPageDataReset(false)
    getApiRequestObject.pageStart = pagedata.page
    getApiRequestObject.pageEnd = 10
    getApiRequestObject.organizationId = userDetails.organizationid
    getApiRequestObject.sortField = "attrName"
    // getApiRequestObject.sortType = "ASC"
    if (searchKey == "") {
      props.getManageAttribute(getApiRequestObject)
    }
    else {
      getApiRequestObject.sortField = "attr_name"
      props.searchGridAttributeGroup(getApiRequestObject)
    }
  }

  const revalidateProducts = () => {
    let url = COMMON_URL + "api/progress"
    let eventSourceInitDict = { headers: { 'Authorization': `${userDetails.token_value.Authorization}` } }
    const eventSource = new EventSource(url, eventSourceInitDict)
    
    let request = {
      "orgId": userDetails.organizationid,
      "orgRetailerId":orgRetailerId,
      "retailerId": retailerId,
      "productsList": productIds,
      "passedSkus":[],
      "retailerCategoryId":retailerCategoryId,
      "timezone" : Intl.DateTimeFormat().resolvedOptions().timeZone
  }
    eventSource.onerror = (e) => {
      eventSource.close()
    }
    let guidValue = null
    setIsvalidateModal(true)
    // eventSource.
    eventSource.addEventListener("GUI_ID", (event) => {
      guidValue = JSON.parse(event.data)
      request.guid = guidValue
      progressValue = 1
      setFieldsValue("progressPercentage",1)
      eventSource.addEventListener(guidValue, (event) => {
        const result = JSON.parse(event.data)
        // if (progressPercentage - 5 !== result) {
        //   setProgressPercentage(((result + 5) / 105) * 100)
        // }
        if (progressValue -1 !== result.uploadPercentage){
          let percentage = ((result.uploadPercentage + 1) / 101) * 100
          progressValue = percentage
          setFieldsValue("progressPercentage",percentage)
        }
        
        if (result.uploadPercentage == 100) {
          eventSource.close()
        }
      })
      axios({
        url: `${COMMON_URL + PIM_API + "/product-validation"}`,
        method: "POST",
        data: request // important
      }).then((response) => {
        eventSource.removeEventListener('GUI_ID')
        eventSource.removeEventListener(guidValue)
        eventSource.close()
        fileImportResultProcess(response,"readiness",guidValue)
        setFieldsValue("progressPercentage",0)
        stepWizard.goToStep(2)
      })
      // props.postImportedFile(fileRequest)
    })
  }

  const fileImportResultProcess = (response,type,guid) =>{
    if(response&&
      response.status==200){
        
          const data = {
              key:'readinessResults'
            }
            props.history.location.state = {
              // retailerLogo:props.history.location.state.retailerLogo,
              // retailerId:props.history.location.state.retailerId,
              // orgRetailerId:orgRetailerId,
              guid:guid,
              // retailerCategoryId:retailerCategoryId,
              // retailerCategory:props.history.location.state.retailerCategory
            }
            props.history.push({pathname:"/readinessResults",state:{
              // retailerLogo:props.history.location.state.retailerLogo,
              // retailerId:props.history.location.state.retailerId,
              // orgRetailerId:orgRetailerId,
              guid:guid,
              // retailerCategoryId:retailerCategoryId,
              // retailerCategory:props.history.location.state.retailerCategory
            }})
            props.triggerPageLayout(data)
        setFieldsValue("isProgressFailed",false)
        setFieldsValue("successUrl",response.data.successReportUrl)
        setFieldsValue("errorUrl",response.data.errorReportUrl)
        setFieldsValue("passPercentage",response.data.successPercentage)
        setFieldsValue("failPercentage",response.data.failurePercentage)
        setFieldsValue("processedSkus",response.data.processedSkus)
        // processedSkus = response.data.processedSkus
        
      }else if(response&&
        response.status!=200){          
          setFieldsValue("isProgressFailed",true)
        }
  }

  const onSortChange = (sortdata) => {
    // setIsCleared(true)
    setPageDataReset(true)
    getApiRequestObject.pageStart = 0
    getApiRequestObject.pageEnd = 10
    getApiRequestObject.sortField = sortdata.multiSortMeta[0].field
    getApiRequestObject.sortType = sortdata.multiSortMeta[0].order == -1 ? "ASC" : "DESC"
    getApiRequestObject.organizationId = userDetails.organizationid
    if (searchKey == "") {
      props.getManageAttribute(getApiRequestObject)
    }
    else {
      getApiRequestObject.sortField = "attr_name"
      props.searchGridAttributeGroup(getApiRequestObject)
    }
  }

  const onChangeAutoComplete = (e) => {
    setPageDataReset(false)
    getApiRequestObject.pageStart = 0
    getApiRequestObject.pageEnd = 10
    getApiRequestObject.organizationId = userDetails.organizationid
    getApiRequestObject.attrName = e && e.trim().toLowerCase()
    getApiRequestObject.sortField = "attr_name"
    getApiRequestObject.sortType = "ASC"
    props.searchAttributeGroup(getApiRequestObject)
  }

  const onSearchBoxText = (event) => {
    setPageDataReset(true)
    setSearchKey(event)
    getApiRequestObject.pageStart = 0
    getApiRequestObject.pageEnd = 10
    getApiRequestObject.organizationId = userDetails.organizationid
    getApiRequestObject.attrName = event && event.trim().toLowerCase()
    props.searchGridAttributeGroup(getApiRequestObject)
  }

  const attributeDataResult = (result, type) => {
    if (result && result.content && result.content.status != 200) {
      if (type == DELETE || type == GROUPED) {
        setIsGridDialog(false)
        toastHeading = i18n.t("toastMessage.requestFailed")
        toastContent = (result.content && result.content.data && result.content.data.description) ? result.content.data.description : i18n.t("toastMessage.requestFailedMessage")
        titleBackgroundColor = ERROR_BG_COLOR
        toastSize = MEDIUM
        setIsDeleteRecordsDialog(false)
        setIsSelectedRowCleared(true)
        setIsToastMsg(true)
      }
      else {
        setIsGridDialog(false)
        toastHeading = i18n.t("toastMessage.requestFailed")
        toastContent = i18n.t("toastMessage.requestFailedMessage")
        titleBackgroundColor = ERROR_BG_COLOR
        toastSize = MEDIUM
        setIsToastMsg(true)
      }

    }
    if (result && result.content && result.content.status == 200) {
      if (type == CREATE) {
        setIsGridDialog(false)
        setIsLoader(true)
        setPageDataReset(true)
        getApiRequestObject.pageStart = 0
        props.getManageAttribute(getApiRequestObject)
        toastHeading = i18n.t("toastMessage.createdToastHeading")
        toastContent = i18n.t("toastMessage.createdAttrContent")
        titleBackgroundColor = VALID_BG_COLOR
        toastSize = MEDIUM
        setIsToastMsg(true)
      }
      if (type == UPDATE) {
        setIsSelectedRowCleared(true)
        setIsGridDialog(false)
        if (searchKey == "") {
          getApiRequestObject.sortField = "attrName"
          props.getManageAttribute(getApiRequestObject)
        }
        else {
          getApiRequestObject.sortField = "attr_name"
          props.searchGridAttributeGroup(getApiRequestObject)
        }
        toastHeading = i18n.t("toastMessage.updatedToastHeading")
        toastContent = i18n.t("toastMessage.updatedAttrContent")
        titleBackgroundColor = VALID_BG_COLOR
        toastSize = MEDIUM
        setIsToastMsg(true)
      }
      if (type == GROUPED) {
        setIsSelectedRowCleared(true)
        setIsGridDialog(false)
        if (searchKey == "") {
          getApiRequestObject.sortField = "attrName"
          props.getManageAttribute(getApiRequestObject)
        }
        else {
          getApiRequestObject.sortField = "attr_name"
          props.searchGridAttributeGroup(getApiRequestObject)
        }
        toastHeading = i18n.t("toastMessage.updatedToastHeading")
        toastContent = result.content.data
        titleBackgroundColor = VALID_BG_COLOR
        toastSize = MEDIUM
        setIsToastMsg(true)
      }
      if (type == DELETE) {
        setIsSelectedRowCleared(true)
        setIsDeleteRecordsDialog(false)
        if (searchKey == "") {
          getApiRequestObject.sortField = "attrName"
          props.getManageAttribute(getApiRequestObject)
        }
        else {
          getApiRequestObject.sortField = "attr_name"
          props.searchGridAttributeGroup(getApiRequestObject)
        }
        toastHeading = i18n.t("toastMessage.deleteStatus")
        toastContent = result.content.data
        titleBackgroundColor = VALID_BG_COLOR
        toastSize = MEDIUM
        setIsToastMsg(true)
      }
    } else if (result && result.content && result.content.data.code == 101) {
      toastHeading = i18n.t("toastMessage.requestFailed")
      toastContent = result.content.data.description
      titleBackgroundColor = ERROR_BG_COLOR
      toastSize = MEDIUM
      setIsToastMsg(true)
    }
  }

  const exportTrigger = (data, field) => {
    exportApiRequestObject.ids = data
    exportApiRequestObject.organizationId = userDetails.organizationid
    if (field == "excel" && createGridData && createGridData.length > 0) {
      axios({
        url: `${COMMON_URL + PIM_API + EXPORT_EXCEL_URL}`,
        method: "POST",
        data: exportApiRequestObject,
        responseType: "blob", // important
      }).then((exportResponse) => {
        if (exportResponse && exportResponse.status != 200) {
          toastHeading = i18n.t("toastMessage.requestFailed")
          toastContent = i18n.t("toastMessage.requestFailedMessage")
          titleBackgroundColor = ERROR_BG_COLOR
          toastSize = MEDIUM
          setIsToastMsg(true)
        } else {
          const url = window.URL.createObjectURL(
            new Blob([exportResponse.data])
          )
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", "Attributes.xlsx") //or any other extension
          document.body.appendChild(link)
          link.click()
        }
      })
    }
  }

  const onSearchable = (value, check) => {
    setIsSearchString(value)
  }

  const openDialog = (event) => {
    setIsGridDialog(true)
    setClickEvent(event)
  }

  const hideDialog = () => {
    setIsGridDialog(false)
  }

  const changeAttrGroup = (groupId) => {
    if (onSelected.length && groupId) {
      let attributeGroupData = onSelected.map((item) => {
        let attrGroupName = item
        attrGroupName.attrGrpId = groupId
        attrGroupName.timeZone = timeZone
        attrGroupName.organizationId = userDetails.organizationid
        return attrGroupName
      })
      props.updateAttributeGroup({ attributes: attributeGroupData })
    }
  }

  const onHideMultipleDeleteDialog = () => {
    setIsDeleteRecordsDialog(false)
  }

  const confirmDeleteSelected = () => {
    setIsDeleteRecordsDialog(true)
  }

  const selectedRowDataTable = (selectedRow) => {
    if (selectedRow && selectedRow.length >= 1) {
      setIsDisableUpdateButton(true)
      setIsDisableDeleteButton(false)
    } else {
      setIsDisableUpdateButton(true)
      setIsDisableDeleteButton(true)
    }
    if (selectedRow && selectedRow.length == 1) {
      setIsDisableUpdateButton(false)
    }
    setIsSelectedRowCleared(false)
    setOnSelected(selectedRow)
  }

  const optionStyles = {
    option: (styles, { isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
          ? SELECT_COLOR
          : isFocused
            ? FOCUS_COLOR
            : undefined,
      cursor: "pointer",
      fontSize: DROPDOWN_FONTSIZE,
      fontFamily: "Barlow-Regular",
      outline: "none !important",
      border: "none !important",
    }),
    control: (base, { isDisabled }) => ({
      ...base,
      borderRadius: DROPDOWN_BORDERADIUS,
      boxShadow: TEXTBOX_BOX_SHADOW,
      border: BORDER_STYLE,
      backgroundColor: BACKGROUND_COLOR,
      width: "180px",
      height: "40px",
      cursor: isDisabled ? "no-drop" : "pointer",
      alignItem: "center",
      position: "relative",
      borderStyle: "solid",
      display: "flex",
      justifyContent: "space-between",
      boxSizing: "border-box",
    }),
    singleValue: (base) => ({
      ...base,
      color: VALUE_COLOR_ATTRIBUTE,
      fontSize: DROPDOWN_FONTSIZE,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "75px",
    }),
    menu: (base) => ({
      ...base,
      marginTop: "2px",
      width: "180px",
      borderRadius: "4px",
      boxShadow: "0 4px 6px 0 rgba(131, 134, 163, 0.12)",
      backgroundColor: BACKGROUND_COLOR,
      position: "absolute",
    }),
    container: (base) => ({
      ...base,
      pointerEvents: "auto",
    }),
    menuList: (base) => ({
      ...base,
      minHeight: "4em",
      maxHeight: "9em",
    }),
    clearIndicator: (base) => ({
      ...base,
      position: "absolute",
      marginTop: "3px",
      right: "-5px",
      top: "2px",
    }),
  }

  const updateAttributeData = (newAttributeData) => {
    (updateApiRequestObject.id = newAttributeData.id),
      (updateApiRequestObject.attrGrpName = newAttributeData.attrGrpName.label
        ? newAttributeData.attrGrpName.label
        : newAttributeData.attrGrpName),
      (updateApiRequestObject.attrGrpId = newAttributeData.attrGrpName.value
        ? newAttributeData.attrGrpName.value
        : newAttributeData.attrGrpId),
      (updateApiRequestObject.attrName =
        newAttributeData.attrName && newAttributeData.attrName.trim()),
      (updateApiRequestObject.attrType = newAttributeData.attrType.label
        ? newAttributeData.attrType.label
        : newAttributeData.attrType),
      (updateApiRequestObject.attrDescription =
        newAttributeData.attrDescription &&
        newAttributeData.attrDescription.trim()),
      (updateApiRequestObject.version = newAttributeData.version),
      (updateApiRequestObject.organizationId = userDetails.organizationid),
      (updateApiRequestObject.isMandatory = newAttributeData.isMandatory),
      (updateApiRequestObject.timeZone = timeZone)
    props.updateAttributeData(updateApiRequestObject)
  }

  const onRowEditComplete = (e) => {
    let { newData, index } = e
    if (e.newData) {
      updateAttributeData(newData)
    } else {
      toastHeading = "Update Failed"
      toastContent = "Cannot Update Mandatory Column"
      titleBackgroundColor = ERROR_BG_COLOR
      toastSize = MEDIUM
      setIsToastMsg(true)
    }
    setIsGridCheckBox(false)
  }

  const onRowEditCancel = () => {
    if (onSelected && onSelected.length) {
      setIsDisableDeleteButton(false)
    }
    setIsGridCheckBox(false)
  }

  const rowEditValidator = (e, data) => {
    let index = data.props.value.findIndex((x) => x.id === e.id)
    if (validationError["attrName" + index]) {
      return false
    } else if (validationError["attrDescription" + index]) {
      return false
    } else {
      return true
    }
  }
  const attrSearchFilter = (option, searchText) => {
    if (option.data.label.toLowerCase().includes(searchText.toLowerCase())) {
      return true
    } else {
      return false
    }
  }

  const statusEditor = (options) => {
    if (onSelected && onSelected.length) {
      setIsDisableDeleteButton(true)
    }
    setIsGridCheckBox(true)
    return (
      <>

        <Row className="mt-4">
          <Formik
            initialValues={{
              ["attrName" + options.rowIndex]: options.value ? options.value : "",
              idx: options.rowIndex,
              ["attrDescription" + options.rowIndex]: options.value
                ? options.value
                : "",
              idx: options.rowIndex,
            }}
          >
            {({ errors, setFieldValue, handleBlur, touched }) => (
              <Form onSubmit={(e) => e.preventDefault()}>
                {options.rowData.isMandatory == true && options.field == ATTR_GRP_NAME ? (
                  <label className="ml-3">{options.value}</label>
                ) : options.field == ATTR_GRP_NAME ? (
                  <div className="p-field p-col-12 p-md-12">
                    <Select
                      className="attribute-dropdown"
                      type="select"
                      name={"attrGroup" + options.rowIndex}
                      classNamePrefix={`${touched.attrGrpName && errors.attrGrpName
                          ? ERROR_DROPDOWN_CLASSNAME
                          : ""
                        } pim-dropdown`}
                      styles={optionStyles}
                      options={attrGrpDataObj}
                      isMulti={false}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        setFieldValue("attrGroup" + options.rowIndex, e)
                        options.editorCallback(e)
                      }}
                      placeholder={options.value}
                      filterOption={attrSearchFilter}
                    />
                  </div>
                ) : null}

                {options.rowData.isMandatory == true && options.field == ATTR_NAME ? (
                  <label className="ml-3">{options.value}</label>
                ) : options.field == ATTR_NAME ? (
                  <div className="p-field p-col-12 p-md-12">
                    <Field
                      type="text"
                      name={"attrName" + options.rowIndex}
                      value={options.value}
                      onChange={(e) => {
                        options.editorCallback(e.target.value)
                        setFieldValue("attrName" + options.rowIndex, e.target.value)
                      }}
                      className={
                        errors.attrName
                          ? ERROR_FIELD_CLASSNAME
                          : "p-inputtext p-component p-inputnumber-input"
                      }
                      validate={(values) => {
                        let errors
                        {
                          if (!values) {
                            errors = i18n.t("validationMessage.attrNameisRequired")
                          } else if (values && values.trim().length > 50) {
                            errors = i18n.t("validationMessage.length")
                          }
                          let error = validationError
                          error["attrName" + options.rowIndex] = errors
                          setValidationError(error)
                          return errors
                        }
                      }}
                      onBlur={handleBlur}
                    />
                    <div className="errorMsg">
                      <ErrorMessage name={"attrName" + options.rowIndex} />
                    </div>
                  </div>
                ) : null}

                {options.field == ATTR_TYPE ? (
                  <div className="p-field p-col-12 p-md-12">
                    {/* <Select
                        className="attribute-dropdown"
                        type="select"
                        name="attrType"
                        classNamePrefix={`${
                          touched.attrType && errors.attrType
                            ? ERROR_DROPDOWN_CLASSNAME
                            : ""
                        } pim-dropdown`}
                        styles={optionStyles}
                        options={attributeTypeData}
                        isMulti={false}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setFieldValue("attrType", e)
                          options.editorCallback(e)
                        }}
                        placeholder={options.value}
                        filterOption={attrSearchFilter}
                      /> */}
                    <label className="ml-3">{options.value}</label>
                  </div>
                ) : null}

                {options.field == ATTR_DESCRIPTION ? (
                  <div className="p-field p-col-12 p-md-12">
                    <Field
                      type="textarea"
                      value={options.value}
                      name={"attrDescription" + options.rowIndex}
                      onChange={(e) => {
                        options.editorCallback(e.target.value)
                        setFieldValue(
                          "attrDescription" + options.rowIndex,
                          e.target.value
                        )
                      }}
                      className={
                        touched.attrDesc && errors.attrDesc
                          ? ERROR_DESC_FIELD_CLASSNAME
                          : "p-inputtext p-inputtextarea attr-type"
                      }
                      validate={(values) => {
                        let errors
                        {
                          if (values && values.trim().length > 150) {
                            errors = i18n.t("validationMessage.lengthDesc")
                          }
                          let error = validationError
                          error["attrDescription" + options.rowIndex] = errors
                          setValidationError(error)
                          return errors
                        }
                      }}
                    />
                    <div className="errorMsg">
                      <ErrorMessage name={"attrDescription" + options.rowIndex} />
                    </div>
                  </div>
                ) : null}
              </Form>
            )}
          </Formik>
        </Row>
      </>
    )
  }

  const deleteAttrDialogue = (
    <React.Fragment>
      <Button
        label={labelNo}
        // icon="pi pi-times"
        className="p-button-text custom-button cancel-button"
        onClick={() => onHideMultipleDeleteDialog()}
      />
      <Button
        label={labelYes}
        // icon="pi pi-check"
        className="p-button-text custom-button btn-yes"
        onClick={() => deleteAttribute()}
      />
    </React.Fragment>
  )

  

  const handleToastHide = () => {
    setIsToastMsg(false)
    setIsGridCheckBox(false)
  }

  const modalContent = <PimerceDataTable
    isHeaderButtonVisible={false}
    columnData={[
      {
        field: "issues",
        header: "Issues",
        filter: false,
        sortable: false,
      }]}
    data={modalGridData}
    tableStyle = {{marginRight:0}}
    isSelectedRowCleared={isSelectedRowCleared}
    totalRecords={totalRecords}
    isPaginator={false}
    isScrollable={true}
    isLazy={true}
    gridHeader={""}
    popupHeader={popupHeader}
    isPopupCancelBtn={false}
    headerButtonsGrb={[]}
    isToolbar={false}
    deleteButtonLabel={deleteButtonLabel}
    updateButtonLabel={i18n.t("attributeDialogText.updateButtonLabel")}
    isGridCheckBox={true}
    isLoader={isLoader}
    exportCallback={exportTrigger}
    onSelectedRowDataTable={selectedRowDataTable}
    isHeaderSearch={false}
    isHeaderfilter={false}
    scrollHeight={SCROLL_HEIGHT}
    scrollWidth={SCROLL_WIDTH}
    columnResizeMode={COLUMN_RESIZE_MODE}
    gridSize={GRID_SIZE}
    handlePagination={onPageChange}
    handleSorting={onSortChange}
    updateAttributeData={updateAttributeData}
    statusEditor={statusEditor}
    onRowEditComplete={onRowEditComplete}
    rowEditValidator={rowEditValidator}
    // onRowEditCancel={onRowEditCancel}
    // enableRowEdit={authJson["6"].isEnabled}
    // Attribute Search box
    pageDataReset={pageDataReset}
    sortData={[{ field: 'attrName', order: -1 }]}
  />
  return (
    <>
      {/* <Backpagecomponent props={props}/> */}
      <div className="p-grid common-header-section">

        <h5 className="p-m-0  p-col-12  page-header"><PublishResultIcon /> Published Results</h5>
      </div>
      <div style={{ background: 'white', borderRadius: '6px', padding: '1px', marginRight: '-15px',height:"65px" }}>
        {/* <Steps model={interactiveItems}
          activeIndex={0} readOnly={true}
        /> */}
        <Nav totalSteps={5} stepList={stepList} currentStep={4} />
      </div>
      <Row className="mt-4">
        <Col lg="4" className="retailer-container">
          <div className="card text-end syndication-result-border" >
            <div className="publish-card-body"  >
              <Row>
                <Col lg="4">
                  <div className="img-parent">
                    <img src={retailerLogo} className="flipkart-img" alt="..." />
                  </div>
                </Col>
                <Col lg="8">
                <div className="card-details pt-4">
                    <span className="retailer-category">
                      <h4>{orgRetailerName}</h4></span>
                    {/* <ul class="breadcrumb">
                      {retailerCategory}
                    </ul> */}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
        <Col lg="4" className="publish-action-container">
          <div className="card text-end syndication-result-border" >
            <div className="publish-card-body"  >
              <Row>
                <Col lg="4">
                  <PieChart
                    labels={["Passed","Failed"]}
                    series={pieChartSeries}
                    isPercentage={true}
                    isDecimal={true}
                    decimalValue={2}
                    colorProps={["#7be77b","#ff4141"]}
                    isLegends={true}
                    pieSize={1}
                    pieWidth={240}
                    type="donut"
                  />
                </Col>
                <Col lg="8">
                  <div className="card-details">
                    <span className="skus-passed"><b>SKUs That Published</b></span>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
        <Col lg="4" className="publish-action-container publish-action-card">
          <div className="card text-end syndication-result-border" >
            <div className="publish-card-body"  >
              <Row>
                <Col lg="12">
                  <div className="retailer-category publish-action"><b>Publish Action</b></div>
                </Col>
                <Col lg="12">
                  <div className="card-details export-buttons">
                  <Button
                  disabled={!productIds.length||!authJson["46"].isEnabled}
                  onClick={()=>{
                    revalidateProducts()
                  }}
              className="p-button-success btn-active-17 catalog-btn pimbtn p-mr-1"
            > Revalidate
            </Button>
            <Button
              className="p-button-success btn-active-17 catalog-btn pimbtn p-mr-1"
              onClick={(e)=>confirmHome(e)}
            > Home
            </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <div className="mt-4">
        <ToastModal
          show={isToastMsg}
          title={toastHeading}
          titleBackgroundColor={titleBackgroundColor}
          content={toastContent}
          size={toastSize}
          onModalHide={handleToastHide}
        />
        <ModalComponent
          isShowModal={isModalOpen}
          onHideModal={() => { setIsModalOpen(false) }}
          modalTitle={"Validation Results"}
          modalContent={modalContent}
          modalSize="md"
          modalDailogClassName="modalDailogContent p-fluid dialogue-box-style"
        />
        <Formik
          initialValues={{
            progressPercentage: 0,
            isProgressFailed: false,
            successUrl: null,
            errorUrl: null,
            publishSuccessUrl: null,
            pubishErrorUrl: null,
            passPercentage: 0,
            failPercentage: 0,
            publishProgressPercentage: 0,
            isPublishFailed: false,
            apiPassPercentage: 0,
            apiFailPercentage: 0,
            processedSkus: []
          }}
        >
          {({ values, setFieldValue }) => (
            <>{setFieldsValue = setFieldValue}
              <Dialog
                header={"Publish Products"}
                closable={values.isPublishFailed}
                // className="import-popup"
                className="progress-dialog"
                visible={isValidateModal}
                // visible={true}
                onHide={() => {
                  setFieldValue("isPublishFailed", false)
                  setIsvalidateModal(false)
                }}
              >
                {!values.isPublishFailed?
                <div style={{ width: '-webkit-fill-available', paddingTop: "5%", paddingLeft: "21px", paddingRight: "21px" }}>
                  <ProgressBar
                    variant="info"
                    animated
                    striped
                    now={Math.round(values.progressPercentage)}
                    label={Math.round(values.progressPercentage) + "%"}
                    key={1}
                  />
                </div>:
                <div>
                <div style={{ width: '-webkit-fill-available',  paddingLeft: "21px", paddingRight: "21px" }}>
                <div className="importdata-final-result-img-container">
                  <img src={exclamaion} className="import-data-success" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h4>{i18n.translate('toastMessage.requestFailedMessage')}</h4>
                </div>
              </div></div>}

              </Dialog></>
          )}
        </Formik>
        <div className="tab-menu-nav card mb-3">
            <TabMenu model={publishResultTabMenu} activeIndex={activeIndex} onTabChange={(e) => onTabsChange(e)}/>
        </div>
        <PimerceDataTable
          isHeaderButtonVisible={false}
          columnData={gridColumn}
          data={activeIndex==0?createGridData:activeIndex==1?updateGridData:delsitGridData}
          isSelectedRowCleared={isSelectedRowCleared}
          totalRecords={totalRecords}
          isPaginator={false}
          isScrollable={false}
          isStripedRows={false}
          isInfiniteRows
          isLazy={true}
          gridHeader={""}
          popupHeader={popupHeader}
          isPopupCancelBtn={false}
          headerButtonsGrb={[]}
          isToolbar={false}
          deleteButtonLabel={deleteButtonLabel}
          updateButtonLabel={i18n.t("attributeDialogText.updateButtonLabel")}
          isGridCheckBox={true}
          isLoader={isLoader}
          exportCallback={exportTrigger}
          onSelectedRowDataTable={selectedRowDataTable}
          isHeaderSearch={false}
          isHeaderfilter={false}
          scrollHeight={SCROLL_HEIGHT}
          scrollWidth={SCROLL_WIDTH}
          columnResizeMode={COLUMN_RESIZE_MODE}
          gridSize={GRID_SIZE}
          handlePagination={onPageChange}
          handleSorting={onSortChange}
          updateAttributeData={updateAttributeData}
          statusEditor={statusEditor}
          onRowEditComplete={onRowEditComplete}
          rowEditValidator={rowEditValidator}
          // onRowEditCancel={onRowEditCancel}
          // enableRowEdit={authJson["6"].isEnabled}
          // Attribute Search box
          pageDataReset={pageDataReset}
          sortData={[{ field: 'attrName', order: -1 }]}
        />


      </div>
    </>
  )
}
export default connect(mapStateToProps)(PublishSku);