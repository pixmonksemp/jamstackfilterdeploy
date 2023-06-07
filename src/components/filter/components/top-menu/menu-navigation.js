/** @format */

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Navbar, Nav, Modal, Col, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
/* menu navigation dropdown Images & Icon - start */
import keyAccountsIcon from '../../assets/keyAccountsIcon.png'
/* menu navigation dropdown Images & Icon - end */
import ChangePassword from '../../pages/change-reset-password/change-password'
import ProfileHeader from '../profile-header/profile-header'
import LogoutLoading from '../../pages/login/logout-loading'
import Navigation from './navigation'
import './styles.scss'
import ExportModal from '../modal/excel-export-modal'
import ToastModal from '../modal/ToastModal'
import {
	TOAST_TITTLE_FOR_SUCCESS,
	EXCEL_EXPORT_REQUEST_SUCCESSFUL,
	VALID_BG_COLOR,
	TOAST_TITTLE_FOR_FAIL,
	ERROR_BG_COLOR,
	EXCEL_REQUEST_NOT_FOUND
} from '../../common/common-constants';
import Logo from '../../assets/pimerce_blueTheme_logo.svg'
import { downloadExcel } from '../../actions/action-full-excel-download'
let bundleHierarchy, isLoggedIn

const mapStateToProps = state => {
	return {
		fetchMenuOptions: state.userContext.getMenuOptionJson,
		logoutDetails: state.userContext.userLogout,
		getDashboardValue: state.dashboardValue.selectedFilters,
		retainingData: state.dashboardValue.selectedFiltersforRetainingValues,
		retainingGraphData:
			state.dashboardValue.selectedGraphFiltersforRetainingValues,
		getuserCredentials: state.userContext.getUsersObj.userCredentials,
		authourizedUserData: state.userContext.features.data,
		getFilterDataValue: state.stateData.getFilterdata,
		getGlobalFilterSelectedValues: state.stateData.getGlobalFilterSelectedValue
	}
}

const mapDispatchToProps = dispatch => {
	return {
		postLogoutDetails: postData => {
			dispatch(postLogoutDetails(postData)).then(response => {
				!response.error
					? dispatch(postLogoutDetailsSuccess(response.payload.data))
					: dispatch(postLogoutDetailsFailure(response))
			})
		}
	}
}

class MenuNavigation extends Component {
	static propTypes = {
		isToggle: PropTypes.bool
	}

	static defaultProps = {
		isToggle: true
	}

	constructor(props) {
		super(props)
		this.state = {
			showChangePasswordModalForFirstUser: false,
			showLogoutLoading: false,
			country: 'IND',
			isComponentLoaded: true,
			dropdownValues: [],
			accessPage: '',
			menuTabList: this.props.fetchMenuOptions.menuOptions,
			isKeyAccountPresent: false,
			marketFlag: '',
			marketCountry: '',
			isExportShow: false,
			selectedExcelExportFilterCriteria: {
				keyAccountList: []
			},
			isExcelExportSubmitted: false,
			pimerceBlueThemeLogo: Logo
		}
		this.handleLogout = this.handleLogout.bind(this)
		this.handleCountryChange = this.handleCountryChange.bind(this)
		this.handleDropdownValueChange = this.handleDropdownValueChange.bind(this)
		this.handleExcelExportClose = this.handleExcelExportClose.bind(this)
		this.handleSubmitExcelExport = this.handleSubmitExcelExport.bind(this)
		this.handleHideToastModal = this.handleHideToastModal.bind(this)
	}

	componentWillMount() {
		isLoggedIn = JSON.parse(sessionStorage.getItem('loginUserDetails'))
		bundleHierarchy = JSON.parse(
			isLoggedIn && isLoggedIn.defaultOption
				? isLoggedIn.defaultOption.StaticConstants
				: {}
		)

		const { getGlobalFilterSelectedValues } = this.props
		const regionFlag =
			getGlobalFilterSelectedValues &&
			getGlobalFilterSelectedValues.selectedRegionFlag
		const marketName =
			getGlobalFilterSelectedValues &&
			getGlobalFilterSelectedValues.selectedMarketName

		this.setState({
			isKeyAccountPresent:
				isLoggedIn && isLoggedIn.module && isLoggedIn.module.keyAccountName,
			marketFlag: regionFlag
				? regionFlag
				: isLoggedIn && isLoggedIn.module && isLoggedIn.module.logo,
			marketCountry: marketName
				? marketName
				: isLoggedIn && isLoggedIn.module && isLoggedIn.module.Country,
			organizationLogo:
				isLoggedIn && isLoggedIn.module && isLoggedIn.module.organization_logo,
			pimerceBlueThemeLogo:
				isLoggedIn && isLoggedIn.pimercecdn && isLoggedIn.pimercecdn.pimerce_blue_theme_logo_icon,
			Placeholder:
				isLoggedIn && isLoggedIn.pimercecdn && isLoggedIn.pimercecdn.pimerce_product_placeholder_icon
		})
	}

