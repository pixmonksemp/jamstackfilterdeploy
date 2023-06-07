/** @format */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col, Badge, Card } from 'react-bootstrap'
import { removeArrayObjectDuplicates } from '../filter-component/filterdata-constant'
import ToolTip from '../tooltip/tooltip'
import '../../components/filter-component/filter-style.scss'
import ModalComponent from '../modal'
import DataGrid from '../data-table/search-datatable'
import { renderTextTrim } from '../top-menu/util'
import {
   MARKETPLACE,
   RESET_FILTER,
   TEN_AS_STRING,
} from '../../common/common-constants'
import '../applied-filter/applied-filter.scss'
import FilterIcon from '../../assets/black_mask.svg'

const mapStateToProps = (state) => {
   return {
      getFilterDataValue: state.stateData.getFilterdata,
      retainingData: state.dashboardValue.selectedFiltersforRetainingValues,
      getGlobalFilterSelectedValues:
         state.stateData.getGlobalFilterSelectedValue,
   }
}

let displayDropdownList,
   modalGridData = [],
   bundleHierarchy,
   filterDropdowns,
   defaultSearchPosition

class AppliedFilterGrid extends Component {
   static propTypes = {
      isExtraFieldClass: PropTypes.bool,
      isLessFields: PropTypes.bool,
      handleApplyFilter: PropTypes.func,
      hideDropdown: PropTypes.array,
      retailerType: PropTypes.string,
      initialFilterData: PropTypes.object,
   }

   static defaultProps = {
      isExtraFieldClass: false,
      isLessFields: false,
      retailerType: MARKETPLACE,
   }

   constructor() {
      super()
      {
         this.state = {
            enabledDropdownList: [],
            showModal: false,
            modalTitle: '',
         }
         this.handleClear = this.handleClear.bind(this)
         this.handleModalClose = this.handleModalClose.bind(this)
         this.modalContent = this.modalContent.bind(this)
         this.handleOutSideClick = this.handleOutSideClick.bind(this)
      }
   }

