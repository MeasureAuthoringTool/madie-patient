import * as React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DataElement } from "cqm-models";
import DataElementsTable from "./DataElementsTable";
import { MemoryRouter } from "react-router-dom";
import {
  ApiContextProvider,
  ServiceConfig,
} from "../../../../../../../api/ServiceContext";
import { QdmExecutionContextProvider } from "../../../../../../routes/qdm/QdmExecutionContext";
import { Measure } from "@madie/madie-models";
import { FormikContextType, FormikProvider } from "formik";
import { QdmPatientProvider } from "../../../../../../../util/QdmPatientContext";
import { testCaseJson } from "../DataElementsCard/DataElementsCard.test";

const serviceConfig = {
  testCaseService: {
    baseUrl: "base.url",
  },
  measureService: {
    baseUrl: "base.url",
  },
  terminologyService: {
    baseUrl: "http.com",
  },
} as ServiceConfig;

const testValueSets = [
  {
    oid: "2.16.840.1.113883.3.117.1.7.1.292",
    version: "N/A",
    concepts: [
      {
        code: "4525004",
        code_system_oid: "2.16.840.1.113883.6.96",
        code_system_name: "SNOMEDCT",
        code_system_version: "2023-03",
        display_name: "Emergency department patient visit (procedure)",
      },
    ],
    display_name: "Emergency Department Visit",
  },
];

//@ts-ignore
const mockFormik: FormikContextType<any> = {
  values: {
    json: JSON.stringify(testCaseJson),
  },
};

const testDataElements: DataElement[] = [
  {
    dataElementCodes: [
      {
        code: "4525004",
        system: "2.16.840.1.113883.6.96",
        version: null,
        display: "Emergency department patient visit (procedure)",
      },
    ],
    _id: "64ad6ac03bdeb0000056a5af",
    qdmTitle: "Patient DiagnosisComponent",
    hqmfOid: "2.16.840.1.113883.10.20.28.4.56",
    qdmCategory: "DiagnosisComponent",
    qdmStatus: "DiagnosisComponent",
    qdmVersion: "5.6",
    _type: "QDM::DiagnosisComponent",
    id: "64ad6ac03bdeb0000056a5af",
  },
];

const onView = jest.fn();

const renderDataElementsTable = () => {
  return render(
    <MemoryRouter>
      <ApiContextProvider value={serviceConfig}>
        <QdmExecutionContextProvider
          value={{
            measureState: [{} as Measure, jest.fn],
            cqmMeasureState: [
              {
                value_sets: testValueSets,
              },
              jest.fn,
            ],
            executionContextReady: true,
            executing: false,
            setExecuting: jest.fn(),
          }}
        >
          <FormikProvider value={mockFormik}>
            <QdmPatientProvider>
              <DataElementsTable
                dataElements={testDataElements}
                onView={onView}
              />
            </QdmPatientProvider>
          </FormikProvider>
        </QdmExecutionContextProvider>
      </ApiContextProvider>
    </MemoryRouter>
  );
};

describe("DataElementsTable Component", () => {
  it("Should display data elements information in the table", async () => {
    // renderDataElementsTable();
    expect(screen.getByText("SNOMEDCT-1234")).toBeInTheDocument();
  });
});
