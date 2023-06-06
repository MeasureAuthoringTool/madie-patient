import React from "react";
import PropTypes from "prop-types";
import { DateTimeField } from "@madie/madie-design-system/dist/react";
import { FormControl } from "@mui/material";

const DateTimeInterval = ({
  label,
  startDateTime,
  handleStartDateTimeChange,
  endDateTime,
  handleEndDateTimeChange,
}) => {
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

DateTimeInterval.propTypes = {
  startDateTime: PropTypes.object,
  endDateTime: PropTypes.object,
  handleStartDateTimeChange: PropTypes.func.isRequired,
  handleEndDateTimeChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default DateTimeInterval;
