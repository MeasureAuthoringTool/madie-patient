import {
  findGroupNumber,
  createExcelExportDtosForAllTestCases,
  convertToNumber,
} from "./TestCaseExcelExportUtil";
import {
  Measure,
  TestCase,
  Group,
  GroupPopulation,
  MeasureScoring,
  PopulationType,
  SupplementalData,
  TestCaseExcelExportDto,
} from "@madie/madie-models";
import { CqmConversionService } from "../api/CqmModelConversionService";
import { PopulationSet } from "cqm-models";
import calculationOutputMultipleTestCases from "../__mocks__/calculationOutputMultipleTestCases.json";
import translatedLibrariesData from "../__mocks__/translatedLibraries.json";
import cqlDefinitionCallstack from "../__mocks__/cqlDefinitionCallstack.json";
import { DataCriteria } from "../api/models/DataCriteria";
import { TranslatedLibrary } from "../api/models/TranslatedLibrary";
import axios from "axios";

const group1Id: string = "65c51ed069853c1ce9726179";
const group1: Group = {
  id: group1Id,
  populations: [
    {
      id: "testPopulationId1",
      name: PopulationType.INITIAL_POPULATION,
      definition: "Initial Population",
      associationType: "",
      description: "",
    },
    {
      id: "testPopulationId2",
      name: PopulationType.DENOMINATOR,
      definition: "Denominator",
      associationType: "",
      description: "",
    },
    {
      id: "testPopulationId3",
      name: PopulationType.NUMERATOR,
      definition: "Numerator",
      associationType: "",
      description: "",
    },
  ],
  stratifications: [
    {
      id: "f0b3c08d-1164-48d8-bc71-aed87499099f",
      description: "test description1",
      cqlDefinition: "Initial Population",
    },
    {
      id: "6e7c1233-6106-46fe-ae83-0769d24c46ae",
      description: "test description2",
      cqlDefinition: "Denominator",
    },
  ],
} as Group;

const group2Id: string = "6605623a387d4b542a847fa8";
const group2: Group = {
  id: group2Id,
  populations: [
    {
      id: "testPopulationId4",
      name: PopulationType.INITIAL_POPULATION,
      definition: "Initial Population",
      associationType: "",
      description: "",
    },
    {
      id: "testPopulationId5",
      name: PopulationType.DENOMINATOR,
      definition: "Denominator",
      associationType: "",
      description: "",
    },
    {
      id: "testPopulationId6",
      name: PopulationType.NUMERATOR,
      definition: "Numerator",
      associationType: "",
      description: "",
    },
  ],
} as Group;

