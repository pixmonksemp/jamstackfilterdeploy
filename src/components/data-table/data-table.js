// import React, { useState, useEffect } from "react"
// import { DataTable } from "primereact/datatable"
// import { Column } from "primereact/column"
// import "./style.scss"
// import SearchBar from "./search-box"
// import { classNames } from "primereact/utils"
// import { Button } from "primereact/button"
// import SearchableDropdown from "../../components/searchable-select/index"
// import { Card, Spinner } from "react-bootstrap"
// import i18n from "../../translate/i18n"
// import DataNotAvailable from "../data-not-available-component/data-not-available"
// import { ROW_EDIT_BODY, ROW_EDIT_BUTTON } from "../../common/common-constants"
// import PimerceAuth from "../authorization-tag/PimerceAuth"

// function PimerceDataTable(props) {
//   const [data, setGridData] = useState(props.data)
//   const [firstRow, setFirstRow] = useState(0)
//   const [rowSize, setRowSize] = useState(10)
//   const [selectedRow, setSelectedRow] = useState(null)
//   const [multiSortMeta, setMultiSortMeta] = useState(props.sortData)
//   const [searchValue, setSearchValue] = useState("")
  
//   useEffect(() => {
//     setGridData(props.data)
//     if(props.pageDataReset){
//       setFirstRow(0)
//       setRowSize(10)
//     }
//   }, [props.data])
//   useEffect(() => {
//     if (props.isSelectedRowCleared) {
//       props.onSelectedRowDataTable(null)
//       setSelectedRow(null)
//     }
//   }, [props.isSelectedRowCleared])

//   const buttonGroup = (name) => {
//     let arr = [],
//       seletedfield = ""
//     selectedRow &&
//       selectedRow.length &&
//       selectedRow.map((item) => {
//         arr.push(item.id)
//       })
//     if (name.class == i18n.t("exportSheet.exportpdf")) {
//       seletedfield = i18n.t("exportSheet.pdf")
//     } else if (name.class == i18n.t("exportSheet.exportexcel")) {
//       seletedfield = i18n.t("exportSheet.excel")
//     } else if (name.class == i18n.t("exportSheet.exportemail")) {
//       seletedfield = i18n.t("exportSheet.email")
//     }
//     if(name.ButtonName == "Import Catalog"){
//       seletedfield = "importCatalog"
//     }
//     props.exportCallback(arr, seletedfield)
//   }

//   let dynamicbutton =
//     props.headerButtonsGrb &&
//     props.headerButtonsGrb.length != 0 &&
//     props.headerButtonsGrb.map((field, index) => {
//       return (
//         <>
//           {field.authId ? (
//             <PimerceAuth
//               componentId={field.authId}
//               componentType="button"
//               component={
//                 <>
//               {field.type != "attributes" ?
//               field.isDisableTooltip?
//               <>
//               <Button
//                   type="button"
//                   icon=" "
//                   iconPos={field.iconpos}
//                   label={field.ButtonName}
//                   onClick={buttonGroup.bind(this, field)}
//                   disabled= {field.isDisabled}
//                   className={`p-mr-2 pimbtn ${field.class}`}                  
//                 /> </>:
//                 <Button
//                   type="button"
//                   icon=" "
//                   iconPos={field.iconpos}
//                   label={field.ButtonName}
//                   onClick={buttonGroup.bind(this, field)}
//                   className={`p-mr-2 pimbtn ${field.class}`}
//                   data-pr-tooltip="CSV"
//                 />:
//                 <Button
//                   type="button"
//                   icon=" "
//                   iconPos={field.iconpos}
//                   onClick={buttonGroup.bind(this, field)}
//                   className={`p-mr-2 attr-pimbtn ${field.class}`}
//                   data-pr-tooltip={"Export Attributes"}
//                   style={{width : "3rem" , padding : "0px"}}
//                 />
//               }
//               </>
//               }
//             />
//           ) : (
//             <Button
//               type="button"
//               icon=" "
//               iconPos={field.iconpos}
//               label={field.ButtonName}
//               onClick={buttonGroup.bind(this, field)}
//               className={`p-mr-2 pimbtn ${field.class}`}
//               data-pr-tooltip="CSV"
//             />
//           )}
//         </>
//       )
//     })
//   let header = (
//     <div>
//       <div className="p-d-flex p-ai-center exportbtn export-buttons">
//         {props.gridHeader ? <h6 className="p-m-0 table-title mr-4">{props.gridHeader}</h6> : null}
//         {props.headerButtonTemplate ? 
//           props.headerButtonTemplate : null
//         }
//         {props.isAutoCompleteSearch ?
//           <div className="searchbox-holder-17 ml-4">{props.onautoComplete}</div> : null
//         }
//         {props.isHeaderButtonVisible
//           ? dynamicbutton
//           : data && data.length != 0
//           ? dynamicbutton
//           : null}
//         {props.isHeaderfilter ? (
//           <React.Fragment>
//             <SearchableDropdown
//               options={props.headerFilterOptions}
//               onMenuOpen={this.handleOpen}
//               onMenuClose={this.handleClose}
//               isLoading={true}
//               onChange={this.handleMultiSelectChange}
//               multiselect={false}
//               value={0}
//               className={"HeaderFilter"}
//             />
//           </React.Fragment>
//         ) : null}
//       </div>
//     </div>
//   )

