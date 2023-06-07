import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import RetailersCategoryMapperContainer from "../../../container/pim-module-container/retailers-category-mapper-container/retailers-category-mapper-container";

function RetailersCategoryMapperPage(props) {
    return (
        <RetailersCategoryMapperContainer {...props} />
    )

}

export default connect(null, null)(RetailersCategoryMapperPage)