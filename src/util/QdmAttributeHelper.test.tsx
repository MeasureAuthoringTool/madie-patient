import {
  stringifyValue,
  getDisplayFromId,
  generateAttributesToDisplay,
} from "./QdmAttributeHelpers";
import cqmModels, { CQL } from "cqm-models";

describe("StringifyValue", () => {
  it("stringify value stringifies a number to a string without thinking it's a date", () => {
    expect(stringifyValue(1)).toBe("1");
  });

  it("should stringify a quantity unit/value pair 'integer", () => {
    expect(stringifyValue({ value: 2, unit: 4 })).toBe("2 '4'");
  });

  it("should stringify a quantity unit/value pair 'string'", () => {
    expect(stringifyValue({ value: 12, unit: "hours" })).toBe("12 'hours'");
  });

  it("stringify value stringifies a number, greater than 999, to a string without thinking it's a date", () => {
    expect(stringifyValue("1234")).toBe("1234");
  });

  it("stringify value stringifies null value", () => {
    expect(stringifyValue(null)).toBe("null");
  });
  test("stringify value stringifies Code  value", () => {
    const codeSystem = {
      "2.16.840.1.113883.6.96": "SNOMEDCT",
      "2.16.840.1.113883.6.238": "CDCREC",
      "2.16.840.1.113883.5.1": "AdministrativeGender",
      "2.16.840.1.113883.3.221.5": "SOP",
      "2.16.840.1.113883.6.90": "ICD10CM",
      "2.16.840.1.113883.6.88": "RXNORM",
      "2.16.840.1.113883.6.1": "LOINC",
    };
    const code = new cqmModels.CQL.Code(
      "10725009",
      "2.16.840.1.113883.6.96",
      null
    );
    code.title = "title";
    expect(stringifyValue(code, false, codeSystem)).toBe("SNOMEDCT : 10725009");
  });

  test("stringify custom code value", () => {
    const code = new cqmModels.CQL.Code(
      "custom-code",
      "custom code system",
      null
    );
    code.title = "title";
    expect(stringifyValue(code, false, {})).toBe(
      "custom code system : custom-code"
    );
  });

  test("stringify value stringifies dates that are DateTime", () => {
    expect(stringifyValue("2012-04-05T08:15:00.000")).toBe(
      "04/05/2012 8:15 AM"
    );
  });

  test("stringify value stringifies a string", () => {
    expect(stringifyValue("alreadyAString")).toBe("alreadyAString");
  });
  it("stringifyValue stringifies interval strings", () => {
    const testInterval = new CQL.Interval(
      "2012-04-05T08:00:00.000",
      "2012-04-05T08:15:00.000",
      true,
      true
    );
    expect(stringifyValue(testInterval)).toBe(
      "04/05/2012 8:00 AM - 04/05/2012 8:15 AM"
    );
  });

  test("is it just time?", () => {
    const timeObj = new cqmModels.CQL.DateTime(0, 1, 1, 5, 30, 0);
    expect(stringifyValue(timeObj)).toBe("05:30:00");
  });

  test("stringify value stringifies Date Objects", () => {
    const testDateObj = new cqmModels.CQL.Date(2023, 1, 19);
    expect(stringifyValue(testDateObj)).toBe("01/19/2023");
  });

  // this isn't working in CI but works locally. 7h off.
  test("stringify value stringifies DateTime Objects", () => {
    const testDateObj = new cqmModels.CQL.DateTime(2023, 8, 22, 10, 5, 0, 0, 0);
    expect(stringifyValue(testDateObj)).toBe("08/22/2023 10:05 AM");
  });
});

