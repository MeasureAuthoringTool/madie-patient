import React from "react";

const Medication = ({ className = "madie-icon", ...props }) => {
  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.5 1.5V3H12.5V1.5H1.5ZM0.5 0C0.223858 0 0 0.223858 0 0.5V4C0 4.27614 0.223857 4.5 0.5 4.5H13.5C13.7761 4.5 14 4.27614 14 4V0.5C14 0.223858 13.7761 0 13.5 0H0.5Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.85 4.35V14.65H11.15V4.35H2.85ZM2 3C1.72386 3 1.5 3.22386 1.5 3.5V15.5C1.5 15.7761 1.72386 16 2 16H12C12.2761 16 12.5 15.7761 12.5 15.5V3.5C12.5 3.22386 12.2761 3 12 3H2Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.85 7.35V11.65H6.65V7.35H2.85ZM2 6C1.72386 6 1.5 6.22386 1.5 6.5V12.5C1.5 12.7761 1.72386 13 2 13H7.5C7.77614 13 8 12.7761 8 12.5V6.5C8 6.22386 7.77614 6 7.5 6H2Z"
      />
    </svg>
  );
};
export default Medication;
