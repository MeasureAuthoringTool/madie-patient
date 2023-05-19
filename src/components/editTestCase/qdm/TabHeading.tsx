import React, { useState, useEffect, useRef, useCallback } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./TabHeading.scss";
import Demographics from "./Demographics";
import { TestCase } from "@madie/madie-models";

// Tab heading to display weather or not we can see contents
const TabHeading = (props: {
  title: string;
  currentTestCase: TestCase;
  setTestCaseJson;
  canEdit: boolean;
}) => {
  const [open, setOpen] = useState(false);
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
        {open && props.title === "Demographics" && (
          <div data-testid={`qdm-header-content-${props.title}`}>
            <Demographics
              currentTestCase={props.currentTestCase}
              setTestCaseJson={props.setTestCaseJson}
              canEdit={props.canEdit}
            ></Demographics>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabHeading;
