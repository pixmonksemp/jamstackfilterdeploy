import React, { useEffect, useState } from "react"
import PimerceDataTable from "../../../../components/data-table/data-table"
import { getReadinessHistoryRequest } from "../../../../common/master-data"
import "./style.scss"
import {SCROLL_HEIGHT,SCROLL_WIDTH,COLUMN_RESIZE_MODE,GRID_SIZE, ERROR_BG_COLOR, MEDIUM,} from "../../../../common/common-constants"
import i18n from "../../../../translate/i18n"
import { connect } from "react-redux"
import ApiIcon from "../../../../assets/apiexcelicons.svg"
import excelIcon from "../../../../assets/exceldownloadicon.svg"
import ToastModal from "../../../modal/ToastModal"
import moment from "moment"
import ReadinessHistoryIcon from "../../../../common/icons/readinessHistory"

let numberOfPage,
    readinessGridData = [],
    gridColumn = [
      {
        field: "retailerName",
        header: "Retailer Name",
      },
      {
        field: "updatedBy",
        header: "Validated By",
      },
      {
        field: "updatedDate",
        header: "Validated Time",
      },
      {
        field: "totalSKUs",
        header: "Total SKUs",
      },
      {
        field: "readinessReportStatus",
        header: "Validated Status",
      },
      {
        field: "preferredPublishType",
        header: "Publish Type",
      },
      {
        field: "editType",
        header: "",
      },
    ]
    let toastObj = {
      toastHeading: "",
      toastContent: "",
      titleBackgroundColor: "",
      toastSize: "",
    }

const mapStateToProps = (state) => {
  return {
    getUserDetail: state.userDetail.getUsersObj.userCredentials,
  }
}

function readinessHistory(props) {
  const { getUserDetail } = props
  let userDetails = getUserDetail
  const [gridData, setGridData] = useState([])
  const [isToastMsg, setIsToastMsg] = useState(false)
  const [toastData, setToastData] = useState(toastObj)
  const [totalRecords, setTotalRecords] = useState(0)
  const [isLoader, setIsLoader] = useState(true)

  useEffect(() => {
    getReadinessHistoryRequest.pageStart = 0
    getReadinessHistoryRequest.orgId = parseInt(userDetails.organizationid)
    props.getReadinessHistory(getReadinessHistoryRequest)
  }, [])

  useEffect(() => {
    const { getReadinessHistoryResult } = props
    if (
      getReadinessHistoryResult &&
      getReadinessHistoryResult.content &&
      getReadinessHistoryResult.content.status == 200 &&
      getReadinessHistoryResult.content.data &&
      getReadinessHistoryResult.content.data.code != 500
    ) {
      setIsLoader(false)
      numberOfPage = getReadinessHistoryResult && getReadinessHistoryResult.content.data &&getReadinessHistoryResult.content.data.length && getReadinessHistoryResult.content.data[0].totalElement
      readinessGridData = getReadinessHistoryResult.content.data.map((item) => {
          const dataValue = {}
          var myDate = new Date(item.updatedDate)
          Object.assign(dataValue, {
            id: item.id,
            retailerName: item.retailerName,
            updatedBy:item.updatedBy,
            updatedDate: moment(myDate).format("DD/MM/YYYY hh:mm:ss A"),
            totalSKUs: item.totalSKUs,
            preferredPublishType: item.preferredPublishType,
            readinessReportStatus: item.readinessReportStatus,
            editType: editReadinessList(item)
          })
          return dataValue
        }
      )
    } 
    setGridData(readinessGridData)
    setTotalRecords(numberOfPage)
    if (
      getReadinessHistoryResult &&
      getReadinessHistoryResult.content &&
      getReadinessHistoryResult.content.status != 200
    ) {
      let toast = toastData
      toast.titleBackgroundColor = ERROR_BG_COLOR
      toast.toastContent = i18n.t("toastMessage.requestFailedMessage")
      toast.toastHeading = i18n.t("toastMessage.requestFailed")
      toast.size = MEDIUM
      setToastData(toast)
      setIsToastMsg(true)
      setIsLoader(false)
    }
  }, [props.getReadinessHistoryResult])

  const editReadinessList = (type) =>{
    return(
      <div>
        <span style={{cursor:"pointer"}} onClick={()=>{
          const data = {
            key:'readinessResults'
          }
          props.history.location.state = {
           guid:type.guid
          }
          props.history.push({pathname:"/readinessResults",state:{
            guid:type.guid
          }})
          props.triggerPageLayout(data)
          }}><img src={ApiIcon} width={"20px"} height={"24px"}/></span>
      {/* {type == "API" ?      
      <span onClick={()=>{alert("1")}}><img src={ApiIcon} width={"20px"} height={"18px"}/></span> : 
      <span onClick={()=>{alert("2")}}><img src={excelIcon} width={"20px"} height={"24px"}/></span>
      } */}
      </div>
    )
  }

  const onPageChange = (pagedata) => {
    setIsLoader(true)
    getReadinessHistoryRequest.pageStart = pagedata.page
    getReadinessHistoryRequest.pageEnd = 10
    getReadinessHistoryRequest.orgId = userDetails.organizationid
    props.getReadinessHistory(getReadinessHistoryRequest)
  }

  const handleToastHide = () => {
    setIsToastMsg(false)
  }

  return (
    <div>
       <div className="p-grid common-header-section">
        <h5 className="p-m-0  p-col-12  page-header">
          <ReadinessHistoryIcon/> {"Readiness History"}
        </h5>
      </div>
      <PimerceDataTable
        isHeaderButtonVisible={true}
        columnData={gridColumn}
        data={gridData}
        totalRecords={totalRecords}
        handlePagination={onPageChange}
        isPaginator={true}
        isScrollable={true}
        isResizableColumns={false}
        isLazy={true}
        isHeaderSearch={false}
        isHeaderfilter={false}
        scrollHeight={SCROLL_HEIGHT}
        scrollWidth={SCROLL_WIDTH}
        columnResizeMode={COLUMN_RESIZE_MODE}
        gridSize={GRID_SIZE}
        isPopupCancelBtn={false}
        isLoader={isLoader}
        isGridCheckBox={true}
      />

      <ToastModal
        show={isToastMsg}
        title={toastData.toastHeading}
        titleBackgroundColor={toastData.titleBackgroundColor}
        content={toastData.toastContent}
        size={toastData.toastSize}
        onModalHide={handleToastHide}
      />
    </div>
  )
}
export default connect(mapStateToProps)(readinessHistory)