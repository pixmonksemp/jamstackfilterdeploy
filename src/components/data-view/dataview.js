import React, { useState, useEffect } from "react"
import { DataView, DataViewLayoutOptions } from "primereact/dataview"
import PREVIEW from "../../assets/no_preview.png"
import VIDEO_PREVIEW from "../../assets/video_preview.png"
import editIcon from "../../assets/editPen.svg"
import deleteIcon from "../../assets/deleteSvg.svg"
import Deleteicon from "../../common/icons/deleteicon"
import SortIcon from "../../assets/sortingIcon.svg"
import { Card , Spinner } from "react-bootstrap"
import { ASC, DELIST, DESC, GRID, IMAGE_EXT_VALIDATOR, LIST, NEXT, PAGELINKSIZE, PAGINATOR_TEMPLATE, PREV, ROWSPERPAGEOPTIONS, TOP, UPDATED_DATE_ASC, UPDATED_DATE_DESC, UPDATED_NAME_ASC, UPDATED_NAME_DESC } from "../../common/common-constants"
import { Checkbox } from "primereact/checkbox"
import "./style.scss"
import { dataViewMatchColumns, isValidUrl } from "../util/common-util"
import { sortTypes } from "../../common/master-data"
import { Ripple } from "primereact/ripple"
import { classNames } from "primereact/utils"
import DropdownButton from "react-bootstrap/DropdownButton"
import { RadioButton } from "primereact/radiobutton"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import PimerceAuth from "../authorization-tag/PimerceAuth"
import i18n from "../../translate/i18n"

