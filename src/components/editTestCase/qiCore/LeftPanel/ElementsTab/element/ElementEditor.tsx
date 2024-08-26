import React from "react";
import { Box } from "@mui/material";
import * as _ from "lodash";
import TypeEditor from "./TypeEditor";

interface ElementEditorProps {
  resource?: any;
  elementDefinition: any;
  value?: any;
  onChange?: (path: string, value: any) => void;
}

const ElementEditor = ({
  elementDefinition,
  resource,
  onChange,
}: ElementEditorProps) => {
  if (_.isNil(elementDefinition)) {
    return <span>No element selected</span>;
  }

  console.log("editing element: ", elementDefinition);

  const type = elementDefinition?.type?.[0];
  console.log("looking at type: ", type);

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TypeEditor
        type={type.code}
        value={_.get(resource, elementDefinition.path)}
        onChange={(e) => {
          onChange(elementDefinition.path, e);
          console.log(e);
        }}
      />
    </Box>
  );
};

export default ElementEditor;
