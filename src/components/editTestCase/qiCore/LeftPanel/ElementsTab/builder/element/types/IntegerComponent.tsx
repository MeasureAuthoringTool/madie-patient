import React, { useEffect, useState } from "react";
import { TextField } from "@madie/madie-design-system/dist/react/";
import "twin.macro";
import "styled-components/macro";
import { TypeComponentProps } from "./TypeComponentProps";

const IntegerComponent = ({
  canEdit,
  fieldRequired,
  value,
  onChange,
  label = "Integer",
  structureDefinition,
  unsignedInt = true,
}: TypeComponentProps) => {
  const POSITIVEINT_MINIMUM = 1;
  const POSITIVEINT_MAXIMUM = 2147483647;
  const UNSIGNED_MINIMUM = 0;
  const UNSIGNED_MAXIMUN = 2147483647;
  const [inputValue, setInputValue] = useState<string>(value ? value : "");
  const [error, setError] = useState<string>("");
  useEffect(() => {
    if (unsignedInt) {
      if (
        Number(value) < UNSIGNED_MINIMUM ||
        Number(value) > UNSIGNED_MAXIMUN
      ) {
        setError(
          `Unsigned integer range is [${UNSIGNED_MINIMUM} to ${UNSIGNED_MAXIMUN}]`
        );
      }
    } else {
      if (
        Number(value) < POSITIVEINT_MINIMUM ||
        Number(value) > POSITIVEINT_MAXIMUM
      ) {
        setError(
          `Positive integer range is [${POSITIVEINT_MINIMUM} to ${POSITIVEINT_MAXIMUM}]`
        );
      }
    }
  });
  return (
    <TextField
      required={fieldRequired}
      disabled={!canEdit}
      id={`integer-field-${label}`}
      label={`${label}`}
      inputProps={{
        "data-testid": `integer-field-input-${label}`,
        "aria-describedby": `integer-field-input-helper-text-${label}`,
        required: fieldRequired,
        "aria-required": fieldRequired,
      }}
      data-testid={`integer-field-${label}`}
      size="small"
      fullWidth
      value={inputValue}
      onKeyPress={(e) => {
        if (unsignedInt && !Number(e.key) && e.key != "0") {
          //when input . after 12, or - for unsigned integer
          e.preventDefault();
        } else if (!unsignedInt) {
          if (!inputValue && !Number(e.key) && e.key != "0") {
            e.preventDefault();
          } else if (
            inputValue?.includes("-") &&
            !Number(inputValue + e.key) &&
            !Number(e.key) &&
            e.key != "0"
          ) {
            //when inputting the last - after a negative number: -12-
            e.preventDefault();
          } else if (Number(inputValue) && !Number(e.key) && e.key !== "0") {
            //when inputting the last - after a positive number: 12-
            e.preventDefault();
          } else if (
            Number(inputValue + e.key) < POSITIVEINT_MINIMUM ||
            Number(inputValue + e.key) > POSITIVEINT_MAXIMUM
          ) {
            e.preventDefault();
          }
        } else {
          if (Number(inputValue + e.key) > UNSIGNED_MAXIMUN) {
            e.preventDefault();
          }
        }
      }}
      onChange={(e) => {
        const value = e.target.value;
        setInputValue(value.toString());
        if (!Number(value) && Number(value) != 0) {
          setError("Invalid format");
          return;
        } else {
          setError("");
        }
        if (unsignedInt) {
          if (
            Number(value) >= UNSIGNED_MINIMUM &&
            Number(value) <= UNSIGNED_MAXIMUN
          ) {
            onChange(Number(value));
          } else {
            setError(
              `Unsigned integer range is [${UNSIGNED_MINIMUM} to ${UNSIGNED_MAXIMUN}]`
            );
          }
        } else {
          if (
            Number(value) >= POSITIVEINT_MINIMUM &&
            Number(value) <= POSITIVEINT_MAXIMUM
          ) {
            onChange(Number(value));
          } else {
            setError(
              `Positive integer range is [${POSITIVEINT_MINIMUM} to ${POSITIVEINT_MAXIMUM}]`
            );
          }
        }
      }}
      error={error}
      helperText={error}
    />
  );
};

export default IntegerComponent;
