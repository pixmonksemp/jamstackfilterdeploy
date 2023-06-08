import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Col, OverlayTrigger, Row } from 'react-bootstrap'
import FilterContainer from '../../container/filter-container/filter-container'
import AppliedFilterGrid from '../applied-filter/applied-filter-grid'
import AppliedFilterCard from '../applied-filter/applied-filter-card'
import FlagIcon from '../flagIcon/flagIcon'
import {
   CLOSE,
   LOGIN_USER_DETAILS,
   SUPPORT_LINK,
   SUPPORT_TEXT,
} from '../../common/common-constants'
// import DatePickerController from '../date-picker/datePickerController'
import ToolTip from '../tooltip/tooltip'

let isLoggedIn
class FilterAndAppliedFilter extends Component {
   static propTypes = {
      latestScrapDate: PropTypes.string,
      /*****applied filter*****/
      //hide dropdowns
      appliedFilterHideDropdown: PropTypes.array,
      //applied filter having more fields (labels)
      isAppliedFilterHavingExtraField: PropTypes.bool,
      //initial load values
      appliedFilterInitailLoadedValues: PropTypes.object,
      //retailer type
      retailerTypeForAppliedFilter: PropTypes.string,
      /*****filter*****/
      //call back function's
      handleApplyFilter: PropTypes.func,
      handleCloseFilter: PropTypes.func,
      initialRenderFilter: PropTypes.func,
      //selected values of filter
      selectedValuesForFilter: PropTypes.object,
      //hide dropdowns
      filterHideDropdown: PropTypes.array,
      //hide dropdowns with functionality
      filterHideDropdownWithFunctionality: PropTypes.array,
      //single select dropdowns
      filterSingleSelectDropdown: PropTypes.array,
      //filter clicked or not
      isFilterChecked: PropTypes.bool,
      filterTarget: PropTypes.oneOfType([
         PropTypes.string,
         PropTypes.object,
         PropTypes.number,
         PropTypes.array,
      ]),
      //scrap dates related info
      filterShowOnlyScrapDates: PropTypes.bool,
      filterFrequencyScrapDay: PropTypes.string,
      filterFrequencyScrapDates: PropTypes.array,
      filterScrapDateForAllRetailer: PropTypes.array,
      //modulename
      moduleNameForFilter: PropTypes.string,
      //first page configuration
      configureFirstPagePositionForFilter: PropTypes.bool,
      //preferred
      isPreferredRetailerForFilter: PropTypes.bool,
      isPreferredSuperCategoryForFilter: PropTypes.bool,
      isPreferredChildSuperCategoryForFilter: PropTypes.bool,
      isPreferredCategoryForFilter: PropTypes.bool,
      isPreferredChildCategoryForFilter: PropTypes.bool,
      isPreferredSubCategoryForFilter: PropTypes.bool,
      isPreferredChildSubCategoryForFilter: PropTypes.bool,
      isPreferredBrandForFilter: PropTypes.bool,
      isPreferredSubFamilyForFilter: PropTypes.bool,
      isPreferredSubBrandForFilter: PropTypes.bool,
      isPreferredKeywordCategoryForFilter: PropTypes.bool,
      isPreferredKeywordTypeForFilter: PropTypes.bool,
      isPreferredKeywordTagForFilter: PropTypes.bool,
      isPreferredKeywordForFilter: PropTypes.bool,
      isPreferredSkuForFilter: PropTypes.bool,
      isPreferredCitySetForFilter: PropTypes.bool,
      isPreferredPincodeSetForFilter: PropTypes.bool,
      isPreferredStoreSetForFilter: PropTypes.bool,
      isPreferredRetCatForFilter: PropTypes.bool,
      //restrict retailer
      isRestrictRetailerForFilter: PropTypes.bool,
      //internal navigation
      isFilterInternalNavigation: PropTypes.bool,
      //preferred dropdown list while navigating
      isPreferredRetailerArrayForFilter: PropTypes.array,
      isPreferredSuperCategoryArrayForFilter: PropTypes.array,
      isPreferredChildSuperCategoryArrayForFilter: PropTypes.array,
      isPreferredCategoryArrayForFilter: PropTypes.array,
      isPreferredChildCategoryArrayForFilter: PropTypes.array,
      isPreferredSubCategoryArrayForFilter: PropTypes.array,
      isPreferredChildSubCategoryArrayForFilter: PropTypes.array,
      //sku dropdown col size
      skuColSizeForFilter: PropTypes.number,
      //super category dropdown col size
      superCatColSizeForFilter: PropTypes.number,
      //super category dropdown style
      isChangeSuperCatClassNameForFilter: PropTypes.bool,
      //skip dropdowns
      skipDropdownForFilter: PropTypes.array,
      /*****applied card*****/
      //retailer logo is present
      isRetailerCardImagePresent: PropTypes.bool,
      //loading will come till url comes
      loadingForCardImage: PropTypes.bool,
      //url for card image
      imageUrlForCard: PropTypes.string,
      isAppliedFilterCardRowPresent: PropTypes.bool,
      //hide dropdowns
      appliedFilterHideDropdownForCard: PropTypes.array,
      //display name for keyword
      displayKeywordNameForAppliedFilterCard: PropTypes.string,
      //retailer logo clickable and call back function
      appliedFilterCardRetailerLogoClickable: PropTypes.bool,
      handleRetailerLogoClickForAppliedFilterCard: PropTypes.func,
      //retailer logo tooltip content, position
      isRetailerLogoTooltipNeededForCard: PropTypes.bool,
      retailerLogoTooltipContentForCard: PropTypes.string,
      retailerLogoTooltipPositionForCard: PropTypes.string,
      //content near retailer logo
      contentNearRetailerLogoForCard: PropTypes.string,
      //filter functionality will work but hide from ui
      hideFilterDesignWithFunctionality: PropTypes.string,
      //spinner style
      filterSpinnerClassname: PropTypes.string,
      //first dropdown to be render in filter => for style
      firstDropdownForFIlter: PropTypes.string,
      //kewyord suggestion
      enableSuggestionForFilter: PropTypes.bool,
      keywordValueForFilter: PropTypes.string,
      getSuggestionListForFilter: PropTypes.string,
      //only for displaying date filter
      isEnableFullFilterLayout: PropTypes.bool,
      handleOnlyDateFilterChange: PropTypes.func,
      latestScarpDateData: PropTypes.string,
      showCalendarIcon: PropTypes.bool,
      className: PropTypes.string,
      calenderPositionBottom: PropTypes.string,
      datePickerContainerClassname: PropTypes.string,
      datePickerCalenderIconClassname: PropTypes.string,
      datePickerDropButton: PropTypes.string,
      isCompetitorBased: PropTypes.bool,
      flagIconDivStyle: PropTypes.string,
      isSliderPresent : PropTypes.bool,
      // For Range Slide
      isRangeSliderNeeded: PropTypes.bool,
      //for assert search, pim purpose
      additionalsearch: PropTypes.func,
      //free hand dropdown, initial values not selected but option will load based on single or multi select
      isFreeHandDropdownForFilter: PropTypes.bool,
      //free hand select, this will used to uncheck and check all options
      isFreeHandSelectForFilter: PropTypes.bool,
      //toast modal contents
      toastModalTitleContentForFilter: PropTypes.string,
      //dummy dropdowns
      listOfDummyDropdownsForFilter: PropTypes.array
   }

