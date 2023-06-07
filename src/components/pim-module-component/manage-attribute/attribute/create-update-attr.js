import React, { useEffect, useState } from "react"
import {
  getApiRequestObject,
  getAttributeGroupObject,
  getSearchObject,
  insertApiRequestObject
} from "../../../../common/master-data"
import { Field, Formik, Form, ErrorMessage } from "formik"
import { Spinner } from "react-bootstrap"
import i18n from "../../../../translate/i18n"
import Select from "react-select"
import {
  CREATE,
  ERROR_FIELD_CLASSNAME,
  ERROR_DROPDOWN_CLASSNAME,
  ERROR_DESC_FIELD_CLASSNAME,
  PIM_API,
  SPECIAL_CASE_VALIDATOR,
  MAXSIZENAME,
  MAXSIZEDESC
} from "../../../../common/common-constants"
import { optionStyles } from "../../../searchable-select/searchable-dropdown-constant"
import ApiConnector from "../../../../common/hoc/api-connector"
import { resources } from "../../../../common/common-api-constants"
import * as Yup from "yup"
import { connect } from "react-redux"

const validateAttrName = (values) => {
  let errors
  if (!values.trim()) {
    errors = i18n.t("validationMessage.attrNameisRequired")
  } 
  // else if (values && values.match(SPECIAL_CASE_VALIDATOR)){
  //   errors = i18n.t("validationMessage.specialCaseRequired")
  // }
  else if (values && values.length > 50) {
    errors = i18n.t("validationMessage.attrNameLength")
  }
  return errors
}

const validateAttrDesc = (values) => {
  let errors
  if (values && values.trim().length > 150) {
    errors = i18n.t("validationMessage.lengthDesc")
  }
  return errors
}

let initialValues = {},
  initialLetter = ""

  const mapStateToProps = (state) => {
    return {
      getUserDetail: state.userDetail.getUsersObj.userCredentials
    }
  }

