import React from "react"
const Plusicon = (props) => (
  <>
    <svg
      width={props.width ? props.width : "12.25"}
      height={props.height ? props.height : "12.25"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginLeft: props.svgLeftSpace}}
    >
        <path
          d="M12 0C5.37282 0 0 5.37282 0 12C0 18.6272 5.37282 24 12 24C18.6272 24 24 18.6272 24 12C23.9918 5.37589 18.6241 0.0081817 12 0ZM17.4546 13.0907H13.0907V17.4546C13.0907 17.7439 12.9758 18.0213 12.7713 18.2259C12.5667 18.4304 12.2893 18.5454 12 18.5454C11.7107 18.5454 11.4333 18.4304 11.2287 18.2259C11.0242 18.0213 10.9093 17.7439 10.9093 17.4546V13.0907H6.54536C6.25608 13.0907 5.97865 12.9758 5.7741 12.7713C5.56955 12.5667 5.45464 12.2893 5.45464 12C5.45464 11.7107 5.56955 11.4333 5.7741 11.2287C5.97865 11.0242 6.25608 10.9093 6.54536 10.9093H10.9093V6.54536C10.9093 6.25608 11.0242 5.97865 11.2287 5.7741C11.4333 5.56955 11.7107 5.45464 12 5.45464C12.2893 5.45464 12.5667 5.56955 12.7713 5.7741C12.9758 5.97865 13.0907 6.25608 13.0907 6.54536V10.9093H17.4546C17.7439 10.9093 18.0213 11.0242 18.2259 11.2287C18.4304 11.4333 18.5454 11.7107 18.5454 12C18.5454 12.2893 18.4304 12.5667 18.2259 12.7713C18.0213 12.9758 17.7439 13.0907 17.4546 13.0907Z"
          fill="black"
        />
    </svg>
  </>
)
export default Plusicon