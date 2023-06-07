import React, { useContext,useEffect, useState } from "react"
import HeaderContext from "../../../common/header-context"
import PimerceDataTable from "../../../components/data-table/data-table"
import {
  getApiRequestObject,
  getImportAuditApiRequestObject,
  postImportedFileRequest,
} from "../../../common/master-data"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import success from "../../../assets/success.svg"
import exclamaion from "../../../assets/exclamation.svg"
import Success from "../../../assets/passed.svg"
import Failed from "../../../assets/failed.svg"
import Ignored from "../../../assets/ignored.svg"
import axios from "axios"
import "./style.scss"
import {
  CLOUD,
  DIALOG_TEXT,
  FILTER_DATA,
  IS_MODAL,
  LOCAL,
  TEMPLATE_FILE_NAME,
  TEMPLATE_URL,
  SCROLL_HEIGHT,
  SCROLL_WIDTH,
  COLUMN_RESIZE_MODE,
  GRID_SIZE,
  UPPY_PLUGINS,
  DESC,
  ASC,
  DOWNLOAD_FILE_NAME,
  PIM_API,
  LOCAL_COMPUTER,
  XHR_UPLOAD_URL,
  SPACE,
  START_PERCENTAGE,
  STOP_PERCENTAGE,
} from "../../../common/common-constants"
import { Card, ProgressBar } from "react-bootstrap"
import { Button } from "primereact/button"
import i18n from "../../../translate/i18n"
import FileUploader, { resetUppy } from "../../file-uploader/FileUploader"
import StepWizard from "react-step-wizard"
import { COMMON_URL } from "../../../common/common-api-constants"
import EventSource from "eventsource"
import { Dialog } from "primereact/dialog"
import moment from "moment"
import PimerceAuth from "../../authorization-tag/PimerceAuth"
import { Formik } from "formik"
import Alerticon from "../../../common/icons/alerticon"
import { connect } from "react-redux"
import ImportDataIcon from "../../../common/icons/import_data_icon"
let numberOfPage,
  skuGridData = [],
  staticColumn = [
    {
      field: "name",
      header: i18n.t("importdata.fileName")
    },
    {
      field:"createdBy",
      header:"Imported by"
    },
    {
      field: "source",
      header: i18n.t("importdata.fileSource"),
      frozen: false
    },
    {
      field: "time",
      header: i18n.t("importdata.completedTime"),
      filter: false
    },
    {
      field: "details",
      isClickable : true,
      header: i18n.t("importdata.status")
    }
  ],
  savelabel,
  stepWizard = null,
  gridRequest = getImportAuditApiRequestObject,
  fileRequest = postImportedFileRequest,
  importedFile = { name: '' },
  setFieldsValue,
  progressValue = 0,
  summaryRequest = {}

  const mapStateToProps = (state) => {
    return {
      getUserDetail: state.userDetail.getUsersObj.userCredentials
    }
  }

