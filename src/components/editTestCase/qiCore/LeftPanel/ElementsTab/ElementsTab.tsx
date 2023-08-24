import React, { useEffect, useRef } from "react";
import DemographicsSection from "./Demographics/DemographicsSection";
import ElementsSection from "./Elements/ElementsSection";
// import DemographicsSection from "./Demographics/DemographicsSection";
// import ElementsSection from "./Elements/ElementsSection";

const ElementsTab = ({ canEdit }) => {
  return (
    <>
      <DemographicsSection canEdit={canEdit} />
      <ElementsSection canEdit={canEdit} />
    </>
  );
};

export default ElementsTab;
