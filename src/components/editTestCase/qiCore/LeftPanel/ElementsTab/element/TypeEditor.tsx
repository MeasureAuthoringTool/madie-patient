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
      BuilderUtils.getResourceTree(type).then((def) => {
        console.log("got type def: ", def);
        setTypeDefinition(def.definition);
      });
    } else if (_.isNil(type)) {
      setTypeDefinition(null);
    }
  }, [type]);

  // if (type === "Identifier") {
  //   return (
  //     <IdentifierInput
  //       onIdentifierChange={onChange}
  //       canEdit={true}
  //       identifier={value}
  //     />
  //   );
  // }

  const elementsMinusRoot = typeDefinition?.snapshot?.element;
  elementsMinusRoot?.shift();

  if (type.toUpperCase() !== "CODE") {
    return (
      <Box>
        {elementsMinusRoot?.map((e) => {
          const label = e.path.substring(type.length + 1);
          switch (e.type?.[0].code) {
            case "string":
            case "http://hl7.org/fhirpath/System.String":
              return (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    label={label}
                    placeholder="Test Case Title"
                    required
                    disabled={false}
                    id="test-case-title"
                    inputProps={{
                      "data-testid": "test-case-title",
                      "aria-describedby": "title-helper-text",
                      required: true,
                      "aria-required": true,
                    }}
                    size="small"
                    value={value}
                    onChange={onChange}
                  />
                </Box>
              );
            case "Period":
              return (
                <>
                  <InputLabel>
                    {label} - {e.path}{" "}
                  </InputLabel>
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
                          sx={{ width: "250px" }}
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
                        <DateTimeField label="end" variant="filled" />
                      </Box>
                    </Box>
                  </LocalizationProvider>
                  <br />
                </>
              );
            default:
              console.log(`type [${type}] has field with path: [${e.path}]`, e);
              return (
                <>
                  <span>
                    Not supported - path [{e.path.substring(type.length + 1)}],
                    type [{e.type?.[0].code}]
                  </span>
                  <br />
                </>
              );
          }
        })}
      </Box>
    );
  }

  return <div>Unsupported Type</div>;
};

export default TypeEditor;
