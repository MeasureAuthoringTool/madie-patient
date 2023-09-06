import * as React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataElementTableCodes from "./DataElementTableCodes";
import { CQL } from "cqm-models";

const cqlCode = new CQL.Code(
  "1234",
  "2.16.840.1.113883.6.96",
  null,
  "SNOMEDCT"
);

const testDataElement = {
  dataElementCodes: [cqlCode],
};

const codeSystemMap = {
  "2.16.840.1.113883.6.96": "SNOMEDCT",
  "2.16.840.1.113883.6.259": "HSLOC",
  "2.16.840.1.113883.6.90": "ICD10CM",
  "2.16.840.1.113883.6.103": "ICD9CM",
  "2.16.840.1.113883.5.1": "AdministrativeGender",
  "2.16.840.1.113883.6.238": "CDCREC",
  "2.16.840.1.113883.3.221.5": "SOP",
};

describe("DataElementTableCodes Component", () => {
  it("Should render data element codes based on given DataElement", async () => {
    render(
      <DataElementTableCodes
        element={testDataElement}
        codeSystemMap={codeSystemMap}
      />
    );
    expect(screen.getByText("SNOMEDCT-1234")).toBeInTheDocument();
  });
});
