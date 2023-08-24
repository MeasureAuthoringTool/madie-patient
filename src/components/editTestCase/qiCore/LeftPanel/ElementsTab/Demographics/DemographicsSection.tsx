import React from "react";
import ElementSection from "../ElementSection";

const DemographicsSection = ({ canEdit }) => {
  return (
    <div>
      <ElementSection title="Demographics" children={<>Demo</>} />
    </div>
  );
};

export default DemographicsSection;
