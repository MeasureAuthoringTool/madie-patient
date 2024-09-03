import React, { useEffect, useRef, useState } from "react";
import { BuilderUtils } from "./BuilderUtils";
import { Box, Checkbox, Divider, TextField } from "@mui/material";
import * as _ from "lodash";
import ResourceSelector from "./resourceSelector/ResourceSelector";
import ResourceList from "./resource/ResourceList";
import TestCaseSummaryGrid from "./grid/TestCaseSummaryGrid";
import Typography from "@mui/material/Typography";
import { v4 as uuidv4 } from "uuid";
import ResourceEditor from "./resource/ResourceEditor";
import { TestCase } from "@madie/madie-models";

interface BuilderProps {
  testCase: TestCase;
  bundleJson: string;
  canEdit: boolean;
}

const Builder = ({ testCase, bundleJson, canEdit }: BuilderProps) => {
  const [resources, setResources] = useState([]);
  const builderUtils = useRef(new BuilderUtils());
  // const [selectedResources, setSelectedResources] = useState([]);
  const [activeResource, setActiveResource] = useState(null);
  const [bundle, setBundle] = useState(null);
  const [jsonError, setJsonError] = useState(null);

  useEffect(() => {
    builderUtils.current
      .getResources()
      .then((resources) => setResources(_.uniq(resources.sort())))
      .catch((err) =>
        console.error("An error occurred while fetching resources", err)
      );
  }, []);

  useEffect(() => {
    if (bundleJson && !_.isEmpty(resources)) {
      try {
        console.log("parsing bundleJson!", bundleJson);
        setBundle(JSON.parse(bundleJson));
      } catch (error) {
        setJsonError(error);
      }
    }
  }, [bundleJson, resources]);

  const handleResourceSelected = async (bundleEntry: any) => {
    // eslint-disable-next-line no-console
    console.log("resource selected: ", bundleEntry);
    const resourceName = bundleEntry?.resource?.resourceType;
    const resourceTree = await builderUtils.current.getResourceTree(
      resourceName
    );
    // eslint-disable-next-line no-console
    console.log("resourceTree", resourceTree);
    const resource = { ...resourceTree };
    setActiveResource(resource);
  };

  return (
    <Box sx={{ mr: 2 }}>
      {jsonError && (
        <Typography>
          Errors exist in the Test Case JSON. They must be corrected before
          using the UI Builder.
        </Typography>
      )}
      {_.isNil(jsonError) && (
        <>
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
                  // TODO: update JSON with new resource
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
              // selectedResources={selectedResources}
              bundle={bundle}
              onRowEdit={(row) => {
                console.log("edit row: ", row);
                // setActiveResource(row);
                handleResourceSelected(row);
              }}
              onRowDelete={(row) => {
                setBundle((prevState) => {
                  const nextState = _.cloneDeep(prevState);
                  nextState.entry = nextState.entry.filter(
                    (e) => e.resource.id !== row.resource.id
                  );
                  console.log("nextState: ", nextState);
                  return nextState;
                });
                // setSelectedResources((prevState) => [
                //   ...prevState.filter((p) => p.id !== row.id),
                // ]);
                setActiveResource(null);
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Builder;
