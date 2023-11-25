import { CqlAntlr } from "@madie/cql-antlr-parser/dist/src";
import { PopulationType, PopulationExpectedValue } from "@madie/madie-models";
import _ from "lodash";

export interface Population {
  abbreviation: string;
  id: string;
  criteriaReference?: string;
  name: PopulationType;
}
export interface MappedCql {
  [groupId: string]: {
    populationDefinitions: {
      [populationName: string]: string;
    };
  };
}

export const abbreviatedPopulations = {
  initialPopulation: "IP",
  denominator: "DENOM",
  denominatorExclusion: "DENEX",
  numerator: "NUMER",
  numeratorExclusion: "NUMEX",
  denominatorException: "DENEXCEP",
  measurePopulation: "MSRPOPL",
};

export const getPopulationAbbreviation = (
  populations: PopulationExpectedValue[],
  name: string,
  index: number
) => {
  const count = populations.filter((p) => p.name === name).length;
  return count > 1
    ? `${abbreviatedPopulations[name]} ${index + 1}`
    : abbreviatedPopulations[name];
};

export const getFirstPopulation = (group) => {
  return {
    abbreviation: "IP",
    criteriaReference: group.populationValues[0].criteriaReference,
    name: group.populationValues[0].name,
    id: group.populationValues[0].id,
  };
};

export const mapCql = (measureCql: string, measureGroups): MappedCql => {
  if (measureCql && measureGroups) {
    const definitions = new CqlAntlr(measureCql).parse().expressionDefinitions;
    return measureGroups.reduce((acc, group) => {
      const populationDetails = group.populations.reduce(
        (output, population) => {
          const matchingDefinition: any = definitions?.find(
            (def) =>
              _.camelCase(def?.name?.slice(1, -1)) ===
              _.camelCase(population.definition)
          );
          if (matchingDefinition) {
            output[population.name] = matchingDefinition.text;
          }
          return output;
        },
        {}
      );
      acc[group.id] = { populationDefinitions: populationDetails };
      return acc;
    }, {});
  }
};
