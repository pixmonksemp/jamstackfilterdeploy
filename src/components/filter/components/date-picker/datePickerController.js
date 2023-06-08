// /** @format */

// import React, { Component } from 'react'
// import 'react-day-picker/lib/style.css'
// import './style.scss'
// import { InputGroup, FormControl, Dropdown } from 'react-bootstrap'
// import PropTypes from 'prop-types'
// import DayPicker, { DateUtils } from 'react-day-picker'
// import {
// 	dateStringValue,
// 	dateToLocalString,
// 	dateRangeValue
// } from './dateFormater'
// import { DATE_FORMAT, LOGIN_USER_DETAILS } from '../../common/common-constants'
// import { connect } from 'react-redux'
// import moment from 'moment'

// const mapStateToProps = (state) => {
// 	return {
// 		getFilterDataValue: state.stateData.getFilterdata,
// 	}
// }

// let sortedDays,
// 	scrapFrequency,
// 	startDate,
// 	endDate,
// 	weeklySelect = {},
// 	bundleHierarchy,
// 	isLoggedIn
// class DatePickerControl extends Component {
// 	static propTypes = {
// 		onChange: PropTypes.func.isRequired,
// 		value: PropTypes.string,
// 		placeholder: PropTypes.string,
// 		showCalendarIcon: PropTypes.bool,
// 		beginDate: PropTypes.string,
// 		beforeDate: PropTypes.string,
// 		afterDate: PropTypes.string,
// 		endDate: PropTypes.string,
// 		inputfontsize: PropTypes.bool,
// 		daterange: PropTypes.bool,
// 		defaultSelectedDate: PropTypes.string,
// 		className: PropTypes.string,
// 		dateRangeLimit: PropTypes.number,
// 		monthLimit: PropTypes.number,
// 		isCalendarPositionTop: PropTypes.bool,
// 		selectedDateRange: PropTypes.func,
// 		borderDisable: PropTypes.bool,
// 		isShowOnlySearchScrapDates: PropTypes.bool,
// 		frequencyScrapDay: PropTypes.string,
// 		frequencyScrapDates: PropTypes.array,
// 		isDateLabelNeeded: PropTypes.bool,
// 		datePickerContainerClassname: PropTypes.string,
// 		datePickerInputTextClassname: PropTypes.string,
// 		datePickerCalenderIconClassname: PropTypes.string,
// 		datePickerMainContainerClassname: PropTypes.string,
// 		selectTodayButton: PropTypes.string,
// 		isFilterComponent: PropTypes.bool,
// 		calenderPositionBottom: PropTypes.string	
// 	}

// 	static defaultProps = {
// 		showCalendarIcon: false,
// 		inputfontsize: false,
// 		weeklyDaySelect: false,
// 		daterange: false,
// 		monthLimit: '3',
// 		dateRangeLimit: '5',
// 		isCalendarPositionTop: true,
// 		isShowOnlySearchScrapDates: false,
// 		frequencyScrapDay: '',
// 		frequencyScrapDates: [],
// 		isDateLabelNeeded: true,
// 		datePickerContainerClassname: 'dateRangePickerContainer',
// 		datePickerInputTextClassname: 'gridDate',
// 		datePickerCalenderIconClassname: 'datePickerCalenderIcon',
// 		datePickerMainContainerClassname: 'datePickerMain',
// 		selectTodayButton : 'Close',
// 		isFilterComponent: true,
// 		calenderPositionBottom: 'selectable'
// 	}

// 	constructor(props) {
// 		const { value, beginDate, endDate, defaultSelectedDate } = props

// 		const defaultValue = value
// 			? dateStringValue(value)
// 			: dateStringValue(defaultSelectedDate)
// 		const rangeBegin = beginDate ? dateRangeValue(beginDate) : ''
// 		const rangeEnd = endDate ? dateRangeValue(endDate) : ''
// 		super(props)
// 		this.state = {

