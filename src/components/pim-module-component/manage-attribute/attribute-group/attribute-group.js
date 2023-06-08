// import React, { useEffect, useState } from "react"
// import PimerceDataTable from "../../../../components/data-table/data-table"
// import "../attribute/style.scss"
// import {
//   EXPORT_EXCEL_URL,
//   CREATE,
//   UPDATE,
//   DELETE,
//   ERROR_BG_COLOR,
//   MEDIUM,
//   VALID_BG_COLOR,
//   SCROLL_HEIGHT,
//   SCROLL_WIDTH,
//   COLUMN_RESIZE_MODE,
//   GRID_SIZE,
//   ATTR_GRP_DESCTIPTION,
//   SPECIAL_CASE_VALIDATOR,
//   MAXSIZENAME,
//   MAXSIZEDESC
// } from "../../../../common/common-constants"
// import i18n from "../../../../translate/i18n"
// import AttributeGroupForm from "./create-update-attr-group"
// import axios from "axios"
// import {
//   getApiRequestObject,
//   deleteApiRequestObject,
//   updateApiRequestObject
// } from "../../../../common/master-data"
// import { Toolbar } from "primereact/toolbar"
// import { Button } from "primereact/button"
// import ModalComponent from "../../../modal/index"
// import ToastModal from "../../../modal/ToastModal"
// import { ErrorMessage, Field, Formik } from "formik"
// import { Form } from "react-bootstrap"
// import { ATTR_GRP_NAME } from "../../../../common/common-constants"
// import PimerceAuth from "../../../authorization-tag/PimerceAuth"
// import Plusicon from "../../../../common/icons/plusicon"
// import Closeicon  from "../../../../common/icons/deleteicon"
// import { connect } from "react-redux"
// import Autocomplete from "../../skulist/autocomplete"
// import AttrGrpIcon from "../../../../common/icons/attrgroup"

// let numberOfPage,
//   attributeGroupGridData = [],
//   gridColumn = [
//     {
//       field: "attrGrpName",
//       header: i18n.t("gridColumn.attributeGroupName"),
//       filter: false,
//       width:"30%"
//     },
//     {
//       field: "attrGrpDescription",
//       header: i18n.t("gridColumn.attributeGroupDescription"),
//       sortable: false,
//       width:"68%"
//     }
//   ],
//   toastHeading,
//   toastContent,
//   titleBackgroundColor,
//   toastSize,
//   headerButtonGroup = [],
//   record = i18n.t("attributeDialogText.record"),
//   records = i18n.t("attributeDialogText.recoprdsGrp"),
//   deleteMessage = i18n.t("attributeDialogText.deleteMessage"),
//   addNewButtonLabel = i18n.t("attributeGroup.attributeGrpaddbutton"),
//   deleteButtonLabel = i18n.t("attributeDialogText.deleteButtonLabel"),
//   updateButtonLabel = i18n.t("attributeDialogText.updateButtonLabel"),
//   gridHeader = i18n.t("attributeGroup.gridtitle"),
//   popupHeader = i18n.t("attributeGroup.dialogtitle"),
//   labelNo = i18n.t("datatable.no"),
//   labelYes = i18n.t("datatable.yes"),
//   autoComplete = {
//     optionClassName: "options",
//     optionActiveClassName: "option-active",
//     noOptionClassName: "no-options-dropdown",
//     searchBoxPlaceholderClassName: "attr-search-box-autocomplete",
//     searchBarandIconClassName: "",
//     searchBarBoxClassName: "search-bar-box search-bar-boxing",
//     noOption: i18n.t("dataTableText.noOptions"),
//   }

//   const mapStateToProps = (state) => {
//     return {
//       getUserDetail: state.userDetail.getUsersObj.userCredentials
//     }
//   }

