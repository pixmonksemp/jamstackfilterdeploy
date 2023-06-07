/** @format */

import React from 'react'
import PropTypes from 'prop-types'
import { Row } from 'react-bootstrap'
import Select, { components } from 'react-select'
import { CaretDownIcon, CaretUpIcon } from '../../components/svg-icon/index'
//import DownIcon from '../../assets/downArrowIcon.webp'
import IconGroup from '../icon-group'
import {
	optionStyles,
	multiSelectOptionStyles,
	multiSelectOptionEnlargeStyles,
	IndicatorSeparator,
	CustomOption
} from './searchable-dropdown-constant'
import './style.scss'
import { FixedSizeList as List } from 'react-window'
import { removeArrayObjectDuplicates } from '../../components/util/common-util'
import { requestParamsDropdownOptions } from '../top-menu/util'

const height = 45
let count = 0
class MenuList extends React.Component {
	handleMouseOver(key, index, children) {
		getHoverText = children[index].props.data.value
	}
	handleMouseLeave() {
		getHoverText = ''
	}

	render() {
		const { options, children, maxHeight, getValue } = this.props
		const [value] = getValue()
		const initialOffset = options.indexOf(value) * height

		return (
			<>
				{children && children.length != undefined ? (
					<List
						height={
							children && children.length == 1
								? 70
								: children && children.length == 2
								? 90
								: 150
						}
						itemCount={children.length}
						itemSize={height}
						// initialScrollOffset={initialOffset}
					>
						{({ index, style }) => (
							<div
								style={style}
								onMouseOver={(key) =>
									this.handleMouseOver(key, index, children)
								}
								onMouseLeave={(key) => this.handleMouseLeave()}
								title={getHoverText}>
								{children[index]}
							</div>
						)}
					</List>
				) : (
					<div
						style={{
							height: '60px',
							textAlign: 'center',
							padding: '8px 12px',
							color: 'rgb(153, 153, 153)',
							cursor: 'context-menu'
						}}
						onMouseOver={(key) => (getHoverText = 'No Options')}
						onMouseLeave={(key) => this.handleMouseLeave()}
						title='No options'>
						No Options
					</div>
				)}
			</>
		)
	}
}

let getHoverText
// const MenuList = ({ children, ...props }) => {
// 	const optionSelectedLength = props.getValue().length || 0
// 	return (
// 		<components.MenuList {...props}>
// 			<div
// 				onMouseOver={(key) => {
// 					getHoverText = key.target.innerText
// 				}}
// 				onMouseLeave={(key) => {
// 					getHoverText = ''
// 				}}
// 				title={getHoverText}>
// 				{/* {!selectAll ? ( //For future reference Limit the dropdown options
// 					optionSelectedLength < selectedLimit ? (
// 						children
// 					) : (
// 						<div className='limitStyle'>Max limit achieved</div>
// 					)
// 				) : ( */}
// 				{children}
// 				{/* )} */}
// 			</div>
// 		</components.MenuList>
// 	)
// }

