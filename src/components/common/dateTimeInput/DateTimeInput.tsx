import React from "react";
import { DateTimeField } from "@madie/madie-design-system/dist/react";
import dayjs from "dayjs";
import { CQL } from "cqm-models";

export const getCQLDateTime = (value) => {
  const newDateTime = dayjs.utc(value);
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

interface DateTimeInputProps {
  label: string;
  dateTime: object;
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
  const handleDateTimeChange = (newValue) => {
    if (newValue.$D) {
      onDateTimeChange(getCQLDateTime(newValue), attributeName);
    } else {
      onDateTimeChange(null);
    }
  };

  return (
    <DateTimeField
      disabled={!canEdit}
      label={`${label}`}
      handleDateTimeChange={handleDateTimeChange}
      dateTimeValue={dateTime}
    />
  );
};

export default DateTimeInput;