// function AttributeGroup(props) {
//   const {getUserDetail} = props
//   let authJson = JSON.parse(sessionStorage.getItem("authJson"))
//   let userDetails = getUserDetail
//   let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
//   const [gridData, setGridData] = useState([])
//   const [isSearchString, setIsSearchString] = useState(false)
//   const [isLoader, setIsLoader] = useState(true)
//   const [totalRecords, setTotalRecords] = useState(0)
//   const [isGridDialog, setIsGridDialog] = useState(false)
//   const [isSelectedRowCleared, setIsSelectedRowCleared] = useState(false)
//   const [deleteRecordsDialog, setDeleteRecordsDialog] = useState(false)
//   const [clickEvent, setClickEvent] = useState("")
//   const [isDisableUpdateButton, setIsDisableUpdateButton] = useState(true)
//   const [isDisableDeleteButton, setIsDisableDeleteButton] = useState(true)
//   const [onSelected, setOnSelected] = useState(null)
//   const [isToastMsg, setIsToastMsg] = useState(false)
//   const [validationError, setValidationError] = useState({})
//   const [isGridCheckBox, setIsGridCheckBox] = useState(false)
//   const [submitEvent, setSubmitEvent] = useState(true)
//   const [searchResult, setSearchResult] = useState([])
//   const [isCleared, setIsCleared] = useState(false)
//   const [isAutoCompleteLoaderFlag, setIsAutoCompleteLoaderFlag] = useState(false)
//   const [pageDataReset, setPageDataReset] = useState(false)
//   const [editInitCount, setEditInitCount] = useState([])
//   const [searchKey, setSearchKey] = useState("")
//   const [searchKeyChange, setSearchKeyChange] = useState("")

//   let autocompleteDropdown = (
//     <Autocomplete
//       options={searchResult}
//       onSearch={(event) => onSearchBoxText(event)}
//       placeholder={i18n.t("dataTableText.searchBoxPlaceholderAttrGrp")}
//       isCleared={isCleared}
//       isLoader={isAutoCompleteLoaderFlag}
//       autoComplete={autoComplete}
//       onChangeValue={(e) => onChangeAutoComplete(e)}
//     />
//   )

//   const onChangeAutoComplete = (e) => {
//     setIsCleared(false)
//     setIsAutoCompleteLoaderFlag(true)
//     setPageDataReset(false)
//     setSearchKeyChange(e && e.trim())
//     getApiRequestObject.pageStart = 0
//     getApiRequestObject.pageEnd = 10
//     getApiRequestObject.organizationId = userDetails.organizationid
//     getApiRequestObject.attrGrpName = e && e !== '' ? `%${e.trim().toLowerCase()}%` : '%%'
//     getApiRequestObject.sortField = "attrGrpName"
//     getApiRequestObject.sortType = "ASC"
//     props.getSearchAttributeGroup(getApiRequestObject)
//   }

//   const onSearchBoxText = (event) => {
//     setIsAutoCompleteLoaderFlag(false)
//     setPageDataReset(true)
//     setSearchKey(event && event.trim())
//     getApiRequestObject.pageStart = 0
//     getApiRequestObject.pageEnd = 10
//     getApiRequestObject.organizationId = userDetails.organizationid
//     getApiRequestObject.attrGrpName = event && event !== '' ? `%${event.trim().toLowerCase()}%` : '%%'
//     props.getManageAttributeGroup(getApiRequestObject)
//     setSearchResult([])
//   }

//   useEffect(() => {
//     if (
//       props.getSearchAttributeGroupResult &&
//       props.getSearchAttributeGroupResult.content &&
//       props.getSearchAttributeGroupResult.content.status == "200"
//     ) {
//       let suggestionOption = []
//       props.getSearchAttributeGroupResult &&
//         props.getSearchAttributeGroupResult.content &&
//         props.getSearchAttributeGroupResult.content.data.attributeGroups.map((i) => {
//           if (suggestionOption.indexOf(i.attrGrpName) === -1) {
//             suggestionOption.push(i.attrGrpName)
//           }
//         })
//       setIsAutoCompleteLoaderFlag(false)
//       setSearchResult(suggestionOption)
//     }
//     if (searchKeyChange == "") {
//       setSearchResult([])
//     }
//   }, [props.getSearchAttributeGroupResult])

