import React, { useState } from "react";
import DateTimeInput from "../../../../../../../common/dateTimeInput/DateTimeInput";
import DateTimeInterval from "../../../../../../../common/dateTimeInterval/DateTimeInterval";
import { CQL } from "cqm-models";
import "./Timing.scss";
import { PRIMARY_TIMING_ATTRIBUTES } from "../../../../../../../../util/QdmAttributeHelpers";
import * as _ from "lodash";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { InputLabel } from "@mui/material";
import { labelStyle } from "./TimingStyles";

const Timing = ({ canEdit, onChange, selectedDataElement }) => {
  const handleChange = (newValue, attributeName) => {
    selectedDataElement.set(attributeName, newValue);
    onChange(selectedDataElement);
  };

  const dateFormatToDisplay = (date) => {
    if (date) {
      const currentDate = dayjs();
      const dayjsDate = dayjs(currentDate)
        .set("year", date?.year)
        .set("month", date?.month)
        .set("date", date?.day);
      return dayjsDate;
    }
    return;
  };

  const displayTiming = () => {
    const displayTimingArray = [];
    for (const attr of PRIMARY_TIMING_ATTRIBUTES) {
      const timingAttr = selectedDataElement?.schema?.paths?.[attr];
      if (timingAttr) {
        if (timingAttr.instance == "Interval") {
          displayTimingArray.push(
            <div style={{ paddingRight: "30px", paddingBottom: "12px" }}>
              <DateTimeInterval
                label={_.startCase(timingAttr.path)}
                dateTimeInterval={selectedDataElement.get(timingAttr.path)}
                onDateTimeIntervalChange={handleChange}
                canEdit={canEdit}
                attributeName={timingAttr.path}
              />
            </div>
          );
        } else if (timingAttr.instance == "DateTime") {
          displayTimingArray.push(
            <div style={{ paddingRight: "30px", paddingBottom: "12px" }}>
              <DateTimeInput
                label={_.startCase(timingAttr.path)}
                canEdit={canEdit}
                dateTime={selectedDataElement.get(timingAttr.path)}
                onDateTimeChange={handleChange}
                attributeName={timingAttr.path}
              ></DateTimeInput>
            </div>
          );
        } else if (timingAttr.instance === "Date") {
          displayTimingArray.push(
            <div style={{ paddingRight: "30px" }}>
              <InputLabel
                htmlFor={"date-picker"}
                style={{ marginBottom: 8, height: 16 }} // force a heignt
                sx={labelStyle}
              >
                {_.startCase(timingAttr.path)}
              </InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="datePicker"
                  disabled={!canEdit}
                  value={
                    dateFormatToDisplay(
                      selectedDataElement.get(timingAttr.path)
                    ) || null
                  }
                  onChange={(newValue: any) => {
                    const newDate = new CQL.Date(
                      newValue.$y,
                      newValue.$M + 1,
                      newValue.$D
                    );
                    handleChange(newDate, timingAttr.path);
                  }}
                />
              </LocalizationProvider>
            </div>
          );
        }
      }
    }

    return displayTimingArray;
  };

  return (
    <>
      <h4>Timing</h4>
      <div className="box">{displayTiming()}</div>
    </>
  );
};

export default Timing;
