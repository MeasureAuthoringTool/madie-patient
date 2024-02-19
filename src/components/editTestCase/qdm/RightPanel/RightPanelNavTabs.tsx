import React from "react";
import { Tabs, Tab } from "@madie/madie-design-system/dist/react";

export interface NavTabProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export default function RightPanelNavTabs(props: NavTabProps) {
  const { activeTab, setActiveTab } = props;
  return (
    <Tabs
      id="right-panel-navs"
      value={activeTab}
      onChange={(e, v) => {
        setActiveTab(v);
      }}
      type="D"
    >
      <Tab
        tabIndex={0}
        aria-label="Measure CQL View Only tab panel"
        type="B"
        label="Measure CQL (View Only)"
        data-testid="measurecql-tab"
        value="measurecql"
      />
      <Tab
        tabIndex={0}
        aria-label="Highlighting tab panel"
        type="D"
        label="Highlighting"
        data-testid="highlighting-tab"
        value="highlighting"
      />
      <Tab
        tabIndex={0}
        aria-label="Expected or Actual tab panel"
        type="D"
        value="expectoractual"
        label="Expected / Actual"
        data-testid="expectoractual-tab"
      />
      <Tab
        tabIndex={0}
        aria-label="Details tab panel"
        type="D"
        value="details"
        label="Details"
        data-testid="details-tab"
      />
    </Tabs>
  );
}
