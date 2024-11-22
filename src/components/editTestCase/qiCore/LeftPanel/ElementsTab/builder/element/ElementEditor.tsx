import React, { useRef } from "react";
import { Box } from "@mui/material";
import * as _ from "lodash";
import TypeEditor from "./TypeEditor";
import useFhirDefinitionsServiceApi from "../../../../../../../api/useFhirDefinitionsService";
import ElementEditorChildren from "./ElementEditorChildren";
import "./ElementEditor.scss";
interface ElementEditorProps {
  resource?: any;
  selectedResource?: any;
  elementDefinition: any;
  resourcePath: string;
  value?: any;
  onChange?: (path: string, value: any) => void;
  canEdit: boolean;
}

const ElementEditor = ({
  selectedResource,
  resource,
  elementDefinition,
  resourcePath,
  onChange,
  canEdit,
}: ElementEditorProps) => {
  const fhirDefinitionsService = useRef(useFhirDefinitionsServiceApi());

  if (_.isNil(elementDefinition)) {
    return <span>No element selected</span>;
  }
  const type = elementDefinition?.type?.[0];
  const elemPath = fhirDefinitionsService.current.stripResourcePath(
    resourcePath,
    elementDefinition.path
  );
  // console.log("elemPath", elemPath);
  const required = +elementDefinition.min > 0;
  let elementValue = _.get(resource, elemPath);

  const currentPath = elementDefinition?.path;

  const allChildren = fhirDefinitionsService.current.getAllChildren(
    selectedResource,
    currentPath
  );

  // We will hit all direct children normally with the typeEditor however not every second child;
  const currentDepth = elementDefinition?.path.split(".").length;
  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
      id="element-editor"
    >
      {/* we need to render not only the current item, but all children */}
      <ElementEditorChildren //recursive render control
        // stuff we need only at the init root
        resourcePath={resourcePath}
        fhirDefinitionsService={fhirDefinitionsService}
        rootDefinition={elementDefinition}
        // stuff we need everywhere
        allChildren={allChildren}
        currentDepth={currentDepth}
        resource={resource}
        handleChange={onChange}
        canEdit={canEdit}
      />
    </Box>
  );
};

export default ElementEditor;
