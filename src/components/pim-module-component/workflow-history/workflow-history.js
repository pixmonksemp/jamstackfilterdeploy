// import React, { useEffect, useState } from 'react'
// import PendingIcon from "../../../common/icons/pendingicon"
// import { COLUMN_RESIZE_MODE, GRID_SIZE, SCROLL_HEIGHT, SCROLL_WIDTH } from '../../../common/common-constants'
// import { getPendingApproval } from "../../../common/master-data"
// import { connect } from "react-redux"
// import PimerceDataTable from '../../data-table/data-table'
// import "./style.scss"
// import CommentIcon from '../../../assets/commentIcon.svg'
// import ModalComponent from '../../modal'
// import { Formik } from 'formik'
// import { Form } from 'react-bootstrap'
// import { InputTextarea } from 'primereact/inputtextarea'

// const mapStateToProps = (state) => {
//   return {
//     getFilterDataValue: state.stateData.getFilterdata,
//     getUserDetail: state.userDetail.getUsersObj.userCredentials,
//   }
// }

// let gridColumn = [
//   {
//     field: "thumbnail",
//     header: "Thumbnail",
//     width: "150px"
//   },
//   {
//     field: "productSkuName",
//     header: "Product Name",
//     width: "23%"
//   },
//   {
//     field: "uniqueIdentifier",
//     header: "Unique Identifier",
//     width: "10%"
//   },
//   {
//     field: "approvedBy",
//     header: "Approved By",
//     width: "15%"
//   },
//   {
//     field: "retailer",
//     header: "Retailer",
//     width: "10%"
//   }, 
//   {
//     field: "status",
//     header: "Status",
//     width: "14%"
//   },
//   {
//     field: "productMode",
//     header: "Mark For Delist",
//     width: "15%"
//   },
//   {
//     field: "approverActionButtons",
//     header: "",
//     width: "5%"
//   }
// ]

// const pendingStatus = (pendingStatus) => {
//   let workFlowStatus = null
//   let statusColor = null
//   if (pendingStatus == "PENDINGFORAPPROVAL") {
//     workFlowStatus = "PENDING"
//     statusColor = "#DD7D24"
//   } else if (pendingStatus == "PARTIALLYAPPROVED") {
//     workFlowStatus = "PARTIALLY APPROVED"
//     statusColor = "#9D81CF"
//   } else if (pendingStatus == "APPROVED") {
//     workFlowStatus = "APPROVED"
//     statusColor = "#7ED321"
//   } else if (pendingStatus == "REJECTED") {
//     workFlowStatus = "REJECTED"
//     statusColor = "#FA042D"
//   } else if (pendingStatus == "PUBLISHED") {
//     workFlowStatus = "PUBLISHED"
//     statusColor = "#7ED321"
//   } else if (pendingStatus == "NOTPUBLISHED") {
//     workFlowStatus = "NOT PUBLISHED"
//     statusColor = "#FA042D"
//   }else {
//     workFlowStatus = "No Data"
//     statusColor = "#FA042D"
//   }
//   return (
//     <div style={{ color: statusColor, fontSize: "14px" }}>
//       {workFlowStatus}
//     </div>
//   )
// }

// function workflowHistory(props) {
//   let readinessDetailsIds = props.history.location && props.history.location.state && props.history.location.state.readinessDetailsIds
//   const { getUserDetail } = props
//   const [pendingApproverList, setPendingApproverList] = useState([])
//   const [isLoader, setIsLoader] = useState(true)
//   const [totalRecords, setTotalRecords] = useState(0)
//   const [isShowPopUp, setIsShowPopUp] = useState(false)
//   const [value, setValue] = useState("")

//   let organizationId =
//     getUserDetail &&
//     getUserDetail.organizationid &&
//     parseInt(getUserDetail.organizationid)

//   useEffect(() => {
//     let getPendingApprovalRequest = getPendingApproval;
//     getPendingApprovalRequest.pageEnd = 10
//     getPendingApprovalRequest.pageStart = 0
//     getPendingApprovalRequest.sortType = "ASC"
//     getPendingApprovalRequest.sortField = "updatedDate"
//     getPendingApprovalRequest.ids = readinessDetailsIds
//     getPendingApprovalRequest.approveStatus = "ALL"
//     props.getPendingApprovalSku(getPendingApprovalRequest, null)
//   }, [])

//   useEffect(() => {
//     const { getPendingApprovalSkuResult } = props