// 			selectedDays: [defaultValue],
// 			selectedDay: defaultValue,
// 			showDatePicker: false,
// 			beginDate: rangeBegin,
// 			endDate: rangeEnd,
// 			from: defaultValue,
// 			to: defaultValue,
// 			days: {
// 				Sunday: 0,
// 				Monday: 1,
// 				Tuesday: 2,
// 				Wednesday: 3,
// 				Thursday: 4,
// 				Friday: 5,
// 				Saturday: 6
// 			}
// 		}
// 		this.handleDayClick = this.handleDayClick.bind(this)
// 		this.handleMultiDayClick = this.handleMultiDayClick.bind(this)
// 		this.handleRangeDayClick = this.handleRangeDayClick.bind(this)
// 		this.handleShowDatePicker = this.handleShowDatePicker.bind(this)
// 		this.handleClear = this.handleClear.bind(this)
// 		this.handleOutsideClick = this.handleOutsideClick.bind(this)
// 		this.handleApplyDatePicker = this.handleApplyDatePicker.bind(this)
// 	}

// 	componentWillMount() {
// 		const { getFilterDataValue, frequencyScrapDay } = this.props
// 		if (
// 			getFilterDataValue &&
// 			getFilterDataValue.organization &&
// 			getFilterDataValue.organization.frequency
// 		) {
// 			scrapFrequency =
// 				getFilterDataValue.organization.frequency.SearchScrapFrquencyDay
// 		}
// 		isLoggedIn = JSON.parse(sessionStorage.getItem(LOGIN_USER_DETAILS))
// 		this.setState({
// 			CalenderIcon:
// 				isLoggedIn && isLoggedIn.pimercecdn && isLoggedIn.pimercecdn.pimerce_calendar_icon
// 		})
// 	}

// 	componentWillReceiveProps(nextProps) {
// 		const { value, beginDate, endDate, frequencyScrapDay } = nextProps


// 		if (value !== this.props.value) {
// 			const date = dateStringValue(value)

// 			this.setState({ selectedDay: date })
// 		}

// 		if (beginDate !== this.props.beginDate) {
// 			const beginValue = dateRangeValue(beginDate)
// 			this.setState({ beginDate: beginValue })
// 		}

// 		if (endDate !== this.props.endDate) {
// 			const endValue = dateRangeValue(endDate)
// 			this.setState({ endDate: endValue })
// 		}
// 	}

// 	handleClear() {
// 		this.setState({ selectedDay: undefined })
// 	}

// 	handleDayClick(day, { disabled }) {
// 		if (disabled) return null
// 		const { onChange } = this.props
// 		onChange(dateToLocalString(day))
// 		this.setState({ selectedDay: day })
// 		this.handleShowDatePicker()
// 	}

// 	handleShowDatePicker(e) {
// 		if (!this.state.showDatePicker) {
// 			document.addEventListener('click', this.handleOutsideClick, false)
// 		} else {
// 			document.removeEventListener('click', this.handleOutsideClick, false)
// 		}

// 		this.setState((prevState) => ({
// 			showDatePicker: !prevState.showDatePicker
// 		}))
// 	}

// 	handleApplyDatePicker(e) {
// 		if (!this.state.showDatePicker) {
// 			document.addEventListener('click', this.handleOutsideClick, false)
// 		} else {
// 			document.removeEventListener('click', this.handleOutsideClick, false)
// 		}

// 		this.setState((prevState) => ({
// 			showDatePicker: !prevState.showDatePicker
// 		}))
// 	}

