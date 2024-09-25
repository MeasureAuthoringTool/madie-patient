import React from "react";
import "styled-components/macro";
import { DateField } from "@madie/madie-design-system/dist/react";
import { TypeComponentProps } from "./TypeComponentProps";

const DateComponent = ({
  canEdit,
  fieldRequired,
  value,
  onChange,
  label = "Date",
  structureDefinition,
}: TypeComponentProps) => {
  const DATE_FORMAT = "YYYY-MM-DD";

  return (
    <DateField
      required={fieldRequired}
      disabled={!canEdit}
      id={`date-field-${label}`}
      label={label}
      handleDateChange={(date) => {
        const formatted = date?.format(DATE_FORMAT);
        onChange(formatted);
      }}
      inputProps={{
        "data-testid": `date-input-field-${label}`,
        "aria-describedby": `date-input-field-helper-text-${label}`,
        required: fieldRequired,
        "aria-required": fieldRequired,
      }}
      data-testid={`date-field-${label}`}
      value={value}
      textFieldSx={{ width: "100%" }}
      onBlur={() => {}}
    />
  );
};

export default DateComponent;
