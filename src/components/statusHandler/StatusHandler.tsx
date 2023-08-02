import React from "react";
import { MadieAlert } from "@madie/madie-design-system/dist/react";
import "./StatusHandler.scss";
import { TestCaseImportOutcome } from "../../../../madie-models/src/TestCase";
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
          (em: string, index: number) => <ol key={index}>{em}</ol>
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
    // todo Rohit list is not bulleted
    if (importWarnings.length > 0) {
      const failedImports = importWarnings.filter((warnings) => {
        if (!warnings.successful) return warnings;
      });
      return (
        <div id="status-handler">
          <MadieAlert
            type="warning"
            content={
              <div aria-live="polite" role="alert" data-testid={testDataId}>
                <p>
                  ({importWarnings.length}) test cases were imported. The
                  following ({failedImports.length}) test case(s) could not be
                  imported. Please ensure that your formatting is correct and
                  try again.
                </p>
                <ul tw="list-disc">
                  {failedImports.map((failedImport) => {
                    return (
                      <li data-testid="generic-fail-text-list">
                        {failedImport.patientId} <br />
                        Reason : {failedImport.message}
                      </li>
                    );
                  })}
                </ul>
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
