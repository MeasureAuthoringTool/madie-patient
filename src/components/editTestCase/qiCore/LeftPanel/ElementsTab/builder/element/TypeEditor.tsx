import React, { useEffect, useRef, useState } from "react";
import * as _ from "lodash";
import Box from "@mui/material/Box";
import useFhirDefinitionsServiceApi from "../../../../../../../api/useFhirDefinitionsService";
import StringComponent from "./types/StringComponent";
import PeriodComponent from "./types/PeriodComponent";
import DateTimeComponent from "./types/DateTimeComponent";
import BooleanComponent from "./types/BooleanComponent";
import UriComponent from "./types/UriComponent";
import DateComponent from "./types/DateComponent";
import IntegerComponent from "./types/IntegerComponent";
import CodesComponent from "./types/CodesComponent";

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
              canEdit={true}
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
            canEdit={canEdit}
            structureDefinition={null}
            fieldRequired={required}
            label={label}
            onChange={onChange}
            value={value === true ? "True" : "False"}
          />
        );
      case "uri":
        return (
          <UriComponent
            canEdit={true}
            structureDefinition={structureDefinition}
            fieldRequired={required}
            label={label}
            onChange={onChange}
            value={value}
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
      case "positiveInt":
        return (
          <IntegerComponent
            canEdit={true}
            structureDefinition={structureDefinition}
            fieldRequired={required}
            label={``}
            onChange={onChange}
            value={value}
            unsignedInt={false}
          />
        );
      case "unsignedInt":
        return (
          <IntegerComponent
            canEdit={true}
            structureDefinition={structureDefinition}
            fieldRequired={required}
            label={`Integer Field`}
            onChange={onChange}
            value={value}
            unsignedInt={true}
          />
        );
      case "code":
        return (
          <CodesComponent
            canEdit={true}
            structureDefinition={structureDefinition}
            fieldRequired={required}
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
