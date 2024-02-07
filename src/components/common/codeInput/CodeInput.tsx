import React, { useEffect, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import {
  Select,
  TextField,
  MadieDiscardDialog,
} from "@madie/madie-design-system/dist/react";
import { MenuItem } from "@mui/material";
import { CQL, ValueSet, Concept } from "cqm-models";
import { routeHandlerStore } from "@madie/madie-util";
import _ from "lodash";

type CodeSystems = {
  [name: string]: string;
};

interface CodeInputProps {
  handleChange: Function;
  valueSets: ValueSet[];
  required: boolean;
  canEdit?: boolean;
  title?: string;
  type?: string;
}

const placeHolder = (label) => (
  <span style={{ color: "#717171" }}>{label}</span>
);

const CodeInput = ({
  canEdit = true,
  handleChange,
  valueSets,
  required,
  title,
  type = "",
}: CodeInputProps) => {
  const [selectedValueSet, setSelectedValueSet] = useState<ValueSet>();
  const [selectedCodeSystemName, setSelectedCodeSystemName] =
    useState<string>();
  const [selectedCodeConcept, setSelectedCodeConcept] = useState<Concept>();
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [isCustom, setCustom] = useState<boolean>(false);
  const [customCode, setCustomCode] = useState<string>();

  const { updateRouteHandlerState } = routeHandlerStore;
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);

  useEffect(() => {
    if (selectedCodeSystemName && customCode) {
      const cqlCode = new CQL.Code(
        customCode,
        selectedCodeSystemName,
        null,
        customCode
      );
      handleChange(cqlCode);
    }
  }, [selectedCodeSystemName, customCode]);

  const handleValueSetChange = (event) => {
    updateRouteHandlerState({
      canTravel: false,
      pendingRoute: "",
    });
    const oid = event.target.value;
    // clear value set, code systems, code concepts and selected code
    setSelectedValueSet(undefined);
    setSelectedCodeSystemName("");
    setConcepts([]);
    setSelectedCodeConcept(undefined);
    setCustom(false);
    setCustomCode("");
    if (oid === `custom-vs${type}`) {
      setSelectedValueSet({
        oid: `custom-vs${type}`,
        display_name: "Custom code",
      } as ValueSet);
      setCustom(true);
    } else {
      const valueSet = valueSets.find((vs) => vs.oid === oid);
      setSelectedValueSet(valueSet);
    }
  };

  const handleCodeSystemChange = (event) => {
    const name = event.target.value;
    const concepts = selectedValueSet.concepts.filter(
      (concept) => concept.code_system_name === name
    );
    setConcepts(concepts);
    setSelectedCodeSystemName(concepts[0].code_system_name);
    // reset code dropdown
    setSelectedCodeConcept(undefined);
  };

  const handleCodeChange = (event) => {
    const code = event.target.value;
    const concept = concepts.find((concept) => concept.code === code);
    setSelectedCodeConcept(concept);
    const cqlCode = new CQL.Code(
      code,
      concept.code_system_oid,
      null,
      concept.display_name
    );
    handleChange(cqlCode);
  };

  const valueSetMenuOptions = [
    <MenuItem
      key={`custom-vs${type}`}
      value={`custom-vs${type}`}
      data-testid={`custom-vs${type}`}
    >
      Custom Code
    </MenuItem>,
    _.sortBy(valueSets, "display_name")?.map((vs) => {
      return (
        <MenuItem key={vs.oid} value={vs.oid} data-testid={`option-${vs.oid}`}>
          {vs.display_name}
        </MenuItem>
      );
    }),
  ];

  const codeSystemMenuOptions = () => {
    const codeSystems: CodeSystems =
      selectedValueSet?.concepts?.reduce((acc, concept) => {
        acc[concept.code_system_oid] = concept.code_system_name;
        return acc;
      }, {}) || [];
    return Object.entries(codeSystems).map(([oid, name]) => (
      <MenuItem key={oid} value={name} data-testid={`option-${name}${type}`}>
        {name}
      </MenuItem>
    ));
  };

  const codeMenuOptions = concepts.map((concept) => (
    <MenuItem
      key={concept.code}
      value={concept.code}
      data-testid={`option-${concept.code}`}
    >
      {concept.code} - {concept.display_name}
    </MenuItem>
  ));

  return (
    <div>
      <h4 className="header" tw="text-blue-800">
        {title}
      </h4>
      <Select
        id={`value-set-selector${type}`}
        label="Value Set / Direct Reference Code"
        inputProps={{
          "data-testid": `value-set-selector-input${type}`,
        }}
        data-testid={`value-set-selector${type}`}
        disabled={!canEdit}
        required={required}
        SelectDisplayProps={{
          "aria-required": "true",
        }}
        options={valueSetMenuOptions}
        value={selectedValueSet ? selectedValueSet.oid : ""}
        renderValue={(value) => {
          if (value === "") {
            return placeHolder("Select Value Set / Direct Reference Code");
          }
          return selectedValueSet?.display_name;
        }}
        onChange={handleValueSetChange}
      />
      {selectedValueSet && (
        <div tw="flex mt-3">
          {isCustom ? (
            <>
              <div tw="w-1/2">
                <TextField
                  id={`custom-code-system${type}`}
                  tw="w-full"
                  label="Custom Code System"
                  placeholder="Custom Code System"
                  required={required}
                  disabled={!canEdit}
                  inputProps={{
                    "data-testid": `custom-code-system-input${type}`,
                  }}
                  data-testid={`custom-code-system${type}`}
                  onChange={(event) =>
                    setSelectedCodeSystemName(event.target.value)
                  }
                />
              </div>
              <div tw="w-1/2 pl-3">
                <TextField
                  id={`custom-code${type}`}
                  tw="w-full"
                  label="Custom Code"
                  placeholder="Custom Code"
                  required={required}
                  disabled={!canEdit}
                  inputProps={{
                    "data-testid": `custom-code-input${type}`,
                  }}
                  data-testid="custom-code"
                  onChange={(event) => setCustomCode(event.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div tw="w-1/2">
                <Select
                  placeHolder={{
                    name: "Select Code System",
                    value: "",
                  }}
                  label="Code System"
                  id={`code-system-selector${type}`}
                  inputProps={{
                    "data-testid": `code-system-selector-input${type}`,
                  }}
                  data-testid={`code-system-selector${type}`}
                  disabled={!canEdit}
                  required={required}
                  SelectDisplayProps={{
                    "aria-required": "true",
                  }}
                  options={codeSystemMenuOptions()}
                  value={selectedCodeSystemName ? selectedCodeSystemName : ""}
                  onChange={handleCodeSystemChange}
                />
              </div>
              <div tw="w-1/2 pl-3">
                <Select
                  label="Code"
                  id={`code-selector${type}`}
                  inputProps={{
                    "data-testid": `code-selector-input${type}`,
                  }}
                  data-testid={`code-selector${type}`}
                  disabled={!canEdit}
                  required={required}
                  SelectDisplayProps={{
                    "aria-required": "true",
                  }}
                  options={codeMenuOptions}
                  value={selectedCodeConcept ? selectedCodeConcept?.code : ""}
                  renderValue={(value) => {
                    if (value === "") {
                      return placeHolder("Select Code");
                    }
                    return `${selectedCodeConcept?.code} - ${selectedCodeConcept?.display_name}`;
                  }}
                  onChange={handleCodeChange}
                />
              </div>
            </>
          )}
        </div>
      )}
      <MadieDiscardDialog
        open={discardDialogOpen}
        onContinue={() => {
          setDiscardDialogOpen(false);
        }}
        onClose={() => setDiscardDialogOpen(false)}
      />
    </div>
  );
};

export default CodeInput;
