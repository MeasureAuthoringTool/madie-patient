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
  onStringValueChange: Function;
  required?: boolean;
}

const StringField = ({
  label,
  fieldValue,
  canEdit,
  onStringValueChange,
  required = false,
}: StringFieldProps) => {
  const [field, setField] = useState<string>(fieldValue);

  const handleStringValueChange = (value: string) => {
    setField(value);
    onStringValueChange(value);
  };
  return (
    <div style={{ width: "134px" }}>
      <FormControl>
        <TextField
          disabled={!canEdit}
          label={label}
          placeholder={label}
          id={`string-field-${kebabCase(label)}`}
          data-testid={`string-field-${kebabCase(label)}`}
          inputProps={{
            "data-testid": `string-field-${kebabCase(label)}-input`,
            "aria-describedby": `string-field-${kebabCase(
              label
            )}input-helper-text`,
            required: { required },
          }}
          size="small"
          onChange={(event) => {
            handleStringValueChange(event.target.value);
          }}
          value={field}
        />
      </FormControl>
    </div>
  );
};

export default StringField;
