import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { IMAGE_EXT_VALIDATOR } from "../../common/common-constants";
import PimerceDataView from "../data-view/dataview";
import VIDEO_PREVIEW from "../../assets/video_preview.png";
import Autocomplete from "@pixmonks/auto-complete";
import i18n from "../../translate/i18n";
import ModalComponent from "../filter/components/modal";
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { Button } from "primereact/button";
import { Steps } from 'primereact/steps'
import './style.scss'
import Nav from '../pim-module-component/importdata/nav'
import { Row } from "react-bootstrap";
import { InputText } from "primereact/inputtext";
import { stepList } from "../../common/master-data";
import PublishProductIcon from "../../common/icons/publishProductsicon";

const mapStateToProps = (state) => {
  return {
    getUserDetail: state.userDetail.getUsersObj.userCredentials,
  };
};

let dataViewColumn = [
  {
    field: "id",
    match: "id"
  },
  {
    field: "productName",
    match: "content_name"  
  },
  {
    field: "",
    match: "content_desc"
  },
  {
    field: "productgroups_id",
    match: "content_image"
  },
  {
    field: "retailerId",
    match: "retailerId"
  },
  {
    field: "retailerLogo",
    match: "retailerLogo"
  },
  {
    field: "productType",
    match: "content_type"
  }
]