//     if (getPendingApprovalSkuResult &&
//       getPendingApprovalSkuResult.content &&
//       getPendingApprovalSkuResult.content.status == "200") {
//       setTotalRecords(getPendingApprovalSkuResult.content.data[0] ? getPendingApprovalSkuResult.content.data[0].totalCount : 0)
//       setPendingApproverList(getPendingApprovalSkuResult.content.data.map((pendingApprovalSkus) => {
//         const dataValue = {}
//         Object.assign(dataValue, {
//           thumbnail: renderimage(pendingApprovalSkus.thumbnail),
//           productSkuName: pendingApprovalSkus.productSkuName,
//           uniqueIdentifier: pendingApprovalSkus.uniqueIdentifier,
//           retailer: pendingApprovalSkus.retailer,
//           status: pendingStatus(pendingApprovalSkus.status),
//           productMode: delistStatus(pendingApprovalSkus.productMode),
//           approvedBy: pendingApprovalSkus.approvedBy,
//           approverActionButtons: approverActionButtons(pendingApprovalSkus.approverFeedBack)
//         })
//         return dataValue
//       }))
//       setIsLoader(false)
//     }
//     if (
//       getPendingApprovalSkuResult &&
//       getPendingApprovalSkuResult.content &&
//       getPendingApprovalSkuResult.content.data &&
//       getPendingApprovalSkuResult.content.status != 200
//     ) {
//       setIsLoader(false)
//     }
//   }, [props.getPendingApprovalSkuResult])


//   const delistStatus = (status) =>{
//     return status == "DELIST" ? "Yes" : "No"
//   }

//   const approverActionButtons = (approverFeedBack) => {
//     return (
//       <button disabled={value.length > 0 ? false : true} style={{cursor:"pointer",background:"#FFF"}} onClick={()=>{
//         setValue(approverFeedBack)
//         setIsShowPopUp(true)
//       }}>
//         <img src={CommentIcon}/>    
//       </button>
//     )
//   }

//   const renderimage = (thumbnailImage) => {
//     return (
//       <img
//         src={thumbnailImage == null ? PREVIEW : thumbnailImage}
//         onError={(e) => (e.target.src = PREVIEW)}
//         className="thumbnail-image"
//         alt="No Image"
//       />
//     )
//   }

//   const onPageChange = (pagedata) => {
//     let getPendingApprovalRequest = getPendingApproval;
//     getPendingApprovalRequest.pageEnd = 10
//     getPendingApprovalRequest.pageStart = pagedata.page
//     getPendingApprovalRequest.sortType = "DESC"
//     getPendingApprovalRequest.sortField = "updatedDate"
//     getPendingApprovalRequest.ids = readinessDetailsIds
//     getPendingApprovalRequest.approveStatus = "ALL"
//     props.getPendingApprovalSku(getPendingApprovalRequest, null)
//   }

//   const onRemarkClosePopup = () => {
//     setIsShowPopUp(false)
//   }

//   const remarkDetailsPopup = () => {
//     return (
//       <React.Fragment>
//         <InputTextarea disabled autoResize value={value} rows={5} cols={30} className="workflow-input-textarea"/>
//       </React.Fragment>
//     );
//   };

//   return (
//     <div className="workflow-history-list">
//       <div className="p-grid common-header-section">
//         <h5 className="p-m-0 p-col-12 page-header">
//           <PendingIcon /> Workflow History
//         </h5>
//       </div>
//       {/* <PimerceDataTable
//         isHeaderButtonVisible={true}
//         columnData={gridColumn}
//         data={pendingApproverList}
//         totalRecords={totalRecords}
//         isPaginator={true}
//         isScrollable={false}
//         isLazy={true}
//         isPopupCancelBtn={false}
//         isToolbar={true}
//         isLoader={isLoader}
//         isHeaderSearch={false}
//         isHeaderfilter={false}
//         scrollHeight={SCROLL_HEIGHT}
//         scrollWidth={SCROLL_WIDTH}
//         columnResizeMode={COLUMN_RESIZE_MODE}
//         gridSize={GRID_SIZE}
//         handlePagination={onPageChange}
//         headerButtonGrb={[]}
//         isGridCheckBox={true}
//         //headerButtonTemplate={buttonTemplate()}
//       /> */}

//       <ModalComponent
//         isShowModal={isShowPopUp}
//         onHideModal={onRemarkClosePopup}
//         modalTitle={"Remarks"}
//         modalContent={remarkDetailsPopup()}
//         modalSize="md"
//         modalDailogClassName="modalDailogContent p-fluid dialogue-box-style workflow-history-style"
//       />
//     </div>
//   )
// }
// export default connect(mapStateToProps)(workflowHistory)