// 	handleOutsideClick(e) {
// 		if (this.node && this.node.contains(e.target)) {
// 			return
// 		}
// 		this.handleApplyDatePicker()	
// 	}
// 	getDatesBetweenDates = (startDate, endDate) => {
// 		const { frequencyScrapDay } = this.props
// 		let dates = []
// 		//to avoid modifying the original date
// 		const theDate = new Date(startDate)
// 		while (theDate < endDate) {
// 			if (new Date(theDate).getMonth() == new Date(startDate).getMonth()) {
// 				dates = [...dates, new Date(theDate)]
// 			}
// 			dates = [...dates, new Date(theDate)]
// 			let increaseNoOfDay = frequencyScrapDay === 'All' ? 1 : 7
// 			theDate.setDate(theDate.getDate() + increaseNoOfDay)
// 		}
// 		if (new Date(endDate).getMonth() == new Date(startDate).getMonth()) {
// 			dates = [...dates, endDate]
// 		}
// 		dates = [...dates, endDate]
// 		return dates
// 	}

// 	handleMultiDayClick(day, { selected, disabled }) {
// 		if (disabled) return null

// 		const selectedDays = this.state.selectedDays.concat();

// 		if (selected) {

// 			selectedDays.length = 0
// 			selectedDays.push(day)

// 		} else {
// 			if (
// 				selectedDays.length > 0
// 			) {
// 				const sortedDays = selectedDays.sort((a, b) => a - b)
// 				const toDateMonthDiff = Math.abs(sortedDays[selectedDays.length - 1].getMonth() - day.getMonth()) <= 1
// 				const fromDateMonthDiff = Math.abs(sortedDays[0].getMonth() - day.getMonth()) <= 1

// 				if (fromDateMonthDiff && toDateMonthDiff) {
// 					selectedDays.push(day);
// 				}
// 				else {
// 					selectedDays.length = 0
// 					selectedDays.push(day)
// 				}


// 			} else {
// 				selectedDays.length = 0
// 				selectedDays.push(day)
// 			}

// 		}

// 		sortedDays = selectedDays.sort((a, b) => a - b)
// 		if (sortedDays.length > 0) {
// 			if (sortedDays.length == 1) {
// 				startDate = sortedDays[0]
// 				endDate = startDate
// 			} else {
// 				startDate = sortedDays[0];
// 				endDate = sortedDays[sortedDays.length - 1];
// 			}
// 		}

// 		this.setState({ selectedDays: this.getDatesBetweenDates(startDate, endDate) });
// 		weeklySelect.from = moment(startDate).format(DATE_FORMAT)
// 		weeklySelect.to = moment(endDate).format(DATE_FORMAT)
// 		this.setState({
// 			from: weeklySelect.from,
// 			to: weeklySelect.to,
// 		})
// 		this.props.onChange(weeklySelect)

// 	}

// 	handleRangeDayClick(day, { disabled }) {
// 		if (disabled) return null
// 		let formattedDay = moment(day).format(DATE_FORMAT)
// 		let formattedFrom = moment(this.state.from).format(DATE_FORMAT)
// 		const { onChange, dateRangeLimit } = this.props
// 		const range = DateUtils.addDayToRange(day, this.state)

// 		if (range.to) {
// 			var Difference_In_Time = range.to.getTime() - range.from.getTime()
// 			var Difference_In_Days = Math.round(
// 				Difference_In_Time / (1000 * 3600 * 24)
// 			)

// 			if (Difference_In_Days >= dateRangeLimit) {
// 				range.from = day
// 				range.to = null
// 			}
// 		}

// 		if (formattedDay == formattedFrom) {
// 			range.from = day
// 			range.to = day
// 		}
// 		this.setState(range)
// 		onChange(range)
// 		this.props.selectedDateRange(range)
// 	}

// 	disabledDays(scrapDate, EndDate) {
// 		const { frequencyScrapDay, frequencyScrapDates } = this.props
// 		let selectedDaysToDisable = []
// 		let monthEndDate = new Date(EndDate)
// 		let rangeStartDate = new Date(scrapDate)
// 		let datelist = []
// 		frequencyScrapDates.map((item) => {
// 			datelist.push(item)
// 		})
// 		let disabledates = []
// 		while ((moment(scrapDate).format(DATE_FORMAT)).valueOf() >= (moment(EndDate).format(DATE_FORMAT)).valueOf()) {
// 			disabledates.push(moment(EndDate).format(DATE_FORMAT));
// 			EndDate = moment(EndDate).add(1, 'day').format(DATE_FORMAT);
// 		}