function dataview(props) {
  let gridData = dataViewMatchColumns(props),
  authJson = JSON.parse(sessionStorage.getItem("authJson"))
  const [checkValue, setCheckValue] = useState([])
  const [layout, setLayout] = useState("grid")
  const [associatedAssetList, setAssociatedAssetList] = useState([])
  const [first, setFirstRow] = useState(0)
  const [rows, setRowSize] = useState(15)
  const [isCheckAll, setIsCheckAll] = useState(false)
  const [checked, setChecked] = useState([])
  const [sortOrder, setSortOrder] = useState(null)
  const [sortField, setSortField] = useState(null)
  const [sortKey, setSortKey] = useState(null)
  const [event, setEvent] = useState(null)
  const [searchValue, setSearchValue] = useState("")
  const [sortingCateogry, setsortingCateogry] = useState(sortTypes[1])

  useEffect(() => {
    if (props && props.isSelectedRowCleared) {
      props.setIsSelectedRowCleared(false)
      associatedAssetList.length > 0 && setAssociatedAssetList([]) 
      setIsCheckAll(false)
    }
    if(gridData && gridData.length == 0){
      props.onSelectedRowDataTable &&
      props.onSelectedRowDataTable([])
    }
    if (props.pageDataReset) {
      setFirstRow(0)
    }
  }, [gridData])

  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll)
    setAssociatedAssetList(
      gridData&&gridData.map((data) => {
        return { ...data, isChecked: e.checked }
      })
    )
    if (isCheckAll) {
      var filteredElements = associatedAssetList.filter(function (obj1) {
        return !gridData.some(function (obj2) {
          return obj1.id === obj2.id
        })
      })
      setAssociatedAssetList(filteredElements)
    } else {
      let associatedData = associatedAssetList.concat(
        gridData&&gridData.map((data) => {
          return { ...data, isChecked: e.checked }
        })
      )
      let associatedRemoveData = [...new Map(associatedData.map(associatedData => [JSON.stringify(associatedData), associatedData])).values()]
      setAssociatedAssetList(associatedRemoveData)
    }
  }

  const compare = (arr1, arr2) => {
    if (!arr1 || !arr2) return
    let result
    arr1.forEach((e1, i) =>
      arr2.forEach((e2) => {
        if (e1.length > 1 && e2.length) {
          result = compare(e1, e2)
        } else if (e1 !== e2) {
          result = false
        } else {
          result = true
        }
      })
    )
    return result
  }

  const compareCheckBoxItem = () =>{
    let selectedAssetArray = []
    let selectDuplicateRemoveArray = []
    associatedAssetList.map((i) => {
      return gridData.map((j) => {
        if (i.id == j.id) {
          // if (i.isChecked == true) {
            selectedAssetArray.push(i.id)
          }
        // }
      })
    })
    let gridDataArray = gridData.map((i) => {
      return i.id
    })
    selectDuplicateRemoveArray = selectedAssetArray.filter((c, index) => {
      return selectedAssetArray.indexOf(c) === index;
      });
  
      setChecked(compare(selectDuplicateRemoveArray, gridDataArray))
  
      if (selectDuplicateRemoveArray.length >= gridData.length) {
        setIsCheckAll(true)
      }  
      else if(selectDuplicateRemoveArray.length < gridData.length){
        setIsCheckAll(false)
      }
   }
  

  const buttonGroup = (name) => {
    let arr = [],
      seletedfield = ""
      associatedAssetList &&
      associatedAssetList.length &&
      associatedAssetList.map((item) => {
        arr.push(item.id)
      })
    if (name.class == i18n.t("exportSheet.exportpdf")) {
      seletedfield = i18n.t("exportSheet.pdf")
    } else if (name.class == i18n.t("exportSheet.exportexcel")) {
      seletedfield = i18n.t("exportSheet.excel")
    } else if (name.class == i18n.t("exportSheet.exportemail")) {
      seletedfield = i18n.t("exportSheet.email")
    }
    props.exportCallback(arr, seletedfield)
  }

  let header = (
    <>
      {props.isHeaderButtonVisible ? (
          <div className="p-d-flex p-ai-center exportbtn export-buttons">
            {props.isCheckBoxEnabled ? (
              <>
                <Checkbox
                  inputId="select_all"
                  onChange={handleSelectAll}
                  checked={isCheckAll}
                  value={gridData}
                  className="mt-1"
                />
              <label htmlFor="select_all" className="p-m-0 table-title select-all-style mr-3" style={{marginRight:"auto"}}>
                {props.headerTitle}
              </label>
            </>
            ) : 
             <span htmlFor="select_all" className="p-m-0 table-title mr-4" style={{marginRight:"auto"}}>
            {props.headerTitle }
            </span>}
            {props.redirectedType && props.redirectedType()}
            {props.isMoreOptions && props.isMoreOptions()}
            {props.isSorting ? (
              <div className="dataview-mulitsort">
                <DropdownButton title={<img src={SortIcon} className="dataview-mulitsort-icon" />}>
                  <div className="pl-3 pr-2 dataview-multisort-effect">
                    {sortTypes && sortTypes.map((list) => {
                      return (
                        <div key={list.key} className="field-radiobutton mb-1">
                          <RadioButton
                            className="mt-2"
                            inputId={list.key}
                            name="list"
                            value={list}
                            onChange={(e) => onSortOrderChange(e)}
                            checked={sortingCateogry.key === list.key}
                          />
                          <img src={list.iconSpan} className="ml-2" />
                          <span
                            htmlFor={list.key}
                            className="sort-font-style ml-2 mt-1 font-weight-normal"
                          >
                            {list.name}
                            <img src={list.iClass} className={`${list.key=="A" ? "dataview-sort-asc-icon" : "dataview-sort-desc-icon"}`} />
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </DropdownButton>
              </div>
            ) : null}
            {props.isHeaderSearch ? (
              <div>
                {props.isMultiSearch ? (
                <div className="dataview-search-container">
                  <div className="searchbox-holder-17 ml-4">
                    {props.onautoComplete}
                  </div>
                </div>
                ) : (
                  <div className="dataview-search-container">
                    <span className="p-input-icon-left">
                      <i className="pi pi-search" />
                      <InputText
                        value={searchValue}
                        onChange={(e) => {
                          setSearchValue(e.target.value)
                          props.onSearchValueChange(e.target.value)}}
                          className="data-view-search"
                          placeholder="Search Retailers"
                      />
                    </span>
                  </div>
                )}
              </div>
            ) : null}
            {/* {props.totalRecords ? `Total Products - ${props.totalRecords}` : null} */}
            {props.headerButtonsGrb &&
              props.headerButtonsGrb.length != 0 &&
              props.headerButtonsGrb.map((field, index) => {
                return (
                  <>
                    {field.authId ? (
                      <PimerceAuth
                        componentId={field.authId}
                        componentType="button"
                        component={
                          <Button
                            type="button"
                            icon=" "
                            iconPos={field.iconpos}
                            label={field.ButtonName}
                            onClick={buttonGroup.bind(this, field)}
                            className={`p-mr-2 pimbtn ${field.class}`}
                            data-pr-tooltip="CSV"
                          />
                        }
                      />
                    ) : (
                      <Button
                        type="button"
                        icon=" "
                        iconPos={field.iconpos}
                        label={field.ButtonName}
                        onClick={buttonGroup.bind(this, field)}
                        className={`p-mr-2 pimbtn ${field.class}`}
                        data-pr-tooltip="CSV"
                      />
                    )}
                  </>
                )
              })}
            {props.layoutStyle ? (
              <div className="grid grid-nogutter">
                <div className="col-12" style={{ textAlign: "right" }}>
                  <DataViewLayoutOptions
                    layout={layout}
                    onChange={(e) => setLayout(e.value)}
                  />
                </div>
              </div>
            ) : null}
          </div>
      ) : null}
    </>
  )

  const templatePaginator = {
    layout: PAGINATOR_TEMPLATE,
    PrevPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-p-1 ">{PREV}</span>
        </button>
      )
    },
    NextPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-p-1">{NEXT}</span>
        </button>
      )
    },
    PageLinks: (options) => {
      if (
        (options.view.startPage === options.page &&
          options.view.startPage !== 0) ||
        (options.view.endPage === options.page &&
          options.page + 1 !== options.totalPages)
      ) {
        const className = classNames(options.className, { "p-disabled": true })

        return (
          <span className={className} style={{ userSelect: "none" , marginTop : "-4px" }}>
            ...
          </span>
        )
      }
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
        >
          {options.page + 1}
          <Ripple />
        </button>
      )
    },
  }
  const renderimage = (thumbnailImage,type) => {
   
    return  (
      <img
        src={thumbnailImage}
        onError={(e) => (e.target.src = PREVIEW)}
        className={props.imageStyle ? "product-image-org" : "product-image"}
        alt="No Image"
      />
    )
  }
  
  const updateSku = (updateId) => {
    let updateSku = []
    updateSku.push(updateId)
    props.onSelectedRowDataTable(updateSku)
    props.updateProductSku(updateSku, "UPDATE")
  }

  const deleteSku = (deleteId) => {
    let deletesku = []
    deletesku.push(deleteId)
    props.onDeletedRowDataTable(deletesku, "SINGLEDELETE")
  }

  const onSortOrderChange = (e) => {
    let sortFieldByDate = "updated_date",
      sortFieldByName = "product_name_search",
      sortTypeDESC = DESC,
      sortTypeASC = ASC
    setsortingCateogry(e.value)
    if (e.value.name === UPDATED_DATE_ASC) {
      onSortChange(sortFieldByDate, sortTypeASC)
    } else if (e.value.name === UPDATED_DATE_DESC) {
      onSortChange(sortFieldByDate, sortTypeDESC)
    } else if (e.value.name === UPDATED_NAME_ASC) {
      onSortChange(sortFieldByName, sortTypeASC)
    } else if (e.value.name === UPDATED_NAME_DESC) {
      onSortChange(sortFieldByName, sortTypeDESC)
    }
  }

  const onSortChange = (sortField, sortType, event) => {
    if (sortField.indexOf("!") === 0) {
      setSortOrder(-1)
      setSortField(sortField.substring(1, sortField.length))
      setSortKey(sortType)
    } else {
      setSortOrder(1)
      setSortField(sortField)
      setSortKey(sortType)
    }
    props.handleSorting(sortField, sortType, event)
  }

  const onPageChange = (event) => {
    setEvent(event)
    setFirstRow(event.first)
    setRowSize(event.rows)
    props.handlePagination(event)
  }

  const stopPropagation = (e) => {
    e.stopPropagation()
  }
  
  const renderGridContent = (data) =>{
    return (
    <div className="p-1">
        <div title={data.content_name} className="asset-grid-file-name text-overflow-fix tooltip-item  mt-1 ">
          {props.contentName ? `${props.contentName}:` : null} <span>{data.content_name}</span>
        </div>
        <div className="row">
          <div title={data.content_desc} className={`asset-grid-file-name text-overflow-fix tooltip-item ${props.isRenderTagItem ? "col-xl-12" : "col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6"}`}>
            {props.contentDesc ? `${props.contentDesc}:` : null} <span>{data.content_desc}</span>
          </div>
          {props.isRenderTagItem ?
            <div className={`col-xl-9 col-lg-8 col-md-9 col-sm-9 col-xs-9 dataview-tag-container ${props.redirectRenderTagItem && props.redirectRenderTagItem(data.contentTagItem).props.children != null ? "p-0" : "dataview-tag-width"}`}>
              {props.redirectRenderTagItem && props.redirectRenderTagItem(data.contentTagItem)}
            </div> : null}
          {props.isCardToolEnabled ?
          <div className={`dataview-tag-container ${props.isRenderTagItem ? "col-xl-3 col-lg-4 col-md-3 col-sm-3 col-xs-3 dataview-tag-option-style" : "col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-4"}`} onClick={stopPropagation}>
            <Button className="dataview-options-item p-button-rounded p-button-secondary" onClick={() => deleteSku(data)}>
              {props.optionalImg ? <img src={props.optionalImg} width="12px" height="12px" /> : <Deleteicon width="12px" height="12px" />}
            </Button>
          </div>: null}
        </div>
    </div>
  )}

  const itemTemplate = (data, layout) => {
    if (!data) {
      return
    }
    if (layout === LIST) {
      return renderListItem(data)
    } else if (layout === GRID) {
      return renderItemGrid(data)
    }
  }

  const renderListItem = (data) => {
    compareCheckBoxItem()
    props.onSelectedRowDataTable &&
      props.onSelectedRowDataTable(associatedAssetList)
    props.associtatedCheckData &&
      props.associtatedCheckData(associatedAssetList)

      // This props method is used to validate extension whether it is valid true else false
      props.validateExtension &&
      props.validateExtension(data.content_type)
  
      const dataViewSelect = (e) => {
        const { checked } = e.target
        const id = e.target.value
        if(!props.isSingleSelectCheckbox){
        setAssociatedAssetList([
          ...associatedAssetList.map((data) => {
            return { ...data, isChecked: checked }
          }),
          id,
        ])
        if (!checked) {
          setAssociatedAssetList(associatedAssetList.filter((item) => item.id !== id.id))
          setIsCheckAll(false)
        } else {
          if (associatedAssetList.some((i) => i.isChecked == true)) {
            setIsCheckAll(true)
          }
        }
        }else {
          let selectedAsset = []
          if (e.checked) selectedAsset.push(e.value)
          else selectedAsset.splice(associatedAssetList.indexOf(e.value), 1)
          setAssociatedAssetList(selectedAsset)
        }
      }
  
      const dataChecked = (data) => {
        let checkvalue = associatedAssetList.map((data) => {
          return data.id
        })
        return checkvalue.includes(data.id)
      }
  
    return (
      <div className="p-col-12">
        <div className="product-list-item">
          <div className="mr-4">
            <Checkbox
              inputId={data.id}
              value={data}
              checked={dataChecked(data)}
              onChange={dataViewSelect}
            />
          </div>
          {renderimage(data.content_image.props.src,data.content_type)}
          <div className="product-list-detail">
            <div className="product-name">
              {i18n.t("productSkulist.ProductName")}:{data.content_name}
            </div>
            <div className="product-description">
              {i18n.t("productSkulist.GTIN")}:{data.content_desc}
            </div>
          </div>
          <div className="product-list-action">
            {/* <span className="product-price"> */}
            <Button className="dataview-edit-button">
              <img
                style={{ cursor: "pointer" }}
                src={deleteIcon}
                onClick={() => {
                  deleteSku(data)
                }}
                width="16px"
                height="16px"
              />
            </Button>
            {/* </span> */}
            <Button className="dataview-edit-button">
              <img
                style={{ cursor: "pointer" }}
                src={editIcon}
                onClick={() => {
                  updateSku(data)
                }}
                width="18px"
                height="18px"
              />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderItemGrid = (data) => {

    compareCheckBoxItem()
    props.onSelectedRowDataTable &&
      props.onSelectedRowDataTable(associatedAssetList)
    props.associtatedCheckData &&
      props.associtatedCheckData(associatedAssetList)

    // This props method is used to validate extension whether it is valid true else false
    props.validateExtension &&
    props.validateExtension(data.content_type)

    const dataViewSelect = (e) => {
      const { checked } = e.target
      const id = e.target.value
      if(!props.isSingleSelectCheckbox){
      setAssociatedAssetList([
        ...associatedAssetList.map((data) => {
          return { ...data, isChecked: checked }
        }),
        id,
      ])
      if (!checked) {
        setAssociatedAssetList(associatedAssetList.filter((item) => item.id !== id.id))
        setIsCheckAll(false)
      } else {
        if (associatedAssetList.some((i) => i.isChecked == true)) {
          setIsCheckAll(true)
        }
      }
      }else {
        let selectedAsset = []
        if (e.checked) selectedAsset.push(e.value)
        else selectedAsset.splice(associatedAssetList.indexOf(e.value), 1)
        setAssociatedAssetList(selectedAsset)
      }
    }

    const dataChecked = (data) => {
      let checkvalue = associatedAssetList.map((data) => {
        return data.id
      })
      return checkvalue.includes(data.id)
    }

    return (
      <div className={props.isBoxSizing ? "dataview-grid col-xl-2 col-lg-2 col-md-4" : "dataview-grid col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 "}>
        <div className={props.imgContainerwidth ? "dataview-grid-item-org card" : "dataview-grid-item card hover-container"} onClick={() => {updateSku(data)}}>
          <div className={props.isCardHoverEnabled ? "dataview-grid-item-top hover-less-item" : (associatedAssetList.map((data) => {return data.id})).includes(data.id) == true ? "dataview-grid-item-top hover-less-item":"dataview-grid-item-top hover-item"}>
            {props.isCardHoverCheckBoxEnabled ? (
              <>
                <div onClick={stopPropagation} className="dataview-toolsheader">
                  <Checkbox
                    inputId={data}
                    value={data}
                    id={data.id}
                    checked={dataChecked(data)}
                    onChange={dataViewSelect}
                    disabled={props.isCheckBoxDisabled ? props.isValidationOnCheckBox() ? props.isValidationOnCheckBox(data.content_type) : null : false}
                  />
                </div>  
              </>
            ) : null}
          </div>
          <div className="dataview-grid-item-content" style={props.removeHandCursor?{ margin : "0px" }:{ cursor: "pointer",margin : "0px" }}>
            {renderimage(data.content_image.props.src,data.content_type)}
          </div>  
          {props.isContentItemEnabled ? (
             renderGridContent(data)
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      {props.isLoader ? (
        <Card className="dataview-loading-image">
          <center style={{ margin: "auto" }}>
            <Card.Body>
              <Spinner animation="grow" className="spinner" />
            </Card.Body>
          </center>
        </Card>
      ) : (
        <div className={props.imgContainerwidth? "dataview-grid-view-org margin-assign" : "dataview-grid-view margin-assign"}>
          <DataView
            className="asset-dataview"
            value={gridData}
            layout={layout}
            header={header}
            itemTemplate={itemTemplate}
            emptyMessage={i18n.t("dataview.noDataFound")}
            lazy={true}
            first={first}
            rows={rows}
            // Paginator props using DataView
            paginator={gridData && gridData.length > 0 ? props.isPaginator ? (props.isLoader ? false : true) : false : false}
            totalRecords={props.totalRecords}
            pageLinkSize={PAGELINKSIZE}
            paginatorPosition={TOP}
            paginatorClassName={"dataview-fixed-paginator"}
            currentPageReportTemplate={props.showTotalData}
            rowsPerPageOptions={ROWSPERPAGEOPTIONS}
            paginatorTemplate={templatePaginator}
            onPage={(data) => {onPageChange(data)}}
            // Sorting props using DataView
            sortOrder={sortOrder}
            sortField={sortField}
            loading={props.loading}
          />         
        </div>
      )}
    </React.Fragment>
  )
}

export default dataview
