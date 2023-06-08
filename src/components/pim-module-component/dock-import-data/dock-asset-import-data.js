// import React, {useContext, useEffect, useState } from 'react'
// import { Formik } from 'formik'
// import { Button } from 'primereact/button'
// import { Card, Col, ProgressBar, Row, Spinner, Tooltip } from 'react-bootstrap'
// import SearchableDropdown from '../../../components/filter/components/searchable-select/index'
// // import SearchableDropdown from '../../../components/searchable-select/index'
// import AssetUploader, { resetUppy } from '../asset-listing/AssetUploader'
// import {
//    DOWNLOAD_FILE_NAME,
//    LOCAL_COMPUTER,
//    PIM_API,
//    START_PERCENTAGE,
//    STOP_PERCENTAGE,
//    UPPY_PLUGINS,
//    XHR_UPLOAD_URL,
// } from '../../../common/common-constants'
// import Success from "../../../assets/passed.svg"
// import Failed from "../../../assets/failed.svg"
// import Ignored from "../../../assets/ignored.svg"
// import { COMMON_URL, resources } from '../../../common/common-api-constants'
// import i18n from '../../../translate/i18n'
// import StepWizard from 'react-step-wizard'
// import HeaderContext from "../../../common/header-context"
// import Alerticon from '../../../common/icons/alerticon'
// import exclamaion from '../../../assets/exclamation.svg'
// import DockDownload from '../../../assets/dock-download.svg'
// import { connect } from 'react-redux'
// import ApiConnector from '../../../common/hoc/api-connector'
// import { postImportedFileRequest } from '../../../common/master-data'
// import EventSource from 'eventsource'
// import axios from 'axios'
// import '../asset-listing/style.scss'
// import '../skulist/style.scss'
// import Select from 'react-select/creatable'
// import makeAnimated from 'react-select/animated'
// import { optionStylesForTag } from '../../searchable-select/searchable-dropdown-constant'
// import { components } from "react-select";

// const mapStateToProps = (state) => {
//    return {
//       getFilterDataValue: state.stateData.getFilterdata,
//       getUserDetail: state.userDetail.getUsersObj.userCredentials,
//    }
// }

// let setFieldsValue,
//   fileRequest = postImportedFileRequest,
//   stepWizard,
//   importedFile = { name: "" },
//   progressValue = 0

// function DockAssetImportData(props) {
//    const { getFilterDataValue, getUserDetail } = props
  
//   let filterOptions = getFilterDataValue
//     ? JSON.parse(getFilterDataValue.organization.defaultoption.FilterDropdowns)
//     : null
//   let initialRequestDam = getFilterDataValue
//     ? getFilterDataValue.initialRequest.DAM
//     : null
//   let userDetails = getUserDetail
//   let authJson = JSON.parse(sessionStorage.getItem("authJson"))
//   let userDetail =
//     userDetails &&
//     userDetails.organizationid &&
//     parseInt(userDetails.organizationid)
//    // const [uploadType, setUploadType] = useState(true)
//    const [isLocal, setIsLocal] = useState(false)
//    const [isImport, setIsImport] = useState(false)
//    const [isShowUploadModal, setIsShowUploadModal] = useState(false)
//    const [isBulkImport, setIsBulkImport] = useState(false)
//    const [isCustomUppyStyle, setIsCustomUppyStyle] = useState(false)
//    const [validAssetExtentions, setValidAssetExtentions] = useState([])
//    const [isFileUploaded, setIsFileUploaded] = useState(false)
//    const [isProcessing, setIsProcessing] = useState(false)
//    const [tagOption, setTagOption] = useState([])
//    const [selectedTagValue, setSelectedTagValue] = useState([])
//    const [metaTags, setMetaTags] = useState([])
//    const [isDropDownDisabled, setIsDropDownDisabled] = useState(false)
//    const [isMetaTagClear, setIsMetaTagClear] = useState(null)
//    const animatedComponents = makeAnimated()

//    const {
//       IsAssetsBulkImportButtonDock:{IsAssetsBulkImportButton, setIsAssetsBulkImportButton},
//       AssetTagDropdownDisabled:{isAssetTagDropdownDisabled,setIsAssetTagDropDownDisabled}
//     } = useContext(HeaderContext)

//    const {
//       IsImportButtonDock:{IsImportButton, setIsImportButton},
//     } = useContext(HeaderContext)

    
//    const {
//       AssetsDockRenderData:{AssetsDockRender, setAssetsDockRender},
//     } = useContext(HeaderContext)

