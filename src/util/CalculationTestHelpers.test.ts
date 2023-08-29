import * as _ from "lodash";
import { getStatementRelevanceForPopulationSet } from "./CalculationTestHelpers";

describe("CalculationTestHelpers", () => {
  let testMeasure;
  let testPopulationSet;
  beforeEach(() => {
    testMeasure = _.cloneDeep(cqmMeasure);
    testPopulationSet = _.cloneDeep(populationSet);
  });

  it("sets used definition statements to true", () => {
    const statementRelevanceMap = getStatementRelevanceForPopulationSet(
      testMeasure,
      testPopulationSet
    );
    expect(statementRelevanceMap[testMeasure.main_cql_library]).toBeTruthy();
    expect(statementRelevanceMap[testMeasure.main_cql_library]["IP"]).toBe(
      "TRUE"
    );
    expect(statementRelevanceMap[testMeasure.main_cql_library]["Patient"]).toBe(
      "NA"
    );
    expect(
      statementRelevanceMap[testMeasure.main_cql_library][
        "Has Qualifying Encounter"
      ]
    ).toBe("TRUE");
    expect(
      statementRelevanceMap[testMeasure.main_cql_library]["Has CM Performed"]
    ).toBe("NA");
    expect(
      statementRelevanceMap[testMeasure.main_cql_library]["Has CM Ordered"]
    ).toBe("TRUE");
    expect(
      statementRelevanceMap[testMeasure.main_cql_library]["Has Ablation"]
    ).toBe("TRUE");
    expect(
      statementRelevanceMap[testMeasure.main_cql_library][
        "Has Anticoagulant Therapy At Discharge"
      ]
    ).toBe("TRUE");
    expect(
      statementRelevanceMap[testMeasure.main_cql_library][
        "Is On Anticoagulant Therapy"
      ]
    ).toBe("NA");
    expect(
      statementRelevanceMap[testMeasure.main_cql_library]["Denominator"]
    ).toBe("TRUE");
    expect(
      statementRelevanceMap[testMeasure.main_cql_library][
        "Denominator Exclusions 1"
      ]
    ).toBe("TRUE");
    expect(
      statementRelevanceMap[testMeasure.main_cql_library][
        "Denominator Exclusions 2"
      ]
    ).toBe("NA");
    expect(
      statementRelevanceMap[testMeasure.main_cql_library]["Numerator"]
    ).toBe("TRUE");
    expect(
      statementRelevanceMap[testMeasure.main_cql_library][
        "Numerator Exclusions 1"
      ]
    ).toBe("TRUE");
    expect(
      statementRelevanceMap[testMeasure.main_cql_library][
        "Numerator Exclusions 2"
      ]
    ).toBe("NA");
    expect(
      statementRelevanceMap[testMeasure.main_cql_library][
        "Denominator Observation"
      ]
    ).toBe("TRUE");
    expect(
      statementRelevanceMap[testMeasure.main_cql_library][
        "Numerator Observation"
      ]
    ).toBe("TRUE");
  });
});

const populationSet = [
  {
    id: "64de389e21a1fc225b697e6b",
    title: "Population Criteria Section",
    population_set_id: "64de389e21a1fc225b697e6b",
    populations: {
      IPP: {
        id: "1738d81b-984c-486f-976a-abd7d15d339e",
        library_name: "RatioObs",
        statement_name: "IP",
        hqmf_id: null,
      },
      DENOM: {
        id: "9e01042b-a141-414b-a782-93300a6b0455",
        library_name: "RatioObs",
        statement_name: "Denominator",
        hqmf_id: null,
      },
      DENEX: {
        id: "af6da281-2fc5-4c7b-8a7f-103fa7b6d9fa",
        library_name: "RatioObs",
        statement_name: "Denominator Exclusions 1",
        hqmf_id: null,
      },
      NUMER: {
        id: "4a2b8715-6e54-48e0-9e59-daed2ebf4e6c",
        library_name: "RatioObs",
        statement_name: "Numerator",
        hqmf_id: null,
      },
      NUMEX: {
        id: "4a4becd9-db20-457a-9f9c-5b993fef660c",
        library_name: "RatioObs",
        statement_name: "Numerator Exclusions 1",
        hqmf_id: null,
      },
    },
    stratifications: [],
    supplemental_data_elements: [],
    observations: [
      {
        id: "453251cf-87bd-40b4-8261-07396e8e7e52",
        hqmf_id: null,
        aggregation_type: "Sum",
        observation_function: {
          id: "81fd3052-65f1-408c-b94a-ba401ed0030e",
          library_name: "RatioObs",
          statement_name: "Numerator Observation",
          hqmf_id: null,
        },
        observation_parameter: {
          id: "39ed48d1-c759-4fa1-956c-dd8ecb76cc36",
          library_name: "RatioObs",
          statement_name: "numerator",
          hqmf_id: null,
        },
      },
      {
        id: "142d9187-a5cf-4946-a116-ea8a0678c08a",
        hqmf_id: null,
        aggregation_type: "Sum",
        observation_function: {
          id: "40ce2d40-c095-4481-9dbc-c927efe97ae8",
          library_name: "RatioObs",
          statement_name: "Denominator Observation",
          hqmf_id: null,
        },
        observation_parameter: {
          id: "08e165be-372d-4850-92ad-41579b760423",
          library_name: "RatioObs",
          statement_name: "denominator",
          hqmf_id: null,
        },
      },
    ],
  },
];

