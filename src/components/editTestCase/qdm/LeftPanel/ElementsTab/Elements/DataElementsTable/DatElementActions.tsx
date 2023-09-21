import React from "react";
import { Popover } from "@madie/madie-design-system/dist/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./DataElementsTable.scss";

type DatElementMenuProps = {
  elementId: string;
  onDelete: Function;
  onView: Function;
};

export default function DatElementActions(props: DatElementMenuProps) {
  const { elementId, onDelete, onView } = props;
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
      <Popover
        id={`view-element-menu-${elementId}`}
        anchorEl={anchorEl}
        optionsOpen={open}
        onClose={handleClose}
        canEdit={true}
        editViewSelectOptionProps={{
          label: "View",
          toImplementFunction: viewDataElement,
          dataTestId: `view-element-${elementId}`,
        }}
        otherSelectOptionProps={[
          {
            label: "Delete",
            toImplementFunction: deleteDataElement,
            dataTestId: `delete-element-${elementId}`,
          },
        ]}
      />
    </div>
  );
}
