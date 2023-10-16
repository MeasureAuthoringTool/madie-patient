import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const GroupCoverageResultsSection = ({ results }) => {
  const [showGroupCoverageResults, setShowGroupCoverageResults] =
    useState<boolean>(true);

  const handleResultsCollapse = (e) => {
    e.preventDefault();
    setShowGroupCoverageResults(!showGroupCoverageResults);
  };
  return (
    <div>
      <button
        onClick={(e) => {
          handleResultsCollapse(e);
        }}
      >
        <div style={{ float: "right" }}>
          {/* <span
            style={{
              backgroundColor: "#3498db",
              color: "#fff",
              padding: "10px",
              border: "1px solid  #2980b9",
              borderRadius: "5px",
              float: "right",
              marginLeft: "160px",
            }}
          > */}
          Results
          {showGroupCoverageResults ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          {/* </span> */}
          {showGroupCoverageResults && (
            <div
              style={{
                padding: "10px",
                marginLeft: "10px",
                marginRight: "10px",
                height: "49px",
                border: "1px solid #EDEDED",
                backgroundColor: "#EDEDED",
                fontFamily: "sans-serif",
                borderRadius: "5px",
              }}
              data-testId="results-section"
              id="results"
            >
              {results.trim()}{" "}
            </div>
          )}
        </div>
      </button>
    </div>
  );
};

export default GroupCoverageResultsSection;
