// import React, { useEffect, useState, useContext } from "react"
// import { connect } from "react-redux"
// import { Row, Col, ProgressBar } from "react-bootstrap";
// import PieChart from "../../../piechart-component/piechart-component";
// import DashboardJson from '../../dashboard/dasboard-mockJSON.json'
// import exclamaion from '../../../../assets/exclamation.svg'
// import PimerceDataTable from "../../../data-table/data-table"
// import {
//   EXPORT_EXCEL_URL,
//   PIM_API,
//   SCROLL_HEIGHT,
//   MEDIUM,
//   SCROLL_WIDTH,
//   ERROR_BG_COLOR,
//   COLUMN_RESIZE_MODE,
//   GRID_SIZE,
//   VALUE_COLOR_ATTRIBUTE
// } from "../../../../common/common-constants"
// import i18n from "../../../../translate/i18n"
// import ModalComponent from "../../../modal/index"
// import {
//   getApiRequestObject,
//   deleteApiRequestObject,
//   exportApiRequestObject,
//   stepList,
//   readinessResultTabMenu
// } from "../../../../common/master-data"
// import "./style.scss"
// import axios from "axios"
// import HeaderContext from "../../../../common/header-context"
// import { COMMON_URL } from "../../../../common/common-api-constants"
// import ToastModal from "../../../modal/ToastModal"
// import { updateApiRequestObject } from "../../../../common/master-data"
// import { Formik } from "formik"
// import {
//   SELECT_COLOR,
//   FOCUS_COLOR,
//   DROPDOWN_FONTSIZE,
//   DROPDOWN_BORDERADIUS,
//   BACKGROUND_COLOR,
//   BORDER_STYLE,
//   VALUE_COLOR,
//   TEXTBOX_BOX_SHADOW
// } from "../../../../common/common-constants"
// import Nav from "../../importdata/nav";
// import { Button } from "primereact/button";
// import { Dialog } from "primereact/dialog";
// import EventSource from "eventsource";
// import { TabMenu } from 'primereact/tabmenu'; 
// // import Backpagecomponent from "../../../back-page-component/back-page-component";
// import ReadinessReportIcon from "../../../../common/icons/readinessReporticon";

// let gridColumn = [
//     {
//       field: "attrGrpName",
//       header: "",
//       filter: false,
//       sortable: false,
//       width:"150px"
//     },
//     {
//       field: "attrName",
//       header: "Product Line",
//       filter: false,
//       sortable: false,
//       width:"20%"
//     },
//     {
//       field: "attrType",
//       header: "Brand",
//       sortable: false,
//       width:"15%"
//     },
//     // {
//     //   field: "attrDescription",
//     //   header: "Product Id",
//     //   sortable: false,
//     // },
//     {
//       field: "attrDescription1",
//       header: "Product Name",
//       sortable: false,
//       width:"20%"
//     },
//     {
//       field:"uniqueIdentifier",
//       header:"Unique Identifier",
//       sortable:false,
//       width:"15%"
//     },
//     {
//       field: "attrDescription2",
//       header: "Result",
//       sortable: false,
//       width:"10%"
//     },
//     {
//       field: "editIcons",
//       header: "",
//       sortable: false,
//       width:"155px"
//     }
//   ],
//   toastHeading,
//   toastContent,
//   titleBackgroundColor,
//   toastSize,
//   headerButtonGroup = [
//     {
//       authId: "10",
//       ButtonName: "",
//       class: "exportexcel",
//       type: "attributes",
//       iconpos: "right",
//     },
//   ],
//   deleteMessage = i18n.t("attributeDialogText.deleteMessage"),
//   record = i18n.t("attributeDialogText.record"),
//   records = i18n.t("attributeDialogText.records"),
//   setFieldsValue,
//   progressValue = 0,
//   deleteButtonLabel = i18n.t("attributeDialogText.deleteButtonLabel"),
//   gridHeader = i18n.t("attribute.gridtitle"),
//   popupHeader = i18n.t("attribute.dialogtitle"),
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

// const mapStateToProps = (state) => {
//   return {
//     getUserDetail: state.userDetail.getUsersObj.userCredentials
//   }
// }




