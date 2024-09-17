import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { Menu } from "@mui/material";
import GridItemMenu from "./GridItemMenu";

interface TestCaseSummaryGridProps {
  // selectedResources: any[];
  onRowEdit: (row: any) => void;
  onRowDelete: (row: any) => void;
  bundle: any;
}

const TestCaseSummaryGrid = ({
  // selectedResources,
  bundle,
  onRowEdit,
  onRowDelete,
}: TestCaseSummaryGridProps) => {
  const columns: GridColDef[] = [
    {
      field: "resourceType",
      headerName: "Resource & Value Set",
      width: 250,
      valueGetter: (_value, row) => {
        return row.resource.resourceType;
      },
    },
    // { field: "path", headerName: "Resource & Value Set", width: 250 },
    {
      field: "id",
      headerName: "ID",
      width: 300,
      valueGetter: (_value, row) => row.resource.id,
    },
    // eslint-disable-next-line no-console
    {
      field: "",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        return (
          <GridItemMenu
            onRowEdit={onRowEdit}
            onRowDelete={onRowDelete}
            row={params.row}
          />
        );
      },
    },
  ];

  return (
    <DataGrid
      rows={bundle?.entry ?? []}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 10 },
        },
      }}
      getRowId={(data) => data.resource.id}
      pageSizeOptions={[10, 20, 50]}
      checkboxSelection
      sx={{
        width: "100%",
        height: 450,
      }}
    />
  );
};

export default TestCaseSummaryGrid;
