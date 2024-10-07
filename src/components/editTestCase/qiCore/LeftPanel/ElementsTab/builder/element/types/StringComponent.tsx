import React from "react";
import { TypeComponentProps } from "./TypeComponentProps";
import { TextField } from "@madie/madie-design-system/dist/react";

const StringComponent = ({
  canEdit,
  fieldRequired,
  value,
  onChange,
  label = "VALUE",
  structureDefinition,
}: TypeComponentProps) => {
  return (
    <TextField
      required={fieldRequired}
      disabled={!canEdit}
      id={`string-field-${label}`}
      label={`> ${label}`}
      labelColor="#1976d2"
      inputProps={{
        "data-testid": `string-field-input-${label}`,
        "aria-describedby": `string-field-input-helper-text-${label}`,
        required: fieldRequired,
        "aria-required": fieldRequired,
      }}
      data-testid={`string-field-${label}`}
      size="small"
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={(event) => {
        const filteredValue = event.key?.replace(/[^a-zA-Z]/g, "");
        if (!filteredValue) {
          event.preventDefault();
        }
      }}
    />
  );
};

export default StringComponent;
