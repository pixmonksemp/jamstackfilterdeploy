import React, { useEffect, useState } from "react";
// import { Accordion, AccordionTab } from "primereact/accordion";

function ExpandCollapse(props) { 
    return (
      <div
        className="card accordian-bg-color p-col-12 p-md-12"
      >{props.removeButton}
        <div className="p-col-12 accordion-parent">  
           {/* <Accordion className="accordion-custom" multiple="true" activeIndex={[0]}>
            <AccordionTab 
              header={
                  <span>{props.headers}</span>
              }
            >
              <div className="p-fluid grid formgrid">{props.textArea}</div>
            </AccordionTab>
          </Accordion> */}
        </div>
      </div>
    );
}

export default ExpandCollapse;

