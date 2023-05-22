import React from "react";
import DemographicsSection from "./Demographics/DemographicsSection";
import ElementsSection from "./Elements/ElementsSection";
const ElementsTab = ({ canEdit }) => {
  return (
    <>
      <DemographicsSection canEdit={canEdit} />
      <ElementsSection />
    </>
  );
};
export default ElementsTab;
