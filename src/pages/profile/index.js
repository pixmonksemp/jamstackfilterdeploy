/** @format */

import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
	Card,
	Col,
	Form,
	Button,
	Row,
	Spinner,
	Modal,
	Overlay,
	Image
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { IsValidFields } from '../login/validateEmailField'
import i18n from '../../translate/i18n'
import LogOutLoading from '../login/logout'
import ChangePasswordContainer from '../../container/pim-module-container/change-password-container/change-password-container'
import exclamation from '../../../src/assets/exclamation.svg'
import ToastModal from '../../components/modal/ToastModal'
import {
	MEDIUM,
	VALID_BG_COLOR,
	ALL_FIELDS_MANDATORY,
	SETUP_PROFILE,
	NO_PROFILE,
	lOGOUT,
	SAVE,
	CANCEL,
	CHANGE_PASSWORD,
	SUPPORT_TEXT,
	SUPPORT_LINK,
	VERSION_TEXT,
	LOGIN_DETAILS,
	TOAST_TITTLE_FOR_FAIL,
	ERROR_BG_COLOR,
	SUCCESS
} from '../../common/common-constants'
import profileIcon from '../../assets/profile-icon.png'
import closeIcon from '../../assets/closeIcon.png'
import logoutSymbol from '../../assets/profile-logout-icon.png'
import './style.scss'

const mapStateToProps = (state) => {
	return {
		profileData: state.userDetail.userProfile
	}
}

