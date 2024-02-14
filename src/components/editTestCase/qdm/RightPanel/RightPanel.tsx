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
  isTestCaseExecuted,
  errors,
  groupCoverageResult,
  calculationErrors,
  onChange,
  measureGroups,
  measureName,
  measureCql,
}) => {
  const [activeTab, setActiveTab] = useState<string>("highlighting");
  const featureFlags = useFeatureFlags();

  return (
    <div className="right-panel">
      <div className="tab-container">
        <RightPanelNavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="spacer" />
        <IconButton>
          <KeyboardTabIcon className="back-icon" />
        </IconButton>
      </div>
      <div className="panel-content">
        {featureFlags.qdmHighlightingTabs && activeTab === "highlighting" && (
          <CalculationResults
            groupCoverageResult={groupCoverageResult}
            testCaseGroups={testCaseGroups}
            measureGroups={measureGroups}
            calculationErrors={calculationErrors}
            measureCql={measureCql}
          />
        )}
        {activeTab === "expectoractual" && (
          <GroupPopulations
            disableExpected={!canEdit}
            groupPopulations={testCaseGroups}
            onChange={onChange}
            errors={errors}
            isTestCaseExecuted={isTestCaseExecuted}
          />
        )}
        {activeTab === "details" && (
          <DetailsSection canEdit={canEdit} measureName={measureName} />
        )}

            {activeTab === "measurecql" &&
                (!measure?.cqlErrors ? (
                  <div
                    data-testid="test-case-cql-editor"
                    id="test-case-cql-editor"
                    style={{ height: "calc(100% - 24px)" }}
                  >
                    <MadieEditor
                      value={measure?.cql}
                      height="100%"
                      readOnly={true}
                      validationsEnabled={false}
                    />
                  </div>
                ) : (
                  <div data-testid="test-case-cql-has-errors-message">
                    An error exists with the measure CQL, please review the CQL
                    Editor tab
                  </div>
                ))}
      </div>
      {/* header end */}
    </div>
  );
};

export default RightPanel;
