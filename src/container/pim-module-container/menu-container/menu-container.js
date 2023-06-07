import React, { useEffect } from 'react'
import MenuNavigation from '../../../components/top-menu/menu-navigation'
import ApiConnector from '../../../common/hoc/api-connector'
import { resources } from '../../../common/common-api-constants'

function LoginCointainer(props) {
	useEffect(() => {
		window.scroll(0, 0)
	}, [])
	return <MenuNavigation {...props} />
}

export default ApiConnector(LoginCointainer, {
	methods: {
		postLogoutDetails: {
			type: resources.httpMethod.POST,
			url: 'api/logout'
		},
		updateProfile: {
			type: resources.httpMethod.POST,
			url: 'api/update/profile'
		}
	}
})
