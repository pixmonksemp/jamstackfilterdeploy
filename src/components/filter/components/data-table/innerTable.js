/** @format */

import React, { Component, Fragment } from 'react'
import { Card, Collapse, Table } from 'react-bootstrap'
import UpwardArrow from '../../assets/Upward.png'
import DownArrow from '../../assets/Downward.png'
import NoArrow from '../../assets/No sorting.png'
import ExpanderButtonControl from './expand-collapse'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import DataNotAvailable from '../data-not-available-component/data-not-available'
import './style.scss'
import { whiteColor, nonActiveRowColor, font_md, barlow_medium } from "../../styling/scss/_variables.scss";

export const headingStyleExpandId = {
	backgroundColor: 'rgb(255 224 204)',
	fontFamily: barlow_medium,
	fontSize: font_md,
	fontStretch: 'normal',
	fontStyle: 'normal',
	lineHeight: 'normal',
	letterSpacing: 'normal',
	color: whiteColor,
	width: '8%',
	borderTop: 'white',
	textAlign: 'left'
}
const MAX_NO_COLUMN_SORT = 1
class DataTable extends Component {
	static propTypes = {
		bsTableProps: PropTypes.object,
		columns: PropTypes.arrayOf(
			PropTypes.shape({
				className: PropTypes.string,
				dataField: PropTypes.string.isRequired,
				formatter: PropTypes.func,
				headerClassName: PropTypes.string,
				headerFormatter: PropTypes.func,
				insideonRenderPanel: PropTypes.func,
				headerStyle: PropTypes.object,
				hidden: PropTypes.bool,
				sort: PropTypes.bool,
				style: PropTypes.object,
				text: PropTypes.string,
				width: PropTypes.number,
				isColumnFreeze: PropTypes.bool,
				freezeColumnSize: PropTypes.string,
				isZeroToHighlightBasedOnModules: PropTypes.bool
			})
		).isRequired,
		commonHeader: PropTypes.arrayOf(
			PropTypes.shape({
				colSpan: PropTypes.number,
				headertext: PropTypes.string
			})
		),
		data: PropTypes.array.isRequired,
		isFetching: PropTypes.bool,
		maxNumberColumnSort: PropTypes.number,
		onCustomRowRender: PropTypes.func,
		onSorting: PropTypes.func,
		rowClassName: PropTypes.string,
		rowStyle: PropTypes.object,
		showHeader: PropTypes.bool,
		sorting: PropTypes.arrayOf(
			PropTypes.shape({
				key: PropTypes.string.isRequired,
				value: PropTypes.number.isRequired
			})
		),
		keyValue: PropTypes.number
	}
	static defaultProps = {
		showHeader: true,
		maxNumberColumnSort: MAX_NO_COLUMN_SORT,
		columns: [
			{
				isColumnFreeze: false,
				isZeroToHighlightBasedOnModules: false
			}
		]
	}
	constructor(props) {
		super(props)
		this.state = {
			isDefaultSort: true
		}

		this.handleHeaderClick = this.handleHeaderClick.bind(this)
	}

	componentWillReceiveProps(nextProps, prevProps) {
		const { closeExpands } = nextProps
		if (closeExpands) {
			const stateValue = Object.assign(this.state)
			for (let key in stateValue) {
				if (key.includes('showPanel')) {
					delete stateValue[key]
				}
			}
		}
	}

