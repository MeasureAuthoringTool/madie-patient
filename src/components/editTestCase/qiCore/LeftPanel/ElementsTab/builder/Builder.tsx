import React, { useEffect, useRef, useState } from "react";
import { Box, Checkbox, Divider, TextField } from "@mui/material";
import * as _ from "lodash";
import ResourceSelector from "./resourceSelector/ResourceSelector";
import ResourceList from "./resource/ResourceList";
import TestCaseSummaryGrid from "./grid/TestCaseSummaryGrid";
import Typography from "@mui/material/Typography";
import { v4 as uuidv4 } from "uuid";
import ResourceEditor from "./resource/ResourceEditor";
import { TestCase } from "@madie/madie-models";
import {
  ResourceActionType,
  useQiCoreResource,
} from "../../../../../../util/QiCorePatientProvider";
import useFhirDefinitionsServiceApi from "../../../../../../api/useFhirDefinitionsService";

interface BuilderProps {
  testCase: TestCase;
  canEdit: boolean;
}

const Builder = ({ testCase, canEdit }: BuilderProps) => {
  const [resources, setResources] = useState([]);
  const fhirDefinitionsService = useRef(useFhirDefinitionsServiceApi());
  const [activeResource, setActiveResource] = useState(null);
  const { state, dispatch } = useQiCoreResource();

  useEffect(() => {
    fhirDefinitionsService.current
      .getResources()
      .then((resources) => setResources(_.uniq(resources.sort())))
      .catch((err) =>
        console.error("An error occurred while fetching resources", err)
      );
  }, []);

  const handleResourceSelected = async (bundleEntry: any) => {
    // eslint-disable-next-line no-console
    console.log("resource selected: ", bundleEntry);
    const resourceName = bundleEntry?.resource?.resourceType;
    const resourceTree = await fhirDefinitionsService.current.getResourceTree(
      resourceName
    );
    // eslint-disable-next-line no-console
    console.log("resourceTree", resourceTree);
    const resource = { ...resourceTree, bundleEntry };
    setActiveResource(resource);
  };

  return (
    <Box sx={{ mr: 2 }}>
      <Box
        sx={{
          height: 350,
          overflowY: "scroll",
        }}
      >
        {!activeResource && canEdit && (
          <ResourceList
            resources={resources}
            onClick={(resourceName: string) => {
              const id = uuidv4();
              const newEntry = {
                fullUrl: `https://madie.cms.gov/${resourceName}/${id}`,
                resource: {
                  id,
                  resourceType: resourceName,
                },
              };
              handleResourceSelected(newEntry);
              dispatch({
                type: ResourceActionType.ADD_BUNDLE_ENTRY,
                payload: newEntry,
              });
            }}
          />
        )}
        {activeResource && (
          <ResourceEditor
            selectedResource={activeResource}
            selectedResourceDefinition={null}
            onSave={(resource) => {
              console.log("saving resource: ", resource);
            }}
            onCancel={(resource) => {
              console.log("cancel edit: ", resource);
              setActiveResource(null);
            }}
          />
        )}
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5">Resources</Typography>
        <Divider sx={{ mb: 1 }} />
        <TestCaseSummaryGrid
          bundle={state?.bundle}
          onRowEdit={(row) => {
            handleResourceSelected(row);
          }}
          onRowDelete={(row) => {
            dispatch({
              type: ResourceActionType.REMOVE_BUNDLE_ENTRY,
              payload: row,
            });
            setActiveResource(null);
          }}
        />
      </Box>
    </Box>
  );
};

export default Builder;
