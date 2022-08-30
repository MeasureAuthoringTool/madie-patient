import React from "react";
import GroupPopulations from "../../../populations/GroupPopulations";

const ExpectedActual = ({
  canEdit,
  groupPopulations,
  onChange,
  setChangedPopulation,
}) => {
  return (
    <div
      data-testid="create-test-case-populations"
      id="create-test-case-right-panel"
    >
      <GroupPopulations
        disableExpected={!canEdit}
        groupPopulations={groupPopulations}
        onChange={onChange}
        setChangedPopulation={setChangedPopulation}
      />
    </div>
  );
};

export default ExpectedActual;
