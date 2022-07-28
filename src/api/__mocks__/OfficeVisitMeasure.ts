import {
  Measure,
  MeasureGroupTypes,
  Model,
  PopulationType,
} from "@madie/madie-models";

export const officeVisitMeasure: Measure = {
  version: 0,
  id: "626be3ca0ca8110d3b22404a",
  active: true,
  cql: 'library SimpleFhirMeasureLib version \'0.0.004\'\n\nusing FHIR version \'4.0.1\'\n\ninclude FHIRHelpers version \'4.0.001\' called FHIRHelpers\n\nvalueset "Office Visit": \'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'\n\nparameter "Measurement Period" Interval<DateTime>\n\ncontext Patient\n\ndefine "ipp":\n  exists ["Encounter": "Office Visit"] E where E.period.start during "Measurement Period"\n\ndefine "denom":\n  "ipp"\n\ndefine "num":\n  exists ["Encounter": "Office Visit"] E where E.status ~ \'finished\'',
  cqlErrors: false,
  cqlLibraryName: "SimpleFhirMeasureLib",
  createdAt: "2022-04-29T13:10:34.412Z",
  createdBy: "test",
  elmJson:
    '{"library":{"identifier":{"id":"SimpleFhirMeasureLib","version":"0.0.004"},"schemaIdentifier":{"id":"urn:hl7-org:elm","version":"r1"},"usings":{"def":[{"localIdentifier":"System","uri":"urn:hl7-org:elm-types:r1"},{"localId":"1","locator":"3:1-3:26","localIdentifier":"FHIR","uri":"http://hl7.org/fhir","version":"4.0.1","annotation":[{"type":"Annotation","s":{"r":"1","s":[{"value":["","using "]},{"s":[{"value":["FHIR"]}]},{"value":[" version ","\'4.0.1\'"]}]}}]}]},"includes":{"def":[{"localId":"2","locator":"5:1-5:56","localIdentifier":"FHIRHelpers","path":"FHIRHelpers","version":"4.0.001","annotation":[{"type":"Annotation","s":{"r":"2","s":[{"value":["","include "]},{"s":[{"value":["FHIRHelpers"]}]},{"value":[" version ","\'4.0.001\'"," called ","FHIRHelpers"]}]}}]}]},"parameters":{"def":[{"localId":"6","locator":"9:1-9:49","name":"Measurement Period","accessLevel":"Public","annotation":[{"type":"Annotation","s":{"r":"6","s":[{"value":["","parameter ","\\"Measurement Period\\""," "]},{"r":"5","s":[{"value":["Interval<"]},{"r":"4","s":[{"value":["DateTime"]}]},{"value":[">"]}]}]}}],"parameterTypeSpecifier":{"localId":"5","locator":"9:32-9:49","type":"IntervalTypeSpecifier","pointType":{"localId":"4","locator":"9:41-9:48","name":"{urn:hl7-org:elm-types:r1}DateTime","type":"NamedTypeSpecifier"}}}]},"valueSets":{"def":[{"localId":"3","locator":"7:1-7:104","name":"Office Visit","id":"http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001","accessLevel":"Public","annotation":[{"type":"Annotation","s":{"r":"3","s":[{"value":["","valueset ","\\"Office Visit\\"",": ","\'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001\'"]}]}}]}]},"contexts":{"def":[{"locator":"11:1-11:15","name":"Patient"}]},"statements":{"def":[{"locator":"11:1-11:15","name":"Patient","context":"Patient","expression":{"type":"SingletonFrom","operand":{"locator":"11:1-11:15","dataType":"{http://hl7.org/fhir}Patient","templateId":"http://hl7.org/fhir/StructureDefinition/Patient","type":"Retrieve"}}},{"localId":"16","locator":"13:1-14:89","name":"ipp","context":"Patient","accessLevel":"Public","annotation":[{"type":"Annotation","s":{"r":"16","s":[{"value":["","define ","\\"ipp\\"",":\\n  "]},{"r":"15","s":[{"value":["exists "]},{"r":"14","s":[{"s":[{"r":"8","s":[{"r":"7","s":[{"r":"7","s":[{"value":["[","\\"Encounter\\"",": "]},{"s":[{"value":["\\"Office Visit\\""]}]},{"value":["]"]}]}]},{"value":[" ","E"]}]}]},{"value":[" "]},{"r":"13","s":[{"value":["where "]},{"r":"13","s":[{"r":"11","s":[{"r":"10","s":[{"r":"9","s":[{"value":["E"]}]},{"value":["."]},{"r":"10","s":[{"value":["period"]}]}]},{"value":["."]},{"r":"11","s":[{"value":["start"]}]}]},{"r":"13","value":[" ","during"," "]},{"r":"12","s":[{"value":["\\"Measurement Period\\""]}]}]}]}]}]}]}}],"expression":{"localId":"15","locator":"14:3-14:89","type":"Exists","operand":{"localId":"14","locator":"14:10-14:89","type":"Query","source":[{"localId":"8","locator":"14:10-14:40","alias":"E","expression":{"localId":"7","locator":"14:10-14:38","dataType":"{http://hl7.org/fhir}Encounter","templateId":"http://hl7.org/fhir/StructureDefinition/Encounter","codeProperty":"type","codeComparator":"in","type":"Retrieve","codes":{"locator":"14:24-14:37","name":"Office Visit","preserve":true,"type":"ValueSetRef"}}}],"relationship":[],"where":{"localId":"13","locator":"14:42-14:89","type":"In","operand":[{"name":"ToDateTime","libraryName":"FHIRHelpers","type":"FunctionRef","operand":[{"localId":"11","locator":"14:48-14:61","path":"start","type":"Property","source":{"localId":"10","locator":"14:48-14:55","path":"period","scope":"E","type":"Property"}}]},{"localId":"12","locator":"14:70-14:89","name":"Measurement Period","type":"ParameterRef"}]}}}},{"localId":"18","locator":"16:1-17:7","name":"denom","context":"Patient","accessLevel":"Public","annotation":[{"type":"Annotation","s":{"r":"18","s":[{"value":["","define ","\\"denom\\"",":\\n  "]},{"r":"17","s":[{"value":["\\"ipp\\""]}]}]}}],"expression":{"localId":"17","locator":"17:3-17:7","name":"ipp","type":"ExpressionRef"}},{"localId":"27","locator":"19:1-20:68","name":"num","context":"Patient","accessLevel":"Public","annotation":[{"type":"Annotation","s":{"r":"27","s":[{"value":["","define ","\\"num\\"",":\\n  "]},{"r":"26","s":[{"value":["exists "]},{"r":"25","s":[{"s":[{"r":"20","s":[{"r":"19","s":[{"r":"19","s":[{"value":["[","\\"Encounter\\"",": "]},{"s":[{"value":["\\"Office Visit\\""]}]},{"value":["]"]}]}]},{"value":[" ","E"]}]}]},{"value":[" "]},{"r":"24","s":[{"value":["where "]},{"r":"24","s":[{"r":"22","s":[{"r":"21","s":[{"value":["E"]}]},{"value":["."]},{"r":"22","s":[{"value":["status"]}]}]},{"value":[" ","~"," "]},{"r":"23","s":[{"value":["\'finished\'"]}]}]}]}]}]}]}}],"expression":{"localId":"26","locator":"20:3-20:68","type":"Exists","operand":{"localId":"25","locator":"20:10-20:68","type":"Query","source":[{"localId":"20","locator":"20:10-20:40","alias":"E","expression":{"localId":"19","locator":"20:10-20:38","dataType":"{http://hl7.org/fhir}Encounter","templateId":"http://hl7.org/fhir/StructureDefinition/Encounter","codeProperty":"type","codeComparator":"in","type":"Retrieve","codes":{"locator":"20:24-20:37","name":"Office Visit","preserve":true,"type":"ValueSetRef"}}}],"relationship":[],"where":{"localId":"24","locator":"20:42-20:68","type":"Equivalent","operand":[{"name":"ToString","libraryName":"FHIRHelpers","type":"FunctionRef","operand":[{"localId":"22","locator":"20:48-20:55","path":"status","scope":"E","type":"Property"}]},{"localId":"23","locator":"20:59-20:68","valueType":"{urn:hl7-org:elm-types:r1}String","value":"finished","type":"Literal"}]}}}}]}},"externalErrors":[]}',
  groups: [
    {
      id: "626be4370ca8110d3b22404b",
      scoring: "Proportion",
      populations: [
        {
          id: "id-1",
          name: PopulationType.INITIAL_POPULATION,
          definition: "ipp",
        },
        {
          id: "id-2",
          name: PopulationType.DENOMINATOR,
          definition: "denom",
        },
        {
          id: "id-3",
          name: PopulationType.NUMERATOR,
          definition: "num",
        },
      ],
      measureGroupTypes: [MeasureGroupTypes.OUTCOME],
      groupDescription: null,
    },
  ],
  lastModifiedAt: "2022-06-02T18:18:53.971Z",
  lastModifiedBy: "test",
  measureHumanReadableId: null,
  measureMetaData: {
    steward: "test",
    description: "Test Description",
    copyright: null,
    disclaimer: null,
    rationale: null,
  },
  measureName: "SimpleFhirMeasure",
  measureSetId: null,
  measurementPeriodEnd: new Date("2023-12-21"),
  measurementPeriodStart: new Date("2022-01-01"),
  model: Model.QICORE,
  revisionNumber: null,
  state: null,
};
