/** @format */

import React, { Component, Fragment } from 'react'
import {
	Collapse,
	Table,
	Card,
	Row,
	Col,
	Image,
	Button,
	Spinner
} from 'react-bootstrap'
import ExpanderButtonControl from './expand-collapse'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style.scss'
import extend from 'extend'
import SearchBar from '../../components/search-bar/index'
import ExportModal from '../../components/modal/excel-export-modal'
import ReactSwitch from '../../components/toggle/index'
import CheckBox from '../checkbox/check-box'
import {
	EXPORT,
	NEXT,
	PREV,
	ASC,
	DESC,
	SEARCHBOX_PLACEHOLDER,
	TAB_MSG,
	NO,
	LOGIN_USER_DETAILS
} from '../../common/common-constants'
import DataNotAvailable from '../../components/data-not-available-component/data-not-available'
import { connect } from 'react-redux'
import style from "../../styling/scss/_variables.scss";

const { whiteColor, nonActiveRowColor, borderLine_color, font_md, barlow_medium, datagrid_bg_color } = style
export const headingStyleExpandId = {
	backgroundColor: datagrid_bg_color,
	fontFamily: barlow_medium,
	fontSize: font_md,
	fontStretch: 'normal',
	fontStyle: 'normal',
	lineHeight: 'normal',
	letterSpacing: 'normal',
	color: whiteColor,
	width: '4.5em',
	borderTop: 'white',
	textAlign: 'left',
	zIndex: '3',
	position: 'sticky',
	left: '-1px',
	top: '-1px'
}

const mapStateToProps = (state) => {
	return {
		getFilterDataValue: state.stateData.getFilterdata
	}
}

let headerText = '',
	keypair = '',
	bundleHierarchy,
	isLoggedIn

class DataGrid extends Component {
	static propTypes = {
		bsTableProps: PropTypes.object,
		columns: PropTypes.arrayOf(
			PropTypes.shape({
				className: PropTypes.string,
				dataField: PropTypes.string.isRequired,
				formatter: PropTypes.func,
				headerClassName: PropTypes.string,
				headerFormatter: PropTypes.func,
				headerStyle: PropTypes.object,
				hidden: PropTypes.bool,
				sort: PropTypes.bool,
				style: PropTypes.object,
				text: PropTypes.string,
				sellerSubText: PropTypes.string,
				subText: PropTypes.string,
				isImagePresent: PropTypes.bool,
				isColorCoded: PropTypes.bool,
				isBorderCoded: PropTypes.bool,
				isTogglePresent: PropTypes.bool,
				isBorderRight: PropTypes.bool,
				isTextColored: PropTypes.bool,
				isVerticalAlignTop: PropTypes.bool,
				isHasChildRow: PropTypes.bool,
				width: PropTypes.number,
				isPaddingStyleNotNeeded: PropTypes.bool,
				isColumnFreeze: PropTypes.bool,
				freezeColumnSize: PropTypes.string,
				isZeroToHighlightBasedOnModules: PropTypes.bool
			})
		).isRequired,
		commonHeader: PropTypes.arrayOf(
			PropTypes.shape({
				colSpan: PropTypes.number,
				headertext: PropTypes.string,
				commonHeaderClassname: PropTypes.string,
				headertextRight: PropTypes.string,
				isTab: PropTypes.bool,
				insideGridToggleOnClassName: PropTypes.string,
				insideGridToggleOffClassName: PropTypes.string
			})
		),
		data: PropTypes.array.isRequired,
		onCustomRowRender: PropTypes.func,
		onSorting: PropTypes.func,
		rowClassName: PropTypes.string,
		rowStyle: PropTypes.object,
		showHeader: PropTypes.bool,
		pagination: PropTypes.bool,
		totalSize: PropTypes.number,
		actionName: PropTypes.func,
		parameters: PropTypes.object,
		title: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
		isCardHeader: PropTypes.bool,
		//LEGEND
		legend: PropTypes.arrayOf(
			PropTypes.shape({
				title: PropTypes.string,
				legendColor: PropTypes.string
			})
		),
		legendText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
		isLegendTextPresent: PropTypes.bool,
		legendTextStyle: PropTypes.string,
		//MODAL
		isModal: PropTypes.bool,
		//TOGGLE
		tabNames: PropTypes.array,
		toggleTitleLeft: PropTypes.string,
		toggleTitleRight: PropTypes.string,
		toggleOnClassName: PropTypes.string,
		toggleOffClassName: PropTypes.string,
		onSubmit: PropTypes.func,
		toggleHeaderChecked: PropTypes.string.isRequired,
		//EXPORT
		excelOnSubmit: PropTypes.func,
		exportModalTitle: PropTypes.string,
		exportPageName: PropTypes.string,
		exportTopPositiondropdown: PropTypes.bool,
		exportKeyworddropdown: PropTypes.bool,
		exportDefaultRender: PropTypes.array,
		exportIsDataPresent: PropTypes.bool,
		exportReducerName: PropTypes.object,
		exportIsLoading: PropTypes.bool,
		exportDefaultSelectedDate: PropTypes.string,
		exportParameter: PropTypes.object,
		handleApplyExportFilter: PropTypes.func,
		exportEnableAllRetailerOption: PropTypes.bool,
		exportRangeLimit: PropTypes.number,
		exportMonthLimit: PropTypes.number,
		isExportPresent: PropTypes.bool,
		hideDropdownListWithFunctionality: PropTypes.array,
		hidedDropDownList: PropTypes.array,
		configureFirstPagePosition: PropTypes.bool,
		//VERTICA-LINE
		isVerticalLine: PropTypes.bool,
		//SEARCHBOX
		isSearchBoxPresent: PropTypes.bool,
		gridHeaderSearchBar: PropTypes.bool,
		onSearchBox: PropTypes.func,
		searchText: PropTypes.bool,
		//SORT CLICK
		onSort: PropTypes.string,
		//COLUMN SPAN
		colSpanSize: PropTypes.number,
		//LOADING
		gridLoading: PropTypes.bool,
		gridSpinnerClassName: PropTypes.string,
		//NO DATA MESSAGE
		noDataMessage: PropTypes.string,
		noDataFoundCardStyle: PropTypes.string,
		isCloseIcon: PropTypes.bool,
		//PAGINATION CLICK
		onPageChange: PropTypes.func,
		//CHILD COLUMN
		isChildColumn: PropTypes.bool,
		//TAB INSIDE GRID ONCHANGE
		insideTabOnChange: PropTypes.func,
		showCommonHeader: PropTypes.bool,
		gridCardContainerClassName: PropTypes.string,
		//GRID PARENT CARD
		gridCardClassName: PropTypes.string,
		//GAP BETWEEN CELL
		isGapBetweenCell: PropTypes.bool,
		//ROW HEIGHT
		activeRowHeight: PropTypes.number,
		inActiveRowHeight: PropTypes.number,
		//GRID HEIGHT
		gridHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		//GRID DISPLAY
		gridDisplay: PropTypes.string,
		gridPagination: PropTypes.string,
		gridCardHeaderTitleClassName: PropTypes.string,
		gridCardModalContainerClassName: PropTypes.string,
		//CLEARED
		isCleared: PropTypes.bool,
		//TOGGLE
		toggleNames: PropTypes.array,
		toggleNamesChecked: PropTypes.string.isRequired,
		isToggleNamesPresent: PropTypes.bool,
		onSubmitToggleNames: PropTypes.func,
		//LEGEND ONLY PRESENT
		isLegendOnlyPresent: PropTypes.bool,
		//SEARCHBOX ONLY PRESENT
		isSearchBoxOnlyPresent: PropTypes.bool,
		//EXPORT - FILTER META DATA STRUCTURE
		exportFilterMetaDataStrucutre: PropTypes.object,
		paginationRefresh: PropTypes.bool,
		//STATIC LEGEND
		staticLegend: PropTypes.arrayOf(
			PropTypes.shape({
				title: PropTypes.string,
				image: PropTypes.string
			})
		),
		//EXPORT DATE PRESENT
		isExportDatePresent: PropTypes.bool,
		isSingleSelect: PropTypes.bool,
		weeklyDaySelect: PropTypes.bool,
		//EXPORT DATE ENABLE ONLY FOR SEARCH SCRAP DATE
		isShowOnlySearchScrapDates: PropTypes.bool,
		frequencyScrapDay: PropTypes.string,
		frequencyScrapDates: PropTypes.array,
		exportDefaultDateSelected: PropTypes.string,
		rowColor: PropTypes.bool,
		gridCardHeaderClassname: PropTypes.string,
		//TABLE CONTAINER
		tableContainerStyle: PropTypes.string,
		moduleName: PropTypes.string,
		pageNameForExport: PropTypes.string,
		retailerOptions: PropTypes.array,
		filterCheck: PropTypes.bool,
		searchTableCallBack: PropTypes.func,
		categorySOS: PropTypes.bool,
		gridInfo: PropTypes.bool,
		gridInfoText: PropTypes.string,
		gridCardHeight: PropTypes.string,
		insideToggleHeaderCheck: PropTypes.bool,
		handleChangeInsideTab: PropTypes.func
	}

