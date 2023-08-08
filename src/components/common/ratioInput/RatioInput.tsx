import React from "react";
import "twin.macro";
import "styled-components/macro";
import Quantity from "../quantityInput/QuantityInput";
import { CQL } from "cqm-models";

interface RatioInputProps {
  label: string;
  ratio: CQL.Ratio;
  onRatioChange: Function;
  canEdit: boolean;
}

const RatioInput = ({
  label,
  ratio,
  onRatioChange,
  canEdit,
}: RatioInputProps) => {
  const handleNumeratorChange = (newValue) => {
    onRatioChange({ ...ratio, numerator: newValue });
  };
  const handleDenominatorChange = (newValue) => {
    onRatioChange({ ...ratio, denominator: newValue });
  };

  return (
    <>
      <h5 tw="text-blue-800 mb-2">{label}</h5>
      <div tw="flex flex-row flex-wrap gap-4">
        <div tw="flex flex-col w-80">
          <Quantity
            quantity={ratio.numerator}
            canEdit={canEdit}
            label={`Numerator`}
            onQuantityChange={handleNumeratorChange}
          />
        </div>
        <div style={{ paddingTop: "30px" }}>:</div>
        <div tw="flex flex-col w-80">
          <Quantity
            quantity={ratio.denominator}
            canEdit={canEdit}
            label={`Denominator`}
            onQuantityChange={handleDenominatorChange}
          />
        </div>
      </div>
    </>
  );
};

export default RatioInput;