//   const addAttributeGroup = () => {
//     return (
//       <>
//         <AttributeGroupForm
//           hideDialog={hideDialog}
//           event={CREATE}
//           insertAttributeGroupData={props.insertAttributeGroupData}
//           setSubmitEvent={submitEvent}
//         ></AttributeGroupForm>
//       </>
//     )
//   }

//   const updateAttributeGroup = () => {
//     return (
//       <>
//         <AttributeGroupForm
//           event={UPDATE}
//           selectedRow={onSelected}
//           updateAttributeGroupData={props.updateAttributeGroupData}
//         ></AttributeGroupForm>
//       </>
//     )
//   }

//   const deleteAttributeGroup = () => {
//     if (onSelected != null) {
//       const deleteRows = onSelected.map((item) => {
//         return item.id
//       })
//       deleteApiRequestObject.deleteByIds = deleteRows
//       props.deleteAttributeGroupData(deleteApiRequestObject)
//     }
//   }

//   const prepareDeleteCount = () => {
//     if (onSelected != null && onSelected.length > 1) {
//       return onSelected.length + records
//     }
//     return onSelected != null && onSelected.length !=0 ?  ' " '+ onSelected[0].attrGrpName +' " ?': null
//   }

//   useEffect(() => {
//     getApiRequestObject.pageStart = 0
//     getApiRequestObject.sortField = "attrGrpName"
//     getApiRequestObject.sortType = "ASC"
//     getApiRequestObject.organizationId = userDetails.organizationid
//     getApiRequestObject.attrGrpName = "%%"
//     props.getManageAttributeGroup(getApiRequestObject)
//   }, [])

//   useEffect(() => {
//     const {
//       insertAttributeGroupDataResult,
//       updateAttributeGroupDataResult,
//       deleteAttributeGroupDataResult,
//       getManageAttributeGroupResult
//     } = props
//     attributeGroupDataResult(getManageAttributeGroupResult)
//     attributeGroupDataResult(insertAttributeGroupDataResult, CREATE)
//     attributeGroupDataResult(updateAttributeGroupDataResult, UPDATE)
//     attributeGroupDataResult(deleteAttributeGroupDataResult, DELETE)
//     if (
//       getManageAttributeGroupResult &&
//       getManageAttributeGroupResult.content &&
//       getManageAttributeGroupResult.content.data
//     ) {
//       setIsLoader(false)
//       if (
//         getManageAttributeGroupResult.content.data &&
//         getManageAttributeGroupResult.content.data.attributeGroups
//       ) {
//         attributeGroupGridData =
//           getManageAttributeGroupResult.content.data.attributeGroups.map(
//             (item) => {
//               const dataValue = {}
//               Object.assign(dataValue, {
//                 id: item.id,
//                 attrGrpName: item.attrGrpName,
//                 attrGrpDescription: item.attrGrpDescription,
//                 version: item.version,
//                 organizationId: item.organizationId,
//                 isDefaultGroup:item.isDefaultGroup
//               })
//               return dataValue
//             }
//           )
//       }
//       numberOfPage = getManageAttributeGroupResult.content.data.totalElement
//       setGridData(attributeGroupGridData)
//       setTotalRecords(numberOfPage)
//     }
//   }, [props])

//   const onPageChange = (pagedata) => {
//     setPageDataReset(false)
//     getApiRequestObject.pageStart = pagedata.page
//     getApiRequestObject.pageEnd = 10
//     getApiRequestObject.organizationId = userDetails.organizationid
//     getApiRequestObject.attrGrpName = searchKey ? `%${searchKey.trim().toLowerCase()}%` : '%%'
//     props.getManageAttributeGroup(getApiRequestObject)
//   }

