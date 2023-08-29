import React, { useEffect, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import AttributeChipList from "../AttributeChipList";
import { Select } from "@madie/madie-design-system/dist/react";
import { IconButton, MenuItem } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import _ from "lodash";
import {
  DataElement,
  CqmMeasure,
  ValueSet,
  Concept,
  CodeSystems,
} from "cqm-models";

interface Chip {
  title: String;
  name?: String;
  value?: String;
}

interface CodesProps {
  attributeChipList?: Array<Chip>;
  handleCodeChange: Function;
  cqmMeasure: CqmMeasure;
  selectedDataElement: DataElement;
}

const Codes = ({
  attributeChipList = [],
  handleCodeChange,
  cqmMeasure,
  selectedDataElement,
}: CodesProps) => {
  const [codeMenuOptions, setCodeMenuOptions] = useState<any[]>();
  const [selectedCodeSystemName, setSelectedCodeSystemName] =
    useState<string>("");
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [concepts, setConcepts] = useState<Concept[]>([]);

  const [codeSystems, setCodeSystems] = useState<CodeSystems>();

  const items = attributeChipList.map((chip) => ({
    text: `${chip.title}: ${chip.value}`,
  }));
  console.log("cqmMeasure", cqmMeasure);

  // filters out the appropriate value set for the selected data element and gets all code concepts
  // Also creates an object for CodeSystems oid as key and display name as value
  useEffect(() => {
    const currentValueSet: ValueSet[] = _.filter(cqmMeasure?.value_sets, {
      oid: selectedDataElement.codeListId,
    });
    if (!_.isEmpty(currentValueSet)) {
      setConcepts(currentValueSet[0].concepts);
      const codeSystems: CodeSystems =
        currentValueSet[0].concepts?.reduce((acc, concept) => {
          acc[concept.code_system_oid] = concept.code_system_name;
          return acc;
        }, {}) || [];
      setCodeSystems(codeSystems);
    }
  }, [cqmMeasure, selectedDataElement]);

  const addNewCode = (e) => {
    e.preventDefault();
    handleCodeChange();
  };

  const handleCodeSystemChange = (event) => {
    const name = event.target.value;
    // const concepts = _.omitBy(codeSystemMap, (value) => value === name);
    //
    setSelectedCodeSystemName(name);
    // setCodeMenuOptions(codes);
  };

  return (
    <div id="codes" data-testid="codes-section">
      <AttributeChipList items={items} />
      <div tw="flex mt-3">
        <div tw="w-1/2">
          <Select
            placeHolder={{
              name: "Select Code System",
              value: "",
            }}
            label="Code System"
            id={"code-system-selector"}
            inputProps={{
              "data-testid": "code-system-selector-input",
            }}
            data-testid={"code-system-selector"}
            // disabled={!canEdit}
            required={true}
            SelectDisplayProps={{
              "aria-required": "true",
            }}
            options={
              !!codeSystems
                ? Object.entries(codeSystems).map(([oid, name]) => (
                    <MenuItem
                      key={oid}
                      value={name as string}
                      data-testid={`option-${name}`}
                    >
                      {name}
                    </MenuItem>
                  ))
                : []
            }
            value={selectedCodeSystemName}
            onChange={handleCodeSystemChange}
          />
        </div>
        <div tw="w-1/2 pl-3">
          <Select
            label="Code"
            id={"code-selector"}
            inputProps={{
              "data-testid": "code-selector-input",
            }}
            data-testid={"code-selector"}
            // disabled={!canEdit}
            required={true}
            SelectDisplayProps={{
              "aria-required": "true",
            }}
            options={codeMenuOptions}
            value={selectedCode}
            // renderValue={(value) => {
            //   if (value === "") {
            //     return placeHolder("Select Code");
            //   }
            //   return `${selectedCodeConcept?.code} - ${selectedCodeConcept?.display_name}`;
            // }}
            onChange={handleCodeChange}
          />
        </div>
        <div tw="flex-grow py-6">
          <IconButton onClick={addNewCode}>
            <AddCircleOutlineIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Codes;
