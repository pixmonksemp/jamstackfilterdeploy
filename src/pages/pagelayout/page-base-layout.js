import React, { Component } from 'react'
import MenuNavigationContainer from '../../container/pim-module-container/menu-container/menu-container'
import Footer from '../../components/footer/footer'
import DockCancel from "../../assets/dock-cancel.svg"
import DockArrow from "../../assets/dock-arrow.svg"
import ImportCancel from "../../assets/import-cancel.svg"
import { componentBaseStructure } from './page-layout-constant'
import '../../components/top-menu/styles.scss'
import IdleTimer from 'react-idle-timer'
import { Dock } from 'react-dock'
import { Button, Col, Row, Modal } from 'react-bootstrap'
import ModalComponent from '../../components/modal'
import DashboardPage from '../../pages/pim-module-pages/skulist-page/skulist-page'
import i18n from '../../translate/i18n'
import AssetListPage from "../../pages/pim-module-pages/assetlist-page/assetlist-page";
import DockImportData from '../../components/pim-module-component/dock-import-data/dock-import-data'
import DockAssetImportData from '../../components/pim-module-component/dock-import-data/dock-asset-import-data'
import "./style.scss"
import { resetUppy } from '../../components/file-uploader/FileUploader'
import ScrollButton from "../../common/scroll-to-top"
class PageBaseLayout extends Component {
	constructor(props) {
		const userDetails = sessionStorage.getItem(
			i18n.t('commonMessage.loginUserDetails')
		)
		const data = JSON.parse(userDetails)
		// const dockDefaultSize = {}
		super(props)
		this.state = {
			isSideMenuToggle: false,
			menuSlide: false,
			componentName: props && props.location && props.location.pathname == '/assetList' ? 'assetList' : 'skulist',
			component: props && props.location && props.location.pathname == '/assetList' ? AssetListPage : DashboardPage,
			timeout: 1000 * 60 * 180,
			showModal: false,
			userLoggedIn: false,
			isTimedOut: false,
			userType: data && data.usertype ? data.usertype : null,
			online: true,
			toggleArrow: true,
			isVisible: false,
			isDockActive: false,
			importDataProps: [],
			display: "none",
			size: 0.70,
			fluid: true,
			height: '500px',
			min: 'block',
			max: 'none',
			dockMarginLeft: '17%',
			dockTop: '5vh',
			dockPosition: 'bottom',
			activeDrags: 0,
			importdetailhide: true,
			minMaxDisplay: "none",
			dockBorderRadius: "15px",
			//expandedView : {top:"9vh",position:"absolute",width:"65vw",height:"575px",left:"0", marginLeft:"15%",overflow:"hidden",display: this.state.display, zIndex:100, background:"white"},
			isToggle: true,
			isInitialDockAssetImport: false
		}

		this.triggerPageLayout = this.triggerPageLayout.bind(this)
		this.triggerFileUpload = this.triggerFileUpload.bind(this)
		this.showMinMax = this.showMinMax.bind(this)
		this.hideImportDetailsDock = this.hideImportDetailsDock.bind(this)
		this.idleTimer = null
		this.onAction = this.onAction.bind(this)
		this.onActive = this.onActive.bind(this)
		this.onIdle = this.onIdle.bind(this)
		this.goOnline = this.goOnline.bind(this);
		this.goOffline = this.goOffline.bind(this);
		this.menuToggle = this.menuToggle.bind(this);
		this.onStart = this.onStart.bind(this);
		this.onStop = this.onStop.bind(this);
	}

	goOnline() {
		this.setState({ online: true });
	}

	goOffline() {
		this.setState({ online: false });
	}

	componentDidMount() {
		this.setState({
			online: typeof navigator.onLine === "boolean" ? navigator.onLine : true
		});

		window.addEventListener("online", this.goOnline);
		window.addEventListener("offline", this.goOffline);
	}

	componentWillUnmount() {
		window.removeEventListener("online", this.goOnline);
		window.removeEventListener("offline", this.goOffline);
	}

