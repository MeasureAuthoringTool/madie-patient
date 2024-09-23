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
}

const ElementEditor = ({
  elementDefinition,
  resource,
  resourcePath,
  onChange,
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
  const elementValue = _.get(resource, elemPath);

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
          onChange(elemPath, e);
        }}
        structureDefinition={elementDefinition}
      />
    </Box>
  );
};

export default ElementEditor;
