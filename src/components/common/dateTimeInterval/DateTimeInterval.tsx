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
      <FormControl>
        <div tw="flex flex-row gap-8">
          <DateTimeField
            disabled={!canEdit}
            label={`${label} - Start`}
            handleDateTimeChange={handleStartDateTimeChange}
            dateTimeValue={startDateTime}
          />
          <DateTimeField
            disabled={!canEdit}
            label={`${label} - End`}
            handleDateTimeChange={handleEndDateTimeChange}
            dateTimeValue={endDateTime}
          />
        </div>
      </FormControl>
    </div>
  );
};

export default DateTimeInterval;
