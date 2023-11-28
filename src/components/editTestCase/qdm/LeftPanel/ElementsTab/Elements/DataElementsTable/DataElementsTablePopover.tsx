import React from "react";
import { Popover } from "@mui/material";

const DataElementsTablePopover = (props: {
  id: string;
  optionsOpen: boolean;
  anchorEl: any;
  handleClose: any;
  canView: boolean;
  canEdit: boolean;
  editSelectOptionProps: any;
  additionalSelectOptionProps?: any;
}) => {
  // canView prop defines if the data Element is still available and is not deleted from CQL
  const {
    id,
    optionsOpen,
    anchorEl,
    handleClose,
    canView,
    editSelectOptionProps,
    additionalSelectOptionProps,
  } = props;
  return (
    <div>
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
              width: "115px",
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
        <div className="popover-content" data-testid="popover-content" id={id}>
          <div className="btn-container">
            {canView && (
              <button
                data-testid={editSelectOptionProps.dataTestId}
                onClick={editSelectOptionProps.toImplementFunction}
              >
                {editSelectOptionProps.label}
              </button>
            )}
            {additionalSelectOptionProps &&
              additionalSelectOptionProps.map((res) => {
                return (
                  <button
                    key={res.dataTestId}
                    data-testid={res.dataTestId}
                    onClick={res.toImplementFunction}
                  >
                    {res.label}
                  </button>
                );
              })}
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default DataElementsTablePopover;
