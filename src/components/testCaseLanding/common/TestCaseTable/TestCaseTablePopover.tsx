import React from "react";
import { Popover } from "@mui/material";
import { TestCase } from "@madie/madie-models";
import { useNavigate } from "react-router-dom";

interface TestCaseTablePopoverProps {
  optionsOpen: boolean;
  anchorEl: any;
  handleClose: any;
  selectedTestCase: TestCase;
  viewOrEdit: string;
  canEdit: boolean;
  exportTestCase: Function;
  setOptionsOpen: Function;
  onCloneTestCase?: (testCase: TestCase) => void;
  model: string;
  setDeleteDialogModalOpen: Function;
}

const TestCaseTablePopover = (props: TestCaseTablePopoverProps) => {
  const navigate = useNavigate();
  const {
    anchorEl,
    optionsOpen,
    handleClose,
    selectedTestCase,
    viewOrEdit,
    exportTestCase,
    setOptionsOpen,
    canEdit,
    model,
    onCloneTestCase,
    setDeleteDialogModalOpen,
  } = props;
  return (
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
          backgroundColor: "transparent",
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
          {model.startsWith("QI-Core") ? (
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
  );
};
export default TestCaseTablePopover;
