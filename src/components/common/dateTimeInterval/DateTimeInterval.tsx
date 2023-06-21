import React from "react";
import { DateTimeField } from "@madie/madie-design-system/dist/react";
import { FormControl } from "@mui/material";
import "twin.macro";
import "styled-components/macro";

interface DateTimeIntervalProps {
  label: string;
  startDateTime: object;
  handleStartDateTimeChange: Function;
  endDateTime: object;
  handleEndDateTimeChange: Function;
  canEdit: boolean;
}

const DateTimeInterval = ({
  label,
  startDateTime,
  handleStartDateTimeChange,
  endDateTime,
  handleEndDateTimeChange,
  canEdit,
}: DateTimeIntervalProps) => {
  return (
    <div>
      <h5 tw="text-blue-800 mb-2">Time Range</h5>
      <FormControl>
        <div tw="flex flex-row gap-8">
          <DateTimeField
            disabled={!canEdit}
            label={`${label} - Start`}
            handlDateTimeChange={handleStartDateTimeChange}
            dateTimeValue={startDateTime}
          />
          <DateTimeField
            disabled={!canEdit}
            label={`${label} - End`}
            handlDateTimeChange={handleEndDateTimeChange}
            dateTimeValue={endDateTime}
          />
        </div>
      </FormControl>
    </div>
  );
};

export default DateTimeInterval;
