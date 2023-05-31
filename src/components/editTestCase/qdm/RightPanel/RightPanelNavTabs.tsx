import React from "react";
import { Tabs, Tab } from "@madie/madie-design-system/dist/react";
import { useFormikContext } from "formik";

export interface NavTabProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  birthDateTime: any;
}

export default function RightPanelNavTabs(props: NavTabProps) {
  const { activeTab, setActiveTab, birthDateTime } = props;
  const formik: any = useFormikContext();
  if (formik && formik.values) {
    formik.values.birthDate = birthDateTime;
  }

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
