import React, { useEffect, useRef, useState } from "react";
import * as _ from "lodash";
import Box from "@mui/material/Box";
import useFhirDefinitionsServiceApi from "../../../../../../../api/useFhirDefinitionsService";
import StringComponent from "./types/StringComponent";
import PeriodComponent from "./types/PeriodComponent";
import DateTimeComponent from "./types/DateTimeComponent";
import BooleanComponent from "./types/BooleanComponent";
import DateComponent from "./types/DateComponent";

const TypeEditor = ({
  type,
  required,
  value,
  onChange,
  structureDefinition,
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
    const label = "";
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
            canEdit={true}
            structureDefinition={structureDefinition}
            fieldRequired={required}
            label={``}
            onChange={onChange}
            value={value}
          />
        );
      case "boolean":
        return (
          <BooleanComponent
            canEdit={false}
            structureDefinition={null}
            fieldRequired={false}
          />
        );
      case "date":
        return (
          <DateComponent
            canEdit={true}
            structureDefinition={structureDefinition}
            fieldRequired={required}
            label={``}
            onChange={onChange}
            value={value}
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
              onChange={() => {}}
              value={null}
              structureDefinition={childTypeDef}
              required={childRequired}
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
