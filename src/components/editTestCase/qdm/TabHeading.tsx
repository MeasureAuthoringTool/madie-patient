import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./TabHeading.scss";
// Tab heading to display weather or not we can see contents
const TabHeading = ({ title }) => {
  const [open, setOpen] = useState(false);
  const chevronClass = open ? "chevron-display open" : "chevron-display";
  const growingDivClass = open ? "growing-div open" : "growing-div";

  return (
    <div
      className="test-case-tab-heading"
      data-testid={`qdm-${title}-sub-heading`}
    >
      <div
        onClick={() => {
          setOpen(!open);
        }}
        tabIndex={0}
        role="button"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            setOpen(!open);
          }
        }}
        className="heading-row"
      >
        <h4 className="header">{title}</h4>
        <ChevronRightIcon className={chevronClass} />
      </div>

      <div className={growingDivClass}>
        {open && <div data-testid={`qdm-header-content-${title}`} />}
      </div>
    </div>
  );
};

export default TabHeading;