   static defaultProps = {
      // latestScrapDate: new Date(),
      /*****applied filter*****/
      isAppliedFilterHavingExtraField: false,
      /*****filter*****/
      isPreferredRetailerForFilter: false,
      isPreferredSuperCategoryForFilter: false,
      isPreferredChildSuperCategoryForFilter: false,
      isPreferredCategoryForFilter: false,
      isPreferredChildCategoryForFilter: false,
      isPreferredSubCategoryForFilter: false,
      isPreferredChildSubCategoryForFilter: false,
      isPreferredBrandForFilter: false,
      isPreferredSubFamilyForFilter: false,
      isPreferredSubBrandForFilter: false,
      isPreferredKeywordCategoryForFilter: false,
      isPreferredKeywordTypeForFilter: false,
      isPreferredKeywordTagForFilter: false,
      isPreferredKeywordForFilter: false,
      isPreferredSkuForFilter: false,
      isPreferredCitySetForFilter: false,
      isPreferredPincodeSetForFilter: false,
      isPreferredStoreSetForFilter: false,
      isPreferredRetCatForFilter: false,
      isFilterChecked: false,
      filterHideDropdownWithFunctionality: [],
      configureFirstPagePositionForFilter: false,
      filterShowOnlyScrapDates: false,
      filterFrequencyScrapDay: '',
      filterFrequencyScrapDates: [],
      placementForFilter: 'bottom',
      isFilterInternalNavigation: false,
      skipDropdownForFilter: [],
      hideFilterDesignWithFunctionality: 'filter-appliedFilter-row-style',
      filterSpinnerClassname: 'filter-initial-spinner',
      /*****applied card*****/
      appliedFilterCardRetailerLogoClickable: false,
      isRetailerCardImagePresent: false,
      isAppliedFilterCardRowPresent: true,
      isRetailerLogoTooltipNeededForCard: false,
      enableSuggestionForFilter: false,
      //only for displaying date filter
      isEnableFullFilterLayout: true,
      showCalendarIcon: false,
      className: 'dropdown-datefield-summary',
      calenderPositionBottom: 'calender-position',
      datePickerContainerClassname: 'date-rangepicker-container',
      datePickerCalenderIconClassname: 'applied-filter-date-picker-calender-icon-style',
      datePickerDropButton: 'date-picker-button-style',
      flagIconDivStyle: 'flag-icon-div-style',
      // For Range Slider
      isRangeSliderNeeded: false,
      //free hand dropdown
      isFreeHandDropdownForFilter: false,
      isFreeHandSelectForFilter: false,
      listOfDummyDropdownsForFilter: []
   }

