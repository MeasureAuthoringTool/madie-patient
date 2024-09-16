import React from "react";
import "styled-components/macro";
import { DisplayStratificationValue } from "@madie/madie-models";
import TestCaseStratificationRow from "./TestCaseStratificationRow";

export interface TestCaseStratificationProps {
  strataCode: string;
  executionRun: boolean;
  stratification: DisplayStratificationValue;
  populationBasis: string;
  showExpected?: boolean;
  disableExpected?: boolean;
  onStratificationChange: (
    stratification: DisplayStratificationValue,
    stratId: string
  ) => void;
  groupsStratificationAssociationMap?: any;
}

const TestCaseStratification = ({
  strataCode,
  executionRun,
  stratification,
  populationBasis,
  disableExpected = false,
  onStratificationChange,
  groupsStratificationAssociationMap,
}: TestCaseStratificationProps) => {
  const associations = groupsStratificationAssociationMap
    ? groupsStratificationAssociationMap[stratification?.id]
    : [];
  const associatedPopulationValues = stratification?.populationValues?.filter(
    (pop) => associations.includes(pop.name)
  );
  return (
    <React.Fragment key={`fragment-key-${strataCode}`}>
      {associatedPopulationValues?.map((strat, index) => {
        return (
          <TestCaseStratificationRow
            stratification={strat} //actuall a population value
            stratId={stratification.id}
            strataCode={strataCode}
            executionRun={executionRun}
            populationBasis={populationBasis}
            disableExpected={disableExpected}
            onStratificationChange={onStratificationChange}
          />
        );
      })}
    </React.Fragment>
  );
};

export default TestCaseStratification;