	componentDidMount() {
		for (let key in this.props.authourizedUserData) {
			this.setState({ accessPage: key })
		}

		const { getuserCredentials } = this.props
		getuserCredentials &&
			getuserCredentials.firsttimeuser &&
			this.setState({ showChangePasswordModalForFirstUser: true })
	}

	componentWillReceiveProps(newProps) {
		isLoggedIn = JSON.parse(sessionStorage.getItem('loginUserDetails'))
		const { logoutDetails } = newProps
		if (logoutDetails.data && logoutDetails.data.includes('Successful')) {
			sessionStorage.removeItem('loginUserDetails')
			if (sessionStorage.getItem('loginUserDetails') === null) {
				window.location.reload()
			}
		}
		if (isLoggedIn !== null) {
			bundleHierarchy = JSON.parse(
				isLoggedIn && isLoggedIn.defaultOption
					? isLoggedIn.defaultOption.StaticConstants
					: {}
			)
		}
		const { getGlobalFilterSelectedValues } = this.props
		const regionFlag =
			getGlobalFilterSelectedValues &&
			getGlobalFilterSelectedValues.selectedRegionFlag
		const marketName =
			getGlobalFilterSelectedValues &&
			getGlobalFilterSelectedValues.selectedMarketName
		this.setState({
			// isKeyAccountPresent: isLoggedIn && isLoggedIn.module && isLoggedIn.module.keyAccountName,
			marketFlag: regionFlag
				? regionFlag
				: isLoggedIn && isLoggedIn.module && isLoggedIn.module.logo,
			marketCountry: marketName
				? marketName
				: isLoggedIn && isLoggedIn.module && isLoggedIn.module.Country
		})
	}

	handleLogout() {
		let loggedInDetails = JSON.parse(sessionStorage.getItem('loginUserDetails'))

		this.props.postLogoutDetails(loggedInDetails)
		this.setState({ showLogoutLoading: true })
	}

	renderChangePasswordModalForFirstTimeUser() {
		const { getuserCredentials } = this.props
		return (
			<Modal
				show={this.state.showChangePasswordModalForFirstUser}
				size='md'
				aria-labelledby='contained-modal-title-vcenter'
				centered
				backdrop='static'>
				<ChangePassword
					isFirstTimeUser={
						getuserCredentials && getuserCredentials.firsttimeuser
							? true
							: false
					}
				/>
			</Modal>
		)
	}
	renderLogoutLoading() {
		return (
			<Modal
				className='logoutModal'
				show={this.state.showLogoutLoading}
				size='md'
				aria-labelledby='contained-modal-title-vcenter'
				centered
				backdrop={true}>
				<LogoutLoading />
			</Modal>
		)
	}

	home() {
		const data = {
			key: 'dashboard'
		}
		const { retainingData } = this.props
		this.props.getDashboardValue.clickStatus = false
		this.props.getDashboardValue.apply = false
		this.props.retainingData.clickStatus = true
		this.props.history.push('/dashboard')
		this.props.triggerPageLayout(data)
	}

	handleCountryChange(e) {
		this.setState({ country: e.value })
	}

	handleDropdownValueChange(data) {
		this.setState({ dropdownValues: data })
	}

	handleExcelExportOpen() {
		const { getFilterDataValue } = this.props
		if (
			getFilterDataValue &&
			getFilterDataValue.keyAccountList &&
			getFilterDataValue.keyAccountList.length
		)
			this.setState({ isExportShow: !this.state.isExportShow })
	}

	handleExcelExportClose() {
		this.setState({ isExportShow: !this.state.isExportShow })
	}

	handleSubmitExcelExport(data, isExport) {
		let isLogIn = JSON.parse(sessionStorage.getItem('loginUserDetails'))

		let keyaccountList = []
		if (
			data &&
			data.getExcelValue &&
			data.getExcelValue.keyAccountList &&
			data.getExcelValue.keyAccountList.length
		) {
			data.getExcelValue.keyAccountList.map(item => {
				keyaccountList.push(item.id)
			})
		}
		let excelExportRequest = {
			organizationId: isLogIn.organizationid,
			keyAccountList: keyaccountList,
			fromDate: data.fromDate,
			moduleName: 'keyaccount'
		}

		let insertReportRequest = {
			moduleName: 'keyaccount',
			processFlag: false,
			additionalEmailId: data.preferredMail,
			createdDate: data.fromDate,
			emailId: data.registeredMail,
			userName: data.registeredMail,
			reportType: 'excel',
			showNotification: false,
			filterCriteria: JSON.stringify(excelExportRequest)
		}
		downloadExcel(insertReportRequest)

		this.setState({
			isExportShow: !this.state.isExportShow,
			isExcelExportSubmitted: true
		})
	}

