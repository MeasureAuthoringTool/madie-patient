import React from "react";
import { MadieAlert } from "@madie/madie-design-system/dist/react";
import "./StatusHandler.scss";

const StatusHandler = ({ error, errorMessages, testDataId }) => {
  {
    if (error && errorMessages) {
      const withoutDuplicates = [...new Set(errorMessages)];

      if (withoutDuplicates.length === 1) {
        return (
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
        );
      } else if (withoutDuplicates.length > 1) {
        const mappedMessages = withoutDuplicates.map(
          (em: string, index: number) => <ol key={index}>{em}</ol>
        );
        return (
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
        );
      }
    }
    return <div />;
  }
};

export default StatusHandler;
