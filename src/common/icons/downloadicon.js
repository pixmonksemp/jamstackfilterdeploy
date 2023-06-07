import React from "react"

function downloadicon(props) {
  return (
    <svg
      width={props.width ? props.width : "24"}
      height={props.height ? props.height : "24"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginLeft: props.svgLeftSpace}}
    >
      <circle cx="12" cy="12" r="12" fill="black" />
      <g clip-path="url(#clip0_2798_1742)">
        <path
          d="M6.625 10.875L6.625 8.70833C6.625 8.42101 6.73914 8.14546 6.9423 7.9423C7.14546 7.73914 7.42101 7.625 7.70833 7.625L15.2917 7.625C15.579 7.625 15.8545 7.73914 16.0577 7.9423C16.2609 8.14547 16.375 8.42102 16.375 8.70833L16.375 10.875"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.79167 14.6667L11.5 17.375L14.2083 14.6667"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M11.5 17.375L11.5 10.875"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2798_1742">
          <rect
            width="13"
            height="13"
            fill="white"
            transform="translate(18 19) rotate(-180)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export default downloadicon