// function PublishSku(props) {
//   // let retailerLogo = props.history.location.state.retailerLogo
//   // let retailerCategory = props.history.location.state.retailerCategory
//   const { getUserDetail } = props
//   let authJson = JSON.parse(sessionStorage.getItem("authJson"))
//   let userDetails = getUserDetail
//   let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
//   const [listData, setListData] = useState([])
//   const [delistData, setDelistData] = useState([])
//   const [pieChartSeries, setPieChartSeries] = useState([0, 0])
//   const [isLoader, setIsLoader] = useState(true)
//   const [totalRecords, setTotalRecords] = useState(0)
//   const [isSelectedRowCleared, setIsSelectedRowCleared] = useState(false)
//   const [isDisableUpdateButton, setIsDisableUpdateButton] = useState(true)
//   const [isDisableDeleteButton, setIsDisableDeleteButton] = useState(true)
//   const [onSelected, setOnSelected] = useState(null)
//   const [isToastMsg, setIsToastMsg] = useState(false)
//   const [isGridCheckBox, setIsGridCheckBox] = useState(false)
//   const [pageDataReset, setPageDataReset] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
//   const [modalGridData, setModalGridData] = useState([])
//   const [productSkuIds, setProductSkuIds] = useState([])
//   const [publishType, setPublishType] = useState(null)
//   const [retailerLogo,setRetailerLogo] = useState(null)
//   const [retailerCategory,setRetailerCategory] = useState(null)
//   const [orgRetailerId,setorgRetailerId] = useState(null)
//   const [retailerId,setretailerId] = useState(null)
//   const [retailerCategoryId,setretailerCategoryId] = useState(null) 
//   const [guiId,setGuiId] = useState(null)
//   const [productIds,setProductIds] = useState([])
//   const [orgRetailerName,setOrgRetailerName] = useState("")
//   const [publishModalTitle,setPublishModalTitle] = useState("")
//   // TabMenu Props  
//   const [activeIndex, setActiveIndex] = useState(0);

  


//   const rowColumnClick = (issues) => {

//     let data = []
//     issues.map((i) => {
//       let value = {
//         issues: i
//       }
//       data.push(value)
//     })
//     setModalGridData(data)
//     setIsModalOpen(true)
//   }
  
//   const {
//     ProductSkuDetails: { ProductSkuContextValue, setProductSkuContextValue },
//     ProductSkuMethodName: {
//       ProductMethodContextValue,
//       setProductMethodContextValue,
//     },
//   } = useContext(HeaderContext)


//   const renderImage = (img) => {
//     return (
//       <img src={img} width="85px" height="59px" />
//     )
//   }

//   const renderResult = (result, issues,remarks) => {
//     let element;
//     if (result == "FAILED") {
//       element = <span onClick={() => { rowColumnClick(issues) }} style={{ color: 'red', textDecoration: 'underline', cursor: 'pointer' }}>{result}</span>;
//     } else if (result == "PENDINGFORAPPROVAL"){
//       element = <span style={{ color: '#DD7D24' }}>{"PENDING"}</span>;
//     } else if ( result == "PARTIALLYAPPROVED"){
//       element = <span style={{ color: '#9D81CF' }}>{"PARTIALLY APPROVED"}</span>;
//     } else if ( result == "APPROVED"){
//       element = <span style={{ color: '#7ED321' }}>{"APPROVED"}</span>;
//     } else if ( result == "REJECTED"){
//       element = <span onClick={() => { rowColumnClick(remarks?[remarks]:[]) }} style={{ color: '#FA042D', textDecoration: 'underline', cursor: 'pointer' }}>{"REJECTED"}</span>;
//     } else if ( result == "PUBLISHED"){
//       element = <span style={{ color: '#7ED321' }}>{"PUBLISHED"}</span>;
//     } else if ( result == "NOTPUBLISHED"){
//       element = <span style={{ color: '#FA042D' }}>{"NOT PUBLISHED"}</span>;
//     }
//     return (
//       element
//     )
//   }

//   const onTabsChange = (e) =>{
//     setActiveIndex(e.index)
//   }
  
