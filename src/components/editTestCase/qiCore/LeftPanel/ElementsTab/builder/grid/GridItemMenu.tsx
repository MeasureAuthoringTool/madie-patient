import React from "react";
import Button from "@mui/material/Button";
import { Menu, MenuItem } from "@mui/material";

interface GridItemMenuProps {
  onRowEdit: (row) => void;
  onRowDelete: (row) => void;
  row: any;
}

const GridItemMenu = ({ onRowEdit, onRowDelete, row }: GridItemMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Actions
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            handleClose();
            onRowEdit(row);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            handleClose();
            onRowDelete(row);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

export default GridItemMenu;
