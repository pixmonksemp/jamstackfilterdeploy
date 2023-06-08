import React, {useState} from 'react';
// import { Button } from "primereact/button"
// import { Tooltip } from 'primereact/tooltip';
const ScrollButton = () =>{

const [visible, setVisible] = useState(false)

const toggleVisible = () => {
	const scrolled = document.documentElement.scrollTop;
	if (scrolled > 200){
	setVisible(true)
	}
	else if (scrolled <= 200){
	setVisible(false)
	}
};

const scrollToTop = () =>{
	window.scrollTo({
	top: 0,
	behavior: 'smooth'
	/* you can also use 'auto' behaviour
		in place of 'smooth' */
	});
};

window.addEventListener('scroll', toggleVisible);

return (
	"hi"
// 	<Button
//     className="p-button-text scroll-top-btn"
//     onClick={() => scrollToTop()}
//     style={{display: visible ? 'inline' : 'none'}}
// 	tooltip="Go to top" 
// 	placeholder="Left"  tooltipOptions={{position: 'left'}}
//     >
//      <i className="pi pi-arrow-up"></i>
//   </Button>
);
}

export default ScrollButton;
