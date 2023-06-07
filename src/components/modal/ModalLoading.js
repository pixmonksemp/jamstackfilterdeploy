// import LogOut from "../../../assets/loader-email.gif"
import React, { Component } from 'react'
import LogOut from "../../assets/loader-email.gif"
import { Modal } from 'react-bootstrap'
export default function ModalLoading(props){
	return(
		<Modal
							className='logoutModal'
							show={props.show}
							size='md'
							aria-labelledby='contained-modal-title-vcenter'
							centered
							backdrop={true}>

							<div>
								<div style={{
									justifyContent: 'center',
									display: 'flex', color: 'black', fontWeight: 'bolder',
									borderRadius: '15px'
								}}>
									{/* <div style={{
										padding: '4px',
										paddingRight: '8px',
										fontSize: '30px',
										color: 'white'
									}}></div> */}
									<div style={{ marginTop: 'auto' }}>
										<img src={LogOut} alt="Logout" style={{ width: "50px", marginTop: '-20px' }} />
									</div>
								</div >
							</div >
						</Modal>
						
	)
};
