import React from "react";
import PropTypes from "prop-types";
import { DateTimeField } from "@madie/madie-design-system/dist/react";
import { FormControl } from "@mui/material";

interface DateTimeIntervalProps {
  label: string;
  startDateTime: object;
  handleStartDateTimeChange: Function;
  endDateTime: object;
  handleEndDateTimeChange: Function;
}

const DateTimeInterval = ({
  label,
  startDateTime,
  handleStartDateTimeChange,
  endDateTime,
  handleEndDateTimeChange,
}: DateTimeIntervalProps) => {
  return (
    <div>
      <FormControl
        style={{ display: "flex", gap: "40px", flexDirection: "row" }}
      >
        <div>
          <DateTimeField
            label={`${label} - Start`}
            handlDateTimeChange={handleStartDateTimeChange}
            dateTimeValue={startDateTime}
          />
        </div>

        <div>
          <DateTimeField
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
