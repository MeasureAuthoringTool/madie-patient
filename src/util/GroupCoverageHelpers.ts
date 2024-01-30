import { CqlAntlr } from "@madie/cql-antlr-parser/dist/src";
import { PopulationType, PopulationExpectedValue } from "@madie/madie-models";

export interface Population {
  abbreviation: string;
  id: string;
  criteriaReference?: string;
  name: PopulationType;
}

export interface QDMCqlDefinition {
  [definitionName: string]: {
    definitionLogic: string;
    parentLibrary: string;
    calculationResult?: string;
  };
}

export interface CoverageMappedCql {
  populationDefinitions: {
    id: string;
    [populationName: string]: string;
  };
  functions: QDMCqlDefinition;
  definitions: QDMCqlDefinition;
}

export interface CqlDefinitionExpression {
  id?: string;
  definitionName: string;
  definitionLogic: string;
  context: string;
  supplDataElement: boolean;
  popDefinition: boolean;
  commentString: string;
  returnType: string | null;
  parentLibrary: string | null;
  libraryDisplayName: string | null;
  libraryVersion: string | null;
  function: boolean;
  name: string;
  logic: string;
}

export const abbreviatedPopulations = {
  initialPopulation: "IP",
  denominator: "DENOM",
  denominatorExclusion: "DENEX",
  numerator: "NUMER",
  numeratorExclusion: "NUMEX",
  denominatorException: "DENEXCEP",
  measurePopulation: "MSRPOPL",
  measurePopulationExclusion: "MSRPOPLEX",
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

export const isPopulation = (name: string) => {
  return name !== "Functions" && name !== "Definitions" && name !== "Unused";
};

// there's no coverage here at all.
export const mapCoverageCql = (
  measureCql: string,
  groupPopulations,
  allDefinitions
): CoverageMappedCql => {
  // filter populations by weather they have a definition
  const filteredPopulations = groupPopulations.populations.filter(
    (population) => population.definition
  );
  const result = { ...groupPopulations, populations: filteredPopulations };
  if (measureCql && result) {
    const definitions = new CqlAntlr(measureCql).parse().expressionDefinitions;
    const populationDetails = result.populations.reduce((acc, population) => {
      const matchingDef = definitions.find(
        (def) => def.name.replace(/"/g, "") === population.definition
      );
      if (matchingDef) {
        acc[population.name] = { id: population.id, text: matchingDef.text };
      }

      return acc;
    }, {});

    const functionDetails = allDefinitions
      ?.filter((definition) => definition.function)
      .reduce((result, definition) => {
        result[definition.definitionName] = {
          definitionLogic: definition?.definitionLogic,
          parentLibrary: definition?.parentLibrary,
        };
        return result;
      }, {});

    const allDefinitionDetails = allDefinitions
      ?.filter((definition) => !definition.function)
      .reduce((result, definition) => {
        result[definition.definitionName] = {
          definitionLogic: definition?.definitionLogic,
          parentLibrary: definition?.parentLibrary,
        };
        return result;
      }, {});

    return {
      populationDefinitions: populationDetails,
      functions: functionDetails,
      definitions: allDefinitionDetails,
    };
  }
};
