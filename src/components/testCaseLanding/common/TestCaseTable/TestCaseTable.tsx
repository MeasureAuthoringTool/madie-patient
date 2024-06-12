import React, { useState, useEffect, useMemo } from "react";
import tw from "twin.macro";
import "styled-components/macro";
import { Measure, TestCase } from "@madie/madie-models";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import * as _ from "lodash";
import { TestCaseStatus, TestCaseActionButton } from "./TestCaseTableHelpers";
import TruncateText from "../TruncateText";
import {
  MadieDeleteDialog,
  Toast,
} from "@madie/madie-design-system/dist/react";
import "../TestCase.scss";
import TestCaseTablePopover from "./TestCaseTablePopover";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface TestCaseTableProps {
  testCases: TestCase[];
  canEdit: boolean;
  deleteTestCase: Function;
  exportTestCase: Function;
  onCloneTestCase?: (testCase: TestCase) => void;
  measure: Measure;
}

const TestCaseTable = (props: TestCaseTableProps) => {
  const {
    testCases,
    canEdit,
    deleteTestCase,
    exportTestCase,
    onCloneTestCase,
    measure,
  } = props;
  const viewOrEdit = canEdit ? "edit" : "view";
  const [deleteDialogModalOpen, setDeleteDialogModalOpen] =
    useState<boolean>(false);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("danger");
  const [hoveredHeader, setHoveredHeader] = useState<string>("");
  const onToastClose = () => {
    setToastType("danger");
    setToastMessage("");
    setToastOpen(false);
  };
  // Popover utilities
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase>(null);
  const handleOpen = (
    selected: TestCase,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setSelectedTestCase(selected);
    setAnchorEl(event.currentTarget);
    setOptionsOpen(true);
  };
  const handleClose = () => {
    setOptionsOpen(false);
    setSelectedTestCase(null);
    setAnchorEl(null);
  };
  const TH = tw.th`p-3 text-left text-sm font-bold capitalize`;
  const transFormData = (testCases: TestCase[]): TCRow[] => {
    return testCases.map((tc: TestCase) => ({
      id: tc.id,
      status: tc.executionStatus,
      group: tc.series,
      title: tc.title,
      description: tc.description,
      action: tc,
    }));
  };

  type TCRow = {
    status: any;
    group: string;
    title: string;
    description: string;
    action: any;
    id: string;
  };

  function customSortGroup(rowA, rowB) {
    const a = rowA.original.group;
    const b = rowB.original.group;
    if (a === undefined || a === "") {
      return 1;
    } else if (b === undefined || b === "") {
      return -1;
    }
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }
  function customSortDesc(rowA, rowB) {
    const a = rowA.original.description;
    const b = rowB.original.description;
    if (a === undefined || a === "") {
      return 1;
    } else if (b === undefined || b === "") {
      return -1;
    }
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  const [data, setData] = useState<TCRow[]>([]);
  useEffect(() => {
    if (testCases) {
      setData(transFormData(testCases));
    }
  }, [testCases]);
  const columns = useMemo<ColumnDef<TCRow>[]>(
    () => [
      {
        header: "Status",
        cell: (info) => (
          <TestCaseStatus executionStatus={info.row.original.status} />
        ),
        accessorKey: "status",
      },
      {
        header: "Group",
        cell: (info) => (
          <TruncateText
            text={info.row.original.group}
            maxLength={120}
            name="series"
            dataTestId={`test-case-series-${info.row.original.id}`}
          />
        ),
        accessorKey: "group",
        sortingFn: customSortGroup,
      },
      {
        header: "Title",
        cell: (info) => (
          <TruncateText
            text={info.row.original.title}
            maxLength={60}
            name="title"
            dataTestId={`test-case-title-${info.row.original.id}`}
          />
        ),
        accessorKey: "title",
      },
      {
        header: "Description",
        cell: (info) => (
          <TruncateText
            text={info.row.original.description}
            maxLength={120}
            name="description"
            dataTestId={`test-case-description-${info.row.original.id}`}
          />
        ),
        accessorKey: "description",
        sortingFn: customSortDesc,
      },
      {
        header: "Action",
        cell: (info) => (
          <TestCaseActionButton
            testCase={info.row.original.action}
            handleOpen={handleOpen}
          />
        ),
        accessorKey: "action",
        enableSorting: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      size: 200, //starting column size
      minSize: 50, //enforced during column resizing
      maxSize: 500, //enforced during column resizing
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <table
      tw="min-w-full"
      data-testid="test-case-tbl"
      className="tcl-table"
      id="testCaseListTable"
      style={{
        borderTop: "solid 1px #8c8c8c",
        borderSpacing: "0 2em !important",
      }}
    >
      <thead tw="bg-slate">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const isHovered = hoveredHeader?.includes(header.id);
              return (
                <TH
                  key={header.id}
                  scope="col"
                  onClick={header.column.getToggleSortingHandler()}
                  onMouseEnter={() => setHoveredHeader(header.id)}
                  onMouseLeave={() => setHoveredHeader(null)}
                  className="header-cell"
                >
                  {header.isPlaceholder ? null : (
                    <button
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none header-button"
                          : "header-button"
                      }
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === "asc"
                            ? "Sort ascending"
                            : header.column.getNextSortingOrder() === "desc"
                            ? "Sort descending"
                            : "Clear sort"
                          : undefined
                      }
                    >
                      <span className="arrowDisplay">
                        {header.column.getCanSort() &&
                          isHovered &&
                          !header.column.getIsSorted() && <UnfoldMoreIcon />}

                        {{
                          asc: <KeyboardArrowUpIcon />,
                          desc: <KeyboardArrowDownIcon />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </button>
                  )}
                </TH>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody className="table-body" style={{ padding: 20 }}>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="tcl-tr"
            data-testid={`test-case-row-${row.id}`}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} data-testid={`test-case-title-${cell.id}`}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <TestCaseTablePopover
        canEdit={canEdit}
        viewOrEdit={viewOrEdit}
        model={measure?.model}
        groups={measure?.groups}
        selectedTestCase={selectedTestCase}
        anchorEl={anchorEl}
        optionsOpen={optionsOpen}
        setOptionsOpen={setOptionsOpen}
        exportTestCase={exportTestCase}
        onCloneTestCase={onCloneTestCase}
        setDeleteDialogModalOpen={setDeleteDialogModalOpen}
        handleClose={handleClose}
      />

      {/* This sees to have gotten disconnected at some point in the past. */}
      <Toast
        toastKey="test-case-action-toast"
        aria-live="polite"
        toastType={toastType}
        testId={toastType === "danger" ? "error-toast" : "success-toast"}
        closeButtonProps={{
          "data-testid": "close-toast-button",
        }}
        open={toastOpen}
        message={toastMessage}
        onClose={onToastClose}
        autoHideDuration={6000}
      />

      <MadieDeleteDialog
        open={deleteDialogModalOpen}
        onContinue={() => {
          deleteTestCase(selectedTestCase.id);
        }}
        onClose={() => {
          setDeleteDialogModalOpen(false);
        }}
        dialogTitle={`Delete Test Case`}
        name={selectedTestCase?.title}
      />
    </table>
  );
};

export default TestCaseTable;
