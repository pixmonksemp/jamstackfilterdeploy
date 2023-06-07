import React from "react"

function deleteicon(props) {
  return (
    <svg
      width={props.width ? props.width : "12.25"}
      height={props.height ? props.height : "12.25"}
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginLeft: props.svgLeftSpace}}
    >
      <path
        d="M17.25 4H14.25V2.125C14.25 1.29766 13.5773 0.625 12.75 0.625H5.25C4.42266 0.625 3.75 1.29766 3.75 2.125V4H0.75C0.335156 4 0 4.33516 0 4.75V5.5C0 5.60313 0.084375 5.6875 0.1875 5.6875H1.60312L2.18203 17.9453C2.21953 18.7445 2.88047 19.375 3.67969 19.375H14.3203C15.1219 19.375 15.7805 18.7469 15.818 17.9453L16.3969 5.6875H17.8125C17.9156 5.6875 18 5.60313 18 5.5V4.75C18 4.33516 17.6648 4 17.25 4ZM12.5625 4H5.4375V2.3125H12.5625V4Z"
        fill="#545454"
      />
    </svg>
  )
}

export default deleteicon
