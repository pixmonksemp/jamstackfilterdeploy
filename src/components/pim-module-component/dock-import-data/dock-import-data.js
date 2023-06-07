import { Formik } from "formik"
import React, { useContext, useEffect, useState } from "react"
import { Col, ProgressBar, Row } from "react-bootstrap"
import StepWizard from "react-step-wizard"
import HeaderContext from "../../../common/header-context"
import { DOWNLOAD_FILE_NAME, LOCAL_COMPUTER, PIM_API, START_PERCENTAGE, STOP_PERCENTAGE, UPPY_PLUGINS, XHR_UPLOAD_URL } from "../../../common/common-constants"
import FileUploader, { resetUppy } from "../../file-uploader/FileUploader"
import Alerticon from "../../../common/icons/alerticon"
import { Button } from "primereact/button"
import i18n from "../../../translate/i18n"
import success from "../../../assets/success.svg"
import Success from "../../../assets/passed.svg"
import Failed from "../../../assets/failed.svg"
import Ignored from "../../../assets/ignored.svg"
import exclamaion from "../../../assets/exclamation.svg"
import DockDownload from "../../../assets/dock-download.svg"
import DockArrow from "../../../assets/dock-arrow.svg"
import axios from "axios"
import { COMMON_URL, resources } from "../../../common/common-api-constants"
import EventSource from "eventsource"
import { connect } from "react-redux"
import { postImportedFileRequest } from "../../../common/master-data"
import ApiConnector from "../../../common/hoc/api-connector"
import "./style.scss"

const mapStateToProps = (state) => {
    return {
      getUserDetail: state.userDetail.getUsersObj.userCredentials
    }
  }

  let stepWizard = null,setFieldsValue,
  fileRequest = postImportedFileRequest,
  importedFile = { name: '' },
  progressValue = 0