	handleHeaderClick(e) {
		e.preventDefault()
		const { onSorting } = this.props
		if (onSorting) {
			const { dataField, sorted } = e.currentTarget.dataset
			const sortedValue = parseInt(sorted) > 0 ? -1 : 1
			const { sorting, maxNumberColumnSort } = this.props
			const sortedField = sorting.find(f => f.key === dataField)
			if (sortedField) {
				// remove existing sort field
				const idx = sorting.indexOf(sortedField)
				sorting.splice(idx, 1)
			}
			// add the new sort to the beginning
			sorting.unshift({ key: dataField, value: sortedValue })
			if (sorting.length >= maxNumberColumnSort) {
				sorting.splice(maxNumberColumnSort)
			}
			this.setState({ isDefaultSort: false })

			onSorting(sorting, dataField, sortedValue)
		}
		return false
	}
	renderHeaderCellLink(dataField, headerText) {
		const { isDefaultSort } = this.state
		const { sorting } = this.props
		const sortField = sorting.find(f => f.key === dataField)
		const sorted = !sortField ? 0 : sortField.value
		return (
			<div
				className={classNames({
					active: !isDefaultSort && sorted !== 0
				})}
				data-data-field={dataField}
				data-sorted={sorted}
				href='#'
				onClick={this.handleHeaderClick}>
				<span>{headerText}</span>
				<span className='innerTable-img'>
					{isDefaultSort && sorted === 0 ? (
						<img src={NoArrow} />
					) : !isDefaultSort && sorted === 1 ? (
						<img src={DownArrow} />
					) : (
						<img src={UpwardArrow} />
					)}
				</span>
			</div>
		)
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
			rowSpan
		} = column
		if (hidden) {
			return null
		}
		let headerText = headerFormatter ? headerFormatter(text, column) : text
		if (sort) {
			headerText = this.renderHeaderCellLink(dataField, headerText)
		}
		return (
			<th className={headerClassName} key={key} style={headerStyle}>
				{headerText}
			</th>
		)
	}
	renderHeaderCell(commonHeader, key) {
		const {
			sort,
			dataField,
			headertext,
			hidden,
			headerStyle,
			headerClassName,
			colSpan
		} = commonHeader
		if (hidden) {
			return null
		}
		let headerText = headertext
		return (
			<th
				colspan={colSpan}
				className={headerClassName}
				key={key}
				style={headerStyle}>
				{headerText}
			</th>
		)
	}
	renderHeader(columns, commonHeader) {
		return (
			<thead>
				{commonHeader && commonHeader.length ? (
					<tr>
						{commonHeader.map((col, idx) =>
							this.renderHeaderCell(col, idx)
						)}
					</tr>
				) : (
					''
				)}
				<tr>
					{columns.map((col, idx) =>
						this.renderSubHeaderCell(col, idx)
					)}
				</tr>
			</thead>
		)
	}
	renderBodyRowCell(col, rowData, key, rowKey, keypair) {
		const {
			hidden,
			text,
			dataField,
			formatter,
			className,
			headerStyle,
			style,
			width
		} = col
		if (hidden) {
			return null
		}

		if (col.dataField === 'expandable') {
			return this.renderExpandable(rowKey, rowData)
		}
		let TransColor = keypair == 'activeRow' ? whiteColor : nonActiveRowColor
		const original =
			rowData[dataField] &&
			(rowData[dataField].children || rowData[dataField])
		let emptyData = original != undefined ? original : '-'
		const display = formatter
			? formatter(emptyData, rowData, text, dataField, col)
			: emptyData

		const applyBorderStyle = (col) => {
			if (col.width && col.isColumnFreeze) {
				return {
					width: col.width + 'em',
					left: col.freezeColumnSize,
					zIndex: 1,
					position: 'sticky',
					backgroundColor: TransColor
				}
			}
			else if (col.width) {
				if (emptyData === '0.0 %' && col.isZeroToHighlightBasedOnModules) {
					return {
						width: col.width + 'em',
						backgroundColor: '#fa042d66',
						border: '2px solid white'
					}
				} else {
					return {
						width: col.width + 'em'
					}
				}
			}
		}

		return (
			<td className={className} key={key} style={applyBorderStyle(col)}>
				{display}
			</td>
		)
	}
	handleExpand(key) {
		this.setState({
			['showPanel' + key]: !this.state['showPanel' + key]
		})
	}
	renderExpandable(key) {
		const expandKey = ['expandKey', key].join('-')

		return (
			<td key={expandKey} className='innerTable-expandKey'>
				<ExpanderButtonControl
					expanded={!this.state['showPanel' + key]}
					onClick={() => this.handleExpand(key)}
				/>
			</td>
		)
	}

	insideRenderChildPanel(key, columns, rowData) {
		const { insideonRenderPanel } = this.props

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
							{insideonRenderPanel
								? insideonRenderPanel(key, rowData)
								: ''}
						</div>
					</Collapse>
				</td>
			</tr>
		)
	}
	renderBodyRow(columns, rowData, key) {
		const { onCustomRowRender, rowClassName, rowStyle } = this.props
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
		let keypair = this.props.keyValue % 2 == 0 ? 'activeRow' : 'non-activeRow'

		return (
			<Fragment key={key}>
				<tr
					className={classNames(
						{ active: showChildPanel },
						keypair,
						rowClassName
					)}
					style={rowStyle}>
					{columns.map((col, idx) =>
						this.renderBodyRowCell(col, rowData, idx, key, keypair)
					)}
				</tr>
				{showChildPanel
					? this.insideRenderChildPanel(key, columns, rowData)
					: null}
			</Fragment>
		)
	}
	renderBody(columns, data) {
		const rows =
			data && data.length ? (
				data.map(
					(row, idx) => row && this.renderBodyRow(columns, row, idx)
				)
			) : (
				<tr className='gridNoDataBackground'>
					<td className='noDataCol'>
						<DataNotAvailable
							noDataCardStyle='expandNoDataCardStyle'
						/>
					</td>
				</tr>
			)

		return <tbody>{rows}</tbody>
	}

	isAddColumn(columns, field) {
		const isAddField = columns.some(item => {
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

	render() {
		const {
			bsTableProps,
			columns,
			commonHeader,
			data,
			showHeader,
			isExpandable
		} = this.props

		const column = this.addColumn(columns, isExpandable)

		return (
			<div>
				<Table {...bsTableProps}>
					{showHeader && this.renderHeader(columns, commonHeader)}
					{this.renderBody(columns, data)}
				</Table>
			</div>
		)
	}
}
export default DataTable
