import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import ResourceListTile from "./ResourceListTile";
import * as _ from "lodash";
import { ResourceIdentifier } from "../../../../../../../api/models/ResourceIdentifier";

export interface ResourceListProps {
  resourceIdentifiers: ResourceIdentifier[];
  onClick: (resourceIdentifier: ResourceIdentifier) => void;
}

const ResourceList = ({ resourceIdentifiers, onClick }: ResourceListProps) => {
  const [resourceFilter, setResourceFilter] = useState("");

  return (
    <>
      <Box
        sx={{
          py: 1,
          pr: 1,
          width: "100%",
        }}
      >
        <TextField
          onChange={(e) => setResourceFilter(e.target.value.trim())}
          value={resourceFilter}
          placeholder="Filter Resources"
          size="small"
          fullWidth
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {resourceIdentifiers &&
          resourceIdentifiers
            ?.filter(
              (resource) =>
                _.isEmpty(resourceFilter.trim()) ||
                resource.title
                  .toUpperCase()
                  .includes(resourceFilter.toUpperCase())
            )
            .map((resourceIdentifier) => (
              <ResourceListTile
                resourceIdentifier={resourceIdentifier}
                onClick={onClick}
              />
            ))}
      </Box>
    </>
  );
};

export default ResourceList;
