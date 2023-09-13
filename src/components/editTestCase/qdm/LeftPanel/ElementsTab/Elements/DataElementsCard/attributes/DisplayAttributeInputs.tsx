import React, { useState } from "react";
import { CQL } from "cqm-models";
import { DateField } from "@madie/madie-design-system/dist/react";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import dayjs from "dayjs";
import IntegerInput from "../../../../../../../common/IntegerInput/IntegerInput";
import "./DisplayAttributeInputs.scss";
import RatioInput from "../../../../../../../common/ratioInput/RatioInput";
import QuantityInput from "../../../../../../../common/quantityInput/QuantityInput";
import DecimalInput from "../../../../../../../common/DecimalInput/DecimalInput";
import DateTimeInput from "../../../../../../../common/dateTimeInput/DateTimeInput";
import QdmEntity from "./QdmEntity";
import CodeInput from "../../../../../../../common/codeInput/CodeInput";
import "twin.macro";
import "styled-components/macro";
import useQdmExecutionContext from "../../../../../../../routes/qdm/useQdmExecutionContext";
import QuantityIntervalInput from "../../../../../../../common/quantityIntervalInput/QuantityIntervalInput";
import StringInput from "../../../../../../../common/string/StringInput";

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
  const currentRatio = {
    numerator: {},
    denominator: {},
  };
  const currentQuantityRatio = {
    low: {},
    high: {},
  };

  const handleAttributeChange = (e) => {
    e.preventDefault();
    if (attributeValue) {
      onInputAdd(attributeValue);
    }
  };
  const { cqmMeasureState } = useQdmExecutionContext();
  const [cqmMeasure] = cqmMeasureState;

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
            onRatioChange={(val) => {
              setAttributeValue(val);
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
              setAttributeValue(val);
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
      case "Code":
        return (
          <CodeInput
            handleChange={(val) => setAttributeValue(val)}
            canEdit={true}
            valueSets={cqmMeasure?.value_sets}
            required={false}
          />
        );
      case "Interval<Quantity>":
        return (
          <QuantityIntervalInput
            label={"Quantity Interval"}
            quantityInterval={currentQuantityRatio}
            onQuantityIntervalChange={(val) => {
              setAttributeValue(val);
            }}
            canEdit={true}
          />
        );
      case "PatientEntity":
      case "CarePartner":
      case "Location":
      case "Practitioner":
      case "Organization":
        return (
          <QdmEntity
            setAttributeValue={setAttributeValue}
            attributeValue={attributeValue}
            attributeType={attributeType}
            valueSets={cqmMeasure?.value_sets}
          />
        );
      case "String":
        return (
          <StringInput
            label="String"
            canEdit={true}
            fieldValue=""
            onStringValueChange={(val) => {
              setAttributeValue(val);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div tw="flex w-3/4">
        <div tw="flex-grow w-3/4">{displayAttributeInput()}</div>
        <div tw="flex-grow py-6">
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