	static defaultProps = {
		showHeader: true,
		columns: [
			{
				isImagePresent: false,
				isColorCoded: false,
				isBorderCoded: false,
				isTogglePresent: false,
				isBorderRight: false,
				isTextColored: false,
				isVerticalAlignTop: false,
				isHasChildRow: false,
				isPaddingStyleNotNeeded: false,
				isZeroToHighlightBasedOnModules: false
			}
		],
		commonHeader: [
			{
				isTab: false
			}
		],
		isModal: false,
		isVerticalLine: false,
		isSearchBoxPresent: true,
		gridHeaderSearchBar: 'gridHeaderSearchBar',
		isExportPresent: true,
		isCardHeader: true,
		colSpanSize: 19,
		gridLoading: true,
		toggleHeaderChecked: 'National Retailers',
		exportModalTitle: 'Export Excel',
		searchText: false,
		isChildColumn: false,
		insideToggleHeaderChecked: 'View by # SKU',
		gridSpinnerClassName: 'dataGridSpinner',
		showCommonHeader: false,
		gridCardContainerClassName: 'gridCardContainer',
		isCloseIcon: false,
		gridCardClassName: 'gridCard',
		isGapBetweenCell: true,
		activeRowHeight: 60,
		inActiveRowHeight: 60,
		gridHeight: 'auto',
		gridDisplay: 'contents',
		gridCardHeaderTitleClassName: 'gridCardHeaderTitle',
		gridCardModalContainerClassName: 'gridCardModalContainer',
		gridPagination: 'gridPagination',
		toggleNamesChecked: 'Entering',
		isToggleNamesPresent: false,
		isSearchBoxOnlyPresent: false,
		isCleared: false,
		isLegendOnlyPresent: false,
		paginationRefresh: false,
		isExportDatePresent: true,
		isSingleSelect: false,
		weeklyDaySelect: false,
		isLegendTextPresent: false,
		legendTextStyle: 'legendTextStyle',
		isShowOnlySearchScrapDates: false,
		isColumnFreeze: false,
		rowColor: false,
		gridCardHeaderClassname: 'gridCardHeader',
		tableContainerStyle: 'tableContainer',
		hideDropdownListWithFunctionality: [],
		categorySOS: false,
		gridInfo: false,
		gridInfoText: '',
		gridCardHeight: 'auto',
		insideToggleHeaderCheck: true
	}