function ImportData(props) {
  const {getUserDetail} = props
  let userDetails = getUserDetail
  const [gridData, setGridData] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [passPercentage, setPassPercentage] = useState(0)
  const [failPercentage, setFailPercentage] = useState(0)
  const [ignoredPercentage, setIgnoredPercetage] = useState(0)
  const [totalSkus,setTotalSkus] = useState(0)
  const [isLoader, setIsLoader] = useState(true)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isCloud, setIsCloud] = useState(false)
  const [isLocal, setIsLocal] = useState(false)
  const [popupHeader, setPopupHeader] = useState(
    i18n.t("importdata.dialogtitle")
  )
  const [isFileUploaded, setIsFileUploaded] = useState(false)
  const [isImportFailed, setIsImportFailed] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isShowImportSummary,setIsShowImportSummary] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [isDisableDownload, setIsDisableDownload] = useState(false)
  const [isCustomUppyStyle, setIsCustomUppyStyle] = useState(true)
  const [templateUrl,setTemplateUrl] = useState(null)
  const [passedSkus, setPassedSkus] = useState(0)
  const [failedSkus, setFailedSkus] = useState(0)
  const [ignoredSkus, setIgnoredSkus] = useState(0)

  const {
    IsImportButtonDock:{IsImportButton, setIsImportButton},
    importDockRenderDate:{importDockRender, setImportDockRender}
  } = useContext(HeaderContext)

  var headerButtonGroup = [
    {
      authId:"34",
      ButtonName: i18n.t("datatable.downloadtemplate"),
      class: "exportpdf",
      iconpos: "right"
    },
    {
      authId:"34",
      isDisableTooltip:true,
      ButtonName: "Import Catalog",
      class: "importCatalog",
      isDisabled : IsImportButton,
      iconpos: "right"
    }
  ]

  const setInstance = (e) => {
    stepWizard = e
  }

  const fileImportResultProcess = (result,isNetworkError) =>{
    if (
      result &&
      result.status == 200 &&
      result.data &&
      result.data.code != 500
    ) {
      setIsProcessing(false)
      if (result.data) {
        // setIsImportFailed(false)
        setFieldsValue("isImportFailed", false)
        if (result.data.failurePercentage > 0) {
          setFieldsValue("isDisableDownload", false)
          // setIsDisableDownload(false)
        } else {
          setFieldsValue("isDisableDownload", true)
          // setIsDisableDownload(true)
        }
        // setPassPercentage(result.data.successPercentage)
        setFieldsValue("passPercentage", result.data.successPercentage)
        setFieldsValue("failPercentage", result.data.failurePercentage)
        // setFailPercentage(result.data.failurePercentage)
        stepWizard.goToStep(3)
      }
    } else if (result) {
      setIsProcessing(false)
      setFieldsValue("isImportFailed",true)
      if (result.data && result.data.description) {
        setFieldsValue("errorMessage",result.data.description)
        // setErrorMessage(result.data.description)
      } else {
        setFieldsValue(
          "errorMessage",
          i18n.t("importdata.requestFailedMessage")
        )
        // setErrorMessage(i18n.t("importdata.requestFailedMessage"))
      }
      stepWizard.goToStep(3)
    } 
    // else if(isNetworkError){
    //   setFieldsValue("errorMessage", i18n.t("importdata.networkError"))
    //   setErrorMessage(i18n.t("importdata.networkError"))
    //   stepWizard.goToStep(3)
    //   setIsProcessing(false)
    //   setFieldsValue("isImportFailed", true)
    // }
    else if(!isNetworkError){
      setFieldsValue("errorMessage", i18n.t("importdata.requestFailedMessage"))
      // setErrorMessage(i18n.t("importdata.requestFailedMessage"))
      stepWizard.goToStep(3)
      setIsProcessing(false)
      setFieldsValue("isImportFailed", true)
    }
    setFieldsValue("totalRecords", null)
    setFieldsValue("insertedRows", null)
  }

  useEffect(()=>{
    const {getImportProcessLogListResult} = props
    if (getImportProcessLogListResult&&
      getImportProcessLogListResult.content&&
      getImportProcessLogListResult.content.status==200&&
      getImportProcessLogListResult.content.data){
        setIsImportFailed(false)
        let failedRows = getImportProcessLogListResult.content.data.filter((i)=>i.status=="FAILED").length
        let failedPercent = (failedRows /totalSkus)*100;
        let passedRows = getImportProcessLogListResult.content.data.filter((i)=>i.status=="SUCCESS").length
        let passedPercent = (passedRows/totalSkus)*100
        setPassPercentage(passedPercent)
        let ignoredcount = totalSkus - (passedRows+failedRows)
        let ignoredPercent = (ignoredcount/totalSkus)*100
        setIgnoredPercetage(ignoredPercent)
        setFailPercentage(failedPercent)
        setIsDisableDownload(failedRows<=0)
        setPassedSkus(passedRows)
        setFailedSkus(failedRows)
        setIgnoredSkus(ignoredcount)
        setIsShowImportSummary(true)
      }else if(getImportProcessLogListResult&&
        getImportProcessLogListResult.content){
        setErrorMessage("The imported file is not supported by the system.")
        setIsImportFailed(true)
        setIsShowImportSummary(true)
      }
  },[props.getImportProcessLogListResult])

  useEffect(()=>{
    const {abortImportedFileResult} = props
    if(abortImportedFileResult&&
      abortImportedFileResult.content&&
      abortImportedFileResult.content.status=='200'){
        setFieldsValue('isApiCanceled',true)
      }
  },[props.abortImportedFileResult])

  useEffect(() => {
    const { postImportedFileResult } = props
    if (
      postImportedFileResult &&
      postImportedFileResult.content &&
      postImportedFileResult.content.status == 200 &&
      postImportedFileResult.content.data &&
      postImportedFileResult.content.data.code != 500
    ) {
      setIsProcessing(false)
      if (postImportedFileResult.content.data) {
        // setIsImportFailed(false)
        if (postImportedFileResult.content.data.failurePercentage > 0) {
          // setIsDisableDownload(false)
        } else {
          // setIsDisableDownload(true)
        }
        // setPassPercentage(postImportedFileResult.content.data.successPercentage)
        // setFailPercentage(postImportedFileResult.content.data.failurePercentage)
        stepWizard.goToStep(3)
      }
    } else if (postImportedFileResult && postImportedFileResult.content) {
      setIsProcessing(false)
      // setIsImportFailed(true)
      if (
        postImportedFileResult.content.data &&
        postImportedFileResult.content.data.description
      ) {
        // setErrorMessage(postImportedFileResult.content.data.description)
      } else {
        // setErrorMessage(i18n.t("importdata.requestFailedMessage"))
      }
      stepWizard.goToStep(3)
    }
  }, [props.postImportedFileResult])

