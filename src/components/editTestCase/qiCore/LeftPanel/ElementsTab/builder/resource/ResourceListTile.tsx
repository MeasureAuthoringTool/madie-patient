import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import * as _ from "lodash";

const ResourceListTile = ({ resourceIdentifier, onClick }) => {
  return (
    <Box
      sx={{
        borderRadius: 0,
        borderBottomWidth: "thin",
        borderColor: "dark-gray",
        width: 275,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        border: "1px solid gray",
        alignItems: "center",
        padding: 1,
      }}
    >
      <Typography flexWrap="wrap">{resourceIdentifier.title}</Typography>
      <IconButton onClick={() => onClick(resourceIdentifier)}>
        <AddCircleOutlineIcon />
      </IconButton>
    </Box>
  );
};

export default ResourceListTile;
