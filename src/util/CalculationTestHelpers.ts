import { Measure, Population } from "@madie/madie-models";
import { FHIRHelpers } from "./FHIRHelpers";
import { getFhirMeasurePopulationCode } from "./PopulationsMap";
import _ from "lodash";

export function buildMeasureBundle(measure: Measure): fhir4.Bundle {
  const bundle: fhir4.Bundle = {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      // Measure Resource
      {
        resource: {
          resourceType: "Measure",
          status: "draft", //TODO convert measure.state to status enum.
          library: [
            `http://ecqi.healthit.gov/ecqms/Library/${measure.cqlLibraryName}`,
          ],
          group: [],
        },
        request: { method: "PUT", url: `Measure/${measure.cqlLibraryName}` },
      },
      // Measure Library Resource
      {
        resource: {
          resourceType: "Library",
          url: `http://ecqi.healthit.gov/ecqms/Library/${measure.cqlLibraryName}`,
          status: "active",
          type: {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/library-type",
                code: "logic-library",
              },
            ],
          },
          content: [
            { contentType: "text/cql", data: `${btoa(measure.cql)}` },
            {
              contentType: "application/elm+json",
              data: `${btoa(measure.elmJson)}`,
            },
          ],
        },
        request: { method: "PUT", url: `Library/${measure.cqlLibraryName}` },
      },
      // FHIR Helpers
      { ...FHIRHelpers },
    ],
  };
  const measureResource: fhir4.Measure = bundle.entry.find(
    (e) => e.resource.resourceType === "Measure"
  ).resource as fhir4.Measure;

  buildMeasureGroups(measure, measureResource);

  return bundle;
}

function buildMeasureGroups(measure: Measure, measureResource: fhir4.Measure) {
  // verify if measureGroup is created? if not Calculation will fail, so return to user specifying to add atleast one measureGroup
  measure.groups?.map((group) => {
    const fhirMeasureGroup: fhir4.MeasureGroup = {};
    fhirMeasureGroup.population = buildMeasureGroup(group.populations);
    measureResource.group.push(fhirMeasureGroup);
  });
}

function buildMeasureGroup(
  measurePopulations: Population[]
): fhir4.MeasureGroupPopulation[] {
  return measurePopulations.map((population) => {
    return buildGroupPopulation(population);
  });
}

function buildGroupPopulation(
  population: Population
): fhir4.MeasureGroupPopulation {
  return {
    code: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/measure-population",
          code: getFhirMeasurePopulationCode(population.name),
          display: _.startCase(population.name),
        },
      ],
    },
    criteria: {
      language: "text/cql.identifier",
      expression: population.definition,
    },
  };
}

export function getExampleValueSet(): fhir4.ValueSet {
  return {
    status: "draft",
    resourceType: "ValueSet",
    id: "vs-1",
    url: "http://vsac.com/vs-1",
    compose: {
      include: [
        {
          system: "http://loinc.com",
          version: "1",
          concept: [
            {
              code: "code-1",
              display: "Code 1",
            },
            {
              code: "code-2",
              display: "Code 2",
            },
          ],
        },
      ],
    },
  };
}

/**
 * Builds a statement_relevance map assuming that every single population in the population set is relevant.
 * This is used by the logic view to determine which statements are unused to bin them properly. This is effectively
 * creating a statement_relevance map that doesn't regard results at all, to be used when you don't have a result.
 * @public
 * @param {cqmMeasure} measure - The measure.
 * @param {Population} populationSet - The populationSet we wish to get statement relevance for.
 * @return {object} Statement relevance map for the population set.
 */
export function getStatementRelevanceForPopulationSet(
  cqmMeasure,
  populationSet
) {
  // create a population relevance map where every population is true.
  const populationRelevance = {};

  if (!_.isEmpty(populationSet[0]["observations"])) {
    populationRelevance["observation_values"] = true;
  }

  for (const popSet of populationSet) {
    for (const pop in popSet.populations) {
      populationRelevance[pop] = true;
    }
  }

  return buildStatementRelevanceMap(
    populationRelevance,
    cqmMeasure,
    populationSet[0]
  );
}

