import React from "react";
import { FormControl } from "@mui/material";
import "twin.macro";
import "styled-components/macro";
import { CQL } from "cqm-models";
import DateTimeInput from "../dateTimeInput/DateTimeInput";

interface DateTimeIntervalProps {
  label: string;
  dateTimeInterval?: CQL.DateTimeInterval;
  onDateTimeIntervalChange: Function;
  attributeName: string;
  canEdit: boolean;
  displayAttributeName?: boolean;
}

const DateTimeInterval = ({
  canEdit,
  label,
  dateTimeInterval,
  onDateTimeIntervalChange,
  attributeName,
  displayAttributeName,
}: DateTimeIntervalProps) => {
  const handleStartDateTimeChange = (newValue) => {
    if (
      (newValue === null || newValue === undefined) &&
      !dateTimeInterval.high
    ) {
      onDateTimeIntervalChange(null, attributeName);
    } else {
      onDateTimeIntervalChange(
        {
          ...dateTimeInterval,
          low: newValue,
        },
        attributeName
      );
    }
  };
  const handleEndDateTimeChange = (newValue) => {
    if (
      (newValue === null || newValue === undefined) &&
      !dateTimeInterval.low
    ) {
      onDateTimeIntervalChange(null, attributeName);
    } else {
      onDateTimeIntervalChange(
        { ...dateTimeInterval, high: newValue },
        attributeName
      );
    }
  };
  return (
    <div>
      <FormControl>
        {displayAttributeName && (
          <h4 className="header" tw="text-blue-800">
            {attributeName}
          </h4>
        )}

        <div tw="flex flex-row gap-8">
          <DateTimeInput
            canEdit={canEdit}
            label={`${label} - Start`}
            attributeName={attributeName}
            onDateTimeChange={handleStartDateTimeChange}
            dateTime={dateTimeInterval?.low}
          />
          <DateTimeInput
            canEdit={canEdit}
            label={`${label} - End`}
            attributeName={attributeName}
            onDateTimeChange={handleEndDateTimeChange}
            dateTime={dateTimeInterval?.high}
          />
        </div>
      </FormControl>
    </div>
  );
};

export default DateTimeInterval;
