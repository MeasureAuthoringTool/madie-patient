import React from "react";
import "twin.macro";
import "styled-components/macro";
import Quantity from "../quantityInput/QuantityInput";
import { CQL } from "cqm-models";

interface QuantityIntervalProps {
  label: string;
  quantityInterval: CQL.Interval;
  onQuantityIntervalChange: Function;
  canEdit: boolean;
}

const QuantityIntervalInput = ({
  label,
  quantityInterval,
  onQuantityIntervalChange,
  canEdit,
}: QuantityIntervalProps) => {
  const handleLowQuantityChange = (newValue) => {
    onQuantityIntervalChange({ ...quantityInterval, low: newValue });
  };

  const handleHighQuantityChange = (newValue) => {
    onQuantityIntervalChange({ ...quantityInterval, high: newValue });
  };

  return (
    <>
      <h5 tw="text-blue-800 mb-2">{label}</h5>
      <div tw="flex flex-row flex-wrap gap-4">
        <div tw="flex flex-col w-80">
          <h5 tw="text-blue-800 mb-2">Low</h5>
          <Quantity
            quantity={quantityInterval.low}
            onQuantityChange={handleLowQuantityChange}
            canEdit={canEdit}
            label="low"
          />
        </div>

        <div tw="flex flex-col w-80">
          <h5 tw="text-blue-800 mb-2">High</h5>
          <Quantity
            quantity={quantityInterval.high}
            onQuantityChange={handleHighQuantityChange}
            canEdit={canEdit}
            label="high"
          />
        </div>
      </div>
    </>
  );
};

export default QuantityIntervalInput;