//   const attributeGroupDataResult = (result, type) => {
//     if (result && result.content && result.content.status != 200) {
//       toastHeading = i18n.t("toastMessage.requestFailed")
//       if (type == CREATE) toastHeading = i18n.t("attributePopupHeaders.createAttributeGroup")
//       if (type == UPDATE) toastHeading = i18n.t("attributePopupHeaders.updateAttributeGroup")
//       if (type == DELETE) toastHeading = i18n.t("attributePopupHeaders.deleteAttributeGroup")
//       toastContent = i18n.t("toastMessage.requestFailedMessage")
//       titleBackgroundColor = ERROR_BG_COLOR
//       toastSize = MEDIUM
//       if((type == CREATE) && (result && result.content && result.content.data.description == "Attribute Group already exists")){
//         setIsGridDialog(true)
//         setIsToastMsg(true)
//         setSubmitEvent(false)
//       }else{
//         setIsGridDialog(false)
//         setIsToastMsg(false)
//         setSubmitEvent(true)
//       }
//     }
//     if (result && result.content && result.content.status == 200) {
//       if (type == CREATE) {
//         setIsGridDialog(false)
//         setPageDataReset(true)
//         getApiRequestObject.pageStart = 0
//         getApiRequestObject.sortField = "attrGrpName"
//         getApiRequestObject.sortType = "ASC"
//         props.getManageAttributeGroup(getApiRequestObject)
//         toastHeading = i18n.t("attributePopupHeaders.createAttributeGroup")
//         toastContent = i18n.t("toastMessage.createdAttrGrpContent")
//         titleBackgroundColor = VALID_BG_COLOR
//         toastSize = MEDIUM
//         setIsToastMsg(true)
//         setSubmitEvent(true)
//       }
//       if (type == UPDATE) {
//         setIsSelectedRowCleared(true)
//         setIsGridDialog(false)
//         props.getManageAttributeGroup(getApiRequestObject)
//         toastHeading = i18n.t("attributePopupHeaders.updateAttributeGroup")
//         toastContent = i18n.t("toastMessage.updatedAttrGrpContent")
//         titleBackgroundColor = VALID_BG_COLOR
//         toastSize = MEDIUM
//         setIsToastMsg(true)
//       }
//       if (type == DELETE) {
//         setIsSelectedRowCleared(true)
//         setDeleteRecordsDialog(false)
//         props.getManageAttributeGroup(getApiRequestObject)
//         toastHeading = i18n.t("attributePopupHeaders.deleteAttributeGroup")
//         toastContent = result.content.data.description
//         titleBackgroundColor = VALID_BG_COLOR
//         toastSize = MEDIUM
//         setIsToastMsg(true)
//       }
//     } else if (result && result.content && result.content.data.code == 101) {
//       toastHeading = i18n.t("toastMessage.requestFailed")
//       if (type == CREATE) toastHeading = i18n.t("attributePopupHeaders.createAttributeGroup")
//       if (type == UPDATE) toastHeading = i18n.t("attributePopupHeaders.updateAttributeGroup")
//       if (type == DELETE) toastHeading = i18n.t("attributePopupHeaders.deleteAttributeGroup")
//       toastContent = result.content.data.description
//       titleBackgroundColor = ERROR_BG_COLOR
//       toastSize = MEDIUM
//       setIsSelectedRowCleared(true)
//       setDeleteRecordsDialog(false)
//       props.getManageAttributeGroup(getApiRequestObject)
//       setIsToastMsg(true)
//     }
//   }

//   const exportTrigger = (data, field) => {
//     if (field == "excel") {
//       axios({
//         url: `${EXPORT_EXCEL_URL + data}`,
//         method: "GET",
//         responseType: "blob" // important
//       }).then((response) => {
//         const url = window.URL.createObjectURL(new Blob([response.data]))
//         const link = document.createElement("a")
//         link.href = url
//         link.setAttribute("download", "Attributes.xlsx") //or any other extension
//         document.body.appendChild(link)
//         link.click()
//       })
//     }
//   }

//   const openDialog = (event) => {
//     setIsGridDialog(true)
//     setClickEvent(event)
//   }
//   const hideDialog = () => {
//     setIsGridDialog(false)
//   }
//   const onHideMultipleDeleteDialog = () => {
//     setDeleteRecordsDialog(false)
//   }

//   const confirmDeleteSelected = () => {
//     setDeleteRecordsDialog(true)
//   }

