import React from "react"
import { useEffect, useState } from "react"
import {
  ASC,
  COLUMN_RESIZE_MODE,
  ERROR_BG_COLOR,
  ERROR_DROPDOWN_CLASSNAME,
  ERROR_FIELD_CLASSNAME,
  GRID_SIZE,
  MEDIUM,
  SCROLL_HEIGHT,
  SCROLL_WIDTH,
  VALID_BG_COLOR,
  REQUIRED_VALIDATION_FIELD,
  CHARACTER_SIZE_REQUIRED,
  VALID_EMAIL_ID,
  RECORD,
  RECORDS,
  DESC,
  REQUIRED_FIELDS,
  CHARACTER_SIZE_ISREQUIRED,
  SPECIAL_CASE_VALIDATOR,
  MAXSIZENAME
} from "../../../common/common-constants"
import {
  getRolesApiRequestObject,
  getUserListApiRequestObject,
  userCreateApiRequest,
} from "../../../common/master-data"
import {optionStylesForInlineUpdate,optionStylesForCreate} from "../../searchable-select/searchable-dropdown-constant"
import i18n from "../../../translate/i18n"
import ToastModal from "../../modal/ToastModal"
import PimerceDataTable from "../../data-table/data-table"
import { Button } from "primereact/button"
import { Toolbar } from "primereact/toolbar"
import { ErrorMessage, Field, Form, Formik } from "formik"
import Select from "react-select"
import ModalComponent from "../../modal"
import { Spinner } from "react-bootstrap"
import * as Yup from "yup"
import PimerceAuth from "../../authorization-tag/PimerceAuth"
import PlusIcon from "../../../common/icons/plusicon"
import CloseIcon  from "../../../common/icons/deleteicon"
import UserIcon from "../../../common/icons/usericon"
import { connect } from "react-redux"
import moment from "moment"

let gridColumn = [
  {
    field: "userName",
    header: "Email ID",
    filter: false,
    width: "35%"
  },
  {
    field: "firstName",
    header: "Name",
    filter: false,
    width: "35%"
  },
  {
    field: "roleName",
    header: "Role",
    sortable: false,
    width: "30%"
  },
]

const mapStateToProps = (state) => {
  return {
    getUserDetail: state.userDetail.getUsersObj.userCredentials
  }
}

