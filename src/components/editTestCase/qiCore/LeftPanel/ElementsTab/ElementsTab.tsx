import React, { useEffect, useRef } from "react";
import DemographicsSection from "./Demographics/DemographicsSection";
import ElementsSection from "./Elements/ElementsSection";
// import DemographicsSection from "./Demographics/DemographicsSection";
// import ElementsSection from "./Elements/ElementsSection";

const ElementsTab = ({ canEdit, setEditorVal, editorVal }) => {
  return (
    <>
      <DemographicsSection
        canEdit={canEdit}
        setEditorVal={setEditorVal}
        editorVal={editorVal}
      />
      <ElementsSection canEdit={canEdit} />
    </>
  );
};

export default ElementsTab;
