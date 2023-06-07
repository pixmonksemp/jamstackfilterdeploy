import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import extend from 'extend'
import moment from 'moment'
import { Card, Col, Row } from 'react-bootstrap'
import {
	setEmptyArray,
	exportFilterDataValue,
	exportFilterDataOption,
	removeArrayObjectDuplicates,
	sortArrayOfObjectValues,
	PrepareStructure
} from './filterdata-constant'
import SearchableDropdown from '../searchable-select/index'
import { DISPLAY_DATE_FORMAT,POWER_SKU,DATE_FORMAT } from '../../common/common-constants'
import './filter-style.scss'
import DataGrid from '../data-table/search-datatable'
import { requestParamsDropdownOptions } from '../top-menu/util'

const mapStateToProps = (state) => {
	return {
		getFilterDataValue: state.stateData.getFilterdata,
		getExcelExportDataValue: state.stateData.getExcelExportDataValue,
		allKpiScrapDate: state.dashboardValue.getKpiScrapDate
	}
}

let defaultRetailerValue,
	defaultSuperCategoryValue,
	defaultCategoryValue,
	defaultBrandValue,
	defaultKeywordValue,
	defaultKeyaccountValue,
	organizationId = '',
	bundleHierarchy,
	topPositionOptions = [],
	currentDate = '',
	filterRequestParams = {
		organizationId: '',
		retailerList: [],
		childSuperCategoryList: [],
		childCategoryList: [],
		brandList: [],
		moduleName: '',
		toDate: ''
	},
	filterDropdowns

class ExportFilter extends Component {
	static propTypes = {
		getRetailerMaster: PropTypes.func.isRequired,
		getRetailerMasterResult: PropTypes.object,
		getSuperCategoryMaster: PropTypes.func.isRequired,
		getSuperCategoryMasterResult: PropTypes.object,
		getCategoryMaster: PropTypes.func.isRequired,
		getCategoryMasterResult: PropTypes.object,
		getBrandMaster: PropTypes.func.isRequired,
		getBrandMasterResult: PropTypes.object,
		getKeywordsMaster: PropTypes.func.isRequired,
		getKeywordsMasterResult: PropTypes.object,
		metaDataStructure: PropTypes.object,
		hideDropdown: PropTypes.array,
		singleSelectDropdown: PropTypes.array,
		moduleName: PropTypes.string,
		pageNameForExport: PropTypes.string,
		configureFirstPagePosition: PropTypes.bool,
		//Date logic
		date: PropTypes.string,
		//used for competitor addition in brand dropdown
		isCompetitorBased: PropTypes.bool
	}

	static defaultProps = {
		isPreferredRetailer: true,
		isPreferredSuperCategory: true,
		isPreferredCategory: true,
		isPreferredBrand: true,
		isPreferredKeyword: true,
		isPreferredKeyaccount: true,
		configureFirstPagePosition: true,
		isCompetitorBased: false
	}

	constructor(props) {
		super(props)
		{
			this.state = {
				isSubmitButtonEnabled: true,
				preferredRetailerValue: null,
				displayDropdownList: [],
				singleSelectDropdownList: [],
				dropdownSelection: [],
				enabledDropdownList: [],
				selectedExportFilterValue: exportFilterDataValue,
				exportDropdownOptions: exportFilterDataOption,
				isRetailerApiCalled: false,
				isRetailerLoading: false,
				isSuperCategoryApiCalled: false,
				isSuperCategoryLoading: false,
				isCategoryApiCalled: false,
				isCategoryLoading: false,
				isBrandApiCalled: false,
				isBrandLoading: false,
				isKeywordsApiCalled: false,
				isKeywordsLoading: false,
				hideDropdownListWithFunctionality: []
			}
			this.handleMustSellChange = this.handleMustSellChange.bind(this)
		}
	}

