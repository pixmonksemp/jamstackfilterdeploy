import React, { useContext, useEffect, useState , useRef } from "react"
import "./style.scss"
// import "../skulist/style.scss"
import editIcon from "../../../assets/editIcons.svg"
import Deleteicon from "../../../common/icons/deleteicon"
import {
  getAssetRequestObject,
  bulkDownloadRequest,
  assetSearchRequest,
} from "../../../common/master-data"
import { Button } from "primereact/button"
import i18n from "../../../translate/i18n"
import { Col, Row } from "react-bootstrap"
import DropdownButton from "react-bootstrap/DropdownButton"
import ToastModal from "../../modal/ToastModal"
import makeAnimated from "react-select/animated"
import * as Yup from "yup"
import {
  ERROR_BG_COLOR,
  MEDIUM,
  TOTALASSET,
} from "../../../common/common-constants"
import ModalComponent from "../../modal/index"
// import Autocomplete from "@pixmonks/auto-complete"
import Autocomplete from "../skulist/autocomplete"
import PimerceAuth from "../../authorization-tag/PimerceAuth"
import PREVIEW from "../../../assets/no_preview.png"
import VIDEO_PREVIEW from "../../../assets/video_preview.png"
import AssetDetails from "./asset-details"
import HeaderContext from "../../../common/header-context"
import FilterAndAppliedFilter from "../../filter/components/filter-appliedfilter-combine-component/filter-appliedfilter-component"
import { connect } from "react-redux"
import multiSelect from "../../../assets/multiSelect.svg"
import PimerceDataView from "../../data-view/dataview"
import { Formik, Form, Field, ErrorMessage, FastField } from "formik"
import { Accordion, AccordionTab } from "primereact/accordion"
import Select from "react-select/creatable"
import { optionStylesForTag } from "../../searchable-select/searchable-dropdown-constant"
import { removeArrayObjectDuplicates } from "../../filter/components/filter-component/filterdata-constant"
import PDF_PREVIEW from "../../../assets/PDf.png"
import AssetIcon from "../../../common/icons/digitalAsseticon"

const mapStateToProps = (state) => {
  return {
    getFilterDataValue: state.stateData.getFilterdata,
    getUserDetail: state.userDetail.getUsersObj.userCredentials,
  }
}
let setFieldsValue,
    toastObj = {
    toastHeading: "",
    toastContent: "",
    titleBackgroundColor: "",
    toastSize: "",
  },
  /**
   * Dynamic rendering mandatory columns (content_name,content_desc,content_image)
   */
  dataViewColumn = [
    {
      field: "id",
      match: "id"
    },
    {
      field: "assetName",
      match: "content_name"
    },
    {
      field: "assetSize",
      match: "content_desc"
    },
    {
      field: "assetImage",
      match: "content_image"
    },
    {
      field: "assetType",
      match: "content_type"
    },
    {
      field: "assetUrl",
      match: "assetUrl"
    }
  ]
  
