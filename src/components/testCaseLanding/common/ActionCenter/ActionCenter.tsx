import * as React from "react";
import "twin.macro";
import "styled-components/macro";
import { IconButton, MenuItem } from "@mui/material";
import { Select, TextField } from "@madie/madie-design-system/dist/react";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClearIcon from "@mui/icons-material/Clear";
import { useFormik } from "formik";
interface ActionCenterProps {
  onSubmit?: any;
}

const filterByOptions = ["Status", "Group", "Title", "Description"];

export default function ActionCenter(props: ActionCenterProps) {
  const formik = useFormik({
    initialValues: {
      filterBy: undefined,
      searchValue: undefined,
    },
    onSubmit: async (formValues) => {
      props.onSubmit(formValues);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div tw="flex py-4">
        <div tw="flex w-1/2">
          <div tw="w-1/2 pr-2">
            <Select
              label="Filter By"
              id="filter-by-select"
              data-testid="filter-by-select"
              inputProps={{ "data-testid": "filter-by-select-input" }}
              placeHolder={{ name: "Filter By" }}
              SelectDisplayProps={{
                "aria-required": "true",
              }}
              size="small"
              name="filterBy"
              value={formik.values.filterBy}
              onChange={formik.handleChange}
              options={filterByOptions?.map((option) => {
                return (
                  <MenuItem
                    key={option}
                    value={option}
                    data-testid={`filter-by-${option}`}
                  >
                    {option}
                  </MenuItem>
                );
              })}
            />
          </div>
          <div tw="w-1/2 pl-2">
            <TextField
              id="search"
              tw="w-full"
              label="Search"
              placeholder="Search"
              inputProps={{
                "data-testid": "test-case-list-search-input",
              }}
              data-testid="test-case-list-search"
              name="searchValue"
              value={formik.values.searchValue}
              onChange={formik.handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          formik.setFieldValue("searchValue", "");
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