	componentWillMount() {
		const { getFilterDataValue, pageNameForExport, moduleName, date, isCompetitorBased } = this.props
		if (getFilterDataValue && getFilterDataValue.organization) {
			if (getFilterDataValue.organization.defaultoption) {
				bundleHierarchy = JSON.parse(
					getFilterDataValue.organization.defaultoption
						.StaticConstants
				)
				filterDropdowns = JSON.parse(
					getFilterDataValue.organization.defaultoption
						.FilterDropdowns
				)
				organizationId = getFilterDataValue.organization.id
			}
			this.props.metaDataStructure.powerSku = false
		}
		filterRequestParams.organizationId = organizationId
		filterRequestParams.competitorBased = isCompetitorBased
		filterRequestParams.moduleName = moduleName
		filterRequestParams.toDate = moment(date).format(DATE_FORMAT)
		currentDate = date

		//dropdowns configurations
		if (pageNameForExport) {
			this.props.hideDropdown =
				filterDropdowns[
					pageNameForExport
				].export_filter_hide_dropdown.split(', ')
			this.state.hideDropdownListWithFunctionality =
				filterDropdowns[
					pageNameForExport
				].export_filter_hide_dropdown_with_functionality.split(', ')
			this.props.singleSelectDropdown =
				filterDropdowns[
					pageNameForExport
				].export_filter_single_select_dropdown.split(', ')
		}
		this.state.displayDropdownList =
			filterDropdowns.Filters_Enable_Disable_Dropdowns.dropdownList.split(
				', '
			)
		this.state.enabledDropdownList =
			filterDropdowns.Filters_Enable_Disable_Dropdowns.dropdownList.split(
				', '
			)
		this.state.singleSelectDropdownList =
			filterDropdowns.Filters_Enable_Disable_Dropdowns.dropdownSelectionList.split(
				', '
			)
		this.state.dropdownSelection =
			filterDropdowns.Filters_Enable_Disable_Dropdowns.dropdownSelectionList.split(
				', '
			)

		let deselectPrepareValue = extend(
			true,
			this.state.selectedExportFilterValue,
			{}
		)
		deselectPrepareValue = setEmptyArray(deselectPrepareValue, [
			'selectedRetailer',
			'selectedSuperCategory',
			'selectedCategory',
			'selectedBrand',
			'selectedKeyword',
			'selectedPosition',
			'selectedMustsellsku',
			'selectedKeyaccount'
		])
		let deselectOptionList = extend(
			true,
			this.state.exportDropdownOptions,
			{}
		)
		deselectOptionList = setEmptyArray(deselectOptionList, [
			'retailerOption',
			'superCategoryOption',
			'categoryOption',
			'brandOption',
			'keywordOption',
			'positionOption'
		])
		this.setState({
			selectedExportFilterValue: deselectPrepareValue,
			exportDropdownOptions: deselectOptionList
		})
		this.props.getRetailerMaster(filterRequestParams)
		this.setState({ isRetailerApiCalled: true })

		this.prepareInitialRender(getFilterDataValue)
	}

	componentDidUpdate(){ 
		if(null != this.props.date && undefined != this.props.date ){	
			if(currentDate != this.props.date){
				filterRequestParams.toDate = moment(this.props.date).format(DATE_FORMAT)
				this.props.getRetailerMaster(filterRequestParams)
				this.setState({ isRetailerApiCalled: true, isRetailerLoading: false,
					isSuperCategoryLoading: false, isCategoryLoading: false, isBrandLoading: false, isKeywordsLoading: false })
				currentDate = this.props.date
			}
		}
	}

	handleOptionsToEmpty() {
		let deselectOptionList = extend(
			true,
			this.state.exportDropdownOptions,
			{}
		)
		let updateFilterOption = extend(true, deselectOptionList, {})
		return updateFilterOption
	}

	handleSelectedOptionsToEmpty(selectedDropdown) {
		let deselectPrepareValue = extend(
			true,
			this.state.selectedExportFilterValue,
			{}
		)
		deselectPrepareValue = setEmptyArray(deselectPrepareValue, [
			selectedDropdown
		])
		const updatedFilter = extend(true, deselectPrepareValue, {})
		return updatedFilter
	}

	handleRetailerResponse(retailerResponse) {
		const { isPreferredRetailer, getFilterDataValue, moduleName } =
			this.props
		const { singleSelectDropdownList } = this.state

		let retailerMasterList =
			retailerResponse && retailerResponse.length ? retailerResponse : []
		retailerMasterList = removeArrayObjectDuplicates(
			retailerMasterList,
			'id'
		)

		let updateFilterOption = this.handleOptionsToEmpty()
		updateFilterOption.retailerOption = retailerMasterList
		let updatedFilter =
			this.handleSelectedOptionsToEmpty('selectedRetailer')
		let preparedRetailerList = []
		preparedRetailerList = PrepareStructure(
			retailerMasterList,
			'objectName'
		)

		if (
			isPreferredRetailer ||
			!singleSelectDropdownList.includes(bundleHierarchy.retailer)
		) {
			let retailerMasterListWithAllId = requestParamsDropdownOptions(
				[retailerMasterList[0]],
				retailerMasterList
			)
			defaultRetailerValue = retailerMasterListWithAllId
			updatedFilter.selectedRetailer = retailerMasterListWithAllId
			let retailerMasterParamsWithAllId = requestParamsDropdownOptions(
				[preparedRetailerList[0]],
				retailerMasterList
			)
			this.props.metaDataStructure.retailer =
				retailerMasterParamsWithAllId
			//retailer request
			filterRequestParams.retailerList = retailerMasterListWithAllId
		} else {
			defaultRetailerValue = retailerMasterList
			updatedFilter.selectedRetailer = retailerMasterList
			this.props.metaDataStructure.retailer = preparedRetailerList
			//retailer request
			filterRequestParams.retailerList = retailerMasterList
		}

		this.setState({
			selectedExportFilterValue: updatedFilter,
			exportDropdownOptions: updateFilterOption
		})
	}