//   const selectedRowDataTable = (selectedRow) => {
//     if (selectedRow && selectedRow.length >= 1) {
//       setIsDisableUpdateButton(true)
//       setIsDisableDeleteButton(false)
//     } else {
//       setIsDisableUpdateButton(true)
//       setIsDisableDeleteButton(true)
//     }
//     if (selectedRow && selectedRow.length == 1) {
//       setIsDisableUpdateButton(false)
//     }
//     setIsSelectedRowCleared(false)
//     setOnSelected(selectedRow)
//   }

//   const deleteAttrDialogue = (
//     <React.Fragment>
//       <Button
//         label={labelNo}
//         // icon="pi pi-times"
//         className="p-button-text custom-button cancel-button"
//         onClick={() => onHideMultipleDeleteDialog()}
//       />
//       <Button
//         label={labelYes}
//         // icon="pi pi-check"
//         className="p-button-text custom-button btn-yes"
//         onClick={() => deleteAttributeGroup()}
//       />
//     </React.Fragment>
//   )
//   const buttonTemplate = () => {
//     return (
//       <React.Fragment>
//         <PimerceAuth
//                     componentId={"31"}
//                     componentType="button"
//                     component={
//         <Button
//           label={addNewButtonLabel}
//           // icon="fa fa-plus-circle fa-2x add-new-attr-group"
//           // iconPos="right"
//           className="p-button-success btn-active-17 pimbtn p-mr-2"
//           onClick={() => openDialog(CREATE)}
//         >
//         <Plusicon svgLeftSpace="15px"/>
//         </Button>           
//       }/>
//       <PimerceAuth
//                     componentId={"32"}
//                     componentType="button"
//                     component={
//         <Button
//           label={deleteButtonLabel}
//           // icon="fa fa-times-circle fa-2x delete-new-attr-group"
//           // iconPos="right"
//           className="p-button-danger btn-active-17 pimbtn"
//           onClick={() => confirmDeleteSelected(DELETE)}
//           disabled={isDisableDeleteButton}
//         >
//          <Closeicon svgLeftSpace="15px"/>
//         </Button>
//           }/>
//       </React.Fragment>
//     )
//   }

//   const handleToastHide = () => {
//     setIsToastMsg(false)
//     setIsGridCheckBox(false)
//   }

//   const onRowEditComplete = (e) => {
//     setEditInitCount(Object.values(editInitCount).filter(item => item !== e.data.id))
//     let { newData, index } = e
//     if(newData)
//     updateApiRequestObject.id = newData.id
//     updateApiRequestObject.attrGrpName =
//       newData.attrGrpName && newData.attrGrpName.trim()
//     updateApiRequestObject.attrGrpDescription =
//       newData.attrGrpDescription && newData.attrGrpDescription.trim()
//     updateApiRequestObject.version = newData.version
//     updateApiRequestObject.organizationId = userDetails.organizationid
//     updateApiRequestObject.timeZone = timeZone
//     updateApiRequestObject.isDefaultGroup = newData.isDefaultGroup
//     props.updateAttributeGroupData(updateApiRequestObject)
//     // setIsGridCheckBox(false)
//   }

//   const onRowEditInit = (data) =>{
//     setEditInitCount(editInitCount.concat(data.data.id))
//     setIsDisableDeleteButton(true)
//     setIsGridCheckBox(true)
//   }

//   const onRowEditCancel = (data) => {
//     setEditInitCount(Object.values(editInitCount).filter(item => item !== data.data.id))
//     if (onSelected && onSelected.length > 0) {
//       setIsDisableDeleteButton(false)
//     }
//     setIsGridCheckBox(false)
//   }

//   const rowEditValidator = (e, data) => {
//     let index = data.props.value.findIndex((x) => x.id === e.id)
//     if (e.attrGrpName.length > 50 || e.attrGrpName.length == 0) {
//       return false
//     } 
//     // else if(e.attrGrpName.match(SPECIAL_CASE_VALIDATOR)){
//     //   return false
//     // }
//      else if (e.attrGrpDescription.length > 150) {
//       return false
//     } else {
//       return true
//     }
//   }

