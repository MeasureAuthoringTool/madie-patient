import { parse } from "./ElmParser";
import { JSONPath } from "jsonpath-plus";

describe("CqmConversionService", () => {
  const elmJsonSmall = {
    library: {
      annotation: [
        {
          translatorOptions:
            "EnableAnnotations,EnableLocators,DisableListDemotion,DisableListPromotion,DisableMethodInvocation",
          type: "CqlToElmInfo",
        },
        {
          type: "Annotation",
          s: {
            r: "185",
            s: [{ value: ["", "library PancakeMeasure version '0.0.002'"] }],
          },
        },
      ],
      identifier: { id: "PancakeMeasure", version: "0.0.002" },
      schemaIdentifier: { id: "urn:hl7-org:elm", version: "r1" },
      usings: {
        def: [
          { localIdentifier: "System", uri: "urn:hl7-org:elm-types:r1" },
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
                    { value: ["", "using "] },
                    { s: [{ value: ["QDM"] }] },
                    { value: [" version ", "'5.6'"] },
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
            localId: "13",
            locator: "15:1-15:49",
            name: "Measurement Period",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "13",
                  s: [
                    { value: ["", "parameter ", '"Measurement Period"', " "] },
                    {
                      r: "12",
                      s: [
                        { value: ["Interval<"] },
                        { r: "11", s: [{ value: ["DateTime"] }] },
                        { value: [">"] },
                      ],
                    },
                  ],
                },
              },
            ],
            parameterTypeSpecifier: {
              localId: "12",
              locator: "15:32-15:49",
              type: "IntervalTypeSpecifier",
              pointType: {
                localId: "11",
                locator: "15:41-15:48",
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
            locator: "5:1-5:67",
            name: "Chemistry Tests",
            id: "urn:oid:2.16.840.1.113762.1.4.1147.82",
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
                        '"Chemistry Tests"',
                        ": ",
                        "'urn:oid:2.16.840.1.113762.1.4.1147.82'",
                      ],
                    },
                  ],
                },
              },
            ],
          },
          {
            localId: "3",
            locator: "6:1-6:82",
            name: "Emergency Department Visit",
            id: "urn:oid:2.16.840.1.113883.3.117.1.7.1.292",
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
                        '"Emergency Department Visit"',
                        ": ",
                        "'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'",
                      ],
                    },
                  ],
                },
              },
            ],
          },
          {
            localId: "4",
            locator: "7:1-7:71",
            name: "Encounter Inpatient",
            id: "urn:oid:2.16.840.1.113883.3.666.5.307",
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
                        '"Encounter Inpatient"',
                        ": ",
                        "'urn:oid:2.16.840.1.113883.3.666.5.307'",
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
            locator: "9:1-9:70",
            name: "Lab Communications",
            id: "urn:oid:2.16.840.1.113762.1.4.1147.61",
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
                        '"Lab Communications"',
                        ": ",
                        "'urn:oid:2.16.840.1.113762.1.4.1147.61'",
                      ],
                    },
                  ],
                },
              },
            ],
          },
          {
            localId: "7",
            locator: "10:1-10:73",
            name: "Observation Services",
            id: "urn:oid:2.16.840.1.113762.1.4.1111.143",
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
                        '"Observation Services"',
                        ": ",
                        "'urn:oid:2.16.840.1.113762.1.4.1111.143'",
                      ],
                    },
                  ],
                },
              },
            ],
          },
          {
            localId: "8",
            locator: "11:1-11:68",
            name: "ONC Administrative Sex",
            id: "urn:oid:2.16.840.1.113762.1.4.1",
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
            localId: "9",
            locator: "12:1-12:55",
            name: "Payer",
            id: "urn:oid:2.16.840.1.114222.4.11.3591",
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
                        '"Payer"',
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
            localId: "10",
            locator: "13:1-13:53",
            name: "Race",
            id: "urn:oid:2.16.840.1.114222.4.11.836",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "10",
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
      contexts: { def: [{ locator: "17:1-17:15", name: "Patient" }] },
      statements: {
        def: [
          {
            locator: "17:1-17:15",
            name: "Patient",
            context: "Patient",
            expression: {
              type: "SingletonFrom",
              operand: {
                locator: "17:1-17:15",
                dataType: "{urn:healthit-gov:qdm:v5_6}Patient",
                templateId: "Patient",
                type: "Retrieve",
              },
            },
          },
          {
            localId: "15",
            locator: "19:1-20:51",
            name: "SDE Ethnicity",
            context: "Patient",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "15",
                  s: [
                    { value: ["", "define ", '"SDE Ethnicity"', ":\n  "] },
                    {
                      r: "14",
                      s: [
                        {
                          value: [
                            "[",
                            '"Patient Characteristic Ethnicity"',
                            ": ",
                          ],
                        },
                        { s: [{ value: ['"Ethnicity"'] }] },
                        { value: ["]"] },
                      ],
                    },
                  ],
                },
              },
            ],
            expression: {
              localId: "14",
              locator: "20:3-20:51",
              dataType:
                "{urn:healthit-gov:qdm:v5_6}PatientCharacteristicEthnicity",
              codeProperty: "code",
              codeComparator: "in",
              type: "Retrieve",
              codes: {
                locator: "20:40-20:50",
                name: "Ethnicity",
                type: "ValueSetRef",
              },
            },
          },
        ],
      },
    },
  };

  const elmJson = {
    library: {
      annotation: [
        {
          translatorOptions:
            "EnableAnnotations,EnableLocators,DisableListDemotion,DisableListPromotion,DisableMethodInvocation",
          type: "CqlToElmInfo",
        },
        {
          type: "Annotation",
          s: {
            r: "185",
            s: [{ value: ["", "library PancakeMeasure version '0.0.002'"] }],
          },
        },
      ],
      identifier: { id: "PancakeMeasure", version: "0.0.002" },
      schemaIdentifier: { id: "urn:hl7-org:elm", version: "r1" },
      usings: {
        def: [
          { localIdentifier: "System", uri: "urn:hl7-org:elm-types:r1" },
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
                    { value: ["", "using "] },
                    { s: [{ value: ["QDM"] }] },
                    { value: [" version ", "'5.6'"] },
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
            localId: "13",
            locator: "15:1-15:49",
            name: "Measurement Period",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "13",
                  s: [
                    { value: ["", "parameter ", '"Measurement Period"', " "] },
                    {
                      r: "12",
                      s: [
                        { value: ["Interval<"] },
                        { r: "11", s: [{ value: ["DateTime"] }] },
                        { value: [">"] },
                      ],
                    },
                  ],
                },
              },
            ],
            parameterTypeSpecifier: {
              localId: "12",
              locator: "15:32-15:49",
              type: "IntervalTypeSpecifier",
              pointType: {
                localId: "11",
                locator: "15:41-15:48",
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
            locator: "5:1-5:67",
            name: "Chemistry Tests",
            id: "urn:oid:2.16.840.1.113762.1.4.1147.82",
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
                        '"Chemistry Tests"',
                        ": ",
                        "'urn:oid:2.16.840.1.113762.1.4.1147.82'",
                      ],
                    },
                  ],
                },
              },
            ],
          },
          {
            localId: "3",
            locator: "6:1-6:82",
            name: "Emergency Department Visit",
            id: "urn:oid:2.16.840.1.113883.3.117.1.7.1.292",
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
                        '"Emergency Department Visit"',
                        ": ",
                        "'urn:oid:2.16.840.1.113883.3.117.1.7.1.292'",
                      ],
                    },
                  ],
                },
              },
            ],
          },
          {
            localId: "4",
            locator: "7:1-7:71",
            name: "Encounter Inpatient",
            id: "urn:oid:2.16.840.1.113883.3.666.5.307",
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
                        '"Encounter Inpatient"',
                        ": ",
                        "'urn:oid:2.16.840.1.113883.3.666.5.307'",
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
            locator: "9:1-9:70",
            name: "Lab Communications",
            id: "urn:oid:2.16.840.1.113762.1.4.1147.61",
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
                        '"Lab Communications"',
                        ": ",
                        "'urn:oid:2.16.840.1.113762.1.4.1147.61'",
                      ],
                    },
                  ],
                },
              },
            ],
          },
          {
            localId: "7",
            locator: "10:1-10:73",
            name: "Observation Services",
            id: "urn:oid:2.16.840.1.113762.1.4.1111.143",
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
                        '"Observation Services"',
                        ": ",
                        "'urn:oid:2.16.840.1.113762.1.4.1111.143'",
                      ],
                    },
                  ],
                },
              },
            ],
          },
          {
            localId: "8",
            locator: "11:1-11:68",
            name: "ONC Administrative Sex",
            id: "urn:oid:2.16.840.1.113762.1.4.1",
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
            localId: "9",
            locator: "12:1-12:55",
            name: "Payer",
            id: "urn:oid:2.16.840.1.114222.4.11.3591",
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
                        '"Payer"',
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
            localId: "10",
            locator: "13:1-13:53",
            name: "Race",
            id: "urn:oid:2.16.840.1.114222.4.11.836",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "10",
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
      contexts: { def: [{ locator: "17:1-17:15", name: "Patient" }] },
      statements: {
        def: [
          {
            locator: "17:1-17:15",
            name: "Patient",
            context: "Patient",
            expression: {
              type: "SingletonFrom",
              operand: {
                locator: "17:1-17:15",
                dataType: "{urn:healthit-gov:qdm:v5_6}Patient",
                templateId: "Patient",
                type: "Retrieve",
              },
            },
          },
          {
            localId: "15",
            locator: "19:1-20:51",
            name: "SDE Ethnicity",
            context: "Patient",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "15",
                  s: [
                    { value: ["", "define ", '"SDE Ethnicity"', ":\n  "] },
                    {
                      r: "14",
                      s: [
                        {
                          value: [
                            "[",
                            '"Patient Characteristic Ethnicity"',
                            ": ",
                          ],
                        },
                        { s: [{ value: ['"Ethnicity"'] }] },
                        { value: ["]"] },
                      ],
                    },
                  ],
                },
              },
            ],
            expression: {
              localId: "14",
              locator: "20:3-20:51",
              dataType:
                "{urn:healthit-gov:qdm:v5_6}PatientCharacteristicEthnicity",
              codeProperty: "code",
              codeComparator: "in",
              type: "Retrieve",
              codes: {
                locator: "20:40-20:50",
                name: "Ethnicity",
                type: "ValueSetRef",
              },
            },
          },
          {
            localId: "17",
            locator: "22:1-23:43",
            name: "SDE Payer",
            context: "Patient",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "17",
                  s: [
                    { value: ["", "define ", '"SDE Payer"', ":\n  "] },
                    {
                      r: "16",
                      s: [
                        {
                          value: ["[", '"Patient Characteristic Payer"', ": "],
                        },
                        { s: [{ value: ['"Payer"'] }] },
                        { value: ["]"] },
                      ],
                    },
                  ],
                },
              },
            ],
            expression: {
              localId: "16",
              locator: "23:3-23:43",
              dataType: "{urn:healthit-gov:qdm:v5_6}PatientCharacteristicPayer",
              codeProperty: "code",
              codeComparator: "in",
              type: "Retrieve",
              codes: {
                locator: "23:36-23:42",
                name: "Payer",
                type: "ValueSetRef",
              },
            },
          },
          {
            localId: "19",
            locator: "25:1-26:41",
            name: "SDE Race",
            context: "Patient",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "19",
                  s: [
                    { value: ["", "define ", '"SDE Race"', ":\n  "] },
                    {
                      r: "18",
                      s: [
                        { value: ["[", '"Patient Characteristic Race"', ": "] },
                        { s: [{ value: ['"Race"'] }] },
                        { value: ["]"] },
                      ],
                    },
                  ],
                },
              },
            ],
            expression: {
              localId: "18",
              locator: "26:3-26:41",
              dataType: "{urn:healthit-gov:qdm:v5_6}PatientCharacteristicRace",
              codeProperty: "code",
              codeComparator: "in",
              type: "Retrieve",
              codes: {
                locator: "26:35-26:40",
                name: "Race",
                type: "ValueSetRef",
              },
            },
          },
          {
            localId: "21",
            locator: "28:1-29:58",
            name: "SDE Sex",
            context: "Patient",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "21",
                  s: [
                    { value: ["", "define ", '"SDE Sex"', ":\n  "] },
                    {
                      r: "20",
                      s: [
                        { value: ["[", '"Patient Characteristic Sex"', ": "] },
                        { s: [{ value: ['"ONC Administrative Sex"'] }] },
                        { value: ["]"] },
                      ],
                    },
                  ],
                },
              },
            ],
            expression: {
              localId: "20",
              locator: "29:3-29:58",
              dataType: "{urn:healthit-gov:qdm:v5_6}PatientCharacteristicSex",
              codeProperty: "code",
              codeComparator: "in",
              type: "Retrieve",
              codes: {
                locator: "29:34-29:57",
                name: "ONC Administrative Sex",
                type: "ValueSetRef",
              },
            },
          },
          {
            localId: "33",
            locator: "39:1-43:67",
            name: "Qualifying Encounters",
            context: "Patient",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "33",
                  s: [
                    {
                      value: [
                        "",
                        "define ",
                        '"Qualifying Encounters"',
                        ":\n  ",
                      ],
                    },
                    {
                      r: "32",
                      s: [
                        {
                          s: [
                            {
                              r: "27",
                              s: [
                                {
                                  r: "26",
                                  s: [
                                    { value: ["( "] },
                                    {
                                      r: "26",
                                      s: [
                                        {
                                          r: "24",
                                          s: [
                                            {
                                              r: "22",
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
                                                      value: [
                                                        '"Encounter Inpatient"',
                                                      ],
                                                    },
                                                  ],
                                                },
                                                { value: ["]"] },
                                              ],
                                            },
                                            { value: ["\n    union "] },
                                            {
                                              r: "23",
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
                                                      value: [
                                                        '"Emergency Department Visit"',
                                                      ],
                                                    },
                                                  ],
                                                },
                                                { value: ["]"] },
                                              ],
                                            },
                                          ],
                                        },
                                        { value: ["\n    union "] },
                                        {
                                          r: "25",
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
                                                  value: [
                                                    '"Observation Services"',
                                                  ],
                                                },
                                              ],
                                            },
                                            { value: ["]"] },
                                          ],
                                        },
                                      ],
                                    },
                                    { value: [" )"] },
                                  ],
                                },
                                { value: [" ", "Encounter"] },
                              ],
                            },
                          ],
                        },
                        { value: ["\n    "] },
                        {
                          r: "31",
                          s: [
                            { value: ["where "] },
                            {
                              r: "31",
                              s: [
                                {
                                  r: "29",
                                  s: [
                                    { r: "28", s: [{ value: ["Encounter"] }] },
                                    { value: ["."] },
                                    {
                                      r: "29",
                                      s: [{ value: ["relevantPeriod"] }],
                                    },
                                  ],
                                },
                                { r: "31", value: [" ", "ends during", " "] },
                                {
                                  r: "30",
                                  s: [{ value: ['"Measurement Period"'] }],
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
              locator: "40:3-43:67",
              type: "Query",
              source: [
                {
                  localId: "27",
                  locator: "40:3-42:70",
                  alias: "Encounter",
                  expression: {
                    localId: "26",
                    locator: "40:3-42:60",
                    type: "Union",
                    operand: [
                      {
                        localId: "24",
                        locator: "40:5-41:64",
                        type: "Union",
                        operand: [
                          {
                            localId: "22",
                            locator: "40:5-40:51",
                            dataType:
                              "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                            templateId: "PositiveEncounterPerformed",
                            codeProperty: "code",
                            codeComparator: "in",
                            type: "Retrieve",
                            codes: {
                              locator: "40:30-40:50",
                              name: "Encounter Inpatient",
                              type: "ValueSetRef",
                            },
                          },
                          {
                            localId: "23",
                            locator: "41:11-41:64",
                            dataType:
                              "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                            templateId: "PositiveEncounterPerformed",
                            codeProperty: "code",
                            codeComparator: "in",
                            type: "Retrieve",
                            codes: {
                              locator: "41:36-41:63",
                              name: "Emergency Department Visit",
                              type: "ValueSetRef",
                            },
                          },
                        ],
                      },
                      {
                        localId: "25",
                        locator: "42:11-42:58",
                        dataType:
                          "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                        templateId: "PositiveEncounterPerformed",
                        codeProperty: "code",
                        codeComparator: "in",
                        type: "Retrieve",
                        codes: {
                          locator: "42:36-42:57",
                          name: "Observation Services",
                          type: "ValueSetRef",
                        },
                      },
                    ],
                  },
                },
              ],
              relationship: [],
              where: {
                localId: "31",
                locator: "43:5-43:67",
                type: "In",
                operand: [
                  {
                    locator: "43:36-43:39",
                    type: "End",
                    operand: {
                      localId: "29",
                      locator: "43:11-43:34",
                      path: "relevantPeriod",
                      scope: "Encounter",
                      type: "Property",
                    },
                  },
                  {
                    localId: "30",
                    locator: "43:48-43:67",
                    name: "Measurement Period",
                    type: "ParameterRef",
                  },
                ],
              },
            },
          },
          {
            localId: "49",
            locator: "51:1-54:73",
            name: "Chemistry Laboratory Tests",
            context: "Patient",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "49",
                  s: [
                    {
                      value: [
                        "",
                        "define ",
                        '"Chemistry Laboratory Tests"',
                        ":\n  ",
                      ],
                    },
                    {
                      r: "48",
                      s: [
                        {
                          s: [
                            {
                              r: "39",
                              s: [
                                {
                                  r: "38",
                                  s: [
                                    {
                                      r: "38",
                                      s: [
                                        {
                                          value: [
                                            "[",
                                            '"Laboratory Test, Performed"',
                                            ": ",
                                          ],
                                        },
                                        {
                                          s: [{ value: ['"Chemistry Tests"'] }],
                                        },
                                        { value: ["]"] },
                                      ],
                                    },
                                  ],
                                },
                                { value: [" ", "ChemTests"] },
                              ],
                            },
                          ],
                        },
                        { value: ["\n    "] },
                        {
                          r: "47",
                          s: [
                            { value: ["with "] },
                            {
                              r: "41",
                              s: [
                                {
                                  r: "40",
                                  s: [
                                    {
                                      s: [
                                        { value: ['"Qualifying Encounters"'] },
                                      ],
                                    },
                                  ],
                                },
                                { value: [" ", "Encounters"] },
                              ],
                            },
                            { value: ["\n      such that "] },
                            {
                              r: "46",
                              s: [
                                {
                                  r: "43",
                                  s: [
                                    { r: "42", s: [{ value: ["ChemTests"] }] },
                                    { value: ["."] },
                                    {
                                      r: "43",
                                      s: [{ value: ["resultDatetime"] }],
                                    },
                                  ],
                                },
                                { r: "46", value: [" ", "during", " "] },
                                {
                                  r: "45",
                                  s: [
                                    { r: "44", s: [{ value: ["Encounters"] }] },
                                    { value: ["."] },
                                    {
                                      r: "45",
                                      s: [{ value: ["relevantPeriod"] }],
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
              localId: "48",
              locator: "52:3-54:73",
              type: "Query",
              source: [
                {
                  localId: "39",
                  locator: "52:3-52:61",
                  alias: "ChemTests",
                  expression: {
                    localId: "38",
                    locator: "52:3-52:51",
                    dataType:
                      "{urn:healthit-gov:qdm:v5_6}PositiveLaboratoryTestPerformed",
                    templateId: "PositiveLaboratoryTestPerformed",
                    codeProperty: "code",
                    codeComparator: "in",
                    type: "Retrieve",
                    codes: {
                      locator: "52:34-52:50",
                      name: "Chemistry Tests",
                      type: "ValueSetRef",
                    },
                  },
                },
              ],
              relationship: [
                {
                  localId: "47",
                  locator: "53:5-54:73",
                  alias: "Encounters",
                  type: "With",
                  expression: {
                    localId: "40",
                    locator: "53:10-53:32",
                    name: "Qualifying Encounters",
                    type: "ExpressionRef",
                  },
                  suchThat: {
                    localId: "46",
                    locator: "54:17-54:73",
                    type: "In",
                    operand: [
                      {
                        localId: "43",
                        locator: "54:17-54:40",
                        path: "resultDatetime",
                        scope: "ChemTests",
                        type: "Property",
                      },
                      {
                        localId: "45",
                        locator: "54:49-54:73",
                        path: "relevantPeriod",
                        scope: "Encounters",
                        type: "Property",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            localId: "65",
            locator: "45:1-49:77",
            name: "Communication",
            context: "Patient",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "65",
                  s: [
                    { value: ["", "define ", '"Communication"', ":\n  "] },
                    {
                      r: "64",
                      s: [
                        {
                          s: [
                            {
                              r: "37",
                              s: [
                                {
                                  r: "36",
                                  s: [
                                    {
                                      r: "36",
                                      s: [
                                        {
                                          value: [
                                            "[",
                                            '"Communication, Performed"',
                                            ": ",
                                          ],
                                        },
                                        {
                                          s: [
                                            { value: ['"Lab Communications"'] },
                                          ],
                                        },
                                        { value: ["]"] },
                                      ],
                                    },
                                  ],
                                },
                                { value: [" ", "ValueCommunication"] },
                              ],
                            },
                          ],
                        },
                        { value: ["\n    "] },
                        {
                          r: "63",
                          s: [
                            { value: ["with "] },
                            {
                              r: "51",
                              s: [
                                {
                                  r: "50",
                                  s: [
                                    {
                                      s: [
                                        {
                                          value: [
                                            '"Chemistry Laboratory Tests"',
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                                { value: [" ", "ChemLabTests"] },
                              ],
                            },
                            { value: ["\n      such that "] },
                            {
                              r: "62",
                              s: [
                                {
                                  r: "56",
                                  s: [
                                    {
                                      r: "53",
                                      s: [
                                        {
                                          r: "52",
                                          s: [{ value: ["ChemLabTests"] }],
                                        },
                                        { value: ["."] },
                                        { r: "53", s: [{ value: ["id"] }] },
                                      ],
                                    },
                                    { value: [" in "] },
                                    {
                                      r: "55",
                                      s: [
                                        {
                                          r: "54",
                                          s: [
                                            { value: ["ValueCommunication"] },
                                          ],
                                        },
                                        { value: ["."] },
                                        {
                                          r: "55",
                                          s: [{ value: ["relatedTo"] }],
                                        },
                                      ],
                                    },
                                  ],
                                },
                                { value: ["\n        and "] },
                                {
                                  r: "61",
                                  s: [
                                    {
                                      r: "58",
                                      s: [
                                        {
                                          r: "57",
                                          s: [
                                            { value: ["ValueCommunication"] },
                                          ],
                                        },
                                        { value: ["."] },
                                        {
                                          r: "58",
                                          s: [{ value: ["sentDatetime"] }],
                                        },
                                      ],
                                    },
                                    { r: "61", value: [" ", "after", " "] },
                                    {
                                      r: "60",
                                      s: [
                                        {
                                          r: "59",
                                          s: [{ value: ["ChemLabTests"] }],
                                        },
                                        { value: ["."] },
                                        {
                                          r: "60",
                                          s: [{ value: ["resultDatetime"] }],
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
                  ],
                },
              },
            ],
            expression: {
              localId: "64",
              locator: "46:3-49:77",
              type: "Query",
              source: [
                {
                  localId: "37",
                  locator: "46:3-46:71",
                  alias: "ValueCommunication",
                  expression: {
                    localId: "36",
                    locator: "46:3-46:52",
                    dataType:
                      "{urn:healthit-gov:qdm:v5_6}PositiveCommunicationPerformed",
                    templateId: "PositiveCommunicationPerformed",
                    codeProperty: "code",
                    codeComparator: "in",
                    type: "Retrieve",
                    codes: {
                      locator: "46:32-46:51",
                      name: "Lab Communications",
                      type: "ValueSetRef",
                    },
                  },
                },
              ],
              relationship: [
                {
                  localId: "63",
                  locator: "47:5-49:77",
                  alias: "ChemLabTests",
                  type: "With",
                  expression: {
                    localId: "50",
                    locator: "47:10-47:37",
                    name: "Chemistry Laboratory Tests",
                    type: "ExpressionRef",
                  },
                  suchThat: {
                    localId: "62",
                    locator: "48:17-49:77",
                    type: "And",
                    operand: [
                      {
                        localId: "56",
                        locator: "48:17-48:63",
                        type: "In",
                        operand: [
                          {
                            localId: "53",
                            locator: "48:17-48:31",
                            path: "id",
                            scope: "ChemLabTests",
                            type: "Property",
                          },
                          {
                            localId: "55",
                            locator: "48:36-48:63",
                            path: "relatedTo",
                            scope: "ValueCommunication",
                            type: "Property",
                          },
                        ],
                      },
                      {
                        localId: "61",
                        locator: "49:13-49:77",
                        type: "After",
                        operand: [
                          {
                            localId: "58",
                            locator: "49:13-49:43",
                            path: "sentDatetime",
                            scope: "ValueCommunication",
                            type: "Property",
                          },
                          {
                            localId: "60",
                            locator: "49:51-49:77",
                            path: "resultDatetime",
                            scope: "ChemLabTests",
                            type: "Property",
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            localId: "75",
            locator: "31:1-34:80",
            name: "Initial Population",
            context: "Patient",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "75",
                  s: [
                    { value: ["", "define ", '"Initial Population"', ":\n  "] },
                    {
                      r: "74",
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
                                      s: [
                                        { value: ['"Qualifying Encounters"'] },
                                      ],
                                    },
                                  ],
                                },
                                { value: [" ", "QEncounters"] },
                              ],
                            },
                          ],
                        },
                        { value: ["\n    "] },
                        {
                          r: "73",
                          s: [
                            { value: ["with "] },
                            {
                              r: "67",
                              s: [
                                {
                                  r: "66",
                                  s: [{ s: [{ value: ['"Communication"'] }] }],
                                },
                                { value: [" ", "ValueCommunicated"] },
                              ],
                            },
                            { value: ["\n      such that "] },
                            {
                              r: "72",
                              s: [
                                {
                                  r: "69",
                                  s: [
                                    {
                                      r: "68",
                                      s: [{ value: ["ValueCommunicated"] }],
                                    },
                                    { value: ["."] },
                                    {
                                      r: "69",
                                      s: [{ value: ["sentDatetime"] }],
                                    },
                                  ],
                                },
                                { r: "72", value: [" ", "during", " "] },
                                {
                                  r: "71",
                                  s: [
                                    {
                                      r: "70",
                                      s: [{ value: ["QEncounters"] }],
                                    },
                                    { value: ["."] },
                                    {
                                      r: "71",
                                      s: [{ value: ["relevantPeriod"] }],
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
              localId: "74",
              locator: "32:3-34:80",
              type: "Query",
              source: [
                {
                  localId: "35",
                  locator: "32:3-32:37",
                  alias: "QEncounters",
                  expression: {
                    localId: "34",
                    locator: "32:3-32:25",
                    name: "Qualifying Encounters",
                    type: "ExpressionRef",
                  },
                },
              ],
              relationship: [
                {
                  localId: "73",
                  locator: "33:5-34:80",
                  alias: "ValueCommunicated",
                  type: "With",
                  expression: {
                    localId: "66",
                    locator: "33:10-33:24",
                    name: "Communication",
                    type: "ExpressionRef",
                  },
                  suchThat: {
                    localId: "72",
                    locator: "34:17-34:80",
                    type: "In",
                    operand: [
                      {
                        localId: "69",
                        locator: "34:17-34:46",
                        path: "sentDatetime",
                        scope: "ValueCommunicated",
                        type: "Property",
                      },
                      {
                        localId: "71",
                        locator: "34:55-34:80",
                        path: "relevantPeriod",
                        scope: "QEncounters",
                        type: "Property",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            localId: "77",
            locator: "36:1-37:22",
            name: "Measure Population",
            context: "Patient",
            accessLevel: "Public",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "77",
                  s: [
                    { value: ["", "define ", '"Measure Population"', ":\n  "] },
                    { r: "76", s: [{ value: ['"Initial Population"'] }] },
                  ],
                },
              },
            ],
            expression: {
              localId: "76",
              locator: "37:3-37:22",
              name: "Initial Population",
              type: "ExpressionRef",
            },
          },
          {
            localId: "131",
            locator: "56:1-70:3",
            name: "Measure Observation",
            context: "Patient",
            accessLevel: "Public",
            type: "FunctionDef",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "131",
                  s: [
                    {
                      value: [
                        "",
                        "define function ",
                        '"Measure Observation"',
                        "(",
                        "Encounter",
                        " ",
                      ],
                    },
                    { r: "78", s: [{ value: ['"Encounter, Performed"'] }] },
                    {
                      value: [
                        " ):\n  //Minutes between results and communication by id THEN timing\n  ",
                      ],
                    },
                    {
                      r: "130",
                      s: [
                        {
                          r: "130",
                          s: [
                            { value: ["Min", "("] },
                            {
                              r: "129",
                              s: [
                                {
                                  s: [
                                    {
                                      r: "80",
                                      s: [
                                        {
                                          r: "79",
                                          s: [
                                            {
                                              r: "79",
                                              s: [
                                                {
                                                  value: [
                                                    "[",
                                                    '"Laboratory Test, Performed"',
                                                    ": ",
                                                  ],
                                                },
                                                {
                                                  s: [
                                                    {
                                                      value: [
                                                        '"Chemistry Tests"',
                                                      ],
                                                    },
                                                  ],
                                                },
                                                { value: ["]"] },
                                              ],
                                            },
                                          ],
                                        },
                                        { value: [" ", "T"] },
                                      ],
                                    },
                                  ],
                                },
                                { value: ["\n      "] },
                                {
                                  s: [
                                    { value: ["let "] },
                                    {
                                      r: "122",
                                      s: [
                                        { value: ["Communication", ": "] },
                                        {
                                          r: "121",
                                          s: [
                                            { value: ["First", "("] },
                                            {
                                              r: "120",
                                              s: [
                                                {
                                                  s: [
                                                    {
                                                      r: "82",
                                                      s: [
                                                        {
                                                          r: "81",
                                                          s: [
                                                            {
                                                              r: "81",
                                                              s: [
                                                                {
                                                                  value: [
                                                                    "[",
                                                                    '"Communication, Performed"',
                                                                    ": ",
                                                                  ],
                                                                },
                                                                {
                                                                  s: [
                                                                    {
                                                                      value: [
                                                                        '"Lab Communications"',
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
                                                        { value: [" ", "C"] },
                                                      ],
                                                    },
                                                  ],
                                                },
                                                { value: ["\n          "] },
                                                {
                                                  r: "110",
                                                  s: [
                                                    { value: ["where "] },
                                                    {
                                                      r: "110",
                                                      s: [
                                                        {
                                                          r: "99",
                                                          s: [
                                                            {
                                                              r: "93",
                                                              s: [
                                                                {
                                                                  r: "87",
                                                                  s: [
                                                                    {
                                                                      r: "84",
                                                                      s: [
                                                                        {
                                                                          r: "83",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "C",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                        {
                                                                          value:
                                                                            [
                                                                              ".",
                                                                            ],
                                                                        },
                                                                        {
                                                                          r: "84",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "sentDatetime",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "87",
                                                                      value: [
                                                                        " ",
                                                                        "during",
                                                                        " ",
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "86",
                                                                      s: [
                                                                        {
                                                                          r: "85",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "Encounter",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                        {
                                                                          value:
                                                                            [
                                                                              ".",
                                                                            ],
                                                                        },
                                                                        {
                                                                          r: "86",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "relevantPeriod",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                      ],
                                                                    },
                                                                  ],
                                                                },
                                                                {
                                                                  value: [
                                                                    "\n            and ",
                                                                  ],
                                                                },
                                                                {
                                                                  r: "92",
                                                                  s: [
                                                                    {
                                                                      r: "89",
                                                                      s: [
                                                                        {
                                                                          r: "88",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "T",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                        {
                                                                          value:
                                                                            [
                                                                              ".",
                                                                            ],
                                                                        },
                                                                        {
                                                                          r: "89",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "resultDatetime",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "92",
                                                                      value: [
                                                                        " ",
                                                                        "during",
                                                                        " ",
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "91",
                                                                      s: [
                                                                        {
                                                                          r: "90",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "Encounter",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                        {
                                                                          value:
                                                                            [
                                                                              ".",
                                                                            ],
                                                                        },
                                                                        {
                                                                          r: "91",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "relevantPeriod",
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
                                                            {
                                                              value: [
                                                                "\n            and ",
                                                              ],
                                                            },
                                                            {
                                                              r: "98",
                                                              s: [
                                                                {
                                                                  r: "95",
                                                                  s: [
                                                                    {
                                                                      r: "94",
                                                                      s: [
                                                                        {
                                                                          value:
                                                                            [
                                                                              "C",
                                                                            ],
                                                                        },
                                                                      ],
                                                                    },
                                                                    {
                                                                      value: [
                                                                        ".",
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "95",
                                                                      s: [
                                                                        {
                                                                          value:
                                                                            [
                                                                              "sentDatetime",
                                                                            ],
                                                                        },
                                                                      ],
                                                                    },
                                                                  ],
                                                                },
                                                                {
                                                                  r: "98",
                                                                  value: [
                                                                    " ",
                                                                    "after",
                                                                    " ",
                                                                  ],
                                                                },
                                                                {
                                                                  r: "97",
                                                                  s: [
                                                                    {
                                                                      r: "96",
                                                                      s: [
                                                                        {
                                                                          value:
                                                                            [
                                                                              "T",
                                                                            ],
                                                                        },
                                                                      ],
                                                                    },
                                                                    {
                                                                      value: [
                                                                        ".",
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "97",
                                                                      s: [
                                                                        {
                                                                          value:
                                                                            [
                                                                              "resultDatetime",
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
                                                        {
                                                          value: [
                                                            "\n            and",
                                                          ],
                                                        },
                                                        {
                                                          r: "109",
                                                          s: [
                                                            { value: ["("] },
                                                            {
                                                              r: "109",
                                                              s: [
                                                                {
                                                                  r: "103",
                                                                  s: [
                                                                    {
                                                                      value: [
                                                                        "not ",
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "102",
                                                                      s: [
                                                                        {
                                                                          value:
                                                                            [
                                                                              "exists",
                                                                            ],
                                                                        },
                                                                        {
                                                                          r: "101",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "(",
                                                                                ],
                                                                            },
                                                                            {
                                                                              r: "101",
                                                                              s: [
                                                                                {
                                                                                  r: "100",
                                                                                  s: [
                                                                                    {
                                                                                      value:
                                                                                        [
                                                                                          "C",
                                                                                        ],
                                                                                    },
                                                                                  ],
                                                                                },
                                                                                {
                                                                                  value:
                                                                                    [
                                                                                      ".",
                                                                                    ],
                                                                                },
                                                                                {
                                                                                  r: "101",
                                                                                  s: [
                                                                                    {
                                                                                      value:
                                                                                        [
                                                                                          "relatedTo",
                                                                                        ],
                                                                                    },
                                                                                  ],
                                                                                },
                                                                              ],
                                                                            },
                                                                            {
                                                                              value:
                                                                                [
                                                                                  ")",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                      ],
                                                                    },
                                                                  ],
                                                                },
                                                                {
                                                                  value: [
                                                                    "\n                or ",
                                                                  ],
                                                                },
                                                                {
                                                                  r: "108",
                                                                  s: [
                                                                    {
                                                                      r: "105",
                                                                      s: [
                                                                        {
                                                                          r: "104",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "C",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                        {
                                                                          value:
                                                                            [
                                                                              ".",
                                                                            ],
                                                                        },
                                                                        {
                                                                          r: "105",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "relatedTo",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "108",
                                                                      value: [
                                                                        " ",
                                                                        "includes",
                                                                        " ",
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "107",
                                                                      s: [
                                                                        {
                                                                          r: "106",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "T",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                        {
                                                                          value:
                                                                            [
                                                                              ".",
                                                                            ],
                                                                        },
                                                                        {
                                                                          r: "107",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "id",
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
                                                            {
                                                              value: [
                                                                "\n            )",
                                                              ],
                                                            },
                                                          ],
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                },
                                                { value: ["\n          "] },
                                                {
                                                  r: "119",
                                                  s: [
                                                    { value: ["sort by "] },
                                                    {
                                                      r: "116",
                                                      s: [
                                                        {
                                                          r: "115",
                                                          s: [
                                                            { value: ["if "] },
                                                            {
                                                              r: "112",
                                                              s: [
                                                                {
                                                                  value: [
                                                                    "exists",
                                                                  ],
                                                                },
                                                                {
                                                                  r: "111",
                                                                  s: [
                                                                    {
                                                                      value: [
                                                                        "(",
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "111",
                                                                      s: [
                                                                        {
                                                                          value:
                                                                            [
                                                                              "relatedTo",
                                                                            ],
                                                                        },
                                                                      ],
                                                                    },
                                                                    {
                                                                      value: [
                                                                        ")",
                                                                      ],
                                                                    },
                                                                  ],
                                                                },
                                                              ],
                                                            },
                                                            {
                                                              r: "113",
                                                              value: [
                                                                "then ",
                                                                "0",
                                                                " \n            else ",
                                                                "1",
                                                              ],
                                                            },
                                                          ],
                                                        },
                                                      ],
                                                    },
                                                    { value: [", "] },
                                                    {
                                                      r: "118",
                                                      s: [
                                                        {
                                                          r: "117",
                                                          s: [
                                                            {
                                                              value: [
                                                                "sentDatetime",
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
                                            { value: ["\n      )"] },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                                { value: ["\n      "] },
                                {
                                  r: "128",
                                  s: [
                                    { value: ["return "] },
                                    {
                                      r: "127",
                                      s: [
                                        { value: ["minutes between "] },
                                        {
                                          r: "124",
                                          s: [
                                            { r: "123", s: [{ value: ["T"] }] },
                                            { value: ["."] },
                                            {
                                              r: "124",
                                              s: [
                                                { value: ["resultDatetime"] },
                                              ],
                                            },
                                          ],
                                        },
                                        { value: [" and "] },
                                        {
                                          r: "126",
                                          s: [
                                            {
                                              r: "125",
                                              s: [{ value: ["Communication"] }],
                                            },
                                            { value: ["."] },
                                            {
                                              r: "126",
                                              s: [{ value: ["sentDatetime"] }],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            { value: ["\n  )"] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            ],
            expression: {
              localId: "130",
              locator: "58:3-70:3",
              type: "Min",
              source: {
                localId: "129",
                locator: "58:7-69:76",
                type: "Query",
                source: [
                  {
                    localId: "80",
                    locator: "58:7-58:57",
                    alias: "T",
                    expression: {
                      localId: "79",
                      locator: "58:7-58:55",
                      dataType:
                        "{urn:healthit-gov:qdm:v5_6}PositiveLaboratoryTestPerformed",
                      templateId: "PositiveLaboratoryTestPerformed",
                      codeProperty: "code",
                      codeComparator: "in",
                      type: "Retrieve",
                      codes: {
                        locator: "58:38-58:54",
                        name: "Chemistry Tests",
                        type: "ValueSetRef",
                      },
                    },
                  },
                ],
                let: [
                  {
                    localId: "122",
                    locator: "59:11-68:7",
                    identifier: "Communication",
                    expression: {
                      localId: "121",
                      locator: "59:26-68:7",
                      type: "First",
                      source: {
                        localId: "120",
                        locator: "59:32-67:32",
                        type: "Query",
                        source: [
                          {
                            localId: "82",
                            locator: "59:32-59:83",
                            alias: "C",
                            expression: {
                              localId: "81",
                              locator: "59:32-59:81",
                              dataType:
                                "{urn:healthit-gov:qdm:v5_6}PositiveCommunicationPerformed",
                              templateId: "PositiveCommunicationPerformed",
                              codeProperty: "code",
                              codeComparator: "in",
                              type: "Retrieve",
                              codes: {
                                locator: "59:61-59:80",
                                name: "Lab Communications",
                                type: "ValueSetRef",
                              },
                            },
                          },
                        ],
                        relationship: [],
                        where: {
                          localId: "110",
                          locator: "60:11-65:13",
                          type: "And",
                          operand: [
                            {
                              localId: "99",
                              locator: "60:17-62:53",
                              type: "And",
                              operand: [
                                {
                                  localId: "93",
                                  locator: "60:17-61:64",
                                  type: "And",
                                  operand: [
                                    {
                                      localId: "87",
                                      locator: "60:17-60:62",
                                      type: "In",
                                      operand: [
                                        {
                                          localId: "84",
                                          locator: "60:17-60:30",
                                          path: "sentDatetime",
                                          scope: "C",
                                          type: "Property",
                                        },
                                        {
                                          localId: "86",
                                          locator: "60:39-60:62",
                                          path: "relevantPeriod",
                                          type: "Property",
                                          source: {
                                            localId: "85",
                                            locator: "60:39-60:47",
                                            name: "Encounter",
                                            type: "OperandRef",
                                          },
                                        },
                                      ],
                                    },
                                    {
                                      localId: "92",
                                      locator: "61:17-61:64",
                                      type: "In",
                                      operand: [
                                        {
                                          localId: "89",
                                          locator: "61:17-61:32",
                                          path: "resultDatetime",
                                          scope: "T",
                                          type: "Property",
                                        },
                                        {
                                          localId: "91",
                                          locator: "61:41-61:64",
                                          path: "relevantPeriod",
                                          type: "Property",
                                          source: {
                                            localId: "90",
                                            locator: "61:41-61:49",
                                            name: "Encounter",
                                            type: "OperandRef",
                                          },
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  localId: "98",
                                  locator: "62:17-62:53",
                                  type: "After",
                                  operand: [
                                    {
                                      localId: "95",
                                      locator: "62:17-62:30",
                                      path: "sentDatetime",
                                      scope: "C",
                                      type: "Property",
                                    },
                                    {
                                      localId: "97",
                                      locator: "62:38-62:53",
                                      path: "resultDatetime",
                                      scope: "T",
                                      type: "Property",
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              localId: "109",
                              locator: "63:16-65:13",
                              type: "Or",
                              operand: [
                                {
                                  localId: "103",
                                  locator: "63:17-63:39",
                                  type: "Not",
                                  operand: {
                                    localId: "102",
                                    locator: "63:21-63:39",
                                    type: "Exists",
                                    operand: {
                                      localId: "101",
                                      locator: "63:27-63:39",
                                      path: "relatedTo",
                                      scope: "C",
                                      type: "Property",
                                    },
                                  },
                                },
                                {
                                  localId: "108",
                                  locator: "64:20-64:44",
                                  type: "Contains",
                                  operand: [
                                    {
                                      localId: "105",
                                      locator: "64:20-64:30",
                                      path: "relatedTo",
                                      scope: "C",
                                      type: "Property",
                                    },
                                    {
                                      localId: "107",
                                      locator: "64:41-64:44",
                                      path: "id",
                                      scope: "T",
                                      type: "Property",
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        sort: {
                          localId: "119",
                          locator: "66:11-67:32",
                          by: [
                            {
                              localId: "116",
                              locator: "66:19-67:18",
                              direction: "asc",
                              type: "ByExpression",
                              expression: {
                                localId: "115",
                                locator: "66:19-67:18",
                                type: "If",
                                condition: {
                                  localId: "112",
                                  locator: "66:22-66:38",
                                  type: "Exists",
                                  operand: {
                                    localId: "111",
                                    locator: "66:28-66:38",
                                    name: "relatedTo",
                                    type: "IdentifierRef",
                                  },
                                },
                                then: {
                                  localId: "113",
                                  locator: "66:44",
                                  valueType:
                                    "{urn:hl7-org:elm-types:r1}Integer",
                                  value: "0",
                                  type: "Literal",
                                },
                                else: {
                                  localId: "114",
                                  locator: "67:18",
                                  valueType:
                                    "{urn:hl7-org:elm-types:r1}Integer",
                                  value: "1",
                                  type: "Literal",
                                },
                              },
                            },
                            {
                              localId: "118",
                              locator: "67:21-67:32",
                              direction: "asc",
                              path: "sentDatetime",
                              type: "ByColumn",
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
                relationship: [],
                return: {
                  localId: "128",
                  locator: "69:7-69:76",
                  expression: {
                    localId: "127",
                    locator: "69:14-69:76",
                    precision: "Minute",
                    type: "DurationBetween",
                    operand: [
                      {
                        localId: "124",
                        locator: "69:30-69:45",
                        path: "resultDatetime",
                        scope: "T",
                        type: "Property",
                      },
                      {
                        localId: "126",
                        locator: "69:51-69:76",
                        path: "sentDatetime",
                        type: "Property",
                        source: {
                          localId: "125",
                          locator: "69:51-69:63",
                          name: "Communication",
                          type: "QueryLetRef",
                        },
                      },
                    ],
                  },
                },
              },
            },
            operand: [
              {
                name: "Encounter",
                operandTypeSpecifier: {
                  localId: "78",
                  locator: "56:49-56:70",
                  name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                  type: "NamedTypeSpecifier",
                },
              },
            ],
          },
          {
            localId: "185",
            locator: "72:1-86:3",
            name: "Measure Observation 1",
            context: "Patient",
            accessLevel: "Public",
            type: "FunctionDef",
            annotation: [
              {
                type: "Annotation",
                s: {
                  r: "185",
                  s: [
                    {
                      value: [
                        "",
                        "define function ",
                        '"Measure Observation 1"',
                        "(",
                        "Encounter",
                        " ",
                      ],
                    },
                    { r: "132", s: [{ value: ['"Encounter, Performed"'] }] },
                    {
                      value: [
                        " ):\n  //Minutes between results and communication by id THEN timing\n  ",
                      ],
                    },
                    {
                      r: "184",
                      s: [
                        {
                          r: "184",
                          s: [
                            { value: ["Min", "("] },
                            {
                              r: "183",
                              s: [
                                {
                                  s: [
                                    {
                                      r: "134",
                                      s: [
                                        {
                                          r: "133",
                                          s: [
                                            {
                                              r: "133",
                                              s: [
                                                {
                                                  value: [
                                                    "[",
                                                    '"Laboratory Test, Performed"',
                                                    ": ",
                                                  ],
                                                },
                                                {
                                                  s: [
                                                    {
                                                      value: [
                                                        '"Chemistry Tests"',
                                                      ],
                                                    },
                                                  ],
                                                },
                                                { value: ["]"] },
                                              ],
                                            },
                                          ],
                                        },
                                        { value: [" ", "T"] },
                                      ],
                                    },
                                  ],
                                },
                                { value: ["\n      "] },
                                {
                                  s: [
                                    { value: ["let "] },
                                    {
                                      r: "176",
                                      s: [
                                        { value: ["Communication", ": "] },
                                        {
                                          r: "175",
                                          s: [
                                            { value: ["First", "("] },
                                            {
                                              r: "174",
                                              s: [
                                                {
                                                  s: [
                                                    {
                                                      r: "136",
                                                      s: [
                                                        {
                                                          r: "135",
                                                          s: [
                                                            {
                                                              r: "135",
                                                              s: [
                                                                {
                                                                  value: [
                                                                    "[",
                                                                    '"Communication, Performed"',
                                                                    ": ",
                                                                  ],
                                                                },
                                                                {
                                                                  s: [
                                                                    {
                                                                      value: [
                                                                        '"Lab Communications"',
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
                                                        { value: [" ", "C"] },
                                                      ],
                                                    },
                                                  ],
                                                },
                                                { value: ["\n          "] },
                                                {
                                                  r: "164",
                                                  s: [
                                                    { value: ["where "] },
                                                    {
                                                      r: "164",
                                                      s: [
                                                        {
                                                          r: "153",
                                                          s: [
                                                            {
                                                              r: "147",
                                                              s: [
                                                                {
                                                                  r: "141",
                                                                  s: [
                                                                    {
                                                                      r: "138",
                                                                      s: [
                                                                        {
                                                                          r: "137",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "C",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                        {
                                                                          value:
                                                                            [
                                                                              ".",
                                                                            ],
                                                                        },
                                                                        {
                                                                          r: "138",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "sentDatetime",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "141",
                                                                      value: [
                                                                        " ",
                                                                        "during",
                                                                        " ",
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "140",
                                                                      s: [
                                                                        {
                                                                          r: "139",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "Encounter",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                        {
                                                                          value:
                                                                            [
                                                                              ".",
                                                                            ],
                                                                        },
                                                                        {
                                                                          r: "140",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "relevantPeriod",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                      ],
                                                                    },
                                                                  ],
                                                                },
                                                                {
                                                                  value: [
                                                                    "\n            and ",
                                                                  ],
                                                                },
                                                                {
                                                                  r: "146",
                                                                  s: [
                                                                    {
                                                                      r: "143",
                                                                      s: [
                                                                        {
                                                                          r: "142",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "T",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                        {
                                                                          value:
                                                                            [
                                                                              ".",
                                                                            ],
                                                                        },
                                                                        {
                                                                          r: "143",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "resultDatetime",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "146",
                                                                      value: [
                                                                        " ",
                                                                        "during",
                                                                        " ",
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "145",
                                                                      s: [
                                                                        {
                                                                          r: "144",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "Encounter",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                        {
                                                                          value:
                                                                            [
                                                                              ".",
                                                                            ],
                                                                        },
                                                                        {
                                                                          r: "145",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "relevantPeriod",
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
                                                            {
                                                              value: [
                                                                "\n            and ",
                                                              ],
                                                            },
                                                            {
                                                              r: "152",
                                                              s: [
                                                                {
                                                                  r: "149",
                                                                  s: [
                                                                    {
                                                                      r: "148",
                                                                      s: [
                                                                        {
                                                                          value:
                                                                            [
                                                                              "C",
                                                                            ],
                                                                        },
                                                                      ],
                                                                    },
                                                                    {
                                                                      value: [
                                                                        ".",
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "149",
                                                                      s: [
                                                                        {
                                                                          value:
                                                                            [
                                                                              "sentDatetime",
                                                                            ],
                                                                        },
                                                                      ],
                                                                    },
                                                                  ],
                                                                },
                                                                {
                                                                  r: "152",
                                                                  value: [
                                                                    " ",
                                                                    "after",
                                                                    " ",
                                                                  ],
                                                                },
                                                                {
                                                                  r: "151",
                                                                  s: [
                                                                    {
                                                                      r: "150",
                                                                      s: [
                                                                        {
                                                                          value:
                                                                            [
                                                                              "T",
                                                                            ],
                                                                        },
                                                                      ],
                                                                    },
                                                                    {
                                                                      value: [
                                                                        ".",
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "151",
                                                                      s: [
                                                                        {
                                                                          value:
                                                                            [
                                                                              "resultDatetime",
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
                                                        {
                                                          value: [
                                                            "\n            and",
                                                          ],
                                                        },
                                                        {
                                                          r: "163",
                                                          s: [
                                                            { value: ["("] },
                                                            {
                                                              r: "163",
                                                              s: [
                                                                {
                                                                  r: "157",
                                                                  s: [
                                                                    {
                                                                      value: [
                                                                        "not ",
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "156",
                                                                      s: [
                                                                        {
                                                                          value:
                                                                            [
                                                                              "exists",
                                                                            ],
                                                                        },
                                                                        {
                                                                          r: "155",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "(",
                                                                                ],
                                                                            },
                                                                            {
                                                                              r: "155",
                                                                              s: [
                                                                                {
                                                                                  r: "154",
                                                                                  s: [
                                                                                    {
                                                                                      value:
                                                                                        [
                                                                                          "C",
                                                                                        ],
                                                                                    },
                                                                                  ],
                                                                                },
                                                                                {
                                                                                  value:
                                                                                    [
                                                                                      ".",
                                                                                    ],
                                                                                },
                                                                                {
                                                                                  r: "155",
                                                                                  s: [
                                                                                    {
                                                                                      value:
                                                                                        [
                                                                                          "relatedTo",
                                                                                        ],
                                                                                    },
                                                                                  ],
                                                                                },
                                                                              ],
                                                                            },
                                                                            {
                                                                              value:
                                                                                [
                                                                                  ")",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                      ],
                                                                    },
                                                                  ],
                                                                },
                                                                {
                                                                  value: [
                                                                    "\n                or ",
                                                                  ],
                                                                },
                                                                {
                                                                  r: "162",
                                                                  s: [
                                                                    {
                                                                      r: "159",
                                                                      s: [
                                                                        {
                                                                          r: "158",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "C",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                        {
                                                                          value:
                                                                            [
                                                                              ".",
                                                                            ],
                                                                        },
                                                                        {
                                                                          r: "159",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "relatedTo",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "162",
                                                                      value: [
                                                                        " ",
                                                                        "includes",
                                                                        " ",
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "161",
                                                                      s: [
                                                                        {
                                                                          r: "160",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "T",
                                                                                ],
                                                                            },
                                                                          ],
                                                                        },
                                                                        {
                                                                          value:
                                                                            [
                                                                              ".",
                                                                            ],
                                                                        },
                                                                        {
                                                                          r: "161",
                                                                          s: [
                                                                            {
                                                                              value:
                                                                                [
                                                                                  "id",
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
                                                            {
                                                              value: [
                                                                "\n            )",
                                                              ],
                                                            },
                                                          ],
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                },
                                                { value: ["\n          "] },
                                                {
                                                  r: "173",
                                                  s: [
                                                    { value: ["sort by "] },
                                                    {
                                                      r: "170",
                                                      s: [
                                                        {
                                                          r: "169",
                                                          s: [
                                                            { value: ["if "] },
                                                            {
                                                              r: "166",
                                                              s: [
                                                                {
                                                                  value: [
                                                                    "exists",
                                                                  ],
                                                                },
                                                                {
                                                                  r: "165",
                                                                  s: [
                                                                    {
                                                                      value: [
                                                                        "(",
                                                                      ],
                                                                    },
                                                                    {
                                                                      r: "165",
                                                                      s: [
                                                                        {
                                                                          value:
                                                                            [
                                                                              "relatedTo",
                                                                            ],
                                                                        },
                                                                      ],
                                                                    },
                                                                    {
                                                                      value: [
                                                                        ")",
                                                                      ],
                                                                    },
                                                                  ],
                                                                },
                                                              ],
                                                            },
                                                            {
                                                              r: "167",
                                                              value: [
                                                                "then ",
                                                                "0",
                                                                " \n            else ",
                                                                "1",
                                                              ],
                                                            },
                                                          ],
                                                        },
                                                      ],
                                                    },
                                                    { value: [", "] },
                                                    {
                                                      r: "172",
                                                      s: [
                                                        {
                                                          r: "171",
                                                          s: [
                                                            {
                                                              value: [
                                                                "sentDatetime",
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
                                            { value: ["\n      )"] },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                                { value: ["\n      "] },
                                {
                                  r: "182",
                                  s: [
                                    { value: ["return "] },
                                    {
                                      r: "181",
                                      s: [
                                        { value: ["minutes between "] },
                                        {
                                          r: "178",
                                          s: [
                                            { r: "177", s: [{ value: ["T"] }] },
                                            { value: ["."] },
                                            {
                                              r: "178",
                                              s: [
                                                { value: ["resultDatetime"] },
                                              ],
                                            },
                                          ],
                                        },
                                        { value: [" and "] },
                                        {
                                          r: "180",
                                          s: [
                                            {
                                              r: "179",
                                              s: [{ value: ["Communication"] }],
                                            },
                                            { value: ["."] },
                                            {
                                              r: "180",
                                              s: [{ value: ["sentDatetime"] }],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            { value: ["\n  )"] },
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            ],
            expression: {
              localId: "184",
              locator: "74:3-86:3",
              type: "Min",
              source: {
                localId: "183",
                locator: "74:7-85:76",
                type: "Query",
                source: [
                  {
                    localId: "134",
                    locator: "74:7-74:57",
                    alias: "T",
                    expression: {
                      localId: "133",
                      locator: "74:7-74:55",
                      dataType:
                        "{urn:healthit-gov:qdm:v5_6}PositiveLaboratoryTestPerformed",
                      templateId: "PositiveLaboratoryTestPerformed",
                      codeProperty: "code",
                      codeComparator: "in",
                      type: "Retrieve",
                      codes: {
                        locator: "74:38-74:54",
                        name: "Chemistry Tests",
                        type: "ValueSetRef",
                      },
                    },
                  },
                ],
                let: [
                  {
                    localId: "176",
                    locator: "75:11-84:7",
                    identifier: "Communication",
                    expression: {
                      localId: "175",
                      locator: "75:26-84:7",
                      type: "First",
                      source: {
                        localId: "174",
                        locator: "75:32-83:32",
                        type: "Query",
                        source: [
                          {
                            localId: "136",
                            locator: "75:32-75:83",
                            alias: "C",
                            expression: {
                              localId: "135",
                              locator: "75:32-75:81",
                              dataType:
                                "{urn:healthit-gov:qdm:v5_6}PositiveCommunicationPerformed",
                              templateId: "PositiveCommunicationPerformed",
                              codeProperty: "code",
                              codeComparator: "in",
                              type: "Retrieve",
                              codes: {
                                locator: "75:61-75:80",
                                name: "Lab Communications",
                                type: "ValueSetRef",
                              },
                            },
                          },
                        ],
                        relationship: [],
                        where: {
                          localId: "164",
                          locator: "76:11-81:13",
                          type: "And",
                          operand: [
                            {
                              localId: "153",
                              locator: "76:17-78:53",
                              type: "And",
                              operand: [
                                {
                                  localId: "147",
                                  locator: "76:17-77:64",
                                  type: "And",
                                  operand: [
                                    {
                                      localId: "141",
                                      locator: "76:17-76:62",
                                      type: "In",
                                      operand: [
                                        {
                                          localId: "138",
                                          locator: "76:17-76:30",
                                          path: "sentDatetime",
                                          scope: "C",
                                          type: "Property",
                                        },
                                        {
                                          localId: "140",
                                          locator: "76:39-76:62",
                                          path: "relevantPeriod",
                                          type: "Property",
                                          source: {
                                            localId: "139",
                                            locator: "76:39-76:47",
                                            name: "Encounter",
                                            type: "OperandRef",
                                          },
                                        },
                                      ],
                                    },
                                    {
                                      localId: "146",
                                      locator: "77:17-77:64",
                                      type: "In",
                                      operand: [
                                        {
                                          localId: "143",
                                          locator: "77:17-77:32",
                                          path: "resultDatetime",
                                          scope: "T",
                                          type: "Property",
                                        },
                                        {
                                          localId: "145",
                                          locator: "77:41-77:64",
                                          path: "relevantPeriod",
                                          type: "Property",
                                          source: {
                                            localId: "144",
                                            locator: "77:41-77:49",
                                            name: "Encounter",
                                            type: "OperandRef",
                                          },
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  localId: "152",
                                  locator: "78:17-78:53",
                                  type: "After",
                                  operand: [
                                    {
                                      localId: "149",
                                      locator: "78:17-78:30",
                                      path: "sentDatetime",
                                      scope: "C",
                                      type: "Property",
                                    },
                                    {
                                      localId: "151",
                                      locator: "78:38-78:53",
                                      path: "resultDatetime",
                                      scope: "T",
                                      type: "Property",
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              localId: "163",
                              locator: "79:16-81:13",
                              type: "Or",
                              operand: [
                                {
                                  localId: "157",
                                  locator: "79:17-79:39",
                                  type: "Not",
                                  operand: {
                                    localId: "156",
                                    locator: "79:21-79:39",
                                    type: "Exists",
                                    operand: {
                                      localId: "155",
                                      locator: "79:27-79:39",
                                      path: "relatedTo",
                                      scope: "C",
                                      type: "Property",
                                    },
                                  },
                                },
                                {
                                  localId: "162",
                                  locator: "80:20-80:44",
                                  type: "Contains",
                                  operand: [
                                    {
                                      localId: "159",
                                      locator: "80:20-80:30",
                                      path: "relatedTo",
                                      scope: "C",
                                      type: "Property",
                                    },
                                    {
                                      localId: "161",
                                      locator: "80:41-80:44",
                                      path: "id",
                                      scope: "T",
                                      type: "Property",
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        sort: {
                          localId: "173",
                          locator: "82:11-83:32",
                          by: [
                            {
                              localId: "170",
                              locator: "82:19-83:18",
                              direction: "asc",
                              type: "ByExpression",
                              expression: {
                                localId: "169",
                                locator: "82:19-83:18",
                                type: "If",
                                condition: {
                                  localId: "166",
                                  locator: "82:22-82:38",
                                  type: "Exists",
                                  operand: {
                                    localId: "165",
                                    locator: "82:28-82:38",
                                    name: "relatedTo",
                                    type: "IdentifierRef",
                                  },
                                },
                                then: {
                                  localId: "167",
                                  locator: "82:44",
                                  valueType:
                                    "{urn:hl7-org:elm-types:r1}Integer",
                                  value: "0",
                                  type: "Literal",
                                },
                                else: {
                                  localId: "168",
                                  locator: "83:18",
                                  valueType:
                                    "{urn:hl7-org:elm-types:r1}Integer",
                                  value: "1",
                                  type: "Literal",
                                },
                              },
                            },
                            {
                              localId: "172",
                              locator: "83:21-83:32",
                              direction: "asc",
                              path: "sentDatetime",
                              type: "ByColumn",
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
                relationship: [],
                return: {
                  localId: "182",
                  locator: "85:7-85:76",
                  expression: {
                    localId: "181",
                    locator: "85:14-85:76",
                    precision: "Minute",
                    type: "DurationBetween",
                    operand: [
                      {
                        localId: "178",
                        locator: "85:30-85:45",
                        path: "resultDatetime",
                        scope: "T",
                        type: "Property",
                      },
                      {
                        localId: "180",
                        locator: "85:51-85:76",
                        path: "sentDatetime",
                        type: "Property",
                        source: {
                          localId: "179",
                          locator: "85:51-85:63",
                          name: "Communication",
                          type: "QueryLetRef",
                        },
                      },
                    ],
                  },
                },
              },
            },
            operand: [
              {
                name: "Encounter",
                operandTypeSpecifier: {
                  localId: "132",
                  locator: "72:51-72:72",
                  name: "{urn:healthit-gov:qdm:v5_6}PositiveEncounterPerformed",
                  type: "NamedTypeSpecifier",
                },
              },
            ],
          },
        ],
      },
    },
  };

  it("Parses ELM", async () => {
    var result = parse(elmJsonSmall);

    expect(result).toBeTruthy();

    expect(result.identifier.id).toEqual("PancakeMeasure");
    expect(result.identifier.version).toEqual("0.0.002");

    expect(result.statements).toBeInstanceOf(Array);
    expect(result.statements.length).toEqual(1);
    expect(result.statements[0].children.length).toEqual(1);
    expect(result.statements[0].children[0].children.length).toEqual(1);
    expect(
      result.statements[0].children[0].children[0].children.length
    ).toEqual(1);
    expect(
      result.statements[0].children[0].children[0].children[0].children.length
    ).toEqual(1);
    expect(
      result.statements[0].children[0].children[0].children[0].children[0]
        .children.length
    ).toEqual(2);
    expect(
      result.statements[0].children[0].children[0].children[0].children[0]
        .children[0].children.length
    ).toEqual(3);
    expect(
      result.statements[0].children[0].children[0].children[0].children[0]
        .children[1].children[0].children.length
    ).toEqual(3);
    expect(
      result.statements[0].children[0].children[0].children[0].children[0]
        .children[1].children[0].node_type
    ).toEqual("Retrieve");
    const emittedJson: String = JSON.stringify(result, null, 2);

    var foundValue = JSONPath({
      path: "$.statements[*].children[*].children[*].children[*].children[*].children[*].children[1].text",
      json: result,
    });

    expect(foundValue[0]).toEqual('"SDE Ethnicity"');
  });
});
