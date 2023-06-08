// import { useEffect, useState } from "react"
// import React, { Component } from "react"
// import {
//   ASC,
//   COLUMN_RESIZE_MODE,
//   CREATE,
//   DESC,
//   ERROR_BG_COLOR,
//   GRID_SIZE,
//   MEDIUM,
//   RECORD,
//   RECORDS,
//   SCROLL_HEIGHT,
//   SCROLL_WIDTH,
//   UPDATE,
//   VALID_BG_COLOR,
// } from "../../../common/common-constants"
// import { getRolesApiRequestObject } from "../../../common/master-data"
// import i18n from "../../../translate/i18n"
// import ToastModal from "../../modal/ToastModal"
// import PimerceDataTable from "../../data-table/data-table"
// import { Button } from "primereact/button"
// import ModalComponent from "../../modal"
// import PimerceAuth from "../../authorization-tag/PimerceAuth"
// import PlusIcon from "../../../common/icons/plusicon"
// import CloseIcon  from "../../../common/icons/deleteicon"
// import UpdateIcon from "../../../common/icons/updateicon"
// import RoleIcon from "../../../common/icons/roleicon"
// import { connect } from "react-redux"

// let gridColumn = [
//     {
//       field: "roleName",
//       header: "Role Name",
//       filter: false,
//       width: "30%"
//     },
//     {
//       field: "roleDescription",
//       header: "Role Description",
//       filter: false,
//       width: "70%"
//     },
//   ]

// const mapStateToProps = (state) => {
//   return {
//     getUserDetail: state.userDetail.getUsersObj.userCredentials
//   }
// }

// function RoleManagementComponent(props) {
//   const {getUserDetail} = props
//   let authJson = JSON.parse(sessionStorage.getItem("authJson"))
//   const [isToastMsg, setIsToastMsg] = useState(false)
//   const [isDeleteRecordsDialog, setIsDeleteRecordsDialog] = useState(false)
//   const [isLoader, setIsLoader] = useState(true)
//   const [isSelectedRowCleared, setIsSelectedRowCleared] = useState(false)
//   const [isDisableUpdateButton, setIsDisableUpdateButton] = useState(true)
//   const [isDisableDeleteButton, setIsDisableDeleteButton] = useState(true)
//   const [onSelected, setOnSelected] = useState([])
//   const [toastSize, setToastSize] = useState(null)
//   const [toastContent, setToastContent] = useState(null)
//   const [toastHeading, setToastHeading] = useState(null)
//   const [titleBackgroundColor, setTitleBackgroundColor] = useState(null)
//   const [gridData, setGridData] = useState([])
//   const [totalRecords, setTotalRecords] = useState(0)

//   let userDetails = getUserDetail

//   useEffect(() => {
//     getRolesApiRequestObject.pageStart = 0
//     getRolesApiRequestObject.pageEnd = 10
//     getRolesApiRequestObject.organizationid = userDetails.organizationid
//     getRolesApiRequestObject.sortField = "updatedDate"
//     getRolesApiRequestObject.sortType = DESC
//     props.getRoles(getRolesApiRequestObject)
//   }, [])

//   useEffect(() => {
//     const { getRolesResult } = props
//     if (
//       getRolesResult &&
//       getRolesResult.content &&
//       getRolesResult.content.data
//     ) {
//       // setIsSelectedRowCleared(true)
//       setGridData(getRolesResult.content.data.roles)
//       setTotalRecords(getRolesResult.content.data.totalElement)
//       setIsLoader(false)
//     }
//   }, [props.getRolesResult])

