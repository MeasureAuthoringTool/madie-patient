import React, { useEffect, useState } from "react";
import DataTypeCell from "./DataTypeCell";
import { DataElement } from "cqm-models";
import * as _ from "lodash";
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
import { generateAttributesToDisplay } from "../../../../../../../util/QdmAttributeHelpers";
import AttributesCell from "./AttributesCell";

const columnHelper = createColumnHelper<DataElement>();

interface DataElementTableProps {
  dataElements?: DataElement[];
  onView?: (dataElement: DataElement) => void;
  canEdit: boolean;
  onDelete?: (id: string) => void;
  allowedTypes: object;
}

interface ElementAttributeEntry {
  id: string;
  attributes: Array<DisplayAttributes>;
}

export interface DisplayAttributes {
  name?: string;
  title?: string;
  value?: string;
  isMultiple?: boolean;
  additionalElements?: Array<DisplayAttributes>;
}

const DataElementTable = ({
  dataElements = [],
  onDelete,
  canEdit,
  onView,
  allowedTypes,
}: DataElementTableProps) => {
  const { cqmMeasureState } = useQdmExecutionContext();
  const [codeSystemMap, setCodeSystemMap] = useState({});
  const [columns, setColumns] = useState([]);
  const [attributeColumns, setAttributeColumns] = useState([]);

  // Building codeSystemMap, so that selected codes can be displayed on the table
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

  // Building Attribute columns
  useEffect(() => {
    if (dataElements?.length) {
      const elementsAttributesList: ElementAttributeEntry[] = dataElements?.map(
        (dataElement) => {
          const usedAttributes = generateAttributesToDisplay(
            dataElement,
            dataElements,
            codeSystemMap
          );
          return { id: dataElement.id, attributes: usedAttributes };
        }
      );

      const maxAttributeCount = _.max(
        elementsAttributesList?.map((e) => e.attributes?.length ?? 0)
      );

      const attributeColumns = [];
      for (let i = 0; i < maxAttributeCount; i++) {
        const accessor = columnHelper.accessor((row) => row, {
          header: `Attribute ${i + 1}`,
          id: `Attribute ${i + 1}`,
          cell: (info) => {
            const dataElement = info.getValue();
            const elementAttributes = elementsAttributesList.find(
              (e) => e.id == dataElement.id
            );

            if (!_.isEmpty(elementAttributes?.attributes)) {
              const attribute: DisplayAttributes =
                elementAttributes?.attributes[i];
              return (
                <AttributesCell
                  attribute={attribute}
                  isMultiple={attribute?.isMultiple}
                />
              );
            } else {
              return <div></div>;
            }
          },
        });
        attributeColumns.push(accessor);
      }
      setAttributeColumns(attributeColumns);
    }
  }, [codeSystemMap, dataElements]);

  // Generating columns required for the table
  useEffect(() => {
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
      ...attributeColumns,
      columnHelper.accessor((row) => row, {
        header: "Actions",
        id: "actions",
        cell: (info) => {
          const el = info.getValue();
          return (
            <DatElementActions
              elementId={el.id}
              canEdit={canEdit}
              canView={allowedTypes.hasOwnProperty(el._type)}
              onDelete={onDelete}
              onView={(e) => {
                // e.preventDefault();
                onView && onView(el);
              }}
            />
          );
        },
      }),
    ];
    setColumns(columns);
  }, [attributeColumns, codeSystemMap, onView]);

  const table = useReactTable({
    data: dataElements,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
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