//   const confirmPublish = (events) => {
//     // const data = {
//     //   key: "publishResults",
//     // }
//     // props.history.location.state = {
//     //   retailerLogo:props.history.location.state.retailerLogo,
//     //   retailerId:props.history.location.state.retailerId
//     // }
//     // props.history.push({pathname:"/publishResults",state:{
//     //   retailerLogo:props.history.location.state.retailerLogo,
//     //   retailerId:props.history.location.state.retailerId
//     // }})
//     // props.triggerPageLayout(data)
//     // setClickEvent(event)
//     let request = {
//       "orgId": userDetails.organizationid,
//       "orgRetailerId": orgRetailerId,
//       "retailerId": retailerId,
//       "productsList": events =="publish"?productSkuIds:productIds,
//       "passedSkus":events =="publish"?[]:productSkuIds,
//       "retailerCategoryId": retailerCategoryId,
//       "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone
//     }
//     if(publishType=="API"||events=="validate"){
//     let url = COMMON_URL + "api/progress"
//     let eventSourceInitDict = { headers: { 'Authorization': `${userDetails.token_value.Authorization}` } }
//     const eventSource = new EventSource(url, eventSourceInitDict)
//     if(events=="publish"){
//       setPublishModalTitle("Publish Products")
//     }else{
//       setPublishModalTitle("Revalidate Products")
//     }
    
//     eventSource.onerror = (e) => {
//       eventSource.close()
//     }
//     setFieldsValue("progressPercentage", 0)
//     let guidValue = null
//     setIsPublishModalOpen(true)
//     // eventSource.
//     eventSource.addEventListener("GUI_ID", (event) => {
//       guidValue = JSON.parse(event.data)
//       request.guid = guidValue
//       progressValue = 1
//       setFieldsValue("progressPercentage", 1)
//       eventSource.addEventListener(guidValue, (event) => {
//         const result = JSON.parse(event.data)
//         // if (progressPercentage - 5 !== result) {
//         //   setProgressPercentage(((result + 5) / 105) * 100)
//         // }
//         if (progressValue - 1 !== result.uploadPercentage) {
//           let percentage = ((result.uploadPercentage + 1) / 101) * 100
//           progressValue = percentage
//           setFieldsValue("progressPercentage", percentage)
//         }

//         if (result.uploadPercentage == 100) {
//           eventSource.close()
//         }
//       })
//       axios({
//         url: events=="publish"?`${COMMON_URL + PIM_API + "/publish-products"}`:`${COMMON_URL + PIM_API + "/product-validation"}`,
//         method: "POST",
//         data: request // important
//       }).then((response) => {
//         eventSource.removeEventListener('GUI_ID')
//         eventSource.removeEventListener(guidValue)
//         eventSource.close()
//         fileImportResultProcess(response, "readiness", guidValue,events)
//         // setFieldsValue("progressPercentage", 0)
//         // stepWizard.goToStep(2)
//       })
//       // props.postImportedFile(fileRequest)
//     })}else{
//       axios({
//         url: `${COMMON_URL + PIM_API + "/publish-products"}`,
//         method: "POST",
//         data: request // important
//       }).then((response) => {
//         if(response.status==200){
//           const link = document.createElement("a")
//           link.href = response.data.successReportUrl
//           link.setAttribute("download", "Template") //or any other extension
//           document.body.appendChild(link)
//           link.click()
//         }
        
//         // stepWizard.goToStep(2)
//       })
//     }
//   }

//   const fileImportResultProcess = (response, type, guid,event) => {
//     if (response &&
//       response.status == 200) {
//       if (type == "publish") {
//         setFieldsValue("isPublishFailed", false)
//         setFieldsValue("publishSuccessUrl", response.data.successReportUrl)
//         setFieldsValue("pubishErrorUrl", response.data.errorReportUrl)
//         setFieldsValue("apiPassPercentage", response.data.successPercentage)
//         setFieldsValue("apiFailPercentage", response.data.failurePercentage)
//       }
//       else if(event=="validate"){
//         setFieldsValue("isPublishFailed", false)
//         props.getReadiness(null, guid)
//       }
//       else {
//         const data = {
//           key: 'publishResults'
//         }
//         props.history.location.state = {
//           retailerLogo: retailerLogo,
//           retailerId: retailerId,
//           orgRetailerId: orgRetailerId,
//           guid: guid,
//           retailerCategoryId: retailerCategoryId,
//           retailerCategory: retailerCategory
//         }
//         props.history.push({
//           pathname: "/publishResults", state: {
//             retailerLogo: retailerLogo,
//           retailerId: retailerId,
//           orgRetailerId: orgRetailerId,
//           guid: guid,
//           retailerCategoryId: retailerCategoryId,
//           retailerCategory: retailerCategory
//           }
//         })
//         props.triggerPageLayout(data)
//         setFieldsValue("isProgressFailed", false)
//         setFieldsValue("successUrl", response.data.successReportUrl)
//         setFieldsValue("errorUrl", response.data.errorReportUrl)
//         setFieldsValue("passPercentage", response.data.successPercentage)
//         setFieldsValue("failPercentage", response.data.failurePercentage)
//         setFieldsValue("processedSkus", response.data.processedSkus)
//         processedSkus = response.data.processedSkus
//       }
//     } else if (response &&
//       response.status != 200) {
//       if (type == "publish") {
//         setFieldsValue("isPublishFailed", true)
//       }
//       else {
//         setFieldsValue("isPublishFailed", true)
//         setFieldsValue("isProgressFailed", true)
//       }
//     }
//   }
//   //   const editProduct = (event) => {
//   //     console.log(event,"event")
//   //     console.log(JSON.stringify(event),"JSON.stringify(event)")
//   //     setProductSkuContextValue(JSON.stringify(event))
//   //       setProductMethodContextValue("UPDATE")
//   //     const data = {
//   //       key: "enhancedContent",
//   //     }
//   //     props.history.push("/enhancedContent")
//   //     props.triggerPageLayout(data)
//   //     //setClickEvent(event)
//   // }