const groupPopulation1: GroupPopulation = {
  groupId: group1Id,
  scoring: MeasureScoring.PROPORTION,
  populationBasis: "false",
  populationValues: [
    {
      id: "pop1ID",
      name: PopulationType.INITIAL_POPULATION,
      expected: 1,
      actual: 2,
    },
    {
      id: "pop2ID",
      name: PopulationType.DENOMINATOR,
      expected: 3,
      actual: 4,
    },
    {
      id: "pop3ID",
      name: PopulationType.NUMERATOR,
      expected: 5,
      actual: 6,
    },
  ],
  stratificationValues: [
    {
      id: "f0b3c08d-1164-48d8-bc71-aed87499099f",
      name: "Strata-1",
      expected: 1,
      populationValues: [
        {
          id: "stratPop1ID",
          name: PopulationType.INITIAL_POPULATION,
          expected: 1,
          actual: 1,
        },
        {
          id: "stratPop2ID",
          name: PopulationType.DENOMINATOR,
          expected: 1,
          actual: 1,
        },
        {
          id: "stratPop3ID",
          name: PopulationType.NUMERATOR,
          expected: 1,
          actual: 1,
        },
      ],
    },
    {
      id: "6e7c1233-6106-46fe-ae83-0769d24c46ae",
      name: "Strata-2",
      expected: 2,
      populationValues: [
        {
          id: "stratPop1ID",
          name: PopulationType.INITIAL_POPULATION,
          expected: 2,
          actual: 2,
        },
        {
          id: "stratPop2ID",
          name: PopulationType.DENOMINATOR,
          expected: 2,
          actual: 2,
        },
        {
          id: "stratPop3ID",
          name: PopulationType.NUMERATOR,
          expected: 2,
          actual: 2,
        },
      ],
    },
  ],
};
const groupPopulation2: GroupPopulation = {
  groupId: group2Id,
  scoring: MeasureScoring.PROPORTION,
  populationBasis: "false",
  populationValues: [
    {
      id: "pop1ID",
      name: PopulationType.INITIAL_POPULATION,
      expected: 1,
      actual: 2,
    },
    {
      id: "pop2ID",
      name: PopulationType.DENOMINATOR,
      expected: 3,
      actual: 4,
    },
    {
      id: "pop3ID",
      name: PopulationType.NUMERATOR,
      expected: 5,
      actual: 6,
    },
  ],
  stratificationValues: [],
};
const testCase1Json =
  '{"qdmVersion": "5.6","dataElements": [{"dataElementCodes": [{"code": "F","system": "2.16.840.1.113883.5.1","version": null,"display": "Female"}],"_id": "65f9c3400c73a20000e10371","qdmTitle": "Patient Characteristic Sex","hqmfOid": "2.16.840.1.113883.10.20.28.4.55","qdmCategory": "patient_characteristic","qdmStatus": "gender","qdmVersion": "5.6","_type": "QDM::PatientCharacteristicSex","id": "65f9c3400c73a20000e10371"},{"dataElementCodes": [{"code": "2131-1","system": "2.16.840.1.113883.6.238","version": null,"display": "Other Race"}],"_id": "65f9c33c0c73a20000e1036c","qdmTitle": "Patient Characteristic Race","hqmfOid": "2.16.840.1.113883.10.20.28.4.59","qdmCategory": "patient_characteristic","qdmStatus": "race","qdmVersion": "5.6","_type": "QDM::PatientCharacteristicRace","id": "65f9c33c0c73a20000e1036c"},{"dataElementCodes": [],"_id": "65f9c3260c73a20000e10362","qdmTitle": "Patient Characteristic Birthdate","hqmfOid": "2.16.840.1.113883.10.20.28.4.54","qdmCategory": "patient_characteristic","qdmStatus": "birthdate","qdmVersion": "5.6","_type": "QDM::PatientCharacteristicBirthdate","id": "65f9c3260c73a20000e10362","birthDatetime": "1972-11-12T17:54:02.000+00:00"},{"dataElementCodes": [],"_id": "65eb3017ebb1a200007fe4c1","qdmTitle": "Patient Characteristic Payer","hqmfOid": "2.16.840.1.113883.10.20.28.4.58","qdmCategory": "patient_characteristic","qdmStatus": "payer","qdmVersion": "5.6","_type": "QDM::PatientCharacteristicPayer","description": "Patient Characteristic Payer: Payer Type","codeListId": "2.16.840.1.114222.4.11.3591","id": "65eb3017ebb1a200007fe4c0","relevantPeriod": {"low": "2024-03-08T00:00:00.000+00:00","high": "2024-03-09T00:00:00.000+00:00","lowClosed": true,"highClosed": true}},{"dataElementCodes": [{"code": "2135-2","system": "2.16.840.1.113883.6.238","version": null,"display": "Hispanic or Latino"}],"_id": "65eb300cebb1a200007fe4be","qdmTitle": "Patient Characteristic Ethnicity","hqmfOid": "2.16.840.1.113883.10.20.28.4.56","qdmCategory": "patient_characteristic","qdmStatus": "ethnicity","qdmVersion": "5.6","_type": "QDM::PatientCharacteristicEthnicity","id": "65eb300cebb1a200007fe4be"}],"_id": "65eb2fbbebb1a200007fe4a9","birthDatetime": "1972-11-12T17:54:02.190+00:00"}';
const testCase1: TestCase = {
  id: "testCaseId1",
  series: "testSeries1",
  title: "testTitle1",
  json: testCase1Json,
  groupPopulations: [groupPopulation1, groupPopulation2],
} as TestCase;

const testCase2: TestCase = {
  id: "testCaseId2",
  series: "testSeries2",
  title: "testTitle2",
  json: '{"qdmVersion":"5.6","dataElements":[],"_id":"65fb3f0b11abc50000d8cb77"}',
  groupPopulations: [groupPopulation1, groupPopulation2],
} as TestCase;

