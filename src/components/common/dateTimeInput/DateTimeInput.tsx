import React from "react";
import { DateTimeField } from "@madie/madie-design-system/dist/react";
import dayjs from "dayjs";
import { CQL } from "cqm-models";
import utc from "dayjs/plugin/utc";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.extend(utc);
dayjs.utc();

export const getCQLDateTime = (value, first = false) => {
  const newDateTime = first ? dayjs(value) : dayjs.utc(value);
  console.log(first)
  const newCQLDateTime: CQL.DateTime = new CQL.DateTime(
    newDateTime.year(),
    newDateTime.month() + 1,
    newDateTime.date(),
    newDateTime.hour(),
    newDateTime.minute(),
    newDateTime.second(),
    0,
    0,
  );
  console.log(newCQLDateTime)
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
  utcConvert? :boolean;
}

const DateTimeInput = ({
  label,
  dateTime,
  onDateTimeChange,
  canEdit,
  attributeName,
  utcConvert=false,
}: DateTimeInputProps) => {
  const handleDateTimeChange = (newValue) => {
    console.log(dateTime)
    onDateTimeChange(
      getCQLDateTime(newValue, utcConvert ? false : true),
      attributeName
    );
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimeField
        disabled={!canEdit}
        label={label}
        handleDateTimeChange={handleDateTimeChange}
        dateTimeValue={toDayJS(dateTime)}
      />
    </LocalizationProvider>
  );
};

export default DateTimeInput;
