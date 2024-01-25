export const testMeasureLibrary = {
  library_name: "QDMTestMeasure",
  elm: {
    library: {
      identifier: {
        id: "QDMTestMeasure",
        version: "0.0.000",
      },
      statements: {
        def: [
          {
            locator: "15:1-15:15",
            name: "Patient",
            context: "Patient",
            expression: {
              type: "SingletonFrom",
              operand: {
                locator: "15:1-15:15",
                dataType: "{urn:healthit-gov:qdm:v5_6}Patient",
                templateId: "Patient",
                type: "Retrieve",
              },
            },
          },
          {
            localId: "16",
            locator: "29:1-31:67",
            name: "Qualifying Encounters",
            context: "Patient",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "16",
                  s: [
                    {
                      value: [
                        "// single line comment\n",
                        "define ",
                        '"Qualifying Encounters"',
                        ":\n  ",
                      ],
                    },
                    {
                      r: "15",
                      s: [
                        {
                          s: [
                            {
                              r: "10",
                              s: [
                                {
                                  r: "9",
                                  s: [
                                    {
                                      r: "9",
                                      s: [
                                        {
                                          value: [
                                            "[",
                                            '"Encounter, Performed"',
                                            ": ",
                                          ],
                                        },
                                        {
                                          s: [
                                            {
                                              value: ['"Encounter Inpatient"'],
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
                                {
                                  value: [" ", "Encounter"],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          value: ["\n    "],
                        },
                        {
                          r: "14",
                          s: [
                            {
                              value: ["where "],
                            },
                            {
                              r: "14",
                              s: [
                                {
                                  r: "12",
                                  s: [
                                    {
                                      r: "11",
                                      s: [
                                        {
                                          value: ["Encounter"],
                                        },
                                      ],
                                    },
                                    {
                                      value: ["."],
                                    },
                                    {
                                      r: "12",
                                      s: [
                                        {
                                          value: ["relevantPeriod"],
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  r: "14",
                                  value: [" ", "ends during", " "],
                                },
                                {
                                  r: "13",
                                  s: [
                                    {
                                      value: ['"Measurement Period"'],
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
                },
              },
            ],
            resultTypeSpecifier: {
              type: "ListTypeSpecifier",
              elementType: {
                name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                type: "NamedTypeSpecifier",
              },
            },
            expression: {
              localId: "15",
              locator: "30:3-31:67",
              type: "Query",
              resultTypeSpecifier: {
                type: "ListTypeSpecifier",
                elementType: {
                  name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                  type: "NamedTypeSpecifier",
                },
              },
              source: [
                {
                  localId: "10",
                  locator: "30:3-30:59",
                  alias: "Encounter",
                  resultTypeSpecifier: {
                    type: "ListTypeSpecifier",
                    elementType: {
                      name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                      type: "NamedTypeSpecifier",
                    },
                  },
                  expression: {
                    localId: "9",
                    locator: "30:3-30:49",
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
                      locator: "30:28-30:48",
                      resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                      name: "Encounter Inpatient",
                      preserve: true,
                      type: "ValueSetRef",
                    },
                  },
                },
              ],
              relationship: [],
              where: {
                localId: "14",
                locator: "31:5-31:67",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                type: "In",
                operand: [
                  {
                    locator: "31:36-31:39",
                    type: "End",
                    operand: {
                      localId: "12",
                      locator: "31:11-31:34",
                      path: "relevantPeriod",
                      scope: "Encounter",
                      type: "Property",
                      resultTypeSpecifier: {
                        type: "IntervalTypeSpecifier",
                        pointType: {
                          name: "{urn:hl7-org:elm-types:r1}DateTime",
                          type: "NamedTypeSpecifier",
                        },
                      },
                    },
                  },
                  {
                    localId: "13",
                    locator: "31:48-31:67",
                    name: "Measurement Period",
                    type: "ParameterRef",
                    resultTypeSpecifier: {
                      type: "IntervalTypeSpecifier",
                      pointType: {
                        name: "{urn:hl7-org:elm-types:r1}DateTime",
                        type: "NamedTypeSpecifier",
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            localId: "18",
            locator: "18:1-19:25",
            name: "Initial Population",
            context: "Patient",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "18",
                  s: [
                    {
                      value: ["", "define ", '"Initial Population"', ":\n  "],
                    },
                    {
                      r: "17",
                      s: [
                        {
                          value: ['"Qualifying Encounters"'],
                        },
                      ],
                    },
                  ],
                },
              },
            ],
            resultTypeSpecifier: {
              type: "ListTypeSpecifier",
              elementType: {
                name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                type: "NamedTypeSpecifier",
              },
            },
            expression: {
              localId: "17",
              locator: "19:3-19:25",
              name: "Qualifying Encounters",
              type: "ExpressionRef",
              resultTypeSpecifier: {
                type: "ListTypeSpecifier",
                elementType: {
                  name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                  type: "NamedTypeSpecifier",
                },
              },
            },
          },
          {
            localId: "20",
            locator: "21:1-22:22",
            name: "Denominator",
            context: "Patient",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "20",
                  s: [
                    {
                      value: ["", "define ", '"Denominator"', ":\n  "],
                    },
                    {
                      r: "19",
                      s: [
                        {
                          value: ['"Initial Population"'],
                        },
                      ],
                    },
                  ],
                },
              },
            ],
            resultTypeSpecifier: {
              type: "ListTypeSpecifier",
              elementType: {
                name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                type: "NamedTypeSpecifier",
              },
            },
            expression: {
              localId: "19",
              locator: "22:3-22:22",
              name: "Initial Population",
              type: "ExpressionRef",
              resultTypeSpecifier: {
                type: "ListTypeSpecifier",
                elementType: {
                  name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                  type: "NamedTypeSpecifier",
                },
              },
            },
          },
          {
            localId: "28",
            locator: "24:1-26:34",
            name: "Numerator",
            context: "Patient",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "28",
                  s: [
                    {
                      value: ["", "define ", '"Numerator"', ":\n  "],
                    },
                    {
                      r: "27",
                      s: [
                        {
                          s: [
                            {
                              r: "22",
                              s: [
                                {
                                  r: "21",
                                  s: [
                                    {
                                      s: [
                                        {
                                          value: ['"Qualifying Encounters"'],
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  value: [" ", "Enc"],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          value: ["\n    "],
                        },
                        {
                          r: "26",
                          s: [
                            {
                              value: ["where "],
                            },
                            {
                              r: "26",
                              s: [
                                {
                                  r: "24",
                                  s: [
                                    {
                                      r: "23",
                                      s: [
                                        {
                                          value: ["Enc"],
                                        },
                                      ],
                                    },
                                    {
                                      value: ["."],
                                    },
                                    {
                                      r: "24",
                                      s: [
                                        {
                                          value: ["lengthOfStay"],
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  value: [" ", ">", " "],
                                },
                                {
                                  r: "25",
                                  s: [
                                    {
                                      value: ["1 ", "day"],
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
                },
              },
            ],
            resultTypeSpecifier: {
              type: "ListTypeSpecifier",
              elementType: {
                name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                type: "NamedTypeSpecifier",
              },
            },
            expression: {
              localId: "27",
              locator: "25:3-26:34",
              type: "Query",
              resultTypeSpecifier: {
                type: "ListTypeSpecifier",
                elementType: {
                  name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                  type: "NamedTypeSpecifier",
                },
              },
              source: [
                {
                  localId: "22",
                  locator: "25:3-25:29",
                  alias: "Enc",
                  resultTypeSpecifier: {
                    type: "ListTypeSpecifier",
                    elementType: {
                      name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                      type: "NamedTypeSpecifier",
                    },
                  },
                  expression: {
                    localId: "21",
                    locator: "25:3-25:25",
                    name: "Qualifying Encounters",
                    type: "ExpressionRef",
                    resultTypeSpecifier: {
                      type: "ListTypeSpecifier",
                      elementType: {
                        name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                        type: "NamedTypeSpecifier",
                      },
                    },
                  },
                },
              ],
              relationship: [],
              where: {
                localId: "26",
                locator: "26:5-26:34",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                type: "Greater",
                operand: [
                  {
                    localId: "24",
                    locator: "26:11-26:26",
                    resultTypeName: "{urn:hl7-org:elm-types:r1}Quantity",
                    path: "lengthOfStay",
                    scope: "Enc",
                    type: "Property",
                  },
                  {
                    localId: "25",
                    locator: "26:30-26:34",
                    resultTypeName: "{urn:hl7-org:elm-types:r1}Quantity",
                    value: 1,
                    unit: "day",
                    type: "Quantity",
                  },
                ],
              },
            },
          },
          {
            localId: "33",
            locator: "37:1-38:56",
            resultTypeName: "{urn:hl7-org:elm-types:r1}Integer",
            name: "Denominator Observations",
            context: "Patient",
            accessLevel: "Public",
            type: "FunctionDef",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "33",
                  s: [
                    {
                      value: [
                        "/**\n * Test comment 1\n * another comment.\n */\n",
                        'define function "Denominator Observations"(QualifyingEncounter "Encounter, Performed"):\n  ',
                      ],
                    },
                    {
                      r: "32",
                      s: [
                        {
                          r: "32",
                          s: [
                            {
                              value: ["duration in days of "],
                            },
                            {
                              r: "31",
                              s: [
                                {
                                  r: "30",
                                  s: [
                                    {
                                      value: ["QualifyingEncounter"],
                                    },
                                  ],
                                },
                                {
                                  value: ["."],
                                },
                                {
                                  r: "31",
                                  s: [
                                    {
                                      value: ["relevantPeriod"],
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
                },
              },
            ],
            expression: {
              localId: "32",
              locator: "38:3-38:56",
              resultTypeName: "{urn:hl7-org:elm-types:r1}Integer",
              precision: "Day",
              type: "DurationBetween",
              operand: [
                {
                  type: "Start",
                  operand: {
                    localId: "31",
                    locator: "38:23-38:56",
                    path: "relevantPeriod",
                    type: "Property",
                    resultTypeSpecifier: {
                      type: "IntervalTypeSpecifier",
                      pointType: {
                        name: "{urn:hl7-org:elm-types:r1}DateTime",
                        type: "NamedTypeSpecifier",
                      },
                    },
                    source: {
                      localId: "30",
                      locator: "38:23-38:41",
                      resultTypeName:
                        "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                      name: "QualifyingEncounter",
                      type: "OperandRef",
                    },
                  },
                },
                {
                  type: "End",
                  operand: {
                    localId: "31",
                    locator: "38:23-38:56",
                    path: "relevantPeriod",
                    type: "Property",
                    resultTypeSpecifier: {
                      type: "IntervalTypeSpecifier",
                      pointType: {
                        name: "{urn:hl7-org:elm-types:r1}DateTime",
                        type: "NamedTypeSpecifier",
                      },
                    },
                    source: {
                      localId: "30",
                      locator: "38:23-38:41",
                      resultTypeName:
                        "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                      name: "QualifyingEncounter",
                      type: "OperandRef",
                    },
                  },
                },
              ],
            },
            operand: [
              {
                name: "QualifyingEncounter",
                operandTypeSpecifier: {
                  localId: "29",
                  locator: "37:64-37:85",
                  resultTypeName:
                    "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                  name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                  type: "NamedTypeSpecifier",
                },
              },
            ],
          },
          {
            localId: "41",
            locator: "41:1-43:67",
            name: "Unused Encounters",
            context: "Patient",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "41",
                  s: [
                    {
                      value: ["", "define ", '"Unused Encounters"', ":\n  "],
                    },
                    {
                      r: "40",
                      s: [
                        {
                          s: [
                            {
                              r: "35",
                              s: [
                                {
                                  r: "34",
                                  s: [
                                    {
                                      r: "34",
                                      s: [
                                        {
                                          value: [
                                            "[",
                                            '"Encounter, Performed"',
                                            ": ",
                                          ],
                                        },
                                        {
                                          s: [
                                            {
                                              value: ['"Encounter Inpatient"'],
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
                                {
                                  value: [" ", "Encounter"],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          value: ["\n    "],
                        },
                        {
                          r: "39",
                          s: [
                            {
                              value: ["where "],
                            },
                            {
                              r: "39",
                              s: [
                                {
                                  r: "37",
                                  s: [
                                    {
                                      r: "36",
                                      s: [
                                        {
                                          value: ["Encounter"],
                                        },
                                      ],
                                    },
                                    {
                                      value: ["."],
                                    },
                                    {
                                      r: "37",
                                      s: [
                                        {
                                          value: ["relevantPeriod"],
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  r: "39",
                                  value: [" ", "ends during", " "],
                                },
                                {
                                  r: "38",
                                  s: [
                                    {
                                      value: ['"Measurement Period"'],
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
                },
              },
            ],
            resultTypeSpecifier: {
              type: "ListTypeSpecifier",
              elementType: {
                name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                type: "NamedTypeSpecifier",
              },
            },
            expression: {
              localId: "40",
              locator: "42:3-43:67",
              type: "Query",
              resultTypeSpecifier: {
                type: "ListTypeSpecifier",
                elementType: {
                  name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                  type: "NamedTypeSpecifier",
                },
              },
              source: [
                {
                  localId: "35",
                  locator: "42:3-42:59",
                  alias: "Encounter",
                  resultTypeSpecifier: {
                    type: "ListTypeSpecifier",
                    elementType: {
                      name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                      type: "NamedTypeSpecifier",
                    },
                  },
                  expression: {
                    localId: "34",
                    locator: "42:3-42:49",
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
                      locator: "42:28-42:48",
                      resultTypeName: "{urn:hl7-org:elm-types:r1}ValueSet",
                      name: "Encounter Inpatient",
                      preserve: true,
                      type: "ValueSetRef",
                    },
                  },
                },
              ],
              relationship: [],
              where: {
                localId: "39",
                locator: "43:5-43:67",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Boolean",
                type: "In",
                operand: [
                  {
                    locator: "43:36-43:39",
                    type: "End",
                    operand: {
                      localId: "37",
                      locator: "43:11-43:34",
                      path: "relevantPeriod",
                      scope: "Encounter",
                      type: "Property",
                      resultTypeSpecifier: {
                        type: "IntervalTypeSpecifier",
                        pointType: {
                          name: "{urn:hl7-org:elm-types:r1}DateTime",
                          type: "NamedTypeSpecifier",
                        },
                      },
                    },
                  },
                  {
                    localId: "38",
                    locator: "43:48-43:67",
                    name: "Measurement Period",
                    type: "ParameterRef",
                    resultTypeSpecifier: {
                      type: "IntervalTypeSpecifier",
                      pointType: {
                        name: "{urn:hl7-org:elm-types:r1}DateTime",
                        type: "NamedTypeSpecifier",
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
};

export const testMeasureCalculationResult = {
  "group-1": {
    clause_results: {
      QDMTestMeasure: {
        "9": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "9",
          final: "TRUE",
        },
        "10": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "10",
          final: "TRUE",
        },
        "11": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "11",
          final: "TRUE",
        },
        "12": {
          raw: {
            low: "2020-01-09T00:00:00.000+00:00",
            high: "2020-01-10T00:00:00.000+00:00",
            lowClosed: true,
            highClosed: true,
          },
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "12",
          final: "TRUE",
        },
        "13": {
          raw: {
            low: "2020-01-01T00:00:00.000+00:00",
            high: "2020-12-31T23:59:00.000+00:00",
            lowClosed: true,
            highClosed: true,
          },
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "13",
          final: "TRUE",
        },
        "14": {
          raw: true,
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "14",
          final: "TRUE",
        },
        "15": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "15",
          final: "TRUE",
        },
        "16": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "16",
          final: "TRUE",
        },
        "17": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Initial Population",
          library_name: "QDMTestMeasure",
          localId: "17",
          final: "TRUE",
        },
        "18": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Initial Population",
          library_name: "QDMTestMeasure",
          localId: "18",
          final: "TRUE",
        },
        "19": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Denominator",
          library_name: "QDMTestMeasure",
          localId: "19",
          final: "NA",
        },
        "20": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Denominator",
          library_name: "QDMTestMeasure",
          localId: "20",
          final: "NA",
        },
        "21": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "21",
          final: "NA",
        },
        "22": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "22",
          final: "NA",
        },
        "23": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "23",
          final: "NA",
        },
        "24": {
          raw: null,
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "24",
          final: "NA",
        },
        "25": {
          raw: {
            value: 1,
            unit: "day",
          },
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "25",
          final: "NA",
        },
        "26": {
          raw: null,
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "26",
          final: "NA",
        },
        "27": {
          raw: [],
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "27",
          final: "NA",
        },
        "28": {
          raw: [],
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "28",
          final: "NA",
        },
        "29": {
          statement_name: "Denominator Observations",
          library_name: "QDMTestMeasure",
          localId: "29",
          final: "NA",
        },
        "30": {
          statement_name: "Denominator Observations",
          library_name: "QDMTestMeasure",
          localId: "30",
          final: "NA",
        },
        "31": {
          statement_name: "Denominator Observations",
          library_name: "QDMTestMeasure",
          localId: "31",
          final: "NA",
        },
        "32": {
          statement_name: "Denominator Observations",
          library_name: "QDMTestMeasure",
          localId: "32",
          final: "NA",
        },
        "33": {
          statement_name: "Denominator Observations",
          library_name: "QDMTestMeasure",
          localId: "33",
          final: "NA",
        },
        "34": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "34",
          final: "NA",
        },
        "35": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "35",
          final: "NA",
        },
        "36": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "36",
          final: "NA",
        },
        "37": {
          raw: {
            low: "2020-01-09T00:00:00.000+00:00",
            high: "2020-01-10T00:00:00.000+00:00",
            lowClosed: true,
            highClosed: true,
          },
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "37",
          final: "NA",
        },
        "38": {
          raw: {
            low: "2020-01-01T00:00:00.000+00:00",
            high: "2020-12-31T23:59:00.000+00:00",
            lowClosed: true,
            highClosed: true,
          },
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "38",
          final: "NA",
        },
        "39": {
          raw: true,
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "39",
          final: "NA",
        },
        "40": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "40",
          final: "NA",
        },
        "41": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "41",
          final: "NA",
        },
      },
    },
    statement_results: {
      QDMTestMeasure: {
        Patient: {
          library_name: "QDMTestMeasure",
          statement_name: "Patient",
          relevance: "NA",
          final: "NA",
          pretty: "NA",
        },
        "Qualifying Encounters": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          library_name: "QDMTestMeasure",
          statement_name: "Qualifying Encounters",
          relevance: "TRUE",
          final: "TRUE",
          pretty:
            "[Encounter, Performed: Encounter Inpatient\nSTART: 01/09/2020 12:00 AM\nSTOP: 01/10/2020 12:00 AM\nCODE: SNOMEDCT 183452005]",
        },
        "Initial Population": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          library_name: "QDMTestMeasure",
          statement_name: "Initial Population",
          relevance: "TRUE",
          final: "TRUE",
          pretty:
            "[Encounter, Performed: Encounter Inpatient\nSTART: 01/09/2020 12:00 AM\nSTOP: 01/10/2020 12:00 AM\nCODE: SNOMEDCT 183452005]",
        },
        Denominator: {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          library_name: "QDMTestMeasure",
          statement_name: "Denominator",
          relevance: "NA",
          final: "NA",
          pretty: "NA",
        },
        Numerator: {
          raw: [],
          library_name: "QDMTestMeasure",
          statement_name: "Numerator",
          relevance: "NA",
          final: "NA",
          pretty: "NA",
        },
        "Denominator Observations": {
          library_name: "QDMTestMeasure",
          statement_name: "Denominator Observations",
          relevance: "NA",
          final: "NA",
          pretty: "NA",
        },
        "Unused Encounters": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          library_name: "QDMTestMeasure",
          statement_name: "Unused Encounters",
          relevance: "NA",
          final: "NA",
          pretty: "NA",
        },
      },
    },
  },
  "group-2": {
    clause_results: {
      QDMTestMeasure: {
        "9": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "9",
          final: "TRUE",
        },
        "10": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "10",
          final: "TRUE",
        },
        "11": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "11",
          final: "TRUE",
        },
        "12": {
          raw: {
            low: "2020-01-09T00:00:00.000+00:00",
            high: "2020-01-10T00:00:00.000+00:00",
            lowClosed: true,
            highClosed: true,
          },
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "12",
          final: "TRUE",
        },
        "13": {
          raw: {
            low: "2020-01-01T00:00:00.000+00:00",
            high: "2020-12-31T23:59:00.000+00:00",
            lowClosed: true,
            highClosed: true,
          },
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "13",
          final: "TRUE",
        },
        "14": {
          raw: true,
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "14",
          final: "TRUE",
        },
        "15": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "15",
          final: "TRUE",
        },
        "16": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Qualifying Encounters",
          library_name: "QDMTestMeasure",
          localId: "16",
          final: "TRUE",
        },
        "17": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Initial Population",
          library_name: "QDMTestMeasure",
          localId: "17",
          final: "NA",
        },
        "18": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Initial Population",
          library_name: "QDMTestMeasure",
          localId: "18",
          final: "NA",
        },
        "19": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Denominator",
          library_name: "QDMTestMeasure",
          localId: "19",
          final: "NA",
        },
        "20": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Denominator",
          library_name: "QDMTestMeasure",
          localId: "20",
          final: "NA",
        },
        "21": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "21",
          final: "NA",
        },
        "22": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "22",
          final: "NA",
        },
        "23": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "23",
          final: "NA",
        },
        "24": {
          raw: null,
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "24",
          final: "NA",
        },
        "25": {
          raw: {
            value: 1,
            unit: "day",
          },
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "25",
          final: "NA",
        },
        "26": {
          raw: null,
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "26",
          final: "NA",
        },
        "27": {
          raw: [],
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "27",
          final: "NA",
        },
        "28": {
          raw: [],
          statement_name: "Numerator",
          library_name: "QDMTestMeasure",
          localId: "28",
          final: "NA",
        },
        "29": {
          statement_name: "Denominator Observations",
          library_name: "QDMTestMeasure",
          localId: "29",
          final: "NA",
        },
        "30": {
          statement_name: "Denominator Observations",
          library_name: "QDMTestMeasure",
          localId: "30",
          final: "NA",
        },
        "31": {
          statement_name: "Denominator Observations",
          library_name: "QDMTestMeasure",
          localId: "31",
          final: "NA",
        },
        "32": {
          statement_name: "Denominator Observations",
          library_name: "QDMTestMeasure",
          localId: "32",
          final: "NA",
        },
        "33": {
          statement_name: "Denominator Observations",
          library_name: "QDMTestMeasure",
          localId: "33",
          final: "NA",
        },
        "34": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "34",
          final: "NA",
        },
        "35": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "35",
          final: "NA",
        },
        "36": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "36",
          final: "NA",
        },
        "37": {
          raw: {
            low: "2020-01-09T00:00:00.000+00:00",
            high: "2020-01-10T00:00:00.000+00:00",
            lowClosed: true,
            highClosed: true,
          },
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "37",
          final: "NA",
        },
        "38": {
          raw: {
            low: "2020-01-01T00:00:00.000+00:00",
            high: "2020-12-31T23:59:00.000+00:00",
            lowClosed: true,
            highClosed: true,
          },
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "38",
          final: "NA",
        },
        "39": {
          raw: true,
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "39",
          final: "NA",
        },
        "40": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "40",
          final: "NA",
        },
        "41": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          statement_name: "Unused Encounters",
          library_name: "QDMTestMeasure",
          localId: "41",
          final: "NA",
        },
      },
    },
    statement_results: {
      QDMTestMeasure: {
        Patient: {
          library_name: "QDMTestMeasure",
          statement_name: "Patient",
          relevance: "NA",
          final: "NA",
          pretty: "NA",
        },
        "Qualifying Encounters": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          library_name: "QDMTestMeasure",
          statement_name: "Qualifying Encounters",
          relevance: "TRUE",
          final: "TRUE",
          pretty:
            "[Encounter, Performed: Encounter Inpatient\nSTART: 01/09/2020 12:00 AM\nSTOP: 01/10/2020 12:00 AM\nCODE: SNOMEDCT 183452005]",
        },
        "Initial Population": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          library_name: "QDMTestMeasure",
          statement_name: "Initial Population",
          relevance: "NA",
          final: "NA",
          pretty: "NA",
        },
        Denominator: {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          library_name: "QDMTestMeasure",
          statement_name: "Denominator",
          relevance: "NA",
          final: "NA",
          pretty: "NA",
        },
        Numerator: {
          raw: [],
          library_name: "QDMTestMeasure",
          statement_name: "Numerator",
          relevance: "NA",
          final: "NA",
          pretty: "NA",
        },
        "Denominator Observations": {
          library_name: "QDMTestMeasure",
          statement_name: "Denominator Observations",
          relevance: "NA",
          final: "NA",
          pretty: "NA",
        },
        "Unused Encounters": {
          raw: [
            {
              dataElementCodes: [
                {
                  code: "183452005",
                  system: "2.16.840.1.113883.6.96",
                  version: null,
                  display: "Emergency hospital admission (procedure)",
                },
              ],
              _id: "658222799d67250000a656eb",
              participant: [],
              relatedTo: [],
              qdmTitle: "Encounter, Performed",
              hqmfOid: "2.16.840.1.113883.10.20.28.4.5",
              qdmCategory: "encounter",
              qdmStatus: "performed",
              qdmVersion: "5.6",
              _type: "QDM::EncounterPerformed",
              description: "Encounter, Performed: Encounter Inpatient",
              codeListId: "2.16.840.1.113883.3.666.5.307",
              id: "658222799d67250000a656ea",
              facilityLocations: [],
              diagnoses: [],
              relevantPeriod: {
                low: "2020-01-09T00:00:00.000+00:00",
                high: "2020-01-10T00:00:00.000+00:00",
                lowClosed: true,
                highClosed: true,
              },
            },
          ],
          library_name: "QDMTestMeasure",
          statement_name: "Unused Encounters",
          relevance: "NA",
          final: "NA",
          pretty: "NA",
        },
      },
    },
  },
};

export const ipHighlighting = `<pre style="tab-size: 2;"
  data-library-name="QDMTestMeasure" data-statement-name="Initial Population">
<code>
<span data-ref-id="18" style="color:#4D7E23;border-bottom-color:#4D7E23;border-bottom-width:3px"><span>define &quot;Initial Population&quot;:
  </span><span data-ref-id="17" style="color:#4D7E23;border-bottom-color:#4D7E23;border-bottom-width:3px"><span>&quot;Qualifying Encounters&quot;</span></span></span></code>
</pre>`;
