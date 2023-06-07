import React, { useEffect, useState } from "react"
import { GROUP, PIM_API } from "../../../../common/common-constants"
import i18n from "../../../../translate/i18n"
import { Container, Row, Col } from "react-bootstrap"
import { ListBox } from 'primereact/listbox'
import AlertIcon from "../../../../assets/alert-icon.svg"
import GroupIcon from "../../../../assets/groupassign.svg"
import ApiConnector from "../../../../common/hoc/api-connector"
import { resources } from "../../../../common/common-api-constants"
import {
    getApiRequestObject,
    } from "../../../../common/master-data"
    let attributeGridData = [];
    import InfiniteScroll from "react-infinite-scroll-component";

function UpdateAttributeGroup(prop) {

    const [selectedGroup, setSelectedGroup] = useState(null)
    const [selectItemName, setSelectedItemName] = useState(null)
    const [attributeList, setAttributeList] = useState([])
    const [allAttributes,setAllAttributes] = useState([])
    const [selectedAttributes,setSelectedAttributes] = useState(null)
    const [allChecked,setAllChecked] = useState(false)
    const [show,setShow] = useState(false)
    const [fetchMore,setFetchMore] =useState(false)
    const [searchKeys,setSearchKeys] = useState("")
    const [totalRecords,setTotalRecords] = useState(50)
    const attrListStyle = { maxHeight: '300px', minHeight: '300px' }
    const attrGroupListStyle = { maxHeight: '300px', minHeight: '300px' }
    const listBoxStyle = { width: '240px' }
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    let AttributeArray = prop.attributeData && prop.attributeData.map((attr) => {
        let value = {
            id: attr.id,
            name: attr.attrName
        }
        return value
    })
    useEffect(() => {
        prop.attrGrpDataObj
        prop.attributeData
    }, [])

    useEffect(() => {
        getApiRequestObject.pageStart = 0
        getApiRequestObject.pageEnd = 50
        getApiRequestObject.organizationId = prop.userDetails.organizationid
        getApiRequestObject.sortField = "attrName"
        getApiRequestObject.sortType = "ASC"
        prop.getManageAttribute(getApiRequestObject)
      }, [])

      useEffect(()=>{
        const {getManageAttributeResult,searchGridAttributeGroupResult} = prop
        if (
            getManageAttributeResult && getManageAttributeResult.content &&
            getManageAttributeResult.content.data && getManageAttributeResult.content.data.attributes ||
            searchGridAttributeGroupResult && searchGridAttributeGroupResult.content
            &&searchGridAttributeGroupResult.content.data && searchGridAttributeGroupResult.content.data.attributes
          ) {
            let attributlist;
            if(getManageAttributeResult &&  getManageAttributeResult.content &&
                getManageAttributeResult.content.data && getManageAttributeResult.content.data.attributes&&
                getManageAttributeResult.content.data.attributes.length){
                attributlist = getManageAttributeResult.content.data.attributes
                setTotalRecords(getManageAttributeResult.content.data.totalElement)
            }
            else{
                setTotalRecords(searchGridAttributeGroupResult.content.data.totalElement)
                attributlist = searchGridAttributeGroupResult.content.data.attributes
            }            
            if(fetchMore){
                attributlist =
                 allAttributes.concat(attributlist)
                 setFetchMore(false)
            }         
            
            AttributeArray =
            attributlist.map((item) => {
              const dataValue = {}
                Object.assign(dataValue, {
                    id: item.id,
                    name: item.attrName,
                    isChecked: false,
                    attrGrpName: item.attrGrpName,
                    attrName: item.attrName,
                    attrType: item.attrType,
                    attrDescription: item.attrDescription,
                    version: item.version,
                    attrGrpId: item.attrGrpId,
                    organizationId: item.organizationId,
                    isMandatory: item.isMandatory,           
                })
                return dataValue
              })
              prop.attributeData =  AttributeArray
              setAllAttributes(AttributeArray)
          }
      },[prop.getManageAttributeResult,prop.searchGridAttributeGroupResult])

    useEffect(()=>{
        const {getAttributesResult} = prop
        if(getAttributesResult&&
            getAttributesResult.content&&
            getAttributesResult.content.status==200&&
            getAttributesResult.content.data){
                let values = getAttributesResult.content.data
                let tooltipValues = values.map((i)=>{
                    return {
                        id: i.id,
                        name: i.attrName
                    }
                })
                setAttributeList(tooltipValues)
                setShow(true)
            }

    },[prop.getAttributesResult])

    // Final Submit
    const changeAttrGroup = () => {
        let attributefinalData = []
        allAttributes && allAttributes.map((attr) => {
            if (attr.isChecked) {
                let attributeDetail = attr
                attributeDetail.attrGrpId = selectedGroup
                attributeDetail.timeZone = timeZone
                attributeDetail.organizationId = prop.userDetails.organizationid
                attributefinalData.push(attributeDetail)
            }
        })
        prop.changeAttrGroup(selectedGroup, attributefinalData)
    }

    //checkbox check and uncheck functionality
    const handleChangecheck = (e) =>{
            let itemName = e.target.name;
            let checked = e.target.checked;
              let  list, allChecked ;
              if (itemName === "checkAll") {
                allChecked = checked;
                list = allAttributes.map(item => ({ ...item, isChecked: checked }));
              }
              else {
                list = allAttributes.map(item =>
                  item.name === itemName ? { ...item, isChecked: checked } : item
                );
                allChecked = list.every(item => item.isChecked);
              }
             
              setAllAttributes(list)
              setAllChecked(allChecked)
             // setSelectedAttributes(list)
    }

    const attributeSearch = (e) => {
        setFetchMore(false)
        setSearchKeys(e.target.value)
        if (e.target.value == "") {
            getApiRequestObject.pageStart = 0
            getApiRequestObject.pageEnd = 50
            getApiRequestObject.organizationId = prop.userDetails.organizationid
            getApiRequestObject.sortField = "attrName"
            getApiRequestObject.sortType = "ASC"
            getApiRequestObject.attrName =""
            prop.getManageAttribute(getApiRequestObject)
        }
        else {
            getApiRequestObject.pageStart = 0
            getApiRequestObject.pageEnd = 50
            getApiRequestObject.sortField = "attr_name"
            getApiRequestObject.organizationId = prop.userDetails.organizationid
            getApiRequestObject.attrName = e.target.value && e.target.value.trim().toLowerCase()
            prop.searchGridAttributeGroup(getApiRequestObject) 
        }
    }

    //Scroll API Call
    const fetchMoreData = ()=>{
        setFetchMore(true)
        if (searchKeys == "") {
            getApiRequestObject.pageStart = getApiRequestObject.pageStart + 1
            getApiRequestObject.pageEnd = 50
            getApiRequestObject.organizationId = prop.userDetails.organizationid
            getApiRequestObject.sortField = "attrName"
            getApiRequestObject.sortType = "ASC"
            getApiRequestObject.attrName =""
            prop.getManageAttribute(getApiRequestObject)  
        }
        else {
            getApiRequestObject.pageStart = getApiRequestObject.pageStart + 1
            getApiRequestObject.pageEnd = 50
            getApiRequestObject.sortField = "attr_name"
            getApiRequestObject.organizationId = prop.userDetails.organizationid
            getApiRequestObject.attrName = searchKeys && searchKeys.trim().toLowerCase()
            prop.searchGridAttributeGroup(getApiRequestObject)  
        }
    }  

    const attrListTemplate = (option,type) => {
        // let target
        if(option && option.value == selectedGroup && selectedGroup){setSelectedItemName(option.name)}
        return (
                    <div className="country-item">
                <div className="pim-font-property">
                    <label>
                        <input className="list-checkbox"
                            key={option.id}
                            type="checkbox"
                            name={option.name}
                            value={option.name}
                            checked={option.isChecked}
                            onChange={handleChangecheck}
                        />{option.name}</label>
                        {/* {type=='group'?<i  onClick={() => {
                                prop.getAttributes(null, option.id)
                        }} style={{ float: "right" }} class="fa fa-eye eye-icon" aria-hidden="true"></i>:''} */}
                        </div>   
                </div>
        );
    }
    const attrGrpListTemplate = (option,type) => {
        // let target
        if(option && option.value == selectedGroup && selectedGroup){setSelectedItemName(option.name)}
        return (
            <div className="country-item">
                <div className="pim-font-property">{option.name}
                    {type=='group'?<i  onClick={() => {
                            prop.getAttributes(null, option.id)
                    }} style={{ float: "right" }} class="fa fa-eye eye-icon" aria-hidden="true"></i>:''}</div>   
            </div>
        );
    }
 
    return (
        <>       
        {!show?<>
            <div id="attr-list-container">
            <div className="flex flex-column pl-3 pt-2 pr-1 attribute-group">
                    <h6 htmlFor="attrType" className="pim-font-property">
                        {i18n.t("fieldName.attrGrpName")} ({prop.attrGrpDataObj ? prop.attrGrpDataObj.length : ""})
                    </h6>
                    <div className="attr-group-list">
                        <ListBox
                            value={selectedGroup}
                            options={prop.attrGrpDataObj}
                            itemTemplate={(e)=>{return attrGrpListTemplate(e,"group")}}
                            onChange={(e) => {setSelectedGroup(e.value)}}
                            optionLabel="name"
                            filter
                            filterPlaceholder={i18n.t("placeholder.searchGroupName")}
                            listStyle={attrGroupListStyle}
                            style={listBoxStyle} />
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center"> 
                    <img src={GroupIcon} alt="IMAGE" width="42px" height="42px"/>
                </div>      
                <div className="flex flex-column pl-1 pt-2 pr-1 attribute-group">
                    <h6 htmlFor="attrType" className="pim-font-property">
                        {i18n.t("fieldName.selectedAttrName")} ({prop.attributeData ? prop.attributeData.length : ""})
                    </h6>
                    <div className="attr-list attr-group-list">
                    <div className="p-listbox p-component" style={listBoxStyle}>
                    <div class="p-listbox-header"><div class="p-listbox-filter-container">
                        <input type="text" class="p-inputtext p-component p-listbox-filter" 
                        placeholder="Search attribute name" onKeyUp={e=>{attributeSearch(e)}} />
                        <span class="p-listbox-filter-icon pi pi-search"></span></div></div>
                        {/* <div>
                            <label>
                                <input
                                type="checkbox"
                                name="checkAll"
                                checked={allChecked}
                                onChange={handleChangecheck}
                                />
                                select all
                            </label>
                        </div> */}
                      
                       <div className="p-listbox-list-wrapper" id="scrollable" style={attrListStyle}>
                       <InfiniteScroll
                        dataLength={allAttributes.length}
                        scrollableTarget="scrollable"
                        next={fetchMoreData}
                        hasMore={allAttributes.length == totalRecords ? false:true}
                        >
                        <div className="p-listbox-list">
                        {
                         allAttributes && allAttributes.map((atttribute)=>{
                            return (
                                <div className="p-listbox-item">
                                  <label className="list-label pim-font-property">
                                    <input
                                      className="list-checkbox"
                                      key={atttribute.id}
                                      type="checkbox"
                                      name={atttribute.name}
                                      value={atttribute.name}
                                      checked={atttribute.isChecked}
                                      onChange={handleChangecheck}
                                    />
                                    {atttribute.name}</label>
                                </div>
                              )
                        })                        
                        }
                        </div>
                        </InfiniteScroll>
                        </div>
                        
                        </div>                       
                    </div>
                </div>
            </div>
            <Container className="mt-4 attr-footer" fluid>
                <Row className="mt-4 mb-4">
                    {/* <Col className="d-flex flex-row justify-content-between align-items-center"> */}
                    <Col>
                        <div><img src={AlertIcon} />
                            <span className="ml-2 pim-font-property" ><b>{selectItemName && selectItemName} </b></span>
                            <span className="pim-font-property">{selectItemName && selectItemName ? i18n.t("attributePopupHeaders.selected") : ""}</span>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="d-flex justify-content-center pb-4">
                            <button
                                type="button"
                                onClick={prop.hideDialog}
                                className="pim-btn pim-btn-primary pim-font-property"
                            >
                                {i18n.t("commonButton.cancel")}
                            </button>
                            <button
                                type="submit"
                                className="pim-btn pim-btn-main pim-font-property ml-2"
                                onClick={changeAttrGroup}
                            >
                                {prop.event === GROUP ? i18n.t("commonButton.group") : null}
                            </button>
                        </div>
                    </Col>
                </Row>
            </Container></>: 
                <>
                    <label className="arrow-back" onClick={() => { setShow(!show) }}><i class="fa fa-angle-left arrow-back" aria-hidden="true"></i>{' Back'}</label>
                    {/* <Button onClick={() => { setShow(!show) }}>Back</Button> */}
                    <div id="attr-list-container" className="mb-6" style={{textAlign: '-webkit-center'}}>
                        <div className="flex flex-column pl-1 pt-2 pr-1 attribute-group">
                            <h6 htmlFor="attrType" className="pim-font-property">
                                {'"'+selectItemName+'" Attributes List'}
                            </h6>
                            <div className="attr-list attr-grp-attr-list">
                                <ListBox
                                    options={attributeList}
                                    optionLabel="name"
                                    listStyle={attrListStyle}
                                    itemTemplate={(e)=>{return attrListTemplate(e)}}
                                    style={listBoxStyle} />
                            </div>
                        </div>
                    </div></>}
        </>
    )
}

export default ApiConnector(UpdateAttributeGroup,{
    methods:{
        getAttributes: {
			type: resources.httpMethod.GET,
			url: PIM_API+'/getAttributesByGroupID'
		},
        getManageAttribute: {
			type: resources.httpMethod.POST,
			url: PIM_API+'/getAttributes',
		},
        searchGridAttributeGroup:{
          type: resources.httpMethod.POST,
          url: PIM_API+'/attributeSearch'
        }
    }
})