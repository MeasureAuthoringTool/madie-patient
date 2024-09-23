import React from "react";
import { MenuItem as MuiMenuItem } from "@mui/material";
import { Select } from "@madie/madie-design-system/dist/react";
import { TypeComponentProps } from "./TypeComponentProps";

const BooleanComponent = ({
  canEdit,
  fieldRequired,
  value,
  onChange,
  label,
}: TypeComponentProps) => {
  const booleanOptions = [
    <MuiMenuItem
      key={`boolean-True-${label}`}
      value={`True`}
      data-testid={`boolean-True-${label}`}
      defaultValue={`True`}
    >
      True
    </MuiMenuItem>,
    <MuiMenuItem
      key={`boolean-False-${label}`}
      value={`False`}
      data-testid={`boolean-False-${label}`}
    >
      False
    </MuiMenuItem>,
  ];

  return (
    <Select
      id={`boolean-selector-${label}`}
      inputProps={{
        "data-testid": `boolean-input-field-${label}`,
        "aria-describedby": `boolean-input-field-helper-text-${label}`,
      }}
      data-testid={`boolean-field-${label}`}
      disabled={!canEdit}
      SelectDisplayProps={{
        "aria-required": "true",
      }}
      value={value === "True" ? "True" : "False"}
      onChange={(event) => {
        onChange(event.target.value === "True");
      }}
      options={booleanOptions}
    ></Select>
  );
};

export default BooleanComponent;
