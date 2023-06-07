import React, { Component } from 'react'
import LogOut from "../../assets/loader-email.gif";
import '../login/style.scss'

export default class LogoutLoading extends Component {
    render() {
        return (
            <div>
                <div className='logout-loading-style1'>
                    <div className='logout-loading-style2'>Logging Out</div>
                    <div style={{ marginTop: 'auto' }}>
                        <img src={LogOut} alt="Logout" style={{ width: "50px", marginTop: '-20px' }} />
                    </div>
                </div >
            </div >
        )
    }
}