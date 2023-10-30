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
  canEdit: boolean;
  attributeName: string;
  displayAttributeName?: boolean;
}

const DateTimeInterval = ({
  label,
  dateTimeInterval,
  onDateTimeIntervalChange,
  canEdit,
  attributeName,
  displayAttributeName = false,
}: DateTimeIntervalProps) => {
  const handleStartDateTimeChange = (newValue) => {
    onDateTimeIntervalChange(
      {
        ...dateTimeInterval,
        low: newValue,
      },
      attributeName
    );
  };
  const handleEndDateTimeChange = (newValue) => {
    onDateTimeIntervalChange(
      { ...dateTimeInterval, high: newValue },
      attributeName
    );
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