	constructor(props) {
		super(props)
		this.state = {
			isDefaultSort: true,
			totalSize: this.props.totalSize,
			initialPage: 1,
			pager: {},
			pageStatus: false,
			sorting: {},
			excelClicked: false,
			toggleChecked: false,
			// toggleHeaderChecked: this.props.toggleHeaderChecked,
			selectedValuesSentiment: '',
			searchValue: '',
			selectedSortTitle: '',
			insideToggleHeaderChecked: true,
			isExpandRow: false,
			keyForExpand: '',
			isfilterChecked: this.props.filterCheck,
			isResetClicked: this.props.isCleared
		}

		this.handleHeaderClick = this.handleHeaderClick.bind(this)
		this.onChangePage = this.onChangePage.bind(this)
		this.handleHideExportModal = this.handleHideExportModal.bind(this)
		this.handleExcelFilter = this.handleExcelFilter.bind(this)
		this.toggleChange = this.toggleChange.bind(this)

	}

	componentWillMount() {
		const { getFilterDataValue } = this.props

		if (getFilterDataValue && getFilterDataValue.organization) {
			if (getFilterDataValue.organization.defaultoption) {
				bundleHierarchy = JSON.parse(
					getFilterDataValue.organization.defaultoption
						.StaticConstants
				)
			}
		}

		if (!this.state.pageStatus && this.props.pagination) {
			this.setPage(this.state.initialPage)
		}
		isLoggedIn = JSON.parse(sessionStorage.getItem(LOGIN_USER_DETAILS))
		this.setState({
			ExportIcon:
				isLoggedIn && isLoggedIn.pimercecdn && isLoggedIn.pimercecdn.pimerce_export_icon,
			DownArrow:
				isLoggedIn && isLoggedIn.pimercecdn && isLoggedIn.pimercecdn.pimerce_downward_icon,
			UpwardArrow:
				isLoggedIn && isLoggedIn.pimercecdn && isLoggedIn.pimercecdn.pimerce_upward_icon,
			Info:
				isLoggedIn && isLoggedIn.pimercecdn && isLoggedIn.pimercecdn.pimerce_info_orange_color_icon,
			PlaceHolder:
				isLoggedIn && isLoggedIn.pimercecdn && isLoggedIn.pimercecdn.pimerce_product_placeholder_icon
		})
	}

	componentWillReceiveProps(nextProps, prevProps) {
		const { closeExpands, searchText, paginationRefresh } = nextProps
		if (searchText) {
			this.setState({
				searchValue: ''
			})
		}

		if (closeExpands) {
			const stateValue = Object.assign(this.state)
			for (let key in stateValue) {
				if (key.includes('showPanel')) {
					delete stateValue[key]
				}
			}
		}

		this.state.totalSize = nextProps.totalSize
		if (this.props.pagination) {
			if (
				(this.props.totalSize !== nextProps.totalSize &&
					nextProps.data &&
					this.state.totalSize) || (paginationRefresh)
			) {
				this.setPage(this.state.initialPage)
			}
		}

		this.state.isfilterChecked = nextProps.filterCheck;
		this.state.isResetClicked = nextProps.isCleared;


	}

	onChangePage(pageOfItems, pager) {
		let pageChange = extend(true, {}, this.props.parameters, {})
		pageChange.fromIndex = pager.startIndex
		// pageChange.productname = this.state.searchValue
		this.props.onPageChange(pageChange)
	}

	toggleChange(toggleChecked) {
		const { parameters } = this.props
		this.setState({ toggleChecked, onchangeStatus: true })
		// this.props.actionName(parameters)
	}

	handleHeaderClick(e) {
		e.preventDefault()
		const { dataField, sorted, title } = e.currentTarget.dataset
		const sortedValue = parseInt(sorted) > 0 ? -1 : 1
		let { sorting } = this.state
		this.setState({
			sorting: {
				...this.state.sorting,
				key: dataField,
				value: sortedValue
			}
		})
		this.setState({ isDefaultSort: false, selectedSortTitle: title })
		this.props.pagination ? this.setPage(this.state.initialPage) : ''

		/**
		 * @description: While clicking on the sort icon. pass ascending/descending (respsctive one)
		 * to the request structure
		 */
		const sortOrder = {
			order: sorted == 0 ? DESC : sorting.value === 1 ? ASC : DESC
		}
		this.props.onSort(dataField, sortOrder.order)

		return false
	}

	renderHeaderCellLink(dataField, headerText, text) {
		const { isDefaultSort } = this.state
		const { sorting, selectedSortTitle, DownArrow, UpwardArrow } = this.state
		const sorted = sorting.key !== dataField ? 0 : sorting.value

		return (
			<div
				className={classNames({
					active: !isDefaultSort && sorted !== 0
				})}
				data-data-field={dataField}
				data-sorted={sorted}
				data-title={text}
				href='#'
				onClick={this.handleHeaderClick}>
				<span>{headerText}</span>
				<span className='sortIcon'>
					{selectedSortTitle == text && sorted === 1 ? (
						<img src={DownArrow} />
					) : (
						<img src={UpwardArrow} />
					)}
				</span>
			</div>
		)
	}

	handleHideExportModal() {
		this.setState({
			excelClicked: !this.state.excelClicked,
			isDataPresent: ''
		})
	}

	handleExcelFilter(data, isExport) {
		this.setState({
			excelClicked: !this.state.excelClicked
		})
		this.props.excelOnSubmit(data, isExport)
	}

	renderSubHeaderCell(column, key) {
		const {
			sort,
			dataField,
			text,
			headerFormatter,
			hidden,
			headerStyle,
			headerClassName,
			isTogglePresent,
			subText,
			sellerSubText
		} = column

		const { isGapBetweenCell } = this.props

		if (hidden) {
			return null
		}
		let headerText = headerFormatter ? headerFormatter(text, column) : text
		if (sort) {
			headerText = this.renderHeaderCellLink(dataField, headerText, text)
		}
		if (isGapBetweenCell) {
			return (
				<>
					&ensp;
					<th
						className={headerClassName}
						key={key}
						style={headerStyle}>
						{headerText}
						{/* Dynamically rendering the table header. Checking toggle is present or not for each header.*/}
						{isTogglePresent && (
							<ReactSwitch
								onChange={this.toggleChange}
								handleDiameter={12}
								height={16}
								width={26}
								checked={this.state.toggleChecked}
							/>
						)}
					</th>
					&ensp; &ensp;
				</>
			)
		} else {
			return (
				<>
					<th
						className={headerClassName}
						key={key}
						style={headerStyle}>
						{headerText}
						<div>
							{sellerSubText}
						</div>
						<div className="subtextStyle">
							{subText}
						</div>
						{/* Dynamically rendering the table header. Checking toggle is present or not for each header.*/}
						{isTogglePresent && (
							<ReactSwitch
								onChange={this.toggleChange}
								handleDiameter={12}
								height={16}
								width={26}
								checked={this.state.toggleChecked}
							/>
						)}
					</th>
				</>
			)
		}
	}

