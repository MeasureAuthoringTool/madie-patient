import React from "react";
import { MadieAlert } from "@madie/madie-design-system/dist/react";
import "./StatusHandler.scss";

const StatusHandler = ({ error, errorMessages, testDataId }) => {
  {
    if (error) {
      if (errorMessages) {
        if (errorMessages.length === 1) {
          return (
            <MadieAlert
              data-testid="generic-error-text-header"
              type="error"
              content={
                <h3 aria-live="polite" role="alert" data-testid={testDataId}>
                  {errorMessages}
                </h3>
              }
              canClose={false}
            />
          );
        } else if (errorMessages.length > 1) {
          const mappedMessages = errorMessages.map(
            (em: string, index: number) => <ol key={index}>{em}</ol>
          );
          return (
            <MadieAlert
              type="error"
              content={
                <div aria-live="polite" role="alert" data-testid={testDataId}>
                  <h3>{errorMessages.length} errors were found</h3>
                  <ul data-testid="generic-fail-text-list">{mappedMessages}</ul>
                </div>
              }
              canClose={false}
            />
          );
        } else {
          return <div />;
        }
      }
    } else {
      return <div />;
    }
  }
};

export default StatusHandler;
