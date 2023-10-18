import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "twin.macro";
import "styled-components/macro";

const GroupCoverageResultsSection = ({ results }) => {
  const [showGroupCoverageResults, setShowGroupCoverageResults] =
    useState<boolean>(true);

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
          position: "relative",
          float: "right",
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
              padding: "10px",
              marginLeft: "10px",
              marginRight: "10px",
              marginTop: "50px",
              width: "auto",
              height: "75px",
              border: "1px solid #EDEDED",
              backgroundColor: "#EDEDED",
              fontFamily: "sans-serif",
              borderRadius: "5px",
              color: "black",
            }}
            data-testId="results-section"
            id="results"
          >
            {results.trim()}{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupCoverageResultsSection;
