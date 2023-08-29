import React from "react";
import { Tabs, Tab } from "@madie/madie-design-system/dist/react";
import "./CreateTestCaseNavTabs.scss";
export interface NavTabProps {
  leftPanelActiveTab: string;
  setLeftPanelActiveTab: (value: string) => void;
}

export default function CreateTestCaseNavTabs(props: NavTabProps) {
  const { leftPanelActiveTab, setLeftPanelActiveTab } = props;
  return (
    <Tabs
      id="test-case-nav-container"
      value={leftPanelActiveTab}
      onChange={(e, v) => {
        setLeftPanelActiveTab(v);
      }}
      type="D"
    >
      <Tab
        tabIndex={0}
        aria-label="Elements tab panel"
        type="D"
        label={`Elements`}
        data-testid="elements-tab"
        value="elements"
      />
      <Tab
        tabIndex={0}
        aria-label="JSON tab panel"
        type="D"
        label={`JSON`}
        data-testid="json-tab"
        value="json"
      />
    </Tabs>
  );
}