	handleInsideTab(value) {
		this.setState({
			insideToggleHeaderChecked: value === headerText ? true : false
		})

		this.props.insideTabOnChange(value)
	}

	renderHeaderCell(commonHeader, key) {
		const {
			headertext,
			hidden,
			headerStyle,
			headerClassName,
			colSpan,
			commonHeaderClassname,
			headertextRight,
			isTab
		} = commonHeader

		const { insideToggleHeaderChecked } = this.state
		let {
			insideGridToggleOnClassName,
			insideGridToggleOffClassName,
			insideToggleHeaderCheck
		} = this.props
		if (hidden) {
			return null
		}
		headerText = headertext

		if (isTab) {
			return (
				<th
					colspan={colSpan}
					className={commonHeaderClassname}
					key={key}
					style={headerStyle}>
					<div>
						<a
							className={
								insideToggleHeaderCheck
									? insideGridToggleOnClassName
									: insideGridToggleOffClassName
							}
							onClick={this.props.handleChangeInsideTab(headertext)}>
							{headertext}
						</a>

						<div className='verticalLine'></div>

						<a
							className={
								insideToggleHeaderCheck
									? insideGridToggleOffClassName
									: insideGridToggleOnClassName
							}
							onClick={this.props.handleChangeInsideTab(headertextRight)}>
							{headertextRight}
						</a>
					</div>
				</th>
			)
		} else {
			return (
				<th
					colspan={colSpan}
					className={commonHeaderClassname}
					key={key}
					style={headerStyle}>
					{headerText}
				</th>
			)
		}
	}

	renderHeader(columns, commonHeader) {
		const { isModal } = this.props
		let headerClassPair = !isModal ? 'activeHeader' : 'modalActiveHeader'
		return (
			<thead>
				{this.props.showCommonHeader &&
					commonHeader &&
					commonHeader.length ? (
					<tr className={headerClassPair}>
						{commonHeader.map((col, idx) =>
							this.renderHeaderCell(col, idx)
						)}
					</tr>
				) : (
					''
				)}
				<tr className={headerClassPair}>
					{columns.map((col, idx) =>
						this.renderSubHeaderCell(col, idx)
					)}
				</tr>
			</thead>
		)
	}

	brokenImage = (e) => {
		const { PlaceHolder } = this.state
		e.target.src = PlaceHolder
	}

	renderBodyRowCell(col, rowData, key, rowKey, keypair) {
		const { hidden, text, dataField, formatter, className, style } = col
		const { isChildColumn, isGapBetweenCell } = this.props
		const { PlaceHolder } = this.state
		let color
		if (hidden) {
			return null
		}

		if (col.dataField === 'expandable') {
			return this.renderExpandable(rowKey, rowData, keypair)
		}

		let cellData =
			rowData[dataField] &&
			(rowData[dataField].children || rowData[dataField])

		if (cellData && (cellData.value || cellData.value == 0)) {
			color = cellData.color
			cellData = cellData.value
		}
		if (cellData && cellData.grade) {
			color = cellData.color
			cellData = cellData
		}

		let emptyData = cellData != undefined ? cellData : '-'
		let display = formatter
			? formatter(emptyData, rowData, text, dataField, col)
			: emptyData

		let value = display && display.props && display.props.children
		if (typeof value == 'object' && isChildColumn) {
			if (value.every((item) => item === undefined)) {
				display = 'NA'
			}
		}
		let TransColor = keypair == 'activeRow' ? whiteColor : nonActiveRowColor

		//Convert color in Hex(#) format to RGBA for opacity in color code
		const convertHexToRgbA = (hex, a) => {
			if (hex && hex.substring) {
				let r = parseInt(hex.substring(1, 3), 16),
					g = parseInt(hex.substring(3, 5), 16),
					b = parseInt(hex.substring(5, 7), 16)
				return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')'
			}
		}
		const applyBorderStyle = (col) => {

			if (col.isBorderRight) {
				return col.isBorderRight
					? {
						borderRight: `solid 2px ${borderLine_color}`,
						textAlign: 'center'
					}
					: { backgroundColor: 'transparent' }
			}

			if (col.isColorCoded && color && col.isBorderCoded) {
				return {
					backgroundColor: convertHexToRgbA(color, 0.4),

					borderTop: '2px solid',
					borderTopColor: color,
					borderLeft: `solid 2px ${borderLine_color}`,
				}
			}
			else if (col.isTextColored && col.isBorderCoded) {
				return {
					borderLeft: `solid 2px ${borderLine_color}`,
					textAlign: 'center',
					color: color
				}

			} else if (col.isColorCoded && color) {
				return {
					backgroundColor: convertHexToRgbA(color, 0.4),

					borderTop: '2px solid',
					borderTopColor: color,
					borderRight: `2px solid ${whiteColor}`
				}
			} else if (col.isBorderCoded) {
				return {
					borderLeft: `solid 2px ${borderLine_color}`,
					textAlign: 'center'
				}
			} else if (col.isColorCoded) {
				return {
					backgroundColor: 'transparent',
					borderRight: '2px solid',
					borderRightColor: TransColor
				}
			} else if (col.isVerticalAlignTop) {
				return {
					backgroundColor: 'transparent',
					verticalAlign:
						cellData &&
							cellData.length &&
							cellData[0] == 'No Keyword Coverage'
							? ''
							: 'text-top',
					textAlign: '-webkit-center'
				}
			}
			else if (col.isHasChildRow && col.isColumnFreeze) {
				return {
					position: 'sticky',
					left: col.freezeColumnSize,
					zIndex: 1,
					backgroundColor: TransColor
				}
			}
			else if (col.isHasChildRow) {
				if (cellData === '0.0 %' && col.isZeroToHighlightBasedOnModules) {
					return {
						width: col.width + 'em',
						backgroundColor: '#fa042d66',
						border: '2px solid white'
					}
				} else {
					return {
						width: col.width + 'em',
						backgroundColor: 'transparent'
					}
				}
			}

			else if (col.isTextColored) {
				return {
					color: color
				}
			}
			else if (col.isColumnFreeze) {
				return {
					position: 'sticky',
					left: col.freezeColumnSize,
					zIndex: 1,
					backgroundColor: TransColor
				}
			}
			else if (col.isPaddingStyleNotNeeded) {
				return { padding: '0em' }
			}
			else {
				return { backgroundColor: 'transparent' }
			}
		}

		if (isGapBetweenCell) {
			return (
				<>
					&ensp;
					<td key={key} style={applyBorderStyle(col)}>
						{col.isImagePresent ? (
							<img src={cellData ? cellData : PlaceHolder} className='image-column'
								onError={this.brokenImage.bind(this)}
							/>
						) : (
							display
						)}
					</td>
					&ensp; &ensp;
				</>
			)
		} else {

			return (
				<>
					<td key={key} style={applyBorderStyle(col)}>
						{col.isImagePresent ? (
							<img src={cellData ? cellData : PlaceHolder} className='image-column' />
						) : (
							display
						)}
					</td>
				</>
			)
		}
	}

