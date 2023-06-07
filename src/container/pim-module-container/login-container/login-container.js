import React, { useEffect } from 'react'
import Login from '../../../pages/login/login-index'
import ApiConnector from '../../../common/hoc/api-connector'
import { resources } from '../../../common/common-api-constants'
import { PIM_API } from '../../../common/common-constants'

function LoginCointainer(props) {
	useEffect(() => {
		window.scroll(0, 0)
	}, [])
	return (<Login {...props} />);
}

export default ApiConnector(LoginCointainer, {
	methods: {
		postLoginDetails: {
			type: resources.httpMethod.POST,
			url: 'api/login'
        },
        getProfile: {
			type: resources.httpMethod.GET,
			url: 'api/profile'
		},
		getFeatures: {
			type: resources.httpMethod.GET,
			url: 'api/getFeatureAccessByRoleId'
		},
		getAllFeatures: {
            type: resources.httpMethod.GET,
            url: 'api/features'
        },
		getOrganizationDetails: {
			type: resources.httpMethod.GET,
			url: PIM_API + "/organizations",
		  }
	},
})