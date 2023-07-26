import React, { useState, useEffect, useCallback } from "react";
import "twin.macro";
import "styled-components/macro";
import * as ucum from "@lhncbc/ucum-lhc";
import Quantity from "../quantity/Quantity";

interface RatioProps {
  label: string;
  numeratorQuantity: number;
  numeratorQuantityUnit: any;
  denominatorQuantity: number;
  denominatorQuantityUnit: any;
  canEdit: boolean;
}

const Ratio = ({
  label,
  numeratorQuantity,
  numeratorQuantityUnit,
  denominatorQuantity,
  denominatorQuantityUnit,
  canEdit,
}: RatioProps) => {
  const [ucumOptions, setUcumOptions] = useState([]);
  const [ucumUnits, setUcumUnits] = useState([]);

  const [currentNumeratorQuantity, setCurrentNumeratorQuantity] =
    useState(numeratorQuantity);
  const [currentDenominatorQuantity, setCurrentDenominatorQuantity] =
    useState(denominatorQuantity);

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

  const handleNumeratorQuantityChange = (newValue) => {
    setCurrentNumeratorQuantity(newValue);
  };

  const handleNumeratorQuantityUnitChange = (newValue) => {};

  const handleDenominatorQuantityChange = (newValue) => {
    setCurrentDenominatorQuantity(newValue);
  };

  const handleDenominatorQuantityUnitChange = (newValue) => {};

  return (
    <>
      <h5 tw="text-blue-800 mb-2">{label}</h5>
      <div tw="flex flex-row flex-wrap gap-4">
        <div tw="flex flex-col w-80">
          <Quantity
            quantityValue={currentNumeratorQuantity}
            handleQuantityValueChange={handleNumeratorQuantityChange}
            quantityUnit={numeratorQuantityUnit}
            handleQuantityUnitChange={handleNumeratorQuantityUnitChange}
            options={ucumOptions}
            canEdit={canEdit}
            label={label}
          />
        </div>
        <div style={{ paddingTop: "30px" }}>:</div>
        <div tw="flex flex-col w-80">
          <Quantity
            quantityValue={currentDenominatorQuantity}
            handleQuantityValueChange={handleDenominatorQuantityChange}
            quantityUnit={denominatorQuantityUnit}
            handleQuantityUnitChange={handleDenominatorQuantityUnitChange}
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
