import React, { useEffect, useRef, useState } from "react";
import { Box, Divider } from "@mui/material";
import * as _ from "lodash";
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
import { ResourceIdentifier } from "../../../../../../api/models/ResourceIdentifier";

interface BuilderProps {
  testCase: TestCase;
  canEdit: boolean;
}

const Builder = ({ testCase, canEdit }: BuilderProps) => {
  const [resources, setResources] = useState<ResourceIdentifier[]>([]);
  const fhirDefinitionsService = useRef(useFhirDefinitionsServiceApi());
  const [activeResource, setActiveResource] = useState(null);
  const [activeDefinition, setActiveDefinition] = useState(null);
  const { state, dispatch } = useQiCoreResource();

  useEffect(() => {
    fhirDefinitionsService.current
      .getResources()
      .then((resources) => {
        if (!_.isEmpty(resources)) {
          setResources(_.uniq(resources.sort()));
        }
      })
      .catch((err) =>
        console.error("An error occurred while fetching resources", err)
      );
  }, []);

  const handleResourceSelected = async (bundleEntry: any) => {
    const profile = _.isArray(bundleEntry?.resource?.meta?.profile)
      ? bundleEntry?.resource?.meta?.profile[0]
      : bundleEntry?.resource?.meta?.profile;
    const resourceId = profile
      ? profile.substring(profile.lastIndexOf("/") + 1)
      : bundleEntry?.resource?.resourceType;
    const resourceTree = await fhirDefinitionsService.current.getResourceTree(
      resourceId
    );
    const resource = { ...resourceTree, bundleEntry };
    setActiveResource(resource);
    setActiveDefinition({ ...resourceTree });
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
            resourceIdentifiers={resources}
            onClick={(resourceIdentifier: ResourceIdentifier) => {
              const id = uuidv4();
              const newEntry = {
                fullUrl: `https://madie.cms.gov/${resourceIdentifier.type}/${id}`,
                resource: {
                  id,
                  resourceType: resourceIdentifier.type,
                },
              };
              if (!_.isEmpty(resourceIdentifier.profile)) {
                newEntry.resource["meta"] = {
                  profile: [resourceIdentifier.profile],
                };
              }
              newEntry;
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
            selectedResourceDefinition={activeDefinition}
            onSave={(resource) => {}}
            onCancel={(resource) => {
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
