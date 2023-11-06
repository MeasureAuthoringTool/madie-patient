import React, { useState } from "react";
import "twin.macro";
import "styled-components/macro";
import { FormControl } from "@mui/material";
import { TextField } from "@madie/madie-design-system/dist/react";
import { kebabCase } from "lodash";

export interface StringInputProps {
  label: string;
  fieldValue: string;
  canEdit: boolean;
  onStringValueChange: Function;
  required?: boolean;
  title?: string;
}

const StringInput = ({
  label,
  fieldValue,
  canEdit,
  onStringValueChange,
  required = false,
  title,
}: StringInputProps) => {
  const [field, setField] = useState<string>(fieldValue);

  const handleStringValueChange = (value: string) => {
    setField(value);
    onStringValueChange(value);
  };
  return (
    <div style={{ width: "134px" }}>
      <FormControl>
        <h4 className="header" tw="text-blue-800">
          {title}
        </h4>
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

export default StringInput;
