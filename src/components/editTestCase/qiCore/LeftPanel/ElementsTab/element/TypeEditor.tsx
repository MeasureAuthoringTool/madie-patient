import React, { useEffect, useState } from "react";
import IdentifierInput from "../../../../../common/Identifier/IdentifierInput";
import * as _ from "lodash";
import { BuilderUtils } from "../builder/BuilderUtils";
import Box from "@mui/material/Box";
import { TextField, InputLabel } from "@madie/madie-design-system/dist/react";
import DateTimeInterval from "../../../../../common/dateTimeInterval/DateTimeInterval";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimeField } from "@mui/x-date-pickers";

const TypeEditor = ({ type, value, onChange }) => {
  const [typeDefinition, setTypeDefinition] = useState(null);

  useEffect(() => {
    if (type && type.toUpperCase() !== "CODE") {
      console.log(`TypeEditor - load resourceTree for type [${type}]`);
      BuilderUtils.getResourceTree(type).then((def) => {
        console.log("TypeEditor - got type def: ", def);
        setTypeDefinition(def?.definition ?? {});
      });
    } else if (_.isNil(type)) {
      setTypeDefinition({});
    } else if (type.toUpperCase() === "CODE") {
      setTypeDefinition({});
    }
  }, [type]);

  const elementsMinusRoot = typeDefinition?.snapshot?.element;
  if (elementsMinusRoot && elementsMinusRoot[0]?.path === type) {
    elementsMinusRoot?.shift();
  }

  // todo: gracefully handle primitive data types
  if (type === "string" || type === "http://hl7.org/fhirpath/System.String") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          required
          disabled={false}
          id={`type-editor-`}
          inputProps={{
            "data-testid": `type-editor-testId`,
            "aria-describedby": "title-helper-text",
            required: true,
            "aria-required": true,
          }}
          size="small"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Box>
    );
  } else if (type.toUpperCase() !== "CODE" && !_.isEmpty(elementsMinusRoot)) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {elementsMinusRoot?.map((e) => {
          const label = _.startCase(e.path.substring(type.length + 1));
          switch (e.type?.[0].code) {
            case "string":
            case "http://hl7.org/fhirpath/System.String":
              console.log("TypeEditor - found string element: ", e.type);
              return (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    label={label}
                    placeholder={`Enter the ${label}`}
                    required
                    disabled={false}
                    id={`type-editor-${label}`}
                    inputProps={{
                      "data-testid": `type-editor-${label}-testId`,
                      "aria-describedby": "title-helper-text",
                      required: true,
                      "aria-required": true,
                    }}
                    size="small"
                    // value={""}
                    // onChange={onChange}
                  />
                </Box>
              );
            case "Period":
              return (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <InputLabel>{label}</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "start",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "start",
                        }}
                      >
                        <InputLabel>Start</InputLabel>
                        <DateTimeField
                          label="start"
                          variant="filled"
                          sx={{ width: "220px" }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "start",
                        }}
                      >
                        <InputLabel>End</InputLabel>
                        <DateTimeField
                          label="end"
                          variant="filled"
                          sx={{ width: "220px" }}
                        />
                      </Box>
                    </Box>
                  </LocalizationProvider>
                  <br />
                </Box>
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
  }

  return <div>Unsupported Type [{type}]</div>;
};

export default TypeEditor;
