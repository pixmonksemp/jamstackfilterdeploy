import React, { useState, useEffect } from "react"
import { PickList } from "primereact/picklist"
import "./style.scss"
import { connect } from "react-redux"
import ApiConnector from "../../../../common/hoc/api-connector"
import { resources } from "../../../../common/common-api-constants"
import { PIM_API } from "../../../../common/common-constants"
import { getApiRequestObject , getAttributeGroupObject } from "../../../../common/master-data"
import { optionStylesForAssignAttributes , ValueContainer} from "../../../searchable-select/searchable-dropdown-constant"
import Alerticon from "../../../../assets/exclamationIcon.svg"
import { Container, Row, Col, Card, Spinner } from "react-bootstrap"
import Select, { components } from "react-select";
import makeAnimated from "react-select/animated"
import i18n from "../../../../translate/i18n"

const mapStateToProps = (state) => {
  return {
    getUserDetail: state.userDetail.getUsersObj.userCredentials,
  }
}

function Assignattribute(props) {
  let getUserDetail = props.getUserDetail && props.getUserDetail.organizationid
  const [source, setSource] = useState([])
  const [sourceReplace,setSourceReplace] = useState([])
  const [target, setTarget] = useState([])
  const [sourceAttrGrpData, setSourceAttrGrpData] = useState([])
  const [targetAttrGrpData, setTargetAttrGrpData] = useState([])
  const [status, setStatus] = useState("")
  const [selectedGroup, setSelectedGroupForTarget] = useState("")
  const [selectedSourceGroup, setSelectedGroupForSource] = useState(null)
  const [selectItemName, setSelectedItemName] = useState(null)
  const [isClearable, setIsClearable] = useState(false)
  const [matchAttrGrp, setMatchAttrGrp] = useState([])
  const [overAllAttrListReplace, setOverAllAttrListReplace] = useState(null)
  const [isLoader, setIsLoader] = useState(true)
  const animatedComponents = makeAnimated()

  useEffect(() => {
    getAttributeGroupObject.organizationId = getUserDetail
    getAttributeGroupObject.pageEnd = 3000
    getAttributeGroupObject.sortField = "attrGrpName"
    getAttributeGroupObject.sortType = "ASC"
    props.getAttributeGroupData(getAttributeGroupObject)
    getApiRequestObject.pageStart = 0
    getApiRequestObject.pageEnd = 3000
    getApiRequestObject.sortField = "attrName"
    getApiRequestObject.sortType = "ASC"
    getApiRequestObject.organizationId = getUserDetail
    getApiRequestObject.attrName = ""
    props.getManageAttribute(getApiRequestObject) 
    setIsLoader(true)
  }, [])

  useEffect(() => {
    const { getManageAttributeResult } = props
    if (
      getManageAttributeResult &&
      getManageAttributeResult.content &&
      getManageAttributeResult.content.data &&
      getManageAttributeResult.content.data.attributes
    ) {
      let AttributeGroupData =
      getManageAttributeResult.content.data.attributes.map((i) => {
          let value = {
            id: i.id,
            name: i.attrName,
            attrDescription: i.attrDescription,
            attrGrpName: i.attrGrpName,
            attrName: i.attrName,
            attrType: i.attrType,
            isMandatory: i.isMandatory,
            version: i.version,
          }
          return value
        })
      setOverAllAttrListReplace(AttributeGroupData)
      setSource(AttributeGroupData)
      setIsLoader(false)
    }
  }, [props.getManageAttributeResult])

  useEffect(() => {
    const { getAttributeGroupDataResult } = props
    if (
      getAttributeGroupDataResult &&
      getAttributeGroupDataResult.content &&
      getAttributeGroupDataResult.content.data &&
      getAttributeGroupDataResult.content.data.attributeGroups
    ) {
      let AttributeGroupData =
        getAttributeGroupDataResult.content.data.attributeGroups.map((item) => {
          let value = {
            value: item.id,
            label: item.attrGrpName,
          }
          return value
        })
      setSourceAttrGrpData(AttributeGroupData)
      setTargetAttrGrpData(AttributeGroupData)
    }
  }, [props.getAttributeGroupDataResult])

  useEffect(() => {
    const { getAttributesResult } = props
    if (
      getAttributesResult &&
      getAttributesResult.content &&
      getAttributesResult.content.status == 200 &&
      getAttributesResult.content.data
    ) {
      let values = getAttributesResult.content.data
      let tooltipValues = values.map((i) => {
        return {
          id: i.id,
          name: i.attrName,
          attrDescription: i.attrDescription,
          attrGrpName: i.attrGrpName,
          attrName: i.attrName,
          attrType: i.attrType,
          isMandatory: i.isMandatory,
          version: i.version,
        }
      })
      if (status == "source") {
        setSource(tooltipValues)
        setSourceReplace(tooltipValues)
        setStatus("")
        setIsLoader(false)
      } else {
        setMatchAttrGrp(tooltipValues)
        setTarget(tooltipValues)
        setStatus("")
        setIsLoader(false)
      }
    }
  }, [props.getAttributesResult])

  // const loader = () => {
  //   return (
  //     <span class="container-loader">
  //       <div class="circle circle-1"></div>
  //       <div class="circle circle-2"></div>
  //       <div class="circle circle-3"></div>
  //       <div class="circle circle-4"></div>
  //       <div class="circle circle-5"></div>
  //     </span>
  //   )
  // }

  const onChange = (event) => {
    if (selectedGroup != "" || target.length > 0) {
        setSource(event.source)
        setTarget(event.target)
    }
  }
 
  const changeAttrGroup = () => {
    let attributefinalData = []
    let targetSelection = target.length > 0 ? target.filter(function (obj) {return matchAttrGrp.indexOf(obj) === -1}) : []
    targetSelection &&
      targetSelection.map((attr) => {
        if(attr != "null"){
        let attributeDetail = attr
        attributeDetail.attrGrpId = selectedGroup
        attributeDetail.attrGrpName = selectItemName ? selectItemName : "pix System"
        attributeDetail.timeZone =
          Intl.DateTimeFormat().resolvedOptions().timeZone
        attributeDetail.organizationId = getUserDetail
        attributefinalData.push(attributeDetail)
   }})
    props.changeAttrGroup(selectedGroup, attributefinalData)
  }

  const renderSourceTemplate = (sources) => {
    return (
      <>
        {/* {isLoader && sources == "null"? (
          <div className="product-item">
          <div className="product-list-detail">
            {loader()}
          </div>
        </div>
        ) : (  */}
        {/* sources && sources != "null" && */}
          <div className="product-item">
          <div className="product-list-detail">
            {sources && sources.name ? sources && sources.name : null}
          </div>
         </div>
        {/* //  :
        //  <div className="product-item">
        //  <div className="product-list-detail">
        //    {"No Data Found"}
        //  </div>
        // </div>
        )} */}
      </>
    )
  }

  const renderTargetTemplate = (targets) => {   
    return (
      <> 
       {/* {isLoader && targets == "null" ? (
        <div className="product-item">
          <div className="product-list-detail">
            {loader()}
          </div>
        </div>
        ) : (    */}
        {/* targets && targets != "null" && */}
          <div className="product-item">
            <div className="product-list-detail">
              <span className="mb-2">
                {targets && targets.name ? targets && targets.name : null}
              </span>
            </div>
          </div>
        {/* )} */}
      </>
    )
  }

  const sourceHeader = () => {
    return (
      <React.Fragment>
        <div className="pick-header-content">
          <h6>
            <span>Attributes</span>
          </h6>
        </div>
        <div className="pick-react-select">
          <Select
            className="basic-single"
            classNamePrefix="pick-select"
            placeholder={"Search Attribute Group"}
            isClearable={isClearable}
            name="attrGroupSource"
            options={sourceAttrGrpData.filter((data) => data.value != selectedGroup)}
            components={{
              ValueContainer,
              animatedComponents,
            }}
            styles={optionStylesForAssignAttributes}
            onChange={(e) => {
              if (e && e.value) {
                setStatus("source")
                setSelectedGroupForSource(e && e.value)
                props.getAttributes(null, e && e.value)
              } else {
                setSource([])
                setTargetAttrGrpData([])
                props.getAttributeGroupData(getAttributeGroupObject)
              }
            }}
          />
        </div>
      </React.Fragment>
    )
  }

  const destinationHeader = () => {
    return (
      <React.Fragment>
        <div className="pick-header-content">
          <h6>
            <span>Selected Attribute Group</span>
          </h6>
        </div>
        <div className="pick-react-select">
          <Select
            className="basic-single"
            placeholder={"Search Attribute Group"}
            classNamePrefix="select"
            isClearable={isClearable}
            isDisabled={sourceAttrGrpData.length > 0 ? false : true}
            styles={optionStylesForAssignAttributes}
            name="attrGroupTarget"
            components={{
              ValueContainer,
              animatedComponents,
            }}
            options={targetAttrGrpData.filter((data) => data.value != selectedSourceGroup)}
            onChange={(e) => {
              if (e && e.value) {
                selectedSourceGroup ? setSource(sourceReplace) : setSource(overAllAttrListReplace)
                setTarget([])
                setMatchAttrGrp([])
                setSelectedItemName(e && e.label)
                setSelectedGroupForTarget(e && e.value)
                props.getAttributes(null, e && e.value)
              } else {
                setTarget([])
                setSourceAttrGrpData([])
                props.getAttributeGroupData(getAttributeGroupObject)
                setSelectedGroupForTarget("")
                setSelectedItemName(null)
              }
            }}
          />
        </div>
      </React.Fragment>
    )
  }

  return (
    <div className="picklist">
      {isLoader ?
       <Card className="loading-image-attributes">
       <center>
         <Card.Body>
           <Spinner animation="grow" className="spinner" />
         </Card.Body>
       </center>
     </Card>
     :
     <>
      <div className="card">
        <PickList
          source={[...new Map(source && source.map(source => [JSON.stringify(source), source])).values()]}
          target={[...new Map(target && target.map(target => [JSON.stringify(target), target])).values()]}
          className={"picklist-template"}
          sourceItemTemplate={renderSourceTemplate}
          targetItemTemplate={renderTargetTemplate}
          sourceHeader={sourceHeader}
          targetHeader={destinationHeader}
          metaKeySelection={true}
          targetSelection={target.length > 0 ? target.filter(function (obj) {return matchAttrGrp.indexOf(obj) === -1;}):null}
          sourceStyle={{ height: "321px"}}
          targetStyle={{ height: "321px"}}
          showSourceControls={false}
          showTargetControls={false}
          onChange={onChange}
        />
      </div>
      <div>
        <Container className="mt-2 attr-footer" fluid>
          <Row>
            <Col>
              <div>
                <img src={Alerticon} />
                <span className="ml-2 pim-font-property-assign-group">
                   {selectItemName && selectItemName}
                </span>
                {/* <span className="pim-font-property">
                  {selectItemName ? selectItemName : null}
                </span> */}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="d-flex justify-content-center pb-4">
                <button
                  type="button"
                  onClick={props.hideDialog}
                  className="pim-btn pim-btn-primary pim-font-property"
                >
                  {i18n.t("commonButton.cancel")}
                </button>
                <button
                  type="submit"
                  className="pim-btn pim-btn-main pim-font-property ml-2"
                  onClick={changeAttrGroup}
                  isDisabled={selectItemName && sourceAttrGrpData.length > 0 ? false : true}
                >
                  {"Submit"}
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      </>}
    </div>
  )
}

export default connect(mapStateToProps)(ApiConnector(Assignattribute, {
    methods: {
      getAttributeGroupData: {
        type: resources.httpMethod.POST,
        url: PIM_API + "/getAttributeGroups",
      },
      getAttributes: {
        type: resources.httpMethod.GET,
        url: PIM_API + "/getAttributesByGroupID",
      },
      getManageAttribute: {
        type: resources.httpMethod.POST,
        url: PIM_API+'/getAttributes',
      },
    },
  })
)
