import React, { useState } from "react";
import * as _ from "lodash";
import { Box } from "@mui/material";
import TypeEditor from "./TypeEditor";

const Element = ({ element, label, resource, handleChange, canEdit }) => {
  let elementValue = _.get(resource, label);
  return (
    <Box>
      <TypeEditor
        type={element?.type?.[0].code}
        required={element?.min > 0}
        value={elementValue}
        onChange={(e) => {
          elementValue = e;
          handleChange(element.path, e);
        }}
        structureDefinition={element}
        canEdit={canEdit}
        label={label}
      />
    </Box>
  );
};

const ElementEditorChildren = ({
  allChildren,
  currentDepth,
  resource,
  handleChange,
  canEdit,
}) => {
  currentDepth = currentDepth + 1;
  const childrenToRender = [];
  const childrenLeftOver = [];

  allChildren.forEach((child) => {
    if (child.path.split(".").length === currentDepth) {
      childrenToRender.push(child);
    } else {
      childrenLeftOver.push(child);
    }
  });
  //
  let heading = "";
  if (childrenToRender?.length > 0) {
    const path = childrenToRender[0].path.split(".");
    console.log("current", currentDepth, path);
    heading = path[currentDepth - 2];
  }
  if (childrenToRender.length > 0) {
    return (
      <Box
        style={{
          paddingLeft: "25px",
          borderBottom: "dashed 1px #000",
          borderLeft: "dashed 1px #000",
          paddingBottom: "25px",
        }}
      >
        <b>{_.startCase(heading)}</b>
        <div
          style={{
            marginBottom: "15px",
            width: "100%",
            borderBottom: "solid 1px #000",
          }}
        />
        {/* We want to add a label for path similarity. here it would be ClaimResponse.item */}
        {childrenToRender.map((child) => (
          <Element
            element={child}
            label={child.path.split(".")[child.path.split(".").length - 1]}
            resource={resource}
            handleChange={handleChange}
            canEdit={canEdit}
          />
        ))}
        {childrenLeftOver.length > 0 && (
          <ElementEditorChildren
            allChildren={childrenLeftOver}
            currentDepth={currentDepth}
            resource={resource}
            handleChange={handleChange}
            canEdit={canEdit}
          />
        )}
      </Box>
    );
  }
  return null;
};

export default ElementEditorChildren;
