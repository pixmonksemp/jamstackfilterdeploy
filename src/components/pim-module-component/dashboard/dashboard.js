// import React, { Component } from "react";
// import { Row, Col, Card, Button, Spinner, Popover, ProgressBar } from "react-bootstrap";
// import "./styles.scss";
// import { DASHBOARD_COLOR_CODES } from "../../../common/common-constants";
// import ChartComponent from "../../graph-component/graph-component";
// import star_Icon from "../../../assets/starIcon.svg";
// import send_Icon from "../../../assets/sendIcon.svg";
// import setting_Icon from "../../../assets/settingIcon.svg";
// import PieChart from "../../../components/piechart-component/piechart-component";
// import tile_BG_Img from "../../../assets/tileBgImg.svg";
// import SearchBar from "../../data-table/search-box";
// import boostIcon from "../../../assets/boostIcon.png";
// import kikkatIcon from "../../../assets/kitkatIcon.png";
// import marsIcon from "../../../assets/marsIcon.png";
// import miloIcon from "../../../assets/miloIcon.png";
// import nestleIcon from "../../../assets/nestleIcon.png";
// import CardTiles from "../../card-tiles-component/card-tiles-component"
// import DashboardJson from './dasboard-mockJSON.json'
// import i18n from "../../../translate/i18n";
// import Chart from 'react-apexcharts'

// let productDataTiles = [
//   {
//     score: 15,
//     title: "New Product",
//     subtitle: "Introduced in last 30 Days",
//     img: tile_BG_Img,
//     icon: star_Icon,
//   },
//   {
//     score: 10,
//     title: "Publications",
//     subtitle: "Published in last 30 days",
//     img: tile_BG_Img,
//     icon: send_Icon,
//   },
//   {
//     score: 10,
//     title: "Digital Assets",
//     subtitle: "Added in last 30 days",
//     img: tile_BG_Img,
//     icon: setting_Icon,
//   },
// ],
// tilesdata = [
//   { title: "Total Number of Products", percentage: 70, imgIcon: nestleIcon },
//   {
//     title: "SKU's",
//     percentage: 30 + "%",
//     grade: "Grade A",
//     gradeColor: "#7EAB55",
//     imgIcon: kikkatIcon,
//   },
//   {
//     title: "SOKC",
//     percentage: 20 + "%",
//     grade: "Grade B",
//     gradeColor: "#E39E1C",
//     imgIcon: boostIcon,
//   },
//   {
//     title: "SOKC",
//     percentage: 10 + "%",
//     grade: "Grade C",
//     gradeColor: "#E46B26",
//     imgIcon: miloIcon,
//   },
//   {
//     title: "SOKC",
//     percentage: 5 + "%",
//     grade: "Grade D",
//     gradeColor: "#EB3323",
//     imgIcon: marsIcon,
//   },
// ]

// class dashboard extends Component {
//   constructor(props) {
//     super(props);
//     this.attachRef = (target) => this.setState({ target });
//     this.state = {};
//     this.renderTitle = this.renderTitle.bind(this);
//     this.renderContentTile = this.renderContentTile.bind(this);
//     this.renderPieChartTile = this.renderPieChartTile.bind(this);
//   }

//   renderTitle(heading) {
//     return (
//       <>
//         <div className="p-grid common-header-section">
//           <h5 className="p-m-0  p-col-12 page-header">{heading}</h5>
//         </div>
//       </>
//     );
//   }

//   renderContentTile(item) {
//     return (
//       <Col className="ml-1 mr-4 px-0">
//       <div style={{ minWidth: "10em" }}>
//       <Card className="image-box-tile" style={{ backgroundImage: `url(${item.img})`}}>
//         <Card.Body>
//           <Card.Title className="tile-content-heading">
//             {item.score}
//             <span>
//               <img className="card-img-icon" src={item.icon} />
//             </span>
//           </Card.Title>
//           <Card.Subtitle className="tile-content-percentage">
//             {item.title}
//           </Card.Subtitle>
//           <Card.Subtitle className="subtitle-style">{item.subtitle}</Card.Subtitle>
//         </Card.Body>
//       </Card>  </div>
//           </Col>
//     );
//   }

