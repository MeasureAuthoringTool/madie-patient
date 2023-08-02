import React, { useEffect, useState, useCallback } from "react";
import {
  AutoComplete,
  TextField,
} from "@madie/madie-design-system/dist/react/";
import "twin.macro";
import "styled-components/macro";
import { CQL } from "cqm-models";
import * as ucum from "@lhncbc/ucum-lhc";

export interface QuantityProps {
  quantity: CQL.Quantity;
  onQuantityChange: Function;
  canEdit: boolean;
  label: string;
}

export interface UcumOption {
  label: string;
  value: ucum;
}

const QuantityInput = ({
  quantity,
  onQuantityChange,
  canEdit,
  label,
}: QuantityProps) => {
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

  const [currentQuantity, setCurrentQuantity] =
    useState<CQL.Quantity>(quantity);
  const [currentUnit, setCurrentUnit] = useState<UcumOption>(null);

  const findUnitOptionFromCQLQuantity = (value) => {
    const option: ucum = ucumOptions?.find((option) => option.code === value);
    if (option) {
      const optionWithLabel = {
        label: option.code + " " + option.name,
        value: option,
      };
      return optionWithLabel;
    }
    return null;
  };

  useEffect(() => {
    if (currentQuantity && currentQuantity.unit && ucumOptions?.length > 0) {
      const unit = findUnitOptionFromCQLQuantity(currentQuantity.unit);
      if (unit) {
        setCurrentUnit(unit);
      }
    }
  }, [ucumOptions]);

  const handleQuantityValueChange = (newValue) => {
    const newQuantity: CQL.Quantity = {
      value: newValue,
      unit: currentQuantity.unit,
    };
    setCurrentQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const handleQuantityUnitChange = (newValue) => {
    const newQuantity: CQL.Quantity = {
      value: currentQuantity ? currentQuantity.value : 0,
      unit: newValue.label,
    };
    setCurrentQuantity(newQuantity);
    setCurrentUnit(newValue);
    onQuantityChange(newQuantity);
  };

  return (
    <div tw="flex flex-row">
      <div tw="w-28">
        <TextField
          value={quantity.value}
          disabled={!canEdit}
          placeholder="value"
          id={`quantity-value-field-${label}`}
          data-testid={`quantity-value-field-${label}`}
          inputProps={{
            "data-testid": `quantity-value-input-${label}`,
            "aria-describedby": `quantity-value-input-helper-text-${label}`,
            required: true,
          }}
          onChange={(event) => {
            handleQuantityValueChange(event.target.value);
          }}
        />
      </div>
      <div tw="w-56">
        <AutoComplete
          id={`quantity-unit-dropdown-${label}`}
          disabled={!canEdit}
          options={ucumOptions.map((option) => option.code + " " + option.name)}
          data-testid={`quantity-unit-dropdown-${label}`}
          placeholder="unit"
          onChange={(event, newValue) => {
            if (newValue) {
              const find = ucumOptions.find(
                (option) => option.code + ` ` + option.name === newValue
              );
              const transformedResult = {
                label: newValue,
                value: find,
              };
              handleQuantityUnitChange(transformedResult);
            } else {
              handleQuantityUnitChange("");
            }
          }}
          value={currentUnit?.label}
        />
      </div>
    </div>
  );
};

export default QuantityInput;