	handleSuperCategoryResponse(superCategoryResponse) {
		const { isPreferredSuperCategory } = this.props
		const { singleSelectDropdownList } = this.state

		let superCategoryMasterList =
			superCategoryResponse && superCategoryResponse.length
				? superCategoryResponse
				: []
		superCategoryMasterList = removeArrayObjectDuplicates(
			superCategoryMasterList,
			'id'
		)

		let updateFilterOption = this.handleOptionsToEmpty()
		updateFilterOption.superCategoryOption = superCategoryMasterList
		const updatedFilter = this.handleSelectedOptionsToEmpty(
			'selectedSuperCategory'
		)
		let preparedSuperCategoryList = []
		preparedSuperCategoryList = PrepareStructure(
			superCategoryMasterList,
			'objectName'
		)

		if (
			isPreferredSuperCategory ||
			!singleSelectDropdownList.includes(bundleHierarchy.super_category)
		) {
			let superCategoryMasterListWithAllId = requestParamsDropdownOptions(
				[superCategoryMasterList[0]],
				superCategoryMasterList
			)
			defaultSuperCategoryValue = superCategoryMasterListWithAllId
			updatedFilter.selectedSuperCategory =
				superCategoryMasterListWithAllId
			let superCategoryMasterParamsWithAllId =
				requestParamsDropdownOptions(
					[preparedSuperCategoryList[0]],
					superCategoryMasterList
				)
			this.props.metaDataStructure.superCategory =
				superCategoryMasterParamsWithAllId
			//super category request
			filterRequestParams.childSuperCategoryList =
				superCategoryMasterListWithAllId
		} else {
			defaultSuperCategoryValue = superCategoryMasterList
			updatedFilter.selectedSuperCategory = superCategoryMasterList
			this.props.metaDataStructure.superCategory =
				preparedSuperCategoryList
			//super category request
			filterRequestParams.childSuperCategoryList = superCategoryMasterList
		}

		this.setState({
			selectedExportFilterValue: updatedFilter,
			exportDropdownOptions: updateFilterOption
		})
	}

	handleCategoryResponse(categoryResponse) {
		const { isPreferredCategory } = this.props
		const { singleSelectDropdownList } = this.state

		let categoryMasterList =
			categoryResponse && categoryResponse.length ? categoryResponse : []
		categoryMasterList = removeArrayObjectDuplicates(
			categoryMasterList,
			'id'
		)

		let updateFilterOption = this.handleOptionsToEmpty()
		updateFilterOption.categoryOption = categoryMasterList
		const updatedFilter =
			this.handleSelectedOptionsToEmpty('selectedCategory')
		let preparedCategoryList = []
		preparedCategoryList = PrepareStructure(
			categoryMasterList,
			'objectName'
		)

		if (
			isPreferredCategory ||
			!singleSelectDropdownList.includes(bundleHierarchy.category)
		) {
			let categoryMasterListWithAllId = requestParamsDropdownOptions(
				[categoryMasterList[0]],
				categoryMasterList
			)
			defaultCategoryValue = categoryMasterListWithAllId
			updatedFilter.selectedCategory = categoryMasterListWithAllId
			let categoryMasterParamsWithAllId = requestParamsDropdownOptions(
				[preparedCategoryList[0]],
				categoryMasterList
			)
			this.props.metaDataStructure.category =
				categoryMasterParamsWithAllId
			//category request
			filterRequestParams.childCategoryList = categoryMasterListWithAllId
		} else {
			defaultCategoryValue = categoryMasterList
			updatedFilter.selectedCategory = categoryMasterList
			this.props.metaDataStructure.category = preparedCategoryList
			//category request
			filterRequestParams.childCategoryList = categoryMasterList
		}

		this.setState({
			selectedExportFilterValue: updatedFilter,
			exportDropdownOptions: updateFilterOption
		})
	}

	isAllDropDownValuesLoaded = () => {
		const {
			isRetailerLoading,
			isSuperCategoryLoading,
			isCategoryLoading,
			isBrandLoading,
			isKeywordsLoading,
			displayDropdownList
		} = this.state

		let isSubmitButtonEnabled = false
		if (displayDropdownList.includes(bundleHierarchy.retailer))
			isSubmitButtonEnabled = isRetailerLoading
		if (displayDropdownList.includes(bundleHierarchy.super_category))
			isSubmitButtonEnabled = isSuperCategoryLoading
		if (displayDropdownList.includes(bundleHierarchy.category))
			isSubmitButtonEnabled = isCategoryLoading
		if (displayDropdownList.includes(bundleHierarchy.brand))
			isSubmitButtonEnabled = isBrandLoading
		if (displayDropdownList.includes(bundleHierarchy.keyword))
			isSubmitButtonEnabled = isKeywordsLoading
		if (displayDropdownList.includes('keyaccount'))
			this.props.isExportDropDownValuesLoaded(true)
		if (this.state.isSubmitButtonEnabled != isSubmitButtonEnabled) {
			this.props.isExportDropDownValuesLoaded(isSubmitButtonEnabled)
			this.setState({
				isSubmitButtonEnabled: isSubmitButtonEnabled
			})
			return isSubmitButtonEnabled
		}
	}

