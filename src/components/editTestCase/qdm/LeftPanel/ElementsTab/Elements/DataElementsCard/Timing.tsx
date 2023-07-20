import React from "react";
import { DateTimeField } from "@madie/madie-design-system/dist/react";
import dayjs from "dayjs";
import DateTimeInterval from "../../../../../../common/dateTimeInterval/DateTimeInterval";

const Timing = ({
  canEdit,
  label,
  handleStartDateTimeChange,
  startDateTime,
  handleEndDateTimeChange,
  endDateTime,
  handleAuthorDateTimeChange,
  authorDateTime,
}) => {
  return (
    <div style={{ display: "flex" }}>
      <DateTimeInterval
        label={label}
        startDateTime={dayjs(startDateTime)}
        handleStartDateTimeChange={handleStartDateTimeChange}
        endDateTime={dayjs(endDateTime)}
        handleEndDateTimeChange={handleEndDateTimeChange}
        canEdit={canEdit}
      ></DateTimeInterval>

      <div style={{ paddingLeft: "32px" }}>
        <DateTimeField
          disabled={!canEdit}
          label={`Author Date/Time`}
          handleDateTimeChange={handleAuthorDateTimeChange}
          dateTimeValue={dayjs(authorDateTime)}
        ></DateTimeField>
      </div>
    </div>
  );
};

export default Timing;
