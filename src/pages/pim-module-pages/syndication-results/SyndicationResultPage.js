import React from "react";
import { connect } from "react-redux";
import SyndicationResultContainer from "../../../container/pim-module-container/syndication-results/SyndicationResultContainer";

function SyndicationResultPage(props){
    return(
        <SyndicationResultContainer {...props} />
    )
}

export default connect(null, null)(SyndicationResultPage)