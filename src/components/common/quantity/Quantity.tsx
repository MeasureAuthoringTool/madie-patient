import React from "react";
import {
  AutoComplete,
  TextField,
} from "@madie/madie-design-system/dist/react/";
import "twin.macro";
import "styled-components/macro";

export interface QuantityProps {
  quantityValue: number;
  quantityUnit: any;
  handleQuantityValueChange: Function;
  handleQuantityUnitChange: Function;
  options?: any;
  canEdit: boolean;
  label: string;
}

const Quantity = ({
  quantityValue,
  quantityUnit,
  handleQuantityValueChange,
  handleQuantityUnitChange,
  options,
  canEdit,
  label,
}: QuantityProps) => {
  return (
    <div tw="flex flex-row">
      <div tw="w-28">
        <TextField
          value={quantityValue}
          disabled={!canEdit}
          label="Value"
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
          label="Unit"
          disabled={!canEdit}
          options={options.map((option) => option.code + " " + option.name)}
          data-testid={`quantity-unit-dropdown-${label}`}
          placeholder="Search"
          onChange={(event, newValue) => {
            if (newValue) {
              const find = options.find(
                (option) => option.code + " " + option.name === newValue
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
          value={quantityUnit.label}
        />
      </div>
    </div>
  );
};

export default Quantity;
