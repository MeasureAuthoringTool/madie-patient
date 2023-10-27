import React, { useState } from "react";
import "twin.macro";
import "styled-components/macro";
import { CQL, ValueSet } from "cqm-models";
import IntegerInput from "../IntegerInput/IntegerInput";
import CodeInput from "../codeInput/CodeInput";

interface CodeInputProps {
  canEdit: boolean;
  handleChange: Function;
  valueSets: ValueSet[];
  required: boolean;
  title?: string;
}

const DiagnosisComponent = ({
  canEdit,
  handleChange,
  valueSets,
  required,
}: CodeInputProps) => {
  const [diagnosisCode, setDiagnosisCode] = useState<CQL.Code>();
  const [presentOnAdmissionIndicator, setPresentOnAdmissionIndicator] =
    useState<CQL.Code>();
  const [rank, setRank] = useState<number>();

  const handleValueSetChange = (valueSet) => {
    setDiagnosisCode(valueSet);
    if (presentOnAdmissionIndicator && rank) {
      handleChange({
        code: valueSet,
        presentOnAdmissionIndicator: presentOnAdmissionIndicator,
        rank: rank,
      });
    }
  };

  const handleValueSetChangePOAI = (valueSet) => {
    setPresentOnAdmissionIndicator(valueSet);
    if (diagnosisCode && rank) {
      handleChange({
        code: diagnosisCode,
        presentOnAdmissionIndicator: valueSet,
        rank: rank,
      });
    }
  };

  const handleRankChange = (input) => {
    setRank(input);
    if (diagnosisCode && presentOnAdmissionIndicator) {
      handleChange({
        code: diagnosisCode,
        presentOnAdmissionIndicator: presentOnAdmissionIndicator,
        rank: input,
      });
    }
  };

  return (
    <div data-testid="DiagnosisComponent">
      <CodeInput
        handleChange={(val) => {
          if (val) {
            handleValueSetChange(val);
          }
        }}
        canEdit={canEdit}
        valueSets={valueSets}
        required={required}
        title="Code"
      />

      {/* Present On Admission Indicator */}
      <div tw="pt-3 text-blue-800">
        <CodeInput
          handleChange={(val) => {
            if (val) {
              handleValueSetChangePOAI(val);
            }
          }}
          canEdit={canEdit}
          valueSets={valueSets}
          required={required}
          title="Present On Admission Indicator"
          type="-present-on-admission-indicator"
        />
      </div>
      <div tw="pt-3 text-blue-800">
        <IntegerInput
          intValue={null}
          canEdit={canEdit}
          handleChange={(val) => handleRankChange(parseInt(val))}
          label="Rank"
          allowNegative={true}
        />
      </div>
    </div>
  );
};

export default DiagnosisComponent;
