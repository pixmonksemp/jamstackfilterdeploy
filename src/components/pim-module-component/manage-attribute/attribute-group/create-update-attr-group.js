import React, { useState } from "react"
import { insertApiRequestObject } from "../../../../common/master-data"
import { useFormik } from "formik"
import { Spinner } from "react-bootstrap"
import i18n from "../../../../translate/i18n"
import { InputTextarea } from "primereact/inputtextarea"
import {
  CREATE,
  ERROR_FIELD_CLASSNAME,
  MAXSIZEDESC,
  MAXSIZENAME,
  SPECIAL_CASE_VALIDATOR
} from "../../../../common/common-constants"
import { connect } from "react-redux"

const validate = (values) => {
  const errors = {}
  if (!values.attrGrpName.trim()) {
    errors.attrGrpName = i18n.t("validationMessage.attrGrpIsRequired")
  } else if (values.attrGrpName && values.attrGrpName.trim().length > 50) {
    errors.attrGrpName = i18n.t("validationMessage.attrGrpNameLength")
  } 
  // else if (values.attrGrpName && values.attrGrpName.match(SPECIAL_CASE_VALIDATOR)){
  //   errors.attrGrpName = i18n.t("validationMessage.specialCaseRequired")
  // }
  if (values.attrGrpDesc && values.attrGrpDesc.trim().length > 150) {
    errors.attrGrpDesc = i18n.t("validationMessage.lengthDesc")
  }

  return errors
}

let initialValues = {}


const mapStateToProps = (state) => {
  return {
    getUserDetail: state.userDetail.getUsersObj.userCredentials
  }
}
const AttributeGroupForm = (prop) => {
  const {getUserDetail} = prop
  let userDetails = getUserDetail
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const [submitEvent, setSubmitEvent] = useState(false)
  prop.selectedRow &&
    prop.selectedRow.length &&
    prop.selectedRow.map((item) => {
      return (initialValues = {
        id: item.id,
        attrGrpName: item.attrGrpName && item.attrGrpName.replace(/\s+/g, " "),
        attrGrpDesc:
          item.attrGrpDescription &&
          item.attrGrpDescription.replace(/\s+/g, " "),
        version: item.version
      })
    })
  const formik =
    prop && prop.event === CREATE
      ? useFormik({
          initialValues: {
            attrGrpName: "",
            attrGrpDesc: ""
          },
          validate,
          onSubmit: (values) => {
            setSubmitEvent(true)
            insertApiRequestObject.attrGrpName =
              values.attrGrpName && values.attrGrpName.trim()
            insertApiRequestObject.attrGrpDescription =
              values.attrGrpDesc && values.attrGrpDesc.trim()
            insertApiRequestObject.organizationId = userDetails.organizationid
            insertApiRequestObject.timeZone = timeZone
            prop.insertAttributeGroupData(insertApiRequestObject)
          }
        })
      : prop && prop.event === UPDATE
      ? useFormik({
          initialValues,
          validate,
          onSubmit: (values) => {
            setSubmitEvent(true)
            updateApiRequestObject.id = values.id
            updateApiRequestObject.attrGrpName = values.attrGrpName && values.attrGrpName.trim()
            updateApiRequestObject.attrGrpDescription = values.attrGrpDesc && values.attrGrpDesc.trim()
            updateApiRequestObject.version = values.version
            updateApiRequestObject.organizationId = userDetails.organizationid
            updateApiRequestObject.timeZone = timeZone
            prop.updateAttributeGroupData(updateApiRequestObject)
          },
        })
      : null
  return (
    <div>
      <form className="p-col-12 form-style" onSubmit={formik.handleSubmit}>
        <div className="p-field p-col-12 p-md-12">
          <label htmlFor="attrGrpName" className="required">
            {i18n.t("fieldName.attrGrpName")}
          </label>
          <label className="ml-2"  style={formik.values.attrGrpName && formik.values.attrGrpName.length >= MAXSIZENAME ? { color: "red" }: { color: "black" }}>
              {formik.values.attrGrpName ? " (" + formik.values.attrGrpName.length + "/" + MAXSIZENAME + ")" : " (" + 0 + "/" + MAXSIZENAME + ")"} 
          </label>
          <input
            id="attrGrpName"
            // disabled={submitEvent}
            className={
              formik.touched.attrGrpName && formik.errors.attrGrpName
                ? ERROR_FIELD_CLASSNAME
                : "p-inputtext p-component p-inputnumber-input"
            }
            name="attrGrpName"
            type="text"
            maxLength={MAXSIZENAME}
            onChange={(e)=>{formik.setFieldTouched('attrGrpName')
                            formik.handleChange(e)
                            }}
            onBlur={formik.handleBlur}
            value={formik.values && formik.values.attrGrpName}
          />
          {formik.touched.attrGrpName && formik.errors.attrGrpName ? (
            <div className="errorMsg">{formik.errors.attrGrpName}</div>
          ) : null}
        </div>

        <div className="p-field p-col-12">
          <label htmlFor="attrGrpDesc">{i18n.t("fieldName.attrGrpDesc")}</label>
          <label className="ml-2"  style={formik.values.attrGrpDesc && formik.values.attrGrpDesc.length >= MAXSIZEDESC ? { color: "red" }: { color: "black" }}>
              {formik.values.attrGrpDesc ? " (" + formik.values.attrGrpDesc.length + "/" + MAXSIZEDESC + ")" : " (" + 0 + "/" + MAXSIZEDESC + ")"} 
          </label>
          <InputTextarea
            rows={2}
            cols={30}
            id="attrGrpDesc"
            // disabled={submitEvent}
            className={
              formik.touched.attrGrpDesc && formik.errors.attrGrpDesc
                ? ERROR_FIELD_CLASSNAME
                : "p-inputtext desc-textarea-style"
            }
            name="attrGrpDesc"
            type="attrGrpDesc"
            maxLength={MAXSIZEDESC}
            onChange={(e)=>{formik.handleChange(e)
                            formik.setFieldTouched('attrGrpDesc')}}
            onBlur={formik.handleBlur}
            value={formik.values && formik.values.attrGrpDesc}
          />
          {formik.touched.attrGrpDesc && formik.errors.attrGrpDesc ? (
            <div className="errorMsg">{formik.errors.attrGrpDesc}</div>
          ) : null}
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
                />{" "}
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
            <button className="pim-btn pim-btn-main pim-font-property ml-2">
              {prop.event === CREATE ? i18n.t("commonButton.create") : null}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default connect(mapStateToProps)(AttributeGroupForm)
