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
import DecimalInput from "../../../../../../../common/DecimalInput/DecimalInput";
import DateTimeInput from "../../../../../../../common/dateTimeInput/DateTimeInput";
import DisplayMultipleAttributeInputs from "./DisplayMultipleAttributeInputs";

interface DisplayAttributeInputsProps {
  attributeType?: string;
  onChange?: (e) => void;
  onInputAdd: Function;
  attributeName: string;
}

const DisplayAttributeInputs = ({
  attributeType,
  onInputAdd,
  attributeName,
}: DisplayAttributeInputsProps) => {
  const [attributeValue, setAttributeValue] = useState(null);
  const [currentRatio, setCurrentRatio] = useState<CQL.Ratio>({
    numerator: {},
    denominator: {},
  });

  const handleAttributeChange = (e) => {
    e.preventDefault();
    console.log(attributeValue);
    onInputAdd(attributeValue);
  };

  const isMultiAttributeInput = (attributeName) => {
    return (
      attributeName === "Performer" ||
      attributeName === "Recorder" ||
      attributeName === "Participant" ||
      attributeName === "Requester"
    );
  };

  const displayAttributeInput = () => {
    if (!isMultiAttributeInput(attributeName)) {
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
        case "DateTime":
          return (
            <DateTimeInput
              label="DateTime"
              canEdit={true}
              dateTime={null}
              attributeName="DateTime"
              onDateTimeChange={(e) => {
                setAttributeValue(e);
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
    } else {
      return (
        <DisplayMultipleAttributeInputs
          setAttributeValue={setAttributeValue}
          attributeValue={attributeValue}
          attributeType={attributeType}
        />
      );
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
