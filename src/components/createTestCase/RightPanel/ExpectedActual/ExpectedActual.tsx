import React from "react";
import GroupPopulations from "../../../populations/GroupPopulations";

const ExpectedActual = ({
  canEdit,
  groupPopulations,
  onChange,
  onStratificationChange,
  errors,
  executionRun = false,
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
        onStratificationChange={onStratificationChange}
        errors={errors}
        executionRun={executionRun}
      />
    </div>
  );
};

export default ExpectedActual;
