import React, { useState } from "react";

function PimerceAuth(props) {
    let allFeatures =JSON.parse(sessionStorage.getItem("allFeatures"))
    let authJson = JSON.parse(sessionStorage.getItem("authJson"))
    const authComponent = (prop) => {
        if (authJson[prop.componentId]) {
            let isShow = true
            let feature = allFeatures.find(i=>i.featureid==prop.componentId)
            if(feature.featuretype=="module"){
                let isView = 0 
                let pages = allFeatures.filter((i)=>(i.parentfeature == prop.componentId&&i.featuretype=="page"))
                pages.map((i)=>{
                    if(authJson[i.featureid].isHidden==true){
                        isView=isView+1
                    }
                })
                if(isView>0){
                    if(isView==pages.length){
                        isShow = false
                    }
                }
            }
            let disabled =
                authJson[prop.componentId].isEnabled ? "" :(props.componentType&&props.componentType == "button")? "disabledComponent":"";
            return isShow?!authJson[prop.componentId].isHidden ? 
            ((!authJson[props.componentId].isEnabled)&&(props.componentType&&props.componentType == "button"))?null:
            (
                <div id={prop.componentId + "auth"} className={disabled}>
                    {prop.component}
                </div>
            ) : null:null;
        }
        else{
            return(
                <div>
                    {prop.component}
                </div>
            )
        }
    }

    
//     if(props.componentId){
//     if ((!authJson[props.componentId].isEnabled)&&(props.componentType&&props.componentType == "button")) {
//         $('#' + props.componentId + "auth").on('click', false)
//     }
// }
    return (
        <>{authComponent(props)}</>
    )
}
export default PimerceAuth;