import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
// import './autocomplete.scss';

function Autocomplete(props) {

	const [activeOption, setActiveOption] = useState(0);
	let [userInput, setUserInput] = useState('');
	const [filteredOptions, setfilteredOptions] = useState([]);
	const [showOptions, setshowOptions] = useState(false);
	const [isKeyPressed, setisKeyPressed] = useState(false);
	const [userData, setUserData] = useState('')
	const [loader, setloader] = useState(false);

	useEffect(()=>{
		setfilteredOptions(props.options)
	},[props.options])

	useEffect(() => {	
		if (props.query) {	
			setUserInput(props.query)	
		}	
		if (props.isCleared) {	
			setUserInput('')	
		}	
	}, [props.query,props.isCleared])

	const handleApply = (clickType, isCloseClicked) => {
		const { onSearch } = props
		if (clickType != null && userInput !== '') {
			setloader(false)
			let textTypeData =userInput && userInput.trim()
			if (isCloseClicked) {
				onSearch('')
				setUserInput('')
				setUserData('')
			}
			else {
				if (clickType === 'CLEAR') {
					onSearch('')
					setUserInput('')
					setUserData('')
				}
				else
					onSearch(textTypeData == undefined ? userData : textTypeData)
			}
		}
	}

	function onChangeAutoComplete(e) {
		const { options, methodName, parameters, onChangeValue } = props
		onChangeValue(e.currentTarget.value)
		setUserData(e.currentTarget.value)
		const userInputs = e.currentTarget.value
		if (userInputs === '') {
			handleApply('CLEAR')
		}
		const filterOptions = options && options.filter(
			(option) =>
				option.toLowerCase().indexOf(userInputs.toLowerCase()) > -1
		)
		setActiveOption(-1);
		setUserInput(e.currentTarget.value);
		setshowOptions(true);
		// setfilteredOptions(filteredOptions)
	}

	const onClick = (e) => {
		if (e.type === 'click') {
			setActiveOption(0);
			setshowOptions(false);
			setUserInput(e.target.innerText)
			userInput=e.target && e.target.innerText
			handleApply('CLICK')
		}
	}

	const onKeyDown = (e) => {
		setActiveOption(activeOption);
		setfilteredOptions(filteredOptions)

		if (e.keyCode === 13) {
			setUserInput(filteredOptions[activeOption]);
			setActiveOption(0);
			setshowOptions(false);
		} else if (e.keyCode === 38) {
			if (activeOption === 0) {
				return
			}
			setActiveOption(activeOption - 1)
		} else if (e.keyCode === 40) {
			if (activeOption - 1 === filteredOptions.length) {
				return
			}
			setActiveOption(activeOption + 1)
		}
	}

	const handleKeyPress = (event) => {
		if (event.key) {
			setisKeyPressed(true)
		}
		if (event.key === 'Enter') {
			handleApply('ENTER')
		}
	}

	const optionList = () => {	
		if(props.isLoader){
			return (
				<div className={props.autoComplete.noOptionClassName}>
				 	<em>{"LOADING"}</em>
				</div>
			)
		}else{
		if(filteredOptions.length <= 0 && showOptions && userInput){
			return (
				<div className={props.autoComplete.noOptionClassName}>
				 	<em>{props.autoComplete.noOption}</em>
				</div>
			)
		}
		if (showOptions && userInput) {	
			if (filteredOptions && filteredOptions.length) {	
				return (	
					<div className={props.autoComplete.optionClassName} style={{height: 'auto'}}>	
						{	
							filteredOptions && filteredOptions.map((optionName, index) => {
							let className
							if (index === activeOption) {
								className = props.autoComplete.optionActiveClassName 
							}
							return (
								<div
									className={className}
									key={optionName}
									onClick={onClick}>
									{optionName}
								</div>
							)
						})}
				</div>
			)
		} 
		
	}}
}
	return (
		<React.Fragment>
			<div className={props.autoComplete.searchBarandIconClassName}>
				<div>
				{isKeyPressed && userInput != '' ? (
					<i
						className={`${props.autoComplete.searchBarBoxClassName} fa fa-close`}
						aria-hidden='true'
						onClick={handleApply.bind(
							this,
							'CLEAR',
							true
						)}
					/>
				) : (
					<i
						className={`${props.autoComplete.searchBarBoxClassName == 'search-bar-boxing' ? 'search-bar-boxing' : props.autoComplete.searchBarBoxClassName+' search-bar-boxing'} fa fa-search`}
						aria-hidden='true'
						onClick={handleApply.bind(this, null, false)}
					/>
				)}
					<input
						placeholder={props.placeholder}
						className={props.autoComplete.searchBoxPlaceholderClassName}
						value={userInput}
						onChange={onChangeAutoComplete}
						onKeyDown={onKeyDown}
						onKeyPress={handleKeyPress}
					/>
				</div>
			</div>
			{optionList()}
		</React.Fragment>
	)
}
Autocomplete.propTypes = {
	options: PropTypes.instanceOf(Array).isRequired,
	onSearch: PropTypes.func,
	methodName: PropTypes.func,
	parameters: PropTypes.object,
	query: PropTypes.string,
	isCleared: PropTypes.bool,
	onChangeValue: PropTypes.func,
}
export default Autocomplete