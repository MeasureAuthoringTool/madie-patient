export const cqm_measure_basic = {
  _id: "609d998db78902cd9466f534",
  calculate_sdes: null,
  calculation_method: "PATIENT",
  cms_id: "CMSv0",
  component: false,
  component_hqmf_set_ids: [],
  composite: false,
  composite_hqmf_set_id: null,
  cql_libraries: [
    {
      _id: "609d998eb78902cd9466f535",
      elm: {
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
                r: "196",
                s: [
                  {
                    value: ["", "library CMS108 version '0.1.005'"],
                  },
                ],
              },
            },
          ],
          identifier: {
            id: "CMS108",
            version: "0.1.005",
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
          includes: {
            def: [
              {
                localId: "2",
                locator: "5:1-5:67",
                localIdentifier: "Global",
                path: "MATGlobalCommonFunctionsNEW",
                version: "7.0.000",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "2",
                      s: [
                        {
                          value: ["", "include "],
                        },
                        {
                          s: [
                            {
                              value: ["MATGlobalCommonFunctionsNEW"],
                            },
                          ],
                        },
                        {
                          value: [
                            " version ",
                            "'7.0.000'",
                            " called ",
                            "Global",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
              {
                localId: "3",
                locator: "6:1-6:53",
                localIdentifier: "VTEICU",
                path: "TEST_VTEICU56",
                version: "0.2.000",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "3",
                      s: [
                        {
                          value: ["", "include "],
                        },
                        {
                          s: [
                            {
                              value: ["TEST_VTEICU56"],
                            },
                          ],
                        },
                        {
                          value: [
                            " version ",
                            "'0.2.000'",
                            " called ",
                            "VTEICU",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
          codeSystems: {
            def: [
              {
                localId: "4",
                locator: "8:1-8:51",
                name: "LOINC",
                id: "2.16.840.1.113883.6.1",
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
                            "codesystem ",
                            '"LOINC"',
                            ": ",
                            "'urn:oid:2.16.840.1.113883.6.1'",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
              {
                localId: "5",
                locator: "9:1-9:55",
                name: "SNOMEDCT",
                id: "2.16.840.1.113883.6.96",
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
                            "codesystem ",
                            '"SNOMEDCT"',
                            ": ",
                            "'urn:oid:2.16.840.1.113883.6.96'",
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
          valueSets: {
            def: [
              {
                localId: "2",
                locator: "4:1-4:71",
                name: "Encounter Inpatient",
                id: "urn:oid:2.16.840.1.113883.3.666.5.307",
                accessLevel: "Public",
              },
              {
                localId: "32",
                locator: "37:1-37:78",
                name: "Diabetes",
                id: "2.16.840.1.113883.3.464.1003.103.12.1001",
                accessLevel: "Public",
              },
            ],
          },
          codes: {
            def: [
              {
                localId: "17",
                locator: "22:1-22:70",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Code",
                name: "Housing status",
                id: "drc-bdb8b89536181a411ad034378b7ceef6",
                display: "Housing status",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "17",
                      s: [
                        {
                          value: [
                            "",
                            "code ",
                            '"Housing status"',
                            ": ",
                            "'71802-3'",
                            " from ",
                          ],
                        },
                        {
                          r: "16",
                          s: [
                            {
                              value: ['"LOINC"'],
                            },
                          ],
                        },
                        {
                          value: [" display ", "'Housing status'"],
                        },
                      ],
                    },
                  },
                ],
                codeSystem: {
                  localId: "16",
                  locator: "22:39-22:45",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}CodeSystem",
                  name: "LOINC",
                },
              },
              {
                localId: "19",
                locator: "23:1-23:113",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Code",
                name: "Lives in a nursing home (finding)",
                id: "160734000",
                display: "Lives in a nursing home (finding)",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "19",
                      s: [
                        {
                          value: [
                            "",
                            "code ",
                            '"Lives in a nursing home (finding)"',
                            ": ",
                            "'160734000'",
                            " from ",
                          ],
                        },
                        {
                          r: "18",
                          s: [
                            {
                              value: ['"SNOMEDCT"'],
                            },
                          ],
                        },
                        {
                          value: [
                            " display ",
                            "'Lives in a nursing home (finding)'",
                          ],
                        },
                      ],
                    },
                  },
                ],
                codeSystem: {
                  localId: "18",
                  locator: "23:60-23:69",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}CodeSystem",
                  name: "SNOMEDCT",
                },
              },
              {
                localId: "21",
                locator: "24:1-24:86",
                resultTypeName: "{urn:hl7-org:elm-types:r1}Code",
                name: "Medical equipment used",
                id: "98181-1",
                display: "Medical equipment used",
                accessLevel: "Public",
                annotation: [
                  {
                    type: "Annotation",
                    s: {
                      r: "21",
                      s: [
                        {
                          value: [
                            "",
                            "code ",
                            '"Medical equipment used"',
                            ": ",
                            "'98181-1'",
                            " from ",
                          ],
                        },
                        {
                          r: "20",
                          s: [
                            {
                              value: ['"LOINC"'],
                            },
                          ],
                        },
                        {
                          value: [" display ", "'Medical equipment used'"],
                        },
                      ],
                    },
                  },
                ],
                codeSystem: {
                  localId: "20",
                  locator: "24:47-24:53",
                  resultTypeName: "{urn:hl7-org:elm-types:r1}CodeSystem",
                  name: "LOINC",
                },
              },
            ],
          },
        },
      },
      is_main_library: true,
      is_top_level: true,
      library_name: "CMS108",
      library_version: "0.1.005",
    },
  ],
  created_at: "2021-05-13T21:26:37.995Z",
  description: "CMS108",
  group_id: "6093077eb789025041bbbeec",
  hqmf_id: "2C928082-7791-738A-0177-918233FF004B",
  hqmf_set_id: "0B2D4BCF-EDF6-41C5-BE2A-64ACCDB9DD35",
  hqmf_version_number: "0.1.005",
  main_cql_library: "CMS108",
  measure_scoring: "PROPORTION",
  patient_ids: [],
  title: "CMS108",
  updated_at: "2021-05-13T21:26:37.995Z",
  source_data_criteria: [
    {
      oid: "drc-bdb8b89536181a411ad034378b7ceef6",
      dataElementCodes: [],
      _id: "6525abc34615a9000087b2a5",
      relatedTo: [],
      performer: [],
      qdmTitle: "Assessment, Performed",
      hqmfOid: "2.16.840.1.113883.10.20.28.4.117",
      qdmCategory: "assessment",
      qdmStatus: "performed",
      qdmVersion: "5.6",
      _type: "QDM::AssessmentPerformed",
      id: "6525abc34615a9000087b2a5",
      components: [],
      codeId: "drc-bdb8b89536181a411ad034378b7ceef6",
      codeListId: "drc-bdb8b89536181a411ad034378b7ceef6",
      description: "Assessment, Performed: Housing status",
      desc: "drc-bdb8b89536181a411ad034378b7ceef6",
    },
  ],
};
