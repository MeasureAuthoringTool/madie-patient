import React from "react";
import { Tab } from "@madie/madie-design-system/dist/react";

const DynamicElementTab = ({
  label,
  Icon,
  activeTab,
  setActiveTab,
  key,
  value,
  ...rest
}) => {
  const isActive = (val) => {
    if (activeTab === val) {
      return "madie-icon cyan";
    }
    return "madie-icon";
  };
  return (
    <Tab
      tabIndex={0}
      aria-label="Assessment tab panel"
      type="B"
      label={label}
      data-testid={`elements-tab-${label}`}
      icon={<Icon className={isActive(value)} />}
      iconPosition="start"
      value={value}
      // rest is needed for the Ref to track and indicate correctly.
      {...rest}
    />
  );
};

export default DynamicElementTab;
