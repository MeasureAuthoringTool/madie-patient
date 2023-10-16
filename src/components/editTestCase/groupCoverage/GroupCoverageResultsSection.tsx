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
        <div>
          <span>
            Results
            {showGroupCoverageResults ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </span>
          <div>{showGroupCoverageResults ? results : ""}</div>
        </div>
      </button>
    </div>
  );
};

export default GroupCoverageResultsSection;
