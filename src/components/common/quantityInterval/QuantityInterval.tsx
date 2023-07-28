import React, { useState } from "react";
import "twin.macro";
import "styled-components/macro";
import Quantity from "../quantity/Quantity";
import { CQL } from "cqm-models";

interface QuantityIntervalProps {
  label: string;
  lowQuantity: CQL.Quantity;
  highQuantity: CQL.Quantity;
  canEdit: boolean;
}

const QuantityInterval = ({
  label,
  lowQuantity,
  highQuantity,
  canEdit,
}: QuantityIntervalProps) => {
  const [currentLowQuantity, setCurrentLowQuantity] =
    useState<CQL.Quantity>(lowQuantity);
  const [currentHighQuantity, setCurrentHighQuantity] =
    useState<CQL.Quantity>(highQuantity);

  const handleLowQuantityChange = (newValue) => {
    setCurrentLowQuantity(newValue);
  };
  const handleHighQuantityChange = (newValue) => {
    setCurrentHighQuantity(newValue);
  };

  return (
    <>
      <h5 tw="text-blue-800 mb-2">{label}</h5>
      <div tw="flex flex-row flex-wrap gap-4">
        <div tw="flex flex-col w-80">
          <h5 tw="text-blue-800 mb-2">Low</h5>
          <Quantity
            quantity={currentLowQuantity}
            handleQuantityChange={handleLowQuantityChange}
            canEdit={canEdit}
            label="low"
          />
        </div>

        <div tw="flex flex-col w-80">
          <h5 tw="text-blue-800 mb-2">High</h5>
          <Quantity
            quantity={currentHighQuantity}
            handleQuantityChange={handleHighQuantityChange}
            canEdit={canEdit}
            label="high"
          />
        </div>
      </div>
    </>
  );
};

export default QuantityInterval;
