import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "twin.macro";
import "styled-components/macro";

const GroupCoverageResultsSection = ({ results }) => {
  const [showGroupCoverageResults, setShowGroupCoverageResults] =
    useState<boolean>(true);
  debugger
  const handleResultsCollapse = (e) => {
    e.preventDefault();
    setShowGroupCoverageResults(!showGroupCoverageResults);
  };
  return (
    <div tw="flex-auto p-3">
      <button
        onClick={(e) => {
          handleResultsCollapse(e);
        }}
        style={{
          width: "fit",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            fontFamily: "Rubik",
            fontSize: "14px",
            fontWeight: "500",
            color: "#0073C8",
          }}
        >
          Results
          {showGroupCoverageResults ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </div>
      </button>

      <div>
        {showGroupCoverageResults && (
          <div
            style={{
              padding: "0px 10px",
              marginTop: "20px",
              width: "auto",
              border: "1px solid #EDEDED",
              backgroundColor: "#EDEDED",
              fontFamily: "sans-serif",
              borderRadius: "1px",
              color: "black",
            }}
            data-testId="results-section"
            id="results"
          >
            <pre>
              <code>{results.trim()} </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupCoverageResultsSection;
