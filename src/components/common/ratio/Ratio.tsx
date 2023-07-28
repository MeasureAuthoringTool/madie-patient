import React, { useState } from "react";
import "twin.macro";
import "styled-components/macro";
import Quantity from "../quantity/Quantity";
import { CQL } from "cqm-models";

interface RatioProps {
  label: string;
  numerator: CQL.Quantity;
  denominator: CQL.Quantity;
  canEdit: boolean;
}

const Ratio = ({ label, numerator, denominator, canEdit }: RatioProps) => {
  const [currentNumerator, setCurrentNumerator] =
    useState<CQL.Quantity>(numerator);
  const [currentDenominator, setCurrentDenominator] =
    useState<CQL.Quantity>(denominator);

  const handleNumeratorChange = (newValue) => {
    setCurrentNumerator(newValue);
  };
  const handleDenominatorChange = (newValue) => {
    setCurrentDenominator(newValue);
  };

  return (
    <>
      <h5 tw="text-blue-800 mb-2">{label}</h5>
      <div tw="flex flex-row flex-wrap gap-4">
        <div tw="flex flex-col w-80">
          <Quantity
            quantity={currentNumerator}
            canEdit={canEdit}
            label={label}
            handleQuantityChange={handleNumeratorChange}
          />
        </div>
        <div style={{ paddingTop: "30px" }}>:</div>
        <div tw="flex flex-col w-80">
          <Quantity
            quantity={currentDenominator}
            canEdit={canEdit}
            label={label}
            handleQuantityChange={handleDenominatorChange}
          />
        </div>
      </div>
    </>
  );
};

export default Ratio;