	renderExcelExportModal() {
		return (
			<>
				<ExportModal
					modalTitle='Export Key-Account Report'
					show={this.state.isExportShow}
					isExportDatePresent={false}
					onHide={this.handleExcelExportClose}
					handleApplyFilter={(data, value) =>
						this.handleSubmitExcelExport(data, value)
					}
					exportFilterMetaDataStrucutre={
						this.state.selectedExcelExportFilterCriteria
					}
					isSingleSelect={true}
					pageNameForExport='Export_Key_Account'

				/>
			</>
		)
	}

	renderExcelExportToastModal() {
		const { isExcelExportSubmitted } = this.state
		return (
			<>
				{isExcelExportSubmitted && (
					<ToastModal
						show={true}
						onModalHide={this.handleHideToastModal}
						title={
							isExcelExportSubmitted
								? TOAST_TITTLE_FOR_SUCCESS
								: TOAST_TITTLE_FOR_FAIL
						}
						titleBackgroundColor={
							isExcelExportSubmitted ? VALID_BG_COLOR : ERROR_BG_COLOR
						}
						content={
							isExcelExportSubmitted
								? EXCEL_EXPORT_REQUEST_SUCCESSFUL
								: EXCEL_REQUEST_NOT_FOUND
						}
					/>
				)}
			</>
		)
	}
	brokenImg = (e) => {
		const { Placeholder } = this.state
		e.target.src = Placeholder
		e.target.className = 'menu-navigation-placeholder-style'
	}

	handleHideToastModal() {
		this.setState({ isExcelExportSubmitted: false })
	}

	render() {
		const { isKeyAccountPresent, marketFlag, organizationLogo, pimerceBlueThemeLogo } = this.state
		const { getGlobalFilterSelectedValues } = this.props

		const logoImage = (
			<>
				<Row className='row-style' style={this.props.pageName === 'dashboard' ? {} : { cursor: 'pointer' }}>
					{/* Side Menu Collapse Expand Logo Design - className={classNames('logoImageCollapse', 'logoImage')} */}
					<Col className='column-style'>
						<img
							src={pimerceBlueThemeLogo}
							className='app-logo-img'
							onError={this.brokenImg.bind(this)}
						/>
					</Col>
					<Col>
						<div class="horizontal-line"></div></Col>
				</Row>
				{/* <Col className='column-style' >
						<img
							src={this.state.organizationLogo}
							alt='organization-logo'
							className='brand-logo-img'
						/>
					</Col> */}

				{/* TODO - Market Flag Design Block Commented */}
				{/* <Row>
					{marketFlag ? (
						<Col className='market-flag-container'>
							<ToolTip content={this.state.marketCountry} position='bottom'>
								<img src={marketFlag} className='market-flag' />
							</ToolTip>
						</Col>
					) : null}
				</Row> */}
			</>
		)

		return (
			<div style={{ cursor: 'default' }}>
				{this.renderChangePasswordModalForFirstTimeUser()}
				{this.renderLogoutLoading()}
				<div id='main'>
					<Navbar className='menuTabNavbar'>
						<div>
							<Nav class='sidebar'>
								<div
									className='sideMenuPimerceHome'
									onClick={this.home.bind(this)}>
									{logoImage}
								</div>
								{this.props.isToggle && (
									<div class='hamburger'>
										<a className='toggleArrowIcon'>
											<i
												class='fa fa-chevron-left'
												id='closeIcon'
												className='menu-navigation-fa-chevron-left'></i>
										</a>
									</div>
								)}
								{
									<div className='parentContainer'>
										<div className='openSideMenu'>
											<Navigation
												triggerPageLayout={this.props.triggerPageLayout}
												pageName={this.props.pageName}
												isComponentLoaded={this.state.isComponentLoaded}
												fetchMenuOptions={this.props.fetchMenuOptions}
											/>
										</div>
										<div className='sidemenuCollapsedIconContainer'>
											{this.state.menuTabList &&
												this.state.menuTabList != null &&
												this.state.menuTabList.length &&
												this.state.menuTabList.map(content => {
													return (
														<div
															style={{
																marginTop: '20px',
																marginBottom: '20px'
															}}>
															{' '}
															<img src={content.icon} />{' '}
														</div>
													)
												})}
										</div>
									</div>
								}
								{isKeyAccountPresent ? (
									<div>
										<div className='menuNavigationDropdown'>
											<div
												className='keyAccountsContent'
												style={{ cursor: 'pointer' }}
												onClick={this.handleExcelExportOpen.bind(this)}>
												<img
													src={keyAccountsIcon}
													style={{ marginTop: '-2px' }}
												/>{' '}
												<p
													className='menu-navigation-isKeyAccountPresent'>
													{isKeyAccountPresent}
												</p>
											</div>
										</div>
									</div>
								) : (
									''
								)}
								<ProfileHeader />
							</Nav>
						</div>
					</Navbar>
				</div>
				{this.renderExcelExportModal()}
				{this.renderExcelExportToastModal()}
			</div>
		)
	}
}

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(MenuNavigation)
)
