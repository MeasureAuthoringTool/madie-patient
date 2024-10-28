import React, { useEffect, useState } from "react";
import { TextField } from "@madie/madie-design-system/dist/react/";
import "twin.macro";
import "styled-components/macro";
import { TypeComponentProps } from "./TypeComponentProps";

export enum IntegerType {
  UNSIGNED = "Unsigned",
  SIGNED = "Signed",
  POSITIVE_INT = "PositiveInt",
}

interface IntegerComponentProps extends TypeComponentProps {
  integerType: IntegerType;
}

const IntegerComponent = ({
  canEdit,
  fieldRequired,
  value,
  onChange,
  label = "Integer",
  structureDefinition,
  integerType,
}: IntegerComponentProps) => {
  const POSITIVEINT_MINIMUM = 1;
  const POSITIVEINT_MAXIMUM = 2147483647;
  const UNSIGNED_MINIMUM = 0;
  const UNSIGNED_MAXIMUN = 2147483647;
  const SIGNED_MINIMUM = -2147483648;
  const SIGNED_MAXIMUN = 2147483647;
  const [inputValue, setInputValue] = useState<string>(value ? value : "");
  const [error, setError] = useState<string>("");
  useEffect(() => {
    if (integerType === IntegerType.UNSIGNED) {
      if (
        Number(value) < UNSIGNED_MINIMUM ||
        Number(value) > UNSIGNED_MAXIMUN
      ) {
        setError(
          `Unsigned integer range is [${UNSIGNED_MINIMUM} to ${UNSIGNED_MAXIMUN}]`
        );
      }
    } else if (integerType === IntegerType.POSITIVE_INT) {
      if (
        Number(value) < POSITIVEINT_MINIMUM ||
        Number(value) > POSITIVEINT_MAXIMUM
      ) {
        setError(
          `Positive integer range is [${POSITIVEINT_MINIMUM} to ${POSITIVEINT_MAXIMUM}]`
        );
      }
    } else {
      if (Number(value) < SIGNED_MINIMUM || Number(value) > SIGNED_MAXIMUN) {
        setError(
          `Signed integer range is [${SIGNED_MINIMUM} to ${SIGNED_MAXIMUN}]`
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
        if (
          integerType !== IntegerType.SIGNED &&
          !Number(e.key) &&
          e.key != "0"
        ) {
          //when input . after 12, or - for unsigned integer
          e.preventDefault();
        } else if (integerType === IntegerType.SIGNED) {
          if (!inputValue && !Number(e.key) && e.key != "0" && e.key != "-") {
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
            Number(inputValue + e.key) < SIGNED_MINIMUM ||
            Number(inputValue + e.key) > SIGNED_MAXIMUN
          ) {
            e.preventDefault();
          }
        } else {
          if (integerType === IntegerType.UNSIGNED) {
            if (Number(inputValue + e.key) > UNSIGNED_MAXIMUN) {
              e.preventDefault();
            }
          } else {
            if (Number(inputValue + e.key) > POSITIVEINT_MAXIMUM) {
              e.preventDefault();
            }
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
        if (integerType === IntegerType.UNSIGNED) {
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
        } else if (integerType === IntegerType.POSITIVE_INT) {
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
        } else {
          if (
            Number(value) >= SIGNED_MINIMUM &&
            Number(value) <= SIGNED_MAXIMUN
          ) {
            onChange(Number(value));
          } else {
            setError(
              `Signed integer range is [${SIGNED_MINIMUM} to ${SIGNED_MAXIMUN}]`
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
