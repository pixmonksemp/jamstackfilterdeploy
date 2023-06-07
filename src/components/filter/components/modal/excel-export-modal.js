import React, { Component } from 'react'
import { Row, Col, Container, Button, Image } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './style.scss'
import shape from '../../assets/shape.svg'
import { emailFieldValidation } from '../../pages/login/validateEmailField'
import SearchableDropdown from '../searchable-select/index'
import DatePickerControl from '../date-picker/datePickerController'
import moment from 'moment'
import extend from 'extend'
import { downloadExcel } from '../../actions/action-full-excel-download'
import ModalComponent from '../modal/index'
import ToolTip from '../tooltip/tooltip'
import ToastModal from './ToastModal'
import {
	DATE_FORMAT,
	SUBMIT,
	CANCEL,
	SENT_THE_DOCUMENT_TO,
	MANDATORY_SYMBOL,
	REGISTERED_EMAIL,
	PREFERRED_EMAIL,
	ENTER_AUTHORIZED_EMAIL,
	X_LARGE,
	PREFERRED_EMAIL_VALIDATION,
	EXPORT_FOOTER_TEXT,
	MEDIUM,
	ERROR_BG_COLOR,
	TOAST_TITTLE_FOR_FAIL,
	DISPLAY_DATE_FORMAT,
	SELECT_DATE,
	COMMA,
	AT,
	TOAST_TO_DATE_MISSING,
	DATE_RANGE_MESSAGE,
	MAIL_ALREADY_ENTERED
} from '../../common/common-constants'
import IconNote from '../../assets/note.svg'
import { dateToLocalString } from '../date-picker/dateFormater'
import { POWER_SKU } from '../filter-component/filterdata-constant'
import ExportFilterContainer from '../../container/filter-container/export-filter-container'

const mapStateToProps = (state) => {
	return {
		profileData: state.userContext.userProfile,
		postFilterData: state.dashboardValue.selectedFilters,
		selectedDataForExcel: state.dashboardValue.selectedDataForExcel,
		getOrganizationId: state.userContext.getUsersObj.userCredentials,
		getExcelExportDataValue: state.stateData.getExcelExportDataValue,
		getFilterDataValue: state.stateData.getFilterdata,
		getOrganizationDetails: state.userContext.organizationDetails
	}
}
const mapDispatchToProps = (dispatch) => {
	return {}
}

let userId, organizationId, preferredEmailCount

const date = {
	Sunday: 1,
	Monday: 2,
	Tuesday: 3,
	Wednesday: 4,
	Thursday: 5,
	Friday: 6,
	Saturday: 7
}

class ExcelExportModal extends Component {
	static propTypes = {
		modalTitle: PropTypes.string,
		commonReducerName: PropTypes.object,
		// isExportDropDownValuesLoaded:PropTypes.func,
		show: PropTypes.bool,
		onHide: PropTypes.func,
		pageName: PropTypes.string,
		isDataPresent: PropTypes.bool,
		isLoading: PropTypes.bool,
		isSingleDate: PropTypes.bool,
		defaultSelectedDate: PropTypes.string,
		rangeLimit: PropTypes.number,
		monthLimit: PropTypes.number,
		isExportDatePresent: PropTypes.bool,
		//Export - Filter Meta Data Structure
		exportFilterMetaDataStrucutre: PropTypes.object,
		isSingleSelect: PropTypes.bool,
		weeklyDaySelect: PropTypes.bool,
		isDateRangeMessageShow: PropTypes.bool,
		isShowOnlySearchScrapDates: PropTypes.bool,
		frequencyScrapDay: PropTypes.string,
		frequencyScrapDates: PropTypes.array,
		exportDefaultDateSelected: PropTypes.string,
		hidedDropDownList: PropTypes.array,
		singleSelectDropDownList: PropTypes.array,
		hideDropdownListWithFunctionality: PropTypes.array,
		moduleName: PropTypes.string,
		configureFirstPagePosition: PropTypes.bool,
		pageNameForExport: PropTypes.string
	}

	static defaultProps = {
		isSingleDate: false,
		isExportDropDownValuesLoaded: false,
		modalTitle: 'Export Excel',
		isExportDatePresent: true,
		isSingleSelect: false,
		weeklyDaySelect: false,
		isDateRangeMessageShow: false,
		isShowOnlySearchScrapDates: false,
		frequencyScrapDay: '',
		frequencyScrapDates: [],
		exportDefaultDateSelected: new Date(),
		hidedDropDownList: [
			'keywordCategory',
			'keyword',
			'sku',
			'seller',
			'slider',
			'date',
			'mustsell',
			'position',
			'keyaccount'
		],
		singleSelectDropDownList: []
	}

