import React, { useState, useEffect, useRef } from "react"
import { Card, Col, Form, Row, Spinner } from "react-bootstrap"
import i18n from "../../../translate/i18n"
import PREVIEW from "../../../assets/no_preview.png"
import VIDEO_PREVIEW from "../../../assets/video_preview.png"
import Select from "react-select"
import CreatableSelect from "react-select/creatable"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { connect } from "react-redux"
import ApiConnector from "../../../common/hoc/api-connector"
import { resources } from "../../../common/common-api-constants"
import { PIM_API } from "../../../common/common-constants"
import EditPencilIcon from "../../../assets/edit_icon.svg"
import { UpdateAssetMetaTag } from "../../../common/master-data"
import { Formik } from "formik"
import { optionStylesForAssetDetails, optionStylesForAssignAttributes } from "../../searchable-select/searchable-dropdown-constant"
import PDF_PREVIEW from "../../../assets/PDf.png"

const mapStateToProps = (state) => {
  return {
    getFilterDataValue: state.stateData.getFilterdata,
    getUserDetail: state.userDetail.getUsersObj.userCredentials,
  }
}

function AssetDetails(props) {
  const {getFilterDataValue , getUserDetail } = props
  let userDetails = getUserDetail,
    userDetail =
      userDetails &&
      userDetails.organizationid &&
      parseInt(userDetails.organizationid),
  authJson = JSON.parse(sessionStorage.getItem("authJson"))
  const ref = useRef(null)
  const [data, setData] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [metaTagData, setMetaTagData] = useState([])
  const [renderTagOption, setRenderTagOption] = useState(null)
  const [isEditBtnDisabled, setIsEditBtnDisabled] = useState(false)
  const [isDropDownDisabled, setIsDropDownDisabled] = useState(true)
  const requestMetaTagData ={
    organizationId : userDetail,
    pageStart : 0,
    pageEnd : 1000,
    sortField : "tag",
    sortType : "ASC" 
  }

  let assetDetails = data && data.assetDetails && JSON.parse(data.assetDetails),
  AssetMetaTag =  metaTagData.length > 0 && metaTagData.map((i) =>{return i.label })

  useEffect(() => {
    props.getAssetById(null, props.data.id)
    props.getMasterTags(requestMetaTagData)
  }, [])

  useEffect(() => {
    if(props.editFlag){
    props.getAssetById(null, props.data.id)
    // props.setEditFlag(false)
    }
  }, [props.editFlag])

  useEffect(() => {
    const { getAssetByIdResult } = props
    if (
      getAssetByIdResult &&
      getAssetByIdResult.content &&
      getAssetByIdResult.content.status == "200"
    ) {
      setData(getAssetByIdResult.content.data)
      setTimeout(setIsEditBtnDisabled(true), 5000); 
    
      let FilteredTags = getAssetByIdResult.content && getAssetByIdResult.content.data && getAssetByIdResult.content.data.assetDetails &&
      JSON.parse(getAssetByIdResult.content.data.assetDetails)
      setMetaTagData(FilteredTags.tags.map((i) => {return { label: i, value: i }}))
    }
    if (
      getAssetByIdResult &&
      getAssetByIdResult.content &&
      getAssetByIdResult.content.status != "200"
    ) {
      if(getAssetByIdResult.content.data.code == "101" && getAssetByIdResult.content.data.description == "No value present"){
          props.setIsValuePresent(true)
      }else{
          props.setIsToastMsgs(true)
      }
    }
  }, [props.getAssetByIdResult])

  useEffect(() => {
    const { getMasterTagsResult } = props
    if (
      getMasterTagsResult &&
      getMasterTagsResult.content &&
      getMasterTagsResult.content.status == "200"
    ) {
      let TagData =
        getMasterTagsResult.content.data &&
        getMasterTagsResult.content.data.content.map((data) => {
          const dataValue = {}
          Object.assign(dataValue, {
            label: data.tag,
            value: data.tag,
          })
          return dataValue
        })
      setIsDropDownDisabled(false)
      setRenderTagOption(TagData)
    }
  }, [props.getMasterTagsResult])

  /**
   * This method is used to check url type is video or not.
   * @param {*} url
   * @returns
   */
  const validateExtension = (url) => {
    let format = url && url.toUpperCase()
    let formatText = "VIDEO"
    if (format == formatText) {
      return true
    } else {
      return false
    }
  }

  const bytesToKbConvertor = (fileSize) =>{
    if (fileSize) {
      return (fileSize/1024) + " KB"
    }else{
      return fileSize + " KB"
    }
   }

   
   const Filter_loading = () => {
    return <Spinner variant="dark" animation="border" className="spinner" size="sm" />
  }

  const metaTagDataSave = () => {
    if(isEditBtnDisabled){
    UpdateAssetMetaTag.pimerceOrgId = getFilterDataValue.organization.id
    UpdateAssetMetaTag.id = data.id ? data.id : null
    UpdateAssetMetaTag.version = data.version ? data.version : 0
    UpdateAssetMetaTag.assetType = data.assetType ? data.assetType : ""
    UpdateAssetMetaTag.assetName = data.assetName ? data.assetName : ""
    UpdateAssetMetaTag.assetSize = assetDetails.assetSize? assetDetails.assetSize : 0
    UpdateAssetMetaTag.locale = userDetail
    UpdateAssetMetaTag.organizationId = userDetail
    UpdateAssetMetaTag.assetBaseUrl = ""
    UpdateAssetMetaTag.uploadedUrl= data.uploadedUrl ? data.uploadedUrl : ""
    UpdateAssetMetaTag.metaTags = AssetMetaTag.length > 0 ? AssetMetaTag : []
    UpdateAssetMetaTag.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    UpdateAssetMetaTag.assetExtension = data.assetExtension ? data.assetExtension : ""
    props.metaTagDataSave(UpdateAssetMetaTag)
    // setMetaTagData([])
    }
  }

  const handleSubmit = event => {
    event.preventDefault(); // prevent page refresh
  };

  const editMetaTags = () => {
    return (
      <Formik
        innerRef={ref}
        enableReinitialize={true}
        initialValues={{
          tags: metaTagData,
        }}
      >
        {({ setFieldValue , values }) => (
        <Form onSubmit={handleSubmit}>  
          <CreatableSelect
            isMulti
            name="tags"
            value={values.tags}
            style={optionStylesForAssetDetails}
            options={renderTagOption}
            isClearable={true}
            className="multiSelectTags"
            classNamePrefix="select"
            onFocus={(e)=>{
              const requestData ={
                organizationId : userDetail,
                pageStart : 0,
                pageEnd : 1000,
                sortField : "tag",
                sortType : "ASC" 
              }
              props.getMasterTags(requestData)
            }}
            onChange={(e) => {
              if (e == null) {
                setMetaTagData([])
              }else{
                setMetaTagData(e)
              }
            }}
          />
          </Form>
        )}
      </Formik>
    )
  }

  return (
    <div>
      <Row>
        <Col>
          <Card>
            <div className="asset-detail-popup-content">
              {/* Check if assetType is video or not */}
              {validateExtension(assetDetails && assetDetails.assetType) ? (
                <video controls autoplay="autoplay">
                  <source
                    src={
                      data && data.uploadedUrl
                        ? data && data.uploadedUrl + "?" + Math.random()
                        : VIDEO_PREVIEW
                    }
                  ></source>
                </video>
              ) : (
                <LazyLoadImage
                src={
                  data && data.uploadedUrl
                    ? data.assetType === 'DOCUMENT'
                      ? data.assetExtension && data.assetExtension.toUpperCase() === 'PDF'
                        ? PDF_PREVIEW
                        : PREVIEW
                      : data.uploadedUrl + "?" + Math.random()
                    :  Filter_loading()
                }
                onError={(e) => {
                  e.target.src = PREVIEW
                }}
                alt=""
                effect="blur"
                width="200x"
                height="200px"
              />
            )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xl={9}></Col>
        <Col xl={3}>
          {data && data.assetType === "DOCUMENT" ? (
            data.assetExtension &&
            data.assetExtension.toUpperCase() === "PDF" ? (
              <a
                href={data.uploadedUrl}
                download
                target="_blank"
                rel="noreferrer noopener"
              >
                {`Download ${data.assetExtension && data.assetExtension.toUpperCase()}`}
              </a>
            ) : null
          ) : null}
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <Col>
                  <label className="asset-list-indiviual-sku-header">
                    {/* {i18n.t("assetlisting.technicalmetadata")} */}
                  </label>
                </Col>
              </Row>
              <Row>
                <Col xl={5}>{i18n.t("assetlisting.fileName")}</Col>
                <Col xl={1}>:</Col>
                <Col xl={6}>
                  {assetDetails && assetDetails.assetName
                    ? assetDetails && assetDetails.assetName
                    : assetDetails && assetDetails.assetName == null ? i18n.t("assetlisting.nodata") : Filter_loading()}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col xl={5}>{i18n.t("assetlisting.size")}</Col>
                <Col xl={1}>:</Col>
                <Col xl={6}>
                  {assetDetails && assetDetails.assetSize != null
                    ? bytesToKbConvertor(assetDetails && assetDetails.assetSize)
                    : assetDetails && assetDetails.assetSize == null ? i18n.t("assetlisting.nodata") : Filter_loading()}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col xl={5}>{i18n.t("assetlisting.filetype")}</Col>
                <Col xl={1}>:</Col>
                <Col xl={6}>
                  {assetDetails && assetDetails.assetType
                    ? assetDetails && assetDetails.assetType
                    : assetDetails && assetDetails.assetType == null ? i18n.t("assetlisting.nodata") : Filter_loading()}
                </Col>
              </Row>
              <hr />
              {/* MetaTags Data */}
              <Row>
                <Col xl={5}>{i18n.t("assetlisting.metadata")}</Col>
                <Col xl={1}>:</Col>
                {!isEdit || props.editFlag == true ? (
                  <>
                    <Col xl={5}>
                      {assetDetails && assetDetails.tags && assetDetails.tags.length > 0
                        ? assetDetails && assetDetails.tags.join(",")
                        : assetDetails && assetDetails.tags && assetDetails.tags.length == 0 || assetDetails && assetDetails.tags &&  assetDetails.tags.length == undefined ? i18n.t("assetlisting.nodata") : Filter_loading()}
                    </Col>
                    <Col xl={1}>
                      {authJson["44"].isEnabled ?
                      <img
                        src={EditPencilIcon}
                        onClick={() => {
                          props.getAssetById(null, props.data.id)
                          props.setEditFlag(false)
                          setIsEdit(true)
                          setIsEditBtnDisabled(false)
                        }}
                      />:null}
                    </Col>
                  </>
                ) : (
                  <>
                    <Col xl={5}>{editMetaTags()}</Col>
                    <Col xl={1}>
                      <span onClick={() => { metaTagDataSave()}}>
                        <i class="fa fa-check" aria-hidden="true" />
                      </span>
                      <span onClick={() => {
                         setIsEdit(false)
                         setMetaTagData([])
                        }
                      }>
                        <i class="fa fa-times" aria-hidden="true"></i>
                      </span>
                    </Col>
                  </>
                )}
              </Row>
              <hr />
              {/* <Row className="mt-1">
                <Col xl={5}>{i18n.t("assetlisting.assetId")} :</Col>
                <Col xl={7}>
                  {data && data.id
                    ? data && data.id
                    : i18n.t("assetlisting.nodata")}
                </Col>
              </Row>
               <hr /> */}
              {/*  <hr />
              <Row>
                <Col xl={5}>{i18n.t("assetlisting.fileUpdatedDate")}</Col>
                <Col xl={1}> : </Col>
                <Col xl={6}>
                  {data && data.updatedDate
                    ? data && data.updatedDate
                    : i18n.t("assetlisting.nodata")}
                </Col>
              </Row> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default connect(mapStateToProps)(
  ApiConnector(AssetDetails, {
    methods: {
      getAssetById: {
        type: resources.httpMethod.POST,
        url: PIM_API + "/getAssetById",
      },
     getMasterTags:{
      type: resources.httpMethod.POST,
      url: PIM_API + "/masterTags"
     }
    },
  })
)
