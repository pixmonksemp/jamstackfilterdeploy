import React, { useEffect } from 'react'
import ChangePassword from '../../../pages/changepassword/change-password'
import ApiConnector from '../../../common/hoc/api-connector'
import { resources } from '../../../common/common-api-constants'

function ChangePasswordCointainer(props) {
	useEffect(() => {
		window.scroll(0, 0)
	}, [])
	return <ChangePassword {...props} />
}

export default ApiConnector(ChangePasswordCointainer, {
	methods: {
		postChangePassword: {
			type: resources.httpMethod.POST,
			url: 'api/password/change'
		}
	}
})
