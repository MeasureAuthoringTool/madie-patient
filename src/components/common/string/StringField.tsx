import React, { useState } from "react";
import { InputLabel } from "@madie/madie-design-system/dist/react/";
import { FormControl } from "@mui/material";
import { TextField } from "@madie/madie-design-system/dist/react";
import { kebabCase } from "lodash";

const labelStyle = {
  color: "#125496",
};

export interface StringFieldProps {
  label: string;
  fieldValue: string;
  canEdit: boolean;
  required?: boolean;
}

const StringField = ({
  label,
  fieldValue,
  canEdit,
  required = false,
}: StringFieldProps) => {
  const [field, setField] = useState<string>(fieldValue);
  return (
    <div style={{ width: "134px" }}>
      <FormControl>
        <InputLabel
          id="string-field-label"
          data-testid="string-field-label"
          required={required}
          sx={labelStyle}
        >
          {label}
        </InputLabel>
        <TextField
          disabled={!canEdit}
          label={kebabCase(label)}
          placeholder=""
          id={`string-field-${label}`}
          data-testid={`string-field-${label}`}
          inputProps={{
            "data-testid": `string-field-${label}-input`,
            "aria-describedby": `string-field-${label}input-helper-text`,
            required: { required },
          }}
          size="small"
          onChange={(event) => {
            setField(event.target.value);
          }}
          value={field}
        />
      </FormControl>
    </div>
  );
};

export default StringField;
