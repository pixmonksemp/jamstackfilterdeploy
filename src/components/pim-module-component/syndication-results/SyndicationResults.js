import React, { useContext, useEffect, useState } from "react"
import { COLUMN_RESIZE_MODE, GRID_SIZE, IMAGE_EXT_VALIDATOR, SCROLL_HEIGHT, SCROLL_WIDTH } from "../../../common/common-constants"
import i18n from "../../../translate/i18n"
import PimerceDataTable from "../../data-table/data-table"
// import VIDEO_PREVIEW from "../../../assets/video_preview.png"
import PREVIEW from "../../../assets/no_preview.png"
import Nav from "../importdata/nav"
// import { TabView, TabPanel } from 'primereact/tabview'
import { Row, Spinner } from "react-bootstrap"
import HeaderContext from "../../../common/header-context"
import { stepList } from "../../../common/master-data"

function SyndicationResults(props){
    const renderimage = (thumbnailImage) => {
        return <img
        src={thumbnailImage}
        onError={(e) => (e.target.src = PREVIEW)}
        className="product-image"
        alt="No Image"
      />
        // !IMAGE_EXT_VALIDATOR.test(thumbnailImage) ? (
        //   <img
        //     src={VIDEO_PREVIEW}
        //     onError={(e) => (e.target.src = VIDEO_PREVIEW)}
        //     className="product-image"
        //     alt="No Image"
        //   />
        // ) : (
        //   <img
        //     src={thumbnailImage}
        //     onError={(e) => (e.target.src = PREVIEW)}
        //     className="product-image"
        //     alt="No Image"
        //   />
        // )
      }
    let grid = [
        {
            gtin:"66586876",
            productName:"Belvita Milk And Cereal Breakfast Biscuits 12 Pack",
            productgroups_id:renderimage("https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRB1UXqyiwFIheBMM0r4kOXMSsBu7bBdBFesETA8yCp_pWq7hX5E-paouWd3aab5O6vRbG9wMw-TDGLPopddQu8qLLxuYCZFOvV1HXmqGDL_s8Gwmc8UI1n&usqp=CAE")
        },{
            gtin:'241234123',
            productName:'BelVita Bran Biscuit 62gx12 Box',
            productgroups_id:renderimage('https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRWhXatnJcOnuDWXcGfX0Pvyn43Zi7ZFCO8gRnF_JBvSbgoXbE8QW7yD8RjnuuVuaashhpkRyYr1PgRnJCqslVI7jPsFWc_AtSW4AMiFlyO4VXsOyyJPx8X&usqp=CAE')
        }
    ],
    headerButtonGroup = [
        {
          
          ButtonName: "Rerun Validations",
          class: "",
          iconpos: "right"
        }
      ]
    let gridTwo = [
        {
            gtin:'241234123',
            productName:'BelVita Bran Biscuit 62gx12 Box',
            error:"2 issues",
            fixIssues:"Fix Issues",
            productgroups_id:renderimage('https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRWhXatnJcOnuDWXcGfX0Pvyn43Zi7ZFCO8gRnF_JBvSbgoXbE8QW7yD8RjnuuVuaashhpkRyYr1PgRnJCqslVI7jPsFWc_AtSW4AMiFlyO4VXsOyyJPx8X&usqp=CAE')
        }
    ]
    let gridColumn = [
        {
            field: "productgroups_id",
            header: i18n.t("gridColumn.Thumbnail"),
            sortable: false,
          },
        {
          field: "gtin",
          header: i18n.t("gridColumn.GTIN"),
          filter: false,
        },
        {
          field: "productName",
          header: i18n.t("gridColumn.ProductName"),
          filter: false,
        }
      ]
      let gridColumnTwo = [
        {
            field: "productgroups_id",
            header: i18n.t("gridColumn.Thumbnail"),
            sortable: false,
          },
        {
          field: "gtin",
          header: i18n.t("gridColumn.GTIN"),
          filter: false,
        },
        {
          field: "productName",
          header: i18n.t("gridColumn.ProductName"),
          filter: false,
        },
        {
            field: "error",
            header: "Errors",
            isClickable : true,
            sortable: false
          },
          {
            field:"fixIssues",
            header:'',
            isButton:true
          }
      ]
    const [isSelectedRowCleared, setIsSelectedRowCleared] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoader,setLoader] = useState(true)
    const {
        ProductSkuDetails: { ProductSkuContextValue, setProductSkuContextValue },
        ProductSkuMethodName: {
          ProductMethodContextValue,
          setProductMethodContextValue,
        },
      } = useContext(HeaderContext)

    useEffect(()=>{
        setTimeout(()=>{
            setLoader(false)
        },2000)
    },[])
    return(
        <>
        <div className="mb-4 mt-4" style={{ background: 'white', borderRadius: '6px', padding: '1px', marginRight: '-15px' }}>
        <Nav totalSteps={5} stepList={stepList} currentStep={3}/>
        </div>
        {isLoader?<div style={{margin:'20%', textAlign:'center'}}>
        {/* <Row> */}
        <Spinner animation="border"  />
        {/* </Row><Row> */}
        <h4>Validating selected products!!</h4>
        {/* </Row> */}
        </div>:
        <div>
        <div className="p-grid common-header-section">
        <h5 className="p-m-0  p-col-12  page-header">Readiness Results</h5>
      </div>
      <div>
        <p>Total SKUs : 3</p>
        <p>
            Passed SKUs : 2
        </p>
        <p>
            Failed SKUs : 1
        </p>
      </div>
      {/* <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
    <TabPanel header="Passed SKUS">
    <PimerceDataTable
        columnData={gridColumn}
        data={grid}
        isSelectedRowCleared={isSelectedRowCleared}
        totalRecords={0}
        isPaginator={false}
        isScrollable={true}
        isLazy={true}
        gridHeader={"Passed SKUs"}
        // popupHeader={popupHeader}
        isPopupCancelBtn={false}
        isToolbar={true}
        // deleteButtonLabel={deleteButtonLabel}
        // updateButtonLabel={updateButtonLabel}
        isGridCheckBox={ true}
        isLoader={false}
        onSelectedRowDataTable={()=>{}}
        isHeaderSearch={false}
        isHeaderfilter={false}
        scrollHeight={SCROLL_HEIGHT}
        scrollWidth={SCROLL_WIDTH}
        columnResizeMode={COLUMN_RESIZE_MODE}
        gridSize={GRID_SIZE}
        // handlePagination={onPageChange}
        isHeaderButtonVisible={false}
        // SUGGESTION_OPTION={SUGGESTION_OPTION}
        // autoComplete={autoComplete}
        isCleared={false}
        // onChangeAutoComplete={onChangeAutoComplete}
        // onSearchBoxText={onSearchBoxText}
        // onautoComplete={autocompleteDropdown}
        pageDataReset={false}
      />
    </TabPanel>
    <TabPanel header="Failed SKUS">
    <PimerceDataTable
        columnData={gridColumnTwo}
        data={gridTwo}
        isSelectedRowCleared={isSelectedRowCleared}
        totalRecords={0}
        isPaginator={false}
        isScrollable={true}
        rowColumnClick={(row,column)=>{
            if(column.field == 'fixIssues'){
                let value = [
                    {
                        "id": 3896,
                        "gtin": "188hjcdbb173",
                        "productName": "Beauty&care32",
                        "productgroups_id": {
                            "type": "img",
                            "key": null,
                            "ref": null,
                            "props": {
                                "src": "https://pixmonksdevspace.sgp1.digitaloceanspaces.com/pimcollections/111222333/assets/5085400b0a5fb31e5f38be3285139061_111222333_en.jpeg",
                                "className": "product-image",
                                "alt": "No Image"
                            },
                            "_owner": null
                        },
                        "isChecked": false
                    }
                ]
                setProductSkuContextValue(JSON.stringify(value))
                setProductMethodContextValue("UPDATE")
                const data = {
                    key: "enhancedContent",
                  }
                  props.history.push("/enhancedContent")
                  props.triggerPageLayout(data)
            }
        }}
        isLazy={true}
        gridHeader={"Failed SKUs"}
        // popupHeader={popupHeader}
        isPopupCancelBtn={false}
        isToolbar={true}
        exportCallback={()=>{ 
            setLoader(true)
            setTimeout(()=>{
                setActiveIndex(0)
                setLoader(false)
            },2000)
        }}
        // deleteButtonLabel={deleteButtonLabel}
        // updateButtonLabel={updateButtonLabel}
        isGridCheckBox={ true}
        isLoader={false}
        onSelectedRowDataTable={()=>{}}
        isHeaderSearch={false}
        isHeaderfilter={false}
        scrollHeight={SCROLL_HEIGHT}
        scrollWidth={SCROLL_WIDTH}
        columnResizeMode={COLUMN_RESIZE_MODE}
        gridSize={GRID_SIZE}
        // handlePagination={onPageChange}
        isHeaderButtonVisible={true}
        headerButtonsGrb={ headerButtonGroup}
        // SUGGESTION_OPTION={SUGGESTION_OPTION}
        // autoComplete={autoComplete}
        isCleared={false}
        // onChangeAutoComplete={onChangeAutoComplete}
        // onSearchBoxText={onSearchBoxText}
        // onautoComplete={autocompleteDropdown}
        pageDataReset={false}
      />
    </TabPanel>
    </TabView> */}
        </div>}
            </>
    )
}

export default SyndicationResults