   componentWillMount() {
      isLoggedIn = JSON.parse(sessionStorage.getItem(LOGIN_USER_DETAILS))
      this.setState({
         InfoIcon:
            isLoggedIn &&
            isLoggedIn.pimercecdn &&
            isLoggedIn.pimercecdn.pimerce_help_icon,
         marketCountry:
            isLoggedIn && isLoggedIn.module && isLoggedIn.module.Country,
      })
   }

   render() {
      const {
         latestScrapDate,
         appliedFilterHideDropdown,
         isAppliedFilterHavingExtraField,
         appliedFilterInitailLoadedValues,
         selectedValuesForFilter,
         filterHideDropdown,
         filterHideDropdownWithFunctionality,
         isFilterChecked,
         filterTarget,
         filterSingleSelectDropdown,
         filterShowOnlyScrapDates,
         filterFrequencyScrapDay,
         filterFrequencyScrapDates,
         filterScrapDateForAllRetailer,
         moduleNameForFilter,
         configureFirstPagePositionForFilter,
         isPreferredRetailerForFilter,
         isPreferredSuperCategoryForFilter,
         isPreferredChildSuperCategoryForFilter,
         isPreferredCategoryForFilter,
         isPreferredChildCategoryForFilter,
         isPreferredSubCategoryForFilter,
         isPreferredChildSubCategoryForFilter,
         isPreferredBrandForFilter,
         isPreferredSubFamilyForFilter,
         isPreferredSubBrandForFilter,
         isPreferredKeywordCategoryForFilter,
         isPreferredKeywordTypeForFilter,
         isPreferredKeywordTagForFilter,
         isPreferredKeywordForFilter,
         isPreferredSkuForFilter,
         isPreferredCitySetForFilter,
         isPreferredPincodeSetForFilter,
         isPreferredStoreSetForFilter,
         isPreferredRetCatForFilter,
         isRestrictRetailerForFilter,
         isFilterInternalNavigation,
         isPreferredRetailerArrayForFilter,
         isPreferredSuperCategoryArrayForFilter,
         isPreferredChildSuperCategoryArrayForFilter,
         isPreferredCategoryArrayForFilter,
         isPreferredChildCategoryArrayForFilter,
         isPreferredSubCategoryArrayForFilter,
         isPreferredChildSubCategoryArrayForFilter,
         skuColSizeForFilter,
         superCatColSizeForFilter,
         isChangeSuperCatClassNameForFilter,
         skipDropdownForFilter,
         retailerTypeForAppliedFilter,
         isRetailerCardImagePresent,
         loadingForCardImage,
         imageUrlForCard,
         isAppliedFilterCardRowPresent,
         appliedFilterHideDropdownForCard,
         displayKeywordNameForAppliedFilterCard,
         hideFilterDesignWithFunctionality,
         filterSpinnerClassname,
         appliedFilterCardRetailerLogoClickable,
         handleRetailerLogoClickForAppliedFilterCard,
         isRetailerLogoTooltipNeededForCard,
         retailerLogoTooltipContentForCard,
         retailerLogoTooltipPositionForCard,
         contentNearRetailerLogoForCard,
         firstDropdownForFIlter,
         enableSuggestionForFilter,
         keywordValueForFilter,
         getSuggestionListForFilter,
         isEnableFullFilterLayout,
         latestScarpDateData,
         isCompetitorBased,
         isRangeSliderNeeded,
         additionalsearch,
         isFreeHandDropdownForFilter,
         isFreeHandSelectForFilter,
         toastModalTitleContentForFilter,
         listOfDummyDropdownsForFilter
      } = this.props
      const { InfoIcon, marketCountry } = this.state

      return latestScrapDate ? (
         <>
            {isAppliedFilterCardRowPresent ? (
               <Row>
                  <AppliedFilterCard
                     hideDropdown={appliedFilterHideDropdownForCard}
                     appliedImage={
                        imageUrlForCard
                        // loadingForCardImage && imageUrlForCard
                     }
                     retailerCardImage={isRetailerCardImagePresent}
                     displayKeywordName={displayKeywordNameForAppliedFilterCard}
                     isRetailerLogoClickable={
                        appliedFilterCardRetailerLogoClickable
                     }
                     handleRetailerLogoClick={() =>
                        handleRetailerLogoClickForAppliedFilterCard()
                     }
                     isRetailerLogoTooltipNeeded={
                        isRetailerLogoTooltipNeededForCard
                     }
                     retailerLogoTooltipContent={
                        retailerLogoTooltipContentForCard
                     }
                     retailerLogoTooltipPosition={
                        retailerLogoTooltipPositionForCard
                     }
                     contentNearRetailerLogo={contentNearRetailerLogoForCard}
                  />
                  {/* <div class="col align-self-end flag-icon-div-style">       
                     <a href={SUPPORT_LINK} target="_blank" className='support-icon-style'> 
                     <ToolTip
                        content={SUPPORT_TEXT}
                        position={'left'}>
                        <img src={InfoIcon}></img>  
                           </ToolTip>
                     </a>
                     {/* <ToolTip
                        content={marketCountry}
                        position='left'>
                           <FlagIcon />
                     </ToolTip> 
                  </div> */}
               </Row>
            ) : (
               ''
            )}
            <Row className={hideFilterDesignWithFunctionality}>
               {isEnableFullFilterLayout ? (
                  <>
                     <AppliedFilterGrid
                        handleApplyFilter={this.props.handleApplyFilter}
                        hideDropdown={appliedFilterHideDropdown}
                        isExtraFieldClass={isAppliedFilterHavingExtraField}
                        initialFilterData={appliedFilterInitailLoadedValues}
                        retailerType={retailerTypeForAppliedFilter}
                     />
                     <div style={{width: '-webkit-fill-available'}}>
                     <FilterContainer
                        metaDataStructure={selectedValuesForFilter}
                        initialRenderFilter={this.props.initialRenderFilter}
                        handleApplyFilter={this.props.handleApplyFilter}
                        handleCloseFilter={this.props.handleCloseFilter}
                        hideDropdown={filterHideDropdown}
                        hideDropdownListWithFunctionality={
                           filterHideDropdownWithFunctionality
                        }
                        singleSelectDropdown={filterSingleSelectDropdown}
                        defaultSelectedDate={latestScrapDate}
                        isShowOnlyScrapDates={filterShowOnlyScrapDates}
                        frequencyScrapDay={filterFrequencyScrapDay}
                        frequencyScrapDates={filterFrequencyScrapDates}
                        getScrapDateForAllRetailer={
                           filterScrapDateForAllRetailer
                        }
                        filterCheck={isFilterChecked}
                        targetRef={filterTarget}
                        moduleName={moduleNameForFilter}
                        configureFirstPagePosition={
                           configureFirstPagePositionForFilter
                        }
                        isPreferredRetailer={isPreferredRetailerForFilter}
                        isPreferredSuperCategory={
                           isPreferredSuperCategoryForFilter
                        }
                        isPreferredChildSuperCategory={
                           isPreferredChildSuperCategoryForFilter
                        }
                        isPreferredCategory={isPreferredCategoryForFilter}
                        isPreferredChildCategory={
                           isPreferredChildCategoryForFilter
                        }
                        isPreferredSubCategory={isPreferredSubCategoryForFilter}
                        isPreferredChildSubCategory={
                           isPreferredChildSubCategoryForFilter
                        }
                        isPreferredBrand={isPreferredBrandForFilter}
                        isPreferredSubFamily={isPreferredSubFamilyForFilter}
                        isPreferredSubBrand={isPreferredSubBrandForFilter}
                        isPreferredKeywordCategory={
                           isPreferredKeywordCategoryForFilter
                        }
                        isPreferredKeywordType={isPreferredKeywordTypeForFilter}
                        isPreferredKeywordTag={isPreferredKeywordTagForFilter}
                        isPreferredKeyword={isPreferredKeywordForFilter}
                        isPreferredSku={isPreferredSkuForFilter}
                        isPreferredCitySet={isPreferredCitySetForFilter}
                        isPreferredPincodeSet={isPreferredPincodeSetForFilter}
                        isPreferredStoreSet={isPreferredStoreSetForFilter}
                        isPreferredRetCat={isPreferredRetCatForFilter}
                        isRestrictRetailer={isRestrictRetailerForFilter}
                        isInternalNavigation={isFilterInternalNavigation}
                        isPreferredRetailerArray={
                           isPreferredRetailerArrayForFilter
                        }
                        isPreferredSuperCategoryArray={
                           isPreferredSuperCategoryArrayForFilter
                        }
                        isPreferredChildSuperCategoryArray={
                           isPreferredChildSuperCategoryArrayForFilter
                        }
                        isPreferredCategoryArray={
                           isPreferredCategoryArrayForFilter
                        }
                        isPreferredChildCategoryArray={
                           isPreferredChildCategoryArrayForFilter
                        }
                        isPreferredSubCategoryArray={
                           isPreferredSubCategoryArrayForFilter
                        }
                        isPreferredChildSubCategoryArray={
                           isPreferredChildSubCategoryArrayForFilter
                        }
                        skuColSize={skuColSizeForFilter}
                        superCatColSize={superCatColSizeForFilter}
                        isChangeSuperCatClassName={
                           isChangeSuperCatClassNameForFilter
                        }
                        skipDropdown={skipDropdownForFilter}
                        filtersFirstDropdown={firstDropdownForFIlter}
                        isEnableSuggestion={enableSuggestionForFilter}
                        keywordValueForFilter={keywordValueForFilter}
                        getSuggestionList={getSuggestionListForFilter}
                        isCompetitorBased={isCompetitorBased}
                        isSliderPresent ={this.props.isSliderPresent}
                        isSliderNeeded={isRangeSliderNeeded}
                        //pim purpose
                        additionalsearchForFilter={this.props.additionalsearch}
                        //free hand select
                        isFreeHandDropdown={isFreeHandDropdownForFilter}
                        isFreeHandSelect={isFreeHandSelectForFilter}
                        //toast modal content
                        toastModalTitleContent={toastModalTitleContentForFilter}
                        //dummy dropdowns
                        listOfDummyDropdowns={listOfDummyDropdownsForFilter}
                     />
                     </div>
                  </>
               ) : (
                  <div class="col align-self-end date-picker-div-style">
                     {/* <DatePickerController
                        className={this.props.className}
                        onChange={this.props.handleOnlyDateFilterChange}
                        selectTodayButton={CLOSE}
                        borderDisable={true}
                        value={latestScarpDateData}
                        beforeDate={latestScrapDate}
                        isCalendarPositionTop={false}
                        isShowOnlySearchScrapDates={true}
                        frequencyScrapDay={filterFrequencyScrapDay}
                        frequencyScrapDates={filterFrequencyScrapDates}
                        isFilterComponent={false}
                        calenderPositionBottom={this.props.calenderPositionBottom}
                        datePickerContainerClassname={this.props.datePickerContainerClassname}
                        showCalendarIcon = {this.props.showCalendarIcon}
                        datePickerCalenderIconClassname = {this.props.datePickerCalenderIconClassname}
                        dateTooltipTrigger={false}
                        isDateLabelNeeded = {true}
                        datePickerInputTextClassname = 'grid-date'
                        datePickerDropButton = {this.props.datePickerDropButton}
                     /> */}
                  </div>
               )}
            </Row>
         </>
      ) : (
         <Row className={filterSpinnerClassname}>
            <div className="spinnerr">
               <div className="bounce1"></div>
               <div className="bounce2"></div>
               <div className="bounce3"></div>
            </div>
         </Row>
      )
   }
}

export default FilterAndAppliedFilter
