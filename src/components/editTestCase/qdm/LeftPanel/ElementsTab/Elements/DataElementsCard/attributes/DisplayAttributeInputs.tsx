import React, { useState } from "react";
import { CQL, DataElement } from "cqm-models";
import {
  DateField,
  TimeField,
  Button,
} from "@madie/madie-design-system/dist/react";
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
import DataElementSelector from "../../../../../../../common/DataElementSelector/DataElementSelector";
import DiagnosisComponent from "../../../../../../../common/DiagnosisComponent/DiagnosisComponent";
import ComponentType from "../../../../../../../common/componentDataType/ComponentType";
import FacilityLocation from "../../../../../../../common/facilityLocation/FacilityLocation";

interface DisplayAttributeInputsProps {
  attributeType?: string;
  onInputAdd: Function;
  selectedDataElement: DataElement;
  onChangeForComponentType?: Function;
}

const DisplayAttributeInputs = ({
  attributeType,
  onInputAdd,
  selectedDataElement,
  onChangeForComponentType,
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
      setAttributeValue(null);
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
              if (onChangeForComponentType) {
                onChangeForComponentType(newCQLDate);
              }
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
              if (onChangeForComponentType) {
                onChangeForComponentType(e);
              }
            }}
          />
        );
      case "Time":
        return (
          <TimeField
            disabled={false}
            label="Time"
            handleTimeChange={(e) => {
              const newCQLDateTime: CQL.DateTime = new CQL.DateTime(
                null,
                null,
                null,
                e.hour(),
                e.minute(),
                0,
                0,
                0
              ).getTime();
              setAttributeValue(newCQLDateTime);
              if (onChangeForComponentType) {
                onChangeForComponentType(newCQLDateTime);
              }
            }}
            value={""}
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
              if (onChangeForComponentType) {
                onChangeForComponentType(val);
              }
            }}
            canEdit={true}
          />
        );
      case "Integer":
        return (
          <IntegerInput
            intValue={null}
            canEdit={true}
            handleChange={(val) => {
              setAttributeValue(parseInt(val));
              if (onChangeForComponentType) {
                onChangeForComponentType(val);
              }
            }}
            label="Integer"
          />
        );
      case "Number":
        return (
          <IntegerInput
            intValue={null}
            canEdit={true}
            handleChange={(val) => {
              setAttributeValue(parseInt(val));
              if (onChangeForComponentType) {
                onChangeForComponentType(val);
              }
            }}
            label="Number"
          />
        );

      case "Quantity":
        return (
          <QuantityInput
            quantity={{}}
            onQuantityChange={(val) => {
              setAttributeValue(val);
              if (onChangeForComponentType) {
                onChangeForComponentType(val);
              }
            }}
            canEdit={true}
          />
        );
      case "Decimal":
        return (
          <DecimalInput
            value={null}
            handleChange={(val) => {
              setAttributeValue(parseFloat(val));
              if (onChangeForComponentType) {
                onChangeForComponentType(val);
              }
            }}
            canEdit={true}
          />
        );
      case "Code":
        return (
          <CodeInput
            handleChange={(val) => {
              setAttributeValue(val);
              if (onChangeForComponentType) {
                onChangeForComponentType(val);
              }
            }}
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
              if (onChangeForComponentType) {
                onChangeForComponentType(val);
              }
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
              if (onChangeForComponentType) {
                onChangeForComponentType(val);
              }
            }}
          />
        );
      // To Do: implement FacilityLocation selector which allows for location selection -> locationPeriod selection
      // case "FacilityLocation":
      case "DataElement":
        return (
          <DataElementSelector
            selectedDataElement={selectedDataElement}
            canEdit={true}
            value={attributeValue || ""}
            handleChange={(v) => {
              setAttributeValue(v);
            }}
          />
        );
      case "DiagnosisComponent":
        return (
          <DiagnosisComponent
            handleChange={(val) => {
              setAttributeValue(val);
            }}
            canEdit={true}
            valueSets={cqmMeasure?.value_sets}
            required={false}
          />
        );
      case "Component":
        return (
          <ComponentType
            onChange={(val) => setAttributeValue(val)}
            canEdit={true}
            valueSets={cqmMeasure?.value_sets}
            selectedDataElement={selectedDataElement}
            onInputAdd={onInputAdd}
          />
        );
      case "FacilityLocation":
        return (
          <FacilityLocation
            canEdit={true}
            onChange={(val) => setAttributeValue(val)}
            valueSets={cqmMeasure?.value_sets}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div tw="flex w-3/4">
        <div tw="flex-grow w-3/4 pt-4">{displayAttributeInput()}</div>
        <div tw="relative pl-2.5">
          {attributeType && !onChangeForComponentType && (
            <Button
              tw="absolute bottom-0"
              variant="outline-filled"
              data-testid="add-attribute-button"
              onClick={handleAttributeChange}
              disabled={!attributeValue}
            >
              Add
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default DisplayAttributeInputs;
