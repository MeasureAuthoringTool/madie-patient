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

interface MenuObj {
  value: string;
  label: string;
}
const options: MenuObj[] = [
  { value: "America/Puerto_Rico", label: "AST" },
  { value: "America/New_York", label: "EST" },
  { value: "America/Chicago", label: "CST" },
  { value: "America/Denver", label: "MST" },
  { value: "America/Los_Angeles", label: "PST" },
  { value: "America/Anchorage", label: "AKST" },
  { value: "America/honolulu", label: "HST" },
  { value: "America/American_Samoa", label: "WST" },
  { value: "America/Saipan", label: "CHST" },
];

const offSets = [
  { id: "America/Puerto_Rico - AST", value: "-04:00" },
  { id: "America/New_York - EST", value: "-05:00" },
  { id: "America/Chicago - CST", value: "-06:00" },
  { id: "America/Denver - MST", value: "-07:00" },
  { id: "America/Los_Angeles - PST", value: "-08:00" },
  { id: "America/Anchorage - AKST", value: "-09:00" },
  { id: "America/honolulu - HST", value: "-10:00" },
  { id: "America/American_Samoa - WST", value: "-11:00" },
  { id: "America/Saipan - CHST", value: "+10:00" },
];

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

const findByOffSet = (value) => {
  let result = "America/New_York - EST";
  if (value) {
    offSets.forEach((opt) => {
      if (opt.value === value) {
        result = opt.id;
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
  const [time, setTime] = useState<string>();
  const [formattedTime, setFormattedTime] = useState("");
  const [timeZone, setTimeZone] = useState("");

  const DATE_TIME_ZONE_FORMAT = "YYYY-MM-DDTHH:mm:ss.000Z";
  const DATE_FORMAT = "YYYY-MM-DD";
  const TIME_FORMAT = "HH:mm:ss";

  useEffect(() => {
    if (value) {
      const zone = value.slice(-6);

      setDate(value.slice(0, 10));
      const formattedDate = dayjs(value)
        .utcOffset(zone)
        .format("YYYY-MM-DDTHH:mm:ss");
      setTime(formattedDate);
      setFormattedTime(value.slice(11, 19));
      setTimeZone(findByOffSet(zone));
    }
  }, []);

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
    if (date) {
      const dateTime = dayjs(date + "T" + time + ".000");
      const dateTimeStr = dateTime.format(DATE_TIME_ZONE_FORMAT).slice(0, 23);
      return dateTimeStr + offset;
    }
    return null;
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
            value={date ? dayjs(date) : null}
            disabled={!canEdit}
            id="date-field"
            handleDateChange={(date) => {
              setDate(date?.format(DATE_FORMAT));
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
              views={["hours", "minutes", "seconds"]}
              data-testid="time-input"
              handleTimeChange={(time) => {
                setTime(time);
                setFormattedTime(time?.format(TIME_FORMAT));

                const offset = getOffSet(timeZone);
                const changedDate = handleDateTimeChange(
                  date,
                  time?.format(TIME_FORMAT),
                  offset
                );
                onChange(changedDate);
              }}
              value={time ? dayjs(time) : null}
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
            value={value ? timeZone : null}
            options={renderMenuItems(options)}
            renderValue={(value) => {
              return findAndRenderLabel(value);
            }}
            onChange={(event) => {
              const newTimeZone = event.target.value;
              setTimeZone(newTimeZone);
              const offset = getOffSet(newTimeZone);
              const changedDate = handleDateTimeChange(
                date,
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
