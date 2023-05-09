import React, { useRef, useState } from "react";
import "styled-components/macro";
import { useDocumentTitle } from "@madie/madie-util";
import "../qiCore/EditTestCase.scss";
import { Button, Toast } from "@madie/madie-design-system/dist/react";
import qdmCalculationService from "../../../api/QdmCalculationService";

const EditTestCase = () => {
  useDocumentTitle("MADiE Edit Measure Edit Test Case");
  const qdmCalculation = useRef(qdmCalculationService());

  // Toast utilities
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("danger");
  const onToastClose = () => {
    setToastMessage("");
    setToastOpen(false);
  };

  const showToast = (
    message: string,
    toastType: "success" | "danger" | "warning"
  ) => {
    setToastOpen(true);
    setToastType(toastType);
    setToastMessage(message);
  };

  const calculateQdmTestCases = () => {
    try {
      const calculationResult = qdmCalculation.current.calculateQdmTestCases();
      calculationResult &&
        showToast(
          "Calculation was successful, output is printed in the console",
          "success"
        );
    } catch (error) {
      showToast("Error while calculating QDM test cases", "danger");
    }
  };

  return (
    <>
      <Button
        tw="m-2"
        variant="cyan"
        type="submit"
        data-testid="qdm-test-case-run-button"
        onClick={calculateQdmTestCases}
      >
        QDM Run Execution
      </Button>
      <Toast
        toastKey="edit-action-toast"
        aria-live="polite"
        toastType={toastType}
        testId={toastType === "danger" ? "error-toast" : "success-toast"}
        closeButtonProps={{
          "data-testid": "close-toast-button",
        }}
        open={toastOpen}
        message={toastMessage}
        onClose={onToastClose}
        autoHideDuration={10000}
      />
    </>
  );
};

export default EditTestCase;
