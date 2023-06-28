import React, { useState } from "react";
import { InputLabel } from "@madie/madie-design-system/dist/react/";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import * as ucum from "@lhncbc/ucum-lhc";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export interface UCUM {
  label: string;
  value: ucum;
}

export const textFieldStyle = {
  borderRadius: "3px",
  height: 40,
  width: 100,
  border: "1px solid #DDDDDD",
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "3px",
    "& legend": {
      width: 0,
    },
  },
  "& .MuiOutlinedInput-root": {
    "&&": {
      borderRadius: "3px",
    },
  },
  "& .MuiInputBase-input": {
    color: "#333",
    fontFamily: "Rubik",
    fontSize: 14,
    borderRadius: "3px",
    padding: "9px 5px 9px 5px",
    "&::placeholder": {
      opacity: 1,
      color: "#717171",
      fontFamily: "Rubik",
      fontSize: 14,
      padding: "9px 5px 9px 5px",
    },
  },
};
export interface QuantityProps {
  quantityValue: number;
  quantityUnit: any;
  handleQuantityValueChange: Function;
  handleQuantityUnitChange: Function;
  options?: any;
  canEdit: boolean;
  placeholder: string;
  label: string;
}

const Quantity = ({
  quantityValue,
  quantityUnit,
  handleQuantityValueChange,
  handleQuantityUnitChange,
  options,
  canEdit,
  placeholder,
  label,
}: QuantityProps) => {
  const autoCompleteStyles = {
    borderRadius: "3px",
    minHeight: "40px",
    border: "1px solid #DDDDDD",
    width: 124,
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: "3px",
      "& legend": {
        width: 0,
      },
    },
    "& .MuiAutocomplete-inputFocused": {
      border: "none",
      boxShadow: "none",
      outline: "none",
    },
    "& .MuiAutocomplete-inputRoot": {
      paddingTop: 0,
      paddingBottom: 0,
      backgroundColor: !canEdit ? "#EDEDED" : "",
    },
  };

  const removeSpecificChars = (string) => {
    return string.trim().replace("-", "").replace(".", "");
  };

  const parsedValue = quantityUnit?.value || null;
  const parsedLabel = quantityUnit?.label || null;
  const [selected, setSelected] = useState<UCUM>({
    label: parsedLabel,
    value: parsedValue,
  });
  const [value, setValue] = useState<number>(quantityValue);

  interface Option {
    name: string;
    code: string;
    guidance: string;
    system: string;
  }

  return (
    <div>
      <div>
        <FormControl>
          <InputLabel
            id="quantity-value-label"
            data-testid={`quantity-value-label-${label}`}
            required={false}
          >
            Value
          </InputLabel>
          <TextField
            value={value}
            sx={textFieldStyle}
            disabled={!canEdit}
            label=""
            id={`quantity-value-field-${label}`}
            data-testid={`quantity-value-field-${label}`}
            inputProps={{
              "data-testid": `quantity-value-input-${label}`,
              "aria-describedby": `quantity-value-input-helper-text-${label}`,
              required: true,
            }}
            onChange={(event) => {
              setValue(parseInt(event.target.value));
              handleQuantityValueChange(event.target.value);
            }}
          />
        </FormControl>
        <FormControl>
          <InputLabel
            id={`quantity-unit-dropdown-label-${label}`}
            data-testid={`quantity-unit-dropdown-label-${label}`}
            required={false}
          >
            Unit
          </InputLabel>
          <Autocomplete
            fullWidth={true}
            disabled={!canEdit}
            options={options}
            data-testid={`quantity-unit-dropdown-${label}`}
            popupIcon={<KeyboardArrowDownIcon sx={{ color: "#1C2556" }} />}
            sx={autoCompleteStyles}
            value={selected.value}
            getOptionLabel={(option: Option): string =>
              `${option.code} ${option.name}`
            }
            disablePortal
            limitTags={10}
            filterOptions={(options, state): any[] => {
              const { inputValue } = state;
              if (inputValue) {
                const input = removeSpecificChars(inputValue);
                const filteredOptions = options.filter((opt: Option) => {
                  const match = removeSpecificChars(`${opt.code} ${opt.name}`);
                  return match.includes(input);
                });
                return filteredOptions;
              }
              return [];
            }}
            onChange={(event: any, values: any, reason: string) => {
              if (values) {
                const label = `${values.code} ${values.name}`;
                const transformedResult = {
                  label,
                  value: values,
                };
                setSelected(transformedResult);
                handleQuantityUnitChange(transformedResult);
              } else {
                handleQuantityUnitChange("");
              }
            }}
            autoHighlight={true}
            id="quantity-unit-dropdown"
            renderInput={(params) => {
              const { inputProps } = params;
              inputProps["aria-labelledby"] = "scoring-unit-dropdown-label";
              return (
                <TextField
                  {...params}
                  data-testid={`quantity-unit-text-input-${label}`}
                  inputProps={inputProps}
                  disabled={!canEdit}
                  sx={{
                    input: {
                      color: "#333",
                      "&::placeholder": {
                        opacity: 1,
                        color: "#717171",
                      },
                    },
                  }}
                  placeholder={placeholder}
                  value={
                    quantityUnit
                      ? `${quantityUnit.code} ${quantityUnit.name}`
                      : ""
                  }
                />
              );
            }}
          />
        </FormControl>
      </div>
    </div>
  );
};

export default Quantity;