useEffect(() =>{
  if(importDockRender){
    gridRequest.pageStart = 0
    gridRequest.pageEnd = 10
    gridRequest.sortField = "created_date"
    gridRequest.sortType = DESC
    if(userDetails){
    gridRequest.organization_id = userDetails.organizationid
    props.getImportAuditData(gridRequest)
    }
  }
},[importDockRender])

  useEffect(() => {
    gridRequest.pageStart = 0
    gridRequest.pageEnd = 10
    gridRequest.sortField = "created_date"
    gridRequest.sortType = DESC
    if(userDetails){
    gridRequest.organization_id = userDetails.organizationid
    props.getImportAuditData(gridRequest)
    props.getOrganization(null,parseInt(userDetails.organizationid))
    }
  }, [])

  useEffect(() => {
    const { getOrganizationResult } = props
    if (
      getOrganizationResult &&
      getOrganizationResult.content &&
      getOrganizationResult.content.status == 200
    ) {
      setTemplateUrl(getOrganizationResult.content.data.templateURL)
    }
  }, [props.getOrganizationResult])

  useEffect(() => {
    const { getImportAuditDataResult } = props
    if (
      getImportAuditDataResult &&
      getImportAuditDataResult.content &&
      getImportAuditDataResult.content.data &&
      getImportAuditDataResult.content.data.importAudit
    ) {
      skuGridData = getImportAuditDataResult.content.data.importAudit.map(
        (item) => {
          const dataValue = {}
          var myDate = new Date(item.createdDate)
          Object.assign(dataValue, {
            name: item.fileName,
            source: item.fileSource,
            time: moment(myDate).format("DD/MM/YYYY hh:mm:ss A"),
            guid:item.guid,
            createdBy:item.createdBy,
            description:item.description,
            totalSkus:item.totalSkus,
            // item.createdTime.date.month + ' / ' + item.createdTime.date.day + ' / '
            //   + item.createdTime.date.year + ' ' +
            //   (item.createdTime.time.hour <= 12 ?
            //     item.createdTime.time.hour :
            //     Math.abs(item.createdTime.time.hour - 12)) + "."
            //   + item.createdTime.time.minute.toLocaleString('en-US', {
            //     minimumIntegerDigits: 2,
            //     useGrouping: false
            //   }) + (item.createdTime.time.hour < 12 ? " AM" : " PM"),
            details: item.importStatus,
          })
          return dataValue
        }
      )
      numberOfPage = getImportAuditDataResult.content.data.totalElement
      setGridData(skuGridData)
      setTotalRecords(numberOfPage)
      setIsLoader(false)
    }
    setImportDockRender(false)
  }, [props.getImportAuditDataResult])

  const onPageChange = (pagedata) => {
    gridRequest.pageStart = pagedata.page
    setIsLoader(true)
    props.getImportAuditData(gridRequest)
  }

  const downloadFiles = (type) => {
    axios({
      url: `${COMMON_URL + PIM_API + "/downdownImportExcel.xlsx"}`,
      method: "POST",
      data: type=='IMPORT'?fileRequest:summaryRequest,
      responseType: "blob", // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", DOWNLOAD_FILE_NAME) //or any other extension
      document.body.appendChild(link)
      link.click()
    })
  }

  const exportCallback = (e, i) => {
    if(i=="importCatalog"){
      onClick(CLOUD, i18n.t("importdata.importCloud"))
    }else{
      axios({
      url: `${COMMON_URL + PIM_API + "/downloadTemplateExcel"}`,
      method: "POST",
      data: {orgId:userDetails.organizationid},
      responseType: "blob", // important
    }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href =url
    link.setAttribute("download", TEMPLATE_FILE_NAME) //or any other extension
    document.body.appendChild(link)
    link.click()
    })
    }
    
  }

  const mapFieldData = (e, file, result) => {
    let attrResult = []
    result.body.xlAttrList.map((i) => {
      attrResult.push({ attrImport: i })
    })
    if (importedFile.name != file.name) {
      importedFile = file
      stepWizard.goToStep(e)
    }
  }

  const goToStep = (e, file) => {
    let networkError = false
    if (importedFile.name != file.name) {
      importedFile = file
      setIsProcessing(true)
      // fileRequest.attrMappingList = attrMappingList
      fileRequest.fileName = importedFile.name
      fileRequest.fileSize = importedFile.size
      fileRequest.fileType = importedFile.extension.toUpperCase()
      fileRequest.aborted = false
      if (importedFile.source == "react:Dashboard") {
        fileRequest.fileSource = LOCAL_COMPUTER
      } else {
        fileRequest.fileSource = importedFile.source
      }
      fileRequest.userId = 1
      fileRequest.userName = userDetails.userName
      fileRequest.orgId = userDetails.organizationid
      fileRequest.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      let url = COMMON_URL + "api/progress"
      let eventSourceInitDict = {
        headers: { Authorization: `${userDetails.token_value.Authorization}` },
      }
      const eventSource = new EventSource(url, eventSourceInitDict)

      eventSource.onerror = (e) => {
        if(e.message=="network error"){
          networkError = true
          setFieldsValue("errorMessage", i18n.t("importdata.networkError"))
          // setErrorMessage(i18n.t("importdata.networkError"))
          stepWizard.goToStep(3)
          setIsProcessing(false)
          setFieldsValue("isImportFailed", true)
        }
        eventSource.close()
      }
      let guidValue = null
      stepWizard.goToStep(e)
      // eventSource.
      eventSource.addEventListener("GUI_ID", (event) => {
        guidValue = JSON.parse(event.data)
        fileRequest.guid = guidValue
        progressValue = 1
        setProgressPercentage(1)
        setFieldsValue("progressPercentage", 1)
        eventSource.addEventListener(guidValue, (event) => {
          const result = JSON.parse(event.data)
          setFieldsValue("totalRecords", result.lastRowCount)
          setFieldsValue("insertedRows", result.processedRow)
          // if (progressPercentage - 5 !== result) {
          //   setProgressPercentage(((result + 5) / 105) * 100)
          // }
          if (progressValue - 1 !== result.uploadPercentage) {
            let percentage = ((result.uploadPercentage + 1) / 101) * 100
            progressValue = percentage
            setFieldsValue("progressPercentage", percentage)
          }
          // if (isImportFailed) {
          //   eventSource.close()
          // }
          if (result.uploadPercentage == 100) {
            eventSource.close()
          }
        })
        axios({
          url: `${COMMON_URL + PIM_API + "/fileReader"}`,
          method: "POST",
          data: fileRequest, // important
        }).then((response,res) => {
          eventSource.removeEventListener("GUI_ID")
          eventSource.removeEventListener(guidValue)
          eventSource.close()
          fileImportResultProcess(response,networkError)
        })
        // props.postImportedFile(fileRequest)
      })
    }
  }

  const onClick = (name, header) => {
    setIsCloud(false)
    setIsLocal(false)
    setIsShowModal(!isShowModal)
    resetUppy(true)
    if (name == CLOUD) {
      let obj = {
        isCloud:true,
        isCustomUppyStyle:false,
        isComponentName : true
        
        //,isBtnDisble : setBtndisable
      }
      props.triggerFileUpload(obj)
      setIsCloud(true)
      setIsCustomUppyStyle(false)
    } else if (name == LOCAL) {
      let obj = {
        isCloud:false,
        isCustomUppyStyle:true,
        isComponentName : true
      }
      props.triggerFileUpload(obj)
      setIsLocal(true)
      setIsCustomUppyStyle(true)
    }
    setPopupHeader(header)
  }

  const cancelClicked = () => {
    resetUppy(true)
    stepWizard.goToStep(1)
  }

  const onHide = (name) => {
    if (name == IS_MODAL) {
      if (isFileUploaded) {
        setIsFileUploaded(false)
        setProgressPercentage(0)
        progressValue = 0
        setFieldsValue("progressPercentage", 0)
        setFieldsValue("failPercentage", 0)
        setFieldsValue("passPercentage", 0)
        // setPassPercentage(0)
        // setFailPercentage(0)
        setTotalRecords(0)
        setGridData([])
        setIsLoader(true)
        setIsCustomUppyStyle(true)
        gridRequest.pageStart = 0
        gridRequest.pageEnd = 10
        gridRequest.sortField = "created_date"
        gridRequest.sortType = DESC
        props.getImportAuditData(gridRequest)
      }
      importedFile.name = ""
      setIsShowModal(false)
    }
  }

  const onAbort = () => {
    fileRequest.aborted = true
    props.abortImportedFile(fileRequest)
  }
  // const Dynamicftp = (
  //   <div className="p-fluid p-col-12">
  //     <div className="p-field ">
  //       <label htmlFor="name">FTP URL</label>
  //       <InputText id="quantity" value={products.sapCode} />
  //     </div>
  //     <div className="p-field">
  //       <label>Password</label>
  //       <InputText value={products.skuName} />
  //       {submitted &&
  //         !products.skuName &&
  //         <small className="p-error">SkuName is required.</small>}
  //     </div>
  //   </div>
  // )

  const rowColumnClick = (row, column) => {
    if (row.details == "FAILED" && row.description != null) {
      setIsImportFailed(true)
      setErrorMessage(row.description)
      setIsShowImportSummary(true)
    } else {
      // setShowImportSummary(true)
      summaryRequest = {
        orgId: userDetails.organizationid,
        fileName: row.name,
        guid: row.guid,
        userId: 1
      }
      setTotalSkus(row.totalSkus)
      props.getImportProcessLogList(summaryRequest)
    }
  }

  const hideSummaryDialog = () => {
    setIsShowImportSummary(false)
    setPassPercentage(0)
    setFailPercentage(0)
    setIgnoredPercetage(0)
    setTotalSkus(0)
    setIsImportFailed(false)
    setIsDisableDownload(false)
  }
  return (
    <div className="exportdata">
      <div className="p-grid common-header-section">
        <h5 className="p-m-0 p-col-12  page-header">
            <ImportDataIcon />  {i18n.t("importdata.importData")}
        </h5>
      </div>
      <Dialog
        header={"Import Summary"}
        className="import-summary-popup import-summary-overlay-height "
        visible={isShowImportSummary}
        draggable={false}
        onHide={hideSummaryDialog}
      >
        {importSummaryPopupContent()}
      </Dialog>
      {/* <PimerceAuth
        componentId={"33"}
        componentType="button"
        component={
          <Card className="image-box margin-assign" style={{ background: "ffffff" }}>
            <Card.Body className="p-col-12 cardbodycustom">
              <Card.Title className="tile-content-img p-md-5">
                <span className="tablesubheader">
                  {i18n.t("importdata.selectOption")}
                </span>
              </Card.Title>
              <div className="button-group p-md-7">
                <Button
                label="Import Catalog"
                  // label={i18n.t("importdata.cloud")}
                  icon="iconimportdata fromcloud ml-4"
                  iconPos="right"
                  className="p-button-success pimbtn p-mr-2 cloud-btn"
                  onClick={(e) =>
                    onClick(CLOUD, i18n.t("importdata.importCloud"))
                  }
                />
                {/* <Button
                  label={i18n.t("importdata.computer")}
                  icon="iconimportdata local"
                  iconPos="right"
                  className="p-button-success pimbtn p-mr-2 localcomputer-btn"
                  onClick={(e) =>
                    onClick(LOCAL, i18n.t("importdata.importComputer"))
                  }
                /> */}
                {/* <Button
                label="FTP"
                icon="iconimportdata ftp"
                iconPos="right"
                className="p-button-success pimbtn p-mr-2"
                onClick={e => this.onClick("ftp", "Import from FTP")}
              /> */}
              {/* </div>
            </Card.Body>
          </Card>
        }
      /> */} 

      <Dialog
        header={popupHeader}
        closable={!isProcessing}
        className="import-popup"
        visible={false}
        draggable={false}
        onHide={() => {
          if (!isProcessing) {
            onHide(IS_MODAL)
            resetUppy(true)
          }
        }}
      >
        <Formik
          initialValues={{
            progressPercentage: 0,
            isImportFailed: false,
            errorMessage: "",
            totalRecords:null,
            insertedRows:null,
            isApiCanceled:false,
            passPercentage: 0,
            failPercentage: 0,
            isDisableDownload: false,
          }}
        >
          {({ values, setFieldValue }) => (
            <>
              {(setFieldsValue = setFieldValue)}
              <StepWizard
                initialStep={1}
                // nav={<Nav />}
                instance={setInstance}
              >
                <div className= {`import-data ${isCloud?"cloudisopen":"localisopen"}`}>
                  <div
                    className={`file-uploader-container ${
                      isCustomUppyStyle ? "uppy-customization" : ""
                    }`}
                  >
                    {isLocal ? (
                      <FileUploader
                        maxNumberOfFiles={1}
                        maxFileSize={10000000}
                        allowedFileTypes={[".xlsx"]}
                        fileUploadRequest={{
                          orgId: userDetails.organizationid,
                        }}
                        importType={"Excel"}
                        fileUploadURL={XHR_UPLOAD_URL}
                        goToStep={goToStep}
                        // mapFieldData={mapFieldData}
                        setIsFileUploaded={setIsFileUploaded}
                        plugins={[]}
                        disableLocalFiles={false}
                        setIsCustomUppyStyle={() => {
                          setIsFileUploaded(true)
                        }}
                      />
                    ) : null}
                    {isCloud ? (
                      <FileUploader
                        maxNumberOfFiles={1}
                        maxFileSize={10000000}
                        allowedFileTypes={[".xlsx"]}
                        fileUploadRequest={{
                          orgId: userDetails.organizationid,
                        }}
                        importType={"Excel"}
                        fileUploadURL={XHR_UPLOAD_URL}
                        goToStep={goToStep}
                        // mapFieldData={mapFieldData}
                        setIsFileUploaded={setIsFileUploaded}
                        disableLocalFiles={true}
                        plugins={UPPY_PLUGINS}
                        setIsCustomUppyStyle={setIsCustomUppyStyle}
                      />
                    ) : null}
                  </div>
                </div>
          {/* <div className="map-field-container">
            <AttributeMap
              attrValue={excelAttributes}
              nextClicked={goToStep}
              setAttrMappingList={setAttrMappingList}
              attrMappingList={attrMappingList}
              attrSystemList={attrSystemList}
              cancelClicked={cancelClicked}
            />
          </div> */}
           {/* <p className="estimated-time-text">{i18n.t('importdata.estimatedTime')}</p> */}
           
            <div className="file-progress-container">    
            {<><p className="loader-parent" style={{textAlign:'center'}}>{values.totalRecords?`Processed Records:${values.insertedRows}/${values.totalRecords}`:
            <><span>{i18n.t('importdata.fileProcess')}</span><span class="container-loader"><div class="circle circle-1"></div><div class="circle circle-2"></div>
            <div class="circle circle-3"></div><div class="circle circle-4"></div><div class="circle circle-5"></div></span></>}</p></>}
                  <div className="d-flex justify-content-between import-progress-indicator-width mb-2">
                    <span className="d-flex justify-content-lg-start import-indication progress-bar-spacing">{START_PERCENTAGE}</span>
                    <span className="d-flex justify-content-lg-end import-indication">{STOP_PERCENTAGE}</span>
                </div>
                <div className="import-progress-bar-Container">
                  <ProgressBar
                    style={{
                      height: "29px",
                      width: "97%",
                      marginLeft: "24px",
                    }} 
                    variant="info"
                    // animated
                    now={Math.round(values.progressPercentage)} 
                    label={Math.round(values.progressPercentage)+"%"+"   "}
                    key={1}
                  />
                  </div>
                  <div className="import-data-message">
                    <span className="import-info-content">
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Alerticon />&nbsp;&nbsp;{i18n.t("importdata.info")}
                    </span>
                  </div>
                {values.isApiCanceled?<p className="mt-5" style={{textAlign:'center'}}>{i18n.t("importdata.processAbortMsg")}</p>:
                <Button onClick={onAbort} className="importdata-cancel-button import-progress-style importdata-customize-size">
                    {i18n.t("importdata.cancel")}
                </Button>}
                </div>

                <div className="importdata-final-result-container">
                  {values.isImportFailed ? (
                    <div>
                      <div className="importdata-final-result-img-container mb-4">
                        <img src={exclamaion} className="import-data-success" />
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <h4>{values.errorMessage}</h4>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="importdata-final-result-img-container">
                        <img src={success} className="import-data-success" />
                      </div>
                      <Row>
                        <Col
                          xl="3"
                          lg="3"
                          md="3"
                          style={{ marginLeft: "25%" }}
                          className="result-box"
                        >
                          <h1 className="result-percentage">
                            {values.passPercentage % 1 > 0
                              ? values.passPercentage.toFixed(2)
                              : Math.round(values.passPercentage)}
                            %
                          </h1>
                          <h5 className="importdata-final-results">
                            {i18n.t("importdata.uploadedFiles")}
                          </h5>
                        </Col>
                        <Col xl="3" lg="3" md="3" className="result-box">
                          <h1 className="result-percentage">
                            {values.failPercentage % 1 > 0
                              ? values.failPercentage.toFixed(2)
                              : Math.round(values.failPercentage)}
                            %
                          </h1>
                          <h5 className="importdata-final-results">
                            {i18n.t("importdata.ignoredFiles")}
                          </h5>
                        </Col>
                      </Row>
                      <Row className="ml-3" style={{ marginTop: "7%" }}>
                        <Col
                          xl={6}
                          lg={6}
                          md={6}
                          className="p-0"
                          style={{ textAlign: "right" }}
                        >
                         <Button
                            disabled={values.isDisableDownload}
                            style={
                              values.isDisableDownload ? { opacity: "0.6" } : {}
                            }
                            className="importdata-download-button"
                            onClick={()=>{downloadFiles("IMPORT")}}
                          >
                            {i18n.t("importdata.downloadFiles")}
                          </Button>
                        </Col>
                        <Col xl={6} lg={6} md={6}>
                        <Button
                            onClick={() => {
                              onHide(IS_MODAL)
                              resetUppy(true)
                              gridRequest.pageStart = 0
                              props.getImportAuditData(gridRequest)
                            }}
                            className="importdata-close-button"
                            // style={{ width: '120px', color: 'black', background: 'white', borderRadius: "23px", display: 'inline', border: '1px solid black', fontWeight: 600 }}
                          >
                            {i18n.t("importdata.close")}
                        </Button>
                        </Col>
                      </Row>
                    </div>
                  )}
                </div>
              </StepWizard>
            </>
          )}
        </Formik>
      </Dialog>
      <PimerceDataTable
        isHeaderButtonVisible={true}
        columnData={staticColumn}
        data={gridData}
        totalRecords={totalRecords}
        exportCallback={exportCallback}
        handlePagination={onPageChange}
        filterOptions={FILTER_DATA}
        deleteContent={""}
        rowColumnClick={rowColumnClick}
        multiDeleteContent={""}
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
        gridHeader={i18n.t("importdata.gridtitle")}
        pageHeader={i18n.t("importdata.pagetitle")}
        popupHeader={popupHeader}
        addeditPopupWidth={DIALOG_TEXT.ADDEDIT_POPUP_WIDTH}
        isPopupCancelBtn={false}
        headerButtonsGrb={headerButtonGroup}
        lableSave={savelabel}
        isLoader={isLoader}
        isGridCheckBox={true}
      />
    </div>
  )

  function importSummaryPopupContent() {
    return <div>
      {isImportFailed ? (
        <div>
          <div className="importdata-final-result-img-container mb-4">
            <img src={exclamaion} className="import-data-success" />
          </div>
          <div style={{ textAlign: "center" }}>
            <h4>{errorMessage}</h4>
          </div>
        </div>
      ) : (
        <div style={{overflow:"hidden",margin:"10px 5px"}}>
        <Row className="import-final-result-inner-container import-final-result-inner-container-width import-outer-border-head">
          <Col className="import-final-header-width">
          <div className="d-flex justify-content-between">
         <span className="import-final-header-title d-flex justify-content-start"> Total Records</span> &nbsp;&nbsp;
         <span className="import-final-header-records d-flex justify-content-end">{totalSkus}</span>  
          </div>
          </Col>
        </Row>
          <Row className="import-final-result-inner-container import-final-result-inner-container-width import-outer-border-body">
           <Col xl="4" lg="4" md="4" className="import-final-resultbox-container">
             <div className="result-box-inner import-final-passed">
              <div className="row">
                <div className="col">
              <h6 className="importdata-final-results-records">
                {i18n.t("importdata.uploadedFiles")} - {passedSkus}
              </h6>
              </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-xl-8 col-lg-8 col-md-8">
              <h6 className="importdata-final-results-percentage">
              {passPercentage % 1 > 0
                  ? passPercentage.toFixed(2)
                  : Math.round(passPercentage)}
                %
              </h6>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 import-final-result-icon-style">
              <img src={Success} className="import-data-success"/>
              </div>
              </div>
              </div>
            </Col>
            <Col xl="4" lg="4" md="4" className="import-final-resultbox-container">
             <div className="result-box-inner import-final-Failed">
              <div className="row">
                <div className="col">
              <h6 className="importdata-final-results-records">
                {"Failed Records"} - {failedSkus}
              </h6>
              </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-xl-8 col-lg-8 col-md-8">
              <h6 className="importdata-final-results-percentage">
              {failPercentage % 1 > 0
                  ? failPercentage.toFixed(2)
                  : Math.round(failPercentage)}
                %
              </h6>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 import-final-result-icon-style">
              <img src={Failed} className="import-data-success"/>
              </div>
              </div>
              </div>
            </Col>
            <Col xl="4" lg="4" md="4" className="import-final-resultbox-container">
             <div className="result-box-inner import-final-ignored">
              <div className="row">
                <div className="col">
              <h6 className="importdata-final-results-records">
                  {i18n.t("importdata.ignoredFiles")} - {ignoredSkus}
              </h6>
              </div>
              </div>
              <br/>
              <div className="row">
                <div className="col-xl-8 col-lg-8 col-md-8">
              <h6 className="importdata-final-results-percentage">
              {ignoredPercentage % 1 > 0
                  ? ignoredPercentage.toFixed(2)
                  : Math.round(ignoredPercentage)}%
              </h6>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 import-final-result-icon-style">
              <img src={Ignored} className="import-data-success"/>
              </div>
              </div>
              </div>
            </Col>
          </Row>
          {/* Footer */}
          <Row className="ml-3" style={{ marginTop: "3%" }}>
            <Col
              xl={6}
              lg={6}
              md={6}
              className="p-0"
              style={{ textAlign: "right" }}
            >
             <Button
                disabled={isDisableDownload}
                style={isDisableDownload ? { opacity: "0.6" } : {}}
                className="importdata-download-button"
                onClick={() => { downloadFiles("SUMMARY") } }
              >
                {i18n.t("importdata.downloadFiles")}
              </Button>
            </Col>
            <Col xl={6} lg={6} md={6}>
            <Button
                onClick={hideSummaryDialog}
                className="importdata-close-button"
              >
                {i18n.t("importdata.close")}
              </Button>
            </Col>
          </Row>
          </div>
      )}
    </div>
  }
  // }
}
export default connect(mapStateToProps)(ImportData)
