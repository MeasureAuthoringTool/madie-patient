import React from "react";
import { DataElement } from "cqm-models";
import * as _ from "lodash";
import { Box } from "@mui/material";

import "./DataElementsTable.scss";
import DataElementTitle from "./DataElementTitle";
import Button from "@mui/material/Button";

export interface DataElementsTableProps {
  dataElements?: DataElement[];
  onView?: (dataElement: DataElement) => void;
  onDelete?: (dataElement: DataElement) => void;
}

const DataElementsTable = ({
  dataElements,
  onView,
}: DataElementsTableProps) => {
  return (
    <Box
      sx={{
        my: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <table className="data-elements-table">
        <thead>
          <tr>
            <th>Element/Data Type/Value Set</th>
            <th>Timing</th>
            <th>Codes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dataElements?.length > 0 &&
            dataElements.map((dataElement) => {
              return (
                <tr>
                  <td>
                    <DataElementTitle element={dataElement} />
                  </td>
                  <td></td>
                  <td></td>
                  <td>
                    <Button
                      onClick={() => onView && onView(dataElement)}
                      variant="outlined"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {_.isEmpty(dataElements) && (
        <p>There are currently no data elements on this patient.</p>
      )}
    </Box>
  );
};

export default DataElementsTable;
