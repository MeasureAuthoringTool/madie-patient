import React, { useEffect, useState } from "react";
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
  const [currentInterval, setCurrentInterval] =
    useState<CQL.Ratio>(quantityInterval);
  const handleLowQuantityChange = (newValue) => {
    setCurrentInterval({ ...currentInterval, low: newValue });
  };

  const handleHighQuantityChange = (newValue) => {
    setCurrentInterval({ ...currentInterval, high: newValue });
  };

  useEffect(() => {
    if (currentInterval?.high && currentInterval?.low) {
      onQuantityIntervalChange(currentInterval);
    } else {
      onQuantityIntervalChange(null);
    }
  }, [currentInterval]);

  return (
    <>
      <h5 tw="text-blue-800 mb-2">{label}</h5>
      <div tw="flex flex-row flex-wrap gap-4">
        <div tw="flex flex-col w-80">
          <Quantity
            quantity={quantityInterval.low}
            onQuantityChange={handleLowQuantityChange}
            canEdit={canEdit}
            label="Low"
          />
        </div>

        <div tw="flex flex-col w-80">
          <Quantity
            quantity={quantityInterval.high}
            onQuantityChange={handleHighQuantityChange}
            canEdit={canEdit}
            label="High"
          />
        </div>
      </div>
    </>
  );
};

export default QuantityIntervalInput;
