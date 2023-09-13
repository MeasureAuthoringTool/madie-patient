import React, { useEffect, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import { Select, TextField } from "@madie/madie-design-system/dist/react";
import { IconButton, MenuItem, Chip } from "@mui/material";
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
import { makeStyles } from "@mui/styles";

interface Chip {
  title: String;
  name?: String;
  value?: String;
}

interface CodesProps {
  handleChange: Function;
  cqmMeasure: CqmMeasure;
  selectedDataElement: DataElement;
  deleteCode: Function;
}

const placeHolder = (label) => (
  <span style={{ color: "#717171" }}>{label}</span>
);

const useStyles = makeStyles({
  customChips: {
    background: "#0073c8",
    color: "#fff",
    "& .MuiChip-deleteIcon": { color: "#fff" },
  },
});

const Codes = ({
  handleChange,
  cqmMeasure,
  selectedDataElement,
  deleteCode,
}: CodesProps) => {
  const classes = useStyles();
  const [concepts, setConcepts] = useState<Concept[]>([]);

  const [codeSystems, setCodeSystems] = useState<CodeSystems>();
  const [selectedCodeSystemName, setSelectedCodeSystemName] =
    useState<string>("");

  const [customCodeSystemName, setCustomCodeSystemName] = useState<string>("");
  const [customCodeConcept, setCustomCodeConcept] = useState<string>("");

  const [relatedCodeConcepts, setRelatedCodeConcepts] = useState<Concept[]>([]);
  const [selectedCodeConcept, setSelectedCodeConcept] = useState<Concept>(null);

  const [savedCode, setSavedCode] = useState<Code>(null);

  const [chips, setChips] = useState([]);

  // filters out the appropriate value set for the selected data element and gets all code concepts
  // Also creates an object for CodeSystems oid as key and display name as value
  useEffect(() => {
    const currentValueSet: ValueSet = _.find(cqmMeasure?.value_sets, {
      oid: selectedDataElement?.codeListId,
    });
    if (currentValueSet) {
      setConcepts(currentValueSet.concepts);
      const codeSystems: CodeSystems =
        currentValueSet.concepts?.reduce((acc, concept) => {
          acc[concept.code_system_oid] = concept.code_system_name;
          return acc;
        }, {}) || [];
      setCodeSystems(codeSystems);
    }
  }, [cqmMeasure, selectedDataElement]);

  // In the selected data element, generates a list of chips to be displayed
  // If a new code is added/deleted, this will handle the display of updated Codes
  useEffect(() => {
    if (!_.isEmpty(selectedDataElement?.dataElementCodes) && codeSystems) {
      const chipsToBeDisplayed = selectedDataElement.dataElementCodes.map(
        (codes) => {
          const codeSystemDisplayName =
            codeSystems[codes.system] || codes.system;
          return {
            text: `${codeSystemDisplayName}: ${codes.code}`,
            id: `${codeSystemDisplayName}-${codes.code}`,
          };
        }
      );
      setChips(chipsToBeDisplayed);
    }
  }, [codeSystems, selectedDataElement]);

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

  // Checks if new code is a duplicate based on chip ids.
  const addNewCode = () => {
    if (selectedCodeSystemName === "Custom") {
      const newCodeId = `${customCodeSystemName}-${customCodeConcept}`;
      const existingCode = _.find(chips, _.matches({ id: newCodeId }));
      if (existingCode) {
        const customCqlCode = new CQL.Code(
          customCodeConcept,
          customCodeSystemName, // What is the oid for custom CS
          null,
          customCodeConcept
        );
        handleChange(customCqlCode);
        setSelectedCodeSystemName("");
        setCustomCodeSystemName("");
        setCustomCodeConcept("");
      }
    } else {
      const newCodeId = `${codeSystems[savedCode.system]}-${savedCode.code}`;
      const existingCode = _.find(chips, _.matches({ id: newCodeId }));
      if (existingCode) {
        handleChange(savedCode);
        setSelectedCodeSystemName("");
        setSelectedCodeConcept(null);
      }
    }
  };

  // Deletes the chip & updates JSON
  const handleDeleteCode = (chip) => {
    const remainingChips = chips.filter((c) => {
      return c.id !== chip.id;
    });
    const codeId = chip.id.split("-")[1];
    deleteCode(codeId);
    setChips(remainingChips);
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
      <div tw="flex flex-wrap gap-2">
        {chips.map((chip) => {
          return (
            <Chip
              id={chip?.id}
              data-testid={chip?.id}
              className={classes.customChips}
              label={chip?.text}
              onDelete={() => handleDeleteCode(chip)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Codes;