function Profile(props) {
	const attachRefSupport = useRef()

	const [loading, setLoading] = useState(false)
	const [isSaveBtnLoading, setIsSaveBtnLoading] = useState(false)
	const [show, setShow] = useState(false)
	const [showChangePasswordModal, setShowChangePasswordModal] = useState(
		false
	)
	const [submitClicked, setSubmitClicked] = useState(false)
	const [isLastNameChange, setIsLastNameChange] = useState(false)
	const [isPhoneNoChange, setIsPhoneNoChange] = useState(false)
	const [isSubmitBtn, setIsSubmitBtn] = useState(false)
	const [filterOverLayOpen, setFilterOverLayOpen] = useState(false)
	const [showLogoutLoading, setShowLogoutLoading] = useState(false)

	const [title, setTitle] = useState('')
	const [bgColor, setBgColor] = useState('')
	const [content, setContent] = useState('')
	const [size, setSize] = useState('')
	const [data, setData] = useState({
		firstName: '',
		lastName: '',
		phoneNumber: '',
		userName: ''
	})
	const [previousProfileData, setPreviousProfileData] = useState({
		firstName: '',
		lastName: '',
		phoneNumber: '',
		userName: ''
	})

	useMemo(() => {
		if (props.profileData && props.profileData.data) {
			setData(props.profileData.data)
			setPreviousProfileData(props.profileData.data)
		} else {
			setLoading(true)
		}
	}, [])

	useEffect(() => {
		const { updateProfileResult,isSaveBtn } = props
		if (
			updateProfileResult &&
			updateProfileResult.content &&
			updateProfileResult.content.data
		) {
			setShow(true)
			setIsSubmitBtn(true)
			setTitle(i18n.t('toastMessage.updateToastHeading'))
			setBgColor(VALID_BG_COLOR)
			setContent(updateProfileResult.content.data.description)
			setSize(MEDIUM)
			setIsSaveBtnLoading(false)
			closeNav()
		}
		if(isSaveBtn){
			setIsSubmitBtn(true)
		}
	}, [props.updateProfileResult,props.isSaveBtn])

	function handleChange(e) {
		if (e.target.name == 'lastName') {
			setData({
				...data,
				[e.target.name]: e.target.value
			})
			setIsLastNameChange(true)
			setSubmitClicked(false)
			setIsSubmitBtn(false)
		}
		if (e.target.name == 'phoneNumber') {
			setIsPhoneNoChange(true)
			setSubmitClicked(false)
			setIsSubmitBtn(false)
			const re = /^[0-9\b]+$/
			if (e.target.value === '' || re.test(e.target.value)) {
				setData({
					...data,
					[e.target.name]: e.target.value
				})
			}
		}
	}

	function handlemodalOpen(status, toastMsg) {
    closeNav()
    setShowChangePasswordModal(!showChangePasswordModal)
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

	function handleSubmit() {
		if (isPhoneNoChange || isLastNameChange) {
			setIsLastNameChange(false)
			setIsPhoneNoChange(false)
			setIsSubmitBtn(false)

			if (
				data.lastName &&
				data.lastName.length <= 25 &&
				data.phoneNumber &&
				data.phoneNumber.length <= 15
			) {
				setPreviousProfileData(data)
				setIsSaveBtnLoading(true)
				props.updateProfile(data)
			} else {
				setSubmitClicked(true)
			}
		}
	}

	function handleLogout() {
		closeNav()
		let loggedInDetails = JSON.parse(sessionStorage.getItem(LOGIN_DETAILS))
		props.postLogoutDetails(loggedInDetails)
		setShowLogoutLoading(true)
	}

	function handleToastModalClose() {
		setShow(false)
	}

	function closeNav() {
		setData(previousProfileData)
		setSubmitClicked(false)
		setIsSubmitBtn(true)
		document.getElementById('mySidenav').style.width = '0'
		document.getElementById('main').style.marginLeft = '0'
		document.body.style.backgroundColor = 'white'
		document.getElementsByClassName
		props.callbackForCancel(false)
	}

	function renderLogoutLoading() {
		return (
			<Modal
				className='logoutModal'
				show={showLogoutLoading}
				size='md'
				aria-labelledby='contained-modal-title-vcenter'
				centered
				backdrop={true}>
				<LogOutLoading />
			</Modal>
		)
	}

	function renderSaveBtn() {
		return (
			<span>
				<Button
					id='saveBtn'
					className='submitButton'
					variant='primary'
					disabled={isSubmitBtn}
					onClick={handleSubmit}>
					{isSaveBtnLoading ? (
						<Spinner animation='border' variant='info' size='sm' />
					) : (
						SAVE
					)}
				</Button>
			</span>
		)
	}

	function renderCancelBtn() {
		return (
			<span>
				<Button
					id='cancelBtn'
					className='submitButton'
					variant='outline-light'
					onClick={closeNav}>
					{CANCEL}
				</Button>
			</span>
		)
	}

	function renderChangePasswordModal() {
		return (
			<Modal
				show={showChangePasswordModal}
				size='md'
				aria-labelledby='contained-modal-title-vcenter'
				centered
				backdrop='static'>
				<ChangePasswordContainer modalHide={handlemodalOpen} />
			</Modal>
		)
	}

	function renderAlertBoxes() {
		return (
			<div>
				<ToastModal
					show={show}
					onModalHide={handleToastModalClose}
					title={title}
					titleBackgroundColor={bgColor}
					content={content}
					size={size}
				/>
			</div>
		)
	}

	function aboutUs() {
		setFilterOverLayOpen(!filterOverLayOpen)
	}

	function linkNavigation(text, link) {
		return (
			<div>
				<a className='supportText' href={link} target='_blank'>
					{text}
				</a>
			</div>
		)
	}

	return (
		<div style={{ cursor: 'default' }}>
			{renderChangePasswordModal()}
			{renderLogoutLoading()}
			<div className='totalcontainer'>
				<img
					className='profile-close-icon'
					src={closeIcon}
					ref={attachRefSupport}
					onClick={closeNav}>
				</img>
				{filterOverLayOpen ? (
					<Card className='supportCardStyle'>
						{/* {linkNavigation(SUPPORT_TEXT, SUPPORT_LINK)} */}
					</Card>
				) : (
					''
				)}
				<Form className='screenForm'>
					<Col
						md={7}
						lg={4}
						xs={{ span: 8, offset: 8 }}
						sm={4}
						style={{ display: 'contents' }}>
						<div
							className={
								filterOverLayOpen
									? 'overlayOpenLogout'
									: 'LogoutbuttonStyle'
							}>
							<Button
								onClick={handleLogout}
								className='logoutBtn'>
								{lOGOUT}{' '}
								<Image
									src={logoutSymbol}
									className='logoutBtnIcon'
								/>
							</Button>
						</div>
					</Col>
					{loading ? (
						<div
							style={{
								textAlign: 'center',
								position: 'initial'
							}}>
							<div style={{ padding: '176px' }}>
								<Card.Img
									src={exclamation}
									className='cardDefault'
								/>
								<div
									style={{ display: 'block' }}
									className='noData_Style'>
									{' '}
									{NO_PROFILE}
								</div>
							</div>
						</div>
					) : (
						<div className={filterOverLayOpen ? 'overlayOpen' : ''}>
							<img
								src={profileIcon}
								style={{
									width: '99px',
									height: '97px',
									marginLeft: '57px'
								}}
							/>
							<div
								style={{
									color: '#272727',
									fontSize: '18px',
									fontWeight: 'bolder',
									paddingBottom: '25px',
									paddingTop: '10px',
									paddingLeft: '54px'
								}}>
								{SETUP_PROFILE}
							</div>
							<Form.Group className='formgroup'>
								<Row>
									<Col
										md={12}
										lg={12}
										xs={12}
										sm={12}
										className='profileInputs'>
										<Form.Control
											placeholder='First name'
											size='sm'
											name='firstName'
											defaultValue={data.firstName}
											disabled
										/>
									</Col>
								</Row>
							</Form.Group>
							<Form.Group className='formgroup'>
								<Row>
									<Col
										md={12}
										lg={12}
										xs={12}
										sm={12}
										className='profileInputs'>
										<Form.Control
											type='text'
											placeholder='Last name'
											value={data.lastName}
											name='lastName'
											onChange={handleChange}
											isVaild={
												isLastNameChange &&
												IsValidFields(data.lastName)
											}
											isInvalid={
												submitClicked &&
												(data.lastName &&
												data.lastName !== '' &&
												data.lastName.length <= 25
													? false
													: true)
											}
										/>
										<Form.Control.Feedback
											type='invalid'
											className='fontStyleBold'>
											{data.lastName == ''
												? data.lastName == ''
													? i18n.t(
															'validationMessage.fieldIsRequired'
													  )
													: ''
												: data.lastName &&
												  data.lastName.length > 25
												? i18n.t(
														'validationMessage.lengthLastName'
												  )
												: ''}
										</Form.Control.Feedback>
									</Col>
								</Row>
							</Form.Group>
							<Form.Group className='formgroup'>
								<Row>
									<Col
										md={12}
										lg={12}
										xs={12}
										sm={12}
										className='profileInputs'>
										<Form.Control
											placeholder='Email Id'
											size='sm'
											disabled
											defaultValue={data.userName}
										/>
									</Col>
								</Row>
							</Form.Group>
							<Form.Group className='formgroup'>
								<Row>
									<Col
										md={12}
										lg={12}
										xs={12}
										sm={12}
										className='profileInputs'>
										<Form.Control
											type='text'
											pattern='[0-9]'
											name='phoneNumber'
											value={data.phoneNumber}
											placeholder='Phone No'
											onChange={handleChange}
											isVaild={
												isPhoneNoChange &&
												IsValidFields(data.phoneNumber)
											}
											isInvalid={
												submitClicked &&
												(data.phoneNumber &&
												data.phoneNumber !== '' &&
												data.phoneNumber.length <= 15
													? false
													: true)
											}
										/>
										<Form.Control.Feedback
											type='invalid'
											className='fontStyleBold'>
											{data.phoneNumber == ''
												? data.phoneNumber == ''
													? i18n.t(
															'validationMessage.fieldIsRequired'
													  )
													: ''
												: data.phoneNumber &&
												  data.phoneNumber.length > 15
												? i18n.t(
														'validationMessage.lengthPhoneNo'
												  )
												: ''}
										</Form.Control.Feedback>
									</Col>
								</Row>
							</Form.Group>
							<Button
								variant='link'
								className='ChangePasswordStyle'
								onClick={handlemodalOpen}>
								{CHANGE_PASSWORD}
							</Button>
							<Form.Group>
								<Row>
									<Col>{renderSaveBtn()}</Col>
									<Col>{renderCancelBtn()}</Col>
								</Row>
							</Form.Group>
							<div className='footerStyle'>
								{ALL_FIELDS_MANDATORY}
							</div>
							<div className='versioningText'>
								{VERSION_TEXT} 1.0
							</div>
						</div>
					)}
				</Form>
				{renderAlertBoxes()}
			</div>
		</div>
	)
}
export default connect(mapStateToProps, null)(Profile)
