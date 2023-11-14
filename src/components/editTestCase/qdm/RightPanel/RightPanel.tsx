import React, { useState } from "react";
import RightPanelNavTabs from "./RightPanelNavTabs";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import { IconButton } from "@mui/material";
import GroupPopulations from "../populations/GroupPopulations";
import DetailsSection from "./DetailsTab/DetailsSection";
import CalculationResults from "./calculationResults/CalculationResults";

const RightPanel = ({
  canEdit,
  groupPopulations,
  executionRun,
  errors,
  calculationResults,
  onChange,
  measureCql,
  measureName,
  birthDateTime,
}) => {
  const [activeTab, setActiveTab] = useState<string>("highlighting");
  return (
    <div className="right-panel">
      <div className="tab-container">
        <RightPanelNavTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          birthDateTime={birthDateTime}
        />
        <div className="spacer" />
        <IconButton>
          <KeyboardTabIcon className="back-icon" />
        </IconButton>
      </div>
      <div className="panel-content">
        {activeTab === "highlighting" && (
          <CalculationResults
            calculationResults={calculationResults}
            groupPopulations={groupPopulations}
            measureCql={measureCql}
            errors={errors}
          />
        )}
        {activeTab === "expectoractual" && (
          <GroupPopulations
            disableExpected={!canEdit}
            groupPopulations={groupPopulations}
            onChange={onChange}
            errors={errors}
            executionRun={executionRun}
            birthDateTime={birthDateTime}
          />
        )}
        {activeTab === "details" && (
          <DetailsSection
            canEdit={canEdit}
            measureName={measureName}
            birthDateTime={birthDateTime}
          />
        )}
      </div>
      {/* header end */}
    </div>
  );
};

export default RightPanel;
