import React, { useEffect, useState } from "react"
import { Field, Formik, Form, ErrorMessage } from "formik"
import ApiConnector from "../../../common/hoc/api-connector"
import { Button, Card, Col, Row, Spinner } from "react-bootstrap"
import {
  CREATE,
  ERROR_BG_COLOR,
  MEDIUM,
  UPDATE,
  VALID_BG_COLOR,
  SUPERADMIN,
  MODULE,
  PAGE,
  OBJECT,
  BUTTON,
  REQUIRED_VALIDATION_FIELD,
  ROLENAME,
  CHARACTER_SIZE_REQUIRED,
  ROLEDESC,
  CHARACTERS_SIZE_REQUIRED,
  CHARACTER_SIZES_REQUIRED,
  SPECIAL_CASE_VALIDATOR,
  MAXSIZENAME,
  MAXSIZEDESC
} from "../../../common/common-constants"
import "./style.scss"
import { resources } from "../../../common/common-api-constants"
import {
  featureAccessCreateApiRequest,
  roleCreateApiRequest,
} from "../../../common/master-data"
import i18n from "../../../translate/i18n"
import ToastModal from "../../modal/ToastModal"
import ModalComponent from "../../modal"
import { connect } from "react-redux"
import moment from "moment"
// import Backpagecomponent from "../../back-page-component/back-page-component"
import RoleIcon from "../../../common/icons/roleicon"