//    //  Option = (props) => {
// 	// 	// props.selectProps.isLoading
// 	// 	// const { isMenuOptionLong } = this.props
// 	// 	// style={{ minHeight: isMenuOptionLong ? '20px' : '0px' }}
// 	// 	const loadingStyle = this.props.predictiveSearch ? 'predictiveSearchLoading' : 'searchLoading'
// 	// 	return (
// 	// 		<components.Option {...props}>
// 	// 		{
//  	// 			props.selectProps && props.selectProps.isLoading ? 
// 	// 			 <Row className={loadingStyle}>
// 	// 			 <div className='spinnerr'>
// 	// 				 <div className='bounce1'></div>
// 	// 				 <div className='bounce2'></div>
// 	// 				 <div className='bounce3'></div>
// 	// 			 </div>
// 	// 		 </Row> : 
// 	// 		<>
// 	// 			<input
// 	// 				type='checkbox'
// 	// 				id='checkbox'
// 	// 				className='filterMenuOptionCheckbox'
// 	// 				checked={props.isSelected}
// 	// 			/>{' '}
// 	// 			&nbsp;
// 	// 			<label className='dropDownLabel'>
// 	// 				<span>{props.value}</span>
// 	// 			</label>
// 	// 		</>	
// 	// 		}
// 	// 		</components.Option>
// 	// 	)
// 	// }


//    let requestData = {
//          organizationId:
//             getUserDetail &&
//             getUserDetail.organizationid &&
//             parseInt(getUserDetail.organizationid),
//          pageStart: 0,
//          pageEnd: 100,
//          sortField: 'tag',
//          sortType: 'ASC',
//       }

//    useEffect(() => {
//       const { getOrganizationDetailsResult } = props
//       if (
//          getOrganizationDetailsResult &&
//          getOrganizationDetailsResult.content &&
//          getOrganizationDetailsResult.content.data
//       ) {
//          let userMandatoryColumn =
//             getOrganizationDetailsResult.content.data.orgSpec &&
//             JSON.parse(getOrganizationDetailsResult.content.data.orgSpec)
//          let assetExtentions = []
//          userMandatoryColumn &&
//             userMandatoryColumn[
//                getOrganizationDetailsResult.content.data.orgname
//             ] &&
//             userMandatoryColumn[
//                getOrganizationDetailsResult.content.data.orgname
//             ].validImgExtensions.map((i) => {
//                assetExtentions.push('.' + i)
//             })
//          userMandatoryColumn &&
//             userMandatoryColumn[
//                getOrganizationDetailsResult.content.data.orgname
//             ] &&
//             userMandatoryColumn[
//                getOrganizationDetailsResult.content.data.orgname
//             ].validVideoExtensions.map((i) => {
//                assetExtentions.push('.' + i)
//             })
//          userMandatoryColumn &&
//             userMandatoryColumn[
//                getOrganizationDetailsResult.content.data.orgname
//             ] &&
//             userMandatoryColumn[
//                getOrganizationDetailsResult.content.data.orgname
//             ].validDocumentExtensions &&
//             userMandatoryColumn[
//                getOrganizationDetailsResult.content.data.orgname
//             ].validDocumentExtensions.map((i) => {
//                assetExtentions.push('.' + i)
//             })
//          setValidAssetExtentions(assetExtentions)
//       }
//    }, [props.getOrganizationDetailsResult])

//    useEffect(() => {
//       const { getMasterTagsResult } = props
//       if (
//          getMasterTagsResult &&
//          getMasterTagsResult.content &&
//          getMasterTagsResult.content.data
//       ) {
//          if (
//             getMasterTagsResult.content.data.content &&
//             getMasterTagsResult.content.data.content.length > 0
//          ) {
//             let tagOption = []
//             getMasterTagsResult.content.data.content.map((tagItem) => {
//                tagOption.push({
//                   id: tagItem.tag,
//                   name: tagItem.tag,
//                   value: tagItem.tag,
//                   label: tagItem.tag,
//                })
//             })
//             setTagOption(tagOption)
//          }
//       }
//    }, [props.getMasterTagsResult])

