import { parse } from "./ElmParser";

describe("CqmConversionService", () => {
  const elmJsonSmall = {
    library: {
      identifier: { id: "PancakeMeasure", version: "0.0.002" },
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
                    { value: 'define "SDE Ethnicity" :\n' },
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

    expect(
      result.statements[1].children[0].children[0].children[0].children.length
    ).toEqual(2);
    expect(
      result.statements[1].children[0].children[0].children[0].children[1]
        .children[0].children.length
    ).toEqual(3);
  });
});
