import React from "react";

const NegationRationaleIcon = ({ className = "madie-icon", ...props }) => {
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
        d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.6465 13.8516L2.14648 3.35164L2.85359 2.64453L13.3536 13.1445L12.6465 13.8516Z"
      />
    </svg>
  );
};

export default NegationRationaleIcon;