	handleBrandResponse(brandResponse) {
		const { isPreferredBrand } = this.props
		const { singleSelectDropdownList } = this.state

		let brandMasterList =
			brandResponse && brandResponse.length ? brandResponse : []
		brandMasterList = removeArrayObjectDuplicates(brandMasterList, 'id')

		let updateFilterOption = this.handleOptionsToEmpty()
		updateFilterOption.brandOption = brandMasterList
		const updatedFilter = this.handleSelectedOptionsToEmpty('selectedBrand')
		let preparedBrandList = []
		preparedBrandList = PrepareStructure(brandMasterList, 'objectName')

		if (
			isPreferredBrand ||
			!singleSelectDropdownList.includes(bundleHierarchy.brand)
		) {
			let brandMasterListWithAllId = requestParamsDropdownOptions(
				[brandMasterList[0]],
				brandMasterList
			)
			defaultBrandValue = brandMasterListWithAllId
			updatedFilter.selectedBrand = brandMasterListWithAllId
			let brandMasterParamsWithAllId = requestParamsDropdownOptions(
				[preparedBrandList[0]],
				brandMasterList
			)
			this.props.metaDataStructure.brand = brandMasterParamsWithAllId
			//brand request
			filterRequestParams.brandList = brandMasterListWithAllId
		} else {
			defaultBrandValue = brandMasterList
			updatedFilter.selectedBrand = brandMasterList
			this.props.metaDataStructure.brand = preparedBrandList
			//brand request
			filterRequestParams.brandList = brandMasterList
		}

		this.setState({
			selectedExportFilterValue: updatedFilter,
			exportDropdownOptions: updateFilterOption
		})
	}

	handleKeywordResponse(keywordResponse) {
		const { isPreferredKeyword } = this.props
		const { singleSelectDropdownList } = this.state

		let keywordMasterList =
			keywordResponse && keywordResponse.length ? keywordResponse : []
		keywordMasterList = removeArrayObjectDuplicates(keywordMasterList, 'id')

		let updateFilterOption = this.handleOptionsToEmpty()
		updateFilterOption.keywordOption = keywordMasterList
		const updatedFilter =
			this.handleSelectedOptionsToEmpty('selectedKeyword')
		let preparedKeywordList = []
		preparedKeywordList = PrepareStructure(keywordMasterList, 'objectName')

		if (
			isPreferredKeyword ||
			!singleSelectDropdownList.includes(bundleHierarchy.keyword)
		) {
			let keywordMasterListWithAllId = requestParamsDropdownOptions(
				[keywordMasterList[0]],
				keywordMasterList
			)
			defaultKeywordValue = keywordMasterListWithAllId
			updatedFilter.selectedKeyword = keywordMasterListWithAllId
			let keywordMasterParamsWithAllId = requestParamsDropdownOptions(
				[preparedKeywordList[0]],
				keywordMasterList
			)
			this.props.metaDataStructure.keyword = keywordMasterParamsWithAllId
			//keyword request
			filterRequestParams.keywordList = keywordMasterListWithAllId
		} else {
			defaultKeywordValue = keywordMasterList
			updatedFilter.selectedKeyword = keywordMasterList
			this.props.metaDataStructure.keyword = preparedKeywordList
			//keyword request
			filterRequestParams.keywordList = keywordMasterList
		}

		this.setState({
			selectedExportFilterValue: updatedFilter,
			exportDropdownOptions: updateFilterOption
		})
	}

	componentWillReceiveProps(nextProps) {
		const {
			getRetailerMasterResult,
			getSuperCategoryMasterResult,
			getCategoryMasterResult,
			getBrandMasterResult,
			getKeywordsMasterResult
		} = nextProps
		let {
			displayDropdownList,
			isRetailerApiCalled,
			isSuperCategoryApiCalled,
			isCategoryApiCalled,
			isBrandApiCalled,
			isKeywordsApiCalled
		} = this.state

		//retailer response
		if (displayDropdownList.includes(bundleHierarchy.retailer)) {
			if (
				getRetailerMasterResult &&
				getRetailerMasterResult.content &&
				getRetailerMasterResult.content.data &&
				isRetailerApiCalled
			) {
				this.handleRetailerResponse(
					getRetailerMasterResult.content.data
				)
				if (
					displayDropdownList.includes(bundleHierarchy.super_category)
				) {
					this.props.getSuperCategoryMaster(filterRequestParams)
				}
				this.setState({
					isRetailerApiCalled: false,
					isSuperCategoryApiCalled: true,
					isRetailerLoading: true
				})
			}
		}

		//super category response
		if (displayDropdownList.includes(bundleHierarchy.super_category)) {
			if (
				getSuperCategoryMasterResult &&
				getSuperCategoryMasterResult.content &&
				getSuperCategoryMasterResult.content.data &&
				isSuperCategoryApiCalled
			) {
				this.handleSuperCategoryResponse(
					getSuperCategoryMasterResult.content.data
				)
				if (displayDropdownList.includes(bundleHierarchy.category)) {
					this.props.getCategoryMaster(filterRequestParams)
				}
				this.setState({
					isSuperCategoryApiCalled: false,
					isCategoryApiCalled: true,
					isSuperCategoryLoading: true
				})
			}
		}

		//category response
		if (displayDropdownList.includes(bundleHierarchy.category)) {
			if (
				getCategoryMasterResult &&
				getCategoryMasterResult.content &&
				getCategoryMasterResult.content.data &&
				isCategoryApiCalled
			) {
				this.handleCategoryResponse(
					getCategoryMasterResult.content.data
				)
				if (displayDropdownList.includes(bundleHierarchy.brand)) {
					this.props.getBrandMaster(filterRequestParams)
				}
				this.setState({
					isCategoryApiCalled: false,
					isBrandApiCalled: true,
					isCategoryLoading: true
				})
			}
		}

		//brand response
		if (displayDropdownList.includes(bundleHierarchy.brand)) {
			if (
				getBrandMasterResult &&
				getBrandMasterResult.content &&
				getBrandMasterResult.content.data &&
				isBrandApiCalled
			) {
				this.handleBrandResponse(getBrandMasterResult.content.data)
				if (displayDropdownList.includes(bundleHierarchy.keyword)) {
					this.props.getKeywordsMaster(filterRequestParams)
				}
				this.setState({
					isBrandApiCalled: false,
					isKeywordsApiCalled: true,
					isBrandLoading: true
				})
			}
		}

		//keyword response
		if (displayDropdownList.includes(bundleHierarchy.keyword)) {
			if (
				getKeywordsMasterResult &&
				getKeywordsMasterResult.content &&
				getKeywordsMasterResult.content.data &&
				isKeywordsApiCalled
			) {
				this.handleKeywordResponse(getKeywordsMasterResult.content.data)
				this.setState({
					isKeywordsApiCalled: false,
					isKeywordsLoading: true
				})
			}
		}
	}

