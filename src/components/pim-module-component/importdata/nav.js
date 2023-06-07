import React from 'react';
import i18n from '../../../translate/i18n';
import tickIcon from '../../../assets/tick.svg';
import './nav.scss';

const Nav = (props) => {
    const dots = props.stepList.map((i,index)=>{
        return <>
        {(index+1) != 1 && <span className={`line ${(index+1) <= props.currentStep ? 'lineactive' : ''}`}></span>}
        {/* {index != 1 && <span id={`num${index}1`} className={index == props.currentStep ? 'half-circle' : ''} ></span>} */}
        <span id={`num${(index+1)}2`}
            key={`step-${(index+1)}`}
            className={`dot ${(index+1) > props.currentStep ? '' : (index+1) == 1 ? 'active' : (index+1) <= props.currentStep ? 'active' : ''}`}
            // onClick={() => props.goToStep(index)}
        >
            {/* {i18n.t('importdata.step')}- */}
            {(index+1)<= props.currentStep ?<img src={tickIcon}/>:(index+1)}</span><p style={{padding:'11px 0px 1% 0px'}}>{(index+1)== props.currentStep ?<b>{i}</b>:i}</p>
    </>
    });
    // for (let index = 1; index <= props.totalSteps; index += 1) {
    //     const isActive = props.currentStep === index;
    //     // index != props.totalSteps && 
    //     dots.push((
    //         <>
    //             {index != 1 && <span className={`line ${index <= props.currentStep ? 'lineactive' : ''}`}></span>}
    //             {/* {index != 1 && <span id={`num${index}1`} className={index == props.currentStep ? 'half-circle' : ''} ></span>} */}
    //             <span id={`num${index}2`}
    //                 key={`step-${index}`}
    //                 className={`dot ${index > props.currentStep ? '' : index == 1 ? 'active' : index < props.currentStep ? 'active' : 'dotactive'}`}
    //                 // onClick={() => props.goToStep(index)}
    //             >
    //                 {/* {i18n.t('importdata.step')}- */}
    //                 {index}</span><p style={{padding:'1%'}}>hello</p>
    //         </>
    //     ));
    // }
    return (
        <div >
            {props.currentStep != props.totalSteps && <div className='nav'>{dots}</div>}
        </div>
    );
};

export default Nav;