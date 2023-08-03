import { PopulationType, TestCase } from "@madie/madie-models";

export const nonBoolTestCaseFixture: TestCase = {
  patientId: "",
  id: "631f98927e7cb7651b971d1d",
  name: null,
  executionStatus: undefined,
  title: "TC3",
  series: "",
  description: "",
  createdAt: "2022-09-12T20:37:38.757Z",
  createdBy: "fake",
  lastModifiedAt: "2022-09-27T20:05:51.943Z",
  lastModifiedBy: "fake",
  json: '{\n  "resourceType": "Bundle",\n  "id": "2106",\n  "meta": {\n    "versionId": "1",\n    "lastUpdated": "2022-09-06T20:47:21.183+00:00"\n  },\n  "type": "collection",\n  "entry": [ {\n    "fullUrl": "http://local/Encounter1",\n    "resource": {\n      "resourceType": "Encounter",\n      "id": "encounter1",\n      "meta": {\n        "versionId": "1",\n        "lastUpdated": "2021-10-13T03:34:10.160+00:00",\n        "source": "#nEcAkGd8PRwPP5fA"\n      },\n      "text": {\n        "status": "generated",\n        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>"\n      },\n      "class": {\n        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n        "code": "IMP",\n        "display": "inpatient encounter"\n      },\n      "status": "planned",\n      "type": [ {\n        "text": "OutPatient"\n      } ],\n      "subject": {\n        "reference": "Patient/1"\n      },\n      "participant": [ {\n        "individual": {\n          "reference": "Practitioner/30164",\n          "display": "Dr John Doe"\n        }\n      } ],\n      "period": {\n        "start": "2023-09-10T03:34:10.054Z"\n      }\n    }\n  }, {\n    "fullUrl": "http://local/Encounter2",\n    "resource": {\n      "resourceType": "Encounter",\n      "id": "encounter2",\n      "meta": {\n        "versionId": "1",\n        "lastUpdated": "2022-11-15T03:34:10.160+00:00",\n        "source": "#nEcAkGd8PRwPP5fA"\n      },\n      "text": {\n        "status": "generated",\n        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 15th 2022 for Asthma<a name=\\"mm\\"/></div>"\n      },\n      "class": {\n        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n        "code": "IMP",\n        "display": "inpatient encounter"\n      },\n      "status": "planned",\n      "type": [ {\n        "text": "OutPatient"\n      } ],\n      "subject": {\n        "reference": "Patient/1"\n      },\n      "participant": [ {\n        "individual": {\n          "reference": "Practitioner/30164",\n          "display": "Dr John Doe"\n        }\n      } ],\n      "period": {\n        "start": "2023-06-10T03:34:10.054Z"\n      }\n    }\n  }, {\n    "fullUrl": "http://local/Encounter3",\n    "resource": {\n      "resourceType": "Encounter",\n      "id": "encounter3",\n      "meta": {\n        "versionId": "1",\n        "lastUpdated": "2021-10-13T03:34:10.160+00:00",\n        "source": "#nEcAkGd8PRwPP5fA"\n      },\n      "text": {\n        "status": "generated",\n        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>"\n      },\n      "class": {\n        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n        "code": "IMP",\n        "display": "inpatient encounter"\n      },\n      "status": "planned",\n      "type": [ {\n        "text": "OutPatient"\n      } ],\n      "subject": {\n        "reference": "Patient/1"\n      },\n      "participant": [ {\n        "individual": {\n          "reference": "Practitioner/30164",\n          "display": "Dr John Doe"\n        }\n      } ],\n      "period": {\n        "start": "2019-09-10T03:34:10.054Z"\n      }\n    }\n  }, {\n    "fullUrl": "http://local/Patient",\n    "resource": {\n      "resourceType": "Patient",\n      "id": "1",\n      "text": {\n        "status": "generated",\n        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>"\n      },\n      "meta": {\n        "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n      },\n      "identifier": [ {\n        "system": "http://clinfhir.com/fhir/NamingSystem/identifier",\n        "value": "20181011LizzyHealth"\n      } ],\n      "name": [ {\n        "use": "official",\n        "text": "Lizzy Health",\n        "family": "Health",\n        "given": [ "Lizzy" ]\n      } ],\n      "gender": "female",\n      "birthDate": "2000-10-11"\n    }\n  } ]\n  \n}',
  validResource: true,
  hapiOperationOutcome: {
    code: 200,
    message: null,
    successful: true,
    outcomeResponse: {
      resourceType: "OperationOutcome",
      text: undefined,
      issue: [
        {
          severity: "information",
          code: "informational",
          diagnostics: "No issues detected during validation",
          location: undefined,
        },
      ],
    },
  },
  groupPopulations: [
    {
      groupId: "6329ce9d1368254f5c078c11",
      scoring: "Ratio",
      populationBasis: "Encounter",
      populationValues: [
        {
          id: "20b107a1-ba80-4bab-a95e-7b8834e294fb",
          name: PopulationType.INITIAL_POPULATION,
          expected: 2,
        },
        {
          id: "977925da-974e-4bd1-9b68-1fa7a53c8380",
          name: PopulationType.DENOMINATOR,
          expected: 2,
        },
        {
          id: "515975e7-4043-4dec-8eab-9a4abb0b542a",
          name: PopulationType.NUMERATOR,
          expected: undefined,
        },
      ],
      stratificationValues: undefined,
    },
  ],
};
