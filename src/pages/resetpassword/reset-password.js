import React, { useState, useEffect } from 'react'
import {
	Col,
	Form,
	Button,
	Spinner,
	Row,
	FormGroup,
	InputGroup,
	Card
} from 'react-bootstrap'
import './style.scss'
import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom'
import {
	emailFieldValidation,
	passwordFieldValid
} from '../login/validateEmailField'
import PimLogo from '../../assets/pimLogo.svg'
import AesUtil from '../../lib/aes-util'
import { PASS_PHRASE } from '../../common/common-api-constants'
import ToastModal from '../../components/modal/ToastModal'
import {
	BACK_TO_LOGIN,
	CONFIRM_PASSWORD,
	ENTER_EMAIL_ID,
	ENTER_VAILD_EMAIL,
	ERROR_BG_COLOR,
	MEDIUM,
	NEW_PASSWORD,
	REQUEST_TO_RESET_PASSWORD,
	REQUIRED_FIELD,
	RESET_PASSWORD,
	RESET_PASSWORD_MESSAGE,
	TOAST_TITTLE_FOR_FAIL,
	USERNAME_NOT_FOUND,
	VALID_BG_COLOR
} from '../../common/common-constants'

import i18n from '../../translate/i18n'

let aesUtil = new AesUtil()