	// Initial Load and reset dropdown value and selected value
	prepareInitialRender(getFilterDataValue) {
		const { metaDataStructure, hideDropdown, singleSelectDropdown } =
			this.props
		let {
			enabledDropdownList,
			displayDropdownList,
			dropdownSelection,
			singleSelectDropdownList
		} = this.state

		// check whether dropdown is applicable for module
		if (hideDropdown && hideDropdown !== this.state.enabledDropdownList) {
			displayDropdownList = enabledDropdownList.filter(
				(item) => !hideDropdown.includes(item)
			)
			this.setState({ displayDropdownList })
		}

		// check whether dropdown is single select or multi select
		if (
			singleSelectDropdown &&
			singleSelectDropdown !== this.state.dropdownSelection
		) {
			singleSelectDropdownList = dropdownSelection.filter(
				(item) => !singleSelectDropdown.includes(item)
			)
			this.setState({ singleSelectDropdownList })
		}

		let deselectOptionList = extend(
			true,
			this.state.exportDropdownOptions,
			{}
		)
		let updateFilterOption = extend(true, deselectOptionList, {})
		let deselectPrepareValue = extend(
			true,
			this.state.selectedExportFilterValue,
			{}
		)
		let updatedFilter = extend(true, deselectPrepareValue, {})

		// Setting up initial load of position dropdown
		topPositionOptions = []
		if (
			displayDropdownList.includes(bundleHierarchy.position) &&
			getFilterDataValue &&
			getFilterDataValue.position &&
			getFilterDataValue.position.length
		) {
			let position = []
			getFilterDataValue.position.map((item) => {
				let obj = {
					id: '',
					label: `Top ${item}`,
					value: `Top ${item}`,
					name: `Top ${item}`
				}
				position.push(item)
				topPositionOptions.push(obj)
			})
			if (this.props.configureFirstPagePosition) {
				let firstPageOptions = {
					id: '',
					name: 'First Page',
					label: 'First Page',
					value: 'First Page'
				}
				topPositionOptions.push(firstPageOptions)
			}
			metaDataStructure.selectedPosition = [topPositionOptions[0]]
			updatedFilter.selectedPosition = [topPositionOptions[0]]
			updateFilterOption.positionOption = [topPositionOptions[0]]
		}

		//Keyaccount
		let keyaccountList = []
		getFilterDataValue &&
			getFilterDataValue.keyAccountList &&
			getFilterDataValue.keyAccountList.length &&
			getFilterDataValue.keyAccountList.map((item) => {
				let keyaccountObj = {
					id: item.keyacc_id,
					name: item.keyacc_name,
					label: item.keyacc_name,
					value: item.keyacc_name
				}
				keyaccountList.push(keyaccountObj)
			})

		let keyaccountWithoutDuplicate = []
		keyaccountWithoutDuplicate = removeArrayObjectDuplicates(
			keyaccountList,
			'name'
		)

		updateFilterOption.keyaccountOption = keyaccountWithoutDuplicate
		let keyaccoutParams = PrepareStructure(
			keyaccountWithoutDuplicate,
			'objectName'
		)

		keyaccountWithoutDuplicate.sort(sortArrayOfObjectValues('label'))

		if (
			this.props.isPreferredKeyaccount ||
			!singleSelectDropdownList.includes('keyaccount')
		) {
			defaultKeyaccountValue = [keyaccountWithoutDuplicate[0]]
			updatedFilter.selectedKeyaccount = [keyaccountWithoutDuplicate[0]]
			metaDataStructure.keyaccount = [keyaccoutParams[0]]
		} else {
			defaultKeyaccountValue = keyaccountWithoutDuplicate
			updatedFilter.selectedKeyaccount = keyaccountWithoutDuplicate
			metaDataStructure.keyaccount = keyaccoutParams
		}
		//end

		this.setState({
			selectedExportFilterValue: updatedFilter,
			exportDropdownOptions: updateFilterOption
		})
	}

