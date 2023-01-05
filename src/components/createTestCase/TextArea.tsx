import React from "react";
import { InputLabel } from "@madie/madie-design-system/dist/react";
import { FormControl, TextField as MUITextField } from "@mui/material";

const TextArea = ({
  id,
  error = false,
  helperText = undefined,
  required = false,
  disabled = false,
  readOnly = false,
  label,
  ...rest
}) => {
  return (
    <FormControl fullWidth error={error}>
      <InputLabel
        disabled={disabled}
        shrink
        required={required}
        error={error}
        htmlFor={id}
      >
        {label}
      </InputLabel>
      <MUITextField
        multiline
        sx={{
          borderRadius: "3px",
          height: "auto",
          // remove weird line break from legend
          "& .MuiOutlinedInput-notchedOutline": {
            borderRadius: "3px",
            "& legend": {
              width: 0,
            },
          },
          "& .MuiOutlinedInput-root": {
            padding: 0,
            "&&": {
              borderRadius: "3px",
            },
            borderWidth: "1px",
          },
          // input base selector
          "& .MuiInputBase-input": {
            resize: "vertical",
            minHeight: "95px",
            fontFamily: "Rubik",
            fontSize: 14,
            borderRadius: "3px",
            padding: "9px 14px",
            opacity: 1,
            color: "#333",
            "&::placeholder": {
              opacity: 1,
              color: "#717171",
            },
          },
        }}
        label={null}
        error={error}
        disabled={disabled}
        id={id}
        required={required}
        InputProps={{
          readOnly: readOnly,
        }}
        {...rest}
      />
      {helperText && helperText}
    </FormControl>
  );
};

export default TextArea;
