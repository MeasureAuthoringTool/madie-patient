import React from "react";
import { Tabs, Tab } from "@madie/madie-design-system/dist/react";
import {
  CodesIcon,
  AttributesIcon,
  NegationRationaleIcon,
} from "../../../../../../../icons";

export interface NavTabProps {
  negationRationale: Boolean;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

// this guy will have to be able to access state and update the values of state to show numbers such as [Codes (1)] later on. we will have to update matchers too
const SubNavigationTabs = ({ activeTab, setActiveTab, negationRationale }) => {
  const OPTIONS = [
    {
      label: "Codes",
      value: "codes",
      icon: CodesIcon,
    },
    {
      label: "Attributes",
      value: "attributes",
      icon: AttributesIcon,
    },
  ];
  // only push if we need it
  if (negationRationale) {
    OPTIONS.push({
      label: "Negation Rationale",
      value: "negation_rationale",
      icon: NegationRationaleIcon,
    });
  }
  return (
    <div className="tabs-container">
      <Tabs
        id="sub-navigation-tabs"
        value={activeTab}
        onChange={(e, v) => {
          setActiveTab(v);
        }}
        type="B"
        visibleScrollbar
        variant="scrollable"
        scrollButtons={false}
      >
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = (val) => {
            if (activeTab === val) {
              return "madie-icon cyan";
            }
            return "madie-icon";
          };
          return (
            <Tab
              tabIndex={0}
              type="B"
              label={opt.label}
              value={opt.value}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              icon={<Icon className={isActive(opt.value)} />}
              iconPosition="start"
              aria-label={`navigation panel ${opt.label}`}
              data-testid={`sub-navigation-tab-${opt.value}`}
              key={`sub-${opt.value}-key`}
            />
          );
        })}
      </Tabs>
    </div>
  );
};

export default SubNavigationTabs;
