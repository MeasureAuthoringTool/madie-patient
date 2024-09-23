import React, { useEffect, useRef, useState } from "react";
import * as _ from "lodash";
import Box from "@mui/material/Box";
import useFhirDefinitionsServiceApi from "../../../../../../../api/useFhirDefinitionsService";
import StringComponent from "./types/StringComponent";
import PeriodComponent from "./types/PeriodComponent";
import DateTimeComponent from "./types/DateTimeComponent";
import BooleanComponent from "./types/BooleanComponent";

const TypeEditor = ({
  type,
  required,
  value,
  onChange,
  structureDefinition,
  canEdit,
  label,
}) => {
  const [childTypeDefs, setChildTypeDefs] = useState([]);
  const fhirDefinitionsService = useRef(useFhirDefinitionsServiceApi());

  useEffect(() => {
    if (!fhirDefinitionsService.current.isComponentDataType(type)) {
      fhirDefinitionsService.current.getResourceTree(type).then((def) => {
        const elements =
          fhirDefinitionsService.current.getTopLevelElements(def);
        setChildTypeDefs(elements);
      });
    }
  }, [type]);

  if (fhirDefinitionsService.current.isComponentDataType(type)) {
    switch (type) {
      case "string":
      case "http://hl7.org/fhirpath/System.String":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <StringComponent
              canEdit={false}
              value={value}
              onChange={onChange}
              structureDefinition={null}
              fieldRequired={required}
            />
          </Box>
        );
      case "Period":
        return (
          <PeriodComponent
            label={label}
            canEdit={false}
            structureDefinition={null}
            fieldRequired={false}
          />
        );
      case "dateTime":
      case "http://hl7.org/fhirpath/System.DateTime":
        return (
          <DateTimeComponent
            label={""}
            canEdit={false}
            structureDefinition={null}
            fieldRequired={false}
          />
        );
      case "boolean":
        return (
          <BooleanComponent
            canEdit={canEdit}
            structureDefinition={null}
            fieldRequired={required}
            label={label}
            onChange={onChange}
            value={value === true ? "True" : "False"}
          />
        );
      default:
        return <div>Unsupported Type [{type}]</div>;
    }
  } else if (!_.isEmpty(childTypeDefs)) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {childTypeDefs?.map((childTypeDef) => {
          const childType = childTypeDef?.type?.[0];
          const childRequired = +childTypeDef.min > 0;
          return (
            <TypeEditor
              type={childType?.code}
              onChange={(e) => {}}
              value={null}
              structureDefinition={childTypeDef}
              required={childRequired}
              canEdit={canEdit}
              label={childTypeDef?.id}
            />
          );
        })}
      </Box>
    );
  } else {
    // should only get here when loading child types..
    return <></>;
  }
};

export default TypeEditor;
