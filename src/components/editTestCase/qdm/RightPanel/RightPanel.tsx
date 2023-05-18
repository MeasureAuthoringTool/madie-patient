import React, { useState } from "react";
import RightPanelNavTabs from "./RightPanelNavTabs";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import { IconButton } from "@mui/material";
import GroupPopulations from "../populations/GroupPopulations";

const RightPanel = ({ canEdit, groupPopulations, errors, onChange }) => {
  const [activeTab, setActiveTab] = useState<string>("highlighting");
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
        {activeTab === "expectoractual" && (
          <GroupPopulations
            disableExpected={!canEdit}
            groupPopulations={groupPopulations}
            onChange={onChange}
            errors={errors}
          />
        )}
      </div>
      {/* header end */}
    </div>
  );
};

export default RightPanel;
