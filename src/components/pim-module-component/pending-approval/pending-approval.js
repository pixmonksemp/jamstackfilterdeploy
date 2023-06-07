import React, { useEffect, useState } from 'react'
import PendingIcon from "../../../common/icons/pendingicon"
import { COLUMN_RESIZE_MODE, GRID_SIZE, MAXSIZEDESC, MAXSIZENAME, PIM_API, PIM_TRANSCATIONAL_FLOW, SCROLL_HEIGHT, SCROLL_WIDTH, WORKFLOWMAXSIZE } from '../../../common/common-constants'
import { getPendingApproval, workflowSubmission } from "../../../common/master-data"
import { connect } from "react-redux"
import PimerceDataTable from '../../data-table/data-table'
import "./style.scss"
import Plusicon from '../../../common/icons/plusicon'
import Approveicon from '../../../common/icons/approveicon'
import PimerceAuth from '../../authorization-tag/PimerceAuth'
import ApproveIcon from '../../../assets/approveIcon.svg'
import RejectIcon from '../../../assets/rejectIcon.svg'
import CompareIcon from '../../../assets/compareIcon.svg'
import DataTableRejectIcon from '../../../assets/dataTableRejectIcon.svg'
import DataTableApproveIcon from '../../../assets/dataTableApproveIcon.svg'
import { Col, DropdownButton, Row, Spinner } from "react-bootstrap"
import { COMMON_URL } from "../../../common/common-api-constants"
import { Button } from "primereact/button"
import { ProgressBar } from 'react-bootstrap'
import { ErrorMessage, Field, Formik, Form } from "formik";
import { Dialog } from "primereact/dialog";
import success from '../../../assets/success.svg'
import exclamaion from '../../../assets/exclamation.svg'
import EventSource from "eventsource"
import axios from "axios"
import Nav from "../../../components/pim-module-component/importdata/nav";
import { stepList } from "../../../common/master-data";
import i18n from "../../../translate/i18n";
import ModalComponent from '../../modal'
import { useRef } from 'react'

const mapStateToProps = (state) => {
  return {
    getFilterDataValue: state.stateData.getFilterdata,
    getUserDetail: state.userDetail.getUsersObj.userCredentials,
  }
}

let stepWizard,
  setFieldsValue,
  progressValue = 0,
  processedSkus

let gridColumn = [
  {
    field: "thumbnail",
    header: "Thumbnail",
    width: "10%"
  },
  {
    field: "productSkuName",
    header: "Product Name",
    width: "19%"
  },
  {
    field: "uniqueIdentifier",
    header: "Unique Identifier",
    width: "15%"
  },
  {
    field: "retailer",
    header: "Retailer",
    width: "15%"
  }, {
    field: "status",
    header: "Status",
    width: "13%"
  },
  {
    field: "productMode",
    header: "Mark For Delist",
    width: "14%"
  },
  {
    field: "approverActionButtons",
    header: "",
    width: "14%"
  }

]

