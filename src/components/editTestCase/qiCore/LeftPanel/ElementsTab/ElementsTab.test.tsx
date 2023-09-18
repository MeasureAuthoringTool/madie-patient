import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { QiCoreResourceProvider } from "../../../../../util/QiCorePatientProvider";
import ElementsTab from "./ElementsTab";

const patientBundle = {
  resourceType: "Bundle",
  id: "IP-Pass-CVPatient",
  type: "collection",
  entry: [
    {
      fullUrl:
        "https://madie.cms.gov/Patient/1409f76a-f837-45fd-8850-6927674fefc4",
      resource: {
        resourceType: "Patient",
        id: "1409f76a-f837-45fd-8850-6927674fefc4",
        extension: [
          {
            extension: [
              {
                url: "ombCategory",
                valueCoding: {
                  system: "urn:oid:2.16.840.1.113883.6.238",
                  code: "2106-3",
                  display: "White",
                },
              },
              {
                url: "detailed",
                valueCoding: {
                  system: "urn:oid:2.16.840.1.113883.6.238",
                  code: "1586-7",
                  display: "Shoshone",
                },
              },
              {
                url: "detailed",
                valueCoding: {
                  system: "urn:oid:2.16.840.1.113883.6.238",
                  code: "2036-2",
                  display: "Filipino",
                },
              },
              {
                url: "text",
                valueString: "Mixed",
              },
              {
                url: "ombCategory",
                valueCoding: {
                  code: "2028-9",
                  system: "urn:oid:2.16.840.1.113883.6.238",
                  display: "Asian",
                },
              },
            ],
            url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
          },
          {
            extension: [
              {
                url: "ombCategory",
                valueCoding: {
                  system: "urn:oid:2.16.840.1.113883.6.238",
                  code: "2135-2",
                  display: "Hispanic or Latino",
                },
              },
              {
                url: "detailed",
                valueCoding: {
                  system: "urn:oid:2.16.840.1.113883.6.238",
                  code: "2184-0",
                  display: "Dominican",
                },
              },
              {
                url: "text",
                valueString: "Hispanic or Latino",
              },
            ],
            url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
          },
          {
            url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-genderIdentity",
            valueCodeableConcept: {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",
                  code: "ASKU",
                  display: "asked but unknown",
                },
              ],
              text: "asked but unknown",
            },
          },
        ],
        name: [
          {
            use: "usual",
            family: "IPPass",
            given: ["IPPass"],
          },
        ],
        gender: "male",
        birthDate: "1954-02-10",
      },
    },
  ],
};
const setEditorVal = jest.fn();

describe("ElementsTab", () => {
  const renderElementTab = () => {
    render(
      <QiCoreResourceProvider>
        <ElementsTab
          canEdit={true}
          setEditorVal={setEditorVal}
          editorVal={patientBundle}
        />
      </QiCoreResourceProvider>
    );
  };

  it("displays Element Tab for a QICore case", () => {
    renderElementTab();
    expect(screen.getByText("Demographics")).toBeInTheDocument();
    expect(screen.getByText("Elements")).toBeInTheDocument();
  });

  describe("DemographicsSection tests", () => {
    it("handles gender demographics changes for a QICore case", async () => {
      renderElementTab();
      const gender = screen.getByTestId(
        "demographics-gender-input"
      ) as HTMLInputElement;
      expect(gender).toBeInTheDocument();
      expect(gender.value).toEqual("male");
      // change the gender option
      fireEvent.change(gender, {
        target: { value: "female" },
      });
      expect(gender.value).toEqual("female");
      expect(setEditorVal).toHaveBeenCalled();
    });
  });
});
