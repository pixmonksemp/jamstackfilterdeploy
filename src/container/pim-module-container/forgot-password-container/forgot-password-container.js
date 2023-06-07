import React, { useEffect } from 'react'
import ForgotPassword from '../../../pages/forgotpassword/forgot-password'
import ApiConnector from '../../../common/hoc/api-connector'
import { resources } from '../../../common/common-api-constants'

function ForgotPasswordCointainer(props) {
	useEffect(() => {
		window.scroll(0, 0)
	}, [])
	return (<ForgotPassword {...props} />);
}

export default ApiConnector(ForgotPasswordCointainer, {
	methods: {
		sendEmailToGetResetLink: {
			type: resources.httpMethod.POST,
			url: 'api/password/forgot'
        }
	},
})