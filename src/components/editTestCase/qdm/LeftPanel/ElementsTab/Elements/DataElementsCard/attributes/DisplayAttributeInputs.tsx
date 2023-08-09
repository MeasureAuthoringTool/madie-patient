import React, { useState } from "react";
import { CQL } from "cqm-models";
import * as _ from "lodash";
import { DateField } from "@madie/madie-design-system/dist/react";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import dayjs from "dayjs";
import IntegerInput from "../../../../../../../common/IntegerInput/IntegerInput";
import "./DisplayAttributeInputs.scss";
import RatioInput from "../../../../../../../common/ratioInput/RatioInput";
import QuantityInput from "../../../../../../../common/quantityInput/QuantityInput";
import DecimalInput from "../../../../../../../common/DecimalInput/DecimalInput";

interface DisplayAttributeInputsProps {
  attributeType?: string;
  onChange?: (e) => void;
  onInputAdd: Function;
}

const DisplayAttributeInputs = ({
  attributeType,
  onInputAdd,
}: DisplayAttributeInputsProps) => {
  const [attributeValue, setAttributeValue] = useState(null);
  const [currentRatio, setCurrentRatio] = useState<CQL.Ratio>({
    numerator: {},
    denominator: {},
  });

  const handleAttributeChange = (e) => {
    e.preventDefault();
    onInputAdd(attributeValue);
  };

  const displayAttributeInput = () => {
    switch (attributeType) {
      case "Date":
        return (
          <DateField
            label="Date"
            value={""}
            data-testid="date-input"
            handleDateChange={(e) => {
              const newDate = dayjs.utc(e);
              const newCQLDate: CQL.Date = new CQL.Date(
                newDate.year(),
                newDate.month() + 1,
                newDate.date()
              );
              setAttributeValue(newCQLDate);
            }}
          />
        );

      case "Ratio":
        return (
          <RatioInput
            label="Ratio"
            ratio={currentRatio}
            data-testid="ratio-input"
            onRatioChange={(newCQLRatio) => {
              setCurrentRatio(newCQLRatio);
              setAttributeValue(newCQLRatio);
            }}
            canEdit={true}
          />
        );

      case "Integer":
        return (
          <IntegerInput
            intValue={null}
            canEdit={true}
            handleChange={(val) => setAttributeValue(parseInt(val))}
            label="Integer"
          />
        );

      case "Quantity":
        return (
          <QuantityInput
            quantity={{}}
            onQuantityChange={(val) => {
              console.log(val);
              setAttributeValue(new CQL.Quantity(val.value, val.unit));
            }}
            canEdit={true}
          />
        );
      case "Decimal":
        return (
          <DecimalInput
            value={null}
            handleChange={(val) => setAttributeValue(parseFloat(val))}
            canEdit={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="attributes-display-container">
        <div className="attribute-model"> {displayAttributeInput()}</div>
        <div className="add-value-icon">
          {attributeType ? (
            <IconButton onClick={handleAttributeChange}>
              <AddCircleOutlineIcon sx={{ color: "#0073c8" }} />
            </IconButton>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default DisplayAttributeInputs;
