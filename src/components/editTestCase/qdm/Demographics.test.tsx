import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Demographics from "./Demographics";
import { TestCase } from "@madie/madie-models";
import { MemoryRouter } from "react-router-dom";

describe("QDM Demographics Component", () => {
  const testcase: TestCase = {
    id: "1",
    title: "Test Case",
  } as TestCase;
  const setTestCaseJson = jest.fn();
  const testCaseJson =
    "{\n" +
    '   "qdmVersion":"5.6",\n' +
    '   "dataElements":[\n' +
    "      {\n" +
    '         "dataElementCodes":[\n' +
    "            {\n" +
    '               "code":"F",\n' +
    '               "system":"2.16.840.1.113883.5.1",\n' +
    '               "version":"2022-11",\n' +
    '               "display":"Female"\n' +
    "            }\n" +
    "         ],\n" +
    '         "qdmTitle":"Patient Characteristic Sex",\n' +
    '         "hqmfOid":"2.16.840.1.113883.10.20.28.4.55",\n' +
    '         "qdmCategory":"patient_characteristic",\n' +
    '         "qdmStatus":"gender",\n' +
    '         "qdmVersion":"5.6",\n' +
    '         "_type":"QDM::PatientCharacteristicSex",\n' +
    '         "description":"Patient Characteristic Sex: ONCAdministrativeSex",\n' +
    '         "codeListId":"2.16.840.1.113762.1.4.1"\n' +
    "      },\n" +
    "      {\n" +
    '         "dataElementCodes":[\n' +
    "            {\n" +
    '               "code":"2135-2",\n' +
    '               "system":"2.16.840.1.113883.6.238",\n' +
    '               "version":"1.2",\n' +
    '               "display":"Hispanic or Latino"\n' +
    "            }\n" +
    "         ],\n" +
    '         "qdmTitle":"Patient Characteristic Ethnicity",\n' +
    '         "hqmfOid":"2.16.840.1.113883.10.20.28.4.56",\n' +
    '         "qdmCategory":"patient_characteristic",\n' +
    '         "qdmStatus":"ethnicity",\n' +
    '         "qdmVersion":"5.6",\n' +
    '         "_type":"QDM::PatientCharacteristicEthnicity",\n' +
    '         "description":"Patient Characteristic Ethnicity: Ethnicity",\n' +
    '         "codeListId":"2.16.840.1.114222.4.11.837"\n' +
    "      },\n" +
    "      {\n" +
    '         "dataElementCodes":[\n' +
    "            {\n" +
    '               "code":"2028-9",\n' +
    '               "system":"2.16.840.1.113883.6.238",\n' +
    '               "version":"1.2",\n' +
    '               "display":"Asian"\n' +
    "            }\n" +
    "         ],\n" +
    '         "qdmTitle":"Patient Characteristic Race",\n' +
    '         "hqmfOid":"2.16.840.1.113883.10.20.28.4.59",\n' +
    '         "qdmCategory":"patient_characteristic",\n' +
    '         "qdmStatus":"race",\n' +
    '         "qdmVersion":"5.6",\n' +
    '         "_type":"QDM::PatientCharacteristicRace",\n' +
    '         "description":"Patient Characteristic Race: Race",\n' +
    '         "codeListId":"2.16.840.1.114222.4.11.836"\n' +
    "      }\n" +
    "   ],\n" +
    '   "_id":"646628cb235ff80000718c1a"\n' +
    "}";

  it("should render qdm edit Demographics component with default values", () => {
    render(
      <MemoryRouter>
        <Demographics
          currentTestCase={testcase}
          setTestCaseJson={setTestCaseJson}
          canEdit={true}
        />
      </MemoryRouter>
    );

    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    expect(raceInput.value).toBe("American Indian or Alaska Native");
    const genderInput = screen.getByTestId(
      "demographics-gender-input"
    ) as HTMLInputElement;
    expect(genderInput).toBeInTheDocument();
    expect(genderInput.value).toBe("Female");
  });

  it("should render qdm edit Demographics component with values from TestCase JSON", () => {
    testcase.json = testCaseJson;
    render(
      <MemoryRouter>
        <Demographics
          currentTestCase={testcase}
          setTestCaseJson={setTestCaseJson}
          canEdit={true}
        />
      </MemoryRouter>
    );

    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    expect(raceInput.value).toBe("Asian");
    const genderInput = screen.getByTestId(
      "demographics-gender-input"
    ) as HTMLInputElement;
    expect(genderInput).toBeInTheDocument();
    expect(genderInput.value).toBe("Female");
  });

  it("test change dropwdown values", () => {
    testcase.json = testCaseJson;
    render(
      <MemoryRouter>
        <Demographics
          currentTestCase={testcase}
          setTestCaseJson={setTestCaseJson}
          canEdit={true}
        />
      </MemoryRouter>
    );

    const raceInput = screen.getByTestId(
      "demographics-race-input"
    ) as HTMLInputElement;
    expect(raceInput).toBeInTheDocument();
    expect(raceInput.value).toBe("Asian");

    fireEvent.change(raceInput, {
      target: { value: "White" },
    });
    expect(raceInput.value).toBe("White");

    const genderInput = screen.getByTestId(
      "demographics-gender-input"
    ) as HTMLInputElement;
    expect(genderInput).toBeInTheDocument();
    expect(genderInput.value).toBe("Female");

    fireEvent.change(genderInput, {
      target: { value: "Male" },
    });
    expect(genderInput.value).toBe("Male");
  });
});