describe("getDisplayFromId", () => {
  test("getDisplayFromId is able to match primary timing attributes of dataElements", () => {
    expect(
      getDisplayFromId(
        [
          {
            admissionSource: {
              code: "10725009",
              system: "2.16.840.1.113883.6.96",
              display: "Benign hypertension (disorder)",
              version: null,
            },
            authorDatetime: "2012-04-05T08:00:00.000+00:00",
            clazz: null,
            codeListId: "2.16.840.1.113883.3.464.1003.101.12.1010",
            dataElementCodes: [
              {
                code: "4525004",
                system: "2.16.840.1.113883.6.96",
                version: null,
                display: null,
              },
            ],
            description: "Encounter, Performed: Emergency Department Visit",
            diagnoses: [
              {
                qdmVersion: "5.6",
                _type: "QDM::DiagnosisComponent",
                code: {
                  code: "10725009",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Benign hypertension (disorder)",
                },
                presentOnAdmissionIndicator: null,
                rank: null,
              },
              {
                qdmVersion: "5.6",
                _type: "QDM::DiagnosisComponent",
                code: {
                  code: "10725009",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Benign hypertension (disorder)",
                },
                presentOnAdmissionIndicator: {
                  code: "4525004",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency department patient visit (procedure)",
                },
                rank: 1,
              },
            ],
            dischargeDisposition: null,
            facilityLocations: [
              {
                qdmVersion: "5.6",
                _type: "QDM::FacilityLocation",
                code: {
                  code: "10725009",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Benign hypertension (disorder)",
                },
                locationPeriod: {
                  low: "2012-07-19T08:00:00.000+00:00",
                  high: "2012-07-19T08:15:00.000+00:00",
                  lowClosed: true,
                  highClosed: true,
                },
              },
            ],
            hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
            id: "624c6561d226360000a3d231",
            lengthOfStay: {
              value: 12,
              unit: "hours",
            },
            participant: [
              {
                hqmfOid: "2.16.840.1.113883.10.20.28.4.136",
                id: "sd23wde54re",
                identifier: {
                  namingSystem: "CPT",
                  qdmVersion: "5.6",
                  value: "TEST-11",
                  _type: "QDM::Identifier",
                },
                qdmVersion: "5.6",
                qrdaOid: "2.16.840.1.113883.10.20.24.3.161",
                _type: "QDM::PatientEntity",
                _id: "64c19243d6d99e00003f7b84",
              },
            ],
            priority: null,
            qdmCategory: "encounter",
            qdmStatus: "performed",
            qdmTitle: "Encounter, Performed",
            qdmVersion: "5.6",
            relatedTo: ["624c6575d226360000a3d249"],
            relevantPeriod: {
              low: "2012-04-05T08:00:00.000Z",
              high: "2012-04-05T08:15:00.000Z",
              lowClosed: true,
              highClosed: true,
            },
            _type: "QDM::EncounterPerformed",
            _id: "64c19243d6d99e00003f7b7f",
          },
          {
            admissionSource: null,
            authorDatetime: "2012-04-05T08:00:00.000+00:00",
            clazz: null,
            codeListId: "2.16.840.1.113883.3.464.1003.101.12.1010",
            dataElementCodes: [
              {
                code: "4525004",
                system: "2.16.840.1.113883.6.96",
                version: null,
                display: null,
              },
            ],
            description: "Encounter, Performed: Emergency Department Visit",
            diagnoses: [],
            dischargeDisposition: null,
            facilityLocations: [],
            hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
            id: "624c6575d226360000a3d249",
            lengthOfStay: null,
            priority: null,
            qdmCategory: "encounter",
            qdmStatus: "performed",
            qdmTitle: "Encounter, Performed",
            qdmVersion: "5.6",
            relatedTo: ["624c6561d226360000a3d231"],
            relevantPeriod: {
              low: "2012-04-05T08:00:00.000Z",
              high: "2012-04-05T08:15:00.000Z",
              lowClosed: true,
              highClosed: true,
            },
            _type: "QDM::EncounterPerformed",
            _id: "64c19243d6d99e00003f7b86",
          },
          {
            codeListId: "2.16.840.1.114222.4.11.3591",
            dataElementCodes: [
              {
                code: "1",
                system: "2.16.840.1.113883.3.221.5",
                version: null,
                display: null,
              },
            ],
            description: "Patient Characteristic Payer: Payer",
            hqmfOid: "2.16.840.1.113883.10.20.28.4.58",
            id: "64b851fc88fe62000007f384",
            qdmCategory: "patient_characteristic",
            qdmStatus: "payer",
            qdmTitle: "Patient Characteristic Payer",
            qdmVersion: "5.6",
            relevantPeriod: {
              low: "2012-07-19T08:00:00.000Z",
              high: "2012-07-19T08:15:00.000Z",
              lowClosed: true,
              highClosed: true,
            },
            _type: "QDM::PatientCharacteristicPayer",
          },
          {
            codeListId: "2.16.840.1.113762.1.4.1",
            dataElementCodes: [
              {
                code: "F",
                system: "2.16.840.1.113883.5.1",
                version: null,
                display: "Female",
              },
            ],
            description: "Patient Characteristic Sex: ONCAdministrativeSex",
            hqmfOid: "2.16.840.1.113883.10.20.28.4.55",
            id: "6217d4b4f074ce3d0ee74031",
            qdmCategory: "patient_characteristic",
            qdmStatus: "gender",
            qdmTitle: "Patient Characteristic Sex",
            qdmVersion: "5.6",
            _type: "QDM::PatientCharacteristicSex",
          },
          {
            birthDatetime: "1965-01-01T08:00:00.000+00:00",
            codeListId: null,
            dataElementCodes: [],
            description: null,
            hqmfOid: "2.16.840.1.113883.10.20.28.4.54",
            id: "64b8521888fe62000007f390",
            qdmCategory: "patient_characteristic",
            qdmStatus: "birthdate",
            qdmTitle: "Patient Characteristic Birthdate",
            qdmVersion: "5.6",
            _type: "QDM::PatientCharacteristicBirthdate",
          },
          {
            codeListId: "2.16.840.1.114222.4.11.836",
            dataElementCodes: [
              {
                code: "1002-5",
                system: "2.16.840.1.113883.6.238",
                version: null,
                display: "American Indian or Alaska Native",
              },
            ],
            description: "Patient Characteristic Race: Race",
            hqmfOid: "2.16.840.1.113883.10.20.28.4.59",
            id: "6217d4b4f074ce3d0ee74033",
            qdmCategory: "patient_characteristic",
            qdmStatus: "race",
            qdmTitle: "Patient Characteristic Race",
            qdmVersion: "5.6",
            _type: "QDM::PatientCharacteristicRace",
          },
          {
            codeListId: "2.16.840.1.114222.4.11.837",
            dataElementCodes: [
              {
                code: "2135-2",
                system: "2.16.840.1.113883.6.238",
                version: null,
                display: "Hispanic or Latino",
              },
            ],
            description: "Patient Characteristic Ethnicity: Ethnicity",
            hqmfOid: "2.16.840.1.113883.10.20.28.4.56",
            id: "6217d4b4f074ce3d0ee74032",
            qdmCategory: "patient_characteristic",
            qdmStatus: "ethnicity",
            qdmTitle: "Patient Characteristic Ethnicity",
            qdmVersion: "5.6",
            _type: "QDM::PatientCharacteristicEthnicity",
          },
          {
            dataElementCodes: [],
            _id: "64b979f5cfaef900004340fc",
            qdmTitle: "Patient Characteristic Birthdate",
            hqmfOid: "2.16.840.1.113883.10.20.28.4.54",
            qdmCategory: "patient_characteristic",
            qdmStatus: "birthdate",
            qdmVersion: "5.6",
            _type: "QDM::PatientCharacteristicBirthdate",
            id: "64b979f5cfaef900004340fc",
            birthDatetime: "2023-01-31T19:16:21.000+00:00",
          },
          {
            dataElementCodes: [
              {
                code: "1002-5",
                system: "2.16.840.1.113883.6.238",
                version: "1.2",
                display: "American Indian or Alaska Native",
              },
            ],
            _id: "64b979eacfaef90000434093",
            qdmTitle: "Patient Characteristic Race",
            hqmfOid: "2.16.840.1.113883.10.20.28.4.59",
            qdmCategory: "patient_characteristic",
            qdmStatus: "race",
            qdmVersion: "5.6",
            _type: "QDM::PatientCharacteristicRace",
            id: "64b979eacfaef90000434093",
          },
          {
            dataElementCodes: [
              {
                code: "F",
                system: "2.16.840.1.113883.5.1",
                version: "2022-11",
                display: "Female",
              },
            ],
            _id: "64b979eacfaef90000434095",
            qdmTitle: "Patient Characteristic Sex",
            hqmfOid: "2.16.840.1.113883.10.20.28.4.55",
            qdmCategory: "patient_characteristic",
            qdmStatus: "gender",
            qdmVersion: "5.6",
            _type: "QDM::PatientCharacteristicSex",
            id: "64b979eacfaef90000434095",
          },
        ],
        "624c6561d226360000a3d231"
      )
    ).toStrictEqual({
      description: "Encounter, Performed: Emergency Department Visit",
      timing: {
        low: "2012-04-05T08:00:00.000Z",
        high: "2012-04-05T08:15:00.000Z",
        lowClosed: true,
        highClosed: true,
      },
    });
  });
});

