import {
  BaseConfigurationTypes,
  Measure,
  MeasureGroupTypes,
  Model,
  PopulationType,
} from "@madie/madie-models";

export const simpleMeasureFixture: Measure = {
  id: "623cacebe74613783378c17b",
  versionId: "",
  active: false,
  measureHumanReadableId: null,
  measureSetId: null,
  version: null,
  state: null,
  cqlLibraryName: "SimpleFhirMeasure",
  ecqmTitle: "ecqmTitle",
  measureName: "SimpleFhirMeasure",
  cql: 'library SimpleFhirMeasure version \'0.0.001\'\n\nusing FHIR version \'4.0.1\'\n\ninclude FHIRHelpers version \'4.0.001\' called FHIRHelpers\n\nparameter "Measurement Period" Interval<DateTime>\n\ncontext Patient\n\ndefine "first":\n  exists ["Encounter"] E where E.period.start during "Measurement Period"\n\ndefine "second":\n  "first"\n\ndefine "third":\n  exists ["Encounter"] E where E.status ~ \'finished\'',
  elmJson:
    '{"library":{"annotation":[{"type":"Annotation","s":{"r":"26","s":[{"value":["","library SimpleFhirMeasure version \'0.0.001\'"]}]}}],"identifier":{"id":"SimpleFhirMeasure","version":"0.0.001"},"schemaIdentifier":{"id":"urn:hl7-org:elm","version":"r1"},"usings":{"def":[{"localIdentifier":"System","uri":"urn:hl7-org:elm-types:r1"},{"localId":"1","locator":"3:1-3:26","localIdentifier":"FHIR","uri":"http://hl7.org/fhir","version":"4.0.1","annotation":[{"type":"Annotation","s":{"r":"1","s":[{"value":["","using "]},{"s":[{"value":["FHIR"]}]},{"value":[" version ","\'4.0.1\'"]}]}}]}]},"includes":{"def":[{"localId":"2","locator":"5:1-5:56","localIdentifier":"FHIRHelpers","path":"FHIRHelpers","version":"4.0.001","annotation":[{"type":"Annotation","s":{"r":"2","s":[{"value":["","include "]},{"s":[{"value":["FHIRHelpers"]}]},{"value":[" version ","\'4.0.001\'"," called ","FHIRHelpers"]}]}}]}]},"parameters":{"def":[{"localId":"5","locator":"7:1-7:49","name":"Measurement Period","accessLevel":"Public","annotation":[{"type":"Annotation","s":{"r":"5","s":[{"value":["","parameter ","\\"Measurement Period\\""," "]},{"r":"4","s":[{"value":["Interval<"]},{"r":"3","s":[{"value":["DateTime"]}]},{"value":[">"]}]}]}}],"parameterTypeSpecifier":{"localId":"4","locator":"7:32-7:49","type":"IntervalTypeSpecifier","pointType":{"localId":"3","locator":"7:41-7:48","name":"{urn:hl7-org:elm-types:r1}DateTime","type":"NamedTypeSpecifier"}}}]},"contexts":{"def":[{"locator":"9:1-9:15","name":"Patient"}]},"statements":{"def":[{"locator":"9:1-9:15","name":"Patient","context":"Patient","expression":{"type":"SingletonFrom","operand":{"locator":"9:1-9:15","dataType":"{http://hl7.org/fhir}Patient","templateId":"http://hl7.org/fhir/StructureDefinition/Patient","type":"Retrieve"}}},{"localId":"15","locator":"11:1-12:73","name":"first","context":"Patient","accessLevel":"Public","annotation":[{"type":"Annotation","s":{"r":"15","s":[{"value":["","define ","\\"first\\"",":\\n  "]},{"r":"14","s":[{"value":["exists "]},{"r":"13","s":[{"s":[{"r":"7","s":[{"r":"6","s":[{"r":"6","s":[{"value":["[","\\"Encounter\\"","]"]}]}]},{"value":[" ","E"]}]}]},{"value":[" "]},{"r":"12","s":[{"value":["where "]},{"r":"12","s":[{"r":"10","s":[{"r":"9","s":[{"r":"8","s":[{"value":["E"]}]},{"value":["."]},{"r":"9","s":[{"value":["period"]}]}]},{"value":["."]},{"r":"10","s":[{"value":["start"]}]}]},{"r":"12","value":[" ","during"," "]},{"r":"11","s":[{"value":["\\"Measurement Period\\""]}]}]}]}]}]}]}}],"expression":{"localId":"14","locator":"12:3-12:73","type":"Exists","operand":{"localId":"13","locator":"12:10-12:73","type":"Query","source":[{"localId":"7","locator":"12:10-12:24","alias":"E","expression":{"localId":"6","locator":"12:10-12:22","dataType":"{http://hl7.org/fhir}Encounter","templateId":"http://hl7.org/fhir/StructureDefinition/Encounter","type":"Retrieve"}}],"relationship":[],"where":{"localId":"12","locator":"12:26-12:73","type":"In","operand":[{"name":"ToDateTime","libraryName":"FHIRHelpers","type":"FunctionRef","operand":[{"localId":"10","locator":"12:32-12:45","path":"start","type":"Property","source":{"localId":"9","locator":"12:32-12:39","path":"period","scope":"E","type":"Property"}}]},{"localId":"11","locator":"12:54-12:73","name":"Measurement Period","type":"ParameterRef"}]}}}},{"localId":"17","locator":"14:1-15:9","name":"second","context":"Patient","accessLevel":"Public","annotation":[{"type":"Annotation","s":{"r":"17","s":[{"value":["","define ","\\"second\\"",":\\n  "]},{"r":"16","s":[{"value":["\\"first\\""]}]}]}}],"expression":{"localId":"16","locator":"15:3-15:9","name":"first","type":"ExpressionRef"}},{"localId":"26","locator":"17:1-18:52","name":"third","context":"Patient","accessLevel":"Public","annotation":[{"type":"Annotation","s":{"r":"26","s":[{"value":["","define ","\\"third\\"",":\\n  "]},{"r":"25","s":[{"value":["exists "]},{"r":"24","s":[{"s":[{"r":"19","s":[{"r":"18","s":[{"r":"18","s":[{"value":["[","\\"Encounter\\"","]"]}]}]},{"value":[" ","E"]}]}]},{"value":[" "]},{"r":"23","s":[{"value":["where "]},{"r":"23","s":[{"r":"21","s":[{"r":"20","s":[{"value":["E"]}]},{"value":["."]},{"r":"21","s":[{"value":["status"]}]}]},{"value":[" ","~"," "]},{"r":"22","s":[{"value":["\'finished\'"]}]}]}]}]}]}]}}],"expression":{"localId":"25","locator":"18:3-18:52","type":"Exists","operand":{"localId":"24","locator":"18:10-18:52","type":"Query","source":[{"localId":"19","locator":"18:10-18:24","alias":"E","expression":{"localId":"18","locator":"18:10-18:22","dataType":"{http://hl7.org/fhir}Encounter","templateId":"http://hl7.org/fhir/StructureDefinition/Encounter","type":"Retrieve"}}],"relationship":[],"where":{"localId":"23","locator":"18:26-18:52","type":"Equivalent","operand":[{"name":"ToString","libraryName":"FHIRHelpers","type":"FunctionRef","operand":[{"localId":"21","locator":"18:32-18:39","path":"status","scope":"E","type":"Property"}]},{"localId":"22","locator":"18:43-18:52","valueType":"{urn:hl7-org:elm-types:r1}String","value":"finished","type":"Literal"}]}}}}]}}}',
  groups: [
    {
      id: "population-group-1",
      scoring: "Proportion",
      populationBasis: "boolean",
      populations: [
        {
          id: "id-1",
          name: PopulationType.INITIAL_POPULATION,
          definition: "first",
        },
        {
          id: "id-2",
          name: PopulationType.DENOMINATOR,
          definition: "second",
        },
        {
          id: "id-3",
          name: PopulationType.NUMERATOR,
          definition: "third",
        },
      ],
      stratifications: [
        {
          id: "id-4",
          association: PopulationType.INITIAL_POPULATION,
          cqlDefinition: "cql definition",
          associations: [PopulationType.INITIAL_POPULATION],
        },
      ],
      measureGroupTypes: [MeasureGroupTypes.OUTCOME],
    },
  ],
  createdAt: "2022-03-24T17:39:55.871Z",
  createdBy: "joseph.kotanchik@semanticbits.com",
  lastModifiedAt: "2022-03-25T19:32:56.083Z",
  lastModifiedBy: "joseph.kotanchik@semanticbits.com",
  measurementPeriodStart: new Date("2023-01-01"),
  measurementPeriodEnd: new Date("2023-12-31"),
  baseConfigurationTypes: [BaseConfigurationTypes.PROCESS],
  model: Model.QICORE,
  measureMetaData: {
    steward: null,
    description: null,
    copyright: null,
    disclaimer: null,
  },
};
