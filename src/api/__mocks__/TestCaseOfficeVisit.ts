import { MeasureScoring, PopulationType, TestCase } from "@madie/madie-models";

export const testCaseOfficeVisit: TestCase = {
  id: "623cFfaK34613783378c17c",
  executionStatus: null,
  validResource: true,
  name: null,
  title: "Encounter",
  series: "DENOM_Pass",
  description: "Encounter start within MP.",
  createdAt: "2022-03-24T17:40:15.921Z",
  createdBy: "Test",
  lastModifiedAt: "2022-03-25T18:45:49.403Z",
  lastModifiedBy: "Test",
  json: '{"resourceType":"Bundle","id":"230","meta":{"versionId":"4","lastUpdated":"2022-06-02T19:18:20.977+00:00"},"type":"collection","entry":[{"fullUrl":"http://local/Encounter","resource":{"resourceType":"Encounter","meta":{"versionId":"1","lastUpdated":"2021-10-13T03:34:10.160+00:00","source":"#nEcAkGd8PRwPP5fA"},"text":{"status":"generated","div":"<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>"},"status":"finished","class":{"system":"2.16.840.1.113883.6.96","code":"185463005","display":"Visit out of hours (procedure)"},"type":[{"coding":[{"system":"2.16.840.1.113883.6.96","version":"2022-03","code":"185463005","display":"Visit out of hours (procedure)"}]}],"subject":{"reference":"Patient/1"},"participant":[{"individual":{"reference":"Practitioner/30164","display":"Dr John Doe"}}],"period":{"start":"2023-09-10T03:34:10.054Z"}}},{"fullUrl":"http://local/Patient","resource":{"resourceType":"Patient","text":{"status":"generated","div":"<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>"},"identifier":[{"system":"http://clinfhir.com/fhir/NamingSystem/identifier","value":"20181011LizzyHealth"}],"name":[{"use":"official","text":"Lizzy Health","family":"Health","given":["Lizzy"]}],"gender":"female","birthDate":"2000-10-11"}}]}',
  hapiOperationOutcome: {
    code: 201,
    message: null,
    successful: true,
    outcomeResponse: null,
  },
  groupPopulations: [
    {
      groupId: "1",
      scoring: MeasureScoring.PROPORTION,
      populationBasis: "Boolean",
      populationValues: [
        {
          id: "1",
          name: PopulationType.INITIAL_POPULATION,
          expected: true,
          actual: true,
        },
        {
          id: "2",
          name: PopulationType.NUMERATOR,
          expected: true,
          actual: true,
        },
        {
          id: "3",
          name: PopulationType.DENOMINATOR,
          expected: true,
          actual: true,
        },
      ],
      stratificationValues: [],
    },
  ],
};
