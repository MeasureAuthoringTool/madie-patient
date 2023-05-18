import React, { useState } from "react";
import LeftPanelNavTabs from "./LeftPanelNavTabs";
import ElementsTab from "./ElementsTab.tsx/ElementsTab";
import { TestCase } from "@madie/madie-models";

const LeftPanel = (props: { canEdit: boolean }) => {
  const [activeTab, setActiveTab] = useState<string>("elements");
  return (
    <div className="left-panel">
      <div className="tab-container">
        <LeftPanelNavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="panel-content">
        {activeTab === "elements" && <ElementsTab canEdit={props.canEdit} />}
      </div>
    </div>
  );
};

export default LeftPanel;