//   const bodyTemplate = (rowData, column, click,isButton) => {
//     return <div>
//       {!click?isButton? 
//       <Button
//       onClick={()=>props.rowColumnClick(rowData,column)}
//       className="importdata-download-button"
//     >{rowData[column.field]}</Button>
//       :rowData[column.field]:
//             <a style={{textDecoration:'underline',cursor:'pointer'}}  onClick={()=>props.rowColumnClick(rowData,column)}>{rowData[column.field]}</a>}
//         </div>;
//   }

//   const dynamicColumns =
//     props.columnData &&
//     props.columnData.length != 0 &&
//     props.columnData.map((col, index) => {
//       let click = col.isClickable
//       let isButton = col.isButton
//       return (
//         props.isScrollable ?
//         <Column
//           className="columnheaderBg"
//           sortable={col.sortable}
//           key={col.field}
//           columnKey={col.field}
//           body={(e,c)=>{
//              return bodyTemplate(e,c,click,isButton)
//           }}
//           field={col.field}
//           header={col.header}
//           frozen={col.frozen}
//           filter={col.filter}
//           style={
//             !props.isGridCheckBox 
//               ? { flexGrow: 1, flexBasis: "13.5%" ,padding:"0px" }
//               : { flexGrow: 1, flexBasis: "13.5%" ,paddingRight:"12px",paddingLeft:"12px" }
//           }
//           editor={(options) => props.statusEditor(options)}
//         /> : <Column
//         className="columnheaderBg"
//         sortable={col.sortable}
//         key={col.field}
//         columnKey={col.field}
//         body={(e,c)=>{
//            return bodyTemplate(e,c,click,isButton)
//         }}
//         field={col.field}
//         header={col.header}
//         frozen={col.frozen}
//         filter={col.filter}
//         style = {!props.isGridCheckBox 
//           ? { width:col.width,padding:"0px" }
//           : { width:col.width,paddingRight:"12px",paddingLeft:"12px"}}
//         editor={(options) => props.statusEditor(options)}
//       />
//       )
//     })

//     const paginationTemplate = {
//       layout: "FirstPageLink PrevPageLink PageLinks current NextPageLink LastPageLink",
//       PrevPageLink: (options) => {
//         return (
//           <button
//             type="button"
//             className={options.className}
//             onClick={options.onClick}
//             disabled={options.disabled}
//           >
//             <span className="p-p-1">{i18n.t("dataTableText.previous")}</span>
//           </button>
//         )
//       },
//       NextPageLink: (options) => {
//         return (
//           <button
//             type="button"
//             className={options.className}
//             onClick={options.onClick}
//             disabled={options.disabled}
//           >
//             <span className="p-p-1">{i18n.t("dataTableText.next")}</span>
//           </button>
//         )
//       },
//       TotalCountPage:(options) =>{
//         return (
//           <button
//             type="button"
//             className={options.className}
//             onClick={options.onClick}
//           >
//             {options.props.pageCount}
//           </button>
//         )
//       },
//       PageLinks: (options) => {
//         if (
//           (options.view.startPage === options.page &&
//             options.view.startPage !== 0) ||
//           (options.view.endPage === options.page &&
//             options.page + 1 !== options.totalPages)
//         ) {
//           const className = classNames(options.className, {
//             "p-disabled": true
//           })
//           return (
//             <React.Fragment>
//             <span className={options.className} style={{ userSelect: "none" }}>
//               ...
//             </span>
//           </React.Fragment>
//           )
//         }
//         return (
//           <button
//             type="button"
//             className={options.className}
//             onClick={options.onClick}
//           >
//             {options.page + 1}
//           </button>
          