//   renderPieChartTile(pieCharttilesdata) {
//     return (
//       <Card className="piechart-image-box">
//         <Card.Body>
//           <Card.Title className="tile-piechart-heading">
//             {pieCharttilesdata[0]}
//           </Card.Title>
//           <Card.Subtitle className="tile-pie-chart-percentage">
//             {pieCharttilesdata[1]}
//           </Card.Subtitle>
//           {/* //Pie-Chart */}
//           <Row>
//             <Col xl="12" lg="12" className="donutOval">
//               {this.state.isLoading}
//               <>
//                 {/* commented code for pie chart -code starts */}
//                 <div>
//                   <div>
//                     <PieChart
//                       labels={DashboardJson.pieChartLabels}
//                       series={DashboardJson.pieChartSeries}
//                       isPercentage={true}
//                       isDecimal={true}
//                       decimalValue={2}
//                       isLegends={true}
//                       pieSize={1}
//                       pieWidth={250}
//                       type="pie"
//                     />
//                   </div>
//                 </div>
//               </>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>
//     );
//   }

//   renderDashboard() {
//     const {} = this.props;
//     return (
//       <>
//         {this.renderTitle("Dashboard")}
//         <Row className="global-dashboard-container-style">
//           {tilesdata.map((item) => {
//             return <CardTiles item={item}/>
//           })}
//         </Row>
//         {/* Bar-Graph */}
//         <Row>
//           <Col className="bar-graph-style">
//             <ChartComponent
//               series={DashboardJson.graphSeriesPricing}
//               type="bar"
//               // isStacked={false}
//               chartTitle={i18n.t('dashboardContents.title')}
//               chartSubTitle={i18n.t('dashboardContents.subTitle')}
//               isShowGrid={true}
//               showLegend={false}
//               chartHeight={300}
//               isHorizontal={false}
//               label={i18n.t('dashboardContents.lable')}
//               colors={["#FECA57", "#FFEFCD"]}
//               columnWidth={"35"}
//               xAxisData={DashboardJson.xaxisDataPricing}
//               showDataLabel={false}
//               dataLabelPosition="center"
//               dataLabelOffsetX={0}
//               abbrevatedTooltip={false}
//               dataLabelOffsetY={2}
//               graphLoading={false}
//               orgBasedColorCodes={DASHBOARD_COLOR_CODES}
//               graphSpinnerClassName="graphLoadingStyle"
//               isShowPercentageTooltip={false}
//               isStacked={true}
//               xAxisBorder={false}
//               chartClassStyle="dashboard-chartStyleClass"
//               graphHeaderClassName="dashboard-graphHeaderStyle"
//               dataLabelUnit="%"
//             />
//           </Col>
//         </Row>
//         {/* Tile-Content */}
//         <Row className="conent-tile-container-style">
//               {productDataTiles.map((item) => {
//                 {
//                   return this.renderContentTile(item);
//                 }
//               })}
//           <Col className="mr-1 px-0">
//             <div style={{ minWidth: "30em" }}>
//               {this.renderPieChartTile(DashboardJson.pieCharttilesdata)}
//             </div>
//           </Col>
//         </Row>
//       </>
//     );
//   }
//   render() {
//     const griddata = [
//       {
//         logo:'https://sgp1.digitaloceanspaces.com/pixmonksdevspace/pimcollections/organizationAssets/Amazon_icon.png',
//         retailerName: "Amazon",
//         description: "24/25 SKUs are not published",
//         grade: "Grade C"
//       },
//       {
//         logo:'https://sgp1.digitaloceanspaces.com/pixmonksdevspace/pimcollections/organizationAssets/walmart-square.jpg',
//         retailerName: "Walmart",
//         description: "24/25 SKUs have issues",
//         grade: "Grade C"
//       },
//       {
//         logo:'https://sgp1.digitaloceanspaces.com/pixmonksdevspace/pimcollections/organizationAssets/target.png',
//         retailerName: "Target",
//         description: "24/25 SKUs have issues",
//         grade: "Grade C"
//       }
//     ]

