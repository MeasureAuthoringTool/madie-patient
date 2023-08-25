import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "../components/editTestCase/commonStyles/ElementSection.scss";
// Tab heading to display weather or not we can see contents

interface ElementSectionProps {
  title: string;
  children?: any;
}

const ElementSection = (props: ElementSectionProps) => {
  const { title, children } = props;
  const [open, setOpen] = useState(true);
  const chevronClass = open ? "chevron-display open" : "chevron-display";
  const growingDivClass = open ? "growing-div open" : "growing-div";

  return (
    <div
      className="test-case-tab-heading"
      data-testid={`qdm-${props.title}-sub-heading`}
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
        <h4 className="header">{props.title}</h4>
        <ChevronRightIcon className={chevronClass} />
      </div>

      <div className={growingDivClass}>
        {open && (
          <div data-testid={`qdm-header-content-${title}`}>{children}</div>
        )}
      </div>
    </div>
  );
};

export default ElementSection;