//   // const confirmDeleteProduct = (product) => {
//   //     setProduct(product);
//   //     setDeleteProductDialog(true);
//   // }
//   const editProduct = (rowData) =>{
//     let value = []
//     value.push(rowData)
//     setProductSkuContextValue(JSON.stringify(value))
//       setProductMethodContextValue("UPDATE")
//       const data = {
//         key: "enhancedContent",
//       }
//       props.history.location.state = {
//         retailerId:orgRetailerId,
//         guid: guiId,
//         path:"readinessResults",
//           retailerName:orgRetailerName
//       }
//       props.history.push({
//         pathname: "/enhancedContent", state: {
//           retailerId:orgRetailerId,
//           guid: guiId,
//           path:"readinessResults",
//           retailerName:orgRetailerName
//         }
//       })
//     props.triggerPageLayout(data)
//   }
//   const actionBodyTemplate = (rowData) => {
//     return (
//       <div className="publishResultSku">
//         <Button icon="pi pi-pencil" className="p-button-rounded p-button-success pim-edit-btns mr-4" onClick={() => editProduct(rowData)} />
//         {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning pim-edit-btns" onClick={() => confirmDeleteProduct(rowData)} /> */}
//       </div>
//     );
//   }

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" })
//   }, [])

//   useEffect(() => {
//     props.getReadiness(null, props.history.location.state.guid)
//   }, [])

//   useEffect(() => {
//     const { getReadinessResult } = props
//     if (getReadinessResult &&
//       getReadinessResult.content &&
//       getReadinessResult.content.status == '200' &&
//       getReadinessResult.content.data) {
//         setIsPublishModalOpen(false)
//         // setFieldsValue("progressPercentage", 0)
//       let total = getReadinessResult.content.data.totalSKUs
//       let passed = (getReadinessResult.content.data.passedSKUs / total) * 100
//       let failed = (getReadinessResult.content.data.failedSKUs / total) * 100
//       let series = []
//       series.push(passed)
//       series.push(failed)
//       setOrgRetailerName(getReadinessResult.content.data.retailerName)
//       setretailerCategoryId(getReadinessResult.content.data.retailerCategoryId)
//       setretailerId(getReadinessResult.content.data.retailerId)
//       setorgRetailerId(getReadinessResult.content.data.orgRetailerId)
//       setRetailerLogo(getReadinessResult.content.data.retailerLogo)
//       setGuiId(getReadinessResult.content.data.guid)
//       setRetailerCategory(getReadinessResult.content.data.retailerCategory)
//       setPieChartSeries(series)
//       setPublishType(getReadinessResult.content.data.preferredPublishType)
//       props.getReadinessDetails(null, getReadinessResult.content.data.id)
//     }
//   }, [props.getReadinessResult])

