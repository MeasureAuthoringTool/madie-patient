import React from "react";

const AttributesIcon = ({ className = "madie-icon", ...props }) => {
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
        d="M1.08036 14.8571V14.9196H1.14286H15.9375V15.9375H0.597317L0.0625 15.4027V0.0625H1.08036V14.8571ZM4.57143 12.6339H4.63393V12.5714V4.57143V4.50893H4.57143H3.42857H3.36607V4.57143V12.5714V12.6339H3.42857H4.57143ZM13.7768 2.28571V2.22321H13.7143H12.5714H12.5089V2.28571V12.5714V12.6339H12.5714H13.7143H13.7768V12.5714V2.28571ZM9.14286 12.6339H9.20536V12.5714V6.85714V6.79464H9.14286H8H7.9375V6.85714V12.5714V12.6339H8H9.14286ZM2.88303 13.6518L2.34821 13.117V4.02589L2.88303 3.49107H5.11697L5.65179 4.02589V13.117L5.11697 13.6518H2.88303ZM11.4911 13.117V1.74017L12.0259 1.20536H14.2598L14.7946 1.74017V13.117L14.2598 13.6518H12.0259L11.4911 13.117ZM6.91964 13.117V6.3116L7.45446 5.77679H9.6884L10.2232 6.3116V13.117L9.6884 13.6518H7.45446L6.91964 13.117Z"
        stroke="white"
        stroke-width="0.125"
      />
    </svg>
  );
};

export default AttributesIcon;
