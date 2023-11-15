import { CqlAntlr } from "@madie/cql-antlr-parser/dist/src";
import {
  PopulationType,
  PopulationExpectedValue,
  GroupPopulation,
} from "@madie/madie-models";
import _ from "lodash";

export interface Population {
  abbreviation: string;
  id: string;
  criteriaReference?: string;
  name: PopulationType;
}

export interface SelectedPopulationResult {
  criteriaReference: string;
  text: string;
}

export interface MappedCql {
  [groupId: string]: {
    populationDefinitions: {
      [populationName: string]: SelectedPopulationResult;
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

export const mapCql = (
  measureCql: string,
  groupPopulations: GroupPopulation[]
): MappedCql => {
  if (measureCql && groupPopulations) {
    const definitions = new CqlAntlr(measureCql).parse().expressionDefinitions;

    return groupPopulations.reduce((output, { groupId, populationValues }) => {
      output[groupId] = {
        populationDefinitions: populationValues.reduce(
          (populationDefinition, { name, criteriaReference }) => {
            const matchingDefinition: any = definitions.find(
              (def) => _.camelCase(def.name.slice(1, -1)) === name
            );

            populationDefinition[name] = {
              criteriaReference: criteriaReference || null,
              text: matchingDefinition?.text || null,
            };

            return populationDefinition;
          },
          {}
        ),
      };
      return output;
    }, {});
  }
};