function UserManagementComponent(props) {
  const {getUserDetail} = props
  let authJson = JSON.parse(sessionStorage.getItem("authJson"))
  const [isToastMsg, setIsToastMsg] = useState(false)
  const [isLoader, setIsLoader] = useState(true)
  const [toastHeading, setToastHeading] = useState("")
  const [toastContent, setToastContent] = useState("")
  const [titleBackgroundColor, setTitleBackgroundColor] = useState("")
  const [toastSize, setToastSize] = useState("")
  const [isSelectedRowCleared, setIsSelectedRowCleared] = useState(false)
  const [isDeleteRecordsDialog, setIsDeleteRecordsDialog] = useState(false)
  const [isCreateRoleDialog, setIsCreateRoleDialog] = useState(false)
  const [isDisableUpdateButton, setIsDisableUpdateButton] = useState(true)
  const [isDisableDeleteButton, setIsDisableDeleteButton] = useState(true)
  const [isGridCheckBox, setIsGridCheckBox] = useState(false)
  const [onSelected, setOnSelected] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [gridData, setGridData] = useState([])
  const [pageDataReset, setPageDataReset] = useState(false)
  const [editInitCount, setEditInitCount] = useState([])

  let userDetails = getUserDetail

  useEffect(() => {
    getUserListApiRequestObject.organizationId = userDetails.organizationid
    getUserListApiRequestObject.sortType = DESC
    getUserListApiRequestObject.pageStart = 0
    getUserListApiRequestObject.userName = userDetails.userName
    getRolesApiRequestObject.pageStart = 0
    getRolesApiRequestObject.pageEnd = 1000
    getRolesApiRequestObject.organizationid = userDetails.organizationid
    getRolesApiRequestObject.sortField = "id"
    getRolesApiRequestObject.sortType = ASC
    props.getUsers(getUserListApiRequestObject)
    props.getRoles(getRolesApiRequestObject)  
  }, [])

  useEffect(() => {
    const { getRolesResult } = props
    if (
      getRolesResult &&
      getRolesResult.content &&
      getRolesResult.content.data&&
      getRolesResult.content.data.roles
    ) {
      let roles = getRolesResult.content.data.roles.map((i) => {
        return {
          value: i.id,
          label: i.roleName
        }
      })
      setRoleOptions(roles)
    }
  }, [props.getRolesResult])

  useEffect(() => {
    const { getUsersResult } = props
    if (
      getUsersResult &&
      getUsersResult.content &&
      getUsersResult.content.data
    ) {
      let gridData = getUsersResult && getUsersResult.content.data && getUsersResult.content.data.users && getUsersResult.content.data.users.map((i)=>{
        return{
          id: i.id,
          userName : i.userName,
          firstName : i.firstName +" "+i.lastName,
          lastName : i.lastName,
          roleName : i.roleName,
          rolesId : i.rolesId,
          phoneNumber : i.phoneNumber
        }
      })
      // setIsSelectedRowCleared(true)
      setGridData(gridData)
      setTotalRecords(getUsersResult.content.data.totalElement)
      setIsLoader(false)
    }
  }, [props.getUsersResult])

  useEffect(() => {
    const { updateUserResult } = props
    if (
      updateUserResult &&
      updateUserResult.content &&
      updateUserResult.content.status == 200
    ) {
      setIsSelectedRowCleared(true)
      setToastHeading(i18n.t("superAdminContents.updateUserHeader"))
      setToastContent(i18n.t("superAdminContents.userUpdateMessage"))
      setTitleBackgroundColor(VALID_BG_COLOR)
      setToastSize(MEDIUM)
      setIsToastMsg(true)
      //   getUserListApiRequestObject.pageStart = 0
      getUserListApiRequestObject.organizationId = userDetails.organizationid
      props.getUsers(getUserListApiRequestObject)
    } else if (
      updateUserResult &&
      updateUserResult.content &&
      updateUserResult.content.status != 200
    ) {
      setIsSelectedRowCleared(true)
      setToastHeading(i18n.t("superAdminContents.updateUserHeader"))
      setToastContent(i18n.t("toastMessage.requestFailedMessageSuperAdminUpdateRole"))
      setTitleBackgroundColor(ERROR_BG_COLOR)
      setToastSize(MEDIUM)
      setIsToastMsg(true)
      setIsLoader(false)
    }
  }, [props.updateUserResult])

  useEffect(() => {
    const { deleteUsersResult } = props
    if (
      deleteUsersResult &&
      deleteUsersResult.content &&
      deleteUsersResult.content.status == 200
    ) {
      setIsSelectedRowCleared(true)
      setIsDeleteRecordsDialog(false)
      setToastContent(deleteUsersResult.content.data)
      setToastHeading(i18n.t("toastMessage.deleteUser"))
      setTitleBackgroundColor(VALID_BG_COLOR)
      setToastSize(MEDIUM)
      setIsToastMsg(true)
      props.getUsers(getUserListApiRequestObject)
    }else if (
      deleteUsersResult &&
      deleteUsersResult.content &&
      deleteUsersResult.content.status == 207
    ) {
      setIsSelectedRowCleared(true)
      setIsDeleteRecordsDialog(false)
      setToastHeading(i18n.t("toastMessage.deleteUser"))
      setToastContent(
        deleteUsersResult.content.data 
          ? deleteUsersResult.content.data
          : onSelected.length > 1 ? i18n.t("toastMessage.requestFailedMessageSuperAdminDeleteUsers") : i18n.t("toastMessage.requestFailedMessageSuperAdminDeleteUser")
      )
      setTitleBackgroundColor(ERROR_BG_COLOR)
      setToastSize(MEDIUM)
      setIsToastMsg(true)
      props.getUsers(getUserListApiRequestObject)
      setIsLoader(false)
    } 
    else if (
      deleteUsersResult &&
      deleteUsersResult.content &&
      deleteUsersResult.content.status == 300
    ) {
      setIsDeleteRecordsDialog(false)
      setToastHeading(i18n.t("toastMessage.deleteUser"))
      setToastContent(
        deleteUsersResult.content.data 
          ? deleteUsersResult.content.data
          : onSelected.length > 1 ? i18n.t("toastMessage.requestFailedMessageSuperAdminDeleteUsers") : i18n.t("toastMessage.requestFailedMessageSuperAdminDeleteUser") 
      )
      setTitleBackgroundColor(ERROR_BG_COLOR)
      setToastSize(MEDIUM)
      setIsToastMsg(true)
      setIsLoader(false)
    }
    else if(deleteUsersResult &&
      deleteUsersResult.content) {
      setIsDeleteRecordsDialog(false)
      setToastHeading(i18n.t("toastMessage.deleteUser"))
      setToastContent(onSelected.length > 1 ? i18n.t("toastMessage.requestFailedMessageSuperAdminDeleteUsers") : i18n.t("toastMessage.requestFailedMessageSuperAdminDeleteUser"))
      setTitleBackgroundColor(ERROR_BG_COLOR)
      setToastSize(MEDIUM)
      setIsToastMsg(true)
      setIsLoader(false)
    }
  }, [props.deleteUsersResult])

  useEffect(() => {
    const { createUserResult } = props
    if (
      createUserResult &&
      createUserResult.content &&
      createUserResult.content.status == 200
    ) {
      setToastContent(i18n.t("superAdminContents.userCreateMessage"))
      setToastHeading(i18n.t("superAdminContents.createUserHeader"))
      setTitleBackgroundColor(VALID_BG_COLOR)
      setToastSize(MEDIUM)
      setIsCreateRoleDialog(false)
      setIsToastMsg(true)
      setIsLoader(true)
      getUserListApiRequestObject.pageStart = 0
      getUserListApiRequestObject.sortType="DESC"
      props.getUsers(getUserListApiRequestObject)
      setPageDataReset(true)
    } else if (
      createUserResult &&
      createUserResult.content &&
      createUserResult.content.status != 200
    ) {
      setIsCreateRoleDialog(false)
      setToastHeading(i18n.t("superAdminContents.createUserHeader"))
      setToastContent(
        createUserResult.content.data &&
          createUserResult.content.data.description
          ? createUserResult.content.data.description
          : i18n.t("toastMessage.requestFailedMessageSuperAdminCreateUser")
      )
      setTitleBackgroundColor(ERROR_BG_COLOR)
      setToastSize(MEDIUM)
      setIsToastMsg(true)
    }
  }, [props.createUserResult])

  const onHideMultipleDeleteDialog = () => {
    setIsDeleteRecordsDialog(false)
  }

  const onHideCreateDialog = () => {
    setIsCreateRoleDialog(false)
  }

  const validateUsername = (value) => {
    if (!value) {
      return i18n.t("superAdminContents.userName") + " " + REQUIRED_FIELDS
    }
    if (value.length > 50) {
      return i18n.t("superAdminContents.userName") + " " + CHARACTER_SIZE_ISREQUIRED
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      return VALID_EMAIL_ID
    }
  }

  const validateField = (value) => {
    if (!value) {
      return i18n.t("superAdminContents.firstName") + " " + REQUIRED_FIELDS
    }
    // if(value.match(SPECIAL_CASE_VALIDATOR)){
    //   return i18n.t("validationMessage.specialCaseRequired")
    // }
    if (value.length > 50) {
      return i18n.t("superAdminContents.firstName") + " " + CHARACTER_SIZE_ISREQUIRED
    }
  }
  const validateLastName = ( value ) => {
    if (value.length > 50) {
      return i18n.t("superAdminContents.lastName") + " " + CHARACTER_SIZE_ISREQUIRED
    }
    // if(value.match(SPECIAL_CASE_VALIDATOR)){
    //   return i18n.t("validationMessage.specialCaseRequired")
    // } 
  }
  const deleteDialogMessage = () => {
    let message = i18n.t("superAdminContents.deleteSelectedRecords"),
      record = onSelected.length > 1 ? RECORDS : RECORD
    let deleteContentMessage = onSelected.length > 1 ? message : i18n.t("deleteRecord")
    let finalmessage;
    if(onSelected.length > 1){
      finalmessage = deleteContentMessage + " " + onSelected.length + " " +record
    }
    else{
      finalmessage = onSelected!=null && onSelected.length !=0?  deleteContentMessage + ' " '+ onSelected[0].userName +' " ?':null
    }
    
    return finalmessage
  }

  const deleteOnClick = () => {
    let deleteRequest = {
      deleteByIds: onSelected.map((i) => {
        return i.id
      }),
    }
    // setIsLoader(true)
    props.deleteUsers(deleteRequest)
  }
  const deleteAttrDialogue = (
    <React.Fragment>
      <Button
        label={i18n.t("datatable.no")}
        className="p-button-text custom-button cancel-button"
        onClick={() => onHideMultipleDeleteDialog()}
      />
      <Button
        label={i18n.t("datatable.yes")}
        className="p-button-text custom-button btn-yes"
        onClick={() => deleteOnClick()}
      />
    </React.Fragment>
  )

  const selectedRowDataTable = (selectedRow) => {
    if (selectedRow && selectedRow.length >= 1) {
      setIsDisableUpdateButton(true)
      setIsDisableDeleteButton(false)
    } else {
      setIsDisableUpdateButton(true)
      setIsDisableDeleteButton(true)
    }
    if (selectedRow && selectedRow.length == 1) {
      setIsDisableUpdateButton(false)
    }
    setIsSelectedRowCleared(false)
    setOnSelected(selectedRow ? selectedRow : [])
  }

  const handleToastHide = () => {
    setIsToastMsg(false)
    setIsGridCheckBox(false)
  }

  const onRowEditComplete = (e) => {
    setEditInitCount(Object.values(editInitCount).filter(item => item !== e.data.id))
    if(onSelected && onSelected.length > 1){
      setIsDisableDeleteButton(false)
    }
      let { newData, index } = e
      newData.rolesId = newData.roleName.value ? newData.roleName.value : newData.rolesId
      newData.roleName = newData.roleName.label ? newData.roleName.label : newData.roleName
      newData.updatedDate = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss")
      props.updateUser(newData)
      setIsLoader(true)
    // updateAttributeData(newData)
      // setIsGridCheckBox(false)
  }

  const attrSearchFilter = (option, searchText) => {
    if (option.data.label.toLowerCase().includes(searchText.toLowerCase())) {
      return true
    } else {
      return false
    }
  }

  const statusEditor = (options) => {
    editInitCount.length > 0 ? setIsGridCheckBox(true) : setIsGridCheckBox(false)	 
    // if (onSelected && onSelected.length) {
    //   setIsDisableDeleteButton(true)
    // }
    return (
      <Formik
        initialValues={{
          ["userName" + options.rowIndex]: options.value ? options.value : "",
          idx: options.rowIndex,
          ["firstName" + options.rowIndex]: options.value ? options.value : "",
          idx: options.rowIndex,
          ["lastName" + options.rowIndex]: options.value ? options.value : "",
          idx: options.rowIndex,
          ["roleName" + options.rowIndex]: options.value ? options.value : "",
          idx: options.rowIndex,
        }}
      >
        {({ errors, setFieldValue, handleBlur, touched, values }) => (
          <div>
            <Form>
              {options.field == i18n.t("superAdminContents.userNameOption") ? (
                <div className="p-field p-col-12 p-md-12">
                  {values["userName" + options.rowIndex]}
                </div>
              ) : null}
              {options.field == i18n.t("superAdminContents.firstNameOption")? (
                <div className="p-field p-col-12 p-md-12">
                  {values["firstName" + options.rowIndex]}
                </div>
              ) : null}
              {options.field ==  i18n.t("superAdminContents.lastNameOption") ? (
                <div className="p-field p-col-12 p-md-12">
                  {values["lastName" + options.rowIndex]}
                </div>
              ) : null}
              {options.field == i18n.t("superAdminContents.roleNameOption") ? (
                <div className="p-field p-col-12 p-md-12">
                  <Select
                    className="user-role-dropdown"
                    type="select"
                    name="attrType"
                    // value={roleOptions.find((e) => e.label == values["roleName" + options.rowIndex])}
                    classNamePrefix={`${
                      touched.attrType && errors.attrType
                        ? ERROR_DROPDOWN_CLASSNAME
                        : ""
                    } pim-dropdown`}
                    styles={optionStylesForInlineUpdate}
                    options={roleOptions}
                    isMulti={false}
                    onBlur={handleBlur}
                    menuPortalTarget={document.body}
                    onChange={(e) => {
                      setFieldValue("roleName" + options.rowIndex, e.label)
                      options.editorCallback(e)
                    }}
                    placeholder={options.value}
                    filterOption={attrSearchFilter}
                  />
                </div>
              ) : null}
            </Form>
          </div>
        )}
      </Formik>
    )
  }

  const buttonTemplate = () => {
    return (
      <React.Fragment>
        <PimerceAuth
          componentId={"35"}
          componentType="button"
          component={
            <>
              <Button
                label={i18n.t("superAdminContents.addNewUser")}
                className="p-button-success btn-active-17 pimbtn p-mr-2"
                onClick={() => {
                  setIsCreateRoleDialog(true)
                }}
              >
                <PlusIcon svgLeftSpace="15px"/>
              </Button>
            </>
          }
        />
        <PimerceAuth
          componentId={"36"}
          componentType="button"
          component={
            <Button
              label={i18n.t("superAdminContents.deleteUser")}
              className="p-button-danger btn-active-17 pimbtn"
              onClick={() => {
                setIsDeleteRecordsDialog(true)
              }}
              disabled={isDisableDeleteButton}
            >
            <CloseIcon svgLeftSpace="15px"/>
            </Button>
          }
        />
        {/* <Button
              label={updateButtonLabel}
              icon="fa fa-refresh"
              iconPos="right"
              className="p-button-danger pimbtn"
              onClick={() => openDialog(UPDATE)}
              disabled={isDisableUpdateButton}
            /> */}
      </React.Fragment>
    )
  }

  const onPageChange = (pagedata) => {
    setPageDataReset(false)
    setIsLoader(true)
    getUserListApiRequestObject.pageStart = pagedata.page
    getUserListApiRequestObject.organizationId = userDetails.organizationid
    props.getUsers(getUserListApiRequestObject)
  }

  const onRowEditCancel = (data) => {
    setEditInitCount(Object.values(editInitCount).filter(item => item !== data.data.id))
    if (onSelected && onSelected.length) {
      setIsDisableDeleteButton(false)
    }
    // setIsGridCheckBox(false)
  }

  const onRowEditInit = (data) =>{
    setEditInitCount(editInitCount.concat(data.data.id))
    setIsGridCheckBox(true)
  }

  const createDialogContent = (
    <Formik
      initialValues={{
        userName: "",
        firstName: "",
        lastName: "",
        role: "",
      }}
      validationSchema={Yup.object().shape({
        role: Yup.number().required(i18n.t("superAdminContents.role")+" "+REQUIRED_FIELDS),
      })}
      onSubmit={(values) => {
        userCreateApiRequest.rolesId = values.role
        userCreateApiRequest.firstName = values.firstName
        userCreateApiRequest.displayName = values.firstName
        userCreateApiRequest.lastName = values.lastName
        userCreateApiRequest.userName = values.userName
        userCreateApiRequest.emailID = values.userName
        userCreateApiRequest.organizationId = userDetails.organizationid
        props.createUser(userCreateApiRequest)
      }}
    >
      {({
        values,
        errors,
        handleChange,
        setFieldTouched,
        setFieldValue,
        handleBlur,
        touched,
        isSubmitting,
      }) => (
        <div>
          <Form className="p-col-12 form-style">
            <div className="p-field p-col-12 p-md-12">
              <label htmlFor="userName" className="required">
                {i18n.t("superAdminContents.userName")}
              </label>
              <label className="ml-2"  style={values.userName && values.userName.length >= MAXSIZENAME ? { color: "red" }: { color: "black" }}>
                  {values.userName ? " (" + values.userName.length + "/" + MAXSIZENAME + ")" : " (" + 0 + "/" + MAXSIZENAME + ")"} 
              </label>
              <Field
                id="attrName"
                disabled={isSubmitting}
                className={
                  touched.userName && errors.userName
                    ? ERROR_FIELD_CLASSNAME
                    : "p-inputtext p-component p-inputnumber-input"
                }
                style={{
                  width: "-moz-available",
                  width: "-webkit-fill-available",
                }}
                name="userName"
                type="text"
                maxLength={MAXSIZENAME}
                onChange={(e)=>{
                      // setFieldTouched('userName')
                      handleChange(e)
                }}
                onBlur={handleBlur}
                validate={validateUsername}
              ></Field>
              <div className="errorMsg">
                <ErrorMessage name="userName" />
              </div>
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="firstName" className="required">
                {i18n.t("superAdminContents.firstName")}
              </label>
              <label className="ml-2"  style={values.firstName && values.firstName.length >= MAXSIZENAME ? { color: "red" }: { color: "black" }}>
                  {values.firstName ? " (" + values.firstName.length + "/" + MAXSIZENAME + ")" : " (" + 0 + "/" + MAXSIZENAME + ")"} 
              </label>
              <Field
                id="attrName"
                disabled={isSubmitting}
                className={
                  touched.firstName && errors.firstName
                    ? ERROR_FIELD_CLASSNAME
                    : "p-inputtext p-component p-inputnumber-input"
                }
                name="firstName"
                style={{
                  width: "-moz-available",
                  width: "-webkit-fill-available",
                }}
                type="text"
                maxLength={MAXSIZENAME}
                onChange={(e)=>{
                  setFieldTouched('firstName')
                  handleChange(e)
                }}
                onBlur={handleBlur}
                validate={validateField}
              ></Field>
              <div className="errorMsg">
                <ErrorMessage name="firstName" />
              </div>
            </div>
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="lastName">{i18n.t("superAdminContents.lastName")}</label>
              <label className="ml-2"  style={values.lastName && values.lastName.length >= MAXSIZENAME ? { color: "red" }: { color: "black" }}>
                  {values.lastName ? " (" + values.lastName.length + "/" + MAXSIZENAME + ")" : " (" + 0 + "/" + MAXSIZENAME + ")"} 
              </label>
              <Field
                id="attrName"
                disabled={isSubmitting}
                style={{
                  width: "-moz-available",
                  width: "-webkit-fill-available",
                }}
                className={
                  touched.lastName && errors.lastName
                    ? ERROR_FIELD_CLASSNAME
                    : "p-inputtext p-component p-inputnumber-input"
                }
                name="lastName"
                type="text"
                maxLength={MAXSIZENAME}
                onChange={(e)=>{
                  setFieldTouched('lastName')
                  handleChange(e)
                }}
                onBlur={handleBlur}
                validate={validateLastName}
              ></Field>
              <div className="errorMsg">
                <ErrorMessage name="lastName" />
              </div>
            </div>
            <div className="p-field p-col-12 p-md-12">
              <label htmlFor="role" className="required">
                {i18n.t("superAdminContents.role")}
              </label>
              <Select
                className="attribute-dropdown"
                type="select"
                styles={optionStylesForCreate}
                options={roleOptions}
                multi={false}
                onBlur={handleBlur}
                classNamePrefix={`${
                  touched.role && errors.role ? ERROR_DROPDOWN_CLASSNAME : ""
                } pim-dropdown`}
                onChange={(el) => {
                  setFieldValue("role", el.value)
                }}
                value={roleOptions.find((e) => e.value == values.role)}
                isDisabled={isSubmitting}
                isSearchable={true}
                filterOption={attrSearchFilter}
              />
              <div className="errorMsg">
                <ErrorMessage name="role" />
              </div>
            </div>

            {isSubmitting === true ? (
              <div className="p-dialog-footer-user mx-auto">
                <button
                  className="p-button p-component p-button-text custom-button user-manage-footer"
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
              <div className="w-100 p-dialog-footer user-manage-footer d-flex justify-content-center">
                <button
                  type="button"
                  onClick={onHideCreateDialog}
                  className="pim-btn pim-btn-primary pim-font-property"
                >
                  {i18n.t("commonButton.cancel")}
                </button>
                <button
                  type="submit"
                  className="pim-btn pim-btn-main pim-font-property ml-2"
                >
                  {i18n.t("commonButton.create")}
                </button>
              </div>
            )}
          </Form>
        </div>
      )}
    </Formik>
  )

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
      <ModalComponent
        isShowModal={isDeleteRecordsDialog}
        onHideModal={onHideMultipleDeleteDialog}
        modalTitle={i18n.t("superAdminContents.deleteUser")}
        modalContent={
          <div className="confirmation-content">
            <i
              className="exclamation-triangle mt-1"
            />
            <span>
              {deleteDialogMessage()}
              {/* {"Do you want to delete the selected "}  {onSelected.length + onSelected.length > 1 ? " records" : " record"} */}
            </span>
          </div>
        }
        modalSize="md"
        modalDailogClassName="modalDailogContent smallDialog delete-md-modal-cussize"
        modalFooter={deleteAttrDialogue}
      />

      <ModalComponent
        isShowModal={isCreateRoleDialog}
        onHideModal={onHideCreateDialog}
        modalTitle={i18n.t("superAdminContents.createUser")}
        modalContent={createDialogContent}
        modalSize="md"
        modalDailogClassName="modalDailogContent smallDialog userRole modal-md-cus_size user-header"
      />

      <div className="p-grid common-header-section">
        <h5 className="p-m-0  p-col-12  page-header">
          <UserIcon /> {i18n.t("superAdminContents.manageUser")}
        </h5>
      </div>
      <PimerceDataTable
        isHeaderButtonVisible={false}
        columnData={gridColumn}
        data={gridData}
        isSelectedRowCleared={isSelectedRowCleared}
        totalRecords={totalRecords}
        isPaginator={true}
        isScrollable={false}
        isLazy={true}
        // gridHeader={i18n.t("superAdminContents.userList")}
        popupHeader={i18n.t("superAdminContents.createUser")}
        isPopupCancelBtn={false}
        // headerButtonsGrb={headerButtonGroup}
        isToolbar={true}
        deleteButtonLabel={i18n.t("superAdminContents.deleteUser")}
        updateButtonLabel={i18n.t("superAdminContents.updateUser")}
        isGridCheckBox={authJson["23"].isEnabled ? isGridCheckBox : true}
        isLoader={isLoader}
        // exportCallback={exportTrigger}
        onSelectedRowDataTable={selectedRowDataTable}
        isHeaderSearch={false}
        isHeaderfilter={false}
        scrollHeight={SCROLL_HEIGHT}
        scrollWidth={SCROLL_WIDTH}
        columnResizeMode={COLUMN_RESIZE_MODE}
        gridSize={GRID_SIZE}
        handlePagination={onPageChange}
        // updateAttributeData={updateAttributeData}
        statusEditor={statusEditor}
        onRowEditComplete={onRowEditComplete}
        // rowEditValidator={rowEditValidator}
        onRowEditCancel={onRowEditCancel}
        onRowEditInit={onRowEditInit}
        enableRowEdit={authJson["23"].isEnabled}
        pageDataReset={pageDataReset}
        headerButtonTemplate={buttonTemplate()}
      />
      {/* <Toolbar className="p-mb-4" left={buttonTemplate} /> */}
    </div>);
}

export default connect(mapStateToProps)(UserManagementComponent)