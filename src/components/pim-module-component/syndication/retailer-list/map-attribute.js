import React, { useEffect, useState } from "react"
import AttributeMap from "../../../../components/attribute-map/attribute-map"
import { getApiRequestObject } from '../../../../common/master-data'
import i18n from "../../../../translate/i18n"
import DynamicSelectMap from "./attr-select-map"
import ToastModal from "../../../modal/ToastModal"
import { MEDIUM, VALID_BG_COLOR } from "../../../../common/common-constants"
import { connect } from "react-redux"
import Select from "react-select"
import { Row } from "react-bootstrap"
import { ErrorMessage, FieldArray, Form, Formik } from "formik"
import CustomSelect from "./custom-select"
import { Button } from "primereact/button"
import { object, array, string, number } from "yup"
// import Backpagecomponent from "../../../back-page-component/back-page-component"
import MapAttributeIcon from "../../../../common/icons/mapAttributeicon"

let  toastHeading,
toastContent,
titleBackgroundColor,
toastSize

let validToastHeading,
    validToastContent,
    validTitleBackgroundColor,
    validToastSize

const mapStateToProps = (state) => {
    return {
      getUserDetail: state.userDetail.getUsersObj.userCredentials
    }
  }

function RetailerAttributeMap(props) {
    const {getUserDetail} = props
    let userDetails = getUserDetail
    let authJson = JSON.parse(sessionStorage.getItem("authJson"))
    const [retailerAttribute, setRetailerAttribute] = useState([])
    const [attrSystemList, setAttrSystemList] = useState([])
    const [excelAttributes, setExcelAttributes] = useState([])
    const [existsOrgRetailer, setExistsOrgRetailer] = useState(null)
    const [organizationData, setorganizationData] = useState()
    const [uniqueAttribute , setUniqueAttribute] = useState()
    const [isToastMsg, setIsToastMsg] = useState(false)
    const [retailerOptions, setRetailerOptions] = useState([])
    const [selectedRetailer,setSelectedRetailer] = useState({})
    const [categoryOptions,setCategoryOptions] = useState([])
    const [selectedCategory,setSelectedCategory] = useState(null)
    const [allCategories,setAllCategories] = useState([])
    const [allRetailers,setAllRetailers] = useState([])
    const [selectedRetailerValue,setSelectedRetailerValue] = useState({})
    // const { attrValue, attrMappingList, attrSystemList, existsOrgRetailer, uniqueAttribute } = props
    const [attrSelect, setAttrSelect] = useState([])
    const [initailaval, setInitailaval] = useState([])
    const [isValidateToastMsg, setIsValidateToastMsg] = useState(false)
    useEffect(() => {
        setAttrSelect(attrSystemList)
    }, [attrSystemList]);

    useEffect(() => {
        let initailavaltemp = []
        if (existsOrgRetailer == "Not Found") {
            const allAttrValue = excelAttributes && excelAttributes.map(attr => {
                const attrContainer = {};
                attrContainer[attr.attrImport] = "";
                return attrContainer;
            })
            initailavaltemp.push(Object.assign({}, ...allAttrValue))
            setInitailaval(initailavaltemp)
        }
    }, [existsOrgRetailer, excelAttributes]);

    const handleValidToastHide = () => {
        setIsValidateToastMsg(false)
    }

    const initialValues = {
        friends: initailaval.length > 0 ? initailaval : excelAttributes
    }

    useEffect(() => {
        props.getAllRetailerData({ orgId: userDetails.organizationid })
        getApiRequestObject.pageStart = 0
                getApiRequestObject.pageEnd = 10000
                getApiRequestObject.sortField = "attrName"
                getApiRequestObject.sortType = "ASC"
                getApiRequestObject.organizationId = userDetails.organizationid
                props.getOrgSystemAttributes(getApiRequestObject)
        // setRetailerAttribute(JSON.parse(props.history.location.state.data.attributes))
        // setUniqueAttribute(props.history.location.state.data.uniqueAttribute)
    }, []);

    useEffect(()=>{
        const {getAllRetailerDataResult} = props
        if (getAllRetailerDataResult &&
            getAllRetailerDataResult.content &&
            getAllRetailerDataResult.content.status == 200 &&
            getAllRetailerDataResult.content.data) {
                setAllRetailers(getAllRetailerDataResult.content.data)
                let options = []
                getAllRetailerDataResult.content.data.map((i)=>{
                    if(!i.isfoundation){
                    let value = {
                        value:i.id,
                        label:i.retailerName
                    }
                    options.push(value)}
                })
                setRetailerOptions(options)
            }
    },[props.getAllRetailerDataResult])

    useEffect(()=>{
        const {getRetailerCategoriesResult} = props
        if (getRetailerCategoriesResult &&
            getRetailerCategoriesResult.content &&
            getRetailerCategoriesResult.content.status == 200 &&
            getRetailerCategoriesResult.content.data) {
                setAllCategories(getRetailerCategoriesResult.content.data)
                let options = getRetailerCategoriesResult.content.data.map((i)=>{
                    let value = {
                        value:i.id,
                        label:i.retailerCategory
                    }
                    return value
                })
                if(options.length>0){
                    setSelectedCategory(options[0])
                    let category = getRetailerCategoriesResult.content.data[0]
                    // JSON.parse
                    setRetailerAttribute(JSON.parse(category.attibutes))
                    setExcelAttributes(JSON.parse(category.mappedAttribute))
                    setUniqueAttribute(category.uniqueAttribute)
                }else{
                    setSelectedCategory(null)
                    setRetailerAttribute([])
                    setExcelAttributes([])
                    setUniqueAttribute(null)
                }
                setCategoryOptions(options)
            }
    },[props.getRetailerCategoriesResult])
    useEffect(() => {
        // getApiRequestObject.pageStart = 0
        // getApiRequestObject.pageEnd = 1000
        // getApiRequestObject.organizationId = userDetails.organizationid

        // const requestBody = {
        //     "orgId": userDetails.organizationid,
        //     "retailerId": props.history.location.state.retailerId,
        //     // "mappedAttribute": "",
        //     // "mappedValues": "",
        //     "isdeleted": false
        // }
        // props.existsOrgRetailers(requestBody)
    }, [])

    // useEffect(() => {
    //     getApiRequestObject.pageStart = 0
    //     getApiRequestObject.pageEnd = 1000
    //     getApiRequestObject.organizationId = userDetails.organizationid
    //     props.getSystemAttributes(getApiRequestObject)
    // }, [])

    useEffect(() => {
        const { existsOrgRetailersResult } = props
        if (
            existsOrgRetailersResult &&
            existsOrgRetailersResult.content &&
            existsOrgRetailersResult.content.status == 200 &&
            existsOrgRetailersResult.content.data &&
            existsOrgRetailersResult.content.data.code != 500
        ) {
            setorganizationData(existsOrgRetailersResult.content.data)
            if (existsOrgRetailersResult.content.data.errorMsg == "Not Found") {
                setExistsOrgRetailer(existsOrgRetailersResult.content.data.errorMsg)
                getApiRequestObject.pageStart = 0
                getApiRequestObject.pageEnd = 1000
                getApiRequestObject.organizationId = userDetails.organizationid
                props.getSystemAttributes(getApiRequestObject)
            } else {
                setExistsOrgRetailer(existsOrgRetailersResult.content.data)
                getApiRequestObject.pageStart = 0
                getApiRequestObject.pageEnd = 1000
                getApiRequestObject.organizationId = userDetails.organizationid
                props.getOrgSystemAttributes(getApiRequestObject)
                setExcelAttributes(JSON.parse(existsOrgRetailersResult.content.data.mappedAttribute))
            }
        }
    }, [props.existsOrgRetailersResult])

    useEffect(() => {
        const { getSystemAttributesResult } = props
        if (
            getSystemAttributesResult &&
            getSystemAttributesResult.content &&
            getSystemAttributesResult.content.status == 200 &&
            getSystemAttributesResult.content.data &&
            getSystemAttributesResult.content.data.code != 500
        ) {
            let systemAttrList = []
            getSystemAttributesResult.content.data.attributes.map((e) => {
                let attrImportTemplate = {
                    label: null,
                    value: null,
                    id: null,
                }
                attrImportTemplate.label = e.attrName
                attrImportTemplate.id = e.id
                attrImportTemplate.value = e.attrName
                attrImportTemplate.type = e.attrType
                systemAttrList.push(attrImportTemplate)
            })
            setAttrSystemList(systemAttrList)
            let attrResult = []
            retailerAttribute.map((i) => {
                attrResult.push({ attrImport: i })
            })
            setExcelAttributes(attrResult)
        }
    }, [props.getSystemAttributesResult])

    useEffect(() => {
        const { getOrgSystemAttributesResult } = props
        if (
            getOrgSystemAttributesResult &&
            getOrgSystemAttributesResult.content &&
            getOrgSystemAttributesResult.content.status == 200 &&
            getOrgSystemAttributesResult.content.data &&
            getOrgSystemAttributesResult.content.data.code != 500
        ) {
            let systemAttrList = []
            getOrgSystemAttributesResult.content.data.attributes.map((e) => {
                let attrImportTemplate = {
                    label: null,
                    value: null,
                    id: null,
                }
                attrImportTemplate.label = e.attrName
                attrImportTemplate.id = e.id
                attrImportTemplate.value = e.attrName
                attrImportTemplate.type = e.attrType
                systemAttrList.push(attrImportTemplate)
            })
            setAttrSystemList(systemAttrList)
        }
    }, [props.getOrgSystemAttributesResult])

    useEffect(() => {
        const { createOrgRetailersResult } = props
        if (
            createOrgRetailersResult &&
            createOrgRetailersResult.content &&
            createOrgRetailersResult.content.status == 200 &&
            createOrgRetailersResult.content.data &&
            createOrgRetailersResult.content.data.code != 500
        ) {
            toastHeading = i18n.t("toastMessage.updatedToastHeading")
            toastContent = "Created Org Retailers"
            titleBackgroundColor = VALID_BG_COLOR
            toastSize = MEDIUM
            setIsToastMsg(true)
        }
    }, [props.createOrgRetailersResult])

    useEffect(() => {
        const { updateOrgRetailersResult } = props
        if (
            updateOrgRetailersResult &&
            updateOrgRetailersResult.content &&
            updateOrgRetailersResult.content.status == 200 &&
            updateOrgRetailersResult.content.data &&
            updateOrgRetailersResult.content.data.code != 500
        ) {
            toastHeading = i18n.t("toastMessage.updatedToastHeading")
            toastContent = "Attributes updated"
            titleBackgroundColor = VALID_BG_COLOR
            toastSize = MEDIUM
            setIsToastMsg(true)
        }
    }, [props.updateOrgRetailersResult])

    useEffect(() => {
        const { updateMappedAttributeResult } = props
        if (
            updateMappedAttributeResult &&
            updateMappedAttributeResult.content &&
            updateMappedAttributeResult.content.status == 200 &&
            updateMappedAttributeResult.content.data &&
            updateMappedAttributeResult.content.data.code != 500
        ) {
            toastHeading = "Map Attributes"
            toastContent = "Retailer attributes have been mapped."
            titleBackgroundColor = VALID_BG_COLOR
            toastSize = MEDIUM
            setIsToastMsg(true)
        }
    }, [props.updateMappedAttributeResult])

    useEffect(() => {
        const { updateRetailerMappedAttributesResult } = props
        if (
            updateRetailerMappedAttributesResult &&
            updateRetailerMappedAttributesResult.content &&
            updateRetailerMappedAttributesResult.content.status == 200 &&
            updateRetailerMappedAttributesResult.content.data &&
            updateRetailerMappedAttributesResult.content.data.code != 500
        ) {
            toastHeading = "Map Attributes"
            toastContent = "Retailer attributes have been mapped."
            titleBackgroundColor = VALID_BG_COLOR
            toastSize = MEDIUM
            setIsToastMsg(true)
        }
    }, [props.updateRetailerMappedAttributesResult])

    const goToStep = (value) => {
        // if (existsOrgRetailer == "Not Found") {
        //     const requestBody = {
        //         "orgId": userDetails.organizationid,
        //         "retailerId": props.history.location.state.retailerId,
        //         "mappedAttribute": JSON.stringify(value.friends),
        //         "isfoundation":false,
        //         "isdeleted": false
        //     }
        //     props.createOrgRetailers(requestBody)
        // } else {
        //     let requestBody = existsOrgRetailer
        //     requestBody.mappedAttribute = JSON.stringify(value.friends)
        //     // {
        //     //     "id": organizationData.id,
        //     //     "orgId": userDetails.organizationid,
        //     //     "retailerId": props.history.location.state.retailerId,
        //     //     "mappedAttribute": JSON.stringify(value.friends),
        //     //     "version": organizationData.version,
        //     //     "isdeleted": false
        //     // }
        //     props.updateOrgRetailers(requestBody, organizationData.id)
        // }
        let request = {
            id:selectedRetailerValue.isCommonAttribute?selectedRetailerValue.id: selectedCategory.value,
            mappedAttribute:JSON.stringify(value.friends)
        }
        selectedRetailerValue.isCommonAttribute? props.updateRetailerMappedAttributes(request):
        props.updateMappedAttribute(request)
    }

    const schemaProperties = () =>{
        let value = {}
        retailerAttribute.map((i)=>{
            if(i.isMandatory){
                value[i.name]=string()
                .ensure()
                .required("This is a mandatory Attribute")
            }
        })
        return value
    }
    const validationSchema = object().shape({
        friends:array()
        .of(
          object().shape(
           schemaProperties())
        )
    })

    const handleToastHide = () => {
        setIsToastMsg(false)
        const data = {
            key:  'retailerList' 
        }
        // props.history.push("/selectProducts")
        props.triggerPageLayout(data)
        props.history.push({
            pathname: '/retailerlist', state: {
                retailerId: props.history.location.state.retailerId
            }
        })
        // const data = {
        //     key: "retailerList",
        //   }
        //   props.history.push("/retailerList")
        //   props.triggerPageLayout(data)
      }
    const cancelClicked = () => {
        const data = {
            key: "retailerList",
          }
          props.history.push("/retailerList")
          props.triggerPageLayout(data)
    }

    return (
        <div className="map-attribute-parent">
            {/* <Backpagecomponent props={props}/> */}
            <div className="p-grid common-header-section">
                <h5 className="p-m-0  p-col-12  page-header"><MapAttributeIcon />&nbsp;Map Attributes</h5>
            </div>
        {/* <div className="mt-2 pt-3 pl-2" style={{height:"150px",background:"white"}}>
            <Row>
            <div className="col-5">
            <p><b>Retailer</b></p>
            <Select 
            options={retailerOptions}
            value={selectedRetailer}
            onChange={(newValue)=>{
                if((selectedRetailer==null)||(selectedRetailer.id!=newValue.value)){
                    setSelectedRetailer(newValue)
                    setRetailerAttribute([])
                    setExcelAttributes([])
                    props.getRetailerCategories(null,newValue.value)
                }
            }}
            />
            </div>
            <div className="col-5">
            <p><b>Retailer Category</b></p>
            <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={(newValue)=>{
                if((selectedCategory==null)||(selectedCategory.id!=newValue.value)){
                    setSelectedCategory(newValue)
                    let category = allCategories.find(i=>i.id==newValue.id)
                    setRetailerAttribute([])
                    setExcelAttributes([])
                    setRetailerAttribute(JSON.parse(category.attibutes))
                    setExcelAttributes(JSON.parse(category.mappedAttribute))
                    setUniqueAttribute(category.uniqueAttribute)
                }
            }}
             />
            </div></Row>
        </div> */}
            {/* <DynamicSelectMap
                attrValue={excelAttributes}
                uniqueAttribute={uniqueAttribute}
                attrSystemList={attrSystemList}
                nextClicked={goToStep}
                existsOrgRetailer={existsOrgRetailer}
                cancelClicked={cancelClicked}
            /> */}
            <div>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    values.friends[0][uniqueAttribute]
                    // if (values.friends[0][uniqueAttribute] != null && values.friends[0][uniqueAttribute] != "") {
                        goToStep(values)
                    // } else {

                    //     validToastHeading = "Map your Attribute"
                    //     validToastContent = "You must Map this " + `'${uniqueAttribute}'` + " Attribute"
                    //     validTitleBackgroundColor = VALID_BG_COLOR
                    //     validToastSize = MEDIUM
                    //     setIsValidateToastMsg(true)
                    // }

                }}
                render={({ values, errors, touched, handleReset, setFieldTouched, setFieldValue }) => {
                    return (
                        <Form>
                            <div className="map-attr-container mt-2 pt-3 pl-2">
            <Row>
            <div className="col-5">
            <p>Retailer</p>
            <Select 
            options={retailerOptions}
            value={selectedRetailer}
            onChange={(newValue)=>{
                if((selectedRetailer==null)||(selectedRetailer.value!=newValue.value)){
                    let retailer = allRetailers.find(i=>i.id==newValue.value)
                    setSelectedRetailerValue(retailer)
                    setSelectedRetailer(newValue)
                    setRetailerAttribute([])
                    setExcelAttributes([])
                    setTimeout(()=>{
                        if(retailer.isCommonAttribute){
                        setRetailerAttribute(retailer.attributes?JSON.parse(retailer.attributes):[])
                    setExcelAttributes(retailer.mappedAttribute?JSON.parse(retailer.mappedAttribute):[])
                        }
                    },2000)
                    retailer.isCommonAttribute?null:props.getRetailerCategories(null,newValue.value)
                }
            }}
            />
            </div>
            <div className="col-5">{!selectedRetailerValue.isCommonAttribute?<>
            <p>Retailer Category</p>
            <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={(newValue)=>{
                if((selectedCategory==null)||(selectedCategory.id!=newValue.value)){
                    if(selectedCategory.value!=newValue.value){
                    setSelectedCategory(newValue)
                    let category = allCategories.find(i=>i.id==newValue.value)
                    setRetailerAttribute([])
                    setExcelAttributes([])
                    setTimeout(()=>{
                        setRetailerAttribute(category.attibutes?JSON.parse(category.attibutes):[])
                    setExcelAttributes(category.mappedAttribute?JSON.parse(category.mappedAttribute):[])
                    setUniqueAttribute(category.uniqueAttribute)
                    },2000)
                    
                    }
                }
            }}
             /></>:<></>}
            </div>
            <div className="col-2">
            <div style={{textAlign:'center',marginTop:'1.3rem'}}>
                                <div className="adjust-import-next-button">
                                    {authJson["46"].isEnabled?<Button style={{height:"38px"}} type="submit" className="map-attribute" label={"Map Attributes"} />:null}
                                </div>
                                {/* <div className="adjust-import-cancel-button mr-2">
                                    <Button
                                        onClick={() => {
                                            props.cancelClicked()
                                        }}
                                        label={i18n.t("importdata.cancel")}
                                    />
                                </div> */}
                            </div>
                </div></Row>
        </div>
                            
                            <FieldArray
                                name="friends"
                                render={({ insert, remove, push }) => (
                                    <>
                                        {values.friends.length > 0 ?
                                            values.friends.map((friend, index) => (
                                                <>
                                                 <div className="map-attr-fieldarray-container row m-0 mt-4" >
                                                    
                                                    {Object.entries(friend).map(([key, val]) => (
                                                       
                                                            <div className="col-4 mt-2">
                                                                {/* <Row> */}
                                                                <label key={key}>{key}</label>
                                                                {/* </Row> */}
                                                            {/* </div>
                                                            <div className="col mt-4"> */}
                                                            {/* <Row> */}
                                                                <CustomSelect
                                                                    // name={`friends.${index}.${key}`}
                                                                    value={val!=''?val:null}
                                                                    options={attrSelect.filter(i=>i.type==(retailerAttribute.find(i=>i.name==key)?retailerAttribute.find(i=>i.name==key).type:null))}
                                                                    onChange={(selectedAttr) => {
                                                                        setFieldTouched(`friends.${index}.${key}`, true);
                                                                        setFieldValue(`friends.${index}.${key}`, selectedAttr ? selectedAttr.id : "");
                                                                    }}
                                                                />
                                                            <div className="validation-error-msg">
                                                                <ErrorMessage name={`friends.${index}.${key}`} />
                                                            </div>
                                                                {/* <ReactSelect
                                                                value={attrSelect.find((i)=>i.id==val)}
                                                                options={attrSelect}
                                                                onChange={(attrSelect) => {
                                                                    setFieldTouched(`friends.${index}.${key}`, true);
                                                                    setFieldValue(`friends.${index}.${key}`, attrSelect ? attrSelect.id : "");
                                                                }} */}
                                                                {/* /> */}
                                                                {/* </Row> */}
                                                            
                                                        </div>
                                                    ))}
                                                    </div>
                                                </>
                                            )):
                                            <>
                                            {/* <div style={{fontWeight:600,paddingTop:"18%",textAlign:"center"}}>Attributes are not available</div> */}
                                            </>}

                                    </>
                                )}
                            />
                            <br />
                            
                        </Form>
                    );
                }}
            />
            <ToastModal
                show={isValidateToastMsg}
                title={validToastHeading}
                titleBackgroundColor={validTitleBackgroundColor}
                content={validToastContent}
                size={validToastSize}
                onModalHide={handleValidToastHide}
            />
        </div >
            <ToastModal
                show={isToastMsg}
                title={toastHeading}
                titleBackgroundColor={titleBackgroundColor}
                content={toastContent}
                size={toastSize}
                onModalHide={handleToastHide}
            />
        </div>
    )
}
export default connect(mapStateToProps)(RetailerAttributeMap)