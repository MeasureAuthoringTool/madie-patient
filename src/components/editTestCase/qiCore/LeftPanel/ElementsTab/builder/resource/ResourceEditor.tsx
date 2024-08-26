import React, { useEffect, useState } from "react";
import { Box, Divider, IconButton, Tab, Tabs } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { BuilderUtils } from "../BuilderUtils";
import { TabPanel } from "@mui/lab";
import ElementEditor from "../../element/ElementEditor";
import ElementSelector from "../../element/ElementSelector";
import * as _ from "lodash";

interface ResourceEditorProps {
  selectedResource: any;
  selectedResourceDefinition: any;
  onSave: (resource: any) => void;
  onCancel: (resource: any) => void;
}

const ResourceEditor = ({
  selectedResource,
  onSave,
  onCancel,
}: ResourceEditorProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [allElements, setAllElements] = useState([]);
  const [displayedElements, setDisplayedElements] = useState([]);
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    if (selectedResource) {
      // TODO: look at the data that exists on the resource and combine fields from that
      const topElements = BuilderUtils.getAllElements(selectedResource);
      setAllElements(topElements);
      setDisplayedElements([...topElements.filter((e) => e.min > 0)]);
      setEditingResource({});
    } else {
      setAllElements([]);
      setDisplayedElements([]);
      setEditingResource(null);
    }
  }, [selectedResource]);

  // BuilderUtils.buildElementTree(selectedResource);
  const resourceBasePath = BuilderUtils.getBasePath(selectedResource);

  console.log("resourceEditor: ", selectedResource);
  return (
    <Box
      sx={{
        border: "2px solid gray",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          p: 1,
        }}
      >
        <Typography>{selectedResource.path}</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography>ID: {selectedResource.id}</Typography>
        <IconButton onClick={() => onCancel(selectedResource)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ m: 2 }}>
        <ElementSelector
          basePath={resourceBasePath}
          options={allElements.filter(
            (e) =>
              e.path.toUpperCase() !==
              `${resourceBasePath}.extension`.toUpperCase()
          )}
          value={displayedElements}
          onChange={(event, newValue: any | null) => {
            setDisplayedElements(newValue ?? []);
          }}
        />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: "100%",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={activeTab}
          onChange={(e, newValue) => {
            console.log("newValue: ", newValue);
            setActiveTab(newValue);
          }}
          aria-label="Vertical tabs example"
          sx={{
            borderRight: 1,
            borderColor: "divider",
            "&& .MuiTab-root": {
              alignItems: "baseline",
            },
          }}
        >
          {displayedElements?.map((element) => {
            return (
              <Tab
                sx={{ textAlign: "left" }}
                label={`${element.path.substring(resourceBasePath.length + 1)}${
                  element.min > 0 ? " *" : ""
                }`}
              />
            );
          })}
        </Tabs>
        <ElementEditor
          elementDefinition={displayedElements?.[activeTab]}
          resource={editingResource}
          onChange={(path, value) => {
            setEditingResource((prevState) => {
              const nextState = _.cloneDeep(prevState);
              _.set(nextState, path, value);
              console.log("setting resource: ", nextState);
              return nextState;
            });
          }}
        />
      </Box>
    </Box>
  );
};

export default ResourceEditor;
