import React from "react";
import { MadieAlert } from "@madie/madie-design-system/dist/react";
import "./StatusHandler.scss";

const StatusHandler = ({ error, errorMessage, testDataId }) => {
  {
    if (error) {
      if (errorMessage) {
        return (
          <MadieAlert
            data-testid="generic-error-text-header"
            type="error"
            content={
              <h3 aria-live="polite" role="alert" data-testid={testDataId}>
                {errorMessage}
              </h3>
            }
            canClose={false}
          />
        );
      }
    }
  }
};

export default StatusHandler;
