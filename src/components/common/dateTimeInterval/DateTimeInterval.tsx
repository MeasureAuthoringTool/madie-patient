import React from "react";
import { DateTimeField } from "@madie/madie-design-system/dist/react";
import { FormControl } from "@mui/material";
import "twin.macro";
import "styled-components/macro";
import { CQL } from "cqm-models";
import dayjs from "dayjs";

interface DateTimeIntervalProps {
  label: string;
  dateTimeInterval: CQL.DateTimeInterval;
  onDateTimeIntervalChange: Function;
  canEdit: boolean;
  attributeName: string;
}

const DateTimeInterval = ({
  label,
  dateTimeInterval,
  onDateTimeIntervalChange,
  canEdit,
  attributeName,
}: DateTimeIntervalProps) => {
  const getCQLDateTime = (value) => {
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
  const handleStartDateTimeChange = (newValue) => {
    const startDateTime = getCQLDateTime(newValue);
    onDateTimeIntervalChange(
      {
        ...dateTimeInterval,
        low: startDateTime,
      },
      attributeName
    );
  };
  const handleEndDateTimeChange = (newValue) => {
    const endDateTime = getCQLDateTime(newValue);
    onDateTimeIntervalChange(
      { ...dateTimeInterval, high: endDateTime },
      attributeName
    );
  };
  return (
    <div>
      <FormControl>
        <div tw="flex flex-row gap-8">
          <DateTimeField
            disabled={!canEdit}
            label={`${label} - Start`}
            handleDateTimeChange={handleStartDateTimeChange}
            dateTimeValue={dateTimeInterval?.low}
          />
          <DateTimeField
            disabled={!canEdit}
            label={`${label} - End`}
            handleDateTimeChange={handleEndDateTimeChange}
            dateTimeValue={dateTimeInterval?.high}
          />
        </div>
      </FormControl>
    </div>
  );
};

export default DateTimeInterval;
