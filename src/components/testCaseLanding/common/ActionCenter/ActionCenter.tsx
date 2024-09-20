import React, { useState } from "react";
import "twin.macro";
import "styled-components/macro";
import { IconButton, MenuItem } from "@mui/material";
import { Select, TextField } from "@madie/madie-design-system/dist/react";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClearIcon from "@mui/icons-material/Clear";
import { useFormik } from "formik";
import queryString from "query-string";
import { useNavigate, useLocation } from "react-router-dom";

interface ActionCenterProps {
  onSubmit?: any;
}

const filterByOptions = ["Status", "Group", "Title", "Description"];

export default function ActionCenter(props: ActionCenterProps) {
  const { search } = useLocation();
  let navigate = useNavigate();
  const values = queryString.parse(search);
  // init against url
  const formik = useFormik({
    initialValues: {
      filterBy: values.filter ? values.filter : "",
      searchValue: values.search ? values.search : "",
    },
    enableReinitialize: true,
    // on submit will never fire without a button of type submit in top level of the form.
    onSubmit: async (formValues) => {
      props.onSubmit(formValues);
    },
  });
  const handleNavigate = () => {
    navigate(
      `?filter=${formik.values.filterBy}&search=${
        formik.values.searchValue
      }&page=${1}&limit=${values.limit ? values.limit : 10}`
    );
  };
  const handleClearClick = () => {
    const testCasePageOptions = JSON.parse(
      window.localStorage.getItem("testCasesPageOptions")
    );
    localStorage.setItem(
      "testCasesPageOptions",
      JSON.stringify({
        page: 1,
        limit: testCasePageOptions?.limit ? testCasePageOptions.limit : 10,
        filter: "",
        search: "",
      })
    );
    navigate(window.location.pathname);
  };
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
              placeHolder={{ name: "Filter By", value: "" }}
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
              disabled={!formik.values.filterBy}
              inputProps={{
                "data-testid": "test-case-list-search-input",
              }}
              data-testid="test-case-list-search"
              name="searchValue"
              value={formik.values.searchValue}
              onChange={formik.handleChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleNavigate();
                }
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      onClick={handleNavigate}
                      style={{ cursor: "pointer" }}
                    >
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      style={{ cursor: "pointer" }}
                    >
                      <IconButton onClick={handleClearClick}>
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
