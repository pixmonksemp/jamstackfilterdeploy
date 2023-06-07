import React from "react";
import Store from '../../assets/store.png'

function LoginSVG(props) {
	return (
		<svg viewBox="0 0 475 814" class='login-svg' xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink" fill="none">

			<g filter="url(#filter0_d_1389_314)">
				<path d="M91.2874 0H754C796.209 0 778 21.7909 750 24V796.291C758 830.745 747.783 800.626 748.337 810.216L319.94 742.373C305.141 736.884 298.242 730.879 284.804 713.844L147.251 476.758L28.1809 251.909C21.1062 239.738 19.4905 225.148 23.7307 211.723L84.2874 20Z" fill="#1E8CD0"></path>
			</g>
			<rect x="257" y="464" width="430" height="351.02" fill="url(#pattern0)"></rect>
			<text x="250" y="70" class="login-header" stroke="#FFF" stroke-width="2px" fill="white" dy=".3em">{props.Name}</text>
			<foreignObject x="125" y="65" width="590" height="400" class="content-section">
				<div xmlns="http://www.w3.org/1999/xhtml">
					<section className='about-section'>
						<h3 className='section-title'>About {props.Name}</h3>
						<p className='about-section-content'>{props.AboutContent}</p>
					</section>
					<section className='features-section'>
						<h3 className='section-title'>Our Features</h3>
						<ul>{
							props.FeatureContents && props.FeatureContents.map((list) => {
								return (<li>{list}</li>)
							})
						}
						</ul>
					</section>
				</div>
			</foreignObject>
			<defs>
				<filter id="filter0_d_1389_314" x="0.155285" y="0.871934" width="749.098" height="812.779" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
					<feOffset dy="2.12534" />
					<feGaussianBlur stdDeviation="10.6267" />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
					{/* blue Background */}
					<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1389_314" />
					<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1389_314" result="shape" />
				</filter>
				<filter id="filter1_d_1389_314" x="350" y="451" width="355" height="320" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
					<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1389_314" />
					<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1389_314" result="shape" />
				</filter>
				<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
					<use xlinkHref="#image0_1389_314" transform="translate(-0.00121422) scale(0.000244734 0.000297974)" />
				</pattern>
				<image id="image0_1389_314" width="4096" height="3856" xlinkHref={Store} />
			</defs>
		</svg>
	)
}

export default LoginSVG;