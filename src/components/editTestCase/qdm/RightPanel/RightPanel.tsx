import React, { useState } from "react";
import RightPanelNavTabs from "./RightPanelNavTabs";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import { IconButton } from "@mui/material";

import DetailsSection from "./DetailsTab/DetailsSection";

interface RightPanelProps {
  canEdit: Boolean;
  measureName: string;
}
const RightPanel = (props: RightPanelProps) => {
  const { canEdit, measureName } = props;
  // const [activeTab, setActiveTab] = useState<string>("highlighting");
  const [activeTab, setActiveTab] = useState<string>("details");
  console.log("activetab", activeTab);
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
        {activeTab === "details" && (
          <DetailsSection canEdit={canEdit} measureName={measureName} />
        )}
      </div>
      {/* header end */}
    </div>
  );
};

export default RightPanel;
