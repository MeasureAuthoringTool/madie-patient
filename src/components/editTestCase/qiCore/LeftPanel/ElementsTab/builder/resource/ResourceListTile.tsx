import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import * as _ from "lodash";

const ResourceListTile = ({ name, onClick }) => {
  return (
    <Box
      sx={{
        borderRadius: 0,
        borderBottomWidth: "thin",
        borderColor: "dark-gray",
        width: 250,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        border: "1px solid gray",
        alignItems: "center",
        padding: 1,
      }}
    >
      <Typography flexWrap="wrap">
        {name.split(/(?=[A-Z])/).join(" ")}
      </Typography>
      <IconButton onClick={() => onClick(name)}>
        <AddCircleOutlineIcon />
      </IconButton>
    </Box>
  );
};

export default ResourceListTile;
