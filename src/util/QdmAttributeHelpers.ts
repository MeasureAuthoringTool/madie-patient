import moment from "moment";
import cqmModels from "cqm-models";
import * as _ from "lodash";
import { DateTime } from "cql-execution";

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

// from https://github.com/MeasureAuthoringTool/bonnie/blob/master/app/assets/javascripts/views/patient_builder/data_criteria_attribute_display.js.coffee
export const stringifyValue = (value, topLevel = false) => {
  if (!value) {
    return "null";
  }
  if (value instanceof cqmModels.CQL.Code) {
    return `${value.system} : ${value.code}`;
  }
  // good
  // it's some kind of date
  else if (!isNaN(Date.parse(value))) {
    const parsedDate = Date.parse(value);
    const resultDate = new Date(parsedDate);
    const year = resultDate.getUTCFullYear() || null;
    
    const month = resultDate.getUTCMonth() ? resultDate.getUTCMonth()+1 : null;
    const day = resultDate.getUTCDay() ? resultDate.getUTCDay()+1 : null

    const hours = resultDate.getUTCHours() || null;
    const minutes = resultDate.getUTCMinutes() || null;
    const seconds = resultDate.getUTCSeconds() || null;
    const ms = resultDate.getUTCMilliseconds() || null;
    // if we decide to convert it based off of locale to user.
    // const timeZoneOffset = resultDate.getTimezoneOffset() ? (resultDate.getTimezoneOffset()): null;
    const currentDate = new DateTime(
      year,
      month,
      day,
      hours,
      minutes,
      seconds,
      ms,
      0
    );
    
    if (currentDate.isTime()) {
      return moment(
        new Date(
          2012,
          1,
          1,
          currentDate.hour,
          currentDate.minute,
          currentDate.second
        )
      ).format("LT");
    } else if (currentDate.isDate) {
      return moment.utc(currentDate.toJSDate()).format("L");
    } else {
      return moment.utc(currentDate.toJSDate()).format("L LT");
    }
  }
  // this block is currently unused but should be uncommented when the dataTypes are tested
  // else if (value.schema) {
  //   let attrStrings = [];
  //   let attrString = "";
  //   value.schema.eachPath((path) => {
  //     if (_.without(SKIP_ATTRIBUTES, "id").includes(path)) {
  //       return attrStrings.push(
  //         _.startCase(path) + ": " + stringifyValue(value[path])
  //       );
  //     }
  //     attrString = attrStrings.join(", ");
  //     if (value._type && value._type !== "QDM::Identifier") {
  //       attrString = `[${value._type.replace("QDM::", "")}] ${attrString}`;
  //     }
  //     if (!topLevel) {
  //       attrString = `{ ${attrString} }`;
  //     }
  //     return attrString;
  //   });
  // }
  else if (value.high || value.low) {
    let lowString = value.low ? stringifyValue(value.low) : "null";
    let highString = value.high ? stringifyValue(value.high) : "null";
    return `${lowString} - ${highString}`;
  } else {
    return value.toString();
  }
};
// sourceDataCriteria is really just a list of elements
export const getDisplayFromId = (sourceDataCriteria, id) => {
  for (let i = 0; i < sourceDataCriteria.length; i++) {
    const dataElement = sourceDataCriteria[i];
    if (dataElement.id === id) {
      const primaryTimingAttributes = [];
      PRIMARY_TIMING_ATTRIBUTES.forEach((attribute) => {
        if (dataElement[attribute]) {
          primaryTimingAttributes.push(attribute);
        }
      });
      const primaryTimingAttribute = primaryTimingAttributes[0];
      const timing = dataElement[primaryTimingAttribute];
      const description = `${dataElement.description}`;
      return { description: description, timing: timing };
    }
  }
  return null;
};
