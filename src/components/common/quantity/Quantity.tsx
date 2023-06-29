import React, { useState } from "react";
import {
  AutoComplete,
  TextField,
} from "@madie/madie-design-system/dist/react/";
import "twin.macro";
import "styled-components/macro";
import * as ucum from "@lhncbc/ucum-lhc";

export interface UCUM {
  label: string;
  value: ucum;
}
export interface QuantityProps {
  quantityValue: number;
  quantityUnit: any;
  handleQuantityValueChange: Function;
  handleQuantityUnitChange: Function;
  options?: any;
  canEdit: boolean;
  placeholder: string;
  label: string;
}

const Quantity = ({
  quantityValue,
  quantityUnit,
  handleQuantityValueChange,
  handleQuantityUnitChange,
  options,
  canEdit,
  placeholder,
  label,
}: QuantityProps) => {

  const removeSpecificChars = (string) => {
    return string.trim().replace("-", "").replace(".", "");
  };

  const parsedValue = quantityUnit?.value || null;
  const parsedLabel = quantityUnit?.label || null;
  const [selected, setSelected] = useState<UCUM>({
    label: parsedLabel,
    value: parsedValue,
  });
  const [value, setValue] = useState<number>(quantityValue);

  interface Option {
    name: string;
    code: string;
    guidance: string;
    system: string;
  }

  return (
    <div tw="flex flex-row">
      <div tw="w-28">
        <TextField
          value={value}
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
            setValue(parseInt(event.target.value));
            handleQuantityValueChange(event.target.value);
          }}
        />
      </div>
      <div tw="w-56">
        <AutoComplete
          id="quantity-unit-dropdown"
          label="Unit"
          disabled={!canEdit}
          options={options.map((option) => option.code + option.name)}
          data-testid={`quantity-unit-dropdown-${label}`}
          onChange={(values) => {
            if (values) {
              const label = `${values.code} ${values.name}`;
              const transformedResult = {
                label,
                value: values,
              };
              setSelected(transformedResult);
              handleQuantityUnitChange(transformedResult);
            } else {
              handleQuantityUnitChange("");
            }
          }}
          value={quantityUnit}
          // getOptionLabel={(option: Option): string =>
          //   `${option.code} ${option.name}`
          // }
          // disablePortal
          // limitTags={10}
          // filterOptions={(options, state): any[] => {
          //   const { inputValue } = state;
          //   if (inputValue) {
          //     const input = removeSpecificChars(inputValue);
          //     const filteredOptions = options.filter((opt: Option) => {
          //       const match = removeSpecificChars(`${opt.code} ${opt.name}`);
          //       return match.includes(input);
          //     });
          //     return filteredOptions;
          //   }
          //   return [];
          // }}
          // onChange={(event: any, values: any, reason: string) => {
          //   if (values) {
          //     const label = `${values.code} ${values.name}`;
          //     const transformedResult = {
          //       label,
          //       value: values,
          //     };
          //     setSelected(transformedResult);
          //     handleQuantityUnitChange(transformedResult);
          //   } else {
          //     handleQuantityUnitChange("");
          //   }
          // }}
          // autoHighlight={true}
          // renderInput={(params) => {
          //   const { inputProps } = params;
          //   inputProps["aria-labelledby"] = "scoring-unit-dropdown-label";
          //   return (
          //     <TextField
          //       {...params}
          //       data-testid={`quantity-unit-text-input-${label}`}
          //       inputProps={inputProps}
          //       disabled={!canEdit}
          //       sx={{
          //         input: {
          //           color: "#333",
          //           "&::placeholder": {
          //             opacity: 1,
          //             color: "#717171",
          //           },
          //         },
          //       }}
          //       placeholder={placeholder}
          //       value={
          //         quantityUnit
          //           ? `${quantityUnit.code} ${quantityUnit.name}`
          //           : ""
          //       }
          //     />
          //   );
          // }}
        />
      </div>
    </div>
  );
};

export default Quantity;
