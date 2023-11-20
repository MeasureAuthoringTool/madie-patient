import React, { useState } from "react";
import RightPanelNavTabs from "./RightPanelNavTabs";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import { IconButton } from "@mui/material";
import GroupPopulations from "../populations/GroupPopulations";
import DetailsSection from "./DetailsTab/DetailsSection";
import CalculationResults from "./calculationResults/CalculationResults";
import { useFeatureFlags } from "@madie/madie-util";

const RightPanel = ({
  canEdit,
  testCaseGroups,
  executionRun,
  errors,
  calculationResults,
  calculationErrors,
  onChange,
  measureCql,
  measureGroups,
  measureName,
  birthDateTime,
}) => {
  const [activeTab, setActiveTab] = useState<string>("highlighting");
  const featureFlags = useFeatureFlags();

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
        {featureFlags.qdmHighlightingTabs && activeTab === "highlighting" && (
          <CalculationResults
            calculationResults={calculationResults}
            testCaseGroups={testCaseGroups}
            measureCql={measureCql}
            measureGroups={measureGroups}
            calculationErrors={calculationErrors}
          />
        )}
        {activeTab === "expectoractual" && (
          <GroupPopulations
            disableExpected={!canEdit}
            groupPopulations={testCaseGroups}
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
