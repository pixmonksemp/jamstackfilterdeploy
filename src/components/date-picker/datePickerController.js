/** @format */

import React, { Component } from 'react'
import 'react-day-picker/lib/style.css'
import './style.scss'
import { InputGroup, FormControl, Dropdown } from 'react-bootstrap'
import CalenderIcon from '../../assets/calendar-icon.png'
import PropTypes from 'prop-types'
import DayPicker, { DateUtils } from 'react-day-picker'
import {
	dateStringValue,
	dateToLocalString,
	dateRangeValue
} from './dateFormater'
import { DATE_FORMAT } from '../../common/common-constants'
import { connect } from 'react-redux'
import moment from 'moment'

const mapStateToProps = (state) => {
	return {
		getFilterDataValue: state.stateData.getFilterdata
	}
}

let scrapFrequency
class DatePickerControl extends Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		value: PropTypes.string,
		placeholder: PropTypes.string,
		showCalendarIcon: PropTypes.bool,
		beginDate: PropTypes.string,
		beforeDate: PropTypes.string,
		afterDate: PropTypes.string,
		endDate: PropTypes.string,
		inputfontsize: PropTypes.bool,
		daterange: PropTypes.bool,
		defaultSelectedDate: PropTypes.string,
		className: PropTypes.string,
		dateRangeLimit: PropTypes.number,
		monthLimit: PropTypes.number,
		isCalendarPositionTop: PropTypes.bool,
		selectedDateRange: PropTypes.func,
		borderDisable: PropTypes.bool,
		isShowOnlySearchScrapDates: PropTypes.bool,
		frequencyScrapDay: PropTypes.string
	}

	static defaultProps = {
		showCalendarIcon: false,
		inputfontsize: false,
		daterange: false,
		monthLimit: '3',
		dateRangeLimit: '5',
		isCalendarPositionTop: true,
		isShowOnlySearchScrapDates: false,
		frequencyScrapDay: ''
	}

	constructor(props) {
		const { value, beginDate, endDate, defaultSelectedDate } = props

		const defaultValue = value
			? dateStringValue(value)
			: dateStringValue(defaultSelectedDate)
		const rangeBegin = beginDate ? dateRangeValue(beginDate) : ''
		const rangeEnd = endDate ? dateRangeValue(endDate) : ''
		super(props)
		this.state = {
			selectedDay: defaultValue,
			showDatePicker: false,
			beginDate: rangeBegin,
			endDate: rangeEnd,
			from: defaultValue,
			to: defaultValue,
			days: {
				Sunday: 0,
				Monday: 1,
				Tuesday: 2,
				Wednesday: 3,
				Thursday: 4,
				Friday: 5,
				Saturday: 6
			}
		}
		this.handleDayClick = this.handleDayClick.bind(this)
		this.handleRangeDayClick = this.handleRangeDayClick.bind(this)
		this.handleShowDatePicker = this.handleShowDatePicker.bind(this)
		this.handleClear = this.handleClear.bind(this)
		this.handleOutsideClick = this.handleOutsideClick.bind(this)
	}

	componentWillMount() {
		const { getFilterDataValue } = this.props
		if (
			getFilterDataValue &&
			getFilterDataValue.organization &&
			getFilterDataValue.organization.frequency
		) {
			scrapFrequency =
				getFilterDataValue.organization.frequency.SearchScrapFrquencyDay
		}
	}

	componentWillReceiveProps(nextProps) {
		const { value, beginDate, endDate } = nextProps
		if (value !== this.props.value) {
			const date = dateStringValue(value)

			this.setState({ selectedDay: date })
		}

		if (beginDate !== this.props.beginDate) {
			const beginValue = dateRangeValue(beginDate)
			this.setState({ beginDate: beginValue })
		}

		if (endDate !== this.props.endDate) {
			const endValue = dateRangeValue(endDate)
			this.setState({ endDate: endValue })
		}
	}

	handleClear() {
		this.setState({ selectedDay: undefined })
	}

	handleDayClick(day, { disabled }) {
		if (disabled) return null
		const { onChange } = this.props
		onChange(dateToLocalString(day))
		this.setState({ selectedDay: day })
		this.handleShowDatePicker()
	}

	handleShowDatePicker(e) {
		if (!this.state.showDatePicker) {
			document.addEventListener('click', this.handleOutsideClick, false)
		} else {
			document.removeEventListener('click', this.handleOutsideClick, false)
		}

		this.setState((prevState) => ({
			showDatePicker: !prevState.showDatePicker
		}))
	}

	handleOutsideClick(e) {
		if (this.node && this.node.contains(e.target)) {
			return
		}
		this.handleShowDatePicker()
	}

	handleRangeDayClick(day, { disabled }) {
		if (disabled) return null
		let formattedDay = moment(day).format(DATE_FORMAT)
		let formattedFrom = moment(this.state.from).format(DATE_FORMAT)
		const { onChange, dateRangeLimit } = this.props
		const range = DateUtils.addDayToRange(day, this.state)

		if (range.to) {
			var Difference_In_Time = range.to.getTime() - range.from.getTime()
			var Difference_In_Days = Math.round(
				Difference_In_Time / (1000 * 3600 * 24)
			)

			if (Difference_In_Days >= dateRangeLimit) {
				range.from = day
				range.to = null
			}
		}

		if (formattedDay == formattedFrom) {
			range.from = day
			range.to = day
		}
		this.setState(range)
		onChange(range)
		this.props.selectedDateRange(range)
	}

	disabledDays(scrapDate, EndDate) {
		const{frequencyScrapDay}=this.props
		let selectedDaysToDisable = []
		let monthEndDate = new Date(EndDate)
		let rangeStartDate = new Date(scrapDate)
		let datelist = []
		if(frequencyScrapDay == 'Fortnightly'){
		for ( var day = rangeStartDate; day >= monthEndDate; day.setDate(day.getDate() - 15)) {
			datelist.push(moment(day).format(DATE_FORMAT))
		}
	    }else if(frequencyScrapDay == 'Once in two months'){
			for ( var day = rangeStartDate; day >= monthEndDate; day.setDate(day.getDate() - 60)) {
				datelist.push(moment(day).format(DATE_FORMAT))
			}
		}else if(frequencyScrapDay == 'Once a quarter'){
			for ( var day = rangeStartDate; day >= monthEndDate; day.setDate(day.getDate() - 90)) {
				datelist.push(moment(day).format(DATE_FORMAT))
			}
		}

        let disabledates=[]
		while ( (moment(scrapDate).format(DATE_FORMAT)).valueOf() >= (moment(EndDate).format(DATE_FORMAT)).valueOf()) {
			disabledates.push(moment(EndDate).format(DATE_FORMAT));
			EndDate = moment(EndDate).add(1, 'day').format(DATE_FORMAT);
		  }

		  disabledates = disabledates.filter( function( el ) {
			return !datelist.includes( el );
		  } );


		disabledates.map((val) => {
			return selectedDaysToDisable.push(this.dateFormat(val))
		})

		return selectedDaysToDisable
	}

	dateFormat(value) {
		return new Date(
			moment(value).format('MM') +
				'/' +
				moment(value).format('DD') +
				'/' +
				moment(value).format('YYYY')
		)
	}

	render() {
		const { showDatePicker, selectedDay, beginDate, endDate, days } = this.state

		const {
			placeholder,
			showCalendarIcon,
			inputfontsize,
			daterange,
			className,
			monthLimit,
			isCalendarPositionTop,
			borderDisable,
			isShowOnlySearchScrapDates,
			frequencyScrapDay,
			beforeDate
		} = this.props
		const inputtextSyle = className && 'gridDate'
		const fontstyle = className ? className : inputfontsize && 'inputfontstyle'
		// deleting all the days without scrap frequency day
		//to disable it on calendar
		if (frequencyScrapDay && isShowOnlySearchScrapDates) {
			delete days[frequencyScrapDay]
		} else if (!frequencyScrapDay && isShowOnlySearchScrapDates) {
			this.props.isShowOnlySearchScrapDates = false
		}
		let isToday =
			dateToLocalString(selectedDay) === dateToLocalString(new Date())
		const selectedDateValue = new Date(selectedDay)
		const month = selectedDateValue.getMonth() // Since getMonth() returns month
		const year = selectedDateValue.getFullYear() // Since getYear() returns year
		const defaultMonth = new Date(year, month)

		const modifiers = {
			highlightsWeeks: { daysOfWeek: [0, 6] }
		}
		let { from, to } = this.state

		const modifier = { start: from, end: to }
		let date = new Date(beforeDate)
		let rangeEndDate = moment(
			new Date(date.getFullYear(), date.getMonth() - monthLimit, 1)
		).format(DATE_FORMAT)
		let filteredDays
		if (isShowOnlySearchScrapDates) {
			filteredDays = [
				{ daysOfWeek: Object.values(days) },
				{
					after: new Date()
				}
			]
		}
		return (
			<div className='datePickerMain'>
				{daterange ? (
					<div
						className={
							borderDisable
								? 'dateRangePickerContainer'
								: 'dateRangePickerContainerClose'
						}>
						<InputGroup size='md' onClick={this.handleShowDatePicker}>
							<FormControl
								placeholder={placeholder}
								readOnly
								className={fontstyle}
								value={`${dateToLocalString(from)} - ${dateToLocalString(to)}`}
							/>
							<Dropdown.Toggle
								split
								size='sm'
								variant='outline-dark'
								className='dateRangePickerDropButton'
							/>
						</InputGroup>
						{showCalendarIcon && (
							<span className='calendarPicker'>
								<img src={CalenderIcon} id='calendarIcon' />
							</span>
						)}
					</div>
				) : (
					<div
						className={
							borderDisable
								? 'dateRangePickerContainer'
								: 'dateRangePickerContainerClose'
						}>
						<InputGroup
							size='md'
							className={inputtextSyle}
							onClick={this.handleShowDatePicker}>
							{className && (
								<span className='datePickerCalenderIcon'>
									<img src={CalenderIcon} id='calendarIcon' />
								</span>
							)}
							<FormControl
								placeholder={placeholder}
								readOnly
								className={fontstyle}
								value={
									isToday
										? `${dateToLocalString(selectedDay)}`
										: dateToLocalString(selectedDay)
								}
							/>
							<Dropdown.Toggle
								split
								size='sm'
								variant='outline-dark'
								className='datePickerDropButton'
							/>
						</InputGroup>
					</div>
				)}
				<div
					ref={(node) => {
						this.node = node
					}}>
					{this.props.beforeDate
						? showDatePicker && (
								<DayPicker
									className={
										isCalendarPositionTop
											? 'gridDayPickerdropdown'
											: 'selectable'
									}
									selectedDays={selectedDay}
									onDayClick={this.handleDayClick}
									onTodayButtonClick={this.handleShowDatePicker}
									todayButton='Close'
									month={defaultMonth}
									modifiers={modifiers}
									modifiersStyles='highlightsWeeks'
									disabledDays={
										!isShowOnlySearchScrapDates
											? [
													{
														after: new Date(this.props.beforeDate),
														before: new Date(endDate)
													}
											  ]
											: frequencyScrapDay == 'Fortnightly' || frequencyScrapDay == 'Once in two months'
											|| frequencyScrapDay == 'Once a quarter'
											? [
													{
														after: new Date(this.props.beforeDate),
														before: new Date(rangeEndDate)
													},
													...this.disabledDays(
														this.props.beforeDate,
														rangeEndDate
													)
											  ]
											: filteredDays
									}
								/>
						  )
						: showDatePicker && (
								<DayPicker
									className={
										isCalendarPositionTop
											? 'gridDayPickerdropdown'
											: 'selectable'
									}
									numberOfMonths={1}
									selectedDays={[from, { from, to }]}
									modifiers={modifier}
									todayButton='Close'
									onTodayButtonClick={this.handleShowDatePicker}
									onDayClick={this.handleRangeDayClick}
									disabledDays={[
										{
											after: new Date(this.props.afterDate),
											before: new Date(rangeEndDate)
										}
									]}
								/>
						  )}
				</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, null)(DatePickerControl)