//    const goToStep = (e, file) => {
//       setIsAssetsBulkImportButton(true)
//       setIsImportButton(true)
//       let networkError = false
//       if (importedFile.name != file.name) {
//          importedFile = file
//          // setIsProcessing(true)
//          // fileRequest.attrMappingList = attrMappingList   already
//          props.hideImportDetailsDock()
//          fileRequest.fileName = importedFile.name
//          fileRequest.fileSize = importedFile.size
//          fileRequest.fileType = importedFile.extension.toUpperCase()
//          fileRequest.aborted = false
//          if (importedFile.source == 'react:Dashboard') {
//             fileRequest.fileSource = LOCAL_COMPUTER
//          } else {
//             fileRequest.fileSource = importedFile.source
//          }
//          fileRequest.userId = 1
//          fileRequest.userName = getUserDetail.userName
//          fileRequest.orgId = getUserDetail.organizationid
//          fileRequest.origin = 'asset'
//          fileRequest.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
//          let url = COMMON_URL + 'api/progress'
//          let eventSourceInitDict = {
//             headers: {
//                Authorization: `${getUserDetail.token_value.Authorization}`,
//             },
//          }
//          const eventSource = new EventSource(url, eventSourceInitDict)

//          eventSource.onerror = (e) => {
//             if (e.message == 'network error') {
//                networkError = true
//                setFieldsValue('errorMessage', i18n.t('importdata.networkError'))
//                // setErrorMessage(i18n.t("importdata.networkError"))   already
//                stepWizard.goToStep(3)
//                setIsProcessing(false)
//                setFieldsValue('isImportFailed', true)
//             }
//             eventSource.close()
//          }
//          let guidValue = null
//          setFieldsValue('isImportCompleted', false)
//          stepWizard.goToStep(e)
//          setFieldsValue('stepNo',e)
//          // eventSource.   already
//          eventSource.addEventListener('GUI_ID', (event) => {
//             guidValue = JSON.parse(event.data)
//             fileRequest.guid = guidValue
//             progressValue = 1
//             setFieldsValue('progressPercentage', 1)
//             eventSource.addEventListener(guidValue, (event) => {
//                const result = JSON.parse(event.data)
//                setFieldsValue('totalRecords', result.lastRowCount)
//                setFieldsValue('insertedRows', result.processedRow)
//                // if (progressPercentage - 5 !== result) {
//                //   setProgressPercentage(((result + 5) / 105) * 100)
//                // }   already
//                if (progressValue - 1 !== result.uploadPercentage) {
//                   let percentage = ((result.uploadPercentage + 1) / 101) * 100
//                   progressValue = percentage
//                   setFieldsValue('progressPercentage', percentage)
//                }
//                // if (isImportFailed) {
//                //   eventSource.close()
//                // }   already
//                if (result.uploadPercentage == 100) {
//                   eventSource.close()
//                }
//             })
//             axios({
//                url: `${COMMON_URL + PIM_API + '/importBulkAssets'}`,
//                method: 'POST',
//                data: fileRequest, // important
//             }).then((response, res) => {            
//                // setIsAssetsBulkImportButton(true)
//                // setIsImportButton(true)
//                eventSource.removeEventListener('GUI_ID')
//                eventSource.removeEventListener(guidValue)
//                eventSource.close()
//                importedFile = { name: '' }
//                fileImportResultProcess(response, networkError)
//             })
//             // props.postImportedFile(fileRequest)   already
//          })
//       }
//    }

//    const fileImportResultProcess = (result, isNetworkError) => {
//       if (
//          result &&
//          result.status == 200 &&
//          result.data &&
//          result.data.code != 500
//       ) {
//          setIsProcessing(false)
//          if (result.data) {
//             // setIsImportFailed(false)  already
//             setFieldsValue('isImportFailed', false)
//             if (result.data.failurePercentage > 0) {
//                setFieldsValue('isDisableDownload', false)
//                // setIsDisableDownload(false)  already
//             } else {
//                setFieldsValue('isDisableDownload', true)
//                // setIsDisableDownload(true)  already
//             }
//             // setPassPercentage(result.data.successPercentage)  already
//             setFieldsValue("passPercentage", result.data.successPercentage)
//             setFieldsValue("failPercentage", result.data.failurePercentage)
//             setFieldsValue("ignoredPercentage", result.data.ignoredPercentage)
//             setFieldsValue("totalSks",result.data.totalSks)
//             setFieldsValue("ignoredSkus",result.data.ignoredSkus)
//             setFieldsValue("failedSkus",result.data.failedSkus)
//             setFieldsValue("passedSkus",result.data.passedSkus)
//             // setFieldsValue('passPercentage', result.data.successPercentage)
//             // setFieldsValue('failPercentage', result.data.failurePercentage)
//             setFieldsValue('isImportCompleted', true)
//             setAssetsDockRender(true)
//             // setFailPercentage(result.data.failurePercentage)  already
//             stepWizard.goToStep(3)
//             setFieldsValue('stepNo',3)
//          }
//       } else if (result) {
//          setIsProcessing(false)
//          setFieldsValue('isImportFailed', true)
//          if (result.data && result.data.description) {
//             setFieldsValue('errorMessage', result.data.description)
//             // setErrorMessage(result.data.description)  already
//          } else {
//             setFieldsValue(
//                'errorMessage',
//                i18n.t('importdata.requestFailedMessage')
//             )
//             // setErrorMessage(i18n.t("importdata.requestFailedMessage"))  already
//          }
//          stepWizard.goToStep(3)
//          setFieldsValue('stepNo',3)
//       }
//       // else if(isNetworkError){
//       //   setFieldsValue("errorMessage", i18n.t("importdata.networkError"))
//       //   setErrorMessage(i18n.t("importdata.networkError"))
//       //   stepWizard.goToStep(3)
//       //   setIsProcessing(false)
//       //   setFieldsValue("isImportFailed", true)
//       // }  already
//       else if (!isNetworkError) {
//          setFieldsValue(
//             'errorMessage',
//             i18n.t('importdata.requestFailedMessage')
//          )
//          // setErrorMessage(i18n.t("importdata.requestFailedMessage"))  already
//          stepWizard.goToStep(3)
//          setFieldsValue('stepNo',3)
//          setIsProcessing(false)
//          setFieldsValue('isImportFailed', true)
//       }
//       setFieldsValue('totalRecords', null)
//       setFieldsValue('insertedRows', null)
//    }

