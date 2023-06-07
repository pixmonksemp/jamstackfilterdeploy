import React, { useEffect, useState, useRef } from 'react'
import './style.scss'
import ArrowRight from '../../../assets/line-arrow-right.svg'
import DeleteIcon from '../../../assets/deleteSvg.svg'
import { Card, Col, Row, Spinner } from 'react-bootstrap'
import FilterAndAppliedFilter from '../../filter/components/filter-appliedfilter-combine-component/filter-appliedfilter-component'
import { connect } from 'react-redux'
import { Toast } from 'primereact/toast'
import ToastModal from '../../modal/ToastModal'
import { Cascader } from 'rsuite'
import './rsuite.scss'
import DataNotAvailable from '../../data-not-available-component/data-not-available'
import PimerceDataTable from '../../../components/data-table/data-table'
import extend from 'extend'
import ModalComponent from '../../modal/index'
import { Button } from 'primereact/button'
import { sortArrayOfObjectValues } from '../../filter/components/filter-component/filterdata-constant'
import i18n from '../../../translate/i18n'
import { ERROR_BG_COLOR, MEDIUM } from '../../../common/common-constants'

const mapStateToProps = (state) => {
   return {
      getFilterDataValue: state.stateData.getFilterdata,
      getUserDetail: state.userDetail.getUsersObj.userCredentials,
   }
}

let requestParams = {
      retailerId: '',
      organizationId: '',
      retailerList: [],
      superCategoryIdList: [],
      childSuperCategoryIdList: [],
      categoryIdList: [],
      childCategoryIdList: [],
      subCategoryIdList: [],
      childSubCategoryIdList: [],
      brandIdList: [],
      subFamilyIdList: [],
      subBrandIdList: [],
      mappedArrayValue: [],
      type: '',
      listOfValues: [],
      username: '',
      pimerceOrganizationId: '',
      isRCMappingSingleSelect: false,
   },
   columnsForGrid = []

