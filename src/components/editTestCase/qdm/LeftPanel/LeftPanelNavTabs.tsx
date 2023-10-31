import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@madie/madie-design-system/dist/react";
import { useFeatureFlags } from "@madie/madie-util";

export interface NavTabProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export default function RightPanelNavTabs(props: NavTabProps) {
  const { activeTab, setActiveTab } = props;
  const featureFlags = useFeatureFlags();
  const [qdmHidJsonTab, setQdmHidJsonTab] = useState(false);
  useEffect(() => {
    if (featureFlags?.qdmHideJson) {
      setQdmHidJsonTab(true);
    }
  });

  return (
    <Tabs
      id="left-panel-navs"
      value={activeTab}
      onChange={(e, v) => {
        setActiveTab(v);
      }}
      type="D"
    >
      <Tab
        tabIndex={0}
        aria-label="Elements tab panel"
        type="D"
        label="Elements"
        data-testid="elements-tab"
        value="elements"
      />
      {!qdmHidJsonTab && (
        <Tab
          tabIndex={0}
          aria-label="JSON tab panel"
          type="D"
          data-testid="json-tab"
          label="JSON"
          value="json"
        />
      )}
    </Tabs>
  );
}
