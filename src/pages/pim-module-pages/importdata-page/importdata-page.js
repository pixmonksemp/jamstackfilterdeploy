import React, { Component } from "react"
import ImportdataContainer from "../../../container/pim-module-container/importdata-container/importdata-container"
import { connect } from "react-redux"


function ImportdataPage(props){
        return <ImportdataContainer {...props}/>
}

export default connect(null,null)(ImportdataPage);


