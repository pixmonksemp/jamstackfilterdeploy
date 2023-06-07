import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import extend from 'extend'
import moment from 'moment'
import { Button, Card, Col, Overlay, Row } from 'react-bootstrap'
import SearchableDropdown from '../searchable-select/index'
import DatePickerControl from '../../components/date-picker/datePickerController'
import ToastModal from '../../components/modal/ToastModal'
import {
   setEmptyArray,
   filterDataValue,
   filterDataOption,
   removeArrayObjectDuplicates,
   sortArrayOfObjectValues,
   PrepareStructure,
} from './filterdata-constant'
import {
   DATE_FORMAT,
   DISPLAY_DATE_FORMAT,
   ERROR_BG_COLOR,
   TEN_AS_STRING,
   FIRST_PAGE,
   LOGIN_USER_DETAILS,
   KEYWORD_SEARCH,
   PLACE_HOLDER_TEXT,
   SUB_FAMILY_LIST_ALL,
   POWER_SKU,
   FALSE_STRING,
   TRUE_STRING,
   LOADING_TEXT,
} from '../../common/common-constants'
import { requestParamsDropdownOptions } from '../top-menu/util'
import './filter-style.scss'
import { reloadForApiResult } from '../util/common-util'
import SearchBar from '../search-bar'
// import { RangeSlider } from '../../container/shelf-metrics/range-slider/Range-slider'
import ToolTip from '../tooltip/tooltip'

const mapStateToProps = (state) => {
   return {
      retainingData: state.dashboardValue.selectedFiltersforRetainingValues,
      getFilterDataValue: state.stateData.getFilterdata,
      getGlobalFilterSelectedValues:
         state.stateData.getGlobalFilterSelectedValue,
      getUserDetail: state.userDetail.getUsersObj.userCredentials,
   }
}

let defaultRetailerValue,
   initialRender = true,
   defaultSuperCategoryValue,
   defaultChildSuperCategoryValue,
   defaultCategoryValue,
   defaultChildCategoryValue,
   defaultSubCategoryValue,
   defaultChildSubCategoryValue,
   defaultBrandValue,
   defaultSubFamilyValue,
   defaultSubBrandValue,
   defaultKeywordCategoryValue,
   defaultKeywordTypeValue,
   defaultKeywordTagValue,
   defaultKeywordValue,
   defaultSkuValue,
   defaultCitySetValue,
   defaultPincodeSetValue,
   defaultStoreSetValue,
   defaultRetCatValue,
   defaultSearchPosition,
   organizationId = '',
   bundleHierarchy,
   scrapDisplayDate,
   dropdownCount = [],
   topPositionOptions = [],
   cascadingApiSuccessAndReload = {},
   isLoggedIn,
   filterRequestParams = {
      organizationId: '',
      retailerList: [],
      superCategoryList: [],
      childSuperCategoryList: [],
      categoryList: [],
      childCategoryList: [],
      subCategoryList: [],
      childSubCategoryList: [],
      brandList: [],
      subFamilyList: [],
      subBrandList: [],
      keywordCategoryList: [],
      keywordList: [],
      keywordTypeList: [],
      keywordTagList: [],
      city: [],
      pincode: [],
      store: [],
      selectedOption: 'city',
      moduleName: '',
      columnName: '',
   },
   retainingList = {
      retailerList: [],
      retailerOptionList: [],
      superCategoryList: [],
      superCategoryOptionList: [],
      childSuperCategoryList: [],
      childSuperCategoryOptionList: [],
      categoryList: [],
      categoryOptionList: [],
      childCategoryList: [],
      childCategoryOptionList: [],
      subCategoryList: [],
      subCategoryOptionList: [],
      childSubCategoryList: [],
      childSubCategoryOptionList: [],
      brandList: [],
      brandOptionList: [],
      subFamilyList: [],
      subFamilyOptionList: [],
      subBrandList: [],
      subBrandOptionList: [],
      cityList: [],
      cityOptionList: [],
      pincodeList: [],
      pincodeOptionList: [],
      storeList: [],
      storeOptionList: [],
      retailerCategoryList: [],
      retailerCategoryOptionList: [],
      keywordCategoryList: [],
      keywordCategoryOptionList: [],
      keywordList: [],
      keywordOptionList: [],
      keywordTypeList: [],
      keywordTypeOptionList: [],
      keywordTagList: [],
      keywordTagOptionList: [],
      skuList: [],
      skuOptionList: [],
      positionList: [],
      positionOptionList: [],
      powerSku: false,
      displayDate: '',
      keywordSuggestOption: '',
   },
   filterDropdowns,
   dropdownNameList = [],
   dropdownListForEsFilter = [],
   defaultKeywordOption = '',
   isSuperCategoryEnabled,
   listOfNotSelectedDropdown = ''

class Filter extends Component {
   static propTypes = {
      //API Calls
      getRetailerMaster: PropTypes.func.isRequired,
      getRetailerMasterResult: PropTypes.object,
      getSuperCategoryMaster: PropTypes.func.isRequired,
      getSuperCategoryMasterResult: PropTypes.object,
      getChildSuperCategoryMaster: PropTypes.func.isRequired,
      getChildSuperCategoryMasterResult: PropTypes.object,
      getCategoryMaster: PropTypes.func.isRequired,
      getCategoryMasterResult: PropTypes.object,
      getChildCategoryMaster: PropTypes.func.isRequired,
      getChildCategoryMasterResult: PropTypes.object,
      getSubCategoryMaster: PropTypes.func.isRequired,
      getSubCategoryMasterResult: PropTypes.object,
      getChildSubCategoryMaster: PropTypes.func.isRequired,
      getChildSubCategoryMasterResult: PropTypes.object,
      getBrandMaster: PropTypes.func.isRequired,
      getBrandMasterResult: PropTypes.object,
      getSubFamilyMaster: PropTypes.func.isRequired,
      getSubFamilyMasterResult: PropTypes.object,
      getSubBrandMaster: PropTypes.func.isRequired,
      getSubBrandMasterResult: PropTypes.object,
      getKeywordCategoryMaster: PropTypes.func.isRequired,
      getKeywordCategoryMasterResult: PropTypes.object,
      getKeywordsMaster: PropTypes.func.isRequired,
      getKeywordsMasterResult: PropTypes.object,
      getKeywordTypeMaster: PropTypes.func.isRequired,
      getKeywordTypeMasterResult: PropTypes.object,
      getKeywordTagMaster: PropTypes.func.isRequired,
      getKeywordTagMasterResult: PropTypes.object,
      getCityPincodeStoreMaster: PropTypes.func.isRequired,
      getCityPincodeStoreMasterResult: PropTypes.object,
      getRetailerCategoryMaster: PropTypes.func.isRequired,
      getRetailerCategoryMasterResult: PropTypes.object,
      getSkuMaster: PropTypes.func.isRequired,
      getSkuMasterResult: PropTypes.object,
      //Props
      filterCheck: PropTypes.bool,
      metaDataStructure: PropTypes.object,
      handleApplyFilter: PropTypes.func,
      handleCloseFilter: PropTypes.func,
      initialRenderFilter: PropTypes.func,
      disableDropdown: PropTypes.array,
      hideDropdown: PropTypes.array,
      singleSelectDropdown: PropTypes.array,
      defaultSelectedDate: PropTypes.string,
      isRestrictRetailer: PropTypes.bool,
      getScrapDateForAllRetailer: PropTypes.array,
      targetRef: PropTypes.oneOfType([
         PropTypes.string,
         PropTypes.object,
         PropTypes.number,
         PropTypes.array,
      ]),
      placement: PropTypes.oneOf([
         'auto-start',
         'auto',
         'auto-end',
         'top-start',
         'top',
         'top-end',
         'right-start',
         'right',
         'right-end',
         'bottom-end',
         'bottom',
         'bottom-start',
         'left-end',
         'left',
         'left-start',
      ]),
      //CALL FROM ANOTHER PAGE TO RETAIN VALUES
      isInternalNavigation: PropTypes.bool,
      isPreferredRetailerArray: PropTypes.array,
      isPreferredSuperCategoryArray: PropTypes.array,
      isPreferredChildSuperCategoryArray: PropTypes.array,
      isPreferredCategoryArray: PropTypes.array,
      isPreferredChildCategoryArray: PropTypes.array,
      isPreferredSubCategoryArray: PropTypes.array,
      isPreferredChildSubCategoryArray: PropTypes.array,
      //DROPDOWN HIDE IN UI BUT FUNCTIONALITY WILL WORK
      hideDropdownListWithFunctionality: PropTypes.array,
      //FIRST PAGE POSITION
      configureFirstPagePosition: PropTypes.bool,
      //SCRAP DATES
      isShowOnlyScrapDates: PropTypes.bool,
      frequencyScrapDay: PropTypes.string,
      frequencyScrapDates: PropTypes.array,
      //MODULE BASED RETAILERS
      moduleName: PropTypes.string,
      //sku col size is for sku dropdown - if needed
      skuColSize: PropTypes.number,
      //super Category col size is for sku dropdown - if needed
      superCatColSize: PropTypes.number,
      isChangeSuperCatClassName: PropTypes.bool,
      //to skip dropdowns -> dropdown present in this will call particular dropdown api with orgid only, so it will return empt array
      skipDropdown: PropTypes.array,
      //first dropdown of filter => for fixing the classname
      filtersFirstDropdown: PropTypes.string,
      //used for keyword suggestion filter
      isEnableSuggestion: PropTypes.bool,
      keywordValueForFilter: PropTypes.string,
      searchbarClassName: PropTypes.string,
      searchBarHeaderClassName: PropTypes.string,
      inputClassName: PropTypes.string,
      getSuggestionList: PropTypes.string,
      //
      isCompetitorBased: PropTypes.bool,
      isSliderPresent: PropTypes.bool,
      // For Range Slider
      isSliderNeeded: PropTypes.bool,
      //for assert search, pim purpose
      additionalsearchForFilter: PropTypes.func,
      //free hand dropdown, initial values not selected but option will load based on single or multi select
      isFreeHandDropdown: PropTypes.bool,
      //free hand select, this will used to uncheck and check all options
      isFreeHandSelect: PropTypes.bool,
      //toast modal contents
      toastModalTitleContent: PropTypes.string,
      //dummy dropdowns
      listOfDummyDropdowns: PropTypes.array
   }

   static defaultProps = {
      isPreferredRetailer: true,
      isPreferredSuperCategory: true,
      isPreferredChildSuperCategory: true,
      isPreferredCategory: true,
      isPreferredChildCategory: true,
      isPreferredSubCategory: true,
      isPreferredChildSubCategory: true,
      isPreferredBrand: true,
      isPreferredSubFamily: true,
      isPreferredSubBrand: true,
      isPreferredKeywordCategory: true,
      isPreferredKeywordType: true,
      isPreferredKeywordTag: true,
      isPreferredKeyword: true,
      isPreferredSku: true,
      isPreferredCitySet: true,
      isPreferredPincodeSet: true,
      isPreferredStoreSet: true,
      isPreferredRetCat: true,
      filterCheck: false,
      hideDropdownListWithFunctionality: [],
      configureFirstPagePosition: false,
      isShowOnlyScrapDates: false,
      frequencyScrapDay: '',
      frequencyScrapDates: [],
      placement: 'bottom',
      isInternalNavigation: false,
      skipDropdown: [],
      isEnableSuggestion: false,
      searchbarClassName: 'search-brand-icon-extended',
      searchBarHeaderClassName: 'keyword-text-style',
      inputClassName: 'suggestion-search-box',
      isCompetitorBased: false,
      isSliderPresent: false,
      // For Range Slider
      isSliderNeeded: false,
      //free hand dropdown
      isFreeHandDropdown: false,
      isFreeHandSelect: false,
      listOfDummyDropdowns: []
   }

   constructor(props) {
      super(props)
      {
         this.state = {
            displayDropdownList: [],
            singleSelectDropdownList: [],
            dropdownSelection: [],
            enabledDropdownList: [],
            selectedFilterValue: filterDataValue,
            dropdownOptions: filterDataOption,
            initialDateRender: false,
            isDateChange: false,
            applyClicked: false,
            isRetailerStatus: false,
            isApplyClicked: false,
            isKeywordCategoryChangeStatus: false,
            keywordStatus: false,
            retailerRestricted: true,
            isSkuDataAvailable: true,
            isPowerSkuValidation: true,
            isStoreBasedRetailer: false,
            isLocationBasedRetailer: false,
            scrapDateToDisplay: '',
            preferredRetailerValue: null,
            //dropdowns state
            isRetailerApiCalled: false,
            isRetailerLoading: false,
            isSuperCategoryApiCalled: false,
            isSuperCategoryLoading: false,
            isChildSuperCategoryApiCalled: false,
            isChildSuperCategoryLoading: false,
            isCategoryApiCalled: false,
            isCategoryLoading: false,
            isChildCategoryApiCalled: false,
            isChildCategoryLoading: false,
            isSubCategoryApiCalled: false,
            isSubCategoryLoading: false,
            isChildSubCategoryApiCalled: false,
            isChildSubCategoryLoading: false,
            isBrandApiCalled: false,
            isBrandLoading: false,
            isSubFamilyApiCalled: false,
            isSubFamilyLoading: false,
            isSubBrandApiCalled: false,
            isSubBrandLoading: false,
            isKeywordCategoryApiCalled: false,
            isKeywordCategoryLoading: false,
            isKeywordTypeApiCalled: false,
            isKeywordTypeLoading: false,
            isKeywordTagApiCalled: false,
            isKeywordTagLoading: false,
            isKeywordsApiCalled: false,
            isKeywordsLoading: false,
            isCityApiCalled: false,
            isCityLoading: false,
            isPincodeApiCalled: false,
            isPincodeLoading: false,
            isStoreApiCalled: false,
            isStoreLoading: false,
            isRetailerCategoryApiCalled: false,
            isRetailerCategoryLoading: false,
            isSkuApiCalled: false,
            isSkuLoading: false,
            //on change dropdown
            isOnChangeDropDown: false,
            //selected sku is power sku or not
            isPowerSku: true,
            firstDropdown: '',
            //used for keyword suggestion filter
            keywordSuggestionOptions: '',
            resetClicked: false,
            isKeywordTextLoading: true,
            isKeywordSelected: false,
            isValuesSelectedValidation: true,
         }
      }
      this.handleApply = this.handleApply.bind(this)
      this.getRetailerList = this.getRetailerList.bind(this)
      this.handleMustSellChange = this.handleMustSellChange.bind(this)
      this.dateOnChange = this.dateOnChange.bind(this)
   }

   handleEmptyForInitialPageLoad() {
      let deselectPrepareValue = extend(
         true,
         this.state.selectedFilterValue,
         {}
      )
      deselectPrepareValue = setEmptyArray(deselectPrepareValue, [
         'selectedRetailer',
         'selectedSuperCategory',
         'selectedChildSuperCategory',
         'selectedCategory',
         'selectedChildCategory',
         'selectedSubCategory',
         'selectedChildSubCategory',
         'selectedBrand',
         'selectedSubFamily',
         'selectedSubBrand',
         'selectedKeywordCategory',
         'selectedKeywordType',
         'selectedKeywordTag',
         'selectedKeyword',
         'selectedSku',
         'selectedPosition',
         'selectedDisplayDate',
         'selectedMustsellsku',
         'selectedCitySet',
         'selectedPincodeSet',
         'selectedStoreSet',
         'selectedRetailerCategory',
      ])
      let deselectOptionList = extend(true, this.state.dropdownOptions, {})
      deselectOptionList = setEmptyArray(deselectOptionList, [
         'retailerOption',
         'superCategoryOption',
         'childSuperCategoryOption',
         'categoryOption',
         'childCategoryOption',
         'subCategoryOption',
         'childSubCategoryOption',
         'brandOption',
         'subFamilyOption',
         'subBrandOption',
         'keywordCategoryOption',
         'keywordTypeOption',
         'keywordTagOption',
         'keywordOption',
         'skuOption',
         'positionOption',
         'displayDateOption',
         'mustsellskuOption',
         'citySetOption',
         'pincodeSetOption',
         'storeSetOption',
         'retailerCategoryOption',
      ])
      this.setState({
         selectedFilterValue: deselectPrepareValue,
         dropdownOptions: deselectOptionList,
      })
   }