	constructor(props) {
		super(props)
		this.state = {
			applyClicked: false,
			isDateChange: false,
			isSubmitClicked: false,
			errorMessage: false,
			startDateValue: '',
			validateRequest: false,
			initialToast: false,
			emailValid: false,
			isSameUserId: false,
			showExcelFailure: false,
			emailIdInput: '',
			isOrganizationEmailId: false,
			isToDateNull: false,
			isDateChanged: false,
			isNullDateChecked: false,
			emailTargetValue: [],
			emailLimit: false,
			isEmailDuplicate: false
		}

		this.handleChange = this.handleChange.bind(this)
		this.onStartChange = this.onStartChange.bind(this)
		this.handleHideToastModal = this.handleHideToastModal.bind(this)
		this.handleKeyPress = this.handleKeyPress.bind(this)
	}

	handleRemove(index) {
		const list = this.state.emailTargetValue
		list.splice(index, 1)
		this.setState({ emailTargetValue: list })
	}

	handleKeyPress(event) {
		const { getOrganizationDetails, getExcelExportDataValue } = this.props
		preferredEmailCount = getOrganizationDetails.data.module.preferredEmailCount ? getOrganizationDetails.data.module.preferredEmailCount : 5
		if (!event.target.value == '' && event.key == 'Enter') {
			const isEmailValid = emailFieldValidation(event.target.value.trim())
			const checkEmailIsDuplicate = this.state.emailTargetValue.includes(event.target.value)
			const checkEmailLimit = this.state.emailTargetValue.length
			if (!checkEmailIsDuplicate) {
				if (isEmailValid) {
					if (checkEmailLimit < preferredEmailCount) {
						this.setState({ emailTargetValue: [...this.state.emailTargetValue, event.target.value.toLowerCase()], emailIdInput: '', emailLimit: false })
						this.setState({ emailValid: !isEmailValid })
					} else {
						this.setState({ emailLimit: true })
					}
					this.setState({ emailValid: false })
				} else {
					this.setState({ emailValid: true })
				}
				this.setState({ isEmailDuplicate: false })
			} else {
				this.setState({ isEmailDuplicate: true })
			}
		}
	}

	handleChange(event) {
		const { getExcelExportDataValue } = this.props
		this.setState({
			[event.target.name]: event.target.value,
			errorMessage: false,
			isSameUserId: false,
			emailIdInput: event.target.value
		})
		if (event.target.value === userId) {
			return null
		} else if (event.target.value) {
			const isEmailValid = emailFieldValidation(event.target.value.trim())
			this.setState({ emailValid: !isEmailValid })
		} else {
			this.setState({ emailValid: false, emailLimit: false, emailValid: false, isEmailDuplicate: false })
		}
		this.state.emailIdInput = event.target.value
	}

