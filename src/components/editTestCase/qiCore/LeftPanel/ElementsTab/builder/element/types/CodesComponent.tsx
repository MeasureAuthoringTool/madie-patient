import React, { useEffect, useRef, useState } from "react";
import { TypeComponentProps } from "./TypeComponentProps";
import useFhirDefinitionsServiceApi from "../../../../../../../../api/useFhirDefinitionsService";
import Box from "@mui/system/Box";
import { MenuItem } from "@mui/material";
import { Select } from "@madie/madie-design-system/dist/react";
import * as _ from "lodash";

const CodesComponent = ({
  canEdit,
  structureDefinition,
}: TypeComponentProps) => {
  const [codes, setCodes] = useState([]);
  const fhirDefinitionsService = useRef(useFhirDefinitionsServiceApi());

  useEffect(() => {
    if (structureDefinition) {
      // eslint-disable-next-line no-console
      console.log("valueSet: ", structureDefinition.binding);
      const valueSetVal = structureDefinition.binding?.valueSet;
      if (_.isEmpty(valueSetVal)) {
        console.warn(
          "No valuset binding found on structure definition: ",
          structureDefinition
        );
      } else {
        const valueSetId = valueSetVal.substring(
          valueSetVal.lastIndexOf("/") + 1,
          valueSetVal.indexOf("|")
        );
        fhirDefinitionsService.current
          .getFhirValueSetExpansion(valueSetId)
          .then((expansion) => {
            setCodes(expansion.expansion.contains);
          })
          .catch((error) => {
            console.error(
              `An error occurred while fetching valueSet expansion for valueSet [${valueSetId}]`,
              error
            );
          });
      }
    }
  }, [structureDefinition]);

  return (
    <Box>
      <Select
        label="Code"
        id={"code-selector"}
        inputProps={{
          "data-testid": "code-selector-input",
        }}
        data-testid={"code-selector"}
        SelectDisplayProps={{
          "aria-required": "true",
        }}
        diabled={canEdit}
        options={
          codes
            ? codes.map((concept) => (
                <MenuItem
                  key={concept.code}
                  value={concept.code}
                  data-testid={`code-option-${concept.code}`}
                >
                  {concept.code} - {concept.display}
                </MenuItem>
              ))
            : []
        }
        // value={selectedCodeConcept ? selectedCodeConcept.code : ""}
        // renderValue={(value) => {
        //   if (value === "") {
        //     return placeHolder("Select Code");
        //   }
        //   return `${selectedCodeConcept?.code} - ${selectedCodeConcept?.display_name}`;
        // }}
        // onChange={handleCodeChange}
      />
    </Box>
  );
};

export default CodesComponent;
