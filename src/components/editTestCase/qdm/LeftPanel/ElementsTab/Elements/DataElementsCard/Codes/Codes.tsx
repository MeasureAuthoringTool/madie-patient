import React, { useEffect, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import AttributeChipList from "../AttributeChipList";
import { Select, TextField } from "@madie/madie-design-system/dist/react";
import { IconButton, MenuItem } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import _ from "lodash";
import {
  DataElement,
  CqmMeasure,
  ValueSet,
  Concept,
  CodeSystems,
  CQL,
  Code,
} from "cqm-models";

interface Chip {
  title: String;
  name?: String;
  value?: String;
}

interface CodesProps {
  attributeChipList?: Array<Chip>;
  handleChange: Function;
  cqmMeasure: CqmMeasure;
  selectedDataElement: DataElement;
}

const placeHolder = (label) => (
  <span style={{ color: "#717171" }}>{label}</span>
);

const Codes = ({
  attributeChipList = [],
  handleChange,
  cqmMeasure,
  selectedDataElement,
}: CodesProps) => {
  const [concepts, setConcepts] = useState<Concept[]>([]);

  const [codeSystems, setCodeSystems] = useState<CodeSystems>();
  const [selectedCodeSystemName, setSelectedCodeSystemName] =
    useState<string>("");

  const [customCodeSystemName, setCustomCodeSystemName] = useState<string>("");
  const [customCodeConcept, setCustomCodeConcept] = useState<string>("");

  const [relatedCodeConcepts, setRelatedCodeConcepts] = useState<Concept[]>([]);
  const [selectedCodeConcept, setSelectedCodeConcept] = useState<Concept>(null);

  const [savedCode, setSavedCode] = useState<Code>(null);

  const items = attributeChipList.map((chip) => ({
    text: `${chip.title}: ${chip.value}`,
  }));

  // filters out the appropriate value set for the selected data element and gets all code concepts
  // Also creates an object for CodeSystems oid as key and display name as value
  useEffect(() => {
    const currentValueSet: ValueSet[] = _.filter(cqmMeasure?.value_sets, {
      oid: selectedDataElement?.codeListId,
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

  const getCodeSystemMenuOptions = () => {
    return [
      <MenuItem
        key="Custom"
        value="Custom"
        data-testid={`code-system-option-custom`}
      >
        Custom
      </MenuItem>,
      ...Object.entries(codeSystems).map(([oid, name]) => (
        <MenuItem
          key={oid}
          value={name as string}
          data-testid={`code-system-option-${name}`}
        >
          {name}
        </MenuItem>
      )),
    ];
  };

  const handleCodeSystemChange = (event) => {
    setSelectedCodeConcept(null);
    const selectedCodeSystemName = event.target.value;
    setSelectedCodeSystemName(selectedCodeSystemName);
    const codeConceptsForSelectedCS = _.filter(
      concepts,
      (concept) => concept.code_system_name === selectedCodeSystemName
    );
    setRelatedCodeConcepts(codeConceptsForSelectedCS);
  };

  const handleCodeChange = (event) => {
    const code = event.target.value;
    const concept = _.find(concepts, (concept) => concept.code === code);
    setSelectedCodeConcept(concept);
    const cqlCode = new CQL.Code(
      code,
      concept.code_system_oid,
      null,
      concept.display_name
    );
    setSavedCode(cqlCode);
  };

  const addNewCode = () => {
    if (selectedCodeSystemName === "Custom") {
      const customCqlCode = new CQL.Code(
        customCodeConcept,
        customCodeSystemName, // What is the oid for custom CS
        null,
        customCodeConcept
      );
      handleChange(customCqlCode);
    } else {
      handleChange(savedCode);
    }
  };

  const isFormValid = () => {
    let isValid = false;
    if (!_.isEmpty(selectedCodeSystemName)) {
      if (selectedCodeSystemName === "Custom") {
        isValid =
          !_.isEmpty(customCodeSystemName) && !_.isEmpty(customCodeConcept);
      } else {
        isValid = !_.isEmpty(selectedCodeConcept);
      }
    }
    return !isValid;
  };

  return (
    <div id="codes" data-testid="codes-section">
      <AttributeChipList items={items} />
      <div tw="flex md:flex-wrap mt-3">
        <div tw="w-1/4">
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
            SelectDisplayProps={{
              "aria-required": "true",
            }}
            options={!!codeSystems ? getCodeSystemMenuOptions() : []}
            value={selectedCodeSystemName}
            onChange={handleCodeSystemChange}
          />
        </div>
        {!_.isEmpty(selectedCodeSystemName) && (
          <>
            {selectedCodeSystemName === "Custom" ? (
              <div tw="flex md:flex-wrap w-1/2">
                <div tw="w-1/2 pl-3">
                  <TextField
                    id="custom-code-system"
                    tw="w-full"
                    label="Custom Code System"
                    placeholder="Custom Code System"
                    inputProps={{
                      "data-testid": "custom-code-system-input",
                    }}
                    data-testid="custom-code-system"
                    onChange={(event) =>
                      setCustomCodeSystemName(event.target.value)
                    }
                  />
                </div>
                <div tw="w-1/2 pl-3">
                  <TextField
                    id="custom-code"
                    tw="w-full"
                    label="Custom Code"
                    placeholder="Custom Code"
                    inputProps={{
                      "data-testid": "custom-code-input",
                    }}
                    data-testid="custom-code"
                    onChange={(event) =>
                      setCustomCodeConcept(event.target.value)
                    }
                  />
                </div>
              </div>
            ) : (
              <div tw="w-1/2 pl-3">
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
                  options={
                    relatedCodeConcepts
                      ? relatedCodeConcepts.map((concept) => (
                          <MenuItem
                            key={concept.code}
                            value={concept.code}
                            data-testid={`code-option-${concept.code}`}
                          >
                            {concept.code} - {concept.display_name}
                          </MenuItem>
                        ))
                      : []
                  }
                  value={selectedCodeConcept ? selectedCodeConcept.code : ""}
                  renderValue={(value) => {
                    if (value === "") {
                      return placeHolder("Select Code");
                    }
                    return `${selectedCodeConcept?.code} - ${selectedCodeConcept?.display_name}`;
                  }}
                  onChange={handleCodeChange}
                />
              </div>
            )}
          </>
        )}
        <div tw="w-1/4 py-6">
          <IconButton
            disabled={isFormValid()}
            data-testid="add-code-concept-button"
            onClick={addNewCode}
          >
            <AddCircleOutlineIcon sx={{ color: "#0073c8" }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Codes;