//   const statusEditor = (options) => {
//     editInitCount.length > 0 ? setIsGridCheckBox(true) : setIsGridCheckBox(false)	 
//     // if (onSelected && onSelected.length) {
//       // setIsDisableDeleteButton(true)
//     // }
//     // setIsGridCheckBox(true)
//     return (
//       <Formik
//         initialValues={{
//           ["attrGrpName" + options.rowIndex]: options.value
//             ? options.value
//             : "",
//           idx: options.rowIndex,
//           ["attrDescription" + options.rowIndex]: options.value
//             ? options.value
//             : "",
//           idx: options.rowIndex
//         }}
//       >
//         {({ errors, setFieldValue, handleBlur, handleChange ,touched , setFieldTouched}) => (
//           <Form onSubmit={(e)=>e.preventDefault()}>
//             {options.field == ATTR_GRP_NAME ? (
//               <div className="p-field p-col-12 p-md-12">
//                 <Field
//                   type="text"
//                   name={"attrGrpName" + options.rowIndex}
//                   value={options.value}
//                   maxLength={MAXSIZENAME}
//                   onChange={(e) => {
//                     setFieldTouched('attrGrpName' + options.rowIndex); 
//                     handleChange(e)
//                     options.editorCallback(e.target.value)
//                     // setFieldValue(
//                     //   "attrGrpName" + options.rowIndex,
//                     //   e.target.value
//                     // )
//                   }}
//                   className={
//                      errors.attrName
//                       ? ERROR_FIELD_CLASSNAME
//                       : "p-inputtext p-component p-inputnumber-input attrGroup-input"
//                   }
//                   validate={(values) => {
//                     let errors
//                     let result = values && values.match(SPECIAL_CASE_VALIDATOR)
//                     {
//                       if (!values) {
//                         errors = i18n.t("validationMessage.attrNameisRequired")
//                       } else if (values && values.length > 50) {
//                         errors = i18n.t("validationMessage.attrGrpNameLength")
//                       } 
//                       // else if (result){
//                       //   errors = i18n.t("validationMessage.specialCaseRequired")
//                       // }
//                       let error = validationError
//                       error["attrGrpName" + options.rowIndex] = errors
//                       setValidationError(error)
//                       return errors
//                     }
//                   }}
//                   onBlur={handleBlur}
//                 />
//                 <div className="errorMsg mr-4">
//                   <ErrorMessage name={"attrGrpName" + options.rowIndex} />
//                 </div>
//               </div>
//             ) : null}

//             {options.field == ATTR_GRP_DESCTIPTION ? (
//               <div className="p-field p-col-12 p-md-12">
//                 <Field
//                   type="textarea"
//                   value={options.value}
//                   name={"attrDescription" + options.rowIndex}
//                   maxLength={MAXSIZEDESC}
//                   onChange={(e) => {
//                     setFieldTouched('attrDescription' + options.rowIndex); 
//                     handleChange(e)
//                     options.editorCallback(e.target.value)
//                     setFieldValue(
//                       "attrDescription" + options.rowIndex,
//                       e.target.value
//                     )
//                   }}
//                   className={
//                     touched.attrDesc && errors.attrDesc
//                       ? ERROR_DESC_FIELD_CLASSNAME
//                       : "p-inputtext p-inputtextarea attr-group"
//                   }
//                   validate={(values) => {
//                     let errors
//                     {
//                       if (values && values.trim().length > 150) {
//                         errors = i18n.t("validationMessage.lengthDesc")
//                       }
//                       let error = validationError
//                       error["attrDescription" + options.rowIndex] = errors
//                       setValidationError(error)
//                       return errors
//                     }
//                   }}
//                 />
//                 <div className="errorMsg">
//                   <ErrorMessage name={"attrDescription" + options.rowIndex} />
//                 </div>
//               </div>
//             ) : null}
//           </Form>
//         )}
//       </Formik>
//     )
//   }

