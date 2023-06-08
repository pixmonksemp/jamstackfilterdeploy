import React, { useEffect, useState } from 'react'
import PendingIcon from "../../../common/icons/pendingicon"
import { COLUMN_RESIZE_MODE, GRID_SIZE, SCROLL_HEIGHT, SCROLL_WIDTH } from '../../../common/common-constants'
import { getPendingApproval } from "../../../common/master-data"
import { connect } from "react-redux"
// import PimerceDataTable from '../../data-table/data-table'
import "./style.scss"
import Plusicon from '../../../common/icons/plusicon'
import Approveicon from '../../../common/icons/approveicon'
import PimerceAuth from '../../authorization-tag/PimerceAuth'
import ApproveIcon from '../../../assets/approveIcon.svg'
import RejectIcon from '../../../assets/rejectIcon.svg'
import CompareIcon from '../../../assets/compareIcon.svg'
import DataTableRejectIcon from '../../../assets/dataTableRejectIcon.svg'
import DataTableApproveIcon from '../../../assets/dataTableApproveIcon.svg'
import WorkflowDetailsnavIcon from '../../../assets/workflowDetailsnavIcon.svg'
// import { Button } from "primereact/button"
import { Card, Spinner } from 'react-bootstrap'

const mapStateToProps = (state) => {
    return {
      getFilterDataValue: state.stateData.getFilterdata,
      getUserDetail: state.userDetail.getUsersObj.userCredentials,
    }
  }

  let gridColumn = [
    {
        field: "",
        header: "",
        width: "3%"
    },
    {
      field: "retailer",
      header: "Retailer",
      width: "17%"
    },
    {
      field: "totalSku",
      header: "Total SKUs",
      width: "16%"
    },
    {
      field: "status",
      header: "Status",
      width: "17%"
    },
    {
      field: "createdBy",
      header: "Created By",
      width: "17%"
    }, {
      field: "createdTime",
      header: "Created Time",
      width: "17%"
    },
    {
      field: "approverActionButtons",
      header: "",
      width: "17%"
    }
  
  ]

  function approvalWorkflow(props) {
    const { getUserDetail } = props
    const [pendingApprovalWorkflowList, setPendingApprovalWorkflowList] = useState([])
    const [approvalWorkflowList, setApprovalWorkflowList] = useState([])
    const [isApprovalWorkflowLoader, setIsApprovalWorkflowLoader] = useState(true)
    const [pendingTotalRecords, setPendingTotalRecords] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoader, setIsloader] = useState(true)

    let organizationId =
    getUserDetail &&
    getUserDetail.organizationid &&
    parseInt(getUserDetail.organizationid)

    useEffect(() => {
        let getPendingApprovalRequest = getPendingApproval;
        getPendingApprovalRequest.pageEnd = 10
        getPendingApprovalRequest.pageStart = 0
        getPendingApprovalRequest.orgId = organizationId
        getPendingApprovalRequest.sortType = "DESC"
        getPendingApprovalRequest.approveStatus = "PENDINGFORAPPROVAL"
        getPendingApprovalRequest.sortField = "updatedDate"
        props.getPendingApprovalWorkflow(getPendingApprovalRequest, null)
      }, [])

      useEffect(() => {
        let getPendingApprovalRequest = getPendingApproval;
        getPendingApprovalRequest.pageEnd = 10
        getPendingApprovalRequest.pageStart = 0
        getPendingApprovalRequest.orgId = organizationId
        getPendingApprovalRequest.sortType = "DESC"
        getPendingApprovalRequest.approveStatus = "ALL"
        getPendingApprovalRequest.sortField = "updatedDate"
        props.getApprovalWorkflow(getPendingApprovalRequest, null)
      }, [])

      useEffect(() =>{
        const { getPendingApprovalWorkflowResult } = props
        if (getPendingApprovalWorkflowResult &&
            getPendingApprovalWorkflowResult.content &&
            getPendingApprovalWorkflowResult.content.status == "200") {
                setPendingTotalRecords(getPendingApprovalWorkflowResult.content.data.length  != 0 ? getPendingApprovalWorkflowResult.content.data[0].totalElement : 0 )
                setPendingApprovalWorkflowList(getPendingApprovalWorkflowResult.content.data.map((approvalWorkflowData) =>{
                    const pendingApprovalResponseObj = {}
                    Object.assign(pendingApprovalResponseObj,{
                        retailer:approvalWorkflowData.retailerName,
                        totalSku:approvalWorkflowData.readinessDetailsIds.length,
                        status: pendingStatus(approvalWorkflowData.approveStatus),
                        createdBy:approvalWorkflowData.createdBy,
                        createdTime:approvalWorkflowData.createdDate,
                        approverActionButtons: approverActionButtons(approvalWorkflowData)
                    })
                    return pendingApprovalResponseObj
                }))
                setIsloader(false)
                setIsLoading(false)
            }
      },[props.getPendingApprovalWorkflowResult])

      useEffect(() =>{
        const { getApprovalWorkflowResult } = props
        if (getApprovalWorkflowResult &&
            getApprovalWorkflowResult.content &&
            getApprovalWorkflowResult.content.status == "200") {
                setTotalRecords(getApprovalWorkflowResult.content.data.length != 0 ? getApprovalWorkflowResult.content.data[0].totalElement : 0 )
                setApprovalWorkflowList(getApprovalWorkflowResult.content.data.map((approvalWorkflowData) =>{
                    const approvalResponseObj = {}
                    Object.assign(approvalResponseObj,{
                        retailer:approvalWorkflowData.retailerName,
                        totalSku:approvalWorkflowData.readinessDetailsIds.length,
                        status: pendingStatus(approvalWorkflowData.approveStatus),
                        createdBy:approvalWorkflowData.createdBy,
                        createdTime:approvalWorkflowData.createdDate,
                        approverActionButtons: pendingWorkflowActionButtons(approvalWorkflowData)
                    })
                    return approvalResponseObj
                }))
                setIsApprovalWorkflowLoader(false)
                setIsLoading(false)
            }
      },[props.getApprovalWorkflowResult])

      const onPageChangeForPendingWorkflow = (pagedata) => {
        let getPendingApprovalRequest = getPendingApproval;
        getPendingApprovalRequest.pageEnd = 10
        getPendingApprovalRequest.pageStart = pagedata.page
        getPendingApprovalRequest.orgId = organizationId
        getPendingApprovalRequest.sortType = "DESC"
        getPendingApprovalRequest.approveStatus = "PENDINGFORAPPROVAL"
        getPendingApprovalRequest.sortField = "updatedDate"
        props.getPendingApprovalWorkflow(getPendingApprovalRequest, null)
      }

      const onPageChangeForWorkflow = (pagedata) => {
        let getPendingApprovalRequest = getPendingApproval;
        getPendingApprovalRequest.pageEnd = 10
        getPendingApprovalRequest.pageStart = pagedata.page
        getPendingApprovalRequest.orgId = organizationId
        getPendingApprovalRequest.sortType = "DESC"
        getPendingApprovalRequest.approveStatus = "PARTICALLYAPPROVED"
        getPendingApprovalRequest.sortField = "updatedDate"
        props.getApprovalWorkflow(getPendingApprovalRequest, null)
      }

      const pendingApproval = (redirectedData) =>{
        if(redirectedData != null || redirectedData != undefined){
          const data = {
            key: "pendingApproval",
          }
          if(!props.redirectType){
            props.history.push({
            pathname: "/pendingApproval",
            state: {readinessDetailsIds : redirectedData },
          })
            props.triggerPageLayout(data)
            }
          }
      }

      const workflowHistory = (redirectedData) =>{
      if(redirectedData != null || redirectedData != undefined){
        const data = {
          key: "workflowHistory",
        }
        if(!props.redirectType){
          props.history.push({
          pathname: "/workflowHistory",
          state: {readinessDetailsIds : redirectedData},
        })
          props.triggerPageLayout(data)
          }
        }
    }


      const approverActionButtons = (data) =>{
        return(
          <>
          <img className="approverActionButtton" src={WorkflowDetailsnavIcon}  onClick={()=>pendingApproval(data)}/>    
         </>
          )
      }

      const pendingWorkflowActionButtons = (data) =>{
        return(
          <>
          <img className="approverActionButtton" src={WorkflowDetailsnavIcon} onClick={()=>workflowHistory(data.readinessDetailsIds)}/>    
         </>
          )
      }

      const pendingStatus = (pendingStatus) =>{
        let workFlowStatus =  null
        let statusColor = null
        if(pendingStatus == "PENDINGFORAPPROVAL"){
          workFlowStatus = "PENDING"
          statusColor = "#DD7D24"
        }else if(pendingStatus == "PARTIALLYAPPROVED"){
          workFlowStatus = "PARTIALLY APPROVED"
          statusColor = "#9D81CF"
        }else if(pendingStatus == "APPROVED"){
          workFlowStatus = "APPROVED"
          statusColor = "#7ED321"
        }else if(pendingStatus == "REJECTED"){
          workFlowStatus = "REJECTED"
          statusColor = "#FA042D"
        }else{
          workFlowStatus = "No Data"
          statusColor = "#FA042D"
        }
        return(
          <div style={{color:statusColor,fontSize:"14px"}}>
            {workFlowStatus}
          </div>
        )
      }


    return (
      <div>
         <div className="p-grid common-header-section">
        <h5 className="p-m-0 p-col-12 page-header">
          <PendingIcon /> Approval WorkFlow
        </h5>
      </div>
      {isLoading ? (
        <Card className="dataview-loading-image">
          <center style={{ margin: "auto" }}>
            <Card.Body>
              <Spinner animation="grow" className="spinner" />
            </Card.Body>
          </center>
        </Card>
      ):(
        <>
      {/* <PimerceDataTable
        isHeaderButtonVisible={true}
        columnData={gridColumn}
        data={pendingApprovalWorkflowList}
        totalRecords={pendingTotalRecords ? pendingTotalRecords : 0}
        handlePagination={onPageChangeForPendingWorkflow}
        isPaginator={true}
        isScrollable={false}
        isLazy={true}
        isLoader={isLoader}
        isHeaderSearch={false}
        isHeaderfilter={false}
        scrollHeight={SCROLL_HEIGHT}
        scrollWidth={SCROLL_WIDTH}
        isGridCheckBox={true}
        columnResizeMode={COLUMN_RESIZE_MODE}
        gridSize={GRID_SIZE}
        isPopupCancelBtn={false}
        gridHeader="Pending Approval"
      />
      <PimerceDataTable
        isHeaderButtonVisible={true}
        columnData={gridColumn}
        data={approvalWorkflowList}
        totalRecords={totalRecords ? totalRecords : 0}
        handlePagination={onPageChangeForWorkflow}
        isPaginator={true}
        isScrollable={false}
        isLazy={true}
        isLoader={isApprovalWorkflowLoader}
        isHeaderSearch={false}
        isHeaderfilter={false}
        scrollHeight={SCROLL_HEIGHT}
        scrollWidth={SCROLL_WIDTH}
        isGridCheckBox={true}
        columnResizeMode={COLUMN_RESIZE_MODE}
        gridSize={GRID_SIZE}
        isPopupCancelBtn={false}
        gridHeader="WorkFlow History"
      /> */}
      </>)}
      </div>
      
    )}

export default connect(mapStateToProps)(approvalWorkflow)