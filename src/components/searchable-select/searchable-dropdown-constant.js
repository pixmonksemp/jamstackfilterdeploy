/** @format */

import React from "react";
import { components } from "react-select";
import {
  SELECT_COLOR,
  FOCUS_COLOR,
  DROPDOWN_FONTSIZE,
  DROPDOWN_BORDERADIUS,
  BACKGROUND_COLOR,
  BORDER_STYLE,
  VALUE_COLOR_ATTRIBUTE,
  TEXTBOX_BOX_SHADOW
} from "../../common/common-constants";

export const optionStyles = {
  option: (styles, { isDisabled, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isDisabled
      ? undefined
      : isSelected ? SELECT_COLOR : isFocused ? FOCUS_COLOR : undefined,
    cursor: "pointer",
    fontSize: DROPDOWN_FONTSIZE,
    fontFamily: "Chivo-Regular",
    outline: "none !important",
    border: "none !important"
  }),
  control: (base, { isDisabled }) => ({
    ...base,
    borderRadius: DROPDOWN_BORDERADIUS,
    boxShadow: TEXTBOX_BOX_SHADOW,
    border: BORDER_STYLE,
    backgroundColor: BACKGROUND_COLOR,
    width: "100%",
    height: "40px",
    cursor: isDisabled ? "no-drop" : "pointer",
	alignItem: "center",
	position: "relative",
	borderStyle: "solid",
	display:"flex",
	justifyContent: "space-between",
	boxSizing:"border-box"
  }),
  singleValue: base => ({
    ...base,
    color: VALUE_COLOR_ATTRIBUTE,
    fontSize: DROPDOWN_FONTSIZE,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "75px"
  }),
  menu: base => ({
    ...base,
    // boxShadow: 'none',
    marginTop: "2px",
    width: "100%",
    borderRadius: "4px",
    boxShadow: "0 4px 6px 0 rgba(131, 134, 163, 0.12)",
    backgroundColor: BACKGROUND_COLOR,
    position: "absolute"
  }),
  container: base => ({
    ...base,
    pointerEvents: "auto"
  }),
  menuList: base => ({
    ...base,
    minHeight: "2em",
    maxHeight: "9em"
  }),
  clearIndicator: base => ({
    ...base,
    position: "absolute",
    marginTop: "3px",
    right: "-5px",
    top: "2px"
  })
};

export const optionStylesForTag = {
  option: (styles, { isDisabled, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isDisabled
      ? undefined
      : isSelected ? SELECT_COLOR : isFocused ? FOCUS_COLOR : undefined,
    cursor: "pointer",
    fontSize: DROPDOWN_FONTSIZE,
    fontFamily: "Chivo-Regular",
    outline: "none !important",
    border: "none !important"
  }),
  control: (base, { isDisabled }) => ({
    ...base,
    borderRadius: DROPDOWN_BORDERADIUS,
    boxShadow: TEXTBOX_BOX_SHADOW,
    border: BORDER_STYLE,
    backgroundColor: BACKGROUND_COLOR,
    width: "100%",
    height: "auto",
    cursor: isDisabled ? "no-drop" : "pointer",
	alignItem: "center",
	position: "relative",
	borderStyle: "solid",
	display:"flex",
	justifyContent: "space-between",
	boxSizing:"border-box"
  }),
  singleValue: base => ({
    ...base,
    color: VALUE_COLOR_ATTRIBUTE,
    fontSize: DROPDOWN_FONTSIZE,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "75px"
  }),
  menu: base => ({
    ...base,
    // boxShadow: 'none',
    marginTop: "2px",
    width: "100%",
    borderRadius: "4px",
    boxShadow: "0 4px 6px 0 rgba(131, 134, 163, 0.12)",
    backgroundColor: BACKGROUND_COLOR,
    position: "absolute"
  }),
  container: base => ({
    ...base,
    pointerEvents: "auto"
  }),
  menuList: base => ({
    ...base,
    minHeight: "2em",
    maxHeight: "9em"
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#0E90E1",
    color: "#FFFFFF",
    padding: "1px 3px",
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: 'white',
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: 'white',
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    }
  }),
  clearIndicator: base => ({
    ...base,
    position: "absolute",
    marginTop: "3px",
    right: "-5px",
    top: "2px"
  })
};

export const multiSelectOptionStyles = {
	option: (styles, { isDisabled }) => ({
		...styles,
		cursor: 'pointer',
		fontSize: '10px',
		fontFamily: 'Barlow-Regular'
	}),
	control: (base, { isDisabled }) => ({
		...base,
		borderRadius: '4px',
		boxShadow: '-1px -2px 10px 0 rgba(0, 0, 0, 0.06)',
		border: 'solid 1px #f0f0f0',
		backgroundColor: '#ffffff',

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
		backgroundColor: '#ffffff',
		position: 'relative'
	})
}