	handleSubmit(e) {
		const {
			getExcelExportDataValue,
			handleApplyFilter,
			getFilterDataValue
		} = this.props
		let {
			emailValid,
			emailIdInput,
			isOrganizationEmailId,
			isToDateNull,
			isDateChanged,
			startDateValue
		} = this.state

		let validEmails =
			getFilterDataValue &&
			getFilterDataValue.organization &&
			getFilterDataValue.organization.module &&
			getFilterDataValue.organization.module.AuthorizedEmailDomain
		let validId = validEmails.split(COMMA)
		let emailInput = emailIdInput.split(AT)

		userId =
			this.props.profileData &&
			this.props.profileData.data &&
			this.props.profileData.data.username

		this.setState({ isSubmitClicked: true })

		let checkid = false
		validId.map((i) => {
			if (i == emailInput[1] && !checkid) {
				checkid = true
				isOrganizationEmailId = true
			}
		})

		const { isSingleSelect, weeklyDaySelect } = this.props

		this.setState({ applyClicked: true, initialToast: false })

		if (!isOrganizationEmailId && emailIdInput != '') {
			this.setState({ errorMessage: true })
		} else if (
			this.state.yourEmail &&
			!emailValid &&
			this.state.yourEmail === userId
		) {
			this.setState({ errorMessage: true, isSameUserId: true })
		} else if (!emailValid && this.state.yourEmail !== userId) {
			this.setState({ errorMessage: false })
			if (!isSingleSelect) {
				let rangeDate, rangeFrom, rangeTo
				rangeDate = startDateValue.split('-')
				rangeFrom = moment(rangeDate[0]).format(DATE_FORMAT)
				rangeTo = moment(rangeDate[1]).format(DATE_FORMAT)

				getExcelExportDataValue.fromDate = rangeFrom
				getExcelExportDataValue.toDate = rangeTo

				if (!isToDateNull) {
					if (
						getExcelExportDataValue.fromDate !== '' &&
						isDateChanged
					) {
						if (emailIdInput == '')
							getExcelExportDataValue.preferredMail = null
					} else {
						getExcelExportDataValue.fromDate =
							moment(startDateValue).format(DATE_FORMAT)
						getExcelExportDataValue.toDate =
							moment(startDateValue).format(DATE_FORMAT)

						if (emailIdInput == '')
							getExcelExportDataValue.preferredMail = null
					}

					this.setState({
						isNullDateChecked: false
					})
				} else {
					this.setState({
						isNullDateChecked: true
					})
				}
			} else {
				getExcelExportDataValue.fromDate =
					moment(startDateValue).format(DATE_FORMAT)
				getExcelExportDataValue.toDate =
					moment(startDateValue).format(DATE_FORMAT)
				if (emailIdInput == '')
					getExcelExportDataValue.preferredMail = null
			}
			if (weeklyDaySelect) {
				if (startDateValue && startDateValue.from) {
					getExcelExportDataValue.fromDate = moment(startDateValue.from).format(DATE_FORMAT)
					getExcelExportDataValue.toDate = moment(startDateValue.to).format(DATE_FORMAT)
				} else {
					getExcelExportDataValue.fromDate = moment(startDateValue).format(DATE_FORMAT)
					getExcelExportDataValue.toDate = moment(startDateValue).format(DATE_FORMAT)
				}
			}
			if (emailIdInput == '') {
				let emailTargetaArrayValue = []
				emailTargetaArrayValue = this.state.emailTargetValue
				getExcelExportDataValue.preferredMail = emailTargetaArrayValue.toString()
			}
			else{
				getExcelExportDataValue.preferredMail = emailIdInput
			}
			handleApplyFilter(getExcelExportDataValue)
		}

		this.setState({
			isDateChanged: false
		})
	}

	componentWillMount() {
		const {
			selectedDataForExcel,
			getOrganizationId,
			defaultSelectedDate,
			exportDefaultDateSelected,
			getExcelExportDataValue,
			profileData
		} = this.props

		this.props.getExcelExportDataValue.isExportDropDownValuesLoaded = false
		selectedDataForExcel.position = 10

		if (getOrganizationId && getOrganizationId.organizationid) {
			organizationId = getOrganizationId.organizationid
		}
		this.setState({
			isSubmitClicked: false
		})
		let dateValueInitial = this.props.isShowOnlySearchScrapDates
			? moment(exportDefaultDateSelected).format(DISPLAY_DATE_FORMAT)
			: moment(defaultSelectedDate).format(DISPLAY_DATE_FORMAT)

		this.setState({
			startDateValue: dateValueInitial
		})
	}

	componentWillReceiveProps(nextProps) {
		const { isLoading, getExcelExportDataValue, profileData } = nextProps
		if (
			nextProps &&
			nextProps.isDataPresent == 'Data' &&
			this.state.isSubmitClicked &&
			!isLoading &&
			!this.state.initialToast
		) {
			this.state.validateRequest = false
			userId =
				this.props.profileData &&
				this.props.profileData.data &&
				this.props.profileData.data.username
			const exportModalRequest = {
				moduleName: this.props.pageName,
				processFlag: false,
				additionalEmailId: this.state.yourEmail,
				createdDate: moment(new Date()).format(DATE_FORMAT),
				emailId: userId,
				userName: 'pixmonks',
				reportType: 'excel',
				showNotification: false,
				filterCriteria: JSON.stringify(this.props.commonReducerName)
			}
			const res = downloadExcel(exportModalRequest)
			this.state.initialToast = true
			res.payload
				.then((res) => {
					if (res && res.status === 200) {
						this.props.onHide('successToast')
					}
				})
				.catch((err) => {
					this.props.onHide('failToast')
				})
		} else if (
			nextProps &&
			nextProps.isDataPresent == 'No Data' &&
			this.state.isSubmitClicked &&
			!isLoading &&
			!this.state.initialToast
		) {
			this.state.initialToast = true

			this.setState({
				validateRequest: true,
				showExcelFailure: true
			})
		}
	}

	handleHideToastModal() {
		this.setState({ isNullDateChecked: false })
	}

	exportData(data) { }

