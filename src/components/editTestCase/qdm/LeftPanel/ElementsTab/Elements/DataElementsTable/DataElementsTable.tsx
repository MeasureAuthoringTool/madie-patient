import React, { useEffect, useState } from "react";
import DataTypeCell from "./DataTypeCell";
import { DataElement } from "cqm-models";

import "./DataElementsTable.scss";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import useQdmExecutionContext from "../../../../../../routes/qdm/useQdmExecutionContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TimingCell from "./TimingCell";

const columnHelper = createColumnHelper<DataElement>();
interface MadieTableProps {
  dataElements?: DataElement[];
  onView?: (dataElement: DataElement) => void;
  onDelete?: (dataElement: DataElement) => void;
}
const MadieTable = ({ dataElements = [], onView }: MadieTableProps) => {
  const { cqmMeasureState } = useQdmExecutionContext();
  const [codeSystemMap, setCodeSystemMap] = useState({});
  useEffect(() => {
    const valueSets = cqmMeasureState?.[0]?.value_sets;
    if (valueSets) {
      const codeSystemMap = {};
      valueSets.forEach((valueSet) => {
        valueSet.concepts.forEach((concept) => {
          codeSystemMap[concept.code_system_oid] = concept.code_system_name;
        });
      });
      setCodeSystemMap(codeSystemMap);
    }
  }, [cqmMeasureState]);

  const columns = [
    columnHelper.accessor((row) => row, {
      header: "Datatype, Value Set & Code",
      id: "category",
      cell: (info) => {
        const el = info.getValue();
        return <DataTypeCell element={el} codeSystemMap={codeSystemMap} />;
      },
    }),
    columnHelper.accessor((row) => row, {
      id: "timing",
      cell: (info) => {
        const el = info.getValue();
        if (el.get) {
          return <TimingCell element={el} />;
        }
        return null;
      },
      header: "Timing",
    }),

    columnHelper.accessor((row) => row, {
      header: "Actions",
      id: "actions",
      cell: (info) => {
        const el = info.getValue();
        return (
          <button
            className="view-button"
            // onClick={(e) => {
            //   e.preventDefault();
            //   onView && onView(el);
            // }}
            id={el.id}
          >
            <div>View</div>
            <ExpandMoreIcon />
          </button>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: dataElements,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,

    defaultColumn: {
      size: 100,
    },
    initialState: {
      columnPinning: {
        right: ["actions"],
        left: ["category"],
      },
    },
  });

  if (!dataElements) {
    return <div data-testid="empty-table" />;
  }
  return (
    <table className="madie-elements-table">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                colSpan={header.colSpan}
                style={{ position: "relative", width: header.getSize() }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                {/* add following in if we want to manually resize columns on drag. */}
                {/* {header.column.getCanResize() && (
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${
                      header.column.getIsResizing() ? "isResizing" : ""
                    }`}
                  ></div>
                )} */}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, index) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell, index) => {
              return (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MadieTable;