//This const used to show the dropdown in large size
export const multiSelectOptionEnlargeStyles = {
	option: (styles, { isDisabled }) => ({
		...styles,
		cursor: 'pointer',
		fontSize: '10px',
		fontFamily: 'Barlow-Regular'
	}),
	control: (base, { isDisabled }) => ({
		...base,
		borderRadius: '4px',
		boxShadow: '-1px -2px 10px 0 rgba(0, 0, 0, 0.06)',
		border: 'solid 1px #f0f0f0',
		backgroundColor: '#ffffff',

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
		backgroundColor: '#ffffff',
		position: 'relative',
	})
}

// Superadmin Inline edit Dropdown css
export const optionStylesForInlineUpdate = {
    option: (styles, { isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? undefined
        : isFocused
        ? undefined
        : undefined,
      cursor: "pointer",
      fontSize: DROPDOWN_FONTSIZE,
      fontFamily: "Chivo-Regular",
      outline: "none !important",
      border: "none !important",
      overflowWrap : "anywhere"
      // height: "32px"
    }),
    control: (base, { isDisabled }) => ({
      ...base,
      boxShadow: "none !important",
      borderRadius: "6px !important",
      borderStyle: "0px solid !important",
      backgroundColor: BACKGROUND_COLOR,
      // width: "250px",
      maxHeight: isDisabled ? "32px !important" : "32px !important",
      minHeight: "none !important",
      cursor: isDisabled ? "no-drop" : "pointer",
      alignItem: "center",
      position: "relative",
      display: "flex",
      justifyContent: "space-between",
    }),
    singleValue: (base) => ({
      ...base,
      color:"#000000",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: "12px",
      fontSize: DROPDOWN_FONTSIZE,
      textOverflow: "none !important",
      whiteSpace: "nowrap",
      width: "215px",
      overflow: "initial",
      // height:"32px",
    }),
    menu: (base) => ({
      ...base,
      marginTop: "0px",
      // width: "251px",
      marginBottom: "-14px",
      borderRadius: "6px !important",
      boxShadow: "0 4px 6px 0 rgba(131, 134, 163, 0.12)",
      backgroundColor: BACKGROUND_COLOR,
      position: "absolute !important",
    }),
    container: (base) => ({
      ...base,
      pointerEvents: "auto",
    }),
    menuList: (base) => ({
      ...base,
      // minHeight: "4em",
      maxHeight: "4.5em",
      // marginBottom: "15px",
      padding: "0px important",
      paddingTop: "0px important",

      // "::-webkit-scrollbar": {
      //   width: "4px",
      //   height: "33px !important",
      // },
      // "::-webkit-scrollbar-track": {
      //   background: "#000000 !important",
      // },
      // "::-webkit-scrollbar-thumb": {
      //   background: "#D9D9D9",
      // },
      // "::-webkit-scrollbar-thumb:hover": {
      //   background: "#D9D9D9",
      // },
      // "::-webkit-scrollbar-track-piece" : {
      //   height: "10px",
      //   background: "#FFFFFF",
      // },
    }),
    clearIndicator: (base) => ({
      ...base,
      position: "relative",
      marginTop: "3px",
      right: "-5px",
      top: "2px",
    }),
    placeholder: base => {
      return {
          ...base,
          color:"#000000",
          fontStyle: "normal",
          fontWeight: "400",
          fontSize: "12px",
          fontSize: DROPDOWN_FONTSIZE,
          // textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "215px",
      }
  },
  }

  // SuperAdmin create dropdown css
  export const optionStylesForCreate = {
    option: (styles, { isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? SELECT_COLOR
        : isFocused
        ? FOCUS_COLOR
        : undefined,
      cursor: "pointer",
      fontSize: DROPDOWN_FONTSIZE,
      fontFamily: "Chivo-Regular",
      outline: "none !important",
      border: "none !important",
    }),
    control: (base, { isDisabled }) => ({
      ...base,
      borderRadius: DROPDOWN_BORDERADIUS,
      boxShadow: TEXTBOX_BOX_SHADOW,
      border: BORDER_STYLE,
      // borderWidth:"0px",
      backgroundColor: BACKGROUND_COLOR,
      width: "-moz-available",
      width: "-webkit-fill-available",
      height: "40px",
      cursor: isDisabled ? "no-drop" : "pointer",
      alignItem: "center",
      position: "relative",
      borderStyle: "solid",
      display: "flex",
      justifyContent: "space-between",
      boxSizing: "border-box",
    }),
    singleValue: (base) => ({
      ...base,
      color: VALUE_COLOR_ATTRIBUTE,
      fontSize: DROPDOWN_FONTSIZE,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "75px",
    }),
    menu: (base) => ({
      ...base,
      marginTop: "2px",
      width: "-moz-available",
      width: "-webkit-fill-available",
      borderRadius: "4px",
      boxShadow: "0 4px 6px 0 rgba(131, 134, 163, 0.12)",
      backgroundColor: BACKGROUND_COLOR,
      position: "absolute",
    }),
    container: (base) => ({
      ...base,
      pointerEvents: "auto",
    }),
    menuList: (base) => ({
      ...base,
      minHeight: "4em",
      maxHeight: "9em",
    }),
    clearIndicator: (base) => ({
      ...base,
      position: "absolute",
      marginTop: "3px",
      right: "-5px",
      top: "2px",
    }),
  }

  export const optionStylesForAssignAttributes = {
    option: (styles, { isDisabled, isFocused, isSelected }) => ({
      ...styles,
      // backgroundColor: "#0E90E1",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "400",
      outline: "none !important",
      border: "none !important",
    }),
    control: (base, { isDisabled }) => ({
      ...base,
      borderRadius: "5px",
      boxShadow: TEXTBOX_BOX_SHADOW,
      border: "1px solid #C3D5E4",
      backgroundColor: BACKGROUND_COLOR,
      width: "100%",
      height: "34px",
      alignItem: "center",
      position: "relative",
      borderStyle: "solid",
      display:"flex",
      justifyContent: "space-between",
      boxSizing:"border-box"
    }),
    singleValue: base => ({
      ...base,
      color: VALUE_COLOR_ATTRIBUTE,
      fontSize: DROPDOWN_FONTSIZE,
      fontWeight: "400",
      textOverFlow: "none",
      whiteSpace: "nowrap",
      width: "60px",
      overflow: "initial !important",
    }),
    menu: base => ({
      ...base,
      marginTop: "2px",
      width: "100%",
      borderRadius: "6px",
      boxShadow: "0 4px 6px 0 rgba(131, 134, 163, 0.12)",
      backgroundColor: BACKGROUND_COLOR,
      position: "absolute"
    }),
    container: base => ({
      ...base,
      pointerEvents: "auto",
    }),
    menuList: base => ({
      ...base,
      minHeight: "2em",
      maxHeight: "12em",
      textAlign: "left"
    }),
    clearIndicator: base => ({
      ...base,
      position: "absolute",
      marginTop: "3px",
      right: "-5px",
      top: "2px"
    }),
    valueContainer: base => ({
      ...base,
      paddingLeft: 24
    }),
    placeholder: base => {
      return {
          ...base,
          color: "#818087",
          fontSize: "12px"
      }
  }
  };

  export const optionStylesForAssetDetails = {
    control: (base, { isDisabled }) => ({
      ...base,
      borderRadius: "5px",
      boxShadow: TEXTBOX_BOX_SHADOW,
      border: "1px solid #C3D5E4",
      backgroundColor: BACKGROUND_COLOR,
      width: "100%",
      height: "34px",
      alignItem: "center",
      position: "relative",
      borderStyle: "solid",
      display:"flex",
      justifyContent: "space-between",
      boxSizing:"border-box"
    }),
    singleValue: base => ({
      ...base,
      color: VALUE_COLOR_ATTRIBUTE,
      fontSize: DROPDOWN_FONTSIZE,
      textOverflow: "none",
      whiteSpace: "nowrap",
      width: "230px",
    }),
    menu: base => ({
      ...base,
      marginTop: "2px",
      width: "100%",
      borderRadius: "6px",
      boxShadow: "0 4px 6px 0 rgba(131, 134, 163, 0.12)",
      backgroundColor: BACKGROUND_COLOR,
      position: "absolute"
    }),
    container: base => ({
      ...base,
      pointerEvents: "auto",
    }),
    menuList: base => ({
      ...base,
      minHeight: "2em",
      maxHeight: "20em"
    }),
    clearIndicator: base => ({
      ...base,
      position: "absolute",
      marginTop: "3px",
      right: "-5px",
      top: "2px"
    }),
    valueContainer: base => ({
      ...base,
      paddingLeft: 24
    }),
    placeholder: base => {
      return {
          ...base,
          color: "#818087",
          fontSize: "12px"
      }
  }
  };

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

export const ValueContainer = ({ children, ...props }) => {
  return (
    components.ValueContainer && (
      <components.ValueContainer {...props}>
        {!!children && (
          <i
            className="fa fa-search"
            aria-hidden="true"
            style={{ position: "absolute", left: 6 }}
          />
        )}
        {children}
      </components.ValueContainer>
    )
  );
};
