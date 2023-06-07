import React,{ useState } from 'react'
import LogOut from "../../assets/loader-email.gif";

export default function LogOutLoading() {
    return (
        <div>
            <div style={{
                justifyContent: 'center',
                display: 'flex', color: 'black', fontWeight: 'bolder',
                borderRadius: '15px'
            }}>
                <div style={{
                    padding: '4px',
                    paddingRight: '8px',
                    fontSize: '30px',
                    color: 'white'
                }}>Logging Out</div>
                <div style={{ marginTop: 'auto' }}>
                    <img src={LogOut} alt="Logout" style={{ width: "50px", marginTop: '-20px' }} />
                </div>
            </div>
        </div>
    );
}