function DockImportData(props){
    const {getUserDetail} = props
  let userDetails = getUserDetail
  const [passPercentage, setPassPercentage] = useState(0)
  const [failPercentage, setFailPercentage] = useState(0)
  const [isLoader, setIsLoader] = useState(true)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isCloud, setIsCloud] = useState(false)
  const [isLocal, setIsLocal] = useState(false)
  const [excelAttributes, setExcelAttributes] = useState([])
  const [popupHeader, setPopupHeader] = useState(
    i18n.t("importdata.dialogtitle")
  )
  const [isFileUploaded, setIsFileUploaded] = useState(false)
  const [isImportFailed, setIsImportFailed] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [attrMappingList, setAttrMappingList] = useState([])
  const [attrSystemList, setAttrSystemList] = useState([])
  const [isDisableDownload, setIsDisableDownload] = useState(false)
  const [isCustomUppyStyle, setIsCustomUppyStyle] = useState(false)
  const [templateUrl,setTemplateUrl] = useState(null)

  const {
    IsImportButtonDock:{IsImportButton, setIsImportButton},
    IsAssetsBulkImportButtonDock:{IsAssetsBulkImportButton, setIsAssetsBulkImportButton},
    importDockRenderDate:{importDockRender, setImportDockRender},
  } = useContext(HeaderContext)

  const setInstance = (e) => {
    stepWizard = e
  }

  const onAbort = () => {
    fileRequest.aborted = true
    props.abortImportedFile(fileRequest)
  }

  useEffect(()=>{
    const {abortImportedFileResult} = props
    if(abortImportedFileResult&&
      abortImportedFileResult.content&&
      abortImportedFileResult.content.status=='200'){
        setFieldsValue('isApiCanceled',true)
      }
  },[props.abortImportedFileResult])

  useEffect(()=>{
    if(!props.isVisible){
      setIsCustomUppyStyle(props.isCustomUppyStyle)
    }

  },[props.isVisible])

  const dockReport = (percentage,isImportCompleted,importFailed) =>{
    var importReport;
    if(isImportCompleted){
      importReport =  "Completed"
    }else if (importFailed) {
      importReport = "Import Failed"
    } else {
      // setIsImportButton(true)
      // setIsAssetsBulkImportButton(true)
      importReport =  "Importing:"+Math.round(percentage)+ "%"
    }
return importReport
  }

  const fileImportResultProcess = (result,isNetworkError) =>{
    if (
      result &&
      result.status == 200 &&
      result.data &&
      result.data.code != 500
    ) {
      setFieldsValue('isApiCanceled',false)
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
        setPassPercentage(result.data.successPercentage)
        setFieldsValue("passPercentage", result.data.successPercentage)
        setFieldsValue("failPercentage", result.data.failurePercentage)
        setFieldsValue("totalSkus", result.data.totalSks)
        setFieldsValue("ignoredRecords", result.data.ignoredPercentage)
        setFieldsValue("ignoredSkus",result.data.ignoredSkus)
        setFieldsValue("failedSkus",result.data.failedSkus)
        setFieldsValue("passedSkus",result.data.passedSkus)
        setFailPercentage(result.data.failurePercentage)
        setImportDockRender(true)
        stepWizard.goToStep(3)
        setFieldsValue('isImportCompleted',true)
        setFieldsValue('stepNo',3)
      }
    } else if (result) {
      setFieldsValue('isApiCanceled',false)
      setIsProcessing(false)
      setFieldsValue("isImportFailed",true)
      setIsImportFailed(true)
      if (result.data && result.data.description) {
        setFieldsValue("errorMessage",result.data.description)
        setErrorMessage(result.data.description)
      } else {
        setFieldsValue(
          "errorMessage",
          i18n.t("importdata.requestFailedMessage")
        )
        setErrorMessage(i18n.t("importdata.requestFailedMessage"))
      }
      stepWizard.goToStep(3)
      setFieldsValue('stepNo',3)
    } 
    else if(isNetworkError){
      setFieldsValue('isApiCanceled',false)
      setFieldsValue("errorMessage", i18n.t("importdata.networkError"))
      setErrorMessage(i18n.t("importdata.networkError"))
      stepWizard.goToStep(3)
      setFieldsValue('stepNo',3)
      setIsProcessing(false)
      setFieldsValue("isImportFailed", true)
    }else {
      setFieldsValue('isApiCanceled',false)
      setFieldsValue("errorMessage", i18n.t("importdata.requestFailedMessage"))
      setErrorMessage(i18n.t("importdata.requestFailedMessage"))
      stepWizard.goToStep(3)
      setFieldsValue('stepNo',3)
      setIsProcessing(false)
      setFieldsValue("isImportFailed", true)
    }
    setFieldsValue("totalRecords", null)
    setFieldsValue("insertedRows", null)
  }

  const downloadFiles = () => {
    axios({
      url: `${COMMON_URL + PIM_API + "/downdownImportExcel.xlsx"}`,
      method: "POST",
      data: fileRequest,
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

  const goToStep = (e, file) => {
    setIsAssetsBulkImportButton(true)
    setIsImportButton(true)
    // console.log(props,"triggerFileUpload");
       let networkError = false
    if (importedFile.name != file.name) {
      importedFile = file
      setIsProcessing(true)
      // console.log("1")
      props.hideImportDetailsDock()
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
      fileRequest.origin = "foundation"
      fileRequest.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      let url = COMMON_URL + "api/progress"
      let eventSourceInitDict = {
        headers: { Authorization: `${userDetails.token_value.Authorization}` },
      }
      const eventSource = new EventSource(url, eventSourceInitDict)

      eventSource.onerror = (e) => {
        if(e.message=="network error"){
          networkError = true
        }
        eventSource.close()
      }
      let guidValue = null      
      setFieldsValue('isImportCompleted',false)
      stepWizard.goToStep(e)
      setFieldsValue('stepNo',e)
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
          importedFile = { name: '' }
          fileImportResultProcess(response,networkError)
        })
        // props.postImportedFile(fileRequest)
      })
    }
  }
  let orgId
  if(userDetails){
    orgId = userDetails.organizationid
  }
    return(
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
            totalSkus:0,
            ignoredRecords:0,
            ignoredSkus:0,
            failedSkus:0,
            passedSkus:0,
            isDisableDownload: false,
            stepNo:1,
            isImportCompleted: false
          }}
        >
          {({ values, setFieldValue }) => (
            <>
              {(setFieldsValue = setFieldValue)}
              {!props.hide?
              <div class="dock-container">
                <img className="dock-download" src={DockDownload}/>               
                <span className="dock-import-percentage">
                {dockReport(Math.round(values.progressPercentage),values.isImportCompleted,values.isImportFailed)}
              </span>
              </div>:
              <div className="dockerDesign">
                <span className="dock-import-title">{i18n.t("importdata.importCatalog")}</span>
                <div>
                </div><StepWizard
                initialStep={values.stepNo}
                // nav={<Nav />}
                instance={setInstance}
              >
                <div className= {`import-data ${props.isCloud?"cloudisopen":"localisopen"}`}>
                  <div
                    className={`file-uploader-container ${
                      isCustomUppyStyle ? "uppy-customization" : ""
                    }`}
                  >
                    {/* <img className="dock-arrow" src={DockArrow}/> */}
                    {!props.isCloud ? (
                      <FileUploader
                        maxNumberOfFiles={1}
                        maxFileSize={10000000}
                        allowedFileTypes={[".xlsx"]}
                        fileUploadRequest={{
                          orgId: orgId,
                        }}
                        importType={"Excel"}
                        fileUploadURL={XHR_UPLOAD_URL}
                        goToStep={goToStep}
                        // mapFieldData={mapFieldData}
                        setIsFileUploaded={(setIsFileUploaded)}
                        plugins={[]}
                        disableLocalFiles={false}
                        setIsCustomUppyStyle={() => {
                        //   setIsFileUploaded(true)
                        setIsCustomUppyStyle(true)
                        props.isCustomUppyStyle = true
                        }}
                      />
                    ) : null}
                    {props.isCloud ? (
                      <FileUploader
                        maxNumberOfFiles={1}
                        maxFileSize={10000000}
                        allowedFileTypes={[".xlsx"]}
                        fileUploadRequest={{
                          orgId: orgId,
                        }}
                        importType={"Excel"}
                        fileUploadURL={XHR_UPLOAD_URL}
                        goToStep={goToStep}
                        // mapFieldData={mapFieldData}
                        setIsFileUploaded={setIsFileUploaded}
                        disableLocalFiles={false}
                        plugins={UPPY_PLUGINS}
                        setIsCustomUppyStyle={(e)=>{
                          props.isCustomUppyStyle = e
                          setIsCustomUppyStyle(e)
                        }}
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
            {values.stepNo != 1 ?
            <>
            <div className="file-progress-container">                  
            {<p style={{textAlign:'center'}}>{values.totalRecords?`Processed Records:${values.insertedRows}/${values.totalRecords}`:`Your file is processing...`}</p>}
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
                    animated
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
                {values.isApiCanceled?<p className="mt-5" style={{textAlign:'center'}}>Process is aborted. This will take time to complete. Please HOLDON!</p>:
                <Button onClick={onAbort} className="importdata-cancel-button import-progress-style importdata-customize-size">
                    {i18n.t("importdata.cancel")}
                </Button>}
                </div>
                </>:null}
                <div className="importdata-final-result-container importdock" style={{overflow:"hidden"}}>
                  {values.isImportFailed && values.stepNo == 3 ? (
                    <div>
                      <div className="importdata-final-result-img-container mb-4">
                        <img src={exclamaion} className="import-data-success" />
                      </div>
                      <div style={{ textAlign: "center" }} className="import-final-size-padding">
                        <h4>{values.errorMessage}</h4>
                      </div>
                      <div className="import-fail-close">
                      <Button
                            onClick={() => {
                            //   onHide(IS_MODAL)
                              resetUppy(true)
                              props.close()
                              // setFieldsValue('isApiCanceled',true)
                              setFieldsValue('isImportFailed',true)
                              setFieldsValue('stepNo',1)
                              stepWizard.goToStep(1)
                              setIsAssetsBulkImportButton(false)
                              setIsImportButton(false)
                              setIsCustomUppyStyle(false)
                              setImportDockRender(true)
                            }}
                            className="importdata-close-button"
                           
                          >
                            {i18n.t("importdata.close")}
                        </Button>
                        </div>
                    </div>
                  ) : (values.stepNo == 3  ?
                    <>
                    <Row className="import-final-result-inner-container import-outer-border-head">
                      <Col className="import-final-header-width">
                      <div className="d-flex justify-content-between">
                     <span className="import-final-header-title d-flex justify-content-start"> Total Records</span> &nbsp;&nbsp;
                     <span className="import-final-header-records d-flex justify-content-end" style={{margin:"1px"}}>{values.totalSkus}</span>  
                      </div>
                      </Col>
                    </Row>
                      <Row className="import-final-result-inner-container import-outer-border-body">
                       <Col xl="4" lg="4" md="4" className="import-final-resultbox-container">
                         <div className="result-box-inner import-final-passed">
                          <div className="row">
                            <div className="col">
                          <h6 className="importdata-final-results-records">
                            {i18n.t("importdata.uploadedFiles")} - {values.passedSkus}
                          </h6>
                          </div>
                          </div>
                          <br/>
                          <div className="row">
                            <div className="col-xl-8 col-lg-8 col-md-8">
                          <h6 className="importdata-final-results-percentage">
                          {values.passPercentage % 1 > 0
                              ? values.passPercentage.toFixed(2)
                              : Math.round(values.passPercentage)}
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
                            {"Failed Records"} - {values.failedSkus}
                          </h6>
                          </div>
                          </div>
                          <br/>
                          <div className="row">
                            <div className="col-xl-8 col-lg-8 col-md-8">
                          <h6 className="importdata-final-results-percentage">
                          {values.failPercentage % 1 > 0
                              ? values.failPercentage.toFixed(2)
                              : Math.round(values.failPercentage)}
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
                              {i18n.t("importdata.ignoredFiles")} - {values.ignoredSkus}
                          </h6>
                          </div>
                          </div>
                          <br/>
                          <div className="row">
                            <div className="col-xl-8 col-lg-8 col-md-8">
                          <h6 className="importdata-final-results-percentage">
                          {values.ignoredRecords % 1 > 0
                              ? values.ignoredRecords.toFixed(2)
                              : Math.round(values.ignoredRecords)}
                            %
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
                            disabled={values.isDisableDownload}
                            style={
                              values.isDisableDownload ? { opacity: "0.6" } : {}
                            }
                            className="importdata-download-button"
                            onClick={downloadFiles}
                          >
                            {i18n.t("importdata.downloadFiles")}
                          </Button>
                        </Col>
                        <Col xl={6} lg={6} md={6}>
                        <Button
                            onClick={() => {
                            //   onHide(IS_MODAL)
                              setIsCustomUppyStyle(false)
                              setIsAssetsBulkImportButton(false)
                              setIsImportButton(false)
                              setFieldsValue('stepNo',1)
                              stepWizard.goToStep(1) 
                              resetUppy(true)
                              props.close()
                            //   gridRequest.pageStart = 0
                            //   props.getImportAuditData(gridRequest)
                            }}
                            className="importdata-close-button"
                          >
                            {i18n.t("importdata.close")}
                          </Button>
                        </Col>
                      </Row>
                      </>
                  :null)}
                </div>
              </StepWizard></div>}
            </>
          )}
        </Formik>
    )
}

export default connect(mapStateToProps)(ApiConnector(DockImportData,{
    methods:{
        abortImportedFile: {
            type: resources.httpMethod.POST,
            url: PIM_API + "/isProcessAborted",
        }
    }
  }));