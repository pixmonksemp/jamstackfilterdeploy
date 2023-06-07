import React, { useEffect, useState } from "react"
import PimerceDataTable from "../../../../components/data-table/data-table"
import { getpublishHistory } from "../../../../common/master-data"
import "./style.scss"
import {
  DIALOG_TEXT,
  FILTER_DATA,
  SCROLL_HEIGHT,
  SCROLL_WIDTH,
  COLUMN_RESIZE_MODE,
  GRID_SIZE,
  ERROR_BG_COLOR,
  MEDIUM,
} from "../../../../common/common-constants"
import i18n from "../../../../translate/i18n"
import { connect } from "react-redux"
import ApiIcon from "../../../../assets/apiexcelicons.svg"
import excelIcon from "../../../../assets/exceldownloadicon.svg"
import ToastModal from "../../../modal/ToastModal"
import moment from "moment"
import PublishHistoryIcon from "../../../../common/icons/publishHistoryicon"

let numberOfPage,
    publishGridData = [],
    gridColumn = [  
      {
        field: "retailerName",
        header: "Retailer Name",
      },
      {
        field: "updatedBy",
        header: "Published By",
      },
      {
        field: "updatedDate",
        header: "Published Time",
      },
      {
        field: "totalSKUs",
        header: "Total SKUs",
      },
      {
        field: "publishedStatus",
        header: "Published Status",
      },
      {
        field: "publishedType",
        header: "Published Type",
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

function PublishedHistory(props) {
  const { getUserDetail } = props
  let userDetails = getUserDetail
  const [gridData, setGridData] = useState([])
  const [isToastMsg, setIsToastMsg] = useState(false)
  const [toastData, setToastData] = useState(toastObj)
  const [totalRecords, setTotalRecords] = useState(0)
  const [isLoader, setIsLoader] = useState(true)

  useEffect(() => {
    getpublishHistory.pageStart = 0
    getpublishHistory.orgId = parseInt(userDetails.organizationid)
    props.getPublishedHistory(getpublishHistory)
  }, [])

  useEffect(() => {
    const { getPublishedHistoryResult } = props
    if (
      getPublishedHistoryResult &&
      getPublishedHistoryResult.content &&
      getPublishedHistoryResult.content.status == 200 &&
      getPublishedHistoryResult.content.data &&
      getPublishedHistoryResult.content.data.code != 500
    ) {
      setIsLoader(false)
      numberOfPage = getPublishedHistoryResult && getPublishedHistoryResult.content && getPublishedHistoryResult.content.data&&getPublishedHistoryResult.content.data.length ? getPublishedHistoryResult.content.data[0].totalElement : 0
      publishGridData = getPublishedHistoryResult.content.data.map((item) => {
          const dataValue = {}
          var myDate = new Date(item.updatedDate)
          Object.assign(dataValue, {
            id: item.id,
            retailerName: item.retailerName,
            updatedBy:item.updatedBy,
            updatedDate: moment(myDate).format("DD/MM/YYYY hh:mm:ss A"),
            totalSKUs: item.totalSKUs,
            publishedStatus: item.publishedStatus,
            publishedType: item.publishedType,
            editType : editPublishedList(item)
          })
          return dataValue
        }
      )
    } 
    setGridData(publishGridData)
    setTotalRecords(numberOfPage)
    if (
      getPublishedHistoryResult &&
      getPublishedHistoryResult.content &&
      getPublishedHistoryResult.content.status != 200
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
  }, [props.getPublishedHistoryResult])

  const editPublishedList=(type)=>{
    return(
      <div>
      {type.publishedType == "API" ?
      <span style={{cursor:"pointer"}} onClick={()=>{
        const data = {
          key: 'publishResults'
        }
        props.history.location.state = {
          guid: type.guid
        }
        props.history.push({
          pathname: "/publishResults", state: {
          guid: type.guid
          }
        })
        props.triggerPageLayout(data)
      }}><img src={ApiIcon} width={"20px"} height={"18px"}/></span> : 
      <span style={{cursor:"pointer"}} onClick={()=>{
        const link = document.createElement("a")
        link.href =type.publishedUrl
        link.setAttribute("download", "report.zip") //or any other extension
        document.body.appendChild(link)
        link.click()
      }}><img src={excelIcon} width={"20px"} height={"24px"}/></span>
      }
      </div>
    )
  }

  const onPageChange = (pagedata) => {
    setIsLoader(true)
    getpublishHistory.pageStart = pagedata.page
    getpublishHistory.pageEnd = 10
    getpublishHistory.orgId = userDetails.organizationid
    props.getPublishedHistory(getpublishHistory)
  }

  const handleToastHide = () => {
    setIsToastMsg(false)
  }

  return (
    <div>
       <div className="p-grid common-header-section">
        <h5 className="p-m-0  p-col-12  page-header">
         <PublishHistoryIcon/> {"Publishing History"}
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
        // gridHeader="Details of Published SKUs"
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
export default connect(mapStateToProps)(PublishedHistory)
