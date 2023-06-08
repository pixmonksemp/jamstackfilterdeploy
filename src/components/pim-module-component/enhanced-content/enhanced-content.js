// import React, { useEffect, useState, useContext ,useRef ,useMemo } from "react"
// import { Row, Col, Card, Spinner } from "react-bootstrap"
// import "../enhanced-content/styles.scss"
// import ExpandCollapse from "../../expand-collapse/expand-collapse"
// import { optionStyles } from "../../searchable-select/searchable-dropdown-constant"
// import Select from "react-select"
// import {
//   getProductSkuAttributesApiRequestObject,
//   productSkuUpdateSaveApiRequestObject,getCloneProductSkuAttributesApiRequestObject,
//   getApiRequestObject,cloneCurrentProductSku,getAssetHierarchyObject
// } from "../../../common/master-data"
// import { Button } from "primereact/button"
// import { RadioButton } from 'primereact/radiobutton';
// import { Formik, Form, Field, FieldArray, ErrorMessage, getIn, useFormikContext   } from "formik"
// import { ConnectedFocusError } from 'focus-formik-error'
// import {
//   MEDIUM,
//   ERROR_BG_COLOR,
//   CREATE,
//   UPDATE,
//   DELETE,
//   VALID_BG_COLOR,GETUPDATE,
// } from "../../../common/common-constants"
// import i18n from "../../../translate/i18n"
// import HeaderContext from "../../../common/header-context"
// import ToastModal from "../../modal/ToastModal"
// import UploadImage from "../../../assets/imageUpload.svg"
// import PDF_PREVIEW from "../../../assets/PDf.png"
// import StepWizard from "react-step-wizard"
// import AssetListPage from "../../../pages/pim-module-pages/assetlist-page/assetlist-page"
// import * as Yup from "yup"
// import PREVIEW from "../../../assets/no_preview.png"
// import ADDNEWASSETS from "../../../assets/pxm_image-add.svg"
// import VIDEO_PREVIEW from "../../../assets/video_preview.png"
// import ALERTCIRCLE from "../../../assets/Alert-circle-1.svg"
// import ARROWRIGHT from "../../../assets/arrow_right.svg"
// import ModalComponent from "../../modal"
// import { Dropdown } from "primereact/dropdown"
// import { connect } from "react-redux"
// import { Toast } from 'primereact/toast'
// import { Tooltip } from 'primereact/tooltip'
// import { Image } from 'primereact/image'
// import moment from 'moment'
// import { sortArrayOfObjectValues } from "../../filter/components/filter-component/filterdata-constant"

// let collectionOfAssetsdropdowns = {},
//   heroImageDetails = {},
//   collectionOfDatadropdowns = {},
//   collectionOfManDatorycolumns = [],
//   toastHeading,
//   toastContent,
//   titleBackgroundColor,
//   stepWizard,
//   assetName,
//   setFieldsValue,
//   heroImagedigitalassets,
//   assetUrl,
//   toastSize,
//   hierarchyDynamicvalue,
//   attributNames,
//   changevalue = [],
//   selectedAssetType = "IMAGE",
//   assetId = "",
//   assetsUrl = "",
//   valuechange = true,
//   lastfunction="add",
//   assetAttributeId = "",
//   assetAttributeLabel = "",
//   labelNo = i18n.t("datatable.no"),
//   labelYes = i18n.t("datatable.yes"),
//   hierarchyDropdownObject,
//   foundationProductskuversion = 0,
//   productGTINKey = 0,
//   productnameKey=0,
//   productskuheroId = null,
//   productskuheroImage = UploadImage,
//   multiSelectColumn = [
//     "superCategory",
//     "childSuperCategory",
//     "category",
//     "childCategory",
//     "subCategory",
//     "childSubCategory",
//     "brand",
//     "childBrand",
//     "subBrand",
//     "Locale",
//   ]

// const setInstance = (e) => {
//   stepWizard = e
// }

// const mapStateToProps = state => {
// 	return {
//     getFilterDataValue: state.stateData.getFilterdata,
// 		retainingData: state.dashboardValue.selectedFiltersforRetainingValues,
//     getUserDetail: state.userDetail.getUsersObj.userCredentials
// 	}
// }
// let requestParams = {}
// requestParams = {
//   superCategoryList : [],
//   childSuperCategoryList : [],
//   categoryList : [],
//   childCategoryList : [],
//   subCategoryList : [],
//   childSubCategoryList : [],
//   brandList : [],
//   subFamilyList : [],
//   subBrandList : [],
//   optionsList :[],     
//   organizationId : "",
//   moduleName: 'PIM Manage Catalog',
//   toDate: moment(new Date()).format('YYYY-MM-DD'),
//   columnName: 'filter'
// }



// function EnhancedContent(props) {
//   let guid = (props.history.location.state&&props.history.location.state.guid)?props.history.location.state.guid:null
//   let organizationSpec,dropDownloadSpec;
//   if(sessionStorage.getItem("OrgSpec")){
//     dropDownloadSpec = JSON.parse(sessionStorage.getItem("OrgSpec")).pix.hierarchyMasterIds
//     organizationSpec= JSON.parse(sessionStorage.getItem("OrgSpec")).pix.hierarchyConstantsMap
//   }
//   const { getFilterDataValue, getUserDetail } = props
//   const toast = useRef(null)
//   let userDetails = getUserDetail
//   const [productSkuGroupData, setProductSkuGroupData] = useState()
//   const [productName, setProductName] = useState("")
//   const [heroImage, setHeroImage] = useState()
//   const [heroImageGroupData, setHeroImageGroupData] = useState([])
//   const [gtin, setGtin] = useState()
//   const [isGobackDialog, setIsGobackDialog] = useState(false)
//   const [digitalAssestsData, setDigitalAssestsData] = useState(null)
//   const [productSkuAttributeData, setProductSkuAttributeData] = useState([])
//   const [isLoader, setIsLoader] = useState(true)
//   const [isEditProductName, setIsEditProductName] = useState(false)
//   const [isToastMsg, setIsToastMsg] = useState(false)
//   const [spinner, setSpinner] = useState(false)
//   const [isApiSuccess, setIsApiSuccess] = useState(false)
//   // const [derivedAttrGrpOptions, setDerivedAttrGrpOptions] = useState([])
//   const [assetsOptionObj, setAssetsOptionObj] = useState({
//     totalOptions: [],
//     derivedOptions: [],
//   })
//   const [totalAssetOptions, setTotalAssetOptions] = useState([])
//   const [derivedAssetOptions, setDerivedAssetOptions] = useState([])
//   // const [derivedAttrOptions, setDerivedAttrOptions] = useState({})
//   const {
//     ProductSkuDetails: { ProductSkuContextValue, setProductSkuContextValue },
//     ProductSkuMethodName: { ProductMethodContextValue, setProductMethodContextValue },
//     SelectedProductSkuImageName:{ProductSkuUploadedImageName,setProductSkuUploadedImageName},
//   } = useContext(HeaderContext)
//   let staticConstants = getFilterDataValue
//     ? JSON.parse(getFilterDataValue.organization.defaultoption.StaticConstants)
//     : null
//   let filterOptions = getFilterDataValue
//     ? JSON.parse(getFilterDataValue.organization.defaultoption.FilterDropdowns)
//     : null
//   requestParams.optionsList=filterOptions.PIM_Manage_Catalog.option_list_for_request.split(
//     ", "
//   )
//   requestParams.organizationId = getFilterDataValue.organization.id
//   const [localeList, setLocaleList] = useState([])
//   const [localeSelect, setLocaleSelect] = useState({})
//   const [superCategoryList, setSuperCategoryList] = useState([])
//   const [superCateSelect, setSuperCateSelect] = useState({})
//   const [childSuperCategoryList, setChildSuperCategoryList] = useState([])
//   const [childSuperCateSelect, setChildSuperCateSelect] = useState({})
//   const [categoryList, setCategoryList] = useState([])
//   const [cateSelect, setCateSelect] = useState({})
//   const [childCategoryList, setChildCategoryList] = useState([])
//   const [childCateSelect, setChildCateSelect] = useState({})
//   const [subCategoryList, setSubCategoryList] = useState([])
//   const [subCateSelect, setSubCateSelect] = useState({})
//   const [childSubCategoryList, setChildSubCategoryList] = useState([])
//   const [childSubCateSelect, setChildSubCateSelect] = useState({})
//   const [brandList, setBrandList] = useState([])
//   const [brandSelect, setbrandSelect] = useState({})
//   const [childBrandList, setChildBrandList] = useState([])
//   const [childBrandSelect, setchildBrandSelect] = useState({})
//   const [subBrandList, setSubBrandList] = useState([])
//   const [subBrandSelect, setSubBrandSelect] = useState({})
//   const [isPageInitiated, setIsPageInitiated] = useState(false)
//   const [mandatoryColumnList, setMandatoryColumnList] = useState([])
//   const [isOptionDisabled, setIsOptionDisabled] = useState(false)
//   const [updateData, setUpdateData] = useState()
//   const [hierarchyLoader, setHierarchyLoader] = useState(false)
//   const [hierarchyDropdownSelected, setHierarchyDropdownSelected] = useState(null)
//   const [showLoader, setIsShowLoader] = useState(false)
//   const [showUpdateToast,setShowUpdateToast] = useState(false)
//   const [heroId, setHeroId] = useState(null)
//   // const [selectedImageName,setSelectedImageName] = useState()
//   const [superCateLoader,setSuperCateLoader] = useState(true)
//   const [childSuperCateLoader,setChildSuperCateLoader] = useState(true)
//   const [cateLoader,setCateLoader] = useState(true)
//   const [childCateLoader,setChildCateLoader] = useState(true)
//   const [subCateLoader,setSubCateLoader] = useState(true)
//   const [childSubCateLoader,setChildSubCateLoader] =useState(true)
//   const [brandLoader,setBrandLoader] = useState(true)
//   const [childBrandLoader,setChildBrandLoader] = useState(true)
//   const [subBrandLoader,setSubBrandLoader] = useState(true)
//   const [retailerList,setRetailerList] = useState([])
//   const [cloneContent,setCloneContent] =  useState("")
//   const [isSaveDialog,setIsSaveDialog] = useState(false)
//   const [isAddAssetDialog,setIsAddAssetDialog] = useState(false)
//   const [selectedRetailerData, setSelectedRetailerData] = useState([]) // Final Save Selection  
//   const [allChecked,setallChecked] = useState(false)
//   const [retailerId,setRetailerId] = useState(null) // Selected Retailer Id 
//   const [selectedRetailerObject,setSelectedRetailerObject] = useState() // RightSide Selection Object
//   const [prevSelectedRetailer,setPrevSelectedRetailer]=useState() 
//   // const [cloneProductIsPresent,setCloneProductIsPresent] = useState(false)
//   const [isValueChanged,setIsValueChanged] = useState(false)
//   const [isClone,setIsClone]= useState(false)
//   const [isBeforeclonedataDialog,setIsBeforeclonedataDialog] = useState(false)
//   const [isFormReinitialize,setIsFormReinitialize]= useState(true) 
//   const [hierarchyConstantsMap,setHierarchyConstantsMap] = useState({})
//   const [isCloneClick,setIsCloneClick]=useState(false)
//   const [digitalassetsIds,setDigitalassetsIds]=useState([])
//   const [isInputchecked, setIsInputChecked] = useState('Active')
//   const initialValues = {
//     productNameTextbox: productName,
//     heroImageUrl: heroImage,
//     GTINTextbox: "",
//     productSkuAttributeGroups: productSkuAttributeData,
//     productskuAssets: digitalAssestsData
//       ? digitalAssestsData.digitalAssetsDatas
//       : [],
//     productSkuGroup_Data: productSkuGroupData,
//   } 
 

//   const Fieldarrayschema = Yup.object().shape({
//     productNameTextbox: Yup.string().trim()
//       .required(i18n.t("validationMessage.productNameisRequired"))
//       .max(500, i18n.t("validationMessage.productNameSizeisRequired")),
//     GTINTextbox: Yup.string().trim()
//       .required(i18n.t("validationMessage.GTINisRequired")),
//     heroImageGroup: Yup.array().of(
//       Yup.object().shape({
//         AssetsID: Yup.number()
//           .nullable()
//           .required(i18n.t("validationMessage.heroImageisRequired")),
//       })
//     ),
//     digitalAssestsGroup: Yup.array().of(
//       Yup.object().shape({
//         AssetsID: Yup.number()
//           .nullable()
//           .required("Asset is Required"),
//       })
//     ),
//     Locale: Yup.object().shape({
//       name: Yup.string().required(
//         i18n.t("validationMessage.localeisRequired")
//       ),
//     }),
//     [organizationSpec.superCategory]: mandatoryColumnList.includes(organizationSpec.superCategory) ? Yup.object().shape({
//       name: Yup.string().required(organizationSpec.superCategory + " is required"),
//     }) : null,
//     [organizationSpec.childSuperCategory]: mandatoryColumnList.includes(organizationSpec.childSuperCategory) ? Yup.object().shape({
//       name: Yup.string().required(organizationSpec.childSuperCategory + " is required"),
//     }) : null,
//     [organizationSpec.category]: mandatoryColumnList.includes(organizationSpec.category) ? Yup.object().shape({
//       name: Yup.string().required(organizationSpec.category + " is required"),
//     }) : null,
//     [organizationSpec.childCategory]: mandatoryColumnList.includes(organizationSpec.childCategory) ? Yup.object().shape({
//       name: Yup.string().required(organizationSpec.childCategory + " is required"),
//     }) : null,
//     [organizationSpec.subCategory]: mandatoryColumnList.includes(organizationSpec.subCategory) ? Yup.object().shape({
//       name: Yup.string().required(organizationSpec.subCategory + " is required"),
//     }) : null,
//     [organizationSpec.childSubCategory]: mandatoryColumnList.includes(organizationSpec.childSubCategory) ? Yup.object().shape({
//       name: Yup.string().required(organizationSpec.childSubCategory + " is required"),
//     }) : null,
//     [organizationSpec.brand]: mandatoryColumnList.includes(organizationSpec.brand) ? Yup.object().shape({
//       name: Yup.string().required(organizationSpec.brand + " is required"),
//     }) : null,
//     [organizationSpec.childBrand]: mandatoryColumnList.includes(organizationSpec.childBrand) ? Yup.object().shape({
//       name: Yup.string().required(organizationSpec.childBrand + " is required"),
//     }) : null,
//     [organizationSpec.subBrand]: mandatoryColumnList.includes(organizationSpec.subBrand) ? Yup.object().shape({
//       name: Yup.string().required(organizationSpec.subBrand + " is required"),
//     }) : null,
//   })
//   const formRef = useRef()

//   const productDetails = ProductSkuContextValue
//   let selectedProductSku =
//     ProductSkuContextValue != "" ? JSON.parse(productDetails)[0] : ""
//   const renderTitle = () => {
//     return (
//       <div>
//         <div className="p-grid common-header-section">
//           <h5 className="p-m-0  p-col-12 page-header">
//             {ProductMethodContextValue == "CREATE"
//               ? i18n.t("productSkulist.dialogtitle")
//               : `Update Product - ${guid?props.history.location.state.retailerName:(selectedRetailerObject&&selectedRetailerObject.retailerName)}`}
//           </h5>
//         </div>
//       </div>
//     )
//   }

//   const requestFailedCall = (result, Errormsg) => {
//     if (result && result.content && result.content.status != 200) {
//       toastHeading = i18n.t("toastMessage.requestFailed")
//       toastContent = i18n.t("toastMessage.requestFailedMessage")
//       titleBackgroundColor = ERROR_BG_COLOR
//       toastSize = MEDIUM
//       setIsToastMsg(true)
//     }
//   } 

//   useEffect(() => {
//     props.retainingData.applyStatus = false    
//     getApiRequestObject.pageStart = 0
//     getApiRequestObject.pageEnd = 1000
//     getApiRequestObject.organizationId = userDetails.organizationid
//     getApiRequestObject.sortField = "id"
//     getApiRequestObject.sortType = "DESC"
//     getApiRequestObject.attrGrpName= "%%"
//     props.dropdownvalueData(getApiRequestObject)
//     props.getOrganizationDetails(null, userDetails.organizationid)
//     props.getAllRetailerData({
//       "orgId":userDetails.organizationid
//   })
//   }, [])

//   //Get All Retailer List
//   useEffect(()=>{
//     const { getAllRetailerDataResult } = props  
//     if(getAllRetailerDataResult&&getAllRetailerDataResult.content&&
//       getAllRetailerDataResult.content.status==200&&getAllRetailerDataResult.content.data){
//         setRetailerList(getAllRetailerDataResult.content.data)
//         let foundationValue = getAllRetailerDataResult.content.data.find((retailerdata)=>retailerdata.isfoundation==true)
//         setSelectedRetailerObject(foundationValue)
//         setPrevSelectedRetailer(foundationValue)
//         if(foundationValue){
//           setRetailerId(foundationValue.id)
//         }
//         let allretailerData = getAllRetailerDataResult.content.data;
       
//         allretailerData = getAllRetailerDataResult.content.data.map(retailer=>{
//           retailer["isChecked"]=false;
//           return {...retailer,retailer}
//         })  
//         setSelectedRetailerData(allretailerData)
//       }
//   },[props.getAllRetailerDataResult])

//   //Get ProductSku For Update
//   useEffect(() => {
//     const { updateGetProductSkuDataResult,cloneupdateGetProductSkuDataResult } = props
//     if ((updateGetProductSkuDataResult && props.updateGetProductSkuDataResult.content.data && updateData == undefined)||
//     cloneupdateGetProductSkuDataResult && props.cloneupdateGetProductSkuDataResult.content.data 
//     ) {
//       // setIsGridDialog(false) 
//       setIsFormReinitialize(true)
//       if(props.cloneupdateGetProductSkuDataResult && props.cloneupdateGetProductSkuDataResult.content.data){
//         props.dropdownvalueData(getApiRequestObject)
//         props.updateGetProductSkuDataResult=props.cloneupdateGetProductSkuDataResult
//         // initialValues.productSkuAttributeGroups.sort().reverse()
//         initialValues.productSkuAttributeGroups=[
//           {
//             attributeGroupName: i18n.t("productSkulist.name"),
//             attributes: [],
//           },
//         ]       
        
