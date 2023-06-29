import React, { useEffect } from "react";
import { Tabs } from "@madie/madie-design-system/dist/react";

import { categoriesMap } from "./categories";
import DynamicElementTab from "./DynamicElementTab";

export interface NavTabProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  categories: string[];
}

const DynamicElementTabs = ({ categories, activeTab, setActiveTab }) => {
  useEffect(() => {
    if (categories.length > 0) {
      setActiveTab(categories[0]);
    }
  }, [categories]);

  return (
    <div>
      <Tabs
        id="categories-tabs"
        value={activeTab}
        onChange={(e, v) => {
          setActiveTab(v);
        }}
        type="B"
        visibleScrollbar
        variant="scrollable"
        scrollButtons={false}
      >
        {/* have to do a ts ignore line because it's receiving a forward ref from Tabs
          And I'm not sure how to type it here but it's still available and required in the child. */}
        {categories.map((cat) => (
          // @ts-ignore-line
          <DynamicElementTab
            data-testid={`elements-tab-${cat}`}
            value={cat}
            key={cat}
            label={categoriesMap[cat][0]}
            Icon={categoriesMap[cat][1]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default DynamicElementTabs;
