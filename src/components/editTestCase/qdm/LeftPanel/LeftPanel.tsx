import React, { useState } from "react";
import LeftPanelNavTabs from "./LeftPanelNavTabs";
import TabHeading from "../TabHeading";
import { TestCase } from "@madie/madie-models";

const LeftPanel = (props: {
  currentTestCase: TestCase;
  setTestCaseJson;
  canEdit: boolean;
}) => {
  const [activeTab, setActiveTab] = useState<string>("elements");
  return (
    <div className="left-panel">
      <div className="tab-container">
        <LeftPanelNavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="panel-content">
        <TabHeading
          title="Demographics"
          currentTestCase={props.currentTestCase}
          setTestCaseJson={props.setTestCaseJson}
          canEdit={props.canEdit}
        />
        <TabHeading
          title="Elements"
          currentTestCase={props.currentTestCase}
          setTestCaseJson={props.setTestCaseJson}
          canEdit={props.canEdit}
        />
      </div>
    </div>
  );
};

export default LeftPanel;