function AttributeForm(prop) {
  const {getUserDetail} = prop
  const testSchema = Yup.object().shape({
    attrType: Yup.object().required(
      i18n.t("validationMessage.attrTypeisRequired")
    ),
    attrGrpName: Yup.object().required(
      i18n.t("validationMessage.attrGrpIsRequired")
    )
  })

  const [submitEvent, setSubmitEvent] = useState(false)
  const [totalElement, setTotalElement] = useState(0)
  const [attrGrpDataObj, setAttrGrpDataObj] = useState([])
  let userDetails = getUserDetail
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  useEffect(() => {
    prop.attributeTypeData
  }, [])

  useEffect(() => {
    getAttributeGroupObject.pageStart = 0
    getAttributeGroupObject.pageEnd = 50
    getAttributeGroupObject.organizationId = userDetails.organizationid
    getAttributeGroupObject.sortField = "attrGrpName"
    getAttributeGroupObject.sortType = "ASC"
    prop.getScrollAttributeGroup(getAttributeGroupObject)
  }, [])

  useEffect(() => {
    const { getScrollAttributeGroupResult } = prop
    if (
      getScrollAttributeGroupResult &&
      getScrollAttributeGroupResult.content &&
      getScrollAttributeGroupResult.content.data &&
      getScrollAttributeGroupResult.content.data.attributeGroups
    ) {
      let AttributeGroupData =
        getScrollAttributeGroupResult.content.data.attributeGroups.map(
          (item) => {
            let value = {
              label: item.attrGrpName,
              value: item.id
            }
            return value
          }
        )
      setTotalElement(getScrollAttributeGroupResult.content.data.totalElement)
      setAttrGrpDataObj(attrGrpDataObj.concat(AttributeGroupData))
    }
  }, [prop.getScrollAttributeGroupResult])

  useEffect(() => {
    const { getSearchAttributeGroupResult } = prop
    if (
      getSearchAttributeGroupResult &&
      getSearchAttributeGroupResult.content &&
      getSearchAttributeGroupResult.content.data &&
      getSearchAttributeGroupResult.content.data.attributeGroups
    ) {
      let AttributeGroupData =
        getSearchAttributeGroupResult.content.data.attributeGroups.map(
          (item) => {
            let value = {
              label: item.attrGrpName,
              value: item.id
            }
            return value
          }
        )
      setTotalElement(getSearchAttributeGroupResult.content.data.totalElement)
      setAttrGrpDataObj(AttributeGroupData)
    }
  }, [prop.getSearchAttributeGroupResult])

  const handleAttrGrpChange = (item) => {
    if (item) {
      const attrGrpValue = { label: item.label, value: item.value }
      return attrGrpValue
    }
  }
  const handleAttrTypeChange = (item) => {
    if (item) {
      const attrTypeValue = { label: item.label, value: item.value }
      return attrTypeValue
    }
  }

  const attrSearchFilter = (option, searchText) => {
    if (option.data.label.toLowerCase().includes(searchText.toLowerCase())) {
      return true
    } else {
      return false
    }
  }

  prop.selectedRow &&
    prop.selectedRow.length &&
    prop.selectedRow.map((item) => {
      return (initialValues = {
        id: item.id,
        attrGrpName: { label: item.attrGrpName, value: item.attrGrpId },
        attrGrpId: item.attrGrpId,
        attrName: item.attrName && item.attrName.replace(/\s+/g, " "),
        attrType: { label: item.attrType, value: item.attrType },
        attrDesc:
          item.attrDescription && item.attrDescription.replace(/\s+/g, " "),
        version: item.version
      })
    })
  return (
    <Formik
      initialValues={
        prop && prop.event === CREATE
          ? {
              attrGrpName: "",
              attrName: "",
              attrType: "",
              attrDesc: "",
            }
          : initialValues
      }
      validationSchema={testSchema}
      onSubmit={(values) => {
        setSubmitEvent(true)
        prop && prop.event === CREATE
          ? ((insertApiRequestObject.attrGrpName = values.attrGrpName.label),
            (insertApiRequestObject.attrGrpId = values.attrGrpName.value),
            (insertApiRequestObject.attrName =
              values.attrName && values.attrName.trim()),
            (insertApiRequestObject.attrType = values.attrType.label),
            (insertApiRequestObject.attrDescription =
              values.attrDesc && values.attrDesc.trim()),
            (insertApiRequestObject.organizationId =
              userDetails.organizationid),
            (insertApiRequestObject.timeZone = timeZone),
            (insertApiRequestObject.isMandatory = false),
            prop.insertAttributeData(insertApiRequestObject))
          : null
      }}
    >
      {({
        values,
        errors,
        handleChange,
        setFieldTouched,
        setFieldValue,
        handleBlur,
        touched
      }) => (
        <div>
          <Form className="p-col-12 form-style">
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="attrName" className="required">
                {i18n.t("fieldName.attrName")}
              </label>
              <label className="ml-2"  style={values.attrName && values.attrName.length >= 50 ? { color: "red" }: { color: "black" }}>
              {values.attrName ? " (" + values.attrName.length + "/" + MAXSIZENAME + ")" : " (" + 0 + "/" + MAXSIZENAME + ")"} 
              </label>
              <Field
                id="attrName"
                // disabled={submitEvent}
                className={
                  errors.attrName && touched.attrName
                    ? ERROR_FIELD_CLASSNAME
                    : "p-inputtext p-component p-inputnumber-input"
                }
                name="attrName"
                type="text"
                maxLength={MAXSIZENAME}
                onBlur={handleBlur}
                onKeyPress={(e) =>
                  SPECIAL_CASE_VALIDATOR.test(e.key) && e.preventDefault()
                }
                onChange={(e) => {
                  setFieldTouched("attrName")
                  handleChange(e)
                }}
                validate={validateAttrName}
                style={{ width: "218px" }}
              ></Field>
              <div className="errorMsg mr-3">
                <ErrorMessage name="attrName" />
              </div>
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="attrType" className="required">
                {i18n.t("fieldName.attrType")}
              </label>
              <Select
                className="attribute-dropdown"
                type="select"
                classNamePrefix={`${
                  touched.attrType && errors.attrType
                    ? ERROR_DROPDOWN_CLASSNAME
                    : ""
                } pim-dropdown`}
                name="attrType"
                styles={optionStyles}
                options={prop.attributeTypeData}
                multi={false}
                onBlur={handleBlur}
                onChange={(el) => {
                  setFieldValue("attrType", el)
                }}
                value={handleAttrTypeChange(values.attrType)}
                // isDisabled={submitEvent}
                filterOption={attrSearchFilter}
                style={{ width: "218px" }}
              />
              <div className="errorMsg">
                <ErrorMessage name="attrType" />
              </div>
            </div>
            <div className="p-field p-col-12">
              <label htmlFor="attrGrpName" className="required">
                {i18n.t("fieldName.attrGrpName")}
              </label>
              <Select
                className="attribute-dropdown"
                type="select"
                styles={optionStyles}
                options={attrGrpDataObj}
                multi={false}
                onBlur={handleBlur}
                classNamePrefix={`${
                  touched.attrGrpName && errors.attrGrpName
                    ? ERROR_DROPDOWN_CLASSNAME
                    : ""
                } pim-dropdown`}
                onChange={(el) => {
                  setFieldValue("attrGrpName", el)
                }}
                value={handleAttrGrpChange(values.attrGrpName)}
                // isDisabled={submitEvent}
                isSearchable={true}
                filterOption={attrSearchFilter}
                // onKeyDown={()=>scrollPagination()}
                onMenuScrollToBottom={() => {
                  if (totalElement > attrGrpDataObj.length) {
                    getAttributeGroupObject.pageStart =
                      getAttributeGroupObject.pageStart + 1
                    prop.getScrollAttributeGroup(getAttributeGroupObject, null)
                  }
                }}
                onInputChange={(value) => {
                  if (initialLetter != value) {
                    initialLetter = value
                    getSearchObject.pageStart = 0
                    getSearchObject.attrGrpName = "%" + value + "%"
                    getSearchObject.organizationId = userDetails.organizationid
                    prop.getSearchAttributeGroup(getSearchObject, null)
                  }
                }}
              />
              <div className="errorMsg">
                <ErrorMessage name="attrGrpName" />
              </div>
            </div>
            <div className="p-field p-col-12">
              <label htmlFor="attrDesc">{i18n.t("fieldName.attrDesc")}</label>
              <label className="ml-2"  style={values.attrDesc && values.attrDesc.length >= 150 ? { color: "red" }: { color: "black" }}>
              {values.attrDesc ? " (" + values.attrDesc.length + "/" + MAXSIZEDESC + ")" : " (" + 0 + "/" + MAXSIZEDESC + ")"} 
              </label>
              <Field
                id="attrDesc"
                // disabled={submitEvent}
                className={
                  touched.attrDesc && errors.attrDesc
                    ? ERROR_DESC_FIELD_CLASSNAME
                    : "p-inputtext p-inputtextarea desc-textarea-style"
                }
                name="attrDesc"
                as="textarea"
                onChange={(e) => {
                  setFieldTouched("attrDesc")
                  handleChange(e)
                }}
                maxLength={MAXSIZEDESC}
                validate={validateAttrDesc}
                onBlur={handleBlur}
              />
              <div className="errorMsg">
                <ErrorMessage name="attrDesc" />
              </div>
            </div>
            {submitEvent === true && prop.setSubmitEvent === true ? (
              <div className="p-dialog-footer mx-auto pt-3 pb-4">
                <button
                  className="p-button p-component p-button-text custom-button"
                  disabled={true}
                >
                  <span className="p-button-label p-c">
                    <Spinner
                      as="span"
                      variant="light"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      animation="border"
                    />
                  </span>
                </button>
              </div>
            ) : (
              <div className="w-100 p-dialog-footer d-flex justify-content-center pt-3 pb-4">
                <button
                  type="button"
                  onClick={prop.hideDialog}
                  className="pim-btn pim-btn-primary pim-font-property ml-2"
                >
                  {i18n.t("commonButton.cancel")}
                </button>
                <button
                  type="submit"
                  className="pim-btn pim-btn-main pim-font-property ml-2"
                >
                  {prop.event === CREATE ? i18n.t("commonButton.create") : null}
                </button>
              </div>
            )}
          </Form>
        </div>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(ApiConnector(AttributeForm, {
  methods: {
    getScrollAttributeGroup: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/getAttributeGroups"
    },
    getSearchAttributeGroup: {
      type: resources.httpMethod.POST,
      url: PIM_API + "/getAttributeGroups"
    }
  }
}))
