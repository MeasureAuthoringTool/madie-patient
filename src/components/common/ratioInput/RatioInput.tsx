import React, { useState } from "react";
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
  const [currentRatio, setCurrentRatio] = useState<CQL.Ratio>(ratio);
  const handleNumeratorChange = (newValue) => {
    if (newValue) {
      setCurrentRatio({ ...ratio, numerator: newValue });
      onRatioChange({ ...ratio, numerator: newValue });
    } else {
      onRatioChange(null);
    }
  };
  const handleDenominatorChange = (newValue) => {
    if (newValue) {
      setCurrentRatio({ ...currentRatio, denominator: newValue });
      onRatioChange({ ...currentRatio, denominator: newValue });
    } else {
      onRatioChange(null);
    }
  };

  return (
    <>
      <h5 tw="text-blue-800 mb-2">{label}</h5>
      <div tw="flex flex-row flex-wrap gap-4">
        <div tw="flex flex-col w-80">
          <Quantity
            quantity={currentRatio.numerator}
            canEdit={canEdit}
            label={"Numerator"}
            onQuantityChange={handleNumeratorChange}
          />
        </div>
        <div style={{ paddingTop: "30px" }}>:</div>
        <div tw="flex flex-col w-80">
          <Quantity
            quantity={currentRatio.denominator}
            canEdit={canEdit}
            label={"Denominator"}
            onQuantityChange={handleDenominatorChange}
          />
        </div>
      </div>
    </>
  );
};

export default RatioInput;
