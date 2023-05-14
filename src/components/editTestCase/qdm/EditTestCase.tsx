import React, { useEffect, useRef, useCallback, useState } from "react";
import { useDocumentTitle } from "@madie/madie-util";
import { TestCase } from "@madie/madie-models";
import "../qiCore/EditTestCase.scss";
import { Button, Toast } from "@madie/madie-design-system/dist/react";
import qdmCalculationService from "../../../api/QdmCalculationService";
import { Allotment } from "allotment";
import RightPanel from "./RightPanel/RightPanel";
import LeftPanel from "./LeftPanel/LeftPanel";
import EditTestCaseBreadCrumbs from "./EditTestCaseBreadCrumbs";
import { useParams } from "react-router-dom";
import useTestCaseServiceApi from "../../../api/useTestCaseServiceApi";
import "allotment/dist/style.css";
import "./EditTestCase.scss";

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

  const testCaseService = useRef(useTestCaseServiceApi());
  const [currentTestCase, setCurrentTestCase] = useState<TestCase>(null);
  const { measureId, id } = useParams();
  const retrieveTestCases = useCallback(() => {
    testCaseService.current
      .getTestCasesByMeasureId(measureId)
      .then((testCaseList: TestCase[]) => {
        const currentTestCase = testCaseList.find((el) => el.id === id);
        setCurrentTestCase(currentTestCase);
      });
    // to implement later
    // .catch((err) => {
    //   // setErrors((prevState) => [...prevState, err.message]); // may need to be implemented later
    // })
    // .finally(() => {
    //   // setLoadingState({ loading: false, message: "" });
    // });
  }, [measureId, id, testCaseService]);
  useEffect(() => {
    if (measureId && id) {
      retrieveTestCases();
    }
  }, [testCaseService, measureId, id]);
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
      <EditTestCaseBreadCrumbs
        testCaseTitle={currentTestCase?.title}
        testCaseId={currentTestCase?.id}
        measureId={measureId}
      />
      <form id="edit-test-case-qdm">
        <div className="allotment-wrapper">
          <Allotment
            proportionalLayout={true}
            separator={true}
            vertical={false}
          >
            <Allotment.Pane>
              <LeftPanel />
            </Allotment.Pane>
            <Allotment.Pane>
              <RightPanel />
            </Allotment.Pane>
          </Allotment>
        </div>

        <div className="bottom-row">
          {/* shows up in some mockups. leaving for later */}
          {/* <Button variant="outline-filled">Import</Button> */}
          <div className="spacer" />
          <Button
            variant="primary"
            data-testid="qdm-test-case-run-button"
            onClick={calculateQdmTestCases}
          >
            Run Test
          </Button>
          <Button variant="cyan">Save</Button>
          <Button variant="outline-filled">
            {/* variant="outline-filled" */}
            Discard Changes
          </Button>
        </div>
        {/* outside flow of page */}
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
      </form>
    </>
  );
};

export default EditTestCase;
