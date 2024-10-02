import React, { useState, useEffect } from "react";
import { TypeComponentProps } from "./TypeComponentProps";
import { InputLabel, MenuItem as MuiMenuItem } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import advancedFormat from "dayjs/plugin/advancedFormat";
import {
  Select,
  DateField,
  TimeField,
} from "@madie/madie-design-system/dist/react";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
dayjs.utc().format();
const userTimeZone = dayjs.tz.guess();

interface MenuObj {
  value: string;
  label: string;
}
const options: MenuObj[] = [
  { value: "America/New_York", label: "EST" },
  { value: "America/Chicago", label: "CST" },
  { value: "America/Denver", label: "MST" },
  { value: "America/Los_Angeles", label: "PST" },
];

const offSets = [
  { id: "America/New_York - EST", value: "-05:00" },
  { id: "America/Chicago - CST", value: "-06:00" },
  { id: "America/Denver - MST", value: "-07:00" },
  { id: "America/Los_Angeles - PST", value: "-08:00" },
];

const findByLabel = (value) => {
  let result = "--";
  if (value && options) {
    options.forEach((opt) => {
      if (opt.label === value) {
        result = opt.value + " - " + opt.label;
      }
    });
  }
  return result;
};
const convertToStandardTime = (dayLightTime) => {
  return dayLightTime.add(-1, "hour");
};

const getOffSet = (value) => {
  let result = "-05:00";
  if (value) {
    offSets.forEach((opt) => {
      if (opt.id === value) {
        result = opt.value;
      }
    });
  }
  return result;
};

const DateTimeComponent = ({
  canEdit,
  fieldRequired,
  value,
  onChange,
  label = "DateTime",
  structureDefinition,
}: TypeComponentProps) => {
  const [date, setDate] = useState<string>();
  const [formattedDate, setFormattedDate] = useState("");
  const [time, setTime] = useState<string>();
  const [formattedTime, setFormattedTime] = useState("");
  const [timeZone, setTimeZone] = useState("");

  const DATE_TIME_ZONE_FORMAT = "YYYY-MM-DDTHH:mm:ss.000Z";
  const DATE_FORMAT = "YYYY-MM-DD";
  const TIME_FORMAT = "HH:mm:ss";

  useEffect(() => {
    let currentDate = new Date();
    if (value) {
      currentDate = new Date(value);
    }

    let converted = dayjs.utc(currentDate);
    const timezoneName = currentDate
      .toLocaleString("en-US", { timeZoneName: "short" })
      .split(", ")[1]
      ?.split(" ")[2]; // e.g., timezoneName = "CDT"

    if (timezoneName.includes("DT")) {
      converted = convertToStandartTime(converted).tz(userTimeZone);

      setTimeZone(findByLabel(timezoneName.replace("D", "S")));
    } else {
      setTimeZone(findByLabel(timezoneName));
    }
    setDate(converted.format(DATE_TIME_ZONE_FORMAT));
    setTime(converted.format(DATE_TIME_ZONE_FORMAT));
    setFormattedDate(converted.format(DATE_FORMAT));
    setFormattedTime(converted.format(TIME_FORMAT));
  }, [value]);

  const renderMenuItems = (options: MenuObj[]) => {
    return [
      ...options.map(({ value, label }) => (
        <MuiMenuItem
          key={`${label}-option`}
          value={`${value} - ${label}`}
          data-testid={`${label}-option`}
        >
          {label}
        </MuiMenuItem>
      )),
    ];
  };
  const findAndRenderLabel = (value) => {
    let result = "--";
    if (value && options) {
      options.forEach((opt) => {
        if (opt.value + " - " + opt.label === value) {
          result = opt.label;
        }
      });
    }
    return result;
  };

  const handleDateTimeChange = (date, time, offset) => {
    const dateTime = dayjs(date + "T" + time + ".000");
    const dateTimeStr = dateTime.format(DATE_TIME_ZONE_FORMAT).slice(0, 23);
    return dateTimeStr + offset;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <InputLabel>{label}</InputLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            columnGap: "32px",
            minWidth: "200px",
          }}
          data-testid="date-div"
        >
          <DateField
            label="Date Field"
            value={dayjs(date)}
            disabled={!canEdit}
            id="date-field"
            handleDateChange={(date) => {
              setDate(date);
              setFormattedDate(date?.format(DATE_FORMAT));
              const offset = getOffSet(timeZone);
              const changedDate = handleDateTimeChange(
                date?.format(DATE_FORMAT),
                formattedTime,
                offset
              );
              onChange(changedDate);
            }}
            onBlur={() => {}}
          />

          <div>
            <TimeField
              disabled={!canEdit}
              label="Time Field"
              id="time-field"
              seconds
              inputFormat="HH:mm:ss"
              views={["hours", "minutes", "seconds"]}
              data-testid="time-input"
              handleTimeChange={(time) => {
                setTime(time);
                setFormattedTime(time?.format(TIME_FORMAT));

                const offset = getOffSet(timeZone);
                const changedDate = handleDateTimeChange(
                  formattedDate,
                  time?.format(TIME_FORMAT),
                  offset
                );
                onChange(changedDate);
              }}
              value={dayjs(time)}
            />
          </div>
          <Select
            style={{ height: "38.125px", marginBottim: "2px" }}
            id={`timezone-selector-${label}`}
            label={`Zone`}
            inputProps={{
              "data-testid": `timezone-input-field-${label}`,
              "aria-describedby": `timezone-input-field-helper-text-${label}`,
            }}
            data-testid={`timezone-field-${label}`}
            disabled={!canEdit}
            SelectDisplayProps={{
              "aria-required": "true",
            }}
            value={timeZone ? timeZone : "America/New_York - EST"}
            options={renderMenuItems(options)}
            renderValue={(value) => {
              return findAndRenderLabel(value);
            }}
            onChange={(event) => {
              const newTimeZone = event.target.value;
              setTimeZone(newTimeZone);

              const offset = getOffSet(newTimeZone);
              const changedDate = handleDateTimeChange(
                formattedDate,
                formattedTime,
                offset
              );
              onChange(changedDate);
            }}
          ></Select>
        </div>
      </LocalizationProvider>
    </Box>
  );
};

export default DateTimeComponent;
