/** @format */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Form, Button, InputGroup, Image, Spinner } from 'react-bootstrap'
import {
	postLoginDetails,
	postLoginDetailsSuccess,
	postLoginDetailsFailure,
	getPreferredRetailer,
	getPreferredRetailerSuccess,
	getPreferredRetailerFailure,
	getFeatures,
	getFeaturesSuccess,
	getFeaturesFailure,
	// postUpdateUserDetail,
	// postUpdateUserDetailSuccess,
	// postUpdateUserDetailFailure,
	getProfile,
	getProfileSuccess,
	getProfileFailure
} from '../../actions/action-auth'
import LoginPic from '../../assets/user-card-background.png'
import Logo from '../../assets/pimerce-logo-white.png'
import backgroundImage from '../../assets/BGmini.png'
import './style.scss'
import { emailFieldValidation, passwordValidation } from './validateEmailField'
import Footer from '../../components/footer/footer'
import ToastModal from '../../components/modal/ToastModal'
import {
	ERROR_BG_COLOR,
	TOAST_TITTLE_FOR_FAIL,
	MEDIUM,
	// ATTEMPT_INFO,
	INVALID_USER_LOGIN_INFO,
	INTERNET_CONNECTION_ERROR,
	LOGIN_TO_YOUR_ACCOUNT,
	LOGIN,
	PIMERCE_COMMERCE,
	FORGOT_PASSWORD,
	REQUIRED_FIELD,
	ENTER_VAILD_EMAIL
} from '../../common/common-constants'
import AesUtil from '../../lib/aes-util'
import { PASS_PHRASE, CLIENT_SECRET } from '../../common/common-api-constants'
import CommonAlertMessage from '../../common/common-language-jsons/error-message-login-en.json'
import input_field_border_color from "../../styling/scss/_variables.scss";

let failCount = 0
let aesUtil = new AesUtil()

/**
 * This Props is used to retrieve data stored in reducer state
 * @param {*} state
 */
const mapStateToProps = state => {
	return {
		fetchUserDetails: state.userContext.getUsersObj,
		fetchMenuOptions: state.userContext.getMenuOptionJson,
		getOrganizationDetails: state.userContext.organizationDetails.data
	}
}

/**
 * This Props is used to dispatch data to action to make defined API call
 * @param {*} dispatch
 */
const mapDispatchToProps = dispatch => {
	return {
		postLoginDetails: postData => {
			dispatch(postLoginDetails(postData)).then(response => {
				if (response.error) {
					return dispatch(postLoginDetailsFailure(response))
				}
				dispatch(postLoginDetailsSuccess(response.payload.data))
				dispatch(getProfile(response.payload.data)).then(
					ProfResponse => {
						!ProfResponse.error
							? dispatch(
								getProfileSuccess(ProfResponse.payload.data)
							)
							: dispatch(getProfileFailure(ProfResponse))
					}
				)
			})
		},
		getFeatures: postData => {
			dispatch(getFeatures(postData)).then(response => {
				if (response.error) {
					return dispatch(getFeaturesFailure(response))
				}
				dispatch(getFeaturesSuccess(response.payload.data))
			})
		},
		// postUpdateUserDetail: (postData) => {
		// 	dispatch(postUpdateUserDetail(postData)).then((response) => {
		// 		if (response.error) {
		// 			return dispatch(postUpdateUserDetailFailure(response))
		// 		}
		// 		dispatch(postUpdateUserDetailSuccess(response.payload.data))
		// 	})
		// },
		getPreferredRetailer: postData => {
			dispatch(getPreferredRetailer(postData)).then(response => {
				if (response.error) {
					return dispatch(getPreferredRetailerFailure(response))
				}
				dispatch(getPreferredRetailerSuccess(response.payload.data))
			})
		}
	}
}

/**
 * This class/component is created for PIMerce Login Page
 */
