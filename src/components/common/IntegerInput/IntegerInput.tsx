import React from "react";
import {
  AutoComplete,
  TextField,
} from "@madie/madie-design-system/dist/react/";
import "twin.macro";
import "styled-components/macro";
import "./IntegerInput.scss";

export interface IntegerProps {
  intValue?: number | null;
  handleChange: Function;
  canEdit: boolean;
  label: string;
}

const IntegerInput = ({
  intValue = null,
  handleChange,
  canEdit,
  label,
}: IntegerProps) => {
  return (
    <div tw="flex flex-row">
      <div tw="w-28">
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
            if (!Number(e.key) && e.key != "0") {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            if (
              Number(e.target.value) >= 0 &&
              Number(e.target.value) % 1 == 0 &&
              !e.target.value.toString().includes(".")
            ) {
              handleChange(e.target.value);
            }
          }}
        />
      </div>
    </div>
  );
};

export default IntegerInput;
