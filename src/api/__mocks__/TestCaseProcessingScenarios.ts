import {
  AggregateFunctionType,
  Group,
  MeasureGroupTypes,
  PopulationType,
  TestCase,
} from "@madie/madie-models";
import {
  DetailedPopulationGroupResult,
  StatementResult,
} from "fqm-execution/build/types/Calculator";
import { PopulationType as FqmPopulationType } from "fqm-execution/build/types/Enums";

export interface TestCaseProcessingScenario {
  measureGroups: Group[];
  testCase: TestCase;
  populationGroupResults: DetailedPopulationGroupResult[];
}

export const ContinuousVariableBoolean: TestCaseProcessingScenario = {
  measureGroups: [
    {
      id: "638a0daf1b05491a43ce8a16",
      scoring: "Continuous Variable",
      populations: [
        {
          id: "79a67327-8a94-4ae0-a75b-b67c7d28a241",
          name: PopulationType.INITIAL_POPULATION,
          definition: "boolIpp",
          associationType: null,
          description: null,
        },
        {
          id: "79349c30-791c-41c7-9463-81872a0dbed1",
          name: PopulationType.MEASURE_POPULATION,
          definition: "boolDenom",
          associationType: null,
          description: null,
        },
        {
          id: "6205f035-df39-450c-a909-539b23a4056c",
          name: PopulationType.MEASURE_POPULATION_EXCLUSION,
          definition: "",
          associationType: null,
          description: null,
        },
      ],
      measureObservations: [
        {
          id: "7e20f14a-3659-4a87-9692-5ec35391e8f6",
          definition: "boolFunc",
          criteriaReference: "79349c30-791c-41c7-9463-81872a0dbed1",
          aggregateMethod: AggregateFunctionType.AVERAGE,
        },
      ],
      groupDescription: "",
      improvementNotation: "",
      rateAggregation: "",
      measureGroupTypes: [MeasureGroupTypes.OUTCOME],
      scoringUnit: "",
      stratifications: [],
      populationBasis: "boolean",
    },
  ],
  testCase: {
    id: "638a0dbf1b05491a43ce8a17",
    name: null,
    title: "TC1",
    series: "",
    description: "",
    createdAt: "2022-12-02T14:37:51.907Z",
    createdBy: "tester",
    lastModifiedAt: "2022-12-02T14:38:14.502Z",
    lastModifiedBy: "tester",
    validResource: true,
    json: null,
    hapiOperationOutcome: null,
    executionStatus: null,
    groupPopulations: [
      {
        groupId: "638a0daf1b05491a43ce8a16",
        scoring: "Continuous Variable",
        populationBasis: "boolean",
        populationValues: [
          {
            id: "79a67327-8a94-4ae0-a75b-b67c7d28a241",
            criteriaReference: null,
            name: "initialPopulation",
            expected: true,
            actual: false,
          },
          {
            id: "79349c30-791c-41c7-9463-81872a0dbed1",
            criteriaReference: null,
            name: "measurePopulation",
            expected: true,
            actual: false,
          },
          {
            id: "measurePopulationObservation0",
            criteriaReference: "79349c30-791c-41c7-9463-81872a0dbed1",
            name: "measurePopulationObservation",
            expected: 1,
            actual: null,
          },
        ],
        stratificationValues: [],
      },
    ],
  },
  populationGroupResults: [
    {
      groupId: "638a0daf1b05491a43ce8a16",
      statementResults: [
        {
          libraryName: "CVB1",
          statementName: "Patient",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "ipp",
          localId: "14",
          final: "NA",
          relevance: "NA",
          raw: [
            {
              status: {
                value: "planned",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-08-10T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-08-15T03:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "2",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
            {
              status: {
                value: "finished",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-09-12T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-09-13T09:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "3",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
          ],
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "ipp2",
          localId: "28",
          final: "NA",
          relevance: "NA",
          raw: [
            {
              status: {
                value: "finished",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-09-12T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-09-13T09:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "3",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
          ],
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "ex",
          localId: "42",
          final: "NA",
          relevance: "NA",
          raw: [
            {
              status: {
                value: "finished",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-09-12T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-09-13T09:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "3",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
          ],
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "denom",
          localId: "44",
          final: "NA",
          relevance: "NA",
          raw: [
            {
              status: {
                value: "planned",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-08-10T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-08-15T03:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "2",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
            {
              status: {
                value: "finished",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-09-12T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-09-13T09:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "3",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
          ],
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "num",
          localId: "46",
          final: "NA",
          relevance: "NA",
          raw: [
            {
              status: {
                value: "finished",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-09-12T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-09-13T09:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "3",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
          ],
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolIpp",
          localId: "56",
          final: "TRUE",
          relevance: "TRUE",
          raw: true,
          pretty: "true",
        },
        {
          libraryName: "CVB1",
          statementName: "boolIpp2",
          localId: "71",
          final: "TRUE",
          relevance: "TRUE",
          raw: true,
          pretty: "true",
        },
        {
          libraryName: "CVB1",
          statementName: "mPop",
          localId: "86",
          final: "NA",
          relevance: "NA",
          raw: true,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolDenom",
          localId: "88",
          final: "TRUE",
          relevance: "TRUE",
          raw: true,
          pretty: "true",
        },
        {
          libraryName: "CVB1",
          statementName: "boolNum",
          localId: "90",
          final: "NA",
          relevance: "NA",
          raw: true,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolIppZ",
          localId: "95",
          final: "NA",
          relevance: "NA",
          raw: true,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolDenomZ",
          localId: "111",
          final: "NA",
          relevance: "NA",
          raw: true,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolNumZ",
          localId: "120",
          final: "NA",
          relevance: "NA",
          raw: true,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "fun",
          localId: "123",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolFunc",
          localId: "125",
          final: "FALSE",
          relevance: "TRUE",
          pretty: "FUNCTION",
        },
        {
          libraryName: "CVB1",
          statementName: "boolFunc2",
          localId: "127",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "daysObs",
          localId: "132",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "hoursObs",
          localId: "137",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "obs_func_boolFunc",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
      ] as unknown as StatementResult[],
      populationResults: [
        {
          populationType: FqmPopulationType.IPP,
          criteriaExpression: "boolIpp",
          result: true,
          populationId: "79a67327-8a94-4ae0-a75b-b67c7d28a241",
        },
        {
          populationType: FqmPopulationType.MSRPOPL,
          criteriaExpression: "boolDenom",
          result: true,
          populationId: "79349c30-791c-41c7-9463-81872a0dbed1",
        },
        {
          populationType: FqmPopulationType.OBSERV,
          criteriaExpression: "boolFunc",
          result: true,
          populationId: "7e20f14a-3659-4a87-9692-5ec35391e8f6",
          criteriaReferenceId: "79349c30-791c-41c7-9463-81872a0dbed1",
          observations: [1],
        },
      ],
      populationRelevance: [
        {
          populationId: "79a67327-8a94-4ae0-a75b-b67c7d28a241",
          populationType: FqmPopulationType.IPP,
          criteriaExpression: "boolIpp",
          result: true,
        },
        {
          populationId: "79349c30-791c-41c7-9463-81872a0dbed1",
          populationType: FqmPopulationType.MSRPOPL,
          criteriaExpression: "boolDenom",
          result: true,
        },
        {
          populationId: "7e20f14a-3659-4a87-9692-5ec35391e8f6",
          criteriaReferenceId: "79349c30-791c-41c7-9463-81872a0dbed1",
          populationType: FqmPopulationType.OBSERV,
          criteriaExpression: "boolFunc",
          result: true,
        },
      ],
      clauseResults: [],
      html: "",
    },
  ],
};

export const ContinuousVariableBooleanFail: TestCaseProcessingScenario = {
  measureGroups: [
    {
      id: "638a0daf1b05491a43ce8a16",
      scoring: "Continuous Variable",
      populations: [
        {
          id: "79a67327-8a94-4ae0-a75b-b67c7d28a241",
          name: PopulationType.INITIAL_POPULATION,
          definition: "boolIpp",
          associationType: null,
          description: null,
        },
        {
          id: "79349c30-791c-41c7-9463-81872a0dbed1",
          name: PopulationType.MEASURE_POPULATION,
          definition: "boolDenom",
          associationType: null,
          description: null,
        },
        {
          id: "6205f035-df39-450c-a909-539b23a4056c",
          name: PopulationType.MEASURE_POPULATION_EXCLUSION,
          definition: "",
          associationType: null,
          description: null,
        },
      ],
      measureObservations: [
        {
          id: "7e20f14a-3659-4a87-9692-5ec35391e8f6",
          definition: "boolFunc",
          criteriaReference: "79349c30-791c-41c7-9463-81872a0dbed1",
          aggregateMethod: AggregateFunctionType.AVERAGE,
        },
      ],
      groupDescription: "",
      improvementNotation: "",
      rateAggregation: "",
      measureGroupTypes: [MeasureGroupTypes.OUTCOME],
      scoringUnit: "",
      stratifications: [],
      populationBasis: "boolean",
    },
  ],
  testCase: {
    id: "638a0dbf1b05491a43ce8a17",
    name: null,
    title: "TC1",
    series: "",
    description: "",
    createdAt: "2022-12-02T14:37:51.907Z",
    createdBy: "tester",
    lastModifiedAt: "2022-12-02T14:38:14.502Z",
    lastModifiedBy: "tester",
    validResource: true,
    json: null,
    hapiOperationOutcome: null,
    executionStatus: null,
    groupPopulations: [
      {
        groupId: "638a0daf1b05491a43ce8a16",
        scoring: "Continuous Variable",
        populationBasis: "boolean",
        populationValues: [
          {
            id: "79a67327-8a94-4ae0-a75b-b67c7d28a241",
            criteriaReference: null,
            name: "initialPopulation",
            expected: true,
          },
          {
            id: "79349c30-791c-41c7-9463-81872a0dbed1",
            criteriaReference: null,
            name: "measurePopulation",
            expected: false,
          },
          {
            id: "measurePopulationObservation0",
            criteriaReference: "79349c30-791c-41c7-9463-81872a0dbed1",
            name: "measurePopulationObservation",
            expected: 1,
          },
        ],
        stratificationValues: [],
      },
    ],
  },
  populationGroupResults: [
    {
      groupId: "638a0daf1b05491a43ce8a16",
      statementResults: [
        {
          libraryName: "CVB1",
          statementName: "Patient",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "ipp",
          localId: "14",
          final: "NA",
          relevance: "NA",
          raw: [
            {
              status: {
                value: "planned",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-08-10T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-08-15T03:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "2",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
            {
              status: {
                value: "finished",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-09-12T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-09-13T09:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "3",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
          ],
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "ipp2",
          localId: "28",
          final: "NA",
          relevance: "NA",
          raw: [
            {
              status: {
                value: "finished",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-09-12T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-09-13T09:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "3",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
          ],
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "ex",
          localId: "42",
          final: "NA",
          relevance: "NA",
          raw: [
            {
              status: {
                value: "finished",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-09-12T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-09-13T09:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "3",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
          ],
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "denom",
          localId: "44",
          final: "NA",
          relevance: "NA",
          raw: [
            {
              status: {
                value: "planned",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-08-10T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-08-15T03:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "2",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
            {
              status: {
                value: "finished",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-09-12T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-09-13T09:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "3",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
          ],
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "num",
          localId: "46",
          final: "NA",
          relevance: "NA",
          raw: [
            {
              status: {
                value: "finished",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-09-12T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-09-13T09:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "3",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
          ],
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolIpp",
          localId: "56",
          final: "TRUE",
          relevance: "TRUE",
          raw: true,
          pretty: "true",
        },
        {
          libraryName: "CVB1",
          statementName: "boolIpp2",
          localId: "71",
          final: "TRUE",
          relevance: "TRUE",
          raw: true,
          pretty: "true",
        },
        {
          libraryName: "CVB1",
          statementName: "mPop",
          localId: "86",
          final: "NA",
          relevance: "NA",
          raw: true,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolDenom",
          localId: "88",
          final: "TRUE",
          relevance: "TRUE",
          raw: true,
          pretty: "true",
        },
        {
          libraryName: "CVB1",
          statementName: "boolNum",
          localId: "90",
          final: "NA",
          relevance: "NA",
          raw: true,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolIppZ",
          localId: "95",
          final: "NA",
          relevance: "NA",
          raw: true,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolDenomZ",
          localId: "111",
          final: "NA",
          relevance: "NA",
          raw: true,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolNumZ",
          localId: "120",
          final: "NA",
          relevance: "NA",
          raw: true,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "fun",
          localId: "123",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolFunc",
          localId: "125",
          final: "FALSE",
          relevance: "TRUE",
          pretty: "FUNCTION",
        },
        {
          libraryName: "CVB1",
          statementName: "boolFunc2",
          localId: "127",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "daysObs",
          localId: "132",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "hoursObs",
          localId: "137",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "obs_func_boolFunc",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
      ] as unknown as StatementResult[],
      populationResults: [
        {
          populationType: FqmPopulationType.IPP,
          criteriaExpression: "boolIpp",
          result: true,
          populationId: "79a67327-8a94-4ae0-a75b-b67c7d28a241",
        },
        {
          populationType: FqmPopulationType.MSRPOPL,
          criteriaExpression: "boolDenom",
          result: true,
          populationId: "79349c30-791c-41c7-9463-81872a0dbed1",
        },
        {
          populationType: FqmPopulationType.OBSERV,
          criteriaExpression: "boolFunc",
          result: true,
          populationId: "7e20f14a-3659-4a87-9692-5ec35391e8f6",
          criteriaReferenceId: "79349c30-791c-41c7-9463-81872a0dbed1",
          observations: [1],
        },
      ],
      populationRelevance: [
        {
          populationId: "79a67327-8a94-4ae0-a75b-b67c7d28a241",
          populationType: FqmPopulationType.IPP,
          criteriaExpression: "boolIpp",
          result: true,
        },
        {
          populationId: "79349c30-791c-41c7-9463-81872a0dbed1",
          populationType: FqmPopulationType.MSRPOPL,
          criteriaExpression: "boolDenom",
          result: true,
        },
        {
          populationId: "7e20f14a-3659-4a87-9692-5ec35391e8f6",
          criteriaReferenceId: "79349c30-791c-41c7-9463-81872a0dbed1",
          populationType: FqmPopulationType.OBSERV,
          criteriaExpression: "boolFunc",
          result: true,
        },
      ],
      clauseResults: [],
      html: "",
    },
  ],
};

export const ContinuousVariable_Encounter_Pass: TestCaseProcessingScenario = {
  measureGroups: [
    {
      id: "638e14401b05491a43ce8a18",
      scoring: "Continuous Variable",
      populations: [
        {
          id: "77b6063f-f7c8-45db-8d84-1f0d8e7993b5",
          name: PopulationType.INITIAL_POPULATION,
          definition: "ipp",
          associationType: null,
          description: null,
        },
        {
          id: "797c4d66-cfd3-4ced-a482-1d55d5cad85c",
          name: PopulationType.MEASURE_POPULATION,
          definition: "mPop",
          associationType: null,
          description: null,
        },
        {
          id: "5edeebba-b888-4d92-a8b2-8568d78ceb86",
          name: PopulationType.MEASURE_POPULATION_EXCLUSION,
          definition: "",
          associationType: null,
          description: null,
        },
      ],
      measureObservations: [
        {
          id: "ff17cb94-c66e-4f70-a66d-52ace013d054",
          definition: "daysObs",
          criteriaReference: "797c4d66-cfd3-4ced-a482-1d55d5cad85c",
          aggregateMethod: AggregateFunctionType.COUNT,
        },
      ],
      groupDescription: "",
      improvementNotation: "",
      rateAggregation: "",
      measureGroupTypes: [MeasureGroupTypes.OUTCOME],
      scoringUnit: "",
      stratifications: [],
      populationBasis: "Encounter",
    },
  ],
  testCase: {
    id: "638a0dbf1b05491a43ce8a17",
    name: null,
    title: "TC1",
    series: "",
    description: "",
    createdAt: "2022-12-02T14:37:51.907Z",
    createdBy: "nate.moraca@semanticbits.com",
    lastModifiedAt: "2022-12-05T15:54:53.961772019Z",
    lastModifiedBy: "nate.moraca@semanticbits.com",
    validResource: true,
    executionStatus: null,
    json: '{\n  "resourceType": "Bundle",\n  "id": "2106",\n  "meta": {\n    "versionId": "1",\n    "lastUpdated": "2022-09-06T20:47:21.183+00:00"\n  },\n  "type": "collection",\n  "entry": [ {\n    "fullUrl": "http://local/Encounter/2",\n    "resource": { \n      "id": "2", \n      "resourceType": "Encounter",\n      "meta": {\n        "versionId": "1",\n        "lastUpdated": "2021-10-13T03:34:10.160+00:00",\n        "source": "#nEcAkGd8PRwPP5fA"\n      },\n      "text": {\n        "status": "generated",\n        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>"\n      },\n      "class": {\n        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n        "code": "IMP",\n        "display": "inpatient encounter"\n      },\n      "status": "planned",\n      "type": [ {\n        "text": "OutPatient"\n      } ],\n      "subject": {\n        "reference": "Patient/1"\n      },\n      "participant": [ {\n        "individual": {\n          "reference": "Practitioner/30164",\n          "display": "Dr John Doe"\n        }\n      } ],\n      "period": {\n        "start": "2023-08-10T03:34:10.054Z",\n        "end": "2023-08-15T03:34:10.054Z"\n      }\n    }\n  }, {\n    "fullUrl": "http://local/Encounter/3",\n    "resource": {\n      "id": "3",\n      "resourceType": "Encounter",\n      "meta": {\n        "versionId": "1",\n        "lastUpdated": "2021-10-13T03:34:10.160+00:00",\n        "source": "#nEcAkGd8PRwPP5fA"\n      },\n      "text": { \n        "status": "generated",\n        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>"\n      },\n      "class": {\n        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n        "code": "IMP",\n        "display": "inpatient encounter"\n      },\n      "status": "planned",\n      "type": [ {\n        "text": "OutPatient"\n      } ],\n      "subject": {\n        "reference": "Patient/1"\n      },\n      "participant": [ {\n        "individual": {\n          "reference": "Practitioner/30164",\n          "display": "Dr John Doe"\n        }\n      } ],\n      "period": {\n        "start": "2023-09-12T03:34:10.054Z",\n        "end": "2023-09-13T09:34:10.054Z"\n      }\n    }\n  }, {\n    "fullUrl": "http://local/Patient/1",\n    "resource": {\n      "id": "1",\n      "resourceType": "Patient",\n      "text": {\n        "status": "generated",\n        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>"\n      },\n      "meta": {\n        "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n      },\n      "identifier": [ {\n        "system": "http://clinfhir.com/fhir/NamingSystem/identifier",\n        "value": "20181011LizzyHealth"\n      } ],\n      "name": [ {\n        "use": "official",\n        "text": "Lizzy Health",\n        "family": "Health",\n        "given": [ "Lizzy" ]\n      } ],\n      "gender": "female",\n      "birthDate": "2000-10-11"\n    }\n  } ]\n\n}\n',
    hapiOperationOutcome: {
      code: 200,
      message: null,
      successful: true,
      outcomeResponse: {
        resourceType: "OperationOutcome",
        issue: [],
        text: null,
      },
    },
    groupPopulations: [
      {
        groupId: "638e14401b05491a43ce8a18",
        scoring: "Continuous Variable",
        populationBasis: "Encounter",
        populationValues: [
          {
            id: "77b6063f-f7c8-45db-8d84-1f0d8e7993b5",
            criteriaReference: null,
            name: "initialPopulation",
            expected: 2,
          },
          {
            id: "797c4d66-cfd3-4ced-a482-1d55d5cad85c",
            criteriaReference: null,
            name: "measurePopulation",
            expected: 2,
          },
          {
            id: "measurePopulationObservation0",
            criteriaReference: "797c4d66-cfd3-4ced-a482-1d55d5cad85c",
            name: "measurePopulationObservation",
            expected: 5,
          },
          {
            id: "measurePopulationObservation1",
            criteriaReference: "797c4d66-cfd3-4ced-a482-1d55d5cad85c",
            name: "measurePopulationObservation",
            expected: 1,
          },
        ],
        stratificationValues: [],
      },
    ],
  },
  populationGroupResults: [
    {
      groupId: "638e14401b05491a43ce8a18",
      episodeResults: [
        {
          episodeId: "2",
          populationResults: [
            {
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "ipp",
              result: true,
              populationId: "77b6063f-f7c8-45db-8d84-1f0d8e7993b5",
            },
            {
              populationType: FqmPopulationType.MSRPOPL,
              criteriaExpression: "mPop",
              result: true,
              populationId: "797c4d66-cfd3-4ced-a482-1d55d5cad85c",
            },
            {
              populationType: FqmPopulationType.MSRPOPLEX,
              result: false,
              populationId: "5edeebba-b888-4d92-a8b2-8568d78ceb86",
            },
            {
              populationType: FqmPopulationType.OBSERV,
              criteriaExpression: "daysObs",
              result: true,
              populationId: "ff17cb94-c66e-4f70-a66d-52ace013d054",
              criteriaReferenceId: "797c4d66-cfd3-4ced-a482-1d55d5cad85c",
              observations: [5],
            },
          ],
        },
        {
          episodeId: "3",
          populationResults: [
            {
              populationType: FqmPopulationType.IPP,
              criteriaExpression: "ipp",
              result: true,
              populationId: "77b6063f-f7c8-45db-8d84-1f0d8e7993b5",
            },
            {
              populationType: FqmPopulationType.MSRPOPL,
              criteriaExpression: "mPop",
              result: true,
              populationId: "797c4d66-cfd3-4ced-a482-1d55d5cad85c",
            },
            {
              populationType: FqmPopulationType.MSRPOPLEX,
              result: false,
              populationId: "5edeebba-b888-4d92-a8b2-8568d78ceb86",
            },
            {
              populationType: FqmPopulationType.OBSERV,
              criteriaExpression: "daysObs",
              result: true,
              populationId: "ff17cb94-c66e-4f70-a66d-52ace013d054",
              criteriaReferenceId: "797c4d66-cfd3-4ced-a482-1d55d5cad85c",
              observations: [1],
            },
          ],
        },
      ],
      statementResults: [
        {
          libraryName: "CVB1",
          statementName: "Patient",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "ipp",
          localId: "14",
          final: "TRUE",
          relevance: "TRUE",
          raw: [
            {
              status: {
                value: "planned",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-08-10T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-08-15T03:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "2",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
            {
              status: {
                value: "planned",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-09-12T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-09-13T09:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "3",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
          ],
          pretty:
            '[{\n  account: null,\n  appointment: null,\n  basedOn: null,\n  class: {\n    code: {\n      extension: null,\n      id: null,\n      value: "IMP"\n    },\n    display: {\n      extension: null,\n      id: null,\n      value: "inpatient encounter"\n    },\n    extension: null,\n    id: null,\n    system: {\n      extension: null,\n      id: null,\n      value: "http://terminology.hl7.org/CodeSystem/v3-ActCode"\n    },\n    userSelected: null,\n    version: null\n  },\n  classHistory: null,\n  contained: null,\n  diagnosis: null,\n  episodeOfCare: null,\n  extension: null,\n  hospitalization: null,\n  id: {\n    extension: null,\n    id: null,\n    value: "2"\n  },\n  identifier: null,\n  implicitRules: null,\n  language: null,\n  length: null,\n  location: null,\n  meta: {\n    extension: null,\n    id: null,\n    lastUpdated: {\n      extension: null,\n      id: null,\n      value: 10/13/2021 3:34 AM\n    },\n    profile: null,\n    security: null,\n    source: {\n      extension: null,\n      id: null,\n      value: "#nEcAkGd8PRwPP5fA"\n    },\n    tag: null,\n    versionId: {\n      extension: null,\n      id: null,\n      value: "1"\n    }\n  },\n  modifierExtension: null,\n  partOf: null,\n  participant: [{\n    extension: null,\n    id: null,\n    individual: {\n      display: {\n        extension: null,\n        id: null,\n        value: "Dr John Doe"\n      },\n      extension: null,\n      id: null,\n      identifier: null,\n      reference: {\n        extension: null,\n        id: null,\n        value: "Practitioner/30164"\n      },\n      type: null\n    },\n    modifierExtension: null,\n    period: null,\n    type: null\n  }],\n  period: {\n    end: {\n      extension: null,\n      id: null,\n      value: 08/15/2023 3:34 AM\n    },\n    extension: null,\n    id: null,\n    start: {\n      extension: null,\n      id: null,\n      value: 08/10/2023 3:34 AM\n    }\n  },\n  priority: null,\n  reasonCode: null,\n  reasonReference: null,\n  serviceProvider: null,\n  serviceType: null,\n  status: {\n    extension: null,\n    id: null,\n    value: "planned"\n  },\n  statusHistory: null,\n  subject: {\n    display: null,\n    extension: null,\n    id: null,\n    identifier: null,\n    reference: {\n      extension: null,\n      id: null,\n      value: "Patient/1"\n    },\n    type: null\n  },\n  text: {\n    div: {\n      extension: null,\n      id: null,\n      value: "<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>"\n    },\n    extension: null,\n    id: null,\n    status: {\n      extension: null,\n      id: null,\n      value: "generated"\n    }\n  },\n  type: [{\n    coding: null,\n    extension: null,\n    id: null,\n    text: {\n      extension: null,\n      id: null,\n      value: "OutPatient"\n    }\n  }]\n},\n{\n  account: null,\n  appointment: null,\n  basedOn: null,\n  class: {\n    code: {\n      extension: null,\n      id: null,\n      value: "IMP"\n    },\n    display: {\n      extension: null,\n      id: null,\n      value: "inpatient encounter"\n    },\n    extension: null,\n    id: null,\n    system: {\n      extension: null,\n      id: null,\n      value: "http://terminology.hl7.org/CodeSystem/v3-ActCode"\n    },\n    userSelected: null,\n    version: null\n  },\n  classHistory: null,\n  contained: null,\n  diagnosis: null,\n  episodeOfCare: null,\n  extension: null,\n  hospitalization: null,\n  id: {\n    extension: null,\n    id: null,\n    value: "3"\n  },\n  identifier: null,\n  implicitRules: null,\n  language: null,\n  length: null,\n  location: null,\n  meta: {\n    extension: null,\n    id: null,\n    lastUpdated: {\n      extension: null,\n      id: null,\n      value: 10/13/2021 3:34 AM\n    },\n    profile: null,\n    security: null,\n    source: {\n      extension: null,\n      id: null,\n      value: "#nEcAkGd8PRwPP5fA"\n    },\n    tag: null,\n    versionId: {\n      extension: null,\n      id: null,\n      value: "1"\n    }\n  },\n  modifierExtension: null,\n  partOf: null,\n  participant: [{\n    extension: null,\n    id: null,\n    individual: {\n      display: {\n        extension: null,\n        id: null,\n        value: "Dr John Doe"\n      },\n      extension: null,\n      id: null,\n      identifier: null,\n      reference: {\n        extension: null,\n        id: null,\n        value: "Practitioner/30164"\n      },\n      type: null\n    },\n    modifierExtension: null,\n    period: null,\n    type: null\n  }],\n  period: {\n    end: {\n      extension: null,\n      id: null,\n      value: 09/13/2023 9:34 AM\n    },\n    extension: null,\n    id: null,\n    start: {\n      extension: null,\n      id: null,\n      value: 09/12/2023 3:34 AM\n    }\n  },\n  priority: null,\n  reasonCode: null,\n  reasonReference: null,\n  serviceProvider: null,\n  serviceType: null,\n  status: {\n    extension: null,\n    id: null,\n    value: "planned"\n  },\n  statusHistory: null,\n  subject: {\n    display: null,\n    extension: null,\n    id: null,\n    identifier: null,\n    reference: {\n      extension: null,\n      id: null,\n      value: "Patient/1"\n    },\n    type: null\n  },\n  text: {\n    div: {\n      extension: null,\n      id: null,\n      value: "<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>"\n    },\n    extension: null,\n    id: null,\n    status: {\n      extension: null,\n      id: null,\n      value: "generated"\n    }\n  },\n  type: [{\n    coding: null,\n    extension: null,\n    id: null,\n    text: {\n      extension: null,\n      id: null,\n      value: "OutPatient"\n    }\n  }]\n}]',
        },
        {
          libraryName: "CVB1",
          statementName: "ipp2",
          localId: "28",
          final: "NA",
          relevance: "NA",
          raw: [],
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "ex",
          localId: "42",
          final: "NA",
          relevance: "NA",
          raw: [],
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "denom",
          localId: "44",
          final: "NA",
          relevance: "NA",
          raw: [
            {
              status: {
                value: "planned",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-08-10T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-08-15T03:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "2",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
            {
              status: {
                value: "planned",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-09-12T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-09-13T09:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "3",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
          ],
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "num",
          localId: "46",
          final: "NA",
          relevance: "NA",
          raw: [],
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "mPop",
          localId: "60",
          final: "TRUE",
          relevance: "TRUE",
          raw: [
            {
              status: {
                value: "planned",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-08-10T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-08-15T03:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "2",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
            {
              status: {
                value: "planned",
              },
              class: {
                system: {
                  value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                },
                code: {
                  value: "IMP",
                },
                display: {
                  value: "inpatient encounter",
                },
              },
              type: [
                {
                  text: {
                    value: "OutPatient",
                  },
                },
              ],
              subject: {
                reference: {
                  value: "Patient/1",
                },
              },
              participant: [
                {
                  individual: {
                    reference: {
                      value: "Practitioner/30164",
                    },
                    display: {
                      value: "Dr John Doe",
                    },
                  },
                },
              ],
              period: {
                start: {
                  value: "2023-09-12T03:34:10.054+00:00",
                },
                end: {
                  value: "2023-09-13T09:34:10.054+00:00",
                },
              },
              text: {
                status: {
                  value: "generated",
                },
                div: {
                  value:
                    '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                },
              },
              id: {
                value: "3",
              },
              meta: {
                versionId: {
                  value: "1",
                },
                lastUpdated: {
                  value: "2021-10-13T03:34:10.160+00:00",
                },
                source: {
                  value: "#nEcAkGd8PRwPP5fA",
                },
              },
            },
          ],
          pretty:
            '[{\n  account: null,\n  appointment: null,\n  basedOn: null,\n  class: {\n    code: {\n      extension: null,\n      id: null,\n      value: "IMP"\n    },\n    display: {\n      extension: null,\n      id: null,\n      value: "inpatient encounter"\n    },\n    extension: null,\n    id: null,\n    system: {\n      extension: null,\n      id: null,\n      value: "http://terminology.hl7.org/CodeSystem/v3-ActCode"\n    },\n    userSelected: null,\n    version: null\n  },\n  classHistory: null,\n  contained: null,\n  diagnosis: null,\n  episodeOfCare: null,\n  extension: null,\n  hospitalization: null,\n  id: {\n    extension: null,\n    id: null,\n    value: "2"\n  },\n  identifier: null,\n  implicitRules: null,\n  language: null,\n  length: null,\n  location: null,\n  meta: {\n    extension: null,\n    id: null,\n    lastUpdated: {\n      extension: null,\n      id: null,\n      value: 10/13/2021 3:34 AM\n    },\n    profile: null,\n    security: null,\n    source: {\n      extension: null,\n      id: null,\n      value: "#nEcAkGd8PRwPP5fA"\n    },\n    tag: null,\n    versionId: {\n      extension: null,\n      id: null,\n      value: "1"\n    }\n  },\n  modifierExtension: null,\n  partOf: null,\n  participant: [{\n    extension: null,\n    id: null,\n    individual: {\n      display: {\n        extension: null,\n        id: null,\n        value: "Dr John Doe"\n      },\n      extension: null,\n      id: null,\n      identifier: null,\n      reference: {\n        extension: null,\n        id: null,\n        value: "Practitioner/30164"\n      },\n      type: null\n    },\n    modifierExtension: null,\n    period: null,\n    type: null\n  }],\n  period: {\n    end: {\n      extension: null,\n      id: null,\n      value: 08/15/2023 3:34 AM\n    },\n    extension: null,\n    id: null,\n    start: {\n      extension: null,\n      id: null,\n      value: 08/10/2023 3:34 AM\n    }\n  },\n  priority: null,\n  reasonCode: null,\n  reasonReference: null,\n  serviceProvider: null,\n  serviceType: null,\n  status: {\n    extension: null,\n    id: null,\n    value: "planned"\n  },\n  statusHistory: null,\n  subject: {\n    display: null,\n    extension: null,\n    id: null,\n    identifier: null,\n    reference: {\n      extension: null,\n      id: null,\n      value: "Patient/1"\n    },\n    type: null\n  },\n  text: {\n    div: {\n      extension: null,\n      id: null,\n      value: "<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>"\n    },\n    extension: null,\n    id: null,\n    status: {\n      extension: null,\n      id: null,\n      value: "generated"\n    }\n  },\n  type: [{\n    coding: null,\n    extension: null,\n    id: null,\n    text: {\n      extension: null,\n      id: null,\n      value: "OutPatient"\n    }\n  }]\n},\n{\n  account: null,\n  appointment: null,\n  basedOn: null,\n  class: {\n    code: {\n      extension: null,\n      id: null,\n      value: "IMP"\n    },\n    display: {\n      extension: null,\n      id: null,\n      value: "inpatient encounter"\n    },\n    extension: null,\n    id: null,\n    system: {\n      extension: null,\n      id: null,\n      value: "http://terminology.hl7.org/CodeSystem/v3-ActCode"\n    },\n    userSelected: null,\n    version: null\n  },\n  classHistory: null,\n  contained: null,\n  diagnosis: null,\n  episodeOfCare: null,\n  extension: null,\n  hospitalization: null,\n  id: {\n    extension: null,\n    id: null,\n    value: "3"\n  },\n  identifier: null,\n  implicitRules: null,\n  language: null,\n  length: null,\n  location: null,\n  meta: {\n    extension: null,\n    id: null,\n    lastUpdated: {\n      extension: null,\n      id: null,\n      value: 10/13/2021 3:34 AM\n    },\n    profile: null,\n    security: null,\n    source: {\n      extension: null,\n      id: null,\n      value: "#nEcAkGd8PRwPP5fA"\n    },\n    tag: null,\n    versionId: {\n      extension: null,\n      id: null,\n      value: "1"\n    }\n  },\n  modifierExtension: null,\n  partOf: null,\n  participant: [{\n    extension: null,\n    id: null,\n    individual: {\n      display: {\n        extension: null,\n        id: null,\n        value: "Dr John Doe"\n      },\n      extension: null,\n      id: null,\n      identifier: null,\n      reference: {\n        extension: null,\n        id: null,\n        value: "Practitioner/30164"\n      },\n      type: null\n    },\n    modifierExtension: null,\n    period: null,\n    type: null\n  }],\n  period: {\n    end: {\n      extension: null,\n      id: null,\n      value: 09/13/2023 9:34 AM\n    },\n    extension: null,\n    id: null,\n    start: {\n      extension: null,\n      id: null,\n      value: 09/12/2023 3:34 AM\n    }\n  },\n  priority: null,\n  reasonCode: null,\n  reasonReference: null,\n  serviceProvider: null,\n  serviceType: null,\n  status: {\n    extension: null,\n    id: null,\n    value: "planned"\n  },\n  statusHistory: null,\n  subject: {\n    display: null,\n    extension: null,\n    id: null,\n    identifier: null,\n    reference: {\n      extension: null,\n      id: null,\n      value: "Patient/1"\n    },\n    type: null\n  },\n  text: {\n    div: {\n      extension: null,\n      id: null,\n      value: "<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>"\n    },\n    extension: null,\n    id: null,\n    status: {\n      extension: null,\n      id: null,\n      value: "generated"\n    }\n  },\n  type: [{\n    coding: null,\n    extension: null,\n    id: null,\n    text: {\n      extension: null,\n      id: null,\n      value: "OutPatient"\n    }\n  }]\n}]',
        },
        {
          libraryName: "CVB1",
          statementName: "boolIpp",
          localId: "70",
          final: "NA",
          relevance: "NA",
          raw: true,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolIpp2",
          localId: "85",
          final: "NA",
          relevance: "NA",
          raw: false,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolMPop",
          localId: "100",
          final: "NA",
          relevance: "NA",
          raw: true,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolDenom",
          localId: "102",
          final: "NA",
          relevance: "NA",
          raw: false,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolNum",
          localId: "104",
          final: "NA",
          relevance: "NA",
          raw: false,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolIppZ",
          localId: "109",
          final: "NA",
          relevance: "NA",
          raw: true,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolDenomZ",
          localId: "125",
          final: "NA",
          relevance: "NA",
          raw: true,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolNumZ",
          localId: "134",
          final: "NA",
          relevance: "NA",
          raw: false,
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "fun",
          localId: "137",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolFunc",
          localId: "139",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "boolFunc2",
          localId: "141",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "daysObs",
          localId: "146",
          final: "FALSE",
          relevance: "TRUE",
          pretty: "FUNCTION",
        },
        {
          libraryName: "CVB1",
          statementName: "hoursObs",
          localId: "151",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "obs_func_boolFunc",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
        {
          libraryName: "CVB1",
          statementName: "obs_func_daysObs_mPop",
          final: "NA",
          relevance: "NA",
          pretty: "NA",
        },
      ] as unknown as StatementResult[],
      populationResults: [
        {
          populationType: FqmPopulationType.IPP,
          criteriaExpression: "ipp",
          result: true,
          populationId: "77b6063f-f7c8-45db-8d84-1f0d8e7993b5",
        },
        {
          populationType: FqmPopulationType.MSRPOPL,
          criteriaExpression: "mPop",
          result: true,
          populationId: "797c4d66-cfd3-4ced-a482-1d55d5cad85c",
        },
        {
          populationType: FqmPopulationType.MSRPOPLEX,
          result: false,
          populationId: "5edeebba-b888-4d92-a8b2-8568d78ceb86",
        },
        {
          populationType: FqmPopulationType.OBSERV,
          criteriaExpression: "daysObs",
          result: true,
          populationId: "ff17cb94-c66e-4f70-a66d-52ace013d054",
          criteriaReferenceId: "797c4d66-cfd3-4ced-a482-1d55d5cad85c",
          observations: [5, 1],
        },
      ],
      populationRelevance: [
        {
          populationType: FqmPopulationType.IPP,
          criteriaExpression: "ipp",
          result: true,
          populationId: "77b6063f-f7c8-45db-8d84-1f0d8e7993b5",
        },
        {
          populationType: FqmPopulationType.MSRPOPL,
          criteriaExpression: "mPop",
          result: true,
          populationId: "797c4d66-cfd3-4ced-a482-1d55d5cad85c",
        },
        {
          populationType: FqmPopulationType.MSRPOPLEX,
          result: true,
          populationId: "5edeebba-b888-4d92-a8b2-8568d78ceb86",
        },
        {
          populationType: FqmPopulationType.OBSERV,
          criteriaExpression: "daysObs",
          result: true,
          populationId: "ff17cb94-c66e-4f70-a66d-52ace013d054",
          criteriaReferenceId: "797c4d66-cfd3-4ced-a482-1d55d5cad85c",
        },
      ],
      clauseResults: [],
      html: "",
    },
  ],
};

export const Ratio_Boolean_SingleIP_DenObs_NumObs_Pass: TestCaseProcessingScenario =
  {
    measureGroups: [
      {
        id: "63879ae21b05491a43ce8a12",
        scoring: "Ratio",
        populations: [
          {
            id: "3c710d76-d5d2-4dc0-a3fb-28fdac1055d0",
            name: PopulationType.INITIAL_POPULATION,
            definition: "boolIpp",
            description: null,
          },
          {
            id: "760758ae-009f-49b2-b7a3-c9997ac3931d",
            name: PopulationType.DENOMINATOR,
            definition: "boolDenom",
            associationType: null,
            description: null,
          },
          {
            id: "bac3b6d3-c55d-45b8-a4bc-be6cbdb413b4",
            name: PopulationType.DENOMINATOR_EXCLUSION,
            definition: "",
            associationType: null,
            description: null,
          },
          {
            id: "77e217d6-03dd-41ca-a1c3-f679933f9dd7",
            name: PopulationType.NUMERATOR,
            definition: "boolNum",
            associationType: null,
            description: null,
          },
          {
            id: "44849abd-609d-486a-a403-df901391deec",
            name: PopulationType.NUMERATOR_EXCLUSION,
            definition: "",
            associationType: null,
            description: null,
          },
        ],
        measureObservations: [
          {
            id: "536dbb4e-9032-414c-b7e7-048f5c8fb4ab",
            definition: "boolFunc2",
            criteriaReference: "77e217d6-03dd-41ca-a1c3-f679933f9dd7",
            aggregateMethod: AggregateFunctionType.MEDIAN,
          },
          {
            id: "7cfae29e-e9cc-4958-89de-a9dde443186f",
            definition: "boolFunc",
            criteriaReference: "760758ae-009f-49b2-b7a3-c9997ac3931d",
            aggregateMethod: AggregateFunctionType.MAXIMUM,
          },
        ],
        groupDescription: "",
        improvementNotation: "",
        rateAggregation: "",
        measureGroupTypes: [MeasureGroupTypes.OUTCOME],
        scoringUnit: "",
        stratifications: [],
        populationBasis: "boolean",
      },
    ],
    testCase: {
      id: "63879d521b05491a43ce8a14",
      name: null,
      title: "TC1",
      series: "",
      description: "",
      createdAt: "2022-11-30T18:13:38.789Z",
      createdBy: "nate.moraca@semanticbits.com",
      lastModifiedAt: "2022-11-30T19:00:34.449Z",
      lastModifiedBy: "nate.moraca@semanticbits.com",
      validResource: true,
      executionStatus: null,
      json: '{\n  "resourceType": "Bundle",\n  "id": "2106",\n  "meta": {\n    "versionId": "1",\n    "lastUpdated": "2022-09-06T20:47:21.183+00:00"\n  },\n  "type": "collection",\n  "entry": [ {\n    "fullUrl": "http://local/Encounter/2",\n    "resource": { \n      "id": "2", \n      "resourceType": "Encounter",\n      "meta": {\n        "versionId": "1",\n        "lastUpdated": "2021-10-13T03:34:10.160+00:00",\n        "source": "#nEcAkGd8PRwPP5fA"\n      },\n      "text": {\n        "status": "generated",\n        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>"\n      },\n      "class": {\n        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n        "code": "IMP",\n        "display": "inpatient encounter"\n      },\n      "status": "planned",\n      "type": [ {\n        "text": "OutPatient"\n      } ],\n      "subject": {\n        "reference": "Patient/1"\n      },\n      "participant": [ {\n        "individual": {\n          "reference": "Practitioner/30164",\n          "display": "Dr John Doe"\n        }\n      } ],\n      "period": {\n        "start": "2023-08-10T03:34:10.054Z",\n        "end": "2023-08-15T03:34:10.054Z"\n      }\n    }\n  }, {\n    "fullUrl": "http://local/Encounter/3",\n    "resource": {\n      "id": "3",\n      "resourceType": "Encounter",\n      "meta": {\n        "versionId": "1",\n        "lastUpdated": "2021-10-13T03:34:10.160+00:00",\n        "source": "#nEcAkGd8PRwPP5fA"\n      },\n      "text": { \n        "status": "generated",\n        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>"\n      },\n      "class": {\n        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n        "code": "IMP",\n        "display": "inpatient encounter"\n      },\n      "status": "finished",\n      "type": [ {\n        "text": "OutPatient"\n      } ],\n      "subject": {\n        "reference": "Patient/1"\n      },\n      "participant": [ {\n        "individual": {\n          "reference": "Practitioner/30164",\n          "display": "Dr John Doe"\n        }\n      } ],\n      "period": {\n        "start": "2023-09-12T03:34:10.054Z",\n        "end": "2023-09-13T09:34:10.054Z"\n      }\n    }\n  }, {\n    "fullUrl": "http://local/Patient/1",\n    "resource": {\n      "id": "1",\n      "resourceType": "Patient",\n      "text": {\n        "status": "generated",\n        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>"\n      },\n      "meta": {\n        "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n      },\n      "identifier": [ {\n        "system": "http://clinfhir.com/fhir/NamingSystem/identifier",\n        "value": "20181011LizzyHealth"\n      } ],\n      "name": [ {\n        "use": "official",\n        "text": "Lizzy Health",\n        "family": "Health",\n        "given": [ "Lizzy" ]\n      } ],\n      "gender": "female",\n      "birthDate": "2000-10-11"\n    }\n  } ]\n\n}\n',
      hapiOperationOutcome: null,
      groupPopulations: [
        {
          groupId: "63879ae21b05491a43ce8a12",
          scoring: "Ratio",
          populationBasis: "boolean",
          populationValues: [
            {
              id: "3c710d76-d5d2-4dc0-a3fb-28fdac1055d0",
              criteriaReference: null,
              name: "initialPopulation",
              expected: true,
              actual: true,
            },
            {
              id: "760758ae-009f-49b2-b7a3-c9997ac3931d",
              criteriaReference: null,
              name: "denominator",
              expected: true,
              actual: true,
            },
            {
              id: "denominatorObservation0",
              criteriaReference: "760758ae-009f-49b2-b7a3-c9997ac3931d",
              name: "denominatorObservation",
              expected: 1,
            },
            {
              id: "77e217d6-03dd-41ca-a1c3-f679933f9dd7",
              criteriaReference: null,
              name: "numerator",
              expected: true,
              actual: true,
            },
            {
              id: "numeratorObservation0",
              criteriaReference: "77e217d6-03dd-41ca-a1c3-f679933f9dd7",
              name: "numeratorObservation",
              expected: 14,
            },
          ],
          stratificationValues: [],
        },
      ],
    },
    populationGroupResults: [
      {
        groupId: "63879ae21b05491a43ce8a12",
        statementResults: [
          {
            libraryName: "FqmT1",
            statementName: "Patient",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "ipp",
            localId: "14",
            final: "NA",
            relevance: "NA",
            raw: [
              {
                status: {
                  value: "planned",
                },
                class: {
                  system: {
                    value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                  },
                  code: {
                    value: "IMP",
                  },
                  display: {
                    value: "inpatient encounter",
                  },
                },
                type: [
                  {
                    text: {
                      value: "OutPatient",
                    },
                  },
                ],
                subject: {
                  reference: {
                    value: "Patient/1",
                  },
                },
                participant: [
                  {
                    individual: {
                      reference: {
                        value: "Practitioner/30164",
                      },
                      display: {
                        value: "Dr John Doe",
                      },
                    },
                  },
                ],
                period: {
                  start: {
                    value: "2023-08-10T03:34:10.054+00:00",
                  },
                  end: {
                    value: "2023-08-15T03:34:10.054+00:00",
                  },
                },
                text: {
                  status: {
                    value: "generated",
                  },
                  div: {
                    value:
                      '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                  },
                },
                id: {
                  value: "2",
                },
                meta: {
                  versionId: {
                    value: "1",
                  },
                  lastUpdated: {
                    value: "2021-10-13T03:34:10.160+00:00",
                  },
                  source: {
                    value: "#nEcAkGd8PRwPP5fA",
                  },
                },
              },
              {
                status: {
                  value: "finished",
                },
                class: {
                  system: {
                    value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                  },
                  code: {
                    value: "IMP",
                  },
                  display: {
                    value: "inpatient encounter",
                  },
                },
                type: [
                  {
                    text: {
                      value: "OutPatient",
                    },
                  },
                ],
                subject: {
                  reference: {
                    value: "Patient/1",
                  },
                },
                participant: [
                  {
                    individual: {
                      reference: {
                        value: "Practitioner/30164",
                      },
                      display: {
                        value: "Dr John Doe",
                      },
                    },
                  },
                ],
                period: {
                  start: {
                    value: "2023-09-12T03:34:10.054+00:00",
                  },
                  end: {
                    value: "2023-09-13T09:34:10.054+00:00",
                  },
                },
                text: {
                  status: {
                    value: "generated",
                  },
                  div: {
                    value:
                      '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                  },
                },
                id: {
                  value: "3",
                },
                meta: {
                  versionId: {
                    value: "1",
                  },
                  lastUpdated: {
                    value: "2021-10-13T03:34:10.160+00:00",
                  },
                  source: {
                    value: "#nEcAkGd8PRwPP5fA",
                  },
                },
              },
            ],
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "ipp2",
            localId: "28",
            final: "NA",
            relevance: "NA",
            raw: [
              {
                status: {
                  value: "finished",
                },
                class: {
                  system: {
                    value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                  },
                  code: {
                    value: "IMP",
                  },
                  display: {
                    value: "inpatient encounter",
                  },
                },
                type: [
                  {
                    text: {
                      value: "OutPatient",
                    },
                  },
                ],
                subject: {
                  reference: {
                    value: "Patient/1",
                  },
                },
                participant: [
                  {
                    individual: {
                      reference: {
                        value: "Practitioner/30164",
                      },
                      display: {
                        value: "Dr John Doe",
                      },
                    },
                  },
                ],
                period: {
                  start: {
                    value: "2023-09-12T03:34:10.054+00:00",
                  },
                  end: {
                    value: "2023-09-13T09:34:10.054+00:00",
                  },
                },
                text: {
                  status: {
                    value: "generated",
                  },
                  div: {
                    value:
                      '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                  },
                },
                id: {
                  value: "3",
                },
                meta: {
                  versionId: {
                    value: "1",
                  },
                  lastUpdated: {
                    value: "2021-10-13T03:34:10.160+00:00",
                  },
                  source: {
                    value: "#nEcAkGd8PRwPP5fA",
                  },
                },
              },
            ],
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "ex",
            localId: "42",
            final: "NA",
            relevance: "NA",
            raw: [
              {
                status: {
                  value: "finished",
                },
                class: {
                  system: {
                    value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                  },
                  code: {
                    value: "IMP",
                  },
                  display: {
                    value: "inpatient encounter",
                  },
                },
                type: [
                  {
                    text: {
                      value: "OutPatient",
                    },
                  },
                ],
                subject: {
                  reference: {
                    value: "Patient/1",
                  },
                },
                participant: [
                  {
                    individual: {
                      reference: {
                        value: "Practitioner/30164",
                      },
                      display: {
                        value: "Dr John Doe",
                      },
                    },
                  },
                ],
                period: {
                  start: {
                    value: "2023-09-12T03:34:10.054+00:00",
                  },
                  end: {
                    value: "2023-09-13T09:34:10.054+00:00",
                  },
                },
                text: {
                  status: {
                    value: "generated",
                  },
                  div: {
                    value:
                      '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                  },
                },
                id: {
                  value: "3",
                },
                meta: {
                  versionId: {
                    value: "1",
                  },
                  lastUpdated: {
                    value: "2021-10-13T03:34:10.160+00:00",
                  },
                  source: {
                    value: "#nEcAkGd8PRwPP5fA",
                  },
                },
              },
            ],
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "denom",
            localId: "44",
            final: "NA",
            relevance: "NA",
            raw: [
              {
                status: {
                  value: "planned",
                },
                class: {
                  system: {
                    value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                  },
                  code: {
                    value: "IMP",
                  },
                  display: {
                    value: "inpatient encounter",
                  },
                },
                type: [
                  {
                    text: {
                      value: "OutPatient",
                    },
                  },
                ],
                subject: {
                  reference: {
                    value: "Patient/1",
                  },
                },
                participant: [
                  {
                    individual: {
                      reference: {
                        value: "Practitioner/30164",
                      },
                      display: {
                        value: "Dr John Doe",
                      },
                    },
                  },
                ],
                period: {
                  start: {
                    value: "2023-08-10T03:34:10.054+00:00",
                  },
                  end: {
                    value: "2023-08-15T03:34:10.054+00:00",
                  },
                },
                text: {
                  status: {
                    value: "generated",
                  },
                  div: {
                    value:
                      '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                  },
                },
                id: {
                  value: "2",
                },
                meta: {
                  versionId: {
                    value: "1",
                  },
                  lastUpdated: {
                    value: "2021-10-13T03:34:10.160+00:00",
                  },
                  source: {
                    value: "#nEcAkGd8PRwPP5fA",
                  },
                },
              },
              {
                status: {
                  value: "finished",
                },
                class: {
                  system: {
                    value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                  },
                  code: {
                    value: "IMP",
                  },
                  display: {
                    value: "inpatient encounter",
                  },
                },
                type: [
                  {
                    text: {
                      value: "OutPatient",
                    },
                  },
                ],
                subject: {
                  reference: {
                    value: "Patient/1",
                  },
                },
                participant: [
                  {
                    individual: {
                      reference: {
                        value: "Practitioner/30164",
                      },
                      display: {
                        value: "Dr John Doe",
                      },
                    },
                  },
                ],
                period: {
                  start: {
                    value: "2023-09-12T03:34:10.054+00:00",
                  },
                  end: {
                    value: "2023-09-13T09:34:10.054+00:00",
                  },
                },
                text: {
                  status: {
                    value: "generated",
                  },
                  div: {
                    value:
                      '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                  },
                },
                id: {
                  value: "3",
                },
                meta: {
                  versionId: {
                    value: "1",
                  },
                  lastUpdated: {
                    value: "2021-10-13T03:34:10.160+00:00",
                  },
                  source: {
                    value: "#nEcAkGd8PRwPP5fA",
                  },
                },
              },
            ],
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "num",
            localId: "46",
            final: "NA",
            relevance: "NA",
            raw: [
              {
                status: {
                  value: "finished",
                },
                class: {
                  system: {
                    value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                  },
                  code: {
                    value: "IMP",
                  },
                  display: {
                    value: "inpatient encounter",
                  },
                },
                type: [
                  {
                    text: {
                      value: "OutPatient",
                    },
                  },
                ],
                subject: {
                  reference: {
                    value: "Patient/1",
                  },
                },
                participant: [
                  {
                    individual: {
                      reference: {
                        value: "Practitioner/30164",
                      },
                      display: {
                        value: "Dr John Doe",
                      },
                    },
                  },
                ],
                period: {
                  start: {
                    value: "2023-09-12T03:34:10.054+00:00",
                  },
                  end: {
                    value: "2023-09-13T09:34:10.054+00:00",
                  },
                },
                text: {
                  status: {
                    value: "generated",
                  },
                  div: {
                    value:
                      '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                  },
                },
                id: {
                  value: "3",
                },
                meta: {
                  versionId: {
                    value: "1",
                  },
                  lastUpdated: {
                    value: "2021-10-13T03:34:10.160+00:00",
                  },
                  source: {
                    value: "#nEcAkGd8PRwPP5fA",
                  },
                },
              },
            ],
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolIpp",
            localId: "56",
            final: "TRUE",
            relevance: "TRUE",
            raw: true,
            pretty: "true",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolIpp2",
            localId: "71",
            final: "TRUE",
            relevance: "TRUE",
            raw: true,
            pretty: "true",
          },
          {
            libraryName: "FqmT1",
            statementName: "mPop",
            localId: "86",
            final: "NA",
            relevance: "NA",
            raw: true,
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolDenom",
            localId: "88",
            final: "TRUE",
            relevance: "TRUE",
            raw: true,
            pretty: "true",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolNum",
            localId: "90",
            final: "TRUE",
            relevance: "TRUE",
            raw: true,
            pretty: "true",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolIppZ",
            localId: "95",
            final: "NA",
            relevance: "NA",
            raw: true,
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolDenomZ",
            localId: "111",
            final: "NA",
            relevance: "NA",
            raw: true,
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolNumZ",
            localId: "120",
            final: "NA",
            relevance: "NA",
            raw: true,
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "fun",
            localId: "123",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolFunc",
            localId: "125",
            final: "FALSE",
            relevance: "TRUE",
            pretty: "FUNCTION",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolFunc2",
            localId: "127",
            final: "FALSE",
            relevance: "TRUE",
            pretty: "FUNCTION",
          },
          {
            libraryName: "FqmT1",
            statementName: "daysObs",
            localId: "132",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "hoursObs",
            localId: "137",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_daysObs_denom",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_daysObs_num",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_daysObs_denom",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_hoursObs_num",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_boolFunc2",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_boolFunc",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_boolFunc2",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_boolFunc",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
        ] as unknown as StatementResult[],
        populationResults: [
          {
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "boolIpp",
            result: true,
            populationId: "3c710d76-d5d2-4dc0-a3fb-28fdac1055d0",
          },
          {
            populationType: FqmPopulationType.DENOM,
            criteriaExpression: "boolDenom",
            result: true,
            populationId: "760758ae-009f-49b2-b7a3-c9997ac3931d",
          },
          {
            populationType: FqmPopulationType.NUMER,
            criteriaExpression: "boolNum",
            result: true,
            populationId: "77e217d6-03dd-41ca-a1c3-f679933f9dd7",
          },
          {
            populationType: FqmPopulationType.OBSERV,
            criteriaExpression: "boolFunc2",
            result: true,
            populationId: "536dbb4e-9032-414c-b7e7-048f5c8fb4ab",
            criteriaReferenceId: "77e217d6-03dd-41ca-a1c3-f679933f9dd7",
            observations: [14],
          },
          {
            populationType: FqmPopulationType.OBSERV,
            criteriaExpression: "boolFunc",
            result: true,
            populationId: "7cfae29e-e9cc-4958-89de-a9dde443186f",
            criteriaReferenceId: "760758ae-009f-49b2-b7a3-c9997ac3931d",
            observations: [1],
          },
        ],
        populationRelevance: [
          {
            populationId: "3c710d76-d5d2-4dc0-a3fb-28fdac1055d0",
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "boolIpp",
            result: true,
          },
          {
            populationId: "760758ae-009f-49b2-b7a3-c9997ac3931d",
            populationType: FqmPopulationType.DENOM,
            criteriaExpression: "boolDenom",
            result: true,
          },
          {
            populationId: "77e217d6-03dd-41ca-a1c3-f679933f9dd7",
            populationType: FqmPopulationType.NUMER,
            criteriaExpression: "boolNum",
            result: true,
          },
          {
            populationId: "536dbb4e-9032-414c-b7e7-048f5c8fb4ab",
            criteriaReferenceId: "77e217d6-03dd-41ca-a1c3-f679933f9dd7",
            populationType: FqmPopulationType.OBSERV,
            criteriaExpression: "boolFunc2",
            result: true,
          },
          {
            populationId: "7cfae29e-e9cc-4958-89de-a9dde443186f",
            criteriaReferenceId: "760758ae-009f-49b2-b7a3-c9997ac3931d",
            populationType: FqmPopulationType.OBSERV,
            criteriaExpression: "boolFunc",
            result: true,
          },
        ],
        clauseResults: [],
        html: '<div><h2>Population Group: 63879ae21b05491a43ce8a12</h2><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">\n<code>\n<span data-ref-id="56" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>define &quot;boolIpp&quot;:\n  </span><span data-ref-id="55" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>exists </span><span data-ref-id="54" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span><span data-ref-id="48" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="47" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="47" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>[&quot;Encounter&quot;]</span></span></span><span> E</span></span></span><span> </span><span data-ref-id="53" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>where </span><span data-ref-id="53" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="51" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="50" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="49" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>E</span></span><span>.</span><span data-ref-id="50" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>period</span></span></span><span>.</span><span data-ref-id="51" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>start</span></span></span><span data-ref-id="53" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"> during </span><span data-ref-id="52" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>&quot;Measurement Period&quot;</span></span></span></span></span></span></span></code>\n</pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">\n<code>\n<span data-ref-id="71" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>define &quot;boolIpp2&quot;:\n  </span><span data-ref-id="70" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>exists </span><span data-ref-id="69" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span><span data-ref-id="58" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="57" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="57" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>[&quot;Encounter&quot;]</span></span></span><span> E</span></span></span><span> </span><span data-ref-id="68" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>where </span><span data-ref-id="68" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="63" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="61" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="60" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="59" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>E</span></span><span>.</span><span data-ref-id="60" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>period</span></span></span><span>.</span><span data-ref-id="61" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>start</span></span></span><span data-ref-id="63" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"> during </span><span data-ref-id="62" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>&quot;Measurement Period&quot;</span></span></span><span> and </span><span data-ref-id="67" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="65" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span data-ref-id="64" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>E</span></span><span>.</span><span data-ref-id="65" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>status</span></span></span><span> &#x3D; </span><span data-ref-id="66" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>&#x27;finished&#x27;</span></span></span></span></span></span></span></span></code>\n</pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">\n<code>\n<span data-ref-id="88" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>define &quot;boolDenom&quot;:\n  </span><span data-ref-id="87" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>&quot;boolIpp2&quot;</span></span></span></code>\n</pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">\n<code>\n<span data-ref-id="90" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>define &quot;boolNum&quot;:\n  </span><span data-ref-id="89" style="background-color:#ccebe0;color:#20744c;border-bottom-color:#20744c;border-bottom-style:solid"><span>&quot;boolIpp2&quot;</span></span></span></code>\n</pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">\n<code>\n<span data-ref-id="125" style=""><span>define function boolFunc():\n  </span><span data-ref-id="124" style=""><span data-ref-id="124" style="">1</span></span></span></code>\n</pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">\n<code>\n<span data-ref-id="127" style=""><span>define function boolFunc2():\n  </span><span data-ref-id="126" style=""><span data-ref-id="126" style="">14</span></span></span></code>\n</pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">\n<code>\n<span data-ref-id="719" style=""><span>define function ToString(value </span><span data-ref-id="716" style=""><span>AccountStatus</span></span><span>): </span><span data-ref-id="718" style=""><span data-ref-id="718" style=""><span data-ref-id="717" style=""><span>value</span></span><span>.</span><span data-ref-id="718" style=""><span>value</span></span></span></span></span></code>\n</pre><pre style="tab-size: 2; border-bottom-width: 4px; line-height: 1.4">\n<code>\n<span data-ref-id="1719" style=""><span>define function ToDateTime(value </span><span data-ref-id="1716" style=""><span>dateTime</span></span><span>): </span><span data-ref-id="1718" style=""><span data-ref-id="1718" style=""><span data-ref-id="1717" style=""><span>value</span></span><span>.</span><span data-ref-id="1718" style=""><span>value</span></span></span></span></span></code>\n</pre></div>',
      },
    ],
  };

export const Ratio_Encounter_SingleIP_DenObs_NumObs_Pass: TestCaseProcessingScenario =
  {
    measureGroups: [
      {
        id: "63879a071b05491a43ce8a10",
        scoring: "Ratio",
        populations: [
          {
            id: "8d8b74ce-a843-4039-ad94-acad42cac257",
            name: PopulationType.INITIAL_POPULATION,
            definition: "ipp",
            description: null,
          },
          {
            id: "abce9253-30f1-438c-b370-30a264791b21",
            name: PopulationType.DENOMINATOR,
            definition: "denom",
            associationType: null,
            description: null,
          },
          {
            id: "e1542f9f-7c5b-40ea-9feb-2d920d343f39",
            name: PopulationType.DENOMINATOR_EXCLUSION,
            definition: "",
            associationType: null,
            description: null,
          },
          {
            id: "51122f75-851f-428c-938c-1d512da1fe7f",
            name: PopulationType.NUMERATOR,
            definition: "num",
            associationType: null,
            description: null,
          },
          {
            id: "2cf3f052-9ba0-450d-a80e-1a823de962f8",
            name: PopulationType.NUMERATOR_EXCLUSION,
            definition: "",
            associationType: null,
            description: null,
          },
        ],
        measureObservations: [
          {
            id: "c6a2203f-ab34-4f0f-899d-a73467440bbd",
            definition: "daysObs",
            criteriaReference: "abce9253-30f1-438c-b370-30a264791b21",
            aggregateMethod: AggregateFunctionType.COUNT,
          },
          {
            id: "8dcfe0df-d386-43c1-a8c8-d8f84f13c6d1",
            definition: "daysObs",
            criteriaReference: "51122f75-851f-428c-938c-1d512da1fe7f",
            aggregateMethod: AggregateFunctionType.COUNT,
          },
        ],
        groupDescription: "",
        improvementNotation: "",
        rateAggregation: "",
        measureGroupTypes: [MeasureGroupTypes.OUTCOME],
        scoringUnit: "",
        stratifications: [],
        populationBasis: "Encounter",
      },
    ],
    testCase: {
      id: "63879d521b05491a43ce8a14",
      name: null,
      title: "TC1",
      series: "",
      description: "",
      createdAt: "2022-11-30T18:13:38.789Z",
      createdBy: "nate.moraca@semanticbits.com",
      lastModifiedAt: "2022-11-30T19:00:34.449Z",
      lastModifiedBy: "nate.moraca@semanticbits.com",
      validResource: true,
      executionStatus: null,
      json: '{\n  "resourceType": "Bundle",\n  "id": "2106",\n  "meta": {\n    "versionId": "1",\n    "lastUpdated": "2022-09-06T20:47:21.183+00:00"\n  },\n  "type": "collection",\n  "entry": [ {\n    "fullUrl": "http://local/Encounter/2",\n    "resource": { \n      "id": "2", \n      "resourceType": "Encounter",\n      "meta": {\n        "versionId": "1",\n        "lastUpdated": "2021-10-13T03:34:10.160+00:00",\n        "source": "#nEcAkGd8PRwPP5fA"\n      },\n      "text": {\n        "status": "generated",\n        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>"\n      },\n      "class": {\n        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n        "code": "IMP",\n        "display": "inpatient encounter"\n      },\n      "status": "planned",\n      "type": [ {\n        "text": "OutPatient"\n      } ],\n      "subject": {\n        "reference": "Patient/1"\n      },\n      "participant": [ {\n        "individual": {\n          "reference": "Practitioner/30164",\n          "display": "Dr John Doe"\n        }\n      } ],\n      "period": {\n        "start": "2023-08-10T03:34:10.054Z",\n        "end": "2023-08-15T03:34:10.054Z"\n      }\n    }\n  }, {\n    "fullUrl": "http://local/Encounter/3",\n    "resource": {\n      "id": "3",\n      "resourceType": "Encounter",\n      "meta": {\n        "versionId": "1",\n        "lastUpdated": "2021-10-13T03:34:10.160+00:00",\n        "source": "#nEcAkGd8PRwPP5fA"\n      },\n      "text": { \n        "status": "generated",\n        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Sep 9th 2021 for Asthma<a name=\\"mm\\"/></div>"\n      },\n      "class": {\n        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",\n        "code": "IMP",\n        "display": "inpatient encounter"\n      },\n      "status": "finished",\n      "type": [ {\n        "text": "OutPatient"\n      } ],\n      "subject": {\n        "reference": "Patient/1"\n      },\n      "participant": [ {\n        "individual": {\n          "reference": "Practitioner/30164",\n          "display": "Dr John Doe"\n        }\n      } ],\n      "period": {\n        "start": "2023-09-12T03:34:10.054Z",\n        "end": "2023-09-13T09:34:10.054Z"\n      }\n    }\n  }, {\n    "fullUrl": "http://local/Patient/1",\n    "resource": {\n      "id": "1",\n      "resourceType": "Patient",\n      "text": {\n        "status": "generated",\n        "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">Lizzy Health</div>"\n      },\n      "meta": {\n        "profile": "http://hl7.org/fhir/us/qicore/StructureDefinition/qicore-patient"\n      },\n      "identifier": [ {\n        "system": "http://clinfhir.com/fhir/NamingSystem/identifier",\n        "value": "20181011LizzyHealth"\n      } ],\n      "name": [ {\n        "use": "official",\n        "text": "Lizzy Health",\n        "family": "Health",\n        "given": [ "Lizzy" ]\n      } ],\n      "gender": "female",\n      "birthDate": "2000-10-11"\n    }\n  } ]\n\n}\n',
      hapiOperationOutcome: null,
      groupPopulations: [
        {
          groupId: "63879a071b05491a43ce8a10",
          scoring: "Ratio",
          populationBasis: "Encounter",
          populationValues: [
            {
              id: "8d8b74ce-a843-4039-ad94-acad42cac257",
              criteriaReference: null,
              name: "initialPopulation",
              expected: 2,
            },
            {
              id: "abce9253-30f1-438c-b370-30a264791b21",
              criteriaReference: null,
              name: "denominator",
              expected: 2,
            },
            {
              id: "denominatorObservation0",
              criteriaReference: "abce9253-30f1-438c-b370-30a264791b21",
              name: "denominatorObservation",
              expected: 1,
            },
            {
              id: "denominatorObservation1",
              criteriaReference: "abce9253-30f1-438c-b370-30a264791b21",
              name: "denominatorObservation",
              expected: 0,
            },
            {
              id: "51122f75-851f-428c-938c-1d512da1fe7f",
              criteriaReference: null,
              name: "numerator",
              expected: 1,
            },
            {
              id: "numeratorObservation0",
              criteriaReference: "51122f75-851f-428c-938c-1d512da1fe7f",
              name: "numeratorObservation",
              expected: 1,
            },
          ],
          stratificationValues: [],
        },
      ],
    },
    populationGroupResults: [
      {
        groupId: "63879a071b05491a43ce8a10",
        episodeResults: [
          {
            episodeId: "2",
            populationResults: [
              {
                populationType: FqmPopulationType.IPP,
                criteriaExpression: "ipp",
                result: true,
                populationId: "8d8b74ce-a843-4039-ad94-acad42cac257",
              },
              {
                populationType: FqmPopulationType.DENOM,
                criteriaExpression: "denom",
                result: true,
                populationId: "abce9253-30f1-438c-b370-30a264791b21",
              },
              {
                populationType: FqmPopulationType.DENEX,
                result: false,
                populationId: "e1542f9f-7c5b-40ea-9feb-2d920d343f39",
              },
              {
                populationType: FqmPopulationType.NUMER,
                criteriaExpression: "num",
                result: false,
                populationId: "51122f75-851f-428c-938c-1d512da1fe7f",
              },
              {
                populationType: FqmPopulationType.NUMEX,
                result: false,
                populationId: "2cf3f052-9ba0-450d-a80e-1a823de962f8",
              },
              {
                populationType: FqmPopulationType.OBSERV,
                criteriaExpression: "daysObs",
                result: false,
                populationId: "c6a2203f-ab34-4f0f-899d-a73467440bbd",
                criteriaReferenceId: "abce9253-30f1-438c-b370-30a264791b21",
                observations: null,
              },
              {
                populationType: FqmPopulationType.OBSERV,
                criteriaExpression: "daysObs",
                result: false,
                populationId: "8dcfe0df-d386-43c1-a8c8-d8f84f13c6d1",
                criteriaReferenceId: "51122f75-851f-428c-938c-1d512da1fe7f",
              },
            ],
          },
          {
            episodeId: "3",
            populationResults: [
              {
                populationType: FqmPopulationType.IPP,
                criteriaExpression: "ipp",
                result: true,
                populationId: "8d8b74ce-a843-4039-ad94-acad42cac257",
              },
              {
                populationType: FqmPopulationType.DENOM,
                criteriaExpression: "denom",
                result: true,
                populationId: "abce9253-30f1-438c-b370-30a264791b21",
              },
              {
                populationType: FqmPopulationType.DENEX,
                result: false,
                populationId: "e1542f9f-7c5b-40ea-9feb-2d920d343f39",
              },
              {
                populationType: FqmPopulationType.NUMER,
                criteriaExpression: "num",
                result: true,
                populationId: "51122f75-851f-428c-938c-1d512da1fe7f",
              },
              {
                populationType: FqmPopulationType.NUMEX,
                result: false,
                populationId: "2cf3f052-9ba0-450d-a80e-1a823de962f8",
              },
              {
                populationType: FqmPopulationType.OBSERV,
                criteriaExpression: "daysObs",
                result: true,
                populationId: "c6a2203f-ab34-4f0f-899d-a73467440bbd",
                criteriaReferenceId: "abce9253-30f1-438c-b370-30a264791b21",
                observations: [1, 1],
              },
              {
                populationType: FqmPopulationType.OBSERV,
                criteriaExpression: "daysObs",
                result: false,
                populationId: "8dcfe0df-d386-43c1-a8c8-d8f84f13c6d1",
                criteriaReferenceId: "51122f75-851f-428c-938c-1d512da1fe7f",
              },
            ],
          },
        ],
        populationRelevance: [
          {
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "ipp",
            result: true,
            populationId: "8d8b74ce-a843-4039-ad94-acad42cac257",
          },
          {
            populationType: FqmPopulationType.DENOM,
            criteriaExpression: "denom",
            result: true,
            populationId: "abce9253-30f1-438c-b370-30a264791b21",
          },
          {
            populationType: FqmPopulationType.DENEX,
            result: true,
            populationId: "e1542f9f-7c5b-40ea-9feb-2d920d343f39",
          },
          {
            populationType: FqmPopulationType.NUMER,
            criteriaExpression: "num",
            result: true,
            populationId: "51122f75-851f-428c-938c-1d512da1fe7f",
          },
          {
            populationType: FqmPopulationType.NUMEX,
            result: true,
            populationId: "2cf3f052-9ba0-450d-a80e-1a823de962f8",
          },
          {
            populationType: FqmPopulationType.OBSERV,
            criteriaExpression: "daysObs",
            result: true,
            populationId: "c6a2203f-ab34-4f0f-899d-a73467440bbd",
            criteriaReferenceId: "abce9253-30f1-438c-b370-30a264791b21",
          },
          {
            populationType: FqmPopulationType.OBSERV,
            criteriaExpression: "daysObs",
            result: true,
            populationId: "c6a2203f-ab34-4f0f-899d-a73467440bbd",
            criteriaReferenceId: "abce9253-30f1-438c-b370-30a264791b21",
          },
        ],
        populationResults: [
          {
            populationType: FqmPopulationType.IPP,
            criteriaExpression: "ipp",
            result: true,
            populationId: "8d8b74ce-a843-4039-ad94-acad42cac257",
          },
          {
            populationType: FqmPopulationType.DENOM,
            criteriaExpression: "denom",
            result: true,
            populationId: "abce9253-30f1-438c-b370-30a264791b21",
          },
          {
            populationType: FqmPopulationType.DENEX,
            result: false,
            populationId: "e1542f9f-7c5b-40ea-9feb-2d920d343f39",
          },
          {
            populationType: FqmPopulationType.NUMER,
            criteriaExpression: "num",
            result: true,
            populationId: "51122f75-851f-428c-938c-1d512da1fe7f",
          },
          {
            populationType: FqmPopulationType.NUMEX,
            result: false,
            populationId: "2cf3f052-9ba0-450d-a80e-1a823de962f8",
          },
          {
            populationType: FqmPopulationType.OBSERV,
            criteriaExpression: "daysObs",
            result: false,
            populationId: "c6a2203f-ab34-4f0f-899d-a73467440bbd",
            criteriaReferenceId: "abce9253-30f1-438c-b370-30a264791b21",
            observations: [1, 1],
          },
        ],
        statementResults: [
          {
            libraryName: "FqmT1",
            statementName: "Patient",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "ipp",
            localId: "14",
            final: "TRUE",
            relevance: "TRUE",
            raw: [
              {
                status: {
                  value: "planned",
                },
                class: {
                  system: {
                    value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                  },
                  code: {
                    value: "IMP",
                  },
                  display: {
                    value: "inpatient encounter",
                  },
                },
                type: [
                  {
                    text: {
                      value: "OutPatient",
                    },
                  },
                ],
                subject: {
                  reference: {
                    value: "Patient/1",
                  },
                },
                participant: [
                  {
                    individual: {
                      reference: {
                        value: "Practitioner/30164",
                      },
                      display: {
                        value: "Dr John Doe",
                      },
                    },
                  },
                ],
                period: {
                  start: {
                    value: "2023-08-10T03:34:10.054+00:00",
                  },
                  end: {
                    value: "2023-08-15T03:34:10.054+00:00",
                  },
                },
                text: {
                  status: {
                    value: "generated",
                  },
                  div: {
                    value:
                      '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                  },
                },
                id: {
                  value: "2",
                },
                meta: {
                  versionId: {
                    value: "1",
                  },
                  lastUpdated: {
                    value: "2021-10-13T03:34:10.160+00:00",
                  },
                  source: {
                    value: "#nEcAkGd8PRwPP5fA",
                  },
                },
              },
              {
                status: {
                  value: "finished",
                },
                class: {
                  system: {
                    value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                  },
                  code: {
                    value: "IMP",
                  },
                  display: {
                    value: "inpatient encounter",
                  },
                },
                type: [
                  {
                    text: {
                      value: "OutPatient",
                    },
                  },
                ],
                subject: {
                  reference: {
                    value: "Patient/1",
                  },
                },
                participant: [
                  {
                    individual: {
                      reference: {
                        value: "Practitioner/30164",
                      },
                      display: {
                        value: "Dr John Doe",
                      },
                    },
                  },
                ],
                period: {
                  start: {
                    value: "2023-09-12T03:34:10.054+00:00",
                  },
                  end: {
                    value: "2023-09-13T09:34:10.054+00:00",
                  },
                },
                text: {
                  status: {
                    value: "generated",
                  },
                  div: {
                    value:
                      '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                  },
                },
                id: {
                  value: "3",
                },
                meta: {
                  versionId: {
                    value: "1",
                  },
                  lastUpdated: {
                    value: "2021-10-13T03:34:10.160+00:00",
                  },
                  source: {
                    value: "#nEcAkGd8PRwPP5fA",
                  },
                },
              },
            ],
            pretty:
              '[{\n  account: null,\n  appointment: null,\n  basedOn: null,\n  class: {\n    code: {\n      extension: null,\n      id: null,\n      value: "IMP"\n    },\n    display: {\n      extension: null,\n      id: null,\n      value: "inpatient encounter"\n    },\n    extension: null,\n    id: null,\n    system: {\n      extension: null,\n      id: null,\n      value: "http://terminology.hl7.org/CodeSystem/v3-ActCode"\n    },\n    userSelected: null,\n    version: null\n  },\n  classHistory: null,\n  contained: null,\n  diagnosis: null,\n  episodeOfCare: null,\n  extension: null,\n  hospitalization: null,\n  id: {\n    extension: null,\n    id: null,\n    value: "2"\n  },\n  identifier: null,\n  implicitRules: null,\n  language: null,\n  length: null,\n  location: null,\n  meta: {\n    extension: null,\n    id: null,\n    lastUpdated: {\n      extension: null,\n      id: null,\n      value: 10/13/2021 3:34 AM\n    },\n    profile: null,\n    security: null,\n    source: {\n      extension: null,\n      id: null,\n      value: "#nEcAkGd8PRwPP5fA"\n    },\n    tag: null,\n    versionId: {\n      extension: null,\n      id: null,\n      value: "1"\n    }\n  },\n  modifierExtension: null,\n  partOf: null,\n  participant: [{\n    extension: null,\n    id: null,\n    individual: {\n      display: {\n        extension: null,\n        id: null,\n        value: "Dr John Doe"\n      },\n      extension: null,\n      id: null,\n      identifier: null,\n      reference: {\n        extension: null,\n        id: null,\n        value: "Practitioner/30164"\n      },\n      type: null\n    },\n    modifierExtension: null,\n    period: null,\n    type: null\n  }],\n  period: {\n    end: {\n      extension: null,\n      id: null,\n      value: 08/15/2023 3:34 AM\n    },\n    extension: null,\n    id: null,\n    start: {\n      extension: null,\n      id: null,\n      value: 08/10/2023 3:34 AM\n    }\n  },\n  priority: null,\n  reasonCode: null,\n  reasonReference: null,\n  serviceProvider: null,\n  serviceType: null,\n  status: {\n    extension: null,\n    id: null,\n    value: "planned"\n  },\n  statusHistory: null,\n  subject: {\n    display: null,\n    extension: null,\n    id: null,\n    identifier: null,\n    reference: {\n      extension: null,\n      id: null,\n      value: "Patient/1"\n    },\n    type: null\n  },\n  text: {\n    div: {\n      extension: null,\n      id: null,\n      value: "<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>"\n    },\n    extension: null,\n    id: null,\n    status: {\n      extension: null,\n      id: null,\n      value: "generated"\n    }\n  },\n  type: [{\n    coding: null,\n    extension: null,\n    id: null,\n    text: {\n      extension: null,\n      id: null,\n      value: "OutPatient"\n    }\n  }]\n},\n{\n  account: null,\n  appointment: null,\n  basedOn: null,\n  class: {\n    code: {\n      extension: null,\n      id: null,\n      value: "IMP"\n    },\n    display: {\n      extension: null,\n      id: null,\n      value: "inpatient encounter"\n    },\n    extension: null,\n    id: null,\n    system: {\n      extension: null,\n      id: null,\n      value: "http://terminology.hl7.org/CodeSystem/v3-ActCode"\n    },\n    userSelected: null,\n    version: null\n  },\n  classHistory: null,\n  contained: null,\n  diagnosis: null,\n  episodeOfCare: null,\n  extension: null,\n  hospitalization: null,\n  id: {\n    extension: null,\n    id: null,\n    value: "3"\n  },\n  identifier: null,\n  implicitRules: null,\n  language: null,\n  length: null,\n  location: null,\n  meta: {\n    extension: null,\n    id: null,\n    lastUpdated: {\n      extension: null,\n      id: null,\n      value: 10/13/2021 3:34 AM\n    },\n    profile: null,\n    security: null,\n    source: {\n      extension: null,\n      id: null,\n      value: "#nEcAkGd8PRwPP5fA"\n    },\n    tag: null,\n    versionId: {\n      extension: null,\n      id: null,\n      value: "1"\n    }\n  },\n  modifierExtension: null,\n  partOf: null,\n  participant: [{\n    extension: null,\n    id: null,\n    individual: {\n      display: {\n        extension: null,\n        id: null,\n        value: "Dr John Doe"\n      },\n      extension: null,\n      id: null,\n      identifier: null,\n      reference: {\n        extension: null,\n        id: null,\n        value: "Practitioner/30164"\n      },\n      type: null\n    },\n    modifierExtension: null,\n    period: null,\n    type: null\n  }],\n  period: {\n    end: {\n      extension: null,\n      id: null,\n      value: 09/13/2023 9:34 AM\n    },\n    extension: null,\n    id: null,\n    start: {\n      extension: null,\n      id: null,\n      value: 09/12/2023 3:34 AM\n    }\n  },\n  priority: null,\n  reasonCode: null,\n  reasonReference: null,\n  serviceProvider: null,\n  serviceType: null,\n  status: {\n    extension: null,\n    id: null,\n    value: "finished"\n  },\n  statusHistory: null,\n  subject: {\n    display: null,\n    extension: null,\n    id: null,\n    identifier: null,\n    reference: {\n      extension: null,\n      id: null,\n      value: "Patient/1"\n    },\n    type: null\n  },\n  text: {\n    div: {\n      extension: null,\n      id: null,\n      value: "<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>"\n    },\n    extension: null,\n    id: null,\n    status: {\n      extension: null,\n      id: null,\n      value: "generated"\n    }\n  },\n  type: [{\n    coding: null,\n    extension: null,\n    id: null,\n    text: {\n      extension: null,\n      id: null,\n      value: "OutPatient"\n    }\n  }]\n}]',
          },
          {
            libraryName: "FqmT1",
            statementName: "ipp2",
            localId: "28",
            final: "TRUE",
            relevance: "TRUE",
            raw: [
              {
                status: {
                  value: "finished",
                },
                class: {
                  system: {
                    value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                  },
                  code: {
                    value: "IMP",
                  },
                  display: {
                    value: "inpatient encounter",
                  },
                },
                type: [
                  {
                    text: {
                      value: "OutPatient",
                    },
                  },
                ],
                subject: {
                  reference: {
                    value: "Patient/1",
                  },
                },
                participant: [
                  {
                    individual: {
                      reference: {
                        value: "Practitioner/30164",
                      },
                      display: {
                        value: "Dr John Doe",
                      },
                    },
                  },
                ],
                period: {
                  start: {
                    value: "2023-09-12T03:34:10.054+00:00",
                  },
                  end: {
                    value: "2023-09-13T09:34:10.054+00:00",
                  },
                },
                text: {
                  status: {
                    value: "generated",
                  },
                  div: {
                    value:
                      '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                  },
                },
                id: {
                  value: "3",
                },
                meta: {
                  versionId: {
                    value: "1",
                  },
                  lastUpdated: {
                    value: "2021-10-13T03:34:10.160+00:00",
                  },
                  source: {
                    value: "#nEcAkGd8PRwPP5fA",
                  },
                },
              },
            ],
            pretty:
              '[{\n  account: null,\n  appointment: null,\n  basedOn: null,\n  class: {\n    code: {\n      extension: null,\n      id: null,\n      value: "IMP"\n    },\n    display: {\n      extension: null,\n      id: null,\n      value: "inpatient encounter"\n    },\n    extension: null,\n    id: null,\n    system: {\n      extension: null,\n      id: null,\n      value: "http://terminology.hl7.org/CodeSystem/v3-ActCode"\n    },\n    userSelected: null,\n    version: null\n  },\n  classHistory: null,\n  contained: null,\n  diagnosis: null,\n  episodeOfCare: null,\n  extension: null,\n  hospitalization: null,\n  id: {\n    extension: null,\n    id: null,\n    value: "3"\n  },\n  identifier: null,\n  implicitRules: null,\n  language: null,\n  length: null,\n  location: null,\n  meta: {\n    extension: null,\n    id: null,\n    lastUpdated: {\n      extension: null,\n      id: null,\n      value: 10/13/2021 3:34 AM\n    },\n    profile: null,\n    security: null,\n    source: {\n      extension: null,\n      id: null,\n      value: "#nEcAkGd8PRwPP5fA"\n    },\n    tag: null,\n    versionId: {\n      extension: null,\n      id: null,\n      value: "1"\n    }\n  },\n  modifierExtension: null,\n  partOf: null,\n  participant: [{\n    extension: null,\n    id: null,\n    individual: {\n      display: {\n        extension: null,\n        id: null,\n        value: "Dr John Doe"\n      },\n      extension: null,\n      id: null,\n      identifier: null,\n      reference: {\n        extension: null,\n        id: null,\n        value: "Practitioner/30164"\n      },\n      type: null\n    },\n    modifierExtension: null,\n    period: null,\n    type: null\n  }],\n  period: {\n    end: {\n      extension: null,\n      id: null,\n      value: 09/13/2023 9:34 AM\n    },\n    extension: null,\n    id: null,\n    start: {\n      extension: null,\n      id: null,\n      value: 09/12/2023 3:34 AM\n    }\n  },\n  priority: null,\n  reasonCode: null,\n  reasonReference: null,\n  serviceProvider: null,\n  serviceType: null,\n  status: {\n    extension: null,\n    id: null,\n    value: "finished"\n  },\n  statusHistory: null,\n  subject: {\n    display: null,\n    extension: null,\n    id: null,\n    identifier: null,\n    reference: {\n      extension: null,\n      id: null,\n      value: "Patient/1"\n    },\n    type: null\n  },\n  text: {\n    div: {\n      extension: null,\n      id: null,\n      value: "<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>"\n    },\n    extension: null,\n    id: null,\n    status: {\n      extension: null,\n      id: null,\n      value: "generated"\n    }\n  },\n  type: [{\n    coding: null,\n    extension: null,\n    id: null,\n    text: {\n      extension: null,\n      id: null,\n      value: "OutPatient"\n    }\n  }]\n}]',
          },
          {
            libraryName: "FqmT1",
            statementName: "ex",
            localId: "42",
            final: "NA",
            relevance: "NA",
            raw: [
              {
                status: {
                  value: "finished",
                },
                class: {
                  system: {
                    value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                  },
                  code: {
                    value: "IMP",
                  },
                  display: {
                    value: "inpatient encounter",
                  },
                },
                type: [
                  {
                    text: {
                      value: "OutPatient",
                    },
                  },
                ],
                subject: {
                  reference: {
                    value: "Patient/1",
                  },
                },
                participant: [
                  {
                    individual: {
                      reference: {
                        value: "Practitioner/30164",
                      },
                      display: {
                        value: "Dr John Doe",
                      },
                    },
                  },
                ],
                period: {
                  start: {
                    value: "2023-09-12T03:34:10.054+00:00",
                  },
                  end: {
                    value: "2023-09-13T09:34:10.054+00:00",
                  },
                },
                text: {
                  status: {
                    value: "generated",
                  },
                  div: {
                    value:
                      '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                  },
                },
                id: {
                  value: "3",
                },
                meta: {
                  versionId: {
                    value: "1",
                  },
                  lastUpdated: {
                    value: "2021-10-13T03:34:10.160+00:00",
                  },
                  source: {
                    value: "#nEcAkGd8PRwPP5fA",
                  },
                },
              },
            ],
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "denom",
            localId: "44",
            final: "TRUE",
            relevance: "TRUE",
            raw: [
              {
                status: {
                  value: "planned",
                },
                class: {
                  system: {
                    value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                  },
                  code: {
                    value: "IMP",
                  },
                  display: {
                    value: "inpatient encounter",
                  },
                },
                type: [
                  {
                    text: {
                      value: "OutPatient",
                    },
                  },
                ],
                subject: {
                  reference: {
                    value: "Patient/1",
                  },
                },
                participant: [
                  {
                    individual: {
                      reference: {
                        value: "Practitioner/30164",
                      },
                      display: {
                        value: "Dr John Doe",
                      },
                    },
                  },
                ],
                period: {
                  start: {
                    value: "2023-08-10T03:34:10.054+00:00",
                  },
                  end: {
                    value: "2023-08-15T03:34:10.054+00:00",
                  },
                },
                text: {
                  status: {
                    value: "generated",
                  },
                  div: {
                    value:
                      '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                  },
                },
                id: {
                  value: "2",
                },
                meta: {
                  versionId: {
                    value: "1",
                  },
                  lastUpdated: {
                    value: "2021-10-13T03:34:10.160+00:00",
                  },
                  source: {
                    value: "#nEcAkGd8PRwPP5fA",
                  },
                },
              },
              {
                status: {
                  value: "finished",
                },
                class: {
                  system: {
                    value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                  },
                  code: {
                    value: "IMP",
                  },
                  display: {
                    value: "inpatient encounter",
                  },
                },
                type: [
                  {
                    text: {
                      value: "OutPatient",
                    },
                  },
                ],
                subject: {
                  reference: {
                    value: "Patient/1",
                  },
                },
                participant: [
                  {
                    individual: {
                      reference: {
                        value: "Practitioner/30164",
                      },
                      display: {
                        value: "Dr John Doe",
                      },
                    },
                  },
                ],
                period: {
                  start: {
                    value: "2023-09-12T03:34:10.054+00:00",
                  },
                  end: {
                    value: "2023-09-13T09:34:10.054+00:00",
                  },
                },
                text: {
                  status: {
                    value: "generated",
                  },
                  div: {
                    value:
                      '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                  },
                },
                id: {
                  value: "3",
                },
                meta: {
                  versionId: {
                    value: "1",
                  },
                  lastUpdated: {
                    value: "2021-10-13T03:34:10.160+00:00",
                  },
                  source: {
                    value: "#nEcAkGd8PRwPP5fA",
                  },
                },
              },
            ],
            pretty:
              '[{\n  account: null,\n  appointment: null,\n  basedOn: null,\n  class: {\n    code: {\n      extension: null,\n      id: null,\n      value: "IMP"\n    },\n    display: {\n      extension: null,\n      id: null,\n      value: "inpatient encounter"\n    },\n    extension: null,\n    id: null,\n    system: {\n      extension: null,\n      id: null,\n      value: "http://terminology.hl7.org/CodeSystem/v3-ActCode"\n    },\n    userSelected: null,\n    version: null\n  },\n  classHistory: null,\n  contained: null,\n  diagnosis: null,\n  episodeOfCare: null,\n  extension: null,\n  hospitalization: null,\n  id: {\n    extension: null,\n    id: null,\n    value: "2"\n  },\n  identifier: null,\n  implicitRules: null,\n  language: null,\n  length: null,\n  location: null,\n  meta: {\n    extension: null,\n    id: null,\n    lastUpdated: {\n      extension: null,\n      id: null,\n      value: 10/13/2021 3:34 AM\n    },\n    profile: null,\n    security: null,\n    source: {\n      extension: null,\n      id: null,\n      value: "#nEcAkGd8PRwPP5fA"\n    },\n    tag: null,\n    versionId: {\n      extension: null,\n      id: null,\n      value: "1"\n    }\n  },\n  modifierExtension: null,\n  partOf: null,\n  participant: [{\n    extension: null,\n    id: null,\n    individual: {\n      display: {\n        extension: null,\n        id: null,\n        value: "Dr John Doe"\n      },\n      extension: null,\n      id: null,\n      identifier: null,\n      reference: {\n        extension: null,\n        id: null,\n        value: "Practitioner/30164"\n      },\n      type: null\n    },\n    modifierExtension: null,\n    period: null,\n    type: null\n  }],\n  period: {\n    end: {\n      extension: null,\n      id: null,\n      value: 08/15/2023 3:34 AM\n    },\n    extension: null,\n    id: null,\n    start: {\n      extension: null,\n      id: null,\n      value: 08/10/2023 3:34 AM\n    }\n  },\n  priority: null,\n  reasonCode: null,\n  reasonReference: null,\n  serviceProvider: null,\n  serviceType: null,\n  status: {\n    extension: null,\n    id: null,\n    value: "planned"\n  },\n  statusHistory: null,\n  subject: {\n    display: null,\n    extension: null,\n    id: null,\n    identifier: null,\n    reference: {\n      extension: null,\n      id: null,\n      value: "Patient/1"\n    },\n    type: null\n  },\n  text: {\n    div: {\n      extension: null,\n      id: null,\n      value: "<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>"\n    },\n    extension: null,\n    id: null,\n    status: {\n      extension: null,\n      id: null,\n      value: "generated"\n    }\n  },\n  type: [{\n    coding: null,\n    extension: null,\n    id: null,\n    text: {\n      extension: null,\n      id: null,\n      value: "OutPatient"\n    }\n  }]\n},\n{\n  account: null,\n  appointment: null,\n  basedOn: null,\n  class: {\n    code: {\n      extension: null,\n      id: null,\n      value: "IMP"\n    },\n    display: {\n      extension: null,\n      id: null,\n      value: "inpatient encounter"\n    },\n    extension: null,\n    id: null,\n    system: {\n      extension: null,\n      id: null,\n      value: "http://terminology.hl7.org/CodeSystem/v3-ActCode"\n    },\n    userSelected: null,\n    version: null\n  },\n  classHistory: null,\n  contained: null,\n  diagnosis: null,\n  episodeOfCare: null,\n  extension: null,\n  hospitalization: null,\n  id: {\n    extension: null,\n    id: null,\n    value: "3"\n  },\n  identifier: null,\n  implicitRules: null,\n  language: null,\n  length: null,\n  location: null,\n  meta: {\n    extension: null,\n    id: null,\n    lastUpdated: {\n      extension: null,\n      id: null,\n      value: 10/13/2021 3:34 AM\n    },\n    profile: null,\n    security: null,\n    source: {\n      extension: null,\n      id: null,\n      value: "#nEcAkGd8PRwPP5fA"\n    },\n    tag: null,\n    versionId: {\n      extension: null,\n      id: null,\n      value: "1"\n    }\n  },\n  modifierExtension: null,\n  partOf: null,\n  participant: [{\n    extension: null,\n    id: null,\n    individual: {\n      display: {\n        extension: null,\n        id: null,\n        value: "Dr John Doe"\n      },\n      extension: null,\n      id: null,\n      identifier: null,\n      reference: {\n        extension: null,\n        id: null,\n        value: "Practitioner/30164"\n      },\n      type: null\n    },\n    modifierExtension: null,\n    period: null,\n    type: null\n  }],\n  period: {\n    end: {\n      extension: null,\n      id: null,\n      value: 09/13/2023 9:34 AM\n    },\n    extension: null,\n    id: null,\n    start: {\n      extension: null,\n      id: null,\n      value: 09/12/2023 3:34 AM\n    }\n  },\n  priority: null,\n  reasonCode: null,\n  reasonReference: null,\n  serviceProvider: null,\n  serviceType: null,\n  status: {\n    extension: null,\n    id: null,\n    value: "finished"\n  },\n  statusHistory: null,\n  subject: {\n    display: null,\n    extension: null,\n    id: null,\n    identifier: null,\n    reference: {\n      extension: null,\n      id: null,\n      value: "Patient/1"\n    },\n    type: null\n  },\n  text: {\n    div: {\n      extension: null,\n      id: null,\n      value: "<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>"\n    },\n    extension: null,\n    id: null,\n    status: {\n      extension: null,\n      id: null,\n      value: "generated"\n    }\n  },\n  type: [{\n    coding: null,\n    extension: null,\n    id: null,\n    text: {\n      extension: null,\n      id: null,\n      value: "OutPatient"\n    }\n  }]\n}]',
          },
          {
            libraryName: "FqmT1",
            statementName: "num",
            localId: "46",
            final: "TRUE",
            relevance: "TRUE",
            raw: [
              {
                status: {
                  value: "finished",
                },
                class: {
                  system: {
                    value: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                  },
                  code: {
                    value: "IMP",
                  },
                  display: {
                    value: "inpatient encounter",
                  },
                },
                type: [
                  {
                    text: {
                      value: "OutPatient",
                    },
                  },
                ],
                subject: {
                  reference: {
                    value: "Patient/1",
                  },
                },
                participant: [
                  {
                    individual: {
                      reference: {
                        value: "Practitioner/30164",
                      },
                      display: {
                        value: "Dr John Doe",
                      },
                    },
                  },
                ],
                period: {
                  start: {
                    value: "2023-09-12T03:34:10.054+00:00",
                  },
                  end: {
                    value: "2023-09-13T09:34:10.054+00:00",
                  },
                },
                text: {
                  status: {
                    value: "generated",
                  },
                  div: {
                    value:
                      '<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>',
                  },
                },
                id: {
                  value: "3",
                },
                meta: {
                  versionId: {
                    value: "1",
                  },
                  lastUpdated: {
                    value: "2021-10-13T03:34:10.160+00:00",
                  },
                  source: {
                    value: "#nEcAkGd8PRwPP5fA",
                  },
                },
              },
            ],
            pretty:
              '[{\n  account: null,\n  appointment: null,\n  basedOn: null,\n  class: {\n    code: {\n      extension: null,\n      id: null,\n      value: "IMP"\n    },\n    display: {\n      extension: null,\n      id: null,\n      value: "inpatient encounter"\n    },\n    extension: null,\n    id: null,\n    system: {\n      extension: null,\n      id: null,\n      value: "http://terminology.hl7.org/CodeSystem/v3-ActCode"\n    },\n    userSelected: null,\n    version: null\n  },\n  classHistory: null,\n  contained: null,\n  diagnosis: null,\n  episodeOfCare: null,\n  extension: null,\n  hospitalization: null,\n  id: {\n    extension: null,\n    id: null,\n    value: "3"\n  },\n  identifier: null,\n  implicitRules: null,\n  language: null,\n  length: null,\n  location: null,\n  meta: {\n    extension: null,\n    id: null,\n    lastUpdated: {\n      extension: null,\n      id: null,\n      value: 10/13/2021 3:34 AM\n    },\n    profile: null,\n    security: null,\n    source: {\n      extension: null,\n      id: null,\n      value: "#nEcAkGd8PRwPP5fA"\n    },\n    tag: null,\n    versionId: {\n      extension: null,\n      id: null,\n      value: "1"\n    }\n  },\n  modifierExtension: null,\n  partOf: null,\n  participant: [{\n    extension: null,\n    id: null,\n    individual: {\n      display: {\n        extension: null,\n        id: null,\n        value: "Dr John Doe"\n      },\n      extension: null,\n      id: null,\n      identifier: null,\n      reference: {\n        extension: null,\n        id: null,\n        value: "Practitioner/30164"\n      },\n      type: null\n    },\n    modifierExtension: null,\n    period: null,\n    type: null\n  }],\n  period: {\n    end: {\n      extension: null,\n      id: null,\n      value: 09/13/2023 9:34 AM\n    },\n    extension: null,\n    id: null,\n    start: {\n      extension: null,\n      id: null,\n      value: 09/12/2023 3:34 AM\n    }\n  },\n  priority: null,\n  reasonCode: null,\n  reasonReference: null,\n  serviceProvider: null,\n  serviceType: null,\n  status: {\n    extension: null,\n    id: null,\n    value: "finished"\n  },\n  statusHistory: null,\n  subject: {\n    display: null,\n    extension: null,\n    id: null,\n    identifier: null,\n    reference: {\n      extension: null,\n      id: null,\n      value: "Patient/1"\n    },\n    type: null\n  },\n  text: {\n    div: {\n      extension: null,\n      id: null,\n      value: "<div xmlns="http://www.w3.org/1999/xhtml">Sep 9th 2021 for Asthma<a name="mm"/></div>"\n    },\n    extension: null,\n    id: null,\n    status: {\n      extension: null,\n      id: null,\n      value: "generated"\n    }\n  },\n  type: [{\n    coding: null,\n    extension: null,\n    id: null,\n    text: {\n      extension: null,\n      id: null,\n      value: "OutPatient"\n    }\n  }]\n}]',
          },
          {
            libraryName: "FqmT1",
            statementName: "boolIpp",
            localId: "56",
            final: "NA",
            relevance: "NA",
            raw: true,
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolIpp2",
            localId: "71",
            final: "NA",
            relevance: "NA",
            raw: true,
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "mPop",
            localId: "86",
            final: "NA",
            relevance: "NA",
            raw: true,
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolDenom",
            localId: "88",
            final: "NA",
            relevance: "NA",
            raw: true,
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolNum",
            localId: "90",
            final: "NA",
            relevance: "NA",
            raw: true,
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolIppZ",
            localId: "95",
            final: "NA",
            relevance: "NA",
            raw: true,
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolDenomZ",
            localId: "111",
            final: "NA",
            relevance: "NA",
            raw: true,
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolNumZ",
            localId: "120",
            final: "NA",
            relevance: "NA",
            raw: true,
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "fun",
            localId: "123",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolFunc",
            localId: "125",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "boolFunc2",
            localId: "127",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "daysObs",
            localId: "132",
            final: "FALSE",
            relevance: "TRUE",
            pretty: "FUNCTION",
          },
          {
            libraryName: "FqmT1",
            statementName: "hoursObs",
            localId: "137",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_daysObs_denom",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_daysObs_num",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_daysObs_denom",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_hoursObs_num",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_boolFunc2",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_boolFunc",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_boolFunc2",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
          {
            libraryName: "FqmT1",
            statementName: "obs_func_boolFunc",
            final: "NA",
            relevance: "NA",
            pretty: "NA",
          },
        ] as unknown as StatementResult[],
        clauseResults: [],
      },
    ],
  };
