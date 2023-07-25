import React, { useState, useEffect, useCallback } from "react";
import "twin.macro";
import "styled-components/macro";
import * as ucum from "@lhncbc/ucum-lhc";
import Quantity from "../quantity/Quantity";

interface QuantityIntervalProps {
  label: string;
  lowQuantity: number;
  lowQuantityUnit: any;
  highQuantity: number;
  highQuantityUnit: any;
  canEdit: boolean;
}

const Ratio = ({
  label,
  lowQuantity,
  lowQuantityUnit,
  highQuantity,
  highQuantityUnit,
  canEdit,
}: QuantityIntervalProps) => {
  const [ucumOptions, setUcumOptions] = useState([]);
  const [ucumUnits, setUcumUnits] = useState([]);

  const [currentLowQuantity, setCurrentLowQuantity] = useState(lowQuantity);
  const [currentHighQuantity, setCurrentHighQuantity] = useState(highQuantity);

  const buildUcumUnits = useCallback(() => {
    const options = [];

    for (const [key, value] of Object.entries(ucumUnits)) {
      const current = value;
      const { csCode_, guidance_, name_ } = current;
      const option = {
        code: csCode_,
        guidance: guidance_,
        name: name_,
        system: "https://clinicaltables.nlm.nih.gov/",
      };
      options.push(option);
    }
    setUcumOptions(options);
  }, [ucumUnits, setUcumOptions]);

  useEffect(() => {
    if (ucumUnits) {
      buildUcumUnits();
    }
  }, [ucumUnits, buildUcumUnits]);

  useEffect(() => {
    if (!ucumUnits.length) {
      ucum.UcumLhcUtils.getInstance();
      const unitCodes = ucum.UnitTables.getInstance().unitCodes_;
      setUcumUnits(unitCodes);
    }
  }, [ucum, ucumUnits]);

  const handleLowQuantityChange = (newValue) => {
    setCurrentLowQuantity(newValue);
  };

  const handleLowQuantityUnitChange = (newValue) => {};

  const handleHighQuantityChange = (newValue) => {
    setCurrentHighQuantity(newValue);
  };

  const handleHighQuantityUnitChange = (newValue) => {};

  return (
    <>
      <h5 tw="text-blue-800 mb-2">{label}</h5>
      <div tw="flex flex-row flex-wrap gap-4">
        <div tw="flex flex-col w-80">
          <Quantity
            quantityValue={currentLowQuantity}
            handleQuantityValueChange={handleLowQuantityChange}
            quantityUnit={lowQuantityUnit}
            handleQuantityUnitChange={handleLowQuantityUnitChange}
            options={ucumOptions}
            canEdit={canEdit}
            label={label}
          />
        </div>
        <div style={{ paddingTop: "30px" }}>:</div>
        <div tw="flex flex-col w-80">
          <Quantity
            quantityValue={currentHighQuantity}
            handleQuantityValueChange={handleHighQuantityChange}
            quantityUnit={highQuantityUnit}
            handleQuantityUnitChange={handleHighQuantityUnitChange}
            options={ucumOptions}
            canEdit={canEdit}
            label={label}
          />
        </div>
      </div>
    </>
  );
};

export default Ratio;