	handleExpand(key) {
		this.setState({
			['showPanel' + key]: !this.state['showPanel' + key]
		})
	}

	renderExpandable(key, rowData, keypair) {
		const expandKey = ['expandKey', key].join('-')
		let isExpandBtnBGColor = false
		if (rowData && rowData.isExpandBtnBackgroundColourNeeded !== null && rowData.isExpandBtnBackgroundColourNeeded !== undefined) {
			isExpandBtnBGColor = !rowData.isExpandBtnBackgroundColourNeeded
		}
		let TransColor = isExpandBtnBGColor ? rowData.rowColor.color : keypair == 'activeRow' ? whiteColor : nonActiveRowColor
		let zIndex = rowData.isExpandNotNeeded ? '-1' : '1'
		return (
			<>
				{/* &ensp; */}
				<td key={expandKey} className='gridExpand' style={{ width: '1em', position: 'sticky', left: '-1px', zIndex: zIndex, backgroundColor: TransColor }}>
					<ExpanderButtonControl
						expanded={!this.state['showPanel' + key]}
						onClick={() => this.handleExpand(key)}
					/>
				</td>
			</>
		)
	}

	renderChildPanel(key, columns, rowData) {
		const { onRenderPanel } = this.props

		const childKey = ['expandRowIdx', key].join('-')

		const childPanelStyle = this.state['showPanel' + key]
			? classNames({ active: true }, 'childPanelBody')
			: 'hideChildPanel'

		return (
			<tr key={childKey} className={childPanelStyle}>
				<td colSpan={columns.length} style={{ padding: '0px' }}>
					<Collapse
						className='dataTableChildPanel'
						in={this.state['showPanel' + key]}>
						<div id='example-collapse-text'>
							{onRenderPanel ? onRenderPanel(key, rowData) : ''}
						</div>
					</Collapse>
				</td>
			</tr>
		)
	}

	renderBodyRow(columns, rowData, key) {
		const {
			onCustomRowRender,
			rowClassName,
			rowStyle,
			isModal,
			activeRowHeight,
			inActiveRowHeight,
			rowColor
		} = this.props
		if (onCustomRowRender) {
			const result = onCustomRowRender(
				columns,
				rowData,
				key,
				this.props,
				this.renderBodyRowCell
			)
			if (result !== undefined) {
				return result
			}
		}
		const showChildPanel = this.state['showPanel' + key]

		keypair =
			key % 2 == 0
				? !isModal
					? 'activeRow'
					: 'modalActiveRow'
				: !isModal
					? 'non-activeRow'
					: 'modalNon-activeRow'
		const rowColorRender = (data) => {
			return rowColor ?
				data && data.rowColor != null ?
					data.rowColor.color
					: ''
				: ''
		}
		return (
			<Fragment key={key}>
				<tr
					className={classNames(
						{ active: showChildPanel },
						keypair,
						rowClassName
					)}
					style={{ height: activeRowHeight, backgroundColor: rowColorRender(rowData) }}>
					{columns.map((col, idx) =>
						this.renderBodyRowCell(col, rowData, idx, key, keypair)
					)}
				</tr>
				{showChildPanel
					? this.renderChildPanel(key, columns, rowData)
					: null}
			</Fragment>
		)
	}

	renderBody(columns, data) {
		const {
			colSpanSize,
			noDataMessage,
			noDataFoundCardStyle,
			toggleHeaderChecked,
			isCloseIcon
		} = this.props
		const rows =
			data && data.length ? (
				data.map(
					(row, idx) => row && this.renderBodyRow(columns, row, idx)
				)
			) : (
				<tr className='gridNoDataBackground'>
					<td colSpan={colSpanSize} className='noDataCol'>
						<DataNotAvailable
							message={
								noDataMessage == bundleHierarchy.wrong_tab
									? `${NO} ${toggleHeaderChecked.split(' ')[0]} ${TAB_MSG}`
									: noDataMessage
							}
							noDataCardStyle={this.props.noDataFoundCardStyle}
							isCloseIcon={isCloseIcon}
						/>
					</td>
				</tr>
			)

		return <tbody>{rows}</tbody>
	}