   initializeApiReloadAndSuccess() {
      cascadingApiSuccessAndReload[
         bundleHierarchy.retailer + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.super_category + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.child_super_category + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.category + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.child_category + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.sub_category + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.child_sub_category + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.brand + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.sub_family + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.sub_brand + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.city_set + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.pincode_set + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.store_set + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.retailers_category + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.keyword_type + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.skl_type + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.keyword_tag + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.keyword + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[
         bundleHierarchy.position + 'isApiSuccess'
      ] = true
      cascadingApiSuccessAndReload[bundleHierarchy.sku + 'isApiSuccess'] = true
   }

   componentWillMount() {
      const {
         retainingData,
         getFilterDataValue,
         isPreferredRetailerArray,
         isPreferredSuperCategoryArray,
         isPreferredChildSuperCategoryArray,
         isPreferredCategoryArray,
         isPreferredChildCategoryArray,
         isPreferredSubCategoryArray,
         isPreferredChildSubCategoryArray,
         isInternalNavigation,
         metaDataStructure,
         moduleName,
         singleSelectDropdown,
         hideDropdown,
         hideDropdownListWithFunctionality,
         filtersFirstDropdown,
         defaultSelectedDate,
         isCompetitorBased,
         getUserDetail,
         listOfDummyDropdowns
      } = this.props
      isSuperCategoryEnabled = FALSE_STRING
      if (getFilterDataValue && getFilterDataValue.organization) {
         if (getFilterDataValue.organization.defaultoption) {
            bundleHierarchy = JSON.parse(
               getFilterDataValue.organization.defaultoption.StaticConstants
            )
            filterDropdowns = JSON.parse(
               getFilterDataValue.organization.defaultoption.FilterDropdowns
            )
            defaultSearchPosition = getFilterDataValue.organization
               .defaultoption.DefaultSearchPosition
               ? getFilterDataValue.organization.defaultoption
                    .DefaultSearchPosition
               : TEN_AS_STRING
            organizationId = getFilterDataValue.organization.id
            if (
               getFilterDataValue.organization.defaultoption
                  .isSuperCategoryEnabled
            )
               isSuperCategoryEnabled =
                  getFilterDataValue.organization.defaultoption
                     .isSuperCategoryEnabled
         }
      }
      if (null !== filtersFirstDropdown && undefined !== filtersFirstDropdown)
         this.setState({ firstDropdown: filtersFirstDropdown })
      else this.setState({ firstDropdown: bundleHierarchy.retailer })

      //dropdowns configurations
      dropdownNameList =
         filterDropdowns.Filters_Enable_Disable_Dropdowns.dropdownNameList.split(
            ', '
         )
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

      //getting displaying dropdown only for es filter => for skip logic
      if (
         hideDropdown &&
         hideDropdown !==
            filterDropdowns.Filters_Enable_Disable_Dropdowns.dropdownList.split(
               ', '
            )
      ) {
         dropdownListForEsFilter =
            filterDropdowns.Filters_Enable_Disable_Dropdowns.dropdownList
               .split(', ')
               .filter((item) => !hideDropdown.includes(item))
         dropdownListForEsFilter = dropdownListForEsFilter.filter(
            (item) => !hideDropdownListWithFunctionality.includes(item)
         )
         //hide dropdown for child category, brand and keyword category not skipped
         if (
            hideDropdownListWithFunctionality.includes(
               bundleHierarchy.child_category
            )
         )
            dropdownListForEsFilter.push(bundleHierarchy.child_category)
         if (hideDropdownListWithFunctionality.includes(bundleHierarchy.brand))
            dropdownListForEsFilter.push(bundleHierarchy.brand)
         if (
            hideDropdownListWithFunctionality.includes(
               bundleHierarchy.keyword_type
            )
         )
            dropdownListForEsFilter.push(bundleHierarchy.keyword_type)
      }

      filterRequestParams = {}
      filterRequestParams.organizationId = organizationId
      if (
         retainingData &&
         retainingData.isNavigation &&
         retainingData.applyStatus
      )
         filterRequestParams.toDate = moment(retainingData.dateValue).format(
            DATE_FORMAT
         )
      else
         filterRequestParams.toDate =
            moment(defaultSelectedDate).format(DATE_FORMAT)
      filterRequestParams.columnName = 'filter'
      if (listOfDummyDropdowns && listOfDummyDropdowns.length > 0) {
         listOfDummyDropdowns.map((item) => {
            //remove that dropdown name from dropdownListForEsFilter or filterRequestParams.optionsList
            dropdownListForEsFilter.splice(dropdownListForEsFilter.indexOf(item), 1)
         })
      }
      filterRequestParams.pimOrgId = getUserDetail.organizationid
      filterRequestParams.optionsList = dropdownListForEsFilter
      filterRequestParams.moduleName = moduleName
      filterRequestParams.selectedOption = bundleHierarchy.city
      filterRequestParams.competitorBased = isCompetitorBased
      if (singleSelectDropdown && singleSelectDropdown.length) {
         if (
            singleSelectDropdown.includes(bundleHierarchy.city_set) ||
            singleSelectDropdown.includes(bundleHierarchy.pincode_set) ||
            singleSelectDropdown.includes(bundleHierarchy.store_set)
         ) {
            filterRequestParams.isCPS = true
         } else {
            filterRequestParams.isCPS = false
         }
      }

      //for initial load of all pages - selected filter and options get empty
      this.handleEmptyForInitialPageLoad()

      //initializing cascasding api reload and successs values
      this.initializeApiReloadAndSuccess()

      if (
         /** Initial Page load structure prepare and dropdown values populate**/
         retainingData &&
         !retainingData.applyStatus
      ) {
         retainingData.isNavigation = false
         if (isInternalNavigation) {
            this.handleRetailerTypes(isPreferredRetailerArray)
            filterRequestParams.retailerList = isPreferredRetailerArray
            filterRequestParams.superCategoryList =
               isPreferredSuperCategoryArray
            filterRequestParams.childSuperCategoryList =
               isPreferredChildSuperCategoryArray
            filterRequestParams.categoryList = isPreferredCategoryArray
            filterRequestParams.childCategoryList =
               isPreferredChildCategoryArray
            filterRequestParams.subCategoryList = isPreferredSubCategoryArray
            filterRequestParams.childSubCategoryList =
               isPreferredChildSubCategoryArray
            //based on passed params from page skip dropdown will work - this will work while navigation
            if (
               null !== isPreferredRetailerArray &&
               isPreferredRetailerArray.length > 0
            )
               dropdownListForEsFilter.push(bundleHierarchy.retailer)
            if (
               null !== isPreferredSuperCategoryArray &&
               isPreferredSuperCategoryArray.length > 0
            )
               dropdownListForEsFilter.push(bundleHierarchy.super_category)
            if (
               null !== isPreferredChildSuperCategoryArray &&
               isPreferredChildSuperCategoryArray.length > 0
            )
               dropdownListForEsFilter.push(
                  bundleHierarchy.child_super_category
               )
            if (
               null !== isPreferredCategoryArray &&
               isPreferredCategoryArray.length > 0
            )
               dropdownListForEsFilter.push(bundleHierarchy.category)
            if (
               null !== isPreferredChildCategoryArray &&
               isPreferredChildCategoryArray.length > 0
            )
               dropdownListForEsFilter.push(bundleHierarchy.child_category)
            if (
               null !== isPreferredSubCategoryArray &&
               isPreferredSubCategoryArray.length > 0
            )
               dropdownListForEsFilter.push(bundleHierarchy.sub_category)
            if (
               null !== isPreferredChildSubCategoryArray &&
               isPreferredChildSubCategoryArray.length > 0
            )
               dropdownListForEsFilter.push(bundleHierarchy.child_sub_category)

            filterRequestParams.optionsList = dropdownListForEsFilter
            this.props.getBrandMaster(filterRequestParams)
            this.setState({
               isBrandApiCalled: true,
               isChildSubCategoryLoading: true,
            })
         } else {
            //retailer api call
            this.props.getRetailerMaster(filterRequestParams)
            this.setState({ isRetailerApiCalled: true })
         }

         this.prepareInitialRender(getFilterDataValue, retainingData)

         this.props.initialRenderFilter(
            this.state.selectedFilterValue,
            'initial',
            filterRequestParams.optionsList
         )
      } else {
         /**Module to module Retaining data in Filter dropdown **/
         this.prepareInitialRender(getFilterDataValue, retainingData)

         //retailer api call
         this.props.getRetailerMaster(filterRequestParams)
         this.setState({ isRetailerApiCalled: true })

         let getSelectedValue = extend(true, {}, this.state.selectedFilterValue)
         getSelectedValue.selectedPosition = retainingData.positionNumber
         retainingList.positionList = retainingData.positionNumber
         metaDataStructure.position = retainingData.positionNumber
         getSelectedValue.selectedMustsellsku = retainingData.powerSku
         retainingList.powerSku = retainingData.powerSku
         metaDataStructure.powerSku = retainingData.powerSku
         getSelectedValue.selectedDisplayDate = retainingData.dateValue
         retainingList.displayDate = retainingData.dateValue
         metaDataStructure.toDate = retainingData.dateValue
         metaDataStructure.fromDate = retainingData.dateValue

         let deselectOptionList = extend(true, this.state.dropdownOptions, {})
         let updateFilterOption = extend(true, deselectOptionList, {})
         updateFilterOption.positionOption = retainingData.positionNumber
         retainingList.retailerCategoryOptionList = retainingData.positionNumber
         updateFilterOption.mustsellskuOption = retainingData.powerSku
         updateFilterOption.displayDateOption = retainingData.dateValue

         this.setState({
            selectedFilterValue: getSelectedValue,
            dropdownOptions: updateFilterOption,
         })

         retainingData.resetClicked = false

         this.props.initialRenderFilter(
            getSelectedValue,
            'navigation',
            filterRequestParams.optionsList
         )
      }
      isLoggedIn = JSON.parse(sessionStorage.getItem(LOGIN_USER_DETAILS))
      this.setState({
         closeIconFilter:
            isLoggedIn &&
            isLoggedIn.pimercecdn &&
            isLoggedIn.pimercecdn.pimerce_filter_close_icon,
      })
   }

   handleOptionsToEmpty() {
      let deselectOptionList = extend(true, this.state.dropdownOptions, {})
      let updateFilterOption = extend(true, deselectOptionList, {})
      return updateFilterOption
   }

   handleSelectedOptionsToEmpty(selectedDropdown) {
      let deselectPrepareValue = extend(
         true,
         this.state.selectedFilterValue,
         {}
      )
      deselectPrepareValue = setEmptyArray(deselectPrepareValue, [
         selectedDropdown,
      ])
      const updatedFilter = extend(true, deselectPrepareValue, {})
      return updatedFilter
   }

   //response will be set based on direct page load or navigation
   handleResponseBasedOnLoad(apiResponse, retainingResponse) {
      const { retainingData } = this.props
      let response =
         retainingData && !retainingData.isNavigation
            ? apiResponse
            : retainingResponse
      return response
   }

   handleRetailerTypes(retailerList) {
      const { getFilterDataValue } = this.props
      if (retailerList && retailerList.length) {
         retailerList.map((selectedRetailer) => {
            if (
               getFilterDataValue &&
               getFilterDataValue.retailer &&
               getFilterDataValue.retailer.length
            ) {
               getFilterDataValue.retailer.map((retailerItem) => {
                  if (retailerItem.id === selectedRetailer.id) {
                     if (
                        retailerItem.retailertype === bundleHierarchy.hyperlocal
                     ) {
                        this.setState({
                           isStoreBasedRetailer: true,
                           isLocationBasedRetailer: true,
                        })
                     } else if (
                        retailerItem.retailertype ===
                        bundleHierarchy.onlineretailer
                     ) {
                        this.setState({
                           isStoreBasedRetailer: false,
                           isLocationBasedRetailer: true,
                        })
                     } else {
                        this.setState({
                           isStoreBasedRetailer: false,
                           isLocationBasedRetailer: false,
                        })
                     }
                  }
               })
            }
         })
      }
   }

   handleRetailerResponse(retailerResponse) {
      const {
         isPreferredRetailer,
         getFilterDataValue,
         moduleName,
         retainingData,
         isRestrictRetailer,
      } = this.props
      const { singleSelectDropdownList, displayDropdownList } = this.state

      let moduleBasedRetailerMasterList =
         retailerResponse && retailerResponse.length ? retailerResponse : []
      moduleBasedRetailerMasterList = removeArrayObjectDuplicates(
         moduleBasedRetailerMasterList,
         'id'
      )

      //sorting and adding preferred retailer in first index of array using unshift
      if (
         moduleBasedRetailerMasterList &&
         moduleBasedRetailerMasterList.length
      ) {
         moduleBasedRetailerMasterList.sort(sortArrayOfObjectValues('label'))
         let preferredRetailerObject
         if (getFilterDataValue && getFilterDataValue.organization) {
            moduleBasedRetailerMasterList.map((retailerItem) => {
               if (
                  getFilterDataValue.organization.preferredretailer ===
                  retailerItem.id
               ) {
                  preferredRetailerObject = retailerItem
               }
            })
         }
         if (preferredRetailerObject) {
            moduleBasedRetailerMasterList.unshift(preferredRetailerObject)
            moduleBasedRetailerMasterList = removeArrayObjectDuplicates(
               moduleBasedRetailerMasterList,
               'id'
            )
         }
      }

      if (
         displayDropdownList.includes(bundleHierarchy.city_set) ||
         displayDropdownList.includes(bundleHierarchy.pincode_set) ||
         displayDropdownList.includes(bundleHierarchy.store_set)
      ) {
         this.handleRetailerTypes(
            isPreferredRetailer ||
               !singleSelectDropdownList.includes(bundleHierarchy.retailer)
               ? moduleBasedRetailerMasterList &&
                 moduleBasedRetailerMasterList.length
                  ? [moduleBasedRetailerMasterList[0]]
                  : []
               : moduleBasedRetailerMasterList
         )
      }

      let updateFilterOption = this.handleOptionsToEmpty()
      updateFilterOption.retailerOption = moduleBasedRetailerMasterList
      let updatedFilter = this.handleSelectedOptionsToEmpty('selectedRetailer')
      let preparedRetailerList = []
      preparedRetailerList = PrepareStructure(
         moduleBasedRetailerMasterList,
         'objectName'
      )

      if (
         isPreferredRetailer ||
         !singleSelectDropdownList.includes(bundleHierarchy.retailer)
      ) {
         let retailerMasterListWithAllId = requestParamsDropdownOptions(
            [moduleBasedRetailerMasterList[0]],
            moduleBasedRetailerMasterList
         )
         defaultRetailerValue = retailerMasterListWithAllId
         updatedFilter.selectedRetailer =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    retailerMasterListWithAllId,
                    retainingData.retailerName
                 )
         let retailerMasterParamsWithAllId = requestParamsDropdownOptions(
            [preparedRetailerList[0]],
            moduleBasedRetailerMasterList
         )
         this.props.metaDataStructure.retailer = this.handleResponseBasedOnLoad(
            retailerMasterParamsWithAllId,
            retainingData.retailerName
         )
         //retailer request
         filterRequestParams.retailerList = this.handleResponseBasedOnLoad(
            retailerMasterListWithAllId,
            retainingData.retailerName
         )
      } else {
         defaultRetailerValue = moduleBasedRetailerMasterList
         updatedFilter.selectedRetailer =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    isRestrictRetailer &&
                       moduleBasedRetailerMasterList &&
                       moduleBasedRetailerMasterList.length &&
                       moduleBasedRetailerMasterList.length > 5
                       ? moduleBasedRetailerMasterList.slice(0, 5)
                       : moduleBasedRetailerMasterList,
                    isRestrictRetailer &&
                       retainingData.retailerName &&
                       retainingData.retailerName.length &&
                       retainingData.retailerName.length > 5
                       ? retainingData.retailerName.slice(0, 5)
                       : retainingData.retailerName
                 )
         this.props.metaDataStructure.retailer = this.handleResponseBasedOnLoad(
            isRestrictRetailer &&
               moduleBasedRetailerMasterList &&
               moduleBasedRetailerMasterList.length &&
               moduleBasedRetailerMasterList.length > 5
               ? preparedRetailerList.slice(0, 5)
               : preparedRetailerList,
            isRestrictRetailer &&
               retainingData.retailerName &&
               retainingData.retailerName.length &&
               retainingData.retailerName.length > 5
               ? retainingData.retailerName.slice(0, 5)
               : retainingData.retailerName
         )
         //retailer request
         filterRequestParams.retailerList = this.handleResponseBasedOnLoad(
            moduleBasedRetailerMasterList,
            retainingData.retailerName
         )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.retailerList = currentFilterValues.selectedRetailer
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.retailerOptionList = currentFilterOptions.retailerOption
      }

      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleSuperCategoryResponse(superCategoryResponse) {
      const { isPreferredSuperCategory, retainingData } = this.props
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
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    superCategoryMasterListWithAllId,
                    retainingData.superCategoryName
                 )
         let superCategoryMasterParamsWithAllId = requestParamsDropdownOptions(
            [preparedSuperCategoryList[0]],
            superCategoryMasterList
         )
         this.props.metaDataStructure.superCategory =
            this.handleResponseBasedOnLoad(
               superCategoryMasterParamsWithAllId,
               retainingData.superCategoryName
            )
         //super category request
         filterRequestParams.superCategoryList = this.handleResponseBasedOnLoad(
            superCategoryMasterListWithAllId,
            retainingData.superCategoryName
         )
      } else {
         defaultSuperCategoryValue = superCategoryMasterList
         updatedFilter.selectedSuperCategory =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    superCategoryMasterList,
                    retainingData.superCategoryName
                 )
         this.props.metaDataStructure.superCategory =
            this.handleResponseBasedOnLoad(
               preparedSuperCategoryList,
               retainingData.superCategoryName
            )
         //super category request
         filterRequestParams.superCategoryList = this.handleResponseBasedOnLoad(
            superCategoryMasterList,
            retainingData.superCategoryName
         )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.superCategoryList =
            currentFilterValues.selectedSuperCategory
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.superCategoryOptionList =
            currentFilterOptions.superCategoryOption
      }

      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleChildSuperCategoryResponse(childSuperCategoryResponse) {
      const {
         isPreferredChildSuperCategory,
         retainingData,
         getGlobalFilterSelectedValues,
      } = this.props
      const { singleSelectDropdownList } = this.state

      let childSuperCategoryMasterList =
         childSuperCategoryResponse && childSuperCategoryResponse.length
            ? childSuperCategoryResponse
            : []
      childSuperCategoryMasterList = removeArrayObjectDuplicates(
         childSuperCategoryMasterList,
         'id'
      )

      let updateFilterOption = this.handleOptionsToEmpty()
      updateFilterOption.childSuperCategoryOption = childSuperCategoryMasterList
      const updatedFilter = this.handleSelectedOptionsToEmpty(
         'selectedChildSuperCategory'
      )
      let preparedChildSuperCategoryList = []
      preparedChildSuperCategoryList = PrepareStructure(
         childSuperCategoryMasterList,
         'objectName'
      )

      let selectedSuperCategoryListInDashboard =
         getGlobalFilterSelectedValues &&
         getGlobalFilterSelectedValues.selectedSuperCategoryIdValue &&
         getGlobalFilterSelectedValues.selectedSuperCategoryIdValue.length &&
         getGlobalFilterSelectedValues.selectedSuperCategoryIdValue[0] !==
            undefined
            ? [getGlobalFilterSelectedValues.selectedSuperCategoryIdValue[0]]
            : []

      if (
         isPreferredChildSuperCategory ||
         !singleSelectDropdownList.includes(
            bundleHierarchy.child_super_category
         )
      ) {
         let childSuperCategoryMasterListWithAllId =
            requestParamsDropdownOptions(
               [childSuperCategoryMasterList[0]],
               childSuperCategoryMasterList
            )
         defaultChildSuperCategoryValue = childSuperCategoryMasterListWithAllId
         updatedFilter.selectedChildSuperCategory =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    selectedSuperCategoryListInDashboard &&
                       selectedSuperCategoryListInDashboard.length
                       ? childSuperCategoryMasterListWithAllId &&
                         childSuperCategoryMasterListWithAllId.length
                          ? selectedSuperCategoryListInDashboard
                          : []
                       : childSuperCategoryMasterListWithAllId,
                    retainingData.childSuperCategoryName
                 )
         let childSuperCategoryMasterParamsWithAllId =
            requestParamsDropdownOptions(
               [preparedChildSuperCategoryList[0]],
               childSuperCategoryMasterList
            )
         this.props.metaDataStructure.childSuperCategory =
            this.handleResponseBasedOnLoad(
               selectedSuperCategoryListInDashboard &&
                  selectedSuperCategoryListInDashboard.length
                  ? childSuperCategoryMasterParamsWithAllId &&
                    childSuperCategoryMasterParamsWithAllId.length
                     ? selectedSuperCategoryListInDashboard
                     : []
                  : childSuperCategoryMasterParamsWithAllId,
               retainingData.childSuperCategoryName
            )
         //child super category request
         filterRequestParams.childSuperCategoryList =
            this.handleResponseBasedOnLoad(
               selectedSuperCategoryListInDashboard &&
                  selectedSuperCategoryListInDashboard.length
                  ? childSuperCategoryMasterListWithAllId &&
                    childSuperCategoryMasterListWithAllId.length
                     ? selectedSuperCategoryListInDashboard
                     : []
                  : childSuperCategoryMasterListWithAllId,
               retainingData.childSuperCategoryName
            )
      } else {
         defaultChildSuperCategoryValue = childSuperCategoryMasterList
         updatedFilter.selectedChildSuperCategory =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    selectedSuperCategoryListInDashboard &&
                       selectedSuperCategoryListInDashboard.length
                       ? childSuperCategoryMasterList &&
                         childSuperCategoryMasterList.length
                          ? selectedSuperCategoryListInDashboard
                          : []
                       : childSuperCategoryMasterList,
                    retainingData.childSuperCategoryName
                 )
         this.props.metaDataStructure.childSuperCategory =
            this.handleResponseBasedOnLoad(
               selectedSuperCategoryListInDashboard &&
                  selectedSuperCategoryListInDashboard.length
                  ? preparedChildSuperCategoryList &&
                    preparedChildSuperCategoryList.length
                     ? selectedSuperCategoryListInDashboard
                     : []
                  : preparedChildSuperCategoryList,
               retainingData.childSuperCategoryName
            )
         //child super category request
         filterRequestParams.childSuperCategoryList =
            this.handleResponseBasedOnLoad(
               selectedSuperCategoryListInDashboard &&
                  selectedSuperCategoryListInDashboard.length
                  ? childSuperCategoryMasterList &&
                    childSuperCategoryMasterList.length
                     ? selectedSuperCategoryListInDashboard
                     : []
                  : childSuperCategoryMasterList,
               retainingData.childSuperCategoryName
            )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.childSuperCategoryList =
            currentFilterValues.selectedChildSuperCategory
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.childSuperCategoryOptionList =
            currentFilterOptions.childSuperCategoryOption
      }

      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleCategoryResponse(categoryResponse) {
      const { isPreferredCategory, retainingData } = this.props
      const { singleSelectDropdownList } = this.state

      let categoryMasterList =
         categoryResponse && categoryResponse.length ? categoryResponse : []
      categoryMasterList = removeArrayObjectDuplicates(categoryMasterList, 'id')

      let updateFilterOption = this.handleOptionsToEmpty()
      updateFilterOption.categoryOption = categoryMasterList
      const updatedFilter =
         this.handleSelectedOptionsToEmpty('selectedCategory')
      let preparedCategoryList = []
      preparedCategoryList = PrepareStructure(categoryMasterList, 'objectName')

      if (
         isPreferredCategory ||
         !singleSelectDropdownList.includes(bundleHierarchy.category)
      ) {
         let categoryMasterListWithAllId = requestParamsDropdownOptions(
            [categoryMasterList[0]],
            categoryMasterList
         )
         defaultCategoryValue = categoryMasterListWithAllId
         updatedFilter.selectedCategory =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    categoryMasterListWithAllId,
                    retainingData.categoryName
                 )
         let categoryMasterParamsWithAllId = requestParamsDropdownOptions(
            [preparedCategoryList[0]],
            categoryMasterList
         )
         this.props.metaDataStructure.category = this.handleResponseBasedOnLoad(
            categoryMasterParamsWithAllId,
            retainingData.categoryName
         )
         //category request
         filterRequestParams.categoryList = this.handleResponseBasedOnLoad(
            categoryMasterListWithAllId,
            retainingData.categoryName
         )
      } else {
         defaultCategoryValue = categoryMasterList
         updatedFilter.selectedCategory =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    categoryMasterList,
                    retainingData.categoryName
                 )
         this.props.metaDataStructure.category = this.handleResponseBasedOnLoad(
            preparedCategoryList,
            retainingData.categoryName
         )
         //category request
         filterRequestParams.categoryList = this.handleResponseBasedOnLoad(
            categoryMasterList,
            retainingData.categoryName
         )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.categoryList = currentFilterValues.selectedCategory
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.categoryOptionList = currentFilterOptions.categoryOption
      }

      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleChildCategoryResponse(childCategoryResponse) {
      const { isPreferredChildCategory, retainingData } = this.props
      const { singleSelectDropdownList } = this.state

      let childCategoryMasterList =
         childCategoryResponse && childCategoryResponse.length
            ? childCategoryResponse
            : []
      childCategoryMasterList = removeArrayObjectDuplicates(
         childCategoryMasterList,
         'id'
      )

      let updateFilterOption = this.handleOptionsToEmpty()
      updateFilterOption.childCategoryOption = childCategoryMasterList
      const updatedFilter = this.handleSelectedOptionsToEmpty(
         'selectedChildCategory'
      )
      let preparedChildCategoryList = []
      preparedChildCategoryList = PrepareStructure(
         childCategoryMasterList,
         'objectName'
      )

      if (
         isPreferredChildCategory ||
         !singleSelectDropdownList.includes(bundleHierarchy.child_category)
      ) {
         let childCategoryMasterListWithAllId = requestParamsDropdownOptions(
            [childCategoryMasterList[0]],
            childCategoryMasterList
         )
         defaultChildCategoryValue = childCategoryMasterListWithAllId
         updatedFilter.selectedChildCategory =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    childCategoryMasterListWithAllId,
                    retainingData.childCategoryName
                 )
         let childCategoryMasterParamsWithAllId = requestParamsDropdownOptions(
            [preparedChildCategoryList[0]],
            childCategoryMasterList
         )
         this.props.metaDataStructure.childCategory =
            this.handleResponseBasedOnLoad(
               childCategoryMasterParamsWithAllId,
               retainingData.childCategoryName
            )
         //child category request
         filterRequestParams.childCategoryList = this.handleResponseBasedOnLoad(
            childCategoryMasterListWithAllId,
            retainingData.childCategoryName
         )
      } else {
         defaultChildCategoryValue = childCategoryMasterList
         updatedFilter.selectedChildCategory =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    childCategoryMasterList,
                    retainingData.childCategoryName
                 )
         this.props.metaDataStructure.childCategory =
            this.handleResponseBasedOnLoad(
               preparedChildCategoryList,
               retainingData.childCategoryName
            )
         //child category request
         filterRequestParams.childCategoryList = this.handleResponseBasedOnLoad(
            childCategoryMasterList,
            retainingData.childCategoryName
         )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.childCategoryList =
            currentFilterValues.selectedChildCategory
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.childCategoryOptionList =
            currentFilterOptions.childCategoryOption
      }

      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleSubCategoryResponse(subCategoryResponse) {
      const { isPreferredSubCategory, retainingData } = this.props
      const { singleSelectDropdownList } = this.state

      let subCategoryMasterList =
         subCategoryResponse && subCategoryResponse.length
            ? subCategoryResponse
            : []
      subCategoryMasterList = removeArrayObjectDuplicates(
         subCategoryMasterList,
         'id'
      )

      let updateFilterOption = this.handleOptionsToEmpty()
      updateFilterOption.subCategoryOption = subCategoryMasterList
      const updatedFilter = this.handleSelectedOptionsToEmpty(
         'selectedSubCategory'
      )
      let preparedSubCategoryList = []
      preparedSubCategoryList = PrepareStructure(
         subCategoryMasterList,
         'objectName'
      )

      if (
         isPreferredSubCategory ||
         !singleSelectDropdownList.includes(bundleHierarchy.sub_category)
      ) {
         let subCategoryMasterListWithAllId = requestParamsDropdownOptions(
            [subCategoryMasterList[0]],
            subCategoryMasterList
         )
         defaultSubCategoryValue = subCategoryMasterListWithAllId
         updatedFilter.selectedSubCategory =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    subCategoryMasterListWithAllId,
                    retainingData.subCategoryName
                 )
         let subCategoryMasterParamsWithAllId = requestParamsDropdownOptions(
            [preparedSubCategoryList[0]],
            subCategoryMasterList
         )
         this.props.metaDataStructure.subCategory =
            this.handleResponseBasedOnLoad(
               subCategoryMasterParamsWithAllId,
               retainingData.subCategoryName
            )
         //sub category request
         filterRequestParams.subCategoryList = this.handleResponseBasedOnLoad(
            subCategoryMasterListWithAllId,
            retainingData.subCategoryName
         )
      } else {
         defaultSubCategoryValue = subCategoryMasterList
         updatedFilter.selectedSubCategory =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    subCategoryMasterList,
                    retainingData.subCategoryName
                 )
         this.props.metaDataStructure.subCategory =
            this.handleResponseBasedOnLoad(
               preparedSubCategoryList,
               retainingData.subCategoryName
            )
         //sub category request
         filterRequestParams.subCategoryList = this.handleResponseBasedOnLoad(
            subCategoryMasterList,
            retainingData.subCategoryName
         )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.subCategoryList = currentFilterValues.selectedSubCategory
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.subCategoryOptionList =
            currentFilterOptions.subCategoryOption
      }

      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleChildSubCategoryResponse(childSubCategoryResponse) {
      const { isPreferredChildSubCategory, retainingData } = this.props
      const { singleSelectDropdownList } = this.state

      let childSubCategoryMasterList =
         childSubCategoryResponse && childSubCategoryResponse.length
            ? childSubCategoryResponse
            : []
      childSubCategoryMasterList = removeArrayObjectDuplicates(
         childSubCategoryMasterList,
         'id'
      )

      let updateFilterOption = this.handleOptionsToEmpty()
      updateFilterOption.childSubCategoryOption = childSubCategoryMasterList
      const updatedFilter = this.handleSelectedOptionsToEmpty(
         'selectedChildSubCategory'
      )
      let preparedChildSubCategoryList = []
      preparedChildSubCategoryList = PrepareStructure(
         childSubCategoryMasterList,
         'objectName'
      )

      if (
         isPreferredChildSubCategory ||
         !singleSelectDropdownList.includes(bundleHierarchy.child_sub_category)
      ) {
         let childSubCategoryMasterListWithAllId = requestParamsDropdownOptions(
            [childSubCategoryMasterList[0]],
            childSubCategoryMasterList
         )
         defaultChildSubCategoryValue = childSubCategoryMasterListWithAllId
         updatedFilter.selectedChildSubCategory =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    childSubCategoryMasterListWithAllId,
                    retainingData.childSubCategoryName
                 )
         let childSubCategoryMasterParamsWithAllId =
            requestParamsDropdownOptions(
               [preparedChildSubCategoryList[0]],
               childSubCategoryMasterList
            )
         this.props.metaDataStructure.childSubCategory =
            this.handleResponseBasedOnLoad(
               childSubCategoryMasterParamsWithAllId,
               retainingData.childSubCategoryName
            )
         //child sub category request
         filterRequestParams.childSubCategoryList =
            this.handleResponseBasedOnLoad(
               childSubCategoryMasterListWithAllId,
               retainingData.childSubCategoryName
            )
      } else {
         defaultChildSubCategoryValue = childSubCategoryMasterList
         updatedFilter.selectedChildSubCategory =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    childSubCategoryMasterList,
                    retainingData.childSubCategoryName
                 )
         this.props.metaDataStructure.childSubCategory =
            this.handleResponseBasedOnLoad(
               preparedChildSubCategoryList,
               retainingData.childSubCategoryName
            )
         //child sub category request
         filterRequestParams.childSubCategoryList =
            this.handleResponseBasedOnLoad(
               childSubCategoryMasterList,
               retainingData.childSubCategoryName
            )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.childSubCategoryList =
            currentFilterValues.selectedChildSubCategory
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.childSubCategoryOptionList =
            currentFilterOptions.childSubCategoryOption
      }

      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleBrandResponse(brandResponse) {
      const { isPreferredBrand, retainingData } = this.props
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
         updatedFilter.selectedBrand =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    brandMasterListWithAllId,
                    retainingData.brandName
                 )
         let brandMasterParamsWithAllId = requestParamsDropdownOptions(
            [preparedBrandList[0]],
            brandMasterList
         )
         this.props.metaDataStructure.brand = this.handleResponseBasedOnLoad(
            brandMasterParamsWithAllId,
            retainingData.brandName
         )
         //brand request
         filterRequestParams.brandList = this.handleResponseBasedOnLoad(
            brandMasterListWithAllId,
            retainingData.brandName
         )
      } else {
         defaultBrandValue = brandMasterList
         updatedFilter.selectedBrand =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    brandMasterList,
                    retainingData.brandName
                 )
         this.props.metaDataStructure.brand = this.handleResponseBasedOnLoad(
            preparedBrandList,
            retainingData.brandName
         )
         //brand request
         filterRequestParams.brandList = this.handleResponseBasedOnLoad(
            brandMasterList,
            retainingData.brandName
         )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.brandList = currentFilterValues.selectedBrand
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.brandOptionList = currentFilterOptions.brandOption
      }

      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleSubFamilyResponse(subFamilyResponse) {
      const { isPreferredSubFamily, moduleName, retainingData } = this.props
      const { singleSelectDropdownList } = this.state

      let subFamilyMasterList =
         subFamilyResponse && subFamilyResponse.length ? subFamilyResponse : []
      subFamilyMasterList = removeArrayObjectDuplicates(
         subFamilyMasterList,
         'id'
      )

      // only for search - hiding product type because of keywords,
      // so product type values are hardcoded.
      // in future it will be enable.
      if (
         moduleName === bundleHierarchy.search_insights ||
         moduleName === bundleHierarchy.sops_module ||
         moduleName === bundleHierarchy.sokc
      ) {
         subFamilyMasterList = subFamilyMasterList.concat(SUB_FAMILY_LIST_ALL)
      }

      let updateFilterOption = this.handleOptionsToEmpty()
      updateFilterOption.subFamilyOption = subFamilyMasterList
      const updatedFilter =
         this.handleSelectedOptionsToEmpty('selectedSubFamily')
      let preparedSubFamilyList = []
      preparedSubFamilyList = PrepareStructure(
         subFamilyMasterList,
         'objectName'
      )

      if (
         isPreferredSubFamily ||
         !singleSelectDropdownList.includes(bundleHierarchy.sub_family)
      ) {
         let subFamilyMasterListWithAllId = requestParamsDropdownOptions(
            [subFamilyMasterList[0]],
            subFamilyMasterList
         )
         defaultSubFamilyValue = subFamilyMasterListWithAllId
         updatedFilter.selectedSubFamily =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    subFamilyMasterListWithAllId,
                    retainingData.subFamilyName
                 )
         let subFamilyMasterParamsWithAllId = requestParamsDropdownOptions(
            [preparedSubFamilyList[0]],
            subFamilyMasterList
         )
         this.props.metaDataStructure.subFamily =
            this.handleResponseBasedOnLoad(
               subFamilyMasterParamsWithAllId,
               retainingData.subFamilyName
            )
         //sub family request
         filterRequestParams.subFamilyList =
            moduleName === bundleHierarchy.search_insights ||
            moduleName === bundleHierarchy.sops_module ||
            moduleName === bundleHierarchy.sokc
               ? this.handleResponseBasedOnLoad(
                    subFamilyMasterListWithAllId,
                    retainingData.subFamilyName
                 ).concat(subFamilyMasterListWithAllId)
               : this.handleResponseBasedOnLoad(
                    subFamilyMasterListWithAllId,
                    retainingData.subFamilyName
                 )
      } else {
         defaultSubFamilyValue = subFamilyMasterList
         updatedFilter.selectedSubFamily =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    subFamilyMasterList,
                    retainingData.subFamilyName
                 )
         this.props.metaDataStructure.subFamily =
            this.handleResponseBasedOnLoad(
               preparedSubFamilyList,
               retainingData.subFamilyName
            )
         //sub family request
         filterRequestParams.subFamilyList =
            moduleName === bundleHierarchy.search_insights ||
            moduleName === bundleHierarchy.sops_module ||
            moduleName === bundleHierarchy.sokc
               ? this.handleResponseBasedOnLoad(
                    subFamilyMasterList,
                    retainingData.subFamilyName
                 ).concat(subFamilyMasterList)
               : this.handleResponseBasedOnLoad(
                    subFamilyMasterList,
                    retainingData.subFamilyName
                 )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.subFamilyList = currentFilterValues.selectedSubFamily
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.subFamilyOptionList =
            currentFilterOptions.subFamilyOption
      }

      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleSubBrandResponse(subBrandResponse) {
      const { isPreferredSubBrand, retainingData } = this.props
      const { singleSelectDropdownList } = this.state

      let subBrandMasterList =
         subBrandResponse && subBrandResponse.length ? subBrandResponse : []
      subBrandMasterList = removeArrayObjectDuplicates(subBrandMasterList, 'id')

      let updateFilterOption = this.handleOptionsToEmpty()
      updateFilterOption.subBrandOption = subBrandMasterList
      const updatedFilter = this.handleSelectedOptionsToEmpty('selectedKeyword')
      let preparedSubBrandList = []
      preparedSubBrandList = PrepareStructure(subBrandMasterList, 'objectName')

      if (
         isPreferredSubBrand ||
         !singleSelectDropdownList.includes(bundleHierarchy.sub_brand)
      ) {
         let subBrandMasterListWithAllId = requestParamsDropdownOptions(
            [subBrandMasterList[0]],
            subBrandMasterList
         )
         defaultSubBrandValue = subBrandMasterListWithAllId
         updatedFilter.selectedSubBrand =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    subBrandMasterListWithAllId,
                    retainingData.subBrandName
                 )
         let subBrandMasterParamsWithAllId = requestParamsDropdownOptions(
            [preparedSubBrandList[0]],
            subBrandMasterList
         )
         this.props.metaDataStructure.subBrand = this.handleResponseBasedOnLoad(
            subBrandMasterParamsWithAllId,
            retainingData.subBrandName
         )
         //su brand request
         filterRequestParams.subBrandList = this.handleResponseBasedOnLoad(
            subBrandMasterParamsWithAllId,
            retainingData.subBrandName
         )
      } else {
         defaultSubBrandValue = subBrandMasterList
         updatedFilter.selectedSubBrand =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    subBrandMasterList,
                    retainingData.subBrandName
                 )
         this.props.metaDataStructure.subBrand = this.handleResponseBasedOnLoad(
            preparedSubBrandList,
            retainingData.subBrandName
         )
         //sub brand request
         filterRequestParams.subBrandList = this.handleResponseBasedOnLoad(
            subBrandMasterList,
            retainingData.subBrandName
         )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.subBrandList = currentFilterValues.selectedSubBrand
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.subBrandOptionList = currentFilterOptions.subBrandOption
      }

      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleKeywordCategoryResponse(keywordCategoryResponse) {
      const { isPreferredKeywordCategory, retainingData } = this.props
      const { singleSelectDropdownList } = this.state

      let keywordCategoryMasterList =
         keywordCategoryResponse && keywordCategoryResponse.length
            ? keywordCategoryResponse
            : []
      keywordCategoryMasterList = removeArrayObjectDuplicates(
         keywordCategoryMasterList,
         'id'
      )

      let updateFilterOption = this.handleOptionsToEmpty()
      updateFilterOption.keywordCategoryOption = keywordCategoryMasterList
      let updatedFilter = this.handleSelectedOptionsToEmpty(
         'selectedKeywordCategory'
      )
      let preparedKeywordCategoryList = []
      preparedKeywordCategoryList = PrepareStructure(
         keywordCategoryMasterList,
         'objectName'
      )

      if (
         isPreferredKeywordCategory ||
         !singleSelectDropdownList.includes(bundleHierarchy.keyword_type)
      ) {
         let keywordCategoryMasterListWithAllId = requestParamsDropdownOptions(
            [keywordCategoryMasterList[0]],
            keywordCategoryMasterList
         )
         defaultKeywordCategoryValue = keywordCategoryMasterListWithAllId
         updatedFilter.selectedKeywordCategory =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    keywordCategoryMasterListWithAllId,
                    retainingData.keywordCategoryName
                 )
         let keywordCategoryMasterParamsWithAllId =
            requestParamsDropdownOptions(
               [preparedKeywordCategoryList[0]],
               keywordCategoryMasterList
            )
         this.props.metaDataStructure.keywordCategory =
            this.handleResponseBasedOnLoad(
               keywordCategoryMasterParamsWithAllId,
               retainingData.keywordCategoryName
            )
         //keyword category request
         filterRequestParams.keywordCategoryList =
            this.handleResponseBasedOnLoad(
               keywordCategoryMasterListWithAllId,
               retainingData.keywordCategoryName
            )
      } else {
         defaultKeywordCategoryValue = keywordCategoryMasterList
         updatedFilter.selectedKeywordCategory =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    keywordCategoryMasterList,
                    retainingData.keywordCategoryName
                 )
         this.props.metaDataStructure.keywordCategory =
            this.handleResponseBasedOnLoad(
               preparedKeywordCategoryList,
               retainingData.keywordCategoryName
            )
         //keyword category request
         filterRequestParams.keywordCategoryList =
            this.handleResponseBasedOnLoad(
               keywordCategoryMasterList,
               retainingData.keywordCategoryName
            )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.keywordCategoryList =
            currentFilterValues.selectedKeywordCategory
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.keywordCategoryOptionList =
            currentFilterOptions.keywordCategoryOption
      }

      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleKeywordTypeResponse(keywordTypeResponse) {
      const { isPreferredKeywordType, retainingData } = this.props
      const { singleSelectDropdownList } = this.state

      let keywordTypeMasterList =
         keywordTypeResponse && keywordTypeResponse.length
            ? keywordTypeResponse
            : []
      keywordTypeMasterList = removeArrayObjectDuplicates(
         keywordTypeMasterList,
         'id'
      )

      let updateFilterOption = this.handleOptionsToEmpty()
      let updatedFilter = this.handleSelectedOptionsToEmpty(
         'selectedKeywordType'
      )
      updateFilterOption.keywordTypeOption = keywordTypeMasterList
      let preparedKeywordTypeMasterList = []
      preparedKeywordTypeMasterList = PrepareStructure(
         keywordTypeMasterList,
         'objectName'
      )

      if (
         isPreferredKeywordType ||
         !singleSelectDropdownList.includes(bundleHierarchy.skl_type)
      ) {
         let keywordTypeMasterListWithAllId = requestParamsDropdownOptions(
            [keywordTypeMasterList[0]],
            keywordTypeMasterList
         )
         defaultKeywordTypeValue = keywordTypeMasterListWithAllId
         updatedFilter.selectedKeywordType =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    keywordTypeMasterListWithAllId,
                    retainingData.keywordTypeName
                 )
         let keywordTypeMasterParamsWithAllId = requestParamsDropdownOptions(
            [keywordTypeMasterList[0]],
            keywordTypeMasterList
         )
         this.props.metaDataStructure.keywordType =
            this.handleResponseBasedOnLoad(
               keywordTypeMasterParamsWithAllId,
               retainingData.keywordTypeName
            )
         //keyword Type request
         filterRequestParams.keywordTypeList = this.handleResponseBasedOnLoad(
            keywordTypeMasterListWithAllId,
            retainingData.keywordTypeName
         )
      } else {
         defaultKeywordTypeValue = keywordTypeMasterList
         updatedFilter.selectedKeywordType =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    keywordTypeMasterList,
                    retainingData.keywordTypeName
                 )
         this.props.metaDataStructure.keywordType =
            this.handleResponseBasedOnLoad(
               preparedKeywordTypeMasterList,
               retainingData.keywordTypeName
            )
         //keyword type request
         filterRequestParams.keywordTypeList = this.handleResponseBasedOnLoad(
            keywordTypeMasterList,
            retainingData.keywordTypeName
         )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.keywordTypeList = currentFilterValues.selectedKeywordType
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.keywordTypeOptionList =
            currentFilterOptions.keywordTypeOption
      }
      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleKeywordTagResponse(keywordTagResponse) {
      const { isPreferredKeywordTag, retainingData } = this.props
      const { singleSelectDropdownList } = this.state

      let keywordTagMasterList =
         keywordTagResponse && keywordTagResponse.length
            ? keywordTagResponse
            : []
      keywordTagMasterList = removeArrayObjectDuplicates(
         keywordTagMasterList,
         'id'
      )
      let updateFilterOption = this.handleOptionsToEmpty()
      let updatedFilter =
         this.handleSelectedOptionsToEmpty('selectedKeywordTag')
      updateFilterOption.keywordTagOption = keywordTagMasterList

      let preparedKeywordTagMasterList = []
      preparedKeywordTagMasterList = PrepareStructure(
         keywordTagMasterList,
         'objectName'
      )

      if (
         isPreferredKeywordTag ||
         !singleSelectDropdownList.includes(bundleHierarchy.keyword_tag)
      ) {
         let keywordTagMasterListWithAllId = requestParamsDropdownOptions(
            [keywordTagMasterList[0]],
            keywordTagMasterList
         )
         defaultKeywordTagValue = keywordTagMasterListWithAllId
         updatedFilter.selectedKeywordTag =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    keywordTagMasterListWithAllId,
                    retainingData.keywordTagName
                 )
         let keywordTagMasterParamsWithAllId = requestParamsDropdownOptions(
            [keywordTagMasterList[0]],
            keywordTagMasterList
         )
         this.props.metaDataStructure.keywordTagList =
            this.handleResponseBasedOnLoad(
               keywordTagMasterParamsWithAllId,
               retainingData.keywordTagName
            )
         //keyword Tag request
         filterRequestParams.keywordTagList = this.handleResponseBasedOnLoad(
            keywordTagMasterListWithAllId,
            retainingData.keywordTagName
         )
      } else {
         defaultKeywordTagValue = keywordTagMasterList
         updatedFilter.selectedKeywordTag =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    keywordTagMasterList,
                    retainingData.keywordTagName
                 )
         this.props.metaDataStructure.keywordTagList =
            this.handleResponseBasedOnLoad(
               preparedKeywordTagMasterList,
               retainingData.keywordTagName
            )
         //keyword tag request
         filterRequestParams.keywordTagList = this.handleResponseBasedOnLoad(
            keywordTagMasterList,
            retainingData.keywordTagName
         )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.keywordTagList = currentFilterValues.selectedKeywordTag
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.keywordTagOptionList =
            currentFilterOptions.keywordTagOption
      }

      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleKeywordResponse(keywordResponse) {
      const { isPreferredKeyword, retainingData } = this.props
      const { singleSelectDropdownList } = this.state

      let keywordMasterList =
         keywordResponse && keywordResponse.length ? keywordResponse : []
      keywordMasterList = removeArrayObjectDuplicates(keywordMasterList, 'id')

      let updateFilterOption = this.handleOptionsToEmpty()
      updateFilterOption.keywordOption = keywordMasterList
      const updatedFilter = this.handleSelectedOptionsToEmpty('selectedKeyword')
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
         updatedFilter.selectedKeyword =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    keywordMasterListWithAllId,
                    retainingData.keywordName
                 )
         let keywordMasterParamsWithAllId = requestParamsDropdownOptions(
            [preparedKeywordList[0]],
            keywordMasterList
         )
         this.props.metaDataStructure.keyword = this.handleResponseBasedOnLoad(
            keywordMasterParamsWithAllId,
            retainingData.keywordName
         )
         //keyword request
         filterRequestParams.keywordList = this.handleResponseBasedOnLoad(
            keywordMasterListWithAllId,
            retainingData.keywordName
         )
      } else {
         defaultKeywordValue = keywordMasterList
         updatedFilter.selectedKeyword =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    keywordMasterList,
                    retainingData.keywordName
                 )
         this.props.metaDataStructure.keyword = this.handleResponseBasedOnLoad(
            preparedKeywordList,
            retainingData.keywordName
         )
         //keyword request
         filterRequestParams.keywordList = this.handleResponseBasedOnLoad(
            keywordMasterList,
            retainingData.keywordName
         )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.keywordList = currentFilterValues.selectedKeyword
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.keywordOptionList = currentFilterOptions.keywordOption
      }

      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleCityPincodeStoreResponse(cityPincodeStoreResponse) {
      const {
         isPreferredCitySet,
         isPreferredPincodeSet,
         isPreferredStoreSet,
         retainingData,
      } = this.props
      const {
         singleSelectDropdownList,
         displayDropdownList,
         isCityApiCalled,
         isPincodeApiCalled,
         isStoreApiCalled,
      } = this.state

      //city response
      if (
         displayDropdownList.includes(bundleHierarchy.city_set) &&
         isCityApiCalled
      ) {
         let cityMasterList =
            cityPincodeStoreResponse &&
            cityPincodeStoreResponse.city &&
            cityPincodeStoreResponse.city.length
               ? cityPincodeStoreResponse.city
               : []
         cityMasterList = removeArrayObjectDuplicates(cityMasterList, 'id')

         let updateFilterOption = this.handleOptionsToEmpty()
         updateFilterOption.citySetOption = cityMasterList
         const updatedFilter =
            this.handleSelectedOptionsToEmpty('selectedCitySet')
         let preparedCityList = []
         preparedCityList = PrepareStructure(cityMasterList, 'objectName')

         if (
            isPreferredCitySet ||
            !singleSelectDropdownList.includes(bundleHierarchy.city_set)
         ) {
            let cityMasterListWithAllId = requestParamsDropdownOptions(
               [cityMasterList[0]],
               cityMasterList
            )
            defaultCitySetValue = cityMasterListWithAllId
            updatedFilter.selectedCitySet =
               this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
                  ? []
                  : this.handleResponseBasedOnLoad(
                       cityMasterListWithAllId,
                       retainingData.citySetName
                    )
            let cityMasterParamsWithAllId = requestParamsDropdownOptions(
               [preparedCityList[0]],
               cityMasterList
            )
            this.props.metaDataStructure.city = this.handleResponseBasedOnLoad(
               cityMasterParamsWithAllId,
               retainingData.citySetName
            )
            //city request
            filterRequestParams.city = this.handleResponseBasedOnLoad(
               cityMasterListWithAllId,
               retainingData.citySetName
            )
         } else {
            defaultCitySetValue = cityMasterList
            updatedFilter.selectedCitySet =
               this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
                  ? []
                  : this.handleResponseBasedOnLoad(
                       cityMasterList,
                       retainingData.citySetName
                    )
            this.props.metaDataStructure.city = this.handleResponseBasedOnLoad(
               preparedCityList,
               retainingData.citySetName
            )
            //city request
            filterRequestParams.city = this.handleResponseBasedOnLoad(
               cityMasterList,
               retainingData.citySetName
            )
         }

         if (!this.state.isOnChangeDropDown) {
            let currentFilterValues = extend(true, {}, updatedFilter)
            retainingList.cityList = currentFilterValues.selectedCitySet
            let currentFilterOptions = extend(true, {}, updateFilterOption)
            retainingList.cityOptionList = currentFilterOptions.citySetOption
         }

         this.setState({
            selectedFilterValue: updatedFilter,
            dropdownOptions: updateFilterOption,
            isCityApiCalled: false,
            isCityLoading: this.state.isSubBrandLoading ? true : false,
         })
      }

      //pincode response
      if (
         displayDropdownList.includes(bundleHierarchy.pincode_set) &&
         isPincodeApiCalled
      ) {
         let pincodeMasterList =
            cityPincodeStoreResponse &&
            cityPincodeStoreResponse.pincode &&
            cityPincodeStoreResponse.pincode.length
               ? cityPincodeStoreResponse.pincode.map((pincodeItem) => {
                    let pincodeValues = {
                       id: pincodeItem.id,
                       label: `${pincodeItem.name} - ${pincodeItem.label}`,
                       name: pincodeItem.name,
                       value: `${pincodeItem.name} - ${pincodeItem.label}`,
                    }
                    return pincodeValues
                 })
               : []
         pincodeMasterList = removeArrayObjectDuplicates(
            pincodeMasterList,
            'id'
         )

         let updateFilterOption = this.handleOptionsToEmpty()
         updateFilterOption.pincodeSetOption = pincodeMasterList
         const updatedFilter =
            this.handleSelectedOptionsToEmpty('selectedPincodeSet')
         let preparedPincodeList = []
         preparedPincodeList = PrepareStructure(pincodeMasterList, 'objectName')

         if (
            isPreferredPincodeSet ||
            !singleSelectDropdownList.includes(bundleHierarchy.pincode_set)
         ) {
            let pincodeMasterListWithAllId = requestParamsDropdownOptions(
               [pincodeMasterList[0]],
               pincodeMasterList
            )
            defaultPincodeSetValue = pincodeMasterListWithAllId
            updatedFilter.selectedPincodeSet =
               this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
                  ? []
                  : this.handleResponseBasedOnLoad(
                       pincodeMasterListWithAllId,
                       retainingData.pincodeSetName
                    )
            let pincodeMasterParamsWithAllId = requestParamsDropdownOptions(
               [preparedPincodeList[0]],
               pincodeMasterList
            )
            this.props.metaDataStructure.pincode =
               this.handleResponseBasedOnLoad(
                  pincodeMasterParamsWithAllId,
                  retainingData.pincodeSetName
               )
            //pincode request
            filterRequestParams.pincode = this.handleResponseBasedOnLoad(
               pincodeMasterListWithAllId,
               retainingData.pincodeSetName
            )
         } else {
            defaultPincodeSetValue = pincodeMasterList
            updatedFilter.selectedPincodeSet =
               this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
                  ? []
                  : this.handleResponseBasedOnLoad(
                       pincodeMasterList,
                       retainingData.pincodeSetName
                    )
            this.props.metaDataStructure.pincode =
               this.handleResponseBasedOnLoad(
                  preparedPincodeList,
                  retainingData.pincodeSetName
               )
            //pincode request
            filterRequestParams.pincode = this.handleResponseBasedOnLoad(
               pincodeMasterList,
               retainingData.pincodeSetName
            )
         }

         if (!this.state.isOnChangeDropDown) {
            let currentFilterValues = extend(true, {}, updatedFilter)
            retainingList.pincodeList = currentFilterValues.selectedPincodeSet
            let currentFilterOptions = extend(true, {}, updateFilterOption)
            retainingList.pincodeOptionList =
               currentFilterOptions.pincodeSetOption
         }

         this.setState({
            selectedFilterValue: updatedFilter,
            dropdownOptions: updateFilterOption,
            isPincodeApiCalled: false,
            isPincodeLoading: this.state.isSubBrandLoading ? true : false,
         })
      }

      //store response
      if (
         displayDropdownList.includes(bundleHierarchy.store_set) &&
         isStoreApiCalled
      ) {
         let storeMasterList =
            cityPincodeStoreResponse &&
            cityPincodeStoreResponse.store &&
            cityPincodeStoreResponse.store.length
               ? cityPincodeStoreResponse.store
               : []
         storeMasterList = removeArrayObjectDuplicates(storeMasterList, 'id')

         let updateFilterOption = this.handleOptionsToEmpty()
         updateFilterOption.storeSetOption = storeMasterList
         const updatedFilter =
            this.handleSelectedOptionsToEmpty('selectedStoreSet')
         let preparedStoreList = []
         preparedStoreList = PrepareStructure(storeMasterList, 'objectName')

         if (
            isPreferredStoreSet ||
            !singleSelectDropdownList.includes(bundleHierarchy.store_set)
         ) {
            let storeMasterListWithAllId = requestParamsDropdownOptions(
               [storeMasterList[0]],
               storeMasterList
            )
            defaultStoreSetValue = storeMasterListWithAllId
            updatedFilter.selectedStoreSet =
               this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
                  ? []
                  : this.handleResponseBasedOnLoad(
                       storeMasterListWithAllId,
                       retainingData.storeSetName
                    )
            let storeMasterParamsWithAllId = requestParamsDropdownOptions(
               [preparedStoreList[0]],
               storeMasterList
            )
            this.props.metaDataStructure.store = this.handleResponseBasedOnLoad(
               storeMasterParamsWithAllId,
               retainingData.storeSetName
            )
            //store request
            filterRequestParams.store = this.handleResponseBasedOnLoad(
               storeMasterListWithAllId,
               retainingData.storeSetName
            )
         } else {
            defaultStoreSetValue = storeMasterList
            updatedFilter.selectedStoreSet =
               this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
                  ? []
                  : this.handleResponseBasedOnLoad(
                       storeMasterList,
                       retainingData.storeSetName
                    )
            this.props.metaDataStructure.store = this.handleResponseBasedOnLoad(
               preparedStoreList,
               retainingData.storeSetName
            )
            //store request
            filterRequestParams.store = this.handleResponseBasedOnLoad(
               storeMasterList,
               retainingData.storeSetName
            )
         }

         if (!this.state.isOnChangeDropDown) {
            let currentFilterValues = extend(true, {}, updatedFilter)
            retainingList.storeList = currentFilterValues.selectedStoreSet
            let currentFilterOptions = extend(true, {}, updateFilterOption)
            retainingList.storeOptionList = currentFilterOptions.storeSetOption
         }

         this.setState({
            selectedFilterValue: updatedFilter,
            dropdownOptions: updateFilterOption,
            isStoreApiCalled: false,
            isStoreLoading: this.state.isSubBrandLoading ? true : false,
         })
      }
   }

   handleRetailerCategoryResponse(retailerCategoryResponse) {
      const { isPreferredRetCat, retainingData } = this.props
      const { singleSelectDropdownList } = this.state

      let retailerCategoryMasterList =
         retailerCategoryResponse && retailerCategoryResponse.length
            ? retailerCategoryResponse
            : []
      retailerCategoryMasterList = removeArrayObjectDuplicates(
         retailerCategoryMasterList,
         'id'
      )

      let updateFilterOption = this.handleOptionsToEmpty()
      updateFilterOption.retailerCategoryOption = retailerCategoryMasterList
      const updatedFilter = this.handleSelectedOptionsToEmpty(
         'selectedRetailerCategory'
      )
      let preparedRetailerCategoryList = []
      preparedRetailerCategoryList = PrepareStructure(
         retailerCategoryMasterList,
         'objectName'
      )

      if (
         isPreferredRetCat ||
         !singleSelectDropdownList.includes(bundleHierarchy.retailers_category)
      ) {
         let retailerCategoryMasterListWithAllId = requestParamsDropdownOptions(
            [retailerCategoryMasterList[0]],
            retailerCategoryMasterList
         )
         defaultRetCatValue = retailerCategoryMasterListWithAllId
         updatedFilter.selectedRetailerCategory =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    retailerCategoryMasterListWithAllId,
                    retainingData.retailerCategoryName
                 )
         let retailerCategoryMasterParamsWithAllId =
            requestParamsDropdownOptions(
               [preparedRetailerCategoryList[0]],
               retailerCategoryMasterList
            )
         this.props.metaDataStructure.retailerCategory =
            this.handleResponseBasedOnLoad(
               retailerCategoryMasterParamsWithAllId,
               retainingData.retailerCategoryName
            )
      } else {
         defaultRetCatValue = retailerCategoryMasterList
         updatedFilter.selectedRetailerCategory =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    retailerCategoryMasterList,
                    retainingData.retailerCategoryName
                 )
         this.props.metaDataStructure.retailerCategory =
            this.handleResponseBasedOnLoad(
               preparedRetailerCategoryList,
               retainingData.retailerCategoryName
            )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.retailerCategoryList =
            currentFilterValues.selectedRetailerCategory
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.retailerCategoryOptionList =
            currentFilterOptions.retailerCategoryOption
      }

      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleSkuResponse(skuResponse) {
      const { isPreferredSku, retainingData } = this.props
      const { singleSelectDropdownList } = this.state

      let skuMasterList = skuResponse && skuResponse.length ? skuResponse : []
      skuMasterList = removeArrayObjectDuplicates(skuMasterList, 'id')

      let updateFilterOption = this.handleOptionsToEmpty()
      updateFilterOption.skuOption = skuMasterList
      const updatedFilter = this.handleSelectedOptionsToEmpty('selectedSku')
      let preparedSkuList = []
      preparedSkuList = PrepareStructure(skuMasterList, 'objectName')

      if (
         isPreferredSku ||
         !singleSelectDropdownList.includes(bundleHierarchy.sku)
      ) {
         let skuMasterListWithAllId = requestParamsDropdownOptions(
            [skuMasterList[0]],
            skuMasterList
         )
         defaultSkuValue = skuMasterListWithAllId
         updatedFilter.selectedSku =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    skuMasterListWithAllId,
                    retainingData.skuName
                 )
         retainingData.skuName = this.handleResponseBasedOnLoad(
            skuMasterListWithAllId,
            retainingData.skuName
         )
         let skuMasterParamsWithAllId = requestParamsDropdownOptions(
            [preparedSkuList[0]],
            skuMasterList
         )
         this.props.metaDataStructure.skuSet = this.handleResponseBasedOnLoad(
            skuMasterParamsWithAllId,
            retainingData.skuName
         )
      } else {
         defaultSkuValue = skuMasterList
         updatedFilter.selectedSku =
            this.props.isFreeHandDropdown && !this.state.isOnChangeDropDown
               ? []
               : this.handleResponseBasedOnLoad(
                    skuMasterList,
                    retainingData.skuName
                 )
         retainingData.skuName = this.handleResponseBasedOnLoad(
            skuMasterList,
            retainingData.skuName
         )
         this.props.metaDataStructure.skuSet = this.handleResponseBasedOnLoad(
            preparedSkuList,
            retainingData.skuName
         )
      }

      if (!this.state.isOnChangeDropDown) {
         let currentFilterValues = extend(true, {}, updatedFilter)
         retainingList.skuList = currentFilterValues.selectedSku
         let currentFilterOptions = extend(true, {}, updateFilterOption)
         retainingList.skuOptionList = currentFilterOptions.skuOption
      }

      if (updatedFilter.selectedSku && updatedFilter.selectedSku.length) {
         updatedFilter.selectedSku.map((skuItem, skuIndex) => {
            if (skuIndex === 0 && skuItem !== undefined) {
               this.setState({ isPowerSku: skuItem.tag })
            }
         })
      }
      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleReloadForDropdowns(dropdownResponse, dropdownName) {
      if (dropdownResponse && dropdownResponse.content != undefined) {
         cascadingApiSuccessAndReload[dropdownName + 'isApiSuccess'] =
            reloadForApiResult(dropdownResponse)
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = false
      }
   }

   componentWillReceiveProps(nextProps) {
      const {
         retainingData,
         getRetailerMasterResult,
         getSuperCategoryMasterResult,
         getChildSuperCategoryMasterResult,
         getCategoryMasterResult,
         getChildCategoryMasterResult,
         getSubCategoryMasterResult,
         getChildSubCategoryMasterResult,
         getBrandMasterResult,
         getSubFamilyMasterResult,
         getSubBrandMasterResult,
         getKeywordCategoryMasterResult,
         getKeywordTypeMasterResult,
         getKeywordTagMasterResult,
         getKeywordsMasterResult,
         getCityPincodeStoreMasterResult,
         getRetailerCategoryMasterResult,
         getSkuMasterResult,
         isPreferredRetailerArray,
         isPreferredSuperCategoryArray,
         isPreferredChildSuperCategoryArray,
         isPreferredCategoryArray,
         isPreferredChildCategoryArray,
         isPreferredSubCategoryArray,
         isPreferredChildSubCategoryArray,
         isInternalNavigation,
         moduleName,
         singleSelectDropdown,
         defaultSelectedDate,
         isCompetitorBased,
         getUserDetail
      } = nextProps
      let {
         displayDropdownList,
         applyClicked,
         isRetailerApiCalled,
         isSuperCategoryApiCalled,
         isChildSuperCategoryApiCalled,
         isCategoryApiCalled,
         isChildCategoryApiCalled,
         isSubCategoryApiCalled,
         isChildSubCategoryApiCalled,
         isBrandApiCalled,
         isSubFamilyApiCalled,
         isSubBrandApiCalled,
         isKeywordCategoryApiCalled,
         isKeywordTypeApiCalled,
         isKeywordTagApiCalled,
         isKeywordsApiCalled,
         isCityApiCalled,
         isPincodeApiCalled,
         isStoreApiCalled,
         isRetailerCategoryApiCalled,
         isSkuApiCalled,
         selectedFilterValue,
      } = this.state

      if (
         initialRender &&
         this.props.isEnableSuggestion &&
         this.props.keywordValueForFilter
      ) {
         this.setState({
            keywordSuggestionOptions: this.props.keywordValueForFilter,
         })
         defaultKeywordOption = this.props.keywordValueForFilter
         this.state.selectedFilterValue.selectedKeywordOption =
            this.props.keywordValueForFilter
         this.props.metaDataStructure.keywordSuggestOption =
            this.props.keywordValueForFilter
         initialRender = false
      }
      //retailer response
      if (displayDropdownList.includes(bundleHierarchy.retailer)) {
         this.handleReloadForDropdowns(
            getRetailerMasterResult,
            bundleHierarchy.retailer
         )
         if (
            getRetailerMasterResult &&
            getRetailerMasterResult.content &&
            getRetailerMasterResult.content.data &&
            isRetailerApiCalled &&
            !applyClicked
         ) {
            this.handleRetailerResponse(getRetailerMasterResult.content.data)
            if (displayDropdownList.includes(bundleHierarchy.super_category)) {
               this.props.getSuperCategoryMaster(filterRequestParams)
            }
            this.setState({
               isRetailerApiCalled: false,
               isSuperCategoryApiCalled: true,
               isRetailerLoading: true,
               isSuperCategoryLoading: false,
               isChildSuperCategoryLoading: false,
               isCategoryLoading: false,
               isChildCategoryLoading: false,
               isSubCategoryLoading: false,
               isChildSubCategoryLoading: false,
               isBrandLoading: false,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
            })
         }
      }

      //super category response
      if (displayDropdownList.includes(bundleHierarchy.super_category)) {
         this.handleReloadForDropdowns(
            getSuperCategoryMasterResult,
            bundleHierarchy.super_category
         )
         if (
            getSuperCategoryMasterResult &&
            getSuperCategoryMasterResult.content &&
            getSuperCategoryMasterResult.content.data &&
            isSuperCategoryApiCalled &&
            !applyClicked
         ) {
            this.handleSuperCategoryResponse(
               getSuperCategoryMasterResult.content.data
            )
            if (
               displayDropdownList.includes(
                  bundleHierarchy.child_super_category
               )
            ) {
               this.props.getChildSuperCategoryMaster(filterRequestParams)
            }
            this.setState({
               isSuperCategoryApiCalled: false,
               isChildSuperCategoryApiCalled: true,
               isSuperCategoryLoading: this.state.isRetailerLoading
                  ? true
                  : false,
               isChildSuperCategoryLoading: false,
               isCategoryLoading: false,
               isChildCategoryLoading: false,
               isSubCategoryLoading: false,
               isChildSubCategoryLoading: false,
               isBrandLoading: false,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
            })
         }
      }

      //child super category response
      if (displayDropdownList.includes(bundleHierarchy.child_super_category)) {
         this.handleReloadForDropdowns(
            getChildSuperCategoryMasterResult,
            bundleHierarchy.child_super_category
         )
         if (
            getChildSuperCategoryMasterResult &&
            getChildSuperCategoryMasterResult.content &&
            getChildSuperCategoryMasterResult.content.data &&
            isChildSuperCategoryApiCalled &&
            !applyClicked
         ) {
            this.handleChildSuperCategoryResponse(
               getChildSuperCategoryMasterResult.content.data
            )
            if (displayDropdownList.includes(bundleHierarchy.category)) {
               this.props.getCategoryMaster(filterRequestParams)
            }
            this.setState({
               isChildSuperCategoryApiCalled: false,
               isCategoryApiCalled: true,
               isChildSuperCategoryLoading: this.state.isSuperCategoryLoading
                  ? true
                  : false,
               isCategoryLoading: false,
               isChildCategoryLoading: false,
               isSubCategoryLoading: false,
               isChildSubCategoryLoading: false,
               isBrandLoading: false,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
            })
         }
      }

      //category response
      if (displayDropdownList.includes(bundleHierarchy.category)) {
         this.handleReloadForDropdowns(
            getCategoryMasterResult,
            bundleHierarchy.category
         )
         if (
            getCategoryMasterResult &&
            getCategoryMasterResult.content &&
            getCategoryMasterResult.content.data &&
            isCategoryApiCalled &&
            !applyClicked
         ) {
            this.handleCategoryResponse(getCategoryMasterResult.content.data)
            if (displayDropdownList.includes(bundleHierarchy.child_category)) {
               this.props.getChildCategoryMaster(filterRequestParams)
            }
            this.setState({
               isCategoryApiCalled: false,
               isChildCategoryApiCalled: true,
               isCategoryLoading: this.state.isChildSuperCategoryLoading
                  ? true
                  : false,
               isChildCategoryLoading: false,
               isSubCategoryLoading: false,
               isChildSubCategoryLoading: false,
               isBrandLoading: false,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
            })
         }
      }

      //child category response
      if (displayDropdownList.includes(bundleHierarchy.child_category)) {
         this.handleReloadForDropdowns(
            getChildCategoryMasterResult,
            bundleHierarchy.child_category
         )
         if (
            getChildCategoryMasterResult &&
            getChildCategoryMasterResult.content &&
            getChildCategoryMasterResult.content.data &&
            isChildCategoryApiCalled &&
            !applyClicked
         ) {
            this.handleChildCategoryResponse(
               getChildCategoryMasterResult.content.data
            )
            if (displayDropdownList.includes(bundleHierarchy.sub_category)) {
               this.props.getSubCategoryMaster(filterRequestParams)
            }
            this.setState({
               isChildCategoryApiCalled: false,
               isSubCategoryApiCalled: true,
               isChildCategoryLoading: this.state.isCategoryLoading
                  ? true
                  : false,
               isSubCategoryLoading: false,
               isChildSubCategoryLoading: false,
               isBrandLoading: false,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
            })
         }
      }

      //sub category response
      if (displayDropdownList.includes(bundleHierarchy.sub_category)) {
         this.handleReloadForDropdowns(
            getSubCategoryMasterResult,
            bundleHierarchy.sub_category
         )
         if (
            getSubCategoryMasterResult &&
            getSubCategoryMasterResult.content &&
            getSubCategoryMasterResult.content.data &&
            isSubCategoryApiCalled &&
            !applyClicked
         ) {
            this.handleSubCategoryResponse(
               getSubCategoryMasterResult.content.data
            )
            if (
               displayDropdownList.includes(bundleHierarchy.child_sub_category)
            ) {
               this.props.getChildSubCategoryMaster(filterRequestParams)
            }
            this.setState({
               isSubCategoryApiCalled: false,
               isChildSubCategoryApiCalled: true,
               isSubCategoryLoading: this.state.isChildCategoryLoading
                  ? true
                  : false,
               isChildSubCategoryLoading: false,
               isBrandLoading: false,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
            })
         }
      }

      //child sub category response
      if (displayDropdownList.includes(bundleHierarchy.child_sub_category)) {
         this.handleReloadForDropdowns(
            getSubCategoryMasterResult,
            bundleHierarchy.child_sub_category
         )
         if (
            getChildSubCategoryMasterResult &&
            getChildSubCategoryMasterResult.content &&
            getChildSubCategoryMasterResult.content.data &&
            isChildSubCategoryApiCalled &&
            !applyClicked
         ) {
            this.handleChildSubCategoryResponse(
               getChildSubCategoryMasterResult.content.data
            )
            if (displayDropdownList.includes(bundleHierarchy.brand)) {
               this.props.getBrandMaster(filterRequestParams)
            }
            this.setState({
               isChildSubCategoryApiCalled: false,
               isBrandApiCalled: true,
               isChildSubCategoryLoading: this.state.isSubCategoryLoading
                  ? true
                  : false,
               isBrandLoading: false,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
            })
         }
      }

      //brand response
      if (displayDropdownList.includes(bundleHierarchy.brand)) {
         this.handleReloadForDropdowns(
            getBrandMasterResult,
            bundleHierarchy.brand
         )
         if (
            getBrandMasterResult &&
            getBrandMasterResult.content &&
            getBrandMasterResult.content.data &&
            isBrandApiCalled &&
            !applyClicked
         ) {
            this.handleBrandResponse(getBrandMasterResult.content.data)
            if (displayDropdownList.includes(bundleHierarchy.sub_family)) {
               this.props.getSubFamilyMaster(filterRequestParams)
            }
            this.setState({
               isBrandApiCalled: false,
               isSubFamilyApiCalled: true,
               isBrandLoading: this.state.isChildSubCategoryLoading
                  ? true
                  : false,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
            })
         }
      }

      //sub family response
      if (displayDropdownList.includes(bundleHierarchy.sub_family)) {
         this.handleReloadForDropdowns(
            getSubFamilyMasterResult,
            bundleHierarchy.sub_family
         )
         if (
            getSubFamilyMasterResult &&
            getSubFamilyMasterResult.content &&
            getSubFamilyMasterResult.content.data &&
            isSubFamilyApiCalled &&
            !applyClicked
         ) {
            this.handleSubFamilyResponse(getSubFamilyMasterResult.content.data)
            if (displayDropdownList.includes(bundleHierarchy.sub_brand)) {
               this.props.getSubBrandMaster(filterRequestParams)
            }

            this.setState({
               isSubFamilyApiCalled: false,
               isSubBrandApiCalled: true,
               isSubFamilyLoading: this.state.isBrandLoading ? true : false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
            })
         }
      }

      //sub brand response
      if (displayDropdownList.includes(bundleHierarchy.sub_brand)) {
         this.handleReloadForDropdowns(
            getSubBrandMasterResult,
            bundleHierarchy.sub_brand
         )
         if (
            getSubBrandMasterResult &&
            getSubBrandMasterResult.content &&
            getSubBrandMasterResult.content.data &&
            isSubBrandApiCalled &&
            !applyClicked
         ) {
            this.handleSubBrandResponse(getSubBrandMasterResult.content.data)
            if (displayDropdownList.includes(bundleHierarchy.keyword_type)) {
               this.props.getKeywordCategoryMaster(filterRequestParams)
            }
            if (
               displayDropdownList.includes(bundleHierarchy.city_set) ||
               displayDropdownList.includes(bundleHierarchy.pincode_set) ||
               displayDropdownList.includes(bundleHierarchy.store_set)
            ) {
               this.props.getCityPincodeStoreMaster(filterRequestParams)
            }
            if (displayDropdownList.includes(bundleHierarchy.sku)) {
               this.props.getSkuMaster(filterRequestParams)
            }
            this.setState({
               isSubBrandApiCalled: false,
               isKeywordCategoryApiCalled: true,
               isCityApiCalled: true,
               isPincodeApiCalled: true,
               isStoreApiCalled: true,
               isSkuApiCalled: true,
               isSubBrandLoading: this.state.isSubFamilyLoading ? true : false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
            })
         }
      }

      //keyword category response
      if (displayDropdownList.includes(bundleHierarchy.keyword_type)) {
         this.handleReloadForDropdowns(
            getKeywordCategoryMasterResult,
            bundleHierarchy.keyword_type
         )

         if (
            getKeywordCategoryMasterResult &&
            getKeywordCategoryMasterResult.content &&
            getKeywordCategoryMasterResult.content.data &&
            isKeywordCategoryApiCalled &&
            !applyClicked
         ) {
            this.handleKeywordCategoryResponse(
               getKeywordCategoryMasterResult.content.data
            )
            if (displayDropdownList.includes(bundleHierarchy.skl_type)) {
               this.props.getKeywordTypeMaster(filterRequestParams)
            }
            this.setState({
               isKeywordCategoryApiCalled: false,
               isKeywordTypeApiCalled: true,
               isKeywordCategoryLoading: this.state.isSubBrandLoading
                  ? true
                  : false,
               isKeywordTypeLoading: false,
            })
         }
      }

      //keyword type  response
      if (displayDropdownList.includes(bundleHierarchy.skl_type)) {
         this.handleReloadForDropdowns(
            getKeywordTypeMasterResult,
            bundleHierarchy.skl_type
         )
         if (
            getKeywordTypeMasterResult &&
            getKeywordTypeMasterResult.content &&
            getKeywordTypeMasterResult.content.data &&
            isKeywordTypeApiCalled &&
            !applyClicked
         ) {
            this.handleKeywordTypeResponse(
               getKeywordTypeMasterResult.content.data
            )
            if (displayDropdownList.includes(bundleHierarchy.keyword_tag)) {
               this.props.getKeywordTagMaster(filterRequestParams)
            }
            this.setState({
               isKeywordTypeApiCalled: false,
               isKeywordTagApiCalled: true,
               isKeywordTypeLoading: this.state.isKeywordCategoryLoading
                  ? true
                  : false,
               isKeywordTagLoading: false,
            })
         }
      }

      //keyword tag response
      if (displayDropdownList.includes(bundleHierarchy.keyword_tag)) {
         this.handleReloadForDropdowns(
            getKeywordTagMasterResult,
            bundleHierarchy.keyword_tag
         )
         if (
            getKeywordTagMasterResult &&
            getKeywordTagMasterResult.content &&
            getKeywordTagMasterResult.content.data &&
            isKeywordTagApiCalled &&
            !applyClicked
         ) {
            this.handleKeywordTagResponse(
               getKeywordTagMasterResult.content.data
            )
            if (displayDropdownList.includes(bundleHierarchy.keyword)) {
               this.props.getKeywordsMaster(filterRequestParams)
            }
            this.setState({
               isKeywordTagApiCalled: false,
               isKeywordsApiCalled: true,
               isKeywordTagLoading: this.state.isKeywordTypeLoading
                  ? true
                  : false,
               isKeywordsLoading: false,
            })
         }
      }

      //keyword response
      if (displayDropdownList.includes(bundleHierarchy.keyword)) {
         this.handleReloadForDropdowns(
            getKeywordsMasterResult,
            bundleHierarchy.keyword
         )
         if (
            getKeywordsMasterResult &&
            getKeywordsMasterResult.content &&
            getKeywordsMasterResult.content.data &&
            isKeywordsApiCalled &&
            !applyClicked
         ) {
            this.handleKeywordResponse(getKeywordsMasterResult.content.data)
            this.setState({
               isKeywordsApiCalled: false,
               isKeywordsLoading: this.state.isKeywordCategoryLoading
                  ? true
                  : false,
            })
         }
      }

      //city pincode store response
      this.handleReloadForDropdowns(
         getCityPincodeStoreMasterResult,
         bundleHierarchy.city_set
      )
      this.handleReloadForDropdowns(
         getCityPincodeStoreMasterResult,
         bundleHierarchy.pincode_set
      )
      this.handleReloadForDropdowns(
         getCityPincodeStoreMasterResult,
         bundleHierarchy.store_set
      )
      if (
         getCityPincodeStoreMasterResult &&
         getCityPincodeStoreMasterResult.content &&
         getCityPincodeStoreMasterResult.content.data &&
         !applyClicked &&
         (isCityApiCalled || isPincodeApiCalled || isStoreApiCalled)
      ) {
         this.handleCityPincodeStoreResponse(
            getCityPincodeStoreMasterResult.content.data
         )
         if (displayDropdownList.includes(bundleHierarchy.retailers_category)) {
            this.props.getRetailerCategoryMaster(filterRequestParams)
         }
         this.setState({
            isRetailerCategoryApiCalled: true,
            isRetailerCategoryLoading: false,
         })
      }

      //retailer category response
      if (displayDropdownList.includes(bundleHierarchy.retailers_category)) {
         this.handleReloadForDropdowns(
            getRetailerCategoryMasterResult,
            bundleHierarchy.retailers_category
         )
         if (
            getRetailerCategoryMasterResult &&
            getRetailerCategoryMasterResult.content &&
            getRetailerCategoryMasterResult.content.data &&
            isRetailerCategoryApiCalled &&
            !applyClicked
         ) {
            this.handleRetailerCategoryResponse(
               getRetailerCategoryMasterResult.content.data
            )
            this.setState({
               isRetailerCategoryApiCalled: false,
               isRetailerCategoryLoading: this.state.isCityLoading
                  ? true
                  : false,
            })
         }
      }

      //sku response
      if (displayDropdownList.includes(bundleHierarchy.sku)) {
         this.handleReloadForDropdowns(getSkuMasterResult, bundleHierarchy.sku)
         if (
            getSkuMasterResult &&
            getSkuMasterResult.content &&
            getSkuMasterResult.content.data &&
            isSkuApiCalled &&
            !applyClicked
         ) {
            this.handleSkuResponse(getSkuMasterResult.content.data)
            this.setState({
               isSkuApiCalled: false,
               isSkuLoading: this.state.isSubBrandLoading ? true : false,
            })
         }
      }

      // Set Date value
      if (!this.state.initialDateRender && nextProps.defaultSelectedDate) {
         let deselectPrepareDateValue = extend(true, selectedFilterValue, {})
         let updatedDateFilter = extend(true, deselectPrepareDateValue, {})
         let deselectOptionDateList = extend(
            true,
            this.state.dropdownOptions,
            {}
         )
         let updateFilterDateOption = extend(true, deselectOptionDateList, {})
         let defaultDateDisplay = moment(nextProps.defaultSelectedDate).format(
            DISPLAY_DATE_FORMAT
         )
         this.setState({ datePickerValue: defaultDateDisplay })
         let selectedDateValue = moment(nextProps.defaultSelectedDate).format(
            DATE_FORMAT
         )
         this.props.metaDataStructure.fromDate = selectedDateValue
         this.props.metaDataStructure.toDate = selectedDateValue
         updatedDateFilter.selectedDisplayDate = defaultDateDisplay
         updateFilterDateOption.displayDateOption = defaultDateDisplay
         this.setState({
            selectedFilterValue: updatedDateFilter,
            dropdownOptions: updateFilterDateOption,
            initialDateRender: true,
         })
      }

      if (
         /*Reset Clicked this condition execute*/
         retainingData &&
         retainingData.retailerName &&
         retainingData.retailerName.length === 0 &&
         !retainingData.clickStatus &&
         retainingData.resetClicked
      ) {
         //retailer api call
         filterRequestParams = {}
         filterRequestParams.pimOrgId = getUserDetail.organizationid
         filterRequestParams.organizationId = organizationId
         filterRequestParams.toDate =
            moment(defaultSelectedDate).format(DATE_FORMAT)
         filterRequestParams.columnName = 'filter'
         filterRequestParams.optionsList = dropdownListForEsFilter
         filterRequestParams.selectedOption = bundleHierarchy.city
         filterRequestParams.moduleName = moduleName
         filterRequestParams.competitorBased = isCompetitorBased
         if (singleSelectDropdown && singleSelectDropdown.length) {
            if (
               singleSelectDropdown.includes(bundleHierarchy.city_set) ||
               singleSelectDropdown.includes(bundleHierarchy.pincode_set) ||
               singleSelectDropdown.includes(bundleHierarchy.store_set)
            ) {
               filterRequestParams.isCPS = true
            } else {
               filterRequestParams.isCPS = false
            }
         }
         retainingData.isNavigation = false
         if (isInternalNavigation) {
            this.handleRetailerTypes(isPreferredRetailerArray)
            filterRequestParams.retailerList = isPreferredRetailerArray
            filterRequestParams.superCategoryList =
               isPreferredSuperCategoryArray
            filterRequestParams.childSuperCategoryList =
               isPreferredChildSuperCategoryArray
            filterRequestParams.categoryList = isPreferredCategoryArray
            filterRequestParams.childCategoryList =
               isPreferredChildCategoryArray
            filterRequestParams.subCategoryList = isPreferredSubCategoryArray
            filterRequestParams.childSubCategoryList =
               isPreferredChildSubCategoryArray
            this.props.getBrandMaster(filterRequestParams)
            this.setState({
               isBrandApiCalled: true,
               isChildSubCategoryLoading: true,
            })
         } else {
            //retailer api call
            this.props.getRetailerMaster(filterRequestParams)
            this.setState({ isRetailerApiCalled: true })
         }
         const updatedFilter =
            this.handleSelectedOptionsToEmpty('selectedPosition')
         const selectedPositionValue = this.props.configureFirstPagePosition
            ? `Top ${defaultSearchPosition}`
            : `Top ${
                 defaultSearchPosition == FIRST_PAGE
                    ? TEN_AS_STRING
                    : defaultSearchPosition
              }`
         updatedFilter.selectedPosition = [
            {
               id: selectedPositionValue,
               label: selectedPositionValue,
               name: selectedPositionValue,
               value: selectedPositionValue,
            },
         ]
         retainingList.positionList = updatedFilter.selectedPosition
         updatedFilter.selectedMustsellsku = false
         updatedFilter.selectedKeywordOption = defaultKeywordOption
         retainingList.keywordSuggestOption =
            updatedFilter.selectedKeywordOption
         retainingList.powerSku = updatedFilter.selectedMustsellsku
         if (this.props.defaultSelectedDate) {
            let defaultDateDisplay = moment(
               this.props.defaultSelectedDate
            ).format(DISPLAY_DATE_FORMAT)
            let selectedDateValue = moment(
               this.props.defaultSelectedDate
            ).format(DATE_FORMAT)
            this.setState({ datePickerValue: defaultDateDisplay })
            this.props.metaDataStructure.fromDate = selectedDateValue
            this.props.metaDataStructure.toDate = selectedDateValue
            this.props.metaDataStructure.powerSku = false
            this.props.metaDataStructure.keywordSuggestOption =
               defaultKeywordOption
            updatedFilter.selectedKeywordOption = defaultKeywordOption
            updatedFilter.selectedDisplayDate = defaultDateDisplay
            retainingList.displayDate = defaultDateDisplay
         }
         // to call Onclick search method
         this.search(defaultKeywordOption)
         this.setState({
            applyClicked: false,
            isRetailerApiCalled: true,
            isRetailerLoading: false,
            isSuperCategoryLoading: false,
            isCategoryLoading: false,
            isSubCategoryLoading: false,
            isBrandLoading: false,
            isSubFamilyLoading: false,
            isSubBrandLoading: false,
            isKeywordCategoryLoading: false,
            isKeywordTypeLoading: false,
            isKeywordTagLoading: false,
            isKeywordsLoading: false,
            isCityLoading: false,
            isPincodeLoading: false,
            isStoreLoading: false,
            isRetailerCategoryLoading: false,
            isSkuLoading: false,
            isOnChangeDropDown: false,
            isKeywordTextLoading: true,
         })
         retainingData.clickStatus = true
         retainingData.resetClicked = false
         this.setState({
            resetClicked: true,
         })

         this.props.initialRenderFilter(
            this.state.selectedFilterValue,
            'reset',
            filterRequestParams.optionsList
         )
      }
   }

   // Initial Load and reset dropdown value and selected value
   prepareInitialRender(getFilterDataValue, retainingData) {
      const {
         metaDataStructure,
         disableDropdown,
         hideDropdown,
         singleSelectDropdown,
      } = this.props
      let {
         enabledDropdownList,
         displayDropdownList,
         dropdownSelection,
         singleSelectDropdownList,
      } = this.state

      // check whether dropdown is Enable or Disable the module
      if (
         disableDropdown &&
         disableDropdown !== this.state.enabledDropdownList
      ) {
         enabledDropdownList = enabledDropdownList.filter(
            (item) => !disableDropdown.includes(item)
         )
         this.setState({ enabledDropdownList })
      }
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

      // Set Date value
      let deselectPrepareDateValue = extend(
         true,
         this.state.selectedFilterValue,
         {}
      )
      let updatedDateFilter = extend(true, {}, deselectPrepareDateValue)
      let deselectOptionDateList = extend(true, this.state.dropdownOptions, {})
      let updateFilterDateOption = extend(true, {}, deselectOptionDateList)

      this.setState({
         keywordStatus: false,
         isDateChange: false,
      })
      if (this.props.defaultSelectedDate) {
         let defaultDateDisplay = moment(this.props.defaultSelectedDate).format(
            DISPLAY_DATE_FORMAT
         )
         let selectedDateValue = moment(this.props.defaultSelectedDate).format(
            DATE_FORMAT
         )
         metaDataStructure.fromDate = selectedDateValue
         metaDataStructure.toDate = selectedDateValue
         updatedDateFilter.selectedDisplayDate = defaultDateDisplay
         retainingList.displayDate = defaultDateDisplay
         updateFilterDateOption.displayDateOption = defaultDateDisplay
         this.setState({
            selectedFilterValue: updatedDateFilter,
            dropdownOptions: updateFilterDateOption,
            scrapDateToDisplay: defaultDateDisplay,
         })
      }

      let deselectOptionList = extend(true, this.state.dropdownOptions, {})
      let updateFilterOption = extend(true, deselectOptionList, {})
      let deselectPrepareValue = extend(
         true,
         this.state.selectedFilterValue,
         {}
      )
      let updatedFilter = extend(true, deselectPrepareValue, {})
      updatedFilter.selectedMustsellsku = false
      retainingList.powerSku = false

      // Setting up initial load of position dropdown
      topPositionOptions = []
      if (
         displayDropdownList.includes(bundleHierarchy.position) &&
         getFilterDataValue &&
         getFilterDataValue.position &&
         getFilterDataValue.position.length
      ) {
         let position = []
         //method for arranging the position based on default position
         const arrangePositionOptions = (obj, item) => {
            if (defaultSearchPosition === item) topPositionOptions.unshift(obj)
            else topPositionOptions.push(obj)
         }

         getFilterDataValue.position.map((item) => {
            let obj = {
               id: '',
               label: `Top ${item}`,
               value: `Top ${item}`,
               name: `Top ${item}`,
            }
            arrangePositionOptions(obj, item)
            position.push(item)
         })
         if (this.props.configureFirstPagePosition) {
            let firstPageOptions = {
               id: '',
               name: 'First Page',
               label: 'First Page',
               value: 'First Page',
            }
            arrangePositionOptions(firstPageOptions, firstPageOptions.value)
         }
         metaDataStructure.selectedPosition = [topPositionOptions[0]]
         updatedFilter.selectedPosition = [topPositionOptions[0]]
         updateFilterOption.positionOption = [topPositionOptions[0]]

         if (!this.state.isOnChangeDropDown) {
            let currentFilterValues = extend(true, {}, updatedFilter)
            retainingList.positionList = currentFilterValues.selectedPosition
            let currentFilterOptions = extend(true, {}, updateFilterOption)
            retainingList.positionOptionList =
               currentFilterOptions.positionOption
         }
      }
      this.setState({
         selectedFilterValue: updatedFilter,
         dropdownOptions: updateFilterOption,
      })
   }

   handleValidationForDropdownChange(dropdownName, selectedItem, changedItem) {
      const { singleSelectDropdownList } = this.state

      let validToChange = true
      if (!singleSelectDropdownList.includes(dropdownName)) {
         let alreadySelectedId, currentlySelectedId
         if (selectedItem && selectedItem.length) {
            alreadySelectedId = selectedItem[0].id
         }
         if (changedItem && changedItem.length) {
            currentlySelectedId = changedItem[0].id
         }
         validToChange = alreadySelectedId !== currentlySelectedId
      } else {
         let alreadySelectedItemLength =
            selectedItem && selectedItem.length ? selectedItem.length : 0
         let currentlySelectedItemLength =
            changedItem && changedItem.length ? changedItem.length : 0
         validToChange =
            alreadySelectedItemLength !== currentlySelectedItemLength
      }
      return validToChange
   }

   search(keywordName) {
      this.setState({ resetClicked: false, isKeywordTextLoading: false })
      let selectValue = extend(true, this.state.selectedFilterValue, {})
      selectValue.selectedKeywordOption = ''
      let defaultSelectedValues = extend(true, {}, selectValue)
      defaultSelectedValues.selectedKeywordOption = keywordName
      this.props.metaDataStructure.keywordSuggestOption =
         defaultSelectedValues.selectedKeywordOption
      this.props.keywordValueForFilter = keywordName
      this.setState({
         selectedFilterValue: defaultSelectedValues,
         applyClicked: false,
      })
   }

   getRetailerList(selectedRetailer) {
      const { getScrapDateForAllRetailer, metaDataStructure } = this.props

      if (getScrapDateForAllRetailer && getScrapDateForAllRetailer.length) {
         let scrapdatedata,
            dateList = []
         if (selectedRetailer && selectedRetailer.length > 1) {
            getScrapDateForAllRetailer.map((item) => {
               let changeDateFormat
               changeDateFormat = new Date(item.scrapdate)
               changeDateFormat = moment(changeDateFormat).format(DATE_FORMAT)
               dateList.push(new Date(changeDateFormat))
            })
            const maxDate = (dates) => new Date(Math.max(...dates))
            scrapdatedata = new Date(maxDate(dateList))
            scrapdatedata = moment(scrapdatedata).format(DATE_FORMAT)
            scrapDisplayDate = moment(scrapdatedata).format(DISPLAY_DATE_FORMAT)
         } else if (selectedRetailer && selectedRetailer.length === 1) {
            let scrapDateSet = false
            getScrapDateForAllRetailer.map((item) => {
               if (!scrapDateSet) {
                  scrapdatedata = new Date()
               }
               if (item.retailer === selectedRetailer[0].name) {
                  if (item.scrapdate) {
                     scrapdatedata = new Date(item.scrapdate)
                     scrapDateSet = true
                  } else {
                     scrapdatedata = new Date()
                  }
               }
               scrapdatedata = moment(scrapdatedata).format(DATE_FORMAT)
               scrapDisplayDate =
                  moment(scrapdatedata).format(DISPLAY_DATE_FORMAT)
            })
         }

         metaDataStructure.fromDate = scrapdatedata
         metaDataStructure.toDate = scrapdatedata
         let deselectPrepareValue = extend(
            true,
            this.state.selectedFilterValue,
            {}
         )
         let updatedFilter = extend(true, {}, deselectPrepareValue)
         updatedFilter.selectedDisplayDate = scrapDisplayDate
         this.setState({
            selectedFilterValue: updatedFilter,
            scrapDateToDisplay: scrapDisplayDate,
            datePickerValue: scrapDisplayDate,
         })
      }
   }

   //retailer change
   handleRetailerChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const {
         isDateChange,
         displayDropdownList,
         applyClicked,
         selectedFilterValue,
      } = this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.retailer,
         selectedFilterValue.selectedRetailer,
         data
      )

      const updatedFilter =
         this.handleSelectedOptionsToEmpty('selectedRetailer')
      updatedFilter.selectedRetailer =
         status !== null ? data : retainingList && retainingList.retailerList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.retailerOption =
            retainingList && retainingList.retailerOptionList
         if (
            displayDropdownList.includes(bundleHierarchy.city_set) ||
            displayDropdownList.includes(bundleHierarchy.pincode_set) ||
            displayDropdownList.includes(bundleHierarchy.store_set)
         ) {
            this.handleRetailerTypes(updatedFilter.selectedRetailer)
         }
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            if (
               displayDropdownList.includes(bundleHierarchy.city_set) ||
               displayDropdownList.includes(bundleHierarchy.pincode_set) ||
               displayDropdownList.includes(bundleHierarchy.store_set)
            ) {
               this.handleRetailerTypes(data)
            }
            filterRequestParams.retailerList = data
            filterRequestParams.selectedOption = bundleHierarchy.city
            if (displayDropdownList.includes(bundleHierarchy.super_category)) {
               this.props.getSuperCategoryMaster(filterRequestParams)
            }
            this.setState({
               applyClicked: false,
               isRetailerStatus: true,
               isSuperCategoryApiCalled: true,
               isSuperCategoryLoading: false,
               isChildSuperCategoryLoading: false,
               isCategoryLoading: false,
               isChildCategoryLoading: false,
               isSubCategoryLoading: false,
               isChildSubCategoryLoading: false,
               isBrandLoading: false,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
               isKeywordCategoryChangeStatus: false,
               keywordStatus: false,
               isOnChangeDropDown: true,
            })
            // For Future References
            // if (!isDateChange) {
            //    this.getRetailerList(data)
            // }
            metaDataStructure.retailer = PrepareStructure(data, 'objectName')
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //super category change
   handleSuperCategoryChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { displayDropdownList, applyClicked, selectedFilterValue } =
         this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.super_category,
         selectedFilterValue.selectedSuperCategory,
         data
      )

      const updatedFilter = this.handleSelectedOptionsToEmpty(
         'selectedSuperCategory'
      )
      updatedFilter.selectedSuperCategory =
         status !== null
            ? data
            : retainingList && retainingList.superCategoryList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.superCategoryOption =
            retainingList && retainingList.superCategoryOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.superCategoryList = data
            filterRequestParams.selectedOption = bundleHierarchy.city
            if (
               displayDropdownList.includes(
                  bundleHierarchy.child_super_category
               )
            ) {
               this.props.getChildSuperCategoryMaster(filterRequestParams)
            }
            this.setState({
               applyClicked: false,
               isChildSuperCategoryApiCalled: true,
               isChildSuperCategoryLoading: false,
               isCategoryLoading: false,
               isChildCategoryLoading: false,
               isSubCategoryLoading: false,
               isChildSubCategoryLoading: false,
               isBrandLoading: false,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
               isKeywordCategoryChangeStatus: false,
               keywordStatus: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.superCategory = PrepareStructure(
               data,
               'objectName'
            )
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //child super category change
   handleChildSuperCategoryChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { displayDropdownList, applyClicked, selectedFilterValue } =
         this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.child_super_category,
         selectedFilterValue.selectedChildSuperCategory,
         data
      )

      const updatedFilter = this.handleSelectedOptionsToEmpty(
         'selectedChildSuperCategory'
      )
      updatedFilter.selectedChildSuperCategory =
         status !== null
            ? data
            : retainingList && retainingList.childSuperCategoryList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.childSuperCategoryOption =
            retainingList && retainingList.childSuperCategoryOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.childSuperCategoryList = data
            filterRequestParams.selectedOption = bundleHierarchy.city
            if (displayDropdownList.includes(bundleHierarchy.category)) {
               this.props.getCategoryMaster(filterRequestParams)
            }
            this.setState({
               applyClicked: false,
               isCategoryApiCalled: true,
               isCategoryLoading: false,
               isChildCategoryLoading: false,
               isSubCategoryLoading: false,
               isChildSubCategoryLoading: false,
               isBrandLoading: false,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
               isKeywordCategoryChangeStatus: false,
               keywordStatus: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.childSuperCategory = PrepareStructure(
               data,
               'objectName'
            )
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //category change
   handleCategoryChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { displayDropdownList, applyClicked, selectedFilterValue } =
         this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.category,
         selectedFilterValue.selectedCategory,
         data
      )

      const updatedFilter =
         this.handleSelectedOptionsToEmpty('selectedCategory')
      updatedFilter.selectedCategory =
         status !== null ? data : retainingList && retainingList.categoryList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.categoryOption =
            retainingList && retainingList.categoryOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.categoryList = data
            filterRequestParams.selectedOption = bundleHierarchy.city
            if (displayDropdownList.includes(bundleHierarchy.child_category)) {
               this.props.getChildCategoryMaster(filterRequestParams)
            }
            this.setState({
               applyClicked: false,
               isChildCategoryApiCalled: true,
               isChildCategoryLoading: false,
               isSubCategoryLoading: false,
               isChildSubCategoryLoading: false,
               isBrandLoading: false,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
               isKeywordCategoryChangeStatus: false,
               keywordStatus: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.category = PrepareStructure(data, 'objectName')
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //child category change
   handleChildCategoryChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { displayDropdownList, applyClicked, selectedFilterValue } =
         this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.child_category,
         selectedFilterValue.selectedChildCategory,
         data
      )

      const updatedFilter = this.handleSelectedOptionsToEmpty(
         'selectedChildCategory'
      )
      updatedFilter.selectedChildCategory =
         status !== null
            ? data
            : retainingList && retainingList.childCategoryList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.childCategoryOption =
            retainingList && retainingList.childCategoryOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.childCategoryList = data
            filterRequestParams.selectedOption = bundleHierarchy.city
            if (displayDropdownList.includes(bundleHierarchy.sub_category)) {
               this.props.getSubCategoryMaster(filterRequestParams)
            }
            this.setState({
               applyClicked: false,
               isSubCategoryApiCalled: true,
               isSubCategoryLoading: false,
               isChildSubCategoryLoading: false,
               isBrandLoading: false,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
               isKeywordCategoryChangeStatus: false,
               keywordStatus: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.childCategory = PrepareStructure(
               data,
               'objectName'
            )
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //sub category change
   handleSubCategoryChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { displayDropdownList, applyClicked, selectedFilterValue } =
         this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.sub_category,
         selectedFilterValue.selectedSubCategory,
         data
      )

      const updatedFilter = this.handleSelectedOptionsToEmpty(
         'selectedSubCategory'
      )
      updatedFilter.selectedSubCategory =
         status !== null ? data : retainingList && retainingList.subCategoryList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.subCategoryOption =
            retainingList && retainingList.subCategoryOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.subCategoryList = data
            filterRequestParams.selectedOption = bundleHierarchy.city
            if (
               displayDropdownList.includes(bundleHierarchy.child_sub_category)
            ) {
               this.props.getChildSubCategoryMaster(filterRequestParams)
            }
            this.setState({
               applyClicked: false,
               isChildSubCategoryApiCalled: true,
               isChildSubCategoryLoading: false,
               isBrandLoading: false,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
               isKeywordCategoryChangeStatus: false,
               keywordStatus: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.subCategory = PrepareStructure(data, 'objectName')
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //child sub category change
   handleChildSubCategoryChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { displayDropdownList, applyClicked, selectedFilterValue } =
         this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.child_sub_category,
         selectedFilterValue.selectedChildSubCategory,
         data
      )

      const updatedFilter = this.handleSelectedOptionsToEmpty(
         'selectedChildSubCategory'
      )
      updatedFilter.selectedChildSubCategory =
         status !== null
            ? data
            : retainingList && retainingList.childSubCategoryList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.childSubCategoryOption =
            retainingList && retainingList.childSubCategoryOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.childSubCategoryList = data
            filterRequestParams.selectedOption = bundleHierarchy.city
            if (displayDropdownList.includes(bundleHierarchy.brand)) {
               this.props.getBrandMaster(filterRequestParams)
            }
            this.setState({
               applyClicked: false,
               isBrandApiCalled: true,
               isBrandLoading: false,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
               isKeywordCategoryChangeStatus: false,
               keywordStatus: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.childSubCategory = PrepareStructure(
               data,
               'objectName'
            )
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //brand change
   handleBrandChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { displayDropdownList, applyClicked, selectedFilterValue } =
         this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.brand,
         selectedFilterValue.selectedBrand,
         data
      )

      const updatedFilter = this.handleSelectedOptionsToEmpty('selectedBrand')
      updatedFilter.selectedBrand =
         status !== null ? data : retainingList && retainingList.brandList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.brandOption =
            retainingList && retainingList.brandOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.brandList = data
            filterRequestParams.selectedOption = bundleHierarchy.city
            if (displayDropdownList.includes(bundleHierarchy.sub_family)) {
               this.props.getSubFamilyMaster(filterRequestParams)
            }
            this.setState({
               applyClicked: false,
               isSubFamilyApiCalled: true,
               isSubFamilyLoading: false,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
               isKeywordCategoryChangeStatus: false,
               keywordStatus: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.brand = PrepareStructure(data, 'objectName')
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //sub family change
   handleSubFamilyChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { displayDropdownList, applyClicked, selectedFilterValue } =
         this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.sub_family,
         selectedFilterValue.selectedSubFamily,
         data
      )

      const updatedFilter =
         this.handleSelectedOptionsToEmpty('selectedSubFamily')
      updatedFilter.selectedSubFamily =
         status !== null ? data : retainingList && retainingList.subFamilyList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.subFamilyOption =
            retainingList && retainingList.subFamilyOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.subFamilyList = data
            filterRequestParams.selectedOption = bundleHierarchy.city
            if (displayDropdownList.includes(bundleHierarchy.sub_brand)) {
               this.props.getSubBrandMaster(filterRequestParams)
            }
            this.setState({
               applyClicked: false,
               isSubBrandApiCalled: true,
               isSubBrandLoading: false,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
               isKeywordCategoryChangeStatus: false,
               keywordStatus: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.subFamily = PrepareStructure(data, 'objectName')
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //sub brand change
   handleSubBrandChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { displayDropdownList, applyClicked, selectedFilterValue } =
         this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.sub_brand,
         selectedFilterValue.selectedSubBrand,
         data
      )

      const updatedFilter =
         this.handleSelectedOptionsToEmpty('selectedSubBrand')
      updatedFilter.selectedSubBrand =
         status !== null ? data : retainingList && retainingList.subBrandList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.subBrandOption =
            retainingList && retainingList.subBrandOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.subBrandList = data
            filterRequestParams.selectedOption = bundleHierarchy.city

            if (displayDropdownList.includes(bundleHierarchy.keyword_type)) {
               this.props.getKeywordCategoryMaster(filterRequestParams)
            }
            if (
               displayDropdownList.includes(bundleHierarchy.city_set) ||
               displayDropdownList.includes(bundleHierarchy.pincode_set) ||
               displayDropdownList.includes(bundleHierarchy.store_set)
            ) {
               this.props.getCityPincodeStoreMaster(filterRequestParams)
            }
            if (displayDropdownList.includes(bundleHierarchy.sku)) {
               this.props.getSkuMaster(filterRequestParams)
            }
            this.setState({
               applyClicked: false,
               isKeywordCategoryApiCalled: true,
               isCityApiCalled: true,
               isPincodeApiCalled: true,
               isStoreApiCalled: true,
               isSkuApiCalled: true,
               isKeywordCategoryLoading: false,
               isKeywordTypeLoading: false,
               isKeywordTagLoading: false,
               isKeywordsLoading: false,
               isCityLoading: false,
               isPincodeLoading: false,
               isStoreLoading: false,
               isRetailerCategoryLoading: false,
               isSkuLoading: false,
               isKeywordCategoryChangeStatus: false,
               keywordStatus: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.subBrand = PrepareStructure(data, 'objectName')
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //city change
   handleCitySetChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { applyClicked, selectedFilterValue } = this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.city_set,
         selectedFilterValue.selectedCitySet,
         data
      )

      const updatedFilter = this.handleSelectedOptionsToEmpty('selectedCitySet')
      updatedFilter.selectedCitySet =
         status !== null ? data : retainingList && retainingList.cityList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.citySetOption =
            retainingList && retainingList.cityOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.city = data
            filterRequestParams.selectedOption = 'pincode'
            this.props.getCityPincodeStoreMaster(filterRequestParams)
            this.setState({
               applyClicked: false,
               isPincodeApiCalled: true,
               isStoreApiCalled: true,
               isPincodeLoading: false,
               isStoreLoading: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.city = PrepareStructure(data, 'objectName')
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //pincode change
   handlePincodeSetChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { applyClicked, selectedFilterValue } = this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.pincode_set,
         selectedFilterValue.selectedPincodeSet,
         data
      )

      const updatedFilter =
         this.handleSelectedOptionsToEmpty('selectedPincodeSet')
      updatedFilter.selectedPincodeSet =
         status !== null ? data : retainingList && retainingList.pincodeList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.pincodeSetOption =
            retainingList && retainingList.pincodeOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.pincode = data
            filterRequestParams.selectedOption = bundleHierarchy.store
            this.props.getCityPincodeStoreMaster(filterRequestParams)
            this.setState({
               applyClicked: false,
               isStoreApiCalled: true,
               isStoreLoading: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.pincode = PrepareStructure(data, 'objectName')
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //store change
   handleStoreSetChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { displayDropdownList, applyClicked, selectedFilterValue } =
         this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.store_set,
         selectedFilterValue.selectedStoreSet,
         data
      )

      const updatedFilter =
         this.handleSelectedOptionsToEmpty('selectedStoreSet')
      updatedFilter.selectedStoreSet =
         status !== null ? data : retainingList && retainingList.storeList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.storeSetOption =
            retainingList && retainingList.storeOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.store = data
            if (
               displayDropdownList.includes(bundleHierarchy.retailers_category)
            ) {
               this.props.getRetailerCategoryMaster(filterRequestParams)
            }
            this.setState({
               applyClicked: false,
               isRetailerCategoryApiCalled: true,
               isRetailerCategoryLoading: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.store = PrepareStructure(data, 'objectName')
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //retailer category change
   handleRetCatChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { applyClicked, selectedFilterValue } = this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.retailers_category,
         selectedFilterValue.selectedRetailerCategory,
         data
      )

      const updatedFilter = this.handleSelectedOptionsToEmpty(
         'selectedRetailerCategory'
      )
      updatedFilter.selectedRetailerCategory =
         status !== null
            ? data
            : retainingList && retainingList.retailerCategoryList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.retailerCategoryOption =
            retainingList && retainingList.retailerCategoryOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            this.setState({
               applyClicked: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.retailerCategory = PrepareStructure(
               data,
               'objectName'
            )
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //keyword category change
   handleKeywordCategoryChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { displayDropdownList, applyClicked, selectedFilterValue } =
         this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.keyword_type,
         selectedFilterValue.selectedKeywordCategory,
         data
      )

      const updatedFilter = this.handleSelectedOptionsToEmpty(
         'selectedKeywordCategory'
      )
      updatedFilter.selectedKeywordCategory =
         status !== null
            ? data
            : retainingList && retainingList.keywordCategoryList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.keywordCategoryOption =
            retainingList && retainingList.keywordCategoryOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.keywordCategoryList = data
            if (displayDropdownList.includes(bundleHierarchy.skl_type)) {
               this.props.getKeywordTypeMaster(filterRequestParams)
            }
            this.setState({
               applyClicked: false,
               isKeywordTypeApiCalled: true,
               isKeywordTypeLoading: false,
               isKeywordCategoryChangeStatus: true,
               isOnChangeDropDown: true,
            })
            //when all keyword category selected isKeywordCategoryChangeStatus will be false
            if (
               status.action === 'select-option' &&
               status.option.label === 'Select All'
            ) {
               this.setState({ isKeywordCategoryChangeStatus: false })
            }
            metaDataStructure.keywordCategory = PrepareStructure(
               data,
               'objectName'
            )
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //keyword Type change
   handleKeywordTypeChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { displayDropdownList, applyClicked, selectedFilterValue } =
         this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.skl_type,
         selectedFilterValue.selectedKeywordType,
         data
      )

      const updatedFilter = this.handleSelectedOptionsToEmpty(
         'selectedKeywordType'
      )
      updatedFilter.selectedKeywordType =
         status !== null ? data : retainingList && retainingList.keywordTypeList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.keywordTypeOption =
            retainingList && retainingList.keywordTypeOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.keywordTypeList = data
            if (displayDropdownList.includes(bundleHierarchy.keyword_tag)) {
               this.props.getKeywordTagMaster(filterRequestParams)
            }
            this.setState({
               applyClicked: false,
               isKeywordTagApiCalled: true,
               isKeywordTagLoading: false,
               keywordStatus: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.keyword = PrepareStructure(data, 'objectName')
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //keyword Tag change
   handleKeywordTagChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { displayDropdownList, applyClicked, selectedFilterValue } =
         this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.keyword_tag,
         selectedFilterValue.selectedKeywordTag,
         data
      )
      const updatedFilter =
         this.handleSelectedOptionsToEmpty('selectedKeywordTag')
      updatedFilter.selectedKeywordTag =
         status !== null ? data : retainingList && retainingList.keywordTagList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.keywordTagOption =
            retainingList && retainingList.keywordTagOptionList
      }
      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.keywordTagList = data
            if (displayDropdownList.includes(bundleHierarchy.keyword)) {
               this.props.getKeywordsMaster(filterRequestParams)
            }
            this.setState({
               applyClicked: false,
               isKeywordsApiCalled: true,
               isKeywordsLoading: false,
               keywordStatus: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.keyword = PrepareStructure(data, 'objectName')
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //keyword change
   handleKeywordChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { applyClicked, selectedFilterValue } = this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.keyword,
         selectedFilterValue.selectedKeyword,
         data
      )

      const updatedFilter = this.handleSelectedOptionsToEmpty('selectedKeyword')
      updatedFilter.selectedKeyword =
         status !== null ? data : retainingList && retainingList.keywordList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.keywordOption =
            retainingList && retainingList.keywordOptionList
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            filterRequestParams.keywordList = data
            this.setState({
               applyClicked: false,
               keywordStatus: true,
               isOnChangeDropDown: true,
            })
            //when all keyword selected keywordStatus will be false
            if (
               status.action === 'select-option' &&
               status.option.label === 'Select All'
            ) {
               this.setState({ keywordStatus: false })
            }
            metaDataStructure.keyword = PrepareStructure(data, 'objectName')
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   //position change
   handlePositionChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { applyClicked } = this.state
      const updatedFilter =
         this.handleSelectedOptionsToEmpty('selectedPosition')
      updatedFilter.selectedPosition =
         status !== null ? data : retainingList && retainingList.positionList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.positionOption =
            retainingList && retainingList.positionOptionList
      }

      let positionValue = []
      data &&
         data.length &&
         data.map((item) => {
            let splitPosition = item.value && item.value.split('Top ')
            item.value === 'First Page'
               ? positionValue.push(item.value)
               : positionValue.push(splitPosition[1])
         })
      //Position always be single select
      metaDataStructure.position = positionValue[0]
      if (status !== null) {
         retainingData.isNavigation = false
         this.setState({
            isOnChangeDropDown: true,
         })
      }
      this.setState({
         applyClicked: false,
         selectedFilterValue: updatedFilter,
      })
   }

   //sku change
   handleSkuChange = (data, status) => {
      const { metaDataStructure, retainingData } = this.props
      const { applyClicked, selectedFilterValue } = this.state
      let validToChange = this.handleValidationForDropdownChange(
         bundleHierarchy.sku,
         selectedFilterValue.selectedSku,
         data
      )

      const updatedFilter = this.handleSelectedOptionsToEmpty('selectedSku')
      updatedFilter.selectedSku =
         status !== null ? data : retainingList && retainingList.skuList
      if (!applyClicked && status === null) {
         let updateFilterOption = extend(true, this.state.dropdownOptions, {})
         updateFilterOption.skuOption =
            retainingList && retainingList.skuOptionList
      }
      if (updatedFilter.selectedSku && updatedFilter.selectedSku.length) {
         updatedFilter.selectedSku.map((skuItem, skuIndex) => {
            if (skuIndex === 0 && skuItem !== undefined) {
               this.setState({ isPowerSku: skuItem.tag })
            }
         })
      }

      if (validToChange) {
         if (status !== null) {
            retainingData.isNavigation = false
            this.setState({
               applyClicked: false,
               isOnChangeDropDown: true,
            })
            metaDataStructure.skuSet = PrepareStructure(data, 'objectName')
         }
      }
      this.setState({ selectedFilterValue: updatedFilter })
   }

   handleReloadClickBtn(dropdownName) {
      filterRequestParams.selectedOption = 'city'
      if (dropdownName == bundleHierarchy.retailer) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getRetailerMaster(filterRequestParams)
         this.setState({ isRetailerApiCalled: true })
      } else if (dropdownName == bundleHierarchy.super_category) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getSuperCategoryMaster(filterRequestParams)
         this.setState({ isSuperCategoryApiCalled: true })
      } else if (dropdownName == bundleHierarchy.child_super_category) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getChildSuperCategoryMaster(filterRequestParams)
         this.setState({ isChildSuperCategoryApiCalled: true })
      } else if (dropdownName == bundleHierarchy.category) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getCategoryMaster(filterRequestParams)
         this.setState({ isCategoryApiCalled: true })
      } else if (dropdownName == bundleHierarchy.child_category) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getChildCategoryMaster(filterRequestParams)
         this.setState({ isChildCategoryApiCalled: true })
      } else if (dropdownName == bundleHierarchy.sub_category) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getSubCategoryMaster(filterRequestParams)
         this.setState({ isSubCategoryApiCalled: true })
      } else if (dropdownName == bundleHierarchy.child_sub_category) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getChildSubCategoryMaster(filterRequestParams)
         this.setState({ isChildSubCategoryApiCalled: true })
      } else if (dropdownName == bundleHierarchy.brand) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getBrandMaster(filterRequestParams)
         this.setState({ isBrandApiCalled: true })
      } else if (dropdownName == bundleHierarchy.sub_family) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getSubFamilyMaster(filterRequestParams)
         this.setState({ isSubFamilyApiCalled: true })
      } else if (dropdownName == bundleHierarchy.sub_brand) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getSubBrandMaster(filterRequestParams)
         this.setState({ isSubBrandApiCalled: true })
      } else if (dropdownName == bundleHierarchy.keyword_type) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getKeywordCategoryMaster(filterRequestParams)
         this.setState({ isKeywordCategoryApiCalled: true })
      } else if (dropdownName == bundleHierarchy.skl_type) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getKeywordTypeMaster(filterRequestParams)
         this.setState({ isKeywordTypeApiCalled: true })
      } else if (dropdownName == bundleHierarchy.keyword_tag) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getKeywordTagMaster(filterRequestParams)
         this.setState({ isKeywordTagApiCalled: true })
      } else if (dropdownName == bundleHierarchy.keyword) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getKeywordsMaster(filterRequestParams)
         this.setState({ isKeywordsApiCalled: true })
      } else if (dropdownName == bundleHierarchy.retailers_category) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getRetailerCategoryMaster(filterRequestParams)
         this.setState({ isRetailerCategoryApiCalled: true })
      } else if (dropdownName == bundleHierarchy.sku) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getSkuMaster(filterRequestParams)
         this.setState({ isSkuApiCalled: true })
      } else if (dropdownName == bundleHierarchy.city_set) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         this.props.getCityPincodeStoreMaster(filterRequestParams)
         this.setState({ isCityApiCalled: true })
      } else if (dropdownName == bundleHierarchy.pincode_set) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         filterRequestParams.selectedOption = 'pincode'
         this.props.getCityPincodeStoreMaster(filterRequestParams)
         this.setState({ isPincodeApiCalled: true })
      } else if (dropdownName == bundleHierarchy.store_set) {
         cascadingApiSuccessAndReload[dropdownName + 'isReloadApi'] = true
         filterRequestParams.selectedOption = 'store'
         this.props.getCityPincodeStoreMaster(filterRequestParams)
         this.setState({ isStoreApiCalled: true })
      }
   }

   handleClickToReload(dropdownName, isReload) {
      return (
         <div
            className="filter-reload-container"
            onClick={this.handleReloadClickBtn.bind(this, dropdownName)}
         >
            <Row className="filter-reload">
               <div style={{ width: '100px' }}> Click to reload</div>
               {isReload ? (
                  <i class="fa fa-refresh filterreloadButton rotate"></i>
               ) : (
                  <i class="fa fa-refresh filterreloadButton"></i>
               )}{' '}
            </Row>
         </div>
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
      isLoading,
      isSuccess,
      isReload
   ) {
      const { enabledDropdownList } = this.state
      // sorting need to implement and to control from page level
      if (options && options.length) {
         // name !== bundleHierarchy.position &&
         // 	options.sort(sortArrayOfObjectValues('label'))
         const array_move = (arr, old_index, new_index) => {
            if (new_index >= arr.length) {
               var k = new_index - arr.length + 1
               while (k--) {
                  arr.push(undefined)
               }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
            return arr
         }
         if (defaultValue && defaultValue.length === 1) {
            if(defaultValue && defaultValue[0] != undefined){
            let position = options.findIndex(
               (x) => x.id === (defaultValue && defaultValue[0].id)
            )
            let result = array_move(options, position, 0)
            result = [...new Set(result)]
            options = result
            }
         }
      }
      return (
         <div className={dynamicClassName}>
            <p className="dropdownTitleStyle">
               {name === bundleHierarchy.sub_family
                  ? bundleHierarchy.product_type
                  : name === bundleHierarchy.skl_type
                  ? bundleHierarchy.keyword_type
                  : name === bundleHierarchy.keyword_type
                  ? bundleHierarchy.keyword_category
                  : name === bundleHierarchy.city_set
                  ? bundleHierarchy.city
                  : name === bundleHierarchy.pincode_set
                  ? bundleHierarchy.location
                  : name === bundleHierarchy.store_set
                  ? bundleHierarchy.store
                  : name === bundleHierarchy.child_super_category
                  ? bundleHierarchy.super_category
                  : name === bundleHierarchy.child_category
                  ? bundleHierarchy.category
                  : name === bundleHierarchy.child_sub_category
                  ? bundleHierarchy.sub_category
                  : name}
            </p>
            {isSuccess ? (
               <SearchableDropdown
                  options={options}
                  onChange={handleChange}
                  isLoading={isLoading}
                  disabled={!enabledDropdownList.includes(name)}
                  defaultValuePassed={preferred ? defaultValue : selectedValue}
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
                        ? options &&
                          options.length > 0 &&
                          ((selectedValue && selectedValue.length === 0) ||
                             (selectedValue && selectedValue[0] === undefined))
                           ? 'Select option'
                           : ((selectedValue && selectedValue.length === 0) ||
                                (selectedValue &&
                                   selectedValue[0] === undefined)) &&
                             bundleHierarchy.no_option
                        : name !== bundleHierarchy.position && 'Loading...'
                  }
                  isFreeHandSelect={this.props.isFreeHandSelect}
               />
            ) : (
               this.handleClickToReload(name, isReload)
            )}
         </div>
      )
   }

   //must sell change
   handleMustSellChange(mustSell) {
      const { metaDataStructure } = this.props
      const isChecked = mustSell.target.checked
      this.props.retainingData.clickStatus = true
      this.props.retainingData.resetClicked = false

      let updatedFilter = extend(true, {}, this.state.selectedFilterValue)
      updatedFilter.selectedMustsellsku = isChecked
      this.setState({
         applyClicked: false,
         selectedFilterValue: updatedFilter,
      })
      metaDataStructure.powerSku = isChecked
   }

   renderMustSellDropDown() {
      const { selectedFilterValue, enabledDropdownList } = this.state
      let checkboxDisable = !enabledDropdownList.includes(
         bundleHierarchy.mustsell
      )
         ? 'checkBoxdisable'
         : 'normal'
      return (
         <div className="mustSellDiv">
            <div>
               <input
                  type="checkbox"
                  name="optionsRadios"
                  id={checkboxDisable}
                  className="filterMustSell"
                  onChange={this.handleMustSellChange}
                  checked={
                     selectedFilterValue &&
                     selectedFilterValue.selectedMustsellsku
                  }
                  label={bundleHierarchy.filter_Label}
                  value="other"
                  disabled={
                     !enabledDropdownList.includes(bundleHierarchy.mustsell)
                  }
               />
               <div className="checkboxLabel">
                  <label for={checkboxDisable} style={{ cursor: 'pointer' }}>
                     {/* {bundleHierarchy.only_power_skus} */}
                     {POWER_SKU}
                  </label>
               </div>
            </div>
         </div>
      )
   }

   //date change
   dateOnChange(value) {
      const { metaDataStructure, retainingData } = this.props
      let deselectPrepareValue = extend(
         true,
         this.state.selectedFilterValue,
         {}
      )
      deselectPrepareValue.selectedDisplayDate = ''
      let updatedFilter = extend(true, {}, deselectPrepareValue)
      updatedFilter.selectedDisplayDate = value
      this.setState({
         applyClicked: false,
         selectedFilterValue: updatedFilter,
         isDateChange: true,
         datePickerValue: moment(new Date(value)).format(DISPLAY_DATE_FORMAT),
      })
      let selectedDateValue = moment(new Date(value)).format(DATE_FORMAT)
      //all dropdown's api will call, if date changed
      if (filterRequestParams.toDate !== selectedDateValue) {
         filterRequestParams.toDate = selectedDateValue
         filterRequestParams.selectedOption = bundleHierarchy.city
         retainingData.isNavigation = false
         this.props.getRetailerMaster(filterRequestParams)
         this.setState({
            isRetailerApiCalled: true,
            isRetailerLoading: false,
            isSuperCategoryLoading: false,
            isChildSuperCategoryLoading: false,
            isCategoryLoading: false,
            isChildCategoryLoading: false,
            isSubCategoryLoading: false,
            isChildSubCategoryLoading: false,
            isBrandLoading: false,
            isSubFamilyLoading: false,
            isSubBrandLoading: false,
            isKeywordCategoryLoading: false,
            isKeywordTypeLoading: false,
            isKeywordTagLoading: false,
            isKeywordsLoading: false,
            isCityLoading: false,
            isPincodeLoading: false,
            isStoreLoading: false,
            isRetailerCategoryLoading: false,
            isSkuLoading: false,
         })
      }
      metaDataStructure.fromDate = ''
      metaDataStructure.fromDate = selectedDateValue
      metaDataStructure.toDate = selectedDateValue
      this.props.retainingData.clickStatus = true
      this.props.retainingData.resetClicked = false
   }

   renderDatePicker() {
      const { isShowOnlyScrapDates, frequencyScrapDay, frequencyScrapDates } =
         this.props
      return (
         <>
            <div className="dropdown-date-style">
               {bundleHierarchy.date}
               <DatePickerControl
                  className="dropdownDateField"
                  onChange={this.dateOnChange}
                  borderDisable={true}
                  value={
                     this.state.selectedFilterValue &&
                     this.state.selectedFilterValue.selectedDisplayDate
                  }
                  beforeDate={this.state.scrapDateToDisplay}
                  isShowOnlySearchScrapDates={isShowOnlyScrapDates}
                  frequencyScrapDay={frequencyScrapDay}
                  frequencyScrapDates={frequencyScrapDates}
                  isDateLabelNeeded={false}
                  datePickerContainerClassname="filter-date-picker-container-style"
                  datePickerInputTextClassname="filter-date-picker-input-text-style"
                  datePickerCalenderIconClassname="filter-date-picker-calender-icon-style"
                  datePickerMainContainerClassname="filter-date-picker-main-container-style"
                  datePickerValue={this.state.datePickerValue}
                  dateTooltipTrigger={true}
               />
            </div>
         </>
      )
   }

   validToApply() {
      const {
         metaDataStructure,
         retainingData,
         hideDropdownListWithFunctionality,
      } = this.props
      const { selectedFilterValue, dropdownOptions } = this.state

      metaDataStructure.hideDropdown = hideDropdownListWithFunctionality.filter(
         (item) => !dropdownListForEsFilter.includes(item)
      )

      retainingData.clickStatus = true
      retainingData.resetClicked = false
      retainingData.applyStatus = true
      retainingData.isNavigation = false
      retainingData.retailerName = selectedFilterValue.selectedRetailer
      retainingData.superCategoryName =
         selectedFilterValue.selectedSuperCategory
      retainingData.childSuperCategoryName =
         selectedFilterValue.selectedChildSuperCategory
      retainingData.categoryName = selectedFilterValue.selectedCategory
      retainingData.childCategoryName =
         selectedFilterValue.selectedChildCategory
      retainingData.subCategoryName = selectedFilterValue.selectedSubCategory
      retainingData.childSubCategoryName =
         selectedFilterValue.selectedChildSubCategory
      retainingData.brandName = selectedFilterValue.selectedBrand
      retainingData.subFamilyName = selectedFilterValue.selectedSubFamily
      retainingData.subBrandName = selectedFilterValue.selectedSubBrand
      retainingData.citySetName = selectedFilterValue.selectedCitySet
      retainingData.pincodeSetName = selectedFilterValue.selectedPincodeSet
      retainingData.storeSetName = selectedFilterValue.selectedStoreSet
      retainingData.retailerCategoryName =
         selectedFilterValue.selectedRetailerCategory
      retainingData.keywordCategoryName =
         selectedFilterValue.selectedKeywordCategory
      retainingData.keywordName = selectedFilterValue.selectedKeyword
      retainingData.skuName = selectedFilterValue.selectedSku
      retainingData.positionNumber = selectedFilterValue.selectedPosition
      retainingData.powerSku = selectedFilterValue.selectedMustsellsku
      retainingData.dateValue = selectedFilterValue.selectedDisplayDate
      metaDataStructure.productname = ''

      retainingList = {
         //retaining values
         retailerList: selectedFilterValue.selectedRetailer,
         superCategoryList: selectedFilterValue.selectedSuperCategory,
         childSuperCategoryList: selectedFilterValue.selectedChildSuperCategory,
         categoryList: selectedFilterValue.selectedCategory,
         childCategoryList: selectedFilterValue.selectedChildCategory,
         subCategoryList: selectedFilterValue.selectedSubCategory,
         childSubCategoryList: selectedFilterValue.selectedChildSubCategory,
         brandList: selectedFilterValue.selectedBrand,
         subFamilyList: selectedFilterValue.selectedSubFamily,
         subBrandList: selectedFilterValue.selectedSubBrand,
         cityList: selectedFilterValue.selectedCitySet,
         pincodeList: selectedFilterValue.selectedPincodeSet,
         storeList: selectedFilterValue.selectedStoreSet,
         retailerCategoryList: selectedFilterValue.selectedRetailerCategory,
         keywordCategoryList: selectedFilterValue.selectedKeywordCategory,
         keywordList: selectedFilterValue.selectedKeyword,
         skuList: selectedFilterValue.selectedSku,
         positionList: selectedFilterValue.selectedPosition,
         powerSku: selectedFilterValue.selectedMustsellsku,
         displayDate: selectedFilterValue.selectedDisplayDate,
         //retaining options
         retailerOptionList: dropdownOptions.retailerOption,
         superCategoryOptionList: dropdownOptions.superCategoryOption,
         childSuperCategoryOptionList: dropdownOptions.childSuperCategoryOption,
         categoryOptionList: dropdownOptions.categoryOption,
         childCategoryOptionList: dropdownOptions.childCategoryOption,
         subCategoryOptionList: dropdownOptions.subCategoryOption,
         childSubCategoryOptionList: dropdownOptions.childSubCategoryOption,
         brandOptionList: dropdownOptions.brandOption,
         subFamilyOptionList: dropdownOptions.subFamilyOption,
         subBrandOptionList: dropdownOptions.subBrandOption,
         cityOptionList: dropdownOptions.citySetOption,
         pincodeOptionList: dropdownOptions.pincodeSetOption,
         storeOptionList: dropdownOptions.storeSetOption,
         retailerCategoryOptionList: dropdownOptions.retailerCategoryOption,
         keywordCategoryOptionList: dropdownOptions.keywordCategoryOption,
         keywordOptionList: dropdownOptions.keywordOption,
         skuOptionList: dropdownOptions.skuOption,
         positionOptionList: dropdownOptions.positionOption,
      }

      this.props.handleApplyFilter(
         this.state.isRetailerStatus,
         false,
         metaDataStructure,
         retainingData,
         this.state.isKeywordCategoryChangeStatus,
         this.state.keywordStatus
      )
      this.setState({
         isApplyClicked: false,
         isSkuDataAvailable: true,
         retailerRestricted: true,
         isPowerSkuValidation: true,
         isValuesSelectedValidation: true,
      })
   }

   handleApply() {
      const { metaDataStructure, isRestrictRetailer } = this.props
      const { selectedFilterValue, displayDropdownList, isPowerSku } =
         this.state
      this.setState({
         applyClicked: true,
         isApplyClicked: true,
         closeFilter: false,
      })
      if (listOfNotSelectedDropdown !== '' && this.props.isFreeHandDropdown) {
         this.setState({ isValuesSelectedValidation: false })
      } else {
         if (
            metaDataStructure &&
            metaDataStructure.skuSet &&
            metaDataStructure.skuSet.length &&
            metaDataStructure.hasOwnProperty('skuSet') &&
            displayDropdownList.includes(bundleHierarchy.sku)
         ) {
            if (metaDataStructure.skuSet[0] === undefined) {
               this.setState({
                  isSkuDataAvailable: false,
               })
            } else if (selectedFilterValue.selectedMustsellsku) {
               if (isPowerSku !== selectedFilterValue.selectedMustsellsku) {
                  this.setState({ isPowerSkuValidation: false })
               } else {
                  this.validToApply()
               }
            } else {
               this.validToApply()
            }
         } else if (
            isRestrictRetailer &&
            metaDataStructure.hasOwnProperty('retailer')
         ) {
            if (metaDataStructure && metaDataStructure.retailer.length > 5) {
               this.setState({
                  retailerRestricted: false,
               })
            } else {
               this.validToApply()
            }
         } else {
            this.validToApply()
         }
      }
   }

   handleEnableAndDisableForApplyButton() {
      const {
         isRetailerLoading,
         isSuperCategoryLoading,
         isChildSuperCategoryLoading,
         isCategoryLoading,
         isChildCategoryLoading,
         isSubCategoryLoading,
         isChildSubCategoryLoading,
         isBrandLoading,
         isSubFamilyLoading,
         isSubBrandLoading,
         isKeywordCategoryLoading,
         isKeywordTypeLoading,
         isKeywordTagLoading,
         isKeywordsLoading,
         isCityLoading,
         isPincodeLoading,
         isStoreLoading,
         isRetailerCategoryLoading,
         isSkuLoading,
         displayDropdownList,
         selectedFilterValue,
      } = this.state
      let isApplyButtonEnabled = false,
         enabledDropdownValuesObject = {}
      if (selectedFilterValue) {
         if (
            displayDropdownList.includes(bundleHierarchy.retailer) &&
            dropdownListForEsFilter.includes(bundleHierarchy.retailer)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isRetailerLoading
               : selectedFilterValue.selectedRetailer &&
                 selectedFilterValue.selectedRetailer.length
               ? isRetailerLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.retailer] =
               selectedFilterValue.selectedRetailer &&
               selectedFilterValue.selectedRetailer.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.super_category) &&
            dropdownListForEsFilter.includes(bundleHierarchy.super_category)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isSuperCategoryLoading
               : selectedFilterValue.selectedSuperCategory &&
                 selectedFilterValue.selectedSuperCategory.length
               ? isSuperCategoryLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.super_category] =
               selectedFilterValue.selectedSuperCategory &&
               selectedFilterValue.selectedSuperCategory.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(
               bundleHierarchy.child_super_category
            ) &&
            dropdownListForEsFilter.includes(
               bundleHierarchy.child_super_category
            )
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isChildSuperCategoryLoading
               : selectedFilterValue.selectedChildSuperCategory &&
                 selectedFilterValue.selectedChildSuperCategory.length
               ? isChildSuperCategoryLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.child_super_category] =
               selectedFilterValue.selectedChildSuperCategory &&
               selectedFilterValue.selectedChildSuperCategory.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.category) &&
            dropdownListForEsFilter.includes(bundleHierarchy.category)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isCategoryLoading
               : selectedFilterValue.selectedCategory &&
                 selectedFilterValue.selectedCategory.length
               ? isCategoryLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.category] =
               selectedFilterValue.selectedCategory &&
               selectedFilterValue.selectedCategory.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.child_category) &&
            dropdownListForEsFilter.includes(bundleHierarchy.child_category)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isChildCategoryLoading
               : selectedFilterValue.selectedChildCategory &&
                 selectedFilterValue.selectedChildCategory.length
               ? isChildCategoryLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.child_category] =
               selectedFilterValue.selectedChildCategory &&
               selectedFilterValue.selectedChildCategory.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.sub_category) &&
            dropdownListForEsFilter.includes(bundleHierarchy.sub_category)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isSubCategoryLoading
               : selectedFilterValue.selectedSubCategory &&
                 selectedFilterValue.selectedSubCategory.length
               ? isSubCategoryLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.sub_category] =
               selectedFilterValue.selectedSubCategory &&
               selectedFilterValue.selectedSubCategory.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.child_sub_category) &&
            dropdownListForEsFilter.includes(bundleHierarchy.child_sub_category)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isChildSubCategoryLoading
               : selectedFilterValue.selectedChildSubCategory &&
                 selectedFilterValue.selectedChildSubCategory.length
               ? isChildSubCategoryLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.child_sub_category] =
               selectedFilterValue.selectedChildSubCategory &&
               selectedFilterValue.selectedChildSubCategory.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.brand) &&
            dropdownListForEsFilter.includes(bundleHierarchy.brand)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isBrandLoading
               : selectedFilterValue.selectedBrand &&
                 selectedFilterValue.selectedBrand.length
               ? isBrandLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.brand] =
               selectedFilterValue.selectedBrand &&
               selectedFilterValue.selectedBrand.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.sub_family) &&
            dropdownListForEsFilter.includes(bundleHierarchy.sub_family)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isSubFamilyLoading
               : selectedFilterValue.selectedSubFamily &&
                 selectedFilterValue.selectedSubFamily.length
               ? isSubFamilyLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.sub_family] =
               selectedFilterValue.selectedSubFamily &&
               selectedFilterValue.selectedSubFamily.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.sub_brand) &&
            dropdownListForEsFilter.includes(bundleHierarchy.sub_brand)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isSubBrandLoading
               : selectedFilterValue.selectedSubBrand &&
                 selectedFilterValue.selectedSubBrand.length
               ? isSubBrandLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.sub_brand] =
               selectedFilterValue.selectedSubBrand &&
               selectedFilterValue.selectedSubBrand.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.keyword_type) &&
            dropdownListForEsFilter.includes(bundleHierarchy.keyword_type)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isKeywordCategoryLoading
               : selectedFilterValue.selectedKeywordCategory &&
                 selectedFilterValue.selectedKeywordCategory.length
               ? isKeywordCategoryLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.keyword_type] =
               selectedFilterValue.selectedKeywordCategory &&
               selectedFilterValue.selectedKeywordCategory.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.skl_type) &&
            dropdownListForEsFilter.includes(bundleHierarchy.skl_type)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isKeywordTypeLoading
               : selectedFilterValue.selectedKeywordType &&
                 selectedFilterValue.selectedKeywordType.length
               ? isKeywordTypeLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.skl_type] =
               selectedFilterValue.selectedKeywordType &&
               selectedFilterValue.selectedKeywordType.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.keyword_tag) &&
            dropdownListForEsFilter.includes(bundleHierarchy.keyword_tag)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isKeywordTagLoading
               : selectedFilterValue.selectedKeywordTag &&
                 selectedFilterValue.selectedKeywordTag.length
               ? isKeywordTagLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.keyword_tag] =
               selectedFilterValue.selectedKeywordTag &&
               selectedFilterValue.selectedKeywordTag.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.keyword) &&
            dropdownListForEsFilter.includes(bundleHierarchy.keyword)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isKeywordsLoading
               : selectedFilterValue.selectedKeyword &&
                 selectedFilterValue.selectedKeyword.length
               ? isKeywordsLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.keyword] =
               selectedFilterValue.selectedKeyword &&
               selectedFilterValue.selectedKeyword.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.city_set) &&
            dropdownListForEsFilter.includes(bundleHierarchy.city_set)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isCityLoading
               : selectedFilterValue.selectedCitySet &&
                 selectedFilterValue.selectedCitySet.length
               ? isCityLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.city_set] =
               selectedFilterValue.selectedCitySet &&
               selectedFilterValue.selectedCitySet.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.pincode_set) &&
            dropdownListForEsFilter.includes(bundleHierarchy.pincode_set)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isPincodeLoading
               : selectedFilterValue.selectedPincodeSet &&
                 selectedFilterValue.selectedPincodeSet.length
               ? isPincodeLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.pincode_set] =
               selectedFilterValue.selectedPincodeSet &&
               selectedFilterValue.selectedPincodeSet.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.store_set) &&
            dropdownListForEsFilter.includes(bundleHierarchy.store_set)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isStoreLoading
               : selectedFilterValue.selectedStoreSet &&
                 selectedFilterValue.selectedStoreSet.length
               ? isStoreLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.store_set] =
               selectedFilterValue.selectedStoreSet &&
               selectedFilterValue.selectedStoreSet.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.retailers_category) &&
            dropdownListForEsFilter.includes(bundleHierarchy.retailers_category)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isRetailerCategoryLoading
               : selectedFilterValue.selectedRetailerCategory &&
                 selectedFilterValue.selectedRetailerCategory.length
               ? isRetailerCategoryLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.retailers_category] =
               selectedFilterValue.selectedRetailerCategory &&
               selectedFilterValue.selectedRetailerCategory.length > 0
                  ? true
                  : false
         }
         if (
            displayDropdownList.includes(bundleHierarchy.sku) &&
            dropdownListForEsFilter.includes(bundleHierarchy.sku)
         ) {
            isApplyButtonEnabled = this.props.isFreeHandDropdown
               ? isSkuLoading
               : selectedFilterValue.selectedSku &&
                 selectedFilterValue.selectedSku.length
               ? isSkuLoading
               : false
            enabledDropdownValuesObject[bundleHierarchy.sku] =
               selectedFilterValue.selectedSku &&
               selectedFilterValue.selectedSku.length > 0
                  ? true
                  : false
         }
      }
      //used to get what are the enabled ui dropdown values not selected
      //based on this validation will throws
      if (isApplyButtonEnabled && this.props.isFreeHandDropdown) {
         listOfNotSelectedDropdown = ''
         if (this.state.isOnChangeDropDown) {
            let listOfNames = []
            dropdownListForEsFilter.map((names) => {
               if (
                  enabledDropdownValuesObject != null &&
                  !enabledDropdownValuesObject[names]
               ) {
                  listOfNames.push(
                     names === bundleHierarchy.sub_family
                        ? bundleHierarchy.product_type
                        : names === bundleHierarchy.skl_type
                        ? bundleHierarchy.keyword_type
                        : names === bundleHierarchy.keyword_type
                        ? bundleHierarchy.keyword_category
                        : names === bundleHierarchy.city_set
                        ? bundleHierarchy.city
                        : names === bundleHierarchy.pincode_set
                        ? bundleHierarchy.location
                        : names === bundleHierarchy.store_set
                        ? bundleHierarchy.store
                        : names === bundleHierarchy.child_super_category
                        ? bundleHierarchy.super_category
                        : names === bundleHierarchy.child_category
                        ? bundleHierarchy.category
                        : names === bundleHierarchy.child_sub_category
                        ? bundleHierarchy.sub_category
                        : names
                  )
               }
            })
            listOfNames.map((item, index) => {
               listOfNotSelectedDropdown += item
               if (index !== listOfNames.length - 1) listOfNotSelectedDropdown += ', '
            })
         }
      }
      return isApplyButtonEnabled
   }

   renderFilterApplyButton() {
      return (
         <div
            className="filter-apply-button-col-style"
            style={{
               cursor: this.handleEnableAndDisableForApplyButton()
                  ? 'pointer'
                  : 'no-drop',
            }}
         >
            <Button
               className={
                  this.handleEnableAndDisableForApplyButton()
                     ? 'filter-apply-button-style'
                     : 'filter-disable-apply-button-style'
               }
               onClick={this.handleApply}
            >
               {' '}
               {bundleHierarchy.apply}{' '}
            </Button>
         </div>
      )
   }

   closeFilter() {
      this.setState({
         applyClicked: false,
         keywordStatus: false,
         isApplyClicked: false,
      })

      this.state.selectedFilterValue.selectedMustsellsku =
         retainingList.powerSku
      this.state.selectedFilterValue.selectedDisplayDate =
         retainingList.displayDate
      this.props.handleCloseFilter(false)
   }

   renderDropDownFunc = (data) => {
      const { isLocationBasedRetailer, isStoreBasedRetailer } = this.state

      if (
         data === bundleHierarchy.city_set ||
         data === bundleHierarchy.pincode_set
      ) {
         if (isLocationBasedRetailer || isStoreBasedRetailer) {
            dropdownCount.push(data)
         }
      } else if (data === bundleHierarchy.store_set) {
         if (isStoreBasedRetailer) {
            dropdownCount.push(data)
         }
      } else {
         dropdownCount.push(data)
      }
      dropdownCount.filter(function (item, pos, self) {
         return self.indexOf(item) == pos
      })
   }

   handleHideToastModal = (
      isSku,
      isRetailer,
      isMustSellSku,
      isValuesSelected
   ) => {
      this.setState({
         isApplyClicked: false,
         isSkuDataAvailable: isSku,
         retailerRestricted: isRetailer,
         isPowerSkuValidation: isMustSellSku,
         isValuesSelectedValidation: isValuesSelected,
      })
   }

   renderFilterCard() {
      const {
         hideDropdownListWithFunctionality,
         isSliderNeeded,
         additionalsearchForFilter,
         toastModalTitleContent
      } = this.props
      const {
         displayDropdownList,
         singleSelectDropdownList,
         dropdownOptions,
         selectedFilterValue,
         isApplyClicked,
         isSkuDataAvailable,
         retailerRestricted,
         isPowerSkuValidation,
         isStoreBasedRetailer,
         isLocationBasedRetailer,
         firstDropdown,
         closeIconFilter,
         isValuesSelectedValidation,
      } = this.state
      let positionOptions = topPositionOptions
      let colValue = '10'
      return (
         <Card className="filter-card-style">
            <Col xl={colValue} lg={colValue} md={colValue} sm={colValue}>
               <div className="row-filter flex-row d-flex">
                  {displayDropdownList.includes(bundleHierarchy.retailer) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.retailer
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.retailerOption,
                        this.handleRetailerChange,
                        bundleHierarchy.retailer,
                        this.props.isPreferredRetailer,
                        defaultRetailerValue,
                        selectedFilterValue.selectedRetailer,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.retailer
                        ),
                        false,
                        firstDropdown === bundleHierarchy.retailer
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isRetailerLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.retailer + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.retailer + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(
                     bundleHierarchy.super_category
                  ) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.super_category
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.superCategoryOption,
                        this.handleSuperCategoryChange,
                        bundleHierarchy.super_category,
                        this.props.isPreferredSuperCategory,
                        defaultSuperCategoryValue,
                        selectedFilterValue.selectedSuperCategory,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.super_category
                        ),
                        false,
                        firstDropdown === bundleHierarchy.super_category
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isSuperCategoryLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.super_category + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.super_category + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(
                     bundleHierarchy.child_super_category
                  ) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.child_super_category
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.childSuperCategoryOption,
                        this.handleChildSuperCategoryChange,
                        bundleHierarchy.child_super_category,
                        this.props.isPreferredChildSuperCategory,
                        defaultChildSuperCategoryValue,
                        selectedFilterValue.selectedChildSuperCategory,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.child_super_category
                        ),
                        false,
                        firstDropdown === bundleHierarchy.child_super_category
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isChildSuperCategoryLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.child_super_category + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.child_super_category + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(bundleHierarchy.category) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.category
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.categoryOption,
                        this.handleCategoryChange,
                        bundleHierarchy.category,
                        this.props.isPreferredCategory,
                        defaultCategoryValue,
                        selectedFilterValue.selectedCategory,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.category
                        ),
                        false,
                        firstDropdown === bundleHierarchy.category
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isCategoryLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.category + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.category + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(
                     bundleHierarchy.child_category
                  ) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.child_category
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.childCategoryOption,
                        this.handleChildCategoryChange,
                        bundleHierarchy.child_category,
                        this.props.isPreferredChildCategory,
                        defaultChildCategoryValue,
                        selectedFilterValue.selectedChildCategory,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.child_category
                        ),
                        false,
                        firstDropdown === bundleHierarchy.child_category
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isChildCategoryLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.child_category + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.child_category + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(bundleHierarchy.sub_category) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.sub_category
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.subCategoryOption,
                        this.handleSubCategoryChange,
                        bundleHierarchy.sub_category,
                        this.props.isPreferredSubCategory,
                        defaultSubCategoryValue,
                        selectedFilterValue.selectedSubCategory,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.sub_category
                        ),
                        false,
                        firstDropdown === bundleHierarchy.sub_category
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isSubCategoryLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.sub_category + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.sub_category + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(
                     bundleHierarchy.child_sub_category
                  ) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.child_sub_category
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.childSubCategoryOption,
                        this.handleChildSubCategoryChange,
                        bundleHierarchy.child_sub_category,
                        this.props.isPreferredChildSubCategory,
                        defaultChildSubCategoryValue,
                        selectedFilterValue.selectedChildSubCategory,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.child_sub_category
                        ),
                        false,
                        firstDropdown === bundleHierarchy.child_sub_category
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isChildSubCategoryLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.child_sub_category + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.child_sub_category + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(bundleHierarchy.brand) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.brand
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.brandOption,
                        this.handleBrandChange,
                        bundleHierarchy.brand,
                        this.props.isPreferredBrand,
                        defaultBrandValue,
                        selectedFilterValue.selectedBrand,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.brand
                        ),
                        false,
                        firstDropdown === bundleHierarchy.brand
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isBrandLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.brand + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.brand + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(bundleHierarchy.sub_family) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.sub_family
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.subFamilyOption,
                        this.handleSubFamilyChange,
                        bundleHierarchy.sub_family,
                        this.props.isPreferredSubFamily,
                        defaultSubFamilyValue,
                        selectedFilterValue.selectedSubFamily,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.sub_family
                        ),
                        false,
                        firstDropdown === bundleHierarchy.sub_family
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isSubFamilyLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.sub_family + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.sub_family + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(bundleHierarchy.sub_brand) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.sub_brand
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.subBrandOption,
                        this.handleSubBrandChange,
                        bundleHierarchy.sub_brand,
                        this.props.isPreferredSubBrand,
                        defaultSubBrandValue,
                        selectedFilterValue.selectedSubBrand,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.sub_brand
                        ),
                        false,
                        firstDropdown === bundleHierarchy.sub_brand
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isSubBrandLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.sub_brand + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.sub_brand + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(bundleHierarchy.city_set) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.city_set
                     ) &&
                     (isLocationBasedRetailer || isStoreBasedRetailer) &&
                     this.renderDropDown(
                        dropdownOptions.citySetOption,
                        this.handleCitySetChange,
                        bundleHierarchy.city_set,
                        this.props.isPreferredCitySet,
                        defaultCitySetValue,
                        selectedFilterValue.selectedCitySet,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.city_set
                        ),
                        false,
                        firstDropdown === bundleHierarchy.city_set
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isCityLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.city_set + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.city_set + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(bundleHierarchy.pincode_set) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.pincode_set
                     ) &&
                     (isLocationBasedRetailer || isStoreBasedRetailer) &&
                     this.renderDropDown(
                        dropdownOptions.pincodeSetOption,
                        this.handlePincodeSetChange,
                        bundleHierarchy.pincode_set,
                        this.props.isPreferredPincodeSet,
                        defaultPincodeSetValue,
                        selectedFilterValue.selectedPincodeSet,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.pincode_set
                        ),
                        false,
                        firstDropdown === bundleHierarchy.pincode_set
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isPincodeLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.pincode_set + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.pincode_set + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(bundleHierarchy.store_set) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.store_set
                     ) &&
                     isStoreBasedRetailer &&
                     this.renderDropDown(
                        dropdownOptions.storeSetOption,
                        this.handleStoreSetChange,
                        bundleHierarchy.store_set,
                        this.props.isPreferredStoreSet,
                        defaultStoreSetValue,
                        selectedFilterValue.selectedStoreSet,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.store_set
                        ),
                        false,
                        firstDropdown === bundleHierarchy.store_set
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isStoreLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.store_set + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.store_set + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(
                     bundleHierarchy.retailers_category
                  ) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.retailers_category
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.retailerCategoryOption,
                        this.handleRetCatChange,
                        bundleHierarchy.retailers_category,
                        this.props.isPreferredRetCat,
                        defaultRetCatValue,
                        selectedFilterValue.selectedRetailerCategory,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.retailers_category
                        ),
                        false,
                        firstDropdown === bundleHierarchy.retailers_category
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isRetailerCategoryLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.retailers_category + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.retailers_category + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(bundleHierarchy.keyword_type) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.keyword_type
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.keywordCategoryOption,
                        this.handleKeywordCategoryChange,
                        bundleHierarchy.keyword_type,
                        this.props.isPreferredKeywordCategory,
                        defaultKeywordCategoryValue,
                        selectedFilterValue.selectedKeywordCategory,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.keyword_type
                        ),
                        false,
                        firstDropdown === bundleHierarchy.keyword_type
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isKeywordCategoryLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.keyword_type + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.keyword_type + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(bundleHierarchy.skl_type) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.skl_type
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.keywordTypeOption,
                        this.handleKeywordTypeChange,
                        bundleHierarchy.skl_type,
                        this.props.isPreferredKeywordType,
                        defaultKeywordTypeValue,
                        selectedFilterValue.selectedKeywordType,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.skl_type
                        ),
                        false,
                        firstDropdown === bundleHierarchy.skl_type
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isKeywordTypeLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.skl_type + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.skl_type + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(bundleHierarchy.keyword_tag) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.keyword_tag
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.keywordTagOption,
                        this.handleKeywordTagChange,
                        bundleHierarchy.keyword_tag,
                        this.props.isPreferredKeywordTag,
                        defaultKeywordTagValue,
                        selectedFilterValue.selectedKeywordTag,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.keyword_tag
                        ),
                        false,
                        firstDropdown === bundleHierarchy.keyword_tag
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isKeywordTagLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.keyword_tag + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.keyword_tag + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(bundleHierarchy.keyword) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.keyword
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.keywordOption,
                        this.handleKeywordChange,
                        bundleHierarchy.keyword,
                        this.props.isPreferredKeyword,
                        defaultKeywordValue,
                        selectedFilterValue.selectedKeyword,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.keyword
                        ),
                        true,
                        firstDropdown === bundleHierarchy.keyword
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isKeywordsLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.keyword + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.keyword + 'isReloadApi'
                        ]
                     )}
                  {displayDropdownList.includes(bundleHierarchy.position) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.position
                     ) &&
                     this.renderDropDown(
                        positionOptions,
                        this.handlePositionChange,
                        bundleHierarchy.position,
                        true,
                        [topPositionOptions[0]],
                        selectedFilterValue.selectedPosition,
                        singleSelectDropdownList.includes(
                           bundleHierarchy.position
                        ),
                        false,
                        firstDropdown === bundleHierarchy.position
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        true,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.position + 'isApiSuccess'
                        ],
                        null
                     )}
                  {displayDropdownList.includes(bundleHierarchy.sku) &&
                     !hideDropdownListWithFunctionality.includes(
                        bundleHierarchy.sku
                     ) &&
                     this.renderDropDown(
                        dropdownOptions.skuOption,
                        this.handleSkuChange,
                        bundleHierarchy.sku,
                        this.props.isPreferredSku,
                        defaultSkuValue,
                        selectedFilterValue.selectedSku,
                        singleSelectDropdownList.includes(bundleHierarchy.sku),
                        false,
                        firstDropdown === bundleHierarchy.sku
                           ? 'filter-1stdropdown-style'
                           : 'filter-dropdown-style',
                        this.state.isSkuLoading,
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.sku + 'isApiSuccess'
                        ],
                        cascadingApiSuccessAndReload[
                           bundleHierarchy.sku + 'isReloadApi'
                        ]
                     )}
                  {/* { this.props.isSliderPresent && 
                     <RangeSlider/>
                     } */}
                  {/**  Suggestion search box will used in Keyword Trend Page */}
                  {this.props.isEnableSuggestion ? (
                     <div className="filter-dropdown-style">
                        <p className="dropdownTitleStyle">{KEYWORD_SEARCH}</p>
                        <SearchBar
                           onSearch={(event, id) => this.search(event, id)}
                           placeholder={
                              this.state.isKeywordTextLoading
                                 ? LOADING_TEXT
                                 : PLACE_HOLDER_TEXT
                           }
                           isCleared={false}
                           keywordValue={this.props.keywordValueForFilter}
                           inputClassName={this.props.inputClassName}
                           searchbarClassName={this.props.searchbarClassName}
                           getSuggestionList={this.props.getSuggestionList}
                           resetClicked={this.state.resetClicked}
                        />
                     </div>
                  ) : (
                     ''
                  )}
               </div>
               {
                  <div>
                     {isSliderNeeded ? (
                        <RangeSlider
                           sliderTitle={'Price Range'}
                           minimum={0}
                           maximum={100}
                           stepValue={10}
                        />
                     ) : (
                        ''
                     )}
                  </div>
               }
            </Col>
            {
               <>
                  {displayDropdownList.includes(bundleHierarchy.date) && (
                     <>
                        <div className="filters-date-picker-col-border-style-right" />
                        <div className="filter-dropdown-date-style">
                           {this.renderDatePicker()}
                        </div>
                     </>
                  )}
                  <div className="filters-apply-button-col-border-style-right" />
                  {additionalsearchForFilter}
                  {this.renderFilterApplyButton()}

                  <div
                     className="filters-apply-button-col-border-style-bottom"
                     style={{
                        left: !displayDropdownList.includes(
                           bundleHierarchy.date
                        )
                           ? '87.8%'
                           : '81.8%',
                     }}
                  />
               </>
            }
            {displayDropdownList.includes(bundleHierarchy.mustsell) && (
               <>{this.renderMustSellDropDown()}</>
            )}
            {isApplyClicked && (
               <ToastModal
                  show={true}
                  onModalHide={
                     !isValuesSelectedValidation
                        ? this.handleHideToastModal.bind(
                             this,
                             true,
                             true,
                             true,
                             false
                          )
                        : !isSkuDataAvailable
                        ? this.handleHideToastModal.bind(
                             this,
                             false,
                             true,
                             true,
                             true
                          )
                        : !retailerRestricted
                        ? this.handleHideToastModal.bind(
                             this,
                             true,
                             false,
                             true,
                             true
                          )
                        : !isPowerSkuValidation &&
                          this.handleHideToastModal.bind(
                             this,
                             true,
                             true,
                             false,
                             true
                          )
                  }
                  title={
                     toastModalTitleContent && toastModalTitleContent != undefined
                        ? toastModalTitleContent
                        : bundleHierarchy.request_failed
                  }
                  titleBackgroundColor={ERROR_BG_COLOR}
                  content={
                     !isValuesSelectedValidation
                        ? `Please select the ${listOfNotSelectedDropdown} dropdown values to proceed further`
                        : !isSkuDataAvailable
                        ? bundleHierarchy.no_data_for_sku
                        : !retailerRestricted
                        ? bundleHierarchy.retailer_restriction
                        : !isPowerSkuValidation &&
                          'Please change the selection criteria as this sku is not power sku.'
                     //  : this.state.isKeywordSelected && 'Select Keyword to proceed'
                  }
               />
            )}
         </Card>
      )
   }

   render() {
      return <>{this.renderFilterCard()}</>
   }
}

export default connect(mapStateToProps, null)(Filter)
