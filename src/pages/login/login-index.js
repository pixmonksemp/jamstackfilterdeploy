import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Form, Button, InputGroup, Image, Spinner } from 'react-bootstrap'
import { getProfileDetails, loginDetails } from '../../actions/action-data'
import LoginPic from '../../assets/user-card-background.png'
import Logo from '../../assets/pimLogo.svg'
import backgroundImage from '../../assets/BGmini.png'
import { setFilterData } from '../../components/filter/actions/action-data'
import './style.scss'
import '../../pages/styles.scss'
import { emailFieldValidation, passwordValidation } from './validateEmailField'
import Footer from '../../components/footer/footer'
import ToastModal from '../../components/modal/ToastModal'
import {
	ERROR_BG_COLOR,
	MEDIUM,
	LOGIN_TO_YOUR_ACCOUNT,
	LOGIN,
	PIMERCE_COMMERCE,
	FORGOT_PASSWORD,
	REQUIRED_FIELD,
	ENTER_VAILD_EMAIL,
	INVALID_USER_LOGIN_INFO,
	TOAST_TITTLE_FOR_FAIL
} from '../../common/common-constants'
import AesUtil from '../../lib/aes-util'
import { PASS_PHRASE, CLIENT_SECRET } from '../../common/common-api-constants'
import { sideMenuOptions } from './menu-option'
import i18n from '../../translate/i18n'

import LoginSVG from '../../components/login-svg-component/login-svg'

const mapStateToProps = (state) => {
	return {
		fetchMenuOptions: state.userDetail.getMenuOptionJson,
		getFilterDataValue: state.stateData.getFilterdata,
		getUserDetail: state.userDetail.getUsersObj.userCredentials
	}
}

/**
 * This Props is used to dispatch data to action to make defined API call
 * @param {*} dispatch
 */
const mapDispatchToProps = (dispatch) => {
	return {
		loginDetails: (data) => dispatch(loginDetails(data)),
		getProfileDetails: (data) => dispatch(getProfileDetails(data)),
		setFilterData: (data) => dispatch(setFilterData(data))
	}
}