//   return (
//     <div>
//       <ToastModal
//         show={isToastMsg}
//         title={toastHeading}
//         titleBackgroundColor={titleBackgroundColor}
//         content={toastContent}
//         size={toastSize}
//         onModalHide={handleToastHide}
//       />
//       <div className="p-grid common-header-section">
//         <h5 className="p-m-0 p-col-12 page-header">
//           <AttrGrpIcon /> {i18n.t("attributeGroup.pagetitle")}
//         </h5>
//       </div>
//       {/* <PimerceDataTable
//         columnData={gridColumn}
//         data={gridData}
//         isSelectedRowCleared={isSelectedRowCleared}
//         totalRecords={totalRecords}
//         isPaginator={true}
//         isScrollable={false}
//         isLazy={true}
//         // gridHeader={gridHeader}
//         popupHeader={popupHeader}
//         isPopupCancelBtn={false}
//         headerButtonsGrb={headerButtonGroup}
//         isToolbar={true}
//         deleteButtonLabel={deleteButtonLabel}
//         updateButtonLabel={updateButtonLabel}
//         isGridCheckBox={authJson["5"].isEnabled?isGridCheckBox:true}
//         isLoader={isLoader}
//         exportCallback={exportTrigger}
//         onSelectedRowDataTable={selectedRowDataTable}
//         isHeaderSearch={false}
//         isHeaderfilter={false}
//         scrollHeight={SCROLL_HEIGHT}
//         scrollWidth={SCROLL_WIDTH}
//         columnResizeMode={COLUMN_RESIZE_MODE}
//         gridSize={GRID_SIZE}
//         handlePagination={onPageChange}
//         enableRowEdit={authJson["5"].isEnabled}
//         statusEditor={statusEditor}
//         onRowEditComplete={onRowEditComplete}
//         onRowEditCancel={onRowEditCancel}
//         onRowEditInit={onRowEditInit}
//         rowEditValidator={rowEditValidator}
//         headerButtonTemplate={buttonTemplate()}
//         //attribute group search bar
//         isAutoCompleteSearch={true}
//         onautoComplete={autocompleteDropdown}
//         //end attribute group search bar
//         //to reset the pagination label to first page
//         pageDataReset={pageDataReset}
//       /> */}
//       {/* <Toolbar className="p-mb-4" left={buttonTemplate} /> */}
//       {clickEvent === CREATE ? (
//         <ModalComponent
//           isShowModal={isGridDialog}
//           onHideModal={hideDialog}
//           modalTitle={i18n.t("attributePopupHeaders.createAttributeGroup")}
//           modalContent={addAttributeGroup()}
//           modalSize="lg"
//           modalDailogClassName="modalDailogContent p-fluid dialogue-box-style modal-md-cus_size attribute-header attribute-footer"
//         />
//       ) : clickEvent === UPDATE ? (
//         <ModalComponent
//           isShowModal={isGridDialog}
//           onHideModal={hideDialog}
//           modalTitle={i18n.t("attributePopupHeaders.updateAttributeGroup")}
//           modalContent={updateAttributeGroup()}
//           modalSize="lg"
//           modalDailogClassName="modalDailogContent p-fluid dialogue-box-style"
//         />
//       ) : null}
//       <ModalComponent
//         isShowModal={deleteRecordsDialog}
//         onHideModal={onHideMultipleDeleteDialog}
//         modalTitle={i18n.t("attributePopupHeaders.deleteAttributeGroup")}
//         modalContent={
//           <div className="confirmation-content ">
//             <i
//               className="exclamation-triangle"
//               style={{ fontSize: "2rem" }}
//             />
//             <span>
//               {onSelected!=null && onSelected.length >1 ? deleteMessage : i18n.t("deleteRecord")}
//               {prepareDeleteCount()}
//             </span>
//           </div>
//         }
//         modalSize="md"
//         modalDailogClassName="modalDailogContent smallDialog"
//         modalFooter={deleteAttrDialogue}
//       />
//     </div>
//   )
// }

// export default connect(mapStateToProps)(AttributeGroup)
