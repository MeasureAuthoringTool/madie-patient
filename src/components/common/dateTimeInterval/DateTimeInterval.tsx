import React from "react";
import { DateTimeField } from "@madie/madie-design-system/dist/react";
import { FormControl } from "@mui/material";
import "twin.macro";
import "styled-components/macro";
import { CQL } from "cqm-models";
import { getCQLDateTime, toDayJS } from "../dateTimeInput/DateTimeInput";

interface DateTimeIntervalProps {
  label: string;
  dateTimeInterval?: CQL.DateTimeInterval;
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
  const handleStartDateTimeChange = (newValue) => {
    const startDateTime = getCQLDateTime(
      newValue,
      dateTimeInterval?.low ? false : true
    );
    onDateTimeIntervalChange(
      {
        ...dateTimeInterval,
        low: startDateTime,
      },
      attributeName
    );
  };
  const handleEndDateTimeChange = (newValue) => {
    const endDateTime = getCQLDateTime(
      newValue,
      dateTimeInterval?.high ? false : true
    );
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
            dateTimeValue={toDayJS(dateTimeInterval?.low)}
          />
          <DateTimeField
            disabled={!canEdit}
            label={`${label} - End`}
            handleDateTimeChange={handleEndDateTimeChange}
            dateTimeValue={toDayJS(dateTimeInterval?.high)}
          />
        </div>
      </FormControl>
    </div>
  );
};

export default DateTimeInterval;
