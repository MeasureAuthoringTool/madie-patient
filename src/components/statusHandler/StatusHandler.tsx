import React from "react";
import { MadieAlert } from "@madie/madie-design-system/dist/react";
import "./StatusHandler.scss";
import { TestCaseImportOutcome } from "@madie/madie-models";
import "twin.macro";
import "styled-components/macro";

interface StatusHandlerProps {
  error?: boolean;
  errorMessages?: Array<string>;
  testDataId?: string;
  importWarnings?: TestCaseImportOutcome[];
}

const StatusHandler = ({
  error,
  errorMessages,
  testDataId,
  importWarnings,
}: StatusHandlerProps) => {
  {
    if (error && errorMessages) {
      const withoutDuplicates = [...new Set(errorMessages)];

      if (withoutDuplicates.length === 1) {
        return (
          <div id="status-handler">
            <MadieAlert
              data-testid="generic-error-text-header"
              type="error"
              content={
                <h3 aria-live="polite" role="alert" data-testid={testDataId}>
                  {withoutDuplicates}
                </h3>
              }
              canClose={false}
            />
          </div>
        );
      } else if (withoutDuplicates.length > 1) {
        const mappedMessages = withoutDuplicates.map(
          (em: string, index: number) => <li key={index}>{em}</li>
        );
        return (
          <div id="status-handler">
            <MadieAlert
              type="error"
              content={
                <div aria-live="polite" role="alert" data-testid={testDataId}>
                  <h3>{withoutDuplicates.length} errors were found</h3>
                  <ul data-testid="generic-fail-text-list">{mappedMessages}</ul>
                </div>
              }
              canClose={false}
            />
          </div>
        );
      }
    }
    if (importWarnings && importWarnings.length > 0) {
      const failedImports = importWarnings.filter((warnings) => {
        if (!warnings.successful) return warnings;
      });
      const successfulImports = importWarnings.length - failedImports.length;

      const successfulImportsWithWarning = importWarnings.filter((warnings) => {
        if (warnings.successful && warnings.message) return warnings;
      });
      return (
        <div id="status-handler">
          <MadieAlert
            type="warning"
            content={
              <div aria-live="polite" role="alert" data-testid={testDataId}>
                <h6>
                  ({successfulImports}) test case(s) were imported. The
                  following ({failedImports.length}) test case(s) could not be
                  imported. Please ensure that your formatting is correct and
                  try again.
                </h6>
                <ul>
                  {failedImports.map((failedImport) => {
                    const family = failedImport?.familyName;
                    const given = failedImport?.givenNames?.toString();
                    const names =
                      family && given
                        ? `${family} ${given}`
                        : failedImport?.patientId;
                    return (
                      <li data-testid="failed-test-cases">
                        {names} <br />
                        <span tw="ml-4">Reason : {failedImport.message}</span>
                      </li>
                    );
                  })}
                </ul>
                {successfulImportsWithWarning?.length > 0 && (
                  <div>
                    <h6>
                      Following test case(s) were imported succesfully, but The
                      measure populations do not match the populations in the
                      import file. No expected values have been set.
                    </h6>
                    <ul>
                      {successfulImportsWithWarning.map(
                        (successfulImportWithWarning) => {
                          const family =
                            successfulImportWithWarning?.familyName;
                          const given =
                            successfulImportWithWarning?.givenNames?.toString();
                          const names =
                            family && given
                              ? `${family} ${given}`
                              : successfulImportWithWarning?.patientId;
                          return (
                            <li data-testid="success-imports-with-warnings">
                              {names}{" "}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                )}
              </div>
            }
            canClose={false}
          />
        </div>
      );
    }
    return <div />;
  }
};

export default StatusHandler;