//         setHeroImageGroupData({
//           AssetsID: "",
//           AttributeID: "assets.value",
//           AttributeType: "IMAGE",
//           AssetsUrl: "",
//           AttributeName: "assets.label",
//         })
//         changevalue = [{ name: "", value: "" }]
//         //isrender = true
//         props.getSuperCategories(requestParams)
//       }
//       if(isCloneClick && updateData == undefined){
//       props.getSuperCategories(requestParams)}
//       setIsCloneClick(false)
//       setProductSkuGroupData(
//         props.updateGetProductSkuDataResult.content.data.productSkuAttributeGroups
//       )
//       // props.updateGetProductSkuDataResult.content.data.productStatus == "ACTIVE" ? setIsInputChecked('Active') : setIsInputChecked('Markedfordelist')
      
//       if(props.updateGetProductSkuDataResult.content.data.productStatus == "ACTIVE"){
//         setIsInputChecked('Active')
//       }
//       else if (props.updateGetProductSkuDataResult.content.data.productStatus == "MARKEDFORDELISTING"){
//         setIsInputChecked('Markedfordelist')
//       }
//       else{
//         setIsInputChecked('Delisted')
//       }
      
//       if(props.updateGetProductSkuDataResult.content.data.productSkuId == null){
//         foundationProductskuversion =  props.updateGetProductSkuDataResult.content.data.productSkuVersion
//       }
//       setUpdateData(props.updateGetProductSkuDataResult)
//       heroImagedigitalassets =
//         props.updateGetProductSkuDataResult.content.data.digitalAssets &&
//         props.updateGetProductSkuDataResult.content.data.digitalAssets.digitalAssetsDatas
//       let heroImg = ""   
//       heroImagedigitalassets && heroImagedigitalassets.length > 0 &&
//         heroImagedigitalassets.map((asset, index) => {
//           if (asset.AttributeName == i18n.t("productSkulist.mainimageURL")) {
//             heroImg = asset.AssetsUrl
//             setHeroImageGroupData([asset])
//           }
//         })
//         if(isValueChanged){
//           setIsValueChanged(false)
//         }
//       setHeroImage(heroImg)
//       // setHeroImageGroupData(heroImagedigitalassets)
//       setDigitalAssestsData(
//         props.updateGetProductSkuDataResult.content.data.digitalAssets
//       )
//       createFieldArrayJsonDigitalassets(
//         props.updateGetProductSkuDataResult.content.data.digitalAssets
//       )
//       setProductName(
//         props.updateGetProductSkuDataResult.content.data.productName
//       )
//       setGtin(props.updateGetProductSkuDataResult.content.data.gtin)
//       createFieldArrayJson(
//         props.updateGetProductSkuDataResult.content.data
//           .productSkuAttributeGroups
//       )
//       setIsLoader(false)
//     }
//   }, [props.updateGetProductSkuDataResult,props.cloneupdateGetProductSkuDataResult])

//   useEffect(() => {
//     const { getOrganizationDetailsResult } = props
//     if (
//       getOrganizationDetailsResult &&
//       getOrganizationDetailsResult.content &&
//       getOrganizationDetailsResult.content.data
//     ) {
//       let userMandatoryColumn =
//         getOrganizationDetailsResult.content.data.orgSpec &&
//         JSON.parse(getOrganizationDetailsResult.content.data.orgSpec)
//         setHierarchyConstantsMap(userMandatoryColumn.pix.hierarchyConstantsMap)
//       let orgName = getOrganizationDetailsResult.content.data.orgname
//       let columnList =
//         userMandatoryColumn &&
//         userMandatoryColumn[orgName] &&
//         userMandatoryColumn[orgName].mandatoryColumns
//       let data = []
//       hierarchyDropdownObject = {
//         Locale: "",
//         [userMandatoryColumn.pix.hierarchyConstantsMap.superCategory]: "",
//         [userMandatoryColumn.pix.hierarchyConstantsMap.childSuperCategory]: "",
//         [userMandatoryColumn.pix.hierarchyConstantsMap.category]: "",
//         [userMandatoryColumn.pix.hierarchyConstantsMap.childCategory]: "",
//         [userMandatoryColumn.pix.hierarchyConstantsMap.subCategory]: "",
//         [userMandatoryColumn.pix.hierarchyConstantsMap.childSubCategory]: "",
//         [userMandatoryColumn.pix.hierarchyConstantsMap.brand]: "",
//         [userMandatoryColumn.pix.hierarchyConstantsMap.childBrand]: "",
//         [userMandatoryColumn.pix.hierarchyConstantsMap.subBrand]: "",
//       }
//       //multiSelectColumn = userMandatoryColumn.pix.hierarchyConstantsMap
//       multiSelectColumn = []
//       multiSelectColumn = userMandatoryColumn.pix.mandatoryColumns
//       columnList &&
//         columnList.filter(function (obj) {
//           if (multiSelectColumn.indexOf(obj) != -1) {
//             data.push(obj)
//           }
//         })
//         if(ProductMethodContextValue == "CREATE"&&changevalue[0].name == ""){
//       setHierarchyLoader(true)}
//       setMandatoryColumnList(data)
//       // formRef.current.values.Locale = localeSelect
//       setIsPageInitiated(true)
//       props.getLocaleByOrganizationId({
//         organizationId: parseInt(userDetails.organizationid),
//       })
//     } else {
//       requestFailedCall(getOrganizationDetailsResult, i18n.t("toastMessage.organizationRequestFailed"))
//     }
//   }, [props.getOrganizationDetailsResult])

//   useEffect(() => {
//     const { getLocaleByOrganizationIdResult } = props
//     if (
//       getLocaleByOrganizationIdResult &&
//       getLocaleByOrganizationIdResult.content &&
//       getLocaleByOrganizationIdResult.content.data &&
//       getLocaleByOrganizationIdResult.content.status == 200
//     ) {
//       let localeList = []
//         getLocaleByOrganizationIdResult.content.data &&
//         getLocaleByOrganizationIdResult.content.data.length > 0 &&
//         getLocaleByOrganizationIdResult.content.data.map((locales, index) => {
//           localeList.push({ id: locales.id ,name:locales.locale,value:locales.locale})
//         })
//       if (changevalue[0].name == "" || ProductMethodContextValue == "CREATE") {
//         setLocaleList(localeList)
//       } else {
//         setFieldsValue("localeList", localeList)
//       }
//       let request = getAssetHierarchyObject
//       if (ProductMethodContextValue == "UPDATE" && changevalue[0].name == ""&& hierarchyDropdownObject["Locale"] !="") {
//         request.localeId = hierarchyDropdownObject["Locale"].id!=undefined ? hierarchyDropdownObject["Locale"].id:hierarchyDropdownObject["Locale"]
//       } else {
//         request.localeId =
//           getLocaleByOrganizationIdResult.content.data.length > 0 &&
//           getLocaleByOrganizationIdResult.content.data[0].id
//       }
//       request.ids = [parseInt(userDetails.organizationid)]
//        props.getSuperCategories(requestParams)
      
//       let selectedHierarchyObject = hierarchyDropdownObject
//       selectedHierarchyObject.Locale =
//         getLocaleByOrganizationIdResult.content.data.length > 0 &&
//         localeList[0]
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//     } else {
//       requestFailedCall(getLocaleByOrganizationIdResult, i18n.t("toastMessage.localeRequestFailed"))
//     }
//   }, [props.getLocaleByOrganizationIdResult])

//   const checkRequestIdIsEmpty = (data) =>{
//     if(data == [""] || data == "" || data == false || data == true ){
//       return []
//     }
//     else{
//       return data
//     }
//   }

//   useEffect(() => {
//     const { getSuperCategoriesResult } = props
//     if (
//       getSuperCategoriesResult &&
//       getSuperCategoriesResult.content &&
//       getSuperCategoriesResult.content.data &&
//       getSuperCategoriesResult.content.status == 200
//     ) {
//       let supercateList = []
//       getSuperCategoriesResult.content.data &&
//         getSuperCategoriesResult.content.data.length > 0 &&
//         getSuperCategoriesResult.content.data.map((superCate, index) => {
//           supercateList.push({ name: superCate.name, value: superCate.name,id: superCate.id})
//         })
//       if (changevalue[0].name == ""  || ProductMethodContextValue == "CREATE") {
//         setSuperCategoryList(supercateList)
//       } else {
//         setFieldsValue("superCategoryList", supercateList)
//       }
//       if(dropDownloadSpec && dropDownloadSpec.superCategory && dropDownloadSpec.superCategory !== undefined){
//        setSuperCateSelect({id: dropDownloadSpec.superCategory, name: 'All', value: 'All', label: 'All'})
//       }
//       let request = getAssetHierarchyObject

//       if (ProductMethodContextValue == "UPDATE" && changevalue[0].name == "") {
//         request.ids = [hierarchyDropdownObject[hierarchyConstantsMap.superCategory].id!=undefined ?
//         hierarchyDropdownObject[hierarchyConstantsMap.superCategory]:hierarchyDropdownObject[hierarchyConstantsMap.superCategory]]
        
//       } else {
//         request.ids = getSuperCategoriesResult.content.data.length > 0 && [
//           getSuperCategoriesResult.content.data[0]
//         ]
//       }
//       request.ids = checkRequestIdIsEmpty(request.ids)

//       requestParams.superCategoryList = request.ids
//       setSuperCateLoader(false)
//       request.pageStart = 0
//       let selectedHierarchyObject = hierarchyDropdownObject
//       selectedHierarchyObject[hierarchyConstantsMap.superCategory] =
//         getSuperCategoriesResult.content.data.length > 0 &&
//         supercateList[0] ? supercateList[0] :[];
//       setHierarchyDropdownSelected(selectedHierarchyObject)
     
//       setIsOptionDisabled(false)
//       if (isPageInitiated ) {
//         setChildSuperCateLoader(true)
//         props.getChildSuperCategories(requestParams)
//         setIsPageInitiated(false)
//         setIsOptionDisabled(true)
//       }
//     } else {
//       if(getSuperCategoriesResult){setSuperCateLoader(false) }
//       requestFailedCall(getSuperCategoriesResult, i18n.t("toastMessage.superCateRequestFailed"))
//     }
//   }, [props.getSuperCategoriesResult])

//   useEffect(() => {
//     const { getChildSuperCategoriesResult } = props
//     if (
//       getChildSuperCategoriesResult &&
//       getChildSuperCategoriesResult.content &&
//       getChildSuperCategoriesResult.content.data
//     ) {
//       let childSuperCateList = []
//       getChildSuperCategoriesResult.content.data &&
//         getChildSuperCategoriesResult.content.data.length > 0 &&
//         getChildSuperCategoriesResult.content.data.map(
//           (childsuperCate, index) => {
//             childSuperCateList.push({
//               name: childsuperCate.name,value: childsuperCate.name,
//               id: childsuperCate.id
//             })
//           }
//         )
      
//       if (changevalue[0].name == ""  || ProductMethodContextValue == "CREATE") {
//         setChildSuperCategoryList(childSuperCateList)
//       } else {
//         setFieldsValue("childSuperCategoryList", childSuperCateList)
//       }

//       if(dropDownloadSpec && dropDownloadSpec.childSuperCategory && dropDownloadSpec.childSuperCategory !== undefined){
//         setChildSuperCateSelect({id: dropDownloadSpec.childSuperCategory, name: 'All', value: 'All', label: 'All'})
//        }

//       setChildSuperCateLoader(false)
//       let request = getAssetHierarchyObject
//       if (ProductMethodContextValue == "UPDATE" && changevalue[0].name == "") {
//         request.ids =  [hierarchyDropdownObject[hierarchyConstantsMap.childSuperCategory].id!=undefined ?
//         hierarchyDropdownObject[hierarchyConstantsMap.childSuperCategory]:hierarchyDropdownObject[hierarchyConstantsMap.childSuperCategory]]
//       } else {
//         request.ids = getChildSuperCategoriesResult.content.data.length > 0 && [
//           getChildSuperCategoriesResult.content.data[0]
//         ]
//       }
//       request.ids = checkRequestIdIsEmpty(request.ids)
//       requestParams.childSuperCategoryList = request.ids
//       request.pageStart = 0
//       setIsOptionDisabled(false)
//       //if (isDropdownInitiate) {
//       let selectedHierarchyObject = hierarchyDropdownObject
//       selectedHierarchyObject[hierarchyConstantsMap.childSuperCategory] =
//         getChildSuperCategoriesResult.content.data.length > 0 &&
//         childSuperCateList[0] ? childSuperCateList[0]:[];
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       //}
//       if (!isPageInitiated ) {
//         setIsOptionDisabled(true)
//         setCateLoader(true)
//         props.getCategories(requestParams)
//         setIsPageInitiated(true)
//         //setIsSubmitLoader(true)
//       }
//     } else {
     
//       if(getChildSuperCategoriesResult){setChildSuperCateLoader(false)}
//       requestFailedCall(getChildSuperCategoriesResult, i18n.t("toastMessage.childSuperCateRequestFailed"))
//     }
//   }, [props.getChildSuperCategoriesResult])

//   useEffect(() => {
//     const { getCategoriesResult } = props
//     if (
//       getCategoriesResult &&
//       getCategoriesResult.content &&
//       getCategoriesResult.content.data
//     ) {
//       let CategoriesList = []
//         getCategoriesResult.content.data &&
//         getCategoriesResult.content.data.length > 0 &&
//         getCategoriesResult.content.data.map((category, index) => {
//           CategoriesList.push({ name: category.name,value: category.name, id: category.id})
//         })
      

//       if (changevalue[0].name == ""  || ProductMethodContextValue == "CREATE") {
//         setCategoryList(CategoriesList)
//       } else {
//         setFieldsValue("categoryList", CategoriesList)
//       }
      
    
//       setCateLoader(false)
//       let request = getAssetHierarchyObject

//       if (ProductMethodContextValue == "UPDATE" && changevalue[0].name == "") {
//         request.ids = [hierarchyDropdownObject[hierarchyConstantsMap.category].id!=undefined ?
//         hierarchyDropdownObject[hierarchyConstantsMap.category]:hierarchyDropdownObject[hierarchyConstantsMap.category]]
//       } else {
//         request.ids = getCategoriesResult.content.data.length > 0 && [
//           getCategoriesResult.content.data[0],
//         ]
//       }
//       request.ids = checkRequestIdIsEmpty(request.ids)
//       requestParams.categoryList = request.ids
//       request.pageStart = 0
//        //if (isDropdownInitiate) {
     
//       // }
//       if(dropDownloadSpec && dropDownloadSpec.category && dropDownloadSpec.category !== undefined){
//         setCateSelect({id: dropDownloadSpec.category, name: 'All', value: 'All', label: 'All'})
//        }