	setPage(page, status) {
		var pager = this.state.pager
		this.setState({ pageStatus: true })

		pager = this.getPager(this.state.totalSize, page)
		var pageOfItems =
			this.props.data &&
			this.props.data.slice(pager.startIndex, pager.endIndex + 1)
		this.setState({ pager: pager })

		if (status) this.onChangePage(pageOfItems, pager)
	}

	getPager(totalItems, currentPage, pageSize) {
		currentPage = currentPage || 1
		pageSize = pageSize || 10
		var totalPages = Math.ceil(totalItems / pageSize)
		var startPage, endPage
		if (totalPages <= 10) {
			startPage = 1
			endPage = totalPages
		} else {
			if (currentPage < 3) {
				startPage = 1
				endPage = 3
			} else if (currentPage + 3 >= totalPages) {
				startPage = totalPages - 3
				endPage = totalPages
			} else {
				startPage = currentPage - 1
				endPage = currentPage + 1
			}
		}

		var startIndex =
			currentPage == 1
				? (currentPage - 1) * pageSize
				: (currentPage - 1) * pageSize

		var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1)

		var pages = [...Array(endPage + 1 - startPage).keys()].map(
			(i) => startPage + i
		)
		return {
			totalItems: totalItems,
			currentPage: currentPage,
			pageSize: pageSize,
			totalPages: totalPages,
			startPage: startPage,
			endPage: endPage,
			startIndex: startIndex,
			endIndex: endIndex,
			pages: pages
		}
	}

	isAddColumn(columns, field) {
		const isAddField = columns.some((item) => {
			return item.dataField === field
		})
		return isAddField
	}

	addColumn(columns, isExpandable) {
		const isAddExpandableColumn = this.isAddColumn(columns, 'expandable')
		const addHeaderExpandable = {
			dataField: 'expandable',
			text: '',
			headerStyle: headingStyleExpandId
		}
		isExpandable &&
			!isAddExpandableColumn &&
			columns.unshift(addHeaderExpandable)
		return columns
	}

	search(value, check) {
		this.setState({
			searchValue: value
		})
		let searchValue = extend(true, {}, this.props.parameters)
		searchValue.fromIndex = 0
		searchValue.productname = value
		this.props.onSearchBox(searchValue)
	}

	renderModal() {
		this.setState({ excelClicked: true })
	}

	clickToggleTitle(value) {
		this.props.onSubmit(value)
	}

	clickToggleNames(value) {
		this.props.onSubmitToggleNames(value)
	}

	render() {
		const {
			bsTableProps,
			columns,
			commonHeader,
			data,
			showHeader,
			pagination,
			isExpandable,
			title,
			isModal,
			tabNames,
			toggleTitleLeft,
			toggleTitleRight,
			toggleOnClassName,
			toggleOffClassName,
			isVerticalLine,
			exportModalTitle,
			exportDefaultRender,
			exportTopPositiondropdown,
			exportKeyworddropdown,
			exportIsDataPresent,
			exportReducerName,
			exportPageName,
			exportIsLoading,
			exportDefaultSelectedDate,
			exportEnableAllRetailerOption,
			legend,
			legendText,
			exportRangeLimit,
			exportMonthLimit,
			isSearchBoxPresent,
			gridHeaderSearchBar,
			isExportPresent,
			isCardHeader,
			gridLoading,
			gridSpinnerClassName,
			gridCardContainerClassName,
			gridCardClassName,
			gridHeight,
			gridDisplay,
			gridCardHeaderTitleClassName,
			gridCardModalContainerClassName,
			isToggleNamesPresent,
			isLegendOnlyPresent,
			isSearchBoxOnlyPresent,
			toggleNames,
			exportFilterMetaDataStrucutre,
			staticLegend,
			isExportDatePresent,
			isSingleSelect,
			gridPagination,
			isLegendTextPresent,
			legendTextStyle,
			isShowOnlySearchScrapDates,
			frequencyScrapDay,
			frequencyScrapDates,
			exportDefaultDateSelected,
			gridCardHeaderClassname,
			tableContainerStyle,
			hideDropdownListWithFunctionality,
			hidedDropDownList,
			configureFirstPagePosition,
			moduleName,
			weeklyDaySelect,
			gridInfo,
			gridInfoText,
			categorySOS,
			gridCardHeight
		} = this.props
		const { excelClicked, toggleHeaderChecked, totalSize, ExportIcon, Info } = this.state
		let totalPage = totalSize / 10
		if (!Number.isInteger(totalPage)) {
			let decimalPageNumber = totalPage.toString().split('.')
			if (decimalPageNumber[1] >= 5) {
				totalPage = Math.round(totalPage)
			} else {
				totalPage = Math.round(totalPage) + 1
			}
		}

		var pager = this.state.pager
		let gridRowContainer = !isModal && 'tile-container-dataTable'
		let gridLegend = (
			<>
				{/*Dynamically adding the legend with its respective title, which is passed from the page
				 */}
				{isLegendTextPresent && <p className={legendTextStyle}>{legendText}</p>}
				{legend &&
					legend.length ? (
					legend.map((i) => (
						<>
							<div
								class='doughnut'
								style={{ color: i.legendColor }}></div>
							<a className='gridLegendVariance'>{i.title}</a>
						</>
					))) : ''}
				{staticLegend &&
					staticLegend.length ? (
					staticLegend.map((i) => (
						<>
							<img
								src={i.image}
								className='search-datatable-image'
							/>
							<a className='gridLegendVariance'>{i.title}</a>
						</>
					))) : ''}
			</>
		)

		if (pagination && (!pager.pages || pager.pages.length < 0)) {
			return null
		}
		const gridContainer = isModal
			? gridCardModalContainerClassName
			: gridCardContainerClassName

		this.addColumn(columns, isExpandable)

		return (
			<div {...bsTableProps}>
				<Card className={gridCardClassName}>
					{isCardHeader && (
						<Card.Header className={gridCardHeaderClassname}>
							<Row>
								{/* If modal contains grid, We should not show the searchbox and export button on it.
		so, that is handled via isModal property */}
								<Col
									className='gridHeaderLeftBlock'
									xl={{ span: !isModal ? 7 : 7 }}
									md={{ span: !isModal ? 12 : 12 }}>
									{!isToggleNamesPresent ? (
										<Col
											className={
												gridCardHeaderTitleClassName
											}>
											{title}
										</Col>
									) : (
										<>
											<Col
												className={
													gridCardHeaderTitleClassName
												}>
												{title}
												&ensp; &ensp;
												{toggleNames &&
													toggleNames.map(
														(key, index) => {
															return (
																<>
																	<a
																		className={
																			this
																				.props
																				.toggleNamesChecked ===
																				key
																				? toggleOnClassName
																				: toggleOffClassName
																		}
																		onClick={this.clickToggleNames.bind(
																			this,
																			key
																		)}>
																		{key}
																	</a>

																	{toggleNames.length -
																		1 >
																		index &&
																		isVerticalLine && (
																			<div className='verticalLine'></div>
																		)}
																</>
															)
														}
													)}
											</Col>
										</>
									)}
								</Col>
								<Col
									className='gridHeaderRightBlock'
									xl={{ span: 5 }}
									md={{ span: 12 }}>
									<Row>
										{isSearchBoxPresent ? (
											<>
												<Col
													xl={{ span: 8 }}
													md={{ span: 8 }}>
													<div className={gridHeaderSearchBar}>
														<SearchBar
															onSearch={(
																event,
																id
															) =>
																this.search(
																	event,
																	id
																)
															}
															placeholder={
																SEARCHBOX_PLACEHOLDER
															}
															actionName={
																this.props
																	.actionName
															}
															query={
																this.state
																	.searchValue
															}
															parameters={
																this.props
																	.parameters
															}
															isCleared={
																this.props
																	.isCleared
															}
														/>
													</div>
												</Col>
												<Col
													xl={{ span: 0 }}
												>
													{isExportPresent && (
														<div className='exportBlockOne'>
															{!isModal && (
																<span
																	onClick={this.renderModal.bind(
																		this
																	)}
																	className='exportBtn'>
																	{EXPORT}{' '}
																</span>

															)}
														</div>
													)}
												</Col>
											</>
										) : (
											<Col xl={{ span: 0 }}>
												{isExportPresent ? (
													<div className='exportBlockTwo'>
														{!isModal && (
															<span
																onClick={this.renderModal.bind(
																	this
																)}
																className='exportBtn'>
																{EXPORT}{' '}
															</span>
														)}
													</div>
												) : (
													isSearchBoxOnlyPresent && (
														<div className='gridHeaderSearchBarTwo'>
															<SearchBar
																onSearch={(
																	event,
																	id
																) =>
																	this.search(
																		event,
																		id
																	)
																}
																placeholder={
																	SEARCHBOX_PLACEHOLDER
																}
																actionName={
																	this.props
																		.actionName
																}
																query={
																	this.state
																		.searchValue
																}
																parameters={
																	this.props
																		.parameters
																}
																isCleared={
																	this.props
																		.isCleared
																}
															/>
														</div>
													)
												)}
											</Col>
										)}
									</Row>
								</Col>
							</Row>
							{/* Not all the grid contains toggle in the grid header. that is handled via isVerticalLine
              and toggle titles from the toggleTitleLeft and toggleTitleRight */}
							{isModal && !isVerticalLine ? null : (
								<Row className='gridSubHeaderContainer'>
									<Col
										xl={{ span: 9.9 }}
										md={{ span: 9 }}
										className='search-datatable-toggle-col'>
										<div className='toggle'>
											{tabNames &&
												tabNames.map((key, index) => {
													return (
														<>
															<a
																className={
																	this.props
																		.toggleHeaderChecked ===
																		key
																		? toggleOnClassName
																		: toggleOffClassName
																}
																onClick={this.clickToggleTitle.bind(
																	this,
																	key
																)}>
																{key}
															</a>

															{tabNames.length -
																1 >
																index &&
																isVerticalLine && (
																	<div className='verticalLine'></div>
																)}
														</>
													)
												})}
										</div>
									</Col>
									<Col style={{ padding: "0px" }}>
										<div className="header-format">
											{this.props.retailerOptions ?
												(this.props.retailerOptions).map((item) => (
													<div>
														<CheckBox
															label={item.label}
															className="checkbox"
															key={item.label}
															isCleared={this.state.isResetClicked}
															isFilterApplied={this.state.isfilterChecked}
															searchTableCallBack={(optionsArray) => this.props.searchTableCallBack(optionsArray)}
														/>
													</div>
												))
												: <div> </div>}
										</div>
									</Col>
								</Row>
							)}
							{excelClicked && (
								<>
									<ExportModal
										modalTitle={exportModalTitle}
										show={excelClicked}
										defaultRender={exportDefaultRender}
										isExportDatePresent={
											isExportDatePresent
										}
										topPositiondropdown={
											exportTopPositiondropdown
										}
										onHide={this.handleHideExportModal}
										isDataPresent={exportIsDataPresent}
										commonReducerName={exportReducerName}
										pageName={exportPageName}
										isLoading={exportIsLoading}
										defaultSelectedDate={
											exportDefaultSelectedDate
										}
										enableAllRetailerOption={
											exportEnableAllRetailerOption
										}
										rangeLimit={exportRangeLimit}
										monthLimit={exportMonthLimit}
										handleApplyFilter={(data, value) =>
											this.handleExcelFilter(data, value)
										}
										exportFilterMetaDataStrucutre={
											exportFilterMetaDataStrucutre
										}
										isSingleSelect={isSingleSelect}
										weeklyDaySelect={this.props.weeklyDaySelect}
										isShowOnlySearchScrapDates={isShowOnlySearchScrapDates}
										frequencyScrapDay={frequencyScrapDay}
										frequencyScrapDates={frequencyScrapDates}
										hidedDropDownList={hidedDropDownList}
										pageNameForExport={this.props.pageNameForExport}
										configureFirstPagePosition={configureFirstPagePosition}
										hideDropdownListWithFunctionality={hideDropdownListWithFunctionality}
										moduleName={moduleName}
										exportDefaultDateSelected={exportDefaultDateSelected}></ExportModal>
								</>
							)}
						</Card.Header>
					)}
					{gridLoading ? (
						<center>
							<Spinner
								animation='grow'
								className={gridSpinnerClassName}
							/>
						</center>
					) : (
						<Card.Body className='gridCardBody' style={{ height: gridCardHeight }}>
							<div className={gridContainer}>
								<div
									class='table-wrapper'
									style={{
										height: gridHeight,
										display: gridDisplay,
										marginTop: '-1px'
									}}>
									{' '}
									<Table
										responsive
										className={tableContainerStyle}>
										{showHeader &&
											this.renderHeader(
												columns,
												commonHeader
											)}
										{this.renderBody(columns, data)}
									</Table>
								</div>
							</div>
						</Card.Body>
					)}
					{data && data.length && pagination && totalSize > 10 ? (
						<Card.Footer className='gridCardFooter'>
							<div className='gridLegend'>{gridLegend}</div>
							<div className={gridPagination}>
								<ul className='pagination'>
									{/* Functionality: click on this, it will take you to the very first page. 
                    It will be hidded, if user moved to very first page
                 */}
									{pager.currentPage >= 2 && (
										<li
											className={
												pager.currentPage === 1 &&
													totalSize > 10
													? 'disabled'
													: ''
											}>
											<a
												onClick={() =>
													this.setPage(1, true)
												}>
												<span aria-label='Previous'>
													{'\u2039'}
													{'\u2039'}
												</span>
											</a>
										</li>
									)}
									{/* 
                    Functionality: click on the Prev, It will take you to the previous page
                    It will be disabled, if user is on 1st page
                     */}
									{totalSize > 10 && (
										<>
											{pager.currentPage > 1 ? (
												<li
													className={
														pager.currentPage === 1
															? 'disabled'
															: ''
													}>
													<a
														onClick={() =>
															this.setPage(
																pager.currentPage -
																1,
																true
															)
														}
														className='prevStyle'>
														{PREV}
													</a>
												</li>
											) : (
												<li className='disabledPrev'>
													<a> {PREV}</a>
												</li>
											)}
										</>
									)}

									{/* 
                    Functionality: It will show you the 3 page numbers pagination (including next,current,previous)
                    click on the number, It will take you to the respective page
                     */}
									{pager.pages.map((page, index) => (
										<li
											key={index}
											className={
												pager.currentPage === page
													? 'active'
													: ''
											}>
											<a
												onClick={() =>
													this.setPage(page, true)
												}>
												{page}
											</a>
										</li>
									))}

									{/* 
                    Functionality: It will show (...). No functionality will  happen here. Just to
                    indicate more pages is present
                     */}
									{pager.currentPage != pager.totalPages &&
										totalSize > 10 &&
										pager.pages[pager.pages.length - 1] !==
										pager.totalPages && (
											<li
												className={
													pager.currentPage ===
														pager.totalPages
														? 'disabled'
														: ''
												}>
												<a>{'...'}</a>
											</li>
										)}

									{/* 
                    Functionality: It will show you the very last page number
                    click on this number, It will take you to the very last page
                     */}
									{pager.currentPage != pager.totalPages &&
										totalSize > 10 &&
										pager.pages[pager.pages.length - 1] !==
										pager.totalPages && (
											<li
												className={
													pager.currentPage ===
														pager.totalPages
														? 'disabled'
														: ''
												}>
												<a
													onClick={() =>
														this.setPage(
															totalPage,
															true
														)
													}
													className='pageNumberColor'>
													{totalPage}
												</a>
											</li>
										)}

									{/* 
                    Functionality: click on the Next, It will take you to the next page
                    It will be disabled, if user moved to the very last page
                     */}
									{totalSize > 10 && (
										<>
											{pager.currentPage !=
												pager.totalPages &&
												totalSize > 10 ? (
												<li
													className={
														pager.currentPage ===
															pager.totalPages
															? 'disabled'
															: ''
													}>
													<a
														onClick={() =>
															this.setPage(
																pager.currentPage +
																1,
																true
															)
														}
														className='nextStyle'>
														{NEXT}
													</a>
												</li>
											) : (
												<li className='disabledPrev'>
													<a> {NEXT}</a>
												</li>
											)}
										</>
									)}

									{/* Functionality: click on this, it will take you to the very last page. 
                    It will be hidded, if user moved to very last page
                 */}
									{pager.currentPage != pager.totalPages &&
										totalSize > 10 && (
											<li
												className={
													pager.currentPage ===
														pager.totalPages
														? 'disabled'
														: ''
												}>
												<a
													onClick={() =>
														this.setPage(
															totalPage,
															true
														)
													}>
													<span aria-label='Next'>
														{'\u203a'}
														{'\u203a'}
													</span>
												</a>
											</li>
										)}
								</ul>
							</div>
						</Card.Footer>
					) : gridInfo && isLegendOnlyPresent ? (
						<Card.Footer className='gridCardFooter' style={{ paddingBottom: '3rem' }}>
							<div className='grid-info'> {categorySOS ? <img src={Info} className='search-datatable-Info-style' /> : ''}{gridInfoText}
							</div>
							<div className='grid-legend-info'>{gridLegend}</div>
						</Card.Footer>
					) : isLegendOnlyPresent ? (
						<Card.Footer className='gridCardFooter'>
							<div className='gridLegend'>{gridLegend}</div>
						</Card.Footer>
					) : (<div />)
					}
				</Card>
			</div>
		)
	}
}
export default connect(mapStateToProps, null)(DataGrid)
