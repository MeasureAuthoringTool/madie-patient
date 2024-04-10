import React from "react";
import parse from "html-react-parser";
import "twin.macro";
import "styled-components/macro";
import { isEmpty } from "lodash";
import { DetailedPopulationGroupResult } from "fqm-execution/build/types/Calculator";
import { MadieAlert } from "@madie/madie-design-system/dist/react";
import { GroupPopulation, PopulationType } from "@madie/madie-models";
import { useFeatureFlags } from "@madie/madie-util";
import { Relevance } from "fqm-execution";
import QiCoreGroupCoverage, {
  CqlDefinitionCallstack,
} from "../../groupCoverage/QiCoreGroupCoverage";

type ErrorProps = {
  status?: "success" | "warning" | "error" | "info" | "meta";
  message?: string;
};

type CalculationResultType = {
  calculationResults: DetailedPopulationGroupResult[];
  calculationErrors: ErrorProps;
  groupPopulations: GroupPopulation[];
  cqlDefinitionCallstack?: CqlDefinitionCallstack;
  mainCqlLibraryName: string;
};

export interface MappedCalculationResults {
  [groupId: string]: {
    statementResults: {
      [statementName: string]: {
        isFunction: boolean;
        relevance: Relevance;
        statementLevelHTML?: string | undefined;
        pretty?: string;
      };
    }[];
    populationRelevance: {
      [criteriaExpression: string]: {
        populationId: string;
        populationType: PopulationType;
        result: boolean;
      };
    }[];
  };
}

export const mapCalculationResults = (
  calculationResult,
  mainCqlLibraryName: string
) => {
  if (calculationResult) {
    const mapCalculationResults = calculationResult.reduce((output, item) => {
      const { groupId, statementResults, populationRelevance } = item;
      output[groupId] = {
        statementResults: statementResults.reduce(
          (
            statementResultsOutput,
            {
              isFunction,
              relevance,
              statementLevelHTML,
              statementName,
              pretty,
              localId,
              libraryName,
            }
          ) => {
            if (statementResultsOutput[statementName]) {
              if (libraryName === mainCqlLibraryName) {
                statementResultsOutput[statementName] = {
                  isFunction,
                  relevance,
                  statementLevelHTML,
                  pretty,
                };
              }
            } else {
              statementResultsOutput[statementName] = {
                isFunction,
                relevance,
                statementLevelHTML,
                pretty,
              };
            }
            return statementResultsOutput;
          },
          {}
        ),
        populationRelevance: populationRelevance?.reduce(
          (
            populationRelevanceOutput,
            { criteriaExpression, populationId, populationType, result }
          ) => {
            populationRelevanceOutput[criteriaExpression] = {
              populationId,
              populationType,
              result,
            };
            return populationRelevanceOutput;
          },
          {}
        ),
      };

      return output;
    }, {});
    return mapCalculationResults;
  }
};

const CalculationResults = ({
  calculationResults,
  calculationErrors,
  groupPopulations,
  cqlDefinitionCallstack = {},
  mainCqlLibraryName,
}: CalculationResultType) => {
  // template for group name coming from execution engine
  const originalGroupName = (name) => {
    return `<h2>Population Group: ${name}</h2>`;
  };
  const featureFlags = useFeatureFlags();
  // We wanted to have our own group name. This is the template for group name
  const updatedGroupName = (name) => {
    return `<br/><h4>Population Criteria ${name}</h4>`;
  };

  const coverageHtmls = calculationResults?.map((result, index) =>
    result.html.replace(
      originalGroupName(result.groupId),
      updatedGroupName(index + 1)
    )
  );

  return (
    <div tw="p-5" style={{ paddingRight: ".25rem" }}>
      {!calculationResults && !calculationErrors && (
        <MadieAlert
          type="info"
          content="To see the logic highlights, click 'Run Test'"
          canClose={false}
          alertProps={{
            "data-testid": "calculation-info-alert",
          }}
        />
      )}
      {calculationErrors && (
        <MadieAlert
          type={calculationErrors.status}
          content={calculationErrors.message}
          canClose={false}
          alertProps={{
            "data-testid": "calculation-error-alert",
          }}
        />
      )}
      {!isEmpty(groupPopulations) && (
        <QiCoreGroupCoverage
          groupPopulations={groupPopulations}
          mappedCalculationResults={mapCalculationResults(
            calculationResults,
            mainCqlLibraryName
          )}
          cqlDefinitionCallstack={cqlDefinitionCallstack}
        />
      )}
    </div>
  );
};

export default CalculationResults;
