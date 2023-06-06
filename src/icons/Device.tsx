import React from "react";

const Device = ({ className = "madie-icon", ...props }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13 5.5H3C2.17157 5.5 1.5 6.17157 1.5 7V13C1.5 13.8284 2.17157 14.5 3 14.5H13C13.8284 14.5 14.5 13.8284 14.5 13V7C14.5 6.17157 13.8284 5.5 13 5.5ZM3 4C1.34315 4 0 5.34315 0 7V13C0 14.6569 1.34315 16 3 16H13C14.6569 16 16 14.6569 16 13V7C16 5.34315 14.6569 4 13 4H3Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.5 1.5V4H10.5V1.5H5.5ZM5 0C4.44772 0 4 0.447715 4 1V4.5C4 5.05228 4.44772 5.5 5 5.5H11C11.5523 5.5 12 5.05228 12 4.5V1C12 0.447715 11.5523 0 11 0H5Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8 7C8.41421 7 8.75 7.33579 8.75 7.75L8.75 12.25C8.75 12.6642 8.41421 13 8 13C7.58579 13 7.25 12.6642 7.25 12.25L7.25 7.75C7.25 7.33579 7.58579 7 8 7Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11 10C11 10.4142 10.6642 10.75 10.25 10.75L5.75 10.75C5.33579 10.75 5 10.4142 5 10C5 9.58579 5.33579 9.25 5.75 9.25L10.25 9.25C10.6642 9.25 11 9.58579 11 10Z"
      />
    </svg>
  );
};

export default Device;
