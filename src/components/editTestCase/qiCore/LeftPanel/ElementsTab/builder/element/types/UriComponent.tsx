import React from "react";
import { TypeComponentProps } from "./TypeComponentProps";
import Box from "@mui/material/Box";
import { TextField } from "@madie/madie-design-system/dist/react/";

const UriComponent = ({
  canEdit,
  fieldRequired,
  value,
  onChange,
  label = "URI",
  structureDefinition,
}: TypeComponentProps) => {
  return (
    <TextField
      required={fieldRequired}
      disabled={!canEdit}
      id={`uri-filed-${label}`}
      label={label}
      placeholder={label}
      inputProps={{
        "data-testid": `uri-input-field-${label}`,
        "aria-describedby": `uri-input-field-helper-text-${label}`,
        required: fieldRequired,
        "aria-required": fieldRequired,
      }}
      data-testid={`uri-field-${label}`}
      test-dd
      size="small"
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default UriComponent;
