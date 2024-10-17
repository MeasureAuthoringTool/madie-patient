import React from "react";
import { DateTimeField } from "@madie/madie-design-system/dist/react";
import dayjs from "dayjs";
import { CQL } from "cqm-models";
import utc from "dayjs/plugin/utc";
import { kebabCase } from "lodash";

dayjs.extend(utc);
dayjs.utc();
/**
 * Converts dayjs value to CQL DateTime.
 * @param value dayjs representation of the user entered dateTime.
 * @param wasNull Indicates whether previous value was null. Going from null to a value,
 *   use the dayjs value as opposed to making it utc, so it's relative to the local time.
 */
export const getCQLDateTime = (value, wasNull = false) => {
  if (!value) {
    // Clears out a populated field.
    return null;
  }
  const newDateTime = wasNull ? dayjs(value) : dayjs.utc(value);
  const newCQLDateTime: CQL.DateTime = new CQL.DateTime(
    newDateTime.year(),
    newDateTime.month() + 1,
    newDateTime.date(),
    newDateTime.hour(),
    newDateTime.minute(),
    newDateTime.second(),
    0,
    0
  );
  return newCQLDateTime;
};

export const toDayJS = (value) => {
  if (!value) {
    return null;
  }
  if (
    Date.parse(value) &&
    (value instanceof CQL.DateTime || value instanceof CQL.Date)
  ) {
    return dayjs.utc(value.toJSDate());
  }
  return dayjs.utc(value);
};

interface DateTimeInputProps {
  label: string;
  dateTime: any;
  onDateTimeChange: Function;
  canEdit: boolean;
  attributeName: string;
}

const DateTimeInput = ({
  label,
  dateTime,
  onDateTimeChange,
  canEdit,
  attributeName,
}: DateTimeInputProps) => {
  const handleDateTimeChange = (newValue, context) => {
    // Use MUI validation to identify complete dateTime entry.
    if (context?.validationError) {
      // Partial dateTime entry.
      return;
    }
    onDateTimeChange(getCQLDateTime(newValue, !dateTime), attributeName);
  };
  return (
    <DateTimeField
      id={kebabCase(label)}
      disabled={!canEdit}
      label={label}
      handleDateTimeChange={handleDateTimeChange}
      dateTimeValue={toDayJS(dateTime)}
    />
  );
};

export default DateTimeInput;