const cql: string =
  'library MAT6264Lib version \'0.0.000\'\n\nusing QDM version \'5.6\'\n\ninclude MATGlobalCommonFunctionsQDM version \'1.0.000\' called Global\n\ncodesystem "HSLOC": \'urn:oid:2.16.840.1.113883.6.259\'\n\nvalueset "Encounter Inpatient": \'urn:oid:2.16.840.1.113883.3.666.5.307\'\nvalueset "Ethnicity": \'urn:oid:2.16.840.1.114222.4.11.837\'\nvalueset "ONC Administrative Sex": \'urn:oid:2.16.840.1.113762.1.4.1\'\nvalueset "Opioid Antagonist": \'urn:oid:2.16.840.1.113762.1.4.1248.119\'\nvalueset "Opioids, All": \'urn:oid:2.16.840.1.113762.1.4.1196.226\'\nvalueset "Payer Type": \'urn:oid:2.16.840.1.114222.4.11.3591\'\nvalueset "Race": \'urn:oid:2.16.840.1.114222.4.11.836\'\nvalueset "Routes of Administration for Opioid Antagonists": \'urn:oid:2.16.840.1.113762.1.4.1248.187\'\n\ncode "Operating Room/Suite": \'1096-7\' from "HSLOC" display \'Operating Room/Suite\'\n\nparameter "Measurement Period" Interval<DateTime>\n\ncontext Patient\n\ndefine "Denominator":\n  "Initial Population"\n\ndefine "Initial Population":\n  "Encounter with Opioid Administration Outside of Operating Room"\n\ndefine "Numerator":\n  "Encounter with Non Enteral Opioid Antagonist Administration Outside of Operating Room and within 12 Hrs After Opioid"\n\ndefine "Opioid Administration":\n  ["Medication, Administered": "Opioids, All"]\n\ndefine "SDE Ethnicity":\n  ["Patient Characteristic Ethnicity": "Ethnicity"]\n\ndefine "SDE Payer":\n  ["Patient Characteristic Payer": "Payer Type"]\n\ndefine "SDE Race":\n  ["Patient Characteristic Race": "Race"]\n\ndefine "SDE Sex":\n  ["Patient Characteristic Sex": "ONC Administrative Sex"]\n\ndefine "Encounter with Opioid Administration Outside of Operating Room":\n  "Qualifying Encounter" InpatientEncounter\n    with "Opioid Administration" OpioidGiven\n      such that Global."NormalizeInterval" ( OpioidGiven.relevantDatetime, OpioidGiven.relevantPeriod ) starts during Global."HospitalizationWithObservation" ( InpatientEncounter )\n        and not exists ( InpatientEncounter.facilityLocations EncounterLocation\n            where EncounterLocation.code ~ "Operating Room/Suite"\n              and Global."NormalizeInterval" ( OpioidGiven.relevantDatetime, OpioidGiven.relevantPeriod ) starts during EncounterLocation.locationPeriod\n        )\n\ndefine "Encounter with Non Enteral Opioid Antagonist Administration Outside of Operating Room and within 12 Hrs After Opioid":\n  // Opioids administered before opioid antagonist AND excludes opioid antagonist administered in operating room AND limits opioid antagonist to non-enteral routes\n  \n  from\n    ["Medication, Administered": "Opioid Antagonist"] OpioidAntagonistGiven,\n    "Opioid Administration" OpioidGiven,\n    "Denominator" EncounterWithQualifyingAge\n    where not exists ( EncounterWithQualifyingAge.facilityLocations EncounterLocation\n        where EncounterLocation.code ~ "Operating Room/Suite"\n          and Global."NormalizeInterval" ( OpioidAntagonistGiven.relevantDatetime, OpioidAntagonistGiven.relevantPeriod ) starts during EncounterLocation.locationPeriod\n    )\n      and ( Global."NormalizeInterval" ( OpioidAntagonistGiven.relevantDatetime, OpioidAntagonistGiven.relevantPeriod ) starts during Global."HospitalizationWithObservation" ( EncounterWithQualifyingAge )\n          and Global."NormalizeInterval" ( OpioidGiven.relevantDatetime, OpioidGiven.relevantPeriod ) starts during Global."HospitalizationWithObservation" ( EncounterWithQualifyingAge )\n          and Global."NormalizeInterval" ( OpioidGiven.relevantDatetime, OpioidGiven.relevantPeriod ) ends 12 hours or less before start of Global."NormalizeInterval" ( OpioidAntagonistGiven.relevantDatetime, OpioidAntagonistGiven.relevantPeriod )\n          and OpioidAntagonistGiven.route in "Routes of Administration for Opioid Antagonists"\n      )\n    return EncounterWithQualifyingAge\n\ndefine "Qualifying Encounter":\n  ["Encounter, Performed": "Encounter Inpatient"] InpatientHospitalization\n    where InpatientHospitalization.relevantPeriod ends during day of "Measurement Period"\n      and AgeInYearsAt(date from start of InpatientHospitalization.relevantPeriod) >= 18\n      \n ';