const mapStateToProps = (state) => {
  return {
    getUserDetail: state.userDetail.getUsersObj.userCredentials
  }
}
function RoleCreateUpdateComponent(props) {
  const {getUserDetail} = props
  const [isToastMsg, setIsToastMsg] = useState(false)
  const [isApiFailed, setIsApiFailed] = useState(false)
  const [allFeatures, setAllFeatures] = useState([])
  const [roleResult, setRoleResult] = useState({})
  const [toastSize, setToastSize] = useState(null)
  const [toastContent, setToastContent] = useState(null)
  const [toastHeading, setToastHeading] = useState(null)
  const [titleBackgroundColor, setTitleBackgroundColor] = useState(null)
  const [roleName, setRoleName] = useState("")
  const [roleDescription, setRoleDescription] = useState("")
  const [initialFeatureValues, setInitialFeatureValues] = useState({})
  const [adminValues, setAdminValues] = useState([])
  const [isLoader, setIsLoader] = useState(true)
  const [redirect, setRedirect] = useState(false)
  const [touchedField, setTouchedField] = useState(null)
  const [isFeaturesFlag, setIsFeaturesFlag] = useState(false)
  const [isMandatoryShowFlag, setIsMandatoryShowFlag] = useState(false)
  let obj = { checkOne: { show: false, edit: true } }
  let userDetails = getUserDetail
  let redirectType = sessionStorage.getItem("roleRedirectType")
  let roleId = sessionStorage.getItem("roleId"),
  labelNo = i18n.t("datatable.no"),
  labelYes = i18n.t("datatable.yes"),
  result1

  useEffect(() => {
    props.getFeatures()
  }, [])

  useEffect(() => {
    const { getFeaturesResult } = props
    let superAdminIds = []
    if (
      getFeaturesResult &&
      getFeaturesResult.content &&
      getFeaturesResult.content.data
    ) {
      setAllFeatures(getFeaturesResult.content.data)
      if (redirectType == CREATE) {
        let featureValues = {}
        getFeaturesResult.content.data.map((i) => {
          if (i.featuretype == MODULE) {
            featureValues[i.featureid] = {
              name: i.featurename,
              type: i.featuretype,
              description:i.featureDescription,
              parentId: null,
              show: i.featurename == SUPERADMIN ? false : true,
              edit: i.featurename == SUPERADMIN ? false : true,
            }
            if (i.featurename == SUPERADMIN) {
              superAdminIds.push(i.featureid)
            }
            getFeaturesResult.content.data
              .filter((el) => el.parentfeature == i.featureid)
              .map((el) => {
                if (i.featurename == SUPERADMIN) {
                  superAdminIds.push(el.featureid)
                }
                // if (el.featuretype == PAGE) {
                //   featureValues[el.featureid] = {
                //     name: el.featurename,
                //     type: el.featuretype,
                //     parentId: el.parentfeature,
                //     show: i.featurename == SUPERADMIN ? false : true,
                //     edit: i.featurename == SUPERADMIN ? false : true,
                //   }
                // }
              })
          }
        })
        setIsLoader(false)
        setAdminValues(superAdminIds)
        setInitialFeatureValues(featureValues)
      } else if (redirectType == UPDATE) {
        props.getRole(null, roleId)
      }
    }
  }, [props.getFeaturesResult])

  useEffect(() => {
    const { getRoleResult } = props
    let superAdminIds = []
    if (getRoleResult && getRoleResult.content && getRoleResult.content.data) {
      setRoleResult(getRoleResult.content.data)
      setRoleName(getRoleResult.content.data.roleName)
      setRoleDescription(getRoleResult.content.data.roleDescription)
      let featureValues = {}
      allFeatures.map((i) => {
        if (i.featuretype == MODULE) {
          let moduleElement = getRoleResult.content.data.featureAccesses.filter(
            (el) => el.featureid == i.featureid
          )
          featureValues[i.featureid] = {
            name: i.featurename,
            type: i.featuretype,
            description:i.featureDescription,
            parentId: null,
            show:
              i.featurename == SUPERADMIN
                ? false
                : moduleElement && !moduleElement[0].ishidden,
            edit:
              i.featurename == SUPERADMIN
                ? false
                : moduleElement && moduleElement[0].isenabled,
          }
          if (i.featurename == SUPERADMIN) {
            superAdminIds.push(i.featureid)
          }
          allFeatures
            .filter((el) => el.parentfeature == i.featureid)
            .map((el) => {
              if (i.featurename == SUPERADMIN) {
                superAdminIds.push(el.featureid)
              }
              // if (el.featuretype == PAGE) {
              //   let pageElement =
              //     getRoleResult.content.data.featureAccesses.filter(
              //       (element) => element.featureid == el.featureid
              //     )
              //   featureValues[el.featureid] = {
              //     name: el.featurename,
              //     type: el.featuretype,
              //     parentId: el.parentfeature,
              //     show:
              //       i.featurename == SUPERADMIN
              //         ? false
              //         : !pageElement[0].ishidden,
              //     edit:
              //       i.featurename == SUPERADMIN
              //         ? false
              //         : pageElement[0].isenabled,
              //   }
              // }
            })
        }
      })
      setIsLoader(false)
      setAdminValues(superAdminIds)
      setInitialFeatureValues(featureValues)
    }
  }, [props.getRoleResult])

  useEffect(() => {
    const { updateRoleResult } = props
    if (
      updateRoleResult &&
      updateRoleResult.content &&
      updateRoleResult.content.status == 200
    ) {
      setToastHeading(i18n.t("toastMessage.updateRoleContent"))
      setToastContent(roleName + " " +i18n.t("superAdminContents.roleupdate"))
      setTitleBackgroundColor(VALID_BG_COLOR)
      setToastSize(MEDIUM)
      setIsToastMsg(true)
      setIsApiFailed(false)
      setIsLoader(false)
    } else if (
      updateRoleResult &&
      updateRoleResult.content &&
      updateRoleResult.content.status != 200
    ) {
      setIsApiFailed(true)
      setToastHeading(i18n.t("toastMessage.updateRoleContent"))
      setToastContent(
        updateRoleResult.content.data &&
          updateRoleResult.content.data.description
          ? updateRoleResult.content.data.description
          : i18n.t("toastMessage.requestFailedMessageSuperAdminUpdateRole")
      )
      setTitleBackgroundColor(ERROR_BG_COLOR)
      setToastSize(MEDIUM)
      setIsToastMsg(true)
      setIsLoader(false)
    }
  }, [props.updateRoleResult])

  useEffect(() => {
    const { createRoleResult } = props
    if (
      createRoleResult &&
      createRoleResult.content &&
      createRoleResult.content.status == 200
    ) {
      setToastHeading(i18n.t("toastMessage.createRoleContent"))
      setToastContent(i18n.t("superAdminContents.roleCreate"))
      setTitleBackgroundColor(VALID_BG_COLOR)
      setToastSize(MEDIUM)
      setIsToastMsg(true)
      setIsApiFailed(false)
      setIsLoader(false)
    } else if (
      createRoleResult &&
      createRoleResult.content &&
      createRoleResult.content.status != 200
    ) {
      setIsApiFailed(true)
      setToastHeading(i18n.t("toastMessage.createRoleContent"))
      setToastContent(
        createRoleResult &&
          createRoleResult.content &&
          createRoleResult.content.data &&
          createRoleResult.content.data.description
          ? createRoleResult.content.data.description
          : i18n.t("toastMessage.requestFailedMessageSuperAdminRole")
      )
      setTitleBackgroundColor(ERROR_BG_COLOR)
      setToastSize(MEDIUM)
      setIsToastMsg(true)
      setIsLoader(false)
    }
  }, [props.createRoleResult])

   /**
   * This method is used to redirect manage role to superadmin manage role page if page is touched overlay popup will shown otherwise not shown.
   * @param {*} touched
   */
    const redirectHomePage = (touched) => {
      // check if object is empty or not.
      if (!(Object.keys(touched).length === 0 && touched.constructor === Object)) {
        setRedirect(true)
      } else {
        reDirectToSkulist()
      }
    }

  const onHideCancelDialog=()=>{
    setRedirect(false)
    setIsFeaturesFlag(false)
    setIsMandatoryShowFlag(false)
  }

  const reDirectToSkulist = () => {
    const data = {
      key: "manageRoles",
    }
    props.history.push("/manageRoles")
    props.triggerPageLayout(data)
  }

  const cancelDialog = (
    <React.Fragment>
      <Button
        // icon="pi pi-times"
        className="pim-font-property admin-cancel-button"
        onClick={() => onHideCancelDialog()}
      >
        {labelNo}
      </Button>
      <Button
        label="Yes"
        // icon="pi pi-check"
        className="pim-font-property admin-submit-button"
        onClick={() => reDirectToSkulist()}
      >
        {labelYes}
      </Button>
    </React.Fragment>
  )

  const getFeatureAccessForUpdate = (values) => {
    let finalValue = []
    Object.keys(values).map((i) => {
      if (typeof values[i] == "object") {
        if (values[i].type == "module") {
          let moduleObject = roleResult.featureAccesses.filter(
            (item) => item.featureid == i
          )[0]
          moduleObject.featureid = i
          moduleObject.isenabled = values[i].edit
          moduleObject.ishidden = !values[i].show
          moduleObject.organizationid = userDetails.organizationid
          moduleObject.isDeleted = false
          finalValue.push(moduleObject)
          allFeatures
            .filter((el) => el.parentfeature == i)
            .map((el) => {
              if (el.featuretype == "Button") {
                let buttonObject = roleResult.featureAccesses.filter(
                  (item) => item.featureid == el.featureid
                )[0]
                buttonObject.isenabled = values[i].edit
                buttonObject.ishidden = false
                finalValue.push(buttonObject)
              } else if (el.featuretype == "page") {
                let pageObject = roleResult.featureAccesses.find(
                  (item) => item.featureid == el.featureid
                )
                pageObject.isenabled = values[i].edit
                  // ? values[el.featureid].edit
                  // : false
                // pageObject.ishidden = !values[el.featureid].show
                pageObject.ishidden = !values[i].show
                finalValue.push(pageObject)
                allFeatures
                  .filter((page) => page.parentfeature == el.featureid)
                  .map((pageElement) => {
                    let buttonObject = roleResult.featureAccesses.filter(
                      (item) => item.featureid == pageElement.featureid
                    )[0]
                    buttonObject.isenabled = values[i].edit
                      // ? values[el.featureid].edit
                      //   ? true
                      //   : false
                      // : false
                    buttonObject.ishidden = false
                    finalValue.push(buttonObject)
                  })
              }
            })
        }
      }
    })
    return finalValue
  }

  const getFeatureAccessForCreate = (values) => {
    let finalValue = []
    Object.keys(values).map((i) => {
      if (typeof values[i] == OBJECT) {
        if (values[i].type == MODULE) {
          let moduleObject = {}
          moduleObject.featureid = i
          moduleObject.isenabled = values[i].edit
          moduleObject.ishidden = !values[i].show
          moduleObject.organizationid = userDetails.organizationid
          moduleObject.isDeleted = false
          finalValue.push(moduleObject)
          allFeatures
            .filter((el) => el.parentfeature == i)
            .map((el) => {
              if (el.featuretype == BUTTON) {
                let buttonObject = {}
                buttonObject.featureid = el.featureid
                buttonObject.isenabled = values[i].edit
                buttonObject.ishidden = false
                buttonObject.organizationid = userDetails.organizationid
                buttonObject.isDeleted = false
                finalValue.push(buttonObject)
              } else if (el.featuretype == PAGE) {
                let pageObject = {}
                pageObject.featureid = el.featureid
                pageObject.isenabled = values[i].edit
                  // ? values[el.featureid].edit
                  // : false
                // pageObject.ishidden = !values[el.featureid].show
                pageObject.ishidden = !values[i].show
                pageObject.organizationid = userDetails.organizationid
                pageObject.isDeleted = false
                finalValue.push(pageObject)
                allFeatures
                  .filter((page) => page.parentfeature == el.featureid)
                  .map((pageElement) => {
                    let buttonObject = {}
                    buttonObject.featureid = pageElement.featureid
                    buttonObject.isenabled = values[i].edit
                      // ? values[el.featureid].edit
                      //   ? true
                      //   : false
                      // : false
                    buttonObject.ishidden = false
                    buttonObject.organizationid = userDetails.organizationid
                    buttonObject.isDeleted = false
                    finalValue.push(buttonObject)
                  })
              }
            })
        }
      }
    })
    return finalValue
  }

  const onSubmit = (values) => {
    if(!(Object.keys(values).filter(i=>values[i].show==true).length == 0)){
      if(values[2].show == true){
        setIsLoader(true)
        if (redirectType == CREATE) {
          roleCreateApiRequest.roleName = values.roleName.trim()
          roleCreateApiRequest.roleDescription = values.roleDescription
          roleCreateApiRequest.organizationid = userDetails.organizationid
          roleCreateApiRequest.featureAccesses = getFeatureAccessForCreate(values)
          if (values[48].edit && values[48].show) {
            roleCreateApiRequest.isApprover = true
          } else {
            roleCreateApiRequest.isApprover = false
          }
          props.createRole(roleCreateApiRequest)
        } else if (redirectType == UPDATE) {
          roleResult.roleName = values.roleName.trim()
          roleResult.roleDescription = values.roleDescription
          roleResult.updatedDate = new Date(moment().format("YYYY-MM-DDTHH:mm:ssZ"))
          roleResult.featureAccesses = getFeatureAccessForUpdate(values)
          if (values[48].edit && values[48].show) {
            roleResult.isApprover = true
          } else {
            roleResult.isApprover = false
          }
          props.updateRole(roleResult)
        }
      }else{
        setIsMandatoryShowFlag(true)
      }  
    }else{
      setIsFeaturesFlag(true)
    }
  }

  const validate = (value) => {
    if (!value.trim()) {
      return REQUIRED_VALIDATION_FIELD
    } else if (value.length > 50) {
      return ROLENAME +" "+ CHARACTER_SIZES_REQUIRED
    } 
    // else if(value.match(SPECIAL_CASE_VALIDATOR)){
    //   return i18n.t("validationMessage.specialCaseRequired")
    // }
  }

  const validateDescription = (value) => {
    if (value && value.length > 150) {
      return ROLEDESC +" "+ CHARACTERS_SIZE_REQUIRED 
    }
  }

  const handleToastHide = () => {
    setIsToastMsg(false)
    if (!isApiFailed) {
      const data = {
        key: "manageRoles",
      }
      props.history.push("/manageRoles")
      props.triggerPageLayout(data)
    }
  }

  return (
    <div>
      <ToastModal
        show={isToastMsg}
        title={toastHeading}
        titleBackgroundColor={titleBackgroundColor}
        content={toastContent}
        size={toastSize}
        onModalHide={handleToastHide}
      />
      <Formik
        enableReinitialize={true}
        validateOnChange={true}
        initialValues={{
          roleName: roleName ? roleName : "",
          roleDescription: roleDescription ? roleDescription : "",
          ...initialFeatureValues,
        }}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          handleChange,
          setFieldTouched,
          setFieldValue,
          handleBlur,
          touched,
        }) => (
          <>
            {/* <Backpagecomponent props={props}/> */}
            <div className="p-grid common-header-section">
              <h5 className="p-m-0  p-col-12  page-header"><RoleIcon/> {i18n.t("superAdminContents.manageRole")}</h5>
            </div>
            <Card className="mb-3 admin-card-border-radius"> 
              <div className="gridcontainer">
                {isLoader ? (
                  <Card className="loading-image">
                    <center className="m-auto">
                      <Card.Body>
                        <Spinner animation="grow" className="spinner" />
                      </Card.Body>
                    </center>
                  </Card>
                ) : (
                  <Form
                    id="my-form"
                    className="p-col-12 form-style"
                    style={{ display: "block" }}
                  >
                    {/* <div className="field col-6 md:col-4 mb-4 ml-3 mt-3"> */}
                    <Row className="mt-2">
                      <Col>
                        <label
                          htmlFor="roleName"
                          className="attributeLabel-max admin-form-font-weight"
                        >
                          {redirectType == CREATE
                            ? i18n.t("superAdminContents.roleCreateTitle")
                            : i18n.t("superAdminContents.roleUpdateTitle")}
                        </label>
                      </Col>
                    </Row>
                    <Row className="mr-1 mt-2 mb-3">
                      <Col xl={5}>
                        <div className="d-flex justify-content-between">
                        <label
                          htmlFor="roleName"
                          className="attributeLabel required d-flex justify-content-start"
                        >
                         {i18n.t("superAdminContents.roleName")}
                        </label>
                        <label className="d-flex justify-content-end admin-padding-alignment-rolename"  style={values.roleName && values.roleName.length >= MAXSIZENAME ? { color: "red" } : { color: "black" }}>
                        {values.roleName ? " (" + values.roleName.length + "/" + MAXSIZENAME + ")" : " (" + 0 + "/" + MAXSIZENAME + ")"} 
                        </label>
                        </div>
                        <Field
                          type="text"
                          style={{ width: "95%" }}
                          className={"p-inputtext attribute-inputtext"}
                          validate={validate}
                          name="roleName"
                          maxLength={MAXSIZENAME}
                          onChange={(e)=>{
                            setFieldTouched('roleName')
                            handleChange(e)
                          }}
                        />
                        <div
                          className="errorMsg admin-errorMsg-style mr-4 "
                        >
                          <ErrorMessage name="roleName" />
                        </div>
                      </Col>
                      <Col xl={7}>
                        <div className="d-flex role-description">
                        <label
                          htmlFor="roleDescription"
                          className="attributeLabel d-flex justify-content-start"
                        >
                        {i18n.t("superAdminContents.roleDesc")}
                        </label>
                        <label className="d-flex justify-content-end admin-padding-alignment-roledesc"  style={values.roleDescription && values.roleDescription.length >= MAXSIZEDESC ? { color: "red" }: { color: "black" }}>
                        {values.roleDescription ? " (" + values.roleDescription.length + "/" + MAXSIZEDESC + ")" : " (" + 0 + "/" + MAXSIZEDESC + ")"} 
                        </label>
                        </div>
                        <Field
                          // as="textarea"
                          type="text"
                          style={{ width: "97%" }}
                          className={"p-inputtext attribute-inputtext"}
                          validate={validateDescription}
                          name="roleDescription"
                          maxLength={MAXSIZEDESC}
                          onChange={(e)=>{
                            setFieldTouched('roleDescription')
                            handleChange(e)
                          }}
                        />
                        <div
                          className="errorMsg admin-errorMsg-style mr-4"
                        >
                          <ErrorMessage name="roleDescription" />
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-0 mb-0">
                      <Col>
                        <label
                          htmlFor="roleDescription"
                          className="attributeLabel admin-form-font-weight"
                        >
                          {i18n.t("superAdminContents.manageFeatures")}
                        </label>
                      </Col>
                    </Row>
                    <div className="role-grid-border mt-1 m-0">
                      <Row className="mb-0 ml-0 mr-0 mt-0">
                        <Col
                          xl={4}
                          lg={4}
                          md={5}
                          xs={4}
                          className="border-bottom role-create-update-view pr-0 pl-0 p-0 mt-0 text-left"
                        >
                          <label
                            className="attributeLabel admin-form-font-weight mt-2 pl-4"
                          >
                            {i18n.t("superAdminContents.moduleName")}
                          </label>
                        </Col>
                        <Col
                          xl={4}
                          lg={4}
                          md={5}
                          className="border-bottom pr-0 pl-3 text-left role-create-update-view "
                        >
                          <label
                            className="attributeLabel admin-form-font-weight admin-label-left-space mt-2"
                          >
                            {i18n.t("superAdminContents.moduleDesc")}
                          </label>
                        </Col>
                        <Col
                          xl={2}
                          lg={2}
                          md={3}
                          className="role-create-update-view border-bottom pr-0 pl-0 text-center"
                        >
                          <label
                            className="attributeLabel admin-form-font-weight mt-2"
                          >
                           {i18n.t("superAdminContents.view")}
                          </label>
                        </Col>
                        <div className="vertica-line-user-role"></div>
                        <Col
                          xl={2}
                          lg={2}
                          md={3}
                          className="pr-0 pl-0 text-center border-bottom role-create-update-view "
                        >
                          <label
                            className="attributeLabel admin-form-font-weight mt-2"
                          >
                            {i18n.t("superAdminContents.edit")}
                          </label>
                        </Col>
                      </Row>
                      {Object.keys(initialFeatureValues).map((item) => {
                        if(item != 1){
                        if (values[item] && !adminValues.includes(item)) {
                          return (
                            <Row className="field admin-row-height mb-0 ml-0 mr-0 mt-0">
                              <Col
                                xl={4}
                                xs={4}
                                lg={4}
                                md={5}
                                className="border-bottom pr-0 pl-0 text-left"
                              >
                                <label className="attributeLabel mt-3 pl-4">
                                  {initialFeatureValues[item].name 
                                  // +
                                  //   " (" +
                                  //   initialFeatureValues[item].type +
                                  //   ")"
                                    }
                                </label>
                              </Col>
                              <Col
                                xl={4}
                                lg={4}
                                md={5}
                                className="border-bottom pr-0 pl-3 text-left"
                              >
                                <label className="attributeLabel mt-3">
                                  {initialFeatureValues[item].description 
                                  // +
                                  //   " (" +
                                  //   initialFeatureValues[item].type +
                                  //   ")"
                                    }
                                </label>
                              </Col>
                              <Col
                                xl={2}
                                lg={2}
                                md={3}
                                className="border-bottom pr-0 pl-0 text-center"       
                              >
                                <Field
                                  type="checkbox" 
                                  disabled={
                                    item && item == 2 ? values[2].show && true : 
                                    values && values[initialFeatureValues[item].parentId]
                                      ? values[
                                          initialFeatureValues[item].parentId
                                        ].show
                                        ? false
                                        : true
                                      : false
                                  }
                                  name={`${item}.show`}
                                  className="admin-checkbox-size mt-3"
                                  style={{cursor:"pointer"}}
                                />
                              </Col>
                              <Col
                                xl={2}
                                lg={2}
                                md={3}
                                className="pr-0 pl-0 text-center border-bottom"    
                              >
                                <Field
                                  type="checkbox"
                                  disabled={
                                    values[initialFeatureValues[item].parentId]
                                      ? values[
                                          initialFeatureValues[item].parentId
                                        ].show
                                        ? values[
                                            initialFeatureValues[item].parentId
                                          ].edit
                                          ? values[item].show
                                            ? false
                                            : true
                                          : true
                                        : true
                                      : values[item].show
                                      ? false
                                      : true
                                  }
                                  checked={
                                    initialFeatureValues[item].parentId
                                      ? values[
                                          initialFeatureValues[item].parentId
                                        ].edit
                                        ? values[item].edit
                                        : false
                                      : values[item].edit
                                  }
                                  name={`${item}.edit`}
                                  className="admin-checkbox-size mt-3"
                                  style={{cursor:"pointer"}}
                                />
                              </Col>
                            </Row>
                          )
                        }}
                      })}
                    </div>
                  </Form>
                )}
              </div>
            </Card>
            <Row>
              <Col className="text-center">
               <Button type="submit"  className="pim-font-property admin-cancel-button admin-submit-button-size mr-2 mb-5 mt-3 " 
                onClick={()=>{redirectHomePage(touched)}}>
                  {i18n.t("commonButton.cancel")}
                </Button>
                <Button type="submit" form="my-form" className="pim-font-property admin-submit-button admin-submit-button-size mb-5 mt-3 pt-1">
                  {i18n.t("commonButton.submit")}
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Formik>

      <ModalComponent
        isShowModal={isMandatoryShowFlag}
        onHideModal={onHideCancelDialog}
          modalTitle={redirectType == CREATE? i18n.t("superAdminContents.roleCreateTitle") : i18n.t("superAdminContents.roleUpdateTitle")}
          modalContent={
            <div className="confirmation-content">
            <i className="exclamation-triangle"/>
            <span>{"catalog management is mandatory"}</span>
            </div>
          }
        modalSize="md"
        modalDailogClassName="modalDailogContent smallDialog"
      />
      
      <ModalComponent
        isShowModal={isFeaturesFlag ? isFeaturesFlag : redirect}
        onHideModal={onHideCancelDialog}
          modalTitle={!isFeaturesFlag ? i18n.t("superAdminPopupHeaders.cancelSuperAdminRole") : redirectType == CREATE? i18n.t("superAdminContents.roleCreateTitle") : i18n.t("superAdminContents.roleUpdateTitle")}
          modalContent={
            !isFeaturesFlag?
            <div className="confirmation-content">
              <i
                className="exclamation-triangle"
              />
              <span>{i18n.t("superAdminPopupHeaders.back")}</span>
            </div>:
            <div className="confirmation-content">
            <i className="exclamation-triangle"/>
            <span>{"Please select a permission for at least one feature to continue"}</span>
            </div>
          }
        modalSize="md"
        modalDailogClassName="modalDailogContent smallDialog"
        modalFooter={!isFeaturesFlag ? cancelDialog : null}
      />
    </div>
  )
}

export default connect(mapStateToProps)(ApiConnector(RoleCreateUpdateComponent, {
  methods: {
    getFeatures: {
      type: resources.httpMethod.GET,
      url: "api/features",
    },
    getRole: {
      type: resources.httpMethod.GET,
      url: "api/roles",
    },
    createRole: {
      type: resources.httpMethod.POST,
      url: "api/roles",
    },
    updateRole: {
      type: resources.httpMethod.PUT,
      url: "api/roles",
    },
  },
}));