function ResetPassword(props) {
	const [validated, setValidated] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [submitClicked, setSubmitClicked] = useState(false)
	const [emailValid, setEmailValid] = useState(false)
	const [isEmailCorrect,setIsEmailCorrect] = useState(false)
	const [show, setShow] = useState(false)
	const [title, setTitle] = useState('')
	const [bg_color, setBg_color] = useState('')
	const [content, setContent] = useState('')
	const [size, setSize] = useState('')

	const [form, setForm] = useState({
		userId: '',
		newPassword: '',
		confirmNewPassword: ''
	})

	useEffect(() => {
		const { postResetPasswordResult } = props
		if (postResetPasswordResult && postResetPasswordResult.content) {
			let color
			let title
			let description
			let data = postResetPasswordResult.content.data
				? postResetPasswordResult.content.data
				: postResetPasswordResult.content.error
				? postResetPasswordResult.content.error
				: null
			if (data) {
				color =
					data.code == i18n.t('commonMessage.success')
						? VALID_BG_COLOR
						: ERROR_BG_COLOR
				title =
					data.code == i18n.t('commonMessage.success')
						? i18n.t('toastMessage.updateToastHeading')
						: TOAST_TITTLE_FOR_FAIL
				description =
					data.code == i18n.t('commonMessage.success')
						? `${data.description}, ${i18n.t(
								'commonMessage.redirected_login'
						  )}`
						: data.description ? data.description : "Something went wrong, please try again"

				setShow(true)
				setIsLoading(false)
				setBg_color(color)
				setTitle(title)
				setContent(description)
				setSize(MEDIUM)
				if (data.code == i18n.t('commonMessage.success')) {
					setTimeout(() => {
						props.history.push('/')
					}, 2500)
				}
			}
		}
	}, [props.postResetPasswordResult])

	function handleChange(e) {
		setForm({
			...form,
			[e.target.name]: e.target.value
		})
		setSubmitClicked(false)

		if (e.target.name === 'userId') {
			const isEmailValid = emailFieldValidation(e.target.value)
			setIsEmailCorrect(location.href.split("&user=")[1] == e.target.value.trim())
			setEmailValid(isEmailValid)
		} else {
			const form = e.currentTarget
			const isValid = form.checkValidity()
			setValidated(isValid)
		}
	}

	function handleSubmit(e) {
		e.preventDefault()
		setSubmitClicked(true)

		if (emailValid &&isEmailCorrect&& validated && passwordFieldValid(
			form.newPassword
		)[0] && passwordFieldValid(
			form.confirmNewPassword
		)[0]) {
			if (form.newPassword === form.confirmNewPassword) {
				const postData = {
					token: aesUtil.encrypt(
						PASS_PHRASE,
						location.href.split("token=")[1].split("&user")[0]
					),
					loginid: form.userId,
					password: aesUtil.encrypt(PASS_PHRASE, form.newPassword)
				}
				setIsLoading(true)
				props.postResetPassword(postData)
			}
		}
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

	const handleToastModalClose = () => {
		setShow(false)
	}

	function renderLoginBtn() {
		if (isLoading) {
			return (
				<Button
					id='save-button'
					className='buttonSubmit'
					variant='primary'
					type='submit'>
					<Spinner animation='border' variant='light' size='sm' />
				</Button>
			)
		} else {
			return (
				<Button
					disabled={isLoading}
					id='save-button'
					className='buttonSubmit'
					variant='primary'
					type='submit'>
					{RESET_PASSWORD}
				</Button>
			)
		}
	}

	function handleShowOrHidePassword(data) {
		if (data === 'Password') {
			setShowPassword(!showPassword)
		} else {
			setShowConfirmPassword(!showConfirmPassword)
		}
	}

	return (
		<div className='card-style-div'>
			<Card className='card-style'>
				<Form>
					<Card.Title style={{ textAlign: 'center' }}>
						<div className='reset-text'>
							{' '}
							<img
								src={PimLogo}
								width='180px'
								height='95px'
								style={{ marginTop: '62px' }}
							/>
							<br />
							{RESET_PASSWORD_MESSAGE}
						</div>
						<div className='reset-link-text'>
							{' '}
							{REQUEST_TO_RESET_PASSWORD}
						</div>
					</Card.Title>
					<Card.Body>
						<Form.Group className='form-group-resetpassword'>
							<Row>
								<Col className='inputField'>
									<Form.Control
										name='userId'
										type='text'
										placeholder={ENTER_EMAIL_ID}
										onChange={handleChange}
										autoFocus
										tabIn
										autoComplete='off'
										required
										isValid={(submitClicked && emailValid)||(submitClicked && isEmailCorrect)}
										isInvalid={(submitClicked && !emailValid)||(submitClicked && !isEmailCorrect)}
										disabled={isLoading}
									/>
									<Form.Control.Feedback
										type='invalid'
										className='fontStyleBold'>
										{!form.userId
											? REQUIRED_FIELD
											: !emailValid ? ENTER_VAILD_EMAIL:!isEmailCorrect&&"Please enter correct email ID"}
									</Form.Control.Feedback>
								</Col>
							</Row>
						</Form.Group>
						<Form.Group className='form-group-resetpassword'>
							<Row>
								<Col
									md={12}
									lg={12}
									xs={12}
									sm={12}
									className='inputField'>
									<InputGroup style={{ width: '300px' }}>
										<Form.Control
											name='newPassword'
											type={
												showPassword
													? 'text'
													: 'password'
											}
											placeholder={NEW_PASSWORD}
											onChange={handleChange}
											autoComplete='off'
											required
											isValid={
												submitClicked &&
												passwordFieldValid(
													form.newPassword
												)[0]
											}
											isInvalid={
												submitClicked &&
												!passwordFieldValid(
													form.newPassword
												)[0]
											}
											disabled={isLoading}
										/>
										<InputGroup.Prepend
											style={{
												position: 'absolute',
												marginTop: '12px',
												marginLeft: '253px',
												zIndex: '5'
											}}>
											<i
												class={
													showPassword
														? 'fa fa-eye-slash'
														: 'fa fa-eye'
												}
												aria-hidden='true'
												style={{
													cursor: 'pointer'
												}}
												onClick={handleShowOrHidePassword.bind(
													this,
													'Password'
												)}></i>
										</InputGroup.Prepend>
										<Form.Control.Feedback
											type='invalid'
											className='fontStyleBold'>
											{submitClicked &&
												!passwordFieldValid(
													form.newPassword
												)[0] &&
												passwordFieldValid(
													form.newPassword
												)[1]}
										</Form.Control.Feedback>
									</InputGroup>
								</Col>
							</Row>
						</Form.Group>
						<Form.Group className='form-group-resetpassword'>
							<Row>
								<Col
									md={12}
									lg={12}
									xs={12}
									sm={12}
									className='inputField'>
									<InputGroup style={{ width: '300px' }}>
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
												passwordFieldValid(
													form.confirmNewPassword
												)[0]
											}
											isInvalid={
												submitClicked &&
												!passwordFieldValid(
													form.confirmNewPassword
												)[0]
											}
											disabled={isLoading}
										/>
										<InputGroup.Prepend
											style={{
												position: 'absolute',
												marginTop: '12px',
												marginLeft: '253px',
												zIndex: '5'
											}}>
											<i
												class={
													showConfirmPassword
														? 'fa fa-eye-slash'
														: 'fa fa-eye'
												}
												aria-hidden='true'
												style={{
													cursor: 'pointer'
												}}
												onClick={handleShowOrHidePassword.bind(
													this,
													'confirmPassword'
												)}></i>
										</InputGroup.Prepend>
										{passwordFieldValid(
											form.confirmNewPassword
										)[0] &&
										passwordFieldValid(
											form.newPassword
										)[0] &&
										form.confirmNewPassword != '' &&
										form.confirmNewPassword !=
											form.newPassword &&
										submitClicked ? (
											<Form.Control.Feedback className='confrim-password-validation'>
												{i18n.t(
													'validationMessage.passwordNotMatch'
												)}
											</Form.Control.Feedback>
										) : (
											''
										)}
										<Form.Control.Feedback
											style={{ paddingBottom: '2%' }}
											type='invalid'
											className='fontStyleBold'>
											{submitClicked &&
												!passwordFieldValid(
													form.confirmNewPassword
												)[0] &&
												passwordFieldValid(
													form.confirmNewPassword
												)[1]}
										</Form.Control.Feedback>
									</InputGroup>
								</Col>
							</Row>
						</Form.Group>
						<FormGroup
							className='form-group-resetpassword'
							onClick={handleSubmit.bind(this)}>
							{renderLoginBtn()}
						</FormGroup>
					</Card.Body>
					{renderAlertBoxes()}
				</Form>
			</Card>
		</div>
	)
}

export default ResetPassword
