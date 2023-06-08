// import React, { useEffect, useState } from "react"
// import { GROUP } from "../../../../common/common-constants"
// import i18n from "../../../../translate/i18n"
// import { Container, Row, Col, Button } from "react-bootstrap"
// import MapIcon from "../../../../assets/map-icon.svg"
// import SelectIcon from "../../../../assets/select-icon.svg"
// import PublishIcon from "../../../../assets/publish-icon.svg"
// import ValueChangeIcon from "../../../../assets/value-change-icon.svg"
// import { Dropdown } from 'primereact/dropdown';
// // import { Button } from "primereact/button"
// import ModalComponent from "../../../modal/index"
// import { Link } from 'react-router-dom'
// import "./style.scss"
// import ToastModal from "../../../modal/ToastModal"
// import { MEDIUM, VALID_BG_COLOR } from "../../../../common/common-constants"
// import { connect } from "react-redux"

// let toastHeading,
//     toastContent,
//     titleBackgroundColor,
//     toastSize

// const mapStateToProps = (state) => {
//     return {
//       getUserDetail: state.userDetail.getUsersObj.userCredentials
//     }
//   }

// function RetailerList(props) {
//     const { getUserDetail } = props
//     const [selectedRetailer, setselectedRetailer] = useState(null);
//     const [RetailerList, setRetailerList] = useState([])
//     const [retailerDetails, setretailerDetails] = useState([])
//     const [clickEvent, setClickEvent] = useState("")
//     const [isGridDialog, setIsGridDialog] = useState(false)
//     const [retailerdata, setRetailerData] = useState(null)
//     const [retailerId, setRetailerId] = useState(null)
//     const [enableSelect, setEnableSelect] = useState(false)
//     const [isToastMsg, setIsToastMsg] = useState(false)
//     const [isSelectEnabled, setIsSelectEnabled] = useState(false)

//     let retailerListData = []
//     const MAP = 'map'
//     let userDetails = getUserDetail

//     useEffect(() => {
//         props.getAllRetailers()
//     }, [])

//     useEffect(() => {
//         const {
//             getAllRetailersResult
//         } = props

//         if (
//             getAllRetailersResult &&
//             getAllRetailersResult.content &&
//             getAllRetailersResult.content.data
//         ) {
//             setretailerDetails(getAllRetailersResult.content.data)
//             retailerListData =
//                 getAllRetailersResult.content.data.map(
//                     (item) => {
//                         const dataValue = {}
//                         Object.assign(dataValue, {
//                             id: item.id,
//                             name: item.channelName,
//                         })
//                         return dataValue
//                     }
//                 )
//             setRetailerList(retailerListData)
//         }
//     }, [props])

//     useEffect(() => {
//         const { existsOrgRetailersResult } = props
//         if (
//             existsOrgRetailersResult &&
//             existsOrgRetailersResult.content &&
//             existsOrgRetailersResult.content.status == 200 &&
//             existsOrgRetailersResult.content.data &&
//             existsOrgRetailersResult.content.data.code != 500
//         ) {
//             setIsSelectEnabled(true)
//             if (existsOrgRetailersResult.content.data.errorMsg == "Not Found") {
//                 setEnableSelect(false)
//             } else {
//                 setEnableSelect(true)
//             }
//         }
//     }, [props.existsOrgRetailersResult])

//     const onRetailerChange = (e) => {
//         setselectedRetailer(e.value);
//         let obj = retailerDetails.find(i => i.id == e.value.id)
//         setRetailerId(e.value.id)
//         setRetailerData(obj)
//         if (e.value.id) {
//             retailerOrgAttrMap(e.value.id)
//         }
//     }
//     const openDialog = (event) => {
//         const data = {
//             key: 'retailerAttributeMap'
//         }
//         props.triggerPageLayout(data)
//         props.history.push({
//             pathname: '/retailerAttributeMap', state: {
//                 data: retailerdata,
//                 retailerId: retailerId
//             }
//         });
//     }
//     const hideDialog = () => {
//         setIsGridDialog(false)
//     }
//     const retailerOrgAttrMap = (value) => {
//         const requestBody = {
//             "orgId": userDetails.organizationid,
//             "retailerId": value,
//             "isdeleted": false
//         }
//         setIsSelectEnabled(false)
//         props.existsOrgRetailers(requestBody)
//     }

//     const handleToastHide = () => {
//         setIsToastMsg(false)
//     }


