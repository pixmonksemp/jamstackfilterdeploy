import React, { useEffect, useState } from "react"
import PimerceDataTable from "../../../../components/data-table/data-table"
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
  VALUE_COLOR_ATTRIBUTE,
  UPPY_PLUGINS,
  XHR_UPLOAD_URL,
  START_PERCENTAGE,
  STOP_PERCENTAGE,
  CLOUD,
  LOCAL,
  IS_MODAL,
  LOCAL_COMPUTER,
  ERROR_DESC_FIELD_CLASSNAME,
  DOWNLOAD_FILE_NAME,
  ASTERIK,
  MAXSIZENAME,
  MAXSIZEDESC,
} from "../../../../common/common-constants"
import i18n from "../../../../translate/i18n"
import ModalComponent from "../../../modal/index"
import {
  getApiRequestObject,
  getAttributeGroupObject,
  deleteApiRequestObject,
  exportApiRequestObject,
  postImportedFileRequest,
} from "../../../../common/master-data"
import "./style.scss"
import AttributeForm from "./create-update-attr"
import Alerticon from "../../../../common/icons/alerticon"
import Success from "../../../../assets/passed.svg"
import Failed from "../../../../assets/failed.svg"
import Ignored from "../../../../assets/ignored.svg"
import exclamaion from "../../../../assets/exclamation.svg"
import axios from "axios"
import { Toolbar } from "primereact/toolbar"
import { Button } from "primereact/button"
import { COMMON_URL } from "../../../../common/common-api-constants"
import ToastModal from "../../../modal/ToastModal"
import { updateApiRequestObject } from "../../../../common/master-data"
import { ErrorMessage, Field, Formik } from "formik"
import { Col, DropdownButton, Form, ProgressBar, Row } from "react-bootstrap"
import { ERROR_FIELD_CLASSNAME } from "../../../../common/common-constants"
import Select from "react-select"
// import Autocomplete from "@pixmonks/auto-complete"
import Autocomplete from "../../skulist/autocomplete"
import StepWizard from "react-step-wizard"
import {
  SELECT_COLOR,
  FOCUS_COLOR,
  DROPDOWN_FONTSIZE,
  DROPDOWN_BORDERADIUS,
  BACKGROUND_COLOR,
  BORDER_STYLE,
  VALUE_COLOR,
  TEXTBOX_BOX_SHADOW,
  SPECIAL_CASE_VALIDATOR,
} from "../../../../common/common-constants"
import UpdateAttributeGroup from "./update-attr-group"
import PimerceAuth from "../../../authorization-tag/PimerceAuth"
import Plusicon from "../../../../common/icons/plusicon"
import Closeicon from "../../../../common/icons/deleteicon"
import Groupingicon from "../../../../common/icons/groupingicon"
import { connect } from "react-redux"
import { Dialog } from "primereact/dialog"
import AttributeUploader, { resetUppy } from "../../asset-listing/AttributeUploader"
import EventSource from "eventsource"
import multiSelect from "../../../../assets/multiSelect.svg"
import ASSIGNGROUP from "../attribute/assign-attribute"
import AttributeIcon from "../../../../common/icons/attributeicon"

