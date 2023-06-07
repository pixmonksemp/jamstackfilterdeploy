/** @format */

import React, { useState } from 'react'
import { Collapse } from 'react-bootstrap'
import { withRouter, Link } from 'react-router-dom'
import { hasChildren } from './util'
import { renderIconList } from './menu-navigation-constant'
import classNames from 'classnames'
import './styles.scss'
import { DASHBOARD } from '../../common/common-constants'
import PimerceAuth from '../authorization-tag/PimerceAuth'
import { connect } from 'react-redux'

let isDashboard=false;

const mapStateToProps = state => {
	return {
		retainingData: state.dashboardValue.selectedFiltersforRetainingValues
	}
}

function Navigation(props) {
	const newResponseObjArr = props.fetchMenuOptions.menuOptions != null &&
	props.fetchMenuOptions.menuOptions.length ? props.fetchMenuOptions.menuOptions.map(
		responseObj => {
			renderIconList.map(objIcon => {
				if (objIcon.key === responseObj.key) {
					return (responseObj.icon = objIcon.value)
				}
			})
			return responseObj
		}
	):[]
	if(!newResponseObjArr.length){
		const data={
			key:''
		}
		props.history.push(`/`)
		props.triggerPageLayout(data)
	}
	return newResponseObjArr.map((item, key) => (
		<PimerceAuth componentId={item.componentId} 
		component={<MenuItem key={key} item={item} props={props} />}/>
		// <MenuItem key={key} item={item} props={props} />
	))
}

const MenuItem = ({ item, props }) => {
	const Component = hasChildren(item) ? MultiLevel : SingleLevel
	return (
		<>
			{/* while navigating from one page to another without side menu, in that
			scenario title won't be inserted in table
			for example -> in category module, competitor analysis screen while clicking 
			on that logo navigating to another page */}
			{item.title !== undefined && (
				<div className={item.isSecondChildPresent ? 'menuBaseClassForSecondChild' : 'menuBaseClass'}>
					<Component item={item} props={props} />
				</div>
			)}
		</>
	)
}

const SingleLevel = ({ item, props }) => {
	const selected = item => {
		props.setToggle(true)
		props.retainingData.applyStatus = false
		props.isComponentLoaded && props.history.push(item.navigate)
		props.isComponentLoaded && props.triggerPageLayout(item)
	}
	// let filterData = props.getFilterDataValue

	const activeBoldStyle =
		item.key == props.pageName ? 'ActiveTab' : 'InactiveTab'
	const iconStyle = item.icon ? 'withIcon' : item.child && item.child === 'second' ? 'withoutIconForSecondChild' :'withoutIcon'
	const menuTabIconActiveStyle = activeBoldStyle == 'InactiveTab'? 'sidemenuTabMenuIcon': 'sidemenuTabMenuIconActive'
			const singleLevel_style_class = ((activeBoldStyle == 'ActiveTab' ? (iconStyle !== 'withIcon' ? 'single-inactive-style' : 'single-active')
		: 'single-inactive-style'))
	return (
		<div className={singleLevel_style_class}>
		<div
			button
			onClick={() => selected(item)}
			title={item.title}
			className={iconStyle === 'withIcon' ? 'single' : 'singleLevel'}>
			{item.icon && (
				<img src={item.icon} className={menuTabIconActiveStyle} />
			)}
			<Link
				className={classNames(
					iconStyle,
					activeBoldStyle,
					'linkNavContent'
				)}
				to={
				item.navigate}>
				{item.title}
			</Link>
		</div></div>
	)
}

const MultiLevel = ({ item, props }) => {
	// let filterData = props.getFilterDataValue
	const { items: children } = item
	const [open, setOpen] = useState(false)
	const [expandClick, setClick]=useState(false)
	const [prevPage, setPage]=useState(props.pageName)

	if(props.pageName==DASHBOARD){
		isDashboard=false
	}
	let keys=[]
	keys=item&&item.items && item.items!==null && item.items.map((i)=>{
		return i.key
	})
	for (let i = 0; i < item.items.length; i++) {
		if (!open && keys.includes(props.pageName) && !isDashboard) {
			setOpen(true)
			isDashboard = true;
		}
		if(open && keys.includes(props.pageName) && expandClick){
			setPage(props.pageName)
			setClick(false)
		}
		else if(open && !keys.includes(props.pageName) && expandClick){
			setPage(props.pageName)
			setClick(false)
		}
		else if(open && keys.includes(props.pageName)&& prevPage!=props.pageName){
			setPage(props.pageName)
		}
		else if(open && !expandClick && !keys.includes(props.pageName) && prevPage!=props.pageName){
			setClick(true)
			setOpen(false)
			setPage(props.pageName)
		}
		
	}
	const handleClick = () => {
		props.setToggle(false)
		setClick(true)
		setOpen(prev => !prev)
	}

	let pageName 
	item.items.map((i)=>{
		if (i.isSecondChildPresent) {
			i.items.map((secondItem) => {
				secondItem.key == props.pageName ? pageName = secondItem.key : null	
			})
		} else {
			i.key == props.pageName ? pageName = i.key : null	
		}		
	})

	const activeBoldStyle =
		props.pageName == pageName ? 'ActiveTab' : 'InactiveTab'

	const styleClass = open ? 'Active' : 'In-Active'
	const iconStyle = item.icon ? 'withIcon' : 'withoutIcon'
	const menuTabIconActiveStyle =
		activeBoldStyle == 'InactiveTab'
			? 'sidemenuTabMenuIcon'
			: 'sidemenuTabMenuIconActive'
			const multiLevel_Style_class = item.isSecondChildPresent ? 'second-level-style' : (styleClass == 'Active' ? 'multiLevel_style_active' : 'multiLevel_style')
	return (
		<>
		<div className={multiLevel_Style_class}>
			<div button onClick={handleClick} className='multiLevel' title={item.title}>
				{item.icon && (
					<img src={item.icon} className={menuTabIconActiveStyle} />
				)}
				{
				//!props.isToggle?
				<span
					className={classNames(
						styleClass,
						iconStyle,
						activeBoldStyle
					)}>
					{item.title}
				</span>
				//:null
				}
				{!props.isToggle?<span className='plus-icons' style={{ fontSize: '0.5rem' }}>
					{open ? (
						<i className='fa fa-minus fa-lg' aria-hidden='true'></i>
					) : (
						<i
						className='fa fa-plus fa-lg'
							style={{ fontWeight: 'normal' }}
							aria-hidden='true'></i>
					)}
				</span>:null}
			</div>
			</div>
				{!props.isToggle&&
				<Collapse in={open} timeout='auto' unmountOnExit appear={true}>
					<div>
						{children.map((child, key) => (
							<PimerceAuth componentId={child.componentId} 
							component={
							<MenuItem key={key} item={child} props={props} />}/>
						))}
					</div>
				</Collapse>
				 }
		</>
	)
}

export default connect(mapStateToProps, null)(withRouter(Navigation))