//         )
//       }
//     }
  
//   const onCheckBoxChange = (event) => {
//     setSelectedRow(event.value)
//     props.onSelectedRowDataTable(event.value)
//   }

//   const onSortChange = (event) => {
//     setMultiSortMeta(event.multiSortMeta)
//     props.handleSorting(event)
//   }

//   const onPageChange = (event) => {
//     setFirstRow(event.first)
//     setRowSize(event.rows)
//     props.handlePagination(event)
//   }

//   const onSearchText = (value, check) => {
//     setSearchValue(value)
//     props.searchResult(value, check)
//   }

//   const noRecordsFound = ()=>{
//     return <DataNotAvailable  validationMessage={props.validationMessage}/>
//   }
  
//   return (
//     <div className={`table ${ props.isScrollable ?"tablewidthauto":"tablefullwidth"} ${props.headerButtonsGrb == undefined && props.headerButtonTemplate == undefined && props.isAutoCompleteSearch == undefined && props.gridHeader == undefined ? "headerempty" : "" }`} style={props.tableStyle?props.tableStyle:{}}>
//       <Card>
//         <div className="gridcontainer">
//           {props.isLoader ? (
//             <Card className="loading-image">
//               <center style={{ margin: "auto" }}>
//                 <Card.Body>
//                   <Spinner animation="grow" className="spinner" />
//                 </Card.Body>
//               </center>
//             </Card>
//           ) : (
//             <DataTable
//               value={data}
//               className="p-mt-3"
//               selectionPageOnly
//               editMode="row"
//               dataKey="id"
//               rowEditValidator={props.rowEditValidator}
//               onRowEditComplete={props.onRowEditComplete}
//               filter
//               filterMenuStyle={{ width: "14rem" }}
//               style={{ minWidth: "14rem" }}
//               responsiveLayout="scroll"
//               sortMode="multiple"
//               totalRecords={props.totalRecords}
//               first={firstRow}
//               rows={props.isInfiniteRows?10000:rowSize}
//               multiSortMeta={multiSortMeta}
//               onPage={(data) => onPageChange(data)} //Pagination onchange event
//               onSort={(data)=> onSortChange(data)} //Sorting onchange event
//               paginator={props.isPaginator}
//               paginatorPosition={"top"}
//               paginatorClassName={"datatable-view-paginator"}
//               paginatorTemplate={paginationTemplate}
//               lazy={props.isLazy}
//               header={header} // Table Header
//               stripedRows={props.isStripedRows} // odd even color
//               scrollable={props.isScrollable}
//               scrollDirection="both" // horizontal and vertical scroll
//               scrollHeight={props.scrollHeight}
//               scrollWidth={props.scrollWidth}
//               size={props.gridSize}
//               selection={selectedRow}
//               emptyMessage={()=> noRecordsFound()}
//               onSelectionChange={onCheckBoxChange}
//               onRowEditCancel={props.onRowEditCancel}
//               onRowEditInit={props.onRowEditInit}
//               //////colresize
//               resizableColumns={props.isResizableColumns}
//               columnResizeMode={props.columnResizeMode}
//               showGridlines={props.isGridLines}
//               //////// colresize End
//               headerColumnGroup={
//                 props.isCustomGridHeader ? props.columnGroupHeader : null
//               }
//             >
//               {props.isExpandable ? <Column expander /> : null}
//               {!props.isGridCheckBox ? (
//                   <Column
//                     className="checkboxcloumn"
//                     selectionMode="multiple"
//                     hidden={props.isGridCheckBox}
//                   />
//               ) : (
//                 <Column hidden={true} />
//               )}
//               {dynamicColumns}
//               {props.enableRowEdit ? (
//                 <Column
//                   rowEditor
//                   className="editrowcell"
//                   headerStyle={ROW_EDIT_BUTTON}
//                   bodyStyle={ROW_EDIT_BODY}
//                 />
//               ) : null}
//             </DataTable>
//           )}
//         </div>
//       </Card>
//     </div>
//   )
// }
// export default PimerceDataTable
