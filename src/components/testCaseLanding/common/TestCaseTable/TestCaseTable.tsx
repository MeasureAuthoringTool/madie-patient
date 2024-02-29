import React, { useState, useEffect, useMemo } from "react";
import tw from "twin.macro";
import "styled-components/macro";
import { Measure, TestCase } from "@madie/madie-models";
import { DetailedPopulationGroupResult } from "fqm-execution/build/types/Calculator";
import { Popover } from "@mui/material";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import * as _ from "lodash";
import { TestCaseStatus, TestCaseActionButton } from "./TestCaseTableHelpers";
import TruncateText from "../TruncateText";
import {
  MadieDeleteDialog,
  Toast,
} from "@madie/madie-design-system/dist/react";
import { useNavigate } from "react-router-dom";
import "../TestCase.scss";

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
  const navigate = useNavigate();
  const viewOrEdit = canEdit ? "edit" : "view";
  const [deleteDialogModalOpen, setDeleteDialogModalOpen] =
    useState<boolean>(false);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("danger");
  const onToastClose = () => {
    setToastType("danger");
    setToastMessage("");
    setToastOpen(false);
  };
  // Popover utilities
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
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
  const transFormData = (testCases) => {
    const results = testCases.map((tc: TestCase) => ({
      id: tc.id,
      status: <TestCaseStatus executionStatus={tc.executionStatus} />,
      group: (
        <TruncateText
          text={tc.series}
          maxLength={120}
          name="series"
          dataTestId={`test-case-series-${tc.id}`}
        />
      ),
      title: (
        <TruncateText
          text={tc.title}
          maxLength={60}
          name="title"
          dataTestId={`test-case-title-${tc.id}`}
        />
      ),
      description: (
        <TruncateText
          text={tc.description}
          maxLength={120}
          name="description"
          dataTestId={`test-case-description-${tc.id}`}
        />
      ),
      action: <TestCaseActionButton testCase={tc} handleOpen={handleOpen} />,
    }));

    return results;
  };

  type TCRow = {
    status: any;
    group: string;
    title: string;
    description: string;
    action: any;
  };
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
        cell: (row) => row.renderValue(),
        accessorKey: "status",
      },
      {
        header: "Group",
        cell: (row) => row.renderValue(),
        accessorKey: "group",
      },
      {
        header: "Title",
        cell: (row) => row.renderValue(),
        accessorKey: "title",
      },
      {
        header: "Description",
        cell: (row) => row.renderValue(),
        accessorKey: "description",
      },
      {
        header: "Action",
        cell: (row) => row.renderValue(),
        accessorKey: "action",
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table
      tw="min-w-full"
      data-testid="test-case-tbl"
      className="tcl-table"
      style={{
        borderTop: "solid 1px #8c8c8c",
        borderSpacing: "0 2em !important",
      }}
    >
      <thead tw="bg-slate">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TH key={header.id} scope="col">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TH>
            ))}
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
      <Popover
        open={optionsOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          ".MuiPopover-paper": {
            boxShadow: "none",
            overflow: "visible",
            ".popover-content": {
              border: "solid 1px #979797",
              position: "relative",
              marginTop: "16px",
              marginLeft: "-70px",
              borderRadius: "6px",
              background: "#F7F7F7",
              width: "fit-content",
              "&::before": {
                borderWidth: "thin",
                position: "absolute",
                top: "-8px",
                left: "calc(50% - 8px)",
                height: "16px",
                width: "16px",
                background: "#F7F7F7",
                borderColor: "#979797 transparent transparent #979797",
                content: '""',
                transform: "rotate(45deg)",
              },
              ".btn-container": {
                display: "flex",
                flexDirection: "column",
                padding: "10px 0",
                button: {
                  zIndex: 2,
                  fontSize: 14,
                  padding: "0px 12px",
                  textAlign: "left",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              },
            },
          },
        }}
      >
        {/* getting out of child element should dratstically improve performance on large test case suites. */}
        <div className="popover-content" data-testid="popover-content">
          <div className="btn-container">
            <button
              id={`view-edit-test-case-${selectedTestCase?.id}`}
              aria-label={`${viewOrEdit}-test-case-${selectedTestCase?.title}`}
              data-testid={`view-edit-test-case-${selectedTestCase?.id}`}
              onClick={() => {
                navigate(`../../${selectedTestCase?.id}`, { relative: "path" });
                setOptionsOpen(false);
              }}
            >
              {viewOrEdit}
            </button>
            {measure.model.startsWith("QI-Core") ? (
              <>
                <button
                  id={`export-transaction-bundle-${selectedTestCase?.id}`}
                  aria-label={`export-transaction-bundle-${selectedTestCase?.title}`}
                  data-testid={`export-transaction-bundle-${selectedTestCase?.id}`}
                  onClick={() => {
                    exportTestCase(selectedTestCase, "TRANSACTION");
                    setOptionsOpen(false);
                  }}
                >
                  export transaction bundle
                </button>
                <button
                  id={`export-collection-bundle-${selectedTestCase?.id}`}
                  aria-label={`export-collection-bundle-${selectedTestCase?.title}`}
                  data-testid={`export-collection-bundle-${selectedTestCase?.id}`}
                  onClick={() => {
                    exportTestCase(selectedTestCase, "COLLECTION");
                    setOptionsOpen(false);
                  }}
                >
                  export collection bundle
                </button>
              </>
            ) : exportTestCase ? (
              <button
                id={`export-test-case-${selectedTestCase?.id}`}
                aria-label={`export-test-case-${selectedTestCase?.title}`}
                data-testid={`export-test-case-${selectedTestCase?.id}`}
                onClick={() => {
                  exportTestCase(selectedTestCase);
                  setOptionsOpen(false);
                }}
              >
                export
              </button>
            ) : (
              ""
            )}

            {canEdit && onCloneTestCase && (
              <button
                id={`clone-test-case-btn-${selectedTestCase?.id}`}
                aria-label={`clone-test-case-${selectedTestCase?.title}`}
                data-testid={`clone-test-case-btn-${selectedTestCase?.id}`}
                onClick={() => {
                  onCloneTestCase(selectedTestCase);
                }}
              >
                clone
              </button>
            )}

            {canEdit && (
              <button
                id={`delete-test-case-btn-${selectedTestCase?.id}`}
                aria-label={`delete-test-case-${selectedTestCase?.title}`}
                data-testid={`delete-test-case-btn-${selectedTestCase?.id}`}
                onClick={() => {
                  setDeleteDialogModalOpen(true);
                  setOptionsOpen(false);
                }}
              >
                delete
              </button>
            )}
          </div>
        </div>
      </Popover>

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
