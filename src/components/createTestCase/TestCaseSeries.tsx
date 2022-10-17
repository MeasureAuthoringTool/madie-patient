import React from "react";
import { TextField } from "@mui/material";
import * as _ from "lodash";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

export interface TestCaseSeriesProps {
  value: string;
  onChange: (nextValue: string) => void;
  seriesOptions?: string[];
  sx: any;
}

const TestCaseSeries = ({
  value,
  onChange,
  seriesOptions = [],
  sx,
}: TestCaseSeriesProps) => {
  const cleanedOptions = _.isArray(seriesOptions)
    ? seriesOptions.filter((o) => !_.isNil(o) && o.trim().length > 0)
    : [];

  return (
    <Autocomplete
      freeSolo
      clearOnBlur
      value={value}
      onChange={(event, newValue) => {
        event.preventDefault();
        if (_.isNil(newValue)) {
          onChange(null);
          return;
        }

        const v = newValue?.inputValue || newValue;
        const existingOption = cleanedOptions.find(
          (s) => s?.trim().toUpperCase() === v?.trim().toUpperCase()
        );
        _.isNil(existingOption) ? onChange(v) : onChange(existingOption);
      }}
      sx={sx}
      renderInput={(params) => (
        <TextField
          {...params}
          inputProps={{ ...params.inputProps, maxLength: 250 }}
          data-testid="create-test-case-series"
          placeholder="Start typing or select"
        />
      )}
      options={cleanedOptions}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) =>
            inputValue.trim().toUpperCase() === option?.trim().toUpperCase()
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      getOptionLabel={(option: any): any => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option?.inputValue) {
          return option.inputValue;
        }
        return option?.title;
      }}
      renderOption={(props, option) => {
        if (typeof option === "string") {
          return (
            <li {...props} data-testid={`${option}-aa-option`}>
              {option}
            </li>
          );
        } else {
          return (
            <li {...props} data-testid={`${option?.title}-aa-option`}>
              {option?.title}
            </li>
          );
        }
      }}
    />
  );
};

export default TestCaseSeries;
