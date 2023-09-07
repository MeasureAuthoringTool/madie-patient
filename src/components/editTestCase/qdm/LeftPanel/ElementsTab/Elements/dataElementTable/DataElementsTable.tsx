import React, { useEffect, useState } from "react";
import { DataElement } from "cqm-models";
import * as _ from "lodash";
import { Box } from "@mui/material";

import "./DataElementsTable.scss";
import DataElementTitle from "./DataElementTitle";
import Button from "@mui/material/Button";
import DataElementTableCodes from "./dataElementTable/DataElementTableCodes";
import { useQdmExecutionContext } from "../../../../../routes/qdm/QdmExecutionContext";

export interface DataElementsTableProps {
  dataElements?: DataElement[];
  onView?: (dataElement: DataElement) => void;
  onDelete?: (dataElement: DataElement) => void;
}

const DataElementsTable = ({
  dataElements,
  onView,
}: DataElementsTableProps) => {
  const [codeSystemMap, setCodeSystemMap] = useState(null);
  const { cqmMeasureState } = useQdmExecutionContext();
  const [cqmMeasure] = cqmMeasureState;

  // This creates a codeSystemMap with oid: codeSystemDisplayName
  // Patient json has code system oid but not code system display name
  useEffect(() => {
    const valueSets = cqmMeasure?.value_sets;
    if (valueSets) {
      const codeSystemMap = {};
      valueSets.forEach((valueSet) => {
        valueSet.concepts.forEach((concept) => {
          codeSystemMap[concept.code_system_oid] = concept.code_system_name;
        });
      });
      setCodeSystemMap(codeSystemMap);
    }
  }, [cqmMeasure?.value_sets, cqmMeasureState]);

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
                  <td>
                    <DataElementTableCodes
                      codeSystemMap={codeSystemMap}
                      element={dataElement}
                    />
                  </td>
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