function RetailersCategoryMapperComponent(props) {
   const { getFilterDataValue, getUserDetail } = props
   let authJson = JSON.parse(sessionStorage.getItem('authJson'))
   const toastReference = useRef(null)
   let filterOptions = getFilterDataValue
      ? JSON.parse(
           getFilterDataValue.organization.defaultoption.FilterDropdowns
        )
      : null
   let staticConstants = getFilterDataValue
      ? JSON.parse(
           getFilterDataValue.organization.defaultoption.StaticConstants
        )
      : null
   let initialPageRequest = getFilterDataValue
      ? getFilterDataValue.initialRequest.RCmapper
      : null
   requestParams.organizationId = getUserDetail.organizationid
   requestParams.username = getUserDetail.username
   requestParams.pimerceOrganizationId = getFilterDataValue.organization.id

   let dynamicColumnHeaders = [],
      dropdownMasterIds,
      dropdownMasterNames
   if (sessionStorage.getItem('OrgSpec')) {
      dropdownMasterIds = JSON.parse(sessionStorage.getItem('OrgSpec')).pix
         .hierarchyMasterIds
      dropdownMasterNames = JSON.parse(sessionStorage.getItem('OrgSpec')).pix
         .hierarchyConstantsMap
      if (
         dropdownMasterIds !== null &&
         dropdownMasterIds !== undefined &&
         dropdownMasterNames !== null &&
         dropdownMasterNames !== undefined
      ) {
         Object.keys(dropdownMasterNames).map((masterNames) => {
            if (!Object.keys(dropdownMasterIds).includes(masterNames)) {
               dynamicColumnHeaders.push(masterNames)
            }
         })
      }
   }

   columnsForGrid = []
   if (dynamicColumnHeaders && dynamicColumnHeaders.length > 0) {
      dynamicColumnHeaders = [...new Set(dynamicColumnHeaders)]

      if (dynamicColumnHeaders.includes('superCategory'))
         columnsForGrid.push({
            field: 'superCategory',
            header: dropdownMasterNames.superCategory,
            width: '15%',
         })
      if (dynamicColumnHeaders.includes('childSuperCategory'))
         columnsForGrid.push({
            field: 'childSuperCategory',
            header: dropdownMasterNames.childSuperCategory,
            width: '15%',
         })
      if (dynamicColumnHeaders.includes('category'))
         columnsForGrid.push({
            field: 'category',
            header: dropdownMasterNames.category,
            width: '15%',
         })
      if (dynamicColumnHeaders.includes('childCategory'))
         columnsForGrid.push({
            field: 'childCategory',
            header: dropdownMasterNames.childCategory,
            width: '15%',
         })
      if (dynamicColumnHeaders.includes('subCategory'))
         columnsForGrid.push({
            field: 'subCategory',
            header: dropdownMasterNames.subCategory,
            width: '15%',
         })
      if (dynamicColumnHeaders.includes('childSubCategory'))
         columnsForGrid.push({
            field: 'childSubCategory',
            header: dropdownMasterNames.childSubCategory,
            width: '15%',
         })
      if (dynamicColumnHeaders.includes('brand'))
         columnsForGrid.push({
            field: 'brand',
            header: dropdownMasterNames.brand,
            width: '15%',
         })
      if (dynamicColumnHeaders.includes('childBrand'))
         columnsForGrid.push({
            field: 'subFamily',
            header: dropdownMasterNames.childBrand,
            width: '15%',
         })
      if (dynamicColumnHeaders.includes('subBrand'))
         columnsForGrid.push({
            field: 'subBrand',
            header: dropdownMasterNames.subBrand,
            width: '15%',
         })
   }

   columnsForGrid.push({
      field: 'retailerCategory',
      header: i18n.t('rcMapper.retailerCategoryHierarchy'),
      width: '60%',
   })

   //filter
   const [date, setDate] = useState(new Date())
   const [filterCheck, setFilterCheck] = useState(false)
   //rc
   const [retailerLogo, setRetailerLogo] = useState('')
   const [
      mappedRetailerCategoriesForDisplay,
      setMappedRetailerCategoriesForDisplay,
   ] = useState([])
   const [loadingForMappedRC, setLoadingForMappedRC] = useState(true)
   const [loadingForMasterRC, setLoadingForMasterRC] = useState(true)
   const [retailerCategoriesList, setRetailerCategoriesList] = useState([])
   const [dropdownOptionList, setDropdownOptionList] = useState([])
   const [onSelectMasterRCValue, setOnSelectMasterRCValue] = useState([])
   //toast
   const [isToastShow, setIsToastShow] = useState(false)
   const [toastHeading, setToastHeading] = useState('')
   const [toastContent, setToastContent] = useState('')
   const [toastTitleBackgroundColor, setToastTitleBackgroundColor] =
      useState('')
   const [toastSize, setToastSize] = useState('')
   const [dataForGrid, setDataForGrid] = useState([])
   const [isModalToDisplay, setIsModalToDisplay] = useState(false)
   const [modalTitle, setModalTitle] = useState('')
   const [modalContent, setModalContent] = useState('')
   const [deleteRequestParams, setDeleteRequestParams] = useState({})
   const [modalType, setModalType] = useState('')
   const [readAgainContent, setReadAgainContent] = useState('')
   const [isRCMappingSingleSelect, setIsRCMappingSingleSelect] = useState(false)
   const [isRCMappingLeastSelect, setIsRCMappingLeastSelect] = useState(false)
   const [isLeastSelect, setIsLeastSelect] = useState(false)

   useEffect(() => {
      const { getMasterRetailerCategoriesResult } = props
      if (
         getMasterRetailerCategoriesResult &&
         getMasterRetailerCategoriesResult.content &&
         getMasterRetailerCategoriesResult.content.status !== 200
      ) {
         setIsToastShow(true)
         setToastHeading(i18n.t('toastMessage.requestFailed'))
         setToastContent(i18n.t('toastMessage.requestFailedMessage'))
         setToastSize(MEDIUM)
         setToastTitleBackgroundColor(ERROR_BG_COLOR)
         setLoadingForMasterRC(false)
      }
      if (
         getMasterRetailerCategoriesResult &&
         getMasterRetailerCategoriesResult.content &&
         getMasterRetailerCategoriesResult.content.data &&
         getMasterRetailerCategoriesResult.content.status === 200
      ) {
         setIsToastShow(false)
         setRetailerCategoriesList([])
         if (
            getMasterRetailerCategoriesResult.content.data.mappedArrayValue &&
            getMasterRetailerCategoriesResult.content.data.mappedArrayValue
               .length > 0
         ) {
            let masterRetailerCategoriesList = []
            getMasterRetailerCategoriesResult.content.data.mappedArrayValue.map(
               (masterRCItem) => {
                  masterRetailerCategoriesList =
                     masterRetailerCategoriesList.concat(
                        JSON.parse(masterRCItem)
                     )
               }
            )
            setRetailerCategoriesList(masterRetailerCategoriesList)
         }
         setLoadingForMasterRC(false)
      }
   }, [props.getMasterRetailerCategoriesResult])

   useEffect(() => {
      if(props.getOrgRetailerByIdResult && props.getOrgRetailerByIdResult.content && props.getOrgRetailerByIdResult.content.data &&
         props.getOrgRetailerByIdResult.content.status == 200 )
         {
             if(props.getOrgRetailerByIdResult.content.data.is_rc_mapping_least_select && !isLeastSelect){
                setIsModalToDisplay(true)
                setModalTitle("Please select Least leaf node")
                setModalType('Add Success')
                setModalContent(i18n.t('rcMapper.retailerLeastNode'))
                setLoadingForMappedRC(false)  
             }else{
                setIsModalToDisplay(false)
                props.getOrUpdateMapperRetailerCategories(requestParams)
             }
          }
    }, [props.getOrgRetailerByIdResult])

   const designForRCMappedObject = (
      selectedRCItems,
      mappedRCIndex,
      rcOuterItems,
      mappedRCItem
   ) => {
      let pathItemsOfRC = ''
      if (selectedRCItems && selectedRCItems.length > 0) {
         selectedRCItems.map((selectedItems, index) => {
            pathItemsOfRC = pathItemsOfRC + selectedItems
            if (index + 1 < selectedRCItems.length) {
               pathItemsOfRC = pathItemsOfRC + ' > '
            }
         })
      }
      return (
         <>
            <div className="rc-mapper-selected-data-style">
               {selectedRCItems &&
                  selectedRCItems.length > 0 &&
                  selectedRCItems.map((selectedItems, index) => {
                     return (
                        <>
                           <span style={{ width: 'max-content' }}>
                              {selectedItems}
                           </span>
                           {index + 1 < selectedRCItems.length ? (
                              <>
                                 &ensp;
                                 <img
                                    src={ArrowRight}
                                    className="rc-mapper-selected-items-right-arrow-style"
                                 />
                                 &ensp;
                              </>
                           ) : (
                              ''
                           )}
                        </>
                     )
                  })}
            </div>
            {authJson['46'].isEnabled ? (
               <img
                  src={DeleteIcon}
                  className="rc-mapper-selected-rc-delete-icon-style"
                  onClick={() => {
                     setIsModalToDisplay(true)
                     setModalTitle(i18n.t('rcMapper.deleteMapping'))
                     setModalType('Delete Confirmation')
                     setModalContent(
                        `${i18n.t('rcMapper.deleteNotification')} ${
                           rcOuterItems.childCategory
                        } : ${pathItemsOfRC}`
                     )
                     handleDeleteForRC(
                        mappedRCItem,
                        rcOuterItems,
                        mappedRCIndex,
                        selectedRCItems
                     )
                  }}
               />
            ) : null}
         </>
      )
   }

   useEffect(() => {
      const { getOrUpdateMapperRetailerCategoriesResult } = props
      if (
         getOrUpdateMapperRetailerCategoriesResult &&
         getOrUpdateMapperRetailerCategoriesResult.content &&
         getOrUpdateMapperRetailerCategoriesResult.content.status !== 200
      ) {
         if (requestParams.type === 'read') {
            setIsToastShow(true)
            setToastHeading(i18n.t('toastMessage.requestFailed'))
            setToastContent(i18n.t('toastMessage.requestFailedMessage'))
            setToastSize(MEDIUM)
            setToastTitleBackgroundColor(ERROR_BG_COLOR)
         } else if (requestParams.type === 'delete') {
            setIsModalToDisplay(true)
            setModalTitle(i18n.t('rcMapper.deleteMapping'))
            setModalType('Delete Failure')
            setModalContent(i18n.t('rcMapper.deleteFailure'))
         } else if (requestParams.type === 'update') {
            setIsModalToDisplay(true)
            setModalTitle(i18n.t('rcMapper.addMapping'))
            setModalType('Add Failure')
            setModalContent(i18n.t('rcMapper.addFailure'))
         }
         setLoadingForMappedRC(false)
      }
      if (
         getOrUpdateMapperRetailerCategoriesResult &&
         getOrUpdateMapperRetailerCategoriesResult.content &&
         getOrUpdateMapperRetailerCategoriesResult.content.data &&
         getOrUpdateMapperRetailerCategoriesResult.content.status === 200
      ) {
         let status = ''
         if (
            getOrUpdateMapperRetailerCategoriesResult.content.data.length > 0
         ) {
            if (getOrUpdateMapperRetailerCategoriesResult.content.data[0].url)
               setRetailerLogo(
                  getOrUpdateMapperRetailerCategoriesResult.content.data[0].url
               )

            if (requestParams.type === 'read') {
               setDataForGrid([])
               setMappedRetailerCategoriesForDisplay([])
               let mappedRetailerCategoriesList = [],
                  dataForGrid = []
               getOrUpdateMapperRetailerCategoriesResult.content.data.map(
                  (rcOuterItems, rcOuterIndex) => {
                     status = rcOuterItems.type
                     if (
                        rcOuterItems.mappedArrayValue &&
                        rcOuterItems.mappedArrayValue.length > 0
                     ) {
                        mappedRetailerCategoriesList =
                           mappedRetailerCategoriesList.concat(
                              rcOuterItems.mappedArrayValue
                           )
                        rcOuterItems.mappedArrayValue.map(
                           (mappedRCItem, mappedRCIndex) => {
                              let selectedRCItems = []
                              if (mappedRCItem && mappedRCItem.root) {
                                 let splitByLevels =
                                    mappedRCItem.root.split('$%^')
                                 if (
                                    splitByLevels &&
                                    splitByLevels.length > 0
                                 ) {
                                    splitByLevels.map((levelItems) => {
                                       let splitByIdAndName =
                                          levelItems.split('!@#')
                                       if (
                                          splitByIdAndName &&
                                          splitByIdAndName.length > 0
                                       ) {
                                          selectedRCItems.push(
                                             splitByIdAndName[1]
                                          )
                                       }
                                    })
                                 }
                                 dataForGrid.push({
                                    id: rcOuterItems.id,
                                    retailerId: rcOuterItems.retailerId,
                                    superCategoryIdList:
                                       rcOuterItems.superCategoryIdList,
                                    childSuperCategoryIdList:
                                       rcOuterItems.childSuperCategoryIdList,
                                    categoryIdList: rcOuterItems.categoryIdList,
                                    childCategoryIdList:
                                       rcOuterItems.childCategoryIdList,
                                    subCategoryIdList:
                                       rcOuterItems.subCategoryIdList,
                                    childSubCategoryIdList:
                                       rcOuterItems.childSubCategoryIdList,
                                    brandIdList: rcOuterItems.brandIdList,
                                    subFamilyIdList:
                                       rcOuterItems.subFamilyIdList,
                                    subBrandIdList: rcOuterItems.subBrandIdList,
                                    superCategory: rcOuterItems.superCategory,
                                    childSuperCategory:
                                       rcOuterItems.childSuperCategory,
                                    category: rcOuterItems.category,
                                    childCategory: rcOuterItems.childCategory,
                                    subCategory: rcOuterItems.subCategory,
                                    childSubCategory:
                                       rcOuterItems.childSubCategory,
                                    brand: rcOuterItems.brand,
                                    subFamily: rcOuterItems.subFamily,
                                    subBrand: rcOuterItems.subBrand,
                                    unique_id: mappedRCItem.unique_id,
                                    rootIds: mappedRCItem.rootIds,
                                    retailerCategory: designForRCMappedObject(
                                       selectedRCItems,
                                       mappedRCIndex,
                                       rcOuterItems,
                                       mappedRCItem
                                    ),
                                 })
                              }
                           }
                        )
                     }
                  }
               )
               if (
                  mappedRetailerCategoriesList &&
                  mappedRetailerCategoriesList.length > 0
               ) {
                  setMappedRetailerCategoriesForDisplay(
                     mappedRetailerCategoriesList
                  )
               }
               if (dataForGrid && dataForGrid.length > 0) {
                  setDataForGrid(dataForGrid)
               }
            } else if (requestParams.type === 'delete') {
               getOrUpdateMapperRetailerCategoriesResult.content.data.map(
                  (deleteItems) => {
                     status = deleteItems.type
                  }
               )
            } else if (requestParams.type === 'update') {
               getOrUpdateMapperRetailerCategoriesResult.content.data.map(
                  (newRCItems) => {
                     status = newRCItems.type
                  }
               )
            }
         }

         if (
            status === 'create' ||
            status === 'update' ||
            status === 'delete'
         ) {
            setReadAgainContent({
               status: status,
               isAction: true,
               pimCategory: readAgainContent.pimCategory,
               rcHierarchy: readAgainContent.rcHierarchy,
            })
            setLoadingForMappedRC(true)
            requestParams.type = 'read'
            requestParams.mappedArrayValue = []
            props.getOrUpdateMapperRetailerCategories(requestParams)
         } else {
            setLoadingForMappedRC(false)

            if (
               readAgainContent !== null &&
               readAgainContent !== undefined &&
               readAgainContent.isAction !== null &&
               readAgainContent.isAction
            ) {
               if (
                  readAgainContent.status === 'create' ||
                  readAgainContent.status === 'update'
               ) {
                  setIsToastShow(true)
                  setToastHeading(i18n.t('rcMapper.addMapping'))
                  setToastContent(i18n.t('rcMapper.addSuccess'))
                  setToastSize(MEDIUM)
                  setToastTitleBackgroundColor(ERROR_BG_COLOR)
                  //modal msg design for add success
                  // setIsModalToDisplay(true)
                  // setModalTitle('Add Mapping')
                  // setModalType('Add Success')
                  // setModalContent(
                  //    'The selected category hierarchy mapping has been added.'
                  // )
               } else if (readAgainContent.status === 'delete') {
                  setIsToastShow(true)
                  setToastHeading(i18n.t('rcMapper.deleteMapping'))
                  setToastContent(
                     `${i18n.t('rcMapper.deleteSuccess')} ${
                        readAgainContent.pimCategory
                     } : ${readAgainContent.rcHierarchy}`
                  )
                  setToastSize(MEDIUM)
                  setToastTitleBackgroundColor(ERROR_BG_COLOR)
                  //modal msg design for delete success
                  // setIsModalToDisplay(true)
                  // setModalTitle('Delete Mapping')
                  // setModalType('Delete Success')
                  // setModalContent(
                  //    `The following mapping has been deleted: ${readAgainContent.pimCategory} : ${readAgainContent.rcHierarchy}`
                  // )
               }
            }
            setReadAgainContent({})
         }
      }
   }, [props.getOrUpdateMapperRetailerCategoriesResult])

   const initialRenderFilter = (data, status, enableOptionList) => {
      if (status === 'initial' || status === 'reset') {
         setDropdownOptionList(enableOptionList)
         //retailer always will be single select
         requestParams.retailerId = initialPageRequest.pimRetailerID
         //tag => will indicate whether the retailer will accept single select or multi select rc mapping
         setIsRCMappingSingleSelect(initialPageRequest.retailerList[0].tag)
         requestParams.retailerList = initialPageRequest.retailerList
         requestParams.isRCMappingSingleSelect =
            initialPageRequest.retailerList[0].tag
         requestParams.superCategoryIdList =
            initialPageRequest.superCategoryList.map((item) => {
               return item.id
            })
         requestParams.childSuperCategoryIdList =
            initialPageRequest.childSuperCategoryList.map((item) => {
               return item.id
            })
         requestParams.categoryIdList = initialPageRequest.categoryList.map(
            (item) => {
               return item.id
            }
         )
         requestParams.childCategoryIdList =
            initialPageRequest.childCategoryList.map((item) => {
               return item.id
            })
         requestParams.subCategoryIdList =
            initialPageRequest.subCategoryList.map((item) => {
               return item.id
            })
         requestParams.childSubCategoryIdList =
            initialPageRequest.childSubCategoryList.map((item) => {
               return item.id
            })
         requestParams.brandIdList = initialPageRequest.brandList.map(
            (item) => {
               return item.id
            }
         )
         requestParams.subFamilyIdList = initialPageRequest.subFamilyList.map(
            (item) => {
               return item.id
            }
         )
         requestParams.subBrandIdList = initialPageRequest.subBrandList.map(
            (item) => {
               return item.id
            }
         )
         requestParams.type = 'read'
         requestParams.mappedArrayValue = []
         requestParams.listOfValues = []
         setLoadingForMappedRC(true)
         setLoadingForMasterRC(true)
         props.getOrUpdateMapperRetailerCategories(requestParams)
         props.getMasterRetailerCategories(requestParams)
         setOnSelectMasterRCValue([])
      }
   }

   const handleApplyFilter = (
      isRetailerStatus,
      applyStatus,
      commonReducerName,
      appliedData
   ) => {
      setFilterCheck(applyStatus)
      setDate(new Date())
      if (commonReducerName != 'clear') {
         //retailer always will be single select
         requestParams.retailerId = appliedData.retailerName[0].id
         //tag => will indicate whether the retailer will accept single select or multi select rc mapping
         setIsRCMappingSingleSelect(appliedData.retailerName[0].tag)
         requestParams.retailerList = appliedData.retailerName
         requestParams.isRCMappingSingleSelect = appliedData.retailerName[0].tag
         requestParams.superCategoryIdList = dropdownOptionList.includes(
            staticConstants.super_category
         )
            ? appliedData.superCategoryName.map((item) => {
                 return item.id
              })
            : initialPageRequest.superCategoryList.map((item) => {
                 return item.id
              })
         requestParams.childSuperCategoryIdList = dropdownOptionList.includes(
            staticConstants.child_super_category
         )
            ? appliedData.childSuperCategoryName.map((item) => {
                 return item.id
              })
            : initialPageRequest.childSuperCategoryList.map((item) => {
                 return item.id
              })
         requestParams.categoryIdList = dropdownOptionList.includes(
            staticConstants.category
         )
            ? appliedData.categoryName.map((item) => {
                 return item.id
              })
            : initialPageRequest.categoryList.map((item) => {
                 return item.id
              })
         requestParams.childCategoryIdList = dropdownOptionList.includes(
            staticConstants.child_category
         )
            ? appliedData.childCategoryName.map((item) => {
                 return item.id
              })
            : initialPageRequest.childCategoryList.map((item) => {
                 return item.id
              })
         requestParams.subCategoryIdList = dropdownOptionList.includes(
            staticConstants.sub_category
         )
            ? appliedData.subCategoryName.map((item) => {
                 return item.id
              })
            : initialPageRequest.subCategoryList.map((item) => {
                 return item.id
              })
         requestParams.childSubCategoryIdList = dropdownOptionList.includes(
            staticConstants.child_sub_category
         )
            ? appliedData.childSubCategoryName.map((item) => {
                 return item.id
              })
            : initialPageRequest.childSubCategoryList.map((item) => {
                 return item.id
              })
         requestParams.brandIdList = dropdownOptionList.includes(
            staticConstants.brand
         )
            ? appliedData.brandName.map((item) => {
                 return item.id
              })
            : initialPageRequest.brandList.map((item) => {
                 return item.id
              })
         requestParams.subFamilyIdList = dropdownOptionList.includes(
            staticConstants.sub_family
         )
            ? appliedData.subFamilyName.map((item) => {
                 return item.id
              })
            : initialPageRequest.subFamilyList.map((item) => {
                 return item.id
              })
         requestParams.subBrandIdList = dropdownOptionList.includes(
            staticConstants.sub_brand
         )
            ? appliedData.subBrandName.map((item) => {
                 return item.id
              })
            : initialPageRequest.subBrandList.map((item) => {
                 return item.id
              })
         requestParams.type = 'read'
         requestParams.mappedArrayValue = []
         requestParams.listOfValues = []
         setLoadingForMappedRC(true)
         setLoadingForMasterRC(true)
         props.getOrUpdateMapperRetailerCategories(requestParams)
         props.getMasterRetailerCategories(requestParams)
         setOnSelectMasterRCValue([])
      }
   }

   const handleCloseFilter = (status) => {
      setFilterCheck(status)
   }

   const checkRcMappingleafSelect = (requestParams) =>{
      props.getOrgRetailerById(null,requestParams.retailerList[0].id)
   }

   const handleDeleteForRC = (
      deleteRCObject,
      deleteRCOuterItems,
      deleteRCIndex,
      deleteSelectedRCItems
   ) => {
      requestParams.type = 'delete'
      let deleteRequestParams = extend(true, {}, requestParams)
      deleteRequestParams.superCategoryIdList =
         deleteRCOuterItems.superCategoryIdList
      deleteRequestParams.childSuperCategoryIdList =
         deleteRCOuterItems.childSuperCategoryIdList
      deleteRequestParams.categoryIdList = deleteRCOuterItems.categoryIdList
      deleteRequestParams.childCategoryIdList =
         deleteRCOuterItems.childCategoryIdList
      deleteRequestParams.subCategoryIdList =
         deleteRCOuterItems.subCategoryIdList
      deleteRequestParams.childSubCategoryIdList =
         deleteRCOuterItems.childSubCategoryIdList
      deleteRequestParams.brandIdList = deleteRCOuterItems.brandIdList
      deleteRequestParams.subFamilyIdList = deleteRCOuterItems.subFamilyIdList
      deleteRequestParams.subBrandIdList = deleteRCOuterItems.subBrandIdList
      if (deleteRCObject && deleteRCObject.unique_id)
         deleteRequestParams.listOfValues = [deleteRCObject.unique_id]
      setDeleteRequestParams({})
      setDeleteRequestParams(deleteRequestParams)

      let pathItemsOfRC = ''
      if (deleteSelectedRCItems && deleteSelectedRCItems.length > 0) {
         deleteSelectedRCItems.map((selectedItems, index) => {
            pathItemsOfRC = pathItemsOfRC + selectedItems
            if (index + 1 < deleteSelectedRCItems.length) {
               pathItemsOfRC = pathItemsOfRC + ' > '
            }
         })
      }
      setReadAgainContent({
         pimCategory: deleteRCOuterItems.childCategory,
         rcHierarchy: pathItemsOfRC,
         status: readAgainContent.status,
         isAction: readAgainContent.isAction,
      })
   }

   const handleAddMapping = () => {
      let isValueAlreadyPresent = dataForGrid.find(
         (gridValues) =>
            gridValues.rootIds === onSelectMasterRCValue[0].rootIds &&
            gridValues.superCategoryIdList[0] ===
               requestParams.superCategoryIdList[0] &&
            gridValues.childSuperCategoryIdList[0] ===
               requestParams.childSuperCategoryIdList[0] &&
            gridValues.categoryIdList[0] === requestParams.categoryIdList[0] &&
            gridValues.childCategoryIdList[0] ===
               requestParams.childCategoryIdList[0] &&
            gridValues.subCategoryIdList[0] ===
               requestParams.subCategoryIdList[0] &&
            gridValues.childSubCategoryIdList[0] ===
               requestParams.childSubCategoryIdList[0] &&
            gridValues.brandIdList[0] === requestParams.brandIdList[0] &&
            gridValues.subFamilyIdList[0] ===
               requestParams.subFamilyIdList[0] &&
            gridValues.subBrandIdList[0] === requestParams.subBrandIdList[0]
      )
      if (isValueAlreadyPresent === undefined) {
         if (isRCMappingSingleSelect) {
            let isValueAlreadyPresentWithoutRootIds = dataForGrid.find(
               (gridValues) =>
                  gridValues.superCategoryIdList[0] ===
                     requestParams.superCategoryIdList[0] &&
                  gridValues.childSuperCategoryIdList[0] ===
                     requestParams.childSuperCategoryIdList[0] &&
                  gridValues.categoryIdList[0] ===
                     requestParams.categoryIdList[0] &&
                  gridValues.childCategoryIdList[0] ===
                     requestParams.childCategoryIdList[0] &&
                  gridValues.subCategoryIdList[0] ===
                     requestParams.subCategoryIdList[0] &&
                  gridValues.childSubCategoryIdList[0] ===
                     requestParams.childSubCategoryIdList[0] &&
                  gridValues.brandIdList[0] === requestParams.brandIdList[0] &&
                  gridValues.subFamilyIdList[0] ===
                     requestParams.subFamilyIdList[0] &&
                  gridValues.subBrandIdList[0] ===
                     requestParams.subBrandIdList[0]
            )
            if (isValueAlreadyPresentWithoutRootIds === undefined) {
               requestParams.type = 'update'
               requestParams.mappedArrayValue = onSelectMasterRCValue
               setLoadingForMappedRC(true)
               checkRcMappingleafSelect(requestParams)
               setIsLeastSelect(requestParams.mappedArrayValue[0] && requestParams.mappedArrayValue[0].leaf)
            } else {
               setIsModalToDisplay(true)
               setModalTitle(i18n.t('rcMapper.addMapping'))
               setModalType('Overwrite Mapping')
               setModalContent(i18n.t('rcMapper.selectionNotification'))
            }
         } else {
            requestParams.type = 'update'
            requestParams.mappedArrayValue = onSelectMasterRCValue
            setLoadingForMappedRC(true)
            checkRcMappingleafSelect(requestParams)
            setIsLeastSelect(requestParams.mappedArrayValue[0] && requestParams.mappedArrayValue[0].leaf)
         }
      } else {
         setIsModalToDisplay(true)
         setModalTitle(i18n.t('rcMapper.addMapping'))
         setModalType('Add Duplicate')
         setModalContent(i18n.t('rcMapper.alreadyPresentAlert'))
      }
   }

   const handleToastHide = () => {
      setIsToastShow(false)
   }

   const handleMasterRCSelect = (selectedValue, selectedPathOptions) => {
      let rootPath = '',
         rootPathIds = ''
      if (selectedPathOptions && selectedPathOptions.length > 0) {
         selectedPathOptions.map((selectedItem, index) => {
            rootPath =
               rootPath + selectedItem.value + '!@#' + selectedItem.label
            rootPathIds = rootPathIds + selectedItem.value
            if (index < selectedPathOptions.length - 1)
               rootPath = rootPath + '$%^'
         })
      }
      setOnSelectMasterRCValue([])
      setOnSelectMasterRCValue([
         {
            unique_id: Date.now(),
            root: rootPath,
            rootIds: rootPathIds,
            name: selectedValue.label,
            id: selectedValue.value,
            leaf: selectedValue.leaf
         },
      ])
   }

   const handlePageChange = (pagedata) => {
      console.log(pagedata, 'pagedata')
   }

   const handleYesButtonInModal = () => {
      if (modalType === 'Delete Confirmation') {
         setLoadingForMappedRC(true)
         setIsModalToDisplay(false)
         props.getOrUpdateMapperRetailerCategories(deleteRequestParams)
      } else if (
         modalType === 'Add Success' ||
         modalType === 'Add Duplicate' ||
         modalType === 'Delete Success' ||
         modalType === 'Add Failure' ||
         modalType === 'Delete Failure'
      ) {
         setIsModalToDisplay(false)
      } else if (modalType === 'Overwrite Mapping') {
         requestParams.type = 'update'
         requestParams.mappedArrayValue = onSelectMasterRCValue
         setLoadingForMappedRC(true)
         checkRcMappingleafSelect(requestParams)
         setIsLeastSelect(requestParams.mappedArrayValue[0] && requestParams.mappedArrayValue[0].leaf)
      }
   }

   const modalFooterStyle = (
      <React.Fragment>
         {modalType === 'Add Duplicate' ||
         modalType === 'Add Success' ||
         modalType === 'Delete Success' ||
         modalType === 'Add Failure' ||
         modalType === 'Delete Failure' ? (
            ''
         ) : (
            <Button
               label={'No'}
               className="p-button-text custom-button cancel-button"
               onClick={() => onHideModal()}
            />
         )}
         <Button
            label={
               modalType === 'Add Duplicate' ||
               modalType === 'Add Success' ||
               modalType === 'Delete Success' ||
               modalType === 'Add Failure' ||
               modalType === 'Delete Failure'
                  ? 'OK'
                  : 'Yes'
            }
            className="p-button-text custom-button btn-yes"
            onClick={() => handleYesButtonInModal()}
         />
      </React.Fragment>
   )

   const onHideModal = () => {
      setIsModalToDisplay(false)
   }

   return (
      <>
         <Toast ref={toastReference} />
         <ToastModal
            show={isToastShow}
            title={toastHeading}
            titleBackgroundColor={toastTitleBackgroundColor}
            content={toastContent}
            size={toastSize}
            onModalHide={handleToastHide}
         />
         <ModalComponent
            isShowModal={isModalToDisplay}
            onHideModal={onHideModal}
            modalTitle={modalTitle}
            modalContent={
               <div className="rc-confirmation-content-style">
                  <i
                     className="exclamation-triangle"
                     style={{ fontSize: '2rem' }}
                  />
                  <span>{modalContent}</span>
               </div>
            }
            modalSize="md"
            modalDailogClassName="modalDailogContent smallDialog"
            modalFooter={modalFooterStyle}
         />
         <img src={retailerLogo} className="rc-mapper-retailer-log-style" />
         <Row className="m-0">
            <Col
               className="card pim-filter-component"
               xl={2}
               lg={2}
               md={2}
               sm={2}
               xs={2}
            >
               <FilterAndAppliedFilter
                  latestScrapDate={date}
                  handleApplyFilter={handleApplyFilter}
                  appliedFilterHideDropdown={filterOptions.PIM_Retailers_Category_Mapper.applied_filter_hide_dropdown.split(
                     ', '
                  )}
                  appliedFilterInitailLoadedValues={initialPageRequest}
                  selectedValuesForFilter={{
                     toDate: new Date(),
                     fromDate: new Date(),
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
                     organizationId:
                        getFilterDataValue && getFilterDataValue.organization
                           ? getFilterDataValue.organization.id
                           : '',
                  }}
                  initialRenderFilter={(data, status, enableOptionList) => {
                     initialRenderFilter(data, status, enableOptionList)
                  }}
                  handleCloseFilter={handleCloseFilter}
                  filterHideDropdown={filterOptions.PIM_Retailers_Category_Mapper.filter_hide_dropdown.split(
                     ', '
                  )}
                  filterHideDropdownWithFunctionality={filterOptions.PIM_Retailers_Category_Mapper.filter_hide_dropdown_with_functionality.split(
                     ', '
                  )}
                  isRetailerCardImagePresent={false}
                  isFilterChecked={filterCheck}
                  filterTarget={undefined}
                  filterSingleSelectDropdown={filterOptions.PIM_Retailers_Category_Mapper.filter_single_select_dropdown.split(
                     ', '
                  )}
                  moduleNameForFilter={'PIM RC Mapper'}
                  firstDropdownForFIlter={''}
                  listOfDummyDropdownsForFilter={[staticConstants.retailer]}
               />
            </Col>
            <Col
               xl={10}
               lg={10}
               md={10}
               sm={10}
               xs={10}
               style={{ paddingRight: '0px' }}
            >
               <Card className="rc-mapper-outer-container">
                  <div className="rc-mapper-title-style">
                     {i18n.t('rcMapper.mappingDesignTitle')}
                  </div>
                  {loadingForMasterRC ? (
                     <center style={{ padding: '155px' }}>
                        <Spinner animation="grow" className="spinner" />
                     </center>
                  ) : (
                     <>
                        {retailerCategoriesList.length > 0 ? (
                           <>
                              <div className="rc-mapper-outer-box-style">
                                 <Cascader
                                    data={retailerCategoriesList}
                                    onSelect={handleMasterRCSelect}
                                    /*
                                       showing the line without select option (false => select dropdown will display,
                                       true => direct values will load)
                                    */
                                    inline
                                    //filter
                                    searchable={false}
                                    menuHeight={320}
                                    menuWidth={180}
                                 />
                              </div>
                           </>
                        ) : (
                           <>
                              <center style={{ margin: 'auto' }}>
                                 <DataNotAvailable />
                              </center>
                           </>
                        )}
                     </>
                  )}
                  {retailerCategoriesList.length > 0 ? (
                     <>
                        {authJson['46'].isEnabled ? (
                           <div
                              className="rc-mapper-confirm-button-style"
                              style={
                                 loadingForMasterRC || loadingForMappedRC
                                    ? {
                                         cursor: 'no-drop',
                                         opacity: 0.6,
                                      }
                                    : onSelectMasterRCValue &&
                                      onSelectMasterRCValue.length === 0
                                    ? {
                                         cursor: 'no-drop',
                                         opacity: 0.6,
                                      }
                                    : { cursor: 'pointer' }
                              }
                              onClick={() => {
                                 loadingForMasterRC || loadingForMappedRC
                                    ? ''
                                    : onSelectMasterRCValue &&
                                      onSelectMasterRCValue.length === 0
                                    ? ''
                                    : handleAddMapping()
                              }}
                           >
                              {i18n.t('rcMapper.addMappingButton')}
                           </div>
                        ) : null}
                     </>
                  ) : null}
               </Card>
               <PimerceDataTable
                  gridHeader={i18n.t('rcMapper.mappingGridTitle')}
                  tableStyle={{ marginRight: '-29px', marginTop: '15px' }}
                  isGridCheckBox={true}
                  isScrollable={false}
                  columnData={columnsForGrid}
                  validationMessage={i18n.t('noMappingAvailable')}
                  data={
                     dataForGrid && dataForGrid.length > 0
                        ? dataForGrid.sort(
                             sortArrayOfObjectValues('unique_id', 'desc')
                          )
                        : []
                  }
                  isLoader={loadingForMappedRC}
                  isPaginator={true}
                  handlePagination={handlePageChange}
                  totalRecords={
                     dataForGrid && dataForGrid.length > 0
                        ? dataForGrid.length
                        : 0
                  }
               />
            </Col>
         </Row>
      </>
   )
}

export default connect(mapStateToProps)(RetailersCategoryMapperComponent)