//   useEffect(() => {
//     const { getReadinessDetailsResult } = props
//     if (getReadinessDetailsResult &&
//       getReadinessDetailsResult.content &&
//       getReadinessDetailsResult.content.status == '200' &&
//       getReadinessDetailsResult.content.data) {
//       let list = []
//       let delist = []
//       let ids = [],
//       allIds = []
//       getReadinessDetailsResult.content.data.map((i) => {
//         let value = {
//           id: i.id,
//           attrGrpName: renderImage(i.thumbnail),
//           attrName: i.category,
//           attrType: i.brand,
//           attrDescription: i.attrDescription,
//           attrDescription1: i.name,
//           uniqueIdentifier:i.uniqueIdentifier,
//           issues: i.issues,
//           remarks:i.remarks,
//           attrDescription2: renderResult(i.status, i.issues,i.remarks),
//           editIcons: i.isDelete=="true"?"(Product is deleted)":((i.status=="FAILED")||(i.status=="REJECTED"))?authJson["46"].isEnabled?actionBodyTemplate(i):null:null
//         }
        
//         if((i.status=="FAILED")||(i.status=="REJECTED")){
//           if (i.isDelete == "false") {
//             allIds.push(i.id)
//           }
//       }else{
//           if (i.isDelete == "false") {
//             ids.push(i.id)
//           }
//       }
//       if(i.mode=='LIST'){
//         list.push(value)
//       } else if(i.mode=='DELIST'){
//         delist.push(value)
//       }
//       })
//       if(list.length>0){
//         setActiveIndex(0)
//       }else if(delist.length>0){
//         setActiveIndex(1)
//       }
//       setProductIds(allIds)
//       setProductSkuIds(ids)
//       setListData(list)
//       setDelistData(delist)
//       setIsLoader(false)
//     }
//   }, [props.getReadinessDetailsResult])


//   const exportTrigger = (data, field) => {
//     exportApiRequestObject.ids = data
//     exportApiRequestObject.organizationId = userDetails.organizationid
//     if (field == "excel" && listData && listData.length > 0) {
//       axios({
//         url: `${COMMON_URL + PIM_API + EXPORT_EXCEL_URL}`,
//         method: "POST",
//         data: exportApiRequestObject,
//         responseType: "blob", // important
//       }).then((exportResponse) => {
//         if (exportResponse && exportResponse.status != 200) {
//           toastHeading = i18n.t("toastMessage.requestFailed")
//           toastContent = i18n.t("toastMessage.requestFailedMessage")
//           titleBackgroundColor = ERROR_BG_COLOR
//           toastSize = MEDIUM
//           setIsToastMsg(true)
//         } else {
//           const url = window.URL.createObjectURL(
//             new Blob([exportResponse.data])
//           )
//           const link = document.createElement("a")
//           link.href = url
//           link.setAttribute("download", "Attributes.xlsx") //or any other extension
//           document.body.appendChild(link)
//           link.click()
//         }
//       })
//     }
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


//    const handleToastHide = () => {
//     setIsToastMsg(false)
//     setIsGridCheckBox(false)
//   }

