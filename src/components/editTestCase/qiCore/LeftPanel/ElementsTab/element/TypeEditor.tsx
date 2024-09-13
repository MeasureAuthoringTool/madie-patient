import React, { useEffect, useRef, useState } from "react";
import * as _ from "lodash";
import Box from "@mui/material/Box";
import { TextField, InputLabel } from "@madie/madie-design-system/dist/react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimeField } from "@mui/x-date-pickers";
import useFhirDefinitionsServiceApi from "../../../../../../api/useFhirDefinitionsService";
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
  const [typeDefinition, setTypeDefinition] = useState(null);
  const [childTypes, setChildTypes] = useState([]);
  const fhirDefinitionsService = useRef(useFhirDefinitionsServiceApi());

  useEffect(() => {
    if (!fhirDefinitionsService.current.isComponentDataType(type)) {
      // if (type && type.toUpperCase() !== "CODE") {
      //   console.log(`TypeEditor - load resourceTree for type [${type}]`);
      //   fhirDefinitionsService.current.getResourceTree(type).then((def) => {
      //     console.log("TypeEditor - got type def: ", def);
      //     setTypeDefinition(def?.definition ?? {});
      //   });
      // } else if (_.isNil(type)) {
      //   setTypeDefinition({});
      // } else if (type.toUpperCase() === "CODE") {
      //   setTypeDefinition({});
      // }
      fhirDefinitionsService.current.getResourceTree(type).then((def) => {
        console.log("TypeEditor - got type def: ", def);
        const elements =
          fhirDefinitionsService.current.getTopLevelElements(def);
        console.log("TypeEditor - elements for typedef: ", elements);
        setChildTypes(elements);
        // setTypeDefinition(def?.definition ?? {});
      });
    }
  }, [type]);

  const elementsMinusRoot = typeDefinition?.snapshot?.element;
  if (elementsMinusRoot && elementsMinusRoot[0]?.path === type) {
    elementsMinusRoot?.shift();
  }

  console.log(`element of type [${type}] is required: `, required);

  if (fhirDefinitionsService.current.isComponentDataType(type)) {
    // if (type === "string" || type === "http://hl7.org/fhirpath/System.String") {
    //   return (
    //     <StringComponent
    //       value={value}
    //       onChange={onChange}
    //       structureDefinition={null}
    //       fieldRequired={required}
    //     />
    //   );
    // }
    const label = "";
    switch (type) {
      case "string":
      case "http://hl7.org/fhirpath/System.String":
        return (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
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
        console.log(`TypeEditor - type [${type}]: `, structureDefinition);
        return <div>Unsupported Type [{type}]</div>;
    }
  } else if (!_.isEmpty(childTypes)) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {childTypes?.map((childTypeDef) => {
          console.log("need to pull type off: ", childTypeDef);
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
    console.log("not basic type and children: ", childTypes);
    return <></>;
  }

  // todo: gracefully handle primitive data types
  /*
  if (type === "string" || type === "http://hl7.org/fhirpath/System.String") {
    return (
      <StringComponent
        value={value}
        onChange={onChange}
        structureDefinition={null}
        fieldRequired={required}
      />
    );
  } else if (type.toUpperCase() !== "CODE" && !_.isEmpty(elementsMinusRoot)) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {elementsMinusRoot?.map((e) => {
          const elementRequired = +e.min >= 1;
          const label = _.startCase(e.path.substring(type.length + 1));
          switch (e.type?.[0].code) {
            case "string":
            case "http://hl7.org/fhirpath/System.String":
              console.log(
                `TypeEditor - found string element [$${JSON.stringify(
                  e.type
                )}]`,
                e
              );
              return (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    label={label}
                    placeholder={`Enter the ${label}`}
                    required={elementRequired}
                    disabled={false}
                    id={`type-editor-${label}`}
                    inputProps={{
                      "data-testid": `type-editor-${label}-testId`,
                      "aria-describedby": "title-helper-text",
                      required: elementRequired,
                      "aria-required": elementRequired,
                    }}
                    size="small"
                  />
                </Box>
              );
            case "http://hl7.org/fhirpath/System.DateTime":
              return (
                <DateTimeComponent
                  label={""}
                  structureDefinition={null}
                  fieldRequired={false}
                />
              );
            case "Period":
              return (
                <PeriodComponent
                  label={label}
                  structureDefinition={null}
                  fieldRequired={false}
                />
              );
            default:
              console.log(
                `TypeEditor - type [${type}] has field with path: [${e.path}]`,
                e
              );
              return (
                <>
                  <span>
                    Not supported - path [{e.path.substring(type.length + 1)}],
                    type [{e.type?.[0].code}]
                  </span>
                </>
              );
          }
        })}
      </Box>
    );
    return <div>Unsupported Type [{type}]</div>;
    }
    */
};

export default TypeEditor;