// 		disabledates = disabledates.filter(function (el) {
// 			return !datelist.includes(el);
// 		});


// 		disabledates.map((val) => {
// 			return selectedDaysToDisable.push(this.dateFormat(val))
// 		})

// 		return selectedDaysToDisable
// 	}

// 	dateFormat(value) {
// 		return new Date(
// 			moment(value).format('MM') +
// 			'/' +
// 			moment(value).format('DD') +
// 			'/' +
// 			moment(value).format('YYYY')
// 		)
// 	}

// 	render() {
// 		const { showDatePicker, selectedDay, selectedDays, beginDate, endDate, days, CalenderIcon } = this.state

// 		const {
// 			placeholder,
// 			showCalendarIcon,
// 			inputfontsize,
// 			daterange,
// 			className,
// 			monthLimit,
// 			isCalendarPositionTop,
// 			borderDisable,
// 			isShowOnlySearchScrapDates,
// 			frequencyScrapDay,
// 			beforeDate,
// 			weeklyDaySelect,
// 			isDateLabelNeeded,
// 			datePickerContainerClassname,
// 			datePickerInputTextClassname,
// 			datePickerCalenderIconClassname,
// 			datePickerMainContainerClassname,
// 			selectTodayButton
// 		} = this.props

// 		const inputtextSyle = className && datePickerInputTextClassname
// 		const fontstyle = className ? className : inputfontsize && 'inputfontstyle'
// 		// deleting all the days without scrap frequency day
// 		//to disable it on calendar
// 		if (frequencyScrapDay && isShowOnlySearchScrapDates) {
// 			delete days[frequencyScrapDay]
// 		} else if (!frequencyScrapDay && isShowOnlySearchScrapDates) {
// 			this.props.isShowOnlySearchScrapDates = false
// 		}
// 		let isToday =
// 			dateToLocalString(selectedDay) === dateToLocalString(new Date())
// 		const selectedDateValue = new Date(weeklyDaySelect ? selectedDays[0] : selectedDay)
// 		const month = selectedDateValue.getMonth() // Since getMonth() returns month
// 		const year = selectedDateValue.getFullYear() // Since getYear() returns year
// 		const defaultMonth = new Date(year, month)

// 		const modifiers = {
// 			highlightsWeeks: { daysOfWeek: [0, 6] }
// 		}
// 		let { from, to } = this.state

