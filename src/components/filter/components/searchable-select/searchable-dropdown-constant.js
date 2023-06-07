/** @format */

import React from 'react'
import { components } from 'react-select'
import {
	whiteColor,
	font_sm,
	font_md,
	barlow_regular,
	singleValue_color,
	vulcan_color,
	white_smoke_color
} from "../../styling/scss/_variables.scss";

export const optionStyles = {
	option: (styles, { isDisabled }) => ({
		...styles,
		cursor: 'pointer',
		fontSize: font_sm,
		fontFamily: barlow_regular,
		outline: 'none !important',
		border: 'none !important'
	}),
	control: (base, { isDisabled }) => ({
		...base,
		borderRadius: '4px',
		boxShadow: '-1px -2px 10px 0 rgba(0, 0, 0, 0.06)',
		border: 'solid 1px ',
		backgroundColor: whiteColor,
		width: '160px',
		height: '56px',
		cursor: isDisabled ? 'no-drop' : 'pointer'
	}),
	singleValue: base => ({
		...base,
		color: singleValue_color,
		fontSize: font_md,
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		width: '75px'
	}),
	menu: base => ({
		...base,
		// boxShadow: 'none',
		marginTop: '2px',
		width: '160px',
		borderRadius: '4px',
		boxShadow: '0 4px 6px 0 rgba(131, 134, 163, 0.12)',
		backgroundColor: whiteColor,
		position: 'relative'
	}),
	container: base => ({
		...base,
		pointerEvents: 'auto'
	}),
	menuList: base => ({
		...base,
		minHeight: '4em',
		maxHeight: '9em'
	}),
	clearIndicator: base => ({
		...base,
		position: 'absolute',
		marginTop: '3px',
		right: '-5px',
		top: '2px'
	})
}

export const multiSelectOptionStyles = {
	option: (styles, { isDisabled }) => ({
		...styles,
		cursor: 'pointer',
		fontSize: '10px',
		fontFamily: barlow_regular
	}),
	control: (base, { isDisabled }) => ({
		...base,
		borderRadius: '4px',
		boxShadow: '-1px -2px 10px 0 rgba(0, 0, 0, 0.06)',
		border: `solid 1px ${white_smoke_color}`,
		backgroundColor: whiteColor,

		width: '160px',
		height: '56px',
		cursor: isDisabled ? 'no-drop' : 'pointer'
	}),

	menuList: base => ({
		...base,
		minHeight: '4em',
		maxHeight: '9em'
	}),
	menu: base => ({
		...base,
		marginTop: '2px',
		width: '160px',
		borderRadius: '4px',
		boxShadow: '0 4px 6px 0 rgba(131, 134, 163, 0.12)',
		backgroundColor: whiteColor,
		position: 'relative'
	})
}

//This const used to show the dropdown in large size
export const multiSelectOptionEnlargeStyles = {
	option: (styles, { isDisabled }) => ({
		...styles,
		cursor: 'pointer',
		fontSize: '10px',
		fontFamily: barlow_regular
	}),
	control: (base, { isDisabled }) => ({
		...base,
		borderRadius: '4px',
		boxShadow: '-1px -2px 10px 0 rgba(0, 0, 0, 0.06)',
		border: `solid 1px ${white_smoke_color}`,
		backgroundColor: whiteColor,

		width: '350px',
		height: '56px',
		cursor: isDisabled ? 'no-drop' : 'pointer'
	}),

	menuList: base => ({
		...base,
		minHeight: '4em',
		maxHeight: '9em'
	}),
	menu: base => ({
		...base,
		marginTop: '2px',
		width: '350px',
		borderRadius: '4px',
		boxShadow: '0 4px 6px 0 rgba(131, 134, 163, 0.12)',
		backgroundColor: whiteColor,
		position: 'relative'
	})
}

export const IndicatorSeparator = ({ innerProps }) => {
	return <span className='indicatorSeparatorStyle' {...innerProps} />
}

export const CustomOption = props => {
	const { data, innerRef, innerProps } = props
	return data.custom ? (
		<div className='optionStyle'>RESULTS</div>
	) : (
		<components.Option {...props} />
	)
}

export const exportOptionStyles = {
	option: (styles, { }) => ({
		...styles,
		cursor: 'pointer',
		fontSize: font_sm,
		outline: 'none !important',
		border: 'none !important'
	}),
	control: (base, { isDisabled }) => ({
		...base,
		borderRadius: '6px',
		border: 'solid 1px #bbbbbb',
		backgroundColor: whiteColor,
		width: '259px',
		height: '40px',
		margin: '6px 90px 25px 1px',
		cursor: isDisabled ? 'no-drop' : 'pointer'
	}),
	singleValue: base => ({
		...base,
		color: vulcan_color,
		fontSize: font_sm,
		lineHeight: '1.43',
		letterSpacing: 'normal',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		width: '189px'
	}),
	menu: base => ({
		...base,
		marginTop: '2px',
		width: '259px',
		borderRadius: '4px',
		boxShadow: '0 4px 6px 0 rgba(131, 134, 163, 0.12)',
		backgroundColor: whiteColor,
		position: 'relative'
	}),
	menuList: base => ({
		...base,
		minHeight: '4em',
		maxHeight: '9em'
	})
}
