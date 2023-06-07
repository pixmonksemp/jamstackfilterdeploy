/** @format */

import { Modal } from 'react-bootstrap'
import React, { Component } from 'react'
import './style.scss'
import PropTypes from 'prop-types'
import { MEDIUM } from '../../common/common-constants'

class ModalComponent extends Component {
	static propTypes = {
		modalTitle: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.string,
			PropTypes.object,
			PropTypes.number
		]),
		modalContent: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.string,
			PropTypes.object,
			PropTypes.number
		]),
		modalFooter: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.string,
			PropTypes.object,
			PropTypes.number
		]),
		modalSize: PropTypes.string.isRequired,
		isShowButton: PropTypes.bool.isRequired,
		isShowModal: PropTypes.bool.isRequired,
		onHideModal: PropTypes.func.isRequired,
		isBackdrop: PropTypes.string,
		isScrollable: PropTypes.bool,
		isAutoFocus: PropTypes.bool,
		onEnterModal: PropTypes.func,
		onExitModal: PropTypes.func,
		modalDailogClassName: PropTypes.string
	}

	static defaultProps = {
		modalSize: MEDIUM,
		isShowModal: true,
		isShowButton: true,
		isAutoFocus: true,
		isScrollable: false,
		isBackdrop: 'static'
	}

	render() {
		const {
			modalTitle,
			modalContent,
			modalFooter,
			isShowModal,
			onHideModal,
			modalSize,
			onEnterModal,
			onExitModal,
			isShowButton,
			isScrollable,
			isAutoFocus,
			isBackdrop,
			modalDailogClassName
		} = this.props

		return (
			<div>
				<Modal
					show={isShowModal}
					onHide={onHideModal}
					size={modalSize}
					onEnter={onEnterModal}
					onExit={onExitModal}
					scrollable={isScrollable}
					autoFocus={isAutoFocus}
					centered
					animation
					keyboard
					backdrop={isBackdrop}
					dialogClassName={modalDailogClassName}>
					<Modal.Header closeButton={isShowButton}>
						<Modal.Title>{modalTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>{modalContent}</Modal.Body>
					<Modal.Footer>{modalFooter}</Modal.Footer>
				</Modal>
			</div>
		)
	}
}
export default ModalComponent
