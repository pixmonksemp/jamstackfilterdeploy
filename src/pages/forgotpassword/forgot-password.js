/** @format */

import React, { useState, useEffect } from 'react'
import { Form, Button, Image, InputGroup, Spinner } from 'react-bootstrap'
import Back from '../../assets/Back.svg'
import Logo from '../../assets/pimLogo.svg'
import LoginPic from '../../assets/user-card-background.png'
import Store from '../../assets/store.png'
import LoginSVG from '../../components/login-svg-component/login-svg'
import { emailFieldValidation } from '../login/validateEmailField'
import backgroundImage from '../../assets/BGmini.png'
import ToastModal from '../../components/modal/ToastModal'
import {
	ERROR_BG_COLOR,
	TOAST_TITTLE_FOR_FAIL,
	MEDIUM,
	INTERNET_CONNECTION_ERROR,
	INTERNAL_SERVER_ERROR,
	RESET_LINK_SUCCESS_INFO,
	RESET_LINK_USER_INFO,
	FORGOT_PASSWORD,
	REQUIRED_FIELD,
	ENTER_VAILD_EMAIL,
	BACK,
	PIMERCE_COMMERCE,
	CONFIRM,
	CANCEL,
	VALID_BG_COLOR,
	TOAST_TITTLE_FOR_SUCCESS,
	ENTER_EMAIL_ID,
	BACK_TO_LOGIN
} from '../../common/common-constants'
import Footer from '../../components/footer/footer'
import AesUtil from '../../lib/aes-util'
import { PASS_PHRASE } from '../../common/common-api-constants'
import i18n from '../../translate/i18n'
import './style.scss'

let aesUtil = new AesUtil()