// 		const modifier = { start: from, end: to }
// 		let date = new Date(beforeDate)
// 		let rangeEndDate = moment(
// 			new Date(date.getFullYear(), date.getMonth() - monthLimit, 1)
// 		).format(DATE_FORMAT)
// 		let filteredDays
// 		if (isShowOnlySearchScrapDates) {
// 			filteredDays = [
// 				{ daysOfWeek: Object.values(days) },
// 				{
// 					after: new Date(this.props.beforeDate),
// 					before: new Date(rangeEndDate)
// 				}
// 			]
// 		}
// 		return (
// 			<div className={datePickerMainContainerClassname}>
// 				{daterange || weeklyDaySelect ? (
// 					<div
// 						className={
// 							borderDisable
// 								? datePickerContainerClassname
// 								: 'dateRangePickerContainerClose'
// 						}>
// 						<InputGroup size='md' onClick={this.props.isFilterComponent ? this.handleShowDatePicker : this.handleApplyDatePicker}>
// 							{isDateLabelNeeded && (
// 								<FormControl
// 									placeholder={placeholder}
// 									readOnly
// 									className={fontstyle}
// 									value={`${dateToLocalString(from)} - ${dateToLocalString(to)}`}
// 								/>
// 							)}
// 							<Dropdown.Toggle
// 								split
// 								size='sm'
// 								variant='outline-dark'
// 								className='dateRangePickerDropButton'
// 							/>
// 						</InputGroup>
// 						{showCalendarIcon && (
// 							<span className='calendarPicker'>
// 								<img src={CalenderIcon} id='calendarIcon' />
// 							</span>
// 						)}
// 					</div>
// 				) : (
// 					<div
// 						className={
// 							borderDisable
// 								? datePickerContainerClassname
// 								: 'dateRangePickerContainerClose'
// 						}>
// 						<InputGroup
// 							size='md'
// 							className={inputtextSyle}
// 							onClick={this.props.isFilterComponent ? this.handleShowDatePicker : this.handleApplyDatePicker}>
// 							{className && (
// 								<span className={datePickerCalenderIconClassname}>
// 									<img src={CalenderIcon} id='calendarIcon' />
// 								</span>
// 							)}
// 							{isDateLabelNeeded && (
// 								<FormControl
// 									placeholder={placeholder}
// 									readOnly
// 									className={fontstyle}
// 									value={
// 										isToday
// 											? `${dateToLocalString(selectedDay)}`
// 											: dateToLocalString(selectedDay)
// 									}
// 								/>
// 							)}
// 							<Dropdown.Toggle
// 								split
// 								size='sm'
// 								variant='outline-dark'
// 								className='datePickerDropButton'
// 							/>
// 						</InputGroup>
// 					</div>
// 				)}
// 				<div
// 					ref={(node) => {
// 						this.node = node
// 					}}>
// 					{this.props.beforeDate
// 						? showDatePicker && (
// 							<DayPicker
// 								className={
// 									isCalendarPositionTop
// 										? 'gridDayPickerdropdown'
// 										: this.props.calenderPositionBottom
// 								}

// 								selectedDays={weeklyDaySelect ?
// 									selectedDays : selectedDay}
// 								onDayClick={weeklyDaySelect ?
// 									this.handleMultiDayClick : this.handleDayClick
// 								}
// 								onTodayButtonClick={this.props.isFilterComponent ? this.handleShowDatePicker : this.handleApplyDatePicker}
// 								todayButton='Close'
// 								month={defaultMonth}
// 								modifiers={modifiers}
// 								// modifiersStyles='highlightsWeeks'	
// 								disabledDays={
// 									!isShowOnlySearchScrapDates
// 										? [
// 											{
// 												after: new Date(this.props.beforeDate),
// 												before: new Date(date.getFullYear(), date.getMonth() - monthLimit, 1)
// 											}
// 										]
// 										:
// 										[
// 											{
// 												after: new Date(this.props.beforeDate),
// 												before: new Date(rangeEndDate)
// 											},
// 											...this.disabledDays(
// 												this.props.beforeDate,
// 												rangeEndDate
// 											)
// 										]
// 								}
// 							/>
// 						)
// 						: showDatePicker && (
// 								<DayPicker
// 									className={
// 										isCalendarPositionTop
// 											? 'gridDayPickerdropdown'
// 											: this.props.calenderPositionBottom
// 									}
// 									numberOfMonths={1}
// 									selectedDays={[from, { from, to }]}
// 									modifiers={modifier}
// 									todayButton={selectTodayButton}
// 									onTodayButtonClick={ this.props.isFilterComponent ? this.handleShowDatePicker : this.handleApplyDatePicker}
// 									onDayClick={this.handleRangeDayClick}
// 									disabledDays={[
// 										{
// 											after: new Date(this.props.afterDate),
// 											before: new Date(rangeEndDate)
// 										}
// 									]}
// 								/>
// 						  )}
// 				</div>
// 			</div>
// 		)
// 	}
// }

// export default connect(mapStateToProps, null)(DatePickerControl)