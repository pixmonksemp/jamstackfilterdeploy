import ApiConnector from "../../../common/hoc/api-connector";
import React, { Component, useEffect } from "react"
import RoleManagementComponent from "../../../components/pim-module-component/role-management-component/RoleManagementComponent";
import { resources } from "../../../common/common-api-constants";

 function RoleManagementContainer(props) {
     useEffect(()=>{
        window.scrollTo({top:0,behavior:"smooth"})
     },[])
     return (<RoleManagementComponent {...props}/>  );
 }
 
 export default ApiConnector(RoleManagementContainer,{
     methods:{
        getRoles:{
            type: resources.httpMethod.POST,
            url: "api/getAllRoles"
        },
        deleteRoles:{
            type: resources.httpMethod.POST,
            url: "api/deleteRoles"
        }
     }
 });