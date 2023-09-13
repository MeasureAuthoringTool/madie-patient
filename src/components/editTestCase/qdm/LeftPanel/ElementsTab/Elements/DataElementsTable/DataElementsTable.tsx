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
import TimingCell from "./TimingCell";
import DatElementActions from "./DatElementActions";
import { SKIP_ATTRIBUTES } from "../../../../../../../util/QdmAttributeHelpers";

const columnHelper = createColumnHelper<DataElement>();
interface DataElementTableProps {
  dataElements?: DataElement[];
  onView?: (dataElement: DataElement) => void;
  onDelete?: (id: string) => void;
}
const DataElementTable = ({
  dataElements = [],
  onView,
  onDelete,
}: DataElementTableProps) => {
  const { cqmMeasureState } = useQdmExecutionContext();
  const [codeSystemMap, setCodeSystemMap] = useState({});

  console.log("dataElements ", dataElements);

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

  useEffect(() => {
    if (dataElements) {
      dataElements[0]?.schema.eachPath((path, info) => {
        if (!SKIP_ATTRIBUTES.includes(path) && dataElements[0][path]) {
          console.log("Diagnosis path", path);
        }

      });
      // dataElements.forEach((dataElement) => {
      //   dataElement.schema.eachPath((path, info) => {
      //     if (dataElement.qdmTitle === "Encounter, Performed") {
      //       // if (!SKIP_ATTRIBUTES.includes(path) && dataElement[path]) {
      //       //   console.log("dataElement", dataElement);
      //       console.log("path", path);
      //       // console.log("info", info);
      //       // }
      //     } else if (dataElement.qdmTitle === "Diagnosis") {
      //       console.log("Diagnosis path", path);
      //     }
      //   });
      // });
    }
  }, [dataElements]);

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
        return <DatElementActions elementId={el.id} onDelete={onDelete} />;
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
    <table className="data-elements-table">
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

export default DataElementTable;
