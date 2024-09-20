import React from "react";
import { Box } from "@mui/material";
import ResourceListTile from "./ResourceListTile";

export interface ResourceListProps {
  resources: string[];
  onClick: (resourceName: string) => void;
}

const ResourceList = ({ resources, onClick }: ResourceListProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      {resources &&
        resources?.map((resource) => (
          <ResourceListTile name={resource} onClick={onClick} />
        ))}
    </Box>
  );
};

export default ResourceList;