   componentWillMount() {
      const { getFilterDataValue, retainingData } = this.props
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
         }
      }
      if (!retainingData.applyStatus) retainingData.powerSku = false

      displayDropdownList =
         filterDropdowns.Filters_Enable_Disable_Dropdowns &&
         filterDropdowns.Filters_Enable_Disable_Dropdowns.appliedFiltersList &&
         filterDropdowns.Filters_Enable_Disable_Dropdowns.appliedFiltersList.split(
            ', '
         )
      this.state.enabledDropdownList = displayDropdownList
   }

   handleClear() {
      const { retainingData } = this.props
      retainingData.clickStatus = false
      retainingData.resetClicked = true
      retainingData.retailerName = []
      retainingData.categoryName = []
      retainingData.brandName = []
      retainingData.keywordCategoryName = []
      retainingData.keywordName = []
      retainingData.keywordType = []
      retainingData.keywordTag = []
      retainingData.keywordName = []
      retainingData.positionNumber = []
      retainingData.powerSku = false
      retainingData.dateValue = ''
      retainingData.cityName = []
      retainingData.pincodeNumber = []
      retainingData.sellerName = []
      retainingData.skuName = []
      retainingData.rangeSelectionForAll = []
      retainingData.applyStatus = false
      this.props.handleApplyFilter(true, false, bundleHierarchy.clear, false)
   }

   getDisplayNames(value) {
      let displayName = []
      value &&
         value.length &&
         value.map((item) => {
            if (item && item.value) displayName.push(item.value)
            else displayName.push(item)
         })

      return displayName
   }

   handleOutSideClick(e) {
      if (this.node.contains(e.target)) {
         return
      }
      this.handleModalClose()
   }

   handleModalOpen(data, name) {
      if (!this.state.showModal) {
         document.addEventListener('click', this.handleOutSideClick, false)
      } else {
         document.removeEventListener('click', this.handleOutSideClick, false)
      }
      this.setState((prevState) => ({ showModal: !prevState.showModal }))
      modalGridData = []
      let head = ''
      head = name[0].toUpperCase() + name.substring(1)
      this.setState({ modalTitle: head })
      for (let i = 0; i < data.length; i++) {
         let value = {
            id: i + 1,
            name: data[i],
         }
         modalGridData.push(value)
      }
      // this.setState({ showModal: true })
   }

   renderAppliedFilter(displayValue, islastIndex, name) {
      let displayName = this.getDisplayNames(displayValue)
      let displayWithBadge =
         // displayName && displayName.length < 20?
         displayName && displayName.length > 1 ? (
            <div
               style={{
                  // textDecoration: 'underline',
                  cursor: 'pointer',
               }}
               ref={(node) => {
                  this.node = node
               }}
               onClick={this.handleModalOpen.bind(this, displayName, name)}
            >
               <ToolTip content={displayName[0]} position="bottom">
                  <div className="appliedFiltersText">
                     {renderTextTrim(displayName[0], 12)}
                     {/* purpose: To display full text without trim */}
                     {/* {displayName[0]} */}
                  </div>
                  &nbsp;
                  <Badge
                     variant="danger"
                     className="applied-filter-badge-style"
                  >
                     {displayName.length}
                  </Badge>
                  {islastIndex ? null : <div className="separatorLine"></div>}
               </ToolTip>
            </div>
         ) : (
            <ToolTip content={displayName[0]} position="bottom">
               <div className="appliedFiltersText">
                  {renderTextTrim(displayName[0], 12)}
                  {/* purpose: To display full text without trim */}
                  {/* {displayName[0]} */}
                  {islastIndex ? null : <div className="separatorLine"></div>}
               </div>
            </ToolTip>
         )
      return this.state.showModal ? (
         this.state.modalTitle === name ? (
            <>
               {this.filterValuesInDropown(displayName, name)}
               {displayWithBadge}
            </>
         ) : (
            displayWithBadge
         )
      ) : (
         displayWithBadge
      )
   }

   filterValuesInDropown(dropdownValues, name) {
      return (
         <Card className="applied-filter-dropdown-card-style">
            <Row className="applied-filter-dropdown-heading-style">
               {name == bundleHierarchy.keyword_type
                  ? bundleHierarchy.keyword_category
                  : name == bundleHierarchy.city_set
                  ? bundleHierarchy.city
                  : name == bundleHierarchy.pincode_set
                  ? bundleHierarchy.location
                  : name == bundleHierarchy.store_set
                  ? bundleHierarchy.store
                  : name == bundleHierarchy.child_super_category
                  ? bundleHierarchy.super_category
                  : name == bundleHierarchy.child_sub_category
                  ? bundleHierarchy.sub_category
                  : name === bundleHierarchy.child_category
                  ? bundleHierarchy.category
                  : name == bundleHierarchy.sub_family
                  ? bundleHierarchy.product_type
                  : name}
               <i
                  class="fa fa-times applied-filter-dropdown-close-icon-style"
                  aria-hidden="true"
                  onClick={this.handleModalClose}
               />
            </Row>
            <Row>
               {dropdownValues.map((dropownItems) => {
                  return (
                     <>
                        <Col
                           xl="12"
                           lg="12"
                           className="applied-filter-dropdown-values-style"
                        >
                           {dropownItems}
                        </Col>
                     </>
                  )
               })}
            </Row>
         </Card>
      )
   }

   renderAppliedFilterLayout(retainingValue, isDirectValue, name, powerSku) {
      const { isExtraFieldClass, getFilterDataValue } = this.props
      let filteredDropDownList = displayDropdownList
      let lastIndex =
         filteredDropDownList && filteredDropDownList.length
            ? filteredDropDownList.includes(bundleHierarchy.mustsell)
               ? !powerSku
                  ? filteredDropDownList.length - 2
                  : filteredDropDownList.length - 1
               : filteredDropDownList.length - 1
            : 0
      let filterValues
      let lastIndexName = ''
      if (
         typeof retainingValue == 'object' &&
         retainingValue &&
         retainingValue.length
      ) {
         retainingValue = removeArrayObjectDuplicates(retainingValue, 'label')
      }
      filteredDropDownList.map((item, index) => {
         if (index === lastIndex && item === name) {
            lastIndexName = item
         }
         if (item === name) {
            if (lastIndexName === name) {
               filterValues = (
                  <div
                     id={name}
                     className={
                        isExtraFieldClass
                           ? name === this.state.modalTitle
                              ? 'applied-filter-dropdown-extra-block-style'
                              : 'appliedFilterTextExtraBlock'
                           : name === this.state.modalTitle
                           ? 'applied-filter-dropdown-block-style'
                           : 'appliedFilterTextBlock'
                     }
                  >
                     {isDirectValue ? (
                        <ToolTip content={retainingValue} position="bottom">
                           <div className="appliedFiltersText">
                              {retainingValue}
                           </div>
                        </ToolTip>
                     ) : (
                        this.renderAppliedFilter(retainingValue, true, name)
                     )}
                  </div>
               )
            } else {
               filterValues = (
                  <div
                     className={
                        isExtraFieldClass
                           ? name === this.state.modalTitle
                              ? 'applied-filter-dropdown-extra-block-style'
                              : 'appliedFilterTextExtraBlock'
                           : name === this.state.modalTitle
                           ? 'applied-filter-dropdown-block-style'
                           : 'appliedFilterTextBlock'
                     }
                  >
                     {isDirectValue ? (
                        <ToolTip content={retainingValue} position="bottom">
                           <div className="appliedFiltersText">
                              {retainingValue}
                           </div>
                           <div className="separatorLine"></div>
                        </ToolTip>
                     ) : (
                        this.renderAppliedFilter(retainingValue, false, name)
                     )}
                  </div>
               )
            }
         }
      })
      return filterValues
   }

   handleModalClose() {
      if (!this.state.showModal) {
         document.addEventListener('click', this.handleOutSideClick, false)
      } else {
         document.removeEventListener('click', this.handleOutSideClick, false)
      }
      this.setState((prevState) => ({ showModal: !prevState.showModal }))
      this.setState({ modalTitle: '' })
   }

   isFirstPage = (defaultSearchPosition) =>
      defaultSearchPosition === 'First Page'

   handleModalTitle() {
      const { modalTitle } = this.state
      return (
         <div className="applied-filter-grid-modalTitle">
            {modalTitle == bundleHierarchy.keyword_type
               ? bundleHierarchy.keyword_category
               : modalTitle == bundleHierarchy.city_set
               ? bundleHierarchy.city
               : modalTitle == bundleHierarchy.pincode_set
               ? bundleHierarchy.location
               : modalTitle == bundleHierarchy.store_set
               ? bundleHierarchy.store
               : modalTitle == bundleHierarchy.child_super_category
               ? bundleHierarchy.super_category
               : modalTitle == bundleHierarchy.child_sub_category
               ? bundleHierarchy.sub_category
               : modalTitle === bundleHierarchy.child_category
               ? bundleHierarchy.category
               : modalTitle == bundleHierarchy.sub_family
               ? bundleHierarchy.product_type
               : modalTitle}
         </div>
      )
   }

   modalContent() {
      let modalColumns = [
         {
            dataField: 'id',
            text: 'S.No',
         },
         {
            dataField: 'name',
            text: 'Name',
         },
      ]
      return (
         <>
            <DataGrid
               columns={modalColumns}
               gridLoading={false}
               gridSpinnerClassName="chartSpinner"
               data={modalGridData}
               noDataFoundCardStyle="noData"
               pagination={false}
               isSearchBoxPresent={false}
               isExportPresent={false}
               isGapBetweenCell={false}
               activeRowHeight={40}
               isModal={true}
               gridCardModalContainerClassName="gridCardModalContainer"
               isCardHeader={false}
            />
         </>
      )
   }

   render() {
      const { retainingData, hideDropdown, retailerType, initialFilterData } =
         this.props
      // check whether dropdown is applicable for module
      if (
         hideDropdown &&
         hideDropdown !== this.state.enabledDropdownList &&
         this.state.enabledDropdownList != undefined
      ) {
         displayDropdownList = this.state.enabledDropdownList.filter(
            (item) => !hideDropdown.includes(item)
         )
      }
      let resetStatus = false
      if (
         retainingData &&
         (retainingData.retailerName != [] ||
            retainingData.categoryName != [] ||
            retainingData.brandName != [] ||
            retainingData.keywordName != [] ||
            retainingData.keywordType != [] ||
            retainingData.keywordTag != [] ||
            retainingData.keywordCategoryName != [] ||
            retainingData.positionNumber != [] ||
            retainingData.powerSku ||
            retainingData.cityName != [] ||
            retainingData.pincodeNumber != [] ||
            retainingData.sellerName ||
            retainingData.dateValue != '')
      ) {
         resetStatus = true
      }
      let date = retainingData.applyStatus
         ? retainingData && retainingData.dateValue
         : ''
      return (
         <>
            {retainingData && (
               <Card className="applied-filter-card-style">
                  <Row style={{ marginLeft: '0px' }}>
                     <Col
                        xl="1"
                        lg="2"
                        md="2"
                        sm="1"
                        className="filter-name-style"
                     >
                        Filters &nbsp;&nbsp;
                        <img
                           src={FilterIcon}
                           alt="FilterIcon"
                           className="filter-image-style"
                        />
                     </Col>
                     <Col
                        xl="9"
                        lg="8"
                        md="8"
                        sm="9"
                        className="applied-filters-style"
                     >
                        <Row style={{ marginRight: '0px' }}>
                           {displayDropdownList.includes(
                              bundleHierarchy.retailer
                           )
                              ? retainingData.applyStatus
                                 ? retainingData.retailerName &&
                                   retainingData.retailerName.length &&
                                   retainingData.retailerName[0] != undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.retailerName,
                                         false,
                                         bundleHierarchy.retailer,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.retailerList &&
                                   initialFilterData.retailerList.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.retailerList,
                                      false,
                                      bundleHierarchy.retailer,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.super_category
                           )
                              ? retainingData.applyStatus
                                 ? retainingData.superCategoryName &&
                                   retainingData.superCategoryName.length &&
                                   retainingData.superCategoryName[0] !=
                                      undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.superCategoryName,
                                         false,
                                         bundleHierarchy.super_category,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.superCategoryList &&
                                   initialFilterData.superCategoryList.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.superCategoryList,
                                      false,
                                      bundleHierarchy.super_category,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.child_super_category
                           )
                              ? retainingData.applyStatus
                                 ? retainingData.childSuperCategoryName &&
                                   retainingData.childSuperCategoryName
                                      .length &&
                                   retainingData.childSuperCategoryName[0] !=
                                      undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.childSuperCategoryName,
                                         false,
                                         bundleHierarchy.child_super_category,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.childSuperCategoryList &&
                                   initialFilterData.childSuperCategoryList
                                      .length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.childSuperCategoryList,
                                      false,
                                      bundleHierarchy.child_super_category,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.category
                           )
                              ? retainingData.applyStatus
                                 ? retainingData.categoryName &&
                                   retainingData.categoryName.length &&
                                   retainingData.categoryName[0] != undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.categoryName,
                                         false,
                                         bundleHierarchy.category,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.categoryList &&
                                   initialFilterData.categoryList.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.categoryList,
                                      false,
                                      bundleHierarchy.category,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.child_category
                           )
                              ? retainingData.applyStatus
                                 ? retainingData.childCategoryName &&
                                   retainingData.childCategoryName.length &&
                                   retainingData.childCategoryName[0] !=
                                      undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.childCategoryName,
                                         false,
                                         bundleHierarchy.child_category,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.childCategoryList &&
                                   initialFilterData.childCategoryList.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.childCategoryList,
                                      false,
                                      bundleHierarchy.child_category,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.sub_category
                           )
                              ? retainingData.applyStatus
                                 ? retainingData.subCategoryName &&
                                   retainingData.subCategoryName.length &&
                                   retainingData.subCategoryName[0] != undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.subCategoryName,
                                         false,
                                         bundleHierarchy.sub_category,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.subCategoryList &&
                                   initialFilterData.subCategoryList.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.subCategoryList,
                                      false,
                                      bundleHierarchy.sub_category,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.child_sub_category
                           )
                              ? retainingData.applyStatus
                                 ? retainingData.childSubCategoryName &&
                                   retainingData.childSubCategoryName.length &&
                                   retainingData.childSubCategoryName[0] !=
                                      undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.childSubCategoryName,
                                         false,
                                         bundleHierarchy.child_sub_category,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.childSubCategoryList &&
                                   initialFilterData.childSubCategoryList.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.childSubCategoryList,
                                      false,
                                      bundleHierarchy.child_sub_category,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(bundleHierarchy.brand)
                              ? retainingData.applyStatus
                                 ? retainingData.brandName &&
                                   retainingData.brandName.length &&
                                   retainingData.brandName[0] != undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.brandName,
                                         false,
                                         bundleHierarchy.brand,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.brandList &&
                                   initialFilterData.brandList.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.brandList,
                                      false,
                                      bundleHierarchy.brand,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.sub_family
                           )
                              ? retainingData.applyStatus
                                 ? retainingData.subFamilyName &&
                                   retainingData.subFamilyName.length &&
                                   retainingData.subFamilyName[0] != undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.subFamilyName,
                                         false,
                                         bundleHierarchy.sub_family,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.subFamilyList &&
                                   initialFilterData.subFamilyList.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.subFamilyList,
                                      false,
                                      bundleHierarchy.sub_family,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.sub_brand
                           )
                              ? retainingData.applyStatus
                                 ? retainingData.subBrandName &&
                                   retainingData.subBrandName.length &&
                                   retainingData.subBrandName[0] != undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.subBrandName,
                                         false,
                                         bundleHierarchy.sub_brand,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.subBrandList &&
                                   initialFilterData.subBrandList.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.subBrandList,
                                      false,
                                      bundleHierarchy.sub_brand,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.city_set
                           ) &&
                           (retailerType === bundleHierarchy.onlineretailer ||
                              retailerType === bundleHierarchy.hyperlocal)
                              ? retainingData.applyStatus
                                 ? retainingData.citySetName &&
                                   retainingData.citySetName.length &&
                                   retainingData.citySetName[0] != undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.citySetName,
                                         false,
                                         bundleHierarchy.city_set,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.city &&
                                   initialFilterData.city.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.city,
                                      false,
                                      bundleHierarchy.city_set,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.pincode_set
                           ) &&
                           (retailerType === bundleHierarchy.onlineretailer ||
                              retailerType === bundleHierarchy.hyperlocal)
                              ? retainingData.applyStatus
                                 ? retainingData.pincodeSetName &&
                                   retainingData.pincodeSetName.length &&
                                   retainingData.pincodeSetName[0] != undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.pincodeSetName,
                                         false,
                                         bundleHierarchy.pincode_set,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.pincode &&
                                   initialFilterData.pincode.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.pincode.map(
                                         (pincodeItem) => {
                                            let pincodeObject = {
                                               id: pincodeItem.id,
                                               label: `${pincodeItem.name} - ${pincodeItem.label}`,
                                               name: pincodeItem.name,
                                               value: `${pincodeItem.name} - ${pincodeItem.label}`,
                                            }
                                            return pincodeObject
                                         }
                                      ),
                                      false,
                                      bundleHierarchy.pincode_set,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.store_set
                           ) && retailerType === bundleHierarchy.hyperlocal
                              ? retainingData.applyStatus
                                 ? retainingData.storeSetName &&
                                   retainingData.storeSetName.length &&
                                   retainingData.storeSetName[0] != undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.storeSetName,
                                         false,
                                         bundleHierarchy.store_set,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.store &&
                                   initialFilterData.store.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.store,
                                      false,
                                      bundleHierarchy.store_set,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.retailers_category
                           )
                              ? retainingData.applyStatus
                                 ? retainingData.retailerCategoryName &&
                                   retainingData.retailerCategoryName.length &&
                                   retainingData.retailerCategoryName[0] !=
                                      undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.retailerCategoryName,
                                         false,
                                         bundleHierarchy.retailers_category,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.retailerCategory &&
                                   initialFilterData.retailerCategory.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.retailerCategory,
                                      false,
                                      bundleHierarchy.retailers_category,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.keyword_type
                           )
                              ? retainingData.applyStatus
                                 ? retainingData.keywordCategoryName &&
                                   retainingData.keywordCategoryName.length &&
                                   retainingData.keywordCategoryName[0] !=
                                      undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.keywordCategoryName,
                                         false,
                                         bundleHierarchy.keyword_type,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.keywordCategoryList &&
                                   initialFilterData.keywordCategoryList.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.keywordCategoryList,
                                      false,
                                      bundleHierarchy.keyword_type,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.skl_type
                           )
                              ? retainingData.applyStatus
                                 ? retainingData.keywordType &&
                                   retainingData.keywordType.length &&
                                   retainingData.keywordType[0] != undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.keywordType,
                                         false,
                                         bundleHierarchy.skl_type,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.keywordTypeList &&
                                   initialFilterData.keywordTypeList.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.keywordTypeList,
                                      false,
                                      bundleHierarchy.skl_type,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.keyword_tag
                           )
                              ? retainingData.applyStatus
                                 ? retainingData.keywordTag &&
                                   retainingData.keywordTag.length &&
                                   retainingData.keywordTag[0] != undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.keywordTag,
                                         false,
                                         bundleHierarchy.keyword_tag,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.keywordTagList &&
                                   initialFilterData.keywordTagList.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.keywordTagList,
                                      false,
                                      bundleHierarchy.keyword_tag,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.keyword
                           )
                              ? retainingData.applyStatus
                                 ? retainingData.keywordName &&
                                   retainingData.keywordName.length &&
                                   retainingData.keywordName[0] != undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.keywordName,
                                         false,
                                         bundleHierarchy.keyword,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.keywordList &&
                                   initialFilterData.keywordList.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.keywordList,
                                      false,
                                      bundleHierarchy.keyword,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(
                              bundleHierarchy.position
                           )
                              ? retainingData.applyStatus
                                 ? retainingData.positionNumber &&
                                   retainingData.positionNumber.length &&
                                   retainingData.positionNumber[0] != undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.positionNumber,
                                         false,
                                         bundleHierarchy.position,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData
                                 ? // && initialFilterData.position - need to check after initial request run for position also
                                   this.renderAppliedFilterLayout(
                                      [
                                         {
                                            id: this.isFirstPage(
                                               defaultSearchPosition
                                            )
                                               ? defaultSearchPosition
                                               : `Top ${defaultSearchPosition}`,
                                            name: this.isFirstPage(
                                               defaultSearchPosition
                                            )
                                               ? defaultSearchPosition
                                               : `Top ${defaultSearchPosition}`,
                                            label: this.isFirstPage(
                                               defaultSearchPosition
                                            )
                                               ? defaultSearchPosition
                                               : `Top ${defaultSearchPosition}`,
                                            value: this.isFirstPage(
                                               defaultSearchPosition
                                            )
                                               ? initialFilterData.isFirstPageDisabled
                                                  ? `Top ${TEN_AS_STRING}`
                                                  : defaultSearchPosition
                                               : `Top ${defaultSearchPosition}`,
                                         },
                                      ],
                                      false,
                                      bundleHierarchy.position,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(bundleHierarchy.date)
                              ? retainingData.applyStatus
                                 ? date
                                    ? this.renderAppliedFilterLayout(
                                         date,
                                         true,
                                         bundleHierarchy.date,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData && initialFilterData.toDate
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.toDate,
                                      true,
                                      bundleHierarchy.date,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {displayDropdownList.includes(bundleHierarchy.sku)
                              ? retainingData.applyStatus
                                 ? retainingData.skuName &&
                                   retainingData.skuName.length &&
                                   retainingData.skuName[0] != undefined
                                    ? this.renderAppliedFilterLayout(
                                         retainingData.skuName,
                                         false,
                                         bundleHierarchy.sku,
                                         retainingData.powerSku
                                      )
                                    : null
                                 : initialFilterData &&
                                   initialFilterData.skuList &&
                                   initialFilterData.skuList.length
                                 ? this.renderAppliedFilterLayout(
                                      initialFilterData.skuList,
                                      false,
                                      bundleHierarchy.sku,
                                      retainingData.powerSku
                                   )
                                 : null
                              : null}
                           {/* {displayDropdownList.includes(
										bundleHierarchy.mustsell
									)
										? retainingData.applyStatus &&
										  retainingData.powerSku &&
										  this.renderAppliedFilterLayout(
												bundleHierarchy.power_sku,
												true,
												bundleHierarchy.mustsell,
												retainingData.powerSku
										  )
										: null} */}
                        </Row>
                     </Col>
                     <Col
                        xl="1"
                        lg="1"
                        md="1"
                        sm="1"
                        className={
                           resetStatus && retainingData.applyStatus
                              ? 'clear-all-filters-style'
                              : 'clear-all-disable-filters-style'
                        }
                        onClick={
                           resetStatus &&
                           retainingData.applyStatus &&
                           this.handleClear
                        }
                     >
                        {RESET_FILTER}
                     </Col>
                  </Row>
               </Card>
            )}
            <ModalComponent
               // isShowModal={this.state.showModal}
               isShowModal={false}
               onHideModal={this.handleModalClose}
               modalTitle={this.handleModalTitle()}
               modalContent={this.modalContent()}
               modalSize="md"
            />
         </>
      )
   }
}

export default connect(mapStateToProps, null)(AppliedFilterGrid)