//   // const modalContent = <PimerceDataTable
//   //   isHeaderButtonVisible={false}
//   //   columnData={[
//   //     {
//   //       field: "issues",
//   //       header: "Issues",
//   //       filter: false,
//   //       sortable: false,
//   //     }]}
//   //   data={modalGridData}
//   //   tableStyle = {{marginRight:0}}
//   //   isSelectedRowCleared={isSelectedRowCleared}
//   //   totalRecords={totalRecords}
//   //   isPaginator={false}
//   //   isScrollable={true}
//   //   isLazy={true}
//   //   gridHeader={""}
//   //   popupHeader={popupHeader}
//   //   isPopupCancelBtn={false}
//   //   headerButtonsGrb={[]}
//   //   isToolbar={false}
//   //   deleteButtonLabel={deleteButtonLabel}
//   //   updateButtonLabel={i18n.t("attributeDialogText.updateButtonLabel")}
//   //   isGridCheckBox={true}
//   //   isLoader={isLoader}
//   //   exportCallback={exportTrigger}
//   //   onSelectedRowDataTable={selectedRowDataTable}
//   //   isHeaderSearch={false}
//   //   isHeaderfilter={false}
//   //   scrollHeight={SCROLL_HEIGHT}
//   //   scrollWidth={SCROLL_WIDTH}
//   //   columnResizeMode={COLUMN_RESIZE_MODE}
//   //   gridSize={GRID_SIZE}
//   //   // handlePagination={onPageChange}
//   //   // handleSorting={onSortChange}
//   //   // updateAttributeData={updateAttributeData}
//   //   // statusEditor={statusEditor}
//   //   // onRowEditComplete={onRowEditComplete}
//   //   // rowEditValidator={rowEditValidator}
//   //   // onRowEditCancel={onRowEditCancel}
//   //   // enableRowEdit={authJson["6"].isEnabled}
//   //   // Attribute Search box
//   //   pageDataReset={pageDataReset}
//   //   sortData={[{ field: 'attrName', order: -1 }]}
//   // />
//   return (
//     <>
//       {/* <Backpagecomponent props={props}/> */}
//       <div className="p-grid common-header-section">
//         <h5 className="p-m-0  p-col-12  page-header"><ReadinessReportIcon/> Readiness Report</h5>
//       </div>
//       <div style={{ background: 'white', borderRadius: '6px', padding: '1px', marginRight: '-15px',height:"65px" }}>
//         {/* <Steps model={interactiveItems}
//           activeIndex={0} readOnly={true}
//         /> */}
//         <Nav totalSteps={5} stepList={stepList} currentStep={3} />
//       </div>
//       <Row className="mt-4">
//         <Col lg="4" className="retailer-container">
//           <div className="card text-end syndication-result-border" >
//             <div className="publish-card-body"  >
//               <Row>
//                 <Col lg="4">
//                   <div className="img-parent">
//                     <img src={retailerLogo} className="flipkart-img" alt="..." />
//                   </div>
//                 </Col>
//                 <Col lg="8">
//                   <div className="card-details pt-4">
//                     <span className="retailer-category">
//                       <h4>{orgRetailerName}</h4></span>
//                     {/* <ul class="breadcrumb">
//                       <li>Hair Care</li>
//                       <li>Shampoo</li>
//                       <li>Conditioner</li>
//                     </ul> */}

//                   </div>
//                 </Col>
//               </Row>
//             </div>
//           </div>
//         </Col>
//         <Col lg="4" className="publish-action-container">
//           <div className="card text-end syndication-result-border" >
//             <div className="publish-card-body"  >
//               <Row>
//                 <Col lg="4">
//                   <PieChart
//                     labels={["Passed","Failed"]}
//                     series={pieChartSeries}
//                     isPercentage={true}
//                     isDecimal={true}
//                     decimalValue={2}
//                     isLegends={true}
//                     colorProps={["#7be77b","#ff4141"]}
//                     pieSize={1}
//                     pieWidth={240}
//                     type="donut"
//                   />
//                 </Col>
//                 <Col lg="8">
//                   <div className="card-details">
//                     <span className="skus-passed"><b>SKU Validation Results</b></span>
//                   </div>
//                 </Col>
//               </Row>
//             </div>
//           </div>
//         </Col>
//         <Col lg="4" className="publish-action-container publish-action-card">
//           <div className="card text-end syndication-result-border" >
//             <div className="publish-card-body "  >
//               <Row>
//                 <Col lg="12">
//                   <div className="retailer-category publish-action"><b>Publish Actions</b></div>
//                 </Col>
//                 <Col lg="12">
//                   <div className="card-details export-buttons">
//                     <Button
//                     disabled = {!productIds.length||!authJson["46"].isEnabled}
//                     onClick={(e) => confirmPublish("validate")}
//                       className="p-button-success btn-active-17 catalog-btn pimbtn p-mr-1"
//                     > Revalidate Products
//                     </Button>
//                    {/* {publishType&& <Button
//                       className="p-button-success btn-active-17 catalog-btn pimbtn p-mr-1"
//                       disabled = {!productSkuIds.length||!authJson["46"].isEnabled}
//                       onClick={(e) => confirmPublish("publish")}
//                       // disabled={publishType}
//                     > {publishType=="API"? "Confirm Publish":"Download Excel"}
//                     </Button>} */}
//                     {/* <a className="btn btn-primary verifcation-btn" >Verification Report</a>
//                     <a className="btn btn-primary verifcation-btn" onClick={(e)=>confirmPublish(e)}>Confirm Publish</a> */}
//                   </div>
//                 </Col>
//               </Row>
//             </div>
//           </div>
//         </Col>
//       </Row>
//       <div className="mt-4">
//         <ToastModal
//           show={isToastMsg}
//           title={toastHeading}
//           titleBackgroundColor={titleBackgroundColor}
//           content={toastContent}
//           size={toastSize}
//           onModalHide={handleToastHide}
//         />
        