const supplementalData: SupplementalData[] = [
  { definition: "SDE Ethnicity", description: "" },
  { definition: "SDE Payer", description: "" },
  { definition: "SDE Race", description: "" },
  { definition: "SDE Sex", description: "" },
];
const measure: Measure = {
  id: "testMeasureId",
  cql: cql,
  cqlLibraryName: "MAT6264Lib",
  scoring: MeasureScoring.PROPORTION,
  groups: [group1, group2],
  testCases: [testCase1, testCase2],
  supplementalData: supplementalData,
} as Measure;

const getAccessToken = jest.fn();
let cqmConversionService = new CqmConversionService("url", getAccessToken);
jest.mock("axios");
const axiosMock = axios as jest.Mocked<typeof axios>;

describe("TestCaseExcelExportUtil", () => {
  let dataCriteria: Array<DataCriteria>;
  let elms: Array<String>;
  let translatedLibraries: Array<TranslatedLibrary>;
  let population_sets: Array<PopulationSet>;
  beforeEach(() => {
    dataCriteria = [
      {
        oid: "2.16.840.1.113762.1.4.1",
        title: "ONC Administrative Sex",
        description: "Patient Characteristic Sex: ONC Administrative Sex",
        type: "PatientCharacteristicSex",
        drc: false,
        codeId: null,
        name: "ONC Administrative Sex",
      },
      {
        oid: "2.16.840.1.113762.1.4.1111.143",
        title: "Observation Services",
        description: "Encounter, Performed: Observation Services",
        type: "EncounterPerformed",
        drc: false,
        codeId: null,
        name: "MATGlobalCommonFunctionsQDM-1.0.000|Global|Observation Services",
      },
      {
        oid: "2.16.840.1.113762.1.4.1196.226",
        title: "Opioids, All",
        description: "Medication, Administered: Opioids, All",
        type: "MedicationAdministered",
        drc: false,
        codeId: null,
        name: "Opioids, All",
      },
      {
        oid: "2.16.840.1.113762.1.4.1248.119",
        title: "Opioid Antagonist",
        description: "Medication, Administered: Opioid Antagonist",
        type: "MedicationAdministered",
        drc: false,
        codeId: null,
        name: "Opioid Antagonist",
      },
      {
        oid: "2.16.840.1.113883.3.117.1.7.1.292",
        title: "Emergency Department Visit",
        description: "Encounter, Performed: Emergency Department Visit",
        type: "EncounterPerformed",
        drc: false,
        codeId: null,
        name: "MATGlobalCommonFunctionsQDM-1.0.000|Global|Emergency Department Visit",
      },
      {
        oid: "2.16.840.1.113883.3.666.5.307",
        title: "Encounter Inpatient",
        description: "Encounter, Performed: Encounter Inpatient",
        type: "EncounterPerformed",
        drc: false,
        codeId: null,
        name: "Encounter Inpatient",
      },
      {
        oid: "2.16.840.1.114222.4.11.3591",
        title: "Payer Type",
        description: "Patient Characteristic Payer: Payer Type",
        type: "PatientCharacteristicPayer",
        drc: false,
        codeId: null,
        name: "Payer Type",
      },
      {
        oid: "2.16.840.1.114222.4.11.836",
        title: "Race",
        description: "Patient Characteristic Race: Race",
        type: "PatientCharacteristicRace",
        drc: false,
        codeId: null,
        name: "Race",
      },
      {
        oid: "2.16.840.1.114222.4.11.837",
        title: "Ethnicity",
        description: "Patient Characteristic Ethnicity: Ethnicity",
        type: "PatientCharacteristicEthnicity",
        drc: false,
        codeId: null,
        name: "Ethnicity",
      },
    ];
    elms = [
      '{"library":{"annotation":{},"identifier":{"id":"CQM01","version":"1.0.000"},"statements":{}}}',
      '{"library":{"annotation":{},"identifier":{"id":"IncludedLib","version":"0.1.000"},"statements":{}}}',
    ];
    translatedLibraries = translatedLibrariesData;
    population_sets = [
      {
        id: "65c51ed069853c1ce9726179",
        title: "Population Criteria Section",
        population_set_id: "65c51ed069853c1ce9726179",
        populations: {
          IPP: {
            id: "148f7693-2806-46f1-b657-3331064382e0",
            library_name: "MAT6264Lib",
            statement_name: "Initial Population",
            hqmf_id: null,
          },
          DENOM: {
            id: "3ba054e0-652a-469c-8362-e4ebf92397f0",
            library_name: "MAT6264Lib",
            statement_name: "Denominator",
            hqmf_id: null,
          },
          DENEX: {
            id: "8f60d611-c156-4a5e-9aff-929b41960583",
            library_name: "MAT6264Lib",
            statement_name: "",
            hqmf_id: null,
          },
          NUMER: {
            id: "ee80607f-9e9d-446d-8c31-50831ac738ba",
            library_name: "MAT6264Lib",
            statement_name: "Numerator",
            hqmf_id: null,
          },
          NUMEX: {
            id: "7144fb7e-43a0-44dd-8ca8-97d83ced6908",
            library_name: "MAT6264Lib",
            statement_name: "",
            hqmf_id: null,
          },
          DENEXCEP: {
            id: "e9340bbe-88ca-4c64-ac05-56294e724ac3",
            library_name: "MAT6264Lib",
            statement_name: "",
            hqmf_id: null,
          },
        },
        stratifications: [
          {
            id: "e202bcbb-211f-4777-9734-670e1e42e5f5",
            hqmf_id: null,
            stratification_id: "PopulationSet_1_Stratification_1",
            title: "PopSet1 Stratification 1",
            statement: {
              id: "f0b3c08d-1164-48d8-bc71-aed87499099f",
              library_name: "MAT6264Lib",
              statement_name: "Initial Population",
              hqmf_id: null,
            },
          },
          {
            id: "d52b2ff3-fb14-437b-9846-05dbfa4115dd",
            hqmf_id: null,
            stratification_id: "PopulationSet_1_Stratification_2",
            title: "PopSet1 Stratification 2",
            statement: {
              id: "6e7c1233-6106-46fe-ae83-0769d24c46ae",
              library_name: "MAT6264Lib",
              statement_name: "Denominator",
              hqmf_id: null,
            },
          },
        ],
        supplemental_data_elements: [
          {
            id: "bbbbfc39-409a-42e1-9104-59a27d4b3d56",
            library_name: "MAT6264Lib",
            statement_name: "SDE Ethnicity",
            hqmf_id: null,
          },
          {
            id: "dec78ff4-e1c6-4ed5-8831-dd963b98abf5",
            library_name: "MAT6264Lib",
            statement_name: "SDE Payer",
            hqmf_id: null,
          },
          {
            id: "d3397d58-28d3-494e-ab97-37056ba6acf7",
            library_name: "MAT6264Lib",
            statement_name: "SDE Race",
            hqmf_id: null,
          },
          {
            id: "20597a36-6644-4b03-a121-59a9620f68f5",
            library_name: "MAT6264Lib",
            statement_name: "SDE Sex",
            hqmf_id: null,
          },
        ],
      },
    ];
  });

  it("test createExcelExportDtosForAllTestCases", async () => {
    axiosMock.put
      .mockResolvedValueOnce({ data: dataCriteria })
      .mockResolvedValueOnce({ data: translatedLibraries })
      .mockResolvedValueOnce({ data: population_sets });

    const cqmMeasure = await cqmConversionService.convertToCqmMeasure(measure);

    const testCaseExcelExportDtos: TestCaseExcelExportDto[] =
      createExcelExportDtosForAllTestCases(
        measure,
        cqmMeasure,
        calculationOutputMultipleTestCases,
        cqlDefinitionCallstack
      );

    expect(testCaseExcelExportDtos.length).toBe(2);
    expect(testCaseExcelExportDtos[0].groupId).toBe(group1Id);
    expect(testCaseExcelExportDtos[0].groupNumber).toBe("1");
    expect(testCaseExcelExportDtos[0].testCaseExecutionResults.length).toBe(2);

    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].populations.length
    ).toBe(3);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].populations[0].name
    ).toBe("initialPopulation");
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].populations[0]
        .expected
    ).toBe(1);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].populations[0]
        .actual
    ).toBe(2);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].populations[1].name
    ).toBe("denominator");
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].populations[1]
        .expected
    ).toBe(3);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].populations[1]
        .actual
    ).toBe(4);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].populations[2].name
    ).toBe("numerator");
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].populations[2]
        .expected
    ).toBe(5);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].populations[2]
        .actual
    ).toBe(6);
    expect(testCaseExcelExportDtos[0].testCaseExecutionResults[0].last).toBe(
      "testSeries1"
    );
    expect(testCaseExcelExportDtos[0].testCaseExecutionResults[0].first).toBe(
      "testTitle1"
    );
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].birthdate
    ).toBe("11/12/1972");
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].ethnicity
    ).toBe("Hispanic or Latino");
    expect(testCaseExcelExportDtos[0].testCaseExecutionResults[0].race).toBe(
      "Other Race"
    );
    expect(testCaseExcelExportDtos[0].testCaseExecutionResults[0].gender).toBe(
      "Female"
    );

    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].definitions.length
    ).toBe(7);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].definitions[0]
        .actual
    ).toBe("UNHIT");
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].definitions[1]
        .actual
    ).toBe("UNHIT");
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].definitions[2]
        .actual
    ).toBe("FALSE ([])");
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].definitions[3]
        .actual
    ).toBe("FALSE ([])");
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].definitions[4]
        .actual
    ).toBe("UNHIT");
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].definitions[5]
        .actual
    ).toBe("FALSE ([])");
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].definitions[6]
        .actual
    ).toBe("FALSE ([])");

    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0].stratifications
        ?.length
    ).toBe(2);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0]
        .stratifications?.[0]?.stratificationDtos?.length
    ).toBe(4);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0]
        .stratifications?.[0]?.stratificationDtos?.[0].id
    ).toBe("f0b3c08d-1164-48d8-bc71-aed87499099f");
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0]
        .stratifications?.[0]?.stratificationDtos?.[0].expected
    ).toBe(1);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0]
        .stratifications?.[0]?.stratificationDtos?.[1].expected
    ).toBe(1);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0]
        .stratifications?.[0]?.stratificationDtos?.[2].expected
    ).toBe(1);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0]
        .stratifications?.[0]?.stratificationDtos?.[3].expected
    ).toBe(1);

    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0]
        .stratifications?.[1]?.stratificationDtos?.length
    ).toBe(4);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0]
        .stratifications?.[1]?.stratificationDtos?.[0].id
    ).toBe("6e7c1233-6106-46fe-ae83-0769d24c46ae");
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0]
        .stratifications?.[1]?.stratificationDtos?.[0].expected
    ).toBe(2);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0]
        .stratifications?.[1]?.stratificationDtos?.[1].expected
    ).toBe(2);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0]
        .stratifications?.[1]?.stratificationDtos?.[2].expected
    ).toBe(2);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[0]
        .stratifications?.[1]?.stratificationDtos?.[3].expected
    ).toBe(2);

    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[1].populations.length
    ).toBe(3);
    expect(testCaseExcelExportDtos[0].testCaseExecutionResults[1].last).toBe(
      "testSeries2"
    );
    expect(testCaseExcelExportDtos[0].testCaseExecutionResults[1].first).toBe(
      "testTitle2"
    );
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[1].birthdate
    ).toBe("");
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[1].ethnicity
    ).toBe(null);
    expect(testCaseExcelExportDtos[0].testCaseExecutionResults[1].race).toBe(
      null
    );
    expect(testCaseExcelExportDtos[0].testCaseExecutionResults[1].gender).toBe(
      null
    );
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[1].definitions.length
    ).toBe(7);
    expect(
      testCaseExcelExportDtos[0].testCaseExecutionResults[1].functions.length
    ).toBe(2);

    expect(testCaseExcelExportDtos[1].groupId).toBe(group2Id);
    expect(testCaseExcelExportDtos[1].groupNumber).toBe("2");
    expect(testCaseExcelExportDtos[1].testCaseExecutionResults.length).toBe(2);
    expect(
      testCaseExcelExportDtos[1].testCaseExecutionResults[0].stratifications
        ?.length
    ).toBe(0);
    expect(
      testCaseExcelExportDtos[1].testCaseExecutionResults[1].stratifications
        ?.length
    ).toBe(0);
  });

  it("test findGroupNumber", () => {
    const groups: Group[] = [group1, group2];
    const groupNumber: string = findGroupNumber(groups, group2Id);
    expect(groupNumber).toBe("2");
  });

  it("test convertToNumber number", () => {
    const result = convertToNumber(Number("2"));
    expect(result).toBe(2);
  });

  it("test convertToNumber boolean", () => {
    const result = convertToNumber(true);
    expect(result).toBe(1);
  });

  it("test convertToNumber string", () => {
    const result = convertToNumber("3");
    expect(result).toBe(3);
  });
});
