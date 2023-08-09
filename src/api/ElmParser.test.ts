import { parse } from "./ElmParser";

describe("CqmConversionService", () => {
  const elmJsonSmall = {
    library: {
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
        ],
      },
    },
  };

  it("Parses ELM", async () => {
    const result = parse(elmJsonSmall);

    expect(result).toBeTruthy();

    expect(result.identifier.id).toEqual("PancakeMeasure");
    expect(result.identifier.version).toEqual("0.0.002");

    expect(result.statements).toBeInstanceOf(Array);
    expect(result.statements.length).toEqual(2);
    expect(result.statements[0].children.length).toEqual(1);
    expect(result.statements[0].children[0].children.length).toEqual(1);
    expect(
      result.statements[0].children[0].children[0].children.length
    ).toEqual(1);
    expect(
      result.statements[0].children[0].children[0].children[0].children.length
    ).toEqual(2);
    expect(
      result.statements[0].children[0].children[0].children[0].children[0]
        .children.length
    ).toEqual(1);
    expect(
      result.statements[0].children[0].children[0].children[0].children[0]
        .children[0].text
    ).toEqual('define "SDE Ethnicity" :');
    expect(
      result.statements[0].children[0].children[0].children[0].children[1]
        .children.length
    ).toEqual(1);
    expect(
      result.statements[0].children[0].children[0].children[0].children[1]
        .node_type
    ).toEqual("Retrieve");
    expect(
      result.statements[0].children[0].children[0].children[0].children[1]
        .ref_id
    ).toEqual("14");
  });
});
