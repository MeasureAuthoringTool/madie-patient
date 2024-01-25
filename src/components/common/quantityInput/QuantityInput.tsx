import React, { useEffect, useState, useCallback } from "react";
import { TextField } from "@madie/madie-design-system/dist/react/";
import "twin.macro";
import "styled-components/macro";
import { CQL } from "cqm-models";
import * as ucum from "@lhncbc/ucum-lhc";
import { validate, ValidationResult } from "./validate";

export interface QuantityProps {
  quantity: CQL.Quantity;
  onQuantityChange: Function;
  canEdit: boolean;
  label?: string;
}

export interface UcumOption {
  label: string;
  value: ucum;
}

const QuantityInput = ({
  quantity,
  onQuantityChange,
  canEdit,
  label = "Quantity",
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

  const valueFn = (value: any) => {
    let result: string;
    if (value?.code) {
      result = value.code;
    } else {
      result = value;
    }
    return result;
  };
  const [currentQuantity, setCurrentQuantity] =
    useState<CQL.Quantity>(quantity);
  const [currentUnit, setCurrentUnit] = useState<UcumOption>(null);
  const [error, setError] = useState<boolean>();
  const [helperText, setHelperText] = useState<String>();
  const [unitText, setUnitText] = useState<String>(valueFn(currentUnit?.value));

  useEffect(() => {
    if (currentQuantity && currentQuantity.value && currentQuantity.unit) {
      onQuantityChange(currentQuantity);
    } else {
      onQuantityChange(null);
    }
  }, [currentQuantity]);

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
  };

  const handleQuantityUnitChange = (value: any) => {
    const validationResult: ValidationResult = validate(value);
    if (!validationResult.error) {
      const label = validationResult.label;
      const transformedResult = {
        label,
        value: {
          code: value,
          guidance: undefined,
          name: validationResult.label,
          system: "https://clinicaltables.nlm.nih.gov/",
        },
      } as UcumOption;
      const newQuantity: CQL.Quantity = {
        value: currentQuantity ? currentQuantity.value : 0,
        unit: value,
      };
      setCurrentQuantity(newQuantity);
      setCurrentUnit(transformedResult);
      setUnitText(transformedResult.value.code);
    } else {
      setUnitText(value);
    }
    setHelperText(validationResult.helperText);
    setError(validationResult.error);
  };

  return (
    <div tw="flex flex-row">
      <div tw="w-28">
        <TextField
          value={currentQuantity.value}
          disabled={!canEdit}
          placeholder="value"
          label={label}
          id={`quantity-value-field-${label.toLowerCase()}`}
          data-testid={`quantity-value-field-${label.toLowerCase()}`}
          inputProps={{
            "data-testid": `quantity-value-input-${label.toLowerCase()}`,
            "aria-describedby": `quantity-value-input-helper-text-${label.toLowerCase()}`,
            required: true,
          }}
          type="number"
          onWheel={(e) => e.target.blur()}
          onKeyPress={(e) => {
            if (
              (!Number(e.key) &&
                e.key != "0" &&
                e.key != "." &&
                e.key != "-") ||
              (e.target.value.length > 0 && e.key == "-") ||
              (e.target.value.includes(".") && e.key == ".")
            ) {
              e.preventDefault();
            }
          }}
          onChange={(event) => {
            handleQuantityValueChange(event.target.value);
          }}
        />
      </div>
      <div tw="w-56">
        <TextField
          id={`quantity-unit-input-${label.toLowerCase()}`}
          disabled={!canEdit}
          label="Unit"
          error={error}
          helperText={helperText}
          data-testid={`quantity-unit-input-${label.toLowerCase()}`}
          placeholder="unit"
          onChange={(e: any) => {
            handleQuantityUnitChange(e.target.value);
          }}
          value={unitText}
        />
      </div>
    </div>
  );
};

export default QuantityInput;
