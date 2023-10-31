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
  onChange: Function;
  valueSets: ValueSet[];
  canEdit: boolean;
}

const FacilityLocation = ({ onChange, valueSets, canEdit }: Props) => {
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
        valueSets={valueSets}
        required={true}
        title="Code"
      />
      <div tw="mt-4">
        <DateTimeInterval
          canEdit={canEdit}
          label="Location Period"
          dateTimeInterval={locationPeriod}
          onDateTimeIntervalChange={(period) => setLocationPeriod(period)}
          attributeName="Location Period"
          displayAttributeName={true}
        />
      </div>
    </>
  );
};

export default FacilityLocation;