	//retailer change
	handleRetailerChange = (data, status) => {
		const { metaDataStructure } = this.props
		const { displayDropdownList } = this.state
		const updatedFilter =
			this.handleSelectedOptionsToEmpty('selectedRetailer')
		if (status !== null) {
			updatedFilter.selectedRetailer = data
			filterRequestParams.retailerList = data
			if (displayDropdownList.includes(bundleHierarchy.super_category)) {
				this.props.getSuperCategoryMaster(filterRequestParams)
			}
			this.setState({
				isSuperCategoryApiCalled: true,
				isSuperCategoryLoading: false,
				isCategoryLoading: false,
				isBrandLoading: false,
				isKeywordsLoading: false,
				selectedExportFilterValue: updatedFilter
			})
			metaDataStructure.retailer = PrepareStructure(data, 'objectName')
		}
	}

	//super category change
	handleSuperCategoryChange = (data, status) => {
		const { metaDataStructure } = this.props
		const { displayDropdownList } = this.state
		const updatedFilter = this.handleSelectedOptionsToEmpty(
			'selectedSuperCategory'
		)
		if (status !== null) {
			updatedFilter.selectedSuperCategory = data
			filterRequestParams.childSuperCategoryList = data
			if (displayDropdownList.includes(bundleHierarchy.category)) {
				this.props.getCategoryMaster(filterRequestParams)
			}
			this.setState({
				isCategoryApiCalled: true,
				isCategoryLoading: false,
				isBrandLoading: false,
				isKeywordsLoading: false,
				selectedExportFilterValue: updatedFilter
			})
			metaDataStructure.superCategory = PrepareStructure(
				data,
				'objectName'
			)
		}
	}

	//category change
	handleCategoryChange = (data, status) => {
		const { metaDataStructure } = this.props
		const { displayDropdownList } = this.state
		const updatedFilter =
			this.handleSelectedOptionsToEmpty('selectedCategory')
		if (status !== null) {
			updatedFilter.selectedCategory = data
			filterRequestParams.childCategoryList = data
			if (displayDropdownList.includes(bundleHierarchy.brand)) {
				this.props.getBrandMaster(filterRequestParams)
			}
			this.setState({
				isBrandApiCalled: true,
				isBrandLoading: false,
				isKeywordsLoading: false,
				selectedExportFilterValue: updatedFilter
			})
			metaDataStructure.category = PrepareStructure(data, 'objectName')
		}
	}

	//brand change
	handleBrandChange = (data, status) => {
		const { metaDataStructure } = this.props
		const { displayDropdownList } = this.state
		const updatedFilter = this.handleSelectedOptionsToEmpty('selectedBrand')
		if (status !== null) {
			updatedFilter.selectedBrand = data
			filterRequestParams.brandList = data
			if (displayDropdownList.includes(bundleHierarchy.keyword)) {
				this.props.getKeywordsMaster(filterRequestParams)
			}
			this.setState({
				isKeywordsApiCalled: true,
				isKeywordsLoading: false,
				selectedExportFilterValue: updatedFilter
			})
			metaDataStructure.brand = PrepareStructure(data, 'objectName')
		}
	}

	//keyword change
	handleKeywordChange = (data, status) => {
		const { metaDataStructure } = this.props
		const updatedFilter =
			this.handleSelectedOptionsToEmpty('selectedKeyword')
		if (status !== null) {
			updatedFilter.selectedKeyword = data
			filterRequestParams.keywordList = data
			this.setState({
				selectedExportFilterValue: updatedFilter
			})
			metaDataStructure.keyword = PrepareStructure(data, 'objectName')
		}
	}

	//position change
	handlePositionChange = (data, status) => {
		const { metaDataStructure } = this.props
		const updatedFilter =
			this.handleSelectedOptionsToEmpty('selectedPosition')
		updatedFilter.selectedPosition = status !== null ? status.option : data
		let positionValue = []
		data &&
			data.length &&
			data.map((item) => {
				let splitPosition = item.value && item.value.split('Top ')
				item.value === 'First Page'
					? positionValue.push(item.value)
					: positionValue.push(splitPosition[1])
			})
		metaDataStructure.position = positionValue[0]
		this.setState({
			selectedExportFilterValue: updatedFilter
		})
	}

	handleKeyaccountChange = (data, status) => {
		const { metaDataStructure } = this.props
		const updatedFilter =
			this.handleSelectedOptionsToEmpty('selectedKeyaccount')
		updatedFilter.selectedKeyaccount = data
		metaDataStructure.keyAccountList = updatedFilter.selectedKeyaccount

		this.setState({ selectedExportFilterValue: updatedFilter })
	}

	//must sell change
	handleMustSellChange(mustSell){
		const isChecked = mustSell.target.checked
		let updatedFilter = extend(true, {}, this.state.selectedExportFilterValue)
      updatedFilter.selectedMustsellsku = isChecked
	  this.setState({
		selectedExportFilterValue: updatedFilter,
	 })
		this.props.metaDataStructure.powerSku = isChecked
	 }
  
