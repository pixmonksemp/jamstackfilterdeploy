import { Formik } from "formik";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { Button, Col, ProgressBar, Row } from "react-bootstrap";
import StepWizard from "react-step-wizard";
import { COMMON_URL, resources } from "../../../../common/common-api-constants";
import { PIM_API } from "../../../../common/common-constants";
import ApiConnector from "../../../../common/hoc/api-connector";
import SkulistPage from "../../../../pages/pim-module-pages/skulist-page/skulist-page";
import i18n from "../../../../translate/i18n";
import success from '../../../../assets/success.svg'
import exclamaion from '../../../../assets/exclamation.svg'
import EventSource from "eventsource"
import axios from "axios"
import { connect } from "react-redux";
import Nav from "../../importdata/nav";
import { stepList } from "../../../../common/master-data";
// import Backpagecomponent from "../../../back-page-component/back-page-component";
import SelectProductSkuIcon from "../../../../common/icons/selectProductSkuicon";

let stepWizard,
setFieldsValue,
progressValue = 0,
processedSkus

const mapStateToProps = (state) => {
  return {
    getUserDetail: state.userDetail.getUsersObj.userCredentials
  }
}

function SelectProduct(props) {
  const { getUserDetail } = props
  let userDetails = getUserDetail
  const [selectedProducts, setSelectedProducts] = useState([])
  const [publishTypes,setPublishTypes] = useState([])
  const [isShowModal, setIsShowModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [retailerId,setRetailerId] = useState(null)
  const [retailerCategoryId,setRetailerCategoryId] = useState(null)
  const [orgRetailerId,setOrgRetailerId] = useState(null)

  const setInstance = (e) => {
    stepWizard = e
  }

  useEffect(()=>{
    setRetailerId(props.history.location.state.retailerId)
    setRetailerCategoryId(props.history.location.state.retailerCategoryId)
    const requestBody = {
      "orgId": userDetails.organizationid,
      "retailerId": props.history.location.state.retailerId,
      // "mappedAttribute": "",
      // "mappedValues": "",
      "isdeleted": false
  }
  props.getRetailer(null,props.history.location.state.retailerId)
  props.existsOrgRetailers(requestBody)
  },[])
  useEffect(()=>{
    const {getRetailerResult} = props
    if(getRetailerResult&&
      getRetailerResult.content&&
      getRetailerResult.content.data&&
      getRetailerResult.content.data.preferredPublishType){
        let publishingTypes = getRetailerResult.content.data.preferredPublishType.split(",")
        setPublishTypes(publishingTypes)
      }
  },[props.getRetailerResult])
  useEffect(()=>{
    const {existsOrgRetailersResult} = props
    if(existsOrgRetailersResult&&
      existsOrgRetailersResult.content&&
      existsOrgRetailersResult.content.status == 200){
        setOrgRetailerId(existsOrgRetailersResult.content.data.id)
      }
  },[props.existsOrgRetailersResult])

  const publishProducts = () =>{
    let url = COMMON_URL + "api/progress"
    let eventSourceInitDict = { headers: { 'Authorization': `${userDetails.token_value.Authorization}` } }
    const eventSource = new EventSource(url, eventSourceInitDict)
    stepWizard.goToStep(3)
    let request = {
      "orgId": userDetails.organizationid,
      "orgRetailerId":orgRetailerId,
      "retailerId": retailerId,
      "processedSkus": processedSkus
  }
    eventSource.onerror = (e) => {
      eventSource.close()
    }
    let guidValue = null
    setIsShowModal(true)
    // eventSource.
    eventSource.addEventListener("GUI_ID", (event) => {
      guidValue = JSON.parse(event.data)
      request.guid = guidValue
      progressValue = 1
      setFieldsValue("publishProgressPercentage",1)
      eventSource.addEventListener(guidValue, (event) => {
        const result = JSON.parse(event.data)
        // if (progressPercentage - 5 !== result) {
        //   setProgressPercentage(((result + 5) / 105) * 100)
        // }
        if (progressValue -1 !== result.uploadPercentage){
          let percentage = ((result.uploadPercentage + 1) / 101) * 100
          progressValue = percentage
          setFieldsValue("publishProgressPercentage",percentage)
        }
        
        if (result.uploadPercentage == 100) {
          eventSource.close()
        }
      })
      axios({
        url: `${COMMON_URL + PIM_API + "/publish-products"}`,
        method: "POST",
        data: request // important
      }).then((response) => {
        eventSource.removeEventListener('GUI_ID')
        eventSource.removeEventListener(guidValue)
        eventSource.close()
        fileImportResultProcess(response,"publish")
        setFieldsValue("publishProgressPercentage",0)
        stepWizard.goToStep(4)
      })
      // props.postImportedFile(fileRequest)
    })
  }

  const productsSelected = (exportProductSkuIds) => {
    let url = COMMON_URL + "api/progress"
    let eventSourceInitDict = { headers: { 'Authorization': `${userDetails.token_value.Authorization}` } }
    const eventSource = new EventSource(url, eventSourceInitDict)
    let productIds = selectedProducts.length? selectedProducts.map((i)=>{
      return i.id
    }):exportProductSkuIds
    let request = {
      "orgId": userDetails.organizationid,
      "orgRetailerId":orgRetailerId,
      "retailerId": retailerId,
      "productsList": productIds,
      "retailerCategoryId":retailerCategoryId,
      "passedSkus":[],
      "timezone" : Intl.DateTimeFormat().resolvedOptions().timeZone
  }
    eventSource.onerror = (e) => {
      eventSource.close()
    }
    let guidValue = null
    setIsShowModal(true)
    setFieldsValue("isPublishFailed",false)
    // eventSource.
    eventSource.addEventListener("GUI_ID", (event) => {
      guidValue = JSON.parse(event.data)
      request.guid = guidValue
      progressValue = 1
      setFieldsValue("progressPercentage",1)
      eventSource.addEventListener(guidValue, (event) => {
        const result = JSON.parse(event.data)
        // if (progressPercentage - 5 !== result) {
        //   setProgressPercentage(((result + 5) / 105) * 100)
        // }
        if (progressValue -1 !== result.uploadPercentage){
          let percentage = ((result.uploadPercentage + 1) / 101) * 100
          progressValue = percentage
          setFieldsValue("progressPercentage",percentage)
        }
        
        if (result.uploadPercentage == 100) {
          eventSource.close()
        }
      })
      axios({
        url: `${COMMON_URL + PIM_API + "/product-validation"}`,
        method: "POST",
        data: request // important
      }).then((response) => {
        eventSource.removeEventListener('GUI_ID')
        eventSource.removeEventListener(guidValue)
        eventSource.close()
        fileImportResultProcess(response,"readiness",guidValue)
        setFieldsValue("progressPercentage",0)
        stepWizard.goToStep(2)
      })
      // props.postImportedFile(fileRequest)
    })
  }

  const fileImportResultProcess = (response,type,guid) =>{
    if(response&&
      response.status==200){
        if(type=="publish"){
          setFieldsValue("isPublishFailed",false)
          setFieldsValue("publishSuccessUrl",response.data.successReportUrl)
          setFieldsValue("pubishErrorUrl",response.data.errorReportUrl)
          setFieldsValue("apiPassPercentage",response.data.successPercentage)
          setFieldsValue("apiFailPercentage",response.data.failurePercentage)
        }
        else{
          const data = {
              key:'readinessResults'
            }
            props.history.location.state = {
              retailerLogo:props.history.location.state.retailerLogo,
              retailerId:props.history.location.state.retailerId,
              orgRetailerId:orgRetailerId,
              guid:guid,
              retailerCategoryId:retailerCategoryId,
              retailerCategory:props.history.location.state.retailerCategory
            }
            props.history.push({pathname:"/readinessResults",state:{
              retailerLogo:props.history.location.state.retailerLogo,
              retailerId:props.history.location.state.retailerId,
              orgRetailerId:orgRetailerId,
              guid:guid,
              retailerCategoryId:retailerCategoryId,
              retailerCategory:props.history.location.state.retailerCategory
            }})
            props.triggerPageLayout(data)
        setFieldsValue("isProgressFailed",false)
        setFieldsValue("successUrl",response.data.successReportUrl)
        setFieldsValue("errorUrl",response.data.errorReportUrl)
        setFieldsValue("passPercentage",response.data.successPercentage)
        setFieldsValue("failPercentage",response.data.failurePercentage)
        setFieldsValue("processedSkus",response.data.processedSkus)
        processedSkus = response.data.processedSkus
        }
      }else if(response&&
        response.status!=200){
          if(type=="publish"){
            setFieldsValue("isPublishFailed",true)
          }
          else{
          setFieldsValue("isProgressFailed",true)
          }
        }
  }
  return (
    <div>
      {/* <Backpagecomponent props={props}/> */}
      <div className="p-grid common-header-section">
        <h5 className="p-m-0  p-col-12  page-header"><SelectProductSkuIcon /> Select Product SKUs{props.history.location.state.data?props.history.location.state.data.retailerName?` - ${props.history.location.state.data.retailerName}`:null:null}</h5>
      </div>
      <div style={{ background: 'white', borderRadius: '6px', padding: '1px', marginRight: '-15px',height:"65px" }}>
        <Nav totalSteps={5} stepList={stepList} currentStep={2} />
      </div>
     
        <Formik
        initialValues={{
          progressPercentage:0,
          isProgressFailed:false,
          successUrl:null,
          errorUrl:null,
          publishSuccessUrl:null,
          pubishErrorUrl:null,
          passPercentage:0,
          failPercentage:0,
          publishProgressPercentage:0,
          isPublishFailed:false,
          apiPassPercentage:0,
          apiFailPercentage:0,
          processedSkus:[]
        }}
        >
          {({values,setFieldValue})=>(
            <Dialog
            header={"Performing validation..."}
            closable={values.isProgressFailed}
            className="progress-dialog"
            visible={isShowModal}
            onHide={() => {
              setIsShowModal(false)
            }}
          >
            <StepWizard
            initialStep={1}
            // nav={<Nav />}
            instance={setInstance}
          >{setFieldsValue=setFieldValue}
            {/* <div className="file-progress-container"> */}
            <div style={{ width: '-webkit-fill-available', paddingTop: "5%", paddingLeft: "21px", paddingRight: "21px" }}>
              {/* <p className="estimated-time-text">{i18n.t('importdata.estimatedTime')}</p> */}
              
              <ProgressBar
                variant="info"
                animated
                striped
                now={Math.round(values.progressPercentage)}
                label={Math.round(values.progressPercentage) + "%"}
                key={1}
              />
            </div>
            {/* <div className="importdata-final-result-container"> */}
            <div style={{ width: '-webkit-fill-available',  paddingLeft: "21px", paddingRight: "21px" }}>
            {values.isProgressFailed ? (
              <div>
                <div className="importdata-final-result-img-container">
                  <img src={exclamaion} className="import-data-success" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h4>{i18n.translate('toastMessage.requestFailedMessage')}</h4>
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
                    <h1 className="result-percentage mt-4">
                    {Math.round(values.passPercentage)}%
                      {/* {Math.round(values.passPercentage)}% */}
                    </h1>
                    <h5 className="importdata-final-results" >
                      {/* <a href={values.successUrl}>
                      </a> */}
                      {"Success Percentage"}
                    </h5>
                  </Col>
                  <Col xl="3" lg="3" md="3" className="result-box" >
                    <h1 className="result-percentage mt-4">
                   
                      {Math.round(values.failPercentage)}%
                    </h1>
                    <h5 className="importdata-final-results" >
                    {"Error Percentage"}
                      {/* <a href={values.errorUrl}>
                      {"Error Report"}</a> */}
                    </h5>
                  </Col>
                </Row>
                <Row style={{ marginTop: "7%" }}>
                  {publishTypes.includes("EXCEL")&&<Col xl={6} lg={6} md={6} style={{ textAlign: "right" }}>
                  <a href={values.successUrl}>
                    <Button
                      disabled={values.successUrl==null?true:false}
                      style={values.successUrl==null?{opacity:".1"}:{}}
                      className="importdata-download-button"
                    >
                      {"Success Report"}
                    </Button></a>
                  </Col>}
                  {publishTypes.includes("API")&&<Col xl={6} lg={6} md={6} style={{ textAlign: "right" }}>
                  {/* <a href={values.successUrl}> */}
                    <Button
                      disabled={(values.processedSkus&&values.processedSkus.length<=0)?true:false}
                      style={(values.processedSkus&&values.processedSkus.length<=0)?{opacity:".1"}:{}}
                      onClick={publishProducts}
                      className="importdata-download-button"
                    >
                      {"Publish Products"}
                    </Button>
                    {/* </a> */}
                  </Col>}
                  <Col xl={6} lg={6} md={6}>
                  <a href={values.errorUrl}>
                  <Button
                      disabled={values.errorUrl==null?true:false}
                      style={values.errorUrl==null?{opacity:".1"}:{}}
                      className="importdata-download-button"
                    >{"Error Report"}</Button></a>
                  </Col>
                </Row>
              </div>
            )}
          </div>
          <div className="file-progress-container">
              {/* <p className="estimated-time-text">{i18n.t('importdata.estimatedTime')}</p> */}
              
              <ProgressBar
                variant="info"
                animated
                striped
                now={Math.round(values.publishProgressPercentage)}
                label={Math.round(values.publishProgressPercentage) + "%"}
                key={1}
              />
            </div>
            <div className="importdata-final-result-container">
            {values.isPublishFailed ? (
              <div>
                <div className="importdata-final-result-img-container">
                  <img src={exclamaion} className="import-data-success" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h4>{i18n.translate('toastMessage.requestFailedMessage')}</h4>
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
                    <h1 className="result-percentage mt-4">
                    {Math.round(values.apiPassPercentage)}%
                      {/* {Math.round(values.passPercentage)}% */}
                    </h1>
                    <h5 className="importdata-final-results" >
                      {/* <a href={values.successUrl}>
                      </a> */}
                      {"Success Percentage"}
                    </h5>
                  </Col>
                  <Col xl="3" lg="3" md="3" className="result-box" >
                    <h1 className="result-percentage mt-4">
                   
                      {Math.round(values.apiFailPercentage)}%
                    </h1>
                    <h5 className="importdata-final-results" >
                    {"Error Percentage"}
                      {/* <a href={values.errorUrl}>
                      {"Error Report"}</a> */}
                    </h5>
                  </Col>
                </Row>
                <Row style={{ marginTop: "7%" }}>
                  <Col xl={6} lg={6} md={6} style={{ textAlign: "right" }}>
                  <a href={values.pubishErrorUrl}>
                  <Button
                      disabled={values.pubishErrorUrl==null?true:false}
                      style={values.pubishErrorUrl==null?{opacity:".1"}:{}}
                      className="importdata-download-button"
                    >{"Error Report"}</Button></a>
                  </Col>
                  
                  <Col xl={6} lg={6} md={6}>
                  <Button
                      onClick={() => {
                        setIsShowModal(false)
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
          </Dialog>
          )}
        </Formik>
        
      {/* </Dialog> */}
      <SkulistPage selectedProducts={setSelectedProducts} removeHandCursor={true} productsSelected={productsSelected} redirectType={"productSelect"} {...props} />
      {/* <div className="mt-5">
        <Button
          type="submit"
          // icon= {`${spinner?"pi pi-spin pi-spinner":""}`}
          label={"Select"}
          disabled = {selectedProducts.length?false:true}
          // onClick={productsSelected}
          onClick={()=>{
            const data = {
              key:'readinessResults'
            }
            props.history.location.state = {
              retailerLogo:props.history.location.state.retailerLogo,
              retailerId:props.history.location.state.retailerId
            }
            props.history.push({pathname:"/readinessResults",state:{
              retailerLogo:props.history.location.state.retailerLogo,
              retailerId:props.history.location.state.retailerId
            }})
            props.triggerPageLayout(data)
          }}
          className="p-button-text pim-font-property custom-button pim-btn-main"
        >Select</Button>
        <Button
          type="button"
          icon=""
          className="p-button-text product-cancel custom-button cancel-button"
          onClick={() => {
            const data = {
              key: 'retailerList'
            }
            props.history.push('/retailerlist')
            props.triggerPageLayout(data)
          }}
        >{i18n.t("commonButton.cancel")}</Button>
      </div> */}
    </div>
  )
}

export default connect(mapStateToProps)(ApiConnector(SelectProduct,{
  methods:{
    existsOrgRetailers:{
      type: resources.httpMethod.POST,
      url: PIM_API + "/existsOrgRetailers",
  },
  getRetailer:{
    type: resources.httpMethod.GET,
    url: PIM_API+"/getRetailersById"
  }
  }
}));