//       setIsOptionDisabled(false)
//       let selectedHierarchyObject = hierarchyDropdownObject
//       selectedHierarchyObject[hierarchyConstantsMap.category] =
//         getCategoriesResult.content.data.length > 0 &&
//         CategoriesList[0] ? CategoriesList[0] : [];
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       if (isPageInitiated ) {
//         setIsOptionDisabled(true)
//         setChildCateLoader(true)
//         props.getChildCategories(requestParams)
//         setIsPageInitiated(false)
//         //setIsSubmitLoader(true)
//       }
//     } else {
     
//       if(getCategoriesResult){setCateLoader(false)}
//       requestFailedCall(getCategoriesResult, i18n.t("toastMessage.categoryRequestFailed"))
//     }
//   }, [props.getCategoriesResult])

//   useEffect(() => {
//     const { getChildCategoriesResult } = props
//     if (
//       getChildCategoriesResult &&
//       getChildCategoriesResult.content &&
//       getChildCategoriesResult.content.data
//     ) {
//       let childCategoriesList = []
//         getChildCategoriesResult.content.data &&
//         getChildCategoriesResult.content.data.length > 0 &&
//         getChildCategoriesResult.content.data.map((childCategory, index) => {
//           childCategoriesList.push({
//             name: childCategory.name,value: childCategory.name,
//             id: childCategory.id
//           })
//         })

//       if (changevalue[0].name == ""  || ProductMethodContextValue == "CREATE") {
//         setChildCategoryList(childCategoriesList)
//       } else {
//         setFieldsValue("childCategoryList", childCategoriesList)
//       }
          
//       if(dropDownloadSpec && dropDownloadSpec.childCategory && dropDownloadSpec.childCategory !== undefined){
//         setChildCateSelect({id: dropDownloadSpec.childCategory, name: 'All', value: 'All', label: 'All'})
//         }
//       let request = getAssetHierarchyObject

//       if (ProductMethodContextValue == "UPDATE" && changevalue[0].name == "") {
//         request.ids = [hierarchyDropdownObject[hierarchyConstantsMap.childCategory].id!=undefined ?
//         hierarchyDropdownObject[hierarchyConstantsMap.childCategory]:hierarchyDropdownObject[hierarchyConstantsMap.childCategory]]
//       } else {
//         request.ids = getChildCategoriesResult.content.data.length > 0 && [
//           getChildCategoriesResult.content.data[0]
//         ]
//       }
//       request.ids = checkRequestIdIsEmpty(request.ids)
//       setChildCateLoader(false)
//       request.pageStart = 0
//       requestParams.childCategoryList = request.ids
//       //if (isDropdownInitiate) {
     
//       // }
//       setIsOptionDisabled(false)
//       let selectedHierarchyObject = hierarchyDropdownObject
//       selectedHierarchyObject[hierarchyConstantsMap.childCategory] =
//         getChildCategoriesResult.content.data.length > 0 &&
//         childCategoriesList[0] ?  childCategoriesList[0] :[];
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       if (!isPageInitiated ) {
//         setIsOptionDisabled(true)
//         setSubCateLoader(true)
//         props.getSubCategories(requestParams)
//         setIsPageInitiated(true)
//         //setIsSubmitLoader(true)
//       }
//     } else {
    
//       if(getChildCategoriesResult){setChildCateLoader(false)}
//       requestFailedCall(getChildCategoriesResult, i18n.t("toastMessage.childCateRequestFailed"))
//     }
//   }, [props.getChildCategoriesResult])

//   useEffect(() => {
//     const { getSubCategoriesResult } = props
//     if (
//       getSubCategoriesResult &&
//       getSubCategoriesResult.content &&
//       getSubCategoriesResult.content.data
//     ) {
//       let subCategoriesList = []
//       getSubCategoriesResult.content.data &&
//         getSubCategoriesResult.content.data.length > 0 &&
//         getSubCategoriesResult.content.data.map((subCategory, index) => {
//           subCategoriesList.push({
//             name: subCategory.name,value: subCategory.name,
//             id: subCategory.id
//           })
//         })
//       if (changevalue[0].name == ""  || ProductMethodContextValue == "CREATE") {
//         setSubCategoryList(subCategoriesList)
//       } else {
//         setFieldsValue("subCategoryList", subCategoriesList)
//       }
//       if(dropDownloadSpec && dropDownloadSpec.subCategory && dropDownloadSpec.subCategory !== undefined){
//         setSubCateSelect({id: dropDownloadSpec.subCategory, name: 'All', value: 'All', label: 'All'})
//         }

//       setSubCateLoader(false)
//       let request = getAssetHierarchyObject
//       if (ProductMethodContextValue == "UPDATE" && changevalue[0].name == "") {
//         request.ids = [hierarchyDropdownObject[hierarchyConstantsMap.subCategory].id!=undefined ?
//         hierarchyDropdownObject[hierarchyConstantsMap.subCategory]:hierarchyDropdownObject[hierarchyConstantsMap.subCategory]]
//       } else {
//         request.ids = getSubCategoriesResult.content.data.length > 0 && [
//           getSubCategoriesResult.content.data[0],
//         ]
//       }
//       request.ids = checkRequestIdIsEmpty(request.ids)
//       requestParams.subCategoryList = request.ids
//       request.pageStart = 0
//       //if (isDropdownInitiate) {
     
//       //}
//       setIsOptionDisabled(false)
//       let selectedHierarchyObject = hierarchyDropdownObject
//       selectedHierarchyObject[hierarchyConstantsMap.subCategory] =
//         getSubCategoriesResult.content.data.length > 0 &&
//         subCategoriesList[0] ? subCategoriesList[0]:[];
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       if (isPageInitiated ) {
//         setIsOptionDisabled(true)
//         setChildSubCateLoader(true)
//         props.getChildSubCategories(requestParams)
//         setIsPageInitiated(false)
//         // setIsSubmitLoader(true)
//       }
//     } else {
//       if(getSubCategoriesResult){setSubCateLoader(false)}
//       requestFailedCall(getSubCategoriesResult, i18n.t("toastMessage.subCateRequestFailed"))
//     }
//   }, [props.getSubCategoriesResult])

//   useEffect(() => {
//     const { getChildSubCategoriesResult } = props
//     if (
//       getChildSubCategoriesResult &&
//       getChildSubCategoriesResult.content &&
//       getChildSubCategoriesResult.content.data
//     ) {
//       let childSubCategoriesList = []
//       getChildSubCategoriesResult.content.data &&
//         getChildSubCategoriesResult.content.data.length > 0 &&
//         getChildSubCategoriesResult.content.data.map(
//           (childSubCategory, index) => {
//             childSubCategoriesList.push({
//               name: childSubCategory.name,value: childSubCategory.name,
//               id: childSubCategory.id
//             })
//           }
//         )
//         setChildSubCateLoader(false)
//       if (changevalue[0].name == ""  || ProductMethodContextValue == "CREATE") {
//         setChildSubCategoryList(childSubCategoriesList)
//       } else {
//         setFieldsValue("childSubCategoryList", childSubCategoriesList)
//       }
//       if(dropDownloadSpec && dropDownloadSpec.childSubCategory && dropDownloadSpec.childSubCategory !== undefined){
//         setChildSubCateSelect({id: dropDownloadSpec.childSubCategory, name: 'All', value: 'All', label: 'All'})
//         }
//       let request = getAssetHierarchyObject

//       if (ProductMethodContextValue == "UPDATE" && changevalue[0].name == "") {
//         request.ids = [hierarchyDropdownObject[hierarchyConstantsMap.childSubCategory].id!=undefined ?
//         hierarchyDropdownObject[hierarchyConstantsMap.childSubCategory]:hierarchyDropdownObject[hierarchyConstantsMap.childSubCategory]]
//       } else {
//         request.ids = getChildSubCategoriesResult.content.data.length > 0 && [
//           getChildSubCategoriesResult.content.data[0]
//         ]
//       }
//       request.ids = checkRequestIdIsEmpty(request.ids)
//       requestParams.childSubCategoryList = request.ids
//       request.pageStart = 0
     
     
//       setIsOptionDisabled(false)
//       let selectedHierarchyObject = hierarchyDropdownObject
//       selectedHierarchyObject[hierarchyConstantsMap.childSubCategory] =
//         getChildSubCategoriesResult.content.data.length > 0 &&
//         childSubCategoriesList[0]? childSubCategoriesList[0] : [];
//         setHierarchyDropdownSelected(selectedHierarchyObject)
//       if (!isPageInitiated ) {
//         setIsOptionDisabled(true)
//         setIsPageInitiated(true)
//         setBrandLoader(true)
//         props.getBrands(requestParams)
//       }
//     } else {
//       if(getChildSubCategoriesResult){setChildSubCateLoader(false)}
//       requestFailedCall(getChildSubCategoriesResult, i18n.t("toastMessage.childSubCateRequestFailed"))
//     }
//   }, [props.getChildSubCategoriesResult])

//   useEffect(() => {
//     const { getBrandsResult } = props
//     if (
//       getBrandsResult &&
//       getBrandsResult.content &&
//       getBrandsResult.content.data
//     ) {
//       let brandsList = []
//       getBrandsResult.content.data &&
//         getBrandsResult.content.data.length > 0 &&
//         getBrandsResult.content.data.map((brand, index) => {
//           brandsList.push({ name: brand.name,value: brand.name, id: brand.id })
//         })
//         setBrandLoader(false)
//       if (changevalue[0].name == ""  || ProductMethodContextValue == "CREATE") {
//         setBrandList(brandsList)
//       } else {
//         setFieldsValue("brandList", brandsList)
//       }
//       if(dropDownloadSpec && dropDownloadSpec.brand && dropDownloadSpec.brand !== undefined){
//         setbrandSelect({id: dropDownloadSpec.brand, name: 'All', value: 'All', label: 'All'})
//         }
//       let request = getAssetHierarchyObject

//       if (ProductMethodContextValue == "UPDATE" && changevalue[0].name == "") {
//         request.ids = [hierarchyDropdownObject[hierarchyConstantsMap.brand].id!=undefined ?
//         hierarchyDropdownObject[hierarchyConstantsMap.brand]:hierarchyDropdownObject[hierarchyConstantsMap.brand]]
//       } else {
//         request.ids = getBrandsResult.content.data.length > 0 && [
//           getBrandsResult.content.data[0],
//         ]
//       }
//       request.ids = checkRequestIdIsEmpty(request.ids)
//       requestParams.brandList = request.ids
//       request.pageStart = 0
     
      
//       setIsOptionDisabled(false)
//       let selectedHierarchyObject = hierarchyDropdownObject
//       selectedHierarchyObject[hierarchyConstantsMap.brand] =
//         getBrandsResult.content.data.length > 0 &&
//         brandsList[0]?brandsList[0]:[];
//         setHierarchyDropdownSelected(selectedHierarchyObject)
//       if (isPageInitiated ) {
//         setIsOptionDisabled(true)
//         setChildBrandLoader(true)
//         props.getChildBrands(requestParams)
//         setIsPageInitiated(false)
//       }
//     } else {
      
//       if(getBrandsResult){setBrandLoader(true)}
//       requestFailedCall(getBrandsResult, i18n.t("toastMessage.brandRequestFailed"))
//     }
//   }, [props.getBrandsResult])

//   useEffect(() => {
//     const { getChildBrandsResult } = props
//     if (
//       getChildBrandsResult &&
//       getChildBrandsResult.content &&
//       getChildBrandsResult.content.data
//     ) {
//       let childBrandsList = []
//       getChildBrandsResult.content.data &&
//         getChildBrandsResult.content.data.length > 0 &&
//         getChildBrandsResult.content.data.map((childBrand, index) => {
//           childBrandsList.push({
//             name: childBrand.name,value: childBrand.name,
//             id: childBrand.id
//           })
//         })
//       if (changevalue[0].name == ""  || ProductMethodContextValue == "CREATE") {
//         setChildBrandList(childBrandsList)
//       } else {
//         setFieldsValue("childBrandList", childBrandsList)
//       }

//       if(dropDownloadSpec && dropDownloadSpec.childBrand && dropDownloadSpec.childBrand !== undefined){
//         setchildBrandSelect({id: dropDownloadSpec.childBrand, name: 'All', value: 'All', label: 'All'})
//         }
//       let request = getAssetHierarchyObject


//       if (ProductMethodContextValue == "UPDATE" && changevalue[0].name == "") {
//         request.ids = [hierarchyDropdownObject[hierarchyConstantsMap.childBrand].id!=undefined ? 
//         hierarchyDropdownObject[hierarchyConstantsMap.childBrand]:hierarchyDropdownObject[hierarchyConstantsMap.childBrand]]
//       } else {
//         request.ids = getChildBrandsResult.content.data.length > 0 && [
//           getChildBrandsResult.content.data[0]
//         ]
//       }
//       request.ids = checkRequestIdIsEmpty(request.ids)
//       requestParams.subFamilyList = request.ids
//       request.pageStart = 0
//       setChildBrandLoader(false)
     
//       setIsOptionDisabled(false)
//       let selectedHierarchyObject = hierarchyDropdownObject
//       selectedHierarchyObject[hierarchyConstantsMap.childBrand] =
//         getChildBrandsResult.content.data.length > 0 &&
//         childBrandsList[0]? childBrandsList[0] :[];
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       if (!isPageInitiated ) {
//         setIsOptionDisabled(true)
//         setIsPageInitiated(true)
//         setSubBrandLoader(true)
//         props.getSubBrands(requestParams)
//       }
//     } else {
      
//       if(getChildBrandsResult){setChildBrandLoader(false)}
//       requestFailedCall(getChildBrandsResult, i18n.t("toastMessage.childBrandRequestFailed"))
//     }
//   }, [props.getChildBrandsResult])

//   useEffect(() => {
//     const { getSubBrandsResult } = props
//     if (
//       getSubBrandsResult &&
//       getSubBrandsResult.content &&
//       getSubBrandsResult.content.data
//     ) {
//       let subBrandsList = []
//       getSubBrandsResult.content.data &&
//         getSubBrandsResult.content.data.length > 0 &&
//         getSubBrandsResult.content.data.map((subBrand, index) => {
//           subBrandsList.push({
//             name: subBrand.name,value: subBrand.name,
//             id: subBrand.id
//           })
//         })
//       setHierarchyLoader(false)
//       setSubBrandLoader(false);
//       if (changevalue[0].name == ""  || ProductMethodContextValue == "CREATE") {
//         setSubBrandList(subBrandsList)
//       } else {
//         setFieldsValue("subBrandList", subBrandsList)
//       }
      
    

//       let selectedHierarchyObject = hierarchyDropdownObject
//       selectedHierarchyObject[hierarchyConstantsMap.subBrand] =
//         getSubBrandsResult.content.data.length > 0 &&
//         subBrandsList[0]? subBrandsList[0] :[]
//         setSubBrandSelect(selectedHierarchyObject[hierarchyConstantsMap.subBrand])

//         if(dropDownloadSpec && dropDownloadSpec.subBrand && dropDownloadSpec.subBrand !== undefined){
//           setSubBrandSelect({id: dropDownloadSpec.subBrand, name: 'All', value: 'All', label: 'All'})
//           selectedHierarchyObject[hierarchyConstantsMap.subBrand] =[{id: dropDownloadSpec.subBrand, name: 'All', value: 'All', label: 'All'}]
//           }

//         requestParams.subBrandList =  selectedHierarchyObject[hierarchyConstantsMap.subBrand]

//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       setIsOptionDisabled(false)
//     } else {
      
//       if(getSubBrandsResult){setHierarchyLoader(false)
//         setSubBrandLoader(false)}
//       requestFailedCall(getSubBrandsResult, i18n.t("toastMessage.subBrandRequestFailed"))
//     }
//   }, [props.getSubBrandsResult])

//   useEffect(() => {
//     const {
//       createProductSkuDataResult,
//       updateProductSkuDataResult,
//       deleteProductSkuDataResult,
//       updateGetProductSkuDataResult,
//     } = props
//     // productSkuDataResult(getManageAttributeResult)
//     productSkuDataResult(createProductSkuDataResult, CREATE)
//     productSkuDataResult(updateProductSkuDataResult, UPDATE)
//     productSkuDataResult(deleteProductSkuDataResult, DELETE)
//     productSkuDataResult(updateGetProductSkuDataResult,GETUPDATE)
//   }, [props.createProductSkuDataResult,props.updateProductSkuDataResult,
//     props.deleteProductSkuDataResult,props.updateGetProductSkuDataResult])

//   //Initial ProductSku GET API CALL
//   useEffect(() => {
//     if (ProductMethodContextValue == "UPDATE") {
//       getProductSkuAttributesApiRequestObject.id = selectedProductSku.id
//       getProductSkuAttributesApiRequestObject.organizationId =
//         userDetails.organizationid
//       props.updateGetProductSkuData(getProductSkuAttributesApiRequestObject)
//     }   
//     productskuheroId = null,
//     productskuheroImage = UploadImage,
//     setProductSkuAttributeData([
//       {
//         attributeGroupName: i18n.t("productSkulist.name"),
//         attributes: [],
//       },
//     ])   
//     changevalue = [{ name: "", value: "" }]
//   }, [])

//   //DropDown Load Functionality for Attribute Group and Attributes Names
//   useEffect(() => {
//     const { dropdownvalueDataResult } = props
//     if (dropdownvalueDataResult) {
//       collectionOfManDatorycolumns = []
//       let assetsDropdown = []
//       let attrGrpOptions =
//         dropdownvalueDataResult.content.data.content &&
//         dropdownvalueDataResult.content.data.content.map((key, index) => {
//           let groupName = key.attrGrpName.toString()
//           let mandatoryAttributes = [], attrOptions = [], requiredAttributes = []
//           key.attributes.map((attributes, index1) => {
//             if ((attributes.attrType == "IMAGE" || attributes.attrType == "VIDEO" || attributes.attrType == "DOCUMENT")
//              && attributes.attrName != i18n.t("productSkulist.mainimageURL") ) {
//               assetsDropdown.push({ label: attributes.attrName,value: attributes.id,type:attributes.attrType})
//             }
//             if (attributes.attrName == i18n.t("productSkulist.mainimageURL")){
//               Object.assign(heroImageDetails, {[attributes.attrName]: attributes.id})
//             }
//             attributes.attrName  == "Product Name" ?  productnameKey = attributes.id : productnameKey = productnameKey
//             attributes.attrName  == "Unique Identifier" ? productGTINKey = attributes.id : productGTINKey = productGTINKey
//             if (
//               attributes.attrName != "Product Name" && attributes.attrName != i18n.t("productSkulist.mainimageURL") &&
//               attributes.attrName != "Unique Identifier" && attributes.attrType != "IMAGE" &&
//               attributes.attrType != "VIDEO" && attributes.attrType != "DOCUMENT"
//             ) {
//               if (attributes.isMandatory != null && attributes.isMandatory) {
//                 if (updateData == undefined) {
//                   requiredAttributes.push({
//                     attributeName: attributes.attrName,
//                     value: "", id: attributes.id,
//                     required: attributes.isMandatory == null ? false : attributes.isMandatory,
//                   })
//                 }
//                 else {
//                   let getValueFromAttrGrp = updateData.content.data.productSkuAttributeGroups && updateData.content.data.productSkuAttributeGroups[0][groupName]
//                     && updateData.content.data.productSkuAttributeGroups[0][groupName].filter((obj) => obj.AttributeName === attributes.attrName)
//                   requiredAttributes.push({
//                     attributeName: attributes.attrName,
//                     value: getValueFromAttrGrp == undefined ? "" : getValueFromAttrGrp.length ? getValueFromAttrGrp[0].Value : "",
//                     id: attributes.id,required: attributes.isMandatory == null ? false : attributes.isMandatory,
//                   })
//                 }

//               } else {
//                 if (updateData == undefined) {
//                   mandatoryAttributes.push({
//                     attributeName: attributes.attrName,
//                     value: "", id: attributes.id,
//                     required: attributes.isMandatory == null ? false : attributes.isMandatory,
//                   })
//                 }
//                 else {
//                   let getValueFromAttrGrp = updateData.content.data.productSkuAttributeGroups && updateData.content.data.productSkuAttributeGroups[0][groupName]
//                     && updateData.content.data.productSkuAttributeGroups[0][groupName].filter((obj) => obj.AttributeName === attributes.attrName)
//                   mandatoryAttributes.push({
//                     attributeName: attributes.attrName,
//                     value: getValueFromAttrGrp == undefined ? "" : getValueFromAttrGrp.length ? getValueFromAttrGrp[0].Value : "",
//                     id: attributes.id,required: attributes.isMandatory == null ? false : attributes.isMandatory,
//                   })
//                 }
//               }
//               attrOptions.push({
//                 value: attributes.id,
//                 label: attributes.attrName
//               })
//             }
//           })
//           let finalAttributes = []
//           if (requiredAttributes && requiredAttributes.length > 0) {
//             finalAttributes = requiredAttributes.sort(sortArrayOfObjectValues('id')).concat(mandatoryAttributes.sort(sortArrayOfObjectValues('attributeName')))
//           } else {
//             finalAttributes = mandatoryAttributes.sort(sortArrayOfObjectValues('attributeName'))
//           }
//           let checkAttributeGroup = collectionOfManDatorycolumns.filter((obj) => obj.attributeGroupName === groupName)
//           let intialAttributeGroupCheck = initialValues.productSkuAttributeGroups.filter((obj) => obj.attributeGroupName === groupName)

//           if (checkAttributeGroup.length == 0 && finalAttributes.length && intialAttributeGroupCheck.length == 0) {
//             collectionOfManDatorycolumns.push({ attributeGroupName: groupName, attributes: finalAttributes})
//           }  
//           if (checkAttributeGroup.length == 0 && intialAttributeGroupCheck.length == 0) {
//             initialValues.productSkuAttributeGroups.push({ attributeGroupName: groupName, attributes:  finalAttributes})
//           }  


//           if(intialAttributeGroupCheck.length){
//             initialValues.productSkuAttributeGroups.map((group,index)=>{
//              if(group.attributeGroupName == intialAttributeGroupCheck[0].attributeGroupName){
//               initialValues.productSkuAttributeGroups[index].attributes = finalAttributes
//              }
//             })
//           }
//           collectionOfAssetsdropdowns = { totalOptions: assetsDropdown, derivedOptions: assetsDropdown }
//           collectionOfDatadropdowns[groupName] = { totalOptions: attrOptions, derivedOptions: attrOptions }
//           return { label: key.attrGrpName, value: key.id }
//         }) 
//       setTotalAssetOptions(collectionOfAssetsdropdowns.totalOptions)
//       setDerivedAssetOptions(collectionOfAssetsdropdowns.derivedOptions)
//       setAssetsOptionObj(collectionOfAssetsdropdowns)
     
//       if (ProductMethodContextValue == "CREATE") {
//         if (initialValues.productSkuAttributeGroups[0].attributeGroupName == i18n.t("productSkulist.name")) {
//         collectionOfManDatorycolumns.sort().reverse()
//       }
//         setProductSkuAttributeData(collectionOfManDatorycolumns)
//         setHeroImage(UploadImage)
//         setIsLoader(false)
//       } 

//       if (initialValues.productSkuAttributeGroups[0].attributeGroupName == i18n.t("productSkulist.name")) {
//         initialValues.productSkuAttributeGroups.splice(0, 1)
//         initialValues.productSkuAttributeGroups.sort().reverse()
//       } 
           
//     }
//   }, [props.dropdownvalueDataResult])

//   const cloneAfterSave = (result) => {
//     if (productSkuUpdateSaveApiRequestObject.cloneRetailerIdList.length > 0 
//       || ProductMethodContextValue == "CREATE" || isValueChanged && isClone) {
//       cloneCurrentProductSku.organizationId = parseInt(userDetails.organizationid)
//       cloneCurrentProductSku.productSkusList=[]
//       cloneCurrentProductSku.retailerIdsList=[]
//       cloneCurrentProductSku.productSkusList.push(result.content.data.id)
//        cloneCurrentProductSku.isfoundation = selectedRetailerObject.isfoundation?true:false
    
//       let retailerSelectedList = []
//       selectedRetailerData && selectedRetailerData.length &&
//         selectedRetailerData.map((item, index) => {
//           if ((!item.isfoundation && item.isChecked && item.id != selectedRetailerObject.id )|| ProductMethodContextValue == "CREATE" && !item.isfoundation
//              || !selectedRetailerObject.isfoundation && item.id==selectedRetailerObject.id) {
//             retailerSelectedList.push(item.id)
//           }
//           else {
//             if (ProductMethodContextValue == "CREATE") {
//               productSkuUpdateSaveApiRequestObject.retailerId = item.id
//             }
//           }
//         })
//       cloneCurrentProductSku.retailerIdsList = retailerSelectedList;
//       //Call method to clone the current productsku
//       props.cloneProductSkuData(cloneCurrentProductSku)
//       if(isCloneClick){ 
//         getCloneProductSkuAttributesApiRequestObject.productSkuId = result.content.data.id
//         getCloneProductSkuAttributesApiRequestObject.retailerId = retailerId
//         Switchdata(retailerId)
//       }
//       setIsValueChanged(false) 
//       setIsClone(false)
//     }
//   }

//   const productSkuDataResult = (result, type) => {
//     if (type != GETUPDATE && result && result.content && result.content.status != 200) {
//       toastHeading = i18n.t("toastMessage.requestFailed")
//       toastContent = i18n.t("toastMessage.requestFailedMessage")
//       titleBackgroundColor = ERROR_BG_COLOR
//       toastSize = MEDIUM
//       setIsToastMsg(true)
//     }
//     if (result && result.content && result.content.status == 200) {
//       if (type == CREATE) {
//         toastHeading = i18n.t("toastMessage.createdProductSkuToastHeading")
//         toastContent = i18n.t("toastMessage.createdProductSkuContent")        
//         titleBackgroundColor = VALID_BG_COLOR
//         toastSize = MEDIUM
//         setIsToastMsg(true)
//         setIsShowLoader(false)
//         setSpinner(false)
//         setIsApiSuccess(true)
//         cloneAfterSave(result)
//       }
//       if (type == UPDATE) {
//         toastHeading = i18n.t("toastMessage.updateProductSkuToastHeading")
//         toastContent = i18n.t("toastMessage.updatedProductSkuContent")
//         titleBackgroundColor = VALID_BG_COLOR
//         toastSize = MEDIUM
//         setIsToastMsg(true)
//         setIsShowLoader(false)
//         setSpinner(false)
//         if (productSkuUpdateSaveApiRequestObject.cloneRetailerIdList.length > 0 ) {
//           if(!isCloneClick){ setIsApiSuccess(true) }
//           cloneAfterSave(result)
//         }else{
//         if(isCloneClick){ 
//           if(selectedRetailerObject.isfoundation){
//             setUpdateData(undefined)
//             setIsClone(false)
//             props.dropdownvalueData(getApiRequestObject)
//             props.updateGetProductSkuData(getProductSkuAttributesApiRequestObject)
//           }
//           else{
//             getCloneProductSkuAttributesApiRequestObject.productSkuId = selectedProductSku.id
//             getCloneProductSkuAttributesApiRequestObject.retailerId = retailerId
//             Switchdata(retailerId)
//           }
//         }
//         else{
//           setIsApiSuccess(true)
//         }
//       }
//       }
//       if (type == DELETE) {
//         toastHeading = i18n.t("toastMessage.deletedToastHeading")
//         toastContent = i18n.t("toastMessage.deletedProductSkuContent")
//         titleBackgroundColor = VALID_BG_COLOR
//         toastSize = MEDIUM
//         setIsToastMsg(true)
//       }
//     } 
//     else if(type == GETUPDATE && result && result.content && result.content.data.code == 101){
//       toastHeading = i18n.t("toastMessage.requestFailed")
//       toastContent = result.content.data.description
//       titleBackgroundColor = ERROR_BG_COLOR
//       toastSize = MEDIUM
//       setIsToastMsg(true)
//       setShowUpdateToast(true)
//       setSpinner(false)
//     }
//     else if (type != GETUPDATE && result && result.content && result.content.data.code == 101) {
//       toastHeading = i18n.t("toastMessage.requestFailed")
//       if(type==CREATE){
//         toastHeading = i18n.t("toastMessage.createdProductSkuToastHeading")
//       }
//       toastContent = result.content.data.description
//       titleBackgroundColor = ERROR_BG_COLOR
//       toastSize = MEDIUM
//       setIsToastMsg(true)
//       setIsShowLoader(false)
//       setSpinner(false)
//     }
//   }

//   const getSelectedValue = (list, id) => {
//     let selectedListval, selectId = id;
//     list.map(data => {
//       if (data.id == selectId) {
//         selectedListval = data;
//       }
//     })
//     return selectedListval;
//   }

//   const onChangeSelect = (data, id) => {
//     //if(!subBrandLoader){
//     let request = getAssetHierarchyObject
//     let selectedHierarchyObject = hierarchyDropdownObject
//     if (!isValueChanged && changevalue[0].name != "") {
//       setIsValueChanged(true)
//     }
//     setHierarchyLoader(true)

//     if (ProductMethodContextValue == "CREATE") {
//       let finalAssets = {}
//       finalAssets.digitalAssetsDatas = formRef.current.values.digitalAssestsGroup
//       setDigitalAssestsData(finalAssets)
//       setProductSkuAttributeData(formRef.current.values.attributeGroups)
//     }
//     if (data == "Locale") {
//       selectedHierarchyObject.Locale = getSelectedValue(localeList, id)
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       setIsPageInitiated(true)
//       setIsOptionDisabled(true)
//       // setSuperCateLoader(true)
//       // setChildSuperCateLoader(true)
//       // setCateLoader(true)
//       // setChildCateLoader(true)
//       // setSubCateLoader(true)
//       // setChildSubCateLoader(true)
//       // setBrandLoader(true)
//       // setChildBrandLoader(true)
//       setSubBrandLoader(true)

//       requestParams.superCategoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.superCategory]).length > 0 ?
//         [selectedHierarchyObject[hierarchyConstantsMap.superCategory]] : [],

//         props.getSuperCategories(requestParams)
//     }
//     if (data == hierarchyConstantsMap.superCategory) {
//       selectedHierarchyObject[hierarchyConstantsMap.superCategory] = getSelectedValue(formRef.current.values.superCategoryList, id)
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       setIsPageInitiated(false)
//       setIsOptionDisabled(true)
//       // setChildSuperCateLoader(true)
//       // setCateLoader(true)
//       // setChildCateLoader(true)
//       // setSubCateLoader(true)
//       // setChildSubCateLoader(true)
//       // setBrandLoader(true)
//       // setChildBrandLoader(true)
//       setSubBrandLoader(true)
//       requestParams.superCategoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.superCategory]).length > 0 ?
//         [selectedHierarchyObject[hierarchyConstantsMap.superCategory]] : [],
//         requestParams.childSuperCategoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.childSuperCategory]).length > 0 ?
//           [selectedHierarchyObject[hierarchyConstantsMap.childSuperCategory]] : []

//       props.getChildSuperCategories(requestParams)
//     }
//     if (data == hierarchyConstantsMap.childSuperCategory) {
//       selectedHierarchyObject[hierarchyConstantsMap.childSuperCategory] = getSelectedValue(formRef.current.values.childSuperCategoryList, id)
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       setIsPageInitiated(true)
//       setIsOptionDisabled(true)
//       // setCateLoader(true)
//       // setChildCateLoader(true)
//       // setSubCateLoader(true)
//       // setChildSubCateLoader(true)
//       // setBrandLoader(true)
//       // setChildBrandLoader(true)
//       setSubBrandLoader(true)
//       requestParams.superCategoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.superCategory]).length > 0 ?
//         [selectedHierarchyObject[hierarchyConstantsMap.superCategory]] : [],
//         requestParams.childSuperCategoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.childSuperCategory]).length > 0 ?
//           [selectedHierarchyObject[hierarchyConstantsMap.childSuperCategory]] : [],
//         requestParams.categoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.category]).length > 0 ?
//           [selectedHierarchyObject[hierarchyConstantsMap.category]] : [],
//         props.getCategories(requestParams)
//     }
//     if (data == hierarchyConstantsMap.category) {
//       selectedHierarchyObject[hierarchyConstantsMap.category] = getSelectedValue(formRef.current.values.categoryList, id)
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       setIsPageInitiated(false)
//       setIsOptionDisabled(true)
//       // setChildCateLoader(true)
//       // setSubCateLoader(true)
//       // setChildSubCateLoader(true)
//       // setBrandLoader(true)
//       // setChildBrandLoader(true)
//       setSubBrandLoader(true)
//       requestParams.superCategoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.superCategory]).length > 0 ?
//         [selectedHierarchyObject[hierarchyConstantsMap.superCategory]] : [],
//         requestParams.childSuperCategoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.childSuperCategory]).length > 0 ?
//           [selectedHierarchyObject[hierarchyConstantsMap.childSuperCategory]] : [],
//         requestParams.categoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.category]).length > 0 ?
//           [selectedHierarchyObject[hierarchyConstantsMap.category]] : [],
//         requestParams.childCategoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.childCategory]).length > 0 ?
//           [selectedHierarchyObject[hierarchyConstantsMap.childCategory]] : [],
//         props.getChildCategories(requestParams)
//     }
//     if (data == hierarchyConstantsMap.childCategory) {
//       selectedHierarchyObject[hierarchyConstantsMap.childCategory] = getSelectedValue(formRef.current.values.childCategoryList, id)
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       setIsPageInitiated(true)
//       setIsOptionDisabled(true)
//       // setSubCateLoader(true)
//       // setChildSubCateLoader(true)
//       // setBrandLoader(true)
//       // setChildBrandLoader(true)
//       setSubBrandLoader(true)
//       requestParams.categoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.category]).length > 0 ?
//         [selectedHierarchyObject[hierarchyConstantsMap.category]] : [],
//         requestParams.childCategoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.childCategory]).length > 0 ?
//           [selectedHierarchyObject[hierarchyConstantsMap.childCategory]] : [],
//         requestParams.subCategoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.subCategory]).length > 0 ?
//           [selectedHierarchyObject[hierarchyConstantsMap.subCategory]] : [],
//         props.getSubCategories(requestParams)
//     }
//     if (data == hierarchyConstantsMap.subCategory) {
//       selectedHierarchyObject[hierarchyConstantsMap.subCategory] = getSelectedValue(formRef.current.values.subCategoryList, id)
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       setIsPageInitiated(false)
//       setIsOptionDisabled(true)
//       // setChildSubCateLoader(true)
//       // setBrandLoader(true)
//       // setChildBrandLoader(true)
//       setSubBrandLoader(true)
//       requestParams.childCategoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.childCategory]).length > 0 ?
//         [selectedHierarchyObject[hierarchyConstantsMap.childCategory]] : [],
//         requestParams.subCategoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.subCategory]).length > 0 ?
//           [selectedHierarchyObject[hierarchyConstantsMap.subCategory]] : [],
//         requestParams.childSubCategoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.childSubCategory]).length > 0 ?
//           [selectedHierarchyObject[hierarchyConstantsMap.childSubCategory]] : [],
//         props.getChildSubCategories(requestParams)
//     }
//     if (data == hierarchyConstantsMap.childSubCategory) {
//       selectedHierarchyObject[hierarchyConstantsMap.childSubCategory] = getSelectedValue(formRef.current.values.childSubCategoryList, id)
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       setIsPageInitiated(true)
//       setIsOptionDisabled(true)
//       // setBrandLoader(true)
//       // setChildBrandLoader(true)
//       setSubBrandLoader(true)

//       requestParams.childSubCategoryList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.childSubCategory]).length > 0 ?
//         [selectedHierarchyObject[hierarchyConstantsMap.childSubCategory]] : [],
//         requestParams.brandList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.brand]).length > 0 ?
//           [selectedHierarchyObject[hierarchyConstantsMap.brand]] : [],
//         props.getBrands(requestParams)
//     }
//     if (data == hierarchyConstantsMap.brand) {
//       selectedHierarchyObject[hierarchyConstantsMap.brand] = getSelectedValue(formRef.current.values.brandList, id)
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       setIsPageInitiated(false)
//       setIsOptionDisabled(true)
//       // setChildBrandLoader(true)
//       setSubBrandLoader(true)
//       requestParams.brandList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.brand]).length > 0 ?
//         [selectedHierarchyObject[hierarchyConstantsMap.brand]] : [],
//         requestParams.subFamilyList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.childBrand]).length > 0 ?
//           [selectedHierarchyObject[hierarchyConstantsMap.childBrand]] : [],
//         props.getChildBrands(requestParams)
//     }
//     if (data == hierarchyConstantsMap.childBrand) {
//       selectedHierarchyObject[hierarchyConstantsMap.childBrand] = getSelectedValue(formRef.current.values.childBrandList, id)
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       setIsPageInitiated(true)
//       setIsOptionDisabled(true)
//       setSubBrandLoader(true)
//       requestParams.brandList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.brand]).length > 0 ?
//         [selectedHierarchyObject[hierarchyConstantsMap.brand]] : [],
//         requestParams.subFamilyList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.childBrand]).length > 0 ?
//           [selectedHierarchyObject[hierarchyConstantsMap.childBrand]] : [],
//         requestParams.subBrandList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.subBrand]).length > 0 ?
//           [selectedHierarchyObject[hierarchyConstantsMap.subBrand]] : [],
//         props.getSubBrands(requestParams)
//     }
//     if (data == hierarchyConstantsMap.subBrand) {
//       selectedHierarchyObject[hierarchyConstantsMap.subBrand] = getSelectedValue(formRef.current.values.subBrandList, id)
//       setHierarchyDropdownSelected(selectedHierarchyObject)
//       requestParams.subFamilyList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.childBrand]).length > 0 ?
//         [selectedHierarchyObject[hierarchyConstantsMap.childBrand]] : [],
//         requestParams.subBrandList = Object.keys(selectedHierarchyObject[hierarchyConstantsMap.subBrand]).length > 0 ?
//           [selectedHierarchyObject[hierarchyConstantsMap.subBrand]] : [],
//         props.getSubBrands(requestParams)
//     }
//   }

//   const handleToastHide = () => {
//     setIsToastMsg(false)
//     setIsFormReinitialize(false)
//     if (isApiSuccess) {
//       reDirectToSkulist()
//     }
//   }

//   const reDirectToSkulist = () => {
//     if (props.history.location.state && props.history.location.state.guid) {
//       const data = {
//         key: props.history.location.state.path
//       }
//       let path = props.history.location.state.path
//       props.history.location.state = {
//         guid: props.history.location.state.guid
//       }
//       props.history.push({
//         pathname: "/" + path, state: {
//           guid: props.history.location.state.guid
//         }
//       })
//       props.triggerPageLayout(data)
//     } else {
//       changevalue = [{ name: "", value: "" }]
//       const data = {
//         key: "skulist",
//       }
//       props.history.push("/skulist")
//       props.triggerPageLayout(data)
//     }
//   }

//   const reDirectToAssetlist = (name, type) => {
//     assetName = name
//     selectedAssetType = type
//     setProductSkuUploadedImageName(assetName)
//     getassetsid()
//     if (ProductMethodContextValue == "CREATE") {
//       setProductSkuAttributeData(formRef.current.values.attributeGroups)
//     }
//     window.scrollTo({ top: 0, behavior: "smooth" })
//     stepWizard.goToStep(2)
//   }
 
//   const createFieldArrayJsonDigitalassets = (data) => {
//     initialValues.productskuAssets = data
//   }

//   const createFieldArrayJson = (data) => {
//     data
//       ? Object.entries(data[0]).map((Group, index) => {         
//         Object.entries(Group[1]).map((attributeskey, index2) => {
//           let checkAttributeGroup =
//             initialValues.productSkuAttributeGroups.filter(
//               (obj,idx) => obj.attributeGroupName === Group[0]
//             )
//           if (
//             attributeskey[1].AttributeName != "Unique Identifier" &&
//             attributeskey[1].Type != "IMAGE" &&
//             attributeskey[1].Type != "VIDEO" &&
//             attributeskey[1].Type != "DOCUMENT"
//           ) {
//              if (checkAttributeGroup.length) {
//               if (initialValues.productSkuAttributeGroups[0].attributeGroupName == i18n.t("productSkulist.name")
//               ) { 
//                 initialValues.productSkuAttributeGroups.splice(0,1) } 
//               let checkAttributesValue =
//               checkAttributeGroup[0].attributes.filter(
//               (obj) => obj.attributeName === attributeskey[1].AttributeName
//             )
//             checkAttributesValue[0].value=attributeskey[1].Value
//             } 
//           }
//         })
//       })
//       : null
//   }

//   const validateProductSkuAttributes = (values) => {
//     let errors,checkvalues = values!=undefined?values.trim():values
//     if (!checkvalues) {
//       errors = i18n.t("validationMessage.fieldIsRequired")
//     }
//     if (checkvalues&& checkvalues.length > 5000) {
//       errors = i18n.t("validationMessage.productAttributeSizeisRequired")
//     }
//     return errors
//   }

//   const renderUpload = (name,type) => {
//     return (
//       <div className="upload-holder">
//         <div
//           className="upload-section"
//           tabindex="0"
//           onClick={() => reDirectToAssetlist(name,type)}
//           role="button"
//           data-tooltip="Set contact photo"
//           aria-label="Set contact photo"
//         >          
//         </div>
//       </div>
//     )
//   }

//   const hideShowLoader = () => {
//     setIsShowLoader(false)
//   }
//   const hideUpdateToast = () => {
//     if (props.history.location.state && props.history.location.state.guid) {
//       const data = {
//         key: props.history.location.state.path
//       }
//       let path = props.history.location.state.path
//       props.history.location.state = {
//         guid: props.history.location.state.guid
//       }
//       props.history.push({
//         pathname: "/" + path, state: {
//           guid: props.history.location.state.guid
//         }
//       })
//       props.triggerPageLayout(data)
//     } else {
//       setShowUpdateToast(false)
//       const data = {
//         key: "skulist",
//       }
//       props.history.push("/skulist")
//       props.triggerPageLayout(data)
//     }
//   }
//   const handleBlurGtin = (e, values) => {
//     if (!isValueChanged) {
//       setIsValueChanged(true)
//     }
//     // 
//     if (ProductMethodContextValue == "CREATE") {
//       setGtin(e.target.value)
//       let finalassets = { "digitalAssetsDatas": [] }
//       let digitalassetsdataresult = values.digitalAssestsGroup && values.digitalAssestsGroup.length > 0 ? values.digitalAssestsGroup : null
//       if (digitalAssestsData && digitalAssestsData.length > 0 && digitalassetsdataresult == null) {
//         digitalassetsdataresult = digitalAssestsData
//       }
//       finalassets.digitalAssetsDatas = digitalassetsdataresult
//       if (digitalassetsdataresult == null) {
//         setDigitalAssestsData(digitalassetsdataresult)
//       }
//       else {
//         setDigitalAssestsData(finalassets)
//       }
//       setProductSkuAttributeData(formRef.current.values.attributeGroups)
//     }
//     else {
//       setFieldsValue("GTINTextbox", e.target.value)
//     }
//   }
//   const handleBlurProductName = (e, values) => {
//     if (!isValueChanged) {
//       setIsValueChanged(true)
//     }
//     if (ProductMethodContextValue == "CREATE") {
//       setProductName(e.target.value)
//       let finalassets = { "digitalAssetsDatas": [] }
//       let digitalassetsdataresult = values.digitalAssestsGroup && values.digitalAssestsGroup.length > 0 ? values.digitalAssestsGroup : null

//       if (digitalAssestsData && digitalAssestsData.length > 0 && digitalassetsdataresult == null) {
//         digitalassetsdataresult = digitalAssestsData
//       }
//       finalassets.digitalAssetsDatas = digitalassetsdataresult
//       if (digitalassetsdataresult == null) {
//         setDigitalAssestsData(digitalassetsdataresult)
//       }
//       else {
//         setDigitalAssestsData(finalassets)
//       }
//       setProductSkuAttributeData(formRef.current.values.attributeGroups)
//     }
//     else {
//       setFieldsValue("productNameTextbox", e.target.value)
//     }

//   }

//   const handleBlurattribute = (e,values)=>{
//     if(!isValueChanged){
//       setIsValueChanged(true)
//     }
//   }

//   const renderEnhancedContentTile = (errors, values,setFieldsValue) => {
//     return (
//       <div id="heroImageGroup">
//         <Card className="image-box-tile-style">
//           <Card.Body
//             className={
//               isEditProductName ? "productname-disable" : "productname-enable"
//             }
//           >
//             <React.Fragment>
//             <div className="row col-12 product-details-container">
//                 <div className="col-2 hero-img">
//                   <div className="tile-content-img">
//                     <div className="upload-image">
//                       {
//                         <>
//                           {values.heroImageGroup && values.heroImageGroup[0] && values.heroImageGroup[0].AssetsID != "" && values.heroImageGroup[0].AssetsID != null ?
//                             <Image className={`${ProductMethodContextValue == "CREATE" ? "card-img-style addnew-image" : "card-img-style"}`} src={
//                               values.heroImageGroup && values.heroImageGroup[0]
//                                 ? values.heroImageGroup[0].AssetsUrl
//                                 : ""
//                             } alt="Image" preview />
//                             :
//                             <img
//                               className={`${ProductMethodContextValue == "CREATE" ? "card-img-style addnew-image" : "card-img-style"}`}
//                               onError={(e) => {
//                                 e.target.src = PREVIEW
//                               }}
//                               src={
//                                 values.heroImageGroup && values.heroImageGroup[0]
//                                   ? values.heroImageGroup[0].AssetsUrl
//                                   : ""
//                               }
//                             />
//                           }

//                           {heroId ? null : (
//                             <div className="errorMsg">
//                               <ErrorMessage name="heroImageGroup.0.AssetsID" />
//                             </div>
//                           )}
//                         </>
//                       }

//                     </div>
//                     {!isEditProductName ? renderUpload("heroImageGroup[0]", "IMAGE") : null}
//                   </div>
//                 </div>
//              <div className="row col-10">
//               <div className="col-6 align-textbox">
//                 <div className="col-md-12 col-xl-12 col:12">
//                   <div className="attributeLabel required" htmlFor="inputtext">
//                    {i18n.t("productSkulist.ProductName")}
//                   </div>
//                   <Field
//                     className="p-inputtext product-textbox attribute-inputtext"
//                     autocomplete="off"
//                     disabled={subBrandLoader}
//                     style={getStyles(errors, "productNameTextbox")}
//                     onBlur={(e) => { handleBlurProductName(e, values) }}
//                     name="productNameTextbox"
//                   />
//                   <div className="errorMsg">
//                     <ErrorMessage name="productNameTextbox" />
//                   </div>
//                 </div>
               
//               </div>
           
//             <div className="col-6 align-textbox">
//               <div className="col-md-12 col-xl-12 col:12">
//                 <div className="attributeLabel required" htmlFor="inputtext">
//                   {i18n.t("productSkulist.GTIN")}
//                 </div>
//                 <Field
//                   className="p-inputtext product-textbox attribute-inputtext"
//                   autocomplete="off"
//                   disabled={ProductMethodContextValue == "CREATE" ? subBrandLoader : true}
//                   onBlur={(e) => {
//                     handleBlurGtin(e, values)
//                   }}
//                   style={getStyles(errors, "GTINTextbox")}
//                   name="GTINTextbox"
//                 />
//                 <div className="errorMsg">
//                   <ErrorMessage name="GTINTextbox" />
//                 </div>
//               </div>
           
//             </div>
          
//             <div className="col-6">
//             <div className="col-md-12 col-xl-12 col:12 delist-section">
//                       <div className="card flex switch17-btn justify-content-center">
//                         <div className="flex flex-wrap gap-3">
//                           <div className="flex align-items-center">
//                             <RadioButton inputId="ingredient1" name="pizza" disabled value="Delisted"  onChange={(e) => setIsInputChecked(e.value)} checked={isInputchecked === 'Delisted'} />
//                             <label htmlFor="ingredient1" className="radio-lable17">Delisted</label>
//                           </div>
//                           <div className="flex align-items-center">
//                             <RadioButton inputId="ingredient2" name="pizza" value="Markedfordelist" onChange={(e) => setIsInputChecked(e.value)} checked={isInputchecked === 'Markedfordelist'} />
//                             <label htmlFor="ingredient2" className="radio-lable17">Marked for delist</label>
//                           </div>
//                           <div className="flex align-items-center">
//                             <RadioButton inputId="ingredient3" name="pizza" value="Active" onChange={(e) => setIsInputChecked(e.value)} checked={isInputchecked === 'Active'} />
//                             <label htmlFor="ingredient3" className="radio-lable17">Active</label>
//                           </div>
//                         </div>
//                       </div>
//                 </div>
//             </div>
            
//             </div>
//             </div>
//             </React.Fragment>
//             {/* <ExpandCollapse */}
//             <>
//               <FieldArray name={`digitalAssestsGroup`}>
//                 {(assetsArray) => (values.digitalAssestsGroup && values.digitalAssestsGroup.length > 1 ||
//                   values.digitalAssestsGroup && values.digitalAssestsGroup.length == 1 && values.digitalAssestsGroup && values.digitalAssestsGroup[0].AttributeName != i18n.t("productSkulist.mainimageURL")
//                   || !isEditProductName ?
//                   <div id="digitalAssestsGroup" className="row assets-holder-parent">
//                     {
//                       values.digitalAssestsGroup &&
//                       values.digitalAssestsGroup.length > 0 &&
//                       values.digitalAssestsGroup.map((digitalassestsdatas, index1) => {
//                         if (digitalassestsdatas.AttributeName != i18n.t("productSkulist.mainimageURL")) {
//                           let Assetsurls = digitalassestsdatas.AssetsUrl
//                           if (Assetsurls != undefined && Assetsurls != null) {
//                             let url = Assetsurls.substr(Assetsurls.lastIndexOf("."))
//                             if (url == ".mp4" || url == ".ogg" || url == ".webm") {
//                               assetUrl = VIDEO_PREVIEW
//                             } else if (url == ".pdf") {
//                               assetUrl = PDF_PREVIEW
//                             }
//                             else {
//                               assetUrl = Assetsurls
//                             }
//                           }
//                           if (
//                             values.derivedAssetOptions.filter((element) => element && element.label == digitalassestsdatas.AttributeName).length > 0
//                           ) {
//                             let assetsDerived =
//                               values.derivedAssetOptions.filter((element) => element && element.label !== digitalassestsdatas.AttributeName)
//                             setFieldsValue("derivedAssetOptions", assetsDerived)
//                           }
//                           return (
//                             <>
//                               {
//                                 <div className="thumbnail" >
//                                   <span title={digitalassestsdatas.AttributeName}> {digitalassestsdatas.AttributeName} </span>
//                                   <div className="assets-holder">
//                                     {!isEditProductName ? (
//                                       <span
//                                         className="assets-remove"
//                                         type="button"
//                                         onClick={() => {

//                                           if (
//                                             values.derivedAssetOptions.filter((el) => el && el.label == digitalassestsdatas.AttributeName).length == 0
//                                           ) {
//                                             let totalAssets =
//                                               assetsOptionObj.totalOptions
//                                             let derivedAssetValues =
//                                               values.derivedAssetOptions.map(
//                                                 (i) => {
//                                                   return i
//                                                 }
//                                               )
//                                             derivedAssetValues.push(
//                                               totalAssetOptions.find(
//                                                 (el) =>
//                                                   el && el.label ==
//                                                   digitalassestsdatas.AttributeName
//                                               )
//                                             )
//                                             if (!isValueChanged) {
//                                               setIsValueChanged(true)
//                                             }
//                                             if (ProductMethodContextValue == "CREATE") {
//                                               setDigitalAssestsData(digitalAssestsData)
//                                             }
//                                             setFieldsValue("derivedAssetOptions", derivedAssetValues)
//                                           }
//                                           lastfunction = "remove"
//                                           assetsArray.remove(index1)
//                                         }}
//                                       >
//                                         <span className="fa fa-close"></span>
//                                       </span>
//                                     ) : null}


//                                     {digitalassestsdatas.AttributeType == "IMAGE" && assetUrl != "" ?
//                                       <Image src={assetUrl} onError={(e) => {
//                                         e.target.src =
//                                           PREVIEW
//                                       }} alt="Image" preview /> : <img
//                                         src={assetUrl}
//                                         onError={(e) => {
//                                           e.target.src =
//                                             PREVIEW
//                                         }}
//                                       />
//                                     }
//                                     {!isEditProductName
//                                       ? renderUpload(
//                                         `digitalAssestsGroup.${index1}`, digitalassestsdatas.AttributeType
//                                       )
//                                       : null}
//                                     <div className="errorMsg">
//                                       <ErrorMessage
//                                         name={`digitalAssestsGroup.${index1}.AssetsID`}
//                                       />
//                                     </div>
//                                   </div>

//                                 </div>


//                               }
//                             </>
//                           )
//                         }
//                       }
//                       )}
//                     {
//                       <>
//                         {!isEditProductName ? <div className="addnew-asset"
//                           onClick={() => {
//                             setIsAddAssetDialog(true)
//                             if (ProductMethodContextValue == "CREATE") {
//                               let finalassets = { "digitalAssetsDatas": [] }
//                               let digitalassetsdataresult = formRef.current.values.digitalAssestsGroup && formRef.current.values.digitalAssestsGroup.length > 0 ? formRef.current.values.digitalAssestsGroup : null
//                               if (digitalAssestsData && digitalAssestsData.length > 0) {
//                                 digitalassetsdataresult = digitalAssestsData
//                               }
//                               finalassets.digitalAssetsDatas = digitalassetsdataresult
//                               if (digitalassetsdataresult == null) {
//                                 setDigitalAssestsData(digitalassetsdataresult)
//                               }
//                               else {
//                                 setDigitalAssestsData(finalassets)
//                               }
//                             }
//                           }
//                           }>
//                           <img src={ADDNEWASSETS} />
//                         </div> : null}

//                         {
//                           renderAssetOption(values, assetsArray)
//                         }
//                       </>
//                     }
//                   </div> : null
//                 )}
//               </FieldArray>
//             </>
//           </Card.Body>
//         </Card>
//       </div>
//     )
//   }  

//   const renderAssetOption = (values, assetArray1) => {
//     return (
//       <ModalComponent
//         isShowModal={isAddAssetDialog}
//         onHideModal={hideAddAssetDialog}
//         modalTitle={"Add New Asset"}
//         modalContent={
//           <div className="col-12 asset-dropdown">
//             <div className="col-12">
//               <Select
//                 className="attribute-dropdown productsku-dropdown"
//                 placeholder="Select Assetname"
//                 styles={optionStyles}
//                 menuPlacement="auto"
//                 value={null}
//                 isDisabled={subBrandLoader}
//                 options={values.derivedAssetOptions}
//                 controlShouldRenderValue={false}
//                 multi={false}
//                 onChange={(event) => {
//                   addAssetsChange(
//                     event,
//                     assetArray1,
//                     values
//                   )
//                 }}
//                 isSearchable={true}
//                 classNamePrefix="pim-dropdown"
//               />
//             </div>
//           </div>

//         }
//         modalSize="md"
//         modalDailogClassName="modalDailogContent smallDialog"
//       // modalFooter={CloneFooterbtns}
//       />
//     )
//   }

//   // Final save Retailer List Checkbox Click Event
//   const handleChangecheckbox = (e) => {
//     let itemName = e.target.name;
//     let checked = e.target.checked;
//     let selectedRetailerDatalist, allCheckedlist
//     if (itemName === "checkAll") {
//       allCheckedlist = checked;
//       selectedRetailerDatalist = selectedRetailerData.map(item => {
//         return { ...item, isChecked: checked }
//       });
//     }
//     else {
//       selectedRetailerDatalist = selectedRetailerData.map(item =>
//         item.retailerName === itemName ? { ...item, isChecked: checked } : item
//       )
//       selectedRetailerDatalist.map((selectlist, index) => {
//         if (selectlist.isfoundation || retailerId == selectlist.id) {
//           selectedRetailerDatalist.splice(index, 1)
//         }
//       })
//       allCheckedlist = selectedRetailerDatalist.every(item => item.isChecked)
//     }

//     setSelectedRetailerData(selectedRetailerDatalist)
//     setallChecked(allCheckedlist)

//   }

//   const renderRetailerList = () => {
//     return selectedRetailerData &&
//       selectedRetailerData.length &&
//       selectedRetailerData.map((item, index) => {
//         if (!item.isfoundation && retailerId !=item.id) {
//           //if(retailerId==item.id){item.isChecked = true}
//           return (
//             <div>
//               <label className="list-label">
//                 <input
//                   className="list-checkbox"
//                   key={item.id}
//                   type="checkbox"
//                   name={item.retailerName}
//                   value={item.retailerName}
//                   checked={item.isChecked}
//                   onChange={handleChangecheckbox}
//                 />
//                 {item.retailerName}</label>
//             </div>
//           )
//         }
//       })
//   }

//   const retailerTemplate = () => {
//     return (
//       <>
//         <div className="retailer-content"><img className="alert-circle" src={ALERTCIRCLE} />
//           <span>
//             {ProductMethodContextValue == "UPDATE" ? i18n.t("productSkuPopupHeaders.finalsaveretailercontentforupdate") : i18n.t("productSkuPopupHeaders.finalsaveretailercontentforcreate")}
//           </span>
//         </div>
//         <div className="list-holder-17">
//           <div>
//             <label className="list-label">
//               <input
//                 className="list-checkbox"
//                 type="checkbox"
//                 name="checkAll"
//                 checked={allChecked}
//                 onChange={handleChangecheckbox}
//               />
//               Check all
//             </label>
//           </div>
//           {renderRetailerList()}
//         </div>
//       </>
//     )
//   }

//   // Enable and Disable Textbox Function
//   const handleClick = (value, event) => {
//     if (value != undefined && value != "") {
//       const enableTextBox = value.attributeGroupName    
//     }
//   }

//   // Assets dropdown change 
//   const addAssetsChange = (assets, assetsFieldArray, values) => {
//     assetsFieldArray && assetsFieldArray.push({
//       AssetsID: "",
//       AttributeID: assets && assets.value,
//       AttributeType: assets && assets.type,
//       AssetsUrl: "",
//       AttributeName: assets && assets.label,
//     })
//     assetAttributeId = assets.value
//     selectedAssetType = assets.type
//     assetAttributeLabel = assets.label
//     reDirectToAssetlist(`digitalAssestsGroup.${values.digitalAssestsGroup.length}`, assets.type)
//     lastfunction = "add"
//     setIsAddAssetDialog(false)
//     if (!isValueChanged) {
//       setIsValueChanged(true)
//     }
//   }

//   const getProductStatus = (radioButtonStatus) => {
//     let inputResult = ""
//     if(radioButtonStatus == "Active"){
//       inputResult =  "ACTIVE"
//     }
//     else if (radioButtonStatus == "Markedfordelist"){
//       inputResult = "MARKEDFORDELISTING"
//     }
//     else{
//       inputResult =  "DELISTED"
//     }
//     return inputResult;
//   } 

//   const saveFormikData = (values,errors) => {
//     const updateProductSkuAttributes = {}
//     let uniqueColumnsObj = {},
//       mandatoryColumnsObj = {},
//       digital_assets = {},
//       productskuStatusObj = {}
//     mandatoryColumnsObj["Product Name"] = values.productNameTextbox.trim()
//     productSkuUpdateSaveApiRequestObject.productName = values.productNameTextbox.trim()
//     productSkuUpdateSaveApiRequestObject.productNameSearch = values.productNameTextbox.trim().toLowerCase()
//     // mandatoryColumnsObj["productNameSearchKey"]=values.productNameTextbox.trim().toLowerCase()
//     Object.values(values.attributeGroups).map((attrvalues) => {
//       attrvalues.attributes.map((key) => {
//         let keyValue = key.value
//         if(key.value.toString().trim()!=""){
//         Object.assign(updateProductSkuAttributes, { [key.id]: key.value.toString().trim() })
//         }
//         if (key.required)
//           Object.assign(mandatoryColumnsObj, { [key.attributeName]: key.value.toString().trim() })

//         if (
//           (key.attributeName == hierarchyConstantsMap.superCategory && mandatoryColumnList.includes(hierarchyConstantsMap.superCategory)) ||
//           (key.attributeName == hierarchyConstantsMap.childSuperCategory && mandatoryColumnList.includes(hierarchyConstantsMap.childSuperCategory)) ||
//           (key.attributeName == hierarchyConstantsMap.category && mandatoryColumnList.includes(hierarchyConstantsMap.category)) ||
//           (key.attributeName == hierarchyConstantsMap.childCategory && mandatoryColumnList.includes(hierarchyConstantsMap.childCategory)) ||
//           (key.attributeName == hierarchyConstantsMap.subCategory && mandatoryColumnList.includes(hierarchyConstantsMap.subCategory)) ||
//           (key.attributeName == "Locale" && mandatoryColumnList.includes("Locale")) ||
//           (key.attributeName == hierarchyConstantsMap.childSubCategory && mandatoryColumnList.includes(hierarchyConstantsMap.childSubCategory)) ||
//           (key.attributeName == hierarchyConstantsMap.brand && mandatoryColumnList.includes(hierarchyConstantsMap.brand)) ||
//           (key.attributeName == hierarchyConstantsMap.childBrand && mandatoryColumnList.includes(hierarchyConstantsMap.childBrand)) ||
//           (key.attributeName == hierarchyConstantsMap.subBrand && mandatoryColumnList.includes(hierarchyConstantsMap.subBrand))
//         ) {
//           keyValue = values[key.attributeName].name
//           Object.assign(updateProductSkuAttributes, { [key.id]: keyValue.trim() })
//           Object.assign(mandatoryColumnsObj, { [key.attributeName]: keyValue.trim() })
//           if (key.attributeName == hierarchyConstantsMap.superCategory) {
//             productSkuUpdateSaveApiRequestObject.superCategoryId =
//               values[key.attributeName].id
//               key.value= values[key.attributeName].id
//           } else if (key.attributeName == hierarchyConstantsMap.childSuperCategory) {
//             productSkuUpdateSaveApiRequestObject.childSuperCategoryId =
//               values[key.attributeName].id
//               key.value= values[key.attributeName].id
//           } else if (key.attributeName == hierarchyConstantsMap.category) {
//             productSkuUpdateSaveApiRequestObject.categoryId =
//               values[key.attributeName].id
//               key.value= values[key.attributeName].id
//           } else if (key.attributeName == hierarchyConstantsMap.childCategory) {
//             productSkuUpdateSaveApiRequestObject.childCategoryId =
//               values[key.attributeName].id
//               key.value= values[key.attributeName].id
//           } else if (key.attributeName == hierarchyConstantsMap.subCategory) {
//             productSkuUpdateSaveApiRequestObject.subCategoryId =
//               values[key.attributeName].id
//               key.value= values[key.attributeName].id
//           } else if (key.attributeName == hierarchyConstantsMap.childSubCategory) {
//             productSkuUpdateSaveApiRequestObject.childSubCategoryId =
//               values[key.attributeName].id
//               key.value= values[key.attributeName].id
//           } else if (key.attributeName == hierarchyConstantsMap.brand) {
//             productSkuUpdateSaveApiRequestObject.brandId =
//               values[key.attributeName].id
//               key.value= values[key.attributeName].id
//           } else if (key.attributeName == hierarchyConstantsMap.childBrand) {
//             productSkuUpdateSaveApiRequestObject.childBrandId =
//               values[key.attributeName].id
//               key.value= values[key.attributeName].id
//           } else if (key.attributeName == hierarchyConstantsMap.subBrand) {
//             productSkuUpdateSaveApiRequestObject.subBrandId =
//               values[key.attributeName].id
//               key.value= values[key.attributeName].id
//           } else {
//             if (key.attributeName == "Locale") {
//               mandatoryColumnsObj[key.attributeName] = keyValue.trim()
//               productSkuUpdateSaveApiRequestObject.Locale = keyValue.trim()
//               productSkuUpdateSaveApiRequestObject.localeId =
//                 values[key.attributeName].id
//                 key.value= values[key.attributeName].id
//             }
//           }
//         }
//       })
//     })

//     Object.assign(updateProductSkuAttributes, { [productGTINKey]: values.GTINTextbox.trim() })
//     Object.assign(updateProductSkuAttributes, { [productnameKey]: values.productNameTextbox.trim() })

//     // SetValue not visible hierarchy dropdown
//     Object.keys(organizationSpec).map(data=>{
//     if(data == "superCategory" && 
//     Object.keys(superCateSelect).length >1 &&
//      superCateSelect.name=="All" ){
//       productSkuUpdateSaveApiRequestObject.superCategoryId = superCateSelect.id
//     }
//     else if(data == "childSuperCategory" && 
//     Object.keys(childSuperCateSelect).length >1 &&
//     childSuperCateSelect.name=="All"  ){
//       productSkuUpdateSaveApiRequestObject.childSuperCategoryId = childSuperCateSelect.id
//     }
//     else if(data == "category" && 
//     Object.keys(cateSelect).length >1 &&
//     cateSelect.name=="All"  ){
//       productSkuUpdateSaveApiRequestObject.categoryId = cateSelect.id
//     }
//     else if(data == "childCategory" && 
//     Object.keys(childCateSelect).length >1 &&
//     childCateSelect.name=="All"  ){
//       productSkuUpdateSaveApiRequestObject.childCategoryId = childCateSelect.id
//     }
//     else if(data == "subCategory" && 
//     Object.keys(subCateSelect).length >1 &&
//     subCateSelect.name=="All"  ){
//       productSkuUpdateSaveApiRequestObject.subCategoryId = subCateSelect.id
//     }
//     else if(data == "childSubCategory" && 
//     Object.keys(childSubCateSelect).length >1 &&
//     childSubCateSelect.name=="All"  ){
//       productSkuUpdateSaveApiRequestObject.childSubCategoryId = childSubCateSelect.id
//     }

//     else if(data == "brand" && 
//     Object.keys(brandSelect).length >1 &&
//     brandSelect.name=="All"  ){
//       productSkuUpdateSaveApiRequestObject.brandId = brandSelect.id
//     }
//      else if(data == "childBrand" && 
//      Object.keys(childBrandSelect).length >1 &&
//      childBrandSelect.name=="All"  ){
//       productSkuUpdateSaveApiRequestObject.childBrandId =childBrandSelect.id
//     }
//     else{
//       if(data=="subBrand" && 
//       Object.keys(subBrandSelect).length >1 &&
//       subBrandSelect.name=="All" || Object.keys(subBrandSelect).length >1 && subBrandSelect.name == "Sku Type" ){
//         productSkuUpdateSaveApiRequestObject.subBrandId =subBrandSelect.id
//       }
//     }
//     })

//     //Add Hero Image
//     if (ProductMethodContextValue == "UPDATE") {
//       Object.assign(digital_assets, {
//         [values.heroImageGroup[0].AttributeID]:
//           values.heroImageGroup[0].AssetsID,
//       })
//     } else {
//       let heroImageAttributeID = heroImageDetails[i18n.t("productSkulist.mainimageURL")]
//       Object.assign(digital_assets, {
//         [heroImageAttributeID]: values.heroImageGroup[0].AssetsID,
//       })
//       setProductSkuAttributeData(values.attributeGroups)
//       setHierarchyDropdownSelected(hierarchyDropdownSelected)
//       setLocaleSelect(values.Locale)
//       setLocaleList(localeList)
//       setSuperCateSelect(values[organizationSpec.superCategory])
//       setSuperCategoryList(superCategoryList)
//       setChildSuperCateSelect(values[organizationSpec.childSuperCategory])
//       setChildSuperCategoryList(childSuperCategoryList)
//       setCateSelect(values[organizationSpec.category])
//       setCategoryList(categoryList)
//       setChildCateSelect(values[organizationSpec.childCategory])
//       setChildCategoryList(childCategoryList)
//       setSubCateSelect(values[organizationSpec.subCategory])
//       setSubCategoryList(subCategoryList)
//       setChildSubCateSelect(values[organizationSpec.childSubCategory])
//       setChildSubCategoryList(childSubCategoryList)
//       setbrandSelect(values[organizationSpec.brand])
//       setBrandList(brandList)
//       setchildBrandSelect(values[organizationSpec.childBrand])
//       setChildBrandList(childBrandList)
//       setSubBrandSelect(values[organizationSpec.subBrand])
//       setSubBrandList(subBrandList)
//     }

//     values.digitalAssestsGroup &&
//       values.digitalAssestsGroup.map((asset, index) => {
//         if (
//           values.digitalAssestsGroup.length == 1 &&
//           asset.AttributeName == i18n.t("productSkulist.mainimageURL")
//         ) {
//           Object.assign(digital_assets, {
//             [values.heroImageGroup[0].AttributeID]:
//               values.heroImageGroup[0].AssetsID,
//           })
//           Object.assign(updateProductSkuAttributes, {[values.heroImageGroup[0].AttributeID]: values.heroImageGroup[0].AssetsUrl })
//         } else {
//           Object.assign(digital_assets, {[asset.AttributeID]: asset.AssetsID })
//           Object.assign(updateProductSkuAttributes, {[asset.AttributeID]: asset.AssetsUrl })
//         }
//       })

//       let assetIdList=[]
//       Object.keys(digital_assets).map((assetlist,index)=>{
//         assetIdList.push(digital_assets[assetlist])
//       })
//       productSkuUpdateSaveApiRequestObject.mainImageUrl =  values.heroImageGroup[0].AssetsUrl
//       productSkuUpdateSaveApiRequestObject.assetIds = assetIdList.toString()
//       productSkuUpdateSaveApiRequestObject.uniqueIdentifier = values.GTINTextbox.trim()
//       productSkuUpdateSaveApiRequestObject.pimerceOrgId = getFilterDataValue.organization.id  

//       productSkuUpdateSaveApiRequestObject.productStatus = getProductStatus(isInputchecked)
//     uniqueColumnsObj = JSON.parse(
//       productSkuUpdateSaveApiRequestObject.uniqueColumns
//     )
//     uniqueColumnsObj["Unique Identifier"] = values.GTINTextbox.trim()
//     productskuStatusObj["Product Status"] = productSkuUpdateSaveApiRequestObject.productStatus
//     productSkuUpdateSaveApiRequestObject.id =
//     ProductMethodContextValue == "CREATE" ? null : updateData.content.data.productId
//        //ProductMethodContextValue == "CREATE" || (!isBeforeclonedataDialog && !cloneProductIsPresent && isFoundation) ? null : updateData.content.data.productId
//     productSkuUpdateSaveApiRequestObject.productSkuId = 
//     ProductMethodContextValue == "CREATE" ? null : updateData.content.data.productSkuId
//     //ProductMethodContextValue == "CREATE" ? null : (!isBeforeclonedataDialog && !cloneProductIsPresent && isFoundation) ? updateData.content.data.productId : updateData.content.data.productSkuId
//     productSkuUpdateSaveApiRequestObject.mandatoryColumns =
//       JSON.stringify(mandatoryColumnsObj)
//     productSkuUpdateSaveApiRequestObject.uniqueColumns =
//       JSON.stringify(uniqueColumnsObj)
//     productSkuUpdateSaveApiRequestObject.productSkuAttr =
//       JSON.stringify({
//         uniqueIdentifier: uniqueColumnsObj,
//         mandatoryColumns: mandatoryColumnsObj,
//         productSkuAttributes: updateProductSkuAttributes,
//         assets: digital_assets,
//         productStatus:productskuStatusObj
//       })
//     productSkuUpdateSaveApiRequestObject.organizationId = parseInt(userDetails.organizationid)
//     setIsFormReinitialize(false)

//      // Show Retailer multiselect overlay 
//      if(guid){
//         productSkuUpdateSaveApiRequestObject.version = updateData.content.data.productSkuVersion
//         productSkuUpdateSaveApiRequestObject.retailerId = guid?props.history.location.state.retailerId:retailerId  
//         SaveProductSkudata()
//      }
//      else{
//       if(!isCloneClick && ProductMethodContextValue != "CREATE")
//      setIsSaveDialog(true)
//      }
  
    
//     if (ProductMethodContextValue == "CREATE") {
//       productSkuUpdateSaveApiRequestObject.version = 0
//       productSkuUpdateSaveApiRequestObject.retailerId = retailerId
//       SaveProductSkudata()
//     } 
//     else {
//       productSkuUpdateSaveApiRequestObject.version = updateData.content.data.productSkuVersion
//         productSkuUpdateSaveApiRequestObject.retailerId = guid?props.history.location.state.retailerId:retailerId  
//         if(isBeforeclonedataDialog || isCloneClick&&isValueChanged) {
//           setIsSaveDialog(false)
//           isCloneClick&&isValueChanged ? setIsClone(true) : null
//           productSkuUpdateSaveApiRequestObject.retailerId = guid?props.history.location.state.retailerId:updateData.content.data.retailerId 
//           SaveProductSkudata()
//         }
//     }
//   }

//   const SaveProductSkudata = () => {
//     setIsShowLoader(true)
//     setSpinner(true)
//     setIsSaveDialog(false)
//     let retailerSelectedList = []
//     selectedRetailerData && selectedRetailerData.length &&
//       selectedRetailerData.map((item, index) => {
//         if (!item.isfoundation && item.isChecked && retailerId != item.id) {
//             retailerSelectedList.push(item.id)
//         }
//       })
//     productSkuUpdateSaveApiRequestObject.cloneRetailerIdList = retailerSelectedList
//     if (ProductMethodContextValue == "CREATE") {
//       // console.log(productSkuUpdateSaveApiRequestObject,"1");
//      props.createProductSkuData(productSkuUpdateSaveApiRequestObject)
//     }
//     else {
//       // console.log(productSkuUpdateSaveApiRequestObject,"2");
//        props.updateProductSkuData(productSkuUpdateSaveApiRequestObject)
//     }
//   }

//   const getStyles = (errors, fieldName) => {
//     if (getIn(errors, fieldName)) {
//       return {
//         border: "1px solid red",
//       }
//     }
//   }
//   const onHideCancelDialog = () => {
//     setIsGobackDialog(false)
//   }
//   const hideAddAssetDialog= () =>{
//     setIsAddAssetDialog(false)
//   }
//   const confirmDialog = () => {
//     if(isValueChanged){
//     setIsGobackDialog(true)
//      }
//     else{
//       reDirectToSkulist()
//     }
//   }

//   const cancelProductSku = () => {
//     reDirectToSkulist()
//   }

//   const beforeclonehideDialog =() => {
//     setIsBeforeclonedataDialog(false)
//     setSubBrandLoader(false)
//     if (!isApiSuccess) {
//       setRetailerId(prevSelectedRetailer.id)
//       setSelectedRetailerObject(prevSelectedRetailer)
//     }
//   }

//   const basevaluesaveandcloneDialog = () =>{
//     if(isValueChanged){
//       valuechange=false
//       setIsValueChanged(false)
//    }
//     setIsBeforeclonedataDialog(false)
//   }

//   useEffect(() => {
//     if (valuechange == false) {
//       cloneDataCheck(selectedRetailerObject, true)
//       valuechange = true
//     }
//   }, [isBeforeclonedataDialog])

  
//   const hideSaveDialog = () =>{
//     setIsSaveDialog(false)
//   }



//   // RightsideClick Retailer
//   const cloneDataCheck = (retailerdata,editstatus,valuechange)=>{
//     //if(!isValueChanged){
//     setRetailerId(retailerdata.id)
//     setSubBrandLoader(true)
//     if(!editstatus){
//     setPrevSelectedRetailer(selectedRetailerObject) // previous select state 
//     }
//     setIsCloneClick(true)
//   //}
//     setSelectedRetailerObject(retailerdata)
//     if (ProductMethodContextValue == "UPDATE") {  
//       if(retailerdata.isfoundation && !isValueChanged){
//         setUpdateData(undefined)
//         setIsClone(false)
//         props.dropdownvalueData(getApiRequestObject)
//         props.updateGetProductSkuData(getProductSkuAttributesApiRequestObject)
//       } 
//       else{
//         if(!isValueChanged || (editstatus == true && !retailerdata.isfoundation) ){
//           getCloneProductSkuAttributesApiRequestObject.productSkuId = selectedProductSku.id
//           getCloneProductSkuAttributesApiRequestObject.retailerId = retailerdata.id
//           Switchdata(retailerdata.id)
//         }
//         else{

//           let changeSeletedRetailer = selectedRetailerData &&
//           selectedRetailerData.length &&
//           selectedRetailerData.map((retailer, index) => {
//             let checked = false
//             if (retailerdata.id == retailer.id) {
//               checked = true
//             }
//             return { ...retailer, isChecked: checked }
//           })
//         setSelectedRetailerData(changeSeletedRetailer)

//         setIsBeforeclonedataDialog(true)
//         setCloneContent(i18n.t("productSkulist.clonebeforesave"))
//         }
//       }      
//     }
//   }

//   //Clone data Confirmation 
//   const Switchdata = (selectRetailerId)=>{
//     setIsClone(false)
//     setIsCloneClick(false)
//     let checkretailerId 
//           if(selectRetailerId!=undefined)
//           { checkretailerId = selectRetailerId }
//           else{checkretailerId = retailerId}
//     if (ProductMethodContextValue == "UPDATE") {
//       let changeSeletedRetailer = selectedRetailerData &&
//         selectedRetailerData.length &&
//         selectedRetailerData.map((retailer, index) => {
//           let checked = false
//           if (checkretailerId == retailer.id) {
//             checked = true
//           }
//           return { ...retailer, isChecked: checked }
//         })
//       setSelectedRetailerData(changeSeletedRetailer)
//         // setCloneProductIsPresent(true)     
//         props.cloneupdateGetProductSkuData(getCloneProductSkuAttributesApiRequestObject)
//         setIsClone(true)
//     }
//   }

//   //Before clone save foundation data 
//   const saveFoundationData = () =>{
//     setIsBeforeclonedataDialog(false)
//     formRef.current.handleSubmit()
//   }

//   const renderLoader =(hierarchyName)=>{
//     if (hierarchyName == hierarchyConstantsMap.superCategory) {
//         return <div>{superCateLoader?<div className="dynamicloaders"><div aria-hidden="true" class="react-select__indicator react-select__loading-indicator css-at12u2-loadingIndicator"><span class="css-4dz72r"></span><span class="css-1f06n0c"></span><span class="css-1lqdfpi"></span></div></div>:null}</div>
//     } else if (hierarchyName == hierarchyConstantsMap.childSuperCategory) {
//       return  <div>{childSuperCateLoader?<div className="dynamicloaders"><div aria-hidden="true" class="react-select__indicator react-select__loading-indicator css-at12u2-loadingIndicator"><span class="css-4dz72r"></span><span class="css-1f06n0c"></span><span class="css-1lqdfpi"></span></div></div>:null}</div>
//     } else if (hierarchyName == hierarchyConstantsMap.category) {
//      return <div>{cateLoader?<div className="dynamicloaders"><div aria-hidden="true" class="react-select__indicator react-select__loading-indicator css-at12u2-loadingIndicator"><span class="css-4dz72r"></span><span class="css-1f06n0c"></span><span class="css-1lqdfpi"></span></div></div>:null}</div>
//     } else if (hierarchyName == hierarchyConstantsMap.childCategory) {
//     return <div>{childCateLoader?<div className="dynamicloaders"><div aria-hidden="true" class="react-select__indicator react-select__loading-indicator css-at12u2-loadingIndicator"><span class="css-4dz72r"></span><span class="css-1f06n0c"></span><span class="css-1lqdfpi"></span></div></div>:null}</div>
//     } else if (hierarchyName == hierarchyConstantsMap.subCategory) {
//       return <div>{subCateLoader?<div className="dynamicloaders"><div aria-hidden="true" class="react-select__indicator react-select__loading-indicator css-at12u2-loadingIndicator"><span class="css-4dz72r"></span><span class="css-1f06n0c"></span><span class="css-1lqdfpi"></span></div></div>:null}</div>
//     } else if (hierarchyName == hierarchyConstantsMap.childSubCategory) {
//       return <div>{childSubCateLoader?<div className="dynamicloaders"><div aria-hidden="true" class="react-select__indicator react-select__loading-indicator css-at12u2-loadingIndicator"><span class="css-4dz72r"></span><span class="css-1f06n0c"></span><span class="css-1lqdfpi"></span></div></div>:null}</div>
//     } else if (hierarchyName == hierarchyConstantsMap.brand) {
//       return <div>{brandLoader?<div className="dynamicloaders"><div aria-hidden="true" class="react-select__indicator react-select__loading-indicator css-at12u2-loadingIndicator"><span class="css-4dz72r"></span><span class="css-1f06n0c"></span><span class="css-1lqdfpi"></span></div></div>:null}</div>
//     } else if (hierarchyName == hierarchyConstantsMap.childBrand) {
//       return <div>{childBrandLoader?<div className="dynamicloaders"><div aria-hidden="true" class="react-select__indicator react-select__loading-indicator css-at12u2-loadingIndicator"><span class="css-4dz72r"></span><span class="css-1f06n0c"></span><span class="css-1lqdfpi"></span></div></div>:null}</div>
//     } else if (hierarchyName == hierarchyConstantsMap.subBrand) {
//       return <div>{subBrandLoader?<div className="dynamicloaders"><div aria-hidden="true" class="react-select__indicator react-select__loading-indicator css-at12u2-loadingIndicator"><span class="css-4dz72r"></span><span class="css-1f06n0c"></span><span class="css-1lqdfpi"></span></div></div>:null}</div>
//     }
//   }
  

//   const renderValues = (optionsList, attributNames, attributes, values) => {
//     let selectedValues = {}
//     hierarchyDynamicvalue = hierarchyDropdownObject
//     if (isFormReinitialize && Object.keys(hierarchyConstantsMap).length > 0) {
//       if (ProductMethodContextValue == "UPDATE" && changevalue[0].name == "") {
//         optionsList &&
//           optionsList.map((listName) => {
//             if (listName.name == attributes.value) {
//               selectedValues = {id: listName.id,name:attributes.value,value:attributes.value}
//               hierarchyDynamicvalue[attributNames] = selectedValues
//             }
//           })
//         setHierarchyDropdownSelected(hierarchyDynamicvalue)
//         if (
//           attributNames == hierarchyConstantsMap.superCategory &&
//           values[attributNames].name != selectedValues.name
//         ) {
//           requestParams.superCategoryList= [selectedValues]
//           setSuperCateSelect(selectedValues)
//         }
//         if (
//           attributNames == hierarchyConstantsMap.childSuperCategory &&
//           values[attributNames].name != selectedValues.name 
//         ) {
//           requestParams.childSuperCategoryList=[selectedValues]
//           setChildSuperCateSelect(selectedValues)
//         }
//         if (
//           attributNames == hierarchyConstantsMap.category &&
//           values[attributNames].name != selectedValues.name
//         ) {
//           requestParams.categoryList=[selectedValues]
//           setCateSelect(selectedValues)
//         }
//         if (
//           attributNames == hierarchyConstantsMap.childCategory &&
//           values[attributNames].name != selectedValues.name
//         ) {
//           requestParams.childCategoryList=[selectedValues]
//           setChildCateSelect(selectedValues)
//         }
//         if (
//           attributNames == hierarchyConstantsMap.subCategory &&
//           values[attributNames].name != selectedValues.name
//         ) {
//           requestParams.subCategoryList=[selectedValues]
//           setSubCateSelect(selectedValues)
//         }
//         if (
//           attributNames == "Locale" &&
//           values[attributNames].name != selectedValues.name
//         ) {
        
//           setLocaleSelect(selectedValues)
//         }
//         if (
//           attributNames == hierarchyConstantsMap.childSubCategory &&
//           values[attributNames].name != selectedValues.name
//         ) {
//           requestParams.childSubCategoryList=[selectedValues]
//           setChildSubCateSelect(selectedValues)
//         }
//         if (
//           attributNames == hierarchyConstantsMap.brand &&
//           values[attributNames].name != selectedValues.name
//         ) {
//           requestParams.brandList=[selectedValues]
//           setbrandSelect(selectedValues)
//         }
//         if (
//           attributNames == hierarchyConstantsMap.childBrand &&
//           values[attributNames].name != selectedValues.name
//         ) {
//           requestParams.subFamilyList=[selectedValues]
//           setchildBrandSelect(selectedValues)
//         }
//         if (
//           attributNames == hierarchyConstantsMap.subBrand &&
//           values[attributNames].name != selectedValues.name
//         ) {
//           requestParams.subBrandList=[selectedValues]
//           setSubBrandSelect(selectedValues)
//         }
//       } 
//     else {
//       if (changevalue[0].name == attributNames) {
//         hierarchyDynamicvalue[attributNames].id = changevalue[0].value
//         setHierarchyDropdownSelected(hierarchyDynamicvalue)
//         values[attributNames] = hierarchyDynamicvalue[attributNames]
//       }
//        else {
//            if(changevalue[0].name != ""){
//             optionsList && optionsList.map((listName) => {
//               if (hierarchyDropdownObject[attributNames].id == listName.id &&
//                  hierarchyDropdownObject[attributNames].name == listName.name) {
//                 values[attributNames] = {id:listName.id,name:listName.name,value:listName.name}
//                 hierarchyDynamicvalue[attributNames] = listName
//               }
//             })
//           }
//       }
//     }
//   } 
//   }
  
//   const deleteAttrDialogue = (
//     <React.Fragment>
//       <Button
//         label={labelNo}
//         //icon="pi pi-times"
//         className="p-button-text custom-button cancel-button"
//         onClick={() => onHideCancelDialog()}
//       />
//       <Button
//         label={labelYes}
//         //icon="pi pi-check"
//         className="p-button-text custom-button btn-yes"
//         onClick={() => cancelProductSku()}
//       />
//     </React.Fragment>
//   )

//   const BeforeCloneFooterbtns =(
//     <React.Fragment>
//       <Button
//         label={labelNo}
//        // icon="pi pi-times"
//         className="p-button-text custom-button cancel-button"
//         onClick={() => basevaluesaveandcloneDialog()}
//       />
//       <Button
//         label={labelYes}
//         //icon="pi pi-check"
//         className="p-button-text custom-button btn-yes"
//         onClick={() => saveFoundationData()}
//       />
//     </React.Fragment>
//   )

//   const addHeroimage = (e) => {
//     if (ProductMethodContextValue == "UPDATE") {
//       if (heroImageGroupData && heroImageGroupData.length > 0) {
//         if(!isValueChanged){
//           setIsValueChanged(true)
//         }
//         heroImageGroupData[0].AssetsID = e.id
//         heroImageGroupData[0].AssetsUrl = e.sourceUrl
//          setFieldsValue("heroImageGroupData",heroImageGroupData)
//          initialValues.heroImageGroup = heroImageGroupData
//       }
//     }
//     else {
//       productskuheroId = e.id
//       productskuheroImage = e.sourceUrl
//       let finalassets = {"digitalAssetsDatas":[]}
//       //formikvalues
//       let digitalassetsdataresult = formRef.current.values.digitalAssestsGroup&&formRef.current.values.digitalAssestsGroup.length > 0 ? formRef.current.values.digitalAssestsGroup : null
//       if(digitalAssestsData &&digitalAssestsData.length > 0 ){
//         if(lastfunction !="add"){
//         digitalassetsdataresult = digitalAssestsData
//         }       
//       }
//       if(digitalAssestsData && digitalAssestsData.length > 0 && digitalassetsdataresult==null){
//         digitalassetsdataresult = digitalAssestsData
//       }
//       finalassets.digitalAssetsDatas=digitalassetsdataresult
//       if(digitalassetsdataresult == null){
//         setDigitalAssestsData(digitalassetsdataresult)
//       }
//       else{
//         setDigitalAssestsData(finalassets)
//       }
//       setProductSkuAttributeData(formRef.current.values.attributeGroups)
//     }
//   }

//   const checkdropdown = (error) =>{
//     if(Object.keys(organizationSpec).includes(Object.keys(error)[0]) ||
//      Object.keys(error)[0] == "Locale" || Object.keys(error)[0]== "heroImageGroup"|| Object.keys(error)[0] == "digitalAssestsGroup"){
//       if(document.querySelector("#"+Object.keys(error)[0].replace(/\s+/g, "")) == null){
//        document.querySelectorAll(".p-accordion-toggle-icon.pi.pi-chevron-right").forEach(el=>el.click())
//       }
//       if(document.querySelector("#"+Object.keys(error)[0].replace(/\s+/g, "")) != null)
//       if(document.querySelector("#"+Object.keys(error)[0].replace(/\s+/g, "")).closest(".field") != null){
//        document.querySelector("#"+Object.keys(error)[0].replace(/\s+/g, "")).closest(".field").scrollIntoView({
//           behavior: "smooth"})
//        }  
//     else{
//       document.querySelector("#"+Object.keys(error)[0].replace(/\s+/g, "")) .scrollIntoView({
//         behavior: "smooth"})
//     }
//     }
//   }

//   const SaveFooterbtns = (
//     <React.Fragment>
//       <Button
//         label={"Proceed"}
//         className="p-button-text custom-button btn-yes"
//         onClick={() => SaveProductSkudata()}
//       />
//     </React.Fragment>
//   )

//   const onKeyDown = (keyEvent) => {
//     if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
//       keyEvent.preventDefault();
//     }
//   }

//   const getassetsid = () => {
//     let assetids = []
//     var ids = null
//     if (formRef.current != undefined && formRef.current.values.digitalAssestsGroup.length > 0) {
//       ids = formRef.current.values.digitalAssestsGroup
//     }
//     if (formRef.current != undefined && ProductMethodContextValue != "UPDATE") {
//       if (ids == null) {
//         ids = formRef.current.values.heroImageGroup
//       }
//     }

//     ids != undefined && ids != null && ids.map(assetdata => {
//       assetids.push(assetdata.AssetsID)
//     })
//     if (ids != undefined && ids != null && ProductMethodContextValue != "UPDATE") {
//       let heroimageexist = ids.filter((obj) => obj.AssetsID === formRef.current.values.heroImageGroup[0].AssetsID)
//       if (heroimageexist.length == 0)
//         assetids.push(formRef.current.values.heroImageGroup[0].AssetsID)
//     }
//     setDigitalassetsIds(assetids)
//   }

//   let custom = {
//     enterRight: "",
//     enterLeft: "",
//     exitRight: "",
//     exitLeft: "",
//     intro: "",
//   }

//   return (
//     <React.Fragment> 
//     <StepWizard className="manage-catalogue-stepwizard" initialStep={1} transitions={custom} instance={setInstance}>
//       <div className={isLoader ? "center-align" : ""}>
//       <Toast ref={toast} />
//         <ToastModal
//           show={isToastMsg}
//           title={toastHeading}
//           titleBackgroundColor={titleBackgroundColor}
//           content={toastContent}
//           size={toastSize}
//           onModalHide={handleToastHide}
//         />
//              {isLoader ? (
//           <Card className="loading-image">
//             <center style={{ margin: "auto" }}>
//               <Card.Body>
//                 <Spinner animation="grow" className="spinner" />
//               </Card.Body>
//             </center>
//           </Card>
//         ) : null}
//         { initialValues.productSkuAttributeGroups && !isLoader ? (
//           <Formik
//             innerRef={formRef}
//             enableReinitialize        
//             validateOnBlur={false}
//             validateOnChange={false}
//             validationSchema={Fieldarrayschema}
//             initialValues={{
//               attributeGroups: productSkuAttributeData,
//               digitalAssestsGroup: digitalAssestsData
//                 ? digitalAssestsData.digitalAssetsDatas
//                 : [],
//               productNameTextbox: productName,
//               GTINTextbox: gtin,
//               derivedAssetOptions: derivedAssetOptions,
//               //derivedAttrGrpOptions: derivedAttrGrpOptions,
//               //derivedAttrOptions: derivedAttrOptions,
//               localeList: localeList,
//               Locale: localeSelect,
//               superCategoryList: superCategoryList,
//               [organizationSpec.superCategory]: superCateSelect,
//               childSuperCategoryList: childSuperCategoryList,
//               [organizationSpec.childSuperCategory]: childSuperCateSelect,
//               categoryList: categoryList,
//               [organizationSpec.category]: cateSelect,
//               childCategoryList: childCategoryList,
//               [organizationSpec.childCategory]: childCateSelect,
//               subCategoryList: subCategoryList,
//               [organizationSpec.subCategory]: subCateSelect,
//               childSubCategoryList: childSubCategoryList,
//               [organizationSpec.childSubCategory]: childSubCateSelect,
//               brandList: brandList,
//               [organizationSpec.brand]: brandSelect,
//               childBrandList: childBrandList,
//               [organizationSpec.childBrand]: childBrandSelect,
//               subBrandList: subBrandList,
//               [organizationSpec.subBrand]: subBrandSelect,
//               heroImageGroup:
//                 ProductMethodContextValue == "UPDATE"
//                   ? heroImageGroupData
//                   : [
//                     {
//                       AssetsID: productskuheroId,
//                       AttributeID: "assets.value",
//                       AttributeType: "IMAGE",
//                       AssetsUrl: productskuheroImage,
//                       AttributeName: "assets.label",
//                     },
//                   ],
//             }}
//             onSubmit={(values,errors) =>{
//               setTimeout(() => {                
//                 saveFormikData(values,errors)
//               }, 500)
//             }
//             }
//           >
//             {({ errors, values, setFieldValue, touched, handleSubmit }) => (
//               <React.Fragment>
//               {errors && Object.keys(errors).length > 0 ? checkdropdown(errors) : null}
//               <Form onSubmit={handleSubmit} onKeyDown={onKeyDown} className={`p-grid productsku-form`}>
//               <React.Fragment>
//               <div className={ 
//               `form-content ${ProductMethodContextValue == "UPDATE" ? guid ? "col-12 col-md-12 col-lg-12 col-xl-12":"col-10 col-md-9 col-lg-9 col-xl-10" : "col-12 col-md-12 col-lg-12 col-xl-12"}`
//             }
//              >
//                 {(setFieldsValue = setFieldValue)}
//                 {/* ErrorFocus  */}
//                 <ConnectedFocusError />
//                 <div>
//                   {renderTitle()}
//                   <div className="content-container-style">
//                     <Col style={{ padding: "0px",}}>
//                       <div>
//                         {renderEnhancedContentTile( errors, values , setFieldsValue)}                        
//                       </div>
//                     </Col>
//                   </div>
//                 </div>
                
//                 {/* <FieldArray name={`attributeGroups`}>
//                   {(attributeGroupArray) => ( */}
//                     <>                     
//                       <div className="accordion-demo p-col-12">
//                         {values.attributeGroups &&
//                           values.attributeGroups.length > 0 &&
//                           values.attributeGroups.map(
//                             (attributeGroup, index) => {   
//                               if(values.attributeGroups[index].attributes.length > 0) {                        
//                               let requiredcount = 0,
//                                 totalcount = 0
//                               values.attributeGroups[index].attributes &&
//                                 values.attributeGroups[index].attributes.length > 0 &&
//                                 values.attributeGroups[index].attributes.map(
//                                   (attr, idx) => {
//                                     if (attr.required) {
//                                       requiredcount++
//                                     }
//                                   }
//                                 )

//                               const attributeGroupNames =
//                                 attributeGroup.attributeGroupName
//                               return (
//                                 <>
//                                   <ExpandCollapse
//                                     handleClick={handleClick.bind(
//                                       this,
//                                       attributeGroup
//                                     )}
//                                     headers={attributeGroup.attributeGroupName}
//                                     textArea={
//                                       <>
//                                         {/* <FieldArray
//                                           name={`attributeGroups[${index}].attributes`}
//                                         >
//                                           {(attributeArray) => ( */}
//                                             <>
//                                               {values.attributeGroups[index].attributes &&
//                                                 values.attributeGroups[index].attributes.length > 0 &&
//                                                 values.attributeGroups[index].attributes.map(
//                                                   (attributes, index2) => {
//                                                     attributNames = attributes.attributeName
                                                   
//                                                     if (
//                                                       (attributes.attributeName == hierarchyConstantsMap.superCategory) ||
//                                                       (attributes.attributeName == hierarchyConstantsMap.childSuperCategory) ||
//                                                       (attributes.attributeName == hierarchyConstantsMap.category) ||
//                                                       (attributes.attributeName == hierarchyConstantsMap.childCategory) ||
//                                                       (attributes.attributeName == hierarchyConstantsMap.subCategory) ||
//                                                       (attributes.attributeName == "Locale") ||
//                                                       (attributes.attributeName == hierarchyConstantsMap.childSubCategory) ||
//                                                       (attributes.attributeName == hierarchyConstantsMap.brand) ||
//                                                       (attributes.attributeName == hierarchyConstantsMap.childBrand) ||
//                                                       (attributes.attributeName == hierarchyConstantsMap.subBrand)
//                                                     ) {
//                                                       let optionsList = null
//                                                       let dynamicloader = null
//                                                       if (
//                                                         attributes.attributeName ==
//                                                         hierarchyConstantsMap.superCategory &&
//                                                         values.superCategoryList
//                                                           .length > 0
//                                                       ) {
//                                                         optionsList =
//                                                           values.superCategoryList
//                                                         renderValues(
//                                                           optionsList,
//                                                           attributNames,
//                                                           attributes,
//                                                           values
//                                                         )
                                                        
//                                                       } else if (
//                                                         attributes.attributeName ==
//                                                         hierarchyConstantsMap.childSuperCategory &&
//                                                         values
//                                                           .childSuperCategoryList
//                                                           .length > 0
//                                                       ) {
//                                                         optionsList =
//                                                           values.childSuperCategoryList
//                                                         renderValues(
//                                                           optionsList,
//                                                           attributNames,
//                                                           attributes,
//                                                           values
//                                                         )
                                                        
//                                                       } else if (
//                                                         attributes.attributeName ==
//                                                         hierarchyConstantsMap.category &&
//                                                         values.categoryList
//                                                           .length > 0
//                                                       ) {
//                                                         optionsList =
//                                                           values.categoryList
//                                                         renderValues(
//                                                           optionsList,
//                                                           attributNames,
//                                                           attributes,
//                                                           values
//                                                         )
                                                        
//                                                       } else if (
//                                                         attributes.attributeName ==
//                                                         hierarchyConstantsMap.childCategory &&
//                                                         values.childCategoryList
//                                                           .length > 0
//                                                       ) {
//                                                         optionsList =
//                                                           values.childCategoryList
//                                                         renderValues(
//                                                           optionsList,
//                                                           attributNames,
//                                                           attributes,
//                                                           values
//                                                         )
                                                        
//                                                       } else if (
//                                                         attributes.attributeName ==
//                                                         hierarchyConstantsMap.subCategory &&
//                                                         values.subCategoryList
//                                                           .length > 0
//                                                       ) {
//                                                         optionsList =
//                                                           values.subCategoryList
//                                                         renderValues(
//                                                           optionsList,
//                                                           attributNames,
//                                                           attributes,
//                                                           values
//                                                         )
                                                        
//                                                       } else if (
//                                                         attributes.attributeName ==
//                                                         hierarchyConstantsMap.childSubCategory &&
//                                                         values
//                                                           .childSubCategoryList
//                                                           .length > 0
//                                                       ) {
//                                                         optionsList =
//                                                           values.childSubCategoryList
//                                                         renderValues(
//                                                           optionsList,
//                                                           attributNames,
//                                                           attributes,
//                                                           values
//                                                         )
                                                       
//                                                       } else if (
//                                                         attributes.attributeName ==
//                                                         hierarchyConstantsMap.brand &&
//                                                         values.brandList
//                                                           .length > 0
//                                                       ) {
//                                                         optionsList =
//                                                         values.brandList
//                                                         renderValues(
//                                                           optionsList,
//                                                           attributNames,
//                                                           attributes,
//                                                           values
//                                                         )
                                                        
//                                                       } else if (
//                                                         attributes.attributeName ==
//                                                         hierarchyConstantsMap.childBrand &&
//                                                         values.childBrandList
//                                                           .length > 0
//                                                       ) {
//                                                         optionsList =
//                                                           values.childBrandList
//                                                         renderValues(
//                                                           optionsList,
//                                                           attributNames,
//                                                           attributes,
//                                                           values
//                                                         )
                                                        
//                                                       } else if (
//                                                         attributes.attributeName ==
//                                                         hierarchyConstantsMap.subBrand &&
//                                                         values.subBrandList
//                                                           .length > 0
//                                                       ) {
//                                                         optionsList =
//                                                           values.subBrandList
//                                                         renderValues(
//                                                           optionsList,
//                                                           attributNames,
//                                                           attributes,
//                                                           values
//                                                         )
                                                        
//                                                       } else {
//                                                         if (attributes.attributeName == "Locale" && values.localeList.length > 0) {
//                                                           optionsList = values.localeList
//                                                           renderValues(optionsList, attributNames, attributes, values)
//                                                          // dynamicloader = cateLoader?<div className="dynamicloaders"><Spinner animation="grow" className="spinner" /></div>:null
//                                                         }
//                                                       }
                                                      
//                                                       if(mandatoryColumnList.includes(hierarchyConstantsMap.superCategory)||
//                                                       mandatoryColumnList.includes(hierarchyConstantsMap.childSuperCategory)||
//                                                       mandatoryColumnList.includes(hierarchyConstantsMap.category)||
//                                                       mandatoryColumnList.includes(hierarchyConstantsMap.childCategory)||
//                                                       mandatoryColumnList.includes(hierarchyConstantsMap.subCategory)||
//                                                       mandatoryColumnList.includes("Locale")||
//                                                       mandatoryColumnList.includes(hierarchyConstantsMap.childSubCategory)||
//                                                       mandatoryColumnList.includes(hierarchyConstantsMap.brand)||
//                                                       mandatoryColumnList.includes(hierarchyConstantsMap.childBrand)||
//                                                       mandatoryColumnList.includes(hierarchyConstantsMap.subBrand)
//                                                       ) {
//                                                       return (
//                                                         <React.Fragment>  
//                                                           <div className="field col-4 md:col-4 mb-2">
//                                                             <label
//                                                               className={`${attributes.required
//                                                                 ? "required"
//                                                                 : ""
//                                                                 } attributeLabel`}
//                                                               style={{
//                                                                 fontWeight: 600,
//                                                                 minWidth:
//                                                                   "50px",
//                                                               }}
//                                                               htmlFor="inputtext"
//                                                             >
//                                                               {
//                                                                 attributes.attributeName
//                                                               }
//                                                             </label>
//                                                             <div className="dropdown-holder">   
//                                                             {                                                          
//                                                               <Dropdown
//                                                                 className={`${errors[attributes.attributeName] && errors[attributes.attributeName].name
//                                                                   ? "multiselect-items errordropdown"
//                                                                   : "multiselect-items"
//                                                                   }`}
//                                                                   id={(attributes.attributeName).replace(/\s+/g, "")}
//                                                                   // name ={attributes.attributeName}
//                                                                 name={`attributeGroups.${index}.attributes.${index2}.value`}
//                                                                 placeholder={attributes.attributeName}
//                                                                 optionLabel="name"
//                                                                 optionValue="id"
//                                                                 showOnFocus={true}
//                                                                 options={optionsList}
//                                                                 value={ProductMethodContextValue =="CREATE" && changevalue[0].name == ""? null
//                                                                     :hierarchyDropdownSelected &&
//                                                                      hierarchyDropdownSelected[attributes.attributeName] &&
//                                                                      hierarchyDropdownSelected[attributes.attributeName].id
//                                                                 }
//                                                                 // isMulti={false}
//                                                                 // type="select"
//                                                                 disabled={optionsList ==null || subBrandLoader}
//                                                                 onChange={(e) => {
//                                                                   if (!isOptionDisabled) {
//                                                                     changevalue =  []
//                                                                     changevalue.push(
//                                                                       {
//                                                                         name: attributes.attributeName,
//                                                                         value: e.value,
//                                                                       }
//                                                                     )                                                                   
//                                                                     onChangeSelect(
//                                                                       attributes.attributeName,
//                                                                       e.value
//                                                                     )
//                                                                   }
//                                                                 }}
                                                                
//                                                               />
                                                             
                                                            
                                                            
//                                                             }
//                                                            {!isEditProductName ? renderLoader(attributes.attributeName):null}
//                                                            </div>
                                                           
//                                                             <div className="errorMsg dropdown-error">
//                                                               {errors[
//                                                                 attributes
//                                                                   .attributeName
//                                                               ] &&
//                                                                 errors[
//                                                                   attributes
//                                                                     .attributeName
//                                                                 ].name}
//                                                             </div>
//                                                           </div>
//                                                           </React.Fragment>                                                        
//                                                       )}
//                                                     } else {
//                                                       return (
//                                                         <React.Fragment>
//                                                           <div className="field col-4 md:col-4 mb-2">
//                                                             <label
//                                                               className={`${attributes.required
//                                                                 ? "required"
//                                                                 : ""
//                                                                 } attributeLabel`}
//                                                               style={{
//                                                                 fontWeight: 600,
//                                                                 minWidth:
//                                                                   "50px",
//                                                               }}
//                                                               htmlFor="inputtext"
//                                                             >
//                                                               {
//                                                                 attributes.attributeName
//                                                               }
//                                                             </label>
//                                                             { (
//                                                               <Field
//                                                                 style={getStyles(
//                                                                   errors,
//                                                                   `attributeGroups.${index}.attributes.${index2}.value`
//                                                                 )}
//                                                                 className="p-inputtext attribute-inputtext"
//                                                                 disabled={
//                                                                   subBrandLoader
//                                                                 }
//                                                                 onBlur={(e) => {
//                                                                   handleBlurattribute(e, values)
//                                                                 }}
//                                                                 autocomplete="off"
//                                                                 // validate={
//                                                                 //   validateProductSkuAttributes
//                                                                 // }
//                                                                 name={`attributeGroups.${index}.attributes.${index2}.value`}
//                                                               />
//                                                             )}
//                                                             <div className="errorMsg">
//                                                               <ErrorMessage
//                                                                 name={`attributeGroups.${index}.attributes.${index2}.value`}
//                                                               />
//                                                             </div>
                                                            
//                                                           </div>
//                                                           </React.Fragment>
//                                                       )
//                                                     }
//                                                   }
//                                                 )}
                                             
//                                             </>
//                                         {/*    )}
//                                          </FieldArray> */}
//                                       </>
//                                     }
                                  
//                                   />
//                                 </>
//                               )
//                                   }
//                             }
//                           )}
                       
//                       </div>
//                     </>
//                   {/* )}
//                 </FieldArray> */}

//                 {/* /**End of AttributeGroup For loop*/}
//                 {
//                   <div className="footer-btn">
//                   <React.Fragment>
//                     {!isEditProductName ? (
//                       <Button
//                         type="submit"
//                         icon={`${spinner ? "pi pi-spin pi-spinner" : ""}`}
//                         label={
//                           ProductMethodContextValue == "CREATE"
//                             ? i18n.t("commonButton.create")
//                             : i18n.t("commonButton.update")
//                         }
//                         disabled ={subBrandLoader}
//                         className="p-button-text product-save pim-font-property custom-button pim-btn-main"
//                       />
//                     ) : null}
//                     <Button
//                       type="button"
//                       label={i18n.t("commonButton.cancel")}
//                       icon=""
//                       className="p-button-text product-cancel custom-button cancel-button"
//                       onClick={() => confirmDialog()}
//                     />
//                   </React.Fragment>
//                   </div>
//                 }
//               </div>
//               </React.Fragment>
//               <div className="col-2 col-md-3 col-lg-3 col-xl-2 right-side-holder">
//               {ProductMethodContextValue == "UPDATE" ? guid?null:
//               <>
             
               
//               <div className="retailer-holder">
            
//                     <Card className="retailer-card">
//                       <Card.Body>
//                         <Card.Title className="page-header retailer-header">{i18n.t("productSkulist.retailerlist")}</Card.Title>
//                         <Card.Text>
//                           <div className="retailer-parent">
//                           {retailerList &&
//                             retailerList.length &&
//                             retailerList.map(retailer => {
//                               return (
//                                 <div key={retailer.id} className="field-radiobutton retailer-radio">
//                                   <RadioButton inputId={retailer.id} name="retailer" value={retailer}
//                                     onChange={(e) => cloneDataCheck(e.value)}
//                                     disabled={subBrandLoader}
//                                     checked={selectedRetailerObject.id === retailer.id} />
//                                       <img className="reatailer-logo" src={retailer.retailerLogo} onError={(e) => { e.target.src = PREVIEW }} />
//                                   <label htmlFor={retailer.id}>{retailer.retailerName}</label>
//                                 </div>
//                               )
//                             })
//                           }
//                           </div>
//                         </Card.Text>
//                       </Card.Body>
//                     </Card>
//               </div></>:null}
//               </div>
//               </Form>
//               </React.Fragment>
//             )}
//           </Formik>
//         ) : null}
//         {/* Goback Overlay */}
//         <ModalComponent
//           isShowModal={isGobackDialog}
//           onHideModal={onHideCancelDialog}
//           modalTitle={i18n.t("productSkuPopupHeaders.cancelProductSku")}
//           modalContent={
//             <div className="confirmation-content">
//               <i
//                 className="exclamation-triangle"
//                 style={{ fontSize: "2rem" }}
//               />
//               <span>{i18n.t("productSkulist.goback")}</span>
//             </div>
//           }
//           modalSize="md"
//           modalDailogClassName="modalDailogContent smallDialog"
//           modalFooter={deleteAttrDialogue}
//         />
//          {/* Save Foundation data before Data Switch overlay */}
//       <ModalComponent
//           isShowModal={isBeforeclonedataDialog}
//           onHideModal={beforeclonehideDialog}
//           modalTitle={i18n.t("productSkuPopupHeaders.savefoundationdataconfirm")}
//           modalContent={cloneContent}
//           modalSize="md"
//           modalDailogClassName="modalDailogContent smallDialog"
//           modalFooter={BeforeCloneFooterbtns}
//         />

//      {/* Data Switch overlay */}
     
//         {/* Choose Final save RetailerList overlay */}
//         <ModalComponent
//           isShowModal={isSaveDialog}
//           onHideModal={hideSaveDialog}
//           modalTitle={i18n.t("productSkuPopupHeaders.switchdatasave")}
//           modalContent={retailerTemplate()}
//           modalSize="md"
//           modalDailogClassName="modalDailogContent smallDialog finalsave-modal"
//           modalFooter={SaveFooterbtns}
//         />
//         <ModalComponent
//           isShowModal={showLoader}
//            onHideModal={hideShowLoader}
//           modalTitle={i18n.t("productSkuPopupHeaders.loading")}
//           modalContent={
//             <>
//               <center>
//                 <Spinner animation="grow" variant="dark" />
//               </center>
//             </>
//           }
//           modalSize="md"
//           modalDailogClassName="modalDailogContent smallDialog"
//         />
//         <ToastModal
//           show={showUpdateToast}
//           title={toastHeading}
//           titleBackgroundColor={titleBackgroundColor}
//           content={toastContent}
//           size={toastSize}
//           onModalHide={hideUpdateToast}
//         />
       
//       </div>
//       {/* {useMemo(  */}
//       <AssetListPage
//         fromSkuList={true}
//         assetIds={digitalassetsIds}
//         assetTypeSku={selectedAssetType}
//         // productSkuAssetName={selectedImageName}
//         triggerFileUpload={props.triggerFileUpload}
//         cancelClicked={() => {
//           window.scrollTo({ top: 0, behavior: "smooth" })
//           stepWizard.goToStep(1)
//         }}
//         updateClicked={(e) => {
//           setFieldsValue(`${assetName}.AssetsID`, e.id)
//           setFieldsValue(`${assetName}.AssetsUrl`, e.sourceUrl)
//           window.scrollTo({ top: 0, behavior: "smooth"})
//           if(assetName=="heroImageGroup[0]"){
//               addHeroimage(e)
//           }
//           else{
//           assetId = e.id
//           assetsUrl = e.sourceUrl
//           setFieldsValue(`${assetName}.AssetsID`, e.id)
//           setFieldsValue(`${assetName}.AssetsUrl`, e.sourceUrl)
//           setFieldsValue(`${assetName}.AttributeID`, assetAttributeId)
//           setFieldsValue(`${assetName}.AttributeType`, selectedAssetType)
//           setFieldsValue(`${assetName}.AttributeName`, assetAttributeLabel)
         
//           }
//           stepWizard.goToStep(1)
//         }}
//       />
//       {/* )} */}
//     </StepWizard>
//     </React.Fragment>
//   )
// }

// export default connect(mapStateToProps, null)(EnhancedContent)