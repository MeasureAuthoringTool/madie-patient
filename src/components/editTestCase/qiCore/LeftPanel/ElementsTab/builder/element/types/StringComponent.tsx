import React from "react";
import { TypeComponentProps } from "./TypeComponentProps";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";

const StringComponent = ({
  value,
  onChange,
  fieldRequired,
}: TypeComponentProps) => {
  return (
    <TextField
      required={fieldRequired}
      disabled={false}
      id={`type-editor-`}
      inputProps={{
        "data-testid": `type-editor-testId`,
        "aria-describedby": "title-helper-text",
        required: fieldRequired,
        "aria-required": fieldRequired,
      }}
      size="small"
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default StringComponent;
