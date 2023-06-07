import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import propTypes from 'prop-types'
import './style.scss'

/**
 * This Component shows the User infos instead of tosters
 */

class ToastModal extends Component {
    static propTypes = {
        show: propTypes.bool,
        onModalHide: propTypes.bool,
        size: propTypes.string,
        title: propTypes.string,
        content: propTypes.string,
        titleBackgroundColor: propTypes.string,
        toastModalBodyStyle: propTypes.string,
        toastModalTitleStyle: propTypes.string,
        toastModalHeaderStyle: propTypes.string
    }
    static defaultProps = {
        toastModalBodyStyle: 'toastModalBodyClass',
        toastModalTitleStyle: 'toastModalTitleClass',
        toastModalHeaderStyle: 'toastModalHeaderClass'
    }
    render() {
        const { show, onModalHide, size, titleBackgroundColor, title, content, toastModalBodyStyle, toastModalTitleStyle, toastModalHeaderStyle } = this.props
        return (
            <Modal
                show={show}
                size={size}
                onHide={onModalHide}
                backdrop='static'
                centered
            >
                <Modal.Header closeButton style={{ backgroundColor: titleBackgroundColor }} className={toastModalHeaderStyle}>
                    <Modal.Title className={toastModalTitleStyle}>
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={toastModalBodyStyle}>
                    {content}
                </Modal.Body>
            </Modal>
        )
    }
}

export default (ToastModal)