import React, { useState, useEffect, useRef } from 'react'
import {
	Card,
	Col,
	Form,
	Button,
	Spinner,
	Row,
	InputGroup
} from 'react-bootstrap'
import 'react-toastify/dist/ReactToastify.css'
import { connect } from 'react-redux'
import { passwordFieldValid } from '../login/validateEmailField'
import CloseIcon from '../../assets/Close.png'
import changePasswordIcon from '../../assets/changePassword.svg'
import AesUtil from '../../lib/aes-util'
import { PASS_PHRASE } from '../../common/common-api-constants'
import {
	ALL_FIELDS_MANDATORY,
	NEW_PASSWORD,
	CURRENT_PASSWORD,
	SUCCESS,
	CONFIRM_PASSWORD,
	CHANGE_YOUR_PASSWORD
} from '../../common/common-constants'
import i18n from '../../translate/i18n'

const mapStateToProps = (state) => {
	return {
		userCredential: state.userDetail.userProfile
	}
}

let aesUtil = new AesUtil()

function ChangePassword(props) {
	const [isLoading, setIsLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [showCurrPassword, setShowCurrPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [isReload, setIsReload] = useState(false)
	const [form, setForm] = useState({
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: ''
	})
	const [passwordValid, setPasswordValid] = useState({
		newPassword: '',
		confirmNewPassword: ''
	})
	const [submitClicked, setSubmitClicked] = useState(false)
	const formRef = useRef(null);

	useEffect(() => {
    const { postChangePasswordResult } = props
    if (postChangePasswordResult && postChangePasswordResult.content) {
      if (
        postChangePasswordResult.content.data &&
        postChangePasswordResult.content.data.code ==
          i18n.t("commonMessage.success")
      ) {
		
        props.modalHide(
          SUCCESS,
          `${postChangePasswordResult.content.data.description}, ${i18n.t(
            "commonMessage.redirected_login"
          )}`
        )
      } else {
		handleReset()
		form.currentPassword = ''	
		setIsLoading(false)
        props.modalHide("failure",i18n.t("commonMessage.failure"))
      }
    }
  }, [props.postChangePasswordResult])
   
	const handleReset = () => {
    	formRef.current.value = '';
		setSubmitClicked(false)
    };

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value
		})
		setSubmitClicked(false)

		if (
			e.target.name === 'newPassword' ||
			e.target.name === 'confirmNewPassword'
		) {
			const isPasswordValid = passwordFieldValid(e.target.value)
			setPasswordValid({
				...passwordValid,
				[e.target.name]: isPasswordValid[0]
			})
		}
	}

	const handleIsValidFields = (currentPassword) => {
		return passwordFieldValid(currentPassword)
	}

	const handleConfirmNewPasswordIsValid = (confirmNewPassword) => {
		if (passwordFieldValid(confirmNewPassword)[0]) {
			if (
				form.newPassword &&
				confirmNewPassword &&
				form.newPassword != '' &&
				confirmNewPassword != '' &&
				form.newPassword != confirmNewPassword
			) {
				return [false, i18n.t('validationMessage.passwordNotMatch')]
			}
		}
		return passwordFieldValid(confirmNewPassword)
	}

	function toCheckPasswordNewPassword(newPassword, currentPassword) {
		if (passwordFieldValid(newPassword)[0]) {
			if (
				newPassword &&
				currentPassword &&
				newPassword != '' &&
				currentPassword != '' &&
				newPassword == currentPassword
			) {
				return [
					false,
					i18n.t('validationMessage.newPasswordValidation')
				]
			}
		}
		return passwordFieldValid(newPassword)
	}

	function handleSubmit(e) {
		e.preventDefault()
		setSubmitClicked(true)
		setIsReload(false)
		const { userCredential } = props

		if (
			handleIsValidFields(form.currentPassword)[0] &&
			toCheckPasswordNewPassword(
				form.newPassword,
				form.currentPassword
			)[0] &&
			handleConfirmNewPasswordIsValid(form.confirmNewPassword)[0]
		) {
			const postData = {
				userName: userCredential.data.userName,
				oldPassword: aesUtil.encrypt(PASS_PHRASE, form.currentPassword),
				password: aesUtil.encrypt(PASS_PHRASE, form.newPassword)
			}
			setIsLoading(true)
			props.postChangePassword(postData)
		}
	}

	const renderApplyBtn = () => {
		return (
			<span>
			{props.isFirstTimeUser?
				<Button
					id='saveButton'
					onClick={handleSubmit.bind(this)}
					className='submitButtonStyle'
					style={{marginLeft:"auto"}}
					variant='primary'
					type='submit'>
					{isLoading ? (
						<Spinner animation='border' variant='info' size='sm' />
					) : (
						'Apply Changes'
					)}
				</Button>
				:
				<Button
					id='saveButton'
					onClick={handleSubmit.bind(this)}
					className='submitButtonStyle'
					variant='primary'
					type='submit'>
					{isLoading ? (
						<Spinner animation='border' variant='info' size='sm' />
					) : (
						'Apply Changes'
					)}
				</Button>
			}
			</span>
		)
	}

	const renderCancelBtn = () => {
		if (!props.isFirstTimeUser) {
			return (
				<span>
					<Button
						id='cancelButton'
						className='cancelButtonStyle'
						variant='outline-light'
						onClick={props.modalHide}>
						Cancel
					</Button>
				</span>
			)
		}
	}

	const handleShowOrHidePassword = (data) => {
		if (data === 'newPassword') {
			setShowPassword(!showPassword)
		} else if (data === 'currPassword') {
			setShowCurrPassword(!showCurrPassword)
		} else {
			setShowConfirmPassword(!showConfirmPassword)
		}
	}

	const handleToastModalClose = () => {
		setShow(false)
		if (isReload) {
			window.location.reload()
		}
	}

	return (
		<>
			<div>
				{!props.isFirstTimeUser ? (
					<Row
						style={{
							margin: '0px',
							display: 'flex',
							justifyContent: 'flex-end'
						}}>
						<img
							style={{
								marginRight: '20px',
								marginTop: '18px',
								cursor: 'pointer'
							}}
							src={CloseIcon}
							onClick={props.modalHide}></img>
					</Row>
				) : (
					<div style={{ paddingTop: '2rem' }}></div>
				)}
				<Form className='screenForm'>
					<img
						src={changePasswordIcon}
						style={{ width: '40px', height: '50px' }}
					/>
					<div
						style={{
							color: '#272727',
							fontsize: '16px',
							fontWeight: 'bolder',
							paddingBottom: '20px',
							paddingTop: '28px'
						}}>
						{CHANGE_YOUR_PASSWORD}
					</div>
					<Form.Group className='formgroupStyle'>
						<Row>
							<Col
								md={12}
								lg={12}
								xs={12}
								sm={12}
								className='profileInputStyle'>
								<InputGroup className='ProfileBoxStyle'>
									<Form.Control
										name='currentPassword'
										type={
											showCurrPassword
												? 'text'
												: 'password'
										}
										placeholder={CURRENT_PASSWORD}
										onChange={handleChange}
										ref={formRef}
										autoFocus
										autoComplete='off'
										required
										isValid={
											submitClicked &&
											handleIsValidFields(
												form.currentPassword
											)[0]
										}
										isInvalid={
											submitClicked &&
											!handleIsValidFields(
												form.currentPassword
											)[0]
										}
										disabled={isLoading}
									/>
									<InputGroup.Prepend
										style={{
											position: 'absolute',
											marginTop: '20px',
											marginLeft: '278px',
											zIndex: '5'
										}}>
										<i
											class={
												showCurrPassword
													? 'fa fa-eye-slash'
													: 'fa fa-eye'
											}
											aria-hidden='true'
											style={{ cursor: 'pointer' }}
											onClick={handleShowOrHidePassword.bind(
												this,
												'currPassword'
											)}></i>
									</InputGroup.Prepend>
									<Form.Control.Feedback
										type='invalid'
										className='fontStyleBold'>
										<div className='currentPasswordValid'>
											{submitClicked &&
											!handleIsValidFields(
												form.currentPassword
											)[0]
												? handleIsValidFields(
														form.currentPassword
												  )[1]
												: ''}
										</div>
									</Form.Control.Feedback>
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					<Form.Group className='formgroupStyle'>
						<Row>
							<Col
								md={12}
								lg={12}
								xs={12}
								sm={12}
								className='profileInputStyle'>
								<InputGroup className='ProfileBoxStyle'>
									<Form.Control
										name='newPassword'
										type={
											showPassword ? 'text' : 'password'
										}
										placeholder={NEW_PASSWORD}
										onChange={handleChange}
										autoComplete='off'
										required
										isValid={
											submitClicked &&
											toCheckPasswordNewPassword(
												form.newPassword,
												form.currentPassword
											)[0]
										}
										isInvalid={
											submitClicked &&
											!toCheckPasswordNewPassword(
												form.newPassword,
												form.currentPassword
											)[0]
										}
										disabled={isLoading}
									/>
									<InputGroup.Prepend
										style={{
											position: 'absolute',
											marginTop: '18px',
											marginLeft: '278px',
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
												this,
												'newPassword'
											)}></i>
									</InputGroup.Prepend>
									<Form.Control.Feedback
										type='invalid'
										className='fontStyleBold'>
										<div className='confirmPasswordValid'>
											{submitClicked &&
											!toCheckPasswordNewPassword(
												form.newPassword,
												form.currentPassword
											)[0]
												? toCheckPasswordNewPassword(
														form.newPassword,
														form.currentPassword
												  )[1]
												: ''}
										</div>
									</Form.Control.Feedback>
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					<Form.Group className='formgroupStyle'>
						<Row>
							<Col
								md={12}
								lg={12}
								xs={12}
								sm={12}
								className='profileInputStyle'>
								<InputGroup className='ProfileBoxStyle'>
									<Form.Control
										name='confirmNewPassword'
										type={
											showConfirmPassword
												? 'text'
												: 'password'
										}
										placeholder={CONFIRM_PASSWORD}
										onChange={handleChange}
										autoComplete='off'
										required
										isValid={
											submitClicked &&
											handleConfirmNewPasswordIsValid(
												form.confirmNewPassword
											)[0]
										}
										isInvalid={
											submitClicked &&
											!handleConfirmNewPasswordIsValid(
												form.confirmNewPassword
											)[0]
										}
										disabled={isLoading}
									/>
									<InputGroup.Prepend
										style={{
											position: 'absolute',
											marginTop: '18px',
											marginLeft: '278px',
											zIndex: '5'
										}}>
										<i
											class={
												showConfirmPassword
													? 'fa fa-eye-slash'
													: 'fa fa-eye'
											}
											aria-hidden='true'
											style={{ cursor: 'pointer' }}
											onClick={handleShowOrHidePassword.bind(
												this,
												'confirmPassword'
											)}></i>
									</InputGroup.Prepend>
									<Form.Control.Feedback
										type='invalid'
										className='fontStyleBold'>
										<div className='confirmPasswordValid'>
											{submitClicked &&
											!handleConfirmNewPasswordIsValid(
												form.confirmNewPassword
											)[0]
												? handleConfirmNewPasswordIsValid(
														form.confirmNewPassword
												  )[1]
												: ''}
										</div>
									</Form.Control.Feedback>
								</InputGroup>
							</Col>
						</Row>
					</Form.Group>
					<Form.Group>
						{renderApplyBtn()}
						<br />
						<br />
						{renderCancelBtn()}
					</Form.Group>
					<div
						style={{
							color: '#FF0004',
							fontSize: '10px',
							paddingBottom: '1rem',
							marginTop: '-30px'
						}}>
						{' '}
						{ALL_FIELDS_MANDATORY}
					</div>
				</Form>
			</div>
		</>
	)
}

export default connect(mapStateToProps, null)(ChangePassword)