//   useEffect(() => {
//     const { deleteRolesResult } = props
//     if (
//       deleteRolesResult &&
//       deleteRolesResult.content &&
//       deleteRolesResult.content.status == 200
//     ) {
//       setIsSelectedRowCleared(true)
//       setToastHeading(i18n.t("toastMessage.deleteRole"))
//       setToastContent(deleteRolesResult.content.data)
//       setTitleBackgroundColor(VALID_BG_COLOR)
//       setToastSize(MEDIUM)
//       setIsToastMsg(true)
//       // getRolesApiRequestObject.pageStart = 0
//       // getRolesApiRequestObject.pageEnd = 10
//       // getRolesApiRequestObject.organizationid = userDetails.organizationid
//       // getRolesApiRequestObject.sortType = DESC   
//         // getRolesApiRequestObject.organizationid = userDetails.organizationid
//         // getRolesApiRequestObject.sortType = ASC
//     // props.getRoles(getRolesApiRequestObject) 
//         props.getRoles(getRolesApiRequestObject)
//     } else if (
//       deleteRolesResult &&
//       deleteRolesResult.content &&
//       deleteRolesResult.content.status == 207
//     ) {
//       setIsSelectedRowCleared(true)
//       setToastHeading(i18n.t("toastMessage.deleteRole"))
//       setToastContent(
//         deleteRolesResult &&
//           deleteRolesResult.content &&
//           deleteRolesResult.content.data 
//           ? deleteRolesResult.content.data
//           : onSelected.length > 1 ? i18n.t("toastMessage.requestFailedMessageSuperAdminDeleteRoles") : i18n.t("toastMessage.requestFailedMessageSuperAdminDeleteRole") 
//       )
//       setTitleBackgroundColor(ERROR_BG_COLOR)
//       setToastSize(MEDIUM)
//       setIsToastMsg(true)
//       props.getRoles(getRolesApiRequestObject)
//     }
//     else if (
//       deleteRolesResult &&
//       deleteRolesResult.content &&
//       deleteRolesResult.content.status == 300
//     ) {
//       setIsSelectedRowCleared(true)
//       setToastHeading(i18n.t("toastMessage.deleteRole"))
//       setToastContent(
//         deleteRolesResult &&
//           deleteRolesResult.content &&
//           deleteRolesResult.content.data 
//           ? deleteRolesResult.content.data
//           :onSelected.length > 1 ? i18n.t("toastMessage.requestFailedMessageSuperAdminDeleteRoles") : i18n.t("toastMessage.requestFailedMessageSuperAdminDeleteRole") 
//       )
//       setTitleBackgroundColor(ERROR_BG_COLOR)
//       setToastSize(MEDIUM)
//       setIsToastMsg(true)
//     }
//     else if(deleteRolesResult &&
//       deleteRolesResult.content ) {
//       setIsSelectedRowCleared(true)
//       setToastHeading(i18n.t("toastMessage.deleteRole"))
//       setToastContent(onSelected.length > 1 ? i18n.t("toastMessage.requestFailedMessageSuperAdminDeleteRoles") : i18n.t("toastMessage.requestFailedMessageSuperAdminDeleteRole"))
//       setTitleBackgroundColor(ERROR_BG_COLOR)
//       setToastSize(MEDIUM)
//       setIsToastMsg(true)
//     }
//   }, [props.deleteRolesResult])

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
//     setOnSelected(selectedRow ? selectedRow : [])
//   }
  
//   const handleToastHide = () => {
//     // getRolesApiRequestObject.pageStart = 0
//     // getRolesApiRequestObject.pageEnd = 10
//     // getRolesApiRequestObject.organizationid = userDetails.organizationid
//     // getRolesApiRequestObject.sortType = ASC
//     // props.getRoles(getRolesApiRequestObject)
//     // setIsLoader(true)
//     setIsToastMsg(false)
//     // setIsGridCheckBox(false)
//   }

//   const deleteOnClick = () => {
//     setIsDeleteRecordsDialog(false)
//     let deleteRoles = {}
//     deleteRoles.deleteByIds = onSelected.map((i) => {
//       return i.id
//     })
//     props.deleteRoles(deleteRoles)
//   }

//   const buttonTemplate = () => {
//     return (
//       <React.Fragment>
//         <PimerceAuth
//           componentId={"37"}
//           componentType="button"
//           component={
//             <Button
//               label={i18n.t("superAdminContents.addNewRole")}
//               className="p-button-success btn-active-17 pimbtn p-mr-2"
//               onClick={() => {
//                 const data = {
//                   key: "addEditRole",
//                 }
//                 sessionStorage.setItem("roleRedirectType", CREATE)
//                 props.history.push("/addEditRole")
//                 props.triggerPageLayout(data)
//                 // openDialog(CREATE)
//               }}
//             >
//                <PlusIcon svgLeftSpace="12px"/>
//              </Button> 
//           }
//         />
//         <PimerceAuth
//           componentId={"39"}
//           componentType="button"
//           component={
//             <Button
//               label={i18n.t("superAdminContents.deleteRole")}
//               className="p-button-danger btn-active-17 pimbtn"
//               onClick={() => setIsDeleteRecordsDialog(true)}
//               disabled={isDisableDeleteButton}
//             >
//             <CloseIcon svgLeftSpace="12px"/>
//             </Button>
//           }
//         />
//         <PimerceAuth
//           componentId={"38"}
//           componentType="button"
//           component={
//             <Button
//             label={i18n.t("superAdminContents.updateRole")}
//               className="p-button-danger btn-active-17 pimbtn"
//               //   onClick={() => openDialog(UPDATE)}
//               onClick={() => {
//                 sessionStorage.setItem("roleRedirectType", UPDATE)
//                 sessionStorage.setItem("roleId", onSelected[0].id)
//                 const data = {
//                   key: "addEditRole",
//                 }
//                 props.history.push("/addEditRole")
//                 props.triggerPageLayout(data)
//               }}
//               disabled={isDisableUpdateButton}
//             >
//               <UpdateIcon svgLeftSpace="12px"/>
//             </Button>