//    const onAbort = () => {
//       fileRequest.aborted = true
//       props.abortImportedFile(fileRequest)
//    }

//    useEffect(() => {
//       const { abortImportedFileResult } = props
//       if (
//          abortImportedFileResult &&
//          abortImportedFileResult.content &&
//          abortImportedFileResult.content.status == '200'
//       ) {
//          setFieldsValue('isApiCanceled', true)
//       }
//    }, [props.abortImportedFileResult])

//    const downloadFiles = (type) => {
//       axios({
//          url: `${COMMON_URL + PIM_API + '/downloadAssetReport'}`,
//          method: 'POST',
//          data: fileRequest,
//          responseType: 'blob', // important
//       }).then((response) => {
//          const url = window.URL.createObjectURL(new Blob([response.data]))
//          const link = document.createElement('a')
//          link.href = url
//          link.setAttribute('download', DOWNLOAD_FILE_NAME) //or any other extension
//          document.body.appendChild(link)
//          link.click()
//       })
//    }

//    const setInstance = (e) => {
//       stepWizard = e
//    }

//    const dockReport = (percentage, isImportCompleted, importFailed) => {
//       var importReport
//       if (isImportCompleted) {
//          importReport = 'Completed'
//       } else if (importFailed) {
//          importReport = 'Import Failed'
//       } else {
//          // setIsAssetsBulkImportButton(true)
//          // setIsImportButton(true)
//          importReport = 'Importing:' + Math.round(percentage) + '%'
//       }
//       return importReport
//    }

//    const metaTagClear = (e) =>{
//       if(e == true){
//          setSelectedTagValue([])
//       }
//       // setIsAssetTagDropDownDisabled(false)
//    }

//    const hideUploadModal = () => {
//       // assetCallBack()
//       setIsCustomUppyStyle(true)
//       setIsShowUploadModal(false)
//       setIsImport(false)
//       setIsBulkImport(false)
//       progressValue = 0
//       resetUppy(true)
//       props.close()
//       setIsAssetsBulkImportButton(false)
//       setIsImportButton(false)
//       // setFieldsValue('stepNo',1)
//       // stepWizard.goToStep(1)
//       // const data = {
//       //    key: "assetList",
//       //  }
//       //    // props.history.push("/imageEditor")
//       //    props.history.push( "/assetList")
//       //    props.triggerPageLayout(data)
        
//     }

