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
              disabled={false}
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
            disabled={false}
            structureDefinition={null}
            fieldRequired={false}
          />
        );
      case "dateTime":
      case "http://hl7.org/fhirpath/System.DateTime":
        return (
          <DateTimeComponent
            label={""}
            disabled={false}
            structureDefinition={null}
            fieldRequired={false}
          />
        );
      case "boolean":
        return (
          <BooleanComponent
            disabled={false}
            structureDefinition={null}
            fieldRequired={false}
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
