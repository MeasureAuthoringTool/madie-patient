import React, { useEffect, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import { IconButton, Chip } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import _ from "lodash";
import { DataElement, CqmMeasure, CQL } from "cqm-models";
import { makeStyles } from "@mui/styles";
import CodeInput from "../../../../../../../common/codeInput/CodeInput";

interface Chip {
  title: String;
  name?: String;
  value?: String;
}

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
        <div tw="flex-grow py-6">
          <IconButton
            data-testid="add-negation-rationale"
            onClick={() => {
              handleChange(negationRationale);
            }}
          >
            <AddCircleOutlineIcon sx={{ color: "#0073c8" }} />
          </IconButton>
        </div>
      </div>
      {negationRationaleCode && negationRationaleCode.code && (
        <div tw="flex flex-wrap gap-2 pt-4">
          <Chip
            id={`${negationRationaleCode?.code}: ${negationRationaleCode?.system}`}
            data-testid={`${negationRationaleCode?.code}: ${negationRationaleCode?.system}`}
            className={classes.customChips}
            label={`${negationRationaleCode?.code}: ${negationRationaleCode?.system}`}
            onDelete={() => handleDeleteNegationRationale()}
          />
        </div>
      )}
    </>
  );
};

export default NegationRationale;