//     const pageRedirect = () => {
//         if (!enableSelect) {
//             toastHeading = "Retailder Attributes not mapped"
//             toastContent = "Selected Retailer is not mapped with your Attributes"
//             titleBackgroundColor = VALID_BG_COLOR
//             toastSize = MEDIUM
//             setIsToastMsg(true)
//         }
//         if (enableSelect) {
//             const data = {
//                 key: enableSelect ? 'selectProducts' : ""
//             }
//             // props.history.push("/selectProducts")
//             props.triggerPageLayout(data)
//             props.history.push({
//                 pathname: '/selectProducts', state: {
//                     retailerId: retailerId
//                 }
//             });
//         }
//     }

//     return (
//         <>
//             <div className="d-flex flex-column pt-4">
//                 <div className="d-flex flex-row justify-content-between mt-5 mb-5">
//                     <div className="page-title">Publish - List of Retailers</div>
//                     <div className=""></div>
//                 </div>
//                 <div className="bg-white text-dark retailer-list-container">
//                     <Container fluid>
//                         <Row >
//                             <Col className="pim-mt-80 d-flex justify-content-center">
//                                 <Dropdown
//                                     value={selectedRetailer}
//                                     options={RetailerList}
//                                     onChange={onRetailerChange}
//                                     optionLabel="name"
//                                     placeholder="Select a Retailer"
//                                     className=""
//                                     style={{ width: "380px", height: "40px" }}
//                                 /></Col>
//                         </Row>
//                         <Row className="pim-mt-40">
//                             <Col className="d-flex justify-content-center">
//                                 {/* <Link
//                                     style={retailerId ? { pointerEvents: 'visible' } : { pointerEvents: 'none' }}
//                                     className="pim-button btn-space d-flex align-items-center"
//                                     onClick={() => openDialog(MAP)}
//                                     to={{
//                                         pathname: "/retailerAttributeMap",
//                                         state: {
//                                             data: retailerdata,
//                                             retailerId: retailerId
//                                         },
//                                     }}
//                                 >
//                                     <span>Map</span>
//                                     <img src={MapIcon} className="map-btn-icon" />
//                                 </Link> */}
//                                 <Button
//                                     variant="link"
//                                     className="pim-button btn-space"
//                                     onClick={() => openDialog(MAP)}
//                                     disabled={retailerId ? false : true}>
//                                     <span>Map</span>
//                                     <img src={MapIcon} className="map-btn-icon" />
//                                 </Button>
//                                 {/* <Link onClick={() => {
//                                     if (!enableSelect) {
//                                         toastHeading = "Retailder Attributes not mapped"
//                                         toastContent = "Slected Retailer is not mapped with your Attributes"
//                                         titleBackgroundColor = VALID_BG_COLOR
//                                         toastSize = MEDIUM
//                                         setIsToastMsg(true)
//                                     }
//                                     const data = {
//                                         key: enableSelect ? 'selectProducts' : "retailerList"
//                                     }
//                                     // props.history.push("/selectProducts")
//                                     props.triggerPageLayout(data)
//                                 }}
//                                     to={{
//                                         pathname: enableSelect ? "/selectProducts" : "/retailerList",
//                                         state: {
//                                             retailerId: retailerId
//                                         },
//                                     }}
//                                     style={retailerId ? { pointerEvents: 'visible' } : { pointerEvents: 'none' }}
//                                     className="pim-button btn-space d-flex align-items-center">
//                                     <span>Select</span>
//                                     <img src={SelectIcon} className="select-btn-icon" />
//                                 </Link> */}
//                                 <Button variant="link" onClick={pageRedirect} className="pim-button btn-space" disabled={(retailerId&&isSelectEnabled) ? false : true}>
//                                     <span>Select</span>
//                                     <img src={SelectIcon} className="select-btn-icon" />
//                                 </Button>
//                                 <Button variant="link" className="pim-button btn-space">
//                                     <span>publish</span>
//                                     <img src={PublishIcon} className="publish-btn-icon" />
//                                 </Button>
//                                 <Button variant="link" className="pim-button btn-space">
//                                     <span>Manage Category</span>
//                                     <img src={ValueChangeIcon} className="value-change-btn-icon" />
//                                 </Button>

//                             </Col>
//                         </Row>
//                     </Container>
//                 </div>
//                 {clickEvent === MAP ? (<ModalComponent
//                     isShowModal={isGridDialog}
//                     onHideModal={hideDialog}
//                     modalTitle="Map retailer attribute with your attribute"
//                     modalContent={retailerOrgAttrMap()}
//                     modalSize="lg"
//                     modalDailogClassName="modalDailogContent p-fluid dialogue-box-style"
//                 />) : null}

//             </div>
//             <ToastModal
//                 show={isToastMsg}
//                 title={toastHeading}
//                 titleBackgroundColor={titleBackgroundColor}
//                 content={toastContent}
//                 size={toastSize}
//                 onModalHide={handleToastHide}
//             />
//         </>
//     )
// }
// export default connect(mapStateToProps)(RetailerList)