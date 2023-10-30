import React, { useEffect, useState } from "react";
import "twin.macro";
import "styled-components/macro";
import {
  CQL,
  ValueSet,
  FacilityLocation as FacilityLocationType,
} from "cqm-models";
import CodeInput from "../codeInput/CodeInput";
import DateTimeInterval from "../dateTimeInterval/DateTimeInterval";

interface Props {
  canEdit: boolean;
  onChange: Function;
  valueSets: ValueSet[];
}

const FacilityLocation = ({ canEdit, onChange, valueSets }: Props) => {
  const [code, setCode] = useState<CQL.Code>();
  const [locationPeriod, setLocationPeriod] = useState<CQL.DateTimeInterval>();

  useEffect(() => {
    if (code) {
      onChange(
        new FacilityLocationType({ code: code, locationPeriod: locationPeriod })
      );
    }
  }, [code, locationPeriod]);

  return (
    <>
      <CodeInput
        handleChange={(code) => setCode(code)}
        canEdit={canEdit}
        valueSets={valueSets}
        required={true}
        title="Code"
      />
      <div tw="mt-4">
        <DateTimeInterval
          label="Location Period"
          dateTimeInterval={locationPeriod}
          onDateTimeIntervalChange={(period) => setLocationPeriod(period)}
          canEdit={canEdit}
          attributeName="Location Period"
          displayAttributeName={true}
        />
      </div>
    </>
  );
};

export default FacilityLocation;
