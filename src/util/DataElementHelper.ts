import cqmModels, { DataElement } from "cqm-models";
import * as _ from "lodash";

export function getDataElementClass(dataElement) {
  const qdmType = dataElement?._type; // match against for attributes
  const model = qdmType.split("QDM::")[1];
  return cqmModels[model];
}

// This looks to be implemented to avoid demographics clashing
export function filterDataElements(
  dataElements: DataElement[],
  category?: string
): DataElement[] {
  return dataElements?.filter((element) => {
    return (
      element.qdmStatus !== "ethnicity" &&
      element.qdmStatus !== "birthdate" &&
      element.qdmStatus !== "expired" &&
      element.qdmStatus !== "race" &&
      element.qdmStatus !== "gender" &&
      (_.isNil(category) || element.qdmCategory === category)
    );
  });
}
