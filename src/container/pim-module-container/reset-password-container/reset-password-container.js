import React, { useEffect } from 'react'
import ResetPassword from '../../../pages/resetpassword/reset-password'
import ApiConnector from '../../../common/hoc/api-connector'
import { resources } from '../../../common/common-api-constants'

function ResetPasswordCointainer(props) {
	useEffect(() => {
		window.scroll(0, 0)
	}, [])
	return (<ResetPassword {...props} />);
}

export default ApiConnector(ResetPasswordCointainer, {
	methods: {
		postResetPassword: {
			type: resources.httpMethod.POST,
			url: 'api/password/reset'
        }
	}
})