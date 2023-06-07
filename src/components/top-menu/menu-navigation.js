import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Navbar, Nav, Modal, Col, Row } from 'react-bootstrap'

/* menu navigation dropdown Images & Icon - end */
import ChangePasswordContainer from '../../container/pim-module-container/change-password-container/change-password-container'
import ProfileHeader from '../profile-header/profile-header'
import PimLogo from '../../assets/pimLogo.svg'
import Navigation from './navigation'
import classNames from 'classnames'
import PimerceIcon from '../../assets/pim-logo.svg'
import './styles.scss'
import {
	TOAST_TITTLE_FOR_SUCCESS,
	VALID_BG_COLOR,
	TOAST_TITTLE_FOR_FAIL,
	ERROR_BG_COLOR,
	MEDIUM,
	LOGOUT_MULTIPLE_MACHINE,
	SUCCESS
} from '../../common/common-constants'
import ToastModal from '../modal/ToastModal'
import i18n from '../../translate/i18n'

const mapStateToProps = (state) => {
	return {
		fetchMenuOptions: state.userDetail.getMenuOptionJson,
		profileData: state.userDetail.userProfile.data
	}
}

function MenuNavigation(props) {
	const [
		showChangePasswordModalForFirstUser,
		setShowChangePasswordModalForFirstUser
	] = useState(false)
	const [showLogoutLoading, setShowLogoutLoading] = useState(false)
	const [isComponentLoaded, setIsComponentLoaded] = useState('dashboard')
	const [menuTabList, setMenuTabList] = useState(
		props.fetchMenuOptions.menuOptions
	)
	const [show, setShow] = useState(false)
	const [title, setTitle] = useState('')
	const [bgCcolor, setBgColor] = useState('')
	const [content, setContent] = useState('')
	const [size, setSize] = useState('')
	const [isToggle, setIsToggle] = useState(true)

	useEffect(() => {
		const { postLogoutDetailsResult, profileData } = props

		if (profileData && profileData.firstTimeUser) {
			setShowChangePasswordModalForFirstUser(true)
		}
		if (
			postLogoutDetailsResult &&
			postLogoutDetailsResult.content &&
			postLogoutDetailsResult.content.status == 200
		) {
			sessionStorage.removeItem(i18n.t('commonMessage.loginUserDetails'))
			if (
				sessionStorage.getItem(
					i18n.t('commonMessage.loginUserDetails')
				) === null
			) {
				window.location.reload()
			}
		} else if (
			postLogoutDetailsResult &&
			postLogoutDetailsResult.content &&
			postLogoutDetailsResult.content.status != 200
		) {
			setShow(true)
			setBgColor(ERROR_BG_COLOR)
			setTitle(TOAST_TITTLE_FOR_FAIL)
			setContent(LOGOUT_MULTIPLE_MACHINE)
			setSize(MEDIUM)
		}
	}, [props])

	function handlemodalOpen(status, toastMsg) {
		if (status == SUCCESS) {
		  setShow(true)
		  setTitle(i18n.t("toastMessage.updateToastHeading"))
		  setContent(toastMsg)
		  setBgColor(VALID_BG_COLOR)
		  setSize(MEDIUM)
		  window.location.reload()
		}
		if(status == "failure") {
		  setShow(true)
		  setTitle(TOAST_TITTLE_FOR_FAIL)
		  setContent(i18n.t("validationMessage.InvalidCurrentPassword"))
		  setBgColor(ERROR_BG_COLOR)
		  setSize(MEDIUM) 
		}
	  }

	function renderChangePasswordModalForFirstTimeUser() {
		const { profileData } = props
		return (
			<Modal
				show={showChangePasswordModalForFirstUser}
				size='md'
				aria-labelledby='contained-modal-title-vcenter'
				centered
				backdrop='static'>
				<ChangePasswordContainer
					isFirstTimeUser={
						profileData && profileData.firstTimeUser ? true : false
					}
					modalHide={handlemodalOpen}
				/>
			</Modal>
		)
	}

	function renderLogoutLoading() {
		return (
			<Modal
				className='logoutModal'
				show={showLogoutLoading}
				size='md'
				aria-labelledby='contained-modal-title-vcenter'
				centered
				backdrop={true}></Modal>
		)
	}

	function renderAlertBoxes() {
		return (
			<div>
				<ToastModal
					show={show}
					onModalHide={handleHide}
					title={title}
					titleBackgroundColor={bgCcolor}
					content={content}
					size={size}
				/>
			</div>
		)
	}

	function handleHide() {
		setShow(false)
	}

	function home() {
		const data = {
			key: 'skulist'
		}
		props.history.push('/skulist')
		props.triggerPageLayout(data)
	}

	const logoImage = (
		<>
			<Row className='menu-logo-block'>
				{/* Side Menu Collapse Expand Logo Design - className={classNames('logoImageCollapse', 'logoImage')} */}
				<div className='border-right' id='app-logo-container'>
					<img
						src={
							isToggle?PimerceIcon:
							PimLogo}
						alt='pimerce-logo'
						// style={isToggle?{width:'28.5px'}:{}}
						className='app-logo-img'
					/>
				</div>
				<div className={`logo-border border-solid`}></div>
			</Row>
		</>
	)

	return (
		<div style={{ cursor: 'default' }}>
			{renderChangePasswordModalForFirstTimeUser()}
			{renderLogoutLoading()}
			<div id='main'>
				<Navbar className='menuTabNavbar'>
					<div>
					{/* <Nav class= 'sidebar'> */}
						<Nav class= {isToggle?'sidebar-collapse':'sidebar'}>
							<div className='sideMenuPimerceHome' onClick={home}>
								{logoImage}
							</div>
							{props.isToggle && (
								<div class='hamburger' onClick={()=>{
									props.toggleSet(!isToggle)
									setIsToggle(!isToggle)
									}}>
									<a className='toggleArrowIcon'>
										<i
											class={isToggle?'fa fa-chevron-right':'fa fa-chevron-left'}
											id='closeIcon'
											style={{
												color: '#0E0E0E',
												padding: '18px 10px'
											}}></i>
									</a>
								</div>
							)}
							{
								<div className='parentContainer'>
									<div className='openSideMenu'>
										<Navigation
											setToggle={(e)=>{
												setIsToggle(e)
												props.toggleSet(e)
											}}
											isToggle={isToggle}
											triggerPageLayout={
												props.triggerPageLayout
											}
											pageName={props.pageName}
											isComponentLoaded={
												isComponentLoaded
											}
											fetchMenuOptions={
												props.fetchMenuOptions
											}
										/>
									</div>
									<div className='sidemenuCollapsedIconContainer'>
										{menuTabList &&
											menuTabList != null &&
											menuTabList.length &&
											menuTabList.map((content) => {
												return (
													<div
														style={{
															marginTop: '20px',
															marginBottom: '20px'
														}}>
														{' '}
														<img
															src={content.icon}
														/>{' '}
													</div>
												)
											})}
									</div>
								</div>
							}
							{renderAlertBoxes()}
							<ProfileHeader {...props} />
						</Nav>
					</div>
				</Navbar>
			</div>
		</div>
	)
}

export default withRouter(connect(mapStateToProps, null)(MenuNavigation))
