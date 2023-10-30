import React, { useState } from "react";
import { TextField } from "@madie/madie-design-system/dist/react/";
import "twin.macro";
import "styled-components/macro";

export interface IntegerProps {
  intValue?: number | null;
  handleChange: Function;
  canEdit: boolean;
  label: string;
  allowNegative?: boolean;
}

const IntegerInput = ({
  intValue = null,
  handleChange,
  canEdit,
  label,
  allowNegative = false,
}: IntegerProps) => {
  const [inputValue, setInputValue] = useState<string>();
  return (
    <div tw="flex flex-row">
      <div tw="w-32">
        <TextField
          value={intValue}
          disabled={!canEdit}
          label={label}
          placeholder={`Enter ${label}`}
          id={`integer-field-${label}`}
          data-testid={`integer-field-${label}`}
          inputProps={{
            "data-testid": `integer-input-field-${label}`,
            "aria-describedby": `integer-input-field-helper-text-${label}`,
            required: true,
          }}
          onKeyPress={(e) => {
            if (!allowNegative && !Number(e.key) && e.key != "0") {
              e.preventDefault();
            } else if (allowNegative) {
              if (
                !inputValue &&
                !Number(e.key) &&
                e.key != "0" &&
                e.key != "-"
              ) {
                e.preventDefault();
              } else if (
                inputValue?.includes("-") &&
                !Number(inputValue + e.key) &&
                !Number(e.key) &&
                e.key != "0"
              ) {
                e.preventDefault();
              } else if (Number(inputValue) && !Number(e.key)) {
                e.preventDefault();
              }
            }
          }}
          onChange={(e) => {
            setInputValue(e.target.value.toString());
            if (!allowNegative) {
              if (
                Number(e.target.value) >= 0 &&
                Number(e.target.value) % 1 == 0 &&
                !e.target.value.toString().includes(".")
              ) {
                handleChange(e.target.value);
              }
            } else {
              if (
                Number(e.target.value) % 1 == 0 &&
                !e.target.value.toString().includes(".")
              ) {
                handleChange(e.target.value);
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default IntegerInput;