	renderMustSellDropDown() {
		const { selectedExportFilterValue, enabledDropdownList } = this.state
		let checkboxDisable = 'normal'
		let mustsellValue = selectedExportFilterValue &&
		selectedExportFilterValue.selectedMustsellsku && selectedExportFilterValue.selectedMustsellsku.length == 0 ? false : selectedExportFilterValue.selectedMustsellsku
		return (
			<Col
				lg={4}
				md={2}
				sm={2}
				xs={2}
				xl={4}>
		   <div className="mustSellContainer">
			  <div>
				 <input
					type="checkbox"
					name="optionsRadios"
					id={checkboxDisable}
					className="filterMustSell"
					onChange={this.handleMustSellChange}
					checked={mustsellValue}
					label={bundleHierarchy.filter_Label}
					value="other"
					disabled={
					   !enabledDropdownList.includes(bundleHierarchy.mustsell)
					}
				 />
				 <div className="export-mustsellcheckboxLabel">
					<label for={checkboxDisable} style={{ cursor: 'pointer' }}>
					   {/* {bundleHierarchy.only_power_skus} */}
					   {POWER_SKU}
					</label>
				 </div>
			  </div>
		   </div>
		   </Col>
		)
	 }
  
	renderDropDown(
		options,
		handleChange,
		name,
		preferred,
		defaultValue,
		selectedValue,
		isMultiSelect,
		isMenuOptionLong,
		dynamicClassName,
		isLoading
	) {
		const { enabledDropdownList } = this.state

		return (
			<Col
				lg={4}
				md={2}
				sm={2}
				xs={2}
				xl={4}
				className={dynamicClassName}>
				<p className='export-dropdown-title-style'>{name}:</p>
				<SearchableDropdown
					options={options}
					onChange={handleChange}
					isLoading={isLoading}
					disabled={!enabledDropdownList.includes(name)}
					defaultValuePassed={
						preferred ? defaultValue : selectedValue
					}
					preferredRetailer={
						name == bundleHierarchy.retailer
							? this.state.preferredRetailerValue
							: null
					}
					dropdownName={name}
					value={selectedValue}
					multiselect={isMultiSelect}
					isMenuOptionLong={isMenuOptionLong}
					defalutSelectAll={!preferred ? true : false}
					placeholder={
						isLoading
							? ((selectedValue && selectedValue.length === 0) ||
								(selectedValue &&
									selectedValue[0] === undefined)) &&
							bundleHierarchy.no_option
							: name !== bundleHierarchy._position && 'Loading...'
					}
				/>
			</Col>
		)
	}

	renderKpiLastScrapDate() {
		const { allKpiScrapDate } = this.props
		let columnHeaderNames = [
			{
				dataField: 'id',
				text: '#',
				headerClassName: 'headingStyle-kpiScrapDetailsId',
				isPaddingStyleNotNeeded: true,
				formatter: (cellContent, row) => (
					<div className='kpiScrapDetailCellContent'>
						{cellContent}
					</div>
				)
			},
			{
				dataField: 'kpi',
				text: 'KPI',
				headerClassName: 'headingStyle-kpiScrapDetailsKpi',
				isPaddingStyleNotNeeded: true,
				formatter: (cellContent, row) => (
					<div className='kpiScrapDetailKpiCellContent'>
						{cellContent}
					</div>
				)
			},
			{
				dataField: 'date',
				text: 'As on Date',
				headerClassName: 'headingStyle-kpiScrapDetailsDate',
				isPaddingStyleNotNeeded: true,
				formatter: (cellContent, row) => (
					<div className='kpiScrapDetailCellContent'>
						{cellContent}
					</div>
				)
			}
		]
		let gridData = [
			{
				id: 1,
				kpi: 'Inventory & Pricing',
				date: moment(
					allKpiScrapDate.allModulesLastScrapDate.productinfo
				).format(DISPLAY_DATE_FORMAT)
			},
			{
				id: 2,
				kpi: bundleHierarchy.skoc_and_sos_keyaccount,
				date: moment(
					allKpiScrapDate.allModulesLastScrapDate.productsearch
				).format(DISPLAY_DATE_FORMAT)
			},
			{
				id: 3,
				kpi: 'Content',
				date: moment(
					allKpiScrapDate.allModulesLastScrapDate.productcontent
				).format(DISPLAY_DATE_FORMAT)
			},
			{
				id: 4,
				kpi: 'Rating & Reviews',
				date: moment(
					allKpiScrapDate.allModulesLastScrapDate.productsentiment
				).format(DISPLAY_DATE_FORMAT)
			}
		]
		return (
			<>
				<DataGrid
					columns={columnHeaderNames}
					data={gridData}
					isCardHeader={false}
					pagination={false}
					isSearchBoxPresent={false}
					isExportPresent={false}
					gridLoading={false}
					isGapBetweenCell={false}
					activeRowHeight={33}
				/>
			</>
		)
	}