	dateOnChange(value) {
		dateValue = value
	}
	renderDatePicker() {
		const {
			rangeLimit,
			monthLimit,
			isExportDatePresent,
			isSingleSelect,
			isShowOnlySearchScrapDates,
			getExcelExportDataValue,
			frequencyScrapDay,
			frequencyScrapDates,
			isDateRangeMessageShow,
			exportDefaultDateSelected,
			weeklyDaySelect
		} = this.props
		let { endDateValue, startDateValue } = this.state
		let dateFormat
		let currentDate = moment(new Date()).format(DISPLAY_DATE_FORMAT)
		return (
			<Row>
				<Col
					lg={4}
					md={10}
					sm={10}
					xs={10}
					xl={4}
					className='modalText'>
					{isExportDatePresent ? (
						!isSingleSelect ? (
							<>
								{SELECT_DATE}
								<span className='mandatorySymbol'>
									{MANDATORY_SYMBOL}
								</span>
								<div className='modalDatepicker'>
									<DatePickerControl
										inputfontsize={true}
										onChange={this.onStartChange}
										value={startDateValue}
										endDate={dateFormat}
										daterange={true}
										dateRangeLimit={rangeLimit}
										monthLimit={monthLimit}
										afterDate={moment(
											exportDefaultDateSelected
										).format(DISPLAY_DATE_FORMAT)}
										isCalendarPositionTop={false}
										selectedDateRange={(data) =>
											this.exportData(data)
										}
										isShowOnlySearchScrapDates={
											isShowOnlySearchScrapDates
										}
										frequencyScrapDay={frequencyScrapDay}
										frequencyScrapDates={frequencyScrapDates}
									/>
								</div>
								{isDateRangeMessageShow && (
									<div className='exportDateRange'>
										{DATE_RANGE_MESSAGE}
									</div>
								)}
							</>
						) : (
							<>
								{SELECT_DATE}
								<span className='mandatorySymbol'>
									{MANDATORY_SYMBOL}
								</span>
								<div className='modalDatepicker'>
									<DatePickerControl
										inputfontsize={true}
										onChange={this.onStartChange}
										value={startDateValue}
										weeklyDaySelect={weeklyDaySelect}
										beforeDate={moment(
											exportDefaultDateSelected
										).format(DISPLAY_DATE_FORMAT)}
										isCalendarPositionTop={false}
										isShowOnlySearchScrapDates={
											isShowOnlySearchScrapDates
										}
										frequencyScrapDay={frequencyScrapDay}
										frequencyScrapDates={frequencyScrapDates}
									/>
								</div>
							</>
						)
					) : (
						<></>
					)}
				</Col>
			</Row>
		)
	}

