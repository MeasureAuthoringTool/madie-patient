import React from "react";
import { Tabs, Tab } from "@madie/madie-design-system/dist/react";
import "./CreateTestCaseNavTabs.scss";
export interface NavTabProps {
  rightPanelActiveTab: string;
  setRightPanelActiveTab: (value: string) => void;
}

export default function CreateTestCaseRightPanelNavTabs(props: NavTabProps) {
  const { rightPanelActiveTab, setRightPanelActiveTab } = props;
  return (
    <Tabs
      id="test-case-nav-container"
      value={rightPanelActiveTab}
      onChange={(e, v) => {
        setRightPanelActiveTab(v);
      }}
      type="B"
    >
      <Tab
        tabIndex={0}
        aria-label="Measure CQL View Only tab panel"
        type="B"
        label={`Measure CQL (View Only)`}
        data-testid="measurecql-tab"
        value="measurecql"
      />
      <Tab
        tabIndex={0}
        aria-label="Highlighting tab panel"
        type="B"
        label={`Highlighting`}
        data-testid="highlighting-tab"
        value="highlighting"
      />
      <Tab
        tabIndex={0}
        aria-label="Expected or Actual tab panel"
        type="B"
        value="expectoractual"
        label="Expected / Actual"
        data-testid="expectoractual-tab"
      />
      <Tab
        tabIndex={0}
        aria-label="Details tab panel"
        type="B"
        value="details"
        label="Details"
        data-testid="details-tab"
      />
    </Tabs>
  );
}