function ForgotPassword(props) {
	const [isLoading, setIsLoading] = useState(false)
	const [forgotCancelBtnLabel, setForgotCancelBtnLabel] = useState(CANCEL)
	const [disableButtons, setDisableButtons] = useState(false)
	const [showBackBtn, setShowBackBtn] = useState(true)
	const [show, setShow] = useState(false)

	const [title, setTitle] = useState('')
	const [bg_color, setBg_color] = useState('')
	const [content, setContent] = useState('')
	const [size, setSize] = useState('')
	const [textChange, setTextChange] = useState(false)
	const [data, setData] = useState({})
	const [emailValid, setEmailValid] = useState(false)
	const [submitClicked, setSubmitClicked] = useState(false)
	let aboutContent = i18n.t("login.aboutpxm")
	let featureContent1 = i18n.t("login.features")
	useEffect(() => {
		const { sendEmailToGetResetLinkResult } = props
		if (
			sendEmailToGetResetLinkResult &&
			sendEmailToGetResetLinkResult.content &&
			sendEmailToGetResetLinkResult.content.data
		) {
			let title, color, description
			if (
				sendEmailToGetResetLinkResult.content.data.code ==
				i18n.t('commonMessage.success')
			) {
				color = VALID_BG_COLOR
				title = TOAST_TITTLE_FOR_SUCCESS
				description =
					sendEmailToGetResetLinkResult.content.data.description
				setDisableButtons(true)
				setTextChange(true)
				setForgotCancelBtnLabel(BACK_TO_LOGIN)
				setShowBackBtn(false)
			} else {
				color = ERROR_BG_COLOR
				title = TOAST_TITTLE_FOR_FAIL
				description =
					sendEmailToGetResetLinkResult.content.data.errorMessage
				setDisableButtons(false)
				setTextChange(false)
				setForgotCancelBtnLabel(CANCEL)
				setShowBackBtn(true)
			}

			setData({ userName: '' })
			setIsLoading(false)
			setShow(true)
			setBg_color(color)
			setTitle(title)
			setContent(description)
			setSize(MEDIUM)
		}
	}, [props.sendEmailToGetResetLinkResult])

	/**
	 * This method used for handling Forgot Password form events and sets it value into local state
	 * @param {*} e events
	 */
	const handleChange = (e) => {
		data[e.target.name] = e.target.value
		if (e.target.name === 'userName') {
			const isEmailValid = emailFieldValidation(e.target.value)
			setEmailValid(isEmailValid)
		}
	}

	/**
	 * This method used for handling Forgot Password form submission and form validation
	 * @param {*} e events
	 */
	const handleSubmit = (e) => {
		e.preventDefault()
		setSubmitClicked(true)
		if (emailValid) {
			setIsLoading(true)
			setDisableButtons(true)
			let postData = {
				userName: data.userName
			}
			props.sendEmailToGetResetLink(postData)
		}
	}

	const handleBackClick = () => {
		props.history.push('/')
	}

	const handleToastModalClose = () => {
		setShow(false)
	}

	const renderForgotBtn = () => {
		return (
			<Button
				type='submit'
				variant='primary'
				id='new-login-btn'
				disabled={disableButtons}
				>
				{
				isLoading ? 
				(
					<div >
						<Spinner animation='border' variant='light' size='sm' />
					</div>
				) 
				: (
					CONFIRM
				)
				}
			</Button>
		)
	}

	const renderCancelBtn = () => {
		return (
			<Button
				variant='primary'
				id='new-login-btn'				
				onClick={handleBackClick}>
				{forgotCancelBtnLabel}
			</Button>
		)
	}

	const renderForgotForm = () => {
		return (
			<Form.Group>
				<div class='row'>
					<div class='col-12 offset-md-2 offset-lg-2'>
						<InputGroup
							id='formGroupBlock'>
							<Form.Control
								name='userName'
								type='text'
								placeholder={ENTER_EMAIL_ID}
								onChange={handleChange}
								id='fieldContainer'
								className='emailid-placeholder'
								autoComplete='off'
								autoFocus
								required
								disabled={disableButtons}
								isValid={emailValid}
								isInvalid={submitClicked && !emailValid}
							/>
							<Form.Control.Feedback
								type='invalid'
								className='fontStyleBold'>
								{!data.userName
									? `${REQUIRED_FIELD}`
									: !emailValid && `${ENTER_VAILD_EMAIL}`}
							</Form.Control.Feedback>
						</InputGroup>
					</div>
				</div>
			</Form.Group>
		)
	}

	const renderAlertBoxes = () => {
		return (
			<div>
				<ToastModal
					show={show}
					onModalHide={handleToastModalClose}
					title={title}
					titleBackgroundColor={bg_color}
					content={content}
					size={size}
				/>
			</div>
		)
	}

	return (
		<>

<div className='loginBoxLayout pixlogin'>
<div className='pixContainer row'>
					<div className='pixloginForm col-5 col-sm-5 col-md-5 col-lg-4'>

						<div className='logoSection'>
							<img alt='logo' src={Logo}></img>
						</div>
						<form
							class='forgot-form validate-form'
							noValidate
							onSubmit={handleSubmit}
							style={{ display: 'block' }}>
							<div
								class='row'
								style={{
									display: 'contents'
								}}>
								<div class='col-12 offset-md-2 offset-lg-2'>
									{showBackBtn ? (
										<p
											style={{
												color:
													'#292929',
												fontFamily:
													'Barlow-Regular',
												fontSize:
													'16px',
												lineHeight:
													'19px',
												cursor:
													'pointer'
											}}
											onClick={
												handleBackClick
											}>
											<Image
												src={Back}
												width='12px'
												color='#292929'
												height='12px'
												className='forgot-back-icon'
											/>
											{BACK}
										</p>
									) : (
										''
									)}
								</div>
							</div>
							<div
								class='row'
								style={{
									display: 'contents'
								}}>
								<div class='col-12 offset-md-2 offset-lg-2'>
									<p className='forgot-password-style'>
										{FORGOT_PASSWORD}
									</p>
								</div>
							</div>
							<div
								class='row '
								style={{
									display: 'contents'
								}}>
								<div class='col-9 offset-md-2 offset-lg-2'>
									{textChange &&
										!isLoading ? (
										<p className='password-link-sent'>
											<b>
												{' '}
												{
													RESET_LINK_SUCCESS_INFO
												}
											</b>
										</p>
									) : (
										<p className='forgot-password-info'>
											<b>
												{
													RESET_LINK_USER_INFO
												}
											</b>
										</p>
									)}
								</div>
							</div>
							<div
								class='row justify-content-center'
								style={{
									display: 'contents'
								}}>
								<div
									class='col'
									style={{
										paddingBottom: '0.5em'
									}}>
									{renderForgotForm()}
								</div>
							</div>
							<div class='row justify-content-center  offset-md-1 offset-lg-1'>
								<div
									class='col forgot-btn'
									style={{
										borderRadius: '2em'
									}}>
									{renderForgotBtn()}
								</div>
								<div
									class='col d-flex justify-content-center'
									style={{
										borderRadius: '2em'
									}}>
									{renderCancelBtn()}
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
	   </>
	)
}

export default ForgotPassword
