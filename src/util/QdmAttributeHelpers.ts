export const PRIMARY_TIMING_ATTRIBUTES = [
  "relevantPeriod",
  "relevantDatetime",
  "prevalencePeriod",
  "participationPeriod",
  "authorDatetime",
  "resultDatetime",
];

// the attributes to skip in user attribute view and editing fields
export const SKIP_ATTRIBUTES = [
  "dataElementCodes",
  "codeListId",
  "description",
  "id",
  "_id",
  "qrdaOid",
  "qdmTitle",
  "hqmfOid",
  "qdmCategory",
  "qdmVersion",
  "qdmStatus",
  "negationRationale",
  "_type",
].concat(PRIMARY_TIMING_ATTRIBUTES);

export const ENTITY_TYPES = [
  "PatientEntity",
  "CarePartner",
  "Practitioner",
  "Organization",
  "Location",
];

// This code came over from Bonnie
export const determineAttributeTypeList = (path, info) => {
  // if is array type we need to find out what type it should be
  if (info.instance == "Array")
    if (info.$isMongooseDocumentArray)
      if (info.schema.paths._type)
        // Use the default _type if exists to get info
        return [info.schema.paths._type.defaultValue.replace(/QDM::/, "")];
      else if (info.schema.paths.namingSystem)
        // if this has namingSystem assume it is QDM::Id
        return ["Id"];
      else return ["???"];
    // TODO: Handle situation of unknown type better.
    else if (info.caster.instance)
      if (info.caster.instance == "AnyEntity")
        // if this is a schema array we may be able to ask for the caster's instance type
        return ENTITY_TYPES;
      else return [info.caster.instance];
    else return ["???"];
  // TODO: Handle situation of unknown type better.
  // If this is an any type, there will be more options than one.
  else if (info.instance == "Any")
    // TODO: Filter these more if possible
    return [
      "Code",
      "Quantity",
      "Ratio",
      "Integer",
      "Decimal",
      "Date",
      "DateTime",
      "Time",
    ];
  // It this is an AnyEntity type
  else if (info.instance == "AnyEntity") return ENTITY_TYPES;
  // If it is an interval, it may be one of DateTime or one of Quantity
  else if (info.instance == "Interval")
    if (path == "referenceRange") return ["Interval<Quantity>"];
    else return ["Interval<DateTime>"];
  // If it is an embedded type, we have to make guesses about the type
  else if (info.instance == "Embedded")
    if (info.schema.paths.namingSystem)
      // if this has namingSystem assume it is QDM::Identifier
      return ["Identifier"];
    else if (info.path == "facilityLocation") return ["FacilityLocation"];
    else return ["???"];
  // TODO: Handle situation of unknown type better.
  else return [info.instance];
};
