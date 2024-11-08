import React, { useRef } from "react";
import { Box } from "@mui/material";
import * as _ from "lodash";
import TypeEditor from "./TypeEditor";
import useFhirDefinitionsServiceApi from "../../../../../../../api/useFhirDefinitionsService";
import ElementEditorChildren from "./ElementEditorChildren";
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
  console.log("elemPath", elemPath);
  const required = +elementDefinition.min > 0;
  let elementValue = _.get(resource, elemPath);

  console.log("resource", resource);
  console.log("elementDefinition", elementDefinition);
  console.log("resourcePath", resourcePath);

  // we can get the path with el

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
    >
      {/* we're starting at ClaimResponse.item It's got lots of children and we want to render a typeEditor for each of the children with a label */}
      <TypeEditor
        type={type.code}
        required={required}
        value={elementValue}
        onChange={(e) => {
          elementValue = e;
          onChange(elemPath, e);
        }}
        structureDefinition={elementDefinition}
        canEdit={canEdit}
        label={elementDefinition?.id}
      />

      {/* if */}
      <ElementEditorChildren
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
