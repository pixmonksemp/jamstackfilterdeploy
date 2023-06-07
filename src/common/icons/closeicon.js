import React from "react"

function closeicon(props) {
  return (
    <svg
      width={props.width ? props.width : "12.25"}
      height={props.height ? props.height : "12.25"}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginLeft: props.svgLeftSpace}}
    >
      <path
        d="M20.4868 3.51408C18.8085 1.83609 16.6703 0.693408 14.3426 0.2305C12.0149 -0.232407 9.60221 0.00524778 7.40956 0.913418C5.21691 1.82159 3.34276 3.35949 2.02407 5.3327C0.705369 7.3059 0.00133503 9.6258 0.000976562 11.9991C0.000976563 15.1819 1.26535 18.2344 3.51595 20.485C5.76655 22.7356 8.81902 24 12.0019 24C15.1847 24 18.2372 22.7356 20.4878 20.485C22.7384 18.2344 24.0027 15.1819 24.0027 11.9991C24.0068 10.4226 23.6981 8.86089 23.0946 7.40445C22.4911 5.948 21.6048 4.6257 20.4868 3.51408ZM17.1913 15.5333C17.3032 15.6414 17.3925 15.7707 17.4539 15.9137C17.5154 16.0567 17.5477 16.2105 17.549 16.3661C17.5504 16.5217 17.5207 16.676 17.4618 16.82C17.4029 16.9641 17.3159 17.0949 17.2058 17.205C17.0958 17.315 16.9649 17.402 16.8209 17.4609C16.6769 17.5199 16.5226 17.5495 16.3669 17.5482C16.2113 17.5468 16.0575 17.5145 15.9146 17.4531C15.7716 17.3916 15.6423 17.3024 15.5341 17.1904L12.0009 13.6577L8.46769 17.1909C8.24787 17.4107 7.94974 17.5342 7.63888 17.5342C7.32801 17.5342 7.02988 17.4107 6.81007 17.1909C6.59025 16.9711 6.46676 16.6729 6.46676 16.3621C6.46676 16.0512 6.59025 15.7531 6.81007 15.5333L10.3433 11.9991L6.81007 8.46586C6.5919 8.24572 6.46983 7.94811 6.47055 7.63818C6.47127 7.32825 6.59473 7.03122 6.81392 6.81209C7.03311 6.59297 7.33017 6.46958 7.64011 6.46895C7.95004 6.46832 8.24761 6.59048 8.46769 6.80871L12.0009 10.3415L15.5341 6.80871C15.6423 6.69677 15.7716 6.60749 15.9146 6.54607C16.0575 6.48465 16.2113 6.45231 16.3669 6.45096C16.5226 6.44961 16.6769 6.47926 16.8209 6.53819C16.9649 6.59712 17.0958 6.68414 17.2058 6.79418C17.3159 6.90422 17.4029 7.03507 17.4618 7.1791C17.5207 7.32313 17.5504 7.47745 17.549 7.63307C17.5477 7.78868 17.5154 7.94246 17.4539 8.08545C17.3925 8.22843 17.3032 8.35775 17.1913 8.46586L13.6581 11.9991L17.1913 15.5333Z"
        fill="black" 
     />
    </svg>
  )
}

export default closeicon