describe("generateAttributesToDisplay", () => {
  test("generateAttributesToDisplay for RelatedTo", () => {
    const dataElement = {
      dataElementCodes: [
        {
          code: "28568-4",
          system: "2.16.840.1.113883.6.1",
          version: null,
          display: "Physician Emergency department Note",
        },
      ],
      _id: "6545107d39e8a400008d7a68",
      relatedTo: [
        "654a289b170fde0000137c07 - Encounter, Performed: Outpatient Surgery Service",
      ],
      performer: [],
      qdmTitle: "Assessment, Performed",
      hqmfOid: "2.16.840.1.113883.10.20.28.4.117",
      qdmCategory: "assessment",
      qdmStatus: "performed",
      qdmVersion: "5.6",
      _type: "QDM::AssessmentPerformed",
      description: "Assessment, Performed: Emergency Department Evaluation",
      codeListId: "2.16.840.1.113762.1.4.1111.163",
      id: "6545108039e8a400008d7a6c",
      components: [],
    };
    const dataElements = [
      {
        dataElementCodes: [
          {
            code: "28568-4",
            system: "2.16.840.1.113883.6.1",
            version: null,
            display: "Physician Emergency department Note",
          },
        ],
        _id: "6545107d39e8a400008d7a68",
        relatedTo: [
          "654a289b170fde0000137c07 - Encounter, Performed: Outpatient Surgery Service",
        ],
        performer: [],
        qdmTitle: "Assessment, Performed",
        hqmfOid: "2.16.840.1.113883.10.20.28.4.117",
        qdmCategory: "assessment",
        qdmStatus: "performed",
        qdmVersion: "5.6",
        _type: "QDM::AssessmentPerformed",
        description: "Assessment, Performed: Emergency Department Evaluation",
        codeListId: "2.16.840.1.113762.1.4.1111.163",
        id: "6545108039e8a400008d7a6c",
        components: [],
      },
      {
        dataElementCodes: [
          {
            code: "110468005",
            system: "2.16.840.1.113883.6.96",
            version: null,
            display: "Ambulatory surgery (procedure)",
          },
        ],
        _id: "654a2885170fde0000137be5",
        participant: [],
        relatedTo: [],
        qdmTitle: "Encounter, Performed",
        hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
        qdmCategory: "encounter",
        qdmStatus: "performed",
        qdmVersion: "5.6",
        _type: "QDM::EncounterPerformed",
        description: "Encounter, Performed: Outpatient Surgery Service",
        codeListId: "2.16.840.1.113762.1.4.1110.38",
        id: "654a289b170fde0000137c07",
        facilityLocations: [],
        diagnoses: [],
      },
    ];

    const codeSystemMap = {
      "2.16.840.1.113883.6.96": "SNOMEDCT",
      "2.16.840.1.113883.6.259": "HSLOC",
      "2.16.840.1.113883.6.1": "LOINC",
      "2.16.840.1.113883.6.238": "CDCREC",
      "2.16.840.1.113883.5.1": "AdministrativeGender",
      "2.16.840.1.113883.3.221.5": "SOP",
      "2.16.840.1.113883.6.90": "ICD10CM",
    };
    const result = generateAttributesToDisplay(
      dataElement,
      dataElements,
      codeSystemMap
    );
    expect(result[0].isMultiple).toBe(true);
    expect(result[0].additionalElements[0].title).toBe("Related To");
    expect(result[0].additionalElements[0].value).toBe(
      "654a289b170fde0000137c07 - Encounter, Performed: Outpatient Surgery Service"
    );
  });
});
