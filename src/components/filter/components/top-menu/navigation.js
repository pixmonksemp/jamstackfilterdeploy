/** @format */

import React, { useState } from 'react'
import { Collapse } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { hasChildren } from './util'
import { renderIconList } from './menu-navigation-constant'
import classNames from 'classnames'
import './styles.scss'
import { DASHBOARD } from '../../common/common-constants'

let isDashboard = false;
const mapStateToProps = state => {
	return {
		retainingData: state.dashboardValue.selectedFiltersforRetainingValues,
		getFilterDataValue: state.stateData.getFilterdata
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
		) : []
	if (!newResponseObjArr.length) {
		const data = {
			key: ''
		}
		props.history.push(`/`)
		props.triggerPageLayout(data)
	}
	return newResponseObjArr.map((item, key) => (
		<MenuItem key={key} item={item} props={props} />
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
				<div className='menuBaseClass'>
					<Component item={item} props={props} />
				</div>
			)}
		</>
	)
}

const SingleLevel = ({ item, props }) => {
	const selected = item => {
		props.retainingData.applyStatus = false
		props.isComponentLoaded && props.triggerPageLayout(item)
	}
	let filterData = props.getFilterDataValue

	const activeBoldStyle =
		item.key == props.pageName ? 'ActiveTab' : 'InactiveTab'
	const iconStyle = item.icon ? 'withIcon' : 'withoutIcon'
	const menuTabIconActiveStyle =
		activeBoldStyle == 'InactiveTab'
			? 'sidemenuTabMenuIcon'
			: 'sidemenuTabMenuIconActive'

	const singleLevel_style_class = ((activeBoldStyle == 'ActiveTab' ? (iconStyle === 'withoutIcon' ? 'single-inactive-style' : 'single-active')
		: 'single-inactive-style'))
	return (
		<div className={singleLevel_style_class}>
			<div
				button
				onClick={() => selected(item)}
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
					to={filterData !== undefined && item.navigate}>
					{item.title}
				</Link>
			</div>
		</div>
	)
}

const MultiLevel = ({ item, props }) => {
	let filterData = props.getFilterDataValue
	const { items: children } = item
	const [open, setOpen] = useState(false)
	const [expandClick, setClick] = useState(false)
	const [prevPage, setPage] = useState(props.pageName)

	if (props.pageName == DASHBOARD) {
		isDashboard = false
	}
	let keys = []
	keys = item && item.items && item.items !== null && item.items.map((i) => {
		return i.key
	})
	for (let i = 0; i < item.items.length; i++) {
		if (!open && keys.includes(props.pageName) && !isDashboard) {
			setOpen(true)
			isDashboard = true;
		}
		if (open && keys.includes(props.pageName) && expandClick) {
			setPage(props.pageName)
			setClick(false)
		}
		else if (open && !keys.includes(props.pageName) && expandClick) {
			setPage(props.pageName)
			setClick(false)
		}
		else if (open && keys.includes(props.pageName) && prevPage != props.pageName) {
			setPage(props.pageName)
		}
		else if (open && !expandClick && !keys.includes(props.pageName) && prevPage != props.pageName) {
			setClick(true)
			setOpen(false)
			setPage(props.pageName)
		}

	}
	const handleClick = () => {
		setClick(true)
		setOpen(prev => !prev)
	}

	let pageName 
	item.items.map((i)=>{
		i.key == props.pageName ? pageName = item.key : null			
	})
	
	const activeBoldStyle =
		item.key == pageName && pageName ? 'ActiveTab' : 'InactiveTab'
	const styleClass = open ? 'Active' : 'In-Active'
	const iconStyle = item.icon ? 'withIcon' : 'withoutIcon'
	const menuTabIconActiveStyle =
		activeBoldStyle == 'InactiveTab'
			? 'sidemenuTabMenuIcon'
			: 'sidemenuTabMenuIconActive'

	const multiLevel_Style_class = (styleClass == 'Active' ? 'multiLevel_style_active' : 'multiLevel_style')
	return (
		<>
			<div className={multiLevel_Style_class}>
				<div button onClick={handleClick} className='multiLevel'>
					{item.icon && (
						<img src={item.icon} className={menuTabIconActiveStyle} />
					)}
					<span
						className={classNames(
							styleClass,
							iconStyle,
							activeBoldStyle
						)}>
						{item.title}
					</span>
					<span className='navigation-fa-minus'>
						{open ? (
							<i class='fa fa-minus fa-lg' aria-hidden='true'></i>
						) : (
							<i
								class='fa fa-plus fa-lg'
								id='navigation-fa-plus'
								aria-hidden='true'></i>
						)}
					</span>
				</div>
			</div>
			{filterData !== undefined && (
				<Collapse in={open} timeout='auto' unmountOnExit appear={true}>
					<div>
						{children.map((child, key) => (
							<MenuItem key={key} item={child} props={props} />
						))}
					</div>
				</Collapse>
			)}
		</>
	)
}

export default connect(mapStateToProps, null)(withRouter(Navigation))
