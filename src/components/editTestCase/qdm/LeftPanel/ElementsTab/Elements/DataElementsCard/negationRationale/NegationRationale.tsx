import React, { useEffect, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import { Chip } from "@mui/material";
import _ from "lodash";
import { DataElement, CqmMeasure, CQL } from "cqm-models";
import { makeStyles } from "@mui/styles";
import CodeInput from "../../../../../../../common/codeInput/CodeInput";
import { Button } from "@madie/madie-design-system/dist/react";

interface NegationRationaleProps {
  handleChange: Function;
  cqmMeasure: CqmMeasure;
  selectedDataElement: DataElement;
  deleteNegationRationale: Function;
}

const useStyles = makeStyles({
  customChips: {
    background: "#0073c8",
    color: "#fff",
    "& .MuiChip-deleteIcon": { color: "#fff" },
  },
});

const NegationRationale = ({
  handleChange,
  cqmMeasure,
  selectedDataElement,
  deleteNegationRationale,
}: NegationRationaleProps) => {
  const classes = useStyles();

  const [negationRationale, setNegationRationale] = useState();
  const [negationRationaleCode, setNegationRationaleCode] =
    useState<CQL.Code>();

  // negationRationaleCode if for the display of the chip
  // If a new code is added/deleted, this will handle the display of updated negation rationale
  useEffect(() => {
    if (!_.isEmpty(selectedDataElement?.negationRationale)) {
      const negationRationale = selectedDataElement?.negationRationale;
      setNegationRationaleCode(negationRationale);
    }
  }, [selectedDataElement]);

  // Deletes the chip & updates JSON
  const handleDeleteNegationRationale = () => {
    setNegationRationaleCode(null);
    deleteNegationRationale();
  };

  const handleNegationRationaleChange = (value) => {
    setNegationRationale(value);
  };

  const isFormValid = () => {
    let isValid = false;
    if (!_.isEmpty(negationRationale)) {
      isValid = true;
    }
    return !isValid;
  };

  return (
    <>
      <div tw="flex w-3/4" data-testid="negation-rationale-div">
        <div tw="flex-grow w-3/4">
          <CodeInput
            handleChange={(val) => {
              if (val) {
                handleNegationRationaleChange(val);
              }
            }}
            canEdit={true}
            valueSets={cqmMeasure?.value_sets}
            required={false}
          />
        </div>
        <div tw="relative pl-2.5">
          <Button
            tw="absolute bottom-0"
            data-testid="add-negation-rationale"
            onClick={() => {
              handleChange(negationRationale);
            }}
            disabled={isFormValid()}
          >
            Add
          </Button>
        </div>
      </div>
      {negationRationaleCode && negationRationaleCode.code && (
        <div tw="flex flex-wrap gap-2 pt-4">
          <Chip
            id={`${negationRationaleCode?.system} : ${negationRationaleCode?.code}`}
            data-testid={`${negationRationaleCode?.system} : ${negationRationaleCode?.code}`}
            className={classes.customChips}
            label={`${negationRationaleCode?.system} : ${negationRationaleCode?.code}`}
            onDelete={() => handleDeleteNegationRationale()}
          />
        </div>
      )}
    </>
  );
};

export default NegationRationale;