let numberOfPage,
  attributeGridData = [],
  attributeSearchGridData = [],
  gridColumn = [
    {
      field: "attrName",
      header: i18n.t("gridColumn.attributeName"),
      filter: false,
      sortable: true,
      width:"15%"
    },
    {
      field: "attrType",
      header: i18n.t("gridColumn.attributeType"),
      sortable: false,
      width:"12%"
    },
    {
      field: "attrDescription",
      header: i18n.t("gridColumn.attributeDescription"),
      sortable: false,
      width:"48%"
    },
    {
      field: "attrGrpName",
      header: i18n.t("gridColumn.assignedGroup"),
      filter: false,
      sortable: false,
      width:"15%"
    },
  ],
  toastHeading,
  toastContent,
  titleBackgroundColor,
  toastSize,
  headerButtonGroup = [
    {
      authId: "10",
      ButtonName: "Export Attribute",
      class: "exportexcel",
      iconpos: "right",
      type: "attributes",
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
  }

const mapStateToProps = (state) => {
  return {
    getUserDetail: state.userDetail.getUsersObj.userCredentials,
  }
}
  let setFieldsValue,
  fileRequest = postImportedFileRequest,
  progressValue = 0,
  stepWizard,
  importedFile = { name: "" }

function Attribute(props) {
  const { getUserDetail } = props
  let authJson = JSON.parse(sessionStorage.getItem("authJson"))
  let userDetails = getUserDetail
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const [gridData, setGridData] = useState([])
  const [isSearchString, setIsSearchString] = useState(false)
  const [isLoader, setIsLoader] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  const [isSelectedRowCleared, setIsSelectedRowCleared] = useState(false)
  const [attributeTypeData, setAttributeTypeData] = useState()
  const [attrGrpDataObj, setAttrGrpDataObj] = useState([])
  const [isGridDialog, setIsGridDialog] = useState(false)
  const [isDeleteRecordsDialog, setIsDeleteRecordsDialog] = useState(false)
  const [clickEvent, setClickEvent] = useState("")
  const [isCustomUppyStyle, setIsCustomUppyStyle] = useState(false)
  const [isShowUploadModal, setIsShowUploadModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadType, setUploadType] = useState(false)
  const [isLocal, setIsLocal] = useState(false)
  const [isCloud, setIsCloud] = useState(false)
  const [isFileUploaded, setIsFileUploaded] = useState(false)
  const [isBulkImport, setIsBulkImport] = useState(false)
  const [isDisableUpdateButton, setIsDisableUpdateButton] = useState(true)
  const [isDisableDeleteButton, setIsDisableDeleteButton] = useState(true)
  const [onSelected, setOnSelected] = useState(null)
  const [isToastMsg, setIsToastMsg] = useState(false)
  const [validationError, setValidationError] = useState({})
  const [isGridCheckBox, setIsGridCheckBox] = useState(false)
  const [pageDataReset, setPageDataReset] = useState(false)
  const [isCleared, setIsCleared] = useState(false)
  const [searchResult, setSearchResult] = useState([])
  const [searchKey, setSearchKey] = useState("")
  const [pageData, setPageData] = useState(null)
  const [orderChange, setOrderChange] = useState(null)
  const [isImport, setIsImport] = useState(false)
  const [isShowModal, setIsShowModal] = useState(false)
  const [submitEvent, setSubmitEvent] = useState(true)
  const [locale, setLocale] = useState(null)
  const [popupHeader, setPopupHeader] = useState(
    i18n.t("importdata.dialogtitle")
  )
  const [isExcelBtnDisabled, setIsExcelBtnDisabled] = useState(false)
  const [assignGroup, setIsAssignGroup] = useState(false)
  const [isAutoCompleteLoaderFlag, setIsAutoCompleteLoaderFlag] = useState(false)
  const [editInitCount, setEditInitCount] = useState([])
  const [searchKeyChange, setSearchKeyChange] = useState("")

  let autocompleteDropdown = (
    <Autocomplete
      options={searchResult}
      onSearch={(event) => onSearchBoxText(event)}
      placeholder={i18n.t("dataTableText.skuSearchBoxPlaceholderAttr")}
      isCleared={isCleared}
      isLoader={isAutoCompleteLoaderFlag}
      autoComplete={autoComplete}
      onChangeValue={(e) => onChangeAutoComplete(e)}
    />
  )

  const redirectAssign = (event) =>{
    setIsAssignGroup(true)
    setClickEvent(event)
  }

  const addAttribute = () => {
    return (
      <>
        <AttributeForm
          hideDialog={hideDialog}
          event={CREATE}
          insertAttributeData={props.insertAttributeData}
          attributeTypeData={attributeTypeData}
          setSubmitEvent={submitEvent}
        />
      </>
    )
  }

  // const groupAttribute = () => {
  //   return (
  //     <>
  //       <UpdateAttributeGroup
  //         hideDialog={hideDialog}
  //         attrGrpDataObj={attrGrpDataObj}
  //         attributeData={onSelected}
  //         changeAttrGroup={changeAttrGroup}
  //         event={GROUP}
  //         userDetails={userDetails}         
  //       />
  //     </>
  //   )
  // }

  const groupAttribute = () =>{
    return(
       <ASSIGNGROUP
          hideDialog={hideDialog}
          attrGrpDataObj={attrGrpDataObj}
          attributeData={onSelected}
          changeAttrGroup={changeAttrGroup}
          event={GROUP}
          userDetails={userDetails} 
       />
    )
   }

   const checkIsMandatoryAttribute = (name,item) =>{
     if(item.isMandatory){
      return (
      <>{item.attrName}
      <span style={{color:"red",fontSize:"14px"}}>{ASTERIK}</span> 
      </>)
     }else{
      return item.attrName
     }
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
    let typeCheckAttrName = onSelected && onSelected.length > 0 ? typeof(onSelected && onSelected[0].attrName == undefined || onSelected && onSelected[0].attrName) == 'object'  ? onSelected && onSelected[0].attrName.props.children[0] : onSelected && onSelected[0].attrName : null
    if (onSelected != null && onSelected.length > 1) {
      return onSelected && onSelected.length + records
    }
    return onSelected != null && onSelected.length != 0
      ? ' " ' + typeCheckAttrName + ' " ?'
      : null
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  useEffect(() => {
    getApiRequestObject.pageStart = 0
    getApiRequestObject.pageEnd = 10
    getApiRequestObject.organizationId = userDetails.organizationid
    getApiRequestObject.sortField = "attrName"
    getApiRequestObject.sortType = "ASC"
    props.getManageAttribute(getApiRequestObject)
  }, [])

  useEffect(() => {
    const { getAttributeTypeDataResult } = props
    if (
      getAttributeTypeDataResult &&
      getAttributeTypeDataResult.content &&
      getAttributeTypeDataResult.content.status == 200 &&
      getAttributeTypeDataResult.content.data &&
      getAttributeTypeDataResult.content.data.length
    ) {
      const attributeTypeData = getAttributeTypeDataResult.content.data.map(
        (item) => {
          return {
            label: item.attrType,
            value: item.id,
          }
        }
      )
      setAttributeTypeData(attributeTypeData)
    }
  }, [props.getAttributeTypeDataResult])

  useEffect(() => {
    getAttributeGroupObject.organizationId = userDetails.organizationid
    getAttributeGroupObject.pageEnd = 3000
    getAttributeGroupObject.sortField = "attrGrpName"
    getAttributeGroupObject.sortType = "DESC"
    props.getAttributeGroupData(getAttributeGroupObject)
    props.getAttributeTypeData()
  }, [])

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
          getManageAttributeResult.content.data.attributes.map((item) => {
            const dataValue = {}
            Object.assign(dataValue, {
              id: item.id,
              attrGrpName: item.attrGrpName,
              attrName: checkIsMandatoryAttribute(item.attrName,item),
              attrType: item.attrType,
              attrDescription: item.attrDescription,
              version: item.version,
              attrGrpId: item.attrGrpId,
              organizationId: item.organizationId,
              isMandatory: item.isMandatory,
            })
            return dataValue
          })
      }
      numberOfPage = getManageAttributeResult.content.data.totalElement
      if (
        getApiRequestObject.pageStart != null &&
        getApiRequestObject.pageStart > 0
      ) {
        if (numberOfPage / 10 <= getApiRequestObject.pageStart) {
          getApiRequestObject.pageStart = getApiRequestObject.pageStart - 1
          props.getManageAttribute(getApiRequestObject)
        }
      }
      setGridData(attributeGridData)
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
      setIsAutoCompleteLoaderFlag(false)
      setSearchResult(suggestionOption)
    }
    if (searchKeyChange == "") {
      setSearchResult([])
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
        attributeSearchGridData =
          props.searchGridAttributeGroupResult.content.data.attributes.map(
            (item) => {
              const dataValue = {}
              Object.assign(dataValue, {
                id: item.id,
                attrGrpName: item.attrGrpName,
                attrName: checkIsMandatoryAttribute(item.attrName,item),
                attrType: item.attrType,
                attrDescription: item.attrDescription,
                version: item.version,
                attrGrpId: item.attrGrpId,
                organizationId: item.organizationId,
                isMandatory: item.isMandatory,
              })
              return dataValue
            }
          )
      }
      numberOfPage = props.searchGridAttributeGroupResult.content.data.totalElement
      if (
        getApiRequestObject.pageStart != null &&
        getApiRequestObject.pageStart > 0
      ) {
        if (numberOfPage / 10 <= getApiRequestObject.pageStart) {
          getApiRequestObject.pageStart = getApiRequestObject.pageStart - 1
          props.searchGridAttributeGroup(getApiRequestObject)
        }
      }
      setGridData(attributeSearchGridData)
      setTotalRecords(numberOfPage)
    }
  }, [props.searchGridAttributeGroupResult])

  useEffect(() => {
    const { abortImportedFileResult } = props
    if (
      abortImportedFileResult &&
      abortImportedFileResult.content &&
      abortImportedFileResult.content.status == "200"
    ) {
      setFieldsValue("isApiCanceled", true)
    }
  }, [props.abortImportedFileResult])

  const onPageChange = (pagedata) => {
    setPageData(pagedata)
    setPageDataReset(false)
    getApiRequestObject.pageStart = pagedata.page
    getApiRequestObject.pageEnd = 10
    getApiRequestObject.organizationId = userDetails.organizationid
    getApiRequestObject.sortField = "attrName"
    getApiRequestObject.attrName = searchKey ? searchKey : ""
    // getApiRequestObject.sortType = "ASC"
    if (searchKey == "") {
      props.getManageAttribute(getApiRequestObject)
    } else {
      getApiRequestObject.sortField = "attr_name"
      props.searchGridAttributeGroup(getApiRequestObject)
    }
  }

  const onSortChange = (sortdata) => {
    setOrderChange(sortdata)
    // setIsCleared(true)
    // setPageDataReset(true)
    getApiRequestObject.pageStart = pageData == null ? 0 : pageData && pageData.page
    getApiRequestObject.pageEnd = 10
    getApiRequestObject.sortField = sortdata.multiSortMeta[0].field
    getApiRequestObject.sortType =
      sortdata.multiSortMeta[0].order == -1 ? "ASC" : "DESC"
    getApiRequestObject.organizationId = userDetails.organizationid
    if (searchKey == "") {
      props.getManageAttribute(getApiRequestObject)
    } else {
      getApiRequestObject.sortField = "attr_name"
      props.searchGridAttributeGroup(getApiRequestObject)
    }
  }

  const onChangeAutoComplete = (e) => {
    setIsCleared(false)
    setPageDataReset(false)
    setIsAutoCompleteLoaderFlag(true)
    setSearchKeyChange(e && e.trim())
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
    setSearchKey(event && event.trim())
    setIsAutoCompleteLoaderFlag(false)
    getApiRequestObject.pageStart = 0
    getApiRequestObject.pageEnd = 10
    getApiRequestObject.sortField = "attr_name"
    getApiRequestObject.organizationId = userDetails.organizationid
    getApiRequestObject.attrName = event && event.trim().toLowerCase()
    props.searchGridAttributeGroup(getApiRequestObject)
    setSearchResult([])
  }

  const attributeDataResult = (result, type) => {
    if (result && result.content && result.content.status != 200) {
      if (type == DELETE || type == GROUPED) {
        setIsGridDialog(false)
        setIsAssignGroup(false)
        toastHeading = i18n.t("toastMessage.requestFailed")
        if (type == CREATE)
          toastHeading = i18n.t("toastMessage.createAttrToastHeading")
        if (type == UPDATE)
          toastHeading = i18n.t("toastMessage.updatedAttrToastHeading")
        if (type == GROUPED)
          toastHeading = i18n.t("toastMessage.updatedAttrGrpChangeToastHeading")
        if (type == DELETE)
          toastHeading = i18n.t("attributePopupHeaders.deleteAttribute")
        toastContent =
          result.content &&
          result.content.data &&
          result.content.data.description
            ? result.content.data.description
            : i18n.t("toastMessage.requestFailedMessage")
        titleBackgroundColor = ERROR_BG_COLOR
        toastSize = MEDIUM
        setIsDeleteRecordsDialog(false)
        setIsSelectedRowCleared(true)
        setIsToastMsg(true)
      } else {
        toastHeading = i18n.t("toastMessage.requestFailed")
        toastContent = i18n.t("toastMessage.requestFailedMessage")
        titleBackgroundColor = ERROR_BG_COLOR
        toastSize = MEDIUM
        if((type == CREATE) && (result && result.content && result.content.data.description == "Attribute already exists")){
          setIsGridDialog(true)
          setIsToastMsg(true)
          setSubmitEvent(false)
        }else{
          setIsGridDialog(false)
          setIsToastMsg(false)
          setSubmitEvent(true)
        }
        // setIsGridDialog(false)
        // setIsToastMsg(true)
      }
    }
    if (result && result.content && result.content.status == 200) {
      if (type == CREATE) {
        setIsGridDialog(false)
        setIsLoader(true)
        setPageDataReset(true)
        getApiRequestObject.pageStart = 0
        getApiRequestObject.searchKey = ""
        getApiRequestObject.attrName = ""
        getApiRequestObject.sortField = "attrName"
        props.getManageAttribute(getApiRequestObject)
        toastHeading = i18n.t("toastMessage.createAttrToastHeading")
        toastContent = i18n.t("toastMessage.createdAttrContent")
        titleBackgroundColor = VALID_BG_COLOR
        toastSize = MEDIUM
        setIsToastMsg(true)
        setSubmitEvent(true)
      }
      if (type == UPDATE) {
        setIsSelectedRowCleared(true)
        setIsGridDialog(false)
        if (searchKey == "") {
          getApiRequestObject.sortField = "attrName"
          props.getManageAttribute(getApiRequestObject)
        } else {
          getApiRequestObject.sortField = "attr_name"
          props.searchGridAttributeGroup(getApiRequestObject)
        }
        toastHeading = i18n.t("toastMessage.updatedAttrToastHeading")
        toastContent = i18n.t("toastMessage.updatedAttrContent")
        titleBackgroundColor = VALID_BG_COLOR
        toastSize = MEDIUM
        setIsToastMsg(true)
      }
      if (type == GROUPED) {
        setIsSelectedRowCleared(true)
        setIsGridDialog(false)
        setIsAssignGroup(false)
        if (searchKey == "") {
          getApiRequestObject.sortField = "attrName"
          props.getManageAttribute(getApiRequestObject)
        } else {
          getApiRequestObject.sortField = "attr_name"
          props.searchGridAttributeGroup(getApiRequestObject)
        }
        toastHeading = i18n.t("toastMessage.updatedAttrGrpChangeToastHeading")
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
        } else {
          getApiRequestObject.sortField = "attr_name"
          props.searchGridAttributeGroup(getApiRequestObject)
        }
        toastHeading = i18n.t("attributePopupHeaders.deleteAttribute")
        toastContent = result.content.data
        titleBackgroundColor = VALID_BG_COLOR
        toastSize = MEDIUM
        setIsToastMsg(true)
      }
    } else if (result && result.content && result.content.data.code == 101) {
      toastHeading = i18n.t("toastMessage.requestFailed")
      if (type == CREATE)
        toastHeading = i18n.t("toastMessage.createAttrToastHeading")
      if (type == UPDATE)
        toastHeading = i18n.t("toastMessage.updatedAttrToastHeading")
      if (type == GROUPED)
        toastHeading = i18n.t("toastMessage.updatedAttrGrpChangeToastHeading")
      if (type == DELETE)
        toastHeading = i18n.t("attributePopupHeaders.deleteAttribute")
      toastContent = result.content.data.description
      titleBackgroundColor = ERROR_BG_COLOR
      toastSize = MEDIUM
      setIsToastMsg(true)
    }
  }

  const buttonGroup = (name) => {
    let arr = [],
      seletedfield = ""
    onSelected &&
      onSelected.length &&
      onSelected.map((item) => {
        arr.push(item.id)
      })
    if (name.class == i18n.t("exportSheet.exportpdf")) {
      seletedfield = i18n.t("exportSheet.pdf")
    } else if (name.class == i18n.t("exportSheet.exportexcel")) {
      seletedfield = i18n.t("exportSheet.excel")
    } else if (name.class == i18n.t("exportSheet.exportemail")) {
      seletedfield = i18n.t("exportSheet.email")
    }
    exportTrigger(arr, seletedfield)
  }

  const exportTrigger = (data, field) => {
    exportApiRequestObject.ids = data
    exportApiRequestObject.organizationId = userDetails.organizationid
    if (field == "excel" && gridData && gridData.length > 0) {
      toastHeading = "Attributes Download Started"
      toastContent = "Download Initiated for Attributes..."
      titleBackgroundColor = ERROR_BG_COLOR
      toastSize = MEDIUM
      setIsToastMsg(true)
      setIsExcelBtnDisabled(true)
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
          setIsExcelBtnDisabled(false)
        } else {
          const url = window.URL.createObjectURL(
            new Blob([exportResponse.data])
          )
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", "Attributes.xlsx") //or any other extension
          document.body.appendChild(link)
          link.click()
          setIsToastMsg(false)
          setIsExcelBtnDisabled(false)
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
    setIsAssignGroup(false)
    setIsGridDialog(false)
  }

  //Save Attribute Group mapping
  const changeAttrGroup = (groupId,attributedata) => {
    if (attributedata.length && groupId) {     
      props.updateAttributeGroup({ attributes: attributedata })
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
      fontFamily: "Chivo-Regular",
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
    ;(updateApiRequestObject.id = newAttributeData.id),
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
   setEditInitCount(Object.values(editInitCount).filter(item => item !== e.data.id))
   let { newData, index } = e
   if(e.newData.attrName.length <= 50 && e.newData.attrDescription.length <= 150){ 
    if (e.newData) {
      updateAttributeData(newData)
    } else {
      toastHeading = "Update Failed"
      toastContent = "Cannot Update Mandatory Column"
      titleBackgroundColor = ERROR_BG_COLOR
      toastSize = MEDIUM
      setIsToastMsg(true)
    }
    // setIsGridCheckBox(false)
   }
  }
  
  const onRowEditInit = (data) =>{
    setEditInitCount(editInitCount.concat(data.data.id))
    setIsDisableDeleteButton(true)
    setIsGridCheckBox(true)
  }
   
  const onRowEditCancel = (data) => {
    setEditInitCount(Object.values(editInitCount).filter(item => item !== data.data.id))
    if (onSelected && onSelected.length > 0) {
      setIsDisableDeleteButton(false)
    }
  }

  const rowEditValidator = (e, data) => {
    let index = data.props.value.findIndex((x) => x.id === e.id)
    if (e.attrName.length > 50 || e.attrName.length == 0) {
      return false
    } 
    // else if(e.attrName.match(SPECIAL_CASE_VALIDATOR)){
    //   return false
    // }
     else if (e.attrDescription.length > 150) {
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
    editInitCount.length > 0 ? setIsGridCheckBox(true) : setIsGridCheckBox(false)	 
    // if (onSelected && onSelected.length) {
    //   setIsDisableDeleteButton(true)
    // }
    // setIsGridCheckBox(true)
    return (
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
        {({ errors, setFieldValue, handleBlur, touched ,setFieldTouched,handleChange}) => (
          <Form onSubmit={(e) => e.preventDefault()}>
            {options.rowData.isMandatory == true &&
            options.field == ATTR_GRP_NAME ? (
              <label className="ml-3">{options.value}</label>
            ) : options.field == ATTR_GRP_NAME ? (
              <div className="p-field p-col-12 p-md-12">
                <Select
                  className="attribute-dropdown"
                  type="select"
                  name={"attrGroup" + options.rowIndex}
                  menuPortalTarget={document.body}
                  classNamePrefix={`${
                    touched.attrGrpName && errors.attrGrpName
                      ? ERROR_DROPDOWN_CLASSNAME
                      : ""
                  } pim-dropdown`}
                  styles={optionStyles}
                  options={attrGrpDataObj}
                  isMulti={false}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    // handleChange(e)
                    options.editorCallback(e)
                    setFieldValue("attrGroup" + options.rowIndex, e)
                  }}
                  placeholder={options.value}
                  filterOption={attrSearchFilter}
                />
              </div>
            ) : null}

            {options.rowData.isMandatory == true &&
            options.field == ATTR_NAME ? (
              <label className="ml-3">{options.value}</label>
            ) : options.field == ATTR_NAME ? (
              <div className="p-field p-col-12 p-md-12">
                <Field
                  type="text"
                  name={"attrName" + options.rowIndex}
                  value={options.value}
                  maxLength={MAXSIZENAME}
                  onChange={(e) => {
                    setFieldTouched('attrName' + options.rowIndex); 
                    handleChange(e)
                    options.editorCallback(e.target.value)
                  }}
                  className={
                    errors.attrName
                      ? ERROR_FIELD_CLASSNAME
                      : "p-inputtext p-component p-inputnumber-input"
                  }
                  validate={(values) => {
                    let errors
                    let result = values && values.match(SPECIAL_CASE_VALIDATOR)
                    {
                      if (!values.trim()) {
                        errors = i18n.t("validationMessage.attrNameisRequired")
                      } 
                      else if (values && values.trim().length > 50) {
                        errors = i18n.t("validationMessage.attrNameLength")
                      }
                      // else if (result){
                      //   errors = i18n.t("validationMessage.specialCaseRequired")
                      // }
                      let error = validationError
                      error["attrName" + options.rowIndex] = errors
                      setValidationError(error)
                      return errors
                    }
                  }}
                  onBlur={handleBlur}
                />
                <div className="errorMsg error-validation-attrNameWrap">
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
                  id="attrDescription"
                  type="textarea"
                  value={options.value}
                  name={"attrDescription" + options.rowIndex}
                  maxLength={MAXSIZEDESC}
                  onChange={(e) => {
                    setFieldTouched('attrDescription' + options.rowIndex); 
                    handleChange(e)
                    options.editorCallback(e.target.value)
                    // setFieldValue("attrDescription" + options.rowIndex,e.target.value)
                    // setFieldTouched("attrDescription" + options.rowIndex);  
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

  const buttonTemplate = () => {
    return (
      <React.Fragment>
        <PimerceAuth
          componentId={"15"}
          componentType="button"
          component={
            <Button
              label={i18n.t("attribute.attributeaddbutton")}
              className="p-button-success btn-active-17 pimbtn p-mr-2"
              onClick={() => openDialog(CREATE)}
            >
              <Plusicon svgLeftSpace="15px" />
            </Button>
          }
        />
        <PimerceAuth
          componentId={"16"}
          componentType="button"
          component={
            <Button
              label={deleteButtonLabel}
              className="p-button-danger btn-active-17 pimbtn"
              onClick={() => confirmDeleteSelected(DELETE)}
              disabled={isDisableDeleteButton}
            >
              <Closeicon svgLeftSpace="15px" />
            </Button>
          }
        />
        {/* <PimerceAuth
          componentId={"47"}
          componentType="button"
          component={
            <Button
              label={i18n.t("attributeDialogText.groupingButtonLabel")}
              className="p-button-danger btn-active-17 pimbtn"
              onClick={() => openDialog(GROUP)}
              //disabled={isDisableDeleteButton}
            >
              <Groupingicon svgLeftSpace="15px" />
            </Button>
          }
        /> */}
        <PimerceAuth
          componentId={"47"}
          componentType="button"
          component={
            <Button
              label={i18n.t("attributeDialogText.groupingButtonLabel")}
              className="p-button-danger btn-active-17 pimbtn"
              onClick={()=>redirectAssign(GROUP)}
              //disabled={isDisableDeleteButton}
            >
              <Groupingicon svgLeftSpace="15px" />
            </Button>
          }
        />
        <div className="dataview-mulitsort">
          <DropdownButton
            title={
              <img src={multiSelect} className="dataview-mulitsort-icon" />
            }
          >
            <div className="dataview-multisort-effect-attributes">
              {authJson["6"].isEnabled&&
              <Button
                type="button"
                label="Import Attributes"
                icon=" "
                className="p-button-success btn-active-17 attr-pimbtn importexcel"
                style={{width: "-webkit-fill-available"}}
                onClick={() => uploadAssetFormat()}
              />
              }
              {headerButtonGroup &&
                headerButtonGroup.length != 0 &&
                headerButtonGroup.map((field, index) => {
                  return (
                    <>
                      {field.authId && (
                        <Button
                          type="button"
                          icon=" "
                          label="Export Attributes"
                          onClick={() => buttonGroup(field)}
                          className="p-button-success btn-active-17 attr-pimbtn exportexcel"
                          style={{width: "-webkit-fill-available"}}
                          disabled={isExcelBtnDisabled}
                        />
                      )}
                    </>
                  )
                })}
                {authJson["6"].isEnabled&&
                <Button
                type="button"
                label="Download Template"
                icon=" "
                className="p-button-success btn-active-17 attr-pimbtn downloadTemplate"
                style={{width:"max-content",padding:"10px 11px"}}
                onClick={() => downloadTemplate()}
               />}
            </div>
          </DropdownButton>
          </div>
      </React.Fragment>
    )
  }

  const downloadTemplate = () =>{
    const link = document.createElement("a")
    link.href ="https://sgp1.digitaloceanspaces.com/pixmonksdevspace/pimcollections/organizationAssets/Attribute%20Default%20Template.xlsx"
    link.setAttribute("download", "Attribute Template.xlsx") //or any other extension
    document.body.appendChild(link)
    link.click()
  }

  const attributeCallback = () => {
    setIsCleared(true)
    setPageDataReset(true)
    getApiRequestObject.pageStart = 0
    getApiRequestObject.pageEnd = 10
    getApiRequestObject.organizationId = userDetails.organizationid
    getApiRequestObject.sortField = "attrName"
    getApiRequestObject.attrName = ""
    props.getManageAttribute(getApiRequestObject)
  }

  const uploadAssetFormat = () => {
    setUploadType(true)
    setIsShowUploadModal(true)
  }

  const hideUploadModal = () => {
    attributeCallback()
    setIsCustomUppyStyle(false)
    setIsShowUploadModal(false)
    setIsImport(false)
    setIsBulkImport(false)
    progressValue = 0
    resetUppy(true)
  }

  const onAbort = () => {
    fileRequest.aborted = true
    props.abortImportedFile(fileRequest)
  }

  const downloadFiles = (type) => {
    axios({
      url: `${COMMON_URL + PIM_API + "/downloadAttributeImportExcel"}`,
      method: "POST",
      data: fileRequest,
      responseType: "blob", // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", DOWNLOAD_FILE_NAME) //or any other extension
      document.body.appendChild(link)
      link.click()
    })
  }

  const uploadAsset = () => {
    return (
      <Formik
        initialValues={{
          progressPercentage: 0,
          isImportFailed: false,
          errorMessage: "",
          totalRecords: null,
          insertedRows: null,
          isApiCanceled: false,
          passPercentage: 0,
          failPercentage: 0,
          passedSkus:0,
          ignoredSkus:0,
          totalSks:0,
          failedSkus:0,
          isDisableDownload: false,
        }}
      >
        {({ values, setFieldValue }) => (
          <>
            {(setFieldsValue = setFieldValue)}
            <StepWizard initialStep={1} instance={setInstance}>
              <div className={`${isLocal ? "localisopen" : "cloudisopen"}`}>
                <div className={`file-uploader-container ${isCustomUppyStyle ? "uppy-customization" : ""}`}>
                  <AttributeUploader
                    maxNumberOfFiles={1}
                    maxFileSize={104857600}
                    isBulkImport={true}
                    importType={"Excel"}
                    allowedFileTypes={[".xlsx"]}
                    fileUploadRequest={{
                      locale: locale ? locale : "en",
                      organizationid: userDetails.organizationid,
                      orgId: userDetails.organizationid,
                    }}
                    fileUploadURL={XHR_UPLOAD_URL}
                    goToStep={goToStep}
                    setIsFileUploaded={setIsFileUploaded}
                    disableLocalFiles={true}
                    plugins={UPPY_PLUGINS}
                    setIsCustomUppyStyle={setIsCustomUppyStyle}
                  />
                </div>
              </div>
              
              <div className="file-progress-container">
                {
                  <>
                    <p
                      className="loader-parent"
                      style={{ textAlign: "center" }}
                    >
                      {values.totalRecords ? (
                        `Processed Records:${values.insertedRows}/${values.totalRecords}`
                      ) : (
                        <>
                          <span>{i18n.t("importdata.fileProcess")}</span>
                          <span class="container-loader">
                            <div class="circle circle-1"></div>
                            <div class="circle circle-2"></div>
                            <div class="circle circle-3"></div>
                            <div class="circle circle-4"></div>
                            <div class="circle circle-5"></div>
                          </span>
                        </>
                      )}
                    </p>
                  </>
                }
                <div className="d-flex justify-content-between import-progress-indicator-width mb-2">
                  <span className="d-flex justify-content-lg-start import-indication progress-bar-spacing">
                    {START_PERCENTAGE}
                  </span>
                  <span className="d-flex justify-content-lg-end import-indication">
                    {STOP_PERCENTAGE}
                  </span>
                </div>
                <div className="import-progress-bar-Container">
                  <ProgressBar
                    style={{
                      height: "29px",
                      width: "97%",
                      marginLeft: "24px",
                    }}
                    variant="info"
                    animated
                    now={Math.round(values.progressPercentage)}
                    label={Math.round(values.progressPercentage) + "%" + "   "}
                    key={1}
                  />
                </div>
                <div className="import-data-message">
                  <span className="import-info-content">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Alerticon />
                    &nbsp;&nbsp;
                    {i18n.t("importdata.info")}
                  </span>
                </div>
                {values.isApiCanceled ? (
                  <p className="mt-5" style={{ textAlign: "center" }}>
                    {i18n.t("importdata.processAbortMsg")}
                  </p>
                ) : (
                  <Button
                    onClick={onAbort}
                    className="importdata-cancel-button import-progress-style importdata-customize-size"
                  >
                    {i18n.t("importdata.cancel")}
                  </Button>
                )}
              </div>

              <div className="importdata-final-result-container">
                {values.isImportFailed ? (
                  <div>
                    <div className="importdata-final-result-img-container mb-4">
                      <img src={exclamaion} className="import-data-success" />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <h4>{values.errorMessage}</h4>
                    </div>
                  </div>
                ) : (
                  <>
                  <Row className="import-final-result-inner-container import-outer-border-head">
                    <Col className="import-final-header-width">
                    <div className="d-flex justify-content-between">
                   <span className="import-final-header-title d-flex justify-content-start"> Total Records</span> &nbsp;&nbsp;
                   <span className="import-final-header-records d-flex justify-content-end">{values.totalSks}</span>  
                    </div>
                    </Col>
                  </Row>
                    <Row className="import-final-result-inner-container import-outer-border-body">
                     <Col xl="4" lg="4" md="4" className="import-final-resultbox-container">
                       <div className="result-box-inner import-final-passed">
                        <div className="row">
                          <div className="col">
                        <h6 className="importdata-final-results-records">
                          {i18n.t("importdata.uploadedFiles")} - {values.passedSkus}
                        </h6>
                        </div>
                        </div>
                        <br/>
                        <div className="row">
                          <div className="col-xl-8 col-lg-8 col-md-8">
                        <h6 className="importdata-final-results-percentage">
                          {values.passPercentage % 1 > 0 ? values.passPercentage.toFixed(2) : Math.round(values.passPercentage)} %
                        </h6>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-4 import-final-result-icon-style">
                        <img src={Success} className="import-data-success"/>
                        </div>
                        </div>
                        </div>
                      </Col>
                      <Col xl="4" lg="4" md="4" className="import-final-resultbox-container">
                       <div className="result-box-inner import-final-Failed">
                        <div className="row">
                          <div className="col">
                        <h6 className="importdata-final-results-records">
                          {"Failed Records"} - {values.failedSkus}
                        </h6>
                        </div>
                        </div>
                        <br/>
                        <div className="row">
                          <div className="col-xl-8 col-lg-8 col-md-8">
                        <h6 className="importdata-final-results-percentage">
                        {values.failPercentage % 1 > 0
                              ? values.failPercentage.toFixed(2)
                              : Math.round(values.failPercentage)}
                            %
                        </h6>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-4 import-final-result-icon-style">
                        <img src={Failed} className="import-data-success"/>
                        </div>
                        </div>
                        </div>
                      </Col>
                      <Col xl="4" lg="4" md="4" className="import-final-resultbox-container">
                       <div className="result-box-inner import-final-ignored">
                        <div className="row">
                          <div className="col">
                        <h6 className="importdata-final-results-records">
                            {i18n.t("importdata.ignoredFiles")} - {values.ignoredSkus}
                        </h6>
                        </div>
                        </div>
                        <br/>
                        <div className="row">
                          <div className="col-xl-8 col-lg-8 col-md-8">
                        <h6 className="importdata-final-results-percentage">
                        {values.ignoredPercentage % 1 > 0
                            ? values.ignoredPercentage.toFixed(2)
                            : Math.round(values.ignoredPercentage)}
                          %
                        </h6>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-4 import-final-result-icon-style">
                        <img src={Ignored} className="import-data-success"/>
                        </div>
                        </div>
                        </div>
                      </Col>
                    </Row>
                    {/* Footer */}
                    <Row className="ml-3" style={{ marginTop: "3%" }}>
                      <Col
                        xl={6}
                        lg={6}
                        md={6}
                        className="p-0"
                        style={{ textAlign: "right" }}
                      >
                        <Button
                          disabled={values.isDisableDownload}
                          style={values.isDisableDownload ? { opacity: "0.6" } : {}}
                          className="importdata-download-button"
                          onClick={() => {downloadFiles("IMPORT")}}>
                          {i18n.t("importdata.downloadFiles")}
                        </Button>
                      </Col>
                      <Col xl={6} lg={6} md={6}>
                        <Button onClick={hideUploadModal} className="importdata-close-button">
                          {i18n.t("importdata.close")}
                        </Button>
                      </Col>
                    </Row>
                    </>
                )}
              </div>
            </StepWizard>
          </>
        )}
      </Formik>
    )
  }

  const goToStep = (e, file) => {
    let networkError = false
    if (importedFile.name != file.name) {
      importedFile = file
      setIsProcessing(true)
      fileRequest.fileName = importedFile.name
      fileRequest.fileSize = importedFile.size
      fileRequest.fileType = importedFile.extension.toUpperCase()
      fileRequest.aborted = false
      if (importedFile.source == "react:Dashboard") {
        fileRequest.fileSource = LOCAL_COMPUTER
      } else {
        fileRequest.fileSource = importedFile.source
      }
      fileRequest.userId = 1
      fileRequest.userName = userDetails.userName
      fileRequest.orgId = userDetails.organizationid
      fileRequest.origin = "attribute"
      fileRequest.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      let url = COMMON_URL + "api/progress"
      let eventSourceInitDict = {
        headers: { Authorization: `${userDetails.token_value.Authorization}` },
      }

      const eventSource = new EventSource(url, eventSourceInitDict)
      eventSource.onerror = (e) => {
        if (e.message == "network error") {
          networkError = true
          setFieldsValue("errorMessage", i18n.t("importdata.networkError"))
          stepWizard.goToStep(3)
          setIsProcessing(false)
          setFieldsValue("isImportFailed", true)
        }
        eventSource.close()
      }
      let guidValue = null
      stepWizard.goToStep(e)
      eventSource.addEventListener("GUI_ID", (event) => {
        guidValue = JSON.parse(event.data)
        fileRequest.guid = guidValue
        progressValue = 1
        setFieldsValue("progressPercentage", 1)
        eventSource.addEventListener(guidValue, (event) => {
          const result = JSON.parse(event.data)
          setFieldsValue("totalRecords", result.lastRowCount)
          setFieldsValue("insertedRows", result.processedRow)
          if (progressValue - 1 !== result.uploadPercentage) {
            let percentage = ((result.uploadPercentage + 1) / 101) * 100
            progressValue = percentage
            setFieldsValue("progressPercentage", percentage)
          }
          if (result.uploadPercentage == 100) {
            eventSource.close()
          }
        })
        axios({
          url: `${COMMON_URL + PIM_API + "/importBulkAttributes"}`,
          method: "POST",
          data: fileRequest, // important
        }).then((response, res) => {
          eventSource.removeEventListener("GUI_ID")
          eventSource.removeEventListener(guidValue)
          eventSource.close()
          importedFile = { name: "" }
          fileImportResultProcess(response, networkError)
        })
      })
    }
  }

  const fileImportResultProcess = (result, isNetworkError) => {
    if (
      result &&
      result.status == 200 &&
      result.data &&
      result.data.code != 500
    ) {
      setIsProcessing(false)
      if (result.data) {
        setFieldsValue("isImportFailed", false)
        if (result.data.failurePercentage > 0) {
          setFieldsValue("isDisableDownload", false)
        } else {
          setFieldsValue("isDisableDownload", true)
        }
        setFieldsValue("passPercentage", result.data.successPercentage)
        setFieldsValue("failPercentage", result.data.failurePercentage)
        setFieldsValue("ignoredPercentage",result.data.ignoredPercentage)
        setFieldsValue("passedSkus",result.data.passedSkus)
        setFieldsValue("ignoredSkus",result.data.ignoredSkus)
        setFieldsValue("totalSks",result.data.totalSks)
        setFieldsValue("failedSkus",result.data.failedSkus)
        // setFieldsValue("failPercentage", result.data.failurePercentage)
        stepWizard.goToStep(3)
      }
    } else if (result) {
      setIsProcessing(false)
      setFieldsValue("isImportFailed", true)
      if (result.data && result.data.description) {
        setFieldsValue("errorMessage", result.data.description)
      } else {
        setFieldsValue(
          "errorMessage",
          i18n.t("importdata.requestFailedMessage")
        )
      }
      stepWizard.goToStep(3)
    } else if (!isNetworkError) {
      setFieldsValue("errorMessage", i18n.t("importdata.requestFailedMessage"))
      stepWizard.goToStep(3)
      setIsProcessing(false)
      setFieldsValue("isImportFailed", true)
    }
    setFieldsValue("totalRecords", null)
    setFieldsValue("insertedRows", null)
  }

  const setInstance = (e) => {
    stepWizard = e
  }

  const handleToastHide = () => {
    setIsToastMsg(false)
    setIsGridCheckBox(false)
  }

  return (
    <div>
      <ToastModal
        show={isToastMsg}
        title={toastHeading}
        titleBackgroundColor={titleBackgroundColor}
        content={toastContent}
        size={toastSize}
        onModalHide={handleToastHide}
      />
     
      <div className="p-grid common-header-section">
        <h5 className="p-m-0 p-col-12  page-header">
        <AttributeIcon /> {i18n.t("attribute.pagetitle")}
        </h5>
      </div>

      <PimerceDataTable
        isHeaderButtonVisible={true}
        columnData={gridColumn}
        data={gridData}
        isSelectedRowCleared={isSelectedRowCleared}
        totalRecords={totalRecords}
        isPaginator={true}
        isScrollable={false}
        isLazy={true}
        // gridHeader={gridHeader}
        popupHeader={popupHeader}
        isPopupCancelBtn={false}
        // headerButtonsGrb={gridData && gridData.length > 0 ? headerButtonGroup : []}
        isToolbar={true}
        deleteButtonLabel={deleteButtonLabel}
        updateButtonLabel={i18n.t("attributeDialogText.updateButtonLabel")}
        isGridCheckBox={authJson["6"].isEnabled ? isGridCheckBox : true}
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
        onRowEditCancel={onRowEditCancel}
        onRowEditInit={onRowEditInit}
        enableRowEdit={authJson["6"].isEnabled}
        // Attribute Search box
        isAutoCompleteSearch={true}
        onautoComplete={autocompleteDropdown}
        pageDataReset={pageDataReset}
        sortData={[{ field: "attrName", order: -1 }]}
        // header Button props
        headerButtonTemplate={buttonTemplate()}
      />
      {/* <Toolbar className="p-mb-4" left={buttonTemplate} /> */}
      {clickEvent === CREATE ? (
        <ModalComponent
          isShowModal={isGridDialog}
          onHideModal={hideDialog}
          modalTitle={i18n.t("attributePopupHeaders.createAttributes")}
          modalContent={addAttribute()}
          modalSize="md"
          modalDailogClassName="modalDailogContent p-fluid modal-md-cus_size attribute-footer attribute-body attr-header"
        />
      ) : null}
      {clickEvent === GROUP ? (
        <ModalComponent
          isShowModal={assignGroup}
          onHideModal={hideDialog}
          modalFooter
          modalTitle={i18n.t("attributePopupHeaders.groupingAttribute")}
          modalContent={groupAttribute()}
          modalSize="xl"
          modalDailogClassName="attribute-group modalDailogContent p-fluid modal-md-cus-size-group attribute-footer attribute-group-header"
        />
      ) : null}
     
      {/* {clickEvent === GROUP ? (
        <ModalComponent
          isShowModal={isGridDialog}
          onHideModal={hideDialog}
          modalTitle={i18n.t("attributePopupHeaders.groupingAttribute")}
          modalContent={groupAttribute()}
          modalSize="lg"
          modalDailogClassName="modalDailogContent p-fluid dialogue-box-style modal-md-cus_size_group attribute-footer attribute-header"
        />
      ) : null} */}

      <ModalComponent
        isShowModal={isDeleteRecordsDialog}
        onHideModal={onHideMultipleDeleteDialog}
        modalTitle={i18n.t("attributePopupHeaders.deleteAttribute")}
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

      <Dialog
        header={i18n.t("importdata.importAttributes")}
        closable={!isProcessing}
        className="import-popup"
        visible={isShowUploadModal}
        onHide={hideUploadModal}
      >
        <div>{uploadAsset()}</div>
      </Dialog>
    </div>
  )
}

export default connect(mapStateToProps)(Attribute)