function orgRetailer(props) {
  let authJson = JSON.parse(sessionStorage.getItem("authJson"))
  const { getUserDetail } = props
  let userDetails = getUserDetail
  const [gridData, setgridData] = useState([]);
  const [retailers, SetRetailers] = useState([])
  const [isCleared, setIsCleared] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [RetailerData, setRetailerData] = useState(null)
  const [retailerDetails, setretailerDetails] = useState([])
  const [retailerId, setRetailerId] = useState(null)
  const [retailerLogo,setRetailerLogo] = useState(null)
  const [category, setCategory] = useState(null)
  const [isLoader,setIsLoader] = useState(true)
  const [allRetailers, setAllRetailers] = useState([])
  const [searchboxValue, setSearchBoxValue] = useState(null)
  const [dropdownOptions,setDropdownOptions] = useState([])

  const animatedComponents = makeAnimated()
  // let dropdownOptions = [
  //   {
  //     value: 'Cookies & Sweet Treats',
  //     label: 'Cookies & Sweet Treats'
  //   },
  //   {
  //     value: 'Grocery/Snacks/Cookies',
  //     label: 'Grocery/Snacks/Cookies'
  //   }
  // ]

  let autoComplete = {
    optionClassName: "options",
    optionActiveClassName: "option-active",
    noOptionClassName: "no-options-dropdown",
    searchBoxPlaceholderClassName: "search-box-autocomplete",
    searchBarandIconClassName: "",
    searchBarBoxClassName: "search-bar-box search-bar-boxing",
    noOption: i18n.t("dataTableText.noOptions"),
  },
    SUGGESTION_OPTION = [],
    autocompleteDropdown = (
      <Autocomplete
        options={SUGGESTION_OPTION}
        onSearch={(event) => onSearchBoxText(event)}
        placeholder={i18n.t("dataTableText.skuSearchBoxPlaceholder")}
        isCleared={isCleared}
        autoComplete={autoComplete}
        onChangeValue={(e) => onChangeAutoComplete(e)}
      />
    );

  useEffect(() => {
    props.getAllRetailerData({ orgId: userDetails.organizationid })
    props.getAllRetailers()
    // let orgRetailerData = data.map((productSku) => {
    //   const dataValue = {};
    //   Object.assign(dataValue, {
    //     id: productSku.id,
    //     gtin: JSON.parse(productSku.uniqueColumns).uniqueColumn,
    //     productName: JSON.parse(productSku.mandatoryColumns).productName,
    //     productType: productSku.productType,
    //     productgroups_id: renderimage(productSku.thumbnailImage),
    //     isChecked: false,
    //   });
    //   return dataValue;
    // });
    // setgridData(orgRetailerData);
  }, []);

  useEffect(()=>{
    const {getRetailerCategoriesResult} = props
    if(getRetailerCategoriesResult&&
      getRetailerCategoriesResult.content&&
      getRetailerCategoriesResult.content.status == '200')
      {
        let retailerCategories = getRetailerCategoriesResult.content.data.map((i)=>{
          return {
            id:i.id,
            label:i.retailerCategory,
            value:i.retailerCategory
          }
        })
        setDropdownOptions(retailerCategories)
        setIsModalOpen(true)
      }
  },[props.getRetailerCategoriesResult])

  useEffect(() => {
    const { getAllRetailerDataResult } = props
    if (getAllRetailerDataResult &&
      getAllRetailerDataResult.content &&
      getAllRetailerDataResult.content.status == 200 &&
      getAllRetailerDataResult.content.data) {
      let values = []
      let retValues = []
      // setAllRetailers(getAllRetailerDataResult.content.data)
      getAllRetailerDataResult.content.data.map((i) => {
        if (!i.isfoundation) {
          let data = {
            id: i.id,
            gtin: null,
            productName: i.retailerName,
            productType: null,
            retailerId: i.retailerId,
            productgroups_id: renderimage(i.retailerLogo),
            retailerLogo:i.retailerLogo,
            isChecked: false,
          }
          retValues.push(i)
          values.push(data)
        }
      })
      retValues.map((i) => {
        retValues.push(i)
      })
      // retValues.concat(retValues)
      setAllRetailers(retValues)
      SetRetailers(values)
      // SetRetailers(retValues)
      setgridData(values)
      setIsLoader(false)
    }
  }, [props.getAllRetailerDataResult])

  useEffect(() => {
    const {
      getAllRetailersResult
    } = props

    if (
      getAllRetailersResult &&
      getAllRetailersResult.content &&
      getAllRetailersResult.content.data
    ) {
      setretailerDetails(getAllRetailersResult.content.data)
      // let retailerListData =
      //     getAllRetailersResult.content.data.map(
      //         (item) => {
      //             const dataValue = {}
      //             Object.assign(dataValue, {
      //                 id: item.id,
      //                 name: item.channelName,
      //             })
      //             return dataValue
      //         }
      //     )
      // setRetailerList(retailerListData)
    }
  }, [props.getAllRetailersResult])

  const renderimage = (thumbnailImage) => {
    return !IMAGE_EXT_VALIDATOR.test(thumbnailImage) ? (
      <img
        src={VIDEO_PREVIEW}
        onError={(e) => (e.target.src = VIDEO_PREVIEW)}
        alt="No Image"
      />
    ) : (
      <img
        src={thumbnailImage}
        onError={(e) => (e.target.src = VIDEO_PREVIEW)}
        alt="No Image"
      />
    );
  };

  const onModalClose = () => {
    setCategory(null)
    setIsModalOpen(false)
  }

  const modalContent =
    <div>
      <Select
        name="tags"
        isMulti={false}
        isClearable
        value={category}
        options={dropdownOptions}
        components={{
          animatedComponents,
          IndicatorSeparator: () => null,
        }}
        // styles={customStyles}
        onChange={(newValue) => {
          setCategory(newValue)
        }}
      />
      <Button
        disabled={category ? false : true}
        onClick={() => {
          // const data = {
          //   key: 'retailerAttributeMap'
          // }
          // props.triggerPageLayout(data)
          props.history.location.state = {
            data: RetailerData,
            retailerId: retailerId
            ,retailerLogo: retailerLogo,
            retailerCategoryId:category.id,
            retailerCategory:category.value
          }
          // props.history.push({
          //   pathname: '/retailerAttributeMap', state: {
          //     data: RetailerData,
          //     retailerId: retailerId
          //   }
          // });
          const data = {
            key:  'selectProducts' 
        }
        // props.history.push("/selectProducts")
        props.triggerPageLayout(data)
        props.history.push({
            pathname: '/selectProducts', state: {
              data: RetailerData,
                retailerId: retailerId,
                retailerLogo:retailerLogo,
                retailerCategoryId:category.id,
                retailerCategory:category.value
            }
        })
        }}
        style={
          {
            marginTop: '20px', float: 'right', width: '6rem'
            , opacity: category ? "1" : ".2"
          }
          //   values.isDisableDownload ? { opacity: ".1" } : {}
        }
        className="importdata-download-button"

      >
        Next
      </Button>
    </div>



  const interactiveItems = [
    {
      label: 'Select Retailer',
      className: "first-step"
    }, {
      label: 'Map Attributes'
    }, {
      label: "Select SKUs"
    }, {
      label: "Review Readiness"
    }, {
      label: "Publish",
      className: "last-step"
    }
  ]
  
  const rowCard = (data) => {
    let result = []
    for(let i=0;data.slice(i,i+5).length!=0;i=i+5){
      let slicedData = data.slice(i,i+5)
      if((5-slicedData.length)!=0){
        
        for(let j=0;j<(5-data.slice(i,i+5).length);j++){
          slicedData.push("")
        }
      }
      
    result.push(<div className="row mt-3" >
      {
        
        slicedData.map((j)=>{
          return <div className="col">{j?<div style={{border:"1px solid gainsboro",padding:"10px",borderRadius:"10px"}}><img src={j.retailerLogo} style={{height:'10rem',width:'-webkit-fill-available'}} /></div>:j}</div>
        })
      }
    </div>)
  }
  return result
  }
  return (
    <React.Fragment>
      <div className="p-grid common-header-section">
        <h5 className="p-m-0  p-col-12  page-header"><PublishProductIcon /> Publish Products</h5>
      </div>
      <div className="mb-4" style={{ background: 'white', borderRadius: '6px', padding: '1px', marginRight: '-15px',height:"65px" }}>
        {/* <Steps model={interactiveItems}
          activeIndex={0} readOnly={true}
        /> */}
        <Nav totalSteps={5} stepList={stepList} currentStep={1}/>
      </div>

      <PimerceDataView
        data={gridData}
        columns={dataViewColumn}
        onautoComplete={autocompleteDropdown}
        isPaginator={false}
        isCheckBoxEnabled={false}
        onSelectedRowDataTable={() => { }}
        onSearchValueChange={(value) => {
          if (value) {
            setgridData(retailers.filter((i) => i.productName.toUpperCase().includes(value.toUpperCase())))
          }
          else {
            setgridData(retailers)
          }
        }}
        updateProductSku={(e, i) => {
          if(authJson['46'].isEnabled){
          let retailer = retailerDetails.find((item) => item.id == e[0].retailerId)
          // setRetailerData(retailer)
          // setRetailerId(e[0].retailerId)
          setRetailerData(retailer)
          setRetailerId(e[0].retailerId)
          setRetailerLogo(e[0].retailerLogo)
          // props.history.location.state = {
          //   data: retailer,
          //   retailerId: e[0].retailerId,
          //   retailerLogo:e[0].retailerLogo
          // }
          props.history.location.state = {
            data: retailer,
            orgRetailerId:e[0].id,
            retailerId: e[0].retailerId,
            retailerLogo:e[0].retailerLogo,
            // retailerCategoryId:category.id,
            // retailerCategory:category.value
          }
          // props.history.push({
          //   pathname: '/retailerAttributeMap', state: {
          //     data: RetailerData,
          //     retailerId: retailerId
          //   }
          // });
          const data = {
            key:  'selectProducts' 
        }
        // props.history.push("/selectProducts")
        props.triggerPageLayout(data)
        props.history.push({
            pathname: '/selectProducts', state: {
              data: retailer,
              orgRetailerId:e[0].id,
            retailerId: e[0].retailerId,
            retailerLogo:e[0].retailerLogo,
                // retailerCategoryId:category.id,
                // retailerCategory:category.value
            }
        })
        // props.getRetailerCategories(null,e[0].id)
          // setIsModalOpen(true)
        }
        }}
        isHeaderButtonVisible={true}
        layoutStyle={false}
        isHeaderSearch={true}
        isMultiSearch={false}
        headerTitle={"Select a retailer to publish"}
        imageStyle={true}
        isLoader={isLoader}
        imgContainerwidth={true}
        isBoxSizing={true}
      />
      {/* <div className="mt-5 mb-5" style={{background:'white',marginRight:'-30px', borderRadius:'6px', padding:'32px'}}>
      {rowCard(allRetailers.concat(allRetailers))}
      </div> */}
      {/* <div style={{ background: "white", marginRight: '-15px', borderRadius: '6px', height: "35rem" }}>

        <div
          className="dataview-search-container pt-5 mb-4"
          style={{ textAlign: "center" }}
        >
          <span className="p-input-icon-right" style={{ width: '40vw' }}>
            <i className="pi pi-search" />
            <InputText
              placeholder="Search Retailer..."
              value={searchboxValue}
              onChange={(e) => {
                setSearchBoxValue(e.target.value)
                if (e.target.value) {
                  setAllRetailers(retailers.filter((i) => i.retailerName.toUpperCase().includes(e.target.value.toUpperCase())))
                }
                else {
                  setAllRetailers(retailers)
                }
              }}
              className="retailer-data-view-search"
              style={{ width: '100%' }}
            />
          </span>
        </div>
        <div style={{ marginTop: "11%" }}>
          <Row style={{ justifyContent: 'center' }}>
            {allRetailers.length ? allRetailers.map((i) => {
              return <div className="col-1" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => {
                let retailer = retailerDetails.find((item) => item.id == i.retailerId)
                setRetailerData(retailer)
                setRetailerId(i.retailerId)
                setIsModalOpen(true)
              }}>
                <img src={i.retailerLogo} style={{ width: '70%', borderRadius: '50%' }} />
                <p className="mt-1">{i.retailerName}</p>
              </div>

            }) : <h5>No retailer found!!</h5>}</Row>
        </div>
      </div> */}
      <ModalComponent
        isShowModal={isModalOpen}
        onHideModal={onModalClose}
        modalTitle={"Select Retailer Category"}
        modalContent={modalContent}
        modalSize="lg"
        modalDailogClassName="modalDailogContent p-fluid dialogue-box-style"
      />
    </React.Fragment>
  );
}

export default connect(mapStateToProps)(orgRetailer);