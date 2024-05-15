import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { MadieSpinner } from "@madie/madie-design-system/dist/react";
import { AlignHorizontalRight } from "@mui/icons-material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface ModalProps {
  openModal: boolean;
}

export default function ExportModal(props: ModalProps) {
  const [open, setOpen] = React.useState(props.openModal);

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-export"
        aria-describedby="modal-export"
        data-testid="modal-export"
      >
        <Box sx={style}>
          <div
            style={{
              display: "block",
              justifyContent: "center",
              alignItems: "center",
              border: "15px",
            }}
          >
            <p>Exporting</p>

            <MadieSpinner style={{ height: 50, width: 50 }} />
          </div>
        </Box>
      </Modal>
    </div>
  );
}