	/**
	 * Page Base Component Callback Method
	 * @param {*} data
	 */
	triggerPageLayout(data) {
		// console.log(data,"dataaaaaa")
		if ((data.key != "importData") && (!this.state.isDockActive) && (this.state.minMaxDisplay == "none")) {
						this.setState({ isVisible: false })
		}
		if (data && data.key) {
			componentBaseStructure.map((item) => {
				// console.log(item.value,"item.value")
				// console.log(item.key,"item.key")
				// console.log(data.key,"data.key")
				if (item.key == data.key) {
					this.setState({
						component: item.value,
						componentName: item.key
					})
				}
			})
		}
	}



	onAction(e) {
		if (this.state.timeout) {
			this.setState({ isTimedOut: false })
		}
	}

	onActive(e) {
		if (this.state.timeout) {
			this.setState({ isTimedOut: false })
		}
	}
	menuToggle() {
		//setToggleArrow(!toggleArrow)

		if (this.state.toggleArrow) {
			this.setState({ toggleArrow: false })
		}
		else {
			this.setState({ toggleArrow: true })
		}

	}

	onIdle(e) {
		this.idleTimer.reset()
		this.setState({ isTimedOut: true })
		this.setState({ showModal: true })
	}

	handleClick(result) {
		this.setState({ menuSlide: result })
	}

	handleModalTitle() {
		return <div style={{ marginTop: '10px' }}>Your session is ended</div>
	}

	modalContent() {
		const reload = () => {
			window.location.reload()
			this.setState({ showModal: false })
		}
		let inActiveMessage =
			'You have been inactive for a while. For your security, we will automatically sign you out and redirect you to login page. Click ok to proceed.'
		return (
			<div>
				<Row>
					<Col style={{ textAlign: 'left', margin: '5px 18px 13px' }}>
						{inActiveMessage}
					</Col>
				</Row>
				<Row style={{ marginBottom: '25px' }}>
					<Col>
						<Button
							onClick={reload}
							className='applyButton'
							style={{ marginRight: '40px' }}>
							Ok
						</Button>
					</Col>
				</Row>
			</div>
		)
	}

	/**
	 * Page Base Component Callback Method
	 * @param {*} data
	 */
	triggerFileUpload(data) {
		this.setState({ importDataProps: data, isVisible: true, display: "block", minMaxDisplay: "none", isInitialDockAssetImport: true })
		
	}

	showMinMax(data) {
		return null
	}


	hideImportDetailsDock(data) {
		 this.setState({ minMaxDisplay: "block" })
	}

	

	onStart() {
		this.setState({ activeDrags: ++this.state.activeDrags });
	};

	onStop() {
		this.setState({ activeDrags: --this.state.activeDrags });
	};