	onStartChange(value) {
		if (null == value.to) {
			this.setState({
				isToDateNull: true
			})
		} else {
			this.setState({
				isToDateNull: false
			})
		}

		this.setState({
			isDateChanged: true
		})
		let { isSingleDate, getExcelExportDataValue, isSingleSelect, weeklyDaySelect } =
			this.props

		let selectedFromDate, selectedToDate, startdatevalue
		if (isSingleDate) {
			selectedFromDate = moment(new Date(value)).format(DATE_FORMAT)

			startdatevalue = `${dateToLocalString(value)}`
		} else {
			selectedFromDate = moment(new Date(value.from)).format(DATE_FORMAT)
			selectedToDate = moment(new Date(value.to)).format(DATE_FORMAT)
			startdatevalue = `${dateToLocalString(
				value.from
			)} - ${dateToLocalString(value.to)}`
		}
		this.setState({
			startDateValue: startdatevalue,
			isDateChange: true
		})

		const dateChange = extend(true, {}, getExcelExportDataValue)
		dateChange.fromDate = selectedFromDate
		dateChange.toDate = selectedToDate

		getExcelExportDataValue = dateChange

		if (isSingleSelect) {
			this.setState({
				startDateValue: value
			})
			getExcelExportDataValue.toDate = moment(new Date(value)).format(
				DATE_FORMAT
			)

			getExcelExportDataValue.fromDate = moment(new Date(value)).format(
				DATE_FORMAT
			)
		}
		if (weeklyDaySelect) {
			this.setState({
				startDateValue: value
			})

		}

	}
	handleSubmitButtonEnabled = (status) => {
		if (status != this.state.isExportDropDownValuesLoaded) {
			this.setState({
				isExportDropDownValuesLoaded: status
			})
		}
	}
	modalcontent() {
		const {
			onHide,
			modalTitle,
			exportFilterMetaDataStrucutre,
			hideDropdownListWithFunctionality,
			configureFirstPagePosition,
			moduleName
		} = this.props

		return (
			<Container>
				<Row className='modalTitleStyles'>{modalTitle}</Row>
				<ExportFilterContainer
					isExportDropDownValuesLoaded={(status) =>
						this.handleSubmitButtonEnabled(status)
					}
					metaDataStructure={exportFilterMetaDataStrucutre}
					hideDropdown={this.props.hidedDropDownList}
					isExportExcelFilter={true}
					isPreferredRetailer={false}
					isPreferredBrand={false}
					isPreferredCategory={false}
					hideDropdownListWithFunctionality={
						hideDropdownListWithFunctionality
					}
					pageNameForExport={this.props.pageNameForExport}
					singleSelectDropdown={this.props.singleSelectDropDownList}
					moduleName={moduleName}
					configureFirstPagePosition={configureFirstPagePosition}
				/>
				{this.renderDatePicker()}
				<hr className='modalLine' />
				<div className='exportText'>{SENT_THE_DOCUMENT_TO}</div>
				<Row>
					<Col
						lg={4}
						md={10}
						sm={10}
						xs={10}
						xl={4}
						className='modalText'>
						{REGISTERED_EMAIL}
						<input
							type='text'
							name='yourEmail'
							value={userId}
							className='modalInputBox'
							disabled
						/>
					</Col>
					<Col
						lg={4}
						md={10}
						sm={10}
						xs={10}
						xl={4}
						className='modalText'>
						{PREFERRED_EMAIL}
						<span className='email-notifytext'>{` ( ${EXPORT_FOOTER_TEXT} )`}
							{/* Preferred Email notify label as a tooltip in the future we need to use 
								<ToolTip
								content={EXPORT_FOOTER_TEXT}
								position='top'>
								<Image src={IconNote} className='noteIcon' /></ToolTip> */}
						</span>

						<div className="modal-inputbox-email">
							{this.state.emailTargetValue && this.state.emailTargetValue.map((i, index) => {
								return (
									<span className="tag label label-info">{i.toLowerCase()}<span onClick={this.handleRemove.bind(this, index)} className='remove-email-input'>x</span></span>
								)
							})}
							<input type="text" className='inner-input' placeholder="          " value={this.state.emailIdInput} size="10" onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
						</div>

						{this.state.emailValid ? (
							<p className='errorMessage'>
								<Image src={shape} className="error-Message-Icon" /> {ENTER_AUTHORIZED_EMAIL}
							</p>
						) : this.state.emailLimit ? (
							<p className='errorMessage'>
								<Image src={shape} className="error-Message-Icon" /> {`Enter only ${preferredEmailCount} emails`}
							</p>
						) : this.state.isEmailDuplicate ? (
							<p className='errorMessage'>
								<Image src={shape} className="error-Message-Icon" /> {MAIL_ALREADY_ENTERED}
							</p>
						) : null}
						{this.state.errorMessage && !this.state.isSameUserId ? (
							<p className='errorMessage'>
								<Image src={shape} /> {ENTER_AUTHORIZED_EMAIL}
							</p>
						) : (
							this.state.isSameUserId && (
								<p className='errorMessage'>
									<Image src={shape} />{' '}
									{PREFERRED_EMAIL_VALIDATION}
								</p>
							)
						)}
					</Col>
					<Col
						xl={4}
						lg={10}
						md={10}
						xs={10}
						className={
							this.state.isExportDropDownValuesLoaded
								? 'submit-button'
								: 'submit-button-disabled'
						}>
						<Button className='cancelBtn' onClick={onHide}>
							{CANCEL}
						</Button>
						&emsp;
						<Button
							className={
								this.state.isExportDropDownValuesLoaded
									? 'submitBtn'
									: 'submitBtnDisbled'
							}
							onClick={this.handleSubmit.bind(this)}>
							{SUBMIT}
						</Button>
					</Col>
				</Row>
			</Container>
		)
	}

	render() {
		const { show, onHide, getExcelExportDataValue } = this.props
		const { isNullDateChecked } = this.state

		userId =
			this.props.profileData &&
			this.props.profileData.data &&
			this.props.profileData.data.username

		getExcelExportDataValue.registeredMail = userId

		return (
			<>
				<ModalComponent
					isShowModal={show}
					onHideModal={onHide}
					modalSize={X_LARGE}
					isShowButton={onHide}
					modalContent={this.modalcontent()}
				/>
				<ToastModal
					show={isNullDateChecked}
					onModalHide={this.handleHideToastModal}
					title={TOAST_TITTLE_FOR_FAIL}
					titleBackgroundColor={ERROR_BG_COLOR}
					content={TOAST_TO_DATE_MISSING}
					modalSize={MEDIUM}
				/>
			</>
		)
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(ExcelExportModal)