class LogIn extends Component {
	constructor(props) {
		super(props)
		this.state = {
			validated: true,
			emailValidated: false,
			isLoading: false,
			isInvalidUser: false,
			loginDetails: {
				loginid: '',
				password: ''
			},
			userCheckState: '',
			show: false,
			title: '',
			bg_color: '',
			content: '',
			size: '',
			stopLooping: false,
			showPassword: false
		}
		this.handleHide = this.handleHide.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
	/**
	 * This method used for redirection to another component after successful SignUp
	 * @param newProps it contains all updated props
	 */
	componentWillReceiveProps(newProps) {
		const { fetchUserDetails, getOrganizationDetails } = newProps
		if (fetchUserDetails && fetchUserDetails.loading) {
			this.setState({ isLoading: false })
		}
		// Used to block the user if the password is wrong for more than 3 times
		// if (failCount >= 3) {
		//   this.setState({
		//       show:true,
		//       bg_color:ERROR_BG_COLOR,
		//       title:TOAST_TITTLE_FOR_FAIL,
		//       content:ATTEMPT_INFO,
		//       size:MEDIUM
		//   })
		//   const postData = { username: this.state.loginDetails.loginid }
		//   this.props.postUpdateUserDetail(postData)
		// }
		if (fetchUserDetails) {
			if (
				fetchUserDetails.userCredentials &&
				fetchUserDetails.userCredentials.loginstatus === 'Login_Success' &&
				!this.state.stopLooping
			) {
				this.props.getFeatures(fetchUserDetails)
				this.props.getPreferredRetailer(fetchUserDetails)
				this.setState({ stopLooping: true })
			} else if (
				fetchUserDetails.error &&
				fetchUserDetails.error.loginstatus === 'Login_Fail'
			) {
				failCount++
				this.setState({
					isLoading: false,
					show: true,
					bg_color: ERROR_BG_COLOR,
					title: CommonAlertMessage.status.toastTitle,
					content: CommonAlertMessage.statusMessage.loginFail,
					size: MEDIUM
				})
			} else if (
				fetchUserDetails.error &&
				fetchUserDetails.error.loginstatus === 'Network Error !'
			) {
				this.setState({
					show: true,
					bg_color: ERROR_BG_COLOR,
					title: CommonAlertMessage.status.toastTitle,
					content: CommonAlertMessage.statusMessage.networkError,
					size: MEDIUM
				})
			}
			if (
				getOrganizationDetails &&
				getOrganizationDetails.module != null
			) {
				const userDetails = sessionStorage.getItem('loginUserDetails')
				const data = JSON.parse(userDetails)
				if (data && data.usertype && (data.usertype === 'Global' || data.usertype === 'Region')) {
					this.props.fetchMenuOptions.menuOptions = JSON.parse(
						data.module.ModulePresent
					)
					this.props.history.push('/globaldashboard')
				}
				else {
					this.props.fetchMenuOptions.menuOptions = JSON.parse(
						data.module.ModulePresent
					)
					this.props.history.push('/dashboard')
				}
			}
			if (this.state.stopLooping == true) {
				this.setState({
					show: true,
					bg_color: ERROR_BG_COLOR,
					title: CommonAlertMessage.status.toastTitle,
					content: CommonAlertMessage.statusMessage.loopingmessage,
					size: MEDIUM
				})
			}
		}
	}

	/**
	 * This method used for handling Login form events and sets it value into local state
	 * @param {*} e events
	 */
	handleChange(e) {
		this.state.loginDetails[e.target.name] = e.target.value
		sessionStorage.removeItem('loginUserDetails')
		if (e.target.name === 'loginid') {
			const isEmailValid = emailFieldValidation(e.target.value.trim())
			this.setState({ emailValid: isEmailValid })
		} else {
			const valid = passwordValidation(e.target.value)
			this.setState({ validated: valid })
		}
	}

	/**
	 * This method used for handling Login form submission and form validation
	 * @param {*} e events
	 */
	handleSubmit(e) {
		e.preventDefault()
		const {
			emailValid,
			validated,
			loginDetails,
			userCheckState
		} = this.state
		if (loginDetails.loginid.trim() !== userCheckState) {
			failCount = 0
		}
		this.setState({
			submitClicked: true,
			userCheckState: loginDetails.loginid
		})

		if (emailValid && validated) {
			this.setState({ isLoading: true })

			const postData = {
				loginid: aesUtil.encrypt(PASS_PHRASE, loginDetails.loginid.trim()),
				password: aesUtil.encrypt(PASS_PHRASE, loginDetails.password),
				secretkey: CLIENT_SECRET
			}
			this.props.postLoginDetails(postData)
		}
	}

	/**
	 * This method used for handling Alert dismiss functionality
	 */
	handleHide() {
		this.setState({
			show: false
		})
	}

	handleShowOrHidePassword() {
		this.setState({ showPassword: !this.state.showPassword })
	}

	renderLoginForm() {
		const {
			submitClicked,
			validated,
			emailValid,
			loginDetails
		} = this.state
		return (
			<Form.Group>
				<Form.Group>
					<Form.Row>
						<InputGroup id='formGroupBlock'>
							<Form.Control
								name='loginid'
								type='text'
								placeholder='Email Id'
								onChange={this.handleChange}
								id='fieldContainer'
								className={
									loginDetails.loginid
										? 'emailid-field'
										: 'emailid-placeholder'
								}
								autoFocus
								autoComplete='off'
								required
								isInvalid={submitClicked && !emailValid}
								disabled={this.state.isLoading}
							/>
							<Form.Control.Feedback
								type='invalid'
								className='fontStyleBold'>
								{!loginDetails.loginid
									? `${REQUIRED_FIELD}`
									: !emailValid && `${ENTER_VAILD_EMAIL}`}
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Row>
				</Form.Group>
				<Form.Group xl='6' lg='6' md='6'>
					<Form.Row>
						<InputGroup id='formGroupBlock'>
							<Form.Control
								name='password'
								type={this.state.showPassword ? 'text' : 'password'}
								placeholder='Password'
								onChange={this.handleChange}
								id='fieldContainer'
								className={
									loginDetails.password
										? 'password-field'
										: 'password-placeholder'
								}
								required
								isInvalid={!validated}
								disabled={this.state.isLoading}
								onCopy='return false'
								onPaste='return false'
								style={{
									borderColor: input_field_border_color,
									paddingLeft: '12px', paddingBottom: '3px'
								}}
							/>
							<InputGroup.Prepend style={{ position: 'absolute', marginTop: '13px', marginLeft: validated ? '215px' : '200px', zIndex: '5' }}>
								<i
									class={
										this.state.showPassword
											? 'fa fa-eye-slash'
											: 'fa fa-eye'
									}
									aria-hidden='true'
									style={{ cursor: 'pointer' }}
									onClick={this.handleShowOrHidePassword.bind(
										this
									)}
								></i>
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
					<div class='col'>
						<Link to='/forgotPassword' className='forgot'>
							{FORGOT_PASSWORD}
						</Link>
					</div>
				</div>
			</Form.Group>
		)
	}

	renderAlertBoxes() {
		const { show, title, bg_color, content, size } = this.state
		return (
			<div>
				<ToastModal
					show={show}
					onModalHide={this.handleHide}
					title={title}
					titleBackgroundColor={bg_color}
					content={content}
					size={size}
				/>
			</div>
		)
	}

	renderLoginBtn() {
		if (this.state.isLoading) {
			return (
				<Button variant='outline-success' block id='btnBlockContainer'>
					<Spinner animation='border' className='login-btn-loading-style' size='sm' />
				</Button>
			)
		} else {
			return (
				<Button
					variant='success'
					type='submit'
					block
					id='btnBlockContainer'>
					{LOGIN}
				</Button>
			)
		}
	}

	render() {
		return (
			<div
				className='loginBoxLayout'
				style={{ backgroundImage: `url(${backgroundImage})` }}>
				<div className='loginTopContent'>
					<Image src={Logo} />
				</div>
				<div class='loginContentContainer'>
					<div class='row justify-content-center' id='contentRow'>
						<div
							class='col-4 col-md-4 col-lg-5'
							id='loginLeftBlock'>
							<div className='login-left-box'>
								<img
									src={LoginPic}
									alt='login'
									class='loginBgImage'
								/>
								<div className='login-left-image-box'>
									<h1 className='letsGet'>
										{PIMERCE_COMMERCE.ecommerce}
									</h1>
									<h1 className='letsGet'>
										{PIMERCE_COMMERCE.insights}
									</h1>
								</div>
							</div>
						</div>
						<div class='col-4 col-md-4 col-lg-5'>
							<div class='container-login'>
								<div class='login-box'>
									<form
										class='login-form validate-form'
										noValidate
										onSubmit={this.handleSubmit}>
										<div
											class='row'
											style={{ display: 'contents' }}>
											<div class='col-12 offset-md-2 offset-lg-2'>
												<p className='login-block-info'>
													{LOGIN_TO_YOUR_ACCOUNT}
												</p>
											</div>
										</div>
										<div
											class='row'
											style={{ display: 'contents' }}>
											<div class='col-13 col-sm-2 col-md-10 offset-lg-2'>
												{this.renderLoginForm()}
											</div>
										</div>
										<div
											class='row'
											style={{ display: 'contents' }}>
											<div class='col' id='loginBtnBlock'>
												{this.renderLoginBtn()}
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
						{this.renderAlertBoxes()}
					</div>
				</div>
				<Footer isAuthModule={true} tableGridSize='footer' />
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LogIn)