	renderFilterCard = () => {
		const {
			displayDropdownList,
			singleSelectDropdownList,
			exportDropdownOptions,
			selectedExportFilterValue,
			hideDropdownListWithFunctionality
		} = this.state
		const { metaDataStructure } =
			this.props
		let { getExcelExportDataValue } = this.props

		this.props.getExcelExportDataValue.isExportDropDownValuesLoaded =
			this.isAllDropDownValuesLoaded()
		if (this.props.getExcelExportDataValue.isExportDropDownValuesLoaded) {
			this.props.isExportDropDownValuesLoaded(true)
		}
		let positionOptions = topPositionOptions
		getExcelExportDataValue.getExcelValue = metaDataStructure

		return (
			<div className='export-filter-container'>
				<Card>
					<Card.Body>
						<Row className='dropdownRow'>
							<Col lg={12}>
								{this.state.selectedExportFilterValue && (
									<Row className='filter-container-style'>
										{displayDropdownList.includes(
											'keyaccount'
										) && (
												<div>
													<p className='kpiScrapDetailsTitleStyle'>
														Dates applicable to Report
													</p>
													{this.renderKpiLastScrapDate()}
												</div>
											)}
										{displayDropdownList.includes(
											'keyaccount'
										) &&
											this.renderDropDown(
												exportDropdownOptions.keyaccountOption,
												this.handleKeyaccountChange,
												'keyaccount',
												this.props
													.isPreferredKeyaccount,
												defaultKeyaccountValue,
												selectedExportFilterValue.selectedKeyaccount,
												singleSelectDropdownList.includes(
													'keyaccount'
												),
												false,
												'export-filterDropdownSize',
												this.state.isKeyaccountLoading
											)}
										{displayDropdownList.includes(
											bundleHierarchy.retailer
										) &&
											!hideDropdownListWithFunctionality.includes(
												bundleHierarchy.retailer
											) &&
											this.renderDropDown(
												exportDropdownOptions.retailerOption,
												this.handleRetailerChange,
												bundleHierarchy.retailer,
												this.props.isPreferredRetailer,
												defaultRetailerValue,
												selectedExportFilterValue.selectedRetailer,
												singleSelectDropdownList.includes(
													bundleHierarchy.retailer
												),
												false,
												'export-filterDropdownSize',
												this.state.isRetailerLoading
											)}
										{displayDropdownList.includes(
											bundleHierarchy.super_category
										) &&
											!hideDropdownListWithFunctionality.includes(
												bundleHierarchy.super_category
											) &&
											this.renderDropDown(
												exportDropdownOptions.superCategoryOption,
												this.handleSuperCategoryChange,
												bundleHierarchy.super_category,
												this.props
													.isPreferredSuperCategory,
												defaultSuperCategoryValue,
												selectedExportFilterValue.selectedSuperCategory,
												singleSelectDropdownList.includes(
													bundleHierarchy.super_category
												),
												false,
												'export-filterDropdownSize',
												this.state
													.isSuperCategoryLoading
											)}
										{displayDropdownList.includes(
											bundleHierarchy.category
										) &&
											!hideDropdownListWithFunctionality.includes(
												bundleHierarchy.category
											) &&
											this.renderDropDown(
												exportDropdownOptions.categoryOption,
												this.handleCategoryChange,
												bundleHierarchy.category,
												this.props.isPreferredCategory,
												defaultCategoryValue,
												selectedExportFilterValue.selectedCategory,
												singleSelectDropdownList.includes(
													bundleHierarchy.category
												),
												false,
												'export-filterDropdownSize',
												this.state.isCategoryLoading
											)}
										{displayDropdownList.includes(
											bundleHierarchy.brand
										) &&
											!hideDropdownListWithFunctionality.includes(
												bundleHierarchy.brand
											) &&
											this.renderDropDown(
												exportDropdownOptions.brandOption,
												this.handleBrandChange,
												bundleHierarchy.brand,
												this.props.isPreferredBrand,
												defaultBrandValue,
												selectedExportFilterValue.selectedBrand,
												singleSelectDropdownList.includes(
													bundleHierarchy.brand
												),
												false,
												'export-filterDropdownSize',
												this.state.isBrandLoading
											)}
										{displayDropdownList.includes(
											bundleHierarchy.keyword
										) &&
											!hideDropdownListWithFunctionality.includes(
												bundleHierarchy.keyword
											) &&
											this.renderDropDown(
												exportDropdownOptions.keywordOption,
												this.handleKeywordChange,
												bundleHierarchy.keyword,
												this.props.isPreferredKeyword,
												defaultKeywordValue,
												selectedExportFilterValue.selectedKeyword,
												singleSelectDropdownList.includes(
													bundleHierarchy.keyword
												),
												true,
												'export-filterDropdownSize',
												this.state.isKeywordsLoading
											)}
										{displayDropdownList.includes(
											bundleHierarchy.position
										) &&
											!hideDropdownListWithFunctionality.includes(
												bundleHierarchy.position
											) &&
											this.renderDropDown(
												positionOptions,
												this.handlePositionChange,
												bundleHierarchy.position,
												true,
												[topPositionOptions[0]],
												selectedExportFilterValue.selectedPosition,
												singleSelectDropdownList.includes(
													bundleHierarchy.position
												),
												false,
												'export-filterDropdownSize',
												true,
												true,
												null
											)}
										{displayDropdownList.includes(bundleHierarchy.mustsell) && (
               									<>{this.renderMustSellDropDown()}</>
            							)}
									</Row>
								)}
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</div>
		)
	}

	render() {
		return (
			<div>
				<div>{this.renderFilterCard()}</div>
			</div>
		)
	}
}

export default connect(mapStateToProps, null)(ExportFilter)