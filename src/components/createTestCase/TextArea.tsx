import React from "react";
import { InputLabel } from "@madie/madie-design-system/dist/react";
import {
  FormControl,
  FormHelperText,
  TextField as MUITextField,
} from "@mui/material";

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
      <div
        style={{
          width: 1,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      />
      <InputLabel
        disabled={disabled}
        shrink
        required={required}
        error={error}
        htmlFor={id}
        style={{ marginBottom: 0, height: 16 }} // force a heignt
        sx={[
          {
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "row-reverse",
            alignSelf: "baseline",
            textTransform: "none",
            // force it outside the select box
            position: "initial",
            transform: "translateX(0px) translateY(0px)",
            fontFamily: "Rubik",
            fontWeight: 500,
            fontSize: 14,
            color: "#333",
            "& .MuiInputLabel-asterisk": {
              color: "#AE1C1C !important",
              marginRight: "3px !important", //this was
            },
          },
          required && {
            transform: "translateX(-12px) translateY(0px)",
            "& .MuiInputLabel-asterisk": {
              color: "#D92F2",
              marginRight: "3px !important", //this was
            },
          },
          disabled && {
            color: "rgba(0,0,0,0.6)",
          },
          error && {
            color: "#AE1C1C !important",
          },
        ]}
      >
        {label}
      </InputLabel>
      {helperText && (
        <FormHelperText
          tabIndex={0}
          aria-live="polite"
          id={`${id}-helper-text`}
          data-testid={`${id}-helper-text`}
          sx={[
            {
              margin: "4px 0px 0px 0px",
              color: "#515151",
              lineHeight: 1,
            },
            error && {
              color: "#AE1C1C !important",
            },
          ]}
        >
          {helperText}
        </FormHelperText>
      )}
      <MUITextField
        multiline
        sx={{
          // resize: "vertical",
          borderRadius: "3px",
          height: "auto",
          border: "1px solid #DDDDDD",
          marginTop: "8px",
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
          },
          // input base selector
          "& .MuiInputBase-input": {
            color: "#333",
            resize: "vertical",
            minHeight: "95px",
            fontFamily: "Rubik",
            fontSize: 14,
            borderRadius: "3px",
            padding: "9px 14px",
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
    </FormControl>
  );
};

export default TextArea;
