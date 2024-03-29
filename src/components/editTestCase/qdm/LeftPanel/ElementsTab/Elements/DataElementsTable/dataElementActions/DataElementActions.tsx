import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../DataElementsTable.scss";
import { Button } from "@madie/madie-design-system/dist/react";
import DataElementsTablePopover from "./DataElementsTablePopover";

type DataElementActionsProps = {
  elementId: string;
  canView: boolean;
  onDelete: Function;
  onView: Function;
  canEdit: boolean;
  onClone: Function;
};

export default function DataElementActions(props: DataElementActionsProps) {
  const { elementId, canView, onDelete, onView, canEdit, onClone } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleViewButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    if (canEdit) {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
    } else {
      onView();
    }
  };

  const handlePopOverClose = () => {
    setAnchorEl(null);
  };

  const deleteDataElement = () => {
    handlePopOverClose();
    onDelete(elementId);
  };

  const additionalActions = canEdit
    ? [
        {
          label: "Clone",
          toImplementFunction: () => {
            handlePopOverClose();
            onClone();
          },
          dataTestId: `clone-element-${elementId}`,
        },
        {
          label: "Delete",
          toImplementFunction: deleteDataElement,
          dataTestId: `delete-element-${elementId}`,
        },
      ]
    : [];

  return (
    <div>
      {canEdit ? (
        <Button
          id={`view-element-btn-${elementId}`}
          data-testid={`view-element-btn-${elementId}`}
          className="view-with-dropdown-button"
          aria-controls={open ? `view-element-menu-${elementId}` : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleViewButtonClick}
        >
          <div>View</div>
          <ExpandMoreIcon />
        </Button>
      ) : (
        <Button
          id={`view-element-btn-${elementId}`}
          data-testid={`view-element-btn-${elementId}`}
          onClick={handleViewButtonClick}
          loading={!canView} //disabled state
          variant="primary"
        >
          View
        </Button>
      )}
      <DataElementsTablePopover
        id={`view-element-menu-${elementId}`}
        anchorEl={anchorEl}
        optionsOpen={open}
        handleClose={handlePopOverClose}
        canEdit={true}
        editSelectOptionProps={{
          label: "Edit",
          toImplementFunction: () => {
            return onView();
          },
          dataTestId: `edit-element-${elementId}`,
        }}
        additionalSelectOptionProps={additionalActions}
      />
    </div>
  );
}