export default class SearchableDropdown extends React.Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		options: PropTypes.array.isRequired,
		value: PropTypes.object.isRequired,
		disabled: PropTypes.bool,
		isLoading: PropTypes.bool,
		className: PropTypes.string,
		defaultValuePassed: PropTypes.string,
		placeholder: PropTypes.string,
		selectedLimit: PropTypes.number,
		multiselect: PropTypes.bool,
		selectAll: PropTypes.bool,
		optionStyles: PropTypes.object,
		defalutSelectAll: PropTypes.bool,
		menuIsOpen: PropTypes.bool,
		preferredRetailer: PropTypes.array,
		isMenuOptionLong: PropTypes.bool.isRequired,
		CustomizeWidth: PropTypes.bool,
		isModalNeedsFilter: PropTypes.bool,
		dropdownName: PropTypes.string,
		predictiveSearch : PropTypes.bool,
		isOnInputChange: PropTypes.bool
	}
	static defaultProps = {
		placeholder: 'Select...',
		predictiveSearch : false,
		disabled: false,
		isLoading: true,
		className: '',
		selectedLimit: 5,
		multiselect: false,
		selectAll: true,
		selectAllOption: {
			value: 'Select All',
			label: 'Select All'
		},
		menuIsOpen: false,
		defalutSelectAll: false,
		optionStyles: optionStyles,
		CustomizeWidth: false,
		isModalNeedsFilter: false,
		dropdownName: '',
		isOnInputChange: false
	}
	constructor(props) {
		super(props)
		this.state = {
			inputValue: '',
			singleSelectValue: {
				label: '',
				value: ''
			},
			isOpen: false,
			isDropdownOpen: false,
			selectAllChecked: false,
			valueRef: [],
			selectedRef: []
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleOpen = this.handleOpen.bind(this)
		this.handleClose = this.handleClose.bind(this)
	}

	componentWillMount() {
		const { defaultValuePassed, multiselect, value } = this.props
		if (this.props.isModalNeedsFilter) {
			this.state.selectedRef = this.props.options
		}
		if (multiselect && defaultValuePassed) {
			this.props.onChange(value, null)
		}
		if (
			!multiselect &&
			defaultValuePassed &&
			value &&
			value.length &&
			value[0]
		) {
			let singleSelect = {
				id: value[0].id,
				value: value[0].value,
				label: value[0].label,
				name: value[0].name
			}
			let data =
				singleSelect && singleSelect.length
					? itsingleSelectem
					: [singleSelect]

			this.props.onChange(data, null)
		}
	}

	componentWillReceiveProps(nextProps) {
		//
		const { multiselect } = this.props
		// isOptionSelected sees previous props.value after onChange
		if (multiselect) {
	
			this.state.valueRef = nextProps.value
			this.state.selectedRef = nextProps.value
			
		} else if (nextProps && nextProps.value) {
			let singleSelect = {
				id: nextProps.value[0] ? nextProps.value[0].id : '',
				value: nextProps.value[0] ? nextProps.value[0].value : '',
				label: nextProps.value[0] ? nextProps.value[0].label : '',
				name: nextProps.value[0] ? nextProps.value[0].name : ''
			}
			this.state.singleSelectValue = singleSelect
		}
	}

	handleInputChange = (inputValue, action) => {
		this.props.isOnInputChange &&
			this.props.onInputChange(inputValue, action)
		this.setState({ inputValue })
	}

	handleMultiSelectChange = (newValue, actionMeta) => {
		const {
			onChange,
			defaultValuePassed,
			preferredRetailer,
			options,
			selectAllOption,
			defalutSelectAll
		} = this.props
		const isSelectAllSelected = () =>
			this.state.selectedRef &&
			this.state.selectedRef.length === options.length
			
		const { action, option, removedValue } = actionMeta
		const initialValue =
			preferredRetailer && preferredRetailer.length
				? preferredRetailer
				: defaultValuePassed

		if (
			action === 'select-option' &&
			option.value === selectAllOption.value
		) {
			onChange(
				options.filter(
					(obj, index, self) =>
						index === self.findIndex((el) => el['id'] === obj['id'])
				),
				actionMeta
			)
		}else if(action === 'select-option'&& options.length ==1){
			onChange(newValue, actionMeta)
		} 
		else if (options.length <= 1 && isSelectAllSelected()) {
			let initialValueWithoutDuplicate = []
			initialValueWithoutDuplicate = requestParamsDropdownOptions(
				initialValue,
				options
			)
			onChange(initialValueWithoutDuplicate, actionMeta)
		} else if (
			(action === 'deselect-option' &&
				option.value === selectAllOption.value) ||
			(action === 'remove-value' &&
				removedValue.value === selectAllOption.value)
		) {
			let unselectAll = options.filter(
				(obj, index, self) =>
					index === self.findIndex((el) => el['id'] === obj['id'])
			)
			let initialValueWithoutDuplicate = []
			initialValueWithoutDuplicate = requestParamsDropdownOptions(
				initialValue,
				options
			)
			let unselectAllValuesWithoutDuplicate = []
			unselectAllValuesWithoutDuplicate = requestParamsDropdownOptions(
				[unselectAll[0]],
				options
			)
			onChange(
				defalutSelectAll
					? preferredRetailer && preferredRetailer.length
						? preferredRetailer
						: unselectAllValuesWithoutDuplicate
					: initialValueWithoutDuplicate,
				actionMeta
			)
		} else if (action === 'deselect-option' && isSelectAllSelected()) {
			onChange(
				options.filter(({ value }) => value !== option.value),
				actionMeta
			)
		} else if (
			newValue &&
			newValue.length === 0 &&
			(action === 'pop-value' ||
				action === 'clear' ||
				action === 'remove-value')
		) {
			let unselectAll = options.filter(
				(obj, index, self) =>
					index === self.findIndex((el) => el['id'] === obj['id'])
			)
			let initialValueWithoutDuplicate = []
			initialValueWithoutDuplicate = requestParamsDropdownOptions(
				initialValue,
				options
			)
			let unselectAllValuesWithoutDuplicate = []
			unselectAllValuesWithoutDuplicate = requestParamsDropdownOptions(
				[unselectAll[0]],
				options
			)
			onChange(
				defalutSelectAll
					? preferredRetailer && preferredRetailer.length
						? preferredRetailer
						: unselectAllValuesWithoutDuplicate
					: initialValueWithoutDuplicate,
				actionMeta
			)
		} else {
			let newValueWithoutDuplicate = []
			newValueWithoutDuplicate = requestParamsDropdownOptions(
				newValue,
				options
			)
			let initialValueWithoutDuplicate = []
			initialValueWithoutDuplicate = requestParamsDropdownOptions(
				initialValue,
				options
			)
			let selectedList =
				newValueWithoutDuplicate && newValueWithoutDuplicate.length
					? newValueWithoutDuplicate.filter(
							(obj, index, self) =>
								index ===
								self.findIndex((el) => el['id'] === obj['id'])
					  )
					: initialValueWithoutDuplicate
			onChange(selectedList, actionMeta)
		}
	}

	handleChange = (item) => {
		const { onChange, defaultValuePassed, options } = this.props
		item = item ? item : defaultValuePassed
		this.setState({
			singleSelectValue: item,
			isClearable: item ? true : false
		})
		let data = item && item.length ? item : [item]
		let singleSelectedValueWithoutDuplicate = []
		singleSelectedValueWithoutDuplicate = requestParamsDropdownOptions(
			data,
			options
		)

		onChange(singleSelectedValueWithoutDuplicate, 'action')
	}

	handleOpen() {
		const { defaultValuePassed } = this.props
		const { singleSelectValue } = this.state

		this.setState({ isDropdownOpen: true })
		if (
			singleSelectValue &&
			defaultValuePassed &&
			singleSelectValue.value !== defaultValuePassed.value
		) {
			this.setState({ isClearable: true })
		}
	}

	handleClose() {
		this.setState({ isClearable: false, isDropdownOpen: false })
	}

	DropdownIndicator = (props) => {
		return (
			components.DropdownIndicator &&
			!this.state.isClearable && (
				<components.DropdownIndicator {...props}>
					{props.selectProps.menuIsOpen ? (
						<IconGroup className='iconStyle' icon={CaretUpIcon} />
					) : (
						<IconGroup className='iconStyle' icon={CaretDownIcon} />
					)}
				</components.DropdownIndicator>
			)
		)
	}

	/**
	 * This method is used to pass searchable filter options with checkbox and label inputs for its options
	 * @param {*} props
	 * @var minHeight - Used to dynamically change the height of checkbox lable based on content length
	 */
	Option = (props) => {
		// props.selectProps.isLoading
		// const { isMenuOptionLong } = this.props
		// style={{ minHeight: isMenuOptionLong ? '20px' : '0px' }}
		const loadingStyle = this.props.predictiveSearch ? 'predictiveSearchLoading' : 'searchLoading'
		return (
			<components.Option {...props}>
			{
 				props.selectProps && props.selectProps.isLoading ? 
				 <Row className={loadingStyle}>
				 <div className='spinnerr'>
					 <div className='bounce1'></div>
					 <div className='bounce2'></div>
					 <div className='bounce3'></div>
				 </div>
			 </Row> : 
			<>
				<input
					type='checkbox'
					id='checkbox'
					className='filterMenuOptionCheckbox'
					checked={props.isSelected}
				/>{' '}
				&nbsp;
				<label className='dropDownLabel'>
					<span>{props.value}</span>
				</label>
			</>	
			}
			</components.Option>
		)
	}

	render() {
		const {
			placeholder,
			disabled,
			className,
			defaultValuePassed,
			preferredRetailer,
			selectAllOption,
			isLoading,
			multiselect,
			selectedLimit,
			selectAll,
			options,
			menuIsOpen,
			optionStyles,
			value,
			CustomizeWidth,
			scrollLeft,
			scrollTop,
			dropdownName,
			predictiveSearch
		} = this.props
		if (
			count == 0 &&
			menuIsOpen &&
			document.documentElement.scrollTop != scrollTop
		) {
			window.scroll(scrollLeft, scrollTop)
			count = 1
		} else if (!menuIsOpen) {
			window.onscroll = function () {}
			count = 0
		}
		const isSelectAllSelected = () =>
			
		predictiveSearch ? (this.state.selectedRef &&
			options &&
			 (!this.state.selectedRef.length === options.length)) : 
			 (this.state.selectedRef &&
			 options &&
			 this.state.selectedRef.length === options.length)
		
		const isOptionSelected = (option) =>
			(this.state.selectedRef &&
				this.state.selectedRef.length &&
				this.state.selectedRef.some(
					({ value }) => value === option.value
				)) ||
			isSelectAllSelected()
		let overallOptionsWithoutDuplicate = selectAll && options
			? removeArrayObjectDuplicates(
					[selectAllOption, ...options],
					'value'
			  )
			: options && removeArrayObjectDuplicates([...options], 'value')
		let optionsWithoutDuplicate = removeArrayObjectDuplicates(
			options,
			'value'
		)
		const getOptions = () =>
			multiselect && selectAll && options && options.length > 0
				? overallOptionsWithoutDuplicate
				: optionsWithoutDuplicate
		const initialValue =
			preferredRetailer && preferredRetailer.length
				? preferredRetailer
				: defaultValuePassed
		const getValue = () =>
			selectAll && isSelectAllSelected() ? [selectAllOption] : value
		const selectedValues =
			value && value.length === 0 ? initialValue : getValue()
		const selectedValuesWithoutDuplicate = removeArrayObjectDuplicates(
			selectedValues,
			'value'
		)
		let multiselectTooltip =
			multiselect &&
			selectedValues &&
			selectedValues.length &&
			selectedValues.map((key) => {
				return key && key.value
			})

		let tooltipName = getHoverText
			? getHoverText
			: !multiselect
			? this.state.singleSelectValue.value
			: multiselectTooltip
		let getHoverText
		let singleSelectedValues =
			this.state.singleSelectValue.value ||
			this.state.singleSelectValue.value === undefined
				? this.state.singleSelectValue
				: null
		let singleSelectedValuesWithoutDuplicate = removeArrayObjectDuplicates(
			singleSelectedValues,
			'value'
		)

		return (
			<div
				className={className}
				title={tooltipName}
				id={
					this.state.isDropdownOpen ? 'dropdownOpen' : 'dropdownClose'
				}
				data-id={dropdownName}>
				{!multiselect ? (
					<Select
						placeholder={placeholder}
						value={singleSelectedValuesWithoutDuplicate}
						options={optionsWithoutDuplicate}
						onMenuOpen={this.handleOpen}
						onMenuClose={this.handleClose}
						isLoading={!isLoading}
						onChange={this.handleChange}
						components={{
							MenuList,
							DropdownIndicator: this.DropdownIndicator,
							IndicatorSeparator,
							Option: CustomOption
						}}
						styles={optionStyles}
						// menuIsOpen={true}
						isDisabled={disabled}
						autoFocus={true}
						classNamePrefix="react-select"
						defaultMenuIsOpen={menuIsOpen} //menuIsOpen
						isClearable={this.state.isClearable}
					/>
				) : (
					<Select
						id='multiselect'
						cacheOptions
						placeholder={placeholder}
						isOptionSelected={isOptionSelected}
						options={getOptions()}
						value={selectedValuesWithoutDuplicate}
						inputValue={this.state.inputValue}
						onInputChange={this.handleInputChange}
						onChange={this.handleMultiSelectChange.bind(this)}
						closeMenuOnSelect={false}
						components={{
							MenuList,
							Option: this.Option,
							IndicatorSeparator,
							DropdownIndicator: this.DropdownIndicator
						}}
						hideSelectedOptions={false}
						defaultMenuIsOpen={menuIsOpen} //menuIsOpen
						menuIsOpen={true}
						isMulti={true}
						isLoading={!isLoading}
						styles={
							CustomizeWidth
								? multiSelectOptionEnlargeStyles
								: multiSelectOptionStyles
						}
						autoFocus={true}
						isDisabled={disabled}
						classNamePrefix="react-select"
					/>
				)}
			</div>
		)
	}
}