//    const uploadAsset = () => {
//       return (
//          <Formik
//             initialValues={{
//                progressPercentage: 0,
//                isImportFailed: false,
//                errorMessage: '',
//                totalRecords: null,
//                insertedRows: null,
//                isApiCanceled: false,
//                passPercentage: 0,
//                failPercentage: 0,
//                isDisableDownload: false,
//                isImportCompleted: false,
//             }}
//          >
//             {({ values, setFieldValue }) => (
//                <>
//                   {(setFieldsValue = setFieldValue)}
//                   {/* //{console.log(values.stepNo,"values.stepNo")} */}
//                   {!props.hide ? (
//                      <div class="dock-container">
//                         <img className="dock-download" src={DockDownload} />
//                         <span className="dock-import-percentage">
//                            {dockReport(
//                               Math.round(values.progressPercentage),
//                               values.isImportCompleted,
//                               values.isImportFailed
//                            )}
//                         </span>
//                      </div>
//                   ) : (
//                      <StepWizard
//                         initialStep={values.stepNo}
//                         // nav={<Nav />}  already
//                         instance={setInstance}
//                      >
//                         <div className="cloudisopen">
//                            <div id={!isBulkImport ? 'asset-upload': ''} className={`file-uploader-container ${isCustomUppyStyle ? 'uppy-customization' : ''}`}>
//                               <AssetUploader
//                                  maxNumberOfFiles={1}
//                                  maxFileSize={104857600}
//                                  isBulkImport={isBulkImport}
//                                  allowedFileTypes={
//                                     isBulkImport
//                                        ? ['.xlsx']
//                                        : validAssetExtentions
//                                  }
//                                  // allowedFileTypes = {['.jpg','.png','.mp4','.avi','.jpeg','.webp']}  already
//                                  fileUploadRequest={{
//                                     locale: props.locale ? props.locale : 'en',
//                                     organizationid:
//                                        getUserDetail &&
//                                        getUserDetail.organizationid &&
//                                        parseInt(getUserDetail.organizationid),
//                                     orgId: getUserDetail.organizationid,
//                                     timeZone:
//                                        Intl.DateTimeFormat().resolvedOptions()
//                                           .timeZone,
//                                     metaTags:
//                                        metaTags && metaTags.length > 0
//                                           ? metaTags
//                                           : [],
//                                           pimerceOrgId: getFilterDataValue.organization.id,
//                                  }}
//                                  fileUploadURL={
//                                     isBulkImport
//                                        ? XHR_UPLOAD_URL
//                                        : COMMON_URL +
//                                          'pimerce-pim/api/createAssets'
//                                  }
//                                  goToStep={goToStep}
//                                  // mapFieldData={mapFieldData}  already
//                                  setIsFileUploaded={setIsFileUploaded}
//                                  // disableLocalFiles={true}
//                                  plugins={UPPY_PLUGINS}
//                                  setIsCustomUppyStyle={setIsCustomUppyStyle}
//                                  isFileUploaded={isFileUploaded}
//                                  isInitialLoad={props.isInitialLoad}
//                                  isAssetsDockRender={AssetsDockRender}
//                                  isFailedResponse={(e)=>{metaTagClear(e)}}
//                               />
//                               {/* )} */}
//                            </div>
//                         </div>
//                         <div className="file-progress-container">
//                            {
//                               <>
//                                  <p
//                                     className="loader-parent"
//                                     style={{ textAlign: 'center' }}
//                                  >
//                                     {
//                                        values.totalRecords
//                                           ? `Processed Records:${values.insertedRows}/${values.totalRecords}`
//                                           : `${i18n.t(
//                                                'importdata.fileProcess'
//                                             )}...`
//                                        // <>
//                                        //    <span>
//                                        //       {i18n.t('importdata.fileProcess')}
//                                        //    </span>
//                                        //    <span class="container-loader">
//                                        //       <div class="circle circle-1"></div>
//                                        //       <div class="circle circle-2"></div>
//                                        //       <div class="circle circle-3"></div>
//                                        //       <div class="circle circle-4"></div>
//                                        //       <div class="circle circle-5"></div>
//                                        //    </span>
//                                        // </>
//                                     }
//                                  </p>
//                               </>
//                            }
//                            <div className="d-flex justify-content-between import-progress-indicator-width mb-2">
//                               <span className="d-flex justify-content-lg-start import-indication progress-bar-spacing">
//                                  {START_PERCENTAGE}
//                               </span>
//                               <span className="d-flex justify-content-lg-end import-indication">
//                                  {STOP_PERCENTAGE}
//                               </span>
//                            </div>
//                            <div className="import-progress-bar-Container">
//                               <ProgressBar
//                                  style={{
//                                     height: '29px',
//                                     width: '97%',
//                                     marginLeft: '24px',
//                                  }}
//                                  variant="info"
//                                  animated
//                                  now={Math.round(values.progressPercentage)}
//                                  label={
//                                     Math.round(values.progressPercentage) +
//                                     '%' +
//                                     '   '
//                                  }
//                                  key={1}
//                               />
//                            </div>
//                            <div className="import-data-message">
//                               <span className="import-info-content">
//                                  &nbsp;&nbsp;&nbsp;&nbsp;
//                                  <Alerticon />
//                                  &nbsp;&nbsp;{i18n.t('importdata.info')}
//                               </span>
//                            </div>
//                            {values.isApiCanceled ? (
//                               <p
//                                  className="mt-5"
//                                  style={{ textAlign: 'center' }}
//                               >
//                                  {i18n.t('importdata.processAbortMsg')}
//                               </p>
//                            ) : (
//                               <Button
//                                  onClick={onAbort}
//                                  className="importdata-cancel-button import-progress-style importdata-customize-size"
//                               >
//                                  {i18n.t('importdata.cancel')}
//                               </Button>
//                            )}
//                         </div>
//                         <div className="importdata-final-result-container assetdock">
//                 {values.isImportFailed ? (
//                   <div>
//                     <div className="importdata-final-result-img-container mb-4">
//                       <img src={exclamaion} className="import-data-success" />
//                     </div>
//                     <div style={{ textAlign: "center" }} className="import-final-size-padding">
//                       <h4>{values.errorMessage}</h4>
//                     </div>
//                     <div className="import-fail-close">
//                       <Button
//                             onClick={() => {
//                             //   onHide(IS_MODAL)
//                               resetUppy(true)
//                               props.close()
//                               setFieldsValue('stepNo',1)
//                               stepWizard.goToStep(1)
//                               setIsAssetsBulkImportButton(false)
//                               setIsImportButton(false)
//                             }}
//                             className="importdata-close-button"
                           
