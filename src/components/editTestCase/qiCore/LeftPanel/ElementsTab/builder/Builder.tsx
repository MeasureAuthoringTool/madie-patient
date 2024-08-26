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

const Builder = ({ testCase }: { testCase?: TestCase }) => {
  const [resources, setResources] = useState([]);
  const builderUtils = useRef(new BuilderUtils());
  // const [selectedResources, setSelectedResources] = useState([]);
  const [activeResource, setActiveResource] = useState(null);
  const [bundle, setBundle] = useState(null);

  useEffect(() => {
    builderUtils.current
      .getResources()
      .then((resources) => setResources(_.uniq(resources.sort())))
      .catch((err) =>
        console.error("An error occurred while fetching resources", err)
      );
  }, []);

  useEffect(() => {
    if (testCase?.json && !_.isEmpty(resources)) {
      // do stuff
      const bundle = JSON.parse(testCase.json);
      setBundle(bundle);
      console.log("bundle is: ", bundle);

    }
  }, [testCase?.json, resources]);

  const handleResourceSelected = async (resourceName: string) => {
    // eslint-disable-next-line no-console
    console.log("resource selected: ", resourceName);
    const resourceTree = await builderUtils.current.getResourceTree(
      resourceName
    );
    // eslint-disable-next-line no-console
    console.log("resourceTree", resourceTree);
    const resource = { ...resourceTree, id: uuidv4() };
    // setSelectedResources((prevState) => [...prevState, resource]);
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
        {!activeResource && (
          <ResourceList
            resources={resources}
            onClick={handleResourceSelected}
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
            setActiveResource(row);
          }}
          onRowDelete={(row) => {
            setBundle((prevState) => {
              const nextState = _.cloneDeep(prevState);
              nextState.entry = nextState.entry.filter((e) => e.resource.id !== row.resource.id);
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
    </Box>
  );
};

export default Builder;
