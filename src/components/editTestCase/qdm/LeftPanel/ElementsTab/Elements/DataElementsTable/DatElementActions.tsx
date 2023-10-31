import React from "react";
import DataElementsTablePopover from "./DataElementsTablePopover";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./DataElementsTable.scss";

type DatElementMenuProps = {
  elementId: string;
  canView: boolean;
  onDelete: Function;
  onView: Function;
  canEdit: boolean;
};

export default function DatElementActions(props: DatElementMenuProps) {
  const { elementId, canView, onDelete, onView, canEdit } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const viewDataElement = () => {
    onView();
    // handleClose();
  };

  const deleteDataElement = () => {
    handleClose();
    onDelete(elementId);
  };
  const deleteElement = canEdit
    ? {
        label: "Delete",
        toImplementFunction: deleteDataElement,
        dataTestId: `delete-element-${elementId}`,
      }
    : {};
  const deletePropOption = canEdit
    ? {
        label: "Delete",
        toImplementFunction: deleteDataElement,
        dataTestId: `delete-element-${elementId}`,
      }
    : {};

  return (
    <div>
      <button
        id={`view-element-btn-${elementId}`}
        data-testid={`view-element-btn-${elementId}`}
        className="view-button"
        aria-controls={open ? `view-element-menu-${elementId}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <div>View</div>
        <ExpandMoreIcon />
      </button>
      <DataElementsTablePopover
        id={`view-element-menu-${elementId}`}
        anchorEl={anchorEl}
        optionsOpen={open}
        handleClose={handleClose}
        canEdit={true}
        canView={canView}
        editViewSelectOptionProps={{
          label: "View",
          toImplementFunction: viewDataElement,
          dataTestId: `view-element-${elementId}`,
        }}
        otherSelectOptionProps={[deletePropOption]}
      />
    </div>
  );
}