function pendingApproval(props) {
  let readinessDetailsIds = props.history.location && props.history.location.state && props.history.location.state.readinessDetailsIds.readinessDetailsIds
  let orgRetailerId = props.history.location && props.history.location.state && props.history.location.state.readinessDetailsIds.orgRetailerId
  let retailerId = props.history.location && props.history.location.state && props.history.location.state.readinessDetailsIds.retailerId
  const { getUserDetail } = props
  const [pendingApproverList, setPendingApproverList] = useState([])
  const [isLoader, setIsLoader] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  const [isShowModal, setIsShowModal] = useState(false)
  const [jsonData, setJsonData] = useState({});
  const [readinessDetailMap, setReadinessDetailMap] = useState({})
  const [isShowPopUp, setIsShowPopUp] = useState(false)
  const [approveStatus, setApproveStatus] = useState("")
  const [reMarkData, setRemark] = useState("")
  const [isSelectedRowCleared, setIsSelectedRowCleared] = useState(false)
  const [isDisablePendingButton, setIsDisableApproveButton] = useState(true)
  const ref = useRef(null)

  const initialValues={
    remarkDetails: reMarkData
  }
  let authJson = JSON.parse(sessionStorage.getItem("authJson"))
  let organizationId =
    getUserDetail &&
    getUserDetail.organizationid &&
    parseInt(getUserDetail.organizationid)

  useEffect(() => {
    let getPendingApprovalRequest = getPendingApproval;
    getPendingApprovalRequest.pageEnd = 10
    getPendingApprovalRequest.pageStart = 0
    getPendingApprovalRequest.sortType = "DESC"
    getPendingApprovalRequest.sortField = "updatedDate"
    getPendingApprovalRequest.ids = readinessDetailsIds
    getPendingApprovalRequest.approveStatus = "PENDINGFORAPPROVAL"
    props.getPendingApprovalSku(getPendingApprovalRequest, null)
  }, [])

  useEffect(() => {
    const { getPendingApprovalSkuResult } = props

    if (getPendingApprovalSkuResult &&
      getPendingApprovalSkuResult.content &&
      getPendingApprovalSkuResult.content.status == "200") {
      setTotalRecords(getPendingApprovalSkuResult.content.data[0] ? getPendingApprovalSkuResult.content.data[0].totalCount : 0)
      setPendingApproverList(getPendingApprovalSkuResult.content.data.map((pendingApprovalSkus) => {
        const dataValue = {}
        Object.assign(dataValue, {
          id: pendingApprovalSkus.id,
          thumbnail: renderimage(pendingApprovalSkus.thumbnail),
          productSkuName: pendingApprovalSkus.productSkuName,
          uniqueIdentifier: pendingApprovalSkus.uniqueIdentifier,
          retailer: pendingApprovalSkus.retailer,
          status: pendingStatus(pendingApprovalSkus.status),
          approverActionButtons: approverActionButtons(pendingApprovalSkus),
          productSkuId: pendingApprovalSkus.productSkuId,
          readinessDetailsId: pendingApprovalSkus.id,
          approverId: pendingApprovalSkus.createdBy,
          productMode: delistStatus(pendingApprovalSkus.productMode),
          isDelete:pendingApprovalSkus.isDelete
        })
        return dataValue
      }))
      setIsLoader(false)
    }
    if (
      getPendingApprovalSkuResult &&
      getPendingApprovalSkuResult.content &&
      getPendingApprovalSkuResult.content.data &&
      getPendingApprovalSkuResult.content.status != 200
    ) {
      setIsLoader(false)
    }
  }, [props.getPendingApprovalSkuResult])

  const pendingStatus = (pendingStatus) => {
    return (
      <div style={{ color: "#DD7D24", fontSize: "14px" }}>
        {pendingStatus == "PENDINGFORAPPROVAL" ? "PENDING" : "NO DATA"}
      </div>
    )
  }

  const stopPropagation = (e) => {
    e.stopPropagation()
  }

  const approverActionButtons = (pendingApprovalSkus) => {
    return (
      <>{!authJson["48"].isEnabled ? null :
      <div onClick={stopPropagation}>        
        <img className="approverActionButtton" src={CompareIcon} disabled/>
        <img className="approverActionButtton" src={DataTableApproveIcon}  
                  onClick={()=>{
                    setIsShowPopUp(true) 
                    setApproveStatus("APPROVED")
                    setRemark("")
                    selectedRowSingleDataTable(pendingApprovalSkus, "singleDelete")
                  }} />
        <img className="approverActionButtton" src={DataTableRejectIcon}  
                  onClick={()=>{
                    setIsShowPopUp(true) 
                    setApproveStatus("REJECTED")
                    setRemark("")
                    selectedRowSingleDataTable(pendingApprovalSkus , "singleDelete")
                  }} />
      </div>}</>
    )
  }

  const renderimage = (thumbnailImage) => {
    return (
      <img
        src={thumbnailImage == null ? PREVIEW : thumbnailImage}
        onError={(e) => (e.target.src = PREVIEW)}
        className="thumbnail-image"
        alt="No Image"
      />
    )
  }

  const delistStatus = (status) =>{
    return status == "DELIST" ? "Yes" : "No"
  }

  const onRemarkClosePopup = () => {
    setIsShowPopUp(false)
  }

  const preventDefault = event => {
    event.preventDefault();
  };

  const validateRemarkDetails = (value) => {
    let error;
    if (!value) {
      error = "Remarks is Required";
    }
    return error;
  };

  const remarkDetailsPopup = () => {
    return (
      <React.Fragment>
        <Formik
          innerRef={ref}
          enableReinitialize={true}
          validateOnChange={approveStatus === "REJECTED" ? true : false}
          validateOnBlur={false} 
          // validateOnMount={approveStatus === "REJECTED" ? true : false} 
          initialValues={{
            remarkDetails: reMarkData,
          }}
          onSubmit={(values)=>{
            pendingApproverAction(values, approveStatus)
          }}
        >
          {({ setFieldTouched , handleChange , values , touched , errors , setFieldValue}) => (
            <Form>
              <div>
              <label className="mr-2 float-right"  style={values.remarkDetails && values.remarkDetails.length >= 2000 ? { color: "red" }: { color: "black" }}>
              {values.remarkDetails ? " (" + values.remarkDetails.length + "/" + WORKFLOWMAXSIZE + ")" : " (" + 0 + "/" + WORKFLOWMAXSIZE + ")"} 
              </label>
              <Field
                as="textarea"
                type="text"
                style={{ width: "98.8%", height: "111px" }}
                className={"pending-approval-inputtext"}
                validate={approveStatus === "REJECTED" ? validateRemarkDetails : null}
                name={"remarkDetails"}
                maxLength={WORKFLOWMAXSIZE}
                onChange={(e) => {
                  handleChange(e);
                  setFieldTouched("remarkDetails");
                  setFieldValue("remarkDetails", e.target.value)
                  // setRemark(e.target.value)
                }}
              />
              </div>
            {touched.remarkDetails && errors.remarkDetails && (
            <div className="errorMsg workflow-error-style">
              {errors.remarkDetails}
            </div>)}
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => { setIsShowPopUp(false) , setRemark("") }}
                  className="pim-btn pim-btn-primary pim-font-property ml-2"
                >
                  {i18n.t("commonButton.cancel")}
                </button>
                <button
                  type="submit"
                  // onClick={() => { pendingApproverAction(event, approveStatus) }}
                  className="pim-btn pim-btn-main pim-font-property ml-2"
                  disabled={approveStatus == "REJECTED" ?  values.remarkDetails.length > 0 ? false : true : false }
                >
                  {"Continue"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </React.Fragment>
    )
  }

  const onPageChange = (pagedata) => {
    let getPendingApprovalRequest = getPendingApproval;
    getPendingApprovalRequest.pageEnd = 10
    getPendingApprovalRequest.pageStart = pagedata.page
    getPendingApprovalRequest.sortType = "DESC"
    getPendingApprovalRequest.sortField = "updatedDate"
    getPendingApprovalRequest.ids = readinessDetailsIds
    getPendingApprovalRequest.approveStatus = "PENDINGFORAPPROVAL"
    props.getPendingApprovalSku(getPendingApprovalRequest, null)
  }


  const pendingApproverAction = (event, status) => {
    let request = workflowSubmission
    let guidValue = null
    let url = COMMON_URL + "api/progress"
    let eventSourceInitDict = { headers: { 'Authorization': `${getUserDetail.token_value.Authorization}` } }
    const eventSource = new EventSource(url, eventSourceInitDict)
    request.approverId = getUserDetail.userName
    request.makerId = null
    request.approveFeedBack = event.remarkDetails ? event.remarkDetails : ""
    request.orgRetailerInfoDTO = {
      "orgId": organizationId,
      "orgRetailerId": orgRetailerId,
      "retailerId": retailerId,
      "productsList": [],
      "passedSkus": [],
      "retailerCategoryId": null,
      "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
      "readinessDetailMap": readinessDetailMap,
      "orgId": organizationId,
    }
    eventSource.onerror = (e) => {
      eventSource.close()
    }
    setFieldsValue("isProgressFailed",false)
    setIsShowPopUp(false)
    setIsShowModal(true)

    eventSource.addEventListener("GUI_ID", (event) => {
      guidValue = JSON.parse(event.data)
      request.orgRetailerInfoDTO.guid = guidValue
      progressValue = 1
      setFieldsValue("publishProgressPercentage", 1)
      eventSource.addEventListener(guidValue, (event) => {
        const result = JSON.parse(event.data)
        if (progressValue - 1 !== result.uploadPercentage) {
          let percentage = ((result.uploadPercentage + 1) / 101) * 100
          progressValue = percentage
          setFieldsValue("publishProgressPercentage", percentage)
        }
        if (result.uploadPercentage == 100) {
          eventSource.close()
        }
      })
      axios({
        url: `${COMMON_URL + PIM_TRANSCATIONAL_FLOW + `${status == "APPROVED" ? "/approve-submission" : "/reject-submission"}`}`,
        method: "POST",
        data: request // important
      }).then((response) => {
        eventSource.removeEventListener('GUI_ID')
        eventSource.removeEventListener(guidValue)
        eventSource.close()
        pendingApprovalProcess(response, status)
        setFieldsValue("publishProgressPercentage", 0)
      })
    })
  }

  const pendingApprovalProcess = (response, status) => {
    if (response && response.status == 200) {
      props.getPendingApprovalSku(getPendingApproval, null)
      setIsShowModal(false)
      setIsSelectedRowCleared(true)
      setFieldsValue("isProgressFailed",false)
    }
    else if(response&&
      response.status!=200){
        // setIsShowModal(false)
        setIsSelectedRowCleared(true)
        setFieldsValue("isProgressFailed",true)
      }
  }

  const selectedRowSingleDataTable = (selectedCurrentRows) => {
    let selectedRow = []
        selectedRow.push(selectedCurrentRows)
    if (selectedRow && selectedRow.length > 0) {
      setIsDisableApproveButton(false);
      const updatedJsonData = { ...jsonData };
      selectedRow &&
        selectedRow.length > 0 &&
        selectedRow.forEach((data) => {
          if (!updatedJsonData.hasOwnProperty(data.productSkuId)) {
            updatedJsonData[data.productSkuId] = data.id;
          }
        });
      setReadinessDetailMap(updatedJsonData);
      return updatedJsonData;
    } else {
      setIsDisableApproveButton(true);
    }
  };

  const selectedRowDataTable = (selectedRow) => {
    if (selectedRow && selectedRow.length > 0) {
      setIsDisableApproveButton(false);
      const updatedJsonData = { ...jsonData };
      selectedRow &&
        selectedRow.length > 0 &&
        selectedRow.forEach((data) => {
          if (!updatedJsonData.hasOwnProperty(data.productSkuId)) {
            updatedJsonData[data.productSkuId] = data.id;
          }
        });
      setReadinessDetailMap(updatedJsonData);
      return updatedJsonData;
    } else {
      setIsDisableApproveButton(true);
      setReadinessDetailMap({})
    }
  };

  const buttonTemplate = () => {
    return (
      <React.Fragment>
        <PimerceAuth
          componentId={"48"}
          componentType="button"
          component={
            <Button
              label={"Approve"}
              className="p-button-success btn-active-17 catalog-btn pimbtn p-mr-1"
              onClick={(event) => {
                setIsShowPopUp(true)
                setApproveStatus("APPROVED")
                setRemark("")
              }}
              disabled={isDisablePendingButton}
            >
              <img className={"p-ml-1"} src={ApproveIcon} />
            </Button>
          }
        />
        <PimerceAuth
          componentId={"48"}
          componentType="button"
          component={
            <Button
              label={"Reject"}
              className="p-button-danger btn-active-17  catalog-btn pimbtn"
              onClick={(event) => {
                setIsShowPopUp(true)
                setApproveStatus("REJECTED")
                setRemark("")
              }}
            disabled={isDisablePendingButton}
            >
              <img className={"p-ml-1"} src={RejectIcon} />
            </Button>
          }
        />
      </React.Fragment>
    )
  }

  return (
    <div>
      <div className="p-grid common-header-section">
        <h5 className="p-m-0 p-col-12 page-header">
          <PendingIcon /> Pending Approval
        </h5>
      </div>
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
          <Dialog
            header={"Processing"}
            closable={values.isProgressFailed}
            className="progress-dialog"
            visible={isShowModal}
            onHide={() => {
              setIsShowModal(false)
            }}
          >
          {setFieldsValue = setFieldValue}
          {!values.isProgressFailed ? (
            <div style={{ width: '-webkit-fill-available', paddingTop: "5%", paddingLeft: "21px", paddingRight: "21px" }}>
              <ProgressBar
                variant="info"
                animated
                striped
                now={Math.round(values.publishProgressPercentage)}
                label={Math.round(values.publishProgressPercentage) + "%"}
                key={1}
              />
            </div>) : values.isProgressFailed && (
            <div style={{ width: '-webkit-fill-available',  paddingLeft: "21px", paddingRight: "21px" }}>
              <div>
                <div className="importdata-final-result-img-container">
                  <img src={exclamaion} className="import-data-success" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h4>{i18n.translate('toastMessage.requestFailedMessage')}</h4>
                </div>
              </div>
           </div> )}
          </Dialog>
        )}
      </Formik>
      {/* Data-Table */}
      <PimerceDataTable
        isHeaderButtonVisible={true}
        columnData={gridColumn}
        data={pendingApproverList}
        totalRecords={totalRecords}
        isPaginator={true}
        isScrollable={false}
        isLazy={true}
        isPopupCancelBtn={false}
        isToolbar={true}
        isLoader={isLoader}
        isHeaderSearch={false}
        isSelectedRowCleared={isSelectedRowCleared}
        onSelectedRowDataTable={selectedRowDataTable}
        isHeaderfilter={false}
        scrollHeight={SCROLL_HEIGHT}
        scrollWidth={SCROLL_WIDTH}
        columnResizeMode={COLUMN_RESIZE_MODE}
        gridSize={GRID_SIZE}
        handlePagination={onPageChange}
        isGridCheckBox={authJson["48"].isEnabled ? false : true}
        headerButtonTemplate={authJson["48"].isEnabled ? buttonTemplate() : undefined}
      />

      <ModalComponent
        isShowModal={isShowPopUp}
        onHideModal={onRemarkClosePopup}
        modalTitle={<label className={`${approveStatus == "REJECTED" ? "required" : ""}`}>Remarks</label>}
        modalContent={remarkDetailsPopup()}
        modalSize="md"
        modalDailogClassName="modalDailogContent p-fluid dialogue-box-style pending-approval-style"
      />
    </div>
  )
}

export default connect(mapStateToProps)(pendingApproval)