	render() {
		const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
		// $('.hamburger').click(function () {
		// 	$('.wrapper').toggleClass('collapse')
		// })
		return (
			<>


				<IdleTimer
					ref={(ref) => {
						this.idleTimer = ref
					}}
					element={document}
					onActive={this.onActive}
					onIdle={this.onIdle}
					onAction={this.onAction}
					debounce={250}
					timeout={this.state.timeout}
				/>

<div className={`newdockDesign ${this.state.importdetailhide ?"maxdocisOpen":"mindocisOpen"}`}>


				<Dock
					dockStyle={{ position: "fixed", width: "30% !important", left: "0 !important", right: '0px', overflow: "hidden", background: 'white', top: this.state.dockTop, height: this.state.height, marginLeft: this.state.dockMarginLeft, borderRadius: this.state.dockBorderRadius }}
					isVisible={this.state.isVisible}
					size={this.state.size}
					dockHiddenStyle={{ display: "none" }}
					fluid={true}
					dimMode='none'
				>
					<div style={{ height: "auto", display: this.state.minMaxDisplay == 'none' ? 'block' : 'none' }}>
						<div className='import-cancel-container'
							isVisible={this.state.isVisible}
							onClick={() => {
								resetUppy(true)
								this.setState({ isVisible: false })}}>
							<img className="import-cancel" src={ImportCancel}  />
						</div>
					</div>
					<div style={{ height: "auto", display: this.state.minMaxDisplay }}>
						<div className='dock-arrow-max' style={{ display: this.state.min }}
							onClick={() => this.setState({ size: 0.17, height: '60px', min: 'none', max: 'block', dockMarginLeft: '81%', dockTop: '85vh', importdetailhide: false, dockBorderRadius: "50px", isDockActive: true })}>
							<img className="dock-arrow-img" src={DockArrow} /></div>
						<div className='dock-arrow-min' style={{ display: this.state.max }}
							onClick={() => this.setState({ size: 0.70, height: '575px', min: 'block', max: 'none', dockMarginLeft: '17%', dockTop: '5vh', importdetailhide: true, dockBorderRadius: "15px" })}>
							<img className="dock-arrow" src={DockArrow} />
						</div>
					</div>
					{/* {console.log(this.state.importDataProps,"...this.state.importDataProps")} */}
					{
						this.state.importDataProps.pageName && this.state.importDataProps.pageName === 'asset'
							? <DockAssetImportData 
							  	{...this.state.importDataProps}
								initial = {(value) => { this.setState({ isInitialDockAssetImport: value }) }}
								isInitialLoad = {this.state.isInitialDockAssetImport}
								hideImportDetailsDock={this.hideImportDetailsDock}
								hide={this.state.importdetailhide}
								close={() => { this.setState({ isVisible: !this.state.isVisible }) }}
								history={this.props.history}
								triggerPageLayout={
									this.triggerPageLayout
								}
								triggerFileUpload={this.triggerFileUpload}
										pageName={this.state.componentName}
										component={this.state.component}
							  />
							: <DockImportData 
								{...this.state.importDataProps}
								close={() => { this.setState({ isVisible: !this.state.isVisible }) }}
								hide={this.state.importdetailhide}
								hideImportDetailsDock={this.hideImportDetailsDock}
							  />
					}
				</Dock>

				</div>

				<Modal
					show={!this.state.online}
					onHide={this.state.online}
					backdrop="static"
					keyboard={false}
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<Modal.Header>
						<Modal.Title>No internet</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p className='ml-3 mr-3'>You are currently offline</p>
					</Modal.Body>
				</Modal>

				<ModalComponent
					isShowButton={false}
					isShowModal={this.state.showModal}
					// onHideModal={this.handleModalClose}
					modalTitle={this.handleModalTitle()}
					modalContent={this.modalContent()}
					modalSize='lg'
					modalDialogClassName='modalDialog'
				/>
				<div className={`${this.state.toggleArrow == false ? "hidemenu" : "openmenu"} ${this.state.isSideMenuToggle ? 'wrapper collapse' : 'wrapper'}`}
					onClick={this.handleClick.bind(
						this,
						!this.state.menuSlide
					)}>

					{this.state.componentName != 'globaldashboard' && (
						<>
							<div
								class={this.state.isToggle ? 'sidebar-collapse' : 'sidebar'}
								style={
									this.state.userType === 'PDF User'
										? { display: 'none' }
										: {}
								}>
								{/* <div className='toggle-arrow' onClick={this.menuToggle.bind()}>
						<span className={this.state.toggleArrow == false ?"fa fa-chevron-right":"fa fa-chevron-left"}></span>
					</div> */}
								<MenuNavigationContainer
									pageName={this.state.componentName}
									isToggle={true}
									triggerPageLayout={this.triggerPageLayout}
									triggerFileUpload={this.triggerFileUpload}
									toggleSet={(e) => { this.setState({ isToggle: e }) }}
								/>
							</div>
							<div
								class='main_container'
								style={
									this.state.userType === 'PDF User'
										? {
											marginLeft: '0px',
											paddingRight: '0px'
										}
										: {}
								}>
								<div class='item'>
									<this.state.component
										triggerPageLayout={
											this.triggerPageLayout
										}
										triggerFileUpload={this.triggerFileUpload}
										pageName={this.state.componentName}
										component={this.state.component}
										history={this.props.history}
									/>
								</div>
							</div>
						</>
					)}
					{/* {this.state.componentName == 'globaldashboard' && (
						<div class='global-container'>
							<this.state.component
								triggerPageLayout={this.triggerPageLayout}
								pageName={this.state.componentName}
								component={this.state.component}
								history={this.props.history}
							/>
						</div>
					)} */}
				</div>
				<ScrollButton />
				<Footer />
			</>
		)
	}
}
export default PageBaseLayout