//     const chartOne = {
//       "graphSeriesPricing" : [
//           {
//             "name": "Products",
//             "currencySymbol": null,
//             "data": [350, 0, 0, 0],
//             "customTooltipDetails": null,
//             "id": null,
//             "displayid": null,
//             "category": null,
//             "categoryId": null,
//             "brand": null,
//             "brandId": null,
//             "brandElement": null,
//             "brandElementId": null
//           },
//           {
//             "name": "Products",
//             "currencySymbol": null,
//             "data": [0, 250, 0, 0],
//             "customTooltipDetails": null,
//             "id": null,
//             "displayid": null,
//             "category": null,
//             "categoryId": null,
//             "brand": null,
//             "brandId": null,
//             "brandElement": null,
//             "brandElementId": null
//           },{
//             "name": "Products",
//             "currencySymbol": null,
//             "data": [0, 0, 45, 0],
//             "customTooltipDetails": null,
//             "id": null,
//             "displayid": null,
//             "category": null,
//             "categoryId": null,
//             "brand": null,
//             "brandId": null,
//             "brandElement": null,
//             "brandElementId": null
//           },
//           {
//             "name": "Products",
//             "currencySymbol": null,
//             "data": [0, 0, 0, 90],
//             "customTooltipDetails": null,
//             "id": null,
//             "displayid": null,
//             "category": null,
//             "categoryId": null,
//             "brand": null,
//             "brandId": null,
//             "brandElement": null,
//             "brandElementId": null
//           }
//         ],
//         "xaxisDataPricing" : [
//           "A",
//           "B",
//           "C",
//           "D"
//         ]}
//     // return <>{this.renderDashboard()}</>;
//     return(
//       <>
//         <div className="p-grid common-header-section">
//           <h5 className="p-m-0  p-col-12  page-header">Overview Dashboard</h5>
//         </div>
//         <Row>
//           <div className="col-6">
//             <div style={{
//               padding: '1rem',
//               background: 'white',
//               height: '12rem',
//               borderRadius: '6px'
//             }}>
//               <h6><b>Catalog Statistics</b></h6>
//               <Row className="mt-4">
//                 <div className="col-3">
//                   <h2>550</h2>
//                   <p>Products Created</p>
//                   <ProgressBar
//                     style={{
//                       height: "5px",
//                       width: "97%",
//                       // marginLeft: "24px",
//                     }} 
//                     // variant="info"
//                     // animated
//                     now={"100"} 
//                     label={""}
//                     key={1}
//                   />
//                 </div>
//                 <div className="col-3">
//                   <h2>832</h2>
//                   <p>Assets</p>
//                   <ProgressBar
//                     style={{
//                       height: "5px",
//                       width: "97%",
//                       // marginLeft: "24px",
//                     }} 
//                     // variant="info"
//                     // animated
//                     now={"0"} 
//                     label={""}
//                     key={1}
//                   />
//                 </div>
//                 <div className="col-3">
//                   <h2>312</h2>
//                   <p>Published</p>
//                   <ProgressBar
//                     style={{
//                       height: "5px",
//                       width: "97%",
//                       // marginLeft: "24px",
//                     }} 
//                     // variant="info"
//                     // animated
//                     now={"0"} 
//                     label={""}
//                     key={1}
//                   />
//                 </div>
//                 <div className="col-3">
//                   <p style={{ color: '#0E90E1', cursor: 'pointer' }} onClick={() => {
//                     const data = {
//                       key: 'skulist'
//                     }
//                     this.props.history.push('/skulist')
//                     this.props.triggerPageLayout(data)
//                   }}>{'View Products >'}</p>
//                 </div>
//               </Row>
//             </div>
//           </div>
//           <div className="col-6">
//             <div style={{
//               padding: '1rem',
//               background: 'white',
//               height: '12rem',
//               borderRadius: '6px'
//             }}><h6><b>
//               Content Quality Analysis</b>
//               </h6>
//               <Row className="mt-4">
//                 <div className="col-4 pt-3" >
//                   <p>20 different quality rules setup</p>
//                   <p style={{ color: '#0E90E1' }}>{'See all rules >'}</p>
//                 </div>
//               {/* </Row>
//               <Row> */}
//                 <div className="col-8">
//                 {/* <ChartComponent
//               series={chartOne.graphSeriesPricing}
//               type="bar"
//               // isStacked={false}
//               // chartTitle={i18n.t('dashboardContents.title')}
//               // chartSubTitle={i18n.t('dashboardContents.subTitle')}
//               isShowGrid={true}
//               showLegend={false}
//               chartHeight={100}
//               isHorizontal={false}
//               label={i18n.t('dashboardContents.lable')}
//               colors={["#FECA57", "#FFEFCD"]}
//               columnWidth={"25"}
//               xAxisData={chartOne.xaxisDataPricing}
//               showDataLabel={false}
//               dataLabelPosition="center"
//               dataLabelOffsetX={0}
//               abbrevatedTooltip={false}
//               dataLabelOffsetY={2}
//               graphLoading={false}
//               orgBasedColorCodes={DASHBOARD_COLOR_CODES}
//               graphSpinnerClassName="graphLoadingStyle"
//               isShowPercentageTooltip={false}
//               isStacked={false}
//               xAxisBorder={false}
//               chartClassStyle="dashboard-chartStyleClass"
//               graphHeaderClassName="dashboard-graphHeaderStyle"
//               dataLabelUnit="%"
//             /> */}
//             <Chart
// 										options={DashboardJson.chartOneOptions}
// 										series={chartOne.graphSeriesPricing}
// 										type={'bar'}
// 										height={140}
// 										width={'98%'}
// 									/>
//                 </div>
//               </Row>
//             </div>
//           </div>
//         </Row>
//         <Row className="mt-3">
//           <Col>
//             <div style={{ background: 'white', padding: '1rem',borderRadius: '6px' }}>
//               <h6><b>Content integrity by Retailer</b></h6>
//               {griddata.map((i, idx) => {
//                 return <>
//                   <Row className="mt-4">
//                     <div className="col-3" style={{display:'flex'}}><img style={{height:'4rem',borderRadius:'50%',border:'1px solid gainsboro'}} src={i.logo}/><p style={{textAlign:'center',padding:'6% 0px 5% 12px', marginBottom:0}}>{i.retailerName}</p></div>
//                     <div className="col-3"><p style={{textAlign:'center',padding:'6% 0px 5% 0px', marginBottom:0}}>{i.description}</p></div>
//                     <div className="col-3"><p style={{ color: '#0E90E1',textAlign:'center',padding:'6% 0px 5% 0px', marginBottom:0 }}>{i.grade}</p></div>
//                     <div className="col-3"  style={{textAlign:'center',padding:'1% 0px 0 0'}}><Button className="importdata-download-button" onClick={() => {
//                       const data = {
//                         key: "retailerList"
//                       }
//                       this.props.history.push('/retailerlist')
//                       this.props.triggerPageLayout(data)
//                     }}>Publish Updates</Button></div>
//                   </Row>
//                   {griddata.length != (idx + 1) && <hr />}
//                 </>
//               })
//               }
//             </div>
//           </Col>
//         </Row>
//         <Row className="mt-3">
//           <div className="col-6">
//             <div style={{
//               padding: '1rem',
//               background: 'white',
//               height: '18rem',
//               borderRadius: '6px'
//             }}>
//               <h6><b>Content Trend</b></h6>
//               <Row>
//             <Col>
//             <Chart
// 										options={DashboardJson.options}
// 										series={DashboardJson.lineChartSeries}
// 										type={'line'}
// 										height={240}
// 										width={'100%'}
// 									/>
//             </Col>
              
//               </Row>
//             </div>
//           </div>
//           <div className="col-6">
//             <div style={{
//               padding: '1rem',
//               background: 'white',
//               height: '18rem',
//               borderRadius: '6px'
//             }}>
//               <h6><b>Content Breakdown</b></h6>
//               <Row>
//             <Col>
//             <Chart
// 										options={DashboardJson.chartTwoOptions}
// 										series={DashboardJson.chartTwoSeries}
// 										type={'bar'}
// 										height={240}
// 										width={'100%'}
// 									/>
//             </Col>
              
//               </Row>
//             </div>
//           </div>
//         </Row>
//       </>
//     )
//   }
// }
// export default dashboard;