//                           >
//                             {i18n.t("importdata.close")}
//                         </Button>
//                      </div>
//                   </div>
//                 ) : (
//                   <div style={{overflow:"hidden"}}>
//                   <Row className="import-final-result-inner-container import-final-result-inner-container-dockasset import-outer-border-head">
//                     <Col className="import-final-header-width">
//                     <div className="d-flex justify-content-between">
//                    <span className="import-final-header-title d-flex justify-content-start"> Total Records</span> &nbsp;&nbsp;
//                    <span className="import-final-header-records d-flex justify-content-end">{values.totalSks}</span>  
//                     </div>
//                     </Col>
//                   </Row>
//                     <Row className="import-final-result-inner-container import-outer-border-body import-final-result-inner-container-dockasset">
//                      <Col xl="4" lg="4" md="4" className="import-final-resultbox-container">
//                        <div className="result-box-inner import-final-passed">
//                         <div className="row">
//                           <div className="col">
//                         <h6 className="importdata-final-results-records">
//                           {i18n.t("importdata.uploadedFiles")} - {values.passedSkus}
//                         </h6>
//                         </div>
//                         </div>
//                         <br/>
//                         <div className="row">
//                           <div className="col-xl-8 col-lg-8 col-md-8">
//                         <h6 className="importdata-final-results-percentage">
//                         {values.passPercentage % 1 > 0
//                             ? values.passPercentage.toFixed(2)
//                             : Math.round(values.passPercentage)}
//                           %
//                         </h6>
//                         </div>
//                         <div className="col-xl-4 col-lg-4 col-md-4 import-final-result-icon-style">
//                         <img src={Success} className="import-data-success"/>
//                         </div>
//                         </div>
//                         </div>
//                       </Col>
//                       <Col xl="4" lg="4" md="4" className="import-final-resultbox-container">
//                        <div className="result-box-inner import-final-Failed">
//                         <div className="row">
//                           <div className="col">
//                         <h6 className="importdata-final-results-records">
//                           {"Failed Records"} - {values.failedSkus}
//                         </h6>
//                         </div>
//                         </div>
//                         <br/>
//                         <div className="row">
//                           <div className="col-xl-8 col-lg-8 col-md-8">
//                         <h6 className="importdata-final-results-percentage">
//                         {values.failPercentage % 1 > 0
//                             ? values.failPercentage.toFixed(2)
//                             : Math.round(values.failPercentage)}
//                           %
//                         </h6>
//                         </div>
//                         <div className="col-xl-4 col-lg-4 col-md-4 import-final-result-icon-style">
//                         <img src={Failed} className="import-data-success"/>
//                         </div>
//                         </div>
//                         </div>
//                       </Col>
//                       <Col xl="4" lg="4" md="4" className="import-final-resultbox-container">
//                        <div className="result-box-inner import-final-ignored">
//                         <div className="row">
//                           <div className="col">
//                         <h6 className="importdata-final-results-records">
//                             {i18n.t("importdata.ignoredFiles")} - {values.ignoredSkus}
//                         </h6>
//                         </div>
//                         </div>
//                         <br/>
//                         <div className="row">
//                           <div className="col-xl-8 col-lg-8 col-md-8">
//                         <h6 className="importdata-final-results-percentage">
//                         {values.ignoredPercentage % 1 > 0
//                             ? values.ignoredPercentage.toFixed(2)
//                             : Math.round(values.ignoredPercentage)}
//                           %
//                         </h6>
//                         </div>
//                         <div className="col-xl-4 col-lg-4 col-md-4 import-final-result-icon-style">
//                         <img src={Ignored} className="import-data-success"/>
//                         </div>
//                         </div>
//                         </div>
//                       </Col>
//                     </Row>
//                     {/* Footer */}
//                     <Row className="ml-3" style={{ marginTop: "3%" }}>
//                       <Col
//                         xl={6}
//                         lg={6}
//                         md={6}
//                         className="p-0"
//                         style={{ textAlign: "right" }}
//                       >
//                        <Button
//                           disabled={values.isDisableDownload}
//                           style={
//                             values.isDisableDownload ? { opacity: "0.6" } : {}
//                           }
//                           className="importdata-download-button"
//                           onClick={() => {
//                             downloadFiles("IMPORT")
//                           }}
//                         >
//                           {i18n.t("importdata.downloadFiles")}
//                         </Button>
//                       </Col>
//                       <Col xl={6} lg={6} md={6}>
//                       <Button
//                           onClick={hideUploadModal}
//                           className="importdata-close-button"
//                           // style={{ width: '120px', color: 'black', background: 'white', borderRadius: "23px", display: 'inline', border: '1px solid black', fontWeight: 600 }}
//                         >
//                           {i18n.t("importdata.close")}
//                         </Button>
//                       </Col>
//                     </Row>
//                     </div>
//                 )}
//               </div>
//                      </StepWizard>
//                   )}
//                </>
//             )}
//          </Formik>
//       )
//    }

