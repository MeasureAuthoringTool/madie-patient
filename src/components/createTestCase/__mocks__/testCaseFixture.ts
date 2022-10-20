import { MeasureScoring, PopulationType, TestCase } from "@madie/madie-models";

export const testCaseFixture: TestCase = {
  id: "623cacffe74613783378c17c",
  executionStatus: "false",
  name: "Initial Population",
  title: "Encounter",
  series: "DENOM_Pass",
  description: "Encounter start within MP.",
  createdAt: "2022-03-24T17:40:15.921Z",
  createdBy: "joseph.kotanchik@semanticbits.com",
  lastModifiedAt: "2022-03-25T18:45:49.403Z",
  lastModifiedBy: "joseph.kotanchik@semanticbits.com",
  json: '{\n  "resourceType": "Bundle",\n  "id": "71",\n  "meta": {\n    "versionId": "1",\n    "lastUpdated": "2022-03-26T15:06:36.868+00:00"\n  },\n  "type": "collection",\n  "entry": [ {\n    "fullUrl": "http://local/Encounter",\n    "resource": {\n      "resourceType": "Encounter",\n      "meta": {\n        "versionId": "1",\n        "lastUpdated": "2021-10-13T03:34:10.160+00:00",\n        "source": "#nEcAkGd8PRwPP5fA"\n      },\n      "text": {\n        "status": "generated",\n        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>"\n      },\n      "status": "cancelled",\n      "class": {\n        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n        "code": "IMP",\n        "display": "inpatient encounter"\n      },\n      "type": [ {\n        "text": "OutPatient"\n      } ],\n      "subject": {\n        "reference": "Patient/1"\n      },\n      "participant": [ {\n        "individual": {\n          "reference": "Practitioner/30164",\n          "display": "Dr John Doe"\n        }\n      } ],\n      "period": {\n        "start": "2023-09-10T03:34:10.054Z"\n      }\n    }\n  }, {\n    "fullUrl": "http://local/Patient",\n    "resource": {\n      "resourceType": "Patient",\n      "text": {\n        "status": "generated",\n        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>"\n      },\n      "identifier": [ {\n        "system": "http://clinfhir.com/fhir/NamingSystem/identifier",\n        "value": "20181011LizzyHealth"\n      } ],\n      "name": [ {\n        "use": "official",\n        "text": "Lizzy Health",\n        "family": "Health",\n        "given": [ "Lizzy" ]\n      } ],\n      "gender": "female",\n      "birthDate": "2000-10-11"\n    }\n  } ]\n}',
  isValidResource: true,
  hapiOperationOutcome: {
    code: 201,
    message: null,
    outcomeResponse: null,
    successful: true,
  },
  groupPopulations: [
    {
      groupId: "1",
      scoring: MeasureScoring.PROPORTION,
      populationBasis: "Boolean",
      stratificationValues: [],
      populationValues: [
        {
          id: "1",
          name: PopulationType.INITIAL_POPULATION,
          expected: true,
          actual: false,
        },
        {
          id: "2",
          name: PopulationType.NUMERATOR,
          expected: false,
          actual: false,
        },
        {
          id: "3",
          name: PopulationType.DENOMINATOR,
          expected: true,
          actual: false,
        },
      ],
    },
  ],
};