/**
 * Builds the `statement_relevance` map. This map gets added to the Result attributes that the calculator returns.
 *
 * The statement_relevance map indicates which define statements were actually relevant to a population inclusion
 * consideration. This makes use of the 'population_relevance' map. This is actually a two level map. The top level is
 * a map of the CQL libraries, keyed by library name. The second level is a map for statement relevance in that library,
 * which maps each statement to its relevance status. The values in this map differ from the `population_relevance`
 * because we also need to track statements that are not used for any population calculation. Therefore the values are
 * a string that is one of the following: 'NA', 'TRUE', 'FALSE'. Here is what they mean:
 *
 * 'NA' - Not applicable. This statement is not relevant to any population calculation in this population_set. Common
 *   for unused library statements or statements only used for other population sets.
 *
 * 'FALSE' - This statement is not relevant to any of this patient's population inclusion calculations.
 *
 * 'TRUE' - This statement is relevant for one or more of the population inclusion calculations.
 *
 * Here is an example structure this function returns. (the `statement_relevance` map)
 * {
 *   "Test158": {
 *     "Patient": "NA",
 *     "SDE Ethnicity": "NA",
 *     "SDE Payer": "NA",
 *     "SDE Race": "NA",
 *     "SDE Sex": "NA",
 *     "Most Recent Delivery": "TRUE",
 *     "Most Recent Delivery Overlaps Diagnosis": "TRUE",
 *     "Initial Population": "TRUE",
 *     "Numerator": "TRUE",
 *     "Denominator Exceptions": "FALSE"
 *   },
 *   "TestLibrary": {
 *     "Numer Helper": "TRUE",
 *     "Denom Excp Helper": "FALSE",
 *     "Unused statement": "NA"
 *   }
 * }
 *
 * This function relies heavily on the cql_statement_dependencies map on the Measure to recursively determine which
 * statements are used in the relevant population statements. It also uses the 'population_relevance' map to determine
 * the relevance of the population defining statement and its dependent statements.
 * @public
 * @param {object} populationRelevance - The `population_relevance` map, used at the starting point.
 * @param {cqmMeasure} measure - The measure.
 * @param {population} populationSet - The population set being calculated.
 * @returns {object} The `statement_relevance` map that maps each statement to its relevance status for a calculation.
 *   This structure is put in the Result object's attributes.
 */
function buildStatementRelevanceMap(
  populationRelevance,
  cqmMeasure,
  populationSet
) {
  // build map defaulting to not applicable (NA) using cql_statement_dependencies structure
  const statementRelevanceMap = {};

  for (const library of cqmMeasure.cql_libraries) {
    statementRelevanceMap[library.library_name] = {};
    for (const statement of library.statement_dependencies) {
      statementRelevanceMap[library.library_name][statement.statement_name] =
        "NA";
    }
  }

  if (
    cqmMeasure.calculate_sdes &&
    populationSet["supplemental_data_elements"]
  ) {
    for (const sde of populationSet["supplemental_data_elements"]) {
      // Mark all Supplemental Data Elements as relevant
      markStatementRelevant(
        cqmMeasure.cql_libraries,
        statementRelevanceMap,
        cqmMeasure.main_cql_library,
        sde.statement_name,
        "TRUE"
      );
    }
  }

  for (const population of Object.keys(populationRelevance)) {
    // If the population is values, that means we need to mark relevance for the OBSERVs
    const relevance = populationRelevance[population];
    if (population === "observation_values") {
      for (const observation of populationSet["observations"]) {
        markStatementRelevant(
          cqmMeasure.cql_libraries,
          statementRelevanceMap,
          cqmMeasure.main_cql_library,
          observation.observation_function.statement_name,
          relevance
        );
      }
    } else {
      const relevantStatement =
        populationSet.populations[population].statement_name;
      markStatementRelevant(
        cqmMeasure.cql_libraries,
        statementRelevanceMap,
        cqmMeasure.main_cql_library,
        relevantStatement,
        relevance
      );
    }
  }
  return statementRelevanceMap;
}

/**
 * Recursive helper function for the buildStatementRelevanceMap function. This marks a statement as relevant (or not
 * relevant but applicable) in the `statement_relevance` map. It recurses and marks dependent statements also relevant
 * unless they have already been marked as 'TRUE' for their relevance statue. This function will never be called on
 * statements that are 'NA'.
 * @private
 * @param {object} cql_statement_dependencies - Dependency map from the measure object. The thing we recurse over
 *   even though it is flat, it represents a tree.
 * @param {object} statementRelevance - The `statement_relevance` map to mark.
 * @param {string} libraryName - The library name of the statement we are marking.
 * @param {string} statementName - The name of the statement we are marking.
 * @param {boolean} relevant - true if the statement should be marked 'TRUE', false if it should be marked 'FALSE'.
 */
function markStatementRelevant(
  cql_statement_dependencies,
  statementRelevance,
  libraryName,
  statementName,
  relevant
) {
  // only mark the statement if it is currently 'NA' or 'FALSE'. Otherwise it already has been marked 'TRUE'
  if (
    statementRelevance[libraryName][statementName] === "NA" ||
    statementRelevance[libraryName][statementName] === "FALSE"
  ) {
    statementRelevance[libraryName][statementName] = relevant
      ? "TRUE"
      : "FALSE";

    const result = [];
    for (const lib of cql_statement_dependencies) {
      for (const s of lib.statement_dependencies) {
        if (s.statement_name === statementName) {
          result.push(s);
        }
      }
    }

    for (const statement of result) {
      if (!statement.statement_references) {
        continue;
      }
      for (const dependentStatement of statement.statement_references) {
        markStatementRelevant(
          cql_statement_dependencies,
          statementRelevance,
          dependentStatement.library_name,
          dependentStatement.statement_name,
          relevant
        );
      }
    }
  }
}
