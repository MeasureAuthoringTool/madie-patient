export const US_CORE_RACE =
  "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race";
export const US_CORE_ETHNICITY =
  "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity";

export interface CodeSystem {
  code: string;
  system: string;
  display: string;
  definition?: string;
}
export const ETHNICITY_CODE_OPTIONS: CodeSystem[] = [
  {
    code: "2135-2",
    display: "Hispanic or Latino",
    system: "urn:oid:2.16.840.1.113883.6.238",
  },
  {
    code: "2186-5",
    display: "Not Hispanic or Latino",
    system: "urn:oid:2.16.840.1.113883.6.238",
  },
];

export const ETHNICITY_DETAILED_CODE_OPTIONS: CodeSystem[] = [
  {
    code: "2137-8",
    display: "Spaniard",
    system: "urn:oid:2.16.840.1.113883.6.238",
  },
  {
    code: "2148-5",
    display: "Mexican",
    system: "urn:oid:2.16.840.1.113883.6.238",
  },
  {
    code: "2155-0",
    display: "Central American",
    system: "urn:oid:2.16.840.1.113883.6.238",
  },
];

export const RACE_OMB_CODE_OPTIONS: CodeSystem[] = [
  {
    code: "1002-5",
    display: "American Indian or Alaska Native",
    system: "urn:oid:2.16.840.1.113883.6.238",
  },
  {
    code: "2028-9",
    display: "Asian",
    system: "urn:oid:2.16.840.1.113883.6.238",
  },
  {
    code: "2054-5",
    display: "Black or African American",
    system: "urn:oid:2.16.840.1.113883.6.238",
  },
  {
    code: "2076-8",
    display: "Native Hawaiian or Other Pacific Islander",
    system: "urn:oid:2.16.840.1.113883.6.238",
  },
  {
    code: "2106-3",
    display: "White",
    system: "urn:oid:2.16.840.1.113883.6.238",
  },
  {
    code: "2131-1",
    display: "Other Race",
    system: "urn:oid:2.16.840.1.113883.6.238",
  },
];
// http://hl7.org/fhir/R4/valueset-administrative-gender.html
export const GENDER_CODE_OPTIONS = [
  {
    code: "male",
    display: "Male",
  },
  {
    code: "female",
    display: "Female",
  },
  {
    code: "other",
    display: "Other",
  },
  {
    code: "unknown",
    display: "Unknown",
  },
];

// this is just a small array of hardcode options for scope of this story
// TO DO: call an API to get all code systems present in the "http://hl7.org/fhir/us/core/STU5.0.1/ValueSet-detailed-race.html"
export const RACE_DETAILED_CODE_OPTIONS: CodeSystem[] = [
  {
    code: "1004-1",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "American Indian",
    definition: "",
  },
  {
    code: "1006-6",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "Abenaki",
    definition: "",
  },
  {
    code: "1008-2",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "Algonquian",
    definition: "",
  },
  {
    code: "1010-8",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "Apache",
    definition: "",
  },
  {
    code: "1011-6",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "Chiricahua",
    definition: "",
  },
  {
    code: "1012-4",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "Fort Sill Apache",
    definition: "",
  },
  {
    code: "  1013-2",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "Jicarilla Apache",
    definition: "",
  },
  {
    code: "1014-0",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "Lipan Apache",
    definition: "",
  },
  {
    code: "1015-7",
    system: "urn:oid:2.16.840.1.113883.6.238",
    display: "Mescalero Apache",
    definition: "",
  },
];

export const createExtension = (value, name, resourceExtensions) => {
  const displayNamesPresentInJson = resourceExtensions
    .filter((ext) => ext.url === matchName(name))
    .map((extension) => extension.valueCoding.display);

  if (!displayNamesPresentInJson.includes(value)) {
    if (name === "raceOMB") {
      return getDataResource(value, name, RACE_OMB_CODE_OPTIONS);
    }
    if (name === "raceDetailed") {
      return getDataResource(value, name, RACE_DETAILED_CODE_OPTIONS);
    }
    if (name === "ethnicityOMB") {
      return getDataResource(value, name, ETHNICITY_CODE_OPTIONS);
    }
    if (name === "ethnicityDetailed") {
      return getDataResource(value, name, ETHNICITY_DETAILED_CODE_OPTIONS);
    }
    return;
  }
};

export const deleteExtension = (value, presentExtensionsInJson) => {
  return presentExtensionsInJson.filter(
    (ext) => ext?.valueCoding?.display !== value
  );
};

export const updateEthnicityExtension = (value, name, resourceExtensions) => {
  if (value === "Not Hispanic or Latino") {
    const filteredExtensions = resourceExtensions.filter(
      (resourceExt) =>
        resourceExt.url !== "ombCategory" &&
        resourceExt.url !== "detailed" &&
        resourceExt.url !== "text"
    );
    return [
      ...filteredExtensions,
      getDataResource(value, name, ETHNICITY_CODE_OPTIONS),
      { url: "text", valueString: value },
    ];
  } else if (value === "Hispanic or Latino") {
    const filteredExtensions = resourceExtensions.filter(
      (resourceExt) =>
        resourceExt.url !== "ombCategory" && resourceExt.url !== "text"
    );
    return [
      ...filteredExtensions,
      getDataResource(value, name, ETHNICITY_CODE_OPTIONS),
      { url: "text", valueString: value },
    ];
  } else {
    return [];
  }
};

export const matchName = (name: string) => {
  if (name.endsWith("OMB")) {
    return "ombCategory";
  }
  return "detailed";
};

export const matchNameWithUrl = (name: string) => {
  if (name.startsWith("race")) {
    return US_CORE_RACE;
  }
  if (name.startsWith("ethnicity")) {
    return US_CORE_ETHNICITY;
  }
};

export const getDataResource = (
  value: string,
  name: string,
  code_options: CodeSystem[]
) => {
  const newCode = getNewCode(code_options, value);
  return {
    url: matchName(name),
    valueCoding: newCode,
  };
};

export const getNewCode = (options, selectedValue: string) => {
  const found = options.find((option) => selectedValue === option.display);
  return {
    code: found?.code,
    system: found?.system,
    display: found?.display,
  };
};