//         <div className="tab-menu-nav card mb-3">
//             <TabMenu model={readinessResultTabMenu} activeIndex={activeIndex} onTabChange={(e) => onTabsChange(e)}/>
//         </div>
//         {/* <PimerceDataTable
//           isHeaderButtonVisible={false}
//           columnData={gridColumn}
//           isInfiniteRows
//           data={activeIndex==0? listData:delistData}
//           isSelectedRowCleared={isSelectedRowCleared}
//           totalRecords={totalRecords}
//           isPaginator={false}
//           isScrollable={false}
//           isLazy={true}
//           gridHeader={""}
//           popupHeader={popupHeader}
//           isPopupCancelBtn={false}
//           headerButtonsGrb={[]}
//           isStripedRows={false}
//           isToolbar={false}
//           deleteButtonLabel={deleteButtonLabel}
//           updateButtonLabel={i18n.t("attributeDialogText.updateButtonLabel")}
//           isGridCheckBox={true}
//           isLoader={isLoader}
//           exportCallback={exportTrigger}
//           onSelectedRowDataTable={selectedRowDataTable}
//           isHeaderSearch={false}
//           isHeaderfilter={false}
//           scrollHeight={SCROLL_HEIGHT}
//           scrollWidth={SCROLL_WIDTH}
//           columnResizeMode={COLUMN_RESIZE_MODE}
//           gridSize={GRID_SIZE}
//           // handlePagination={onPageChange}
//           // handleSorting={onSortChange}
//           // updateAttributeData={updateAttributeData}
//           // statusEditor={statusEditor}
//           // onRowEditComplete={onRowEditComplete}
//           // rowEditValidator={rowEditValidator}
//           // onRowEditCancel={onRowEditCancel}
//           // enableRowEdit={authJson["6"].isEnabled}
//           // Attribute Search box
//           pageDataReset={pageDataReset}
//           sortData={[{ field: 'attrName', order: -1 }]}
//         /> */}
//         <ModalComponent
//           isShowModal={isModalOpen}
//           onHideModal={() => { setIsModalOpen(false) }}
//           modalTitle={"Validation Results"}
//           modalContent={modalContent}
//           modalSize="md"
//           modalDailogClassName="modalDailogContent p-fluid dialogue-box-style"
//         />
//         <Formik
//           initialValues={{
//             progressPercentage: 0,
//             isProgressFailed: false,
//             successUrl: null,
//             errorUrl: null,
//             publishSuccessUrl: null,
//             pubishErrorUrl: null,
//             passPercentage: 0,
//             failPercentage: 0,
//             publishProgressPercentage: 0,
//             isPublishFailed: false,
//             apiPassPercentage: 0,
//             apiFailPercentage: 0,
//             processedSkus: []
//           }}
//         >
//           {({ values, setFieldValue }) => (
//             <>{setFieldsValue = setFieldValue}
//               <Dialog
//                 header={publishModalTitle}
//                 closable={values.isPublishFailed}
//                 // className="import-popup"
//                 className="progress-dialog"
//                 visible={isPublishModalOpen}
//                 // visible={true}
//                 onHide={() => {
//                   setFieldValue("isPublishFailed", false)
//                   setIsPublishModalOpen(false)
//                 }}
//               >
//                 {!values.isPublishFailed?
//                 <div style={{ width: '-webkit-fill-available', paddingTop: "5%", paddingLeft: "21px", paddingRight: "21px" }}>
//                   <ProgressBar
//                     variant="info"
//                     animated
//                     striped
//                     now={Math.round(values.progressPercentage)}
//                     label={Math.round(values.progressPercentage) + "%"}
//                     key={1}
//                   />
//                 </div>:
//                 <div>
//                 <div style={{ width: '-webkit-fill-available',  paddingLeft: "21px", paddingRight: "21px" }}>
//                 <div className="importdata-final-result-img-container">
//                   <img src={exclamaion} className="import-data-success" />
//                 </div>
//                 <div style={{ textAlign: "center" }}>
//                   <h4>{i18n.translate('toastMessage.requestFailedMessage')}</h4>
//                 </div>
//               </div></div>}

//               </Dialog></>
//           )}
//         </Formik>

//       </div>
//     </>
//   )
// }
// export default connect(mapStateToProps)(PublishSku);