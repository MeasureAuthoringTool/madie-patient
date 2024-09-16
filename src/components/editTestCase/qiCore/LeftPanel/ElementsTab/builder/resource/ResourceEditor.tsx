import React, { useEffect, useRef, useState } from "react";
import { Box, Divider, IconButton, Tab, Tabs } from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import ElementEditor from "../element/ElementEditor";
import ElementSelector from "../element/ElementSelector";
import * as _ from "lodash";
import useFhirDefinitionsServiceApi from "../../../../../../../api/useFhirDefinitionsService";
import {
  ResourceActionType,
  useQiCoreResource,
} from "../../../../../../../util/QiCorePatientProvider";

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
  const fhirDefinitionsService = useRef(useFhirDefinitionsServiceApi());
  const { state, dispatch } = useQiCoreResource();

  useEffect(() => {
    if (selectedResource) {
      // TODO: look at the data that exists on the resource and combine fields from that
      console.log(
        `ResourceEditor-useEffect[selectedResource]: `,
        _.cloneDeep(selectedResource)
      );
      const topElements =
        fhirDefinitionsService.current.getTopLevelElements(selectedResource);
      setAllElements(topElements);
      const requiredElements = [...topElements.filter((e) => e.min > 0)];
      const elementsWithValues = [
        ...topElements.filter((e) => {
          const elemPath = fhirDefinitionsService.current.stripResourcePath(
            selectedResource.path,
            e.path
          );
          const elemValue = _.get(
            selectedResource.bundleEntry.resource,
            elemPath
          );
          return !_.isNil(elemValue);
        }),
      ];
      setDisplayedElements(
        _.uniq(_.concat(requiredElements, elementsWithValues))
      );
    } else {
      setAllElements([]);
      setDisplayedElements([]);
    }
  }, [selectedResource]);

  // BuilderUtils.buildElementTree(selectedResource);
  const resourceBasePath =
    fhirDefinitionsService.current.getBasePath(selectedResource);

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
        <Typography>
          ID: {selectedResource?.bundleEntry?.resource?.id}
        </Typography>
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
          aria-label="Resource element tabs"
          sx={{
            borderRight: 1,
            borderColor: "divider",
            "&& .MuiTab-root": {
              alignItems: "baseline",
            },
            width: 150,
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
          resource={selectedResource.bundleEntry?.resource}
          resourcePath={selectedResource.path}
          onChange={(path, value) => {
            console.log(`resource path [${path}] has new value: `, value);
            console.log(
              `update bundle entry resource at path [${path}]`,
              selectedResource.bundleEntry
            );
            const nextEntry = _.cloneDeep(selectedResource.bundleEntry);
            _.set(nextEntry.resource, path, value);
            console.log(
              "dispatching modifyBundleEntry for nextEntry: ",
              nextEntry
            );
            dispatch({
              type: ResourceActionType.MODIFY_BUNDLE_ENTRY,
              payload: nextEntry,
            });
            // setEditingResource((prevState) => {
            //   const nextState = _.cloneDeep(prevState);
            //   _.set(nextState, path, value);
            //   console.log("setting resource: ", nextState);
            //   return nextState;
            // });
          }}
        />
      </Box>
    </Box>
  );
};

export default ResourceEditor;