//           }
//         />
//         {/* <Button
//               label={updateButtonLabel}
//               icon="fa fa-refresh"
//               iconPos="right"
//               className="p-button-danger pimbtn"
//               onClick={() => openDialog(UPDATE)}
//               disabled={isDisableUpdateButton}
//             /> */}
//       </React.Fragment>
//     )
//   }

//   const onPageChange = (pagedata) => {
//     setIsLoader(true)
//     getRolesApiRequestObject.pageStart = pagedata.page
//     getRolesApiRequestObject.organizationId = userDetails.organizationid
//     props.getRoles(getRolesApiRequestObject)
//   }

//   const onHideMultipleDeleteDialog = () => {
//     setIsDeleteRecordsDialog(false)
//   }

//   const deleteDialogMessage = () => {
//     let message = i18n.t("superAdminContents.deleteSelectedRecords"),
//       record = onSelected.length > 1 ? RECORDS : RECORD
//     let deleteContentMessage = onSelected.length > 1 ? message : i18n.t("deleteRecord")
//     let finalmessage;
//     if(onSelected.length > 1){
//       finalmessage= deleteContentMessage + " " + onSelected.length + " " +record
//     }
//     else{
//       finalmessage = onSelected!=null && onSelected.length !=0? deleteContentMessage +' " '+  onSelected[0].roleName +' " ?':null
//     }
//     return finalmessage
//   }

//   const deleteAttrDialogue = (
//     <React.Fragment>
//       <Button
//         label={i18n.t("datatable.no")}
//         className="p-button-text custom-button cancel-button"
//         onClick={() => onHideMultipleDeleteDialog()}
//       />
//       <Button
//         label={i18n.t("datatable.yes")}
//         className="p-button-text custom-button btn-yes"
//         onClick={() => deleteOnClick()}
//       />
//     </React.Fragment>
//   )
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
//       <ModalComponent
//         isShowModal={isDeleteRecordsDialog}
//         onHideModal={onHideMultipleDeleteDialog}
//         modalTitle={"Delete Roles"}
//         modalContent={
//           <div className="confirmation-content">
//             <i className="exclamation-triangle"/>
//             <span>
//               {deleteDialogMessage()}
//               {/* {"Do you want to delete the selected "}  {onSelected.length + onSelected.length > 1 ? " records" : " record"} */}
//             </span>
//           </div>
//         }
//         modalSize="md"
//         modalDailogClassName="modalDailogContent smallDialog"
//         modalFooter={deleteAttrDialogue}
//       />
//       <div className="p-grid common-header-section">
//         <h5 className="p-m-0  p-col-12  page-header">
//           <RoleIcon /> {i18n.t("superAdminContents.manageRole")}
//         </h5>
//       </div>
//       {/* <PimerceDataTable
//         isHeaderButtonVisible={false}
//         columnData={gridColumn}
//         data={gridData}
//         isSelectedRowCleared={isSelectedRowCleared}
//         totalRecords={totalRecords}
//         isPaginator={true}
//         isScrollable={false}
//         isLazy={true}
//         // gridHeader={"Role List"}
//         popupHeader={i18n.t("superAdminContents.roleCreateTitle")}
//         isPopupCancelBtn={false}
//         // headerButtonsGrb={headerButtonGroup}
//         isToolbar={true}
//         deleteButtonLabel={i18n.t("superAdminContents.deleteRole")}
//         updateButtonLabel={i18n.t("superAdminContents.updateRole")}
//         isGridCheckBox={authJson["24"].isEnabled ? false : true}
//         isLoader={isLoader}
//         // exportCallback={exportTrigger}
//         onSelectedRowDataTable={selectedRowDataTable}
//         isHeaderSearch={false}
//         isHeaderfilter={false}
//         scrollHeight={SCROLL_HEIGHT}
//         scrollWidth={SCROLL_WIDTH}
//         columnResizeMode={COLUMN_RESIZE_MODE}
//         gridSize={GRID_SIZE}
//         handlePagination={onPageChange}
//         // updateAttributeData={updateAttributeData}
//         // statusEditor={statusEditor}
//         // onRowEditComplete={onRowEditComplete}
//         // rowEditValidator={rowEditValidator}
//         // onRowEditCancel={onRowEditCancel}
//         enableRowEdit={false}
//         headerButtonTemplate={buttonTemplate()}
//       /> */}
//       {/* <Toolbar className="p-mb-4" left={buttonTemplate} /> */}
//     </div>
//   )
// }

// export default connect(mapStateToProps)(RoleManagementComponent)
