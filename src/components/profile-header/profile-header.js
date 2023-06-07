import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import DropDownArrow from '../../assets/drop-down-arrow.svg'
import profileCloseIcon from '../../assets/profile-close.png'
import Profile from '../../pages/profile/index'
import './profile-header.scss'

var x = window.matchMedia('(max-width: 800px)')

function ProfileHeader(props) {
	const [isProfileOpen, setIsProfileOpen] = useState(false)
	const [isSubmitBtn,setIsSubmitBtn] = useState(false)

	function openNav() {
		setIsProfileOpen(true)
		setIsSubmitBtn(true)
		if (x.matches) {
			document.getElementById('mySidenav').style.width = '100%'
		} else {
			// document.getElementById('mySidenav').style.width = '209.8%'
			document.getElementById('mySidenav').style.width = '500px'
		}
	}

	function callbackForCancel(data) {
		setIsProfileOpen(data)
	}

	function closeNav() {
		setIsProfileOpen(false)
		setIsSubmitBtn(true)
		if (x.matches) {
			document.getElementById('mySidenav').style.width = '0'
		} else {
			document.getElementById('mySidenav').style.width = '0'
		}
	}
	return (
		<div>
			<div id='mySidenav' class='sidenav'>
				<Profile {...props} callbackForCancel={callbackForCancel} 
				isSaveBtn={isSubmitBtn}
				/>
			</div>
			<div id='profileHeader'>
				<div className='profileIcon'>
					<div
						className='profileMenu'
						style={{ display: 'contents', cursor: 'pointer' }}
						onClick={!isProfileOpen ? openNav : closeNav}>
						<div>
							{' '}
							<i
								class='fa fa-user-circle-o'
								id='userCircleIcon'
								aria-hidden='true'
							/>
						</div>
						<div>
							<img
								src={
									!isProfileOpen
										? DropDownArrow
										: profileCloseIcon
								}
								className='angleDownIcon'
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default withRouter(ProfileHeader)
