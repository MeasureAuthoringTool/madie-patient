import React, { useRef } from "react";
import { Box } from "@mui/material";
import * as _ from "lodash";
import TypeEditor from "./TypeEditor";
import useFhirDefinitionsServiceApi from "../../../../../../../api/useFhirDefinitionsService";

interface ElementEditorProps {
  resource?: any;
  elementDefinition: any;
  resourcePath: string;
  value?: any;
  onChange?: (path: string, value: any) => void;
  canEdit: boolean;
}

const ElementEditor = ({
  elementDefinition,
  resource,
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
  const required = +elementDefinition.min > 0;
  let elementValue = _.get(resource, elemPath);

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
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
    </Box>
  );
};

export default ElementEditor;
