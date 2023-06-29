import React, { useState, useEffect, useCallback } from "react";
import { FormControl } from "@mui/material";
import "twin.macro";
import "styled-components/macro";
import * as ucum from "@lhncbc/ucum-lhc";
import Quantity from "../quantity/Quantity";

interface QuantityIntervalProps {
  lowQuantity: number;
  handleLowQuantityChange: Function;
  lowQuantityUnit: any;
  handleLowQuantityUnitChange: Function;
  highQuantity: number;
  handleHighQuantityChange: Function;
  highQuantityUnit: any;
  handleHighQuantityUnitChange: Function;
  canEdit: boolean;
}

const QuantityInterval = ({
  lowQuantity,
  handleLowQuantityChange,
  lowQuantityUnit,
  handleLowQuantityUnitChange,
  highQuantity,
  handleHighQuantityChange,
  highQuantityUnit,
  handleHighQuantityUnitChange,
  canEdit,
}: QuantityIntervalProps) => {
  const [ucumOptions, setUcumOptions] = useState([]);
  const [ucumUnits, setUcumUnits] = useState([]);

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

  return (
    <div>
      <FormControl>
        <div tw="grid lg:grid-cols-2 gap-2 items-center py-2">
          <div>
            <h5 tw="text-blue-800 mb-2">Low</h5>
            <Quantity
              quantityValue={lowQuantity}
              handleQuantityValueChange={handleLowQuantityChange}
              placeholder="Search"
              quantityUnit={lowQuantityUnit}
              handleQuantityUnitChange={handleLowQuantityUnitChange}
              options={ucumOptions}
              canEdit={canEdit}
              label="low"
            />
          </div>
          <div>
            <h5 tw="text-blue-800 mb-2">High</h5>
            <Quantity
              quantityValue={highQuantity}
              handleQuantityValueChange={handleHighQuantityChange}
              placeholder="Search"
              quantityUnit={highQuantityUnit}
              handleQuantityUnitChange={handleHighQuantityUnitChange}
              options={ucumOptions}
              canEdit={canEdit}
              label="high"
            />
          </div>
        </div>
      </FormControl>
    </div>
  );
};

export default QuantityInterval;
