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

const adverseEventStructureDefinition = {
  id: "AdverseEvent.actuality",
  path: "AdverseEvent.actuality",
};
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
});