function assetListing(props) {
  const { getFilterDataValue, getUserDetail } = props
  
  let filterOptions = getFilterDataValue
    ? JSON.parse(getFilterDataValue.organization.defaultoption.FilterDropdowns)
    : null
  let initialRequestDam = getFilterDataValue
    ? getFilterDataValue.initialRequest.DAM
    : null
  let userDetails = getUserDetail
  let authJson = JSON.parse(sessionStorage.getItem("authJson"))
  let userDetail =
    userDetails &&
    userDetails.organizationid &&
    parseInt(userDetails.organizationid)
  let productSkuArr = [],
      deleteMessage = i18n.t("assetlisting.deleteMessage"),
      records = i18n.t("assetlisting.records")
  const animatedComponents = makeAnimated()
  const ref = useRef(null)
  const [isToastMsg, setIsToastMsg] = useState(false)
  const [toastData, setToastData] = useState(toastObj)
  const [assetList, setAssetList] = useState([])
  const [assetRequestObject, setAssetRequestObject] = useState(null)
  const [isAssetList, setIsAssetList] = useState(false)
  const [associatedAssetList, setAssociatedAssetList] = useState([])
  const [locale, setLocale] = useState(null)
  const [loader, setLoader] = useState(false)
  const [searchOptions, setSearchOptions] = useState([])
  const [isfilterPageable, setIsFilterPageable] = useState(false)
  const [productSkuList, setProductSkuList] = useState([])
  const [isShowUploadModal, setIsShowUploadModal] = useState(false)
  const [uploadType, setUploadType] = useState(false)
  const [isLocal, setIsLocal] = useState(false)
  const [isShowPopUp, setIsShowPopUp] = useState(false)
  const [sendAssetData, setSendAssetData] = useState(null)
  const [validAssetExtentions, setValidAssetExtentions] = useState([])
  const [filterCheck, setFilterCheck] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchKey, setSearchKey] = useState("")
  const [searchKeyChange, setSearchKeyChange] = useState("")
  const [checkValue, setCheckValue] = useState([])
  const [updateDeleteRequst, setUpdateDeleteRequest] = useState(null)
  const [isSearchDataClear, setIsSearchDataClear] = useState(false)
  const [pageData, setPageData] = useState(null)
  const [isCleared, setIsCleared] = useState(false)
  const [FilterApplied, setIsFilterApplied] = useState(false)
  const [isDisableDeleteButton, setIsDisableDeleteButton] = useState(true)
  const [isDisableUpdateButton, setIsDisableUpdateButton] = useState(true)
  const [isDeleteRecordsDialog, setIsDeleteRecordsDialog] = useState(false)
  const [onSelected, setOnSelected] = useState([])
  const [autoClose, setAutoClose] = useState(false)
  const [isDownloadDisable, setIsDownloadDisable] = useState(false)
  const [renderTagOption, setRenderTagOption] = useState(null)
  const [assetsRequestObject, setAssetsRequestObject] = useState(null)
  const [editFlag, setEditFlag] = useState(false)
  const [isToastMsgs, setIsToastMsgs] = useState(null)
  const [isValuePresent, setIsValuePresent] = useState(false)
  const [isAutoCompleteLoaderFlag, setIsAutoCompleteLoaderFlag] = useState(false)
  const [totalRecords, setTotalRecords] = useState(null)
  // Tags State
  const [format, setFormat] = useState({})
  const [tags, setTags] = useState([])
  const [fromSize, setFromSize] = useState("")
  const [toSize, setToSize] = useState("")
  //
  const [metaTagData , setMetaTagData] = useState(null)
  const [isFilterBtnDisabled, setIsFilterBtnDisabled] = useState(false)
  const [dropdownOptionList,setDropdownOptionList] = useState([])
  const [date,setDate] = useState(new Date())
  // Filter initial render flag
  const [tagOption, setTagOption] = useState([])
  const [filteredDownloadIds , setFilteredDownloadIds] = useState([])
  const [isEnter, setIsEnter] = useState(false)
  const [isSelectedRowCleared, setIsSelectedRowCleared] = useState(false)
  const [pageDataReset, setPageDataReset] = useState(false)

  const initialValues={
    format: format,
    tags: tags,
    fromSize: fromSize,
    toSize: toSize,
  }
 
 const {
    IsAssetsBulkImportButtonDock:{IsAssetsBulkImportButton, setIsAssetsBulkImportButton},
    AssetsDockRenderData:{AssetsDockRender, setAssetsDockRender},
    AssetTagDropdownDisabled:{isAssetTagDropdownDisabled,setIsAssetTagDropDownDisabled},
    ProductSkuMethodName: { ProductMethodContextValue, setProductMethodContextValue },
  } = useContext(HeaderContext)

  useEffect(() => {   
      if(AssetsDockRender && assetsRequestObject != null){
        setTimeout(() => {
        props.assetNameSearch(assetsRequestObject)
        }, 3000);
        
       }
    }, [AssetsDockRender])
  

  /**
   * AutoComplete Props
   */
  let autoComplete = {
    optionClassName: "options",
    optionActiveClassName: "option-active",
    noOptionClassName: "no-options-dropdown",
    searchBoxPlaceholderClassName: "search-box-autocomplete",
    searchBarandIconClassName: "",
    searchBarBoxClassName: "search-bar-box search-bar-boxing",
    noOption: i18n.t("dataTableText.noOptions"),
  }

  let AutoComplete = (
    <Autocomplete
      options={searchOptions}
      autoComplete={autoComplete}
      onSearch={(event, id) => onSearchBoxText(event, id)}
      placeholder={i18n.t("dataTableText.skuSearchBoxPlaceholder")}
      isCleared={isCleared}
      isLoader={isAutoCompleteLoaderFlag}
      onChangeValue={(e) => onChangeAutoComplete(e)}
    />
  )

  let DynamicArray = ["Tags", "Format", "Size"]

  let Format = [
    { name: "JPEG" },
    { name: "JPG" },
    { name: "PNG" },
    { name: "WEBP" },
    { name: "MP4" },
    { name: "PDF" },
  ]

  

  // Restrict Browser Back Arrow
  history.pushState(null, null, location.href)
  window.onpopstate = function () {
    history.go(1)
  }

  const uploadAssetFormat = () => {
    setUploadType(true)
    setIsShowUploadModal(true)
    setIsEnter(false)
    setAssetsDockRender(false)
  }

  // const uploadAssetFromCloud = () => {
  //   setIsLocal(false)
  //   setIsCustomUppyStyle(false)
  //   setIsShowUploadModal(true)
  // }

  // const uploadAssetFromLocal = () => {
  //   setIsLocal(true)
  //   setIsCustomUppyStyle(true)
  //   setIsShowUploadModal(true)
  // }

  
  const renderimage = (thumbnailImage,assetType,assetExtension) => {
    return (
      <img
        src={
          thumbnailImage != null && assetType.toUpperCase() != "VIDEO" && assetType.toUpperCase() != "DOCUMENT"
            ? thumbnailImage
            : assetType.toUpperCase() === "VIDEO"
            ? VIDEO_PREVIEW
            : assetType.toUpperCase() === "DOCUMENT"
            ? assetExtension &&
              assetExtension.toUpperCase() === "PDF" &&
              PDF_PREVIEW
            : PREVIEW
        }
        onError={(e) => (e.target.src = PREVIEW)}
        className={"asset-product-img"}
        alt="No Image"
      />
    )
  }

  /**
   * Common iterate map function is used to iterate and return ids list
   * @param {*} data
   * @returns ids
   */
  const hierarchyIdList = (data) => {
    let ids = []
    data.length > 0 &&
      data.map((obj) => {
        ids.push(obj.id)
      })
    return ids
  }

  const formatIterator = (data) =>{
    let filterData = []
    let keys = Object.keys(data);
    let filteredFormat = keys.filter(function(key) {
        return data[key]
    });
    filteredFormat.length > 0 && filteredFormat.map((i)=>{
      filterData.push(i.toUpperCase())
    })
    return filterData
  }

  const tagIterator = (data) =>{
    let values = []
    data.length > 0 &&
      data.map((obj) => {
        values.push(obj.label.trim())
      })
    return values
 }

 const kbToBytesConvertor = (value) =>{
  if(value){
    return (value * 1024)
  }
 }

 const bytesToKbConvertor = (fileSize) => {
   if (fileSize) {
     let fileSizeData = (fileSize / 1024).toString()
     if (fileSizeData.includes(".")) {
       const fileSizeBeforeDecimal = fileSizeData && fileSizeData.split(".")[0]
       const fileSizeAfterDecimal =fileSizeData && fileSizeData.split(".")[1].substring(0, 2)
       return fileSizeBeforeDecimal + "." +fileSizeAfterDecimal + " KB"
     } else {
       return fileSizeData + " KB"
     }
   }else{
      return fileSize + " KB"
   }
 }

  const handleToastHide = () => {
    if(isValuePresent || isToastMsgs){
      setIsToastMsg(false)
      setIsToastMsgs(false)
      setIsShowPopUp(false)
      setIsValuePresent(false)
      props.assetNameSearch(assetsRequestObject)
    }else{
    setIsToastMsg(false)
    setIsDownloadDisable(false)}
  }

  const selectCheckBoxTemplate = (selectedRow) => {
    if (selectedRow && selectedRow.length > 0) {
      setIsDisableDeleteButton(false)
      setIsDisableUpdateButton(false)
    } else {
      setIsDisableDeleteButton(true)
      setIsDisableUpdateButton(true)
    }
    setOnSelected(selectedRow)
  }

  const prepareDeleteCount = () => {
    let selected = removeArrayObjectDuplicates(onSelected, 'content_name')
    if (selected != null && selected.length > 1) {
      return ' ' + selected.length + " " + records + '  ?  '
    }
    if (selected != null && selected.length == 1) {
      return selected != null && selected.length != 0
        ? ' "' + selected[0].content_name + '" ?'
        : null
    }
  }

  const downloadTemplate = () =>{
    const link = document.createElement("a")
    link.href ="https://sgp1.digitaloceanspaces.com/pixmonksdevspace/pimcollections/organizationAssets/Asset%20Default%20Template.xlsx"
    link.setAttribute("download", "Attribute Template.xlsx") //or any other extentions
    document.body.appendChild(link)
    link.click()
  }

  const downloadAll = () => {
    if(assetsRequestObject && assetsRequestObject.baseFilterVO && assetsRequestObject.baseFilterVO.moduleName && assetsRequestObject.baseFilterVO.moduleName === 'PIM Asset'){
      let request = bulkDownloadRequest
      request.ids = onSelected && onSelected.length > 0 ? hierarchyIdList(onSelected) : filteredDownloadIds
      request.organizationId = userDetail
      request.downloadType = "SELECTED"
      request.toEmailId = userDetails && userDetails.userName
      props.assetBulkDownloads(request)
      let toast = toastData
      toast.titleBackgroundColor = ERROR_BG_COLOR
      toast.toastHeading = i18n.t("assetlisting.AssetDownloadStarted")
      toast.toastContent = i18n.t("assetlisting.SelectedAssetDownloadInitiated")
      toast.size = MEDIUM
      setToastData(toast)
      // setIsToastMsg(true)
      setIsDownloadDisable(true)
      setAssociatedAssetList([])
      setOnSelected([])
      request.ids = []
  }else{
      let request = bulkDownloadRequest
      request.ids = onSelected && onSelected.length > 0 ? hierarchyIdList(onSelected) : []
      request.organizationId = userDetail
      request.toEmailId = userDetails && userDetails.userName
      request.downloadType = onSelected && onSelected.length > 0 ? "SELECTED" : "ALL" 
      props.assetBulkDownloads(request)
      let toast = toastData
      toast.titleBackgroundColor = ERROR_BG_COLOR
      toast.toastContent = onSelected && onSelected.length > 0 ? i18n.t("assetlisting.SelectedAssetDownloadInitiated") :"Bulk Assets Download Initiated..."
      toast.toastHeading = "Assets Download Started"
      toast.size = MEDIUM
      setToastData(toast)
      // setIsToastMsg(true)
      setIsDownloadDisable(true)
      setAssociatedAssetList([])
      setOnSelected([])
      request.ids = []
  }
  }

  const deleteAsset = () => {
    setIsDeleteRecordsDialog(true)
  }

  const onHideMultipleDeleteDialog = () => {
    setIsDeleteRecordsDialog(false)
  }

  const deleteAssetSku = () => {
    let deleteRows
    if (onSelected && onSelected.length != null) {
      deleteRows = hierarchyIdList(onSelected)
    }
    let request = getAssetRequestObject
    request.ids = deleteRows
    request.organizationId = userDetail
    props.deleteAssets(request)
    setUpdateDeleteRequest(request)
  }

  const deleteAttrDialogue = (
    <React.Fragment>
      <Button
        label={"No"}
        className="p-button-text custom-button cancel-button"
        onClick={() => onHideMultipleDeleteDialog()}
      />
      <Button
        label={"Yes"}
        className="p-button-text custom-button btn-yes"
        onClick={() => deleteAssetSku()}
      />
    </React.Fragment>
  )

  const assetSearchData = (pagedata) =>{  
      setLoading(true)
      let request = assetSearchRequest
      request.ids = metaTagData && metaTagData.ids ? metaTagData.ids : []
      request.fromIndex = pagedata.page ? pagedata.page * 15 : 0
      request.size = pagedata && pagedata.rows
      request.organizationId = userDetail
      request.searchKey = searchKey ? searchKey : ""
      request.extentions = metaTagData && metaTagData.extentions && metaTagData.extentions != null ? metaTagData.extentions : []
      request.metaTags = metaTagData &&  metaTagData.metaTags && metaTagData.metaTags != null ? metaTagData.metaTags : []
      request.sizeStart = metaTagData && metaTagData.sizeStart && metaTagData.sizeStart != null ? metaTagData.sizeStart : null
      request.sizeEnd = metaTagData && metaTagData.sizeEnd && metaTagData.sizeEnd != null ? metaTagData.sizeEnd : null
      setAssetRequestObject(request)
      props.assetNameSearch(request, null)
  } 

  /**
   * This method is used to paginate FisrtRow and size
   * @param {*} event
   */
  const onPageChange = (event) => {
    // window.scrollTo({ top: 0, behavior: "smooth" })
    setLoading(true)
    setPageDataReset(false)
    assetListPaginator(event)
  }

  /**
   * This method is used to onPageChange paginate function to send data using get and search api calls
   * @param {*} pagedata
   */
  const assetListPaginator = (pagedata) => {
    setPageData(pageData)
    assetSearchData(pagedata)
  }


  useEffect(() => {
    const { updateAssetMetaTagsResult } = props
    if (
      updateAssetMetaTagsResult &&
      updateAssetMetaTagsResult.content &&
      updateAssetMetaTagsResult.content.data &&
      updateAssetMetaTagsResult.content.status == 200
    ) {
      let toast = toastData && toastData
      toast.titleBackgroundColor = ERROR_BG_COLOR
      toast.toastContent = "Tags Updated Successfully"
      toast.toastHeading = "Update Tag"
      toast.size = MEDIUM
      setToastData(toast)
      setIsToastMsg(true)
      setEditFlag(true)
    }
    if (
      updateAssetMetaTagsResult &&
      updateAssetMetaTagsResult.content &&
      updateAssetMetaTagsResult.content.data &&
      updateAssetMetaTagsResult.content.status != 200
    ) {
      let toast = toastData && toastData
      toast.titleBackgroundColor = ERROR_BG_COLOR
      toast.toastContent = "Failed to update Tags"
      toast.toastHeading = "Update Tag"
      toast.size = MEDIUM
      setToastData(toast)
      setIsToastMsg(true)
      setEditFlag(true)
    }
  }, [props.updateAssetMetaTagsResult])

  useEffect(() => {
    const { getOrganizationDetailsResult } = props
    if (
      getOrganizationDetailsResult &&
      getOrganizationDetailsResult.content &&
      getOrganizationDetailsResult.content.data
    ) {
      let userMandatoryColumn =
        getOrganizationDetailsResult.content.data.orgSpec &&
        JSON.parse(getOrganizationDetailsResult.content.data.orgSpec)
      let orgName = getOrganizationDetailsResult.content.data.orgname
      // let columnList =
      //   userMandatoryColumn &&
      //   userMandatoryColumn[orgName] &&
      //   userMandatoryColumn[orgName].mandatoryColumns
      let assetExtentions = []
      userMandatoryColumn &&
        userMandatoryColumn[orgName] &&
        userMandatoryColumn[orgName].validImgExtensions.map((i) => {
          assetExtentions.push("." + i)
        })
      userMandatoryColumn &&
        userMandatoryColumn[orgName] &&
        userMandatoryColumn[orgName].validVideoExtensions.map((i) => {
          assetExtentions.push("." + i)
        })
      userMandatoryColumn &&
        userMandatoryColumn[orgName] &&
        userMandatoryColumn[orgName].validDocumentExtensions &&
        userMandatoryColumn[orgName].validDocumentExtensions.map((i) => {
          assetExtentions.push("." + i)
        })
      setValidAssetExtentions(assetExtentions)
    }
  }, [props.getOrganizationDetailsResult])

  useEffect(() => {
    const { getMasterTagsResult } = props
    if (
      getMasterTagsResult &&
      getMasterTagsResult.content &&
      getMasterTagsResult.content.status == "200"
    ) {
      let TagData =
        getMasterTagsResult.content.data &&
        getMasterTagsResult.content.data.content.map((data) => {
          const dataValue = {}
          Object.assign(dataValue, {
            label: data.tag,
            value: data.tag,
          })
          return dataValue
        })
      setRenderTagOption(TagData)
      if (
          getMasterTagsResult.content.data.content &&
          getMasterTagsResult.content.data.content.length > 0
      ) {
          let tagOption = []
          getMasterTagsResult.content.data.content.map((tagItem) => {
            tagOption.push({
                id: tagItem.tag,
                name: tagItem.tag,
                value: tagItem.tag,
                label: tagItem.tag,
            })
          })
          setTagOption(tagOption)
      }
    }
  }, [props.getMasterTagsResult])

  useEffect(() => {
    const { getAssetByIdResult } = props
    if (
      getAssetByIdResult &&
      getAssetByIdResult.content &&
      getAssetByIdResult.content.status == "200"
    ) {
      let assetIdByData = getAssetByIdResult && getAssetByIdResult.content && getAssetByIdResult.content.data != undefined  && getAssetByIdResult.content.data
      redirectToImageEditor(assetIdByData)
    }
    if (
      getAssetByIdResult &&
      getAssetByIdResult.content &&
      getAssetByIdResult.content.status != "200"
    ) {
          let toast = toastData
          toast.titleBackgroundColor = ERROR_BG_COLOR
          toast.toastContent = "Image Editor Redirection Failed"
          toast.toastHeading = "Request Failed"
          toast.size = MEDIUM
          setToastData(toast)
          setIsToastMsg(true)
    }
  }, [props.getAssetByIdResult])


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

  useEffect(() => {
     if(isValuePresent){
          let toast = toastData
          toast.titleBackgroundColor = ERROR_BG_COLOR
          toast.toastContent = "This asset has been deleted and is no longer available for update"
          toast.toastHeading = "Request Failed"
          toast.size = MEDIUM
          setToastData(toast)
          setIsToastMsg(true)
     }  
     if(isToastMsgs){
      let toast = toastData
      toast.titleBackgroundColor = ERROR_BG_COLOR
      toast.toastContent = i18n.t("toastMessage.requestFailedMessage")
      toast.toastHeading = i18n.t("toastMessage.requestFailed")
      toast.size = MEDIUM
      setToastData(toast)
      setIsToastMsg(true)
     }
  }, [isValuePresent,isToastMsgs])

  /**
   * AssetSearchResult is used to search the assets
   */
  useEffect(() => {
    const { assetSearchResult } = props
    if (
      assetSearchResult &&
      assetSearchResult.content &&
      assetSearchResult.content.data
    ) {
      let assetNameList = []
      assetSearchResult &&
        assetSearchResult.content.data.assetsDTOList.length > 0 &&
        assetSearchResult.content.data.assetsDTOList.map((i) => {
          const dataValue = {}
          Object.assign(dataValue, {
            id: i.id,
            assetSize: bytesToKbConvertor(i.assetSize),
            assetName: i.assetName,
            assetType: i.assetType,
            assetImage: renderimage(i.uploadedUrl,i.assetType,i.assetExtension),
            assetUrl : i.uploadedUrl,
            isChecked: false,
          })
          let assetName = dataValue.assetName
          if (assetNameList.indexOf(assetName) === -1) {
            assetNameList.push(assetName)
          }
        })
      setSearchOptions(assetNameList)
      setIsAutoCompleteLoaderFlag(false)
      // This condition is used to Check empty of searchkey and assetList
      if (searchKeyChange == "") {
        setSearchOptions([])
      }
    }

    if (
      assetSearchResult &&
      assetSearchResult.content &&
      assetSearchResult.content.status != 200
    ) {
      let toast = toastData
      toast.titleBackgroundColor = ERROR_BG_COLOR
      toast.toastContent = i18n.t("toastMessage.requestFailedMessage")
      toast.toastHeading = i18n.t("toastMessage.requestFailed")
      toast.size = MEDIUM
      setToastData(toast)
      setIsToastMsg(true)
      setIsAutoCompleteLoaderFlag(false)
    }
  }, [props.assetSearchResult])

  /**
   * AssetNameSearchResult is used to render searched asset in asset page
   */
  useEffect(() => {
    const { assetNameSearchResult } = props
    if (
      assetNameSearchResult &&
      assetNameSearchResult.content &&
      assetNameSearchResult.content.data
    ) {
      if (assetNameSearchResult.content.data.assetsDTOList && assetNameSearchResult.content.data.assetsDTOList.length > 0) {
        setAssetList(assetNameSearchResult.content.data.assetsDTOList.map(i=>{
            const dataValue = {}
            Object.assign(dataValue, {
              id: i.id,
              assetSize: bytesToKbConvertor(i.assetSize),
              assetName: i.assetName,
              assetType: i.assetType,
              assetImage: renderimage(i.uploadedUrl,i.assetType,i.assetExtension),
              assetUrl : i.uploadedUrl,
              isChecked: false,
            })
            return dataValue
        }))
        setFilteredDownloadIds(
          assetNameSearchResult.content.data.listOfValues &&
          assetNameSearchResult.content.data.listOfValues.length > 0
          ? assetNameSearchResult.content.data.listOfValues
          : []
        )
        setTotalRecords(assetNameSearchResult && assetNameSearchResult.content.data.assetsDTOList[0].totalElement)
        setLoader(false)
        setLoading(false)
      } else {
        setAssetList([])
        setLoader(false)
        setLoading(false)
       // setAssetsRenderFlag(true)
      }
    }
    if (
      assetNameSearchResult &&
      assetNameSearchResult.content &&
      assetNameSearchResult.content.status != 200
    ) {
      let toast = toastData
      toast.titleBackgroundColor = ERROR_BG_COLOR
      toast.toastContent = i18n.t("toastMessage.requestFailedMessage")
      toast.toastHeading = i18n.t("toastMessage.requestFailed")
      toast.size = MEDIUM
      setToastData(toast)
      setIsToastMsg(true)
      setSearchOptions([])
    }
  }, [props.assetNameSearchResult])

  /**
   * This result will delete Asset List and again call to get the assetList data
   */
  useEffect(() => {
    const { deleteAssetsResult } = props
    if (
      deleteAssetsResult &&
      deleteAssetsResult.content &&
      deleteAssetsResult.content.data &&
      deleteAssetsResult.content.status == 200
    ) {
      if (deleteAssetsResult.content.data.errorCode == "200") {
        // After deleting asset using asseet ids then re-iterate the assetList function
        let toast = toastData
        toast.titleBackgroundColor = ERROR_BG_COLOR
        toast.toastHeading = i18n.t("assetlisting.DeleteAssets")
        toast.toastContent = i18n.t("assetlisting.SelectedAssetsDeleted")
        toast.size = MEDIUM
        setToastData(toast)
        setIsToastMsg(true)
        setIsDeleteRecordsDialog(false)
        setIsDisableDeleteButton(true)
        setOnSelected([])
        setIsSelectedRowCleared(true)
        updateDeleteRequst.ids = []
        let request = assetSearchRequest
        request.ids = metaTagData && metaTagData.ids ? metaTagData.ids : []
        request.organizationId = userDetail
        request.searchKey = searchKey ? searchKey : ""
        request.extentions = metaTagData && metaTagData.extentions && metaTagData.extentions != null ? metaTagData.extentions : []
        request.metaTags = metaTagData &&  metaTagData.metaTags && metaTagData.metaTags != null ? metaTagData.metaTags : []
        request.sizeStart = metaTagData && metaTagData.sizeStart && metaTagData.sizeStart != null ? metaTagData.sizeStart : null
        request.sizeEnd = metaTagData && metaTagData.sizeEnd && metaTagData.sizeEnd != null ? metaTagData.sizeEnd : null
        props.assetNameSearch(request)
      }
      if (deleteAssetsResult.content.data.errorCode == "101") {
        // After deleting asset  with associate and non-associate values using asset ids then re-iterate the assetList function
        let description =
          deleteAssetsResult &&
          deleteAssetsResult.content.data &&
          deleteAssetsResult.content.data.deleteMsg
        let toast = toastData
        toast.titleBackgroundColor = ERROR_BG_COLOR
        toast.toastContent = description && description
        toast.toastHeading = i18n.t("assetlisting.DeleteAssets")
        toast.size = MEDIUM
        setToastData(toast)
        setIsToastMsg(true)
        updateDeleteRequst.ids =  []
        let request = assetSearchRequest
        request.ids = metaTagData && metaTagData.ids ? metaTagData.ids : []
        request.organizationId = userDetail
        request.searchKey = searchKey ? searchKey : ""
        request.extentions = metaTagData && metaTagData.extentions && metaTagData.extentions != null ? metaTagData.extentions : []
        request.metaTags = metaTagData &&  metaTagData.metaTags && metaTagData.metaTags != null ? metaTagData.metaTags : []
        request.sizeStart = metaTagData && metaTagData.sizeStart && metaTagData.sizeStart != null ? metaTagData.sizeStart : null
        request.sizeEnd = metaTagData && metaTagData.sizeEnd && metaTagData.sizeEnd != null ? metaTagData.sizeEnd : null
        props.assetNameSearch(request)
      }
      setAssociatedAssetList([])
      setCheckValue([])
      setIsDeleteRecordsDialog(false)
      setIsDisableDeleteButton(true)
      setOnSelected([])
      setIsSelectedRowCleared(true)
      // setSearchBoxCleared(true)
        // setSearchKey("")
    }
    if (
      deleteAssetsResult &&
      deleteAssetsResult.content &&
      deleteAssetsResult.content.data &&
      deleteAssetsResult.content.status != 200
    ) {
      // After deleting asset ids using asset values then callback asset getapicall
      setTimeout(() => {
      updateDeleteRequst.ids = []
      let request = assetSearchRequest
        request.ids = metaTagData && metaTagData.ids ? metaTagData.ids : []
        request.organizationId = userDetail
        request.searchKey = searchKey ? searchKey : ""
        request.extentions = metaTagData && metaTagData.extentions && metaTagData.extentions != null ? metaTagData.extentions : []
        request.metaTags = metaTagData &&  metaTagData.metaTags && metaTagData.metaTags != null ? metaTagData.metaTags : []
        request.sizeStart = metaTagData && metaTagData.sizeStart && metaTagData.sizeStart != null ? metaTagData.sizeStart : null
        request.sizeEnd = metaTagData && metaTagData.sizeEnd && metaTagData.sizeEnd != null ? metaTagData.sizeEnd : null
          props.assetNameSearch(request)
      let toast = toastData
      toast.titleBackgroundColor = ERROR_BG_COLOR
      toast.toastContent = i18n.t("toastMessage.requestFailedMessage")
      toast.toastHeading = i18n.t("assetlisting.DeleteAssets")
      toast.size = MEDIUM
      setToastData(toast)
      setIsToastMsg(true)
      setCheckValue([])
      setSearchBoxCleared(true)
      setSearchKey("")
      setIsDeleteRecordsDialog(false)
      setIsDisableDeleteButton(true)
      setOnSelected([])
    }, 4000);
    }
  }, [props.deleteAssetsResult])

  /**
   * This effect result will be used to send overall asset data to reg mail
   */
  useEffect(() => {
    const { assetBulkDownloadsResult } = props
    setIsToastMsg(false)
    if (
      assetBulkDownloadsResult &&
      assetBulkDownloadsResult.content &&
      assetBulkDownloadsResult.content.data
    ) {
      let toast = toastData
      toast.titleBackgroundColor = ERROR_BG_COLOR
      toast.toastHeading = i18n.t("assetlisting.downloadSuccessful")
      toast.toastContent = i18n.t("assetlisting.AssetSendMail")
      toast.size = MEDIUM
      setAutoClose(true)
      setToastData(toast)
      setIsToastMsg(true)
      setIsDownloadDisable(false)
      // setAssociatedAssetList([])
      // setOnSelected([])
      setIsSelectedRowCleared(true)
    }
    if (
      assetBulkDownloadsResult &&
      assetBulkDownloadsResult.content &&
      assetBulkDownloadsResult.content.status !== 200
    ) {
      let toast = toastData
      toast.titleBackgroundColor = ERROR_BG_COLOR
      toast.toastContent = i18n.t("assetlisting.AssetsDownload")
      toast.toastHeading = i18n.t("assetlisting.DownloadFailed")
      toast.size = MEDIUM
      setAutoClose(true)
      setToastData(toast)
      setIsToastMsg(true)
      setIsDownloadDisable(false)
      // setAssociatedAssetList([])
      // setOnSelected([])
      setIsSelectedRowCleared(true)
    }
  }, [props.assetBulkDownloadsResult])

  /**
   * This method is used again call getAssetList callBack function
   */
  const assetCallBack = () => {
    setLoader(true)
    setLoading(true)
    setAssetList([])
    let request = getAssetRequestObject
    request.ids = []
    request.pageStart = 0
    request.organizationId = userDetail
    setPageDataReset(true)
    setIsAssetList(false)
    let requestAssetSearch = assetSearchRequest
    requestAssetSearch.ids = metaTagData && metaTagData.ids ? metaTagData.ids : []
    requestAssetSearch.fromIndex = 0
    requestAssetSearch.organizationId = userDetail
    requestAssetSearch.searchKey = ""
    requestAssetSearch.extentions = metaTagData && metaTagData.extentions && metaTagData.extentions != null ? metaTagData.extentions : []
    requestAssetSearch.metaTags = metaTagData &&  metaTagData.metaTags && metaTagData.metaTags != null ? metaTagData.metaTags : []
    requestAssetSearch.sizeStart = metaTagData && metaTagData.sizeStart && metaTagData.sizeStart != null ? metaTagData.sizeStart : null
    requestAssetSearch.sizeEnd = metaTagData && metaTagData.sizeEnd && metaTagData.sizeEnd != null ? metaTagData.sizeEnd : null
    props.assetNameSearch(requestAssetSearch)
  }

  const redirectToImageEditor = (redirectedData) =>{
    if(redirectedData != null || redirectedData != undefined){
      const data = {
        key: "imageEditor",
      }
      if(!props.redirectType){
        props.history.push({
        pathname: "/imageEditor",
        state: { assetData: redirectedData },
      })
        props.triggerPageLayout(data)
        }
      }
  }

  /**
   * This method is used to check type of url is video or not.
   * @param {*} url
   * @returns Boolean
   */
  const validateExtension = (url) => {
    let format = url && url
    let formatText = "VIDEO"
    let formatTextDoc = "DOCUMENT"
    if (format && format.toUpperCase() === formatText) {
      return false 
    }
    if (format && format.toUpperCase() === formatTextDoc) {
      return false 
    } else {
      return true
    }
  }

  const validateTypeFromProductSku = (assetType) =>{
    if(props.assetTypeSku == assetType){
      return false
    }else{
      return true
    }
  }

  /**
   * This method is used to navigate asset state from image editor Component
   * @param {*} asset
   */
  const ImageEditor = (asset) => {
    if(asset.length > 0)
    props.getAssetById(null,asset[0].id) 
  }

  const onAssociateAsset = () => {
    if (props.assetIds.includes(onSelected[0].id)) {
      let toast = toastData
      toast.titleBackgroundColor = ERROR_BG_COLOR
      toast.toastContent = i18n.t("assetlisting.duplicateAssets")
      toast.toastHeading = (ProductMethodContextValue == "CREATE" ? "Add" : "Update") + " Product"
      toast.size = MEDIUM
      setToastData(toast)
      setIsToastMsg(true)
    } else {
      props.updateClicked({
        id: onSelected[0].id,
        sourceUrl: onSelected[0].assetUrl,
      })
      if (props.fromSkuList) {
        setOnSelected([])
        setIsSelectedRowCleared(true)
      }
    }
  }

  /**
   * This method is used to search asset data and show suggestion box
   * @param {*} e
   */
   const onChangeAutoComplete = (e) => {
    setIsCleared(false)
    let data = assetSearchRequest
    data.ids = productSkuList
    data.fromIndex = 0
    data.size = 15
    // data.sortField = "id"
    // data.sortType = "ASC"
    data.organizationId = userDetail
    data.searchKey = e.trim().toLowerCase()
    data.extentions = metaTagData && metaTagData.extentions && metaTagData.extentions != null ? metaTagData.extentions : []
    data.metaTags = metaTagData && metaTagData.metaTags && metaTagData.metaTags != null ? metaTagData.metaTags :[]
    data.sizeStart = metaTagData &&  metaTagData.sizeStart && metaTagData.sizeStart != null ? metaTagData.sizeStart : null
    data.sizeEnd = metaTagData && metaTagData.sizeEnd && metaTagData.sizeEnd != null ? metaTagData.sizeEnd : null
    // setSearchKey(e.trim())
    setSearchKeyChange(e.trim())
    setAssetRequestObject(data)
    if (data.searchKey != "") {
      if (assetList.length > 0) {
        setIsAutoCompleteLoaderFlag(true)
        props.assetSearch(data)
      }
    }
  }

  /**
   * This method to show searchOptions values in assetList Page
   * @param {*} event
   * @param {*} id
   */
  const onSearchBoxText = (event) => {
    setSearchOptions([])
    setIsAutoCompleteLoaderFlag(false)
    let data = assetSearchRequest
    data.organizationId = userDetail
    data.searchKey = event && event.trim().toLowerCase()
    data.size = 15
    data.extentions = metaTagData && metaTagData.extentions && metaTagData.extentions != null ? metaTagData.extentions : []
    data.metaTags = metaTagData && metaTagData.metaTags && metaTagData.metaTags != null ? metaTagData.metaTags :[]
    data.sizeStart = metaTagData && metaTagData.sizeStart && metaTagData.sizeStart != null ? metaTagData.sizeStart : null
    data.sizeEnd = metaTagData && metaTagData.sizeEnd && metaTagData.sizeEnd != null ? metaTagData.sizeEnd : null
    setAssetRequestObject(data)
    setSearchKey(data.searchKey)
    searchOptionsRender(data, event)
    setLoading(false)
  }

  /**
   * This method to render searched asset data will show assetList Page
   * @param {*} data
   * @param {*} event
   */
  const searchOptionsRender = (data, event) => {
    setIsAutoCompleteLoaderFlag(false)
    if (event == undefined && searchOptions.length == 0 && searchKey != "") {
      setAssetList([])
    }
    else if (data.searchKey != "" && event != undefined) {
      props.assetNameSearch(data)
      data.searchKey = ""
      // setLoader(true)
      // setLoading(true)
    }
    // re-render initial-state
    else {
      data.ids = productSkuList
      data.searchKey = ""
      props.assetNameSearch(data)
      setLoading(false)
      setSearchKey("")
      setSearchOptions([])
      setPageDataReset(true)
      setIsAutoCompleteLoaderFlag(false)
    }
  }

  const buttonTemplate = () => {
    return (
      <>
        {props.fromSkuList == undefined ? ( 
          authJson["45"].isEnabled ? (
            <React.Fragment>
              <Button
                label="Delete"
                className="p-button-danger btn-active-17 catalog-btn pimbtn"
                onClick={() => deleteAsset()}
                disabled={isDisableDeleteButton}
              >
                <Deleteicon svgLeftSpace="11px" width="12px" height="12px" />
              </Button>
              <Button
                label="Upload Assets"
                className="asset-upload-button-height btn-active-17 catalog-btn asset-upload-font pimbtn p-button-danger"
                onClick={() => {
                  uploadAssetFormat()
                  setIsAssetTagDropDownDisabled(false)
                }}
                disabled={IsAssetsBulkImportButton}
              />
            </React.Fragment>
          ) : null
         ) : (
          <PimerceAuth
          componentId={"45"}
          componentType="button"
          component={
           <div style={props.fromSkuList ? {marginLeft : "-28px"} : {}}>   
               <Button
                label="Upload Assets"
                className="asset-upload-button-height btn-active-17 catalog-btn asset-upload-font pimbtn p-button-danger mr-1"
                onClick={() => {
                  uploadAssetFormat()
                  setIsAssetTagDropDownDisabled(false)
                }}
                disabled={IsAssetsBulkImportButton}
              />
               <Button
                 onClick={() => onAssociateAsset()}
                 label={i18n.t("assetlisting.update")}
                 className="p-button-danger btn-active-17 catalog-btn pimbtn"
                 disabled={onSelected.length > 0 ? false : true}
               />
               <Button
                 onClick={()=>{props.cancelClicked()
                               setOnSelected([])
                               setIsSelectedRowCleared(true)}}
                 label={i18n.t("commonButton.cancel")}
                 className="p-button-danger btn-active-17 catalog-btn pimbtn"
               />  
           </div>
          }/>
        )}
      </>
    )
  }
  
  const moreOptionsTemplate = () => {
    return (
      <>
        {props.fromSkuList == undefined && (
          authJson["45"].isEnabled ? (
            <React.Fragment>
              <div className="dataview-mulitsort">
                <DropdownButton
                  title={
                    <img
                      src={multiSelect}
                      className="dataview-mulitsort-icon"
                    />
                  }
                >
                  <div className="dataview-multisort-effect-attributes">
                    {authJson["6"].isEnabled && (
                      <>
                        <Button
                          type="button"
                          label="Download Assets"
                          icon=""
                          className="p-button-success btn-active-17 attr-pimbtn downloadAll"
                          style={{
                            width: "-webkit-fill-available",
                            paddingRight: "30px",
                          }}
                          onClick={() => {
                            downloadAll()
                          }}
                          disabled={isDownloadDisable}
                        />
                      </>
                    )}
                    <Button
                      type="button"
                      label="Download Template"
                      icon=""
                      style={{ width: "max-content" }}
                      className="p-button-success btn-active-17 attr-pimbtn downloadTemplateIcon"
                      onClick={() => {
                        downloadTemplate()
                      }}
                    />
                  </div>
                </DropdownButton>
              </div>
            </React.Fragment>
          ) : null
        )}
      </>
    )
  }

  /**
   * close method assetDetails popup
   */
  const onImageClosePopup = () => {
    setIsShowPopUp(false)
  }

  /**
   * This method is used to send state values(sendAssetData) to AssetDetails Component.
   * @return AssetDetails
   */
  const onImageDetailsPopup = () => {
    return (
      <React.Fragment>
        <AssetDetails data={sendAssetData} metaTagData={renderTagOption} metaTagDataSave={metaTagDataSave} editFlag={editFlag} setEditFlag={setEditFlag} setIsToastMsgs={setIsToastMsgs} setIsValuePresent={setIsValuePresent}/>
      </React.Fragment>
    )
  }

  const metaTagDataSave = (data) =>{
    if(data){
      props.updateAssetMetaTags(data)
    }
  }

  /**
   * Initially load of filter component
   * @param {*} data
   * @param {*} status
   */
  const initialRenderFilter = (data, status, enableOptionList) => {

    if (status === "initial" || status === "reset" || status === "navigation") {
      setDate(new Date())
      props.getOrganizationDetails(null, parseInt(userDetails.organizationid))
      const requestData ={
        organizationId : userDetail,
        pageStart : 0,
        pageEnd : 1000,
        sortField : "tag",
        sortType : "ASC" 
      }
      props.getMasterTags(requestData)
      setLoader(true)
      // setLoading(true)
      setIsSearchDataClear(true)
      setIsFilterPageable(false)
      setPageDataReset(true)
      setAssetList([])
      setFormat({})
      setTags([])
      setFromSize('')
      setToSize('')
      setDropdownOptionList(enableOptionList)
      setMetaTagData(null)
      setSearchKey("")
      let requestParams = {}
      requestParams.moduleName = ''
      assetSearchRequest.baseFilterVO = requestParams
      assetSearchRequest.extentions = []
      assetSearchRequest.metaTags = []
      assetSearchRequest.sizeStart = null
      assetSearchRequest.sizeEnd = null
      assetSearchRequest.pimerceOrgId = getFilterDataValue.organization.id;
      assetSearchRequest.organizationId = userDetail;
      assetSearchRequest.searchKey = ""
      assetSearchRequest.fromIndex = 0
      setAssetsRequestObject(assetSearchRequest)
      props.assetNameSearch(assetSearchRequest, null)
    }
  }

  /**
   * Apply of filter Component
   * @param {*} isRetailerStatus
   * @param {*} applyStatus
   * @param {*} commonReducerName
   * @param {*} isExport
   */
  const handleApplyFilter = (
    isRetailerStatus,
    applyStatus,
    commonReducerName,
    appliedData
  ) => {
    setDate(new Date())
    if (commonReducerName&&commonReducerName != "clear") {
      setIsFilterApplied(true)
      setFilterCheck(applyStatus)
      setLoader(true)
      setLoading(true)
      setIsFilterPageable(true)
      setAssociatedAssetList([])
      setPageDataReset(true)
      setSearchKey("")
      setIsCleared(true)
      let requestFilterApply = assetSearchRequest
      let requestParams = {}
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
      requestParams.moduleName = 'PIM Asset'
      requestParams.sortColumn = 'updated_date'
      requestParams.sortOrder = 'desc'
      requestFilterApply.baseFilterVO = requestParams
      requestFilterApply.fromIndex = 0
      requestFilterApply.pimerceOrgId = getFilterDataValue.organization.id;
      requestFilterApply.organizationId = userDetail;
      requestFilterApply.extentions = initialValues.format ? formatIterator(initialValues.format) : []
      requestFilterApply.metaTags = initialValues.tags ?  tagIterator(initialValues.tags) : []
      requestFilterApply.sizeStart = initialValues.fromSize ? kbToBytesConvertor(initialValues.fromSize) : null
      requestFilterApply.sizeEnd = initialValues.toSize ? kbToBytesConvertor(initialValues.toSize) : null
      setMetaTagData(requestFilterApply)
      setAssetsRequestObject(requestFilterApply)
      props.assetNameSearch(requestFilterApply, null)
    }
  }

  const handleCloseFilter = (status) => {
    setFilterCheck(status)
  }

  // const indexMatch = (e) => {
  //   setActiveIndex(e.index)
  // }

  const assetDetailsPopup = (data) =>{
    if(data.length > 0){
    setIsShowPopUp(true)
    setSendAssetData(data[0])
    }
  }

  const assetTagSizeComparator = (values) => {
    if(values){
      setIsFilterBtnDisabled(false)
      return true 
    }else{
      setIsFilterBtnDisabled(true)
      return false
    }
  }

  const AssetSearch = () => {
    return (
      <>
         <div className="accordion-tab-style p-0">
          <Formik
            innerRef={ref}
            enableReinitialize={true}
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={{
              format: format,
              tags: tags,
              fromSize: fromSize,
              toSize: toSize,
              activeIndex:[0, 1, 2]
            }}
            validationSchema={Yup.object().shape({
              fromSize: Yup.number().required("Required"),
              toSize: Yup.number().test(
                "size_compare",
                `To-size must be bigger then From-size`,
                function (toSize) {
                  return toSize ? assetTagSizeComparator(toSize >= this.parent.fromSize) : true
                }
              ),
            })}
          >
            {({
              values,
              errors,
              setFieldValue,
              setFieldTouched,
              handleBlur,
              handleChange,
            }) => (
              <Form className="accrodion-form-style">
                <Accordion
                  multiple
                  activeIndex={values.activeIndex}
                  onTabChange={(e) => {
                    setFieldValue("activeIndex",e.index)
                  }}
                  className="mt-2"
                >
                      {/* tags */}
                      <AccordionTab header={"Tags"}>
                          <div className="mb-2">
                            <Select  
                              name="tags"
                              isMulti
                              value={values.tags}
                              options={renderTagOption}
                              styles={optionStylesForTag}
                              className="asset-list-tag"
                              isClearable={false}
                              components={{
                                animatedComponents,
                                IndicatorSeparator: () => null,
                              }}
                              onFocus={(e)=>{
                                const requestData ={
                                  organizationId : userDetail,
                                  pageStart : 0,
                                  pageEnd : 1000,
                                  sortField : "tag",
                                  sortType : "ASC" 
                                }
                                props.getMasterTags(requestData)
                              }}
                              onChange={(newValue) => {
                                setFieldValue("tags",newValue)
                                setTags(newValue)
                              }}
                            />
                          </div>
                      </AccordionTab>
                        {/* format */}
                        <AccordionTab header={"Format"}>
                          <div>
                            {Format.length > 0 &&
                              Format.map((i) => {
                                return (
                                  <div className="ml-3">
                                    <label className="asset-list17-items" style={{padding: "1px",marginBottom: "0px"}}>
                                      <Field
                                        type="checkbox"
                                        name={`format.${i.name}`}
                                        className="asset-search-format"
                                        // value={values.tags}
                                        //   value={i.name}
                                      //    onBlur={(e) => {
                                      //     setFieldValue(`format.${i.name}`,val)
                                      //     // handleBlur(e)
                                      //  }}
                                        onChange={(e)=>{
                                          let val = !format[i.name]
                                          format[i.name] = val
                                          setFieldValue(`format.${i.name}`,val)
                                        }}
                                        style={{margin: "1px",padding: "0px"}}
                                      />
                                      <span
                                        className="ml-2"                                       
                                      >
                                        {i.name}
                                      </span>
                                    </label>
                                    <br />
                                  </div>
                                )
                              })}
                          </div>
                          </AccordionTab>
                        {/* Size */}
                        <AccordionTab header={"Size"}>
                          <>
                            <div className="mb-2">
                              <Row>
                                <Col xl={6}>
                                  <Col className="p-0">
                                    <label
                                      className="asset-tag-size"
                                      for="fromSize"
                                    >
                                      From(Kb):
                                    </label>
                                  </Col>
                                  <Col className="p-0">
                                    <Field
                                      title = ""
                                      type="number"
                                      name="fromSize"
                                      min={0}
                                      className="asset-search-range"
                                      onBlur={(e) => {setFromSize(values.fromSize)}}
                                      onChange={(e)=>{
                                        setFieldValue("fromSize" , e.target.value)
                                      }}   
                                    />
                                  </Col>
                                </Col>
                                <Col xl={6}>
                                  <Col className="p-0">
                                    <label className="asset-tag-size" for="to">
                                      To (Kb):
                                    </label>
                                  </Col>
                                  <Col className="p-0">
                                    <Field
                                      title = ""
                                      type="number"
                                      name="toSize"
                                      min={0}
                                      // value={values.toSize}
                                      onBlur={(e) => {setToSize(values.toSize)}}
                                      onChange={(e) => {
                                        setFieldValue("toSize" , e.target.value)
                                        setFieldTouched("toSize")
                                      }}
                                      className="asset-search-range"
                                    />
                                  </Col>
                                </Col>
                                  <Col>
                                    <ErrorMessage
                                      style={{ color: "red" ,fontSize : "12px"}}
                                      className="error"
                                      component="div"
                                      name="toSize"
                                    />
                                  </Col>
                              </Row>
                            </div>
                          </>
                      </AccordionTab>
                </Accordion>
              </Form>
            )}
          </Formik>
        </div>
      </>
    )
  }

  return (
    <>
       <div className="p-grid common-header-section">
        <h5 className="p-m-0 p-col-12 page-header">
          <AssetIcon /> {props.fromSkuList == undefined ? "Digital Assets Management" : "Select Digital Assets"}
        </h5>
      </div>
      {/* Filter Component props */}
      <Row className="m-0">
        <Col className="card pim-filter-component" xl={2} lg={2} md={2} sm={2} xs={2} style={{marginTop: '-15px'}}>
<FilterAndAppliedFilter
        latestScrapDate={date}
        handleApplyFilter={handleApplyFilter}
        appliedFilterHideDropdown={filterOptions.PIM_Asset.applied_filter_hide_dropdown.split(
                  ", "
                )
        }
        // appliedFilterInitailLoadedValues={initialRequestDam}
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
        filterHideDropdown={filterOptions.PIM_Asset.filter_hide_dropdown.split(
                  ", "
                )
        }
        filterHideDropdownWithFunctionality={filterOptions.PIM_Asset.filter_hide_dropdown_with_functionality.split(
                  ", "
                )
        }
        isRetailerCardImagePresent={false}
        isFilterChecked={filterCheck}
        filterTarget={undefined}
        filterSingleSelectDropdown={filterOptions.PIM_Asset.filter_single_select_dropdown.split(
                  ", "
                )
        }
        moduleNameForFilter={'PIM Asset'}
        additionalsearch={AssetSearch()}
        isPreferredChildSuperCategoryForFilter={true}
        isPreferredChildCategoryForFilter={true}
        isPreferredBrandForFilter={true}
        isFreeHandDropdownForFilter={
          filterOptions.PIM_Asset.isFreeHandDropdown != undefined &&
          filterOptions.PIM_Asset.isFreeHandDropdown != null &&
          filterOptions.PIM_Asset.isFreeHandDropdown === 'true'
            ? true
            : false
        }
        isFreeHandSelectForFilter={
          filterOptions.PIM_Asset.isFreeHandSelect != undefined &&
          filterOptions.PIM_Asset.isFreeHandSelect != null &&
          filterOptions.PIM_Asset.isFreeHandSelect === 'true'
            ? true
            : false
        }
        toastModalTitleContentForFilter={'Digital Assets Management'}
      />
        </Col>
        {/* loader */}
        <Col xl={10} lg={10} md={10} sm={10} xs={10} className="skulist">
        <React.Fragment>
          <PimerceDataView
            data={assetList}
            columns={dataViewColumn}
            totalRecords={totalRecords}
            handlePagination={onPageChange}
            onautoComplete={AutoComplete}
            isCleared={isCleared}
            onSelectedRowDataTable={()=>{}}  
            updateProductSku={assetDetailsPopup}  
            onDeletedRowDataTable={ImageEditor}
            isLoader={loader} 
            associtatedCheckData={selectCheckBoxTemplate}
            isSelectedRowCleared={isSelectedRowCleared}
            setIsSelectedRowCleared={setIsSelectedRowCleared}
            isSingleSelectCheckbox={props.fromSkuList ? true : false}
            isHeaderButtonVisible={true}
            redirectedType={buttonTemplate}
            isMoreOptions={moreOptionsTemplate}
            isValidationOnCheckBox = {validateTypeFromProductSku}
            layoutStyle={false}
            isHeaderSearch={true}
            isMultiSearch={true}  
            isPaginator={true}
            isZoomVisible={true}
            isCheckBoxEnabled={props.fromSkuList == undefined ? !authJson["44"].isEnabled ? false : true : null}
            isCardHoverCheckBoxEnabled={!authJson["44"].isEnabled ? false : true }
            isCheckBoxDisabled = {props.fromSkuList ? true : false}
            isContentItemEnabled={true}
            isSorting={false}
            headerTitle={props.fromSkuList == undefined ? !authJson["44"].isEnabled ? "" : "Select All" : null}
            loading={loading}
            isCardToolEnabled={props.fromSkuList ? false : true} 
            validateExtension={validateExtension}
            pageDataReset={pageDataReset}
            isRenderTagItem={false}
            showTotalData={TOTALASSET}
            // redirectRenderTagItem={()=>{}}
            // css flag
            imageStyle={false}
            imgContainerwidth={false}
            isBoxSizing={false} 
            isCardHoverEnabled = {props.fromSkuList ? true : false}
            // props for dataview content
            optionalImg={editIcon} 
            // contentName={"File Name"}
            contentDesc={"Size"}
            isPageName = {"asset"}
          />
          </React.Fragment>
        </Col>
      </Row>

      <ToastModal
        show={isToastMsg}
        title={toastData.toastHeading}
        titleBackgroundColor={toastData.titleBackgroundColor}
        content={toastData.toastContent}
        size={toastData.toastSize}
        onModalHide={handleToastHide}
      />
      {/* Download Toast */}
      <ToastModal
        show={isDownloadDisable}
        title={toastData.toastHeading}
        titleBackgroundColor={toastData.titleBackgroundColor}
        content={toastData.toastContent}
        size={toastData.toastSize}
        onModalHide={handleToastHide}
      />

      {uploadType && isShowUploadModal ? openDock() : ''}

      <ModalComponent
        isShowModal={isShowPopUp}
        onHideModal={onImageClosePopup}
        modalTitle={i18n.t("assetlisting.assetDetails")}
        modalContent={onImageDetailsPopup()}
        modalSize="lg"
        modalDailogClassName="modalDailogContent p-fluid dialogue-box-style"
      />
    
      <ModalComponent
        isShowModal={isDeleteRecordsDialog}
        onHideModal={onHideMultipleDeleteDialog}
        modalTitle={"Delete Assets"}
        modalContent={
          <div className="confirmation-content">
            <i className="exclamation-triangle" style={{ fontSize: "2rem" }} />
            <span>
              {associatedAssetList != null && associatedAssetList.length > 1
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
    </>
  )

  function openDock() {
    if (isLocal && !isEnter) {
      let obj = {
        isCloud:true,
        isCustomUppyStyle:false,
        isComponentName : true,
        pageName: 'asset',
        locale: locale
      }
      setIsEnter(true)
      props.triggerFileUpload(obj)
    } else if (!isLocal && !isEnter) {
      let obj = {
        isCloud:false,
        isCustomUppyStyle:true,
        isComponentName : true,
        pageName: 'asset',
        locale: locale
      }
      setIsEnter(true)
      props.triggerFileUpload(obj)
    }
  }
}

export default connect(mapStateToProps)(assetListing)