//    const handleChange = (option) => {
//       // console.log(tagOption, 'tagOption', option)
//       if (option && option.length > 0) {
//          let tags = []
//          let tagOption = []
//          option.map((tagItem) => {
//             tagOption.push({
//                id: tagItem.value,
//                name: tagItem.value,
//                value: tagItem.value,
//                label: tagItem.value,
//             })
//             tags.push(tagItem.value)
//          })
//          setMetaTags(tags)
//          setSelectedTagValue(tagOption)
//       }else{
//          setSelectedTagValue([])
//       }
//    }

//    Option = (props) => {
// 		return (
// 			<components.Option {...props}>
// 			{
// 			<>
// 				<div title={props.children} className='dropDownLabel'>
// 					<span>{props.children}</span>
// 				</div>
// 			</>	
// 			}
// 			</components.Option>
// 		)
//     };

//    let toolTipItemLists = selectedTagValue.length > 0 ? selectedTagValue.map(i=>{
//       return(i.label)
//    }) : null

//    return (
//       <>
//          {props.hide ? (
//             <div>
//                <span className="dock-import-title">
//                   Upload Assets
//                </span>
//             </div>
//          ) : (
//             ''
//          )}
//          {isFileUploaded && !props.isInitialLoad && !isBulkImport ? (
//             <>
//             <div className={!isAssetTagDropdownDisabled?"dock-asset-tag-dropdown-style":"dock-asset-tag-dropdown-style dock-asset-tag-cross-icon-disabled"}>  
//             <label>Select Asset Tags (Optional)</label>
//                <Select
//                   name="tags"
//                   isMulti
//                   value={selectedTagValue}
//                   options={tagOption}
//                   styles={optionStylesForTag}
//                   isClearable={false}
//                   isDisabled={isAssetTagDropdownDisabled}
//                   components={{
//                      Option,
//                      animatedComponents,
//                      IndicatorSeparator: () => null,
//                   }}
//                   onChange={(newValue) => handleChange(newValue)}
//                   placeholder="Select Tags..."
//                   // menuIsOpen={true}
//                />
//             </div>
//             </>
//          ) : (
//             ''
//          )}
//          <div>
//             {/* {props.isInitialLoad ? (
//                <>{selectUploadType()} </>
//             ) : isImport ? (
//                <>{uploadAsset()}</>
//             ) : (
//                importSelectContainer()
//             )} */}
//             {props.isInitialLoad ? (
//                <>{importSelectContainer()} </>
//             ) : isImport &&
//               validAssetExtentions &&
//               validAssetExtentions.length > 0 ? (
//                <>{uploadAsset()}</>
//             ) : (
//                ''
//             )}
//          </div>
//       </>
//    )

