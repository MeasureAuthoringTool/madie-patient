import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TypeEditor from "./TypeEditor";
import useFhirDefinitionsServiceApi, {
  FhirDefinitionsServiceApi,
} from "../../../../../../../api/useFhirDefinitionsService";

jest.mock("@madie/madie-util", () => ({
  useOktaTokens: () => ({
    getAccessToken: () => "test.jwt",
  }),
}));

const codingDef = {
  path: "Coding",
  definition: { resourceType: "StructureDefinition", id: "Coding" },
};
const codingTopLevelElements = [
  {
    id: "Coding.id",
    path: "Coding.id",
  },
  {
    id: "Coding.extension",
    path: "Coding.extension",
  },
  {
    id: "Coding.system",
    path: "Coding.system",
  },
  {
    id: "Coding.version",
    path: "Coding.version",
  },
  {
    id: "Coding.code",
    path: "Coding.code",
  },
  {
    id: "Coding.display",
    path: "Coding.display",
  },
  {
    id: "Coding.userSelected",
    path: "Coding.userSelected",
  },
];

jest.mock("../../../../../../../api/useFhirDefinitionsService");
const useFhirDefinitionsServiceApiMock =
  useFhirDefinitionsServiceApi as jest.Mock<FhirDefinitionsServiceApi>;
const fhirDefinitionsServiceApiMock = {
  isComponentDataType: jest.fn().mockResolvedValue(true),
  getResourceTree: jest.fn().mockResolvedValue(codingDef),
  getTopLevelElements: jest.fn().mockResolvedValue(codingTopLevelElements),
} as unknown as FhirDefinitionsServiceApi;
useFhirDefinitionsServiceApiMock.mockImplementation(
  () => fhirDefinitionsServiceApiMock
);

describe("TypeEditor Component", () => {
  test("Should render String component", () => {
    const handleChange = jest.fn();
    render(
      <TypeEditor
        type={`http://hl7.org/fhirpath/System.String`}
        required={false}
        value={`test string`}
        onChange={handleChange}
        structureDefinition={null}
      />
    );
    const inputField = screen.getByTestId("string-field-input-VALUE");
    expect(inputField).toBeInTheDocument();
    expect(inputField.value).toBe("test string");
  });

  test("Should render String component", () => {
    const handleChange = jest.fn();
    render(
      <TypeEditor
        type={`http://hl7.org/fhirpath/System.String`}
        required={false}
        value={`test string`}
        onChange={handleChange}
        structureDefinition={null}
      />
    );
    const inputField = screen.getByTestId("string-field-input-VALUE");
    expect(inputField).toBeInTheDocument();
    expect(inputField.value).toBe("test string");
  });

  test("Should render Period component", () => {
    const handleChange = jest.fn();
    render(
      <TypeEditor
        type={`Period`}
        required={false}
        value={null}
        onChange={handleChange}
        structureDefinition={null}
      />
    );

    expect(screen.getByText("start")).toBeInTheDocument();
    expect(screen.getByText("End")).toBeInTheDocument();
  });

  test("Should render DateTime component", () => {
    const handleChange = jest.fn();
    render(
      <TypeEditor
        type={`http://hl7.org/fhirpath/System.DateTime`}
        required={false}
        value={`2024-09-26T08:33:33.000-05:00`}
        onChange={handleChange}
        structureDefinition={null}
      />
    );
    const inputDate = screen.getByTestId("date-field-input");
    expect(inputDate).toBeInTheDocument();

    const inputTime = screen.getByPlaceholderText("hh:mm:ss aa");
    expect(inputTime).toBeInTheDocument();

    const inputZone = screen.getByTestId("timezone-input-field-");
    expect(inputZone).toBeInTheDocument();
  });

  test("Should render Boolean component", () => {
    const handleChange = jest.fn();
    render(
      <TypeEditor
        type={`boolean`}
        required={false}
        value={`True`}
        onChange={handleChange}
        structureDefinition={null}
      />
    );
    expect(
      screen.getByTestId("boolean-input-field-undefined")
    ).toBeInTheDocument();
  });

  test("Should render URI component", () => {
    const handleChange = jest.fn();
    render(
      <TypeEditor
        type={`uri`}
        required={true}
        value={`urn:oid:2.16.840.1.113883.6.238`}
        onChange={handleChange}
        structureDefinition={null}
      />
    );
    expect(screen.getByTestId("uri-input-field-URI")).toBeInTheDocument();
  });

  test("Should render Date component", () => {
    const handleChange = jest.fn();
    render(
      <TypeEditor
        type={`date`}
        required={false}
        value={`2024-09-26`}
        onChange={handleChange}
        structureDefinition={null}
      />
    );
    const inputField = screen.getByTestId("date-field--input");
    expect(inputField).toBeInTheDocument();
    expect(inputField.value).toBe("09/26/2024");
  });

  test("Should render PositiveInt component", () => {
    const handleChange = jest.fn();
    render(
      <TypeEditor
        type={`positiveInt`}
        required={false}
        value={`1234`}
        onChange={handleChange}
        structureDefinition={null}
      />
    );
    const inputField = screen.getByTestId("integer-field-input-");
    expect(inputField).toBeInTheDocument();
    expect(inputField.value).toBe("1234");
  });

  //not working
  test("Should render unsignedInt component", () => {
    const handleChange = jest.fn();
    render(
      <TypeEditor
        type={`unsignedInt`}
        required={false}
        value={`1234`}
        onChange={handleChange}
        structureDefinition={null}
      />
    );
    const inputField = screen.getByTestId("integer-field-input-Integer Field");
    expect(inputField).toBeInTheDocument();
    expect(inputField.value).toBe("1234");
  });

  test("Should display unsupported", () => {
    const handleChange = jest.fn();
    render(
      <TypeEditor
        type={`test`}
        required={false}
        value={`test`}
        onChange={handleChange}
        structureDefinition={null}
      />
    );
    expect(screen.getByText(`Unsupported Type [test]`)).toBeInTheDocument();
  });
});