function LogIn(props) {
	let aesUtil = new AesUtil()
	let aboutContent = i18n.t("login.aboutpxm")
	let featureContent1 = i18n.t("login.features")
	const [submitClicked, setSubmitClicked] = useState(false)
	const [loading, setLoading] = useState(false)
	const [isCheckPasswordValid, setPasswordValid] = useState(true)
	const [isCheckEmailValid, setEmailValid] = useState(true)
	const [showPassword, setShowPassword] = useState(false)
	const [showToastMessage, setShowToastMessage] = useState(false)
	const [title, setTitle] = useState('')
	const [bg_color, setBg_color] = useState('')
	const [content, setContent] = useState('')
	const [size, setSize] = useState('')
	const [loginDetails, setLoginDetails] = useState({
		userName: '',
		password: ''
	})



	useEffect(() => {
		const { postLoginDetailsResult, getProfileResult, getFeaturesResult, getAllFeaturesResult, getFilterDataValue, getOrganizationDetailsResult } = props

		if (
			postLoginDetailsResult &&
			postLoginDetailsResult.content &&
			postLoginDetailsResult.content.data &&
			postLoginDetailsResult.content.status == 200
		) {
			props.loginDetails(postLoginDetailsResult.content.data)
			afterLoginSuccess(
				postLoginDetailsResult.content.data,
				postLoginDetailsResult
			)
		}

		if (
			getProfileResult &&
			getProfileResult.content &&
			getProfileResult.content.status == '200'
		) {
			props.getFeatures(null, getProfileResult.content.data.rolesId)
			props.getProfileDetails(getProfileResult.content.data)

		}

		if (getFeaturesResult &&
			getFeaturesResult.content &&
			getFeaturesResult.content.status == '200' &&
			getFeaturesResult.content.data) {
			let json = getFeaturesResult.content.data
			sessionStorage.setItem("authJson", JSON.stringify(json))
			props.getAllFeatures()

		}
		if (getAllFeaturesResult &&
			getAllFeaturesResult.content &&
			getAllFeaturesResult.content.status == '200' &&
			getAllFeaturesResult.content.data) {
			sessionStorage.setItem("allFeatures", JSON.stringify(getAllFeaturesResult.content.data))
			// if (sessionStorage.getItem("loginUserDetails")) {
				// let userDetails = JSON.parse(sessionStorage.getItem("loginUserDetails"))
				let userDetails = props.getUserDetail
				if(userDetails!=null&&userDetails!=undefined&&userDetails.organizationid){
					props.getOrganizationDetails(null, parseInt(userDetails.organizationid))
				}
			// }
		}
		if (getOrganizationDetailsResult &&
			getOrganizationDetailsResult.content &&
			getOrganizationDetailsResult.content.status == '200' &&
			getOrganizationDetailsResult.content.data &&
			getOrganizationDetailsResult.content.data.filterOptions) {
			sessionStorage.setItem("OrgSpec", getOrganizationDetailsResult.content.data.orgSpec)
			let filterOptions = JSON.parse(getOrganizationDetailsResult.content.data.filterOptions)
			const { setFilterData } = props
			if (getFilterDataValue == undefined) {
				setFilterData(filterOptions)
				props.history.push('/skulist')
			}

		}

		postLoginDetailsResult &&
			postLoginDetailsResult.content &&
			postLoginDetailsResult.content.data &&
			afterLoginFailure(postLoginDetailsResult.content.data)
		const body = document.querySelector('.loginBoxLayout');
		body.scrollTop = 20;
	}, [props.postLoginDetailsResult, props.getProfileResult, props.getFeaturesResult, props.getAllFeaturesResult, props.getOrganizationDetailsResult])

	/**
	 * This method used for handling Alert dismiss functionality
	 */
	function handleHide() {
		setShowToastMessage(false)
	}

	function handleShowOrHidePassword() {
		setShowPassword(!showPassword)
	}

	const afterLoginFailure = (response) => {
		if (response && response.error) {
			setLoading(false)
			setShowToastMessage(true)
			setBg_color(ERROR_BG_COLOR)
			setTitle(TOAST_TITTLE_FOR_FAIL)
			setContent(INVALID_USER_LOGIN_INFO)
			setSize(MEDIUM)
		}
	}

	const afterLoginSuccess = (data, response) => {
		props.fetchMenuOptions.menuOptions = JSON.parse(
			sideMenuOptions.module && sideMenuOptions.module.ModulePresent
		)

		if (response && response.params && response.params.userName) {
			data.userName = response.params.userName
		}
		data.token_value = {
			Authorization: `${data.token_type} ${data.access_token}`
		}
		sessionStorage.setItem(
			i18n.t('commonMessage.loginUserDetails'),
			JSON.stringify(data)
		)
		response.content.status == '200' && props.getProfile()
	}

	/**
	 * This method used for handling Login form events and sets it value into local state
	 * @param {*} e events
	 */
	function handleChange(e) {
		loginDetails[e.target.name] = e.target.value.trim()
		sessionStorage.removeItem(i18n.t('commonMessage.loginUserDetails'))
		if (e.target.name === 'userName') {
			const isEmailValid = emailFieldValidation(e.target.value.trim())
			setEmailValid(isEmailValid)
		} else {
			const valid = passwordValidation(e.target.value.trim())
			setPasswordValid(valid)
		}
	}

	/**
	 * This method used for handling Login form submission and form validation
	 * @param {*} e events
	 */
	function handleSubmit(e) {
		e.preventDefault()
		setSubmitClicked(true)
		if (isCheckEmailValid && isCheckPasswordValid &&loginDetails.userName!=""&&loginDetails.password!="") {
			setLoading(true)
			const postData = {
				userName: loginDetails.userName,
				password: aesUtil.encrypt(PASS_PHRASE, loginDetails.password)
			}
			props.postLoginDetails(postData)
		}
		else{
			if(loginDetails.userName==""&&loginDetails.password==""){
				setEmailValid(false)
				setPasswordValid(false)
			}
		}
	}

	function renderAlertBoxes() {
		return (
			<div>
				<ToastModal
					show={showToastMessage}
					onModalHide={handleHide}
					title={title}
					titleBackgroundColor={bg_color}
					content={content}
					size={size}
				/>
			</div>
		)
	}

	function renderLoginBtn() {
		if (loading) {
			return (
				<Button variant='outline-success' block id='new-login-btn'>
					<Spinner animation='border' className='login-btn-loading-style' variant='light' size='sm' />
				</Button>
			)
		} else {
			return (
				<Button
					variant='success'
					type='submit'
					block
					id='new-login-btn'>
					{LOGIN}
				</Button>
			)
		}
	}

	function renderLoginForm() {	
		return (
			<Form.Group>
				<Form.Group>
					<Form.Label className='login-text form-row'>Email ID</Form.Label>
					<Form.Row>
						<InputGroup id='formGroupBlock'>
							<Form.Control
								name='userName'
								type='text'
								placeholder='Email Id'
								onChange={handleChange}
								id='fieldContainer'
								className={
									loginDetails.userName
										? 'emailid-field'
										: 'emailid-placeholder'
								}
								autoFocus
								autoComplete='off'
								required
								isInvalid={submitClicked && !isCheckEmailValid}
								disabled={loading}
							/>							
							<Form.Control.Feedback
								type='invalid'
								className='fontStyleBold'>
								{ !loginDetails.userName ? `${REQUIRED_FIELD}`: !isCheckEmailValid &&`${ENTER_VAILD_EMAIL}`}
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Row>
				</Form.Group>
				<Form.Group xl='6' lg='6' md='6'>
					<Form.Label className='login-text form-row'>Password</Form.Label>
					<Form.Row>
						<InputGroup id='formGroupBlock'>
							<Form.Control
								name='password'
								type={showPassword ? 'text' : 'password'}
								placeholder='Password'
								onChange={handleChange}
								id='fieldContainer'
								className={
									loginDetails.password
										? 'password-field'
										: 'password-placeholder'
								}
								required
								isInvalid={!isCheckPasswordValid}
								disabled={loading}
								onCopy='return false'
								onPaste='return false'
								style={{
									paddingLeft: '12px',
									paddingBottom: '3px'
								}}
							/>
							<InputGroup.Prepend
								style={{
									position: 'absolute',
									marginTop: '13px',
									marginLeft: isCheckPasswordValid
										? '215px'
										: '200px',
									zIndex: '5'
								}}>
								<i
									class={
										showPassword
											? 'fa fa-eye-slash'
											: 'fa fa-eye'
									}
									aria-hidden='true'
									style={{ cursor: 'pointer' }}
									onClick={handleShowOrHidePassword.bind(
										this
									)}></i>
							</InputGroup.Prepend>
							<Form.Control.Feedback
								type='invalid'
								className='fontStyleBold'>
								{REQUIRED_FIELD}
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Row>
				</Form.Group>
				<div class='row'>
					<div class='col new-forgot-password'>
						<Link to='/forgotPassword' className='forgot'>
							{FORGOT_PASSWORD}
						</Link>
					</div>
				</div>
			</Form.Group>
		)
	}

	return (
		
		<div className='loginBoxLayout pixlogin'>
			<div className='pixContainer row'>
				<div className='pixloginForm col-5 col-sm-5 col-md-5 col-lg-4'>

					<div className='logoSection'>
						<img alt='logo' src={Logo}></img>
					</div>
					<form
						class='login-form validate-form'
						noValidate
						onSubmit={handleSubmit.bind(this)}>
						<div
							class='row'
							style={{ display: 'contents' }}>
							<div class='col-12 offset-md-2 offset-lg-2'>
								<p className='login-block-info form-row'>
									{LOGIN_TO_YOUR_ACCOUNT}
								</p>
							</div>
						</div>
						<div
							class='row'
							style={{ display: 'contents' }}>
							<div class='col-12 col-sm-2 col-md-10 offset-lg-2'>
								{renderLoginForm()}
							</div>
						</div>
						<div
							class='row'
							style={{ display: 'contents' }}>
							<div class='col-12 col-sm-2 col-md-10 offset-lg-2' id=''>
								{renderLoginBtn()}
							</div>
						</div>
					</form>
				</div>
				<div className='pix-Description col-7 col-sm-7 col-md-7 col-lg-8'>
					{
						<LoginSVG
							Name={"PXM"}
							AboutContent={aboutContent}
							FeatureContents={featureContent1}							
						/>
					}
				</div>
			</div>
			{renderAlertBoxes()}
			<Footer isAuthModule={true} tableGridSize='footer' />
		</div>

	)
}

export default connect(mapStateToProps, mapDispatchToProps)(LogIn)
