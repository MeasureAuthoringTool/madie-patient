import * as React from "react";
import "twin.macro";
import "styled-components/macro";
import { MenuItem } from "@mui/material";
import { Select, TextField } from "@madie/madie-design-system/dist/react";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
interface ActionCenterProps {}

const filterByOptions = ["Status", "Group", "Title", "Description"];
const searchInputProps = {
  startAdornment: (
    <InputAdornment position="start">
      <SearchIcon />
    </InputAdornment>
  ),
};

export default function ActionCenter(props: ActionCenterProps) {
  return (
    <div tw="flex py-4">
      <div tw="flex w-1/2">
        <div tw="w-1/2 pr-2">
          <Select
            label="Filter By"
            id="filter-by-select"
            data-testid="filter-by-select"
            inputProps={{ "data-testid": "filter-by-select-input" }}
            placeHolder={{ name: "Filter By" }}
            name="filter-by"
            SelectDisplayProps={{
              "aria-required": "true",
            }}
            size="small"
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
            InputProps={searchInputProps}
            name="test-case-list-search"
          />
        </div>
      </div>
    </div>
  );
}
