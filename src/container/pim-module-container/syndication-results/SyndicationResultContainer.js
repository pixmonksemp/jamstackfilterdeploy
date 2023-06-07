import React, { useEffect } from "react";
import ApiConnector from "../../../common/hoc/api-connector";
import SyndicationResults from "../../../components/pim-module-component/syndication-results/SyndicationResults";

function SyndicationResultContainer(props){
    useEffect(()=>{
        window.scroll(0, 0)
    },[])
    return(
        <SyndicationResults {...props} />
    )
}

export default SyndicationResultContainer