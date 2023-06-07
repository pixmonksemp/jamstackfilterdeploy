import React, { Component } from "react"
import { resources } from "../../../common/common-api-constants";
import ApiConnector from "../../../common/hoc/api-connector";
import UserManagementComponent from "../../../components/pim-module-component/user-management-component/UserManagementComponent";


function UserManagementContainer(props) {
    return (<UserManagementComponent {...props} />);
}

export default ApiConnector(UserManagementContainer, {
    methods: {
        getRoles: {
            type: resources.httpMethod.POST,
            url: "api/getRoleOptions"
        },
        getUsers: {
            type: resources.httpMethod.POST,
            url: "api/getUsersByOrgId"
        },
        updateUser: {
            type: resources.httpMethod.POST,
            url :"api/update/profile"
        },
        deleteUsers:{
            type: resources.httpMethod.POST,
            url: "api/deleteUsers"
        },
        createUser:{
            type:resources.httpMethod.POST,
            url:"api/pimerce-users"
        }
    }
});