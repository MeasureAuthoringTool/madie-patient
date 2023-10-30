import moment from "moment";
import cqmModels from "cqm-models";
import * as _ from "lodash";
import { getDataElementClass } from "./DataElementHelper";

export const PRIMARY_TIMING_ATTRIBUTES = [
  "relevantPeriod",
  "relevantDatetime",
  "prevalencePeriod",
  "participationPeriod",
  "authorDatetime",
  "resultDatetime",
  "activeDatetime",
  "receivedDatetime",
  "statusDate",
  "sentDatetime",
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

// This is specific to DataElements Table as multiple data types from same attribute has to be displayed in same cell
export const generateAttributesToDisplay = (
  dataElement,
  dataElements,
  codeSystemMap: any
) => {
  const dataElementClass = getDataElementClass(dataElement);
  const modeledEl = new dataElementClass(dataElement);
  const displayAttributes = [];
  modeledEl.schema.eachPath((path, info) => {
    if (!SKIP_ATTRIBUTES.includes(path) && !_.isEmpty(dataElement[path])) {
      if (info.instance === "Array") {
        const multipleDataTypes = [];
        dataElement[path].forEach((elem) => {
          if (path == "relatedTo") {
            const display = getDisplayFromId(dataElements, elem);
            let value = `${stringifyValue(
              display?.description,
              true
            )} ${stringifyValue(display?.timing, true, codeSystemMap)}}`;
            multipleDataTypes.push({
              name: _.replace(elem._type, "QDM::", ""),
              title: _.startCase(path),
              value: value,
            });
          } else {
            multipleDataTypes.push({
              name: _.replace(elem._type, "QDM::", ""),
              title: _.startCase(path),
              value: stringifyValue(elem, true, codeSystemMap),
              id: elem._id.toString(),
            });
          }
        });
        displayAttributes.push({
          isMultiple: true,
          additionalElements: multipleDataTypes,
        });
      } else if (path === "relatedTo") {
        const id = dataElement[path];
        const display = getDisplayFromId(dataElements, id);
        const value = `${stringifyValue(
          display.description,
          true
        )} ${stringifyValue(display.timing, true)}`;
        displayAttributes.push({
          name: path,
          title: _.startCase(path),
          value: value,
          isMultiple: false,
        });
      } else {
        displayAttributes.push({
          name: path,
          title: _.startCase(path),
          value: stringifyValue(dataElement[path], true, codeSystemMap),
          isMultiple: false,
        });
      }
    }
  });
  return displayAttributes;
};

// from https://github.com/MeasureAuthoringTool/bonnie/blob/master/app/assets/javascripts/views/patient_builder/data_criteria_attribute_display.js.coffee
export const stringifyValue = (value, topLevel = false, codeSystemMap = {}) => {
  if (!value) {
    return "null";
  }
  if (value instanceof cqmModels.CQL.Code) {
    const title = codeSystemMap[value.system] || value.system;
    return `${title} : ${value.code}`;
  } else if (value.unit == "%") {
    return `${value.value} ${value.unit}`;
  } else if (value.low || value.high) {
    let lowString = value.low ? stringifyValue(value.low) : "N/A";
    let highString = value.high ? stringifyValue(value.high) : "N/A";
    return `${lowString} - ${highString}`;
  } else if (isNaN(value) && !isNaN(Date.parse(value))) {
    //Value might be a string, so let's see if the string is a number.
    if (value instanceof cqmModels.CQL.DateTime) {
      return moment.utc(value.toJSDate(), true).format("L LT");
    }
    if (value instanceof cqmModels.CQL.Date || value.isDate) {
      return moment.utc(value.toJSDate()).format("L");
    }
    // could be a UTC string
    const parsedDate = Date.parse(value);
    const resultDate = new Date(parsedDate);
    // treat date differently
    const year = resultDate.getUTCFullYear() || null;
    const month = resultDate.getUTCMonth()
      ? resultDate.getUTCMonth() + 1
      : null;
    let day = resultDate.getUTCDay() ? resultDate.getUTCDay() + 1 : null; // this works only for utc.. bug point.
    const hours = resultDate.getUTCHours() || null;
    const minutes = resultDate.getUTCMinutes() || null;
    const seconds = resultDate.getUTCSeconds() || null;
    const ms = resultDate.getUTCMilliseconds() || null;
    // if we decide to convert it based off of locale to user.
    let timeZoneOffset = resultDate.getTimezoneOffset()
      ? resultDate.getTimezoneOffset() / 60
      : null;

    const currentDate = new cqmModels.CQL.DateTime(
      year,
      month,
      day,
      hours,
      minutes,
      seconds,
      ms,
      timeZoneOffset
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
    }
    return moment.utc(currentDate.toJSDate()).format("L LT");
  }
  // this block is currently unused but should be uncommented when the dataTypes are tested
  else if (value?.[0]?.schema || value.schema) {
    // typeof number parses to a date. Check to make sure it's not a number.
    let attrStrings = [];
    let attrString = "";
    const schema = value?.[0]?.schema ? value?.[0]?.schema : value.schema; // catches diagnoses, facilityLocations != Participant
    schema.eachPath((path) => {
      if (!_.without(SKIP_ATTRIBUTES, "id").includes(path)) {
        const valueToStringify =
          value?.[0] === undefined ? value?.[path] : value?.[0]?.[path];
        attrStrings.push(
          _.startCase(path) +
            ": " +
            stringifyValue(valueToStringify, false, codeSystemMap)
        );
      }
    });
    attrString = attrStrings.join(", ");
    if (value?.[0]?._type && value?.[0]?._type !== "QDM::Identifier") {
      attrString = `[${value?.[0]?._type.replace("QDM::", "")}] ${attrString}`;
    }
    if (!topLevel) {
      attrString = `{ ${attrString} }`;
    }
    return attrString;
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