const cqmMeasure = {
  composite: false,
  component: false,
  component_hqmf_set_ids: [],
  measure_scoring: "Ratio",
  calculation_method: "PATIENT",
  source_data_criteria: [
    {
      dataElementCodes: [],
      _id: "64de38c099f3ea0000ca54f3",
      participant: [],
      relatedTo: [],
      qdmTitle: "Encounter, Performed",
      hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
      qdmCategory: "encounter",
      qdmStatus: "performed",
      qdmVersion: "5.6",
      _type: "QDM::EncounterPerformed",
      id: "64de38c099f3ea0000ca54f3",
      facilityLocations: [],
      diagnoses: [],
      codeListId: "2.16.840.1.113883.3.117.1.7.1.424",
      description: "Encounter, Performed: Nonelective Inpatient Encounter",
    },
    {
      dataElementCodes: [],
      _id: "64de38c099f3ea0000ca54f5",
      recorder: [],
      qdmTitle: "Medication, Active",
      hqmfOid: "2.16.840.1.113883.10.20.28.4.44",
      qdmCategory: "medication",
      qdmStatus: "active",
      qdmVersion: "5.6",
      _type: "QDM::MedicationActive",
      id: "64de38c099f3ea0000ca54f5",
      codeListId: "2.16.840.1.113883.3.117.1.7.1.200",
      description: "Medication, Active: Anticoagulant Therapy",
    },
    {
      dataElementCodes: [],
      _id: "64de38c099f3ea0000ca54f7",
      performer: [],
      relatedTo: [],
      qdmTitle: "Intervention, Performed",
      hqmfOid: "2.16.840.1.113883.10.20.28.4.36",
      qdmCategory: "intervention",
      qdmStatus: "performed",
      qdmVersion: "5.6",
      _type: "QDM::InterventionPerformed",
      id: "64de38c099f3ea0000ca54f7",
      codeListId: "1.3.6.1.4.1.33895.1.3.0.45",
      description: "Intervention, Performed: Comfort Measures",
    },
    {
      dataElementCodes: [],
      _id: "64de38c099f3ea0000ca54f9",
      requester: [],
      qdmTitle: "Procedure, Order",
      hqmfOid: "2.16.840.1.113883.10.20.28.4.66",
      qdmCategory: "procedure",
      qdmStatus: "order",
      qdmVersion: "5.6",
      _type: "QDM::ProcedureOrder",
      id: "64de38c099f3ea0000ca54f9",
      codeListId: "2.16.840.1.113883.3.117.1.7.1.203",
      description: "Procedure, Order: Atrial Ablation",
    },
  ],
  measure_attributes: [],
  patients: [],
  value_sets: [],
  _id: "64de38bf99f3ea0000ca54f1",
  cql_libraries: [
    {
      is_main_library: true,
      is_top_level: true,
      _id: "64de38c099f3ea0000ca5503",
      statement_dependencies: [
        {
          _id: "64de38c099f3ea0000ca5505",
          statement_name: "Patient",
          statement_references: [],
        },
        {
          _id: "64de38c099f3ea0000ca5507",
          statement_name: "Has Qualifying Encounter",
          statement_references: [],
        },
        {
          _id: "64de38c099f3ea0000ca5509",
          statement_name: "Has CM Performed",
          statement_references: [],
        },
        {
          _id: "64de38c099f3ea0000ca550b",
          statement_name: "Has CM Ordered",
          statement_references: [],
        },
        {
          _id: "64de38c099f3ea0000ca550d",
          statement_name: "Has Ablation",
          statement_references: [],
        },
        {
          _id: "64de38c099f3ea0000ca550f",
          statement_name: "Has Anticoagulant Therapy At Discharge",
          statement_references: [],
        },
        {
          _id: "64de38c099f3ea0000ca5511",
          statement_name: "Is On Anticoagulant Therapy",
          statement_references: [],
        },
        {
          _id: "64de38c099f3ea0000ca5513",
          statement_name: "IP",
          statement_references: [
            {
              _id: "64de38c099f3ea0000ca5515",
              library_name: "RatioObs",
              statement_name: "Has Qualifying Encounter",
            },
          ],
        },
        {
          _id: "64de38c099f3ea0000ca5516",
          statement_name: "Denominator",
          statement_references: [
            {
              _id: "64de38c099f3ea0000ca5518",
              library_name: "RatioObs",
              statement_name: "IP",
            },
          ],
        },
        {
          _id: "64de38c099f3ea0000ca5519",
          statement_name: "Denominator Exclusions 1",
          statement_references: [
            {
              _id: "64de38c099f3ea0000ca551b",
              library_name: "RatioObs",
              statement_name: "Has CM Ordered",
            },
          ],
        },
        {
          _id: "64de38c099f3ea0000ca551c",
          statement_name: "Denominator Exclusions 2",
          statement_references: [
            {
              _id: "64de38c099f3ea0000ca551e",
              library_name: "RatioObs",
              statement_name: "Has CM Performed",
            },
          ],
        },
        {
          _id: "64de38c099f3ea0000ca551f",
          statement_name: "Numerator",
          statement_references: [
            {
              _id: "64de38c099f3ea0000ca5521",
              library_name: "RatioObs",
              statement_name: "Has Ablation",
            },
          ],
        },
        {
          _id: "64de38c099f3ea0000ca5522",
          statement_name: "Numerator Exclusions 1",
          statement_references: [
            {
              _id: "64de38c099f3ea0000ca5524",
              library_name: "RatioObs",
              statement_name: "Has Anticoagulant Therapy At Discharge",
            },
          ],
        },
        {
          _id: "64de38c099f3ea0000ca5525",
          statement_name: "Numerator Exclusions 2",
          statement_references: [
            {
              _id: "64de38c099f3ea0000ca5527",
              library_name: "RatioObs",
              statement_name: "Is On Anticoagulant Therapy",
            },
          ],
        },
        {
          _id: "64de38c099f3ea0000ca5528",
          statement_name: "Denominator Observation",
          statement_references: [],
        },
        {
          _id: "64de38c099f3ea0000ca552a",
          statement_name: "Numerator Observation",
          statement_references: [],
        },
      ],
      library_name: "RatioObs",
      library_version: "0.0.000",
      elm: {
        library: {
          annotation: [
            {
              translatorVersion: "2.11.0",
              translatorOptions:
                "EnableAnnotations,EnableLocators,EnableResultTypes,EnableDetailedErrors,DisableListDemotion,DisableListPromotion",
              type: "CqlToElmInfo",
            },
            {
              type: "Annotation",
              s: {
                r: "48",
                s: [
                  {
                    value: ["", "library RatioObs version '0.0.000'"],
                  },
                ],
              },
            },
          ],
          identifier: {
            id: "RatioObs",
            version: "0.0.000",
          },
          schemaIdentifier: {
            id: "urn:hl7-org:elm",
            version: "r1",
          },
          usings: {
            def: [
              {
                localIdentifier: "System",
                uri: "urn:hl7-org:elm-types:r1",
              },
              {
                localId: "1",
                locator: "3:1-3:23",
                localIdentifier: "QDM",
                uri: "urn:healthit-gov:qdm:v5_6",
                version: "5.6",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "1",
                      s: [
                        {
                          value: ["", "using "],
                        },
                        {
                          s: [
                            {
                              value: ["QDM"],
                            },
                          ],
                        },
                        {
                          value: [" version ", "'5.6'"],
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
          parameters: {
            def: [
              {
                localId: "12",
                locator: "14:1-14:49",
                name: "Measurement Period",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "12",
                      s: [
                        {
                          value: [
                            "",
                            "parameter ",
                            '"Measurement Period"',
                            " ",
                          ],
                        },
                        {
                          r: "11",
                          s: [
                            {
                              value: ["Interval<"],
                            },
                            {
                              r: "10",
                              s: [
                                {
                                  value: ["DateTime"],
                                },
                              ],
                            },
                            {
                              value: [">"],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                resultTypeSpecifier: {
                  type: "IntervalTypeSpecifier",
                  pointType: {
                    name: "{urn:hl7-org:elm-types:r1}DateTime",
                    type: "NamedTypeSpecifier",
                  },
                },
                parameterTypeSpecifier: {
                  localId: "11",
                  locator: "14:32-14:49",
                  type: "IntervalTypeSpecifier",
                  resultTypeSpecifier: {
                    type: "IntervalTypeSpecifier",
                    pointType: {
                      name: "{urn:hl7-org:elm-types:r1}DateTime",
                      type: "NamedTypeSpecifier",
                    },
                  },
                  pointType: {
                    localId: "10",
                    locator: "14:41-14:48",
                    resultTypeName: "{urn:hl7-org:elm-types:r1}DateTime",
                    name: "{urn:hl7-org:elm-types:r1}DateTime",
                    type: "NamedTypeSpecifier",
                  },
                },
              },
            ],
          },
          valueSets: {
            def: [
              {
                localId: "2",
                locator: "5:1-5:77",
                resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                name: "Anticoagulant Therapy",
                id: "urn:oid:2.16.840.1.113883.3.117.1.7.1.200",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "2",
                      s: [
                        {
                          value: [
                            "",
                            "valueset ",
                            '"Anticoagulant Therapy"',
                            ": ",
                            "'urn:oid:2.16.840.1.113883.3.117.1.7.1.200'",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
              {
                localId: "3",
                locator: "6:1-6:71",
                resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                name: "Atrial Ablation",
                id: "urn:oid:2.16.840.1.113883.3.117.1.7.1.203",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "3",
                      s: [
                        {
                          value: [
                            "",
                            "valueset ",
                            '"Atrial Ablation"',
                            ": ",
                            "'urn:oid:2.16.840.1.113883.3.117.1.7.1.203'",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
              {
                localId: "4",
                locator: "7:1-7:65",
                resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                name: "Comfort Measures",
                id: "urn:oid:1.3.6.1.4.1.33895.1.3.0.45",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "4",
                      s: [
                        {
                          value: [
                            "",
                            "valueset ",
                            '"Comfort Measures"',
                            ": ",
                            "'urn:oid:1.3.6.1.4.1.33895.1.3.0.45'",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
              {
                localId: "5",
                locator: "8:1-8:58",
                resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                name: "Ethnicity",
                id: "urn:oid:2.16.840.1.114222.4.11.837",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "5",
                      s: [
                        {
                          value: [
                            "",
                            "valueset ",
                            '"Ethnicity"',
                            ": ",
                            "'urn:oid:2.16.840.1.114222.4.11.837'",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
              {
                localId: "6",
                locator: "9:1-9:87",
                resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                name: "Nonelective Inpatient Encounter",
                id: "urn:oid:2.16.840.1.113883.3.117.1.7.1.424",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "6",
                      s: [
                        {
                          value: [
                            "",
                            "valueset ",
                            '"Nonelective Inpatient Encounter"',
                            ": ",
                            "'urn:oid:2.16.840.1.113883.3.117.1.7.1.424'",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
              {
                localId: "7",
                locator: "10:1-10:68",
                resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                name: "ONC Administrative Sex",
                id: "urn:oid:2.16.840.1.113762.1.4.1",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "7",
                      s: [
                        {
                          value: [
                            "",
                            "valueset ",
                            '"ONC Administrative Sex"',
                            ": ",
                            "'urn:oid:2.16.840.1.113762.1.4.1'",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
              {
                localId: "8",
                locator: "11:1-11:60",
                resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                name: "Payer Type",
                id: "urn:oid:2.16.840.1.114222.4.11.3591",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "8",
                      s: [
                        {
                          value: [
                            "",
                            "valueset ",
                            '"Payer Type"',
                            ": ",
                            "'urn:oid:2.16.840.1.114222.4.11.3591'",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
              {
                localId: "9",
                locator: "12:1-12:53",
                resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                name: "Race",
                id: "urn:oid:2.16.840.1.114222.4.11.836",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "9",
                      s: [
                        {
                          value: [
                            "",
                            "valueset ",
                            '"Race"',
                            ": ",
                            "'urn:oid:2.16.840.1.114222.4.11.836'",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
          contexts: {
            def: [
              {
                locator: "16:1-16:15",
                name: "Patient",
              },
            ],
          },
          statements: {
            def: [
              {
                locator: "16:1-16:15",
                name: "Patient",
                context: "Patient",
                expression: {
                  type: "SingletonFrom",
                  operand: {
                    locator: "16:1-16:15",
                    dataType: "{urn:healthit-gov:qdm:v5_6}Patient",
                    templateId: "Patient",
                    type: "Retrieve",
                  },
                },
              },
              {
                localId: "15",
                locator: "18:1-19:68",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                name: "Has Qualifying Encounter",
                context: "Patient",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "15",
                      s: [
                        {
                          value: [
                            "",
                            "define ",
                            '"Has Qualifying Encounter"',
                            ":\n  ",
                          ],
                        },
                        {
                          r: "14",
                          s: [
                            {
                              value: ["exists "],
                            },
                            {
                              r: "13",
                              s: [
                                {
                                  value: ["[", '"Encounter, Performed"', ": "],
                                },
                                {
                                  s: [
                                    {
                                      value: [
                                        '"Nonelective Inpatient Encounter"',
                                      ],
                                    },
                                  ],
                                },
                                {
                                  value: ["]"],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                expression: {
                  localId: "14",
                  locator: "19:3-19:68",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                  type: "Exists",
                  signature: [
                    {
                      type: "ListTypeSpecifier",
                      elementType: {
                        name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                        type: "NamedTypeSpecifier",
                      },
                    },
                  ],
                  operand: {
                    localId: "13",
                    locator: "19:10-19:68",
                    dataType:
                      "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                    templateId: "PositiveEncounterPerformed",
                    codeProperty: "code",
                    codeComparator: "in",
                    type: "Retrieve",
                    resultTypeSpecifier: {
                      type: "ListTypeSpecifier",
                      elementType: {
                        name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                        type: "NamedTypeSpecifier",
                      },
                    },
                    codes: {
                      locator: "19:35-19:67",
                      resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                      name: "Nonelective Inpatient Encounter",
                      preserve: true,
                      type: "ValueSetRef",
                    },
                  },
                },
              },
              {
                localId: "18",
                locator: "21:1-22:56",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                name: "Has CM Performed",
                context: "Patient",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "18",
                      s: [
                        {
                          value: ["", "define ", '"Has CM Performed"', ":\n  "],
                        },
                        {
                          r: "17",
                          s: [
                            {
                              value: ["exists "],
                            },
                            {
                              r: "16",
                              s: [
                                {
                                  value: [
                                    "[",
                                    '"Intervention, Performed"',
                                    ": ",
                                  ],
                                },
                                {
                                  s: [
                                    {
                                      value: ['"Comfort Measures"'],
                                    },
                                  ],
                                },
                                {
                                  value: ["]"],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                expression: {
                  localId: "17",
                  locator: "22:3-22:56",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                  type: "Exists",
                  signature: [
                    {
                      type: "ListTypeSpecifier",
                      elementType: {
                        name: "{urn:healthit-gov:qdm:v5_6}PositiveInterventionPerformed",
                        type: "NamedTypeSpecifier",
                      },
                    },
                  ],
                  operand: {
                    localId: "16",
                    locator: "22:10-22:56",
                    dataType:
                      "{urn:healthit-gov:qdm:v5_6}PositiveInterventionPerformed",
                    templateId: "PositiveInterventionPerformed",
                    codeProperty: "code",
                    codeComparator: "in",
                    type: "Retrieve",
                    resultTypeSpecifier: {
                      type: "ListTypeSpecifier",
                      elementType: {
                        name: "{urn:healthit-gov:qdm:v5_6}PositiveInterventionPerformed",
                        type: "NamedTypeSpecifier",
                      },
                    },
                    codes: {
                      locator: "22:38-22:55",
                      resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                      name: "Comfort Measures",
                      preserve: true,
                      type: "ValueSetRef",
                    },
                  },
                },
              },
              {
                localId: "21",
                locator: "24:1-25:52",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                name: "Has CM Ordered",
                context: "Patient",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "21",
                      s: [
                        {
                          value: ["", "define ", '"Has CM Ordered"', ":\n  "],
                        },
                        {
                          r: "20",
                          s: [
                            {
                              value: ["exists "],
                            },
                            {
                              r: "19",
                              s: [
                                {
                                  value: ["[", '"Intervention, Order"', ": "],
                                },
                                {
                                  s: [
                                    {
                                      value: ['"Comfort Measures"'],
                                    },
                                  ],
                                },
                                {
                                  value: ["]"],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                expression: {
                  localId: "20",
                  locator: "25:3-25:52",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                  type: "Exists",
                  signature: [
                    {
                      type: "ListTypeSpecifier",
                      elementType: {
                        name: "{urn:healthit-gov:qdm:v5_6}PositiveInterventionOrder",
                        type: "NamedTypeSpecifier",
                      },
                    },
                  ],
                  operand: {
                    localId: "19",
                    locator: "25:10-25:52",
                    dataType:
                      "{urn:healthit-gov:qdm:v5_6}PositiveInterventionOrder",
                    templateId: "PositiveInterventionOrder",
                    codeProperty: "code",
                    codeComparator: "in",
                    type: "Retrieve",
                    resultTypeSpecifier: {
                      type: "ListTypeSpecifier",
                      elementType: {
                        name: "{urn:healthit-gov:qdm:v5_6}PositiveInterventionOrder",
                        type: "NamedTypeSpecifier",
                      },
                    },
                    codes: {
                      locator: "25:34-25:51",
                      resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                      name: "Comfort Measures",
                      preserve: true,
                      type: "ValueSetRef",
                    },
                  },
                },
              },
              {
                localId: "24",
                locator: "27:1-28:48",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                name: "Has Ablation",
                context: "Patient",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "24",
                      s: [
                        {
                          value: ["", "define ", '"Has Ablation"', ":\n  "],
                        },
                        {
                          r: "23",
                          s: [
                            {
                              value: ["exists "],
                            },
                            {
                              r: "22",
                              s: [
                                {
                                  value: ["[", '"Procedure, Order"', ": "],
                                },
                                {
                                  s: [
                                    {
                                      value: ['"Atrial Ablation"'],
                                    },
                                  ],
                                },
                                {
                                  value: ["]"],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                expression: {
                  localId: "23",
                  locator: "28:3-28:48",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                  type: "Exists",
                  signature: [
                    {
                      type: "ListTypeSpecifier",
                      elementType: {
                        name: "{urn:healthit-gov:qdm:v5_6}PositiveProcedureOrder",
                        type: "NamedTypeSpecifier",
                      },
                    },
                  ],
                  operand: {
                    localId: "22",
                    locator: "28:10-28:48",
                    dataType:
                      "{urn:healthit-gov:qdm:v5_6}PositiveProcedureOrder",
                    templateId: "PositiveProcedureOrder",
                    codeProperty: "code",
                    codeComparator: "in",
                    type: "Retrieve",
                    resultTypeSpecifier: {
                      type: "ListTypeSpecifier",
                      elementType: {
                        name: "{urn:healthit-gov:qdm:v5_6}PositiveProcedureOrder",
                        type: "NamedTypeSpecifier",
                      },
                    },
                    codes: {
                      locator: "28:31-28:47",
                      resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                      name: "Atrial Ablation",
                      preserve: true,
                      type: "ValueSetRef",
                    },
                  },
                },
              },
              {
                localId: "27",
                locator: "30:1-31:59",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                name: "Has Anticoagulant Therapy At Discharge",
                context: "Patient",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "27",
                      s: [
                        {
                          value: [
                            "",
                            "define ",
                            '"Has Anticoagulant Therapy At Discharge"',
                            ":\n  ",
                          ],
                        },
                        {
                          r: "26",
                          s: [
                            {
                              value: ["exists "],
                            },
                            {
                              r: "25",
                              s: [
                                {
                                  value: ["[", '"Medication, Discharge"', ": "],
                                },
                                {
                                  s: [
                                    {
                                      value: ['"Anticoagulant Therapy"'],
                                    },
                                  ],
                                },
                                {
                                  value: ["]"],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                expression: {
                  localId: "26",
                  locator: "31:3-31:59",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                  type: "Exists",
                  signature: [
                    {
                      type: "ListTypeSpecifier",
                      elementType: {
                        name: "{urn:healthit-gov:qdm:v5_6}PositiveMedicationDischarge",
                        type: "NamedTypeSpecifier",
                      },
                    },
                  ],
                  operand: {
                    localId: "25",
                    locator: "31:10-31:59",
                    dataType:
                      "{urn:healthit-gov:qdm:v5_6}PositiveMedicationDischarge",
                    templateId: "PositiveMedicationDischarge",
                    codeProperty: "code",
                    codeComparator: "in",
                    type: "Retrieve",
                    resultTypeSpecifier: {
                      type: "ListTypeSpecifier",
                      elementType: {
                        name: "{urn:healthit-gov:qdm:v5_6}PositiveMedicationDischarge",
                        type: "NamedTypeSpecifier",
                      },
                    },
                    codes: {
                      locator: "31:36-31:58",
                      resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                      name: "Anticoagulant Therapy",
                      preserve: true,
                      type: "ValueSetRef",
                    },
                  },
                },
              },
              {
                localId: "30",
                locator: "33:1-34:56",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                name: "Is On Anticoagulant Therapy",
                context: "Patient",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "30",
                      s: [
                        {
                          value: [
                            "",
                            "define ",
                            '"Is On Anticoagulant Therapy"',
                            ":\n  ",
                          ],
                        },
                        {
                          r: "29",
                          s: [
                            {
                              value: ["exists "],
                            },
                            {
                              r: "28",
                              s: [
                                {
                                  value: ["[", '"Medication, Active"', ": "],
                                },
                                {
                                  s: [
                                    {
                                      value: ['"Anticoagulant Therapy"'],
                                    },
                                  ],
                                },
                                {
                                  value: ["]"],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                expression: {
                  localId: "29",
                  locator: "34:3-34:56",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                  type: "Exists",
                  signature: [
                    {
                      type: "ListTypeSpecifier",
                      elementType: {
                        name: "{urn:healthit-gov:qdm:v5_6}MedicationActive",
                        type: "NamedTypeSpecifier",
                      },
                    },
                  ],
                  operand: {
                    localId: "28",
                    locator: "34:10-34:56",
                    dataType: "{urn:healthit-gov:qdm:v5_6}MedicationActive",
                    codeProperty: "code",
                    codeComparator: "in",
                    type: "Retrieve",
                    resultTypeSpecifier: {
                      type: "ListTypeSpecifier",
                      elementType: {
                        name: "{urn:healthit-gov:qdm:v5_6}MedicationActive",
                        type: "NamedTypeSpecifier",
                      },
                    },
                    codes: {
                      locator: "34:33-34:55",
                      resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                      name: "Anticoagulant Therapy",
                      preserve: true,
                      type: "ValueSetRef",
                    },
                  },
                },
              },
              {
                localId: "32",
                locator: "36:1-37:28",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                name: "IP",
                context: "Patient",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "32",
                      s: [
                        {
                          value: ["", "define ", '"IP"', ":\n  "],
                        },
                        {
                          r: "31",
                          s: [
                            {
                              value: ['"Has Qualifying Encounter"'],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                expression: {
                  localId: "31",
                  locator: "37:3-37:28",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                  name: "Has Qualifying Encounter",
                  type: "ExpressionRef",
                },
              },
              {
                localId: "34",
                locator: "39:1-40:6",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                name: "Denominator",
                context: "Patient",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "34",
                      s: [
                        {
                          value: ["", "define ", '"Denominator"', ":\n  "],
                        },
                        {
                          r: "33",
                          s: [
                            {
                              value: ['"IP"'],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                expression: {
                  localId: "33",
                  locator: "40:3-40:6",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                  name: "IP",
                  type: "ExpressionRef",
                },
              },
              {
                localId: "36",
                locator: "42:1-43:18",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                name: "Denominator Exclusions 1",
                context: "Patient",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "36",
                      s: [
                        {
                          value: [
                            "",
                            "define ",
                            '"Denominator Exclusions 1"',
                            ":\n  ",
                          ],
                        },
                        {
                          r: "35",
                          s: [
                            {
                              value: ['"Has CM Ordered"'],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                expression: {
                  localId: "35",
                  locator: "43:3-43:18",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                  name: "Has CM Ordered",
                  type: "ExpressionRef",
                },
              },
              {
                localId: "38",
                locator: "45:1-46:20",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                name: "Denominator Exclusions 2",
                context: "Patient",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "38",
                      s: [
                        {
                          value: [
                            "",
                            "define ",
                            '"Denominator Exclusions 2"',
                            ":\n  ",
                          ],
                        },
                        {
                          r: "37",
                          s: [
                            {
                              value: ['"Has CM Performed"'],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                expression: {
                  localId: "37",
                  locator: "46:3-46:20",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                  name: "Has CM Performed",
                  type: "ExpressionRef",
                },
              },
              {
                localId: "40",
                locator: "48:1-49:16",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                name: "Numerator",
                context: "Patient",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "40",
                      s: [
                        {
                          value: ["", "define ", '"Numerator"', ":\n  "],
                        },
                        {
                          r: "39",
                          s: [
                            {
                              value: ['"Has Ablation"'],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                expression: {
                  localId: "39",
                  locator: "49:3-49:16",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                  name: "Has Ablation",
                  type: "ExpressionRef",
                },
              },
              {
                localId: "42",
                locator: "51:1-52:42",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                name: "Numerator Exclusions 1",
                context: "Patient",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "42",
                      s: [
                        {
                          value: [
                            "",
                            "define ",
                            '"Numerator Exclusions 1"',
                            ":\n  ",
                          ],
                        },
                        {
                          r: "41",
                          s: [
                            {
                              value: [
                                '"Has Anticoagulant Therapy At Discharge"',
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                expression: {
                  localId: "41",
                  locator: "52:3-52:42",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                  name: "Has Anticoagulant Therapy At Discharge",
                  type: "ExpressionRef",
                },
              },
              {
                localId: "44",
                locator: "54:1-55:31",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                name: "Numerator Exclusions 2",
                context: "Patient",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "44",
                      s: [
                        {
                          value: [
                            "",
                            "define ",
                            '"Numerator Exclusions 2"',
                            ":\n  ",
                          ],
                        },
                        {
                          r: "43",
                          s: [
                            {
                              value: ['"Is On Anticoagulant Therapy"'],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                expression: {
                  localId: "43",
                  locator: "55:3-55:31",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                  name: "Is On Anticoagulant Therapy",
                  type: "ExpressionRef",
                },
              },
              {
                localId: "46",
                locator: "57:1-58:3",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Integer",
                name: "Denominator Observation",
                context: "Patient",
                accessLevel: "Public",
                type: "FunctionDef",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "46",
                      s: [
                        {
                          value: [
                            "",
                            "define function ",
                            '"Denominator Observation"',
                            "():\n  ",
                          ],
                        },
                        {
                          r: "45",
                          s: [
                            {
                              r: "45",
                              value: ["1"],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                expression: {
                  localId: "45",
                  locator: "58:3",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Integer",
                  valueType: "{urn:hl7-org:elm-types:r1}Integer",
                  value: "1",
                  type: "Literal",
                },
                operand: [],
              },
              {
                localId: "48",
                locator: "60:1-61:3",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Integer",
                name: "Numerator Observation",
                context: "Patient",
                accessLevel: "Public",
                type: "FunctionDef",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "48",
                      s: [
                        {
                          value: [
                            "",
                            "define function ",
                            '"Numerator Observation"',
                            "():\n  ",
                          ],
                        },
                        {
                          r: "47",
                          s: [
                            {
                              r: "47",
                              value: ["2"],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
                expression: {
                  localId: "47",
                  locator: "61:3",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}Integer",
                  valueType: "{urn:hl7-org:elm-types:r1}Integer",
                  value: "2",
                  type: "Literal",
                },
                operand: [],
              },
            ],
          },
        },
      },
      elm_annotations: {
        statements: [
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: 'define "Has Qualifying Encounter" :',
                              },
                            ],
                          },
                          {
                            children: [
                              {
                                children: [
                                  {
                                    children: [
                                      {
                                        text: "exists",
                                      },
                                    ],
                                  },
                                  {
                                    children: [
                                      {
                                        children: [
                                          {
                                            children: [
                                              {
                                                text: '[ "Encounter, Performed" :',
                                              },
                                            ],
                                          },
                                          {
                                            children: [
                                              {
                                                children: [
                                                  {
                                                    children: [
                                                      {
                                                        text: '"Nonelective Inpatient Encounter"',
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                    node_type: "Retrieve",
                                    ref_id: "13",
                                  },
                                ],
                              },
                            ],
                            node_type: "Exists",
                            ref_id: "14",
                          },
                        ],
                      },
                    ],
                    ref_id: "15",
                  },
                ],
              },
            ],
            define_name: "Has Qualifying Encounter",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: 'define "Has CM Performed" :',
                              },
                            ],
                          },
                          {
                            children: [
                              {
                                children: [
                                  {
                                    children: [
                                      {
                                        text: "exists",
                                      },
                                    ],
                                  },
                                  {
                                    children: [
                                      {
                                        children: [
                                          {
                                            children: [
                                              {
                                                text: '[ "Intervention, Performed" :',
                                              },
                                            ],
                                          },
                                          {
                                            children: [
                                              {
                                                children: [
                                                  {
                                                    children: [
                                                      {
                                                        text: '"Comfort Measures"',
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                    node_type: "Retrieve",
                                    ref_id: "16",
                                  },
                                ],
                              },
                            ],
                            node_type: "Exists",
                            ref_id: "17",
                          },
                        ],
                      },
                    ],
                    ref_id: "18",
                  },
                ],
              },
            ],
            define_name: "Has CM Performed",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: 'define "Has CM Ordered" :',
                              },
                            ],
                          },
                          {
                            children: [
                              {
                                children: [
                                  {
                                    children: [
                                      {
                                        text: "exists",
                                      },
                                    ],
                                  },
                                  {
                                    children: [
                                      {
                                        children: [
                                          {
                                            children: [
                                              {
                                                text: '[ "Intervention, Order" :',
                                              },
                                            ],
                                          },
                                          {
                                            children: [
                                              {
                                                children: [
                                                  {
                                                    children: [
                                                      {
                                                        text: '"Comfort Measures"',
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                    node_type: "Retrieve",
                                    ref_id: "19",
                                  },
                                ],
                              },
                            ],
                            node_type: "Exists",
                            ref_id: "20",
                          },
                        ],
                      },
                    ],
                    ref_id: "21",
                  },
                ],
              },
            ],
            define_name: "Has CM Ordered",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: 'define "Has Ablation" :',
                              },
                            ],
                          },
                          {
                            children: [
                              {
                                children: [
                                  {
                                    children: [
                                      {
                                        text: "exists",
                                      },
                                    ],
                                  },
                                  {
                                    children: [
                                      {
                                        children: [
                                          {
                                            children: [
                                              {
                                                text: '[ "Procedure, Order" :',
                                              },
                                            ],
                                          },
                                          {
                                            children: [
                                              {
                                                children: [
                                                  {
                                                    children: [
                                                      {
                                                        text: '"Atrial Ablation"',
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                    node_type: "Retrieve",
                                    ref_id: "22",
                                  },
                                ],
                              },
                            ],
                            node_type: "Exists",
                            ref_id: "23",
                          },
                        ],
                      },
                    ],
                    ref_id: "24",
                  },
                ],
              },
            ],
            define_name: "Has Ablation",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: 'define "Has Anticoagulant Therapy At Discharge" :',
                              },
                            ],
                          },
                          {
                            children: [
                              {
                                children: [
                                  {
                                    children: [
                                      {
                                        text: "exists",
                                      },
                                    ],
                                  },
                                  {
                                    children: [
                                      {
                                        children: [
                                          {
                                            children: [
                                              {
                                                text: '[ "Medication, Discharge" :',
                                              },
                                            ],
                                          },
                                          {
                                            children: [
                                              {
                                                children: [
                                                  {
                                                    children: [
                                                      {
                                                        text: '"Anticoagulant Therapy"',
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                    node_type: "Retrieve",
                                    ref_id: "25",
                                  },
                                ],
                              },
                            ],
                            node_type: "Exists",
                            ref_id: "26",
                          },
                        ],
                      },
                    ],
                    ref_id: "27",
                  },
                ],
              },
            ],
            define_name: "Has Anticoagulant Therapy At Discharge",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: 'define "Is On Anticoagulant Therapy" :',
                              },
                            ],
                          },
                          {
                            children: [
                              {
                                children: [
                                  {
                                    children: [
                                      {
                                        text: "exists",
                                      },
                                    ],
                                  },
                                  {
                                    children: [
                                      {
                                        children: [
                                          {
                                            children: [
                                              {
                                                text: '[ "Medication, Active" :',
                                              },
                                            ],
                                          },
                                          {
                                            children: [
                                              {
                                                children: [
                                                  {
                                                    children: [
                                                      {
                                                        text: '"Anticoagulant Therapy"',
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                    node_type: "Retrieve",
                                    ref_id: "28",
                                  },
                                ],
                              },
                            ],
                            node_type: "Exists",
                            ref_id: "29",
                          },
                        ],
                      },
                    ],
                    ref_id: "30",
                  },
                ],
              },
            ],
            define_name: "Is On Anticoagulant Therapy",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: 'define "IP" :',
                              },
                            ],
                          },
                          {
                            children: [
                              {
                                children: [
                                  {
                                    children: [
                                      {
                                        text: '"Has Qualifying Encounter"',
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                            node_type: "ExpressionRef",
                            ref_id: "31",
                          },
                        ],
                      },
                    ],
                    ref_id: "32",
                  },
                ],
              },
            ],
            define_name: "IP",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: 'define "Denominator" :',
                              },
                            ],
                          },
                          {
                            children: [
                              {
                                children: [
                                  {
                                    children: [
                                      {
                                        text: '"IP"',
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                            node_type: "ExpressionRef",
                            ref_id: "33",
                          },
                        ],
                      },
                    ],
                    ref_id: "34",
                  },
                ],
              },
            ],
            define_name: "Denominator",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: 'define "Denominator Exclusions 1" :',
                              },
                            ],
                          },
                          {
                            children: [
                              {
                                children: [
                                  {
                                    children: [
                                      {
                                        text: '"Has CM Ordered"',
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                            node_type: "ExpressionRef",
                            ref_id: "35",
                          },
                        ],
                      },
                    ],
                    ref_id: "36",
                  },
                ],
              },
            ],
            define_name: "Denominator Exclusions 1",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: 'define "Denominator Exclusions 2" :',
                              },
                            ],
                          },
                          {
                            children: [
                              {
                                children: [
                                  {
                                    children: [
                                      {
                                        text: '"Has CM Performed"',
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                            node_type: "ExpressionRef",
                            ref_id: "37",
                          },
                        ],
                      },
                    ],
                    ref_id: "38",
                  },
                ],
              },
            ],
            define_name: "Denominator Exclusions 2",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: 'define "Numerator" :',
                              },
                            ],
                          },
                          {
                            children: [
                              {
                                children: [
                                  {
                                    children: [
                                      {
                                        text: '"Has Ablation"',
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                            node_type: "ExpressionRef",
                            ref_id: "39",
                          },
                        ],
                      },
                    ],
                    ref_id: "40",
                  },
                ],
              },
            ],
            define_name: "Numerator",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: 'define "Numerator Exclusions 1" :',
                              },
                            ],
                          },
                          {
                            children: [
                              {
                                children: [
                                  {
                                    children: [
                                      {
                                        text: '"Has Anticoagulant Therapy At Discharge"',
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                            node_type: "ExpressionRef",
                            ref_id: "41",
                          },
                        ],
                      },
                    ],
                    ref_id: "42",
                  },
                ],
              },
            ],
            define_name: "Numerator Exclusions 1",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: 'define "Numerator Exclusions 2" :',
                              },
                            ],
                          },
                          {
                            children: [
                              {
                                children: [
                                  {
                                    children: [
                                      {
                                        text: '"Is On Anticoagulant Therapy"',
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                            node_type: "ExpressionRef",
                            ref_id: "43",
                          },
                        ],
                      },
                    ],
                    ref_id: "44",
                  },
                ],
              },
            ],
            define_name: "Numerator Exclusions 2",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: 'define function "Denominator Observation" ():',
                              },
                            ],
                          },
                          {
                            children: [
                              {
                                children: [
                                  {
                                    children: [
                                      {
                                        text: "1",
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                            node_type: "Literal",
                            ref_id: "45",
                          },
                        ],
                      },
                    ],
                    ref_id: "46",
                  },
                ],
              },
            ],
            define_name: "Denominator Observation",
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [
                              {
                                text: 'define function "Numerator Observation" ():',
                              },
                            ],
                          },
                          {
                            children: [
                              {
                                children: [
                                  {
                                    children: [
                                      {
                                        text: "2",
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                            node_type: "Literal",
                            ref_id: "47",
                          },
                        ],
                      },
                    ],
                    ref_id: "48",
                  },
                ],
              },
            ],
            define_name: "Numerator Observation",
          },
        ],
        identifier: {
          id: "RatioObs",
          version: "0.0.000",
        },
      },
    },
  ],
  population_sets: [
    {
      _id: "64de38c099f3ea0000ca555b",
      title: "Population Criteria Section",
      population_set_id: "64de389e21a1fc225b697e6b",
      populations: {
        _id: "64de38c099f3ea0000ca555c",
        IPP: {
          _id: "64de38c099f3ea0000ca555d",
          library_name: "RatioObs",
          statement_name: "IP",
          hqmf_id: null,
        },
        DENOM: {
          _id: "64de38c099f3ea0000ca555e",
          library_name: "RatioObs",
          statement_name: "Denominator",
          hqmf_id: null,
        },
        DENEX: {
          _id: "64de38c099f3ea0000ca555f",
          library_name: "RatioObs",
          statement_name: "Denominator Exclusions 1",
          hqmf_id: null,
        },
        NUMER: {
          _id: "64de38c099f3ea0000ca5560",
          library_name: "RatioObs",
          statement_name: "Numerator",
          hqmf_id: null,
        },
        NUMEX: {
          _id: "64de38c099f3ea0000ca5561",
          library_name: "RatioObs",
          statement_name: "Numerator Exclusions 1",
          hqmf_id: null,
        },
      },
      stratifications: [],
      supplemental_data_elements: [],
      observations: [
        {
          _id: "64de38c099f3ea0000ca5562",
          hqmf_id: null,
          aggregation_type: "Sum",
          observation_function: {
            _id: "64de38c099f3ea0000ca5563",
            library_name: "RatioObs",
            statement_name: "Numerator Observation",
            hqmf_id: null,
          },
          observation_parameter: {
            _id: "64de38c099f3ea0000ca5564",
            library_name: "RatioObs",
            statement_name: "numerator",
            hqmf_id: null,
          },
        },
        {
          _id: "64de38c099f3ea0000ca5565",
          hqmf_id: null,
          aggregation_type: "Sum",
          observation_function: {
            _id: "64de38c099f3ea0000ca5566",
            library_name: "RatioObs",
            statement_name: "Denominator Observation",
            hqmf_id: null,
          },
          observation_parameter: {
            _id: "64de38c099f3ea0000ca5567",
            library_name: "RatioObs",
            statement_name: "denominator",
            hqmf_id: null,
          },
        },
      ],
    },
  ],
  title: "RatioObs",
  description: null,
  cms_id: null,
  main_cql_library: "RatioObs",
  hqmf_set_id: "8c760b2b-ff9b-4a2c-a833-8f262341e0b6",
  calculate_sdes: false,
  measure_period: {
    low: {
      value: "202301010000",
    },
    high: {
      value: "202312312359",
    },
  },
};