//    function selectUploadType() {
//       return (
//          <div style={{ marginTop: '7rem' }}>
//             {/* <div className="importdata-final-result-img-container">
//                   <img src={success} className="import-data-success" />
//                </div> */}
//             <Row>
//                <Col
//                   xl="3"
//                   lg="3"
//                   md="3"
//                   style={{ marginLeft: '25%', cursor: 'pointer' }}
//                   onClick={() => {
//                      setIsLocal(true)
//                      // setUploadType(false)
//                      setIsImport(false)
//                      props.initial(false)
//                      setIsCustomUppyStyle(true)
//                      props.getOrganizationDetails(
//                         null,
//                         parseInt(getUserDetail.organizationid)
//                      )
//                   }}
//                   className="result-box"
//                >
//                   <h1 className="result-percentage">
//                      <i
//                         class="fa fa-desktop"
//                         style={{ fontSize: 'larger' }}
//                         aria-hidden="true"
//                      ></i>
//                   </h1>
//                   <h5 className="importdata-final-results">
//                      Import From Local
//                   </h5>
//                </Col>
//                <Col
//                   xl="3"
//                   lg="3"
//                   md="3"
//                   className="result-box"
//                   style={{ cursor: 'pointer' }}
//                   onClick={() => {
//                      setIsLocal(false)
//                      // setUploadType(false)
//                      setIsImport(false)
//                      props.initial(false)
//                      setIsCustomUppyStyle(false)
//                      props.getOrganizationDetails(
//                         null,
//                         parseInt(getUserDetail.organizationid)
//                      )
//                   }}
//                >
//                   <h1 className="result-percentage">
//                      <i
//                         class="fa fa-cloud"
//                         style={{ fontSize: 'larger' }}
//                         aria-hidden="true"
//                      ></i>
//                   </h1>
//                   <h5 className="importdata-final-results">
//                      Import From Cloud
//                   </h5>
//                </Col>
//             </Row>
//          </div>
//       )
//    }

//    function importSelectContainer() {
//       return (
//          <div className='asset-design' style={{ marginTop: '7rem' }}>
//             <Row>
//                <Col
//                   xl="3"
//                   lg="3"
//                   md="3"
//                   style={{ marginLeft: '25%', cursor: 'pointer' }}
//                   onClick={() => {
//                      setIsCustomUppyStyle(false)
//                      setIsBulkImport(false)
//                      setIsImport(true)
//                      props.initial(false)
//                      resetUppy(true)
//                      props.getOrganizationDetails(
//                         null,
//                         parseInt(getUserDetail.organizationid)
//                      )
//                      setIsFileUploaded(false)
//                      props.getMasterTags(requestData)
//                      setMetaTags([])
//                      setSelectedTagValue([])
//                   }}
//                   className="result-box"
//                >
//                   <h1 className="result-percentage">
//                      <i
//                         class="fa fa-picture-o"
//                         style={{ fontSize: 'larger' }}
//                         aria-hidden="true"
//                      ></i>
//                   </h1>
//                   <h5 className="importdata-final-results">Single Import</h5>
//                </Col>
//                <Col
//                   xl="3"
//                   lg="3"
//                   md="3"
//                   className="result-box"
//                   style={{ cursor: 'pointer' }}
//                   onClick={() => {
//                      setIsCustomUppyStyle(false)
//                      setIsBulkImport(true)
//                      setIsImport(true)
//                      props.initial(false)
//                      resetUppy(true)
//                      props.getOrganizationDetails(
//                         null,
//                         parseInt(getUserDetail.organizationid)
//                      )
//                      setIsFileUploaded(false)
//                      props.getMasterTags(requestData)
//                      setMetaTags([])
//                      setSelectedTagValue([])
//                   }}
//                >
//                   <h1 className="result-percentage">
//                      <i
//                         class="fa fa-file-excel-o"
//                         style={{ fontSize: 'larger' }}
//                         aria-hidden="true"
//                      ></i>
//                   </h1>
//                   <h5 className="importdata-final-results">Bulk Import</h5>
//                </Col>
//             </Row>
//          </div>
//       )
//    }
// }

// export default connect(mapStateToProps)(
//    ApiConnector(DockAssetImportData, {
//       methods: {
//          abortImportedFile: {
//             type: resources.httpMethod.POST,
//             url: PIM_API + '/isProcessAborted',
//          },
//          getOrganizationDetails: {
//             type: resources.httpMethod.GET,
//             url: PIM_API + '/organizations',
//          },
//          getMasterTags: {
//             type: resources.httpMethod.POST,
//             url: PIM_API + '/masterTags',
//          },
//       },
//    })
// )