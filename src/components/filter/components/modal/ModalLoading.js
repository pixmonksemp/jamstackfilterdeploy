// import LogOut from "../../../assets/loader-email.gif"
import React, { Component } from 'react'
import LogOut from "../../assets/loader-email.gif"
import { Modal } from 'react-bootstrap'
import '../modal/style.scss'

export default function ModalLoading(props) {
	return (
		<Modal
			className='logoutModal'
			show={props.show}
			size='md'
			aria-labelledby='contained-modal-title-vcenter'
			centered
			backdrop={true}>

			<div>
				<div className='modalLoading-forLogout1'>
					{/* <div style={{
										padding: '4px',
										paddingRight: '8px',
										fontSize: '30px',
										color: 'white'
									}}></div> */}
					<div style={{ marginTop: 'auto' }}>
						<img src={LogOut} alt="Logout" className='modalLoading-forLogout2' />
					</div>
				</div >
			</div >
		</Modal>

	)
};
